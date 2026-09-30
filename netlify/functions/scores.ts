import type { Handler, HandlerEvent } from "@netlify/functions";
import {
  callApiFootballJson,
  canCallApiFootball,
  corsHeaders,
  supabaseAdmin,
} from "./_apiFootball";

/** League set for Football Fans Tribe (API-Football ids) */
const LEAGUES: { id: number; label: string }[] = [
  { id: 39, label: "Premier League" },
  { id: 140, label: "La Liga" },
  { id: 2, label: "Champions League" },
  { id: 399, label: "NPFL" },
  { id: 6, label: "AFCON" },
  { id: 29, label: "AFCON Qualifiers" },
];

const CACHE_KEY_LIVE = "scores_live_v1";
const CACHE_KEY_TODAY = "scores_today_v1";

/** Tiered TTLs */
const TTL_LIVE_MS = 30_000; // live matches: 30s
const TTL_TODAY_MS = 5 * 60_000; // today's fixtures: 5 min
const TTL_RESULTS_MS = 60 * 60_000; // results / past: 1 hour

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

type LiveTicker = {
  id: string;
  home: string;
  away: string;
  homeScore: number;
  awayScore: number;
  minute: string;
  league: string;
};

type Bundle = {
  matches: MappedMatch[];
  ticker: LiveTicker[];
  source: "api" | "cache" | "demo";
  generatedAt: string;
  hasLive: boolean;
  error?: string;
  quotaBlocked?: boolean;
};

function mapStatus(short: string): "live" | "fixture" | "result" {
  if (["1H", "2H", "HT", "ET", "BT", "P", "LIVE"].includes(short))
    return "live";
  if (["FT", "AET", "PEN"].includes(short)) return "result";
  return "fixture";
}

function mapFixture(row: any): MappedMatch {
  const st = mapStatus(String(row?.fixture?.status?.short || ""));
  const elapsed = row?.fixture?.status?.elapsed as number | null;
  const date = String(row?.fixture?.date || "");
  const time =
    st === "live" && elapsed != null
      ? `${elapsed}'`
      : st === "result"
        ? "FT"
        : date
          ? new Date(date).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })
          : "—";
  return {
    id: String(row?.fixture?.id ?? ""),
    home: String(row?.teams?.home?.name || "TBD"),
    away: String(row?.teams?.away?.name || "TBD"),
    time,
    league: String(row?.league?.name || "Football"),
    status: st,
    homeScore: row?.goals?.home ?? undefined,
    awayScore: row?.goals?.away ?? undefined,
    minute: st === "live" && elapsed != null ? `${elapsed}'` : undefined,
  };
}

function buildTicker(matches: MappedMatch[]): LiveTicker[] {
  const live = matches.filter((m) => m.status === "live");
  const base = live.length ? live : matches.slice(0, 6);
  return base.map((m) => ({
    id: m.id,
    home: m.home.slice(0, 3).toUpperCase(),
    away: m.away.slice(0, 3).toUpperCase(),
    homeScore: m.homeScore ?? 0,
    awayScore: m.awayScore ?? 0,
    minute: m.minute || m.time,
    league: m.league.slice(0, 14),
  }));
}

function ttlForBundle(bundle: Bundle): number {
  if (bundle.hasLive) return TTL_LIVE_MS;
  const onlyResults =
    bundle.matches.length > 0 &&
    bundle.matches.every((m) => m.status === "result");
  if (onlyResults) return TTL_RESULTS_MS;
  return TTL_TODAY_MS;
}

function cacheKeyFor(hasLive: boolean): string {
  return hasLive ? CACHE_KEY_LIVE : CACHE_KEY_TODAY;
}

async function readCache(
  key: string,
  maxAgeMs: number,
  allowStale = false,
): Promise<Bundle | null> {
  const sb = supabaseAdmin();
  if (!sb) return null;
  try {
    const { data, error } = await sb
      .from("scores_cache")
      .select("payload, updated_at")
      .eq("cache_key", key)
      .maybeSingle();
    if (error || !data?.payload) return null;
    const updated = Date.parse(String(data.updated_at));
    const age = Date.now() - updated;
    if (!Number.isFinite(updated)) return null;
    if (!allowStale && age > maxAgeMs) return null;
    const payload = data.payload as Bundle;
    return { ...payload, source: "cache" };
  } catch {
    return null;
  }
}

async function readAnyFreshOrStale(): Promise<Bundle | null> {
  // Prefer live key, then today key — even if stale (quota / 429 fallback)
  for (const key of [CACHE_KEY_LIVE, CACHE_KEY_TODAY]) {
    const hit = await readCache(key, TTL_RESULTS_MS, true);
    if (hit?.matches?.length) return hit;
  }
  return null;
}

async function writeCache(key: string, bundle: Bundle): Promise<void> {
  const sb = supabaseAdmin();
  if (!sb) return;
  try {
    await sb.from("scores_cache").upsert(
      {
        cache_key: key,
        payload: bundle,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "cache_key" },
    );
  } catch {
    /* non-fatal */
  }
}

