import type { Handler, HandlerEvent } from "@netlify/functions";
import { corsHeaders, supabaseAdmin } from "./_apiFootball";

/**
 * NPFL via TheSportsDB free tier (key "3").
 * League search often returns Nigeria Premier League — id stored in env NPFL_TSDB_ID or default.
 * Fallback: /npfl-fixtures.json static file.
 */
const TSDB_KEY = process.env.THESPORTSDB_KEY?.trim() || "3";
// Common TheSportsDB id candidates for Nigeria Premier League; env overrides
const NPFL_ID = process.env.NPFL_TSDB_ID?.trim() || "4685";

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

function mapEvent(e: any, status: "fixture" | "result"): MappedMatch {
  const home = String(e?.strHomeTeam || "TBD");
  const away = String(e?.strAwayTeam || "TBD");
  const hs = e?.intHomeScore != null && e.intHomeScore !== "" ? Number(e.intHomeScore) : undefined;
  const as = e?.intAwayScore != null && e.intAwayScore !== "" ? Number(e.intAwayScore) : undefined;
  const date = e?.dateEvent || e?.strTimestamp || "";
  const timeStr = e?.strTime || "";
  return {
    id: String(e?.idEvent || `${home}-${away}-${date}`),
    home,
    away,
    time:
      status === "result"
        ? "FT"
        : timeStr || (date ? new Date(date).toLocaleDateString() : "—"),
    league: "NPFL",
    status,
    homeScore: hs,
    awayScore: as,
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

async function fetchStaticFallback(baseUrl: string): Promise<MappedMatch[]> {
  try {
    const res = await fetch(`${baseUrl}/npfl-fixtures.json`, {
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return [];
    const json = await res.json();
    return Array.isArray(json?.matches) ? json.matches : [];
  } catch {
    return [];
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

  const cacheKey = "npfl_v1";
  const cached = await cacheGet(cacheKey, 5 * 60_000);
  if (cached) {
    return {
      statusCode: 200,
      headers: {
        ...cors,
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=300",
      },
      body: JSON.stringify({ ...cached, source: "cache" }),
    };
  }

  const matches: MappedMatch[] = [];
  let provider = "thesportsdb";

  try {
    const base = `https://www.thesportsdb.com/api/v1/json/${TSDB_KEY}`;
    const [pastRes, nextRes] = await Promise.all([
      fetch(`${base}/eventspastleague.php?id=${NPFL_ID}`),
      fetch(`${base}/eventsnextleague.php?id=${NPFL_ID}`),
    ]);
    const past = pastRes.ok ? await pastRes.json() : {};
    const next = nextRes.ok ? await nextRes.json() : {};
    const pastEv = Array.isArray(past?.events) ? past.events : [];
    const nextEv = Array.isArray(next?.events) ? next.events : [];
    for (const e of pastEv.slice(0, 15)) matches.push(mapEvent(e, "result"));
    for (const e of nextEv.slice(0, 15)) matches.push(mapEvent(e, "fixture"));
  } catch (err) {
    console.warn("[npfl] TheSportsDB failed", err);
  }

  if (!matches.length) {
    // Static weekly file + optional API-Football emergency (kept in football.ts)
    const site =
      process.env.URL ||
      process.env.DEPLOY_PRIME_URL ||
      process.env.APP_URL ||
      "https://footbalfan.netlify.app";
    const staticMatches = await fetchStaticFallback(site.replace(/\/$/, ""));
    if (staticMatches.length) {
      matches.push(...staticMatches);
      provider = "static";
    } else {
      // Emergency: try API-Football NPFL league 399 via existing helper if key present
      try {
        const { callApiFootballJson } = await import("./_apiFootball");
        const season = String(new Date().getFullYear());
        const rows = await callApiFootballJson("fixtures", {
          league: "399",
          season,
        });
        for (const row of rows.slice(0, 30)) {
          const short = String(row?.fixture?.status?.short || "");
          const st =
            ["1H", "2H", "HT", "ET", "LIVE"].includes(short)
              ? "live"
              : ["FT", "AET", "PEN"].includes(short)
                ? "result"
                : "fixture";
          matches.push({
            id: String(row?.fixture?.id),
            home: String(row?.teams?.home?.name || "TBD"),
            away: String(row?.teams?.away?.name || "TBD"),
            time: st === "result" ? "FT" : String(row?.fixture?.date || "—").slice(0, 16),
            league: "NPFL",
            status: st as any,
            homeScore: row?.goals?.home ?? undefined,
            awayScore: row?.goals?.away ?? undefined,
          });
        }
        if (matches.length) provider = "api-football-fallback";
      } catch {
        /* ignore */
      }
    }
  }

  const payload = {
    matches,
    source: provider,
    league: "NPFL",
    generatedAt: new Date().toISOString(),
  };
  if (matches.length) await cacheSet(cacheKey, payload);

  return {
    statusCode: 200,
    headers: {
      ...cors,
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=300",
    },
    body: JSON.stringify(payload),
  };
};
