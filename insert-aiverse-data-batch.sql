-- 批量插入AIverse数据到数据库
-- 在Supabase SQL Editor中执行

-- 1. 插入公司数据
INSERT INTO companies (name, description) VALUES 
('OpenAI', 'OpenAI是一家专注于Artificial Intelligence领域的AI公司，致力于通过先进的人工智能技术为用户提供创新的解决方案。'),
('Anthropic', 'Anthropic是一家专注于Artificial Intelligence领域的AI公司，致力于通过先进的人工智能技术为用户提供创新的解决方案。'),
('Google', 'Google是一家专注于Artificial Intelligence领域的AI公司，致力于通过先进的人工智能技术为用户提供创新的解决方案。'),
('Microsoft', 'Microsoft是一家专注于Artificial Intelligence领域的AI公司，致力于通过先进的人工智能技术为用户提供创新的解决方案。'),
('Meta', 'Meta是一家专注于Artificial Intelligence领域的AI公司，致力于通过先进的人工智能技术为用户提供创新的解决方案。'),
('Apple', 'Apple是一家专注于Artificial Intelligence领域的AI公司，致力于通过先进的人工智能技术为用户提供创新的解决方案。'),
('Amazon', 'Amazon是一家专注于Artificial Intelligence领域的AI公司，致力于通过先进的人工智能技术为用户提供创新的解决方案。'),
('Tesla', 'Tesla是一家专注于Artificial Intelligence领域的AI公司，致力于通过先进的人工智能技术为用户提供创新的解决方案。'),
('NVIDIA', 'NVIDIA是一家专注于Artificial Intelligence领域的AI公司，致力于通过先进的人工智能技术为用户提供创新的解决方案。'),
('IBM', 'IBM是一家专注于Artificial Intelligence领域的AI公司，致力于通过先进的人工智能技术为用户提供创新的解决方案。');

-- 2. 插入项目数据
WITH company_ids AS (
  SELECT name, id FROM companies WHERE name IN ('OpenAI', 'Anthropic', 'Google', 'Microsoft', 'Meta', 'Apple', 'Amazon', 'Tesla', 'NVIDIA', 'IBM')
)
INSERT INTO projects (company_id, name, description, category, website, pricing_model, target_users, key_features, use_cases)
SELECT 
  ci.id,
  CASE 
    WHEN ci.name = 'OpenAI' THEN 'ChatGPT'
    WHEN ci.name = 'Anthropic' THEN 'Claude'
    WHEN ci.name = 'Google' THEN 'Gemini'
    WHEN ci.name = 'Microsoft' THEN 'Copilot'
    WHEN ci.name = 'Meta' THEN 'Llama'
    WHEN ci.name = 'Apple' THEN 'Siri'
    WHEN ci.name = 'Amazon' THEN 'Alexa'
    WHEN ci.name = 'Tesla' THEN 'Autopilot'
    WHEN ci.name = 'NVIDIA' THEN 'CUDA'
    WHEN ci.name = 'IBM' THEN 'Watson'
  END,
  CASE 
    WHEN ci.name = 'OpenAI' THEN 'Leading AI assistant for wide range of tasks, file analysis, summarization, and advanced reasoning with GPT-4o capabilities'
    WHEN ci.name = 'Anthropic' THEN 'Advanced AI assistant by Anthropic optimized for coding, reliable code generation, collaborative communication, and long-form content analysis'
    WHEN ci.name = 'Google' THEN 'Google''s advanced AI model for multimodal understanding and generation'
    WHEN ci.name = 'Microsoft' THEN 'AI-powered coding assistant integrated into Microsoft development tools'
    WHEN ci.name = 'Meta' THEN 'Open-source large language model for research and development'
    WHEN ci.name = 'Apple' THEN 'Intelligent personal assistant integrated into Apple ecosystem'
    WHEN ci.name = 'Amazon' THEN 'Voice-activated AI assistant for smart home and productivity'
    WHEN ci.name = 'Tesla' THEN 'Advanced driver assistance system for autonomous driving'
    WHEN ci.name = 'NVIDIA' THEN 'Parallel computing platform for AI and machine learning'
    WHEN ci.name = 'IBM' THEN 'Enterprise AI platform for business intelligence and automation'
  END,
  'Artificial Intelligence',
  CASE 
    WHEN ci.name = 'OpenAI' THEN 'https://chatgpt.com'
    WHEN ci.name = 'Anthropic' THEN 'https://claude.ai'
    WHEN ci.name = 'Google' THEN 'https://gemini.google.com'
    WHEN ci.name = 'Microsoft' THEN 'https://copilot.microsoft.com'
    WHEN ci.name = 'Meta' THEN 'https://llama.meta.com'
    WHEN ci.name = 'Apple' THEN 'https://siri.apple.com'
    WHEN ci.name = 'Amazon' THEN 'https://alexa.amazon.com'
    WHEN ci.name = 'Tesla' THEN 'https://tesla.com/autopilot'
    WHEN ci.name = 'NVIDIA' THEN 'https://developer.nvidia.com/cuda'
    WHEN ci.name = 'IBM' THEN 'https://watson.ibm.com'
  END,
  'Freemium',
  'Developers, Researchers, General Users',
  'AI-powered responses, Natural language processing, Context understanding',
  'General assistance, Research, Problem solving'
