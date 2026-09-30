import type { Handler, HandlerEvent } from "@netlify/functions";
import { createClient } from "@supabase/supabase-js";

/** League set for Football Fans Tribe (API-Football ids) */
const LEAGUES: { id: number; label: string }[] = [
  { id: 39, label: "Premier League" },
  { id: 140, label: "La Liga" },
  { id: 2, label: "Champions League" },
  { id: 399, label: "NPFL" },
  { id: 6, label: "AFCON" },
  { id: 29, label: "AFCON Qualifiers" },
];

const CACHE_KEY = "scores_bundle_v1";
/** Fresh cache window — short so live minutes stay accurate */
const CACHE_TTL_MS = 45_000;

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
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
};

function mapStatus(short: string): "live" | "fixture" | "result" {
  if (["1H", "2H", "HT", "ET", "BT", "P", "LIVE"].includes(short)) return "live";
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
          ? new Date(date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
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

function supabaseAdmin() {
  const url = process.env.SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

async function readCache(): Promise<Bundle | null> {
  const sb = supabaseAdmin();
  if (!sb) return null;
  try {
    const { data, error } = await sb
      .from("scores_cache")
      .select("payload, updated_at")
      .eq("cache_key", CACHE_KEY)
      .maybeSingle();
    if (error || !data?.payload) return null;
    const updated = Date.parse(String(data.updated_at));
    if (!Number.isFinite(updated) || Date.now() - updated > CACHE_TTL_MS) {
      return null;
    }
    const payload = data.payload as Bundle;
    return { ...payload, source: "cache" };
  } catch {
    return null;
  }
}

async function writeCache(bundle: Bundle): Promise<void> {
  const sb = supabaseAdmin();
  if (!sb) return;
  try {
    await sb.from("scores_cache").upsert(
      {
        cache_key: CACHE_KEY,
        payload: bundle,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "cache_key" },
    );
  } catch {
    /* non-fatal */
  }
}

async function apiFootball(
  path: string,
  params: Record<string, string>,
): Promise<any[]> {
  const key = process.env.API_FOOTBALL_KEY?.trim();
  if (!key) return [];
  const qs = new URLSearchParams(params);
  const url = `https://v3.football.api-sports.io/${path}?${qs.toString()}`;
  const res = await fetch(url, {
    headers: { "x-apisports-key": key, Accept: "application/json" },
  });
  if (!res.ok) return [];
  const json = await res.json();
  return Array.isArray(json?.response) ? json.response : [];
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

  // 1) All currently live matches (one call — efficient)
  const liveRows = await apiFootball("fixtures", { live: "all" });
  const liveMapped = liveRows.map(mapFixture);

  // Keep only our target competitions when possible
  const leagueNames = new Set(
    LEAGUES.map((l) => l.label.toLowerCase()),
  );
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

  // 2) Today's fixtures per league (fixtures + results)
  const batches = await Promise.all(
    LEAGUES.map((l) =>
      apiFootball("fixtures", {
        league: String(l.id),
        season,
        date: today,
      }).catch(() => [] as any[]),
    ),
  );

  const byId = new Map<string, MappedMatch>();
  for (const m of liveUse) {
    if (m.id) byId.set(m.id, m);
  }
  for (const rows of batches) {
    for (const row of rows) {
      const m = mapFixture(row);
      if (!m.id) continue;
      // Prefer live version if already present
      if (!byId.has(m.id) || m.status === "live") byId.set(m.id, m);
    }
  }

  // 3) If still empty, try next 7 days for EPL + NPFL (upcoming fixtures)
  if (byId.size === 0) {
    const from = today;
    const toDate = new Date();
    toDate.setDate(toDate.getDate() + 7);
    const to = toDate.toISOString().slice(0, 10);
    for (const id of [39, 399, 2]) {
      const rows = await apiFootball("fixtures", {
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

  if (matches.length) await writeCache(bundle);
  return bundle;
}

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

  const force = event.queryStringParameters?.refresh === "true";

  try {
    if (!force) {
      const cached = await readCache();
      if (cached && cached.matches?.length) {
        return {
          statusCode: 200,
          headers: {
            ...cors,
            "Content-Type": "application/json",
            "Cache-Control": "public, max-age=30",
          },
          body: JSON.stringify(cached),
        };
      }
    }

    const bundle = await fetchLiveBundle();
    return {
      statusCode: 200,
      headers: {
        ...cors,
        "Content-Type": "application/json",
        "Cache-Control": bundle.hasLive
          ? "public, max-age=20"
          : "public, max-age=60",
      },
      body: JSON.stringify(bundle),
    };
  } catch (err) {
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
