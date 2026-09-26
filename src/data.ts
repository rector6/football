export type PageId = 'home' | 'news' | 'scores' | 'forum' | 'shop';

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

export interface ChatMessage {
  id: string;
  user: string;
  text: string;
  side?: 'left' | 'right';
}

export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  body: string;
  category: string;
  time: string;
  readMins: number;
  emoji: string;
  featured?: boolean;
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
    title: 'Transfer Deadline Day: Five deals that shook Europe',
    summary: 'From late drama to record fees — everything fans need to know before the window slammed shut.',
    body: 'Clubs across Europe scrambled until the final hour. Star forwards moved, midfielders returned home, and several surprise loans reshaped title races. Here is a clear breakdown of the five moves every fan is talking about, what they mean for the season, and which squads look strongest on paper after deadline day.',
    category: 'Transfers',
    time: '2h ago',
    readMins: 4,
    emoji: '💥',
    featured: true,
  },
  {
    id: 'n2',
    title: 'El Clásico preview: Form, tactics and key battles',
    summary: 'Real Madrid host Barcelona with both sides under pressure. We break down the matchup.',
    body: 'Madrid arrive with confidence in attack but questions at the back. Barcelona need points and a response after a mixed run. Watch the midfield duel, set pieces, and how each coach manages the first 20 minutes. Expected lineups and three storylines that could decide the night.',
    category: 'Preview',
    time: '5h ago',
    readMins: 5,
    emoji: '🔥',
    featured: true,
  },
  {
    id: 'n3',
    title: 'Premier League round-up: Title race tightens again',
    summary: 'Three teams remain in touching distance as the season enters a decisive stretch.',
    body: 'Results over the weekend reshuffled the table. Away form is becoming the separator. We look at remaining fixtures, injury lists, and which managers still have room to rotate without dropping points.',
    category: 'League',
    time: '8h ago',
    readMins: 3,
    emoji: '🏆',
  },
  {
    id: 'n4',
    title: 'How African stars are shaping top European clubs',
    summary: 'From the Premier League to La Liga, continental talent is driving big moments.',
    body: 'A new generation is delivering goals, assists and leadership. This piece highlights standout performers this month, their club impact, and what it means for the next AFCON cycle.',
    category: 'Features',
    time: '12h ago',
    readMins: 6,
    emoji: '🌍',
  },
  {
    id: 'n5',
    title: 'VAR debate: What fans actually want changed',
    summary: 'Clarity, speed and consistency — the Tribe community speaks.',
    body: 'After another weekend of disputed calls, we gathered the most common fan requests: fewer stoppages, clearer announcements, and a higher bar for intervention. Here is a practical list leagues could adopt without rewriting the laws of the game.',
    category: 'Opinion',
    time: '1d ago',
    readMins: 4,
    emoji: '🤖',
  },
  {
    id: 'n6',
    title: 'Youth academy watch: Three names to track this season',
    summary: 'Teenagers already training with first teams — and why scouts are excited.',
    body: 'Development pathways are accelerating. We profile three prospects, their playing styles, and realistic timelines for regular minutes.',
    category: 'Youth',
    time: '1d ago',
    readMins: 3,
    emoji: '⭐',
  },
];

export const PRODUCTS: Product[] = [
  { id: 'p1', name: 'Tribe Home Jersey', price: 54.99, emoji: '👕', tag: 'Bestseller', category: 'jersey' },
  { id: 'p2', name: 'Away Jersey 26/27', price: 54.99, emoji: '🎽', tag: 'New', category: 'jersey' },
  { id: 'p3', name: 'Classic Lime Hoodie', price: 64.99, emoji: '🧥', tag: 'Hot', category: 'hoodie' },
  { id: 'p4', name: 'Blackout Hoodie', price: 62.99, emoji: '🖤', category: 'hoodie' },
  { id: 'p5', name: 'Neon Cap', price: 24.99, emoji: '🧢', tag: 'New', category: 'cap' },
  { id: 'p6', name: 'Matchday Cap', price: 22.99, emoji: '🎩', category: 'cap' },
  { id: 'p7', name: 'Tribe Scarf', price: 29.99, emoji: '🧣', category: 'accessories' },
  { id: 'p8', name: 'Training Socks (2-pack)', price: 16.99, emoji: '🧦', category: 'accessories' },
  { id: 'p9', name: 'Pro Training Jacket', price: 79.99, emoji: '🧥', tag: 'Pro', category: 'hoodie' },
  { id: 'p10', name: 'Fan Wristband Set', price: 12.99, emoji: '💚', category: 'accessories' },
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
