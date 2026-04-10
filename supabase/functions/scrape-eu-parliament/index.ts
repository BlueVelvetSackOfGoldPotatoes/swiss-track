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
  let limit = 10;
  try {
    const body = await req.json();
    offset = body.offset || 0;
    limit = Math.min(body.limit || 10, 20);
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
    // Use JSON format (much smaller than JSON-LD)
    const url = `${EU_API}/meps/show-current?format=application%2Fld%2Bjson&offset=${offset}&limit=${limit}`;
    console.log(`Fetching MEPs: offset=${offset} limit=${limit}`);
    
    const mepsRes = await fetch(url, {
      headers: { Accept: "application/ld+json" },
      signal: AbortSignal.timeout(40000),
    });

    if (!mepsRes.ok) {
      throw new Error(`EU API returned ${mepsRes.status}`);
    }

    const mepsData = await mepsRes.json();
    const mepRefs = mepsData?.data || mepsData?.["hydra:member"] || [];
    recordsFetched = mepRefs.length;
    console.log(`Got ${mepRefs.length} MEP references`);

    for (const ref of mepRefs) {
      const externalId = ref.identifier || ref.notation || ref["@id"]?.split("/").pop();
      if (!externalId) continue;

      let name = ref.label || ref.prefLabel || "";
      if (!name && (ref.givenName || ref.familyName)) {
        name = `${ref.givenName || ""} ${ref.familyName || ""}`.trim();
      }
      if (!name) name = `MEP ${externalId}`;

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

    return new Response(JSON.stringify({
      success: true,
      meps_found: recordsFetched,
      created: recordsCreated,
      updated: recordsUpdated,
      next_offset: mepRefs.length === limit ? offset + limit : null,
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
