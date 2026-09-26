export type PageId =
  | 'home'
  | 'news'
  | 'scores'
  | 'shop'
  | 'podcasts'
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
  compareAt?: number;
  tag?: string;
  category: 'jersey' | 'hoodie' | 'cap' | 'accessories';
  club: string;
  colors: string[];
  description: string;
  sizes: string[];
}

export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  body: string;
  category: 'Interview' | 'Match Analysis' | 'Preview' | 'Review' | 'Naija Fans' | 'Feature';
  time: string;
  readMins: number;
  author: string;
  featured?: boolean;
  imageGradient: string;
}

export interface PodcastEpisode {
  id: string;
  title: string;
  show: string;
  duration: string;
  time: string;
  description: string;
}

export const LIVE_TICKER: LiveMatch[] = [
  { id: '1', home: 'ARS', away: 'CHE', homeScore: 2, awayScore: 1, minute: "78'", league: 'EPL' },
  { id: '2', home: 'RMA', away: 'BAR', homeScore: 1, awayScore: 1, minute: "64'", league: 'La Liga' },
  { id: '3', home: 'MCI', away: 'LIV', homeScore: 0, awayScore: 0, minute: "23'", league: 'EPL' },
  { id: '4', home: 'NGA', away: 'GHA', homeScore: 1, awayScore: 0, minute: "55'", league: 'AFCON Q' },
  { id: '5', home: 'PSG', away: 'OM', homeScore: 2, awayScore: 0, minute: "55'", league: 'Ligue 1' },
  { id: '6', home: 'INT', away: 'MIL', homeScore: 1, awayScore: 0, minute: "39'", league: 'Serie A' },
];

export const ALL_MATCHES: ScheduledMatch[] = [
  { id: 'm1', home: 'Arsenal', away: 'Chelsea', time: "78'", league: 'Premier League', status: 'live', homeScore: 2, awayScore: 1, minute: "78'" },
  { id: 'm2', home: 'Man City', away: 'Liverpool', time: "23'", league: 'Premier League', status: 'live', homeScore: 0, awayScore: 0, minute: "23'" },
  { id: 'm3', home: 'Nigeria', away: 'Ghana', time: "55'", league: 'AFCON Qualifiers', status: 'live', homeScore: 1, awayScore: 0, minute: "55'" },
  { id: 'm4', home: 'Real Madrid', away: 'Barcelona', time: "64'", league: 'La Liga', status: 'live', homeScore: 1, awayScore: 1, minute: "64'" },
  { id: 'm5', home: 'Tottenham', away: 'Newcastle', time: '17:30', league: 'Premier League', status: 'fixture' },
  { id: 'm6', home: 'Bayern', away: 'Dortmund', time: 'FT', league: 'UCL', status: 'result', homeScore: 3, awayScore: 2 },
  { id: 'm7', home: 'PSG', away: 'Inter', time: '20:45', league: 'UCL', status: 'fixture' },
  { id: 'm8', home: 'Liverpool', away: 'Real Madrid', time: 'FT', league: 'UCL', status: 'result', homeScore: 1, awayScore: 3 },
];

