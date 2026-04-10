import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const EU_API = "https://data.europarl.europa.eu/api/v2";
const FETCH_TIMEOUT = 25000; // 25s timeout per external request

function fetchWithTimeout(url: string, options: RequestInit = {}, timeoutMs = FETCH_TIMEOUT): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  return fetch(url, { ...options, signal: controller.signal }).finally(() => clearTimeout(timer));
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  let offset = 0;
  let limit = 20;
  let enrichDetails = true;
  try {
    const body = await req.json();
    offset = body.offset || 0;
    limit = Math.min(body.limit || 20, 50);
    enrichDetails = body.enrichDetails !== false;
  } catch { /* defaults */ }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const { data: run } = await supabase
    .from("scrape_runs")
    .insert({ source_type: "eu_parliament", status: "running" })
    .select()
    .single();
  const runId = run?.id;
  let recordsFetched = 0;
  let recordsCreated = 0;
  let recordsUpdated = 0;

  try {
    // Step 1: Fetch MEP list with pagination
    console.log(`Fetching MEPs offset=${offset} limit=${limit}...`);
    const mepsRes = await fetchWithTimeout(
      `${EU_API}/meps/show-current?format=application%2Fld%2Bjson&offset=${offset}&limit=${limit}`,
      { headers: { Accept: "application/ld+json" } }
    );

    if (!mepsRes.ok) {
      throw new Error(`EU API error: ${mepsRes.status}`);
    }

    const mepsData = await mepsRes.json();
    const mepRefs = mepsData?.data || mepsData?.["hydra:member"] || [];
    recordsFetched = mepRefs.length;
    console.log(`Got ${mepRefs.length} MEP refs`);

    // Step 2: Upsert each MEP from list data (fast, no individual API calls)
    for (const ref of mepRefs) {
      const externalId = ref.identifier || ref.notation || ref["@id"]?.split("/").pop();
      if (!externalId) continue;

      // Try multiple name fields
      let name = ref.label || ref.prefLabel || "";
      if (!name && (ref.givenName || ref.familyName)) {
        name = `${ref.givenName || ""} ${ref.familyName || ""}`.trim();
      }
      if (!name) name = `MEP ${externalId}`;

      // Extract country code from URI or direct field
      let countryCode = "";
      const countryField = ref.countryOfRepresentation || ref.country_of_representation || "";
      if (typeof countryField === "string" && countryField.includes("/")) {
        countryCode = countryField.split("/").pop() || "";
      } else if (typeof countryField === "string") {
        countryCode = countryField;
      }

      const { data: existing } = await supabase
        .from("politicians")
        .select("id")
        .eq("external_id", String(externalId))
        .maybeSingle();

      const record = {
        external_id: String(externalId),
        name,
        country_code: countryCode || "EU",
        country_name: countryCode || "European Union",
        role: "Member of European Parliament",
        jurisdiction: "eu",
        continent: "Europe",
        data_source: "eu_parliament" as const,
        source_url: `https://www.europarl.europa.eu/meps/en/${externalId}`,
        photo_url: ref.img || ref.image || null,
      };

      if (existing) {
        await supabase.from("politicians").update(record).eq("id", existing.id);
        recordsUpdated++;
      } else {
        await supabase.from("politicians").insert(record);
        recordsCreated++;
      }
    }

    // Step 3: Enrich a small batch of MEPs that lack party info (optional)
    if (enrichDetails) {
      const { data: mepsNeedingDetails } = await supabase
        .from("politicians")
        .select("id, external_id")
        .eq("data_source", "eu_parliament")
        .is("party_name", null)
        .limit(5);

      if (mepsNeedingDetails && mepsNeedingDetails.length > 0) {
        console.log(`Enriching ${mepsNeedingDetails.length} MEPs with details...`);
        for (const mep of mepsNeedingDetails) {
          try {
            const detailRes = await fetchWithTimeout(
              `${EU_API}/meps/${mep.external_id}?format=application%2Fld%2Bjson`,
              { headers: { Accept: "application/ld+json" } },
              10000 // 10s per detail request
            );
            if (!detailRes.ok) continue;
            const detail = await detailRes.json();
            const d = detail.data || detail;

            const memberships = Array.isArray(d.hasMembership)
              ? d.hasMembership
              : d.hasMembership ? [d.hasMembership] : [];
            const partyMembership = memberships.find(
              (m: any) => m.organization?.classification === "POLITICAL_GROUP"
            );
            const committees = memberships
              .filter((m: any) => m.organization?.classification === "COMMITTEE")
              .map((m: any) => m.organization?.prefLabel || m.organization?.label)
              .filter(Boolean);

            const twitterAccount = Array.isArray(d.account)
              ? d.account.find((a: any) => a.accountServiceHomepage?.includes("twitter"))
              : null;

            await supabase.from("politicians").update({
              party_name: partyMembership?.organization?.prefLabel
                || partyMembership?.organization?.label || null,
              committees: committees.length > 0 ? committees : undefined,
              photo_url: d.img || d.image || undefined,
              twitter_handle: twitterAccount?.accountName || undefined,
            }).eq("id", mep.id);
          } catch (e) {
            console.error(`Detail fetch failed for ${mep.external_id}:`, e);
          }
          await new Promise(r => setTimeout(r, 200));
        }
      }
    }

    // Finalize
    await supabase.from("scrape_runs").update({
      status: "completed",
      records_fetched: recordsFetched,
      records_created: recordsCreated,
      records_updated: recordsUpdated,
      completed_at: new Date().toISOString(),
    }).eq("id", runId);

    await supabase.from("data_sources").update({
      last_synced_at: new Date().toISOString(),
      total_records: recordsFetched,
    }).eq("source_type", "eu_parliament");

    const hasMore = mepRefs.length === limit;

    return new Response(JSON.stringify({
      success: true,
      meps_found: recordsFetched,
      created: recordsCreated,
      updated: recordsUpdated,
      next_offset: hasMore ? offset + limit : null,
      has_more: hasMore,
    }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });

  } catch (error) {
    console.error("Scrape error:", error);
    if (runId) {
      await supabase.from("scrape_runs").update({
        status: "failed",
        error_message: error instanceof Error ? error.message : String(error),
        completed_at: new Date().toISOString(),
      }).eq("id", runId);
    }
    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : String(error),
    }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
