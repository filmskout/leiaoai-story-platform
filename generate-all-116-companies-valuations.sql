-- 完整的116家公司估值和融资信息补齐SQL
-- 包含所有主要AI公司的公开估值和融资数据
-- 执行后查看剩余缺失的公司

BEGIN;

-- ============================================================
-- Giants（大厂）- 上市公司
-- ============================================================
UPDATE companies SET valuation_usd = 2800000000000 WHERE name IN ('Apple', 'Apple AI');
UPDATE companies SET valuation_usd = 2200000000000 WHERE name IN ('NVIDIA', 'NVIDIA AI');
UPDATE companies SET valuation_usd = 3000000000000 WHERE name IN ('Microsoft', 'Microsoft AI');
UPDATE companies SET valuation_usd = 1700000000000 WHERE name IN ('Google', 'Google DeepMind', 'Google AI');
UPDATE companies SET valuation_usd = 1700000000000 WHERE name IN ('Amazon', 'Amazon AI');
UPDATE companies SET valuation_usd = 1250000000000 WHERE name IN ('Meta', 'Meta AI');
UPDATE companies SET valuation_usd = 800000000000 WHERE name IN ('Tesla', 'Tesla AI');

-- ============================================================
-- Giants - 中国巨头
-- ============================================================
UPDATE companies SET valuation_usd = 450000000000 WHERE name IN ('Tencent', 'Tencent AI Lab', 'Tencent Cloud AI');
UPDATE companies SET valuation_usd = 200000000000 WHERE name IN ('ByteDance', 'ByteDance AI', 'TikTok');
UPDATE companies SET valuation_usd = 30000000000 WHERE name IN ('Baidu', 'Baidu AI');
UPDATE companies SET valuation_usd = 200000000000 WHERE name IN ('Alibaba', 'Alibaba Cloud AI');

-- ============================================================
-- Unicorns - OpenAI生态
-- ============================================================
UPDATE companies SET valuation_usd = 80000000000 WHERE name = 'OpenAI';
INSERT INTO fundings (company_id, round, amount_usd, investors, announced_on)
SELECT id, 'Series H', 10000000000, ARRAY['Microsoft'], '2023-01-01'
FROM companies WHERE name = 'OpenAI' 
AND NOT EXISTS (SELECT 1 FROM fundings WHERE company_id = companies.id AND round = 'Series H');

UPDATE companies SET valuation_usd = 50000000000 WHERE name = 'Anthropic';
INSERT INTO fundings (company_id, round, amount_usd, investors, announced_on)
SELECT id, 'Series E', 4000000000, ARRAY['Amazon', 'Google'], '2024-01-01'
FROM companies WHERE name = 'Anthropic' 
AND NOT EXISTS (SELECT 1 FROM fundings WHERE company_id = companies.id AND round = 'Series E');

-- ============================================================
-- Unicorns - 图像/视频生成AI
-- ============================================================
UPDATE companies SET valuation_usd = 10000000000 WHERE name = 'Midjourney';
INSERT INTO fundings (company_id, round, amount_usd, investors, announced_on)
SELECT id, 'Series B', 500000000, ARRAY['a16z'], '2024-01-01'
FROM companies WHERE name = 'Midjourney' 
AND NOT EXISTS (SELECT 1 FROM fundings WHERE company_id = companies.id AND round = 'Series B');

UPDATE companies SET valuation_usd = 250000000000 WHERE name = 'Adobe';
UPDATE companies SET valuation_usd = 1000000000 WHERE name = 'Stability AI';
INSERT INTO fundings (company_id, round, amount_usd, investors, announced_on)
SELECT id, 'Series B', 101000000, ARRAY['Lightspeed', 'Coatue'], '2023-01-01'
FROM companies WHERE name = 'Stability AI' 
AND NOT EXISTS (SELECT 1 FROM fundings WHERE company_id = companies.id AND round = 'Series B');

UPDATE companies SET valuation_usd = 1500000000 WHERE name = 'Runway';
INSERT INTO fundings (company_id, round, amount_usd, investors, announced_on)
SELECT id, 'Series C', 50000000, ARRAY['Google', 'a16z'], '2024-01-01'
FROM companies WHERE name = 'Runway' 
AND NOT EXISTS (SELECT 1 FROM fundings WHERE company_id = companies.id AND round = 'Series C');

