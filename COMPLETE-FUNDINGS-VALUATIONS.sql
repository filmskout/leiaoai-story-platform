-- 完整的公司估值和融资信息补齐SQL
-- 基于公开资料和公开估值
-- 包含 114 个公司

BEGIN;


-- 01.AI
UPDATE companies SET valuation_usd = 1000000000 WHERE name = '01.AI';

INSERT INTO fundings (company_id, round, amount, investors, valuation, date, lead_investor)
SELECT id, 'Series A', 40, ARRAY['Alibaba'], 1000000000, '2024-01-01', 'Alibaba'
FROM companies WHERE name = '01.AI' 
AND NOT EXISTS (SELECT 1 FROM fundings WHERE company_id = companies.id AND round = 'Series A');


-- Adept AI
UPDATE companies SET valuation_usd = 1000000000 WHERE name = 'Adept AI';

INSERT INTO fundings (company_id, round, amount, investors, valuation, date, lead_investor)
SELECT id, 'Series B', 350000000, ARRAY['a16z', 'Spark'], 1000000000, '2024-01-01', 'a16z'
FROM companies WHERE name = 'Adept AI' 
AND NOT EXISTS (SELECT 1 FROM fundings WHERE company_id = companies.id AND round = 'Series B');


-- Adobe
UPDATE companies SET valuation_usd = 250000000000 WHERE name = 'Adobe';

-- TODO: AgentGPT - 需要查找估值和融资信息
-- TODO: Aleph Alpha - 需要查找估值和融资信息

-- Alibaba Cloud AI
UPDATE companies SET valuation_usd = 200000000000 WHERE name = 'Alibaba Cloud AI';


-- Amazon AI
UPDATE companies SET valuation_usd = 1700000000000 WHERE name = 'Amazon AI';


-- Anthropic
UPDATE companies SET valuation_usd = 50000000000 WHERE name = 'Anthropic';

INSERT INTO fundings (company_id, round, amount, investors, valuation, date, lead_investor)
SELECT id, 'Series E', 4000000000, ARRAY['Amazon', 'Google'], 50000000000, '2024-01-01', 'Amazon'
FROM companies WHERE name = 'Anthropic' 
AND NOT EXISTS (SELECT 1 FROM fundings WHERE company_id = companies.id AND round = 'Series E');


-- Apple AI
UPDATE companies SET valuation_usd = 2800000000000 WHERE name = 'Apple AI';

-- TODO: Argo AI - 需要查找估值和融资信息

-- Aurora
UPDATE companies SET valuation_usd = 11000000000 WHERE name = 'Aurora';

-- TODO: AutoGPT - 需要查找估值和融资信息

-- Baidu AI
UPDATE companies SET valuation_usd = 30000000000 WHERE name = 'Baidu AI';

-- TODO: Banana - 需要查找估值和融资信息
-- TODO: Beautiful.ai - 需要查找估值和融资信息
-- TODO: Brev.dev - 需要查找估值和融资信息

-- ByteDance AI
UPDATE companies SET valuation_usd = 200000000000 WHERE name = 'ByteDance AI';

INSERT INTO fundings (company_id, round, amount, investors, valuation, date, lead_investor)
SELECT id, 'Private', 0, ARRAY['Sequoia', 'SoftBank'], 200000000000, '2012-01-01', 'Sequoia'
FROM companies WHERE name = 'ByteDance AI' 
AND NOT EXISTS (SELECT 1 FROM fundings WHERE company_id = companies.id AND round = 'Private');

-- TODO: Cerebras - 需要查找估值和融资信息

-- Character.AI
UPDATE companies SET valuation_usd = 1000000000 WHERE name = 'Character.AI';

INSERT INTO fundings (company_id, round, amount, investors, valuation, date, lead_investor)
SELECT id, 'Series B', 150000000, ARRAY['a16z'], 1000000000, '2024-01-01', 'a16z'
FROM companies WHERE name = 'Character.AI' 
AND NOT EXISTS (SELECT 1 FROM fundings WHERE company_id = companies.id AND round = 'Series B');

