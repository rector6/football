-- Phase 3 (enhanced): news engine + Nigeria/Africa sources

create table if not exists public.news_articles (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  summary text not null,
  source text not null,
  source_url text unique not null,
  image text,
  tags text[] default '{}',
  category text,
  published_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists news_articles_published_idx
  on public.news_articles (published_at desc nulls last);

create index if not exists news_articles_category_idx
  on public.news_articles (category);

create table if not exists public.news_sources (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  rss_url text unique not null,
  category text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

insert into public.news_sources (name, rss_url, category, active)
values
  ('BBC Sport Football', 'https://feeds.bbci.co.uk/sport/football/rss.xml', 'General', true),
  ('Sky Sports Football', 'https://www.skysports.com/rss/12040', 'General', true),
  ('ESPN Soccer', 'https://www.espn.com/espn/rss/soccer/news', 'General', true),
  ('Goal.com', 'https://www.goal.com/feeds/en/news', 'Transfers', true),
  ('The Guardian Football', 'https://www.theguardian.com/football/rss', 'Analysis', true),
  ('Transfermarkt', 'https://www.transfermarkt.com/rss/news', 'Transfers', true),
  ('All Nigeria Soccer', 'https://www.allnigeriasoccer.com/rss/', 'Nigeria', true),
  ('Complete Sports Nigeria', 'https://www.completesports.com/feed/', 'Nigeria', true),
  ('BBC Sport Africa', 'https://feeds.bbci.co.uk/sport/africa/rss.xml', 'Africa', true)
on conflict (rss_url) do update
  set name = excluded.name,
      category = excluded.category,
      active = excluded.active;

alter table public.news_articles enable row level security;
alter table public.news_sources enable row level security;

drop policy if exists "anon_select_news_articles" on public.news_articles;
create policy "anon_select_news_articles"
  on public.news_articles
  for select
  to anon
  using (true);
