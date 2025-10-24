-- 直接修复companies表结构
-- 这个脚本需要在Supabase SQL编辑器中执行

-- 添加基本字段到companies表
ALTER TABLE public.companies 
ADD COLUMN IF NOT EXISTS description text,
ADD COLUMN IF NOT EXISTS website text,
ADD COLUMN IF NOT EXISTS founded_year int,
ADD COLUMN IF NOT EXISTS headquarters text,
ADD COLUMN IF NOT EXISTS employee_count_range text,
ADD COLUMN IF NOT EXISTS valuation_usd numeric,
ADD COLUMN IF NOT EXISTS industry_tags text[],
ADD COLUMN IF NOT EXISTS logo_url text,
ADD COLUMN IF NOT EXISTS last_funding_date date,
ADD COLUMN IF NOT EXISTS social_links jsonb DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

-- 添加双语支持字段
ALTER TABLE public.companies 
ADD COLUMN IF NOT EXISTS name_en text,
ADD COLUMN IF NOT EXISTS name_zh_hans text,
ADD COLUMN IF NOT EXISTS name_zh_hant text,
ADD COLUMN IF NOT EXISTS description_en text,
ADD COLUMN IF NOT EXISTS description_zh_hans text,
ADD COLUMN IF NOT EXISTS description_zh_hant text;

-- 创建索引以提高性能
CREATE INDEX IF NOT EXISTS idx_companies_description ON public.companies(description);
CREATE INDEX IF NOT EXISTS idx_companies_website ON public.companies(website);
CREATE INDEX IF NOT EXISTS idx_companies_founded_year ON public.companies(founded_year);
CREATE INDEX IF NOT EXISTS idx_companies_headquarters ON public.companies(headquarters);
CREATE INDEX IF NOT EXISTS idx_companies_valuation_usd ON public.companies(valuation_usd);
CREATE INDEX IF NOT EXISTS idx_companies_industry_tags ON public.companies USING GIN(industry_tags);
CREATE INDEX IF NOT EXISTS idx_companies_updated_at ON public.companies(updated_at);

-- 验证表结构
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'companies' 
AND table_schema = 'public'
ORDER BY ordinal_position;
