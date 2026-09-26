export type PageId =
  | 'home'
  | 'news'
  | 'scores'
  | 'shop'
  | 'about'
  | 'advertise'
  | 'contact';

export interface LiveMatch {
  id: string;
  home: string;
  away: string;
  homeScore: number;
  awayScore: number;
  minute: string;
  league: string;
}

export interface ScheduledMatch {
  id: string;
  home: string;
  away: string;
  time: string;
  league: string;
  status: 'live' | 'fixture' | 'result';
  homeScore?: number;
  awayScore?: number;
  minute?: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  emoji: string;
  tag?: string;
  category: 'jersey' | 'hoodie' | 'cap' | 'accessories';
}

export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  body: string;
  category: 'Interview' | 'Match Analysis' | 'Transfer' | 'Opinion' | 'Feature';
  time: string;
  readMins: number;
  author: string;
  featured?: boolean;
  imageGradient: string;
}

export const LIVE_TICKER: LiveMatch[] = [
  { id: '1', home: 'ARS', away: 'CHE', homeScore: 2, awayScore: 1, minute: "78'", league: 'EPL' },
  { id: '2', home: 'RMA', away: 'BAR', homeScore: 1, awayScore: 1, minute: "64'", league: 'La Liga' },
  { id: '3', home: 'MCI', away: 'LIV', homeScore: 0, awayScore: 0, minute: "23'", league: 'EPL' },
  { id: '4', home: 'BAY', away: 'DOR', homeScore: 3, awayScore: 2, minute: "81'", league: 'Bundesliga' },
  { id: '5', home: 'PSG', away: 'OM', homeScore: 2, awayScore: 0, minute: "55'", league: 'Ligue 1' },
  { id: '6', home: 'INT', away: 'MIL', homeScore: 1, awayScore: 0, minute: "39'", league: 'Serie A' },
];

export const ALL_MATCHES: ScheduledMatch[] = [
  { id: 'm1', home: 'Arsenal', away: 'Chelsea', time: "78'", league: 'Premier League', status: 'live', homeScore: 2, awayScore: 1, minute: "78'" },
  { id: 'm2', home: 'Man City', away: 'Liverpool', time: "23'", league: 'Premier League', status: 'live', homeScore: 0, awayScore: 0, minute: "23'" },
  { id: 'm3', home: 'Tottenham', away: 'Newcastle', time: '17:30', league: 'Premier League', status: 'fixture' },
  { id: 'm4', home: 'Real Madrid', away: 'Barcelona', time: "64'", league: 'La Liga', status: 'live', homeScore: 1, awayScore: 1, minute: "64'" },
  { id: 'm5', home: 'Atletico', away: 'Sevilla', time: '20:00', league: 'La Liga', status: 'fixture' },
  { id: 'm6', home: 'Bayern', away: 'Dortmund', time: 'FT', league: 'UCL', status: 'result', homeScore: 3, awayScore: 2 },
  { id: 'm7', home: 'PSG', away: 'Inter', time: '20:45', league: 'UCL', status: 'fixture' },
  { id: 'm8', home: 'Liverpool', away: 'Real Madrid', time: 'FT', league: 'UCL', status: 'result', homeScore: 1, awayScore: 3 },
];

