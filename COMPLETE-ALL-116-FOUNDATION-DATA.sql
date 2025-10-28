-- 完整补齐116家公司的 founded_year 和 headquarters
-- 可重复执行，使用 COALESCE 避免覆盖已有数据

BEGIN;

-- ============================================================
-- Giants（大厂）- 上市公司
-- ============================================================
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

-- ============================================================
-- 中国巨头
-- ============================================================
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

-- ============================================================
-- Unicorns - 知名AI公司
-- ============================================================
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
WHERE name IN ('Notion', 'Notion AI');

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

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2021),
  headquarters = COALESCE(headquarters, 'San Francisco, California, USA')
WHERE name = '01.AI';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2022),
  headquarters = COALESCE(headquarters, 'San Francisco, California, USA')
WHERE name = 'Adept AI';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2021),
  headquarters = COALESCE(headquarters, 'Beijing, China')
WHERE name = 'DeepSeek';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2022),
  headquarters = COALESCE(headquarters, 'San Francisco, California, USA')
WHERE name = 'Cursor';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2023),
  headquarters = COALESCE(headquarters, 'San Francisco, California, USA')
WHERE name = 'AgentGPT';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2023),
  headquarters = COALESCE(headquarters, 'San Francisco, California, USA')
WHERE name = 'AutoGPT';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2019),
  headquarters = COALESCE(headquarters, 'Berlin, Germany')
WHERE name = 'Haystack';

-- ============================================================
-- AI Research/Labs
-- ============================================================
UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2019),
  headquarters = COALESCE(headquarters, 'Heidelberg, Germany')
WHERE name = 'Aleph Alpha';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2016),
  headquarters = COALESCE(headquarters, 'Los Altos, California, USA')
WHERE name = 'Cerebras';

-- ============================================================
-- AI Tools/Platforms
-- ============================================================
UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2023),
  headquarters = COALESCE(headquarters, 'Palo Alto, California, USA')
WHERE name = 'Banana';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2012),
  headquarters = COALESCE(headquarters, 'San Francisco, California, USA')
WHERE name = 'Beautiful.ai';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2021),
  headquarters = COALESCE(headquarters, 'San Francisco, California, USA')
WHERE name = 'Brev.dev';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2021),
  headquarters = COALESCE(headquarters, 'San Francisco, California, USA')
WHERE name = 'Chroma';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2022),
  headquarters = COALESCE(headquarters, 'Austin, Texas, USA')
WHERE name = 'Civitai';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2017),
  headquarters = COALESCE(headquarters, 'Tel Aviv, Israel')
WHERE name = 'ClearML';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2016),
  headquarters = COALESCE(headquarters, 'New York, USA')
WHERE name = 'Comet ML';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2022),
  headquarters = COALESCE(headquarters, 'San Francisco, California, USA')
WHERE name = 'ComfyUI';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2016),
  headquarters = COALESCE(headquarters, 'San Francisco, California, USA')
WHERE name = 'Copy.ai';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2013),
  headquarters = COALESCE(headquarters, 'San Francisco, California, USA')
WHERE name = 'Cruise';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2018),
  headquarters = COALESCE(headquarters, 'San Francisco, California, USA')
WHERE name = 'Descript';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2017),
  headquarters = COALESCE(headquarters, 'San Francisco, California, USA')
WHERE name = 'Determined AI';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2012),
  headquarters = COALESCE(headquarters, 'Beijing, China')
WHERE name LIKE 'DiDi%';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2022),
  headquarters = COALESCE(headquarters, 'New York, USA')
WHERE name = 'ElevenLabs';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2018),
  headquarters = COALESCE(headquarters, 'San Francisco, California, USA')
WHERE name = 'GitHub Copilot';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2021),
  headquarters = COALESCE(headquarters, 'San Francisco, California, USA')
WHERE name = 'Glean';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2014),
  headquarters = COALESCE(headquarters, 'San Francisco, California, USA')
WHERE name = 'Gradio';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2018),
  headquarters = COALESCE(headquarters, 'Berlin, Germany')
WHERE name = 'Haystack';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2016),
  headquarters = COALESCE(headquarters, 'Paris, France')
WHERE name = 'Hugging Face';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2011),
  headquarters = COALESCE(headquarters, 'Armonk, New York, USA')
WHERE name = 'IBM Watson';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2021),
  headquarters = COALESCE(headquarters, 'San Francisco, California, USA')
WHERE name = 'Invoke AI';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2018),
  headquarters = COALESCE(headquarters, 'Google (Open Source)')
WHERE name = 'JAX';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2004),
  headquarters = COALESCE(headquarters, 'Beijing, China')
WHERE name = 'JD AI';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2010),
  headquarters = COALESCE(headquarters, 'San Francisco, California, USA')
WHERE name = 'Kaggle';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2022),
  headquarters = COALESCE(headquarters, 'Beijing, China')
WHERE name = 'Kaimu AI';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2021),
  headquarters = COALESCE(headquarters, 'Beijing, China')
WHERE name = 'Kuaibo AI';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2011),
  headquarters = COALESCE(headquarters, 'Beijing, China')
WHERE name = 'Kuaishou AI';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2018),
  headquarters = COALESCE(headquarters, 'San Francisco, California, USA')
WHERE name = 'Labelbox';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2022),
  headquarters = COALESCE(headquarters, 'San Francisco, California, USA')
