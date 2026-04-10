import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Country name to ISO code mapping for EU member states
const COUNTRY_CODES: Record<string, string> = {
  "Austria": "AT", "Belgium": "BE", "Bulgaria": "BG", "Croatia": "HR",
  "Cyprus": "CY", "Czech Republic": "CZ", "Czechia": "CZ",
  "Denmark": "DK", "Estonia": "EE", "Finland": "FI", "France": "FR",
  "Germany": "DE", "Greece": "GR", "Hungary": "HU", "Ireland": "IE",
  "Italy": "IT", "Latvia": "LV", "Lithuania": "LT", "Luxembourg": "LU",
  "Malta": "MT", "Netherlands": "NL", "Poland": "PL", "Portugal": "PT",
  "Romania": "RO", "Slovakia": "SK", "Slovenia": "SI", "Spain": "ES",
  "Sweden": "SE",
};

interface MepEntry {
  fullName: string;
  country: string;
  politicalGroup: string;
  nationalPoliticalGroup: string;
  id: string;
}

function parseXmlMeps(xml: string): MepEntry[] {
  const meps: MepEntry[] = [];
  const mepBlocks = xml.split("</mep>");

  for (const block of mepBlocks) {
    const fullName = block.match(/<fullName>(.*?)<\/fullName>/)?.[1];
    const country = block.match(/<country>(.*?)<\/country>/)?.[1];
    const politicalGroup = block.match(/<politicalGroup>(.*?)<\/politicalGroup>/)?.[1];
    const nationalPoliticalGroup = block.match(/<nationalPoliticalGroup>(.*?)<\/nationalPoliticalGroup>/)?.[1];
    const id = block.match(/<id>(.*?)<\/id>/)?.[1];

    if (fullName && id) {
      meps.push({ fullName, country: country || "", politicalGroup: politicalGroup || "", nationalPoliticalGroup: nationalPoliticalGroup || "", id });
    }
  }
  return meps;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  let offset = 0;
  let batchSize = 100;
  try {
    const body = await req.json();
    offset = body.offset || 0;
    batchSize = Math.min(body.batchSize || 100, 200);
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

  try {
    // Fast XML endpoint — returns all 718 current MEPs in ~0.1s
    console.log("Fetching current MEPs from EP XML directory...");
    const res = await fetch("https://www.europarl.europa.eu/meps/en/full-list/xml", {
      signal: AbortSignal.timeout(15000),
    });

    if (!res.ok) throw new Error(`EP XML endpoint returned ${res.status}`);

    const xml = await res.text();
    const allMeps = parseXmlMeps(xml);
    console.log(`Parsed ${allMeps.length} MEPs from XML`);

    // Process a batch (to stay within edge function time limits)
    const batch = allMeps.slice(offset, offset + batchSize);
    let created = 0, updated = 0;

    for (const mep of batch) {
      const countryCode = COUNTRY_CODES[mep.country] || "EU";

      const { data: existing } = await supabase
        .from("politicians")
        .select("id")
        .eq("external_id", mep.id)
        .maybeSingle();

      const record = {
        external_id: mep.id,
        name: mep.fullName,
        country_code: countryCode,
        country_name: mep.country || "European Union",
        role: "Member of European Parliament",
        jurisdiction: "eu",
        continent: "Europe",
        party_name: mep.politicalGroup || null,
        party_abbreviation: mep.nationalPoliticalGroup || null,
        data_source: "eu_parliament" as const,
        source_url: `https://www.europarl.europa.eu/meps/en/${mep.id}`,
        photo_url: `https://www.europarl.europa.eu/mepphoto/${mep.id}.jpg`,
      };

      if (existing) {
        await supabase.from("politicians").update(record).eq("id", existing.id);
        updated++;
      } else {
        await supabase.from("politicians").insert(record);
        created++;
      }
    }

    const hasMore = offset + batchSize < allMeps.length;

    await supabase.from("scrape_runs").update({
      status: "completed",
      records_fetched: allMeps.length,
      records_created: created,
      records_updated: updated,
      completed_at: new Date().toISOString(),
    }).eq("id", runId);

    await supabase.from("data_sources").update({
      last_synced_at: new Date().toISOString(),
      total_records: allMeps.length,
    }).eq("source_type", "eu_parliament");

    // Auto-trigger Wikipedia enrichment for newly created politicians
    if (created > 0) {
      try {
        const enrichUrl = `${Deno.env.get("SUPABASE_URL")}/functions/v1/enrich-wikipedia`;
        await fetch(enrichUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")}`,
          },
          body: JSON.stringify({ batchSize: Math.min(created, 15) }),
          signal: AbortSignal.timeout(25000),
        });
        console.log(`Triggered Wikipedia enrichment for ${created} new politicians`);
      } catch (e) {
        console.log("Wikipedia enrichment trigger failed (non-blocking):", e);
      }
    }

    return new Response(JSON.stringify({
      success: true,
      total_meps: allMeps.length,
      batch_processed: batch.length,
      created,
      updated,
      next_offset: hasMore ? offset + batchSize : null,
      has_more: hasMore,
      enrichment_triggered: created > 0,
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
