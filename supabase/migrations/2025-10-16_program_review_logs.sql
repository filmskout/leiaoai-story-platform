-- program_review_logs: 记录 Program 审核备注与操作
create table if not exists public.program_review_logs (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null references public.program_applications(id) on delete cascade,
  admin_id uuid not null,
  action text not null, -- e.g., status_change, note
  note text,
  created_at timestamptz not null default now()
);

create index if not exists idx_program_review_logs_app on public.program_review_logs(application_id);

