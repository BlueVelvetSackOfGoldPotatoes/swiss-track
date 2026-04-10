import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};
import { hmac } from "https://deno.land/x/hmac@v2.0.1/mod.ts";

const TWITTER_API = "https://api.x.com/2";

function generateOAuthHeader(
  method: string,
  url: string,
  params: Record<string, string>,
  consumerKey: string,
  consumerSecret: string,
  accessToken: string,
  accessTokenSecret: string
): string {
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const nonce = crypto.randomUUID().replace(/-/g, "");

  const oauthParams: Record<string, string> = {
    oauth_consumer_key: consumerKey,
    oauth_nonce: nonce,
    oauth_signature_method: "HMAC-SHA1",
    oauth_timestamp: timestamp,
    oauth_token: accessToken,
    oauth_version: "1.0",
  };

  const allParams = { ...oauthParams, ...params };
  const sortedKeys = Object.keys(allParams).sort();
  const paramString = sortedKeys
    .map((k) => `${encodeURIComponent(k)}=${encodeURIComponent(allParams[k])}`)
    .join("&");

  const baseString = `${method}&${encodeURIComponent(url)}&${encodeURIComponent(paramString)}`;
  const signingKey = `${encodeURIComponent(consumerSecret)}&${encodeURIComponent(accessTokenSecret)}`;

  const signatureBytes = hmac("sha1", signingKey, baseString);
  const signature = btoa(String.fromCharCode(...new Uint8Array(signatureBytes as ArrayBuffer)));

  oauthParams.oauth_signature = signature;

  const headerParts = Object.keys(oauthParams)
    .sort()
    .map((k) => `${encodeURIComponent(k)}="${encodeURIComponent(oauthParams[k])}"`)
    .join(", ");

  return `OAuth ${headerParts}`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const consumerKey = Deno.env.get("TWITTER_CONSUMER_KEY");
  const consumerSecret = Deno.env.get("TWITTER_CONSUMER_SECRET");
  const accessToken = Deno.env.get("TWITTER_ACCESS_TOKEN");
  const accessTokenSecret = Deno.env.get("TWITTER_ACCESS_TOKEN_SECRET");

  if (!consumerKey || !consumerSecret || !accessToken || !accessTokenSecret) {
    return new Response(
      JSON.stringify({
        success: false,
        error: "Twitter API credentials not configured. Add TWITTER_CONSUMER_KEY, TWITTER_CONSUMER_SECRET, TWITTER_ACCESS_TOKEN, TWITTER_ACCESS_TOKEN_SECRET as secrets.",
      }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
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
  let totalTweets = 0;
  let eventsCreated = 0;

  try {
    // Get all politicians with twitter handles
    const { data: politicians } = await supabase
      .from("politicians")
      .select("id, name, twitter_handle")
      .not("twitter_handle", "is", null);

    if (!politicians || politicians.length === 0) {
      throw new Error("No politicians with Twitter handles found");
    }

    console.log(`Found ${politicians.length} politicians with Twitter handles`);

    for (const pol of politicians.slice(0, 15)) {
      const handle = pol.twitter_handle?.replace("@", "");
      if (!handle) continue;

      try {
        // Get user ID from username
        const userUrl = `${TWITTER_API}/users/by/username/${handle}`;
        const userParams = { "user.fields": "id,name,username,description" };
        const userQueryString = new URLSearchParams(userParams).toString();

        const userAuthHeader = generateOAuthHeader(
          "GET", userUrl, userParams,
          consumerKey, consumerSecret, accessToken, accessTokenSecret
        );

        const userRes = await fetch(`${userUrl}?${userQueryString}`, {
          headers: { Authorization: userAuthHeader },
        });

        if (!userRes.ok) {
          console.error(`Twitter user lookup failed for ${handle}: ${userRes.status}`);
          continue;
        }

        const userData = await userRes.json();
        const userId = userData.data?.id;
        if (!userId) continue;

        // Get recent tweets
        const tweetsUrl = `${TWITTER_API}/users/${userId}/tweets`;
        const tweetsParams: Record<string, string> = {
          max_results: "10",
          "tweet.fields": "created_at,public_metrics,entities,context_annotations",
          exclude: "retweets",
        };
        const tweetsQueryString = new URLSearchParams(tweetsParams).toString();

        const tweetsAuthHeader = generateOAuthHeader(
          "GET", tweetsUrl, tweetsParams,
          consumerKey, consumerSecret, accessToken, accessTokenSecret
        );

        const tweetsRes = await fetch(`${tweetsUrl}?${tweetsQueryString}`, {
          headers: { Authorization: tweetsAuthHeader },
        });

        if (!tweetsRes.ok) {
          console.error(`Twitter tweets failed for ${handle}: ${tweetsRes.status}`);
          continue;
        }

        const tweetsData = await tweetsRes.json();
        const tweets = tweetsData.data || [];
        totalTweets += tweets.length;

        for (const tweet of tweets) {
          // Simple sentiment analysis based on keywords
          const text = tweet.text.toLowerCase();
          let sentiment: "positive" | "negative" | "neutral" = "neutral";
          const positiveWords = ["great", "proud", "success", "support", "progress", "celebrate", "win", "passed"];
          const negativeWords = ["oppose", "against", "fail", "crisis", "corrupt", "shame", "disaster", "attack"];

          if (positiveWords.some((w) => text.includes(w))) sentiment = "positive";
          else if (negativeWords.some((w) => text.includes(w))) sentiment = "negative";

          // Extract entities (hashtags, mentions)
          const entities: string[] = [];
          if (tweet.entities?.hashtags) {
            entities.push(...tweet.entities.hashtags.map((h: any) => `#${h.tag}`));
          }
          if (tweet.entities?.mentions) {
            entities.push(...tweet.entities.mentions.map((m: any) => `@${m.username}`));
          }

          await supabase.from("political_events").insert({
            politician_id: pol.id,
            event_type: "social_media",
            title: `Tweet: "${tweet.text.substring(0, 80)}${tweet.text.length > 80 ? "..." : ""}"`,
            description: tweet.text,
            source: "twitter",
            source_handle: `@${handle}`,
            source_url: `https://x.com/${handle}/status/${tweet.id}`,
            sentiment,
            entities: entities.slice(0, 10),
            evidence_count: 1,
            event_timestamp: tweet.created_at || new Date().toISOString(),
            raw_data: tweet,
          });
          eventsCreated++;
        }

        // Rate limit: 1 req/sec
        await new Promise((r) => setTimeout(r, 1500));
      } catch (e) {
        console.error(`Error processing ${handle}:`, e);
      }
    }

    await supabase
      .from("scrape_runs")
      .update({
        status: "completed",
        records_fetched: totalTweets,
        records_created: eventsCreated,
        completed_at: new Date().toISOString(),
      })
      .eq("id", runId);

    await supabase
      .from("data_sources")
      .update({ last_synced_at: new Date().toISOString(), total_records: totalTweets })
      .eq("source_type", "twitter");

    return new Response(
      JSON.stringify({ success: true, tweets_fetched: totalTweets, events_created: eventsCreated }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Twitter scrape error:", error);
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
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : String(error) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
