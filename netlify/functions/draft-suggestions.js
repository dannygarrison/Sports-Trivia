// netlify/functions/draft-suggestions.js
// Fetches 2025 NFL Draft suggestions via Anthropic API with 24-hour in-memory cache.
// One real API call per day regardless of traffic.

const Anthropic = require("@anthropic-ai/sdk");

// In-memory cache (persists across warm Lambda invocations)
let cache = {
  data: null,
  timestamp: null,
};
let lastApiCall = null; // rate limit tracker

const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours
const RATE_LIMIT_MS = 60 * 1000; // min 60s between real API calls

const PROMPT = `Search the web for the most current 2026 NFL Draft prospect rankings and big boards.

Respond with ONLY a JSON object. No explanation, no markdown. Start with { and end with }.

Two keys required:
- "picks": keys "1" to "32", each an array of 3 prospects: [{"name":"...","pos":"...","school":"..."}]
- "all": array of 50 top 2026 prospects: [{"name":"...","pos":"...","school":"..."}]

Example: {"picks":{"1":[{"name":"Arch Manning","pos":"QB","school":"Texas"}]},"all":[{"name":"Arch Manning","pos":"QB","school":"Texas"}]}`;

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
  if (cache.data && cache.timestamp && (now - cache.timestamp) < CACHE_TTL_MS) {
    console.log("Returning cached draft suggestions, age:", Math.round((now - cache.timestamp) / 60000), "min");
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ ...cache.data, cached: true, cacheAgeMinutes: Math.round((now - cache.timestamp) / 60000) }),
    };
  }

  // Enforce rate limit - refuse to call API more than once per minute
  const now2 = Date.now();
  if (lastApiCall && now2 - lastApiCall < RATE_LIMIT_MS) {
    const waitSec = Math.ceil((RATE_LIMIT_MS - (now2 - lastApiCall)) / 1000);
    return {
      statusCode: 429,
      headers,
      body: JSON.stringify({ error: `Rate limited. Try again in ${waitSec}s.` }),
    };
  }
  lastApiCall = now2;

  // Fetch fresh from Anthropic
  try {
    console.log("Fetching fresh draft suggestions from Anthropic...");
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 3500,
      tools: [{ type: "web_search_20250305", name: "web_search" }],
      messages: [{ role: "user", content: PROMPT }],
    });

    const textBlock = response.content.find((b) => b.type === "text");
    if (!textBlock) throw new Error("No text block in response");

    let raw = textBlock.text.trim();
    // Strip markdown fences if present
    raw = raw.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/\s*```$/, "").trim();
    // Extract JSON object if there's surrounding text
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON object found in response");
    const parsed = JSON.parse(jsonMatch[0]);

    if (!parsed.picks || !parsed.all) {
      throw new Error("Response missing required keys");
    }

    // Normalize to expected shape
    const normalized = { picks: parsed.picks, allProspects: parsed.all };

    // Store in cache
    cache = { data: normalized, timestamp: Date.now() };
    console.log("Draft suggestions cached successfully. Prospects:", normalized.allProspects.length);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ ...normalized, cached: false }),
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
