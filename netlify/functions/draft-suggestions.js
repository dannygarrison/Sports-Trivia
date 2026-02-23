// netlify/functions/draft-suggestions.js
// Fetches 2025 NFL Draft suggestions via Anthropic API with 24-hour in-memory cache.
// One real API call per day regardless of traffic.

const Anthropic = require("@anthropic-ai/sdk");

// In-memory cache (persists across warm Lambda invocations)
let cache = {
  data: null,
  timestamp: null,
};

const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

const PROMPT = `You are an NFL draft expert. Search the web for the most current 2025 NFL Draft prospect rankings, big boards, and mock drafts available today.

Return a JSON object with exactly two keys:
1. "picks": an object where each key is a pick number as a string ("1" through "32") and the value is an array of 4-5 top prospects likely to be selected at or near that pick. Each prospect: { "name": string, "position": string, "school": string }
2. "allProspects": a flat array of all top ~70 first-round-caliber 2025 NFL Draft prospects. Each: { "name": string, "position": string, "school": string }

Use current consensus mock drafts and big boards. Only return valid JSON — no markdown fences, no explanation, no preamble.`;

exports.handler = async function (event, context) {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
  };

  // Handle CORS preflight
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers, body: "" };
  }

  // Return cached data if fresh
  const now = Date.now();
  if (cache.data && cache.timestamp && now - cache.timestamp < CACHE_TTL_MS) {
    console.log("Returning cached draft suggestions, age:", Math.round((now - cache.timestamp) / 60000), "min");
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ ...cache.data, cached: true, cacheAgeMinutes: Math.round((now - cache.timestamp) / 60000) }),
    };
  }

  // Fetch fresh from Anthropic
  try {
    console.log("Fetching fresh draft suggestions from Anthropic...");
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4000,
      tools: [{ type: "web_search_20250305", name: "web_search" }],
      messages: [{ role: "user", content: PROMPT }],
    });

    const textBlock = response.content.find((b) => b.type === "text");
    if (!textBlock) throw new Error("No text block in response");

    let raw = textBlock.text.trim().replace(/^```json\s*/i, "").replace(/\s*```$/, "").trim();
    const parsed = JSON.parse(raw);

    if (!parsed.picks || !parsed.allProspects) {
      throw new Error("Response missing required keys");
    }

    // Store in cache
    cache = { data: parsed, timestamp: now };
    console.log("Draft suggestions cached successfully. Prospects:", parsed.allProspects.length);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ ...parsed, cached: false }),
    };
  } catch (err) {
    console.error("Draft suggestions error:", err.message);

    // Return stale cache if available rather than failing
    if (cache.data) {
      console.log("Returning stale cache due to error");
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ ...cache.data, cached: true, stale: true }),
      };
    }

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "Failed to load draft suggestions", detail: err.message }),
    };
  }
};
