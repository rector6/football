-- Football Fans Tribe — Phase 1 schema
-- Run in Supabase SQL Editor

-- Affiliate / engagement clicks
create table if not exists public.affiliate_clicks (
  id uuid primary key default gen_random_uuid(),
  event_type text,
  target text,
  article_id text,
  session_id text,
  user_agent text,
  referrer text,
  created_at timestamptz not null default now()
);

create index if not exists affiliate_clicks_created_idx
  on public.affiliate_clicks (created_at desc);

create index if not exists affiliate_clicks_event_idx
  on public.affiliate_clicks (event_type);

-- Newsletter list
create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  name text,
  source text,
  confirmed boolean not null default false,
  created_at timestamptz not null default now()
);

-- Tribe Insider subscriptions (Paystack — Phase 5)
create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  plan text,
  status text,
  paystack_ref text,
  expires_at timestamptz,
  created_at timestamptz not null default now()
);

-- Row Level Security
alter table public.affiliate_clicks enable row level security;
alter table public.newsletter_subscribers enable row level security;
alter table public.subscriptions enable row level security;

-- Anon can insert clicks (tracking from the public site)
drop policy if exists "anon_insert_affiliate_clicks" on public.affiliate_clicks;
create policy "anon_insert_affiliate_clicks"
  on public.affiliate_clicks
  for insert
  to anon
  with check (true);

-- Anon can subscribe to newsletter
drop policy if exists "anon_insert_newsletter" on public.newsletter_subscribers;
create policy "anon_insert_newsletter"
  on public.newsletter_subscribers
  for insert
  to anon
  with check (true);

-- No public read on clicks / subscriptions (service role bypasses RLS)
-- Newsletter: no public select (prevent email harvesting)
