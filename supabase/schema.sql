-- Run this in your Supabase SQL editor

-- Profiles: one row per user, stores plan + Stripe info
create table if not exists public.profiles (
  id              uuid references auth.users on delete cascade primary key,
  email           text,
  stripe_customer_id text,
  plan            text not null default 'free', -- 'free' | 'pro' | 'team'
  subscription_id text,
  subscription_status text,
  created_at      timestamptz default now()
);

-- Usage: tracks emails generated per user per calendar month
create table if not exists public.usage (
  id        uuid default gen_random_uuid() primary key,
  user_id   uuid references auth.users on delete cascade not null,
  month     text not null,            -- 'YYYY-MM'
  count     integer not null default 0,
  unique (user_id, month)
);

-- Auto-create profile row when a new user signs up
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Atomic upsert-increment for usage tracking
create or replace function public.increment_usage(p_user_id uuid, p_month text)
returns void language plpgsql security definer as $$
begin
  insert into public.usage (user_id, month, count)
  values (p_user_id, p_month, 1)
  on conflict (user_id, month)
  do update set count = usage.count + 1;
end;
$$;

-- Email history: stores single emails and sequences
create table if not exists public.email_history (
  id               uuid default gen_random_uuid() primary key,
  user_id          uuid references auth.users on delete cascade not null,
  type             text not null default 'single',  -- 'single' | 'sequence'
  prospect_name    text,
  prospect_company text,
  tone             text,
  -- Single email fields
  subject          text,
  body             text,
  -- Sequence field (JSON array of {subject, body, day, label})
  sequence         jsonb,
  created_at       timestamptz default now()
);

-- Row Level Security
alter table public.profiles      enable row level security;
alter table public.usage         enable row level security;
alter table public.email_history enable row level security;

create policy "Users read own profile"
  on public.profiles for select using (auth.uid() = id);

create policy "Users update own profile"
  on public.profiles for update using (auth.uid() = id);

create policy "Users read own usage"
  on public.usage for select using (auth.uid() = user_id);

create policy "Users manage own history"
  on public.email_history for all using (auth.uid() = user_id);
