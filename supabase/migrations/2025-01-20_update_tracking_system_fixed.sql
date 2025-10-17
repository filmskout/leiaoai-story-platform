-- Update Tracking System for AI Companies Catalog (Fixed Version)
-- This migration adds tables to track updates, versions, and changes
-- Handles existing policies gracefully

-- Table to track company updates and changes
CREATE TABLE IF NOT EXISTS public.company_updates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  update_type text NOT NULL, -- 'funding', 'valuation', 'description', 'website', 'logo', 'tags'
  old_value text,
  new_value text,
  source text, -- 'manual', 'api', 'web_scrape', 'news'
  update_date timestamptz NOT NULL DEFAULT now(),
  verified boolean DEFAULT false,
  notes text
);

-- Table to track tool/model version updates
CREATE TABLE IF NOT EXISTS public.tool_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tool_id uuid NOT NULL REFERENCES public.tools(id) ON DELETE CASCADE,
  version_number text NOT NULL,
  release_date date,
  changelog text,
  features_added text[],
  features_removed text[],
  breaking_changes boolean DEFAULT false,
  api_changes text,
  pricing_changes text,
  source text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Table to track funding updates and news
CREATE TABLE IF NOT EXISTS public.funding_updates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  funding_id uuid REFERENCES public.fundings(id) ON DELETE CASCADE,
  update_type text NOT NULL, -- 'new_round', 'amount_change', 'investor_add', 'status_change'
  old_amount_usd numeric,
  new_amount_usd numeric,
  old_investors text[],
  new_investors text[],
  old_status text,
  new_status text,
  source_url text,
  news_title text,
  news_summary text,
  update_date timestamptz NOT NULL DEFAULT now(),
  verified boolean DEFAULT false
);

-- Table to track monitoring jobs and their results
CREATE TABLE IF NOT EXISTS public.monitoring_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_type text NOT NULL, -- 'funding_check', 'version_check', 'website_check', 'news_check'
  target_type text NOT NULL, -- 'company', 'tool', 'all'
  target_id uuid, -- specific company or tool ID, null for 'all'
  last_run timestamptz,
  next_run timestamptz,
  status text DEFAULT 'pending', -- 'pending', 'running', 'completed', 'failed'
  results jsonb,
  error_message text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Table to store web scraping results and cache
CREATE TABLE IF NOT EXISTS public.web_cache (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  url text NOT NULL UNIQUE,
  content_hash text NOT NULL,
  content_type text, -- 'html', 'json', 'rss'
  scraped_data jsonb,
  last_scraped timestamptz NOT NULL DEFAULT now(),
  next_scrape timestamptz,
  status text DEFAULT 'success', -- 'success', 'failed', 'blocked'
  error_message text
);

