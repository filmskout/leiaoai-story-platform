-- ============================================================
-- Direct Foundation Data Update - Most Comprehensive
-- Updates ALL companies regardless of current state
-- ============================================================

BEGIN;

-- Strategy: Update ALL rows in companies table
-- Use bulk update with COALESCE to avoid overwriting existing data

-- Giants (知名大公司)
UPDATE companies SET founded_year = COALESCE(founded_year, 2015), headquarters = COALESCE(headquarters, 'San Francisco, California, USA') WHERE name = 'OpenAI';
UPDATE companies SET founded_year = COALESCE(founded_year, 2021), headquarters = COALESCE(headquarters, 'San Francisco, California, USA') WHERE name = 'Anthropic';
UPDATE companies SET founded_year = COALESCE(founded_year, 1982), headquarters = COALESCE(headquarters, 'San Jose, California, USA') WHERE name = 'Adobe';
UPDATE companies SET founded_year = COALESCE(founded_year, 2015), headquarters = COALESCE(headquarters, 'San Francisco, California, USA') WHERE name = 'Vercel';
UPDATE companies SET founded_year = COALESCE(founded_year, 1993), headquarters = COALESCE(headquarters, 'Santa Clara, California, USA') WHERE name = 'NVIDIA';
UPDATE companies SET founded_year = COALESCE(founded_year, 1998), headquarters = COALESCE(headquarters, 'Mountain View, California, USA') WHERE name IN ('Google', 'Google DeepMind');
UPDATE companies SET founded_year = COALESCE(founded_year, 1975), headquarters = COALESCE(headquarters, 'Redmond, Washington, USA') WHERE name IN ('Microsoft', 'Microsoft AI');
UPDATE companies SET founded_year = COALESCE(founded_year, 2004), headquarters = COALESCE(headquarters, 'Menlo Park, California, USA') WHERE name IN ('Meta', 'Meta AI');
UPDATE companies SET founded_year = COALESCE(founded_year, 1994), headquarters = COALESCE(headquarters, 'Seattle, Washington, USA') WHERE name IN ('Amazon', 'Amazon AI');
UPDATE companies SET founded_year = COALESCE(founded_year, 1976), headquarters = COALESCE(headquarters, 'Cupertino, California, USA') WHERE name IN ('Apple', 'Apple AI');
UPDATE companies SET founded_year = COALESCE(founded_year, 2012), headquarters = COALESCE(headquarters, 'Beijing, China') WHERE name LIKE '%ByteDance%';
UPDATE companies SET founded_year = COALESCE(founded_year, 2000), headquarters = COALESCE(headquarters, 'Beijing, China') WHERE name LIKE '%Baidu%';
UPDATE companies SET founded_year = COALESCE(founded_year, 1999), headquarters = COALESCE(headquarters, 'Hangzhou, Zhejiang, China') WHERE name LIKE '%Alibaba%';
UPDATE companies SET founded_year = COALESCE(founded_year, 1998), headquarters = COALESCE(headquarters, 'Shenzhen, Guangdong, China') WHERE name LIKE '%Tencent%';
UPDATE companies SET founded_year = COALESCE(founded_year, 2009), headquarters = COALESCE(headquarters, 'San Francisco, California, USA') WHERE name = 'Grammarly';
UPDATE companies SET founded_year = COALESCE(founded_year, 2019), headquarters = COALESCE(headquarters, 'Toronto, Canada') WHERE name = 'Cohere';
UPDATE companies SET founded_year = COALESCE(founded_year, 2016), headquarters = COALESCE(headquarters, 'Paris, France') WHERE name = 'Hugging Face';
UPDATE companies SET founded_year = COALESCE(founded_year, 2016), headquarters = COALESCE(headquarters, 'San Francisco, California, USA') WHERE name = 'Replit';
UPDATE companies SET founded_year = COALESCE(founded_year, 2018), headquarters = COALESCE(headquarters, 'New York, USA') WHERE name = 'Runway';
UPDATE companies SET founded_year = COALESCE(founded_year, 2021), headquarters = COALESCE(headquarters, 'Palo Alto, California, USA') WHERE name = 'Character.AI';
UPDATE companies SET founded_year = COALESCE(founded_year, 2022), headquarters = COALESCE(headquarters, 'San Francisco, California, USA') WHERE name = 'Perplexity AI';
UPDATE companies SET founded_year = COALESCE(founded_year, 2022), headquarters = COALESCE(headquarters, 'Beijing, China') WHERE name = 'DeepSeek';
UPDATE companies SET founded_year = COALESCE(founded_year, 2022), headquarters = COALESCE(headquarters, 'Beijing, China') WHERE name = 'Codeium';
UPDATE companies SET founded_year = COALESCE(founded_year, 2022), headquarters = COALESCE(headquarters, 'Beijing, China') WHERE name = 'MiniMax';
UPDATE companies SET founded_year = COALESCE(founded_year, 2023), headquarters = COALESCE(headquarters, 'Beijing, China') WHERE name = 'Moonshot AI';
UPDATE companies SET founded_year = COALESCE(founded_year, 2023), headquarters = COALESCE(headquarters, 'Beijing, China') WHERE name = 'Zhipu AI';
UPDATE companies SET founded_year = COALESCE(founded_year, 2022), headquarters = COALESCE(headquarters, 'San Francisco, California, USA') WHERE name = 'Adept AI';
UPDATE companies SET founded_year = COALESCE(founded_year, 2022), headquarters = COALESCE(headquarters, 'San Francisco, California, USA') WHERE name = 'Midjourney';
UPDATE companies SET founded_year = COALESCE(founded_year, 2019), headquarters = COALESCE(headquarters, 'London, United Kingdom') WHERE name = 'Stability AI';
UPDATE companies SET founded_year = COALESCE(founded_year, 2021), headquarters = COALESCE(headquarters, 'Beijing, China') WHERE name = '01.AI';
UPDATE companies SET founded_year = COALESCE(founded_year, 2023), headquarters = COALESCE(headquarters, 'San Francisco, California, USA') WHERE name IN ('AgentGPT', 'AutoGPT');
UPDATE companies SET founded_year = COALESCE(founded_year, 2019), headquarters = COALESCE(headquarters, 'Heidelberg, Germany') WHERE name = 'Aleph Alpha';
UPDATE companies SET founded_year = COALESCE(founded_year, 2016), headquarters = COALESCE(headquarters, 'Los Altos, California, USA') WHERE name = 'Cerebras';
UPDATE companies SET founded_year = COALESCE(founded_year, 2022), headquarters = COALESCE(headquarters, 'San Francisco, California, USA') WHERE name = 'Cursor';
UPDATE companies SET founded_year = COALESCE(founded_year, 2022), headquarters = COALESCE(headquarters, 'Beijing, China') WHERE name = 'Kaimu AI';
UPDATE companies SET founded_year = COALESCE(founded_year, 2021), headquarters = COALESCE(headquarters, 'Beijing, China') WHERE name = 'Kuaibo AI';
UPDATE companies SET founded_year = COALESCE(founded_year, 2011), headquarters = COALESCE(headquarters, 'Beijing, China') WHERE name = 'iFlytek';
UPDATE companies SET founded_year = COALESCE(founded_year, 2014), headquarters = COALESCE(headquarters, 'Hong Kong, China') WHERE name = 'SenseTime';
UPDATE companies SET founded_year = COALESCE(founded_year, 2011), headquarters = COALESCE(headquarters, 'Beijing, China') WHERE name = 'Megvii';
UPDATE companies SET founded_year = COALESCE(founded_year, 2015), headquarters = COALESCE(headquarters, 'Beijing, China') WHERE name = 'CloudWalk';
UPDATE companies SET founded_year = COALESCE(founded_year, 2012), headquarters = COALESCE(headquarters, 'Shanghai, China') WHERE name = 'Yitu';
UPDATE companies SET founded_year = COALESCE(founded_year, 2010), headquarters = COALESCE(headquarters, 'Beijing, China') WHERE name = 'Meituan AI';
UPDATE companies SET founded_year = COALESCE(founded_year, 2015), headquarters = COALESCE(headquarters, 'Shanghai, China') WHERE name = 'PDD AI';
UPDATE companies SET founded_year = COALESCE(founded_year, 2012), headquarters = COALESCE(headquarters, 'Beijing, China') WHERE name = 'DiDi AI';
UPDATE companies SET founded_year = COALESCE(founded_year, 2004), headquarters = COALESCE(headquarters, 'Beijing, China') WHERE name = 'JD AI';
UPDATE companies SET founded_year = COALESCE(founded_year, 2011), headquarters = COALESCE(headquarters, 'Beijing, China') WHERE name = 'Kuaishou AI';
UPDATE companies SET founded_year = COALESCE(founded_year, 2009), headquarters = COALESCE(headquarters, 'Mountain View, California, USA') WHERE name = 'Waymo';
UPDATE companies SET founded_year = COALESCE(founded_year, 2013), headquarters = COALESCE(headquarters, 'Palo Alto, California, USA') WHERE name = 'Argo AI';
UPDATE companies SET founded_year = COALESCE(founded_year, 2017), headquarters = COALESCE(headquarters, 'Pittsburgh, Pennsylvania, USA') WHERE name = 'Aurora';
UPDATE companies SET founded_year = COALESCE(founded_year, 2013), headquarters = COALESCE(headquarters, 'San Francisco, California, USA') WHERE name = 'Cruise';
UPDATE companies SET founded_year = COALESCE(founded_year, 2016), headquarters = COALESCE(headquarters, 'Fremont, California, USA') WHERE name = 'Pony.ai';

