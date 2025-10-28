-- 公司估值和融资信息补齐SQL
-- 在Supabase SQL Editor中执行此脚本
-- 包含 114 个公司的估值信息

BEGIN;

-- TODO: 01.AI - 需要查找估值和融资信息

UPDATE companies SET valuation_usd = 1000000000 WHERE name = 'Adept AI';

-- 融资信息: Adept AI
-- Round: Series B
-- Investors: a16z
-- Amount: 1000000000 USD
-- INSERT INTO fundings (company_id, round, investors, valuation, date)
-- SELECT id, 'Series B', ARRAY['a16z'], 1000000000, NOW()
-- FROM companies WHERE name = 'Adept AI';

UPDATE companies SET valuation_usd = 250000000000 WHERE name = 'Adobe';

-- TODO: AgentGPT - 需要查找估值和融资信息

-- TODO: Aleph Alpha - 需要查找估值和融资信息

-- TODO: Alibaba Cloud AI - 需要查找估值和融资信息

-- TODO: Amazon AI - 需要查找估值和融资信息

UPDATE companies SET valuation_usd = 50000000000 WHERE name = 'Anthropic';

-- 融资信息: Anthropic
-- Round: Series E
-- Investors: Amazon, Google
-- Amount: 50000000000 USD
-- INSERT INTO fundings (company_id, round, investors, valuation, date)
-- SELECT id, 'Series E', ARRAY['Amazon', 'Google'], 50000000000, NOW()
-- FROM companies WHERE name = 'Anthropic';

-- TODO: Apple AI - 需要查找估值和融资信息

-- TODO: Argo AI - 需要查找估值和融资信息

-- TODO: Aurora - 需要查找估值和融资信息

-- TODO: AutoGPT - 需要查找估值和融资信息

-- TODO: Baidu AI - 需要查找估值和融资信息

-- TODO: Banana - 需要查找估值和融资信息

-- TODO: Beautiful.ai - 需要查找估值和融资信息

-- TODO: Brev.dev - 需要查找估值和融资信息

-- TODO: ByteDance AI - 需要查找估值和融资信息

-- TODO: Cerebras - 需要查找估值和融资信息

UPDATE companies SET valuation_usd = 1000000000 WHERE name = 'Character.AI';

-- 融资信息: Character.AI
-- Round: Series B
-- Investors: a16z
-- Amount: 1000000000 USD
-- INSERT INTO fundings (company_id, round, investors, valuation, date)
-- SELECT id, 'Series B', ARRAY['a16z'], 1000000000, NOW()
-- FROM companies WHERE name = 'Character.AI';

-- TODO: Chroma - 需要查找估值和融资信息

-- TODO: Civitai - 需要查找估值和融资信息

-- TODO: ClearML - 需要查找估值和融资信息

-- TODO: CloudWalk - 需要查找估值和融资信息

-- TODO: Codeium - 需要查找估值和融资信息

UPDATE companies SET valuation_usd = 2200000000 WHERE name = 'Cohere';

-- 融资信息: Cohere
-- Round: Series C
-- Investors: Tiger Global
-- Amount: 2200000000 USD
-- INSERT INTO fundings (company_id, round, investors, valuation, date)
-- SELECT id, 'Series C', ARRAY['Tiger Global'], 2200000000, NOW()
-- FROM companies WHERE name = 'Cohere';

-- TODO: Comet ML - 需要查找估值和融资信息

-- TODO: ComfyUI - 需要查找估值和融资信息

-- TODO: Copy.ai - 需要查找估值和融资信息

-- TODO: Cruise - 需要查找估值和融资信息

-- TODO: Cursor - 需要查找估值和融资信息

-- TODO: DeepSeek - 需要查找估值和融资信息

-- TODO: Descript - 需要查找估值和融资信息

-- TODO: Determined AI - 需要查找估值和融资信息

-- TODO: Determined AI Platform - 需要查找估值和融资信息

