import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const WIKI_API = "https://en.wikipedia.org/w/api.php";

// Wikipedia categories for current parliament members per EU country
// Format: { countryCode: { category, parliament, role, partyCategory? } }
const PARLIAMENT_CONFIG: Record<string, {
  categories: string[];
  parliament: string;
  role: string;
  countryName: string;
}> = {
  PT: {
    categories: ["Members of the 16th Assembleia da República"],
    parliament: "Assembleia da República",
    role: "Member of Parliament",
    countryName: "Portugal",
  },
  DE: {
    categories: ["Members of the 20th Bundestag"],
    parliament: "Bundestag",
    role: "Member of Bundestag",
    countryName: "Germany",
  },
  FR: {
    categories: ["Deputies of the 17th National Assembly of France"],
    parliament: "Assemblée nationale",
    role: "Member of National Assembly",
    countryName: "France",
  },
  IT: {
    categories: ["Members of the Chamber of Deputies (Italy), 2022–2027"],
    parliament: "Camera dei Deputati",
    role: "Member of Chamber of Deputies",
    countryName: "Italy",
  },
  ES: {
    categories: ["Members of the 15th Congress of Deputies (Spain)"],
    parliament: "Congreso de los Diputados",
    role: "Member of Congress of Deputies",
    countryName: "Spain",
  },
  PL: {
    categories: ["Members of the Polish Sejm 2023–2027"],
    parliament: "Sejm",
    role: "Member of Sejm",
    countryName: "Poland",
  },
  RO: {
    categories: ["Members of the Chamber of Deputies (Romania), 2024–2028"],
    parliament: "Camera Deputaților",
    role: "Member of Chamber of Deputies",
    countryName: "Romania",
  },
  NL: {
    categories: ["Members of the House of Representatives (Netherlands)"],
    parliament: "Tweede Kamer",
    role: "Member of House of Representatives",
    countryName: "Netherlands",
  },
  BE: {
    categories: ["Members of the Belgian Federal Parliament"],
    parliament: "Chambre des représentants",
    role: "Member of Federal Parliament",
    countryName: "Belgium",
  },
  CZ: {
    categories: ["Members of the Chamber of Deputies of the Czech Republic (2021–2025)"],
    parliament: "Poslanecká sněmovna",
    role: "Member of Chamber of Deputies",
    countryName: "Czech Republic",
  },
  GR: {
    categories: ["Greek MPs 2023–2027"],
    parliament: "Hellenic Parliament",
    role: "Member of Hellenic Parliament",
    countryName: "Greece",
  },
  SE: {
    categories: ["Members of the Riksdag 2022–2026"],
    parliament: "Riksdag",
    role: "Member of Riksdag",
    countryName: "Sweden",
  },
  HU: {
    categories: ["Members of the National Assembly of Hungary (2022–2026)"],
    parliament: "Országgyűlés",
    role: "Member of National Assembly",
    countryName: "Hungary",
  },
  AT: {
    categories: ["Members of the Austrian National Council (2024–)"],
    parliament: "Nationalrat",
    role: "Member of National Council",
    countryName: "Austria",
  },
  BG: {
    categories: ["Members of the 51st National Assembly of Bulgaria"],
    parliament: "National Assembly",
    role: "Member of National Assembly",
    countryName: "Bulgaria",
  },
  DK: {
    categories: ["Members of the Folketing 2022–2026"],
    parliament: "Folketing",
    role: "Member of Folketing",
    countryName: "Denmark",
  },
  FI: {
    categories: ["Members of the 2023–2027 Finnish Parliament"],
    parliament: "Eduskunta",
    role: "Member of Parliament",
    countryName: "Finland",
  },
  SK: {
    categories: ["Members of the National Council (Slovakia) 2023-2027"],
    parliament: "Národná rada",
    role: "Member of National Council",
    countryName: "Slovakia",
  },
  IE: {
    categories: ["Members of the 34th Dáil"],
    parliament: "Dáil Éireann",
    role: "Teachta Dála",
    countryName: "Ireland",
  },
  HR: {
    categories: ["Representatives in the 11th term of the Croatian Parliament"],
    parliament: "Sabor",
    role: "Member of Sabor",
    countryName: "Croatia",
  },
  LT: {
    categories: ["Members of the 2024–2028 Seimas"],
    parliament: "Seimas",
    role: "Member of Seimas",
    countryName: "Lithuania",
  },
  SI: {
    categories: ["Members of the 9th National Assembly (Slovenia)"],
    parliament: "Državni zbor",
    role: "Member of National Assembly",
    countryName: "Slovenia",
  },
  LV: {
    categories: ["Members of the 14th Saeima"],
    parliament: "Saeima",
    role: "Member of Saeima",
    countryName: "Latvia",
  },
  EE: {
    categories: ["Members of the 15th Riigikogu"],
    parliament: "Riigikogu",
    role: "Member of Riigikogu",
    countryName: "Estonia",
  },
  CY: {
    categories: ["Members of the House of Representatives (Cyprus)"],
    parliament: "House of Representatives",
    role: "Member of House of Representatives",
    countryName: "Cyprus",
  },
  LU: {
    categories: ["Members of the Chamber of Deputies (Luxembourg)"],
    parliament: "Chambre des Députés",
    role: "Member of Chamber of Deputies",
    countryName: "Luxembourg",
  },
  MT: {
    categories: ["Members of the 14th Maltese legislature"],
    parliament: "House of Representatives",
    role: "Member of House of Representatives",
    countryName: "Malta",
  },
};

