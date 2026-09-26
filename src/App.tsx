import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Home,
  Trophy,
  MessagesSquare,
  ShoppingBag,
  Radio,
  Send,
  Plus,
  X,
  Sparkles,
  Flame,
  ShoppingCart,
  Trash2,
  Crown,
} from 'lucide-react';
import {
  PageId,
  LIVE_TICKER,
  ALL_MATCHES,
  FEED_CARDS,
  PRODUCTS,
  STARTER_CHAT,
  CREST_COLORS,
  ChatMessage,
  Product,
} from './data';

const pageTransition = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.22, ease: 'easeOut' },
};

function Crest({ name, size = 'md' }: { name: string; size?: 'sm' | 'md' }) {
  const color = CREST_COLORS[name.charCodeAt(0) % CREST_COLORS.length];
  const dim = size === 'sm' ? 'h-7 w-7 text-[10px]' : 'h-9 w-9 text-xs';
  return (
    <div
      className={`${dim} ${color} rounded-full flex items-center justify-center font-black text-white shrink-0 shadow-inner`}
    >
      {name.slice(0, 2).toUpperCase()}
    </div>
  );
}

function LiveDot() {
  return <span className="live-dot inline-block h-1.5 w-1.5 rounded-full bg-tribe-live shadow-live" />;
}