-- Add indexes for performance (only if they don't exist)
CREATE INDEX IF NOT EXISTS idx_company_updates_company_id ON public.company_updates(company_id);
CREATE INDEX IF NOT EXISTS idx_company_updates_date ON public.company_updates(update_date);
CREATE INDEX IF NOT EXISTS idx_tool_versions_tool_id ON public.tool_versions(tool_id);
CREATE INDEX IF NOT EXISTS idx_tool_versions_release_date ON public.tool_versions(release_date);
CREATE INDEX IF NOT EXISTS idx_funding_updates_company_id ON public.funding_updates(company_id);
CREATE INDEX IF NOT EXISTS idx_funding_updates_date ON public.funding_updates(update_date);
CREATE INDEX IF NOT EXISTS idx_monitoring_jobs_next_run ON public.monitoring_jobs(next_run);
CREATE INDEX IF NOT EXISTS idx_monitoring_jobs_status ON public.monitoring_jobs(status);
CREATE INDEX IF NOT EXISTS idx_web_cache_url ON public.web_cache(url);
CREATE INDEX IF NOT EXISTS idx_web_cache_next_scrape ON public.web_cache(next_scrape);

-- Enable RLS on tables
ALTER TABLE public.company_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tool_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.funding_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.monitoring_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.web_cache ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist, then recreate them
DROP POLICY IF EXISTS "company_updates_read_all" ON public.company_updates;
DROP POLICY IF EXISTS "company_updates_insert_auth" ON public.company_updates;
DROP POLICY IF EXISTS "tool_versions_read_all" ON public.tool_versions;
DROP POLICY IF EXISTS "tool_versions_insert_auth" ON public.tool_versions;
DROP POLICY IF EXISTS "funding_updates_read_all" ON public.funding_updates;
DROP POLICY IF EXISTS "funding_updates_insert_auth" ON public.funding_updates;
DROP POLICY IF EXISTS "monitoring_jobs_read_all" ON public.monitoring_jobs;
DROP POLICY IF EXISTS "monitoring_jobs_insert_auth" ON public.monitoring_jobs;
DROP POLICY IF EXISTS "web_cache_read_all" ON public.web_cache;
DROP POLICY IF EXISTS "web_cache_insert_auth" ON public.web_cache;

-- Create RLS policies
CREATE POLICY "company_updates_read_all" ON public.company_updates FOR SELECT USING (true);
CREATE POLICY "company_updates_insert_auth" ON public.company_updates FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "tool_versions_read_all" ON public.tool_versions FOR SELECT USING (true);
CREATE POLICY "tool_versions_insert_auth" ON public.tool_versions FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "funding_updates_read_all" ON public.funding_updates FOR SELECT USING (true);
CREATE POLICY "funding_updates_insert_auth" ON public.funding_updates FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "monitoring_jobs_read_all" ON public.monitoring_jobs FOR SELECT USING (true);
CREATE POLICY "monitoring_jobs_insert_auth" ON public.monitoring_jobs FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "web_cache_read_all" ON public.web_cache FOR SELECT USING (true);
CREATE POLICY "web_cache_insert_auth" ON public.web_cache FOR INSERT TO authenticated WITH CHECK (true);

-- Drop existing functions if they exist, then recreate them
DROP FUNCTION IF EXISTS public.update_company_last_modified();
DROP FUNCTION IF EXISTS public.check_duplicate_update();

-- Function to automatically update company stats when updates occur
CREATE OR REPLACE FUNCTION public.update_company_last_modified()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.companies 
  SET updated_at = now() 
  WHERE id = NEW.company_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to check for duplicate updates
CREATE OR REPLACE FUNCTION public.check_duplicate_update()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if similar update exists within last 24 hours
  IF EXISTS (
    SELECT 1 FROM public.company_updates 
    WHERE company_id = NEW.company_id 
    AND update_type = NEW.update_type 
    AND new_value = NEW.new_value 
    AND update_date > now() - interval '24 hours'
  ) THEN
    RAISE EXCEPTION 'Duplicate update detected within 24 hours';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing triggers if they exist, then recreate them
DROP TRIGGER IF EXISTS company_updates_trigger ON public.company_updates;
DROP TRIGGER IF EXISTS prevent_duplicate_updates ON public.company_updates;

-- Trigger to update company modified date
CREATE TRIGGER company_updates_trigger
  AFTER INSERT ON public.company_updates
  FOR EACH ROW
  EXECUTE FUNCTION public.update_company_last_modified();

-- Trigger to prevent duplicate updates
CREATE TRIGGER prevent_duplicate_updates
  BEFORE INSERT ON public.company_updates
  FOR EACH ROW
  EXECUTE FUNCTION public.check_duplicate_update();

-- Insert initial monitoring jobs (only if they don't exist)
INSERT INTO public.monitoring_jobs (job_type, target_type, target_id, next_run) 
SELECT * FROM (VALUES
  ('funding_check', 'all', null, now() + interval '1 day'),
  ('version_check', 'all', null, now() + interval '3 days'),
  ('website_check', 'all', null, now() + interval '7 days'),
  ('news_check', 'all', null, now() + interval '6 hours')
) AS v(job_type, target_type, target_id, next_run)
WHERE NOT EXISTS (
  SELECT 1 FROM public.monitoring_jobs 
  WHERE job_type = v.job_type AND target_type = v.target_type
);
