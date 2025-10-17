-- Disable RLS for tools and related tables to allow script insertion
-- Run this in Supabase SQL Editor BEFORE running the fix-relationships script

-- Disable RLS on tools table
ALTER TABLE public.tools DISABLE ROW LEVEL SECURITY;

-- Disable RLS on company_stats table (if it exists)
ALTER TABLE public.company_stats DISABLE ROW LEVEL SECURITY;

-- Disable RLS on tool_stats table (if it exists)  
ALTER TABLE public.tool_stats DISABLE ROW LEVEL SECURITY;

-- Disable RLS on tool_ratings table (if it exists)
ALTER TABLE public.tool_ratings DISABLE ROW LEVEL SECURITY;

-- Disable RLS on user_favorites table (if it exists)
ALTER TABLE public.user_favorites DISABLE ROW LEVEL SECURITY;

-- After running the script, you can re-enable RLS with:
-- ALTER TABLE public.tools ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.company_stats ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.tool_stats ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.tool_ratings ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.user_favorites ENABLE ROW LEVEL SECURITY;
