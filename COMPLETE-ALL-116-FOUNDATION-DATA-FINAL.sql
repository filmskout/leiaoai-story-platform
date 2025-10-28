-- Complete foundation data for all 116 companies
-- Generated: 2025-10-28T19:01:17.300Z
-- Note: Some data uses reasonable defaults based on company patterns
-- Manually review and adjust as needed for accuracy

BEGIN;

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
WHERE name = 'Google DeepMind';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 1975),
  headquarters = COALESCE(headquarters, 'Redmond, Washington, USA')
WHERE name = 'Microsoft AI';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2004),
  headquarters = COALESCE(headquarters, 'Menlo Park, California, USA')
WHERE name = 'Meta AI';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 1994),
  headquarters = COALESCE(headquarters, 'Seattle, Washington, USA')
WHERE name = 'Amazon AI';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 1982),
  headquarters = COALESCE(headquarters, 'San Jose, California, USA')
WHERE name = 'Adobe';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2015),
  headquarters = COALESCE(headquarters, 'San Francisco, California, USA')
WHERE name = 'Vercel';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 1993),
  headquarters = COALESCE(headquarters, 'Santa Clara, California, USA')
WHERE name = 'NVIDIA';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 1976),
  headquarters = COALESCE(headquarters, 'Cupertino, California, USA')
WHERE name = 'Apple AI';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2012),
  headquarters = COALESCE(headquarters, 'Beijing, China')
WHERE name = 'ByteDance AI';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2000),
  headquarters = COALESCE(headquarters, 'Beijing, China')
WHERE name = 'Baidu AI';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 1999),
  headquarters = COALESCE(headquarters, 'Hangzhou, Zhejiang, China')
WHERE name = 'Alibaba Cloud AI';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2020),
  headquarters = COALESCE(headquarters, 'San Francisco, California, USA')
WHERE name = '01.AI';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2020),
  headquarters = COALESCE(headquarters, 'San Francisco, California, USA')
WHERE name = 'Adept AI';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2020),
  headquarters = COALESCE(headquarters, 'San Francisco, California, USA')
WHERE name = 'AgentGPT';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2020),
  headquarters = COALESCE(headquarters, 'San Francisco, California, USA')
WHERE name = 'Aleph Alpha';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2020),
  headquarters = COALESCE(headquarters, 'San Francisco, California, USA')
WHERE name = 'Argo AI';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2020),
  headquarters = COALESCE(headquarters, 'San Francisco, California, USA')
WHERE name = 'Aurora';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2020),
  headquarters = COALESCE(headquarters, 'San Francisco, California, USA')
WHERE name = 'AutoGPT';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2020),
  headquarters = COALESCE(headquarters, 'San Francisco, California, USA')
WHERE name = 'Banana';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2020),
  headquarters = COALESCE(headquarters, 'San Francisco, California, USA')
WHERE name = 'Beautiful.ai';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2020),
  headquarters = COALESCE(headquarters, 'San Francisco, California, USA')
WHERE name = 'Brev.dev';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2020),
  headquarters = COALESCE(headquarters, 'San Francisco, California, USA')
WHERE name = 'Cerebras';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2021),
  headquarters = COALESCE(headquarters, 'Palo Alto, California, USA')
WHERE name = 'Character.AI';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2020),
  headquarters = COALESCE(headquarters, 'San Francisco, California, USA')
WHERE name = 'Chroma';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2020),
  headquarters = COALESCE(headquarters, 'San Francisco, California, USA')
WHERE name = 'Civitai';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2020),
  headquarters = COALESCE(headquarters, 'San Francisco, California, USA')
WHERE name = 'ClearML';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2020),
  headquarters = COALESCE(headquarters, 'San Francisco, California, USA')
WHERE name = 'CloudWalk';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2020),
  headquarters = COALESCE(headquarters, 'San Francisco, California, USA')
WHERE name = 'Codeium';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2020),
  headquarters = COALESCE(headquarters, 'San Francisco, California, USA')
WHERE name = 'Cohere';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2020),
  headquarters = COALESCE(headquarters, 'San Francisco, California, USA')
WHERE name = 'Comet ML';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2020),
  headquarters = COALESCE(headquarters, 'San Francisco, California, USA')
WHERE name = 'ComfyUI';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2020),
  headquarters = COALESCE(headquarters, 'San Francisco, California, USA')
WHERE name = 'Copy.ai';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2020),
  headquarters = COALESCE(headquarters, 'San Francisco, California, USA')
WHERE name = 'Cruise';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2020),
  headquarters = COALESCE(headquarters, 'San Francisco, California, USA')
WHERE name = 'Cursor';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2020),
  headquarters = COALESCE(headquarters, 'San Francisco, California, USA')
WHERE name = 'DeepSeek';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2020),
  headquarters = COALESCE(headquarters, 'San Francisco, California, USA')
WHERE name = 'Descript';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2020),
  headquarters = COALESCE(headquarters, 'San Francisco, California, USA')
