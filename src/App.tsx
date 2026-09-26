import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Home, Trophy, Newspaper, ShoppingBag, Info, Megaphone, Mail,
  Plus, X, ShoppingCart, Trash2, ChevronRight, Clock,
  ArrowLeft, Menu, Sparkles, Users, Shield, MessageCircle,
} from 'lucide-react';
import {
  PageId, LIVE_TICKER, ALL_MATCHES, PRODUCTS, NEWS, CREST_COLORS,
  AD_PACKAGES, Product, NewsArticle,
} from './data';

const fade = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -6 },
  transition: { duration: 0.2 },
};

function Crest({ name }: { name: string }) {
  const color = CREST_COLORS[name.charCodeAt(0) % CREST_COLORS.length];
  return (
    <div className={`h-7 w-7 ${color} rounded-full flex items-center justify-center text-[10px] font-black text-white shrink-0`}>
      {name.slice(0, 2).toUpperCase()}
    </div>
  );
}

function LiveDot() {
  return <span className="live-dot inline-block h-1.5 w-1.5 rounded-full bg-live" />;
}

function AdSlot({ label = 'Advertisement', className = '' }: { label?: string; className?: string }) {
  return (
    <div className={`rounded-2xl border border-dashed border-slate-200 bg-white/60 px-4 py-6 text-center ${className}`}>
      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{label}</p>
      <p className="mt-1 text-xs text-slate-500">Your brand could be here</p>
    </div>
  );
}