async function fetchLiveBundle(): Promise<Bundle> {
  const today = new Date().toISOString().slice(0, 10);
  const season = String(new Date().getFullYear());
  const key = process.env.API_FOOTBALL_KEY?.trim();

  if (!key) {
    return {
      matches: [],
      ticker: [],
      source: "demo",
      generatedAt: new Date().toISOString(),
      hasLive: false,
      error: "API_FOOTBALL_KEY is not configured",
    };
  }

  // Quota guard before any upstream calls
  if (!(await canCallApiFootball())) {
    const stale = await readAnyFreshOrStale();
    if (stale) {
      return {
        ...stale,
        source: "cache",
        quotaBlocked: true,
        error: "Daily API quota soft-limit — serving cached scores",
      };
    }
    return {
      matches: [],
      ticker: [],
      source: "demo",
      generatedAt: new Date().toISOString(),
      hasLive: false,
      quotaBlocked: true,
      error: "Daily API quota soft-limit and no cache available",
    };
  }

  // 1) Live matches (1 call)
  const liveRows = await callApiFootballJson("fixtures", { live: "all" });
  const liveMapped = liveRows.map(mapFixture);
  const liveFiltered = liveMapped.filter((m) => {
    const n = m.league.toLowerCase();
    return (
      n.includes("premier") ||
      n.includes("la liga") ||
      n.includes("champions") ||
      n.includes("npfl") ||
      n.includes("nigeria") ||
      n.includes("africa") ||
      n.includes("afcon") ||
      n.includes("caf")
    );
  });
  const liveUse = liveFiltered.length ? liveFiltered : liveMapped.slice(0, 40);

  // 2) Today's fixtures per league — sequential to avoid burst 429
  const batches: any[][] = [];
  for (const l of LEAGUES) {
    if (!(await canCallApiFootball())) break;
    const rows = await callApiFootballJson("fixtures", {
      league: String(l.id),
      season,
      date: today,
    });
    batches.push(rows);
  }

  const byId = new Map<string, MappedMatch>();
  for (const m of liveUse) {
    if (m.id) byId.set(m.id, m);
  }
  for (const rows of batches) {
    for (const row of rows) {
      const m = mapFixture(row);
      if (!m.id) continue;
      if (!byId.has(m.id) || m.status === "live") byId.set(m.id, m);
    }
  }

  // 3) Fallback window if empty
  if (byId.size === 0 && (await canCallApiFootball())) {
    const from = today;
    const toDate = new Date();
    toDate.setDate(toDate.getDate() + 7);
    const to = toDate.toISOString().slice(0, 10);
    for (const id of [39, 399, 2]) {
      if (!(await canCallApiFootball())) break;
      const rows = await callApiFootballJson("fixtures", {
        league: String(id),
        season,
        from,
        to,
      });
      for (const row of rows) {
        const m = mapFixture(row);
        if (m.id) byId.set(m.id, m);
      }
    }
  }

  const matches = [...byId.values()].sort((a, b) => {
    const order = { live: 0, fixture: 1, result: 2 };
    return order[a.status] - order[b.status];
  });

  const hasLive = matches.some((m) => m.status === "live");
  const bundle: Bundle = {
    matches,
    ticker: buildTicker(matches),
    source: matches.length ? "api" : "demo",
    generatedAt: new Date().toISOString(),
    hasLive,
    error: matches.length ? undefined : "No fixtures returned for today",
  };

  if (matches.length) {
    await writeCache(cacheKeyFor(hasLive), bundle);
    // also refresh the other key lightly so stale readers still work
    await writeCache(CACHE_KEY_TODAY, bundle);
  }
  return bundle;
}

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

  const force = event.queryStringParameters?.refresh === "true";

  try {
    if (!force) {
      // Try live cache (30s) then today cache (5 min)
      const liveHit = await readCache(CACHE_KEY_LIVE, TTL_LIVE_MS);
      if (liveHit?.matches?.length) {
        return {
          statusCode: 200,
          headers: {
            ...cors,
            "Content-Type": "application/json",
            "Cache-Control": "public, max-age=20",
          },
          body: JSON.stringify(liveHit),
        };
      }
      const todayHit = await readCache(CACHE_KEY_TODAY, TTL_TODAY_MS);
      if (todayHit?.matches?.length) {
        return {
          statusCode: 200,
          headers: {
            ...cors,
            "Content-Type": "application/json",
            "Cache-Control": "public, max-age=60",
          },
          body: JSON.stringify(todayHit),
        };
      }
    }

    const bundle = await fetchLiveBundle();
    const maxAge = Math.floor(ttlForBundle(bundle) / 1000);
    return {
      statusCode: 200,
      headers: {
        ...cors,
        "Content-Type": "application/json",
        "Cache-Control": `public, max-age=${Math.min(maxAge, 300)}`,
      },
      body: JSON.stringify(bundle),
    };
  } catch (err) {
    const stale = await readAnyFreshOrStale();
    if (stale) {
      return {
        statusCode: 200,
        headers: {
          ...cors,
          "Content-Type": "application/json",
          "Cache-Control": "public, max-age=30",
        },
        body: JSON.stringify({
          ...stale,
          error: err instanceof Error ? err.message : "Scores failed",
        }),
      };
    }
    const message = err instanceof Error ? err.message : "Scores failed";
    return {
      statusCode: 200,
      headers: {
        ...cors,
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
      },
      body: JSON.stringify({
        matches: [],
        ticker: [],
        source: "demo",
        generatedAt: new Date().toISOString(),
        hasLive: false,
        error: message,
      } as Bundle),
    };
  }
};
