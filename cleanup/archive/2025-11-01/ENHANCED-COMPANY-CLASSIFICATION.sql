-- ENHANCED COMPANY CLASSIFICATION WITH TIER, REGION, AND UNICORN STATUS
-- This script provides detailed classification for all 116 companies

BEGIN;

-- Step 1: Add new classification columns if needed
ALTER TABLE companies ADD COLUMN IF NOT EXISTS company_region TEXT;
ALTER TABLE companies ADD COLUMN IF NOT EXISTS country TEXT;
ALTER TABLE companies ADD COLUMN IF NOT EXISTS valuation_usd BIGINT;
ALTER TABLE companies ADD COLUMN IF NOT EXISTS is_unicorn BOOLEAN DEFAULT false;

-- Step 2: Tier 1 AI Giants (Absolute top tier with massive AI investment)
UPDATE companies SET
  company_type = 'AI Giant',
  company_tier = 'Tier 1',
  company_region = 'North America',
  country = 'USA',
  is_unicorn = true,
  valuation_usd = CASE 
    WHEN name = 'OpenAI' THEN 90000000000
    WHEN name = 'Anthropic' THEN 50000000000
    WHEN name = 'Microsoft AI' THEN 3500000000000
    WHEN name = 'Google DeepMind' THEN 2000000000000
    WHEN name = 'Meta AI' THEN 950000000000
    WHEN name = 'Amazon AI' THEN 1800000000000
    WHEN name = 'Apple AI' THEN 3500000000000
    WHEN name = 'Tesla AI' THEN 750000000000
    WHEN name = 'NVIDIA' THEN 1200000000000
    ELSE valuation_usd
  END
WHERE name IN ('OpenAI', 'Anthropic', 'Microsoft AI', 'Google DeepMind', 'Meta AI', 'Amazon AI', 'Apple AI', 'Tesla AI', 'NVIDIA');

-- Step 3: China's Tier 1 AI Giants
UPDATE companies SET
  company_type = 'AI Giant',
  company_tier = 'Tier 1',
  company_region = 'East Asia',
  country = 'China',
  is_unicorn = true,
  valuation_usd = CASE 
    WHEN name = 'Baidu AI' THEN 45000000000
    WHEN name = 'Alibaba Cloud AI' THEN 180000000000
    WHEN name = 'Tencent Cloud AI' THEN 500000000000
    WHEN name = 'ByteDance AI' THEN 220000000000
    WHEN name IN ('Kuaishou AI', 'Meituan AI', 'DiDi AI', 'JD AI', 'PDD AI') THEN 100000000000
    ELSE valuation_usd
  END
WHERE name IN ('Baidu AI', 'Alibaba Cloud AI', 'Tencent Cloud AI', 'ByteDance AI', 'Kuaishou AI', 'Meituan AI', 'DiDi AI', 'JD AI', 'PDD AI');

-- Step 4: Tier 2 AI Giants (Major AI companies)
UPDATE companies SET
  company_type = 'AI Giant',
  company_tier = 'Tier 2',
  company_region = CASE 
    WHEN headquarters LIKE '%USA%' OR headquarters LIKE '%, USA' THEN 'North America'
    WHEN headquarters LIKE '%China%' OR headquarters LIKE '%, 中国' THEN 'East Asia'
    WHEN headquarters LIKE '%UK%' OR headquarters LIKE '%London%' THEN 'Europe'
    ELSE 'Global'
  END,
  country = CASE 
    WHEN headquarters LIKE '%USA%' OR headquarters LIKE '%, USA' THEN 'USA'
    WHEN headquarters LIKE '%China%' OR headquarters LIKE '%, 中国' THEN 'China'
    WHEN headquarters LIKE '%UK%' OR headquarters LIKE '%London%' THEN 'UK'
    WHEN headquarters LIKE '%Canada%' THEN 'Canada'
    WHEN headquarters LIKE '%Germany%' THEN 'Germany'
    WHEN headquarters LIKE '%Netherlands%' THEN 'Netherlands'
    WHEN headquarters LIKE '%Poland%' THEN 'Poland'
    WHEN headquarters LIKE '%Israel%' THEN 'Israel'
    ELSE 'Global'
  END,
  is_unicorn = true,
  valuation_usd = CASE 
    WHEN name = 'Adobe' THEN 220000000000
    WHEN name = 'Vercel' THEN 1500000000
    WHEN name = 'IBM Watson' THEN 110000000000
    WHEN name = 'Anthropic' THEN 50000000000
    WHEN name = 'Stability AI' THEN 1000000000
    WHEN name = 'Hugging Face' THEN 2000000000
    WHEN name IN ('SenseTime', 'Megvii', 'CloudWalk', 'iFlytek') THEN 5000000000
    ELSE COALESCE(valuation_usd, 500000000)
  END