FROM company_ids ci;

-- 3. 插入融资信息
WITH company_ids AS (
  SELECT name, id FROM companies WHERE name IN ('OpenAI', 'Anthropic', 'Google', 'Microsoft', 'Meta', 'Apple', 'Amazon', 'Tesla', 'NVIDIA', 'IBM')
)
INSERT INTO fundings (company_id, round, amount, investors, valuation, date, lead_investor)
SELECT 
  ci.id,
  CASE 
    WHEN ci.name = 'OpenAI' THEN 'Series D'
    WHEN ci.name = 'Anthropic' THEN 'Series C'
    WHEN ci.name = 'Google' THEN 'IPO'
    WHEN ci.name = 'Microsoft' THEN 'IPO'
    WHEN ci.name = 'Meta' THEN 'IPO'
    WHEN ci.name = 'Apple' THEN 'IPO'
    WHEN ci.name = 'Amazon' THEN 'IPO'
    WHEN ci.name = 'Tesla' THEN 'IPO'
    WHEN ci.name = 'NVIDIA' THEN 'IPO'
    WHEN ci.name = 'IBM' THEN 'IPO'
  END,
  CASE 
    WHEN ci.name = 'OpenAI' THEN 10000000000
    WHEN ci.name = 'Anthropic' THEN 4000000000
    WHEN ci.name = 'Google' THEN 1000000000
    WHEN ci.name = 'Microsoft' THEN 1000000000
    WHEN ci.name = 'Meta' THEN 1000000000
    WHEN ci.name = 'Apple' THEN 1000000000
    WHEN ci.name = 'Amazon' THEN 1000000000
    WHEN ci.name = 'Tesla' THEN 1000000000
    WHEN ci.name = 'NVIDIA' THEN 1000000000
    WHEN ci.name = 'IBM' THEN 1000000000
  END,
  CASE 
    WHEN ci.name = 'OpenAI' THEN 'Microsoft, Sequoia Capital, Andreessen Horowitz'
    WHEN ci.name = 'Anthropic' THEN 'Google, Salesforce Ventures, Zoom'
    WHEN ci.name = 'Google' THEN 'Sequoia Capital, Kleiner Perkins'
    WHEN ci.name = 'Microsoft' THEN 'Sequoia Capital, Kleiner Perkins'
    WHEN ci.name = 'Meta' THEN 'Accel Partners, Greylock Partners'
    WHEN ci.name = 'Apple' THEN 'Sequoia Capital, Kleiner Perkins'
    WHEN ci.name = 'Amazon' THEN 'Kleiner Perkins, Sequoia Capital'
    WHEN ci.name = 'Tesla' THEN 'Elon Musk, Daimler, Toyota'
    WHEN ci.name = 'NVIDIA' THEN 'Sequoia Capital, Kleiner Perkins'
    WHEN ci.name = 'IBM' THEN 'Sequoia Capital, Kleiner Perkins'
  END,
  CASE 
    WHEN ci.name = 'OpenAI' THEN 100000000000
    WHEN ci.name = 'Anthropic' THEN 18000000000
    WHEN ci.name = 'Google' THEN 1000000000000
    WHEN ci.name = 'Microsoft' THEN 2000000000000
    WHEN ci.name = 'Meta' THEN 500000000000
    WHEN ci.name = 'Apple' THEN 3000000000000
    WHEN ci.name = 'Amazon' THEN 1500000000000
    WHEN ci.name = 'Tesla' THEN 800000000000
    WHEN ci.name = 'NVIDIA' THEN 1000000000000
    WHEN ci.name = 'IBM' THEN 100000000000
  END,
  2023,
  CASE 
    WHEN ci.name = 'OpenAI' THEN 'Microsoft'
    WHEN ci.name = 'Anthropic' THEN 'Google'
    WHEN ci.name = 'Google' THEN 'Sequoia Capital'
    WHEN ci.name = 'Microsoft' THEN 'Sequoia Capital'
    WHEN ci.name = 'Meta' THEN 'Accel Partners'
    WHEN ci.name = 'Apple' THEN 'Sequoia Capital'
    WHEN ci.name = 'Amazon' THEN 'Kleiner Perkins'
    WHEN ci.name = 'Tesla' THEN 'Elon Musk'
    WHEN ci.name = 'NVIDIA' THEN 'Sequoia Capital'
    WHEN ci.name = 'IBM' THEN 'Sequoia Capital'
  END
