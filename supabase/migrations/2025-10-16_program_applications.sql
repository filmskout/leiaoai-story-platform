-- Program applications table
create table if not exists public.program_applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  slug text not null,
  selected_date date,
  time_slot text,
  documents jsonb default '[]'::jsonb,
  personal_intro text,
  status text not null default 'submitted',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_program_applications_user on public.program_applications(user_id);
create index if not exists idx_program_applications_slug on public.program_applications(slug);

-- Row Level Security
alter table public.program_applications enable row level security;

do $$ begin
  create policy program_apps_insert_self on public.program_applications
    for insert with check (auth.uid() = user_id);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy program_apps_select_owner on public.program_applications
    for select using (auth.uid() = user_id);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy program_apps_update_owner on public.program_applications
    for update using (auth.uid() = user_id);
exception when duplicate_object then null; end $$;

-- Optional: public readable aggregated stats could be added later

-- Storage bucket for program docs (run in SQL if using storage.sql; otherwise create via dashboard)
-- select storage.create_bucket('program-docs', true);

