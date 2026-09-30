import type { ScheduledMatch, LiveMatch } from "../data";
import { ALL_MATCHES, LIVE_TICKER } from "../data";

type Bundle = {
  matches: ScheduledMatch[];
  ticker: LiveMatch[];
  source: "live" | "cached" | "scheduled" | "demo";
  hasLive: boolean;
  error?: string;
};

async function getJson(url: string): Promise<any | null> {
  try {
    const res = await fetch(url, { headers: { Accept: "application/json" } });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

function asMatches(raw: any): ScheduledMatch[] {
  if (!raw) return [];
  if (Array.isArray(raw.matches)) return raw.matches as ScheduledMatch[];
  return [];
}

/**
 * Hybrid scores:
 * - Live / Results → ESPN
 * - Fixtures → football-data.org
 * - NPFL → TheSportsDB (+ static / API-Football fallback)
 */
export async function fetchScoresBundle(): Promise<Bundle> {
  try {
    const [espn, fdPl, fdCl, npfl] = await Promise.all([
      getJson("/api/espn?endpoint=scoreboard&league=all"),
      getJson("/api/football-data?resource=matches&competition=PL"),
      getJson("/api/football-data?resource=matches&competition=CL"),
      getJson("/api/npfl"),
    ]);

    const espnMatches = asMatches(espn);
    const fdMatches = [...asMatches(fdPl), ...asMatches(fdCl)];
    const npflMatches = asMatches(npfl);

    const byId = new Map<string, ScheduledMatch>();
    // Prefer ESPN for live/results accuracy
    for (const m of espnMatches) {
      if (m?.id) byId.set(String(m.id), m);
    }
    // Fill fixtures from football-data when ESPN has no row
    for (const m of fdMatches) {
      if (!m?.id) continue;
      const existing = byId.get(String(m.id));
      if (!existing || (existing.status === "fixture" && m.status === "fixture")) {
        byId.set(String(m.id), m);
      } else if (!existing) {
        byId.set(String(m.id), m);
      }
    }
    // Always attach NPFL
    for (const m of npflMatches) {
      if (m?.id) byId.set(`npfl-${m.id}`, { ...m, league: m.league || "NPFL" });
    }

    let matches = [...byId.values()];

    if (!matches.length) {
      // Last resort: old /api/scores (API-Football)
      const legacy = await getJson("/api/scores");
      matches = asMatches(legacy);
      if (!matches.length) {
        return {
          matches: ALL_MATCHES,
          ticker: LIVE_TICKER,
          source: "demo",
          hasLive: false,
          error: "All score sources empty",
        };
      }
    }

    const hasLive = matches.some((m) => m.status === "live");
    const live = matches.filter((m) => m.status === "live");
    const ticker: LiveMatch[] = (live.length ? live : matches.slice(0, 6)).map(
      (m) => ({
        id: m.id,
        home: m.home.slice(0, 3).toUpperCase(),
        away: m.away.slice(0, 3).toUpperCase(),
        homeScore: m.homeScore ?? 0,
        awayScore: m.awayScore ?? 0,
        minute: m.minute || m.time,
        league: m.league.slice(0, 14),
      }),
    );

    const srcHint = String(espn?.source || fdPl?.source || npfl?.source || "live");
    const source: Bundle["source"] =
      srcHint === "cache"
        ? "cached"
        : hasLive
          ? "live"
          : "scheduled";

    return { matches, ticker, source, hasLive };
  } catch (e) {
    return {
      matches: ALL_MATCHES,
      ticker: LIVE_TICKER,
      source: "demo",
      hasLive: false,
      error: e instanceof Error ? e.message : "Network error",
    };
  }
}
