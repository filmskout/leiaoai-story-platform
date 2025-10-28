-- ============================================================
-- Complete Foundation Data for Missing 86 Companies
-- This script adds founded_year and headquarters for companies missing this data
-- ============================================================

BEGIN;

-- Giants and Major Tech Companies
UPDATE companies SET founded_year = COALESCE(founded_year, 1998), headquarters = COALESCE(headquarters, 'Shenzhen, Guangdong, China') WHERE name LIKE 'Tencent%';

-- Emerging AI Companies (2020-2023)
UPDATE companies SET founded_year = COALESCE(founded_year, 2021), headquarters = COALESCE(headquarters, 'Beijing, China') WHERE name = '01.AI';
UPDATE companies SET founded_year = COALESCE(founded_year, 2022), headquarters = COALESCE(headquarters, 'San Francisco, California, USA') WHERE name = 'Adept AI';
UPDATE companies SET founded_year = COALESCE(founded_year, 2023), headquarters = COALESCE(headquarters, 'San Francisco, California, USA') WHERE name IN ('AgentGPT', 'AutoGPT');
UPDATE companies SET founded_year = COALESCE(founded_year, 2019), headquarters = COALESCE(headquarters, 'Heidelberg, Germany') WHERE name = 'Aleph Alpha';
UPDATE companies SET founded_year = COALESCE(founded_year, 2016), headquarters = COALESCE(headquarters, 'Los Altos, California, USA') WHERE name = 'Cerebras';
UPDATE companies SET founded_year = COALESCE(founded_year, 2022), headquarters = COALESCE(headquarters, 'San Francisco, California, USA') WHERE name = 'Midjourney';
UPDATE companies SET founded_year = COALESCE(founded_year, 2021), headquarters = COALESCE(headquarters, 'Palo Alto, California, USA') WHERE name = 'Character.AI';
UPDATE companies SET founded_year = COALESCE(founded_year, 2022), headquarters = COALESCE(headquarters, 'Beijing, China') WHERE name = 'DeepSeek';
UPDATE companies SET founded_year = COALESCE(founded_year, 2022), headquarters = COALESCE(headquarters, 'Beijing, China') WHERE name = 'Codeium';
UPDATE companies SET founded_year = COALESCE(founded_year, 2022), headquarters = COALESCE(headquarters, 'Beijing, China') WHERE name = 'MiniMax';
UPDATE companies SET founded_year = COALESCE(founded_year, 2023), headquarters = COALESCE(headquarters, 'Beijing, China') WHERE name = 'Moonshot AI';
UPDATE companies SET founded_year = COALESCE(founded_year, 2023), headquarters = COALESCE(headquarters, 'Beijing, China') WHERE name = 'Zhipu AI';

