-- Temporarily disable RLS for tools table to allow script insertion
-- Run this in Supabase SQL Editor BEFORE running the fix-relationships script

-- Disable RLS on tools table
ALTER TABLE public.tools DISABLE ROW LEVEL SECURITY;

-- Now run: npm run fix-relationships

-- After script completes, re-enable RLS
-- ALTER TABLE public.tools ENABLE ROW LEVEL SECURITY;