export const NEWS: NewsArticle[] = [
  {
    id: 'n1',
    title: '"I still train like a kid from the streets" — exclusive player interview',
    summary: 'A candid conversation about pressure, family, and what fans never see after the final whistle.',
    body: 'In our studio, the striker spoke openly about recovery routines, social media noise, and why representation still matters. He described the moment he almost quit at 17, the coach who refused to let him, and how African fans abroad fuel every sprint. This is not a press-room soundbite — it is a full interview on identity, ambition, and the cost of excellence.',
    category: 'Interview',
    time: '2h ago',
    readMins: 8,
    author: 'Amina Okoro',
    featured: true,
    imageGradient: 'from-violet-500/30 via-fuchsia-400/20 to-amber-200/30',
  },
  {
    id: 'n2',
    title: 'Channel analysis: Why the high press failed after minute 60',
    summary: 'Tactical breakdown of spacing, full-back fatigue, and the midfield pivot that decided the match.',
    body: 'We mapped every recovery run after the hour mark. The data is clear: the press became optional instead of coordinated. Central midfielders dropped five metres too deep, full-backs stayed high, and the opponent No.6 found the pocket repeatedly. Here is the clip-by-clip analysis, the manager likely fix for the next fixture, and what it means for the title race.',
    category: 'Match Analysis',
    time: '5h ago',
    readMins: 6,
    author: 'James Reed',
    featured: true,
    imageGradient: 'from-sky-400/25 via-cyan-300/20 to-emerald-200/25',
  },
  {
    id: 'n3',
    title: 'Fan interview: From Lagos street pitch to season-ticket holder',
    summary: 'How one supporter built a community of 12,000 fans who watch every match together.',
    body: 'He started with a WhatsApp group and a borrowed projector. Today the viewing room sells out. We asked about loyalty, ticket prices, and what clubs still get wrong about African fans. His answers are practical, emotional, and impossible to ignore if you work in football marketing.',
    category: 'Interview',
    time: '8h ago',
    readMins: 5,
    author: 'Chioma Bello',
    featured: true,
    imageGradient: 'from-orange-400/25 via-rose-300/20 to-pink-200/25',
  },
  {
    id: 'n4',
    title: 'Transfer desk: Three moves that quietly changed the league',
    summary: 'Not the biggest fees — the smartest structures. Loans, buy-backs, and sell-on clauses explained.',
    body: 'Deadline day headlines miss the fine print. We unpacked three deals where the structure matters more than the fee: performance triggers, optional years, and how clubs protected resale value.',
    category: 'Transfer',
    time: '12h ago',
    readMins: 4,
    author: 'Marco Silva',
    imageGradient: 'from-lime-400/20 via-green-300/15 to-teal-200/20',
  },
  {
    id: 'n5',
    title: 'Opinion: Stop treating African talent as a short-term gamble',
    summary: 'Clubs that invest in pathways — not just first-team minutes — win twice.',
    body: 'The pattern is familiar: sign young, loan often, sell early. The clubs building lasting value do the opposite. They assign mentors, protect rest cycles, and plan multi-year roles.',
    category: 'Opinion',
    time: '1d ago',
    readMins: 5,
    author: 'Nadia Hassan',
    imageGradient: 'from-indigo-400/25 via-blue-300/20 to-slate-200/25',
  },
  {
    id: 'n6',
    title: 'Feature: Inside a midweek recovery session with the physio team',
    summary: 'Ice baths are the easy photo. The real work is load management and sleep data.',
    body: 'We spent a morning with a top-flight medical unit. GPS loads, wellness questionnaires, and why one player sat out despite feeling fine. A rare look at the quiet decisions that keep squads available in April.',
    category: 'Feature',
    time: '1d ago',
    readMins: 7,
    author: 'Tom Adeyemi',
    imageGradient: 'from-amber-300/25 via-yellow-200/20 to-orange-100/30',
  },
];

export const PRODUCTS = [
  { id: 'p1', name: 'Home Jersey 26/27', price: 54.99, emoji: '👕', tag: 'Bestseller', category: 'jersey' as const },
  { id: 'p2', name: 'Away Jersey', price: 54.99, emoji: '🎽', tag: 'New', category: 'jersey' as const },
  { id: 'p3', name: 'Classic Hoodie', price: 64.99, emoji: '🧥', tag: 'Hot', category: 'hoodie' as const },
  { id: 'p4', name: 'Soft Shell Jacket', price: 79.99, emoji: '🧥', category: 'hoodie' as const },
  { id: 'p5', name: 'Matchday Cap', price: 24.99, emoji: '🧢', tag: 'New', category: 'cap' as const },
  { id: 'p6', name: 'Training Cap', price: 22.99, emoji: '🧢', category: 'cap' as const },
  { id: 'p7', name: 'Knit Scarf', price: 29.99, emoji: '🧣', category: 'accessories' as const },
  { id: 'p8', name: 'Socks 2-Pack', price: 16.99, emoji: '🧦', category: 'accessories' as const },
];

export const CREST_COLORS = [
  'bg-red-500', 'bg-blue-500', 'bg-sky-500', 'bg-amber-500',
  'bg-emerald-500', 'bg-purple-500', 'bg-rose-500', 'bg-indigo-500',
];

export const AD_PACKAGES = [
  { id: 'a1', name: 'Homepage Banner', price: 'From $290/wk', desc: 'Prime placement above the fold on every home visit.', reach: 'High intent fans' },
  { id: 'a2', name: 'In-Article Native', price: 'From $180/wk', desc: 'Sits inside long reads — interviews and analysis.', reach: 'Readers mid-session' },
  { id: 'a3', name: 'Newsletter Spot', price: 'From $120/send', desc: 'One featured slot in our weekly fan digest.', reach: 'Email subscribers' },
  { id: 'a4', name: 'Shop Takeover', price: 'Custom', desc: 'Brand the merch grid for a product launch weekend.', reach: 'Buyers' },
];
