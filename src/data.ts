export type PageId = 'feed' | 'scores' | 'forum' | 'shop';

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
}

export interface ChatMessage {
  id: string;
  user: string;
  text: string;
  side?: 'left' | 'right';
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

export const FEED_CARDS = [
  { id: 'c1', type: 'meme', title: 'When your team scores in the 90th', subtitle: '12.4k reactions', emoji: '😭⚽' },
  { id: 'c2', type: 'preview', title: 'El Clásico Preview', subtitle: 'Tactics, lineups & prediction', emoji: '🔥' },
  { id: 'c3', type: 'video', title: 'Top 10 Goals This Week', subtitle: 'Viral · 890k views', emoji: '▶️' },
  { id: 'c4', type: 'meme', title: 'VAR has entered the chat', subtitle: '8.1k reactions', emoji: '🤖' },
  { id: 'c5', type: 'preview', title: 'Transfer Deadline Drama', subtitle: 'Who moves before midnight?', emoji: '💥' },
  { id: 'c6', type: 'video', title: 'Fan Zone: Mad Celebration', subtitle: 'Tribe exclusive clip', emoji: '🎥' },
];

export const PRODUCTS: Product[] = [
  { id: 'p1', name: 'Tribe Home Jersey', price: 49.99, emoji: '👕', tag: 'Bestseller' },
  { id: 'p2', name: 'Neon Cap', price: 24.99, emoji: '🧢', tag: 'New' },
  { id: 'p3', name: 'Lime Hoodie', price: 64.99, emoji: 'hoodie' },
  { id: 'p4', name: 'Scarves Pack', price: 29.99, emoji: '🧣' },
  { id: 'p5', name: 'Matchday Tee', price: 34.99, emoji: '🎽', tag: 'Hot' },
  { id: 'p6', name: 'Tribe Socks', price: 14.99, emoji: '🧦' },
];

export const STARTER_CHAT: ChatMessage[] = [
  { id: 'ch1', user: 'Ade_Gunner', text: 'Arsenal looking solid tonight 🔥' },
  { id: 'ch2', user: 'Madridista_99', text: 'El Clásico is going to be chaos' },
  { id: 'ch3', user: 'Kopite_Liv', text: 'City vs Liverpool always delivers' },
  { id: 'ch4', user: 'TribeMod', text: 'Keep it respectful — debate hard, hate never 💚' },
  { id: 'ch5', user: 'BarcaFan_X', text: 'We need a win badly. Come on!' },
  { id: 'ch6', user: 'EPL_Analyst', text: 'That second goal was pure class' },
  { id: 'ch7', user: 'NaijaFan', text: 'Who else watching from Lagos? 🇳🇬' },
  { id: 'ch8', user: 'Ultra_South', text: 'Atmosphere is electric in here' },
];

export const CREST_COLORS = [
  'bg-red-600',
  'bg-blue-600',
  'bg-sky-500',
  'bg-amber-500',
  'bg-emerald-600',
  'bg-purple-600',
  'bg-rose-600',
  'bg-indigo-500',
];
