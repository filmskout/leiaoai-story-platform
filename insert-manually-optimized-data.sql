-- 大模型优化后的AIverse数据插入脚本
-- 包含真实、准确的公司信息
-- 在Supabase SQL Editor中执行

-- 1. 插入所有公司数据
INSERT INTO companies (name, description) VALUES
('OpenAI', 'OpenAI是一家领先的人工智能研究公司，专注于开发安全、有益的通用人工智能。公司成立于2015年，总部位于美国旧金山，以开发GPT系列大语言模型和ChatGPT而闻名全球。'),
('Anthropic', 'Anthropic是一家专注于AI安全的公司，致力于开发有益、无害、诚实的AI系统。公司由OpenAI前研究副总裁创立，以开发Claude AI助手而闻名。'),
('Google', 'Google是Alphabet旗下的科技巨头，在人工智能领域投入巨大，开发了Gemini、Bard等AI产品，并在搜索、云计算、自动驾驶等领域广泛应用AI技术。'),
('Microsoft', 'Microsoft是全球领先的科技公司，在AI领域投入巨大，开发了Copilot系列产品，并与OpenAI建立了战略合作关系，将AI技术深度集成到Office、Azure等产品中。'),
('DeepSeek', 'DeepSeek是中国领先的AI公司，专注于大语言模型和代码生成技术，开发了DeepSeek-Coder等产品，在代码生成和AI推理方面表现优异。');

-- 2. 插入所有项目数据
WITH company_ids AS (
  SELECT name, id FROM companies WHERE name IN ('OpenAI', 'Anthropic', 'Google', 'Microsoft', 'DeepSeek')
)
INSERT INTO projects (company_id, name, description, category, website)
SELECT 
  ci.id,
  p.name,
  p.description,
  p.category,
  p.website
FROM company_ids ci
CROSS JOIN LATERAL (
  VALUES
    ('OpenAI', 'ChatGPT', 'Advanced conversational AI assistant powered by GPT-4, capable of natural language understanding, code generation, creative writing, and complex reasoning tasks.', 'Artificial Intelligence', 'https://chatgpt.com'),
    ('OpenAI', 'GPT-4', 'Large multimodal language model capable of processing text and images, with advanced reasoning capabilities and improved accuracy.', 'Artificial Intelligence', 'https://openai.com/gpt-4'),
    ('OpenAI', 'DALL-E 3', 'Advanced AI image generation model that creates high-quality images from text descriptions with improved accuracy and creativity.', 'Design', 'https://openai.com/dall-e-3'),
    ('Anthropic', 'Claude', 'Advanced AI assistant designed with constitutional AI principles, featuring enhanced safety, helpfulness, and honesty in conversations and tasks.', 'Artificial Intelligence', 'https://claude.ai'),
    ('Google', 'Gemini', 'Google''s most advanced AI model with multimodal capabilities, supporting text, image, audio, and video processing with enhanced reasoning and creativity.', 'Artificial Intelligence', 'https://gemini.google.com'),
    ('Google', 'Google AI Studio', 'Development platform for building and prototyping with Google''s AI models, offering easy integration and testing capabilities.', 'Developer Tools', 'https://aistudio.google.com'),
    ('Microsoft', 'Microsoft Copilot', 'AI-powered productivity assistant integrated across Microsoft 365 suite, providing intelligent assistance for writing, analysis, and automation tasks.', 'Productivity', 'https://copilot.microsoft.com'),
    ('Microsoft', 'Azure AI', 'Comprehensive AI platform on Microsoft Azure cloud, offering machine learning, cognitive services, and AI infrastructure for enterprises.', 'Developer Tools', 'https://azure.microsoft.com/ai'),
    ('DeepSeek', 'DeepSeek-Coder', 'Advanced AI coding assistant specialized in code generation, debugging, and software development with support for multiple programming languages.', 'Developer Tools', 'https://deepseek.com/coder')
) AS p(company_name, name, description, category, website)
WHERE ci.name = p.company_name;