WHERE name IN ('LangChain', 'LangFlow', 'LangSmith');

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2019),
  headquarters = COALESCE(headquarters, 'San Francisco, California, USA')
WHERE name = 'Lightning AI';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2022),
  headquarters = COALESCE(headquarters, 'San Francisco, California, USA')
WHERE name = 'LlamaIndex';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2015),
  headquarters = COALESCE(headquarters, 'San Francisco, California, USA')
WHERE name = 'Loom';

-- ============================================================
-- 中国AI公司
-- ============================================================
UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2011),
  headquarters = COALESCE(headquarters, 'Beijing, China')
WHERE name = 'iFlytek';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2014),
  headquarters = COALESCE(headquarters, 'Hong Kong, China')
WHERE name = 'SenseTime';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2011),
  headquarters = COALESCE(headquarters, 'Beijing, China')
WHERE name = 'Megvii';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2015),
  headquarters = COALESCE(headquarters, 'Beijing, China')
WHERE name = 'CloudWalk';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2012),
  headquarters = COALESCE(headquarters, 'Shanghai, China')
WHERE name = 'Yitu';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2023),
  headquarters = COALESCE(headquarters, 'Beijing, China')
WHERE name = 'MiniMax';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2010),
  headquarters = COALESCE(headquarters, 'Beijing, China')
WHERE name = 'Meituan AI';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2015),
  headquarters = COALESCE(headquarters, 'Shanghai, China')
WHERE name = 'PDD AI';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2023),
  headquarters = COALESCE(headquarters, 'Beijing, China')
WHERE name = 'Moonshot AI';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2023),
  headquarters = COALESCE(headquarters, 'Beijing, China')
WHERE name = 'Zhipu AI';

-- ============================================================
-- MLOps/Infrastructure
-- ============================================================
UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2019),
  headquarters = COALESCE(headquarters, 'Milpitas, California, USA')
WHERE name = 'Milvus';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2021),
  headquarters = COALESCE(headquarters, 'San Francisco, California, USA')
WHERE name = 'Modal';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2022),
  headquarters = COALESCE(headquarters, 'San Francisco, California, USA')
WHERE name = 'Mojo AI';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2017),
  headquarters = COALESCE(headquarters, 'Warsaw, Poland')
WHERE name = 'Neptune';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2017),
  headquarters = COALESCE(headquarters, 'San Francisco, California, USA')
WHERE name = 'Polyaxon';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2016),
  headquarters = COALESCE(headquarters, 'Facebook AI (Open Source)')
WHERE name = 'PyTorch';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2021),
  headquarters = COALESCE(headquarters, 'Berlin, Germany')
WHERE name = 'Qdrant';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2022),
  headquarters = COALESCE(headquarters, 'San Francisco, California, USA')
WHERE name = 'Replicate';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2019),
  headquarters = COALESCE(headquarters, 'Toronto, Canada')
WHERE name = 'Resemble AI';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2022),
  headquarters = COALESCE(headquarters, 'Microsoft (Open Source)')
WHERE name = 'Semantic Kernel';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2017),
  headquarters = COALESCE(headquarters, 'Palo Alto, California, USA')
WHERE name = 'Snorkel AI';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2018),
  headquarters = COALESCE(headquarters, 'San Francisco, California, USA')
WHERE name = 'Streamlit';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2019),
  headquarters = COALESCE(headquarters, 'Palo Alto, California, USA')
WHERE name = 'SuperAnnotate';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2017),
  headquarters = COALESCE(headquarters, 'London, United Kingdom')
WHERE name = 'Synthesia';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2013),
  headquarters = COALESCE(headquarters, 'Tel Aviv, Israel')
WHERE name = 'Tabnine';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2015),
  headquarters = COALESCE(headquarters, 'San Francisco, California, USA')
WHERE name = '2015';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2015),
  headquarters = COALESCE(headquarters, 'Palo Alto, California, USA')
WHERE name = '2015';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2016),
  headquarters = COALESCE(headquarters, 'Google (Open Source)')
WHERE name = 'TensorFlow';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2003),
  headquarters = COALESCE(headquarters, 'Palo Alto, California, USA')
WHERE name IN ('Tesla', 'Tesla AI');

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2022),
  headquarters = COALESCE(headquarters, 'San Francisco, California, USA')
WHERE name = 'Vecto';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2016),
  headquarters = COALESCE(headquarters, 'Amsterdam, Netherlands')
WHERE name = 'Weaviate';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2018),
  headquarters = COALESCE(headquarters, 'San Francisco, California, USA')
WHERE name = 'Weights & Biases';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2011),
  headquarters = COALESCE(headquarters, 'Sunnyvale, California, USA')
WHERE name = 'Zapier';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2017),
  headquarters = COALESCE(headquarters, 'San Francisco, California, USA')
WHERE name = 'Zilliz';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2013),
  headquarters = COALESCE(headquarters, 'San Francisco, California, USA')
WHERE name = 'Otter.ai';

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

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2011),
  headquarters = COALESCE(headquarters, 'Palo Alto, California, USA')
WHERE name = 'Argo AI';

COMMIT;

-- 查看更新结果
SELECT 
    COUNT(*) as total_companies,
    COUNT(founded_year) as with_founded_year,
    COUNT(headquarters) as with_headquarters,
    ROUND(COUNT(founded_year)::numeric / COUNT(*) * 100, 2) as founded_year_pct,
    ROUND(COUNT(headquarters)::numeric / COUNT(*) * 100, 2) as headquarters_pct
FROM companies;

