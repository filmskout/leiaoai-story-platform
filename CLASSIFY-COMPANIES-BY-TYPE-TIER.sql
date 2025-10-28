-- COMPANY CLASSIFICATION AND PROJECT CATEGORIES
-- This script classifies all 116 companies into Types and Tiers
-- and adds project categories for each company

BEGIN;

-- Company Type and Tier Classifications

-- Tier 1 AI Giants (Tech Giants with massive AI investments)
UPDATE companies SET
  company_type = 'AI Giant',
  company_tier = 'Tier 1',
  focus_areas = ARRAY['Deep Learning', 'LLM', 'Computer Vision', 'NLP', 'Cloud AI']
WHERE name IN ('Adobe', 'OpenAI', 'Google DeepMind', 'Microsoft AI', 'Meta AI', 'Amazon AI', 'Tesla AI', 'NVIDIA', 'IBM Watson', 'Apple AI');

-- Tier 2 AI Giants (Major AI companies with significant resources)
UPDATE companies SET
  company_type = 'AI Giant',
  company_tier = 'Tier 2',
  focus_areas = ARRAY['LLM', 'Computer Vision', 'NLP', 'Enterprise AI']
WHERE name IN ('Vercel', 'Anthropic', 'Stability AI', 'Hugging Face', 'Midjourney', 'Runway', 'Perplexity AI');

-- Independent AI Companies (Specialized AI startups)
UPDATE companies SET
  company_type = 'Independent AI',
  company_tier = 'Independent',
  focus_areas = ARRAY['LLM', 'AI Tools', 'Developer Tools']
WHERE name IN ('Character.AI', 'Jasper', 'Copy.ai', 'Notion AI', 'Cursor', 'GitHub Copilot', 'Replit', 'Codeium', 'Tabnine');

-- China's Big Tech AI (Chinese tech giants)
UPDATE companies SET
  company_type = 'AI Giant',
  company_tier = 'Tier 1',
  focus_areas = ARRAY['LLM', 'Computer Vision', 'Recommendation Systems', 'Enterprise AI']
WHERE name IN ('Baidu AI', 'Alibaba Cloud AI', 'Tencent Cloud AI', 'ByteDance AI');

-- China's AI Unicorns (Major Chinese AI companies)
UPDATE companies SET
  company_type = 'AI Company',
  company_tier = 'Tier 2',
  focus_areas = ARRAY['Computer Vision', 'NLP', 'LLM', 'Enterprise AI']
WHERE name IN ('iFlytek', 'SenseTime', 'Megvii', 'CloudWalk', 'Yitu Technology');

-- LLM and Language Model Companies
UPDATE companies SET
  company_type = 'Independent AI',
  company_tier = 'Independent',
  focus_areas = ARRAY['LLM', 'NLP', 'Language Models']
WHERE name IN ('DeepSeek', 'MiniMax', 'Zhipu AI', 'Moonshot AI', '01.AI', 'Kaimu AI', 'Cohere', 'Aleph Alpha', 'ElevenLabs', 'Resemble AI', 'Descript');

-- AI Development Tools and Frameworks
UPDATE companies SET
  company_type = 'Independent AI',
  company_tier = 'Independent',
  focus_areas = ARRAY['AI Development Tools', 'ML Frameworks', 'Developer Tools']
WHERE name IN ('TensorFlow', 'PyTorch', 'JAX', 'OpenAI Triton', 'Lightning AI', 'LangChain', 'LangFlow', 'LangSmith', 'LlamaIndex', 'Haystack', 'Semantic Kernel', 'Semantic Kernel');

-- Vector Databases and AI Infrastructure
UPDATE companies SET
  company_type = 'AI Company',
  company_tier = 'Emerging',
  focus_areas = ARRAY['Vector Databases', 'AI Infrastructure', 'Data Management']
WHERE name IN ('Pinecone', 'Weaviate', 'Milvus', 'Qdrant', 'Chroma', 'Vecto', 'Zilliz');

-- MLOps and Model Management
UPDATE companies SET
  company_type = 'AI Company',
  company_tier = 'Emerging',
  focus_areas = ARRAY['MLOps', 'Model Management', 'Experiment Tracking']
WHERE name IN ('Weights & Biases', 'Comet ML', 'Neptune', 'ClearML', 'Polyaxon', 'Determined AI', 'Determined AI Platform');

-- AI Model Deployment Platforms
UPDATE companies SET
  company_type = 'AI Company',
  company_tier = 'Emerging',
  focus_areas = ARRAY['Model Deployment', 'AI Infrastructure', 'Cloud Computing']
WHERE name IN ('Gradio', 'Streamlit', 'Kaggle', 'Replicate', 'Brev.dev', 'Modal', 'Banana');

-- AI Image Generation Tools
UPDATE companies SET
  company_type = 'AI Company',
  company_tier = 'Independent',
  focus_areas = ARRAY['Image Generation', 'AI Art', 'Creative AI']
WHERE name IN ('ComfyUI', 'Invoke AI', 'Civitai');

-- AI Data Annotation Platforms
UPDATE companies SET
  company_type = 'AI Company',
  company_tier = 'Emerging',
  focus_areas = ARRAY['Data Annotation', 'AI Training Data', 'ML Data']
WHERE name IN ('SuperAnnotate', 'Labelbox', 'Scale AI', 'Snorkel AI');

-- Self-Driving and Autonomous Vehicles
UPDATE companies SET
  company_type = 'AI Company',
  company_tier = 'Tier 2',
  focus_areas = ARRAY['Autonomous Vehicles', 'Self-Driving', 'Computer Vision']
WHERE name IN ('Cruise', 'Waymo', 'Argo AI', 'Pony.ai', 'Aurora', 'Tesla');

-- AI Hardware and Accelerators
UPDATE companies SET
  company_type = 'AI Company',
  company_tier = 'Tier 2',
  focus_areas = ARRAY['AI Hardware', 'AI Chips', 'Accelerators']
WHERE name IN ('Cerebras');

-- China E-commerce and Platform AI
UPDATE companies SET
  company_type = 'AI Giant',
  company_tier = 'Tier 2',
  focus_areas = ARRAY['Recommendation Systems', 'E-commerce AI', 'Platform AI']
WHERE name IN ('Kuaishou AI', 'Meituan AI', 'DiDi AI', 'JD AI', 'PDD AI', 'Kuaibo AI');

-- AI Automation and Agents
UPDATE companies SET
  company_type = 'Independent AI',
  company_tier = 'Emerging',
  focus_areas = ARRAY['AI Automation', 'AI Agents', 'Task Automation']
WHERE name IN ('AutoGPT', 'AgentGPT', 'Adept AI', 'Haystack AutoGPT');

-- Application-Specific AI Tools
UPDATE companies SET
  company_type = 'AI Company',
  company_tier = 'Independent',
  focus_areas = ARRAY['Productivity AI', 'Business AI', 'Enterprise AI']
WHERE name IN ('Glean', 'Moveworks', 'Second', 'Grammarly', 'Otter.ai', 'Loom', 'Notion', 'Zapier', 'Beautiful.ai', 'Synthesia');

-- Research Labs
UPDATE companies SET
  company_type = 'AI Company',
  company_tier = 'Tier 2',
  focus_areas = ARRAY['AI Research', 'Fundamental Research', 'Academic AI']
WHERE name IN ('Tencent AI Lab');

COMMIT;