function PageLoader({ show }: { show: boolean }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-mesh"
          initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
          <motion.div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-brand-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/25"
            animate={{ scale: [1, 1.05, 1] }} transition={{ repeat: Infinity, duration: 1.1 }}>
            <Sparkles className="h-7 w-7 text-white" />
          </motion.div>
          <p className="mt-4 text-xs font-black uppercase tracking-[0.25em] text-slate-800">Fans Tribe</p>
          <div className="mt-5 h-1 w-28 rounded-full bg-slate-200 overflow-hidden">
            <motion.div className="h-full rounded-full bg-gradient-to-r from-brand-500 to-emerald-400"
              initial={{ width: '0%' }} animate={{ width: '100%' }} transition={{ duration: 0.85 }} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Shell({ page, setPage, cartCount, onOpenCart, children }: {
  page: PageId; setPage: (p: PageId) => void; cartCount: number; onOpenCart: () => void; children: React.ReactNode;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const primary: { id: PageId; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'Home', icon: <Home className="h-5 w-5" /> },
    { id: 'news', label: 'News', icon: <Newspaper className="h-5 w-5" /> },
    { id: 'scores', label: 'Scores', icon: <Trophy className="h-5 w-5" /> },
    { id: 'shop', label: 'Shop', icon: <ShoppingBag className="h-5 w-5" /> },
  ];
  const more: { id: PageId; label: string; icon: React.ReactNode }[] = [
    { id: 'about', label: 'About us', icon: <Info className="h-4 w-4" /> },
    { id: 'advertise', label: 'Advertise', icon: <Megaphone className="h-4 w-4" /> },
    { id: 'contact', label: 'Contact', icon: <Mail className="h-4 w-4" /> },
  ];

  return (
    <>
      <header className="hidden md:flex fixed top-0 inset-x-0 z-40 h-16 items-center justify-between px-6 glass-strong">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-brand-500 to-indigo-600 flex items-center justify-center shadow-md shadow-indigo-500/20">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="text-sm font-black text-slate-900 leading-none">Football Fans Tribe</p>
            <p className="text-[10px] font-semibold text-slate-500 mt-0.5">News · Interviews · Analysis</p>
          </div>
        </div>
        <nav className="flex items-center gap-1">
          {[...primary, ...more].map((t) => (
            <button key={t.id} type="button" onClick={() => setPage(t.id)}
              className={`rounded-xl px-3 py-2 text-xs font-bold transition ${
                page === t.id ? 'bg-brand-50 text-brand-700' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'
              }`}>{t.label}</button>
          ))}
        </nav>
        <button type="button" onClick={onOpenCart} className="relative rounded-xl border border-slate-200 bg-white p-2.5 text-slate-600">
          <ShoppingCart className="h-5 w-5" />
          {cartCount > 0 && <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] rounded-full bg-brand-600 text-[10px] font-black text-white flex items-center justify-center px-1">{cartCount}</span>}
        </button>
      </header>

      <header className="md:hidden fixed top-0 inset-x-0 z-40 glass-strong px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-brand-500 to-indigo-600 flex items-center justify-center">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <span className="text-sm font-black text-slate-900">Fans Tribe</span>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={onOpenCart} className="relative p-2 rounded-xl text-slate-600">
            <ShoppingCart className="h-5 w-5" />
            {cartCount > 0 && <span className="absolute top-0.5 right-0.5 h-4 min-w-4 rounded-full bg-brand-600 text-[9px] font-black text-white flex items-center justify-center">{cartCount}</span>}
          </button>
          <button type="button" onClick={() => setMenuOpen(true)} className="p-2 rounded-xl text-slate-600"><Menu className="h-5 w-5" /></button>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.button type="button" className="md:hidden fixed inset-0 z-50 bg-slate-900/30 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setMenuOpen(false)} />
            <motion.div className="md:hidden fixed top-0 right-0 bottom-0 z-50 w-[80%] max-w-xs glass-strong p-5 flex flex-col"
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', stiffness: 320, damping: 32 }}>
              <div className="flex justify-between items-center mb-6">
                <p className="text-sm font-black text-slate-900">Menu</p>
                <button type="button" onClick={() => setMenuOpen(false)}><X className="h-5 w-5 text-slate-500" /></button>
              </div>
              {[...primary, ...more].map((t) => (
                <button key={t.id} type="button" onClick={() => { setPage(t.id); setMenuOpen(false); }}
                  className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold mb-1 ${page === t.id ? 'bg-brand-50 text-brand-700' : 'text-slate-600'}`}>
                  {t.icon}{t.label}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 nav-safe">
        <div className="mx-3 mb-2 rounded-2xl glass-strong shadow-lg shadow-slate-200/50">
          <div className="flex h-[62px]">
            {primary.map((t) => {
              const active = page === t.id;
              return (
                <button key={t.id} type="button" onClick={() => setPage(t.id)}
                  className="flex-1 flex flex-col items-center justify-center gap-0.5 active:scale-95 transition-transform">
                  <span className={`flex h-8 w-10 items-center justify-center rounded-xl transition ${active ? 'bg-brand-500 text-white shadow-md shadow-brand-500/30' : 'text-slate-400'}`}>{t.icon}</span>
                  <span className={`text-[9px] font-bold ${active ? 'text-brand-600' : 'text-slate-400'}`}>{t.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-3xl px-4 pt-[4.25rem] md:pt-24 pb-safe">{children}</main>
    </>
  );
}

function HomePage({ onRead, onGo }: { onRead: (a: NewsArticle) => void; onGo: (p: PageId) => void }) {
  const featured = NEWS.filter((n) => n.featured);
  const more = NEWS.filter((n) => !n.featured);

  return (
    <div className="space-y-6">
      <section>
        <p className="text-[11px] font-bold uppercase tracking-widest text-brand-600">Today for fans</p>
        <h1 className="mt-1 text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Stories worth your time</h1>
        <p className="mt-1.5 text-sm text-slate-500 max-w-md">Interviews, match analysis, and honest features — written for people who actually watch the game.</p>
      </section>

      <AdSlot label="Sponsored" />

      <section className="space-y-4">
        <h2 className="text-xs font-black uppercase tracking-widest text-slate-400">Featured</h2>
        {featured.map((a, i) => (
          <button key={a.id} type="button" onClick={() => onRead(a)}
            className={`w-full text-left rounded-3xl glass overflow-hidden active:scale-[0.99] transition ${i === 0 ? 'ring-1 ring-brand-100' : ''}`}>
            <div className={`h-28 sm:h-36 bg-gradient-to-br ${a.imageGradient} flex items-end p-4`}>
              <span className="rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-black uppercase text-slate-700 shadow-sm">{a.category}</span>
            </div>
            <div className="p-4">
              <h3 className="text-lg font-bold text-slate-900 leading-snug">{a.title}</h3>
              <p className="mt-2 text-sm text-slate-500 line-clamp-2">{a.summary}</p>
              <div className="mt-3 flex items-center gap-2 text-[11px] text-slate-400 font-semibold">
                <span>{a.author}</span><span>·</span><Clock className="h-3 w-3" /><span>{a.readMins} min</span><span>·</span><span>{a.time}</span>
              </div>
            </div>
          </button>
        ))}
      </section>

      <AdSlot label="Partner spotlight" />

      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-black uppercase tracking-widest text-slate-400">More to read</h2>
          <button type="button" onClick={() => onGo('news')} className="text-[11px] font-bold text-brand-600 flex items-center gap-0.5">
            All articles <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
        <div className="space-y-2.5">
          {more.map((a) => (
            <button key={a.id} type="button" onClick={() => onRead(a)}
              className="w-full flex gap-3 text-left rounded-2xl glass p-3 active:scale-[0.99] transition">
              <div className={`h-16 w-16 rounded-xl bg-gradient-to-br ${a.imageGradient} shrink-0`} />
              <div className="min-w-0 flex-1">
                <p className="text-[9px] font-black uppercase text-brand-600">{a.category}</p>
                <p className="text-sm font-bold text-slate-900 leading-snug line-clamp-2 mt-0.5">{a.title}</p>
                <p className="text-[10px] text-slate-400 mt-1">{a.author} · {a.time}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      <section className="rounded-3xl bg-gradient-to-br from-brand-500 to-indigo-600 p-5 text-white shadow-lg shadow-indigo-500/20">
        <p className="text-[10px] font-black uppercase tracking-widest text-white/70">Support</p>
        <p className="mt-1 text-lg font-bold">Need help or a partnership?</p>
        <p className="mt-1 text-sm text-white/80">Our team replies to fans and brands within one business day.</p>
        <div className="mt-4 flex gap-2">
          <button type="button" onClick={() => onGo('contact')} className="rounded-xl bg-white px-4 py-2.5 text-xs font-black text-brand-700">Contact us</button>
          <button type="button" onClick={() => onGo('advertise')} className="rounded-xl bg-white/15 border border-white/30 px-4 py-2.5 text-xs font-black text-white">Advertise</button>
        </div>
      </section>
    </div>
  );
}

function NewsPage({ onRead }: { onRead: (a: NewsArticle) => void }) {
  const [filter, setFilter] = useState('All');
  const cats = ['All', 'Interview', 'Match Analysis', 'Transfer', 'Opinion', 'Feature'];
  const list = filter === 'All' ? NEWS : NEWS.filter((n) => n.category === filter);
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-black text-slate-900">News and stories</h1>
        <p className="text-sm text-slate-500 mt-0.5">Interviews, analysis, and features</p>
      </div>
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {cats.map((c) => (
          <button key={c} type="button" onClick={() => setFilter(c)}
            className={`shrink-0 rounded-full px-3.5 py-1.5 text-[11px] font-bold transition ${
              filter === c ? 'bg-brand-600 text-white shadow-md shadow-brand-500/25' : 'glass text-slate-600'
            }`}>{c}</button>
        ))}
      </div>
      <AdSlot />
      <div className="space-y-3">
        {list.map((a) => (
          <button key={a.id} type="button" onClick={() => onRead(a)}
            className="w-full flex gap-3 text-left rounded-2xl glass p-3.5 active:scale-[0.99] transition">
            <div className={`h-20 w-20 rounded-2xl bg-gradient-to-br ${a.imageGradient} shrink-0`} />
            <div className="min-w-0 flex-1">
              <p className="text-[9px] font-black uppercase text-brand-600">{a.category}</p>
              <p className="text-sm font-bold text-slate-900 leading-snug mt-0.5 line-clamp-2">{a.title}</p>
              <p className="text-xs text-slate-500 mt-1 line-clamp-2">{a.summary}</p>
              <p className="text-[10px] text-slate-400 mt-1.5 flex items-center gap-1"><Clock className="h-3 w-3" /> {a.readMins} min · {a.author}</p>
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
      <button type="button" onClick={onBack} className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500">
        <ArrowLeft className="h-4 w-4" /> Back
      </button>
      <article className="rounded-3xl glass overflow-hidden">
        <div className={`h-36 sm:h-44 bg-gradient-to-br ${article.imageGradient}`} />
        <div className="p-5 sm:p-6">
          <span className="text-[10px] font-black uppercase tracking-wider text-brand-600">{article.category}</span>
          <h1 className="mt-2 text-2xl font-black text-slate-900 leading-tight">{article.title}</h1>
          <p className="mt-2 text-xs text-slate-500 font-semibold">{article.author} · {article.readMins} min read · {article.time}</p>
          <p className="mt-5 text-base text-slate-700 leading-relaxed font-medium">{article.summary}</p>
          <div className="my-6"><AdSlot label="In-article" /></div>
          <p className="text-sm text-slate-600 leading-relaxed">{article.body}</p>
        </div>
      </article>
    </div>
  );
}

function ScoresPage() {
  const [tab, setTab] = useState<'live' | 'fixture' | 'result'>('live');
  const filtered = ALL_MATCHES.filter((m) => m.status === tab);
  const leagues = [...new Set(filtered.map((m) => m.league))];
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-black text-slate-900">Live scores</h1>
        <p className="text-sm text-slate-500 mt-0.5">Fixtures and results on their own page</p>
      </div>
      <div className="flex gap-1.5 p-1 rounded-2xl glass">
        {(['live', 'fixture', 'result'] as const).map((t) => (
          <button key={t} type="button" onClick={() => setTab(t)}
            className={`flex-1 rounded-xl py-2.5 text-[11px] font-black uppercase transition ${
              tab === t ? 'bg-brand-600 text-white shadow-md shadow-brand-500/20' : 'text-slate-500'
            }`}>
            {t === 'live' ? 'Live' : t === 'fixture' ? 'Fixtures' : 'Results'}
          </button>
        ))}
      </div>
      {tab === 'live' && (
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {LIVE_TICKER.map((m) => (
            <div key={m.id} className="shrink-0 w-[132px] rounded-2xl glass p-3">
              <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase text-live"><LiveDot /> Live</span>
              <div className="mt-2 flex items-center justify-between gap-1">
                <div className="flex items-center gap-1.5"><Crest name={m.home} /><span className="text-xs font-bold text-slate-800">{m.home}</span></div>
                <span className="text-sm font-black text-brand-600">{m.homeScore}</span>
              </div>
              <div className="mt-1 flex items-center justify-between gap-1">
                <div className="flex items-center gap-1.5"><Crest name={m.away} /><span className="text-xs font-bold text-slate-800">{m.away}</span></div>
                <span className="text-sm font-black text-slate-800">{m.awayScore}</span>
              </div>
              <p className="mt-1.5 text-[10px] text-slate-400 text-right">{m.minute}</p>
            </div>
          ))}
        </div>
      )}
      {filtered.length === 0 ? (
        <div className="rounded-2xl glass py-12 text-center text-sm font-bold text-slate-400">No matches here</div>
      ) : leagues.map((league) => (
        <div key={league} className="space-y-2">
          <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">{league}</h2>
          <div className="rounded-2xl glass divide-y divide-slate-100 overflow-hidden">
            {filtered.filter((m) => m.league === league).map((m) => (
              <div key={m.id} className="flex items-center gap-3 p-3.5">
                <div className="flex-1 space-y-1.5 min-w-0">
                  <div className="flex items-center gap-2">
                    <Crest name={m.home} />
                    <span className="text-sm font-bold text-slate-800 truncate">{m.home}</span>
                    {m.status !== 'fixture' && <span className="ml-auto text-sm font-black text-slate-900">{m.homeScore}</span>}
                  </div>
                  <div className="flex items-center gap-2">
                    <Crest name={m.away} />
                    <span className="text-sm font-bold text-slate-800 truncate">{m.away}</span>
                    {m.status !== 'fixture' && <span className="ml-auto text-sm font-black text-slate-900">{m.awayScore}</span>}
                  </div>
                </div>
                <span className="text-[11px] font-bold text-slate-400 shrink-0">
                  {m.status === 'live' ? <span className="text-live inline-flex items-center gap-1"><LiveDot />{m.minute}</span> : m.time}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function ShopPage({ onAdd, cartCount, onOpenCart }: { onAdd: (p: Product) => void; cartCount: number; onOpenCart: () => void }) {
  const [cat, setCat] = useState<'all' | Product['category']>('all');
  const cats = [
    { id: 'all' as const, label: 'All' },
    { id: 'jersey' as const, label: 'Jerseys' },
    { id: 'hoodie' as const, label: 'Hoodies' },
    { id: 'cap' as const, label: 'Caps' },
    { id: 'accessories' as const, label: 'More' },
  ];
  const list = cat === 'all' ? PRODUCTS : PRODUCTS.filter((p) => p.category === cat);
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-slate-900">Shop</h1>
          <p className="text-sm text-slate-500">Jerseys, hoodies and fan gear</p>
        </div>
        <button type="button" onClick={onOpenCart} className="md:hidden relative rounded-xl glass p-2.5">
          <ShoppingCart className="h-5 w-5 text-slate-600" />
          {cartCount > 0 && <span className="absolute -top-1 -right-1 h-[18px] min-w-[18px] rounded-full bg-brand-600 text-[10px] font-black text-white flex items-center justify-center">{cartCount}</span>}
        </button>
      </div>
      <div className="flex gap-2 overflow-x-auto no-scrollbar">
        {cats.map((c) => (
          <button key={c.id} type="button" onClick={() => setCat(c.id)}
            className={`shrink-0 rounded-full px-3.5 py-1.5 text-[11px] font-bold ${cat === c.id ? 'bg-brand-600 text-white' : 'glass text-slate-600'}`}>{c.label}</button>
        ))}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {list.map((p) => (
          <div key={p.id} className="rounded-2xl glass overflow-hidden flex flex-col">
            <div className="aspect-square bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center text-5xl relative">
              {p.emoji}
              {p.tag && <span className="absolute top-2 left-2 rounded-md bg-brand-600 px-1.5 py-0.5 text-[9px] font-black uppercase text-white">{p.tag}</span>}
            </div>
            <div className="p-3 flex flex-col flex-1">
              <p className="text-sm font-bold text-slate-900">{p.name}</p>
              <p className="text-brand-600 font-black text-sm mt-1">${p.price.toFixed(2)}</p>
              <button type="button" onClick={() => onAdd(p)}
                className="mt-auto pt-3 w-full inline-flex items-center justify-center gap-1 rounded-xl bg-brand-600 py-2.5 text-[11px] font-black uppercase text-white shadow-md shadow-brand-500/20">
                <Plus className="h-3.5 w-3.5" /> Add
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AboutPage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-black text-slate-900">About Fans Tribe</h1>
        <p className="text-sm text-slate-500 mt-1">A modern football media home for fans who read deeply.</p>
      </div>
      <div className="rounded-3xl glass p-5 space-y-3">
        <p className="text-sm text-slate-700 leading-relaxed">
          We publish interviews with players and supporters, channel-level match analysis, and features that respect your time.
          Scores live on their own page so the home feed stays focused on stories.
        </p>
        <p className="text-sm text-slate-700 leading-relaxed">
          Built for phones first: fast, glassy, calm — and ready for brands that want to reach real fans without noise.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { icon: <Users className="h-5 w-5 text-brand-600" />, t: 'Fan-first', d: 'Interviews with players and people in the stands.' },
          { icon: <Shield className="h-5 w-5 text-brand-600" />, t: 'Clear analysis', d: 'Tactics and transfers without jargon walls.' },
          { icon: <MessageCircle className="h-5 w-5 text-brand-600" />, t: 'Human support', d: 'We answer fans and partners within one business day.' },
        ].map((x) => (
          <div key={x.t} className="rounded-2xl glass p-4">
            <div className="h-10 w-10 rounded-xl bg-brand-50 flex items-center justify-center">{x.icon}</div>
            <p className="mt-3 text-sm font-bold text-slate-900">{x.t}</p>
            <p className="mt-1 text-xs text-slate-500 leading-relaxed">{x.d}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdvertisePage({ onContact }: { onContact: () => void }) {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-black text-slate-900">Advertise with us</h1>
        <p className="text-sm text-slate-500 mt-1">Reach fans who read interviews and analysis — not just scroll scores.</p>
      </div>
      <AdSlot label="Example placement" className="bg-white" />
      <div className="grid gap-3">
        {AD_PACKAGES.map((p) => (
          <div key={p.id} className="rounded-2xl glass p-4 flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex-1">
              <p className="text-sm font-bold text-slate-900">{p.name}</p>
              <p className="text-xs text-slate-500 mt-1">{p.desc}</p>
              <p className="text-[10px] font-bold uppercase text-brand-600 mt-2">{p.reach}</p>
            </div>
            <div className="sm:text-right">
              <p className="text-sm font-black text-slate-900">{p.price}</p>
              <button type="button" onClick={onContact} className="mt-2 rounded-xl bg-brand-600 px-3 py-2 text-[11px] font-black text-white">Request rate card</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ContactPage() {
  const [sent, setSent] = useState(false);
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-black text-slate-900">Contact and support</h1>
        <p className="text-sm text-slate-500 mt-1">Fans, press, and brands — we reply within one business day.</p>
      </div>
      <div className="rounded-2xl glass p-4 space-y-2 text-sm">
        <p className="flex items-center gap-2 text-slate-700"><Mail className="h-4 w-4 text-brand-600" /> hello@fanstribe.example</p>
        <p className="flex items-center gap-2 text-slate-700"><Megaphone className="h-4 w-4 text-brand-600" /> ads@fanstribe.example</p>
      </div>
      {sent ? (
        <div className="rounded-2xl bg-emerald-50 border border-emerald-100 p-5 text-center">
          <p className="text-sm font-bold text-emerald-800">Message received</p>
          <p className="text-xs text-emerald-700 mt-1">Thanks — we will get back to you soon.</p>
        </div>
      ) : (
        <form className="rounded-2xl glass p-4 space-y-3" onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
          <input required placeholder="Your name" className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30" />
          <input required type="email" placeholder="Email" className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30" />
          <select className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-700">
            <option>General support</option>
            <option>Advertising</option>
            <option>Editorial tip</option>
            <option>Shop order</option>
          </select>
          <textarea required rows={4} placeholder="How can we help?" className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30" />
          <button type="submit" className="w-full rounded-xl bg-brand-600 py-3 text-xs font-black uppercase text-white shadow-md shadow-brand-500/20">Send message</button>
        </form>
      )}
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
          <motion.button type="button" className="fixed inset-0 z-50 bg-slate-900/30 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
          <motion.aside className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-sm bg-white border-l border-slate-100 flex flex-col shadow-2xl"
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', stiffness: 320, damping: 32 }}>
            <div className="flex items-center justify-between px-4 py-4 border-b border-slate-100">
              <h2 className="text-sm font-black text-slate-900">Cart</h2>
              <button type="button" onClick={onClose} className="p-2"><X className="h-5 w-5 text-slate-400" /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {items.length === 0 ? (
                <div className="py-16 text-center text-sm font-bold text-slate-400">Your cart is empty</div>
              ) : items.map((item, idx) => (
                <div key={`${item.id}-${idx}`} className="flex items-center gap-3 rounded-xl border border-slate-100 p-3">
                  <span className="text-2xl">{item.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-900 truncate">{item.name}</p>
                    <p className="text-xs font-bold text-brand-600">${item.price.toFixed(2)}</p>
                  </div>
                  <button type="button" onClick={() => onRemove(idx)} className="p-2 text-slate-400 hover:text-live"><Trash2 className="h-4 w-4" /></button>
                </div>
              ))}
            </div>
            {items.length > 0 && (
              <div className="p-4 border-t border-slate-100 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 font-semibold">Total</span>
                  <span className="font-black text-slate-900">${total.toFixed(2)}</span>
                </div>
                <button type="button" className="w-full rounded-xl bg-brand-600 py-3.5 text-xs font-black uppercase text-white">Checkout</button>
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

  useEffect(() => {
    const t = setTimeout(() => setBooting(false), 950);
    return () => clearTimeout(t);
  }, []);

  const go = (p: PageId) => {
    setArticle(null);
    setPage(p);
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen bg-mesh text-slate-900 font-sans">
      <PageLoader show={booting} />
      {!booting && (
        <Shell page={page} setPage={go} cartCount={cart.length} onOpenCart={() => setCartOpen(true)}>
          <AnimatePresence mode="wait">
            <motion.div key={article ? article.id : page} {...fade}>
              {article ? (
                <ArticleView article={article} onBack={() => setArticle(null)} />
              ) : (
                <>
                  {page === 'home' && <HomePage onRead={setArticle} onGo={go} />}
                  {page === 'news' && <NewsPage onRead={setArticle} />}
                  {page === 'scores' && <ScoresPage />}
                  {page === 'shop' && (
                    <ShopPage onAdd={(p) => setCart((c) => [...c, p])} cartCount={cart.length} onOpenCart={() => setCartOpen(true)} />
                  )}
                  {page === 'about' && <AboutPage />}
                  {page === 'advertise' && <AdvertisePage onContact={() => go('contact')} />}
                  {page === 'contact' && <ContactPage />}
                </>
              )}
            </motion.div>
          </AnimatePresence>
          <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} items={cart}
            onRemove={(i) => setCart((c) => c.filter((_, idx) => idx !== i))} />
        </Shell>
      )}
    </div>
  );
}
