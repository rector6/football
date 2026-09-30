import type { Handler, HandlerEvent } from "@netlify/functions";

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

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
};

export const handler: Handler = async (event: HandlerEvent) => {
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
  const endpoint = String(params.endpoint || "").toLowerCase().replace(/^\/+/, "");

  if (!endpoint || !ALLOWED.has(endpoint)) {
    return {
      statusCode: 400,
      headers: { ...cors, "Content-Type": "application/json" },
      body: JSON.stringify({
        error: `Invalid endpoint. Allowed: ${[...ALLOWED].join(", ")}`,
      }),
    };
  }

  // Map livescore convenience alias → fixtures?live=all
  const path = endpoint === "livescore" ? "fixtures" : endpoint;
  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (k === "endpoint" || v == null || v === "") continue;
    qs.set(k, String(v));
  }
  if (endpoint === "livescore" && !qs.has("live")) {
    qs.set("live", "all");
  }

  const url = `https://v3.football.api-sports.io/${path}?${qs.toString()}`;

  try {
    const res = await fetch(url, {
      headers: {
        "x-apisports-key": key,
        Accept: "application/json",
      },
    });

    const text = await res.text();
    let body = text;
    try {
      body = JSON.stringify(JSON.parse(text));
    } catch {
      /* keep raw */
    }

    if (!res.ok) {
      return {
        statusCode: 503,
        headers: {
          ...cors,
          "Content-Type": "application/json",
          "Cache-Control": "no-store",
        },
        body: JSON.stringify({
          error: `API-Football upstream ${res.status}`,
          detail: body.slice(0, 500),
        }),
      };
    }

    return {
      statusCode: 200,
      headers: {
        ...cors,
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=30",
      },
      body,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Upstream request failed";
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