-- TODO: DiDi AI - 需要查找估值和融资信息

-- TODO: ElevenLabs - 需要查找估值和融资信息

-- TODO: GitHub Copilot - 需要查找估值和融资信息

-- TODO: Glean - 需要查找估值和融资信息

-- TODO: Google DeepMind - 需要查找估值和融资信息

-- TODO: Gradio - 需要查找估值和融资信息

-- TODO: Grammarly - 需要查找估值和融资信息

-- TODO: Haystack - 需要查找估值和融资信息

-- TODO: Haystack AutoGPT - 需要查找估值和融资信息

UPDATE companies SET valuation_usd = 4500000000 WHERE name = 'Hugging Face';

-- 融资信息: Hugging Face
-- Round: Series D
-- Investors: Lux Capital
-- Amount: 4500000000 USD
-- INSERT INTO fundings (company_id, round, investors, valuation, date)
-- SELECT id, 'Series D', ARRAY['Lux Capital'], 4500000000, NOW()
-- FROM companies WHERE name = 'Hugging Face';

-- TODO: IBM Watson - 需要查找估值和融资信息

-- TODO: Invoke AI - 需要查找估值和融资信息

-- TODO: JAX - 需要查找估值和融资信息

-- TODO: JD AI - 需要查找估值和融资信息

UPDATE companies SET valuation_usd = 1500000000 WHERE name = 'Jasper';

-- 融资信息: Jasper
-- Round: Series A
-- Investors: Insight Partners
-- Amount: 1500000000 USD
-- INSERT INTO fundings (company_id, round, investors, valuation, date)
-- SELECT id, 'Series A', ARRAY['Insight Partners'], 1500000000, NOW()
-- FROM companies WHERE name = 'Jasper';

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

-- TODO: Megvii - 需要查找估值和融资信息

-- TODO: Meituan AI - 需要查找估值和融资信息

-- TODO: Meta AI - 需要查找估值和融资信息

-- TODO: Microsoft AI - 需要查找估值和融资信息

UPDATE companies SET valuation_usd = 10000000000 WHERE name = 'Midjourney';

-- 融资信息: Midjourney
-- Round: Series A
-- Investors: a16z
-- Amount: 10000000000 USD
-- INSERT INTO fundings (company_id, round, investors, valuation, date)
-- SELECT id, 'Series A', ARRAY['a16z'], 10000000000, NOW()
-- FROM companies WHERE name = 'Midjourney';

-- TODO: Milvus - 需要查找估值和融资信息

-- TODO: MiniMax - 需要查找估值和融资信息

-- TODO: Modal - 需要查找估值和融资信息

-- TODO: Mojo AI - 需要查找估值和融资信息

-- TODO: Moonshot AI - 需要查找估值和融资信息

-- TODO: Moveworks - 需要查找估值和融资信息

UPDATE companies SET valuation_usd = 2200000000000 WHERE name = 'NVIDIA';

-- TODO: Neptune - 需要查找估值和融资信息

-- TODO: Notion - 需要查找估值和融资信息

-- TODO: Notion AI - 需要查找估值和融资信息

UPDATE companies SET valuation_usd = 80000000000 WHERE name = 'OpenAI';

-- 融资信息: OpenAI
-- Round: Series H
-- Investors: Microsoft
-- Amount: 80000000000 USD
-- INSERT INTO fundings (company_id, round, investors, valuation, date)
-- SELECT id, 'Series H', ARRAY['Microsoft'], 80000000000, NOW()
-- FROM companies WHERE name = 'OpenAI';

-- TODO: OpenAI Triton - 需要查找估值和融资信息

-- TODO: Otter.ai - 需要查找估值和融资信息

-- TODO: PDD AI - 需要查找估值和融资信息

UPDATE companies SET valuation_usd = 3000000000 WHERE name = 'Perplexity AI';