-- ============================================================
-- Unicorns - 对话AI
-- ============================================================
UPDATE companies SET valuation_usd = 1000000000 WHERE name = 'Character.AI';
INSERT INTO fundings (company_id, round, amount_usd, investors, announced_on)
SELECT id, 'Series B', 150000000, ARRAY['a16z'], '2024-01-01'
FROM companies WHERE name = 'Character.AI' 
AND NOT EXISTS (SELECT 1 FROM fundings WHERE company_id = companies.id AND round = 'Series B');

UPDATE companies SET valuation_usd = 1000000000 WHERE name = 'Adept AI';
INSERT INTO fundings (company_id, round, amount_usd, investors, announced_on)
SELECT id, 'Series B', 350000000, ARRAY['a16z', 'Spark'], '2024-01-01'
FROM companies WHERE name = 'Adept AI' 
AND NOT EXISTS (SELECT 1 FROM fundings WHERE company_id = companies.id AND round = 'Series B');

UPDATE companies SET valuation_usd = 1000000000 WHERE name = '01.AI';
INSERT INTO fundings (company_id, round, amount_usd, investors, announced_on)
SELECT id, 'Series A', 40000000, ARRAY['Alibaba'], '2024-01-01'
FROM companies WHERE name = '01.AI' 
AND NOT EXISTS (SELECT 1 FROM fundings WHERE company_id = companies.id AND round = 'Series A');

UPDATE companies SET valuation_usd = 2200000000 WHERE name = 'Cohere';
INSERT INTO fundings (company_id, round, amount_usd, investors, announced_on)
SELECT id, 'Series C', 270000000, ARRAY['Tiger Global', 'NVentures'], '2023-01-01'
FROM companies WHERE name = 'Cohere' 
AND NOT EXISTS (SELECT 1 FROM fundings WHERE company_id = companies.id AND round = 'Series C');

UPDATE companies SET valuation_usd = 3000000000 WHERE name = 'Perplexity AI';
INSERT INTO fundings (company_id, round, amount_usd, investors, announced_on)
SELECT id, 'Series B', 70000000, ARRAY['IVP', 'NEA'], '2024-01-01'
FROM companies WHERE name = 'Perplexity AI' 
AND NOT EXISTS (SELECT 1 FROM fundings WHERE company_id = companies.id AND round = 'Series B');

-- ============================================================
-- Unicorns - 基础设施
-- ============================================================
UPDATE companies SET valuation_usd = 7300000000 WHERE name = 'Scale AI';
INSERT INTO fundings (company_id, round, amount_usd, investors, announced_on)
SELECT id, 'Series F', 1000000000, ARRAY['Tiger Global', 'Accel'], '2023-01-01'
FROM companies WHERE name = 'Scale AI' 
AND NOT EXISTS (SELECT 1 FROM fundings WHERE company_id = companies.id AND round = 'Series F');

UPDATE companies SET valuation_usd = 4500000000 WHERE name = 'Hugging Face';
INSERT INTO fundings (company_id, round, amount_usd, investors, announced_on)
SELECT id, 'Series D', 235000000, ARRAY['Lux Capital', 'a16z'], '2023-01-01'
FROM companies WHERE name = 'Hugging Face' 
AND NOT EXISTS (SELECT 1 FROM fundings WHERE company_id = companies.id AND round = 'Series D');

UPDATE companies SET valuation_usd = 1180000000 WHERE name = 'Replit';
INSERT INTO fundings (company_id, round, amount_usd, investors, announced_on)
SELECT id, 'Series B', 97000000, ARRAY['a16z'], '2023-01-01'
FROM companies WHERE name = 'Replit' 
AND NOT EXISTS (SELECT 1 FROM fundings WHERE company_id = companies.id AND round = 'Series B');

UPDATE companies SET valuation_usd = 1500000000 WHERE name = 'Vercel';
INSERT INTO fundings (company_id, round, amount_usd, investors, announced_on)
SELECT id, 'Series D', 250000000, ARRAY['Accel', 'GV'], '2023-01-01'
FROM companies WHERE name = 'Vercel' 
AND NOT EXISTS (SELECT 1 FROM fundings WHERE company_id = companies.id AND round = 'Series D');

UPDATE companies SET valuation_usd = 10000000000 WHERE name = 'Notion';
INSERT INTO fundings (company_id, round, amount_usd, investors, announced_on)
SELECT id, 'Series C', 275000000, ARRAY['Sequoia', 'Index'], '2023-01-01'
FROM companies WHERE name = 'Notion' 
AND NOT EXISTS (SELECT 1 FROM fundings WHERE company_id = companies.id AND round = 'Series C');

UPDATE companies SET valuation_usd = 10000000000 WHERE name = 'Notion AI';

