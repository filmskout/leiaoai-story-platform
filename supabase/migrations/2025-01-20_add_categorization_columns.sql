-- Add new categorization columns to companies table
ALTER TABLE public.companies 
ADD COLUMN IF NOT EXISTS company_type TEXT,
ADD COLUMN IF NOT EXISTS company_tier TEXT,
ADD COLUMN IF NOT EXISTS company_category TEXT,
ADD COLUMN IF NOT EXISTS focus_areas TEXT[];

-- Add new categorization columns to tools table
ALTER TABLE public.tools 
ADD COLUMN IF NOT EXISTS tool_category TEXT,
ADD COLUMN IF NOT EXISTS tool_subcategory TEXT,
ADD COLUMN IF NOT EXISTS focus_areas TEXT[];

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_companies_type ON public.companies(company_type);
CREATE INDEX IF NOT EXISTS idx_companies_tier ON public.companies(company_tier);
CREATE INDEX IF NOT EXISTS idx_companies_category ON public.companies(company_category);
CREATE INDEX IF NOT EXISTS idx_tools_category ON public.tools(tool_category);
CREATE INDEX IF NOT EXISTS idx_tools_subcategory ON public.tools(tool_subcategory);

-- Add comments for documentation
COMMENT ON COLUMN public.companies.company_type IS 'Type of company: AI Giant, Independent AI, AI Company';
COMMENT ON COLUMN public.companies.company_tier IS 'Tier level: Tier 1, Tier 2, Independent, Emerging';
COMMENT ON COLUMN public.companies.company_category IS 'Main category: AI Giant, LLM & Conversational AI, Image & Video Generation, etc.';
COMMENT ON COLUMN public.companies.focus_areas IS 'Array of focus areas and specialties';

COMMENT ON COLUMN public.tools.tool_category IS 'Main tool category: LLM & Language Models, Image Processing & Generation, etc.';
COMMENT ON COLUMN public.tools.tool_subcategory IS 'Specific subcategory within the main category';
COMMENT ON COLUMN public.tools.focus_areas IS 'Array of specific focus areas and capabilities';
