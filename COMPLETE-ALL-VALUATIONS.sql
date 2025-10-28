-- 完整的公司估值更新SQL
-- 基于已知的融资和估值数据

BEGIN;

-- Giants（大厂）- 上市公司
UPDATE companies SET valuation_usd = 2800000000000 WHERE name = 'Apple' OR name = 'Apple AI';
UPDATE companies SET valuation_usd = 2200000000000 WHERE name = 'NVIDIA';
UPDATE companies SET valuation_usd = 3000000000000 WHERE name = 'Microsoft' OR name = 'Microsoft AI';
UPDATE companies SET valuation_usd = 1700000000000 WHERE name = 'Google' OR name = 'Google DeepMind';
UPDATE companies SET valuation_usd = 1700000000000 WHERE name = 'Amazon' OR name = 'Amazon AI';
UPDATE companies SET valuation_usd = 1250000000000 WHERE name = 'Meta' OR name = 'Meta AI';
UPDATE companies SET valuation_usd = 800000000000 WHERE name = 'Tesla' OR name = 'Tesla AI';

-- Giants - 中国巨头
UPDATE companies SET valuation_usd = 450000000000 WHERE name = 'Tencent' OR name LIKE '%Tencent%';
UPDATE companies SET valuation_usd = 200000000000 WHERE name = 'ByteDance' OR name = 'ByteDance AI';
UPDATE companies SET valuation_usd = 30000000000 WHERE name = 'Baidu' OR name = 'Baidu AI';
UPDATE companies SET valuation_usd = 200000000000 WHERE name = 'Alibaba' OR name = 'Alibaba Cloud AI';

-- Unicorns（独角兽）- OpenAI生态
UPDATE companies SET valuation_usd = 80000000000 WHERE name = 'OpenAI';
UPDATE companies SET valuation_usd = 50000000000 WHERE name = 'Anthropic';

-- Unicorns - 图像AI
UPDATE companies SET valuation_usd = 10000000000 WHERE name = 'Midjourney';
UPDATE companies SET valuation_usd = 250000000000 WHERE name = 'Adobe';
UPDATE companies SET valuation_usd = 1000000000 WHERE name = 'Stability AI';
UPDATE companies SET valuation_usd = 1500000000 WHERE name = 'Runway';

-- Unicorns - 对话AI
UPDATE companies SET valuation_usd = 1000000000 WHERE name = 'Character.AI';
UPDATE companies SET valuation_usd = 1000000000 WHERE name = 'Adept AI';
UPDATE companies SET valuation_usd = 2200000000 WHERE name = 'Cohere';
UPDATE companies SET valuation_usd = 3000000000 WHERE name = 'Perplexity AI';

-- Unicorns - 开发工具
UPDATE companies SET valuation_usd = 7300000000 WHERE name = 'Scale AI';
UPDATE companies SET valuation_usd = 4500000000 WHERE name = 'Hugging Face';
UPDATE companies SET valuation_usd = 1500000000 WHERE name = 'Jasper';

-- 其他知名AI公司
UPDATE companies SET valuation_usd = 2000000000 WHERE name = 'Cursor';
UPDATE companies SET valuation_usd = 1000000000 WHERE name = 'v0' OR name = 'Vercel';
UPDATE companies SET valuation_usd = 500000000 WHERE name = 'Replit';
UPDATE companies SET valuation_usd = 300000000 WHERE name = 'Notion' OR name = 'Notion AI';
UPDATE companies SET valuation_usd = 200000000 WHERE name = 'Codeium';
UPDATE companies SET valuation_usd = 150000000 WHERE name = 'Tabnine';
UPDATE companies SET valuation_usd = 100000000 WHERE name = 'DeepSeek';
UPDATE companies SET valuation_usd = 500000000 WHERE name = 'Zhipu AI';
UPDATE companies SET valuation_usd = 200000000 WHERE name = 'MiniMax' OR name = 'MiniMax';
UPDATE companies SET valuation_usd = 300000000 WHERE name = 'Moonshot AI';

-- 中国AI公司
UPDATE companies SET valuation_usd = 20000000000 WHERE name = 'iFlytek';
UPDATE companies SET valuation_usd = 50000000000 WHERE name = 'SenseTime';
UPDATE companies SET valuation_usd = 30000000000 WHERE name = 'Megvii';
UPDATE companies SET valuation_usd = 5000000000 WHERE name = 'CloudWalk';
UPDATE companies SET valuation_usd = 2000000000 WHERE name = 'Yitu';

-- 自动驾驶
UPDATE companies SET valuation_usd = 50000000000 WHERE name = 'Waymo';
UPDATE companies SET valuation_usd = 30000000000 WHERE name = 'Cruise';
UPDATE companies SET valuation_usd = 20000000000 WHERE name = 'Aurora';
UPDATE companies SET valuation_usd = 10000000000 WHERE name = 'Pony.ai';

-- 查看更新结果
SELECT 
    name,
    COALESCE(valuation_usd, 0) as valuation_usd,
    CASE 
        WHEN valuation_usd >= 10000000000 THEN 'Giants'
        WHEN valuation_usd >= 1000000000 THEN 'Unicorns'
        WHEN valuation_usd >= 100000000 THEN 'Growing'
        ELSE 'Emerging'
    END as tier_category,
    company_tier
FROM companies 
ORDER BY COALESCE(valuation_usd, 0) DESC;

COMMIT;

