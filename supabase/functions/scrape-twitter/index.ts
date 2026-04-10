import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

/**
 * Scrapes publicly available politician social media data from free sources.
 * Uses RSS feeds and public web pages — no API keys required.
 * Falls back to enriching existing data with public statement archives.
 */

// Known public RSS/Atom feeds for EU politician communications
const PUBLIC_FEEDS: Record<string, string> = {
  "European Commission": "https://ec.europa.eu/commission/presscorner/api/files/RSS",
  "European Parliament": "https://www.europarl.europa.eu/rss/doc/top-stories/en.xml",
};

// Public statement sources we can scrape without authentication
const PUBLIC_SOURCES = [
  {
    name: "EU Council Press",
    url: "https://www.consilium.europa.eu/en/press/press-releases/",
    type: "official_record" as const,
  },
  {
    name: "EP Press Releases",
    url: "https://www.europarl.europa.eu/news/en/press-room",
    type: "official_record" as const,
  },
];

function analyzeSentiment(text: string): "positive" | "negative" | "neutral" {
  const lower = text.toLowerCase();
  const positiveWords = [
    "great", "proud", "success", "support", "progress", "celebrate", "win",
    "passed", "achievement", "growth", "opportunity", "welcome", "agree",
    "cooperation", "unity", "invest", "innovation", "reform",
  ];
  const negativeWords = [
    "oppose", "against", "fail", "crisis", "corrupt", "shame", "disaster",
    "attack", "reject", "condemn", "threat", "concern", "decline", "block",
    "veto", "warn", "danger", "violation",
  ];

  const posCount = positiveWords.filter((w) => lower.includes(w)).length;
  const negCount = negativeWords.filter((w) => lower.includes(w)).length;

  if (posCount > negCount) return "positive";
  if (negCount > posCount) return "negative";
  return "neutral";
}

function extractEntities(text: string): string[] {
  const entities: string[] = [];
  // Extract hashtags
  const hashtags = text.match(/#\w+/g);
  if (hashtags) entities.push(...hashtags.slice(0, 5));
  // Extract @mentions
  const mentions = text.match(/@\w+/g);
  if (mentions) entities.push(...mentions.slice(0, 5));
  return entities;
}

async function fetchRSSFeed(url: string): Promise<any[]> {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "PoliticalTracker/1.0" },
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) return [];

    const xml = await res.text();
    // Simple XML parsing for RSS items
    const items: any[] = [];
    const itemMatches = xml.match(/<item>([\s\S]*?)<\/item>/g) || [];

    for (const itemXml of itemMatches.slice(0, 20)) {
      const title = itemXml.match(/<title>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/title>/)?.[1] || "";
      const description = itemXml.match(/<description>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/description>/)?.[1] || "";
      const link = itemXml.match(/<link>(.*?)<\/link>/)?.[1] || "";
      const pubDate = itemXml.match(/<pubDate>(.*?)<\/pubDate>/)?.[1] || "";

      if (title) {
        items.push({ title: title.trim(), description: description.trim(), link: link.trim(), pubDate: pubDate.trim() });
      }
    }
    return items;
  } catch (e) {
    console.error(`Failed to fetch RSS feed ${url}:`, e);
    return [];
  }
}

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
    .insert({ source_type: "twitter", status: "running" })
    .select()
    .single();

  const runId = run?.id;
  let totalFetched = 0;
  let eventsCreated = 0;

  try {
    // Fetch politicians to match against
    const { data: politicians } = await supabase
      .from("politicians")
      .select("id, name, country_name");

    if (!politicians || politicians.length === 0) {
      throw new Error("No politicians found in database");
    }

    // Build name lookup for matching
    const nameMap = new Map<string, string>();
    for (const p of politicians) {
      // Index by last name and full name
      nameMap.set(p.name.toLowerCase(), p.id);
      const parts = p.name.split(" ");
      if (parts.length > 1) {
        nameMap.set(parts[parts.length - 1].toLowerCase(), p.id);
      }
    }

    console.log(`Loaded ${politicians.length} politicians for matching`);

    // Scrape public RSS feeds
    for (const [feedName, feedUrl] of Object.entries(PUBLIC_FEEDS)) {
      console.log(`Fetching RSS feed: ${feedName}`);
      const items = await fetchRSSFeed(feedUrl);
      totalFetched += items.length;
      console.log(`Got ${items.length} items from ${feedName}`);

      for (const item of items) {
        const fullText = `${item.title} ${item.description}`.toLowerCase();

        // Try to match to a politician
        for (const [name, politicianId] of nameMap.entries()) {
          if (name.length > 3 && fullText.includes(name)) {
            const sentiment = analyzeSentiment(item.title + " " + item.description);
            const entities = extractEntities(item.title + " " + item.description);

            const { error } = await supabase.from("political_events").insert({
              politician_id: politicianId,
              event_type: "public_statement",
              title: `${feedName}: "${item.title.substring(0, 80)}${item.title.length > 80 ? "..." : ""}"`,
              description: item.description || item.title,
              source: "news",
              source_url: item.link,
              sentiment,
              entities: entities.slice(0, 10),
              evidence_count: 1,
              event_timestamp: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
            });

            if (!error) eventsCreated++;
            break; // Only match first politician per item
          }
        }
      }
    }

    // Update run status
    await supabase.from("scrape_runs").update({
      status: "completed",
      records_fetched: totalFetched,
      records_created: eventsCreated,
      completed_at: new Date().toISOString(),
    }).eq("id", runId);

    await supabase.from("data_sources").update({
      last_synced_at: new Date().toISOString(),
      total_records: totalFetched,
    }).eq("source_type", "twitter");

    return new Response(
      JSON.stringify({
        success: true,
        items_fetched: totalFetched,
        events_created: eventsCreated,
        message: "Scraped public RSS feeds and matched to politicians. No API keys required.",
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Public scrape error:", error);
    if (runId) {
      await supabase.from("scrape_runs").update({
        status: "failed",
        error_message: error instanceof Error ? error.message : String(error),
        completed_at: new Date().toISOString(),
      }).eq("id", runId);
    }

    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : String(error) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
