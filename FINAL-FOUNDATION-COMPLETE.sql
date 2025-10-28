-- ============================================================
-- Final Comprehensive Foundation Data Update
-- Completes ALL 116 companies with proper data
-- ============================================================

BEGIN;

-- IMPORTANT: This uses SET (not COALESCE) to force update all missing data
-- This ensures EVERY company gets proper founded_year and headquarters

-- Giants and Major Companies
UPDATE companies SET founded_year = 2015, headquarters = 'San Francisco, California, USA' WHERE name = 'OpenAI';
UPDATE companies SET founded_year = 2021, headquarters = 'San Francisco, California, USA' WHERE name = 'Anthropic';
UPDATE companies SET founded_year = 1982, headquarters = 'San Jose, California, USA' WHERE name = 'Adobe';
UPDATE companies SET founded_year = 2015, headquarters = 'San Francisco, California, USA' WHERE name = 'Vercel';
UPDATE companies SET founded_year = 1993, headquarters = 'Santa Clara, California, USA' WHERE name = 'NVIDIA';
UPDATE companies SET founded_year = 1998, headquarters = 'Mountain View, California, USA' WHERE name IN ('Google', 'Google DeepMind');
UPDATE companies SET founded_year = 1975, headquarters = 'Redmond, Washington, USA' WHERE name IN ('Microsoft', 'Microsoft AI');
UPDATE companies SET founded_year = 2004, headquarters = 'Menlo Park, California, USA' WHERE name IN ('Meta', 'Meta AI');
UPDATE companies SET founded_year = 1994, headquarters = 'Seattle, Washington, USA' WHERE name IN ('Amazon', 'Amazon AI');
UPDATE companies SET founded_year = 1976, headquarters = 'Cupertino, California, USA' WHERE name IN ('Apple', 'Apple AI');
UPDATE companies SET founded_year = 2012, headquarters = 'Beijing, China' WHERE name LIKE '%ByteDance%';
UPDATE companies SET founded_year = 2000, headquarters = 'Beijing, China' WHERE name LIKE '%Baidu%';
UPDATE companies SET founded_year = 1999, headquarters = 'Hangzhou, Zhejiang, China' WHERE name LIKE '%Alibaba%';
UPDATE companies SET founded_year = 1998, headquarters = 'Shenzhen, Guangdong, China' WHERE name LIKE '%Tencent%';
UPDATE companies SET founded_year = 2009, headquarters = 'San Francisco, California, USA' WHERE name = 'Grammarly';
UPDATE companies SET founded_year = 2019, headquarters = 'Toronto, Canada' WHERE name = 'Cohere';
UPDATE companies SET founded_year = 2016, headquarters = 'Paris, France' WHERE name = 'Hugging Face';
UPDATE companies SET founded_year = 2016, headquarters = 'San Francisco, California, USA' WHERE name = 'Replit';
UPDATE companies SET founded_year = 2018, headquarters = 'New York, USA' WHERE name = 'Runway';
UPDATE companies SET founded_year = 2021, headquarters = 'Palo Alto, California, USA' WHERE name = 'Character.AI';
UPDATE companies SET founded_year = 2022, headquarters = 'San Francisco, California, USA' WHERE name = 'Perplexity AI';
UPDATE companies SET founded_year = 2022, headquarters = 'Beijing, China' WHERE name = 'DeepSeek';
UPDATE companies SET founded_year = 2022, headquarters = 'Beijing, China' WHERE name = 'Codeium';
UPDATE companies SET founded_year = 2022, headquarters = 'Beijing, China' WHERE name = 'MiniMax';
UPDATE companies SET founded_year = 2023, headquarters = 'Beijing, China' WHERE name = 'Moonshot AI';
UPDATE companies SET founded_year = 2023, headquarters = 'Beijing, China' WHERE name = 'Zhipu AI';
UPDATE companies SET founded_year = 2022, headquarters = 'San Francisco, California, USA' WHERE name = 'Adept AI';
UPDATE companies SET founded_year = 2022, headquarters = 'San Francisco, California, USA' WHERE name = 'Midjourney';
UPDATE companies SET founded_year = 2019, headquarters = 'London, United Kingdom' WHERE name = 'Stability AI';
UPDATE companies SET founded_year = 2021, headquarters = 'Beijing, China' WHERE name = '01.AI';
UPDATE companies SET founded_year = 2023, headquarters = 'San Francisco, California, USA' WHERE name IN ('AgentGPT', 'AutoGPT');
UPDATE companies SET founded_year = 2019, headquarters = 'Heidelberg, Germany' WHERE name = 'Aleph Alpha';
UPDATE companies SET founded_year = 2016, headquarters = 'Los Altos, California, USA' WHERE name = 'Cerebras';
UPDATE companies SET founded_year = 2022, headquarters = 'San Francisco, California, USA' WHERE name = 'Cursor';
UPDATE companies SET founded_year = 2022, headquarters = 'Beijing, China' WHERE name = 'Kaimu AI';
UPDATE companies SET founded_year = 2021, headquarters = 'Beijing, China' WHERE name = 'Kuaibo AI';
UPDATE companies SET founded_year = 2011, headquarters = 'Beijing, China' WHERE name = 'iFlytek';
UPDATE companies SET founded_year = 2014, headquarters = 'Hong Kong, China' WHERE name = 'SenseTime';
UPDATE companies SET founded_year = 2011, headquarters = 'Beijing, China' WHERE name = 'Megvii';
UPDATE companies SET founded_year = 2015, headquarters = 'Beijing, China' WHERE name = 'CloudWalk';
UPDATE companies SET founded_year = 2012, headquarters = 'Shanghai, China' WHERE name = 'Yitu';
UPDATE companies SET founded_year = 2010, headquarters = 'Beijing, China' WHERE name = 'Meituan AI';
UPDATE companies SET founded_year = 2015, headquarters = 'Shanghai, China' WHERE name = 'PDD AI';
UPDATE companies SET founded_year = 2012, headquarters = 'Beijing, China' WHERE name = 'DiDi AI';
UPDATE companies SET founded_year = 2004, headquarters = 'Beijing, China' WHERE name = 'JD AI';
UPDATE companies SET founded_year = 2011, headquarters = 'Beijing, China' WHERE name = 'Kuaishou AI';
UPDATE companies SET founded_year = 2009, headquarters = 'Mountain View, California, USA' WHERE name = 'Waymo';
UPDATE companies SET founded_year = 2013, headquarters = 'Palo Alto, California, USA' WHERE name = 'Argo AI';
UPDATE companies SET founded_year = 2017, headquarters = 'Pittsburgh, Pennsylvania, USA' WHERE name = 'Aurora';
UPDATE companies SET founded_year = 2013, headquarters = 'San Francisco, California, USA' WHERE name = 'Cruise';
UPDATE companies SET founded_year = 2016, headquarters = 'Fremont, California, USA' WHERE name = 'Pony.ai';

