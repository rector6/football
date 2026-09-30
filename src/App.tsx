import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Home, Trophy, Newspaper, ShoppingBag, Info, Megaphone, Mail,
  Plus, X, ShoppingCart, Trash2, ChevronRight, Clock, ArrowLeft,
  Menu, Users, MessageCircle, Mic, Play, Minus, Check,
} from 'lucide-react';
import {
  PageId, PRODUCTS, NEWS, CREST_COLORS,
  AD_PACKAGES, PODCASTS, FOOTER_LINKS, Product, NewsArticle,
} from './data';
import { ScoresPage } from './components/ScoresPage';

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

export default function App() {
  const [booting, setBooting] = useState(true);
  const [page, setPage] = useState<PageId>('home');
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [cart, setCart] = useState<CartLine[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    const t = window.setTimeout(() => setBooting(false), 900);
    return () => window.clearTimeout(t);
  }, []);

  const cartCount = cart.reduce((s, l) => s + l.qty, 0);

  return (
    <div className="min-h-screen">
      <PageLoader show={booting} />
      {!booting && (
        <Shell page={page} setPage={(p) => { setPage(p); setArticle(null); setProduct(null); }} cartCount={cartCount} onOpenCart={() => setCartOpen(true)}>
          <AnimatePresence mode="wait">
            <motion.div key={article ? article.id : product ? product.id : page} {...fade}>
              {article ? (
                <ArticleView article={article} onBack={() => setArticle(null)} />
              ) : product ? (
                <ProductView product={product} onBack={() => setProduct(null)} onAdd={(size, qty) => { setCart((c) => [...c, { product, size, qty }]); setProduct(null); setCartOpen(true); }} />
              ) : (
                <>
                  {page === 'home' && <HomePage onRead={setArticle} onGo={setPage} />}
                  {page === 'news' && <NewsPage onRead={setArticle} />}
                  {page === 'scores' && <ScoresPage />}
                  {page === 'shop' && <ShopPage cart={cart} onOpenCart={() => setCartOpen(true)} onOpenProduct={setProduct} />}
                  {page === 'podcasts' && <PodcastsPage />}
                  {page === 'about' && <AboutPage />}
                  {page === 'advertise' && <AdvertisePage />}
                  {page === 'contact' && <ContactPage />}
                </>
              )}
            </motion.div>
          </AnimatePresence>
          {cartOpen && (
            <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} lines={cart}
              onQty={(i, q) => setCart((c) => c.map((l, idx) => (idx === i ? { ...l, qty: q } : l)))}
              onRemove={(i) => setCart((c) => c.filter((_, idx) => idx !== i))} />
          )}
        </Shell>
      )}
    </div>
  );
}

