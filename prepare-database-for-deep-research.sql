-- Deep Research AI Company Data Generation - Database Cleanup and Schema Fix
-- This script prepares the database for comprehensive AI company data generation

-- Step 1: Clear all existing data
DELETE FROM public.stories;
DELETE FROM public.fundings;
DELETE FROM public.tools;
DELETE FROM public.companies;

-- Step 2: Reset sequences (if any)
-- Note: Supabase handles UUID generation automatically

-- Step 3: Ensure all required columns exist in companies table
ALTER TABLE public.companies 
ADD COLUMN IF NOT EXISTS detailed_description TEXT,
ADD COLUMN IF NOT EXISTS website TEXT,
ADD COLUMN IF NOT EXISTS founded_year INTEGER,
ADD COLUMN IF NOT EXISTS headquarters TEXT,
ADD COLUMN IF NOT EXISTS employee_count_range TEXT,
ADD COLUMN IF NOT EXISTS valuation_usd BIGINT,
ADD COLUMN IF NOT EXISTS industry_tags TEXT[],
ADD COLUMN IF NOT EXISTS logo_base64 TEXT,
ADD COLUMN IF NOT EXISTS tier TEXT,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Step 4: Ensure all required columns exist in tools table
ALTER TABLE public.tools 
ADD COLUMN IF NOT EXISTS company_id UUID REFERENCES public.companies(id),
ADD COLUMN IF NOT EXISTS name TEXT,
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS url TEXT,
ADD COLUMN IF NOT EXISTS category TEXT,
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Step 5: Ensure all required columns exist in fundings table
ALTER TABLE public.fundings 
ADD COLUMN IF NOT EXISTS company_id UUID REFERENCES public.companies(id),
ADD COLUMN IF NOT EXISTS round TEXT,
ADD COLUMN IF NOT EXISTS amount_usd BIGINT,
ADD COLUMN IF NOT EXISTS investors TEXT[],
ADD COLUMN IF NOT EXISTS announced_on DATE,
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Step 6: Ensure all required columns exist in stories table
ALTER TABLE public.stories 
ADD COLUMN IF NOT EXISTS company_id UUID REFERENCES public.companies(id),
ADD COLUMN IF NOT EXISTS title TEXT,
ADD COLUMN IF NOT EXISTS content TEXT,
ADD COLUMN IF NOT EXISTS source_url TEXT,
ADD COLUMN IF NOT EXISTS published_at DATE,
ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'AI News',
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Step 7: Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_companies_tier ON public.companies(tier);
CREATE INDEX IF NOT EXISTS idx_companies_industry_tags ON public.companies USING GIN(industry_tags);
CREATE INDEX IF NOT EXISTS idx_tools_company_id ON public.tools(company_id);
CREATE INDEX IF NOT EXISTS idx_fundings_company_id ON public.fundings(company_id);
CREATE INDEX IF NOT EXISTS idx_stories_company_id ON public.stories(company_id);

-- Step 8: Verify table structures
SELECT 'Companies Table Structure:' as info;
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'companies' AND table_schema = 'public'
ORDER BY ordinal_position;

SELECT 'Tools Table Structure:' as info;
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'tools' AND table_schema = 'public'
ORDER BY ordinal_position;

SELECT 'Fundings Table Structure:' as info;
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'fundings' AND table_schema = 'public'
ORDER BY ordinal_position;

SELECT 'Stories Table Structure:' as info;
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'stories' AND table_schema = 'public'
ORDER BY ordinal_position;

-- Step 9: Verify data is cleared
SELECT 'Data Verification:' as info;
SELECT 'Companies' as table_name, COUNT(*) as count FROM public.companies
UNION ALL
SELECT 'Tools' as table_name, COUNT(*) as count FROM public.tools
UNION ALL
SELECT 'Fundings' as table_name, COUNT(*) as count FROM public.fundings
UNION ALL
SELECT 'Stories' as table_name, COUNT(*) as count FROM public.stories;

-- Step 10: Ready for deep research generation
SELECT 'Database prepared for deep research AI company data generation!' as status;
SELECT 'Next step: Run deep-research-generator.js script' as next_action;
