-- Fix company tiers: Giants and Unicorns (whitelist + valuation fallback)
-- Safe to run multiple times
BEGIN;

-- 1) Reset existing tiers to avoid dirty data
UPDATE companies SET company_tier = NULL;

-- 2) Giants - explicit whitelist
UPDATE companies
SET company_tier = 'Giant'
WHERE name IN (
  'OpenAI','Google','Google DeepMind','Microsoft','Meta','Amazon','Apple',
  'ByteDance','ByteDance AI','Baidu','Baidu AI','Tencent','Tencent AI Lab','Tencent Cloud AI',
  'Alibaba','Alibaba Cloud AI','NVIDIA','Tesla','Tesla AI'
);

-- 3) Unicorns - explicit whitelist (includes Adobe per request)
UPDATE companies
SET company_tier = 'Unicorn'
WHERE name IN (
  'Adobe',
  'Anthropic','Stability AI','Midjourney','Cohere','Perplexity AI','Runway',
  'Character.AI','Notion','Grammarly','Hugging Face','Scale AI','Replit'
);

-- 4) Fallback by valuation (if available)
UPDATE companies
SET company_tier = CASE
  WHEN valuation_usd IS NOT NULL AND valuation_usd >= 100000000000 THEN 'Giant'   -- >= $100B
  WHEN valuation_usd IS NOT NULL AND valuation_usd >= 1000000000  THEN 'Unicorn' -- >= $1B
  ELSE company_tier
END
WHERE company_tier IS NULL;

COMMIT;

-- Verify
SELECT company_tier, COUNT(*) FROM companies GROUP BY company_tier ORDER BY company_tier;
SELECT name FROM companies WHERE company_tier IS NULL ORDER BY name;
