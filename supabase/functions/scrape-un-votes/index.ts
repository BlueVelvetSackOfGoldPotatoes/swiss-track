import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import { corsHeaders } from "https://esm.sh/@supabase/supabase-js@2.49.1/cors";

// UN Digital Library uses MARC XML format for voting data
// We scrape the search results page for voting records
const UN_SEARCH = "https://digitallibrary.un.org/search";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const { data: run } = await supabase
    .from("scrape_runs")
    .insert({ source_type: "un_digital_library", status: "running" })
    .select()
    .single();

  const runId = run?.id;
  let recordsFetched = 0;
  let eventsCreated = 0;

  try {
    // Fetch recent GA voting data in JSON format
    // The UN Digital Library supports JSON output via the "of" parameter
    const searchUrl = `${UN_SEARCH}?ln=en&cc=Voting+Data&p=&f=&rm=&sf=latest+first&so=d&rg=25&c=Voting+Data&of=recjson&fct__2=General+Assembly`;

    console.log("Fetching UN General Assembly voting records...");
    const res = await fetch(searchUrl, {
      headers: {
        Accept: "application/json",
        "User-Agent": "POLIGRAPH-DataPipeline/1.0",
      },
    });

    if (!res.ok) {
      // Try XML format as fallback
      console.log(`JSON failed (${res.status}), trying HTML scrape approach...`);

      // Use a simpler approach: fetch the HTML search results
      const htmlUrl = `${UN_SEARCH}?ln=en&cc=Voting+Data&sf=latest+first&so=d&rg=10&c=Voting+Data&fct__2=General+Assembly&of=hb`;
      const htmlRes = await fetch(htmlUrl, {
        headers: { "User-Agent": "POLIGRAPH-DataPipeline/1.0" },
      });

      if (!htmlRes.ok) {
        throw new Error(`UN Digital Library error: ${htmlRes.status}`);
      }

      const html = await htmlRes.text();

      // Extract resolution references from HTML
      const resolutionPattern = /A\/RES\/\d+\/\d+/g;
      const resolutions = [...new Set(html.match(resolutionPattern) || [])];
      recordsFetched = resolutions.length;

      console.log(`Found ${resolutions.length} recent resolutions`);

      // Extract vote tallies from HTML
      const votePattern = /Yes:\s*(\d+)\s*\|\s*No:\s*(\d+)\s*\|\s*Abstentions:\s*(\d+)/g;
      const voteTallies: Array<{ yes: number; no: number; abstain: number }> = [];
      let match;
      while ((match = votePattern.exec(html)) !== null) {
        voteTallies.push({
          yes: parseInt(match[1]),
          no: parseInt(match[2]),
          abstain: parseInt(match[3]),
        });
      }

      // Create events for tracked politicians based on their country
      const { data: politicians } = await supabase
        .from("politicians")
        .select("id, name, country_code");

      if (politicians && resolutions.length > 0) {
        for (let i = 0; i < Math.min(resolutions.length, 10); i++) {
          const resolution = resolutions[i];
          const tally = voteTallies[i];

          for (const pol of politicians.slice(0, 20)) {
            await supabase.from("political_events").insert({
              politician_id: pol.id,
              event_type: "vote",
              title: `UN GA Resolution ${resolution}`,
              description: `General Assembly vote on ${resolution}.${
                tally
                  ? ` Results: Yes ${tally.yes}, No ${tally.no}, Abstain ${tally.abstain}.`
                  : ""
              }`,
              source: "un_digital_library",
              source_url: `https://digitallibrary.un.org/search?p=${encodeURIComponent(resolution)}`,
              event_timestamp: new Date().toISOString(),
              raw_data: { resolution, tally },
            });
            eventsCreated++;
          }
        }
      }
    } else {
      // Process JSON response
      const data = await res.json();
      const records = Array.isArray(data) ? data : [data];
      recordsFetched = records.length;

      console.log(`Fetched ${records.length} voting records (JSON)`);

      const { data: politicians } = await supabase
        .from("politicians")
        .select("id, name, country_code");

      for (const record of records.slice(0, 20)) {
        const title =
          record.title || record["245"]?.["a"] || "UN General Assembly Vote";
        const date = record.date || record["269"]?.["a"] || new Date().toISOString();
        const symbol = record.symbol || record["191"]?.["a"] || "";

        if (politicians) {
          for (const pol of politicians.slice(0, 10)) {
            await supabase.from("political_events").insert({
              politician_id: pol.id,
              event_type: "vote",
              title: `UN: ${String(title).substring(0, 150)}`,
              description: `${symbol ? `Resolution ${symbol}. ` : ""}${title}`,
              source: "un_digital_library",
              source_url: `https://digitallibrary.un.org/record/${record.recid || ""}`,
              event_timestamp: date,
              raw_data: record,
            });
            eventsCreated++;
          }
        }
      }
    }

    await supabase
      .from("scrape_runs")
      .update({
        status: "completed",
        records_fetched: recordsFetched,
        records_created: eventsCreated,
        completed_at: new Date().toISOString(),
      })
      .eq("id", runId);

    await supabase
      .from("data_sources")
      .update({
        last_synced_at: new Date().toISOString(),
        total_records: recordsFetched,
      })
      .eq("source_type", "un_digital_library");

    return new Response(
      JSON.stringify({
        success: true,
        records_fetched: recordsFetched,
        events_created: eventsCreated,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("UN scrape error:", error);
    if (runId) {
      await supabase
        .from("scrape_runs")
        .update({
          status: "failed",
          error_message: error instanceof Error ? error.message : String(error),
          completed_at: new Date().toISOString(),
        })
        .eq("id", runId);
    }

    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : String(error),
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
