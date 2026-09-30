import React, { useEffect, useState } from "react";
import { Clock } from "lucide-react";
import { fetchNews, type FeedArticle } from "../lib/api";

const FILTERS = ["All", "Transfers", "Match Reports", "Analysis", "Nigeria"] as const;

function timeAgo(iso?: string | null) {
  if (!iso) return "";
  const t = Date.parse(iso);
  if (!Number.isFinite(t)) return "";
  const mins = Math.max(0, Math.round((Date.now() - t) / 60000));
  if (mins < 60) return `${mins}m ago`;
  const h = Math.round(mins / 60);
  if (h < 48) return `${h}h ago`;
  return `${Math.round(h / 24)}d ago`;
}

export function NewsPage({ onOpen }: { onOpen: (a: FeedArticle) => void }) {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");
  const [articles, setArticles] = useState<FeedArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      const list = await fetchNews({
        category: filter === "All" ? undefined : filter,
        limit: 30,
      });
      if (!cancelled) {
        setArticles(list);
        setLoading(false);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [filter]);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-black text-slate-900">News</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          AI briefs from BBC, Sky, ESPN, Goal &amp; Guardian — open the source for the full story
        </p>
      </div>

      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {FILTERS.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setFilter(c)}
            className={`shrink-0 rounded-full px-3.5 py-1.5 text-[11px] font-bold ${
              filter === c ? "bg-brand-600 text-white" : "glass text-slate-600"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-center text-sm text-slate-500 py-10">Loading stories…</p>
      ) : articles.length === 0 ? (
        <div className="rounded-2xl glass p-6 text-center space-y-2">
          <p className="text-sm font-bold text-slate-800">No stories yet</p>
          <p className="text-xs text-slate-500">
            Run ingest once: open <code className="font-mono text-[10px]">/api/news-ingest</code> after
            SQL migration + GEMINI_API_KEY (optional).
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {articles.map((a) => (
            <button
              key={a.id}
              type="button"
              onClick={() => onOpen(a)}
              className="text-left rounded-2xl glass overflow-hidden active:scale-[0.99] flex flex-col"
            >
              <div
                className="h-32 bg-slate-200 bg-cover bg-center"
                style={{
                  backgroundImage: a.image
                    ? `url(${a.image})`
                    : "linear-gradient(135deg,#0f172a,#059669)",
                }}
              />
              <div className="p-3.5 flex-1 flex flex-col">
                <p className="text-[9px] font-black uppercase text-brand-600">
                  {a.category || "Football"}
                </p>
                <p className="text-sm font-bold text-slate-900 leading-snug mt-0.5 line-clamp-2">
                  {a.title}
                </p>
                <p className="text-xs text-slate-500 mt-1.5 line-clamp-2">{a.summary}</p>
                <div className="mt-auto pt-2 flex items-center gap-2 text-[10px] text-slate-400 font-semibold">
                  <span>{a.source}</span>
                  <span>·</span>
                  <Clock className="h-3 w-3" />
                  <span>{timeAgo(a.published_at || a.created_at)}</span>
                </div>
                {a.tags && a.tags.length > 0 ? (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {a.tags.slice(0, 3).map((t) => (
                      <span
                        key={t}
                        className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[9px] font-bold text-slate-600"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
