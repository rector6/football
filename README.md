# Football Fans Tribe — Production platform

Modern media + shop for **Football Fans Tribe** (Naija brand · 1.9M Facebook following).

## What’s included

- **Home** — Studio hero, featured interviews & analysis, newsletter (no live scores on home)
- **News** — Filters by Interview / Match Analysis / Preview / Review / Naija Fans / Feature
- **Article pages** — Professional layout, author, share (native, X, Facebook, copy link)
- **Live scores** — API-Football (EPL, La Liga, UCL, Serie A, Bundesliga, Ligue 1, NPFL) with demo fallback
- **Shop** — Jerseys (Nigeria + major clubs), hoodie, cap, scarf · product detail + cart (cart only on shop)
- **Podcasts** — Episode cards for Fans Tribe Live / Matchday / Vlogs
- **About · Advertise · Contact** — Brand story, ad packages, support form
- **PWA-ready** light glass UI · mobile bottom nav · smooth page loader

## Stack

React 18 · Vite · TypeScript · Tailwind · Framer Motion · Lucide · API-Football

## Setup

```bash
npm install
cp .env.example .env   # optional: add VITE_API_FOOTBALL_KEY
npm run dev
```

Without an API key, scores use high-quality demo data (major clubs + Nigeria).

## Deploy

Netlify / any static host. Do **not** deploy until the brand is ready — build and review on GitHub first.

```bash
npm run build
```

`netlify.toml` and `public/_redirects` are included for SPA routing when you push.

## Pitch summary

Production-ready demo of a complete fan platform: news-first home, studio welcome, shareable articles, real jersey product flow, newsletter, and live scores for the Tribe.