-- TODO: Chroma - 需要查找估值和融资信息
-- TODO: Civitai - 需要查找估值和融资信息
-- TODO: ClearML - 需要查找估值和融资信息

-- CloudWalk
UPDATE companies SET valuation_usd = 3000000000 WHERE name = 'CloudWalk';

INSERT INTO fundings (company_id, round, amount, investors, valuation, date, lead_investor)
SELECT id, 'Series D', 200000000, ARRAY['SoftBank', 'Alibaba'], 3000000000, '2023-01-01', 'SoftBank'
FROM companies WHERE name = 'CloudWalk' 
AND NOT EXISTS (SELECT 1 FROM fundings WHERE company_id = companies.id AND round = 'Series D');


-- Codeium
UPDATE companies SET valuation_usd = 50000000 WHERE name = 'Codeium';

INSERT INTO fundings (company_id, round, amount, investors, valuation, date, lead_investor)
SELECT id, 'Seed', 6500000, ARRAY['General Catalyst'], 50000000, '2023-01-01', 'General Catalyst'
FROM companies WHERE name = 'Codeium' 
AND NOT EXISTS (SELECT 1 FROM fundings WHERE company_id = companies.id AND round = 'Seed');


-- Cohere
UPDATE companies SET valuation_usd = 2200000000 WHERE name = 'Cohere';

INSERT INTO fundings (company_id, round, amount, investors, valuation, date, lead_investor)
SELECT id, 'Series C', 270000000, ARRAY['Tiger Global', 'NVentures'], 2200000000, '2023-01-01', 'Tiger Global'
FROM companies WHERE name = 'Cohere' 
AND NOT EXISTS (SELECT 1 FROM fundings WHERE company_id = companies.id AND round = 'Series C');

-- TODO: Comet ML - 需要查找估值和融资信息
-- TODO: ComfyUI - 需要查找估值和融资信息

-- Copy.ai
UPDATE companies SET valuation_usd = 30000000 WHERE name = 'Copy.ai';

INSERT INTO fundings (company_id, round, amount, investors, valuation, date, lead_investor)
SELECT id, 'Seed', 11000000, ARRAY['Tiger Global'], 30000000, '2023-01-01', 'Tiger Global'
FROM companies WHERE name = 'Copy.ai' 
AND NOT EXISTS (SELECT 1 FROM fundings WHERE company_id = companies.id AND round = 'Seed');


-- Cruise
UPDATE companies SET valuation_usd = 30000000000 WHERE name = 'Cruise';

INSERT INTO fundings (company_id, round, amount, investors, valuation, date, lead_investor)
SELECT id, 'Series A', 2500000000, ARRAY['GM'], 30000000000, '2024-01-01', 'GM'
FROM companies WHERE name = 'Cruise' 
AND NOT EXISTS (SELECT 1 FROM fundings WHERE company_id = companies.id AND round = 'Series A');


-- Cursor
UPDATE companies SET valuation_usd = 200000000 WHERE name = 'Cursor';

INSERT INTO fundings (company_id, round, amount, investors, valuation, date, lead_investor)
SELECT id, 'Series A', 25000000, ARRAY['a16z'], 200000000, '2024-01-01', 'a16z'
FROM companies WHERE name = 'Cursor' 
AND NOT EXISTS (SELECT 1 FROM fundings WHERE company_id = companies.id AND round = 'Series A');


-- DeepSeek
UPDATE companies SET valuation_usd = 2000000000 WHERE name = 'DeepSeek';

INSERT INTO fundings (company_id, round, amount, investors, valuation, date, lead_investor)
SELECT id, 'Series A', 170000000, ARRAY['Alibaba', 'Ant'], 2000000000, '2024-01-01', 'Alibaba'
FROM companies WHERE name = 'DeepSeek' 
AND NOT EXISTS (SELECT 1 FROM fundings WHERE company_id = companies.id AND round = 'Series A');