WHERE name IN ('Adobe', 'Vercel', 'IBM Watson', 'Stability AI', 'Hugging Face', 'SenseTime', 'Megvii', 'CloudWalk', 'iFlytek');

-- Step 5: Independent AI Unicorns (Specialized AI startups valued $1B+)
UPDATE companies SET
  company_type = 'Independent AI',
  company_tier = 'Unicorn',
  company_region = CASE 
    WHEN headquarters LIKE '%USA%' OR headquarters LIKE '%, USA' THEN 'North America'
    WHEN headquarters LIKE '%China%' OR headquarters LIKE '%, 中国' THEN 'East Asia'
    WHEN headquarters LIKE '%UK%' OR headquarters LIKE '%London%' THEN 'Europe'
    ELSE 'Global'
  END,
  country = CASE 
    WHEN headquarters LIKE '%USA%' OR headquarters LIKE '%, USA' THEN 'USA'
    WHEN headquarters LIKE '%China%' OR headquarters LIKE '%, 中国' THEN 'China'
    WHEN headquarters LIKE '%UK%' OR headquarters LIKE '%London%' THEN 'UK'
    WHEN headquarters LIKE '%Canada%' THEN 'Canada'
    ELSE 'Global'
  END,
  is_unicorn = true,
  valuation_usd = 1000000000
WHERE name IN ('Character.AI', 'Jasper', 'Copy.ai', 'Notion AI', 'Cursor', 'GitHub Copilot', 'DeepSeek', 'MiniMax', 'Zhipu AI', 'Moonshot AI', '01.AI', 'Cohere', 'Aleph Alpha', 'Midjourney', 'Runway', 'Perplexity AI');

-- Step 6: Emerging AI Companies (Fast-growing, <$1B valuation)
UPDATE companies SET
  company_type = 'AI Company',
  company_tier = 'Emerging',
  company_region = CASE 
    WHEN headquarters LIKE '%USA%' OR headquarters LIKE '%, USA' THEN 'North America'
    WHEN headquarters LIKE '%China%' OR headquarters LIKE '%, 中国' THEN 'East Asia'
    WHEN headquarters LIKE '%UK%' OR headquarters LIKE '%London%' THEN 'Europe'
    WHEN headquarters LIKE '%Germany%' THEN 'Europe'
    WHEN headquarters LIKE '%Netherlands%' THEN 'Europe'
    WHEN headquarters LIKE '%Poland%' THEN 'Europe'
    WHEN headquarters LIKE '%Israel%' THEN 'Middle East'
    WHEN headquarters LIKE '%Canada%' THEN 'North America'
    ELSE 'Global'
  END,
  country = CASE 
    WHEN headquarters LIKE '%USA%' OR headquarters LIKE '%, USA' THEN 'USA'
    WHEN headquarters LIKE '%China%' OR headquarters LIKE '%, 中国' THEN 'China'
    WHEN headquarters LIKE '%UK%' OR headquarters LIKE '%London%' THEN 'UK'
    WHEN headquarters LIKE '%Germany%' THEN 'Germany'
    WHEN headquarters LIKE '%Netherlands%' THEN 'Netherlands'
    WHEN headquarters LIKE '%Poland%' THEN 'Poland'
    WHEN headquarters LIKE '%Israel%' THEN 'Israel'
    WHEN headquarters LIKE '%Canada%' THEN 'Canada'
    ELSE 'Global'
  END,
  is_unicorn = false,
  valuation_usd = COALESCE(valuation_usd, 100000000)
WHERE company_tier IS NULL OR company_tier = '';

COMMIT;
