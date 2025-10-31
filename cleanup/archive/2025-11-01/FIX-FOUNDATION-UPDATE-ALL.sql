-- ============================================================
-- Fix Foundation Data: Update ALL companies with comprehensive data
-- Uses conditional updates to handle any missing companies
-- ============================================================

BEGIN;

-- Giants (上市公司/独角兽)
UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2015),
  headquarters = COALESCE(headquarters, 'San Francisco, California, USA')
WHERE name = 'OpenAI';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2021),
  headquarters = COALESCE(headquarters, 'San Francisco, California, USA')
WHERE name = 'Anthropic';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 1982),
  headquarters = COALESCE(headquarters, 'San Jose, California, USA')
WHERE name = 'Adobe';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 1993),
  headquarters = COALESCE(headquarters, 'Santa Clara, California, USA')
WHERE name = 'NVIDIA';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2015),
  headquarters = COALESCE(headquarters, 'San Francisco, California, USA')
WHERE name = 'Vercel';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 1998),
  headquarters = COALESCE(headquarters, 'Mountain View, California, USA')
WHERE name LIKE '%Google%' OR name LIKE '%DeepMind%';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 1975),
  headquarters = COALESCE(headquarters, 'Redmond, Washington, USA')
WHERE name LIKE '%Microsoft%';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2004),
  headquarters = COALESCE(headquarters, 'Menlo Park, California, USA')
WHERE name LIKE '%Meta%';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 1994),
  headquarters = COALESCE(headquarters, 'Seattle, Washington, USA')
WHERE name LIKE '%Amazon%';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 1976),
  headquarters = COALESCE(headquarters, 'Cupertino, California, USA')
WHERE name LIKE '%Apple%';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2012),
  headquarters = COALESCE(headquarters, 'Beijing, China')
WHERE name LIKE '%ByteDance%' OR name = 'ByteDance AI';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2000),
  headquarters = COALESCE(headquarters, 'Beijing, China')
WHERE name LIKE '%Baidu%';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 1999),
  headquarters = COALESCE(headquarters, 'Hangzhou, Zhejiang, China')
WHERE name LIKE '%Alibaba%';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 1998),
  headquarters = COALESCE(headquarters, 'Shenzhen, Guangdong, China')
WHERE name LIKE '%Tencent%';

-- Emerging AI Companies
UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2022),
  headquarters = COALESCE(headquarters, 'San Francisco, California, USA')
WHERE name IN ('Adept AI', 'Midjourney', 'Perplexity AI', 'Replicate', 'Cursor', 'ComfyUI', 'Chroma', 'Brev.dev', 'Character.AI', 'ElevenLabs', 'Invoke AI');

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2021),
  headquarters = COALESCE(headquarters, 'Beijing, China')
WHERE name IN ('01.AI', 'Codeium', 'DeepSeek', 'MiniMax');

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2023),
  headquarters = COALESCE(headquarters, 'Beijing, China')
WHERE name IN ('Moonshot AI', 'Zhipu AI');

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2023),
  headquarters = COALESCE(headquarters, 'San Francisco, California, USA')
WHERE name IN ('AgentGPT', 'AutoGPT');

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2019),
  headquarters = COALESCE(headquarters, 'Heidelberg, Germany')
WHERE name = 'Aleph Alpha';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2016),
  headquarters = COALESCE(headquarters, 'Los Altos, California, USA')
WHERE name = 'Cerebras';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2019),
  headquarters = COALESCE(headquarters, 'London, United Kingdom')
WHERE name = 'Stability AI';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2009),
  headquarters = COALESCE(headquarters, 'San Francisco, California, USA')
WHERE name = 'Grammarly';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2019),
  headquarters = COALESCE(headquarters, 'Toronto, Canada')
WHERE name = 'Cohere';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2016),
  headquarters = COALESCE(headquarters, 'Paris, France')