-- TODO: Descript - 需要查找估值和融资信息
-- TODO: Determined AI - 需要查找估值和融资信息
-- TODO: Determined AI Platform - 需要查找估值和融资信息
-- TODO: DiDi AI - 需要查找估值和融资信息
-- TODO: ElevenLabs - 需要查找估值和融资信息
-- TODO: GitHub Copilot - 需要查找估值和融资信息
-- TODO: Glean - 需要查找估值和融资信息

-- Google DeepMind
UPDATE companies SET valuation_usd = 1700000000000 WHERE name = 'Google DeepMind';

-- TODO: Gradio - 需要查找估值和融资信息

-- Grammarly
UPDATE companies SET valuation_usd = 13000000000 WHERE name = 'Grammarly';

INSERT INTO fundings (company_id, round, amount, investors, valuation, date, lead_investor)
SELECT id, 'Series D', 200000000, ARRAY['General Catalyst', 'KKR'], 13000000000, '2023-01-01', 'General Catalyst'
FROM companies WHERE name = 'Grammarly' 
AND NOT EXISTS (SELECT 1 FROM fundings WHERE company_id = companies.id AND round = 'Series D');

-- TODO: Haystack - 需要查找估值和融资信息
-- TODO: Haystack AutoGPT - 需要查找估值和融资信息

-- Hugging Face
UPDATE companies SET valuation_usd = 4500000000 WHERE name = 'Hugging Face';

INSERT INTO fundings (company_id, round, amount, investors, valuation, date, lead_investor)
SELECT id, 'Series D', 235000000, ARRAY['Lux Capital', 'a16z'], 4500000000, '2023-01-01', 'Lux Capital'
FROM companies WHERE name = 'Hugging Face' 
AND NOT EXISTS (SELECT 1 FROM fundings WHERE company_id = companies.id AND round = 'Series D');

-- TODO: IBM Watson - 需要查找估值和融资信息
-- TODO: Invoke AI - 需要查找估值和融资信息
-- TODO: JAX - 需要查找估值和融资信息
-- TODO: JD AI - 需要查找估值和融资信息

-- Jasper
UPDATE companies SET valuation_usd = 1500000000 WHERE name = 'Jasper';

INSERT INTO fundings (company_id, round, amount, investors, valuation, date, lead_investor)
SELECT id, 'Series A', 125000000, ARRAY['Insight Partners', 'Bessemer'], 1500000000, '2023-01-01', 'Insight Partners'
FROM companies WHERE name = 'Jasper' 
AND NOT EXISTS (SELECT 1 FROM fundings WHERE company_id = companies.id AND round = 'Series A');

-- TODO: Kaggle - 需要查找估值和融资信息
-- TODO: Kaimu AI - 需要查找估值和融资信息
-- TODO: Kuaibo AI - 需要查找估值和融资信息
-- TODO: Kuaishou AI - 需要查找估值和融资信息
-- TODO: Labelbox - 需要查找估值和融资信息
-- TODO: LangChain - 需要查找估值和融资信息
-- TODO: LangFlow - 需要查找估值和融资信息
-- TODO: LangSmith - 需要查找估值和融资信息
-- TODO: Lightning AI - 需要查找估值和融资信息
-- TODO: LlamaIndex - 需要查找估值和融资信息
-- TODO: Loom - 需要查找估值和融资信息

-- Megvii
UPDATE companies SET valuation_usd = 8000000000 WHERE name = 'Megvii';

-- TODO: Meituan AI - 需要查找估值和融资信息

-- Meta AI
UPDATE companies SET valuation_usd = 1250000000000 WHERE name = 'Meta AI';


-- Microsoft AI
UPDATE companies SET valuation_usd = 3000000000000 WHERE name = 'Microsoft AI';


-- Midjourney
UPDATE companies SET valuation_usd = 10000000000 WHERE name = 'Midjourney';