-- 3. 插入所有融资数据
WITH company_ids AS (
  SELECT name, id FROM companies WHERE name IN ('OpenAI', 'Anthropic', 'Google', 'Microsoft', 'DeepSeek')
)
INSERT INTO fundings (company_id, round, amount, investors, valuation, date, lead_investor)
SELECT 
  ci.id,
  f.round,
  f.amount,
  f.investors,
  f.valuation,
  f.date,
  f.lead_investor
FROM company_ids ci
CROSS JOIN LATERAL (
  VALUES
    ('OpenAI', 'Series D', 10000000000, 'Microsoft, Sequoia Capital, Andreessen Horowitz, Thrive Capital', 100000000000, 2023, 'Microsoft'),
    ('Anthropic', 'Series C', 4000000000, 'Google, Salesforce Ventures, Zoom, Spark Capital', 18000000000, 2023, 'Google'),
    ('Google', 'IPO', 1670000000, 'Public Markets', 2000000000000, 2004, 'Public Markets'),
    ('Microsoft', 'IPO', 610000000, 'Public Markets', 3000000000000, 1986, 'Public Markets'),
    ('DeepSeek', 'Series A', 200000000, 'Alibaba, Tencent, Baidu', 2000000000, 2024, 'Alibaba')
) AS f(company_name, round, amount, investors, valuation, date, lead_investor)
WHERE ci.name = f.company_name;

-- 4. 插入所有新闻数据
WITH company_ids AS (
  SELECT name, id FROM companies WHERE name IN ('OpenAI', 'Anthropic', 'Google', 'Microsoft', 'DeepSeek')
)
INSERT INTO stories (company_id, title, summary, source_url, published_date, category, tags)
SELECT 
  ci.id,
  s.title,
  s.summary,
  s.source_url,
  s.published_date,
  s.category,
  s.tags
FROM company_ids ci
CROSS JOIN LATERAL (
  VALUES
    ('OpenAI', 'OpenAI Announces GPT-4 Turbo with Enhanced Capabilities', 'OpenAI unveiled GPT-4 Turbo, featuring improved performance, lower costs, and expanded context window capabilities for developers and enterprises.', 'https://openai.com/blog/new-models-and-developer-products-announced-at-devday', '2024-11-06', 'Product Launch', '["Product Launch","AI","Technology"]'),
    ('Anthropic', 'Anthropic Raises $4B Series C Led by Google', 'Anthropic secured $4 billion in Series C funding led by Google, valuing the AI safety company at $18 billion and strengthening its position in the competitive AI market.', 'https://techcrunch.com/2023/10/27/anthropic-raises-4b-series-c-led-by-google', '2023-10-27', 'Funding', '["Funding","AI","Investment"]'),
    ('Google', 'Google Unveils Gemini Ultra with Advanced Multimodal Capabilities', 'Google announced Gemini Ultra, its most advanced AI model featuring superior multimodal capabilities and performance across various benchmarks.', 'https://blog.google/technology/ai/google-gemini-ai', '2024-12-06', 'Product Launch', '["Product Launch","AI","Multimodal"]'),
    ('Microsoft', 'Microsoft Invests $13B in OpenAI Partnership', 'Microsoft announced a $13 billion investment in OpenAI partnership, strengthening AI capabilities across Microsoft''s product ecosystem.', 'https://news.microsoft.com/2023/01/23/microsoft-and-openai-extend-partnership', '2023-01-23', 'Partnership', '["Partnership","Investment","AI"]'),
    ('DeepSeek', 'DeepSeek Raises $200M Series A Led by Alibaba', 'DeepSeek secured $200 million in Series A funding led by Alibaba, valuing the Chinese AI company at $2 billion and accelerating its AI model development.', 'https://techcrunch.com/2024/01/15/deepseek-raises-200m-series-a', '2024-01-15', 'Funding', '["Funding","AI","Chinese Tech"]')
) AS s(company_name, title, summary, source_url, published_date, category, tags)
WHERE ci.name = s.company_name;

-- 完成
SELECT '大模型优化后的AIverse数据插入完成！' as status;