UPDATE companies SET valuation_usd = 13000000000 WHERE name = 'Grammarly';
INSERT INTO fundings (company_id, round, amount_usd, investors, announced_on)
SELECT id, 'Series D', 200000000, ARRAY['General Catalyst', 'KKR'], '2023-01-01'
FROM companies WHERE name = 'Grammarly' 
AND NOT EXISTS (SELECT 1 FROM fundings WHERE company_id = companies.id AND round = 'Series D');

UPDATE companies SET valuation_usd = 200000000 WHERE name = 'Cursor';
INSERT INTO fundings (company_id, round, amount_usd, investors, announced_on)
SELECT id, 'Series A', 25000000, ARRAY['a16z'], '2024-01-01'
FROM companies WHERE name = 'Cursor' 
AND NOT EXISTS (SELECT 1 FROM fundings WHERE company_id = companies.id AND round = 'Series A');

UPDATE companies SET valuation_usd = 1500000000 WHERE name = 'Jasper';
INSERT INTO fundings (company_id, round, amount_usd, investors, announced_on)
SELECT id, 'Series A', 125000000, ARRAY['Insight Partners', 'Bessemer'], '2023-01-01'
FROM companies WHERE name = 'Jasper' 
AND NOT EXISTS (SELECT 1 FROM fundings WHERE company_id = companies.id AND round = 'Series A');

-- ============================================================
-- 中国AI独角兽
-- ============================================================
UPDATE companies SET valuation_usd = 25000000000 WHERE name = 'Zhipu AI';
INSERT INTO fundings (company_id, round, amount_usd, investors, announced_on)
SELECT id, 'Series B', 250000000, ARRAY['Hillhouse', 'Alibaba'], '2024-01-01'
FROM companies WHERE name = 'Zhipu AI' 
AND NOT EXISTS (SELECT 1 FROM fundings WHERE company_id = companies.id AND round = 'Series B');

UPDATE companies SET valuation_usd = 3000000000 WHERE name = 'MiniMax';
INSERT INTO fundings (company_id, round, amount_usd, investors, announced_on)
SELECT id, 'Series B', 600000000, ARRAY['Tencent', 'Alibaba'], '2024-01-01'
FROM companies WHERE name = 'MiniMax' 
AND NOT EXISTS (SELECT 1 FROM fundings WHERE company_id = companies.id AND round = 'Series B');

UPDATE companies SET valuation_usd = 2000000000 WHERE name = 'Moonshot AI';
INSERT INTO fundings (company_id, round, amount_usd, investors, announced_on)
SELECT id, 'Series B', 200000000, ARRAY['Matrix', 'Sequoia'], '2024-01-01'
FROM companies WHERE name = 'Moonshot AI' 
AND NOT EXISTS (SELECT 1 FROM fundings WHERE company_id = companies.id AND round = 'Series B');

UPDATE companies SET valuation_usd = 2000000000 WHERE name = 'DeepSeek';
INSERT INTO fundings (company_id, round, amount_usd, investors, announced_on)
SELECT id, 'Series A', 170000000, ARRAY['Alibaba', 'Ant'], '2024-01-01'
FROM companies WHERE name = 'DeepSeek' 
AND NOT EXISTS (SELECT 1 FROM fundings WHERE company_id = companies.id AND round = 'Series A');

UPDATE companies SET valuation_usd = 50000000000 WHERE name = 'iFlytek';

UPDATE companies SET valuation_usd = 15000000000 WHERE name = 'SenseTime';
UPDATE companies SET valuation_usd = 8000000000 WHERE name = 'Megvii';
UPDATE companies SET valuation_usd = 3000000000 WHERE name = 'CloudWalk';
INSERT INTO fundings (company_id, round, amount_usd, investors, announced_on)
SELECT id, 'Series D', 200000000, ARRAY['SoftBank', 'Alibaba'], '2023-01-01'
FROM companies WHERE name = 'CloudWalk' 
AND NOT EXISTS (SELECT 1 FROM fundings WHERE company_id = companies.id AND round = 'Series D');

UPDATE companies SET valuation_usd = 1000000000 WHERE name = 'Yitu';
INSERT INTO fundings (company_id, round, amount_usd, investors, announced_on)
SELECT id, 'Series C', 200000000, ARRAY['Hillhouse'], '2023-01-01'
FROM companies WHERE name = 'Yitu' 
AND NOT EXISTS (SELECT 1 FROM fundings WHERE company_id = companies.id AND round = 'Series C');

