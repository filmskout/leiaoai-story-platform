-- Events core tables
create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid references auth.users(id) on delete set null,
  title text not null,
  description text,
  location text,
  starts_at timestamptz not null,
  ends_at timestamptz,
  capacity int,
  visibility text default 'public', -- public | private
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.event_tickets (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  name text not null,
  price_cents int not null default 0,
  currency text not null default 'CNY',
  quota int,
  created_at timestamptz not null default now()
);

create table if not exists public.event_registrations (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  ticket_id uuid references public.event_tickets(id) on delete set null,
  status text not null default 'registered', -- registered | cancelled | attended
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.event_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  plan text not null, -- monthly | annual
  status text not null default 'active',
  renews_at timestamptz,
  created_at timestamptz not null default now()
);

-- Indexes
create index if not exists idx_events_starts_at on public.events(starts_at);
create index if not exists idx_event_registrations_event on public.event_registrations(event_id);
create index if not exists idx_event_registrations_user on public.event_registrations(user_id);
create index if not exists idx_event_subscriptions_user on public.event_subscriptions(user_id);

-- RLS
alter table public.events enable row level security;
alter table public.event_tickets enable row level security;
alter table public.event_registrations enable row level security;
alter table public.event_subscriptions enable row level security;

do $$ begin
  create policy events_select_public on public.events for select using (visibility = 'public' or auth.uid() = creator_id);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy events_insert_owner on public.events for insert with check (auth.uid() = creator_id);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy events_update_owner on public.events for update using (auth.uid() = creator_id);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy event_tickets_rw_owner on public.event_tickets for all using (
    exists(select 1 from public.events e where e.id = event_id and e.creator_id = auth.uid())
  ) with check (
    exists(select 1 from public.events e where e.id = event_id and e.creator_id = auth.uid())
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create policy event_regs_insert_self on public.event_registrations for insert with check (auth.uid() = user_id);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy event_regs_select_owner on public.event_registrations for select using (auth.uid() = user_id);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy event_subs_rw_self on public.event_subscriptions for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
exception when duplicate_object then null; end $$;


