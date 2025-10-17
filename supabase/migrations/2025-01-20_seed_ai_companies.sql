-- 种子数据：AI公司及其工具套件
-- 基于a16z报告和最新AI公司信息

-- 插入主要AI公司
INSERT INTO public.companies (name, website, description, founded_year, headquarters, industry_tags, logo_url, social_links) VALUES
-- OpenAI
('OpenAI', 'https://openai.com', 'AI研究公司，致力于确保人工通用智能造福全人类', 2015, 'San Francisco, CA', ARRAY['AI Research', 'LLM', 'Generative AI'], 'https://openai.com/favicon.ico', '{"twitter": "https://twitter.com/openai", "linkedin": "https://linkedin.com/company/openai"}'),

-- Anthropic
('Anthropic', 'https://anthropic.com', '专注于构建可靠、可解释的AI系统', 2021, 'San Francisco, CA', ARRAY['AI Safety', 'LLM', 'Constitutional AI'], 'https://anthropic.com/favicon.ico', '{"twitter": "https://twitter.com/anthropicai", "linkedin": "https://linkedin.com/company/anthropic"}'),

-- Google
('Google', 'https://ai.google', '全球科技巨头，提供广泛的AI产品和服务', 1998, 'Mountain View, CA', ARRAY['Search', 'AI Platform', 'Cloud AI'], 'https://www.google.com/favicon.ico', '{"twitter": "https://twitter.com/google", "linkedin": "https://linkedin.com/company/google"}'),

-- Microsoft
('Microsoft', 'https://microsoft.com/ai', '全球软件巨头，提供AI驱动的产品和服务', 1975, 'Redmond, WA', ARRAY['Enterprise AI', 'Productivity', 'Cloud AI'], 'https://www.microsoft.com/favicon.ico', '{"twitter": "https://twitter.com/microsoft", "linkedin": "https://linkedin.com/company/microsoft"}'),

-- Meta
('Meta', 'https://ai.meta.com', '社交媒体和AI研究公司', 2004, 'Menlo Park, CA', ARRAY['Social Media', 'AI Research', 'VR/AR'], 'https://www.meta.com/favicon.ico', '{"twitter": "https://twitter.com/meta", "linkedin": "https://linkedin.com/company/meta"}'),

-- Perplexity AI
('Perplexity AI', 'https://perplexity.ai', 'AI驱动的搜索引擎和问答平台', 2022, 'San Francisco, CA', ARRAY['Search', 'AI Assistant', 'Information Retrieval'], 'https://perplexity.ai/favicon.ico', '{"twitter": "https://twitter.com/perplexity_ai", "linkedin": "https://linkedin.com/company/perplexity-ai"}'),

-- Replit
('Replit', 'https://replit.com', '在线编程环境和AI代码助手', 2016, 'San Francisco, CA', ARRAY['Code Generation', 'Developer Tools', 'AI Coding'], 'https://replit.com/favicon.ico', '{"twitter": "https://twitter.com/replit", "linkedin": "https://linkedin.com/company/replit"}'),

-- ElevenLabs
('ElevenLabs', 'https://elevenlabs.io', 'AI语音合成和音频生成平台', 2022, 'New York, NY', ARRAY['Voice AI', 'Audio Generation', 'Speech Synthesis'], 'https://elevenlabs.io/favicon.ico', '{"twitter": "https://twitter.com/elevenlabs", "linkedin": "https://linkedin.com/company/elevenlabs"}'),

-- Midjourney
('Midjourney', 'https://midjourney.com', 'AI图像生成平台', 2021, 'San Francisco, CA', ARRAY['Image Generation', 'Creative AI', 'Art'], 'https://midjourney.com/favicon.ico', '{"twitter": "https://twitter.com/midjourney", "discord": "https://discord.gg/midjourney"}'),

-- Notion
('Notion', 'https://notion.so', 'AI增强的工作空间和生产力平台', 2016, 'San Francisco, CA', ARRAY['Productivity', 'AI Assistant', 'Collaboration'], 'https://www.notion.so/favicon.ico', '{"twitter": "https://twitter.com/notionhq", "linkedin": "https://linkedin.com/company/notion-labs"}'),

-- Canva
('Canva', 'https://canva.com', 'AI驱动的设计平台', 2013, 'Sydney, Australia', ARRAY['Design', 'Creative AI', 'Visual Content'], 'https://www.canva.com/favicon.ico', '{"twitter": "https://twitter.com/canva", "linkedin": "https://linkedin.com/company/canva"}'),

