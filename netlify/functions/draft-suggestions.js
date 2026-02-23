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

const PROMPT = `Search the web for the most current 2026 NFL Draft prospect rankings, early big boards, and mock drafts.

You must respond with ONLY a valid JSON object. No introduction, no explanation, no markdown, no code fences. Start your response with { and end with }.

The JSON object must have exactly these two keys:
- "picks": object with keys "1" through "32", each value is array of 4 top 2026 NFL Draft prospects: [{"name":"...","position":"...","school":"..."}]
- "allProspects": array of ~70 top 2026 NFL Draft first-round prospects: [{"name":"...","position":"...","school":"..."}]

Example of correct format:
{"picks":{"1":[{"name":"Travis Hunter","position":"CB/WR","school":"Colorado"}],"2":[...]},"allProspects":[{"name":"Travis Hunter","position":"CB/WR","school":"Colorado"},...]}`;

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

    let raw = textBlock.text.trim();
    // Strip markdown fences if present
    raw = raw.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/\s*```$/, "").trim();
    // Extract JSON object if there's surrounding text
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON object found in response");
    const parsed = JSON.parse(jsonMatch[0]);

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
