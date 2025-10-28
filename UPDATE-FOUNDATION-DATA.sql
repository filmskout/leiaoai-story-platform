-- 批量补齐 founded_year 与 headquarters（可重复执行，使用 COALESCE 保留已存在值）

-- Giants
UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2015),
  headquarters = COALESCE(headquarters, 'San Francisco, California, USA')
WHERE name = 'OpenAI';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2021),
  headquarters = COALESCE(headquarters, 'San Francisco, California, USA')
WHERE name = 'Anthropic';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 1998),
  headquarters = COALESCE(headquarters, 'Mountain View, California, USA')
WHERE name IN ('Google', 'Google DeepMind');

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 1975),
  headquarters = COALESCE(headquarters, 'Redmond, Washington, USA')
WHERE name IN ('Microsoft', 'Microsoft AI');

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2004),
  headquarters = COALESCE(headquarters, 'Menlo Park, California, USA')
WHERE name IN ('Meta', 'Meta AI');

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 1994),
  headquarters = COALESCE(headquarters, 'Seattle, Washington, USA')
WHERE name IN ('Amazon', 'Amazon AI');

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 1976),
  headquarters = COALESCE(headquarters, 'Cupertino, California, USA')
WHERE name IN ('Apple', 'Apple AI');

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 1993),
  headquarters = COALESCE(headquarters, 'Santa Clara, California, USA')
WHERE name = 'NVIDIA';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 1982),
  headquarters = COALESCE(headquarters, 'San Jose, California, USA')
WHERE name = 'Adobe';

-- 中国巨头
UPDATE companies SET 
  founded_year = COALESCE(founded_year, 1998),
  headquarters = COALESCE(headquarters, 'Shenzhen, Guangdong, China')
WHERE name LIKE 'Tencent%';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2012),
  headquarters = COALESCE(headquarters, 'Beijing, China')
WHERE name LIKE 'ByteDance%';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2000),
  headquarters = COALESCE(headquarters, 'Beijing, China')
WHERE name LIKE 'Baidu%';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 1999),
  headquarters = COALESCE(headquarters, 'Hangzhou, Zhejiang, China')
WHERE name LIKE 'Alibaba%';

-- Unicorns/Infra/Tools（示例，按需扩展）
UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2015),
  headquarters = COALESCE(headquarters, 'San Francisco, California, USA')
WHERE name = 'Vercel';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2019),
  headquarters = COALESCE(headquarters, 'London, United Kingdom')
WHERE name = 'Stability AI';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2022),
  headquarters = COALESCE(headquarters, 'San Francisco, California, USA')
WHERE name = 'Midjourney';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2013),
  headquarters = COALESCE(headquarters, 'San Francisco, California, USA')
WHERE name = 'Notion';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2009),
  headquarters = COALESCE(headquarters, 'San Francisco, California, USA')
WHERE name = 'Grammarly';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2016),
  headquarters = COALESCE(headquarters, 'San Francisco, California, USA')
WHERE name = 'Scale AI';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2016),
  headquarters = COALESCE(headquarters, 'New York, USA')
WHERE name = 'Hugging Face';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2022),
  headquarters = COALESCE(headquarters, 'San Francisco, California, USA')
WHERE name = 'Perplexity AI';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2019),
  headquarters = COALESCE(headquarters, 'Toronto, Canada')
WHERE name = 'Cohere';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2016),
  headquarters = COALESCE(headquarters, 'San Francisco, California, USA')
WHERE name = 'Replit';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2018),
  headquarters = COALESCE(headquarters, 'New York, USA')
WHERE name = 'Runway';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2021),
  headquarters = COALESCE(headquarters, 'Palo Alto, California, USA')
WHERE name = 'Character.AI';

-- 自动驾驶
UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2009),
  headquarters = COALESCE(headquarters, 'Mountain View, California, USA')
WHERE name = 'Waymo';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2013),
  headquarters = COALESCE(headquarters, 'San Francisco, California, USA')
WHERE name = 'Cruise';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2017),
  headquarters = COALESCE(headquarters, 'Pittsburgh, Pennsylvania, USA')
WHERE name = 'Aurora';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2016),
  headquarters = COALESCE(headquarters, 'Fremont, California, USA')
WHERE name = 'Pony.ai';

-- 可视化检查示例
SELECT name, founded_year, headquarters
FROM companies
WHERE founded_year IS NOT NULL OR headquarters IS NOT NULL
ORDER BY name
LIMIT 50;