function Nav({
  page,
  setPage,
  cartCount,
  onOpenCart,
}: {
  page: PageId;
  setPage: (p: PageId) => void;
  cartCount: number;
  onOpenCart: () => void;
}) {
  const tabs: { id: PageId; label: string; icon: React.ReactNode }[] = [
    { id: 'feed', label: 'Feed', icon: <Home className="h-5 w-5" /> },
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
            <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest mt-0.5">Premium Fan Hub</p>
          </div>
        </div>
        <nav className="flex items-center gap-1">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setPage(t.id)}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold uppercase tracking-wide transition ${
                page === t.id ? 'bg-tribe-lime/15 text-tribe-lime' : 'text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800/60'
              }`}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </nav>
        <button
          type="button"
          onClick={onOpenCart}
          className="relative rounded-xl border border-zinc-700 bg-tribe-charcoal p-2.5 text-zinc-300 hover:border-tribe-lime/50 hover:text-tribe-lime transition"
        >
          <ShoppingCart className="h-5 w-5" />
          {cartCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] rounded-full bg-tribe-lime text-[10px] font-black text-black flex items-center justify-center px-1">
              {cartCount}
            </span>
          )}
        </button>
      </header>

      <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 nav-safe">
        <div className="mx-3 mb-2 rounded-2xl border border-zinc-800/90 bg-tribe-charcoal/95 backdrop-blur-xl shadow-[0_-4px_24px_rgba(0,0,0,0.45)]">
          <div className="flex items-stretch justify-around h-[64px] px-1">
            {tabs.map((t) => {
              const active = page === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setPage(t.id)}
                  className="relative flex-1 flex flex-col items-center justify-center gap-0.5 min-h-[48px] active:scale-95 transition-transform"
                >
                  <span
                    className={`flex items-center justify-center h-9 w-12 rounded-2xl transition-all duration-200 ${
                      active ? 'bg-tribe-lime text-black shadow-lime scale-105' : 'text-zinc-500'
                    }`}
                  >
                    {t.icon}
                  </span>
                  <span className={`text-[10px] font-bold tracking-wide transition-colors ${active ? 'text-tribe-lime' : 'text-zinc-500'}`}>
                    {t.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>
    </>
  );
}

function FeedPage() {
  return (
    <div className="space-y-5">
      <section>
        <div className="flex items-center gap-2 mb-2.5 px-1">
          <Radio className="h-3.5 w-3.5 text-tribe-live" />
          <span className="text-[10px] font-black uppercase tracking-widest text-tribe-live">Live now</span>
        </div>
        <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-1 -mx-1 px-1">
          {LIVE_TICKER.map((m) => (
            <div key={m.id} className="shrink-0 w-[148px] rounded-2xl border border-zinc-800 bg-tribe-charcoal p-3">
              <div className="flex items-center gap-1.5 mb-2">
                <span className="live-badge inline-flex items-center gap-1 rounded-full bg-tribe-live/15 px-1.5 py-0.5 text-[9px] font-black uppercase text-tribe-live">
                  <LiveDot /> Live
                </span>
                <span className="text-[9px] font-semibold text-zinc-500 uppercase">{m.league}</span>
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

      <section className="relative overflow-hidden rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-900 via-tribe-charcoal to-black p-5 sm:p-6">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(163,230,53,0.12),_transparent_55%)]" />
        <div className="relative">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-tribe-lime/30 bg-tribe-lime/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-tribe-lime">
            <Sparkles className="h-3 w-3" /> Breaking
          </span>
          <h1 className="mt-3 text-2xl sm:text-3xl font-black uppercase tracking-tight text-white leading-tight">
            Transfer Deadline Day Drama!
          </h1>
          <p className="mt-2 text-sm text-zinc-400 max-w-md leading-relaxed">
            Big names on the move. Clubs scrambling. The Tribe is watching every deal — live updates inside.
          </p>
          <button type="button" className="mt-4 inline-flex items-center gap-2 rounded-xl bg-tribe-lime px-4 py-2.5 text-xs font-black uppercase tracking-wide text-black shadow-lime active:scale-[0.98] transition">
            Read the story
          </button>
        </div>
      </section>

      <section>
        <h2 className="text-xs font-black uppercase tracking-widest text-zinc-500 mb-3 px-1">Trending in the Tribe</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {FEED_CARDS.map((c) => (
            <button key={c.id} type="button" className="text-left rounded-2xl border border-zinc-800 bg-tribe-charcoal p-4 hover:border-zinc-600 active:scale-[0.99] transition">
              <div className="flex items-start justify-between gap-2">
                <span className="text-2xl">{c.emoji === 'hoodie' ? '🧥' : c.emoji}</span>
                <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-500 bg-zinc-900 rounded-md px-1.5 py-0.5">{c.type}</span>
              </div>
              <p className="mt-3 text-sm font-bold text-white leading-snug">{c.title}</p>
              <p className="mt-1 text-xs text-zinc-500">{c.subtitle}</p>
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
          <p className="text-xs text-zinc-400">Ad-free feed, exclusive chats & early merch drops.</p>
        </div>
        <button type="button" className="shrink-0 rounded-xl bg-tribe-lime px-3 py-2 text-[10px] font-black uppercase text-black">
          Upgrade
        </button>
      </section>
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
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`flex-1 rounded-xl py-2.5 text-[11px] font-black uppercase tracking-wide transition ${
              tab === t ? 'bg-tribe-lime text-black shadow-lime' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
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
                    <button type="button" className="rounded-lg border border-zinc-700 bg-zinc-900 px-2.5 py-1 text-[10px] font-bold uppercase text-zinc-300">Chat</button>
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

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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
        <p className="text-xs text-zinc-500 mt-0.5">Polls, debates & match-day energy</p>
      </div>
      <section className="rounded-2xl border border-zinc-800 bg-tribe-charcoal p-4 space-y-4">
        <div className="flex items-center gap-2">
          <Flame className="h-4 w-4 text-tribe-lime" />
          <h2 className="text-xs font-black uppercase tracking-widest text-zinc-400">Live poll</h2>
        </div>
        <p className="text-base font-bold text-white">Who wins El Clásico tonight?</p>
        <p className="text-xs text-zinc-500 -mt-2">Real Madrid vs Barcelona</p>
        <div className="grid grid-cols-2 gap-2.5">
          <button type="button" onClick={() => vote('madrid')} disabled={!!voted} className={`rounded-xl border p-3.5 text-left transition active:scale-[0.98] ${voted === 'madrid' ? 'border-tribe-lime bg-tribe-lime/10' : 'border-zinc-700 bg-zinc-900/80'} ${voted && voted !== 'madrid' ? 'opacity-60' : ''}`}>
            <Crest name="RMA" />
            <p className="mt-2 text-sm font-bold text-white">Real Madrid</p>
            <p className="text-[10px] text-zinc-500 font-semibold">{votes.madrid} votes</p>
          </button>
          <button type="button" onClick={() => vote('barca')} disabled={!!voted} className={`rounded-xl border p-3.5 text-left transition active:scale-[0.98] ${voted === 'barca' ? 'border-tribe-lime bg-tribe-lime/10' : 'border-zinc-700 bg-zinc-900/80'} ${voted && voted !== 'barca' ? 'opacity-60' : ''}`}>
            <Crest name="BAR" />
            <p className="mt-2 text-sm font-bold text-white">Barcelona</p>
            <p className="text-[10px] text-zinc-500 font-semibold">{votes.barca} votes</p>
          </button>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-[10px] font-bold uppercase tracking-wide text-zinc-500">
            <span>Madrid {madridPct}%</span>
            <span>Barça {barcaPct}%</span>
          </div>
          <div className="h-2.5 rounded-full bg-zinc-900 overflow-hidden flex">
            <motion.div className="h-full bg-tribe-lime" initial={false} animate={{ width: `${madridPct}%` }} transition={{ type: 'spring', stiffness: 120, damping: 18 }} />
            <motion.div className="h-full bg-blue-500" initial={false} animate={{ width: `${barcaPct}%` }} transition={{ type: 'spring', stiffness: 120, damping: 18 }} />
          </div>
        </div>
        {voted && <p className="text-xs text-tribe-lime font-semibold text-center">Vote locked — thanks!</p>}
      </section>
      <section className="rounded-2xl border border-zinc-800 bg-tribe-charcoal overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <MessagesSquare className="h-4 w-4 text-tribe-lime" />
            <span className="text-xs font-black uppercase tracking-widest text-zinc-300">Match chat</span>
          </div>
          <span className="text-[10px] font-bold text-zinc-500"><span className="text-tribe-lime">1.2k</span> online</span>
        </div>
        <div className="h-64 overflow-y-auto no-scrollbar p-3 space-y-2.5">
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
          <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && send()} placeholder="Join the debate..." className="flex-1 rounded-xl border border-zinc-700 bg-zinc-900 px-3.5 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-tribe-lime/50" />
          <button type="button" onClick={send} className="rounded-xl bg-tribe-lime p-2.5 text-black shadow-lime active:scale-95 transition" aria-label="Send">
            <Send className="h-5 w-5" />
          </button>
        </div>
      </section>
    </div>
  );
}

