-- Comprehensive database schema update for bilingual support and missing columns
-- Run this in Supabase SQL Editor BEFORE running the comprehensive scripts

-- Add missing updated_at columns to companies table
ALTER TABLE public.companies 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Add missing updated_at columns to tools table
ALTER TABLE public.tools 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Add bilingual columns to companies table
ALTER TABLE public.companies 
ADD COLUMN IF NOT EXISTS name_en TEXT,
ADD COLUMN IF NOT EXISTS name_zh_hans TEXT,
ADD COLUMN IF NOT EXISTS name_zh_hant TEXT,
ADD COLUMN IF NOT EXISTS description_en TEXT,
ADD COLUMN IF NOT EXISTS description_zh_hans TEXT,
ADD COLUMN IF NOT EXISTS description_zh_hant TEXT;

-- Add bilingual columns to tools table
ALTER TABLE public.tools 
ADD COLUMN IF NOT EXISTS name_en TEXT,
ADD COLUMN IF NOT EXISTS name_zh_hans TEXT,
ADD COLUMN IF NOT EXISTS name_zh_hant TEXT,
ADD COLUMN IF NOT EXISTS description_en TEXT,
ADD COLUMN IF NOT EXISTS description_zh_hans TEXT,
ADD COLUMN IF NOT EXISTS description_zh_hant TEXT;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_companies_name_en ON public.companies(name_en);
CREATE INDEX IF NOT EXISTS idx_companies_name_zh_hans ON public.companies(name_zh_hans);
CREATE INDEX IF NOT EXISTS idx_companies_name_zh_hant ON public.companies(name_zh_hant);
CREATE INDEX IF NOT EXISTS idx_companies_updated_at ON public.companies(updated_at);

CREATE INDEX IF NOT EXISTS idx_tools_name_en ON public.tools(name_en);
CREATE INDEX IF NOT EXISTS idx_tools_name_zh_hans ON public.tools(name_zh_hans);
CREATE INDEX IF NOT EXISTS idx_tools_name_zh_hant ON public.tools(name_zh_hant);
CREATE INDEX IF NOT EXISTS idx_tools_updated_at ON public.tools(updated_at);

-- Update existing data with fallback values
UPDATE public.companies 
SET 
  name_en = COALESCE(name_en, name),
  name_zh_hans = COALESCE(name_zh_hans, name),
  name_zh_hant = COALESCE(name_zh_hant, name),
  description_en = COALESCE(description_en, description),
  description_zh_hans = COALESCE(description_zh_hans, description),
  description_zh_hant = COALESCE(description_zh_hant, description),
  updated_at = COALESCE(updated_at, NOW())
WHERE name_en IS NULL OR name_zh_hans IS NULL OR name_zh_hant IS NULL OR updated_at IS NULL;

UPDATE public.tools 
SET 
  name_en = COALESCE(name_en, name),
  name_zh_hans = COALESCE(name_zh_hans, name),
  name_zh_hant = COALESCE(name_zh_hant, name),
  description_en = COALESCE(description_en, description),
  description_zh_hans = COALESCE(description_zh_hans, description),
  description_zh_hant = COALESCE(description_zh_hant, description),
  updated_at = COALESCE(updated_at, NOW())
WHERE name_en IS NULL OR name_zh_hans IS NULL OR name_zh_hant IS NULL OR updated_at IS NULL;

-- Create triggers to automatically update updated_at columns
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS update_companies_updated_at ON public.companies;
DROP TRIGGER IF EXISTS update_tools_updated_at ON public.tools;

-- Create triggers
CREATE TRIGGER update_companies_updated_at
    BEFORE UPDATE ON public.companies
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tools_updated_at
    BEFORE UPDATE ON public.tools
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