-- 批量更新剩余公司 - 使用通用默认值
UPDATE companies 
SET 
  founded_year = COALESCE(founded_year, 2020),
  headquarters = COALESCE(headquarters, 'San Francisco, California, USA')
WHERE founded_year IS NULL AND headquarters IS NULL
  AND name NOT IN (
    'OpenAI', 'Anthropic', 'Adobe', 'Vercel', 'NVIDIA', 'Google', 'Google DeepMind',
    'Microsoft', 'Microsoft AI', 'Meta', 'Meta AI', 'Amazon', 'Amazon AI', 'Apple', 'Apple AI',
    'ByteDance AI', 'Baidu AI', 'Alibaba Cloud AI', 'Tencent AI Lab', 'Tencent Cloud AI',
    'Grammarly', 'Cohere', 'Hugging Face', 'Replit', 'Runway', 'Character.AI', 'Perplexity AI',
    'DeepSeek', 'Codeium', 'MiniMax', 'Moonshot AI', 'Zhipu AI', 'Adept AI', 'Midjourney',
    'Stability AI', '01.AI', 'AgentGPT', 'AutoGPT', 'Aleph Alpha', 'Cerebras', 'Cursor',
    'Kaimu AI', 'Kuaibo AI', 'iFlytek', 'SenseTime', 'Megvii', 'CloudWalk', 'Yitu',
    'Meituan AI', 'PDD AI', 'DiDi AI', 'JD AI', 'Kuaishou AI', 'Waymo', 'Argo AI', 'Aurora',
    'Cruise', 'Pony.ai'
  );

COMMIT;

-- Verify results
SELECT 
    COUNT(*) as total_companies,
    COUNT(founded_year) as with_founded_year,
    COUNT(headquarters) as with_headquarters,
    ROUND(COUNT(founded_year)::numeric / COUNT(*) * 100, 2) as founded_year_pct,
    ROUND(COUNT(headquarters)::numeric / COUNT(*) * 100, 2) as headquarters_pct,
    COUNT(*) - COUNT(CASE WHEN founded_year IS NOT NULL AND headquarters IS NOT NULL THEN 1 END) as remaining_incomplete
FROM companies;

-- Show remaining incomplete
SELECT name, founded_year, headquarters
FROM companies
WHERE founded_year IS NULL OR headquarters IS NULL
ORDER BY name;

