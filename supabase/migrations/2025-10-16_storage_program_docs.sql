-- Storage bucket for Program documents

-- Create bucket if not exists (use insert with ON CONFLICT)
insert into storage.buckets (id, name, public)
values ('program-docs', 'program-docs', true)
on conflict (id) do nothing;

-- Policies on storage.objects
alter table storage.objects enable row level security;

-- Public read for files in program-docs
do $$ begin
  create policy "Public read program-docs"
  on storage.objects for select
  using (bucket_id = 'program-docs');
exception when duplicate_object then null; end $$;

-- Authenticated users can upload to program-docs
do $$ begin
  create policy "Authenticated upload program-docs"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'program-docs');
exception when duplicate_object then null; end $$;

-- Owners can update their own files in program-docs
do $$ begin
  create policy "Owner update program-docs"
  on storage.objects for update to authenticated
  using (bucket_id = 'program-docs' and owner = auth.uid())
  with check (bucket_id = 'program-docs' and owner = auth.uid());
exception when duplicate_object then null; end $$;

-- Owners can delete their own files in program-docs
do $$ begin
  create policy "Owner delete program-docs"
  on storage.objects for delete to authenticated
  using (bucket_id = 'program-docs' and owner = auth.uid());
exception when duplicate_object then null; end $$;


