import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Home, Trophy, MessagesSquare, ShoppingBag, Newspaper,
  Radio, Send, Plus, X, Flame, ShoppingCart,
  Trash2, Crown, ChevronRight, Clock, ArrowLeft,
} from 'lucide-react';
import {
  PageId, LIVE_TICKER, ALL_MATCHES, PRODUCTS, STARTER_CHAT,
  CREST_COLORS, NEWS, ChatMessage, Product, NewsArticle,
} from './data';

const pageTransition = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -6 },
  transition: { duration: 0.2, ease: 'easeOut' },
};

function Crest({ name, size = 'md' }: { name: string; size?: 'sm' | 'md' }) {
  const color = CREST_COLORS[name.charCodeAt(0) % CREST_COLORS.length];
  const dim = size === 'sm' ? 'h-7 w-7 text-[10px]' : 'h-9 w-9 text-xs';
  return (
    <div className={`${dim} ${color} rounded-full flex items-center justify-center font-black text-white shrink-0`}>
      {name.slice(0, 2).toUpperCase()}
    </div>
  );
}

function LiveDot() {
  return <span className="live-dot inline-block h-1.5 w-1.5 rounded-full bg-tribe-live shadow-live" />;
}

function PageLoader({ show }: { show: boolean }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-tribe-black"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
        >
          <motion.div
            className="h-14 w-14 rounded-2xl bg-tribe-lime flex items-center justify-center shadow-lime"
            animate={{ scale: [1, 1.06, 1] }}
            transition={{ repeat: Infinity, duration: 1.1 }}
          >
            <Flame className="h-7 w-7 text-black" />
          </motion.div>
          <p className="mt-4 text-xs font-black uppercase tracking-[0.2em] text-white">Fans Tribe</p>
          <div className="mt-5 h-1 w-28 rounded-full bg-zinc-800 overflow-hidden">
            <motion.div
              className="h-full bg-tribe-lime rounded-full"
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 0.9, ease: 'easeInOut' }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Nav({ page, setPage, cartCount, onOpenCart }: {
  page: PageId; setPage: (p: PageId) => void; cartCount: number; onOpenCart: () => void;
}) {
  const tabs: { id: PageId; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'Home', icon: <Home className="h-5 w-5" /> },
    { id: 'news', label: 'News', icon: <Newspaper className="h-5 w-5" /> },
    { id: 'scores', label: 'Scores', icon: <Trophy className="h-5 w-5" /> },
    { id: 'forum', label: 'Forum', icon: <MessagesSquare className="h-5 w-5" /> },
    { id: 'shop', label: 'Shop', icon: <ShoppingBag className="h-5 w-5" /> },
  ];

  return (
    <>
      <header className="hidden md:flex fixed top-0 inset-x-0 z-40 h-16 items-center justify-between border-b border-zinc-800/80 bg-tribe-black/90 backdrop-blur-xl px-6">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-tribe-lime flex items-center justify-center shadow-lime">
            <Flame className="h-5 w-5 text-black" />
          </div>
          <div>
            <p className="text-sm font-black uppercase tracking-wider text-white leading-none">Football Fans Tribe</p>
            <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest mt-0.5">News · Scores · Shop</p>
          </div>
        </div>
        <nav className="flex items-center gap-1">
          {tabs.map((t) => (
            <button key={t.id} type="button" onClick={() => setPage(t.id)}
              className={`flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-xs font-bold uppercase tracking-wide transition ${
                page === t.id ? 'bg-tribe-lime/15 text-tribe-lime' : 'text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800/60'
              }`}>
              {t.icon}{t.label}
            </button>
          ))}
        </nav>
        <button type="button" onClick={onOpenCart}
          className="relative rounded-xl border border-zinc-700 bg-tribe-charcoal p-2.5 text-zinc-300 hover:border-tribe-lime/50 hover:text-tribe-lime transition">
          <ShoppingCart className="h-5 w-5" />
          {cartCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] rounded-full bg-tribe-lime text-[10px] font-black text-black flex items-center justify-center px-1">{cartCount}</span>
          )}
        </button>
      </header>

      <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 nav-safe">
        <div className="mx-3 mb-2 rounded-2xl border border-zinc-800/90 bg-tribe-charcoal/95 backdrop-blur-xl shadow-[0_-4px_24px_rgba(0,0,0,0.45)]">
          <div className="flex items-stretch justify-around h-[64px] px-0.5">
            {tabs.map((t) => {
              const active = page === t.id;
              return (
                <button key={t.id} type="button" onClick={() => setPage(t.id)}
                  className="relative flex-1 flex flex-col items-center justify-center gap-0.5 min-h-[48px] active:scale-95 transition-transform">
                  <span className={`flex items-center justify-center h-8 w-10 rounded-xl transition-all duration-200 ${
                    active ? 'bg-tribe-lime text-black shadow-lime' : 'text-zinc-500'
                  }`}>{t.icon}</span>
                  <span className={`text-[9px] font-bold tracking-wide ${active ? 'text-tribe-lime' : 'text-zinc-500'}`}>{t.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>
    </>
  );
}

function HomePage({ onGo, onRead }: { onGo: (p: PageId) => void; onRead: (a: NewsArticle) => void }) {
  const featured = NEWS.filter((n) => n.featured);
  const rest = NEWS.filter((n) => !n.featured).slice(0, 3);
  const shopPreview = PRODUCTS.filter((p) => p.category === 'jersey' || p.category === 'hoodie').slice(0, 4);

  return (
    <div className="space-y-6">
      <section className="px-0.5">
        <p className="text-[11px] font-bold uppercase tracking-widest text-tribe-lime">Welcome back</p>
        <h1 className="text-2xl font-black text-white tracking-tight mt-1">Your football hub</h1>
        <p className="text-sm text-zinc-500 mt-1">News, live scores, fan chat and exclusive merch — in one place.</p>
      </section>

      <section className="grid grid-cols-4 gap-2">
        {([
          { id: 'scores' as PageId, label: 'Scores', icon: '⚽' },
          { id: 'news' as PageId, label: 'News', icon: '📰' },
          { id: 'shop' as PageId, label: 'Shop', icon: '👕' },
          { id: 'forum' as PageId, label: 'Forum', icon: '💬' },
        ]).map((q) => (
          <button key={q.id} type="button" onClick={() => onGo(q.id)}
            className="rounded-2xl border border-zinc-800 bg-tribe-charcoal py-3 px-1 flex flex-col items-center gap-1 active:scale-95 transition">
            <span className="text-xl">{q.icon}</span>
            <span className="text-[10px] font-bold text-zinc-300">{q.label}</span>
          </button>
        ))}
      </section>

      <section>
        <div className="flex items-center gap-2 mb-2.5 px-0.5">
          <Radio className="h-3.5 w-3.5 text-tribe-live" />
          <span className="text-[10px] font-black uppercase tracking-widest text-tribe-live">Live now</span>
          <button type="button" onClick={() => onGo('scores')} className="ml-auto text-[10px] font-bold text-zinc-500 flex items-center gap-0.5">
            All scores <ChevronRight className="h-3 w-3" />
          </button>
        </div>
        <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-1 -mx-1 px-1">
          {LIVE_TICKER.map((m) => (
            <div key={m.id} className="shrink-0 w-[140px] rounded-2xl border border-zinc-800 bg-tribe-charcoal p-3">
              <div className="flex items-center gap-1.5 mb-2">
                <span className="live-badge inline-flex items-center gap-1 rounded-full bg-tribe-live/15 px-1.5 py-0.5 text-[9px] font-black uppercase text-tribe-live">
                  <LiveDot /> Live
                </span>
              </div>
              <div className="flex items-center justify-between gap-1">
                <div className="flex items-center gap-1.5 min-w-0">
                  <Crest name={m.home} size="sm" />
                  <span className="text-xs font-bold text-white truncate">{m.home}</span>
                </div>
                <span className="text-sm font-black text-tribe-lime tabular-nums">{m.homeScore}</span>
              </div>
              <div className="flex items-center justify-between gap-1 mt-1.5">
                <div className="flex items-center gap-1.5 min-w-0">
                  <Crest name={m.away} size="sm" />
                  <span className="text-xs font-bold text-white truncate">{m.away}</span>
                </div>
                <span className="text-sm font-black text-white tabular-nums">{m.awayScore}</span>
              </div>
              <p className="mt-2 text-[10px] font-semibold text-zinc-500 text-right">{m.minute}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-3 px-0.5">
          <h2 className="text-xs font-black uppercase tracking-widest text-zinc-500">Top stories</h2>
          <button type="button" onClick={() => onGo('news')} className="text-[10px] font-bold text-tribe-lime flex items-center gap-0.5">
            All news <ChevronRight className="h-3 w-3" />
          </button>
        </div>
        <div className="space-y-3">
          {featured.map((a) => (
            <button key={a.id} type="button" onClick={() => onRead(a)}
              className="w-full text-left rounded-2xl border border-zinc-800 bg-tribe-charcoal overflow-hidden active:scale-[0.99] transition">
              <div className="bg-gradient-to-br from-zinc-800 to-tribe-black px-4 pt-4 pb-3">
                <span className="text-2xl">{a.emoji}</span>
                <span className="ml-2 text-[9px] font-black uppercase tracking-wider text-tribe-lime">{a.category}</span>
              </div>
              <div className="p-4 pt-3">
                <h3 className="text-base font-bold text-white leading-snug">{a.title}</h3>
                <p className="mt-1.5 text-xs text-zinc-500 line-clamp-2">{a.summary}</p>
                <div className="mt-2 flex items-center gap-2 text-[10px] text-zinc-600 font-semibold">
                  <Clock className="h-3 w-3" /> {a.readMins} min · {a.time}
                </div>
              </div>
            </button>
          ))}
          {rest.map((a) => (
            <button key={a.id} type="button" onClick={() => onRead(a)}
              className="w-full flex gap-3 text-left rounded-2xl border border-zinc-800 bg-tribe-charcoal p-3 active:scale-[0.99] transition">
              <div className="h-12 w-12 rounded-xl bg-zinc-900 flex items-center justify-center text-xl shrink-0">{a.emoji}</div>
              <div className="min-w-0 flex-1">
                <p className="text-[9px] font-black uppercase text-zinc-500">{a.category}</p>
                <p className="text-sm font-bold text-white leading-snug line-clamp-2">{a.title}</p>
                <p className="text-[10px] text-zinc-600 mt-0.5">{a.time}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-3 px-0.5">
          <h2 className="text-xs font-black uppercase tracking-widest text-zinc-500">Jerseys and hoodies</h2>
          <button type="button" onClick={() => onGo('shop')} className="text-[10px] font-bold text-tribe-lime flex items-center gap-0.5">
            Shop all <ChevronRight className="h-3 w-3" />
          </button>
        </div>
        <div className="flex gap-3 overflow-x-auto no-scrollbar -mx-1 px-1 pb-1">
          {shopPreview.map((p) => (
            <button key={p.id} type="button" onClick={() => onGo('shop')}
              className="shrink-0 w-[120px] rounded-2xl border border-zinc-800 bg-tribe-charcoal overflow-hidden text-left">
              <div className="aspect-square bg-zinc-900 flex items-center justify-center text-3xl">{p.emoji}</div>
              <div className="p-2.5">
                <p className="text-xs font-bold text-white line-clamp-1">{p.name}</p>
                <p className="text-xs font-black text-tribe-lime mt-0.5">${p.price.toFixed(2)}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-tribe-lime/25 bg-tribe-lime/5 p-4 flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-tribe-lime/20 flex items-center justify-center shrink-0">
          <Crown className="h-5 w-5 text-tribe-lime" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-white">Tribe Pro</p>
          <p className="text-xs text-zinc-400">Ad-free news, exclusive chats and early merch drops.</p>
        </div>
        <button type="button" className="shrink-0 rounded-xl bg-tribe-lime px-3 py-2 text-[10px] font-black uppercase text-black">Upgrade</button>
      </section>
    </div>
  );
}

function NewsPage({ onRead }: { onRead: (a: NewsArticle) => void }) {
  const [filter, setFilter] = useState('All');
  const cats = ['All', ...Array.from(new Set(NEWS.map((n) => n.category)))];
  const list = filter === 'All' ? NEWS : NEWS.filter((n) => n.category === filter);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-lg font-black uppercase tracking-tight text-white">News</h1>
        <p className="text-xs text-zinc-500 mt-0.5">Stories written for fans — clear and fast to read</p>
      </div>
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 -mx-1 px-1">
        {cats.map((c) => (
          <button key={c} type="button" onClick={() => setFilter(c)}
            className={`shrink-0 rounded-full px-3.5 py-1.5 text-[11px] font-bold transition ${
              filter === c ? 'bg-tribe-lime text-black' : 'bg-tribe-charcoal border border-zinc-800 text-zinc-400'
            }`}>{c}</button>
        ))}
      </div>
      <div className="space-y-3">
        {list.map((a) => (
          <button key={a.id} type="button" onClick={() => onRead(a)}
            className="w-full flex gap-3 text-left rounded-2xl border border-zinc-800 bg-tribe-charcoal p-3.5 active:scale-[0.99] transition">
            <div className="h-14 w-14 rounded-xl bg-zinc-900 flex items-center justify-center text-2xl shrink-0">{a.emoji}</div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-black uppercase text-tribe-lime">{a.category}</span>
                <span className="text-[10px] text-zinc-600">{a.time}</span>
              </div>
              <p className="text-sm font-bold text-white leading-snug mt-0.5 line-clamp-2">{a.title}</p>
              <p className="text-xs text-zinc-500 mt-1 line-clamp-2">{a.summary}</p>
              <p className="text-[10px] text-zinc-600 mt-1.5 flex items-center gap-1"><Clock className="h-3 w-3" /> {a.readMins} min read</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function ArticleView({ article, onBack }: { article: NewsArticle; onBack: () => void }) {
  return (
    <div className="space-y-4">
      <button type="button" onClick={onBack} className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-400 hover:text-white">
        <ArrowLeft className="h-4 w-4" /> Back to news
      </button>
      <div className="rounded-2xl border border-zinc-800 bg-tribe-charcoal p-5">
        <span className="text-3xl">{article.emoji}</span>
        <p className="mt-3 text-[10px] font-black uppercase tracking-wider text-tribe-lime">{article.category}</p>
        <h1 className="mt-2 text-xl font-black text-white leading-tight">{article.title}</h1>
        <p className="mt-2 text-[11px] text-zinc-500 font-semibold flex items-center gap-2">
          <Clock className="h-3.5 w-3.5" /> {article.readMins} min read · {article.time}
        </p>
        <p className="mt-4 text-sm text-zinc-300 leading-relaxed">{article.summary}</p>
        <p className="mt-4 text-sm text-zinc-400 leading-relaxed">{article.body}</p>
      </div>
    </div>
  );
}

function ScoresPage() {
  const [tab, setTab] = useState<'live' | 'fixture' | 'result'>('live');
  const filtered = ALL_MATCHES.filter((m) => m.status === tab);
  const leagues = [...new Set(filtered.map((m) => m.league))];

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-black uppercase tracking-tight text-white">Match Center</h1>
      <div className="flex gap-1.5 p-1 rounded-2xl bg-tribe-charcoal border border-zinc-800">
        {(['live', 'fixture', 'result'] as const).map((t) => (
          <button key={t} type="button" onClick={() => setTab(t)}
            className={`flex-1 rounded-xl py-2.5 text-[11px] font-black uppercase tracking-wide transition ${
              tab === t ? 'bg-tribe-lime text-black shadow-lime' : 'text-zinc-500'
            }`}>
            {t === 'live' ? 'Live' : t === 'fixture' ? 'Fixtures' : 'Results'}
          </button>
        ))}
      </div>
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-zinc-800 bg-tribe-charcoal py-14 text-center">
          <Trophy className="h-8 w-8 text-zinc-600 mx-auto mb-2" />
          <p className="text-sm font-bold text-zinc-400">No matches in this view</p>
        </div>
      ) : (
        leagues.map((league) => (
          <div key={league} className="space-y-2">
            <h2 className="text-[10px] font-black uppercase tracking-widest text-zinc-500 px-1">{league}</h2>
            <div className="rounded-2xl border border-zinc-800 bg-tribe-charcoal divide-y divide-zinc-800/80 overflow-hidden">
              {filtered.filter((m) => m.league === league).map((m) => (
                <div key={m.id} className="flex items-center gap-3 p-3.5">
                  <div className="flex-1 min-w-0 space-y-1.5">
                    <div className="flex items-center gap-2">
                      <Crest name={m.home} size="sm" />
                      <span className="text-sm font-bold text-white truncate">{m.home}</span>
                      {m.status !== 'fixture' && <span className="ml-auto text-sm font-black tabular-nums text-white">{m.homeScore}</span>}
                    </div>
                    <div className="flex items-center gap-2">
                      <Crest name={m.away} size="sm" />
                      <span className="text-sm font-bold text-white truncate">{m.away}</span>
                      {m.status !== 'fixture' && <span className="ml-auto text-sm font-black tabular-nums text-white">{m.awayScore}</span>}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    {m.status === 'live' ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-black text-tribe-live"><LiveDot /> {m.minute}</span>
                    ) : (
                      <span className="text-[11px] font-bold text-zinc-500">{m.time}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

function ForumPage() {
  const [votes, setVotes] = useState({ madrid: 58, barca: 42 });
  const [voted, setVoted] = useState<'madrid' | 'barca' | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>(STARTER_CHAT);
  const [input, setInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);
  const total = votes.madrid + votes.barca;
  const madridPct = Math.round((votes.madrid / total) * 100);
  const barcaPct = 100 - madridPct;

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const vote = (side: 'madrid' | 'barca') => {
    if (voted) return;
    setVotes((v) => ({ ...v, [side]: v[side] + 1 }));
    setVoted(side);
  };

  const send = () => {
    const text = input.trim();
    if (!text) return;
    setMessages((prev) => [...prev, { id: `u-${Date.now()}`, user: 'You', text, side: 'right' }]);
    setInput('');
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-lg font-black uppercase tracking-tight text-white">Fan Zone</h1>
        <p className="text-xs text-zinc-500 mt-0.5">Polls and match-day debate</p>
      </div>
      <section className="rounded-2xl border border-zinc-800 bg-tribe-charcoal p-4 space-y-4">
        <p className="text-base font-bold text-white">Who wins El Clásico tonight?</p>
        <div className="grid grid-cols-2 gap-2.5">
          {(['madrid', 'barca'] as const).map((side) => (
            <button key={side} type="button" onClick={() => vote(side)} disabled={!!voted}
              className={`rounded-xl border p-3.5 text-left transition ${voted === side ? 'border-tribe-lime bg-tribe-lime/10' : 'border-zinc-700 bg-zinc-900/80'} ${voted && voted !== side ? 'opacity-60' : ''}`}>
              <Crest name={side === 'madrid' ? 'RMA' : 'BAR'} />
              <p className="mt-2 text-sm font-bold text-white">{side === 'madrid' ? 'Real Madrid' : 'Barcelona'}</p>
              <p className="text-[10px] text-zinc-500 font-semibold">{votes[side]} votes</p>
            </button>
          ))}
        </div>
        <div className="h-2.5 rounded-full bg-zinc-900 overflow-hidden flex">
          <motion.div className="h-full bg-tribe-lime" animate={{ width: `${madridPct}%` }} />
          <motion.div className="h-full bg-blue-500" animate={{ width: `${barcaPct}%` }} />
        </div>
      </section>
      <section className="rounded-2xl border border-zinc-800 bg-tribe-charcoal overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800">
          <span className="text-xs font-black uppercase tracking-widest text-zinc-300">Match chat</span>
          <span className="text-[10px] font-bold text-zinc-500"><span className="text-tribe-lime">1.2k</span> online</span>
        </div>
        <div className="h-56 overflow-y-auto no-scrollbar p-3 space-y-2.5">
          {messages.map((m) => (
            <div key={m.id} className={`flex ${m.user === 'You' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] rounded-2xl px-3 py-2 ${m.user === 'You' ? 'bg-tribe-lime text-black rounded-br-md' : 'bg-zinc-900 text-zinc-200 rounded-bl-md border border-zinc-800'}`}>
                {m.user !== 'You' && <p className="text-[10px] font-bold text-tribe-lime mb-0.5">{m.user}</p>}
                <p className="text-sm leading-snug">{m.text}</p>
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>
        <div className="p-3 border-t border-zinc-800 flex gap-2">
          <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && send()}
            placeholder="Join the debate..." className="flex-1 rounded-xl border border-zinc-700 bg-zinc-900 px-3.5 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-tribe-lime/50" />
          <button type="button" onClick={send} className="rounded-xl bg-tribe-lime p-2.5 text-black shadow-lime"><Send className="h-5 w-5" /></button>
        </div>
      </section>
    </div>
  );
}

function ShopPage({ onAdd, cartCount, onOpenCart }: { onAdd: (p: Product) => void; cartCount: number; onOpenCart: () => void }) {
  const [cat, setCat] = useState<'all' | Product['category']>('all');
  const cats: { id: typeof cat; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'jersey', label: 'Jerseys' },
    { id: 'hoodie', label: 'Hoodies' },
    { id: 'cap', label: 'Caps' },
    { id: 'accessories', label: 'More' },
  ];
  const list = cat === 'all' ? PRODUCTS : PRODUCTS.filter((p) => p.category === cat);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-black uppercase tracking-tight text-white">Tribe Store</h1>
          <p className="text-xs text-zinc-500 mt-0.5">Jerseys, hoodies and fan gear</p>
        </div>
        <button type="button" onClick={onOpenCart} className="md:hidden relative rounded-xl border border-zinc-700 bg-tribe-charcoal p-2.5">
          <ShoppingCart className="h-5 w-5 text-zinc-300" />
          {cartCount > 0 && <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full bg-tribe-lime text-[10px] font-black text-black flex items-center justify-center">{cartCount}</span>}
        </button>
      </div>
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {cats.map((c) => (
          <button key={c.id} type="button" onClick={() => setCat(c.id)}
            className={`shrink-0 rounded-full px-3.5 py-1.5 text-[11px] font-bold ${cat === c.id ? 'bg-tribe-lime text-black' : 'bg-tribe-charcoal border border-zinc-800 text-zinc-400'}`}>
            {c.label}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {list.map((p) => (
          <div key={p.id} className="rounded-2xl border border-zinc-800 bg-tribe-charcoal overflow-hidden flex flex-col">
            <div className="aspect-square bg-zinc-900/80 flex items-center justify-center text-5xl relative">
              {p.emoji}
              {p.tag && <span className="absolute top-2 left-2 rounded-md bg-tribe-lime px-1.5 py-0.5 text-[9px] font-black uppercase text-black">{p.tag}</span>}
            </div>
            <div className="p-3 flex flex-col flex-1">
              <p className="text-sm font-bold text-white leading-snug">{p.name}</p>
              <p className="text-tribe-lime font-black text-sm mt-1">${p.price.toFixed(2)}</p>
              <button type="button" onClick={() => onAdd(p)}
                className="mt-auto pt-3 w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-tribe-lime py-2.5 text-[11px] font-black uppercase text-black active:scale-[0.98] transition">
                <Plus className="h-3.5 w-3.5" /> Add to cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CartDrawer({ open, onClose, items, onRemove }: {
  open: boolean; onClose: () => void; items: Product[]; onRemove: (i: number) => void;
}) {
  const total = items.reduce((s, i) => s + i.price, 0);
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button type="button" aria-label="Close" className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
          <motion.aside className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-sm bg-tribe-charcoal border-l border-zinc-800 flex flex-col"
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', stiffness: 320, damping: 32 }}>
            <div className="flex items-center justify-between px-4 py-4 border-b border-zinc-800">
              <h2 className="text-sm font-black uppercase tracking-wider text-white">Your cart</h2>
              <button type="button" onClick={onClose} className="p-2 rounded-xl hover:bg-zinc-800"><X className="h-5 w-5 text-zinc-400" /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {items.length === 0 ? (
                <div className="py-16 text-center">
                  <ShoppingBag className="h-10 w-10 text-zinc-600 mx-auto mb-2" />
                  <p className="text-sm font-bold text-zinc-400">Cart is empty</p>
                  <p className="text-xs text-zinc-600 mt-1">Grab a jersey or hoodie</p>
                </div>
              ) : (
                items.map((item, idx) => (
                  <div key={`${item.id}-${idx}`} className="flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900/50 p-3">
                    <span className="text-2xl">{item.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-white truncate">{item.name}</p>
                      <p className="text-xs font-bold text-tribe-lime">${item.price.toFixed(2)}</p>
                    </div>
                    <button type="button" onClick={() => onRemove(idx)} className="p-2 text-zinc-500 hover:text-tribe-live"><Trash2 className="h-4 w-4" /></button>
                  </div>
                ))
              )}
            </div>
            {items.length > 0 && (
              <div className="p-4 border-t border-zinc-800 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="font-semibold text-zinc-400">Total</span>
                  <span className="font-black text-white">${total.toFixed(2)}</span>
                </div>
                <button type="button" className="w-full rounded-xl bg-tribe-lime py-3.5 text-xs font-black uppercase tracking-wide text-black shadow-lime">
                  Checkout — Pro members save 10%
                </button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

export default function App() {
  const [booting, setBooting] = useState(true);
  const [page, setPage] = useState<PageId>('home');
  const [cart, setCart] = useState<Product[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [pageLoading, setPageLoading] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setBooting(false), 1000);
    return () => clearTimeout(t);
  }, []);

  const go = (p: PageId) => {
    setArticle(null);
    if (p === page) return;
    setPageLoading(true);
    setTimeout(() => {
      setPage(p);
      setPageLoading(false);
      window.scrollTo(0, 0);
    }, 120);
  };

  return (
    <div className="min-h-screen bg-tribe-black text-white font-sans">
      <PageLoader show={booting} />
      {!booting && (
        <>
          <Nav page={page} setPage={go} cartCount={cart.length} onOpenCart={() => setCartOpen(true)} />
          <main className="mx-auto max-w-3xl px-4 pt-5 md:pt-24 pb-safe relative">
            {pageLoading && (
              <div className="absolute inset-x-0 top-0 flex justify-center pt-2 z-10 pointer-events-none">
                <div className="h-1 w-16 rounded-full bg-tribe-lime/80 animate-pulse" />
              </div>
            )}
            <AnimatePresence mode="wait">
              <motion.div key={article ? `a-${article.id}` : page} {...pageTransition}>
                {article ? (
                  <ArticleView article={article} onBack={() => setArticle(null)} />
                ) : (
                  <>
                    {page === 'home' && <HomePage onGo={go} onRead={(a) => setArticle(a)} />}
                    {page === 'news' && <NewsPage onRead={(a) => setArticle(a)} />}
                    {page === 'scores' && <ScoresPage />}
                    {page === 'forum' && <ForumPage />}
                    {page === 'shop' && (
                      <ShopPage onAdd={(p) => setCart((c) => [...c, p])} cartCount={cart.length} onOpenCart={() => setCartOpen(true)} />
                    )}
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          </main>
          {cart.length > 0 && page !== 'shop' && !article && (
            <button type="button" onClick={() => setCartOpen(true)}
              className="md:hidden fixed bottom-[7.5rem] right-4 z-30 h-14 w-14 rounded-full bg-tribe-lime text-black shadow-lime flex items-center justify-center active:scale-95">
              <ShoppingCart className="h-6 w-6" />
              <span className="absolute -top-1 -right-1 h-5 min-w-5 rounded-full bg-black text-tribe-lime text-[10px] font-black flex items-center justify-center px-1 border-2 border-tribe-lime">{cart.length}</span>
            </button>
          )}
          <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} items={cart}
            onRemove={(index) => setCart((c) => c.filter((_, i) => i !== index))} />
        </>
      )}
    </div>
  );
}
