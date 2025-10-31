-- More aggressive fix for company tiers using ILIKE aliases + valuation fallback
-- Safe to run multiple times
BEGIN;

-- 0) Optional: reset tiers to recalc cleanly
UPDATE companies SET company_tier = NULL;

-- 1) Giants via aliases (explicit)
UPDATE companies SET company_tier = 'Giant'
WHERE (
  name ILIKE 'OpenAI%'
  OR name ILIKE 'Google%'
  OR name ILIKE 'Google DeepMind%'
  OR name ILIKE 'DeepMind%'
  OR name ILIKE 'Microsoft%'
  OR name ILIKE 'Meta%'
  OR name ILIKE 'Facebook%'
  OR name ILIKE 'Amazon%'
  OR name ILIKE 'AWS%'
  OR name ILIKE 'Apple%'
  OR name ILIKE 'ByteDance%'
  OR name ILIKE 'TikTok%'
  OR name ILIKE 'Baidu%'
  OR name ILIKE 'Tencent%'
  OR name ILIKE 'Alibaba%'
  OR name ILIKE 'Aliyun%'
  OR name ILIKE 'NVIDIA%'
  OR name ILIKE 'Tesla%'
  OR name ILIKE 'xAI%'
);

-- 2) Unicorns via aliases (explicit: includes Adobe per requirement)
UPDATE companies SET company_tier = 'Unicorn'
WHERE company_tier IS DISTINCT FROM 'Giant' AND (
  name ILIKE 'Adobe%'
  OR name ILIKE 'Anthropic%'
  OR name ILIKE 'Stability AI%'
  OR name ILIKE 'Midjourney%'
  OR name ILIKE 'Cohere%'
  OR name ILIKE 'Perplexity%'
  OR name ILIKE 'Runway%'
  OR name ILIKE 'Character.AI%'
  OR name ILIKE 'Notion%'
  OR name ILIKE 'Grammarly%'
  OR name ILIKE 'Hugging Face%'
  OR name ILIKE 'Scale AI%'
  OR name ILIKE 'Replit%'
  OR name ILIKE 'Mistral%'
  OR name ILIKE 'Mistral AI%'
  OR name ILIKE 'UiPath%'
  OR name ILIKE 'Databricks%'
  OR name ILIKE 'ServiceNow%'
);

-- 3) Fallback by valuation
UPDATE companies
SET company_tier = CASE
  WHEN valuation_usd IS NOT NULL AND valuation_usd >= 100000000000 THEN 'Giant'   -- >= $100B
  WHEN valuation_usd IS NOT NULL AND valuation_usd >= 1000000000  THEN 'Unicorn' -- >= $1B
  ELSE company_tier
END
WHERE company_tier IS NULL OR company_tier NOT IN ('Giant','Unicorn');

COMMIT;

-- Verification
SELECT company_tier, COUNT(*) FROM companies GROUP BY company_tier ORDER BY company_tier;
SELECT name FROM companies WHERE company_tier IS NULL ORDER BY name;