async function getCategoryMembers(category: string): Promise<string[]> {
  const members: string[] = [];
  let cmcontinue: string | undefined;

  for (let i = 0; i < 10; i++) { // max 10 pages of results
    const params = new URLSearchParams({
      action: "query",
      list: "categorymembers",
      cmtitle: `Category:${category}`,
      cmtype: "page",
      cmnamespace: "0",
      cmlimit: "500",
      format: "json",
      origin: "*",
    });
    if (cmcontinue) params.set("cmcontinue", cmcontinue);

    const res = await fetch(`${WIKI_API}?${params}`, {
      headers: { "User-Agent": "PoliticalTracker/1.0" },
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) break;
    const data = await res.json();
    const cms = data?.query?.categorymembers || [];
    for (const cm of cms) {
      // Filter out non-person pages (lists, categories, etc.)
      if (!cm.title.startsWith("List of") && !cm.title.startsWith("Category:") && !cm.title.includes("election")) {
        members.push(cm.title);
      }
    }
    cmcontinue = data?.continue?.cmcontinue;
    if (!cmcontinue) break;
  }

  return members;
}

async function getWikiSummaries(titles: string[]): Promise<Map<string, { extract: string; description: string; image: string | null }>> {
  const results = new Map();
  // Process in chunks of 20
  for (let i = 0; i < titles.length; i += 20) {
    const chunk = titles.slice(i, i + 20);
    const params = new URLSearchParams({
      action: "query",
      titles: chunk.join("|"),
      prop: "extracts|pageimages|description",
      exintro: "true",
      explaintext: "true",
      exlimit: String(chunk.length),
      piprop: "thumbnail",
      pithumbsize: "400",
      format: "json",
      origin: "*",
    });

    try {
      const res = await fetch(`${WIKI_API}?${params}`, {
        headers: { "User-Agent": "PoliticalTracker/1.0" },
        signal: AbortSignal.timeout(15000),
      });
      if (!res.ok) continue;
      const data = await res.json();
      const pages = data?.query?.pages || {};
      for (const page of Object.values(pages) as any[]) {
        if (page.pageid) {
          results.set(page.title, {
            extract: page.extract || "",
            description: page.description || "",
            image: page.thumbnail?.source || null,
          });
        }
      }
    } catch { /* skip chunk */ }
    // Rate limit
    await new Promise(r => setTimeout(r, 200));
  }
  return results;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  let countryCode = "";
  let batchSize = 100;
  let offset = 0;
  let skipEnrichment = false;

  try {
    const body = await req.json();
    countryCode = (body.countryCode || "").toUpperCase();
    batchSize = Math.min(body.batchSize || 100, 200);
    offset = body.offset || 0;
    skipEnrichment = body.skipEnrichment || false;
  } catch { /* defaults */ }

  if (!countryCode || !PARLIAMENT_CONFIG[countryCode]) {
    return new Response(JSON.stringify({
      success: false,
      error: `Invalid or unsupported country code: ${countryCode}`,
      supported: Object.keys(PARLIAMENT_CONFIG),
    }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }

  const config = PARLIAMENT_CONFIG[countryCode];
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const { data: run } = await supabase
    .from("scrape_runs")
    .insert({ source_type: "parliamentary_record", status: "running" })
    .select()
    .single();
  const runId = run?.id;

  try {
    // Step 1: Get all members from Wikipedia categories
    console.log(`Fetching ${config.parliament} members for ${config.countryName}...`);
    let allMembers: string[] = [];
    for (const cat of config.categories) {
      const members = await getCategoryMembers(cat);
      allMembers = allMembers.concat(members);
      console.log(`Category "${cat}": ${members.length} members`);
    }

    // Deduplicate
    allMembers = [...new Set(allMembers)];
    console.log(`Total unique members found: ${allMembers.length}`);

    // Step 2: Process batch
    const batch = allMembers.slice(offset, offset + batchSize);
    if (batch.length === 0) {
      await supabase.from("scrape_runs").update({
        status: "completed", records_fetched: allMembers.length,
        records_created: 0, records_updated: 0,
        completed_at: new Date().toISOString(),
      }).eq("id", runId);

      return new Response(JSON.stringify({
        success: true, total_members: allMembers.length,
        batch_processed: 0, message: "No more members to process",
      }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Step 3: Get Wikipedia summaries for the batch
    let summaries = new Map();
    if (!skipEnrichment) {
      summaries = await getWikiSummaries(batch);
    }

    let created = 0, updated = 0;
    for (const memberTitle of batch) {
      const summary = summaries.get(memberTitle);
      const wikiUrl = `https://en.wikipedia.org/wiki/${encodeURIComponent(memberTitle.replace(/ /g, "_"))}`;

      // Check if exists by name + country
      const { data: existing } = await supabase
        .from("politicians")
        .select("id")
        .eq("name", memberTitle)
        .eq("country_code", countryCode)
        .maybeSingle();

      const record: Record<string, any> = {
        name: memberTitle,
        country_code: countryCode,
        country_name: config.countryName,
        role: config.role,
        jurisdiction: "federal",
        continent: "Europe",
        data_source: "parliamentary_record" as const,
        source_url: wikiUrl,
        wikipedia_url: wikiUrl,
      };

      if (summary) {
        record.wikipedia_summary = summary.extract || null;
        record.wikipedia_data = {
          title: memberTitle,
          description: summary.description || null,
          parliament: config.parliament,
          last_fetched: new Date().toISOString(),
        };
        record.enriched_at = new Date().toISOString();
        if (summary.image) {
          record.photo_url = summary.image;
          record.wikipedia_image_url = summary.image;
        }
        // Try to extract party from description
        if (summary.description) {
          record.biography = summary.extract || null;
        }
      }

      if (existing) {
        // Only update if not already a more specific role
        const { data: currentData } = await supabase
          .from("politicians")
          .select("role")
          .eq("id", existing.id)
          .single();

        // Don't overwrite specific roles like "Prime Minister" with generic "Member of Parliament"
        if (currentData?.role === "Member of European Parliament" || 
            currentData?.role === config.role) {
          await supabase.from("politicians").update(record).eq("id", existing.id);
          updated++;
        }
      } else {
        await supabase.from("politicians").insert(record);
        created++;
      }
    }

    const hasMore = offset + batchSize < allMembers.length;

    await supabase.from("scrape_runs").update({
      status: "completed",
      records_fetched: allMembers.length,
      records_created: created,
      records_updated: updated,
      completed_at: new Date().toISOString(),
    }).eq("id", runId);

    // Auto-trigger Wikipedia enrichment for new politicians
    if (created > 0) {
      try {
        const enrichUrl = `${Deno.env.get("SUPABASE_URL")}/functions/v1/enrich-wikipedia`;
        fetch(enrichUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")}`,
          },
          body: JSON.stringify({ batchSize: Math.min(created, 15) }),
        }).catch(() => {});
      } catch {}
    }

    return new Response(JSON.stringify({
      success: true,
      country: config.countryName,
      parliament: config.parliament,
      total_members: allMembers.length,
      batch_processed: batch.length,
      created,
      updated,
      next_offset: hasMore ? offset + batchSize : null,
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