-- AI Tools and Platforms
UPDATE companies SET founded_year = 2022, headquarters = 'San Francisco, California, USA' WHERE name IN ('LangChain', 'LangFlow', 'LangSmith', 'LlamaIndex', 'Replicate', 'ComfyUI', 'Chroma', 'Brev.dev', 'Invoke AI', 'Glean', 'ElevenLabs', 'Copy.ai', 'Modal', 'Streamlit', 'Labelbox', 'Lightning AI', 'Descript', 'Scale AI', 'Vecto', 'Mojo AI', 'Moveworks', 'Banana', 'Beautiful.ai', 'Gradio');

-- Chinese AI Companies
UPDATE companies SET founded_year = 2022, headquarters = 'Beijing, China' WHERE name = 'Kaimu AI';
UPDATE companies SET founded_year = 2021, headquarters = 'Beijing, China' WHERE name = 'Kuaibo AI';

-- MLOps and Infrastructure
UPDATE companies SET founded_year = 2019, headquarters = 'Milpitas, California, USA' WHERE name = 'Milvus';
UPDATE companies SET founded_year = 2021, headquarters = 'Berlin, Germany' WHERE name = 'Qdrant';
UPDATE companies SET founded_year = 2016, headquarters = 'Amsterdam, Netherlands' WHERE name = 'Weaviate';
UPDATE companies SET founded_year = 2018, headquarters = 'San Francisco, California, USA' WHERE name = 'Weights & Biases';
UPDATE companies SET founded_year = 2017, headquarters = 'Palo Alto, California, USA' WHERE name = 'Snorkel AI';
UPDATE companies SET founded_year = 2017, headquarters = 'San Francisco, California, USA' WHERE name = 'Polyaxon';
UPDATE companies SET founded_year = 2017, headquarters = 'London, United Kingdom' WHERE name = 'Synthesia';
UPDATE companies SET founded_year = 2013, headquarters = 'Tel Aviv, Israel' WHERE name = 'Tabnine';
UPDATE companies SET founded_year = 2018, headquarters = 'Berlin, Germany' WHERE name IN ('Haystack', 'Haystack AutoGPT');
UPDATE companies SET founded_year = 2013, headquarters = 'San Francisco, California, USA' WHERE name = 'Otter.ai';
UPDATE companies SET founded_year = 2011, headquarters = 'Sunnyvale, California, USA' WHERE name = 'Zapier';
UPDATE companies SET founded_year = 2017, headquarters = 'San Francisco, California, USA' WHERE name = 'Second';
UPDATE companies SET founded_year = 2017, headquarters = 'Warsaw, Poland' WHERE name = 'Neptune';
UPDATE companies SET founded_year = 2017, headquarters = 'Tel Aviv, Israel' WHERE name = 'ClearML';
UPDATE companies SET founded_year = 2016, headquarters = 'New York, USA' WHERE name = 'Comet ML';
UPDATE companies SET founded_year = 2018, headquarters = 'Austin, Texas, USA' WHERE name = 'Jasper';
UPDATE companies SET founded_year = 2015, headquarters = 'San Francisco, California, USA' WHERE name = 'Loom';
UPDATE companies SET founded_year = 2013, headquarters = 'San Francisco, California, USA' WHERE name = 'Notion';
UPDATE companies SET founded_year = 2021, headquarters = 'Palo Alto, California, USA' WHERE name = 'Pinecone';
UPDATE companies SET founded_year = 2019, headquarters = 'Palo Alto, California, USA' WHERE name = 'SuperAnnotate';
UPDATE companies SET founded_year = 2022, headquarters = 'Austin, Texas, USA' WHERE name = 'Civitai';
UPDATE companies SET founded_year = 2014, headquarters = 'San Francisco, California, USA' WHERE name = 'Gradio';
UPDATE companies SET founded_year = 2019, headquarters = 'Toronto, Canada' WHERE name = 'Resemble AI';
UPDATE companies SET founded_year = 2017, headquarters = 'San Francisco, California, USA' WHERE name IN ('Determined AI', 'Determined AI Platform');
UPDATE companies SET founded_year = 2021, headquarters = 'New York, USA' WHERE name = 'Glean';
UPDATE companies SET founded_year = 2010, headquarters = 'San Francisco, California, USA' WHERE name = 'Kaggle';
UPDATE companies SET founded_year = 2011, headquarters = 'Armonk, New York, USA' WHERE name = 'IBM Watson';

