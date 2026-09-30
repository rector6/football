import type { ScheduledMatch, LiveMatch } from "../data";
import { ALL_MATCHES, LIVE_TICKER } from "../data";
import { fetchFootball } from "../lib/api";

type ApiFixture = {
  fixture: {
    id: number;
    status: { short: string; elapsed: number | null };
    date: string;
  };
  league: { name: string };
  teams: { home: { name: string }; away: { name: string } };
  goals: { home: number | null; away: number | null };
};

type ApiResponse = {
  response?: ApiFixture[];
};

function mapStatus(short: string): "live" | "fixture" | "result" {
  if (["1H", "2H", "HT", "ET", "BT", "P", "LIVE"].includes(short)) return "live";
  if (["FT", "AET", "PEN"].includes(short)) return "result";
  return "fixture";
}

function mapFixture(f: ApiFixture): ScheduledMatch {
  const st = mapStatus(f.fixture.status.short);
  const elapsed = f.fixture.status.elapsed;
  const time =
    st === "live" && elapsed != null
      ? `${elapsed}'`
      : st === "result"
        ? "FT"
        : new Date(f.fixture.date).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          });
  return {
    id: String(f.fixture.id),
    home: f.teams.home.name,
    away: f.teams.away.name,
    time,
    league: f.league.name,
    status: st,
    homeScore: f.goals.home ?? undefined,
    awayScore: f.goals.away ?? undefined,
    minute: st === "live" && elapsed != null ? `${elapsed}'` : undefined,
  };
}

async function getFixtures(
  params: Record<string, string>,
): Promise<ScheduledMatch[]> {
  const json = await fetchFootball<ApiResponse>("fixtures", params);
  if (!json?.response) return [];
  return json.response.map(mapFixture);
}

/** Live + today fixtures for major leagues + Nigeria NPFL. Uses /api/football only. */
export async function fetchScoresBundle(): Promise<{
  matches: ScheduledMatch[];
  ticker: LiveMatch[];
  source: "api" | "demo";
  error?: string;
}> {
  try {
    const today = new Date().toISOString().slice(0, 10);
    const season = String(new Date().getFullYear());
    // 39 EPL, 140 La Liga, 2 UCL, 135 Serie A, 78 Bundesliga, 61 Ligue 1, 399 NPFL
    const leagueIds = [39, 140, 2, 135, 78, 61, 399];
    const batches = await Promise.all(
      leagueIds.map((id) =>
        getFixtures({
          league: String(id),
          season,
          date: today,
        }).catch(() => [] as ScheduledMatch[]),
      ),
    );
    let matches = batches.flat();

    if (matches.length === 0) {
      matches = await getFixtures({ live: "all" });
    }

    if (matches.length === 0) {
      return {
        matches: ALL_MATCHES,
        ticker: LIVE_TICKER,
        source: "demo",
        error: "No fixtures returned; showing demo data.",
      };
    }

    const live = matches.filter((m) => m.status === "live");
    const ticker: LiveMatch[] = (live.length ? live : matches.slice(0, 6)).map(
      (m) => ({
        id: m.id,
        home: m.home.slice(0, 3).toUpperCase(),
        away: m.away.slice(0, 3).toUpperCase(),
        homeScore: m.homeScore ?? 0,
        awayScore: m.awayScore ?? 0,
        minute: m.minute || m.time,
        league: m.league.slice(0, 12),
      }),
    );

    return { matches, ticker, source: "api" };
  } catch (e) {
    return {
      matches: ALL_MATCHES,
      ticker: LIVE_TICKER,
      source: "demo",
      error: e instanceof Error ? e.message : "API error",
    };
  }
}