-- Scale AI
('Scale AI', 'https://scale.com', 'AI数据标注和训练平台', 2016, 'San Francisco, CA', ARRAY['Data Labeling', 'AI Training', 'ML Infrastructure'], 'https://scale.com/favicon.ico', '{"twitter": "https://twitter.com/scale_ai", "linkedin": "https://linkedin.com/company/scale-ai"}'),

-- Databricks
('Databricks', 'https://databricks.com', '统一数据分析平台', 2013, 'San Francisco, CA', ARRAY['Data Analytics', 'ML Platform', 'Big Data'], 'https://www.databricks.com/favicon.ico', '{"twitter": "https://twitter.com/databricks", "linkedin": "https://linkedin.com/company/databricks"}'),

-- Hugging Face
('Hugging Face', 'https://huggingface.co', 'AI模型和数据集平台', 2016, 'New York, NY', ARRAY['Open Source AI', 'Model Hub', 'NLP'], 'https://huggingface.co/favicon.ico', '{"twitter": "https://twitter.com/huggingface", "linkedin": "https://linkedin.com/company/hugging-face"}'),

-- Stability AI
('Stability AI', 'https://stability.ai', '开源AI模型公司', 2020, 'London, UK', ARRAY['Open Source AI', 'Image Generation', 'Diffusion Models'], 'https://stability.ai/favicon.ico', '{"twitter": "https://twitter.com/stabilityai", "linkedin": "https://linkedin.com/company/stability-ai"}')

ON CONFLICT (name) DO NOTHING;

-- 插入OpenAI的工具套件
INSERT INTO public.tools (company_id, name, category, description, website, industry_tags, features, api_available, free_tier) 
SELECT c.id, 'ChatGPT', 'Conversational AI', 'AI对话助手，能够进行自然语言对话和任务协助', 'https://chat.openai.com', ARRAY['Customer Support', 'Content Creation', 'Education'], '["对话生成", "代码编写", "文本总结", "翻译"]'::jsonb, true, true
FROM public.companies c WHERE c.name = 'OpenAI';

INSERT INTO public.tools (company_id, name, category, description, website, industry_tags, features, api_available, free_tier) 
SELECT c.id, 'DALL-E', 'Image Generation', 'AI图像生成模型，根据文本描述创建图像', 'https://openai.com/dall-e', ARRAY['Design', 'Marketing', 'Creative'], '["文本到图像", "图像编辑", "风格转换"]'::jsonb, true, false
FROM public.companies c WHERE c.name = 'OpenAI';

INSERT INTO public.tools (company_id, name, category, description, website, industry_tags, features, api_available, free_tier) 
SELECT c.id, 'Sora', 'Video Generation', 'AI视频生成模型，根据文本创建高质量视频', 'https://openai.com/sora', ARRAY['Video Production', 'Marketing', 'Entertainment'], '["文本到视频", "视频编辑", "场景生成"]'::jsonb, false, false
FROM public.companies c WHERE c.name = 'OpenAI';

INSERT INTO public.tools (company_id, name, category, description, website, industry_tags, features, api_available, free_tier) 
SELECT c.id, 'GPT-4 API', 'API Service', 'GPT-4模型的API接口，供开发者集成使用', 'https://platform.openai.com', ARRAY['Developer Tools', 'API', 'Integration'], '["文本生成", "代码生成", "对话API"]'::jsonb, true, false
FROM public.companies c WHERE c.name = 'OpenAI';

INSERT INTO public.tools (company_id, name, category, description, website, industry_tags, features, api_available, free_tier) 
SELECT c.id, 'Whisper', 'Speech Recognition', 'AI语音识别和转录模型', 'https://openai.com/whisper', ARRAY['Speech Recognition', 'Transcription', 'Accessibility'], '["语音转文字", "多语言支持", "实时转录"]'::jsonb, true, true
FROM public.companies c WHERE c.name = 'OpenAI';

-- 插入Anthropic的工具套件
INSERT INTO public.tools (company_id, name, category, description, website, industry_tags, features, api_available, free_tier) 
SELECT c.id, 'Claude', 'Conversational AI', 'AI助手，专注于安全、有用和诚实的对话', 'https://claude.ai', ARRAY['Customer Support', 'Content Creation', 'Analysis'], '["长文本处理", "代码分析", "文档总结", "安全对话"]'::jsonb, true, true
FROM public.companies c WHERE c.name = 'Anthropic';