-- AI Development Tools and Platforms
UPDATE companies SET founded_year = COALESCE(founded_year, 2018), headquarters = COALESCE(headquarters, 'San Francisco, California, USA') WHERE name = 'Banana';
UPDATE companies SET founded_year = COALESCE(founded_year, 2012), headquarters = COALESCE(headquarters, 'San Francisco, California, USA') WHERE name = 'Beautiful.ai';
UPDATE companies SET founded_year = COALESCE(founded_year, 2021), headquarters = COALESCE(headquarters, 'San Francisco, California, USA') WHERE name = 'Brev.dev';
UPDATE companies SET founded_year = COALESCE(founded_year, 2021), headquarters = COALESCE(headquarters, 'San Francisco, California, USA') WHERE name = 'Chroma';
UPDATE companies SET founded_year = COALESCE(founded_year, 2022), headquarters = COALESCE(headquarters, 'Austin, Texas, USA') WHERE name = 'Civitai';
UPDATE companies SET founded_year = COALESCE(founded_year, 2017), headquarters = COALESCE(headquarters, 'Tel Aviv, Israel') WHERE name = 'ClearML';
UPDATE companies SET founded_year = COALESCE(founded_year, 2016), headquarters = COALESCE(headquarters, 'New York, USA') WHERE name = 'Comet ML';
UPDATE companies SET founded_year = COALESCE(founded_year, 2022), headquarters = COALESCE(headquarters, 'San Francisco, California, USA') WHERE name = 'ComfyUI';
UPDATE companies SET founded_year = COALESCE(founded_year, 2016), headquarters = COALESCE(headquarters, 'San Francisco, California, USA') WHERE name = 'Copy.ai';
UPDATE companies SET founded_year = COALESCE(founded_year, 2022), headquarters = COALESCE(headquarters, 'San Francisco, California, USA') WHERE name = 'Cursor';
UPDATE companies SET founded_year = COALESCE(founded_year, 2018), headquarters = COALESCE(headquarters, 'San Francisco, California, USA') WHERE name = 'Descript';
UPDATE companies SET founded_year = COALESCE(founded_year, 2017), headquarters = COALESCE(headquarters, 'San Francisco, California, USA') WHERE name = 'Determined AI';
UPDATE companies SET founded_year = COALESCE(founded_year, 2021), headquarters = COALESCE(headquarters, 'San Francisco, California, USA') WHERE name = 'Determined AI Platform';
UPDATE companies SET founded_year = COALESCE(founded_year, 2022), headquarters = COALESCE(headquarters, 'New York, USA') WHERE name = 'ElevenLabs';
UPDATE companies SET founded_year = COALESCE(founded_year, 2021), headquarters = COALESCE(headquarters, 'New York, USA') WHERE name = 'Glean';
UPDATE companies SET founded_year = COALESCE(founded_year, 2014), headquarters = COALESCE(headquarters, 'San Francisco, California, USA') WHERE name = 'Gradio';
UPDATE companies SET founded_year = COALESCE(founded_year, 2018), headquarters = COALESCE(headquarters, 'Berlin, Germany') WHERE name IN ('Haystack', 'Haystack AutoGPT');
UPDATE companies SET founded_year = COALESCE(founded_year, 2021), headquarters = COALESCE(headquarters, 'San Francisco, California, USA') WHERE name = 'Invoke AI';
UPDATE companies SET founded_year = COALESCE(founded_year, 2018), headquarters = COALESCE(headquarters, 'San Francisco, California, USA') WHERE name = 'Labelbox';
UPDATE companies SET founded_year = COALESCE(founded_year, 2022), headquarters = COALESCE(headquarters, 'San Francisco, California, USA') WHERE name IN ('LangChain', 'LangFlow', 'LangSmith');
UPDATE companies SET founded_year = COALESCE(founded_year, 2019), headquarters = COALESCE(headquarters, 'San Francisco, California, USA') WHERE name = 'Lightning AI';
UPDATE companies SET founded_year = COALESCE(founded_year, 2022), headquarters = COALESCE(headquarters, 'San Francisco, California, USA') WHERE name = 'LlamaIndex';
UPDATE companies SET founded_year = COALESCE(founded_year, 2015), headquarters = COALESCE(headquarters, 'San Francisco, California, USA') WHERE name = 'Loom';
UPDATE companies SET founded_year = COALESCE(founded_year, 2019), headquarters = COALESCE(headquarters, 'San Francisco, California, USA') WHERE name = 'Modal';
UPDATE companies SET founded_year = COALESCE(founded_year, 2022), headquarters = COALESCE(headquarters, 'San Francisco, California, USA') WHERE name = 'Mojo AI';
UPDATE companies SET founded_year = COALESCE(founded_year, 2019), headquarters = COALESCE(headquarters, 'Palo Alto, California, USA') WHERE name = 'Moveworks';
UPDATE companies SET founded_year = COALESCE(founded_year, 2017), headquarters = COALESCE(headquarters, 'Warsaw, Poland') WHERE name = 'Neptune';
UPDATE companies SET founded_year = COALESCE(founded_year, 2022), headquarters = COALESCE(headquarters, 'San Francisco, California, USA') WHERE name = 'Perplexity AI';
UPDATE companies SET founded_year = COALESCE(founded_year, 2022), headquarters = COALESCE(headquarters, 'San Francisco, California, USA') WHERE name = 'Replicate';
UPDATE companies SET founded_year = COALESCE(founded_year, 2019), headquarters = COALESCE(headquarters, 'Toronto, Canada') WHERE name = 'Resemble AI';
UPDATE companies SET founded_year = COALESCE(founded_year, 2018), headquarters = COALESCE(headquarters, 'New York, USA') WHERE name = 'Runway';
UPDATE companies SET founded_year = COALESCE(founded_year, 2016), headquarters = COALESCE(headquarters, 'San Francisco, California, USA') WHERE name = 'Scale AI';
UPDATE companies SET founded_year = COALESCE(founded_year, 2018), headquarters = COALESCE(headquarters, 'San Francisco, California, USA') WHERE name = 'Streamlit';
UPDATE companies SET founded_year = COALESCE(founded_year, 2019), headquarters = COALESCE(headquarters, 'Palo Alto, California, USA') WHERE name = 'SuperAnnotate';
UPDATE companies SET founded_year = COALESCE(founded_year, 2022), headquarters = COALESCE(headquarters, 'San Francisco, California, USA') WHERE name = 'Vecto';

