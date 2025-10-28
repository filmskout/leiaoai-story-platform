-- PROJECT CATEGORIES FOR ALL COMPANIES
-- This script adds project categories based on company types

BEGIN;

-- Update projects table with categories based on project names and descriptions
-- This will be extended with more specific categorizations

-- LLM & Language Models category
UPDATE projects SET
  project_category = 'LLM & Language Models',
  project_subcategory = 'Large Language Model',
  target_audience = ARRAY['Developers', 'Researchers', 'Business Users'],
  pricing_model = 'API-based',
  use_cases = ARRAY['Text Generation', 'Question Answering', 'Code Generation', 'Translation']
WHERE name IN ('ChatGPT', 'Claude', 'GPT-4', 'Gemini', 'Llama', 'Qwen', 'Baichuan', 'ChatGLM', 'Yi', 'abab', 'DeepSeek Chat', 'MiniMax Chat', 'Character.AI', 'Perplexity AI')
  OR name LIKE '%GPT%' OR name LIKE '%Llama%' OR name LIKE '%Claude%' OR name LIKE '%Gemini%';

-- Image Processing & Generation category
UPDATE projects SET
  project_category = 'Image Processing & Generation',
  project_subcategory = 'AI Image Generation',
  target_audience = ARRAY['Artists', 'Designers', 'Creators'],
  pricing_model = 'Subscription',
  use_cases = ARRAY['Art Creation', 'Image Generation', 'Design Assets', 'Marketing Content']
WHERE name IN ('DALL-E', 'Midjourney', 'Stable Diffusion', 'Firefly', 'v0', 'Adobe Express', 'Runway', 'ComfyUI', 'Invoke AI')
  OR name LIKE '%DALL%' OR name LIKE '%Diffusion%';

-- Video Processing & Generation category
UPDATE projects SET
  project_category = 'Video Processing & Generation',
  project_subcategory = 'AI Video Generation',
  target_audience = ARRAY['Content Creators', 'Marketers', 'Filmmakers'],
  pricing_model = 'Subscription',
  use_cases = ARRAY['Video Creation', 'Video Editing', 'Content Production', 'Marketing Videos']
WHERE name IN ('Sora', 'Runway Gen-2', 'Synthesia', 'Pika', 'Descript', 'Loom', 'Otter.ai');

-- Professional Domain Analysis category
UPDATE projects SET
  project_category = 'Professional Domain Analysis',
  project_subcategory = 'Business AI',
  target_audience = ARRAY['Business Professionals', 'Analysts', 'Consultants'],
  pricing_model = 'Enterprise',
  use_cases = ARRAY['Business Analysis', 'Market Research', 'Data Analysis', 'Reporting']
WHERE name IN ('Jasper', 'Copy.ai', 'Notion AI', 'Beautiful.ai', 'Grammarly');

-- Virtual Companions category
UPDATE projects SET
  project_category = 'Virtual Companions',
  project_subcategory = 'AI Companions',
  target_audience = ARRAY['General Users', 'Gamers', 'Entertainment'],
  pricing_model = 'Freemium',
  use_cases = ARRAY['Conversation', 'Entertainment', 'Emotional Support', 'Gaming']
WHERE name IN ('Character.AI', 'Replika', 'Chai');

-- Virtual Employees & Assistants category
UPDATE projects SET
  project_category = 'Virtual Employees & Assistants',
  project_subcategory = 'AI Assistants',
  target_audience = ARRAY['Businesses', 'Teams', 'Professionals'],
  pricing_model = 'Enterprise',
  use_cases = ARRAY['Customer Support', 'IT Helpdesk', 'Task Automation', 'Knowledge Management']
WHERE name IN ('Alexa', 'Siri', 'Google Assistant', 'Copilot', 'Glean', 'Moveworks');

-- Voice & Audio AI category
UPDATE projects SET
  project_category = 'Voice & Audio AI',
  project_subcategory = 'AI Voice',
  target_audience = ARRAY['Content Creators', 'Developers', 'Entertainment'],
  pricing_model = 'API-based',
  use_cases = ARRAY['Voice Synthesis', 'Audio Editing', 'Podcast Production', 'Voice Cloning']
WHERE name IN ('ElevenLabs', 'Resemble AI', 'Descript', 'Runway Audio');

