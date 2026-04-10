import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const EU_API = "https://data.europarl.europa.eu/api/v2";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  let offset = 0;
  let limit = 50;
  let fetchVotes = false;
  try {
    const body = await req.json();
    offset = body.offset || 0;
    limit = Math.min(body.limit || 50, 100);
    fetchVotes = body.fetchVotes || false;
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
    // Fetch MEPs list with offset/limit - use simpler JSON format
    console.log(`Fetching MEPs offset=${offset} limit=${limit}...`);
    const mepsRes = await fetch(
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

    // Process each MEP from the list data (without individual API calls for speed)
    for (const ref of mepRefs) {
      const externalId = ref.identifier || ref.notation || ref["@id"]?.split("/").pop();
      if (!externalId) continue;

      const name = ref.label || ref.prefLabel || ref.givenName
        ? `${ref.givenName || ""} ${ref.familyName || ""}`.trim()
        : `MEP ${externalId}`;

      const countryCode = (
        ref.countryOfRepresentation ||
        ref.hasOwnProperty("country_of_representation")
          ? ref.country_of_representation
          : ""
      )?.toString().split("/").pop() || "";

      const { data: existing } = await supabase
        .from("politicians")
        .select("id")
        .eq("external_id", String(externalId))
        .maybeSingle();

      const record = {
        external_id: String(externalId),
        name: name || `MEP ${externalId}`,
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

    // Now fetch individual details for a smaller batch (10 at a time) to get party/committee info
    const { data: mepsNeedingDetails } = await supabase
      .from("politicians")
      .select("id, external_id")
      .eq("data_source", "eu_parliament")
      .is("party_name", null)
      .limit(10);

    if (mepsNeedingDetails) {
      console.log(`Fetching details for ${mepsNeedingDetails.length} MEPs...`);
      for (const mep of mepsNeedingDetails) {
        try {
          const detailRes = await fetch(
            `${EU_API}/meps/${mep.external_id}?format=application%2Fld%2Bjson`,
            { headers: { Accept: "application/ld+json" } }
          );
          if (!detailRes.ok) continue;
          const detail = await detailRes.json();
          const d = detail.data || detail;

          const memberships = Array.isArray(d.hasMembership) ? d.hasMembership : d.hasMembership ? [d.hasMembership] : [];
          const partyMembership = memberships.find((m: any) => m.organization?.classification === "POLITICAL_GROUP");
          const committees = memberships
            .filter((m: any) => m.organization?.classification === "COMMITTEE")
            .map((m: any) => m.organization?.prefLabel || m.organization?.label)
            .filter(Boolean);

          await supabase.from("politicians").update({
            party_name: partyMembership?.organization?.prefLabel || partyMembership?.organization?.label || null,
            committees: committees.length > 0 ? committees : undefined,
            photo_url: d.img || d.image || undefined,
            twitter_handle: d.account?.find?.((a: any) => a.accountServiceHomepage?.includes("twitter"))?.accountName || undefined,
          }).eq("id", mep.id);

        } catch (e) {
          console.error(`Detail fetch failed for ${mep.external_id}:`, e);
        }
        await new Promise(r => setTimeout(r, 300));
      }
    }

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