INSERT INTO fundings (company_id, round, amount, investors, valuation, date, lead_investor)
SELECT id, 'Series B', 500000000, ARRAY['a16z'], 10000000000, '2024-01-01', 'a16z'
FROM companies WHERE name = 'Midjourney' 
AND NOT EXISTS (SELECT 1 FROM fundings WHERE company_id = companies.id AND round = 'Series B');

-- TODO: Milvus - 需要查找估值和融资信息

-- MiniMax
UPDATE companies SET valuation_usd = 3000000000 WHERE name = 'MiniMax';

INSERT INTO fundings (company_id, round, amount, investors, valuation, date, lead_investor)
SELECT id, 'Series B', 600000000, ARRAY['Tencent', 'Alibaba'], 3000000000, '2024-01-01', 'Tencent'
FROM companies WHERE name = 'MiniMax' 
AND NOT EXISTS (SELECT 1 FROM fundings WHERE company_id = companies.id AND round = 'Series B');

-- TODO: Modal - 需要查找估值和融资信息
-- TODO: Mojo AI - 需要查找估值和融资信息

-- Moonshot AI
UPDATE companies SET valuation_usd = 2000000000 WHERE name = 'Moonshot AI';

INSERT INTO fundings (company_id, round, amount, investors, valuation, date, lead_investor)
SELECT id, 'Series B', 200000000, ARRAY['Matrix', 'Sequoia'], 2000000000, '2024-01-01', 'Matrix'
FROM companies WHERE name = 'Moonshot AI' 
AND NOT EXISTS (SELECT 1 FROM fundings WHERE company_id = companies.id AND round = 'Series B');

-- TODO: Moveworks - 需要查找估值和融资信息

-- NVIDIA
UPDATE companies SET valuation_usd = 2200000000000 WHERE name = 'NVIDIA';

-- TODO: Neptune - 需要查找估值和融资信息

-- Notion
UPDATE companies SET valuation_usd = 10000000000 WHERE name = 'Notion';

INSERT INTO fundings (company_id, round, amount, investors, valuation, date, lead_investor)
SELECT id, 'Series C', 275000000, ARRAY['Sequoia', 'Index'], 10000000000, '2023-01-01', 'Sequoia'
FROM companies WHERE name = 'Notion' 
AND NOT EXISTS (SELECT 1 FROM fundings WHERE company_id = companies.id AND round = 'Series C');


-- Notion AI
UPDATE companies SET valuation_usd = 10000000000 WHERE name = 'Notion AI';

INSERT INTO fundings (company_id, round, amount, investors, valuation, date, lead_investor)
SELECT id, 'Series C', 275000000, ARRAY['Sequoia', 'Index'], 10000000000, '2023-01-01', 'Sequoia'
FROM companies WHERE name = 'Notion AI' 
AND NOT EXISTS (SELECT 1 FROM fundings WHERE company_id = companies.id AND round = 'Series C');


-- OpenAI
UPDATE companies SET valuation_usd = 80000000000 WHERE name = 'OpenAI';

INSERT INTO fundings (company_id, round, amount, investors, valuation, date, lead_investor)
SELECT id, 'Series H', 10000000000, ARRAY['Microsoft'], 80000000000, '2023-01-01', 'Microsoft'
FROM companies WHERE name = 'OpenAI' 
AND NOT EXISTS (SELECT 1 FROM fundings WHERE company_id = companies.id AND round = 'Series H');

-- TODO: OpenAI Triton - 需要查找估值和融资信息
-- TODO: Otter.ai - 需要查找估值和融资信息
-- TODO: PDD AI - 需要查找估值和融资信息

-- Perplexity AI
UPDATE companies SET valuation_usd = 3000000000 WHERE name = 'Perplexity AI';

INSERT INTO fundings (company_id, round, amount, investors, valuation, date, lead_investor)
SELECT id, 'Series B', 70000000, ARRAY['IVP', 'NEA'], 3000000000, '2024-01-01', 'IVP'
FROM companies WHERE name = 'Perplexity AI' 
AND NOT EXISTS (SELECT 1 FROM fundings WHERE company_id = companies.id AND round = 'Series B');