/* Placeholder page stubs — full UI restored from prior App pages */
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
      <div className="space-y-3">
        {list.map((a) => (
          <button key={a.id} type="button" onClick={() => onRead(a)} className="w-full flex gap-3 text-left rounded-2xl glass p-3.5 active:scale-[0.99]">
            <div className={`h-20 w-20 rounded-2xl bg-gradient-to-br ${a.imageGradient} shrink-0`} />
            <div className="min-w-0 flex-1">
              <p className="text-[9px] font-black uppercase text-brand-600">{a.category}</p>
              <p className="text-sm font-bold text-slate-900 leading-snug mt-0.5 line-clamp-2">{a.title}</p>
              <p className="text-xs text-slate-500 mt-1 line-clamp-2">{a.summary}</p>
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
      <button type="button" onClick={onBack} className="inline-flex items-center gap-1 text-sm font-bold text-brand-600"><ArrowLeft className="h-4 w-4" /> Back</button>
      <span className="text-[10px] font-black uppercase text-brand-600">{article.category}</span>
      <h1 className="text-2xl font-black text-slate-900 leading-tight">{article.title}</h1>
      <p className="text-sm text-slate-500">{article.author} · {article.readMins} min · {article.time}</p>
      <div className={`h-40 rounded-3xl bg-gradient-to-br ${article.imageGradient}`} />
      <p className="text-[15px] text-slate-600 leading-[1.75]">{article.summary}</p>
      <p className="text-[15px] text-slate-600 leading-[1.75]">{article.body}</p>
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
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function ProductView({ product, onBack, onAdd }: { product: Product; onBack: () => void; onAdd: (size: string, qty: number) => void }) {
  const [size, setSize] = useState(product.sizes[0]);
  const [qty, setQty] = useState(1);
  return (
    <div className="space-y-4">
      <button type="button" onClick={onBack} className="inline-flex items-center gap-1 text-sm font-bold text-brand-600"><ArrowLeft className="h-4 w-4" /> Back</button>
      <ProductArt product={product} large />
      <h1 className="text-xl font-black text-slate-900">{product.name}</h1>
      <p className="text-brand-600 font-black text-lg">${product.price.toFixed(2)}</p>
      <p className="text-sm text-slate-600">{product.description}</p>
      <div className="flex flex-wrap gap-2">
        {product.sizes.map((s) => (
          <button key={s} type="button" onClick={() => setSize(s)} className={`rounded-xl px-3 py-2 text-xs font-bold ${size === s ? 'bg-brand-600 text-white' : 'glass text-slate-600'}`}>{s}</button>
        ))}
      </div>
      <div className="flex items-center gap-3">
        <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} className="rounded-xl glass p-2"><Minus className="h-4 w-4" /></button>
        <span className="font-black">{qty}</span>
        <button type="button" onClick={() => setQty((q) => q + 1)} className="rounded-xl glass p-2"><Plus className="h-4 w-4" /></button>
      </div>
      <button type="button" onClick={() => onAdd(size, qty)} className="w-full rounded-2xl bg-brand-600 py-3.5 text-sm font-black text-white">Add to cart</button>
    </div>
  );
}

function PodcastsPage() {
  return (
    <div className="space-y-4">
      <div><h1 className="text-xl font-black text-slate-900">Podcasts and shows</h1><p className="text-sm text-slate-500 mt-0.5">Fans Tribe Live · Matchday Podcast · Vlogs</p></div>
      {PODCASTS.map((ep) => (
        <div key={ep.id} className="rounded-2xl glass p-4 flex items-center gap-3">
          <div className="h-12 w-12 rounded-xl bg-slate-900 flex items-center justify-center shrink-0"><Play className="h-5 w-5 text-white fill-white" /></div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-slate-900">{ep.title}</p>
            <p className="text-xs text-slate-500">{ep.show} · {ep.duration} · {ep.time}</p>
            <p className="text-xs text-slate-500 mt-1">{ep.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function AboutPage() {
  return (
    <div className="space-y-4">
      <div><h1 className="text-xl font-black text-slate-900">About Football Fans Tribe</h1><p className="text-sm text-slate-500 mt-1">Naija football fans live here — 1.9M strong.</p></div>
      <div className="rounded-3xl glass p-5"><p className="text-sm text-slate-700 leading-relaxed">We are the home of match interviews, previews and reviews, podcasts, live shows, vlogs and Naija fan culture. Read stories, check scores, listen to shows, and shop Tribe gear.</p></div>
    </div>
  );
}

function AdvertisePage() {
  return (
    <div className="space-y-4">
      <div><h1 className="text-xl font-black text-slate-900">Advertise</h1><p className="text-sm text-slate-500">Reach Naija football fans</p></div>
      {AD_PACKAGES.map((a) => (
        <div key={a.id} className="rounded-2xl glass p-4">
          <p className="text-sm font-black text-slate-900">{a.name}</p>
          <p className="text-brand-600 font-bold text-sm mt-1">{a.price}</p>
          <p className="text-xs text-slate-500 mt-2">{a.desc}</p>
          <p className="text-[10px] text-slate-400 mt-1">{a.reach}</p>
        </div>
      ))}
    </div>
  );
}

function ContactPage() {
  return (
    <div className="space-y-4">
      <div><h1 className="text-xl font-black text-slate-900">Contact and support</h1><p className="text-sm text-slate-500">We reply within one business day</p></div>
      <div className="rounded-2xl glass p-5 space-y-2 text-sm text-slate-700">
        <p className="flex items-center gap-2"><Mail className="h-4 w-4 text-brand-600" /> FansTribeinfo@gmail.com</p>
        <p className="flex items-center gap-2"><MessageCircle className="h-4 w-4 text-brand-600" /> Facebook: Football Fans Tribe</p>
      </div>
    </div>
  );
}

function CartDrawer({ open, onClose, lines, onQty, onRemove }: {
  open: boolean; onClose: () => void; lines: CartLine[];
  onQty: (i: number, q: number) => void; onRemove: (i: number) => void;
}) {
  const total = lines.reduce((s, l) => s + l.product.price * l.qty, 0);
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button type="button" className="fixed inset-0 z-50 bg-slate-900/40" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
          <motion.div className="fixed bottom-0 inset-x-0 z-50 max-h-[85vh] rounded-t-3xl bg-white p-5 overflow-y-auto" initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-black">Cart</p>
              <button type="button" onClick={onClose}><X className="h-5 w-5" /></button>
            </div>
            {lines.length === 0 ? <p className="text-sm text-slate-500 py-8 text-center">Cart is empty</p> : (
              <div className="space-y-3">
                {lines.map((l, i) => (
                  <div key={i} className="flex gap-3 items-center">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold truncate">{l.product.name}</p>
                      <p className="text-xs text-slate-500">{l.size} · ${l.product.price.toFixed(2)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button type="button" onClick={() => onQty(i, Math.max(1, l.qty - 1))} className="p-1"><Minus className="h-3.5 w-3.5" /></button>
                      <span className="text-sm font-bold w-4 text-center">{l.qty}</span>
                      <button type="button" onClick={() => onQty(i, l.qty + 1)} className="p-1"><Plus className="h-3.5 w-3.5" /></button>
                      <button type="button" onClick={() => onRemove(i)} className="p-1 text-red-500"><Trash2 className="h-3.5 w-3.5" /></button>
                    </div>
                  </div>
                ))}
                <p className="text-sm font-black pt-3 border-t">Total ${total.toFixed(2)}</p>
                <button type="button" className="w-full rounded-2xl bg-brand-600 py-3 text-sm font-black text-white">Checkout</button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