function ShopPage({ onAdd, cartCount, onOpenCart }: { onAdd: (p: Product) => void; cartCount: number; onOpenCart: () => void }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-black uppercase tracking-tight text-white">Tribe Store</h1>
          <p className="text-xs text-zinc-500 mt-0.5">Official merch — wear the energy</p>
        </div>
        <button type="button" onClick={onOpenCart} className="md:hidden relative rounded-xl border border-zinc-700 bg-tribe-charcoal p-2.5">
          <ShoppingCart className="h-5 w-5 text-zinc-300" />
          {cartCount > 0 && <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full bg-tribe-lime text-[10px] font-black text-black flex items-center justify-center">{cartCount}</span>}
        </button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {PRODUCTS.map((p) => (
          <div key={p.id} className="rounded-2xl border border-zinc-800 bg-tribe-charcoal overflow-hidden flex flex-col">
            <div className="aspect-square bg-zinc-900/80 flex items-center justify-center text-5xl relative">
              {p.emoji === 'hoodie' ? '🧥' : p.emoji}
              {p.tag && <span className="absolute top-2 left-2 rounded-md bg-tribe-lime px-1.5 py-0.5 text-[9px] font-black uppercase text-black">{p.tag}</span>}
            </div>
            <div className="p-3 flex flex-col flex-1">
              <p className="text-sm font-bold text-white leading-snug">{p.name}</p>
              <p className="text-tribe-lime font-black text-sm mt-1">${p.price.toFixed(2)}</p>
              <button type="button" onClick={() => onAdd(p)} className="mt-auto pt-3 w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-tribe-lime py-2.5 text-[11px] font-black uppercase text-black active:scale-[0.98] transition">
                <Plus className="h-3.5 w-3.5" /> Add to cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CartDrawer({ open, onClose, items, onRemove }: { open: boolean; onClose: () => void; items: Product[]; onRemove: (index: number) => void }) {
  const total = items.reduce((s, i) => s + i.price, 0);
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button type="button" aria-label="Close cart" className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
          <motion.aside className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-sm bg-tribe-charcoal border-l border-zinc-800 flex flex-col shadow-2xl" initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', stiffness: 320, damping: 32 }}>
            <div className="flex items-center justify-between px-4 py-4 border-b border-zinc-800">
              <h2 className="text-sm font-black uppercase tracking-wider text-white">Your cart</h2>
              <button type="button" onClick={onClose} className="p-2 rounded-xl hover:bg-zinc-800"><X className="h-5 w-5 text-zinc-400" /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {items.length === 0 ? (
                <div className="py-16 text-center">
                  <ShoppingBag className="h-10 w-10 text-zinc-600 mx-auto mb-2" />
                  <p className="text-sm font-bold text-zinc-400">Cart is empty</p>
                </div>
              ) : (
                items.map((item, idx) => (
                  <div key={`${item.id}-${idx}`} className="flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900/50 p-3">
                    <span className="text-2xl">{item.emoji === 'hoodie' ? '🧥' : item.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-white truncate">{item.name}</p>
                      <p className="text-xs font-bold text-tribe-lime">${item.price.toFixed(2)}</p>
                    </div>
                    <button type="button" onClick={() => onRemove(idx)} className="p-2 rounded-lg text-zinc-500 hover:text-tribe-live"><Trash2 className="h-4 w-4" /></button>
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
                  Checkout — Tribe Pro members save 10%
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
  const [page, setPage] = useState<PageId>('feed');
  const [cart, setCart] = useState<Product[]>([]);
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <div className="min-h-screen bg-tribe-black text-white font-sans">
      <Nav page={page} setPage={setPage} cartCount={cart.length} onOpenCart={() => setCartOpen(true)} />
      <main className="mx-auto max-w-3xl px-4 pt-5 md:pt-24 pb-safe">
        <AnimatePresence mode="wait">
          <motion.div key={page} {...pageTransition}>
            {page === 'feed' && <FeedPage />}
            {page === 'scores' && <ScoresPage />}
            {page === 'forum' && <ForumPage />}
            {page === 'shop' && (
              <ShopPage onAdd={(p) => setCart((c) => [...c, p])} cartCount={cart.length} onOpenCart={() => setCartOpen(true)} />
            )}
          </motion.div>
        </AnimatePresence>
      </main>
      {cart.length > 0 && page !== 'shop' && (
        <button type="button" onClick={() => setCartOpen(true)} className="md:hidden fixed bottom-[7.5rem] right-4 z-30 h-14 w-14 rounded-full bg-tribe-lime text-black shadow-lime flex items-center justify-center active:scale-95 transition">
          <ShoppingCart className="h-6 w-6" />
          <span className="absolute -top-1 -right-1 h-5 min-w-5 rounded-full bg-black text-tribe-lime text-[10px] font-black flex items-center justify-center px-1 border-2 border-tribe-lime">{cart.length}</span>
        </button>
      )}
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} items={cart} onRemove={(index) => setCart((c) => c.filter((_, i) => i !== index))} />
    </div>
  );
}