-- Chinese AI Companies
UPDATE companies SET founded_year = COALESCE(founded_year, 2011), headquarters = COALESCE(headquarters, 'Beijing, China') WHERE name = 'iFlytek';
UPDATE companies SET founded_year = COALESCE(founded_year, 2014), headquarters = COALESCE(headquarters, 'Hong Kong, China') WHERE name = 'SenseTime';
UPDATE companies SET founded_year = COALESCE(founded_year, 2011), headquarters = COALESCE(headquarters, 'Beijing, China') WHERE name = 'Megvii';
UPDATE companies SET founded_year = COALESCE(founded_year, 2015), headquarters = COALESCE(headquarters, 'Beijing, China') WHERE name = 'CloudWalk';
UPDATE companies SET founded_year = COALESCE(founded_year, 2012), headquarters = COALESCE(headquarters, 'Shanghai, China') WHERE name = 'Yitu';
UPDATE companies SET founded_year = COALESCE(founded_year, 2010), headquarters = COALESCE(headquarters, 'Beijing, China') WHERE name = 'Meituan AI';
UPDATE companies SET founded_year = COALESCE(founded_year, 2015), headquarters = COALESCE(headquarters, 'Shanghai, China') WHERE name = 'PDD AI';
UPDATE companies SET founded_year = COALESCE(founded_year, 2012), headquarters = COALESCE(headquarters, 'Beijing, China') WHERE name = 'DiDi AI';
UPDATE companies SET founded_year = COALESCE(founded_year, 2022), headquarters = COALESCE(headquarters, 'Beijing, China') WHERE name = 'Kaimu AI';
UPDATE companies SET founded_year = COALESCE(founded_year, 2021), headquarters = COALESCE(headquarters, 'Beijing, China') WHERE name = 'Kuaibo AI';
UPDATE companies SET founded_year = COALESCE(founded_year, 2011), headquarters = COALESCE(headquarters, 'Beijing, China') WHERE name = 'Kuaishou AI';
UPDATE companies SET founded_year = COALESCE(founded_year, 2004), headquarters = COALESCE(headquarters, 'Beijing, China') WHERE name = 'JD AI';

-- Autonomous Vehicles
UPDATE companies SET founded_year = COALESCE(founded_year, 2013), headquarters = COALESCE(headquarters, 'Palo Alto, California, USA') WHERE name = 'Argo AI';
UPDATE companies SET founded_year = COALESCE(founded_year, 2017), headquarters = COALESCE(headquarters, 'Pittsburgh, Pennsylvania, USA') WHERE name = 'Aurora';
UPDATE companies SET founded_year = COALESCE(founded_year, 2009), headquarters = COALESCE(headquarters, 'Mountain View, California, USA') WHERE name = 'Waymo';
UPDATE companies SET founded_year = COALESCE(founded_year, 2016), headquarters = COALESCE(headquarters, 'Fremont, California, USA') WHERE name = 'Pony.ai';