-- Search & Information Retrieval category
UPDATE projects SET
  project_category = 'Search & Information Retrieval',
  project_subcategory = 'AI Search',
  target_audience = ARRAY['Researchers', 'Knowledge Workers', 'General Users'],
  pricing_model = 'Freemium',
  use_cases = ARRAY['Information Search', 'Research', 'Knowledge Discovery', 'Data Retrieval']
WHERE name IN ('Perplexity AI', 'Glean', 'Bing Chat', 'You.com');

-- Code Generation & Development category
UPDATE projects SET
  project_category = 'Code Generation & Development',
  project_subcategory = 'AI Coding Tools',
  target_audience = ARRAY['Developers', 'Software Engineers'],
  pricing_model = 'Subscription',
  use_cases = ARRAY['Code Generation', 'Code Review', 'Debugging', 'Refactoring']
WHERE name IN ('GitHub Copilot', 'Cursor', 'Codeium', 'Tabnine', 'DeepSeek Coder', 'Claude Code', 'Codex', 'Replit');

-- Development Frameworks & Infrastructure category
UPDATE projects SET
  project_category = 'Development Frameworks & Infrastructure',
  project_subcategory = 'AI Development Tools',
  target_audience = ARRAY['Developers', 'ML Engineers'],
  pricing_model = 'Open Source / Enterprise',
  use_cases = ARRAY['Model Training', 'App Development', 'Deployment', 'Infrastructure']
WHERE name IN ('TensorFlow', 'PyTorch', 'JAX', 'LangChain', 'LlamaIndex', 'Haystack', 'Lightning AI', 'Triton', 'Semantic Kernel', 'LangFlow', 'LangSmith')
  OR name LIKE '%Lang%' OR name LIKE '%PyTorch%' OR name LIKE '%Tensor%';

-- Vector Databases & AI Infrastructure category
UPDATE projects SET
  project_category = 'Vector Databases & AI Infrastructure',
  project_subcategory = 'AI Infrastructure',
  target_audience = ARRAY['Developers', 'ML Engineers', 'Data Engineers'],
  pricing_model = 'Enterprise / Cloud',
  use_cases = ARRAY['Vector Search', 'Semantic Search', 'AI Data Storage', 'Embedding Storage']
WHERE name IN ('Pinecone', 'Weaviate', 'Milvus', 'Qdrant', 'Chroma', 'Vecto', 'Zilliz');

-- MLOps & Model Management category
UPDATE projects SET
  project_category = 'MLOps & Model Management',
  project_subcategory = 'MLOps Tools',
  target_audience = ARRAY['ML Engineers', 'Data Scientists', 'DevOps'],
  pricing_model = 'Enterprise',
  use_cases = ARRAY['Experiment Tracking', 'Model Versioning', 'Model Deployment', 'Model Monitoring']
WHERE name IN ('Weights & Biases', 'Comet ML', 'Neptune', 'ClearML', 'Polyaxon', 'Determined AI');

-- Model Deployment & Hosting category
UPDATE projects SET
  project_category = 'Model Deployment & Hosting',
  project_subcategory = 'AI Deployment',
  target_audience = ARRAY['Developers', 'ML Engineers'],
  pricing_model = 'Cloud-based',
  use_cases = ARRAY['Model Deployment', 'Model Hosting', 'API Creation', 'Model Sharing']
WHERE name IN ('Replicate', 'Gradio', 'Streamlit', 'Brev.dev', 'Modal', 'Banana', 'Hugging Face Inference');

-- AI Data & Annotation category
UPDATE projects SET
  project_category = 'AI Data & Annotation',
  project_subcategory = 'Data Annotation',
  target_audience = ARRAY['Data Scientists', 'ML Engineers', 'Annotators'],
  pricing_model = 'Enterprise',
  use_cases = ARRAY['Data Labeling', 'Data Quality', 'Training Data Creation', 'Data Management']
WHERE name IN ('SuperAnnotate', 'Labelbox', 'Scale AI', 'Snorkel AI');

-- Autonomous Vehicles category
UPDATE projects SET
  project_category = 'Autonomous Vehicles',
  project_subcategory = 'Self-Driving Technology',
  target_audience = ARRAY['Automotive Industry', 'Transportation', 'Research'],
  pricing_model = 'Enterprise',
  use_cases = ARRAY['Autonomous Driving', 'Vehicle Automation', 'Transportation', 'Logistics']
WHERE name IN ('Autopilot', 'FSD', 'Waymo Driver', 'Argo Driver', 'Pony.ai', 'Aurora Driver', 'Cruise');

COMMIT;
