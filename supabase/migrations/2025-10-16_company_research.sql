-- Company research cache (GPT summaries, funding highlights)
create table if not exists public.company_research (
  id uuid primary key default gen_random_uuid(),
  company_domain text not null unique,
  summary text,
  funding_highlights text,
  current_round text,
  overall_score int,
  score_breakdown jsonb default '{}'::jsonb,
  source_json jsonb default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.company_research enable row level security;

do $$ begin
  create policy cr_select_public on public.company_research for select using (true);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy cr_upsert_auth on public.company_research for insert to authenticated with check (true);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy cr_update_auth on public.company_research for update to authenticated using (true) with check (true);
exception when duplicate_object then null; end $$;


