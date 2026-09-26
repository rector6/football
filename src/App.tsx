import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Home, Trophy, Newspaper, ShoppingBag, Info, Megaphone, Mail,
  Plus, X, ShoppingCart, Trash2, ChevronRight, Clock, ArrowLeft,
  Menu, Users, MessageCircle, Mic, Play, Minus, Check,
} from 'lucide-react';
import {
  PageId, LIVE_TICKER, ALL_MATCHES, PRODUCTS, NEWS, CREST_COLORS,
  AD_PACKAGES, PODCASTS, FOOTER_LINKS, Product, NewsArticle,
} from './data';

const fade = { initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -6 }, transition: { duration: 0.2 } };

function Crest({ name }: { name: string }) {
  const color = CREST_COLORS[name.charCodeAt(0) % CREST_COLORS.length];
  return <div className={`h-7 w-7 ${color} rounded-full flex items-center justify-center text-[10px] font-black text-white shrink-0`}>{name.slice(0, 2).toUpperCase()}</div>;
}
function LiveDot() {
  return <span className="live-dot inline-block h-1.5 w-1.5 rounded-full bg-live" />;
}
function ProductArt({ product, large }: { product: Product; large?: boolean }) {
  const [c1, c2] = product.colors;
  const h = large ? 'h-56 sm:h-72' : 'aspect-[4/5]';
  return (
    <div className={`${h} w-full relative overflow-hidden rounded-2xl`} style={{ background: `linear-gradient(145deg, ${c1} 0%, ${c1} 45%, ${c2 || c1} 100%)` }}>
      <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 30% 20%, white, transparent 50%)' }} />
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/25 to-transparent" />
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
        <div className="h-12 w-12 rounded-full border-2 border-white/80 flex items-center justify-center text-xs font-black bg-black/20 backdrop-blur-sm">{product.club.slice(0, 3).toUpperCase()}</div>
        <p className="mt-3 text-[10px] font-black uppercase tracking-widest opacity-90">{product.club}</p>
        {product.category === 'jersey' && <div className="mt-4 w-16 h-20 rounded-t-lg border-2 border-white/40 bg-white/10" />}
        {product.category === 'hoodie' && <div className="mt-4 w-20 h-16 rounded-xl border-2 border-white/40 bg-white/10" />}
      </div>
      {product.tag && <span className="absolute top-3 left-3 rounded-md bg-white px-2 py-0.5 text-[9px] font-black uppercase text-slate-900 shadow">{product.tag}</span>}
    </div>
  );
}
function AdSlot({ label = 'Advertisement' }: { label?: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-200 bg-white/70 px-4 py-5 text-center">
      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{label}</p>
      <p className="mt-1 text-xs text-slate-500">Partner with Football Fans Tribe</p>
    </div>
  );
}
function PageLoader({ show }: { show: boolean }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-mesh" initial={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.div className="h-16 w-16 rounded-full bg-slate-900 border-4 border-brand-500 flex items-center justify-center" animate={{ scale: [1, 1.04, 1] }} transition={{ repeat: Infinity, duration: 1.1 }}>
            <span className="text-[9px] font-black text-white text-center leading-tight">FFT</span>
          </motion.div>
          <p className="mt-4 text-xs font-black uppercase tracking-[0.2em] text-slate-800">Football Fans Tribe</p>
          <div className="mt-5 h-1 w-28 rounded-full bg-slate-200 overflow-hidden">
            <motion.div className="h-full rounded-full bg-gradient-to-r from-brand-500 to-emerald-500" initial={{ width: '0%' }} animate={{ width: '100%' }} transition={{ duration: 0.9 }} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
function Footer({ onGo }: { onGo: (p: PageId) => void }) {
  return (
    <footer className="mt-12 mb-4 rounded-3xl glass-strong overflow-hidden">
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-900 px-5 py-6 text-white">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center border-2 border-brand-400">
            <span className="text-[8px] font-black text-slate-900 text-center leading-tight">FANS<br/>TRIBE</span>
          </div>
          <div>
            <p className="text-sm font-black">Football Fans Tribe</p>
            <p className="text-[11px] text-white/70">Naija football fans live here</p>
          </div>
        </div>
        <p className="mt-3 text-xs text-white/75">Match interviews · Previews & reviews · Podcasts · Live shows · Vlogs · Naija fan content</p>
      </div>
      <div className="grid grid-cols-2 gap-6 p-5">
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Explore</p>
          {FOOTER_LINKS.explore.map((l) => (
            <button key={l.id} type="button" onClick={() => onGo(l.id)} className="block text-sm font-semibold text-slate-700 hover:text-brand-600 mb-1.5">{l.label}</button>
          ))}
        </div>
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Company</p>
          {FOOTER_LINKS.company.map((l) => (
            <button key={l.id} type="button" onClick={() => onGo(l.id)} className="block text-sm font-semibold text-slate-700 hover:text-brand-600 mb-1.5">{l.label}</button>
          ))}
        </div>
      </div>
      <div className="px-5 pb-5 border-t border-slate-100 pt-4">
        <p className="text-[11px] text-slate-500">FansTribeinfo@gmail.com · Official partners welcome</p>
        <p className="text-[10px] text-slate-400 mt-1">© {new Date().getFullYear()} Football Fans Tribe</p>
      </div>
    </footer>
  );
}

type CartLine = { product: Product; size: string; qty: number };

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
    { id: 'podcasts', label: 'Podcasts', icon: <Mic className="h-4 w-4" /> },
    { id: 'about', label: 'About us', icon: <Info className="h-4 w-4" /> },
    { id: 'advertise', label: 'Advertise', icon: <Megaphone className="h-4 w-4" /> },
    { id: 'contact', label: 'Contact', icon: <Mail className="h-4 w-4" /> },
  ];
  return (
    <>
      <header className="hidden md:flex fixed top-0 inset-x-0 z-40 h-16 items-center justify-between px-6 glass-strong">
        <div className="flex items-center gap-2.5">
          <div className="h-10 w-10 rounded-full bg-slate-900 border-2 border-brand-500 flex items-center justify-center"><span className="text-[7px] font-black text-white">FFT</span></div>
          <div>
            <p className="text-sm font-black text-slate-900 leading-none">Football Fans Tribe</p>
            <p className="text-[10px] font-semibold text-slate-500 mt-0.5">Interviews · Podcasts · Shop</p>
          </div>
        </div>
        <nav className="flex items-center gap-0.5">
          {[...primary, ...more].map((t) => (
            <button key={t.id} type="button" onClick={() => setPage(t.id)} className={`rounded-xl px-2.5 py-2 text-[11px] font-bold ${page === t.id ? 'bg-brand-50 text-brand-700' : 'text-slate-500 hover:bg-slate-100'}`}>{t.label}</button>
          ))}
        </nav>
        <button type="button" onClick={onOpenCart} className="relative rounded-xl border border-slate-200 bg-white p-2.5 text-slate-600">
          <ShoppingCart className="h-5 w-5" />
          {cartCount > 0 && <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] rounded-full bg-brand-600 text-[10px] font-black text-white flex items-center justify-center px-1">{cartCount}</span>}
        </button>
      </header>
      <header className="md:hidden fixed top-0 inset-x-0 z-40 glass-strong px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-slate-900 border-2 border-brand-500 flex items-center justify-center"><span className="text-[6px] font-black text-white">FFT</span></div>
          <span className="text-sm font-black text-slate-900">Fans Tribe</span>
        </div>
        <div className="flex items-center gap-1">
          <button type="button" onClick={onOpenCart} className="relative p-2 text-slate-600">
            <ShoppingCart className="h-5 w-5" />
            {cartCount > 0 && <span className="absolute top-0.5 right-0.5 h-4 min-w-4 rounded-full bg-brand-600 text-[9px] font-black text-white flex items-center justify-center">{cartCount}</span>}
          </button>
          <button type="button" onClick={() => setMenuOpen(true)} className="p-2 text-slate-600"><Menu className="h-5 w-5" /></button>
        </div>
      </header>
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.button type="button" className="md:hidden fixed inset-0 z-50 bg-slate-900/30 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setMenuOpen(false)} />
            <motion.div className="md:hidden fixed top-0 right-0 bottom-0 z-50 w-[82%] max-w-xs glass-strong p-5" initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', stiffness: 320, damping: 32 }}>
              <div className="flex justify-between items-center mb-5">
                <p className="text-sm font-black text-slate-900">Menu</p>
                <button type="button" onClick={() => setMenuOpen(false)}><X className="h-5 w-5 text-slate-500" /></button>
              </div>
              {[...primary, ...more].map((t) => (
                <button key={t.id} type="button" onClick={() => { setPage(t.id); setMenuOpen(false); }} className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold mb-1 w-full ${page === t.id ? 'bg-brand-50 text-brand-700' : 'text-slate-600'}`}>{t.icon}{t.label}</button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 nav-safe">
        <div className="mx-3 mb-2 rounded-2xl glass-strong shadow-lg shadow-slate-200/60">
          <div className="flex h-[62px]">
            {primary.map((t) => {
              const active = page === t.id;
              return (
                <button key={t.id} type="button" onClick={() => setPage(t.id)} className="flex-1 flex flex-col items-center justify-center gap-0.5 active:scale-95">
                  <span className={`relative flex h-8 w-10 items-center justify-center rounded-xl ${active ? 'bg-brand-500 text-white shadow-md shadow-brand-500/30' : 'text-slate-400'}`}>
                    {t.icon}
                    {t.id === 'shop' && cartCount > 0 && <span className="absolute -top-1 -right-0.5 h-4 min-w-4 rounded-full bg-emerald-500 text-[9px] font-black text-white flex items-center justify-center">{cartCount}</span>}
                  </span>
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
        <p className="text-[11px] font-bold uppercase tracking-widest text-emerald-600">Naija football fans live here</p>
        <h1 className="mt-1 text-2xl font-black text-slate-900 tracking-tight">Stories, shows and the Tribe shop</h1>
        <p className="mt-1.5 text-sm text-slate-500">Interviews · Match analysis · Previews · Podcasts · Vlogs — and merch you can wear.</p>
      </section>
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {[ { p: 'podcasts' as PageId, label: 'Podcasts', icon: '🎙️' }, { p: 'news' as PageId, label: 'Interviews', icon: '🎤' }, { p: 'scores' as PageId, label: 'Scores', icon: '⚽' }, { p: 'shop' as PageId, label: 'Jerseys', icon: '👕' } ].map((x) => (
          <button key={x.p} type="button" onClick={() => onGo(x.p)} className="shrink-0 rounded-full glass px-3.5 py-2 text-[11px] font-bold text-slate-700 flex items-center gap-1.5"><span>{x.icon}</span>{x.label}</button>
        ))}
      </div>
      <AdSlot label="Sponsored" />
      <section className="space-y-4">
        <h2 className="text-xs font-black uppercase tracking-widest text-slate-400">Featured</h2>
        {featured.map((a) => (
          <button key={a.id} type="button" onClick={() => onRead(a)} className="w-full text-left rounded-3xl glass overflow-hidden active:scale-[0.99]">
            <div className={`h-28 sm:h-36 bg-gradient-to-br ${a.imageGradient} flex items-end p-4`}>
              <span className="rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-black uppercase text-slate-800">{a.category}</span>
            </div>
            <div className="p-4">
              <h3 className="text-lg font-bold text-slate-900 leading-snug">{a.title}</h3>
              <p className="mt-2 text-sm text-slate-500 line-clamp-2">{a.summary}</p>
              <div className="mt-3 flex items-center gap-2 text-[11px] text-slate-400 font-semibold"><span>{a.author}</span><span>·</span><Clock className="h-3 w-3" /><span>{a.readMins} min</span><span>·</span><span>{a.time}</span></div>
            </div>
          </button>
        ))}
      </section>
      <AdSlot label="Partner" />
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-black uppercase tracking-widest text-slate-400">More to read</h2>
          <button type="button" onClick={() => onGo('news')} className="text-[11px] font-bold text-brand-600 flex items-center gap-0.5">All <ChevronRight className="h-3.5 w-3.5" /></button>
        </div>
        <div className="space-y-2.5">
          {more.map((a) => (
            <button key={a.id} type="button" onClick={() => onRead(a)} className="w-full flex gap-3 text-left rounded-2xl glass p-3 active:scale-[0.99]">
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
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-black uppercase tracking-widest text-slate-400">Latest show</h2>
          <button type="button" onClick={() => onGo('podcasts')} className="text-[11px] font-bold text-brand-600 flex items-center gap-0.5">All shows <ChevronRight className="h-3.5 w-3.5" /></button>
        </div>
        <button type="button" onClick={() => onGo('podcasts')} className="w-full rounded-2xl glass p-4 flex items-center gap-3 text-left">
          <div className="h-12 w-12 rounded-xl bg-slate-900 flex items-center justify-center shrink-0"><Play className="h-5 w-5 text-white fill-white" /></div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-slate-900 line-clamp-1">{PODCASTS[0].title}</p>
            <p className="text-xs text-slate-500">{PODCASTS[0].show} · {PODCASTS[0].duration}</p>
          </div>
        </button>
      </section>
      <Footer onGo={onGo} />
    </div>
  );
}

function NewsPage({ onRead }: { onRead: (a: NewsArticle) => void }) {
  const [filter, setFilter] = useState('All');
  const cats = ['All', 'Interview', 'Match Analysis', 'Preview', 'Review', 'Naija Fans', 'Feature'];
  const list = filter === 'All' ? NEWS : NEWS.filter((n) => n.category === filter);
  return (
    <div className="space-y-4">
      <div><h1 className="text-xl font-black text-slate-900">News and stories</h1><p className="text-sm text-slate-500 mt-0.5">Arranged for easy reading</p></div>
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {cats.map((c) => (
          <button key={c} type="button" onClick={() => setFilter(c)} className={`shrink-0 rounded-full px-3.5 py-1.5 text-[11px] font-bold ${filter === c ? 'bg-brand-600 text-white' : 'glass text-slate-600'}`}>{c}</button>
        ))}
      </div>
      <AdSlot />
      <div className="space-y-3">
        {list.map((a) => (
          <button key={a.id} type="button" onClick={() => onRead(a)} className="w-full flex gap-3 text-left rounded-2xl glass p-3.5 active:scale-[0.99]">
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
    <div className="space-y-4 max-w-prose mx-auto">
      <button type="button" onClick={onBack} className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500"><ArrowLeft className="h-4 w-4" /> Back to stories</button>
      <article className="rounded-3xl glass overflow-hidden">
        <div className={`h-40 sm:h-48 bg-gradient-to-br ${article.imageGradient}`} />
        <div className="p-5 sm:p-7">
          <span className="text-[10px] font-black uppercase tracking-wider text-brand-600">{article.category}</span>
          <h1 className="mt-2 text-2xl font-black text-slate-900 leading-tight">{article.title}</h1>
          <p className="mt-3 text-xs text-slate-500 font-semibold">{article.author} · {article.readMins} min · {article.time}</p>
          <p className="mt-6 text-[15px] text-slate-800 leading-relaxed font-medium border-l-4 border-brand-500 pl-4">{article.summary}</p>
          <div className="my-8"><AdSlot label="In-article" /></div>
          <p className="text-[15px] text-slate-600 leading-[1.75]">{article.body}</p>
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
      <div><h1 className="text-xl font-black text-slate-900">Live scores</h1><p className="text-sm text-slate-500 mt-0.5">EPL, UCL, AFCON qualifiers</p></div>
      <div className="flex gap-1.5 p-1 rounded-2xl glass">
        {(['live', 'fixture', 'result'] as const).map((t) => (
          <button key={t} type="button" onClick={() => setTab(t)} className={`flex-1 rounded-xl py-2.5 text-[11px] font-black uppercase ${tab === t ? 'bg-brand-600 text-white' : 'text-slate-500'}`}>{t === 'live' ? 'Live' : t === 'fixture' ? 'Fixtures' : 'Results'}</button>
        ))}
      </div>
      {tab === 'live' && (
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {LIVE_TICKER.map((m) => (
            <div key={m.id} className="shrink-0 w-[132px] rounded-2xl glass p-3">
              <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase text-live"><LiveDot /> Live</span>
              <div className="mt-2 flex items-center justify-between"><div className="flex items-center gap-1.5"><Crest name={m.home} /><span className="text-xs font-bold">{m.home}</span></div><span className="text-sm font-black text-brand-600">{m.homeScore}</span></div>
              <div className="mt-1 flex items-center justify-between"><div className="flex items-center gap-1.5"><Crest name={m.away} /><span className="text-xs font-bold">{m.away}</span></div><span className="text-sm font-black">{m.awayScore}</span></div>
              <p className="mt-1.5 text-[10px] text-slate-400 text-right">{m.minute}</p>
            </div>
          ))}
        </div>
      )}
      {leagues.map((league) => (
        <div key={league} className="space-y-2">
          <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">{league}</h2>
          <div className="rounded-2xl glass divide-y divide-slate-100">
            {filtered.filter((m) => m.league === league).map((m) => (
              <div key={m.id} className="flex items-center gap-3 p-3.5">
                <div className="flex-1 space-y-1.5 min-w-0">
                  <div className="flex items-center gap-2"><Crest name={m.home} /><span className="text-sm font-bold truncate">{m.home}</span>{m.status !== 'fixture' && <span className="ml-auto text-sm font-black">{m.homeScore}</span>}</div>
                  <div className="flex items-center gap-2"><Crest name={m.away} /><span className="text-sm font-bold truncate">{m.away}</span>{m.status !== 'fixture' && <span className="ml-auto text-sm font-black">{m.awayScore}</span>}</div>
                </div>
                <span className="text-[11px] font-bold text-slate-400">{m.status === 'live' ? <span className="text-live inline-flex items-center gap-1"><LiveDot />{m.minute}</span> : m.time}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function ShopPage({ cart, onOpenCart, onOpenProduct }: { cart: CartLine[]; onOpenCart: () => void; onOpenProduct: (p: Product) => void }) {
  const [cat, setCat] = useState<'all' | Product['category']>('all');
  const cats = [{ id: 'all' as const, label: 'All' }, { id: 'jersey' as const, label: 'Jerseys' }, { id: 'hoodie' as const, label: 'Hoodies' }, { id: 'cap' as const, label: 'Caps' }, { id: 'accessories' as const, label: 'More' }];
  const list = cat === 'all' ? PRODUCTS : PRODUCTS.filter((p) => p.category === cat);
  const count = cart.reduce((s, l) => s + l.qty, 0);
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div><h1 className="text-xl font-black text-slate-900">Tribe Shop</h1><p className="text-sm text-slate-500">Club jerseys and official gear</p></div>
        <button type="button" onClick={onOpenCart} className="relative flex items-center gap-2 rounded-xl bg-brand-600 px-3.5 py-2.5 text-white shadow-md shadow-brand-500/25">
          <ShoppingCart className="h-4 w-4" /><span className="text-xs font-black">Cart{count > 0 ? ` (${count})` : ''}</span>
        </button>
      </div>
      <div className="flex gap-2 overflow-x-auto no-scrollbar">
        {cats.map((c) => (
          <button key={c.id} type="button" onClick={() => setCat(c.id)} className={`shrink-0 rounded-full px-3.5 py-1.5 text-[11px] font-bold ${cat === c.id ? 'bg-brand-600 text-white' : 'glass text-slate-600'}`}>{c.label}</button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3">
        {list.map((p) => (
          <button key={p.id} type="button" onClick={() => onOpenProduct(p)} className="text-left rounded-2xl glass overflow-hidden active:scale-[0.98] flex flex-col">
            <ProductArt product={p} />
            <div className="p-3 flex flex-col flex-1">
              <p className="text-[10px] font-bold uppercase text-slate-400">{p.club}</p>
              <p className="text-sm font-bold text-slate-900 leading-snug mt-0.5 line-clamp-2">{p.name}</p>
              <div className="mt-2 flex items-baseline gap-1.5">
                <span className="text-brand-600 font-black text-sm">${p.price.toFixed(2)}</span>
                {p.compareAt && <span className="text-[11px] text-slate-400 line-through">${p.compareAt.toFixed(2)}</span>}
              </div>
              <span className="mt-3 text-[10px] font-bold text-brand-600">View details →</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function ProductDetail({ product, onBack, onAdd }: { product: Product; onBack: () => void; onAdd: (p: Product, size: string) => void }) {
  const [size, setSize] = useState(product.sizes[0]);
  const [added, setAdded] = useState(false);
  return (
    <div className="space-y-4">
      <button type="button" onClick={onBack} className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500"><ArrowLeft className="h-4 w-4" /> Back to shop</button>
      <div className="rounded-3xl glass overflow-hidden">
        <ProductArt product={product} large />
        <div className="p-5 space-y-4">
          <div>
            <p className="text-[10px] font-black uppercase tracking-wider text-brand-600">{product.club} · {product.category}</p>
            <h1 className="mt-1 text-xl font-black text-slate-900">{product.name}</h1>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900">${product.price.toFixed(2)}</span>
              {product.compareAt && <span className="text-sm text-slate-400 line-through">${product.compareAt.toFixed(2)}</span>}
            </div>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">{product.description}</p>
          <div>
            <p className="text-[11px] font-bold uppercase text-slate-500 mb-2">Size</p>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((s) => (
                <button key={s} type="button" onClick={() => setSize(s)} className={`min-w-[3rem] rounded-xl px-3 py-2 text-xs font-bold border ${size === s ? 'border-brand-600 bg-brand-50 text-brand-700' : 'border-slate-200 text-slate-600'}`}>{s}</button>
              ))}
            </div>
          </div>
          <button type="button" onClick={() => { onAdd(product, size); setAdded(true); setTimeout(() => setAdded(false), 1600); }} className="w-full rounded-xl bg-brand-600 py-3.5 text-xs font-black uppercase text-white shadow-lg shadow-brand-500/25 flex items-center justify-center gap-2">
            {added ? <><Check className="h-4 w-4" /> Added to cart</> : <><Plus className="h-4 w-4" /> Add to cart</>}
          </button>
        </div>
      </div>
    </div>
  );
}

function PodcastsPage() {
  return (
    <div className="space-y-4">
      <div><h1 className="text-xl font-black text-slate-900">Podcasts and shows</h1><p className="text-sm text-slate-500 mt-0.5">Fans Tribe Live · Matchday Podcast · Vlogs</p></div>
      {PODCASTS.map((ep) => (
        <div key={ep.id} className="rounded-2xl glass p-4 flex gap-3">
          <div className="h-14 w-14 rounded-xl bg-slate-900 flex items-center justify-center shrink-0"><Play className="h-6 w-6 text-white fill-white" /></div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-black uppercase text-brand-600">{ep.show}</p>
            <p className="text-sm font-bold text-slate-900 mt-0.5">{ep.title}</p>
            <p className="text-xs text-slate-500 mt-1">{ep.description}</p>
            <p className="text-[10px] text-slate-400 mt-2 font-semibold">{ep.duration} · {ep.time}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function AboutPage() {
  return (
    <div className="space-y-5">
      <div><h1 className="text-xl font-black text-slate-900">About Football Fans Tribe</h1><p className="text-sm text-slate-500 mt-1">Naija football fans live here — 1.9M strong.</p></div>
      <div className="rounded-3xl glass p-5"><p className="text-sm text-slate-700 leading-relaxed">We are the home of match interviews, previews and reviews, podcasts, live shows, vlogs and Naija fan culture. Read stories, check scores, listen to shows, and shop Tribe gear.</p></div>
      <div className="grid gap-3">
        {[ { icon: <Users className="h-5 w-5 text-brand-600" />, t: 'Fan-first', d: 'Interviews with players and fans in the stands.' }, { icon: <Mic className="h-5 w-5 text-brand-600" />, t: 'Shows and podcasts', d: 'Live panels, matchday debriefs and vlogs.' }, { icon: <MessageCircle className="h-5 w-5 text-brand-600" />, t: 'Real support', d: 'Reply within one business day.' } ].map((x) => (
          <div key={x.t} className="rounded-2xl glass p-4 flex gap-3">
            <div className="h-10 w-10 rounded-xl bg-brand-50 flex items-center justify-center shrink-0">{x.icon}</div>
            <div><p className="text-sm font-bold text-slate-900">{x.t}</p><p className="text-xs text-slate-500 mt-0.5">{x.d}</p></div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdvertisePage({ onContact }: { onContact: () => void }) {
  return (
    <div className="space-y-5">
      <div><h1 className="text-xl font-black text-slate-900">Advertise with Fans Tribe</h1><p className="text-sm text-slate-500 mt-1">Reach Nigeria’s most engaged football community.</p></div>
      <AdSlot label="Example placement" />
      {AD_PACKAGES.map((p) => (
        <div key={p.id} className="rounded-2xl glass p-4">
          <div className="flex justify-between gap-3"><p className="text-sm font-bold text-slate-900">{p.name}</p><p className="text-sm font-black text-brand-600 shrink-0">{p.price}</p></div>
          <p className="text-xs text-slate-500 mt-1">{p.desc}</p>
          <button type="button" onClick={onContact} className="mt-3 rounded-xl bg-brand-600 px-3 py-2 text-[11px] font-black text-white">Request rate card</button>
        </div>
      ))}
    </div>
  );
}

function ContactPage() {
  const [sent, setSent] = useState(false);
  return (
    <div className="space-y-5">
      <div><h1 className="text-xl font-black text-slate-900">Contact and support</h1><p className="text-sm text-slate-500 mt-1">We reply within one business day.</p></div>
      <div className="rounded-2xl glass p-4 text-sm"><p className="flex items-center gap-2 text-slate-700"><Mail className="h-4 w-4 text-brand-600" /> FansTribeinfo@gmail.com</p></div>
      {sent ? (
        <div className="rounded-2xl bg-emerald-50 border border-emerald-100 p-5 text-center"><p className="text-sm font-bold text-emerald-800">Message received</p></div>
      ) : (
        <form className="rounded-2xl glass p-4 space-y-3" onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
          <input required placeholder="Your name" className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm" />
          <input required type="email" placeholder="Email" className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm" />
          <select className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm"><option>General support</option><option>Advertising</option><option>Shop order</option></select>
          <textarea required rows={4} placeholder="How can we help?" className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm" />
          <button type="submit" className="w-full rounded-xl bg-brand-600 py-3 text-xs font-black uppercase text-white">Send message</button>
        </form>
      )}
    </div>
  );
}

function CartDrawer({ open, onClose, lines, onQty, onRemove }: {
  open: boolean; onClose: () => void; lines: CartLine[]; onQty: (i: number, q: number) => void; onRemove: (i: number) => void;
}) {
  const total = lines.reduce((s, l) => s + l.product.price * l.qty, 0);
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button type="button" className="fixed inset-0 z-50 bg-slate-900/30 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
          <motion.aside className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-sm bg-white border-l border-slate-100 flex flex-col shadow-2xl" initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', stiffness: 320, damping: 32 }}>
            <div className="flex items-center justify-between px-4 py-4 border-b border-slate-100">
              <h2 className="text-sm font-black text-slate-900">Your cart</h2>
              <button type="button" onClick={onClose} className="p-2"><X className="h-5 w-5 text-slate-400" /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {lines.length === 0 ? (
                <div className="py-16 text-center"><ShoppingBag className="h-10 w-10 text-slate-300 mx-auto mb-2" /><p className="text-sm font-bold text-slate-400">Cart is empty</p><p className="text-xs text-slate-400 mt-1">Tap a jersey to open details</p></div>
              ) : lines.map((line, idx) => (
                <div key={`${line.product.id}-${line.size}-${idx}`} className="flex gap-3 rounded-xl border border-slate-100 p-3">
                  <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0"><ProductArt product={line.product} /></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-900 truncate">{line.product.name}</p>
                    <p className="text-[10px] text-slate-500">Size {line.size}</p>
                    <p className="text-xs font-bold text-brand-600 mt-0.5">${line.product.price.toFixed(2)}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <button type="button" onClick={() => onQty(idx, Math.max(1, line.qty - 1))} className="h-7 w-7 rounded-lg border border-slate-200 flex items-center justify-center"><Minus className="h-3 w-3" /></button>
                      <span className="text-xs font-bold w-4 text-center">{line.qty}</span>
                      <button type="button" onClick={() => onQty(idx, line.qty + 1)} className="h-7 w-7 rounded-lg border border-slate-200 flex items-center justify-center"><Plus className="h-3 w-3" /></button>
                      <button type="button" onClick={() => onRemove(idx)} className="ml-auto p-1.5 text-slate-400"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {lines.length > 0 && (
              <div className="p-4 border-t border-slate-100 space-y-3">
                <div className="flex justify-between text-sm"><span className="text-slate-500 font-semibold">Total</span><span className="font-black text-slate-900">${total.toFixed(2)}</span></div>
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
  const [cart, setCart] = useState<CartLine[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [product, setProduct] = useState<Product | null>(null);
  useEffect(() => { const t = setTimeout(() => setBooting(false), 950); return () => clearTimeout(t); }, []);
  const go = (p: PageId) => { setArticle(null); setProduct(null); setPage(p); window.scrollTo(0, 0); };
  const addToCart = (p: Product, size: string) => {
    setCart((prev) => {
      const i = prev.findIndex((l) => l.product.id === p.id && l.size === size);
      if (i >= 0) { const next = [...prev]; next[i] = { ...next[i], qty: next[i].qty + 1 }; return next; }
      return [...prev, { product: p, size, qty: 1 }];
    });
  };
  const cartCount = cart.reduce((s, l) => s + l.qty, 0);
  return (
    <div className="min-h-screen bg-mesh text-slate-900 font-sans">
      <PageLoader show={booting} />
      {!booting && (
        <Shell page={page} setPage={go} cartCount={cartCount} onOpenCart={() => setCartOpen(true)}>
          <AnimatePresence mode="wait">
            <motion.div key={article ? `a-${article.id}` : product ? `p-${product.id}` : page} {...fade}>
              {article ? <ArticleView article={article} onBack={() => setArticle(null)} />
                : product ? <ProductDetail product={product} onBack={() => setProduct(null)} onAdd={addToCart} />
                : (
                  <>
                    {page === 'home' && <HomePage onRead={setArticle} onGo={go} />}
                    {page === 'news' && <NewsPage onRead={setArticle} />}
                    {page === 'scores' && <ScoresPage />}
                    {page === 'shop' && <ShopPage cart={cart} onOpenCart={() => setCartOpen(true)} onOpenProduct={setProduct} />}
                    {page === 'podcasts' && <PodcastsPage />}
                    {page === 'about' && <AboutPage />}
                    {page === 'advertise' && <AdvertisePage onContact={() => go('contact')} />}
                    {page === 'contact' && <ContactPage />}
                  </>
                )}
            </motion.div>
          </AnimatePresence>
          <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} lines={cart}
            onQty={(i, q) => setCart((c) => c.map((l, idx) => (idx === i ? { ...l, qty: q } : l)))}
            onRemove={(i) => setCart((c) => c.filter((_, idx) => idx !== i))} />
        </Shell>
      )}
    </div>
  );
}
