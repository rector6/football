import type { Handler, HandlerEvent } from "@netlify/functions";
import { corsHeaders, supabaseAdmin } from "./_apiFootball";

/** ESPN free public site API — no key, good for live scoreboard */
const LEAGUE_MAP: Record<string, string> = {
  epl: "eng.1",
  laliga: "esp.1",
  ucl: "uefa.champions",
  seriea: "ita.1",
  bundesliga: "ger.1",
  ligue1: "fra.1",
  mls: "usa.1",
};

const DEFAULT_LEAGUES = ["epl", "laliga", "ucl", "seriea", "bundesliga", "ligue1"];

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

function mapEspnEvent(ev: any, leagueLabel: string): MappedMatch | null {
  const comps = ev?.competitions?.[0];
  if (!comps) return null;
  const home = comps.competitors?.find((c: any) => c.homeAway === "home");
  const away = comps.competitors?.find((c: any) => c.homeAway === "away");
  const state = String(ev?.status?.type?.state || "").toLowerCase();
  const desc = String(ev?.status?.type?.description || "").toLowerCase();
  let status: "live" | "fixture" | "result" = "fixture";
  if (state === "in" || desc.includes("half") || desc.includes("live")) status = "live";
  else if (state === "post" || desc.includes("final")) status = "result";

  const clock = ev?.status?.displayClock || ev?.status?.type?.shortDetail || "";
  const detail = ev?.status?.type?.shortDetail || clock || "—";

  return {
    id: String(ev?.id || `${leagueLabel}-${home?.team?.displayName}-${away?.team?.displayName}`),
    home: String(home?.team?.displayName || home?.team?.shortDisplayName || "TBD"),
    away: String(away?.team?.displayName || away?.team?.shortDisplayName || "TBD"),
    time: status === "live" ? String(clock || detail) : detail,
    league: leagueLabel,
    status,
    homeScore: home?.score != null ? Number(home.score) : undefined,
    awayScore: away?.score != null ? Number(away.score) : undefined,
    minute: status === "live" ? String(clock || detail) : undefined,
  };
}

async function readEspnCache(key: string, ttlMs: number) {
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

async function writeEspnCache(key: string, payload: unknown) {
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

  const params = event.queryStringParameters || {};
  const endpoint = String(params.endpoint || "scoreboard").toLowerCase();
  if (!["scoreboard", "standings", "teams"].includes(endpoint)) {
    return {
      statusCode: 400,
      headers: { ...cors, "Content-Type": "application/json" },
      body: JSON.stringify({
        error: "endpoint must be scoreboard, standings, or teams",
      }),
    };
  }

  const leagueParam = String(params.league || "all").toLowerCase();
  const leagues =
    leagueParam === "all"
      ? DEFAULT_LEAGUES
      : leagueParam.split(",").map((s) => s.trim()).filter((s) => LEAGUE_MAP[s]);

  const cacheKey = `espn_${endpoint}_${leagues.join("_")}`;
  const ttl = endpoint === "scoreboard" ? 30_000 : 5 * 60_000;
  const cached = await readEspnCache(cacheKey, ttl);
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
    if (endpoint === "scoreboard") {
      const allMatches: MappedMatch[] = [];
      for (const key of leagues) {
        const slug = LEAGUE_MAP[key];
        const url = `https://site.api.espn.com/apis/site/v2/sports/soccer/${slug}/scoreboard`;
        const res = await fetch(url, {
          headers: { Accept: "application/json", "User-Agent": "FootballFansTribe/1.0" },
        });
        if (!res.ok) continue;
        const json = await res.json();
        const events = Array.isArray(json?.events) ? json.events : [];
        const label =
          key === "epl"
            ? "Premier League"
            : key === "laliga"
              ? "La Liga"
              : key === "ucl"
                ? "Champions League"
                : key === "seriea"
                  ? "Serie A"
                  : key === "bundesliga"
                    ? "Bundesliga"
                    : key === "ligue1"
                      ? "Ligue 1"
                      : key.toUpperCase();
        for (const ev of events) {
          const m = mapEspnEvent(ev, label);
          if (m) allMatches.push(m);
        }
      }

      const hasLive = allMatches.some((m) => m.status === "live");
      const ticker = (hasLive
        ? allMatches.filter((m) => m.status === "live")
        : allMatches.slice(0, 6)
      ).map((m) => ({
        id: m.id,
        home: m.home.slice(0, 3).toUpperCase(),
        away: m.away.slice(0, 3).toUpperCase(),
        homeScore: m.homeScore ?? 0,
        awayScore: m.awayScore ?? 0,
        minute: m.minute || m.time,
        league: m.league.slice(0, 14),
      }));

      const payload = {
        matches: allMatches,
        ticker,
        hasLive,
        source: "espn",
        generatedAt: new Date().toISOString(),
      };
      await writeEspnCache(cacheKey, payload);
      return {
        statusCode: 200,
        headers: {
          ...cors,
          "Content-Type": "application/json",
          "Cache-Control": hasLive ? "public, max-age=20" : "public, max-age=60",
        },
        body: JSON.stringify(payload),
      };
    }

    // standings / teams — proxy first league only for simplicity
    const key = leagues[0] || "epl";
    const slug = LEAGUE_MAP[key];
    const url = `https://site.api.espn.com/apis/site/v2/sports/soccer/${slug}/${endpoint}`;
    const res = await fetch(url, {
      headers: { Accept: "application/json", "User-Agent": "FootballFansTribe/1.0" },
    });
    const text = await res.text();
    let json: any;
    try {
      json = JSON.parse(text);
    } catch {
      json = { error: text.slice(0, 200) };
    }
    const payload = { data: json, source: "espn", league: key };
    await writeEspnCache(cacheKey, payload);
    return {
      statusCode: res.ok ? 200 : 503,
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
        ticker: [],
        hasLive: false,
        source: "espn",
        error: err instanceof Error ? err.message : "ESPN failed",
      }),
    };
  }
};