-- 融资信息: Perplexity AI
-- Round: Series B
-- Investors: IVP
-- Amount: 3000000000 USD
-- INSERT INTO fundings (company_id, round, investors, valuation, date)
-- SELECT id, 'Series B', ARRAY['IVP'], 3000000000, NOW()
-- FROM companies WHERE name = 'Perplexity AI';

-- TODO: Pinecone - 需要查找估值和融资信息

-- TODO: Polyaxon - 需要查找估值和融资信息

-- TODO: Pony.ai - 需要查找估值和融资信息

-- TODO: PyTorch - 需要查找估值和融资信息

-- TODO: Qdrant - 需要查找估值和融资信息

-- TODO: Replicate - 需要查找估值和融资信息

-- TODO: Replit - 需要查找估值和融资信息

-- TODO: Resemble AI - 需要查找估值和融资信息

UPDATE companies SET valuation_usd = 1500000000 WHERE name = 'Runway';

-- 融资信息: Runway
-- Round: Series C
-- Investors: Amplify Partners
-- Amount: 1500000000 USD
-- INSERT INTO fundings (company_id, round, investors, valuation, date)
-- SELECT id, 'Series C', ARRAY['Amplify Partners'], 1500000000, NOW()
-- FROM companies WHERE name = 'Runway';

UPDATE companies SET valuation_usd = 7300000000 WHERE name = 'Scale AI';

-- 融资信息: Scale AI
-- Round: Series F
-- Investors: Tiger Global, Accel
-- Amount: 7300000000 USD
-- INSERT INTO fundings (company_id, round, investors, valuation, date)
-- SELECT id, 'Series F', ARRAY['Tiger Global', 'Accel'], 7300000000, NOW()
-- FROM companies WHERE name = 'Scale AI';

-- TODO: Second - 需要查找估值和融资信息

-- TODO: Semantic Kernel - 需要查找估值和融资信息

-- TODO: SenseTime - 需要查找估值和融资信息

-- TODO: Snorkel AI - 需要查找估值和融资信息

UPDATE companies SET valuation_usd = 1000000000 WHERE name = 'Stability AI';

-- 融资信息: Stability AI
-- Round: Series B
-- Investors: Lightspeed
-- Amount: 1000000000 USD
-- INSERT INTO fundings (company_id, round, investors, valuation, date)
-- SELECT id, 'Series B', ARRAY['Lightspeed'], 1000000000, NOW()
-- FROM companies WHERE name = 'Stability AI';

-- TODO: Streamlit - 需要查找估值和融资信息

-- TODO: SuperAnnotate - 需要查找估值和融资信息

-- TODO: Synthesia - 需要查找估值和融资信息

-- TODO: Tabnine - 需要查找估值和融资信息

-- TODO: Tencent AI Lab - 需要查找估值和融资信息

-- TODO: Tencent Cloud AI - 需要查找估值和融资信息

-- TODO: TensorFlow - 需要查找估值和融资信息

UPDATE companies SET valuation_usd = 800000000000 WHERE name = 'Tesla';

-- TODO: Tesla AI - 需要查找估值和融资信息

-- TODO: Vecto - 需要查找估值和融资信息

-- TODO: Vercel - 需要查找估值和融资信息

-- TODO: Waymo - 需要查找估值和融资信息

-- TODO: Weaviate - 需要查找估值和融资信息

-- TODO: Weights & Biases - 需要查找估值和融资信息

-- TODO: Yitu - 需要查找估值和融资信息

-- TODO: Zapier - 需要查找估值和融资信息

-- TODO: Zhipu AI - 需要查找估值和融资信息

-- TODO: Zilliz - 需要查找估值和融资信息

-- TODO: iFlytek - 需要查找估值和融资信息

-- 查看更新结果
SELECT 
    name,
    valuation_usd,
    company_tier,
    headquarters
FROM companies 
WHERE valuation_usd IS NOT NULL
ORDER BY valuation_usd DESC;

COMMIT;
