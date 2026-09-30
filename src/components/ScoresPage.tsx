import React, { useEffect, useState } from 'react';
import type { ScheduledMatch, LiveMatch } from '../data';
import { CREST_COLORS } from '../data';
import { fetchScoresBundle } from '../api/football';

function Crest({ name }: { name: string }) {
  const color = CREST_COLORS[name.charCodeAt(0) % CREST_COLORS.length];
  return (
    <div
      className={`h-7 w-7 ${color} rounded-full flex items-center justify-center text-[10px] font-black text-white shrink-0`}
    >
      {name.slice(0, 2).toUpperCase()}
    </div>
  );
}

function LiveDot() {
  return <span className="live-dot inline-block h-1.5 w-1.5 rounded-full bg-live" />;
}

export function ScoresPage() {
  const [tab, setTab] = useState<'live' | 'fixture' | 'result'>('live');
  const [matches, setMatches] = useState<ScheduledMatch[]>([]);
  const [ticker, setTicker] = useState<LiveMatch[]>([]);
  const [source, setSource] = useState<'live' | 'cached' | 'scheduled' | 'demo'>('scheduled');
  const [hasLive, setHasLive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [updatedAt, setUpdatedAt] = useState<string>('');

  useEffect(() => {
    let cancelled = false;
    let timer: number | undefined;

    async function load() {
      const bundle = await fetchScoresBundle();
      if (cancelled) return;
      setMatches(bundle.matches);
      setTicker(bundle.ticker);
      setSource(bundle.source);
      setHasLive(bundle.hasLive);
      setLoading(false);
      setUpdatedAt(
        new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      );

      const delay = bundle.hasLive ? 60_000 : 180_000;
      if (timer) window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        void load();
      }, delay);
    }

    void load();
    return () => {
      cancelled = true;
      if (timer) window.clearTimeout(timer);
    };
  }, []);

  const filtered = matches.filter((m) => m.status === tab);
  const leagues = [...new Set(filtered.map((m) => m.league))];

  const badge =
    source === 'demo' ? (
      <span className="shrink-0 rounded-full bg-amber-100 px-2.5 py-1 text-[10px] font-black uppercase text-amber-800">
        Scheduled
      </span>
    ) : source === 'cached' ? (
      <span className="shrink-0 rounded-full bg-sky-100 px-2.5 py-1 text-[10px] font-black uppercase text-sky-800">
        Cached
      </span>
    ) : source === 'live' ? (
      <span className="shrink-0 rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-black uppercase text-emerald-800">
        Live
      </span>
    ) : (
      <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-black uppercase text-slate-700">
        Scheduled
      </span>
    );

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-black text-slate-900">Live scores</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            ESPN · football-data · NPFL
            {updatedAt ? ` · Updated ${updatedAt}` : ''}
            {hasLive ? ' · Auto-refresh 60s' : ''}
          </p>
        </div>
        {badge}
      </div>
      <div className="flex gap-1.5 p-1 rounded-2xl glass">
        {(['live', 'fixture', 'result'] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`flex-1 rounded-xl py-2.5 text-[11px] font-black uppercase ${
              tab === t ? 'bg-brand-600 text-white' : 'text-slate-500'
            }`}
          >
            {t === 'live' ? 'Live' : t === 'fixture' ? 'Fixtures' : 'Results'}
          </button>
        ))}
      </div>
      {loading && matches.length === 0 ? (
        <p className="text-center text-sm text-slate-500 py-8">Loading scores…</p>
      ) : null}
      {tab === 'live' && ticker.length > 0 && (
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {ticker.map((m) => (
            <div key={m.id} className="shrink-0 w-[132px] rounded-2xl glass p-3">
              <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase text-live">
                <LiveDot /> Live
              </span>
              <div className="mt-2 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Crest name={m.home} />
                  <span className="text-xs font-bold">{m.home}</span>
                </div>
                <span className="text-sm font-black text-brand-600">{m.homeScore}</span>
              </div>
              <div className="mt-1 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Crest name={m.away} />
                  <span className="text-xs font-bold">{m.away}</span>
                </div>
                <span className="text-sm font-black">{m.awayScore}</span>
              </div>
              <p className="mt-1.5 text-[10px] text-slate-400 text-right">{m.minute}</p>
            </div>
          ))}
        </div>
      )}
      {leagues.map((league) => (
        <div key={league} className="space-y-2">
          <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">
            {league}
          </h2>
          <div className="rounded-2xl glass divide-y divide-slate-100">
            {filtered
              .filter((m) => m.league === league)
              .map((m) => (
                <div key={m.id} className="flex items-center gap-3 p-3.5">
                  <div className="flex-1 space-y-1.5 min-w-0">
                    <div className="flex items-center gap-2">
                      <Crest name={m.home} />
                      <span className="text-sm font-bold truncate">{m.home}</span>
                      {m.status !== 'fixture' && (
                        <span className="ml-auto text-sm font-black">{m.homeScore}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Crest name={m.away} />
                      <span className="text-sm font-bold truncate">{m.away}</span>
                      {m.status !== 'fixture' && (
                        <span className="ml-auto text-sm font-black">{m.awayScore}</span>
                      )}
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-slate-400">
                    {m.status === 'live' ? (
                      <span className="text-live inline-flex items-center gap-1">
                        <LiveDot />
                        {m.minute}
                      </span>
                    ) : (
                      m.time
                    )}
                  </span>
                </div>
              ))}
          </div>
        </div>
      ))}
      {!loading && filtered.length === 0 ? (
        <p className="text-center text-sm text-slate-500 py-6">No {tab} matches right now.</p>
      ) : null}
    </div>
  );
}