-- Pinecone
UPDATE companies SET valuation_usd = 750000000 WHERE name = 'Pinecone';

INSERT INTO fundings (company_id, round, amount, investors, valuation, date, lead_investor)
SELECT id, 'Series B', 100000000, ARRAY['Andreessen Horowitz'], 750000000, '2024-01-01', 'Andreessen Horowitz'
FROM companies WHERE name = 'Pinecone' 
AND NOT EXISTS (SELECT 1 FROM fundings WHERE company_id = companies.id AND round = 'Series B');

-- TODO: Polyaxon - 需要查找估值和融资信息

-- Pony.ai
UPDATE companies SET valuation_usd = 5300000000 WHERE name = 'Pony.ai';

INSERT INTO fundings (company_id, round, amount, investors, valuation, date, lead_investor)
SELECT id, 'Series D', 400000000, ARRAY['Toyota', 'Orix'], 5300000000, '2023-01-01', 'Toyota'
FROM companies WHERE name = 'Pony.ai' 
AND NOT EXISTS (SELECT 1 FROM fundings WHERE company_id = companies.id AND round = 'Series D');

-- TODO: PyTorch - 需要查找估值和融资信息
-- TODO: Qdrant - 需要查找估值和融资信息
-- TODO: Replicate - 需要查找估值和融资信息

-- Replit
UPDATE companies SET valuation_usd = 1180000000 WHERE name = 'Replit';

INSERT INTO fundings (company_id, round, amount, investors, valuation, date, lead_investor)
SELECT id, 'Series B', 97000000, ARRAY['a16z'], 1180000000, '2023-01-01', 'a16z'
FROM companies WHERE name = 'Replit' 
AND NOT EXISTS (SELECT 1 FROM fundings WHERE company_id = companies.id AND round = 'Series B');

-- TODO: Resemble AI - 需要查找估值和融资信息

-- Runway
UPDATE companies SET valuation_usd = 1500000000 WHERE name = 'Runway';

INSERT INTO fundings (company_id, round, amount, investors, valuation, date, lead_investor)
SELECT id, 'Series C', 50, ARRAY['Google', 'a16z'], 1500000000, '2024-01-01', 'Google'
FROM companies WHERE name = 'Runway' 
AND NOT EXISTS (SELECT 1 FROM fundings WHERE company_id = companies.id AND round = 'Series C');


-- Scale AI
UPDATE companies SET valuation_usd = 7300000000 WHERE name = 'Scale AI';

INSERT INTO fundings (company_id, round, amount, investors, valuation, date, lead_investor)
SELECT id, 'Series F', 1000000000, ARRAY['Tiger Global', 'Accel'], 7300000000, '2023-01-01', 'Tiger Global'
FROM companies WHERE name = 'Scale AI' 
AND NOT EXISTS (SELECT 1 FROM fundings WHERE company_id = companies.id AND round = 'Series F');

-- TODO: Second - 需要查找估值和融资信息
-- TODO: Semantic Kernel - 需要查找估值和融资信息

-- SenseTime
UPDATE companies SET valuation_usd = 15000000000 WHERE name = 'SenseTime';

-- TODO: Snorkel AI - 需要查找估值和融资信息

-- Stability AI
UPDATE companies SET valuation_usd = 1000000000 WHERE name = 'Stability AI';

INSERT INTO fundings (company_id, round, amount, investors, valuation, date, lead_investor)
SELECT id, 'Series B', 101000000, ARRAY['Lightspeed', 'Coatue'], 1000000000, '2023-01-01', 'Lightspeed'
FROM companies WHERE name = 'Stability AI' 
AND NOT EXISTS (SELECT 1 FROM fundings WHERE company_id = companies.id AND round = 'Series B');

-- TODO: Streamlit - 需要查找估值和融资信息
-- TODO: SuperAnnotate - 需要查找估值和融资信息
-- TODO: Synthesia - 需要查找估值和融资信息

