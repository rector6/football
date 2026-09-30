-- Phase: API-Football daily quota guard (free tier ~100 req/day)

create table if not exists public.api_quota_log (
  id uuid primary key default gen_random_uuid(),
  date date not null default current_date,
  call_count int not null default 0,
  last_call_at timestamptz,
  unique (date)
);

alter table public.api_quota_log enable row level security;
-- No public policies: service role only