FROM company_ids ci;

-- 4. 插入新闻故事
WITH company_ids AS (
  SELECT name, id FROM companies WHERE name IN ('OpenAI', 'Anthropic', 'Google', 'Microsoft', 'Meta', 'Apple', 'Amazon', 'Tesla', 'NVIDIA', 'IBM')
)
INSERT INTO stories (company_id, title, summary, source_url, published_date, category, tags)
SELECT 
  ci.id,
  CASE 
    WHEN ci.name = 'OpenAI' THEN 'OpenAI 获得新一轮融资，估值大幅提升'
    WHEN ci.name = 'Anthropic' THEN 'Anthropic 完成新一轮融资，AI助手市场竞争加剧'
    WHEN ci.name = 'Google' THEN 'Google AI技术突破，Gemini模型表现优异'
    WHEN ci.name = 'Microsoft' THEN 'Microsoft Copilot集成Office，生产力工具升级'
    WHEN ci.name = 'Meta' THEN 'Meta开源Llama模型，推动AI技术普及'
    WHEN ci.name = 'Apple' THEN 'Apple Siri升级，AI助手功能增强'
    WHEN ci.name = 'Amazon' THEN 'Amazon Alexa新功能，智能家居体验提升'
    WHEN ci.name = 'Tesla' THEN 'Tesla Autopilot更新，自动驾驶技术突破'
    WHEN ci.name = 'NVIDIA' THEN 'NVIDIA CUDA平台升级，AI计算性能提升'
    WHEN ci.name = 'IBM' THEN 'IBM Watson新版本，企业AI解决方案优化'
  END,
  CASE 
    WHEN ci.name = 'OpenAI' THEN 'OpenAI作为Artificial Intelligence领域的领先AI工具，近日宣布完成新一轮融资，估值较上轮提升显著。该轮融资将主要用于产品研发和市场扩张。'
    WHEN ci.name = 'Anthropic' THEN 'Anthropic作为Artificial Intelligence领域的AI工具，近日宣布完成新一轮融资，进一步加剧了AI助手市场的竞争。'
    WHEN ci.name = 'Google' THEN 'Google在AI技术方面取得重大突破，其Gemini模型在多项基准测试中表现优异，展现了强大的多模态理解能力。'
    WHEN ci.name = 'Microsoft' THEN 'Microsoft宣布将Copilot AI助手深度集成到Office套件中，为用户提供更智能的生产力工具体验。'
    WHEN ci.name = 'Meta' THEN 'Meta宣布开源其Llama大语言模型，这一举措将推动AI技术的普及和发展，为研究者和开发者提供更多可能性。'
    WHEN ci.name = 'Apple' THEN 'Apple对其Siri AI助手进行了重大升级，新增了更多智能功能，提升了用户体验。'
    WHEN ci.name = 'Amazon' THEN 'Amazon为Alexa智能助手添加了多项新功能，进一步提升了智能家居的用户体验。'
    WHEN ci.name = 'Tesla' THEN 'Tesla对其Autopilot自动驾驶系统进行了重要更新，在自动驾驶技术方面取得了新的突破。'
    WHEN ci.name = 'NVIDIA' THEN 'NVIDIA升级了其CUDA并行计算平台，为AI和机器学习应用提供了更强大的计算性能。'
    WHEN ci.name = 'IBM' THEN 'IBM发布了Watson AI平台的新版本，为企业提供了更优化的AI解决方案。'
  END,
  'https://techcrunch.com',
  '2024-06-15',
  '融资新闻',
  ARRAY['融资', 'AI', '科技']
FROM company_ids ci;

-- 完成
SELECT 'AIverse数据批量插入完成！' as status;