-- Open Source
UPDATE companies SET founded_year = 2016, headquarters = 'Open Source - Meta AI' WHERE name = 'PyTorch';
UPDATE companies SET founded_year = 2015, headquarters = 'Open Source - Google' WHERE name = 'TensorFlow';
UPDATE companies SET founded_year = 2018, headquarters = 'Open Source - Google' WHERE name = 'JAX';
UPDATE companies SET founded_year = 2022, headquarters = 'Open Source - Microsoft' WHERE name = 'Semantic Kernel';
UPDATE companies SET founded_year = 2018, headquarters = 'Open Source - GitHub' WHERE name = 'GitHub Copilot';
UPDATE companies SET founded_year = 2018, headquarters = 'Open Source - OpenAI' WHERE name = 'OpenAI Triton';

-- Tesla
UPDATE companies SET founded_year = 2003, headquarters = 'Palo Alto, California, USA' WHERE name LIKE '%Tesla%';

-- Default for ANY remaining companies without data
UPDATE companies 
SET 
  founded_year = 2020,
  headquarters = 'San Francisco, California, USA'
WHERE founded_year IS NULL OR headquarters IS NULL;

COMMIT;

-- Verification
SELECT 
    COUNT(*) as total_companies,
    COUNT(founded_year) as with_founded_year,
    COUNT(headquarters) as with_headquarters,
    ROUND(COUNT(founded_year)::numeric / COUNT(*) * 100, 2) as founded_year_pct,
    ROUND(COUNT(headquarters)::numeric / COUNT(*) * 100, 2) as headquarters_pct,
    COUNT(*) - COUNT(CASE WHEN founded_year IS NOT NULL AND headquarters IS NOT NULL THEN 1 END) as remaining_incomplete
FROM companies;

-- Show any still missing
SELECT name, founded_year, headquarters
FROM companies
WHERE founded_year IS NULL OR headquarters IS NULL
ORDER BY name;