INSERT INTO public.tools (company_id, name, category, description, website, industry_tags, features, api_available, free_tier) 
SELECT c.id, 'Claude API', 'API Service', 'Claude模型的API接口，提供企业级AI服务', 'https://console.anthropic.com', ARRAY['Developer Tools', 'API', 'Enterprise'], '["文本生成", "对话API", "企业集成"]'::jsonb, true, false
FROM public.companies c WHERE c.name = 'Anthropic';

-- 插入Google的工具套件
INSERT INTO public.tools (company_id, name, category, description, website, industry_tags, features, api_available, free_tier) 
SELECT c.id, 'Gemini', 'Conversational AI', 'Google的多模态AI模型', 'https://gemini.google.com', ARRAY['Multimodal AI', 'Search', 'Productivity'], '["文本生成", "图像理解", "代码生成", "搜索增强"]'::jsonb, true, true
FROM public.companies c WHERE c.name = 'Google';

INSERT INTO public.tools (company_id, name, category, description, website, industry_tags, features, api_available, free_tier) 
SELECT c.id, 'Gemini API', 'API Service', 'Gemini模型的API接口', 'https://ai.google.dev', ARRAY['Developer Tools', 'API', 'Multimodal'], '["文本API", "图像API", "多模态API"]'::jsonb, true, false
FROM public.companies c WHERE c.name = 'Google';

INSERT INTO public.tools (company_id, name, category, description, website, industry_tags, features, api_available, free_tier) 
SELECT c.id, 'NotebookLM', 'AI Assistant', 'AI驱动的笔记和研究助手', 'https://notebooklm.google.com', ARRAY['Research', 'Note-taking', 'Education'], '["文档分析", "智能总结", "研究助手"]'::jsonb, true, true
FROM public.companies c WHERE c.name = 'Google';

-- 插入Microsoft的工具套件
INSERT INTO public.tools (company_id, name, category, description, website, industry_tags, features, api_available, free_tier) 
SELECT c.id, 'Copilot', 'AI Assistant', 'Microsoft的AI助手，集成到Office套件中', 'https://copilot.microsoft.com', ARRAY['Productivity', 'Office Integration', 'Enterprise'], '["文档编写", "邮件助手", "会议总结", "代码生成"]'::jsonb, true, false
FROM public.companies c WHERE c.name = 'Microsoft';

INSERT INTO public.tools (company_id, name, category, description, website, industry_tags, features, api_available, free_tier) 
SELECT c.id, 'Azure OpenAI', 'API Service', 'Azure上的OpenAI服务', 'https://azure.microsoft.com/en-us/products/ai-services/openai-service', ARRAY['Cloud AI', 'API', 'Enterprise'], '["GPT模型", "DALL-E", "企业级安全"]'::jsonb, true, false
FROM public.companies c WHERE c.name = 'Microsoft';

-- 插入Perplexity AI的工具套件
INSERT INTO public.tools (company_id, name, category, description, website, industry_tags, features, api_available, free_tier) 
SELECT c.id, 'Perplexity Pro', 'AI Search', 'AI驱动的搜索引擎，提供实时信息', 'https://perplexity.ai', ARRAY['Search', 'Research', 'Information Retrieval'], '["实时搜索", "引用来源", "多语言支持", "专业搜索"]'::jsonb, true, false
FROM public.companies c WHERE c.name = 'Perplexity AI';

INSERT INTO public.tools (company_id, name, category, description, website, industry_tags, features, api_available, free_tier) 
SELECT c.id, 'Perplexity API', 'API Service', 'Perplexity的API接口', 'https://docs.perplexity.ai', ARRAY['Developer Tools', 'API', 'Search'], '["搜索API", "问答API", "实时信息"]'::jsonb, true, false
FROM public.companies c WHERE c.name = 'Perplexity AI';

-- 插入Replit的工具套件
INSERT INTO public.tools (company_id, name, category, description, website, industry_tags, features, api_available, free_tier) 
SELECT c.id, 'Replit Agent', 'AI Coding', 'AI代码助手，能够自主开发应用', 'https://replit.com', ARRAY['Code Generation', 'Development', 'AI Coding'], '["自主编程", "应用开发", "代码调试", "部署"]'::jsonb, true, true
FROM public.companies c WHERE c.name = 'Replit';

INSERT INTO public.tools (company_id, name, category, description, website, industry_tags, features, api_available, free_tier) 
SELECT c.id, 'Replit Workspace', 'Development Environment', '在线编程环境和协作平台', 'https://replit.com', ARRAY['Development', 'Collaboration', 'Cloud IDE'], '["在线IDE", "实时协作", "版本控制", "部署"]'::jsonb, true, true
FROM public.companies c WHERE c.name = 'Replit';