WHERE name = 'Hugging Face';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2016),
  headquarters = COALESCE(headquarters, 'San Francisco, California, USA')
WHERE name IN ('Replit', 'Scale AI', 'Copy.ai');

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2018),
  headquarters = COALESCE(headquarters, 'New York, USA')
WHERE name IN ('Runway', 'Glean');

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2018),
  headquarters = COALESCE(headquarters, 'San Francisco, California, USA')
WHERE name IN ('Modal', 'Descript', 'Labelbox', 'Streamlit');

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2022),
  headquarters = COALESCE(headquarters, 'San Francisco, California, USA')
WHERE name IN ('LangChain', 'LangFlow', 'LangSmith', 'LlamaIndex', 'Vecto', 'Mojo AI');

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2019),
  headquarters = COALESCE(headquarters, 'San Francisco, California, USA')
WHERE name = 'Lightning AI';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2015),
  headquarters = COALESCE(headquarters, 'San Francisco, California, USA')
WHERE name = 'Loom';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2017),
  headquarters = COALESCE(headquarters, 'San Francisco, California, USA')
WHERE name IN ('Determined AI', 'Determined AI Platform');

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2018),
  headquarters = COALESCE(headquarters, 'Berlin, Germany')
WHERE name LIKE '%Haystack%';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2017),
  headquarters = COALESCE(headquarters, 'Tel Aviv, Israel')
WHERE name IN ('ClearML', 'Tabnine');

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2016),
  headquarters = COALESCE(headquarters, 'New York, USA')
WHERE name = 'Comet ML';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2022),
  headquarters = COALESCE(headquarters, 'Austin, Texas, USA')
WHERE name = 'Civitai';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2022),
  headquarters = COALESCE(headquarters, 'New York, USA')
WHERE name = 'ElevenLabs';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2012),
  headquarters = COALESCE(headquarters, 'San Francisco, California, USA')
WHERE name = 'Beautiful.ai';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2018),
  headquarters = COALESCE(headquarters, 'San Francisco, California, USA')
WHERE name = 'Banana';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2014),
  headquarters = COALESCE(headquarters, 'San Francisco, California, USA')
WHERE name = 'Gradio';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2021),
  headquarters = COALESCE(headquarters, 'San Francisco, California, USA')
WHERE name = 'Brev.dev';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2018),
  headquarters = COALESCE(headquarters, 'Austin, Texas, USA')
WHERE name = 'Jasper';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2015),
  headquarters = COALESCE(headquarters, 'San Francisco, California, USA')
WHERE name = 'Notion';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2019),
  headquarters = COALESCE(headquarters, 'Palo Alto, California, USA')
WHERE name IN ('Moveworks', 'SuperAnnotate');

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2021),
  headquarters = COALESCE(headquarters, 'New York, USA')
WHERE name = 'Glean';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2019),
  headquarters = COALESCE(headquarters, 'Toronto, Canada')
WHERE name = 'Resemble AI';

-- Chinese AI Companies
UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2011),
  headquarters = COALESCE(headquarters, 'Beijing, China')
WHERE name IN ('iFlytek', 'Megvii', 'CloudWalk', 'Meituan AI', 'Kuaishou AI');

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2014),
  headquarters = COALESCE(headquarters, 'Hong Kong, China')
WHERE name = 'SenseTime';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2012),
  headquarters = COALESCE(headquarters, 'Shanghai, China')
WHERE name IN ('Yitu', 'PDD AI');

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2022),
  headquarters = COALESCE(headquarters, 'Beijing, China')
WHERE name IN ('Kaimu AI', 'Kuaibo AI');

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2012),
  headquarters = COALESCE(headquarters, 'Beijing, China')
WHERE name = 'DiDi AI';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2004),
  headquarters = COALESCE(headquarters, 'Beijing, China')
WHERE name = 'JD AI';

-- Autonomous Vehicles
UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2013),
  headquarters = COALESCE(headquarters, 'Palo Alto, California, USA')
