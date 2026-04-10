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

  // Parse request body for pagination
  let offset = 0;
  let limit = 50;
  try {
    const body = await req.json();
    offset = body.offset || 0;
    limit = Math.min(body.limit || 50, 100);
  } catch { /* no body = defaults */ }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  // Create scrape run
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
    // Step 1: Fetch current MEPs
    console.log("Fetching current MEPs...");
    const mepsRes = await fetch(
      `${EU_API}/meps/show-current?format=application%2Fld%2Bjson&offset=0`,
      { headers: { Accept: "application/ld+json" } }
    );

    if (!mepsRes.ok) {
      throw new Error(`EU API MEPs error: ${mepsRes.status} ${await mepsRes.text()}`);
    }

    const mepsData = await mepsRes.json();
    const mepRefs = mepsData?.data || mepsData?.["hydra:member"] || [];
    recordsFetched = mepRefs.length;
    console.log(`Found ${mepRefs.length} MEP references`);

    // Step 2: Fetch individual MEP details (batch of 20 to respect rate limits)
    const batchSize = 20;
    const mepIds: string[] = [];

    for (const ref of mepRefs) {
      const id = ref.identifier || ref["@id"]?.split("/").pop();
      if (id) mepIds.push(id);
    }

    // Apply offset/limit pagination
    const paginatedIds = mepIds.slice(offset, offset + limit);
    console.log(`Processing MEPs ${offset}-${offset + paginatedIds.length} of ${mepIds.length} (batch size ${batchSize})`);

    for (let i = 0; i < paginatedIds.length; i += batchSize) {
      const batch = paginatedIds.slice(i, i + batchSize);

      const results = await Promise.all(
        batch.map(async (mepId) => {
          try {
            const res = await fetch(
              `${EU_API}/meps/${mepId}?format=application%2Fld%2Bjson`,
              { headers: { Accept: "application/ld+json" } }
            );
            if (!res.ok) return null;
            return await res.json();
          } catch {
            return null;
          }
        })
      );

      for (const mep of results) {
        if (!mep) continue;

        const data = mep.data || mep;
        const name =
          data.label ||
          [data.givenName, data.familyName].filter(Boolean).join(" ") ||
          "Unknown";

        const countryCode =
          data.countryOfRepresentation?.replace(
            "http://publications.europa.eu/resource/authority/country/",
            ""
          ) || "";

        const partyName = data.politicalGroup?.label || data.politicalGroup || null;

        // Extract membership info
        const memberships = Array.isArray(data.hasMembership)
          ? data.hasMembership
          : data.hasMembership
          ? [data.hasMembership]
          : [];

        const committees = memberships
          .filter(
            (m: any) =>
              m.organization?.classification === "COMMITTEE" ||
              m.role === "MEMBER"
          )
          .map((m: any) => m.organization?.label || m.organization)
          .filter(Boolean)
          .slice(0, 10);

        const externalId = data.identifier || data.notation || mepIds[0];

        // Upsert politician
        const { data: existing } = await supabase
          .from("politicians")
          .select("id")
          .eq("external_id", String(externalId))
          .maybeSingle();

        if (existing) {
          await supabase
            .from("politicians")
            .update({
              name,
              country_code: countryCode,
              country_name: countryCode,
              party_name: partyName,
              role: "Member of European Parliament",
              jurisdiction: "eu",
              continent: "Europe",
              committees: committees.length > 0 ? committees : undefined,
              data_source: "eu_parliament",
              source_url: `https://www.europarl.europa.eu/meps/en/${externalId}`,
              photo_url: data.img || null,
            })
            .eq("id", existing.id);
          recordsUpdated++;
        } else {
          await supabase.from("politicians").insert({
            external_id: String(externalId),
            name,
            country_code: countryCode,
            country_name: countryCode,
            party_name: partyName,
            role: "Member of European Parliament",
            jurisdiction: "eu",
            continent: "Europe",
            committees: committees.length > 0 ? committees : [],
            data_source: "eu_parliament",
            source_url: `https://www.europarl.europa.eu/meps/en/${externalId}`,
            photo_url: data.img || null,
          });
          recordsCreated++;
        }
      }

      // Rate limit pause between batches
      if (i + batchSize < mepIds.length) {
        await new Promise((r) => setTimeout(r, 1000));
      }
    }

    // Step 3: Fetch recent plenary vote results
    console.log("Fetching recent meetings for vote results...");
    const meetingsRes = await fetch(
      `${EU_API}/meetings?format=application%2Fld%2Bjson&offset=0&limit=5&year=2024`,
      { headers: { Accept: "application/ld+json" } }
    );

    if (meetingsRes.ok) {
      const meetingsData = await meetingsRes.json();
      const meetings = meetingsData?.data || meetingsData?.["hydra:member"] || [];
      console.log(`Found ${meetings.length} recent meetings`);

      for (const meeting of meetings.slice(0, 3)) {
        const meetingId =
          meeting.identifier || meeting["@id"]?.split("/").pop();
        if (!meetingId) continue;

        try {
          const voteRes = await fetch(
            `${EU_API}/meetings/${meetingId}/vote-results?format=application%2Fld%2Bjson`,
            { headers: { Accept: "application/ld+json" } }
          );

          if (voteRes.ok) {
            const voteData = await voteRes.json();
            const votes = voteData?.data || voteData?.["hydra:member"] || [];
            console.log(
              `Meeting ${meetingId}: ${votes.length} vote results`
            );

            for (const vote of votes.slice(0, 20)) {
              const title = vote.label || vote.title || "Plenary vote";
              const desc =
                vote.description || `Vote in plenary meeting ${meetingId}`;

              // Get all politicians to link events
              const { data: allPols } = await supabase
                .from("politicians")
                .select("id")
                .eq("data_source", "eu_parliament")
                .limit(5);

              if (allPols) {
                for (const pol of allPols) {
                  await supabase.from("political_events").insert({
                    politician_id: pol.id,
                    event_type: "vote",
                    title: `EP Vote: ${title}`.substring(0, 200),
                    description: desc?.substring(0, 500),
                    source: "eu_parliament",
                    source_url: `https://www.europarl.europa.eu/plenary/en/votes.html`,
                    event_timestamp:
                      vote.date || meeting.date || new Date().toISOString(),
                    raw_data: vote,
                  });
                }
              }
            }
          }
        } catch (e) {
          console.error(`Error fetching votes for meeting ${meetingId}:`, e);
        }

        await new Promise((r) => setTimeout(r, 500));
      }
    }

    // Update scrape run
    await supabase
      .from("scrape_runs")
      .update({
        status: "completed",
        records_fetched: recordsFetched,
        records_created: recordsCreated,
        records_updated: recordsUpdated,
        completed_at: new Date().toISOString(),
      })
      .eq("id", runId);

    // Update data source
    await supabase
      .from("data_sources")
      .update({
        last_synced_at: new Date().toISOString(),
        total_records: recordsFetched,
      })
      .eq("source_type", "eu_parliament");

    return new Response(
      JSON.stringify({
        success: true,
        meps_found: recordsFetched,
        created: recordsCreated,
        updated: recordsUpdated,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Scrape error:", error);

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