export const NEWS: NewsArticle[] = [
  {
    id: 'n1',
    title: 'I still train like a kid from the streets — exclusive Super Eagles interview',
    summary: 'A candid conversation about pressure, family, and what Naija fans never see after the final whistle.',
    body: 'In our studio, the striker spoke openly about recovery routines, social media noise, and why the green-white-green still means everything. He described the moment he almost quit at 17, the coach who refused to let him, and how fans in Lagos, London and Atlanta fuel every sprint.',
    category: 'Interview',
    time: '2h ago',
    readMins: 8,
    author: 'Amina Okoro',
    featured: true,
    imageGradient: 'from-emerald-500/35 via-green-400/20 to-lime-200/30',
  },
  {
    id: 'n2',
    title: 'Match analysis: Why the high press collapsed after minute 60',
    summary: 'Channel breakdown of spacing, full-back fatigue, and the midfield pivot that decided the game.',
    body: 'We mapped every recovery run after the hour mark. The press became optional instead of coordinated. Clip-by-clip analysis the way Fans Tribe breaks games down on the channel.',
    category: 'Match Analysis',
    time: '5h ago',
    readMins: 6,
    author: 'James Reed',
    featured: true,
    imageGradient: 'from-sky-400/30 via-cyan-300/20 to-blue-200/25',
  },
  {
    id: 'n3',
    title: 'Naija fans: From street pitch viewing rooms to 12,000 watching together',
    summary: 'How one supporter built a community that sells out every big Eagles night.',
    body: 'He started with a WhatsApp group and a borrowed projector. Today the viewing room sells out. Loyalty, ticket prices, and what clubs still get wrong about African fans.',
    category: 'Naija Fans',
    time: '8h ago',
    readMins: 5,
    author: 'Chioma Bello',
    featured: true,
    imageGradient: 'from-orange-400/30 via-amber-300/20 to-yellow-200/25',
  },
  {
    id: 'n4',
    title: 'Preview: Nigeria vs Ghana — lineups, form and three storylines',
    summary: 'Everything you need before kick-off: expected XI, key battles, and fan predictions from the Tribe.',
    body: 'Form guide, injury news, and the tactical questions both coaches face. Plus what the podcast panel called earlier in the week.',
    category: 'Preview',
    time: '12h ago',
    readMins: 4,
    author: 'Fans Tribe Desk',
    imageGradient: 'from-green-500/25 via-emerald-300/20 to-teal-200/25',
  },
  {
    id: 'n5',
    title: 'Review: Five talking points after a chaotic weekend',
    summary: 'Goals, VAR debates, and the moments Naija timelines would not let go.',
    body: 'We ranked the biggest moments, the softest defending, and the performance that deserved more love.',
    category: 'Review',
    time: '1d ago',
    readMins: 5,
    author: 'Tom Adeyemi',
    imageGradient: 'from-rose-400/25 via-pink-300/20 to-fuchsia-200/25',
  },
  {
    id: 'n6',
    title: 'Feature: Inside a midweek recovery session with the physio team',
    summary: 'Ice baths are the easy photo. The real work is load management and sleep data.',
    body: 'A rare look at GPS loads, wellness questionnaires, and why one player sat out despite feeling fine.',
    category: 'Feature',
    time: '1d ago',
    readMins: 7,
    author: 'Nadia Hassan',
    imageGradient: 'from-indigo-400/25 via-violet-300/20 to-slate-200/25',
  },
];

export const PODCASTS: PodcastEpisode[] = [
  {
    id: 'ep1',
    title: 'Super Eagles special: Who starts on Saturday?',
    show: 'Fans Tribe Live',
    duration: '48 min',
    time: 'Today',
    description: 'Panel debate, fan calls, and bold predictions before the qualifier.',
  },
  {
    id: 'ep2',
    title: 'Premier League weekend debrief',
    show: 'Matchday Podcast',
    duration: '62 min',
    time: 'Yesterday',
    description: 'Title race, VAR chaos, and the Naija players who showed up.',
  },
  {
    id: 'ep3',
    title: 'Vlog recap: Behind the scenes at the viewing centre',
    show: 'Tribe Vlogs',
    duration: '22 min',
    time: '2d ago',
    description: 'Atmosphere, interviews with fans, and the moment the room exploded.',
  },
];