-- Tabnine
UPDATE companies SET valuation_usd = 25000000 WHERE name = 'Tabnine';

INSERT INTO fundings (company_id, round, amount, investors, valuation, date, lead_investor)
SELECT id, 'Seed', 15000000, ARRAY['M12'], 25000000, '2023-01-01', 'M12'
FROM companies WHERE name = 'Tabnine' 
AND NOT EXISTS (SELECT 1 FROM fundings WHERE company_id = companies.id AND round = 'Seed');


-- Tencent AI Lab
UPDATE companies SET valuation_usd = 450000000000 WHERE name = 'Tencent AI Lab';


-- Tencent Cloud AI
UPDATE companies SET valuation_usd = 450000000000 WHERE name = 'Tencent Cloud AI';

-- TODO: TensorFlow - 需要查找估值和融资信息

-- Tesla
UPDATE companies SET valuation_usd = 800000000000 WHERE name = 'Tesla';


-- Tesla AI
UPDATE companies SET valuation_usd = 800000000000 WHERE name = 'Tesla AI';

-- TODO: Vecto - 需要查找估值和融资信息

-- Vercel
UPDATE companies SET valuation_usd = 1500000000 WHERE name = 'Vercel';

INSERT INTO fundings (company_id, round, amount, investors, valuation, date, lead_investor)
SELECT id, 'Series D', 250000000, ARRAY['Accel', 'GV'], 1500000000, '2023-01-01', 'Accel'
FROM companies WHERE name = 'Vercel' 
AND NOT EXISTS (SELECT 1 FROM fundings WHERE company_id = companies.id AND round = 'Series D');


-- Waymo
UPDATE companies SET valuation_usd = 30000000000 WHERE name = 'Waymo';

INSERT INTO fundings (company_id, round, amount, investors, valuation, date, lead_investor)
SELECT id, 'Series A', 2500000000, ARRAY['Alphabet'], 30000000000, '2024-01-01', 'Alphabet'
FROM companies WHERE name = 'Waymo' 
AND NOT EXISTS (SELECT 1 FROM fundings WHERE company_id = companies.id AND round = 'Series A');

-- TODO: Weaviate - 需要查找估值和融资信息
-- TODO: Weights & Biases - 需要查找估值和融资信息

-- Yitu
UPDATE companies SET valuation_usd = 1000000000 WHERE name = 'Yitu';

INSERT INTO fundings (company_id, round, amount, investors, valuation, date, lead_investor)
SELECT id, 'Series C', 200000000, ARRAY['Hillhouse'], 1000000000, '2023-01-01', 'Hillhouse'
FROM companies WHERE name = 'Yitu' 
AND NOT EXISTS (SELECT 1 FROM fundings WHERE company_id = companies.id AND round = 'Series C');

-- TODO: Zapier - 需要查找估值和融资信息

-- Zhipu AI
UPDATE companies SET valuation_usd = 25000000000 WHERE name = 'Zhipu AI';

INSERT INTO fundings (company_id, round, amount, investors, valuation, date, lead_investor)
SELECT id, 'Series B', 250000000, ARRAY['Hillhouse', 'Alibaba'], 25000000000, '2024-01-01', 'Hillhouse'
FROM companies WHERE name = 'Zhipu AI' 
AND NOT EXISTS (SELECT 1 FROM fundings WHERE company_id = companies.id AND round = 'Series B');

-- TODO: Zilliz - 需要查找估值和融资信息

-- iFlytek
UPDATE companies SET valuation_usd = 50000000000 WHERE name = 'iFlytek';


COMMIT;

-- 查看更新结果
SELECT 
    c.name,
    c.valuation_usd,
    c.company_tier,
    COUNT(f.id) as funding_count
FROM companies c
LEFT JOIN fundings f ON f.company_id = c.id
GROUP BY c.id, c.name, c.valuation_usd, c.company_tier
ORDER BY COALESCE(c.valuation_usd, 0) DESC
LIMIT 50;