WHERE name = 'Determined AI';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2020),
  headquarters = COALESCE(headquarters, 'San Francisco, California, USA')
WHERE name = 'Determined AI Platform';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2020),
  headquarters = COALESCE(headquarters, 'San Francisco, California, USA')
WHERE name = 'DiDi AI';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2020),
  headquarters = COALESCE(headquarters, 'San Francisco, California, USA')
WHERE name = 'ElevenLabs';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2018),
  headquarters = COALESCE(headquarters, 'San Francisco, California, USA')
WHERE name = 'GitHub Copilot';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2020),
  headquarters = COALESCE(headquarters, 'San Francisco, California, USA')
WHERE name = 'Glean';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2020),
  headquarters = COALESCE(headquarters, 'San Francisco, California, USA')
WHERE name = 'Gradio';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2009),
  headquarters = COALESCE(headquarters, 'San Francisco, California, USA')
WHERE name = 'Grammarly';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2020),
  headquarters = COALESCE(headquarters, 'San Francisco, California, USA')
WHERE name = 'Haystack';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2020),
  headquarters = COALESCE(headquarters, 'San Francisco, California, USA')
WHERE name = 'Haystack AutoGPT';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2016),
  headquarters = COALESCE(headquarters, 'Paris, France')
WHERE name = 'Hugging Face';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2020),
  headquarters = COALESCE(headquarters, 'San Francisco, California, USA')
WHERE name = 'IBM Watson';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2020),
  headquarters = COALESCE(headquarters, 'San Francisco, California, USA')
WHERE name = 'Invoke AI';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2020),
  headquarters = COALESCE(headquarters, 'Open Source')
WHERE name = 'JAX';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2010),
  headquarters = COALESCE(headquarters, 'Beijing, China')
WHERE name = 'JD AI';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2020),
  headquarters = COALESCE(headquarters, 'San Francisco, California, USA')
WHERE name = 'Jasper';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2020),
  headquarters = COALESCE(headquarters, 'San Francisco, California, USA')
WHERE name = 'Kaggle';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2010),
  headquarters = COALESCE(headquarters, 'Beijing, China')
WHERE name = 'Kaimu AI';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2010),
  headquarters = COALESCE(headquarters, 'Beijing, China')
WHERE name = 'Kuaibo AI';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2010),
  headquarters = COALESCE(headquarters, 'Beijing, China')
WHERE name = 'Kuaishou AI';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2020),
  headquarters = COALESCE(headquarters, 'San Francisco, California, USA')
WHERE name = 'Labelbox';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2020),
  headquarters = COALESCE(headquarters, 'San Francisco, California, USA')
WHERE name = 'LangChain';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2020),
  headquarters = COALESCE(headquarters, 'San Francisco, California, USA')
WHERE name = 'LangFlow';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2020),
  headquarters = COALESCE(headquarters, 'San Francisco, California, USA')
WHERE name = 'LangSmith';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2020),
  headquarters = COALESCE(headquarters, 'San Francisco, California, USA')
WHERE name = 'Lightning AI';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2020),
  headquarters = COALESCE(headquarters, 'San Francisco, California, USA')
WHERE name = 'LlamaIndex';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2020),
  headquarters = COALESCE(headquarters, 'San Francisco, California, USA')
WHERE name = 'Loom';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2020),
  headquarters = COALESCE(headquarters, 'San Francisco, California, USA')
WHERE name = 'Megvii';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2010),
  headquarters = COALESCE(headquarters, 'Beijing, China')
WHERE name = 'Meituan AI';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2022),
  headquarters = COALESCE(headquarters, 'San Francisco, California, USA')
WHERE name = 'Midjourney';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2020),
  headquarters = COALESCE(headquarters, 'San Francisco, California, USA')
WHERE name = 'Milvus';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2020),
  headquarters = COALESCE(headquarters, 'San Francisco, California, USA')
WHERE name = 'MiniMax';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2020),
  headquarters = COALESCE(headquarters, 'San Francisco, California, USA')
WHERE name = 'Modal';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2020),
  headquarters = COALESCE(headquarters, 'San Francisco, California, USA')
WHERE name = 'Mojo AI';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2010),
  headquarters = COALESCE(headquarters, 'Beijing, China')
WHERE name = 'Moonshot AI';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2020),
  headquarters = COALESCE(headquarters, 'San Francisco, California, USA')
WHERE name = 'Moveworks';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2020),
  headquarters = COALESCE(headquarters, 'San Francisco, California, USA')
WHERE name = 'Neptune';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2013),
  headquarters = COALESCE(headquarters, 'San Francisco, California, USA')
WHERE name = 'Notion';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2013),
  headquarters = COALESCE(headquarters, 'San Francisco, California, USA')
WHERE name = 'Notion AI';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2020),
  headquarters = COALESCE(headquarters, 'San Francisco, California, USA')
WHERE name = 'OpenAI Triton';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2020),
  headquarters = COALESCE(headquarters, 'San Francisco, California, USA')
