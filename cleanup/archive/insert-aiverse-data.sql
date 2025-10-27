-- 直接插入AIverse数据到数据库
-- 在Supabase SQL Editor中执行

-- 1. 插入OpenAI公司
INSERT INTO companies (name, description) VALUES 
('OpenAI', 'OpenAI是一家专注于Artificial Intelligence领域的AI公司，致力于通过先进的人工智能技术为用户提供创新的解决方案。');

-- 2. 插入Anthropic公司
INSERT INTO companies (name, description) VALUES 
('Anthropic', 'Anthropic是一家专注于Artificial Intelligence领域的AI公司，致力于通过先进的人工智能技术为用户提供创新的解决方案。');

-- 3. 获取公司ID并插入项目
WITH openai_company AS (
  SELECT id FROM companies WHERE name = 'OpenAI' LIMIT 1
),
anthropic_company AS (
  SELECT id FROM companies WHERE name = 'Anthropic' LIMIT 1
)
INSERT INTO projects (company_id, name, description, category, website, pricing_model, target_users, key_features, use_cases)
SELECT 
  openai_company.id,
  'ChatGPT',
  'Leading AI assistant for wide range of tasks, file analysis, summarization, and advanced reasoning with GPT-4o capabilities',
  'Artificial Intelligence',
  'https://chatgpt.com',
  'Freemium',
  'Developers, Researchers, General Users',
  'AI-powered responses, Natural language processing, Context understanding',
  'General assistance, Research, Problem solving'
FROM openai_company
UNION ALL
SELECT 
  anthropic_company.id,
  'Claude',
  'Advanced AI assistant by Anthropic optimized for coding, reliable code generation, collaborative communication, and long-form content analysis',
  'Artificial Intelligence',
  'https://claude.ai',
  'Freemium',
  'Developers, Researchers, General Users',
  'AI-powered responses, Natural language processing, Context understanding',
  'General assistance, Research, Problem solving'
FROM anthropic_company;

-- 4. 插入融资信息
WITH openai_company AS (
  SELECT id FROM companies WHERE name = 'OpenAI' LIMIT 1
),
anthropic_company AS (
  SELECT id FROM companies WHERE name = 'Anthropic' LIMIT 1
)
INSERT INTO fundings (company_id, round, amount, investors, valuation, date, lead_investor)
SELECT 
  openai_company.id,
  'Series D',
  10000000000,
  'Microsoft, Sequoia Capital, Andreessen Horowitz',
  100000000000,
  2023,
  'Microsoft'
FROM openai_company
UNION ALL
SELECT 
  anthropic_company.id,
  'Series C',
  4000000000,
  'Google, Salesforce Ventures, Zoom',
  18000000000,
  2023,
  'Google'
FROM anthropic_company;

-- 5. 插入新闻故事
WITH openai_company AS (
  SELECT id FROM companies WHERE name = 'OpenAI' LIMIT 1
),
anthropic_company AS (
  SELECT id FROM companies WHERE name = 'Anthropic' LIMIT 1
)
INSERT INTO stories (company_id, title, summary, source_url, published_date, category, tags)
SELECT 
  openai_company.id,
  'OpenAI 获得新一轮融资，估值大幅提升',
  'OpenAI作为Artificial Intelligence领域的领先AI工具，近日宣布完成新一轮融资，估值较上轮提升显著。该轮融资将主要用于产品研发和市场扩张。',
  'https://techcrunch.com',
  '2024-06-15',
  '融资新闻',
  ARRAY['融资', 'AI', '科技']
FROM openai_company
UNION ALL
SELECT 
  anthropic_company.id,
  'Anthropic 完成新一轮融资，AI助手市场竞争加剧',
  'Anthropic作为Artificial Intelligence领域的AI工具，近日宣布完成新一轮融资，进一步加剧了AI助手市场的竞争。',
  'https://techcrunch.com',
  '2024-06-15',
  '融资新闻',
  ARRAY['融资', 'AI', '科技']
FROM anthropic_company;

-- 完成
SELECT 'AIverse数据插入完成！' as status;
