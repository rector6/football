import type { Handler, HandlerEvent } from "@netlify/functions";
import { callApiFootball, corsHeaders } from "./_apiFootball";

const ALLOWED = new Set([
  "fixtures",
  "standings",
  "teams",
  "players",
  "odds",
  "livescore",
  "leagues",
  "countries",
]);

export const handler: Handler = async (event: HandlerEvent) => {
  const origin = event.headers?.origin || event.headers?.Origin;
  const cors = corsHeaders(origin);

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: cors, body: "" };
  }

  if (event.httpMethod !== "GET") {
    return {
      statusCode: 405,
      headers: { ...cors, "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  const key = process.env.API_FOOTBALL_KEY?.trim();
  if (!key) {
    return {
      statusCode: 503,
      headers: {
        ...cors,
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
      },
      body: JSON.stringify({ error: "API_FOOTBALL_KEY is not configured" }),
    };
  }

  const params = event.queryStringParameters || {};
  const endpoint = String(params.endpoint || "")
    .toLowerCase()
    .replace(/^\/+/, "");

  if (!endpoint || !ALLOWED.has(endpoint)) {
    return {
      statusCode: 400,
      headers: { ...cors, "Content-Type": "application/json" },
      body: JSON.stringify({
        error: `Invalid endpoint. Allowed: ${[...ALLOWED].join(", ")}`,
      }),
    };
  }

  const path = endpoint === "livescore" ? "fixtures" : endpoint;
  const qs: Record<string, string> = {};
  for (const [k, v] of Object.entries(params)) {
    if (k === "endpoint" || v == null || v === "") continue;
    qs[k] = String(v);
  }
  if (endpoint === "livescore" && !qs.live) {
    qs.live = "all";
  }

  // Standings: longer client cache (24h)
  const cacheControl =
    endpoint === "standings"
      ? "public, max-age=86400"
      : endpoint === "fixtures" || endpoint === "livescore"
        ? "public, max-age=30"
        : "public, max-age=120";

  try {
    const result = await callApiFootball(path, qs);

    if (result.rateLimited) {
      return {
        statusCode: 429,
        headers: {
          ...cors,
          "Content-Type": "application/json",
          "Cache-Control": "public, max-age=60",
          "Retry-After": "60",
        },
        body: result.body.includes("Rate limited")
          ? result.body
          : JSON.stringify({ error: "Rate limited, try again shortly" }),
      };
    }

    if (!result.ok) {
      return {
        statusCode: 503,
        headers: {
          ...cors,
          "Content-Type": "application/json",
          "Cache-Control": "no-store",
        },
        body: result.body,
      };
    }

    // Normalize JSON body
    let body = result.body;
    try {
      body = JSON.stringify(JSON.parse(result.body));
    } catch {
      /* keep */
    }

    return {
      statusCode: 200,
      headers: {
        ...cors,
        "Content-Type": "application/json",
        "Cache-Control": cacheControl,
        ...(result.remaining != null
          ? { "X-Quota-Remaining-Hint": String(result.remaining) }
          : {}),
      },
      body,
    };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Upstream request failed";
    return {
      statusCode: 503,
      headers: {
        ...cors,
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
      },
      body: JSON.stringify({ error: message }),
    };
  }
};
