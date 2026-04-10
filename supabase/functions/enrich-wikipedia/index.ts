import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const WIKI_API = "https://en.wikipedia.org/api/rest_v1";
const WIKI_SEARCH = "https://en.wikipedia.org/w/api.php";

interface WikiSummary {
  title: string;
  extract: string;
  description?: string;
  thumbnail?: { source: string; width: number; height: number };
  originalimage?: { source: string };
  content_urls?: { desktop?: { page?: string } };
  coordinates?: { lat: number; lon: number };
  timestamp?: string;
}

async function searchWikipedia(query: string): Promise<string | null> {
  const params = new URLSearchParams({
    action: "query",
    list: "search",
    srsearch: query,
    srnamespace: "0",
    srlimit: "3",
    format: "json",
    origin: "*",
  });

  try {
    const res = await fetch(`${WIKI_SEARCH}?${params}`, {
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return null;
    const data = await res.json();
    const results = data?.query?.search;
    if (!results || results.length === 0) return null;
    return results[0].title;
  } catch {
    return null;
  }
}

async function getWikiSummary(title: string): Promise<WikiSummary | null> {
  try {
    const encodedTitle = encodeURIComponent(title.replace(/ /g, "_"));
    const res = await fetch(`${WIKI_API}/page/summary/${encodedTitle}`, {
      headers: { "User-Agent": "PoliticalTracker/1.0 (contact@example.com)" },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

async function getWikiExtracts(title: string): Promise<string | null> {
  const params = new URLSearchParams({
    action: "query",
    titles: title,
    prop: "extracts|categories|links|extlinks",
    exintro: "false",
    explaintext: "true",
    exlimit: "1",
    exsectionformat: "plain",
    exchars: "3000",
    cllimit: "20",
    pllimit: "20",
    ellimit: "10",
    format: "json",
    origin: "*",
  });

  try {
    const res = await fetch(`${WIKI_SEARCH}?${params}`, {
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return null;
    const data = await res.json();
    const pages = data?.query?.pages;
    if (!pages) return null;
    const page = Object.values(pages)[0] as any;
    return page?.extract || null;
  } catch {
    return null;
  }
}

async function getWikiInfobox(title: string): Promise<Record<string, any> | null> {
  const params = new URLSearchParams({
    action: "query",
    titles: title,
    prop: "revisions",
    rvprop: "content",
    rvslots: "main",
    rvsection: "0",
    format: "json",
    origin: "*",
  });

  try {
    const res = await fetch(`${WIKI_SEARCH}?${params}`, {
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return null;
    const data = await res.json();
    const pages = data?.query?.pages;
    if (!pages) return null;
    const page = Object.values(pages)[0] as any;
    const content = page?.revisions?.[0]?.slots?.main?.["*"] || "";

    // Parse key infobox fields
    const infobox: Record<string, string> = {};
    const fields = [
      "birth_date", "birth_place", "alma_mater", "spouse", "children",
      "occupation", "party", "office", "term_start", "term_end",
      "predecessor", "successor", "nationality", "religion",
    ];

    for (const field of fields) {
      const regex = new RegExp(`\\|\\s*${field}\\s*=\\s*(.+?)(?:\\n|\\|)`, "i");
      const match = content.match(regex);
      if (match) {
        // Clean wiki markup
        let val = match[1].trim();
        val = val.replace(/\[\[([^\]|]*?\|)?([^\]]*?)\]\]/g, "$2");
        val = val.replace(/\{\{[^}]*\}\}/g, "").trim();
        if (val) infobox[field] = val;
      }
    }

    return Object.keys(infobox).length > 0 ? infobox : null;
  } catch {
    return null;
  }
}

async function enrichPolitician(
  supabase: any,
  politician: { id: string; name: string; country_name: string; party_name?: string }
): Promise<boolean> {
  // Search Wikipedia for this politician
  const searchQuery = `${politician.name} politician ${politician.country_name}`;
  const wikiTitle = await searchWikipedia(searchQuery);
  if (!wikiTitle) {
    console.log(`No Wikipedia result for: ${politician.name}`);
    return false;
  }

  // Get summary, full extract, and infobox in parallel
  const [summary, fullExtract, infobox] = await Promise.all([
    getWikiSummary(wikiTitle),
    getWikiExtracts(wikiTitle),
    getWikiInfobox(wikiTitle),
  ]);

  if (!summary) {
    console.log(`No summary for: ${politician.name} (${wikiTitle})`);
    return false;
  }

  const wikiUrl = summary.content_urls?.desktop?.page || `https://en.wikipedia.org/wiki/${encodeURIComponent(wikiTitle)}`;
  const wikiImage = summary.originalimage?.source || summary.thumbnail?.source || null;

  const updateData: Record<string, any> = {
    wikipedia_url: wikiUrl,
    wikipedia_summary: summary.extract || null,
    biography: fullExtract || summary.extract || null,
    wikipedia_image_url: wikiImage,
    wikipedia_data: {
      title: wikiTitle,
      description: summary.description || null,
      infobox: infobox || null,
      coordinates: summary.coordinates || null,
      last_fetched: new Date().toISOString(),
    },
    enriched_at: new Date().toISOString(),
  };

  // Use Wikipedia image if we don't have a photo or it's an EP placeholder
  if (wikiImage) {
    updateData.photo_url = wikiImage;
  }

  // Extract birth year from infobox if we don't have it
  if (infobox?.birth_date) {
    const yearMatch = infobox.birth_date.match(/(\d{4})/);
    if (yearMatch) {
      updateData.birth_year = parseInt(yearMatch[1]);
    }
  }

  const { error } = await supabase
    .from("politicians")
    .update(updateData)
    .eq("id", politician.id);

  if (error) {
    console.error(`Failed to update ${politician.name}:`, error.message);
    return false;
  }

  console.log(`Enriched: ${politician.name} → ${wikiTitle}`);
  return true;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  let batchSize = 20;
  let politicianId: string | null = null;

  try {
    const body = await req.json();
    batchSize = Math.min(body.batchSize || 20, 50);
    politicianId = body.politicianId || null;
  } catch { /* defaults */ }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  try {
    let politicians: any[];

    if (politicianId) {
      // Enrich a specific politician
      const { data } = await supabase
        .from("politicians")
        .select("id, name, country_name, party_name")
        .eq("id", politicianId)
        .single();
      politicians = data ? [data] : [];
    } else {
      // Enrich unenriched politicians (prioritize those with roles)
      const { data } = await supabase
        .from("politicians")
        .select("id, name, country_name, party_name")
        .is("enriched_at", null)
        .order("role", { ascending: true })
        .limit(batchSize);
      politicians = data || [];
    }

    if (politicians.length === 0) {
      return new Response(
        JSON.stringify({ success: true, message: "No politicians to enrich", enriched: 0 }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Enriching ${politicians.length} politicians with Wikipedia data...`);

    let enriched = 0;
    let failed = 0;

    for (const pol of politicians) {
      const success = await enrichPolitician(supabase, pol);
      if (success) enriched++;
      else failed++;
      // Rate limit: Wikipedia asks for <200 req/s, we do ~3 per politician
      await new Promise((r) => setTimeout(r, 300));
    }

    // Count remaining unenriched
    const { count } = await supabase
      .from("politicians")
      .select("id", { count: "exact", head: true })
      .is("enriched_at", null);

    return new Response(
      JSON.stringify({
        success: true,
        enriched,
        failed,
        remaining: count || 0,
        message: `Enriched ${enriched}/${politicians.length} politicians. ${count || 0} remaining.`,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Wikipedia enrichment error:", error);
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : String(error) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