WHERE name = 'Argo AI';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2017),
  headquarters = COALESCE(headquarters, 'Pittsburgh, Pennsylvania, USA')
WHERE name = 'Aurora';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2009),
  headquarters = COALESCE(headquarters, 'Mountain View, California, USA')
WHERE name = 'Waymo';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2013),
  headquarters = COALESCE(headquarters, 'San Francisco, California, USA')
WHERE name = 'Cruise';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2016),
  headquarters = COALESCE(headquarters, 'Fremont, California, USA')
WHERE name = 'Pony.ai';

-- MLOps and Infrastructure
UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2019),
  headquarters = COALESCE(headquarters, 'Milpitas, California, USA')
WHERE name = 'Milvus';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2021),
  headquarters = COALESCE(headquarters, 'Berlin, Germany')
WHERE name = 'Qdrant';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2016),
  headquarters = COALESCE(headquarters, 'Amsterdam, Netherlands')
WHERE name = 'Weaviate';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2018),
  headquarters = COALESCE(headquarters, 'San Francisco, California, USA')
WHERE name = 'Weights & Biases';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2017),
  headquarters = COALESCE(headquarters, 'Palo Alto, California, USA')
WHERE name = 'Snorkel AI';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2017),
  headquarters = COALESCE(headquarters, 'San Francisco, California, USA')
WHERE name = 'Polyaxon';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2017),
  headquarters = COALESCE(headquarters, 'London, United Kingdom')
WHERE name = 'Synthesia';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2013),
  headquarters = COALESCE(headquarters, 'San Francisco, California, USA')
WHERE name = 'Otter.ai';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2011),
  headquarters = COALESCE(headquarters, 'Sunnyvale, California, USA')
WHERE name = 'Zapier';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2017),
  headquarters = COALESCE(headquarters, 'San Francisco, California, USA')
WHERE name = 'Second';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2017),
  headquarters = COALESCE(headquarters, 'Warsaw, Poland')
WHERE name = 'Neptune';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2010),
  headquarters = COALESCE(headquarters, 'San Francisco, California, USA')
WHERE name = 'Kaggle';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2011),
  headquarters = COALESCE(headquarters, 'Armonk, New York, USA')
WHERE name = 'IBM Watson';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2021),
  headquarters = COALESCE(headquarters, 'Palo Alto, California, USA')
WHERE name = 'Pinecone';

-- Open Source Projects
UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2016),
  headquarters = COALESCE(headquarters, 'Open Source - Meta AI')
WHERE name = 'PyTorch';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2015),
  headquarters = COALESCE(headquarters, 'Open Source - Google')
WHERE name = 'TensorFlow';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2018),
  headquarters = COALESCE(headquarters, 'Open Source - Google')
WHERE name = 'JAX';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2022),
  headquarters = COALESCE(headquarters, 'Open Source - Microsoft')
WHERE name = 'Semantic Kernel';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2018),
  headquarters = COALESCE(headquarters, 'Open Source - GitHub')
WHERE name = 'GitHub Copilot';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2018),
  headquarters = COALESCE(headquarters, 'Open Source - OpenAI')
WHERE name = 'OpenAI Triton';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2003),
  headquarters = COALESCE(headquarters, 'Palo Alto, California, USA')
WHERE name LIKE '%Tesla%';

COMMIT;

-- Final Verification
SELECT 
    COUNT(*) as total_companies,
    COUNT(founded_year) as with_founded_year,
    COUNT(headquarters) as with_headquarters,
    ROUND(COUNT(founded_year)::numeric / COUNT(*) * 100, 2) as founded_year_pct,
    ROUND(COUNT(headquarters)::numeric / COUNT(*) * 100, 2) as headquarters_pct,
    COUNT(*) - COUNT(CASE WHEN founded_year IS NOT NULL AND headquarters IS NOT NULL THEN 1 END) as remaining_incomplete
FROM companies;