-- MLOps and Infrastructure
UPDATE companies SET founded_year = COALESCE(founded_year, 2019), headquarters = COALESCE(headquarters, 'Milpitas, California, USA') WHERE name = 'Milvus';
UPDATE companies SET founded_year = COALESCE(founded_year, 2021), headquarters = COALESCE(headquarters, 'Berlin, Germany') WHERE name = 'Qdrant';
UPDATE companies SET founded_year = COALESCE(founded_year, 2016), headquarters = COALESCE(headquarters, 'Amsterdam, Netherlands') WHERE name = 'Weaviate';
UPDATE companies SET founded_year = COALESCE(founded_year, 2018), headquarters = COALESCE(headquarters, 'San Francisco, California, USA') WHERE name = 'Weights & Biases';
UPDATE companies SET founded_year = COALESCE(founded_year, 2017), headquarters = COALESCE(headquarters, 'Palo Alto, California, USA') WHERE name = 'Snorkel AI';
UPDATE companies SET founded_year = COALESCE(founded_year, 2017), headquarters = COALESCE(headquarters, 'San Francisco, California, USA') WHERE name = 'Polyaxon';
UPDATE companies SET founded_year = COALESCE(founded_year, 2017), headquarters = COALESCE(headquarters, 'London, United Kingdom') WHERE name = 'Synthesia';
UPDATE companies SET founded_year = COALESCE(founded_year, 2013), headquarters = COALESCE(headquarters, 'Tel Aviv, Israel') WHERE name = 'Tabnine';
UPDATE companies SET founded_year = COALESCE(founded_year, 2013), headquarters = COALESCE(headquarters, 'San Francisco, California, USA') WHERE name = 'Otter.ai';
UPDATE companies SET founded_year = COALESCE(founded_year, 2011), headquarters = COALESCE(headquarters, 'Sunnyvale, California, USA') WHERE name = 'Zapier';
UPDATE companies SET founded_year = COALESCE(founded_year, 2017), headquarters = COALESCE(headquarters, 'San Francisco, California, USA') WHERE name = 'Second';

-- AI Writing and Content Tools
UPDATE companies SET founded_year = COALESCE(founded_year, 2018), headquarters = COALESCE(headquarters, 'Austin, Texas, USA') WHERE name = 'Jasper';

-- Open Source Projects
UPDATE companies SET founded_year = COALESCE(founded_year, 2016), headquarters = COALESCE(headquarters, 'Open Source - Meta AI') WHERE name = 'PyTorch';
UPDATE companies SET founded_year = COALESCE(founded_year, 2015), headquarters = COALESCE(headquarters, 'Open Source - Google') WHERE name = 'TensorFlow';
UPDATE companies SET founded_year = COALESCE(founded_year, 2018), headquarters = COALESCE(headquarters, 'Open Source - Google') WHERE name = 'JAX';
UPDATE companies SET founded_year = COALESCE(founded_year, 2022), headquarters = COALESCE(headquarters, 'Open Source - Microsoft') WHERE name = 'Semantic Kernel';
UPDATE companies SET founded_year = COALESCE(founded_year, 2018), headquarters = COALESCE(headquarters, 'Open Source - GitHub') WHERE name = 'GitHub Copilot';
UPDATE companies SET founded_year = COALESCE(founded_year, 2018), headquarters = COALESCE(headquarters, 'Open Source - OpenAI') WHERE name = 'OpenAI Triton';

-- Database and Search
UPDATE companies SET founded_year = COALESCE(founded_year, 2021), headquarters = COALESCE(headquarters, 'Palo Alto, California, USA') WHERE name = 'Pinecone';

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

-- Show companies still missing data (if any)
SELECT name, founded_year, headquarters,
    CASE 
        WHEN founded_year IS NULL AND headquarters IS NULL THEN 'Both missing'
        WHEN founded_year IS NULL THEN 'Missing founded_year'
        WHEN headquarters IS NULL THEN 'Missing headquarters'
        ELSE 'Complete'
    END as status
FROM companies
WHERE founded_year IS NULL OR headquarters IS NULL
ORDER BY name;

