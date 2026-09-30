import type { Handler, HandlerEvent } from "@netlify/functions";
import { corsHeaders, supabaseAdmin } from "./_apiFootball";

/** football-data.org v4 free tier competitions */
const CODES: Record<string, string> = {
  pl: "PL",
  epl: "PL",
  pd: "PD",
  laliga: "PD",
  bl1: "BL1",
  bundesliga: "BL1",
  sa: "SA",
  seriea: "SA",
  fl1: "FL1",
  ligue1: "FL1",
  cl: "CL",
  ucl: "CL",
  ded: "DED",
  ppl: "PPL",
  elc: "ELC",
  bsa: "BSA",
  wc: "WC",
  ec: "EC",
};

type MappedMatch = {
  id: string;
  home: string;
  away: string;
  time: string;
  league: string;
  status: "live" | "fixture" | "result";
  homeScore?: number;
  awayScore?: number;
  minute?: string;
};

function mapStatus(s: string): "live" | "fixture" | "result" {
  const u = s.toUpperCase();
  if (["IN_PLAY", "PAUSED", "LIVE"].includes(u)) return "live";
  if (["FINISHED", "AWARDED"].includes(u)) return "result";
  return "fixture";
}

function mapMatch(m: any, league: string): MappedMatch {
  const st = mapStatus(String(m?.status || ""));
  const date = m?.utcDate ? new Date(m.utcDate) : null;
  const time =
    st === "result"
      ? "FT"
      : st === "live"
        ? "LIVE"
        : date
          ? date.toLocaleString([], {
              weekday: "short",
              hour: "2-digit",
              minute: "2-digit",
            })
          : "—";
  return {
    id: String(m?.id || ""),
    home: String(m?.homeTeam?.name || m?.homeTeam?.shortName || "TBD"),
    away: String(m?.awayTeam?.name || m?.awayTeam?.shortName || "TBD"),
    time,
    league,
    status: st,
    homeScore: m?.score?.fullTime?.home ?? m?.score?.home ?? undefined,
    awayScore: m?.score?.fullTime?.away ?? m?.score?.away ?? undefined,
    minute: st === "live" ? "LIVE" : undefined,
  };
}

async function cacheGet(key: string, ttlMs: number) {
  const sb = supabaseAdmin();
  if (!sb) return null;
  try {
    const { data } = await sb
      .from("scores_cache")
      .select("payload, updated_at")
      .eq("cache_key", key)
      .maybeSingle();
    if (!data?.payload) return null;
    const age = Date.now() - Date.parse(String(data.updated_at));
    if (!Number.isFinite(age) || age > ttlMs) return null;
    return data.payload;
  } catch {
    return null;
  }
}

async function cacheSet(key: string, payload: unknown) {
  const sb = supabaseAdmin();
  if (!sb) return;
  try {
    await sb.from("scores_cache").upsert(
      {
        cache_key: key,
        payload,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "cache_key" },
    );
  } catch {
    /* ignore */
  }
}

export const handler: Handler = async (event: HandlerEvent) => {
  const cors = corsHeaders(event.headers?.origin || event.headers?.Origin);
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

  const token = process.env.FOOTBALL_DATA_KEY?.trim();
  if (!token) {
    return {
      statusCode: 200,
      headers: { ...cors, "Content-Type": "application/json" },
      body: JSON.stringify({
        matches: [],
        error: "FOOTBALL_DATA_KEY not configured",
        source: "football-data",
      }),
    };
  }

  const params = event.queryStringParameters || {};
  const resource = String(params.resource || "matches").toLowerCase(); // matches | standings
  const compKey = String(params.competition || params.league || "PL").toLowerCase();
  const code = CODES[compKey] || compKey.toUpperCase();

  const ttl = resource === "standings" ? 24 * 60 * 60_000 : 5 * 60_000;
  const cacheKey = `fd_${resource}_${code}`;
  const cached = await cacheGet(cacheKey, ttl);
  if (cached) {
    return {
      statusCode: 200,
      headers: {
        ...cors,
        "Content-Type": "application/json",
        "Cache-Control": `public, max-age=${Math.floor(ttl / 1000)}`,
      },
      body: JSON.stringify({ ...cached, source: "cache" }),
    };
  }

  try {
    const path =
      resource === "standings"
        ? `https://api.football-data.org/v4/competitions/${code}/standings`
        : `https://api.football-data.org/v4/competitions/${code}/matches`;

    const qs = new URLSearchParams();
    if (resource === "matches") {
      if (params.status) qs.set("status", String(params.status));
      if (params.dateFrom) qs.set("dateFrom", String(params.dateFrom));
      if (params.dateTo) qs.set("dateTo", String(params.dateTo));
      // default: upcoming + recent window
      if (!params.status && !params.dateFrom) {
        const from = new Date();
        from.setDate(from.getDate() - 3);
        const to = new Date();
        to.setDate(to.getDate() + 14);
        qs.set("dateFrom", from.toISOString().slice(0, 10));
        qs.set("dateTo", to.toISOString().slice(0, 10));
      }
    }

    const url = qs.toString() ? `${path}?${qs}` : path;
    const res = await fetch(url, {
      headers: {
        "X-Auth-Token": token,
        Accept: "application/json",
      },
    });
    const json = await res.json();

    if (!res.ok) {
      return {
        statusCode: 200,
        headers: { ...cors, "Content-Type": "application/json" },
        body: JSON.stringify({
          matches: [],
          error: json?.message || `football-data ${res.status}`,
          source: "football-data",
        }),
      };
    }

    if (resource === "standings") {
      const payload = { standings: json.standings || [], source: "football-data", competition: code };
      await cacheSet(cacheKey, payload);
      return {
        statusCode: 200,
        headers: {
          ...cors,
          "Content-Type": "application/json",
          "Cache-Control": "public, max-age=86400",
        },
        body: JSON.stringify(payload),
      };
    }

    const leagueName = String(json?.competition?.name || code);
    const matches = (json.matches || []).map((m: any) => mapMatch(m, leagueName));
    const payload = {
      matches,
      source: "football-data",
      competition: code,
      generatedAt: new Date().toISOString(),
    };
    await cacheSet(cacheKey, payload);
    return {
      statusCode: 200,
      headers: {
        ...cors,
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=300",
      },
      body: JSON.stringify(payload),
    };
  } catch (err) {
    return {
      statusCode: 200,
      headers: { ...cors, "Content-Type": "application/json" },
      body: JSON.stringify({
        matches: [],
        error: err instanceof Error ? err.message : "football-data failed",
        source: "football-data",
      }),
    };
  }
};