-- 插入ElevenLabs的工具套件
INSERT INTO public.tools (company_id, name, category, description, website, industry_tags, features, api_available, free_tier) 
SELECT c.id, 'ElevenLabs Voice', 'Voice Synthesis', 'AI语音合成平台', 'https://elevenlabs.io', ARRAY['Voice AI', 'Audio Generation', 'Content Creation'], '["语音克隆", "多语言合成", "情感表达", "实时生成"]'::jsonb, true, true
FROM public.companies c WHERE c.name = 'ElevenLabs';

INSERT INTO public.tools (company_id, name, category, description, website, industry_tags, features, api_available, free_tier) 
SELECT c.id, 'ElevenLabs API', 'API Service', '语音合成API接口', 'https://elevenlabs.io/docs', ARRAY['Developer Tools', 'API', 'Voice AI'], '["语音API", "批量处理", "自定义声音"]'::jsonb, true, false
FROM public.companies c WHERE c.name = 'ElevenLabs';

-- 插入Midjourney的工具套件
INSERT INTO public.tools (company_id, name, category, description, website, industry_tags, features, api_available, free_tier) 
SELECT c.id, 'Midjourney Bot', 'Image Generation', 'Discord上的AI图像生成机器人', 'https://midjourney.com', ARRAY['Image Generation', 'Creative AI', 'Art'], '["文本到图像", "风格控制", "高分辨率", "艺术风格"]'::jsonb, false, false
FROM public.companies c WHERE c.name = 'Midjourney';

-- 插入Notion的工具套件
INSERT INTO public.tools (company_id, name, category, description, website, industry_tags, features, api_available, free_tier) 
SELECT c.id, 'Notion AI', 'AI Assistant', 'Notion中的AI写作和内容助手', 'https://notion.so', ARRAY['Productivity', 'AI Writing', 'Content Creation'], '["智能写作", "内容总结", "翻译", "头脑风暴"]'::jsonb, true, false
FROM public.companies c WHERE c.name = 'Notion';

-- 插入Canva的工具套件
INSERT INTO public.tools (company_id, name, category, description, website, industry_tags, features, api_available, free_tier) 
SELECT c.id, 'Magic Design', 'AI Design', 'AI驱动的设计工具', 'https://canva.com', ARRAY['Design', 'Creative AI', 'Visual Content'], '["AI设计", "模板生成", "品牌套件", "协作设计"]'::jsonb, true, true
FROM public.companies c WHERE c.name = 'Canva';

INSERT INTO public.tools (company_id, name, category, description, website, industry_tags, features, api_available, free_tier) 
SELECT c.id, 'Magic Write', 'AI Writing', 'AI内容写作工具', 'https://canva.com', ARRAY['Content Writing', 'Marketing', 'Social Media'], '["内容生成", "社交媒体文案", "营销材料"]'::jsonb, true, true
FROM public.companies c WHERE c.name = 'Canva';

-- 更新融资信息
UPDATE public.companies SET 
  valuation_usd = 300000000000,
  last_funding_date = '2024-12-01'
WHERE name = 'OpenAI';

UPDATE public.companies SET 
  valuation_usd = 61500000000,
  last_funding_date = '2024-12-01'
WHERE name = 'Anthropic';

UPDATE public.companies SET 
  valuation_usd = 9000000000,
  last_funding_date = '2024-12-01'
WHERE name = 'Perplexity AI';

UPDATE public.companies SET 
  valuation_usd = 14000000000,
  last_funding_date = '2024-05-01'
WHERE name = 'Scale AI';

UPDATE public.companies SET 
  valuation_usd = 62000000000,
  last_funding_date = '2024-12-01'
WHERE name = 'Databricks';

-- 插入融资记录
INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series Unknown', 40000000000, ARRAY['Microsoft', 'SoftBank Group', 'Founders Fund', 'Magnetar Capital'], '2024-12-01'
FROM public.companies c WHERE c.name = 'OpenAI';

INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series Unknown', 3500000000, ARRAY['Lightspeed Venture Partners', 'Salesforce Ventures', 'Alphabet'], '2024-12-01'
FROM public.companies c WHERE c.name = 'Anthropic';

INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series B', 1000000000, ARRAY['Thrive Capital', 'Andreessen Horowitz', 'Ontario Teachers'' Pension Plan'], '2024-12-01'
FROM public.companies c WHERE c.name = 'Databricks';

INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on)
SELECT c.id, 'Series A', 1000000000, ARRAY['Accel', 'Index Ventures', 'Y Combinator'], '2024-05-01'
FROM public.companies c WHERE c.name = 'Scale AI';

