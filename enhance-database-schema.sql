-- Enhanced AI Company Data Structure - Projects instead of Tools
-- This script updates the database schema to better represent AI projects/products

-- Step 1: Rename tools table to projects for better semantic meaning
ALTER TABLE public.tools RENAME TO projects;

-- Step 2: Add more detailed columns to projects table
ALTER TABLE public.projects 
ADD COLUMN IF NOT EXISTS project_type TEXT DEFAULT 'AI Product', -- AI Product, AI Platform, AI Service, AI Research, AI Infrastructure
ADD COLUMN IF NOT EXISTS launch_date DATE,
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'Active', -- Active, Beta, Discontinued, Planned
ADD COLUMN IF NOT EXISTS pricing_model TEXT, -- Free, Freemium, Subscription, Enterprise, API-based
ADD COLUMN IF NOT EXISTS target_audience TEXT[], -- Developers, Enterprises, Consumers, Researchers
ADD COLUMN IF NOT EXISTS technology_stack TEXT[], -- Machine Learning, Deep Learning, NLP, Computer Vision, etc.
ADD COLUMN IF NOT EXISTS use_cases TEXT[], -- Content Generation, Automation, Analysis, etc.
ADD COLUMN IF NOT EXISTS integrations TEXT[], -- APIs, SDKs, Third-party services
ADD COLUMN IF NOT EXISTS documentation_url TEXT,
ADD COLUMN IF NOT EXISTS github_url TEXT,
ADD COLUMN IF NOT EXISTS demo_url TEXT,
ADD COLUMN IF NOT EXISTS pricing_url TEXT,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Step 3: Update projects table structure
ALTER TABLE public.projects 
ALTER COLUMN name SET NOT NULL,
ALTER COLUMN description SET NOT NULL,
ALTER COLUMN category SET NOT NULL;

-- Step 4: Add more detailed columns to companies table
ALTER TABLE public.companies 
ADD COLUMN IF NOT EXISTS company_type TEXT DEFAULT 'AI Company', -- AI Company, Tech Giant, Startup, Research Lab
ADD COLUMN IF NOT EXISTS business_model TEXT[], -- B2B, B2C, B2B2C, Freemium, Enterprise
ADD COLUMN IF NOT EXISTS key_technologies TEXT[], -- LLM, Computer Vision, NLP, Robotics, etc.
ADD COLUMN IF NOT EXISTS market_focus TEXT[], -- Enterprise, Consumer, Developer, Research
ADD COLUMN IF NOT EXISTS geographic_presence TEXT[], -- North America, Europe, Asia, Global
ADD COLUMN IF NOT EXISTS partnerships TEXT[], -- Microsoft, Google, Amazon, etc.
ADD COLUMN IF NOT EXISTS awards TEXT[], -- Industry awards and recognition
ADD COLUMN IF NOT EXISTS research_papers INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS patents INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS open_source_projects INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS social_media JSONB, -- Twitter, LinkedIn, GitHub followers
ADD COLUMN IF NOT EXISTS last_funding_date DATE,
ADD COLUMN IF NOT EXISTS last_product_launch DATE;

-- Step 5: Enhance stories table for better news categorization
ALTER TABLE public.stories 
ADD COLUMN IF NOT EXISTS story_type TEXT DEFAULT 'Company News', -- Company News, Product Launch, Funding, Partnership, Research, Industry Analysis
ADD COLUMN IF NOT EXISTS sentiment TEXT DEFAULT 'Neutral', -- Positive, Negative, Neutral
ADD COLUMN IF NOT EXISTS impact_score INTEGER DEFAULT 5, -- 1-10 scale
ADD COLUMN IF NOT EXISTS tags TEXT[], -- AI, Funding, Product, Partnership, etc.
ADD COLUMN IF NOT EXISTS author TEXT,
ADD COLUMN IF NOT EXISTS word_count INTEGER,
ADD COLUMN IF NOT EXISTS reading_time INTEGER, -- in minutes
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Step 6: Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_projects_company_id ON public.projects(company_id);
CREATE INDEX IF NOT EXISTS idx_projects_project_type ON public.projects(project_type);
CREATE INDEX IF NOT EXISTS idx_projects_status ON public.projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_category ON public.projects(category);
CREATE INDEX IF NOT EXISTS idx_companies_company_type ON public.companies(company_type);
CREATE INDEX IF NOT EXISTS idx_companies_key_technologies ON public.companies USING GIN(key_technologies);
CREATE INDEX IF NOT EXISTS idx_stories_story_type ON public.stories(story_type);
CREATE INDEX IF NOT EXISTS idx_stories_sentiment ON public.stories(sentiment);
CREATE INDEX IF NOT EXISTS idx_stories_tags ON public.stories USING GIN(tags);

-- Step 7: Update foreign key constraints
ALTER TABLE public.projects DROP CONSTRAINT IF EXISTS tools_company_id_fkey;
ALTER TABLE public.projects ADD CONSTRAINT projects_company_id_fkey 
  FOREIGN KEY (company_id) REFERENCES public.companies(id) ON DELETE CASCADE;

-- Step 8: Verify updated table structures
SELECT 'Projects Table Structure:' as info;
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'projects' AND table_schema = 'public'
ORDER BY ordinal_position;

SELECT 'Companies Table Structure:' as info;
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'companies' AND table_schema = 'public'
ORDER BY ordinal_position;

SELECT 'Stories Table Structure:' as info;
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'stories' AND table_schema = 'public'
ORDER BY ordinal_position;

-- Step 9: Ready for enhanced data generation
SELECT 'Enhanced database schema ready for comprehensive AI company data generation!' as status;
SELECT 'Next: Run enhanced-deep-research-generator.js for complete 200+ company data' as next_action;