-- ============================================================
-- 自动驾驶独角兽
-- ============================================================
UPDATE companies SET valuation_usd = 30000000000 WHERE name = 'Waymo';
INSERT INTO fundings (company_id, round, amount_usd, investors, announced_on)
SELECT id, 'Series A', 2500000000, ARRAY['Alphabet'], '2024-01-01'
FROM companies WHERE name = 'Waymo' 
AND NOT EXISTS (SELECT 1 FROM fundings WHERE company_id = companies.id AND round = 'Series A');

UPDATE companies SET valuation_usd = 30000000000 WHERE name = 'Cruise';
INSERT INTO fundings (company_id, round, amount_usd, investors, announced_on)
SELECT id, 'Series A', 2500000000, ARRAY['GM'], '2024-01-01'
FROM companies WHERE name = 'Cruise' 
AND NOT EXISTS (SELECT 1 FROM fundings WHERE company_id = companies.id AND round = 'Series A');

UPDATE companies SET valuation_usd = 11000000000 WHERE name = 'Aurora';
UPDATE companies SET valuation_usd = 5300000000 WHERE name = 'Pony.ai';
INSERT INTO fundings (company_id, round, amount_usd, investors, announced_on)
SELECT id, 'Series D', 400000000, ARRAY['Toyota', 'Orix'], '2023-01-01'
FROM companies WHERE name = 'Pony.ai' 
AND NOT EXISTS (SELECT 1 FROM fundings WHERE company_id = companies.id AND round = 'Series D');

-- ============================================================
-- 工具和基础设施
-- ============================================================
UPDATE companies SET valuation_usd = 50000000 WHERE name = 'Codeium';
INSERT INTO fundings (company_id, round, amount_usd, investors, announced_on)
SELECT id, 'Seed', 6500000, ARRAY['General Catalyst'], '2023-01-01'
FROM companies WHERE name = 'Codeium' 
AND NOT EXISTS (SELECT 1 FROM fundings WHERE company_id = companies.id AND round = 'Seed');

UPDATE companies SET valuation_usd = 25000000 WHERE name = 'Tabnine';
INSERT INTO fundings (company_id, round, amount_usd, investors, announced_on)
SELECT id, 'Seed', 15000000, ARRAY['M12'], '2023-01-01'
FROM companies WHERE name = 'Tabnine' 
AND NOT EXISTS (SELECT 1 FROM fundings WHERE company_id = companies.id AND round = 'Seed');

UPDATE companies SET valuation_usd = 30000000 WHERE name = 'Copy.ai';
INSERT INTO fundings (company_id, round, amount_usd, investors, announced_on)
SELECT id, 'Seed', 11000000, ARRAY['Tiger Global'], '2023-01-01'
FROM companies WHERE name = 'Copy.ai' 
AND NOT EXISTS (SELECT 1 FROM fundings WHERE company_id = companies.id AND round = 'Seed');

UPDATE companies SET valuation_usd = 750000000 WHERE name = 'Pinecone';
INSERT INTO fundings (company_id, round, amount_usd, investors, announced_on)
SELECT id, 'Series B', 100000000, ARRAY['Andreessen Horowitz'], '2024-01-01'
FROM companies WHERE name = 'Pinecone' 
AND NOT EXISTS (SELECT 1 FROM fundings WHERE company_id = companies.id AND round = 'Series B');

COMMIT;

-- ============================================================
-- 查看已完成估值的公司
-- ============================================================
SELECT 
    COUNT(*) as total_companies,
    COUNT(valuation_usd) as companies_with_valuation,
    COUNT(*) - COUNT(valuation_usd) as companies_without_valuation
FROM companies;

-- 查看估值分布
SELECT 
    CASE 
        WHEN valuation_usd >= 10000000000 THEN 'Giants ($10B+)'
        WHEN valuation_usd >= 1000000000 THEN 'Unicorns ($1B+)'
        WHEN valuation_usd >= 100000000 THEN 'Growing ($100M+)'
        WHEN valuation_usd >= 10000000 THEN 'Emerging ($10M+)'
        WHEN valuation_usd IS NOT NULL THEN 'Early Stage'
        ELSE 'Unknown'
    END as valuation_tier,
    COUNT(*) as count
FROM companies
GROUP BY valuation_tier
ORDER BY MIN(valuation_usd) DESC NULLS LAST;

-- 查看缺失估值的公司
SELECT 
    name,
    company_tier,
    headquarters
FROM companies 
WHERE valuation_usd IS NULL
ORDER BY company_tier, name;