export const PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Nigeria Home Jersey 26/27',
    price: 59.99,
    compareAt: 74.99,
    tag: 'Bestseller',
    category: 'jersey',
    club: 'Nigeria',
    colors: ['#008751', '#ffffff'],
    description: 'Official-style Super Eagles home shirt. Lightweight fabric, regular fit. Perfect for match day and the viewing centre.',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
  },
  {
    id: 'p2',
    name: 'Arsenal Home Jersey',
    price: 54.99,
    tag: 'Hot',
    category: 'jersey',
    club: 'Arsenal',
    colors: ['#EF0107', '#FFFFFF'],
    description: 'Classic gunners red home kit replica. Breathable, match-ready cut.',
    sizes: ['S', 'M', 'L', 'XL'],
  },
  {
    id: 'p3',
    name: 'Chelsea Home Jersey',
    price: 54.99,
    category: 'jersey',
    club: 'Chelsea',
    colors: ['#034694', '#FFFFFF'],
    description: 'Blues home shirt with clean sleeve detail. Soft feel, durable print zones.',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
  },
  {
    id: 'p4',
    name: 'Man City Home Jersey',
    price: 54.99,
    tag: 'New',
    category: 'jersey',
    club: 'Man City',
    colors: ['#6CABDD', '#FFFFFF'],
    description: 'Sky blue home jersey. Modern collar, fan fit. Ships across Nigeria.',
    sizes: ['S', 'M', 'L', 'XL'],
  },
  {
    id: 'p5',
    name: 'Liverpool Home Jersey',
    price: 54.99,
    category: 'jersey',
    club: 'Liverpool',
    colors: ['#C8102E', '#FFFFFF'],
    description: 'Reds home kit style. Bold crest area, comfortable for all-day wear.',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
  },
  {
    id: 'p6',
    name: 'Real Madrid Home Jersey',
    price: 56.99,
    category: 'jersey',
    club: 'Real Madrid',
    colors: ['#FFFFFF', '#FEBE10'],
    description: 'Los Blancos home white. Premium feel, gold accent detail.',
    sizes: ['S', 'M', 'L', 'XL'],
  },
  {
    id: 'p7',
    name: 'Barcelona Home Jersey',
    price: 56.99,
    category: 'jersey',
    club: 'Barcelona',
    colors: ['#A50044', '#004D98'],
    description: 'Blaugrana stripes. Iconic look for Clasico nights.',
    sizes: ['S', 'M', 'L', 'XL'],
  },
  {
    id: 'p8',
    name: 'Fans Tribe Hoodie',
    price: 64.99,
    tag: 'Tribe',
    category: 'hoodie',
    club: 'Fans Tribe',
    colors: ['#0f172a', '#6366f1'],
    description: 'Official Football Fans Tribe hoodie. Soft fleece, front pouch, logo print.',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
  },
  {
    id: 'p9',
    name: 'Matchday Cap',
    price: 24.99,
    category: 'cap',
    club: 'Fans Tribe',
    colors: ['#0f172a', '#22c55e'],
    description: 'Adjustable cap with embroidered Tribe mark. One size.',
    sizes: ['One size'],
  },
  {
    id: 'p10',
    name: 'Naija Scarf',
    price: 29.99,
    category: 'accessories',
    club: 'Nigeria',
    colors: ['#008751', '#ffffff'],
    description: 'Green and white knit scarf for qualifiers and AFCON nights.',
    sizes: ['One size'],
  },
];

export const CREST_COLORS = [
  'bg-red-500', 'bg-blue-500', 'bg-sky-500', 'bg-amber-500',
  'bg-emerald-500', 'bg-purple-500', 'bg-rose-500', 'bg-indigo-500',
];

export const AD_PACKAGES = [
  { id: 'a1', name: 'Homepage Banner', price: 'From NGN 450k/wk', desc: 'Prime placement on every home visit for Naija football fans.', reach: '1.9M-aligned audience' },
  { id: 'a2', name: 'In-Article Native', price: 'From NGN 280k/wk', desc: 'Inside interviews, previews and match analysis.', reach: 'Readers mid-session' },
  { id: 'a3', name: 'Podcast / Live show mention', price: 'Custom', desc: 'Integrated reads on Fans Tribe Live and Matchday Podcast.', reach: 'Audio and live viewers' },
  { id: 'a4', name: 'Shop takeover', price: 'Custom', desc: 'Brand the merch grid for a launch weekend.', reach: 'Buyers' },
];

export const FOOTER_LINKS = {
  explore: [
    { id: 'news' as PageId, label: 'News and stories' },
    { id: 'scores' as PageId, label: 'Live scores' },
    { id: 'podcasts' as PageId, label: 'Podcasts and shows' },
    { id: 'shop' as PageId, label: 'Shop' },
  ],
  company: [
    { id: 'about' as PageId, label: 'About us' },
    { id: 'advertise' as PageId, label: 'Advertise' },
    { id: 'contact' as PageId, label: 'Contact and support' },
  ],
};
