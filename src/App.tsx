import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Home, Trophy, Newspaper, ShoppingBag, Info, Megaphone, Mail,
  Plus, X, ShoppingCart, Trash2, ChevronRight, Clock, ArrowLeft,
  Menu, MessageCircle, Mic, Play, Minus,
} from 'lucide-react';
import {
  PageId, PRODUCTS, NEWS, CREST_COLORS,
  AD_PACKAGES, PODCASTS, FOOTER_LINKS, Product, NewsArticle,
} from './data';
import { ScoresPage } from './components/ScoresPage';
import { NewsPage as FeedNewsPage } from './pages/NewsPage';
import { ArticlePage as FeedArticlePage } from './pages/ArticlePage';
import { fetchNews, type FeedArticle } from './lib/api';

const fade = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -6 },
  transition: { duration: 0.2 },
};

function ProductArt({ product, large }: { product: Product; large?: boolean }) {
  const [c1, c2] = product.colors;
  const h = large ? 'h-56 sm:h-72' : 'aspect-[4/5]';
  return (
    <div
      className={`${h} w-full relative overflow-hidden rounded-2xl`}
      style={{ background: `linear-gradient(145deg, ${c1} 0%, ${c1} 45%, ${c2 || c1} 100%)` }}
    >
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
        <div className="h-12 w-12 rounded-full border-2 border-white/80 flex items-center justify-center text-xs font-black bg-black/20">
          {product.club.slice(0, 3).toUpperCase()}
        </div>
        <p className="mt-3 text-[10px] font-black uppercase tracking-widest opacity-90">{product.club}</p>
      </div>
      {product.tag && (
        <span className="absolute top-3 left-3 rounded-md bg-white px-2 py-0.5 text-[9px] font-black uppercase text-slate-900 shadow">
          {product.tag}
        </span>
      )}
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
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-mesh"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="h-16 w-16 rounded-full bg-slate-900 border-4 border-brand-500 flex items-center justify-center">
            <span className="text-[9px] font-black text-white">FFT</span>
          </div>
          <p className="mt-4 text-xs font-black uppercase tracking-[0.2em] text-slate-800">
            Football Fans Tribe
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

type CartLine = { product: Product; size: string; qty: number };

function Shell({
  page,
  setPage,
  cartCount,
  onOpenCart,
  children,
}: {
  page: PageId;
  setPage: (p: PageId) => void;
  cartCount: number;
  onOpenCart: () => void;
  children: React.ReactNode;
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
          <div className="h-10 w-10 rounded-full bg-slate-900 border-2 border-brand-500 flex items-center justify-center">
            <span className="text-[7px] font-black text-white">FFT</span>
          </div>
          <div>
            <p className="text-sm font-black text-slate-900 leading-none">Football Fans Tribe</p>
            <p className="text-[10px] font-semibold text-slate-500 mt-0.5">Interviews · Podcasts · Shop</p>
          </div>
        </div>
        <nav className="flex items-center gap-0.5">
          {[...primary, ...more].map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setPage(t.id)}
              className={`rounded-xl px-2.5 py-2 text-[11px] font-bold ${
                page === t.id ? 'bg-brand-50 text-brand-700' : 'text-slate-500 hover:bg-slate-100'
              }`}
            >
              {t.label}
            </button>
          ))}
        </nav>
        <button
          type="button"
          onClick={onOpenCart}
          className="relative rounded-xl border border-slate-200 bg-white p-2.5 text-slate-600"
        >
          <ShoppingCart className="h-5 w-5" />
          {cartCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] rounded-full bg-brand-600 text-[10px] font-black text-white flex items-center justify-center px-1">
              {cartCount}
            </span>
          )}
        </button>
      </header>
      <header className="md:hidden fixed top-0 inset-x-0 z-40 glass-strong px-4 h-14 flex items-center justify-between">
        <span className="text-sm font-black text-slate-900">Fans Tribe</span>
        <div className="flex items-center gap-1">
          <button type="button" onClick={onOpenCart} className="relative p-2 text-slate-600">
            <ShoppingCart className="h-5 w-5" />
          </button>
          <button type="button" onClick={() => setMenuOpen(true)} className="p-2 text-slate-600">
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </header>
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.button
              type="button"
              className="md:hidden fixed inset-0 z-50 bg-slate-900/30"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
            />
            <motion.div
              className="md:hidden fixed top-0 right-0 bottom-0 z-50 w-[82%] max-w-xs glass-strong p-5"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
            >
              {[...primary, ...more].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => {
                    setPage(t.id);
                    setMenuOpen(false);
                  }}
                  className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold mb-1 w-full ${
                    page === t.id ? 'bg-brand-50 text-brand-700' : 'text-slate-600'
                  }`}
                >
                  {t.icon}
                  {t.label}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 nav-safe">
        <div className="mx-3 mb-2 rounded-2xl glass-strong">
          <div className="flex h-[62px]">
            {primary.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setPage(t.id)}
                className="flex-1 flex flex-col items-center justify-center gap-0.5"
              >
                <span
                  className={`flex h-8 w-10 items-center justify-center rounded-xl ${
                    page === t.id ? 'bg-brand-500 text-white' : 'text-slate-400'
                  }`}
                >
                  {t.icon}
                </span>
                <span className={`text-[9px] font-bold ${page === t.id ? 'text-brand-600' : 'text-slate-400'}`}>
                  {t.label}
                </span>
              </button>
            ))}
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
  const [feedArticle, setFeedArticle] = useState<FeedArticle | null>(null);
  const [cart, setCart] = useState<CartLine[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    const t = window.setTimeout(() => setBooting(false), 900);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    const path = window.location.pathname || '';
    const m = path.match(/^\/news\/([^/]+)/);
    if (path.startsWith('/news')) setPage('news');
    if (m?.[1]) {
      void fetchNews({ id: m[1], limit: 1 }).then((list) => {
        if (list[0]) setFeedArticle(list[0]);
      });
    }
  }, []);

  const cartCount = cart.reduce((s, l) => s + l.qty, 0);

  return (
    <div className="min-h-screen">
      <PageLoader show={booting} />
      {!booting && (
        <Shell
          page={page}
          setPage={(p) => {
            setPage(p);
            setFeedArticle(null);
            setProduct(null);
            try {
              if (p === 'news') window.history.replaceState({}, '', '/news');
            } catch {
              /* ignore */
            }
          }}
          cartCount={cartCount}
          onOpenCart={() => setCartOpen(true)}
        >
          <AnimatePresence mode="wait">
            <motion.div key={feedArticle ? feedArticle.id : product ? product.id : page} {...fade}>
              {feedArticle ? (
                <FeedArticlePage article={feedArticle} onBack={() => setFeedArticle(null)} />
              ) : product ? (
                <ProductView
                  product={product}
                  onBack={() => setProduct(null)}
                  onAdd={(size, qty) => {
                    setCart((c) => [...c, { product, size, qty }]);
                    setProduct(null);
                    setCartOpen(true);
                  }}
                />
              ) : (
                <>
                  {page === 'home' && <HomePage onGo={setPage} />}
                  {page === 'news' && (
                    <FeedNewsPage
                      onOpen={(a) => {
                        setFeedArticle(a);
                        try {
                          window.history.pushState({}, '', '/news/' + a.id);
                        } catch {
                          /* ignore */
                        }
                      }}
                    />
                  )}
                  {page === 'scores' && <ScoresPage />}
                  {page === 'shop' && (
                    <ShopPage
                      cart={cart}
                      onOpenCart={() => setCartOpen(true)}
                      onOpenProduct={setProduct}
                    />
                  )}
                  {page === 'podcasts' && <PodcastsPage />}
                  {page === 'about' && <AboutPage />}
                  {page === 'advertise' && <AdvertisePage />}
                  {page === 'contact' && <ContactPage />}
                </>
              )}
            </motion.div>
          </AnimatePresence>
          {cartOpen && (
            <CartDrawer
              open={cartOpen}
              onClose={() => setCartOpen(false)}
              lines={cart}
              onQty={(i, q) =>
                setCart((c) => c.map((l, idx) => (idx === i ? { ...l, qty: q } : l)))
              }
              onRemove={(i) => setCart((c) => c.filter((_, idx) => idx !== i))}
            />
          )}
        </Shell>
      )}
    </div>
  );
}

function HomePage({ onGo }: { onGo: (p: PageId) => void }) {
  const featured = NEWS.filter((n) => n.featured);
  return (
    <div className="space-y-6">
      <section>
        <p className="text-[11px] font-bold uppercase tracking-widest text-emerald-600">
          Naija football fans live here
        </p>
        <h1 className="mt-1 text-2xl font-black text-slate-900 tracking-tight">
          Stories, shows and the Tribe shop
        </h1>
      </section>
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {(
          [
            { p: 'news' as PageId, label: 'News', icon: '📰' },
            { p: 'scores' as PageId, label: 'Scores', icon: '⚽' },
            { p: 'shop' as PageId, label: 'Shop', icon: '👕' },
          ] as const
        ).map((x) => (
          <button
            key={x.p}
            type="button"
            onClick={() => onGo(x.p)}
            className="shrink-0 rounded-full glass px-3.5 py-2 text-[11px] font-bold text-slate-700"
          >
            {x.icon} {x.label}
          </button>
        ))}
      </div>
      <AdSlot label="Sponsored" />
      <section className="space-y-4">
        <h2 className="text-xs font-black uppercase tracking-widest text-slate-400">Featured</h2>
        {featured.map((a) => (
          <div key={a.id} className="rounded-3xl glass overflow-hidden">
            <div className={`h-28 bg-gradient-to-br ${a.imageGradient} flex items-end p-4`}>
              <span className="rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-black uppercase">
                {a.category}
              </span>
            </div>
            <div className="p-4">
              <h3 className="text-lg font-bold text-slate-900">{a.title}</h3>
              <p className="mt-2 text-sm text-slate-500 line-clamp-2">{a.summary}</p>
            </div>
          </div>
        ))}
      </section>
      <button
        type="button"
        onClick={() => onGo('news')}
        className="w-full rounded-2xl bg-brand-600 py-3 text-sm font-black text-white"
      >
        Open live news feed
      </button>
    </div>
  );
}

function ShopPage({
  cart,
  onOpenCart,
  onOpenProduct,
}: {
  cart: CartLine[];
  onOpenCart: () => void;
  onOpenProduct: (p: Product) => void;
}) {
  const count = cart.reduce((s, l) => s + l.qty, 0);
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-black text-slate-900">Tribe Shop</h1>
        <button
          type="button"
          onClick={onOpenCart}
          className="rounded-xl bg-brand-600 px-3.5 py-2.5 text-xs font-black text-white"
        >
          Cart{count > 0 ? ` (${count})` : ''}
        </button>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {PRODUCTS.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => onOpenProduct(p)}
            className="text-left rounded-2xl glass overflow-hidden"
          >
            <ProductArt product={p} />
            <div className="p-3">
              <p className="text-sm font-bold text-slate-900 line-clamp-2">{p.name}</p>
              <p className="text-brand-600 font-black text-sm mt-1">${p.price.toFixed(2)}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function ProductView({
  product,
  onBack,
  onAdd,
}: {
  product: Product;
  onBack: () => void;
  onAdd: (size: string, qty: number) => void;
}) {
  const [size, setSize] = useState(product.sizes[0]);
  const [qty, setQty] = useState(1);
  return (
    <div className="space-y-4">
      <button type="button" onClick={onBack} className="text-sm font-bold text-brand-600 inline-flex items-center gap-1">
        <ArrowLeft className="h-4 w-4" /> Back
      </button>
      <ProductArt product={product} large />
      <h1 className="text-xl font-black">{product.name}</h1>
      <p className="text-brand-600 font-black">${product.price.toFixed(2)}</p>
      <div className="flex flex-wrap gap-2">
        {product.sizes.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setSize(s)}
            className={`rounded-xl px-3 py-2 text-xs font-bold ${size === s ? 'bg-brand-600 text-white' : 'glass'}`}
          >
            {s}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-3">
        <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} className="p-2 glass rounded-xl">
          <Minus className="h-4 w-4" />
        </button>
        <span className="font-black">{qty}</span>
        <button type="button" onClick={() => setQty((q) => q + 1)} className="p-2 glass rounded-xl">
          <Plus className="h-4 w-4" />
        </button>
      </div>
      <button
        type="button"
        onClick={() => onAdd(size, qty)}
        className="w-full rounded-2xl bg-brand-600 py-3.5 text-sm font-black text-white"
      >
        Add to cart
      </button>
    </div>
  );
}

function PodcastsPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-black">Podcasts</h1>
      {PODCASTS.map((ep) => (
        <div key={ep.id} className="rounded-2xl glass p-4 flex gap-3">
          <div className="h-12 w-12 rounded-xl bg-slate-900 flex items-center justify-center">
            <Play className="h-5 w-5 text-white fill-white" />
          </div>
          <div>
            <p className="text-sm font-bold">{ep.title}</p>
            <p className="text-xs text-slate-500">
              {ep.show} · {ep.duration}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

function AboutPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-black">About</h1>
      <p className="text-sm text-slate-600">Naija football fans live here — 1.9M strong.</p>
    </div>
  );
}

function AdvertisePage() {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-black">Advertise</h1>
      {AD_PACKAGES.map((a) => (
        <div key={a.id} className="rounded-2xl glass p-4">
          <p className="font-black text-sm">{a.name}</p>
          <p className="text-brand-600 font-bold text-sm">{a.price}</p>
          <p className="text-xs text-slate-500 mt-1">{a.desc}</p>
        </div>
      ))}
    </div>
  );
}

function ContactPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-black">Contact</h1>
      <p className="text-sm flex items-center gap-2">
        <Mail className="h-4 w-4 text-brand-600" /> FansTribeinfo@gmail.com
      </p>
      <p className="text-sm flex items-center gap-2">
        <MessageCircle className="h-4 w-4 text-brand-600" /> Facebook: Football Fans Tribe
      </p>
    </div>
  );
}

function CartDrawer({
  open,
  onClose,
  lines,
  onQty,
  onRemove,
}: {
  open: boolean;
  onClose: () => void;
  lines: CartLine[];
  onQty: (i: number, q: number) => void;
  onRemove: (i: number) => void;
}) {
  const total = lines.reduce((s, l) => s + l.product.price * l.qty, 0);
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            type="button"
            className="fixed inset-0 z-50 bg-slate-900/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed bottom-0 inset-x-0 z-50 max-h-[85vh] rounded-t-3xl bg-white p-5 overflow-y-auto"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
          >
            <div className="flex justify-between mb-4">
              <p className="font-black text-sm">Cart</p>
              <button type="button" onClick={onClose}>
                <X className="h-5 w-5" />
              </button>
            </div>
            {lines.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-8">Cart is empty</p>
            ) : (
              <div className="space-y-3">
                {lines.map((l, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold truncate">{l.product.name}</p>
                      <p className="text-xs text-slate-500">
                        {l.size} · ${l.product.price.toFixed(2)}
                      </p>
                    </div>
                    <button type="button" onClick={() => onQty(i, Math.max(1, l.qty - 1))}>
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="text-sm font-bold">{l.qty}</span>
                    <button type="button" onClick={() => onQty(i, l.qty + 1)}>
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                    <button type="button" onClick={() => onRemove(i)} className="text-red-500">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
                <p className="font-black text-sm border-t pt-3">Total ${total.toFixed(2)}</p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