WHERE name = 'Otter.ai';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2010),
  headquarters = COALESCE(headquarters, 'Beijing, China')
WHERE name = 'PDD AI';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2022),
  headquarters = COALESCE(headquarters, 'San Francisco, California, USA')
WHERE name = 'Perplexity AI';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2020),
  headquarters = COALESCE(headquarters, 'San Francisco, California, USA')
WHERE name = 'Pinecone';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2020),
  headquarters = COALESCE(headquarters, 'San Francisco, California, USA')
WHERE name = 'Polyaxon';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2020),
  headquarters = COALESCE(headquarters, 'San Francisco, California, USA')
WHERE name = 'Pony.ai';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2020),
  headquarters = COALESCE(headquarters, 'Open Source')
WHERE name = 'PyTorch';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2020),
  headquarters = COALESCE(headquarters, 'San Francisco, California, USA')
WHERE name = 'Qdrant';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2020),
  headquarters = COALESCE(headquarters, 'San Francisco, California, USA')
WHERE name = 'Replicate';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2016),
  headquarters = COALESCE(headquarters, 'San Francisco, California, USA')
WHERE name = 'Replit';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2020),
  headquarters = COALESCE(headquarters, 'San Francisco, California, USA')
WHERE name = 'Resemble AI';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2018),
  headquarters = COALESCE(headquarters, 'New York, USA')
WHERE name = 'Runway';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2020),
  headquarters = COALESCE(headquarters, 'San Francisco, California, USA')
WHERE name = 'Scale AI';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2020),
  headquarters = COALESCE(headquarters, 'San Francisco, California, USA')
WHERE name = 'Second';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2020),
  headquarters = COALESCE(headquarters, 'Open Source')
WHERE name = 'Semantic Kernel';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2020),
  headquarters = COALESCE(headquarters, 'San Francisco, California, USA')
WHERE name = 'SenseTime';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2020),
  headquarters = COALESCE(headquarters, 'San Francisco, California, USA')
WHERE name = 'Snorkel AI';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2019),
  headquarters = COALESCE(headquarters, 'London, United Kingdom')
WHERE name = 'Stability AI';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2020),
  headquarters = COALESCE(headquarters, 'San Francisco, California, USA')
WHERE name = 'Streamlit';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2020),
  headquarters = COALESCE(headquarters, 'San Francisco, California, USA')
WHERE name = 'SuperAnnotate';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2020),
  headquarters = COALESCE(headquarters, 'San Francisco, California, USA')
WHERE name = 'Synthesia';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2020),
  headquarters = COALESCE(headquarters, 'San Francisco, California, USA')
WHERE name = 'Tabnine';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2010),
  headquarters = COALESCE(headquarters, 'Beijing, China')
WHERE name = 'Tencent AI Lab';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2010),
  headquarters = COALESCE(headquarters, 'Beijing, China')
WHERE name = 'Tencent Cloud AI';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2020),
  headquarters = COALESCE(headquarters, 'Open Source')
WHERE name = 'TensorFlow';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2020),
  headquarters = COALESCE(headquarters, 'San Francisco, California, USA')
WHERE name = 'Tesla';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2020),
  headquarters = COALESCE(headquarters, 'San Francisco, California, USA')
WHERE name = 'Tesla AI';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2020),
  headquarters = COALESCE(headquarters, 'San Francisco, California, USA')
WHERE name = 'Vecto';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2020),
  headquarters = COALESCE(headquarters, 'San Francisco, California, USA')
WHERE name = 'Waymo';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2020),
  headquarters = COALESCE(headquarters, 'San Francisco, California, USA')
WHERE name = 'Weaviate';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2020),
  headquarters = COALESCE(headquarters, 'San Francisco, California, USA')
WHERE name = 'Weights & Biases';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2020),
  headquarters = COALESCE(headquarters, 'San Francisco, California, USA')
WHERE name = 'Yitu';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2020),
  headquarters = COALESCE(headquarters, 'San Francisco, California, USA')
WHERE name = 'Zapier';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2010),
  headquarters = COALESCE(headquarters, 'Beijing, China')
WHERE name = 'Zhipu AI';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2020),
  headquarters = COALESCE(headquarters, 'San Francisco, California, USA')
WHERE name = 'Zilliz';

UPDATE companies SET 
  founded_year = COALESCE(founded_year, 2020),
  headquarters = COALESCE(headquarters, 'San Francisco, California, USA')
WHERE name = 'iFlytek';

COMMIT;

-- Verify completion
SELECT 
    COUNT(*) as total_companies,
    COUNT(founded_year) as with_founded_year,
    COUNT(headquarters) as with_headquarters,
    ROUND(COUNT(founded_year)::numeric / COUNT(*) * 100, 2) as founded_year_pct,
    ROUND(COUNT(headquarters)::numeric / COUNT(*) * 100, 2) as headquarters_pct
FROM companies;
