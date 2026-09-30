import React, { useEffect, useState } from "react";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { fetchFootball, trackClick, type FeedArticle } from "../lib/api";

const TEAM_HINTS =
  /arsenal|chelsea|liverpool|manchester city|man city|manchester united|man united|tottenham|newcastle|barcelona|real madrid|bayern|psg|inter|milan|nigeria|super eagles/i;

export function ArticlePage({
  article,
  onBack,
}: {
  article: FeedArticle;
  onBack: () => void;
}) {
  const [oddsNote, setOddsNote] = useState<string>("");

  useEffect(() => {
    try {
      window.history.replaceState({}, "", `/news/${article.id}`);
    } catch {
      /* ignore */
    }
  }, [article.id]);

  useEffect(() => {
    let cancelled = false;
    async function loadOdds() {
      const hay = `${article.title} ${(article.tags || []).join(" ")}`;
      if (!TEAM_HINTS.test(hay)) {
        setOddsNote("Odds appear when a match or club is clearly tagged.");
        return;
      }
      // Best-effort: live fixtures odds need a fixture id; show placeholder affiliate frame
      const live = await fetchFootball<{ response?: any[] }>("fixtures", {
        live: "all",
      });
      if (cancelled) return;
      const rows = live?.response || [];
      if (!rows.length) {
        setOddsNote("No live fixture odds right now — check Scores for kick-off times.");
        return;
      }
      setOddsNote(
        `${rows.length} live game(s) on — open Scores for details. Betting partners coming in the affiliate strip below.`,
      );
    }
    void loadOdds();
    return () => {
      cancelled = true;
    };
  }, [article.title, article.tags]);

  const openSource = () => {
    void trackClick("outbound_news", article.source_url, article.id);
    window.open(article.source_url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="space-y-4 max-w-prose mx-auto">
      <button
        type="button"
        onClick={() => {
          try {
            window.history.replaceState({}, "", "/news");
          } catch {
            /* ignore */
          }
          onBack();
        }}
        className="inline-flex items-center gap-1 text-sm font-bold text-brand-600"
      >
        <ArrowLeft className="h-4 w-4" /> Back to news
      </button>

      <p className="text-[10px] font-black uppercase text-brand-600">
        {article.category || "Football"} · {article.source}
      </p>
      <h1 className="text-2xl font-black text-slate-900 leading-tight">{article.title}</h1>

      {article.image ? (
        <img
          src={article.image}
          alt=""
          className="w-full h-48 object-cover rounded-3xl"
          loading="lazy"
        />
      ) : (
        <div className="h-36 rounded-3xl bg-gradient-to-br from-slate-900 to-emerald-700" />
      )}

      <div className="rounded-2xl border border-emerald-100 bg-emerald-50/80 p-4">
        <p className="text-[10px] font-black uppercase tracking-widest text-emerald-800">
          Tribe brief
        </p>
        <p className="mt-2 text-[15px] text-slate-800 leading-relaxed">{article.summary}</p>
      </div>

      <button
        type="button"
        onClick={openSource}
        className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-brand-600 py-3.5 text-sm font-black text-white shadow-md shadow-brand-500/25"
      >
        Read full story at {article.source}
        <ExternalLink className="h-4 w-4" />
      </button>

      <section className="rounded-2xl glass p-4 space-y-2">
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
          Match odds
        </p>
        <p className="text-sm text-slate-600">{oddsNote}</p>
      </section>

      <section className="rounded-2xl border border-dashed border-slate-200 bg-white/70 p-4 text-center space-y-2">
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
          Where to watch / bet
        </p>
        <p className="text-xs text-slate-500">
          Affiliate partners (Bet9ja, 1xBet, BC.Game) will list here — every tap is tracked for revenue.
        </p>
        <div className="flex flex-wrap justify-center gap-2 pt-1">
          {["Bet9ja", "1xBet", "BC.Game"].map((name) => (
            <button
              key={name}
              type="button"
              onClick={() => void trackClick("affiliate_placeholder", name, article.id)}
              className="rounded-full glass px-3 py-1.5 text-[11px] font-bold text-slate-700"
            >
              {name}
            </button>
          ))}
        </div>
      </section>

      {article.tags && article.tags.length > 0 ? (
        <div className="flex flex-wrap gap-1.5">
          {article.tags.map((t) => (
            <span
              key={t}
              className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600"
            >
              {t}
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
}
