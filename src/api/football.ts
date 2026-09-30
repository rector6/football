import type { ScheduledMatch, LiveMatch } from "../data";
import { ALL_MATCHES, LIVE_TICKER } from "../data";

type ScoresBundleResponse = {
  matches?: ScheduledMatch[];
  ticker?: LiveMatch[];
  source?: "api" | "cache" | "demo";
  hasLive?: boolean;
  error?: string;
  generatedAt?: string;
};

/**
 * Phase 2 — single call to /api/scores (server aggregates + Supabase cache).
 * Demo data is only used if the API returns nothing.
 */
export async function fetchScoresBundle(): Promise<{
  matches: ScheduledMatch[];
  ticker: LiveMatch[];
  source: "api" | "cache" | "demo";
  hasLive: boolean;
  error?: string;
}> {
  try {
    const res = await fetch("/api/scores", {
      headers: { Accept: "application/json" },
    });
    if (!res.ok) {
      return {
        matches: ALL_MATCHES,
        ticker: LIVE_TICKER,
        source: "demo",
        hasLive: false,
        error: `Scores HTTP ${res.status}`,
      };
    }
    const json = (await res.json()) as ScoresBundleResponse;
    const matches = Array.isArray(json.matches) ? json.matches : [];
    const ticker = Array.isArray(json.ticker) ? json.ticker : [];

    if (!matches.length) {
      return {
        matches: ALL_MATCHES,
        ticker: LIVE_TICKER,
        source: "demo",
        hasLive: false,
        error: json.error || "No fixtures; showing demo data.",
      };
    }

    return {
      matches,
      ticker: ticker.length
        ? ticker
        : matches
            .filter((m) => m.status === "live")
            .slice(0, 8)
            .map((m) => ({
              id: m.id,
              home: m.home.slice(0, 3).toUpperCase(),
              away: m.away.slice(0, 3).toUpperCase(),
              homeScore: m.homeScore ?? 0,
              awayScore: m.awayScore ?? 0,
              minute: m.minute || m.time,
              league: m.league.slice(0, 14),
            })),
      source: json.source === "cache" ? "cache" : "api",
      hasLive: Boolean(json.hasLive),
      error: json.error,
    };
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
