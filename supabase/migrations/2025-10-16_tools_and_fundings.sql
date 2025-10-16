-- Tools, Companies, Fundings for AI tools reviews
create table if not exists public.companies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  website text,
  created_at timestamptz not null default now()
);

create table if not exists public.tools (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references public.companies(id) on delete set null,
  name text not null,
  category text,
  description text,
  website text,
  created_at timestamptz not null default now()
);

create table if not exists public.fundings (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  round text,
  amount_usd numeric,
  investors text[],
  announced_on date,
  created_at timestamptz not null default now()
);

create index if not exists idx_tools_company on public.tools(company_id);
create index if not exists idx_fundings_company on public.fundings(company_id);

alter table public.companies enable row level security;
alter table public.tools enable row level security;
alter table public.fundings enable row level security;

do $$ begin
  create policy companies_read_all on public.companies for select using (true);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy tools_read_all on public.tools for select using (true);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy fundings_read_all on public.fundings for select using (true);
exception when duplicate_object then null; end $$;

