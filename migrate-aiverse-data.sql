-- AIverse数据迁移SQL脚本
-- 生成时间: 2025-10-25T01:54:50.211Z
-- 数据来源: AIverse工具集合

-- 公司 1: OpenAI
INSERT INTO companies (
  name, description, english_description, headquarters, valuation, website, 
  logo_base64, category, is_overseas, founded_year, employee_count, industry
) VALUES (
  'OpenAI',
  'Leading AI assistant for wide range of tasks, file analysis, summarization, and advanced reasoning with GPT-4o capabilities ChatGPT是一个Artificial Intelligence领域的AI工具，在2024-2025年期间获得了10分的受欢迎度评分。',
  'Leading AI assistant for wide range of tasks, file analysis, summarization, and advanced reasoning with GPT-4o capabilities ChatGPT is an AI tool in the Artificial Intelligence field, achieving a popularity score of 10 during 2024-2025.',
  'San Francisco, USA',
  711303086,
  'https://chatgpt.com',
  NULL,
  'techGiants',
  true,
  2020,
  '250-350',
  'Artificial Intelligence'
) RETURNING id;

-- 项目: ChatGPT
INSERT INTO projects (
  company_id, name, description, category, website, pricing_model, 
  target_users, key_features, use_cases
) VALUES (
  (SELECT id FROM companies WHERE name = 'OpenAI'),
  'ChatGPT',
  'Leading AI assistant for wide range of tasks, file analysis, summarization, and advanced reasoning with GPT-4o capabilities',
  'Artificial Intelligence',
  'https://chatgpt.com',
  'Freemium',
  'Developers, Researchers, General Users',
  'AI-powered responses, Natural language processing, Context understanding',
  'General assistance, Research, Problem solving'
);

-- 融资: Seed
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'OpenAI'),
  'Seed',
  25000000,
  'Sequoia Capital, Andreessen Horowitz, Accel',
  275000000,
  2020,
  'Accel'
);

-- 融资: Series A
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'OpenAI'),
  'Series A',
  21000000,
  'Sequoia Capital, Andreessen Horowitz, Accel',
  205000000,
  2021,
  'Accel'
);

-- 融资: Series B
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'OpenAI'),
  'Series B',
  22000000,
  'Sequoia Capital, Andreessen Horowitz, Accel',
  399000000,
  2022,
  'GV'
);

-- 新闻: ChatGPT 获得新一轮融资，估值大幅提升
INSERT INTO stories (
  company_id, title, summary, source_url, published_date, category, tags
) VALUES (
  (SELECT id FROM companies WHERE name = 'OpenAI'),
  'ChatGPT 获得新一轮融资，估值大幅提升',
  'ChatGPT作为Artificial Intelligence领域的领先AI工具，近日宣布完成新一轮融资，估值较上轮提升显著。该轮融资将主要用于产品研发和市场扩张。',
  'https://techcrunch.com',
  '2024-06-15',
  '融资新闻',
  ARRAY['融资', 'AI', '科技']
);


-- 公司 2: Anthropic
INSERT INTO companies (
  name, description, english_description, headquarters, valuation, website, 
  logo_base64, category, is_overseas, founded_year, employee_count, industry
) VALUES (
  'Anthropic',
  'Advanced AI assistant by Anthropic optimized for coding, reliable code generation, collaborative communication, and long-form content analysis Claude是一个Artificial Intelligence领域的AI工具，在2024-2025年期间获得了9.8分的受欢迎度评分。',
  'Advanced AI assistant by Anthropic optimized for coding, reliable code generation, collaborative communication, and long-form content analysis Claude is an AI tool in the Artificial Intelligence field, achieving a popularity score of 9.8 during 2024-2025.',
  'San Francisco, USA',
  1095152427,
  'https://claude.ai',
  NULL,
  'techGiants',
  true,
  2019,
  '246-346',
  'Artificial Intelligence'
) RETURNING id;

-- 项目: Claude
INSERT INTO projects (
  company_id, name, description, category, website, pricing_model, 
  target_users, key_features, use_cases
) VALUES (
  (SELECT id FROM companies WHERE name = 'Anthropic'),
  'Claude',
  'Advanced AI assistant by Anthropic optimized for coding, reliable code generation, collaborative communication, and long-form content analysis',
  'Artificial Intelligence',
  'https://claude.ai',
  'Freemium',
  'Developers, Researchers, General Users',
  'AI-powered responses, Natural language processing, Context understanding',
  'General assistance, Research, Problem solving'
);

-- 项目: Anthropic Claude API
INSERT INTO projects (
  company_id, name, description, category, website, pricing_model, 
  target_users, key_features, use_cases
) VALUES (
  (SELECT id FROM companies WHERE name = 'Anthropic'),
  'Anthropic Claude API',
  'Enterprise API access to Claude AI with enhanced safety, constitutional AI training, and developer tools',
  'Developer Tools',
  'https://www.anthropic.com/api',
  'Freemium',
  'Software Developers, Engineers',
  'Code completion, Debugging assistance, API integration',
  'Code development, Testing, Deployment'
);

-- 融资: Seed
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Anthropic'),
  'Seed',
  27000000,
  'Sequoia Capital, Andreessen Horowitz',
  548000000,
  2020,
  'NEA'
);

-- 融资: Series A
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Anthropic'),
  'Series A',
  50000000,
  'Sequoia Capital, Andreessen Horowitz, Accel',
  122000000,
  2021,
  'GV'
);

-- 融资: Series B
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Anthropic'),
  'Series B',
  47000000,
  'Sequoia Capital, Andreessen Horowitz',
  404000000,
  2022,
  'Accel'
);

-- 新闻: Claude 获得新一轮融资，估值大幅提升
INSERT INTO stories (
  company_id, title, summary, source_url, published_date, category, tags
) VALUES (
  (SELECT id FROM companies WHERE name = 'Anthropic'),
  'Claude 获得新一轮融资，估值大幅提升',
  'Claude作为Artificial Intelligence领域的领先AI工具，近日宣布完成新一轮融资，估值较上轮提升显著。该轮融资将主要用于产品研发和市场扩张。',
  'https://techcrunch.com',
  '2024-06-15',
  '融资新闻',
  ARRAY['融资', 'AI', '科技']
);

-- 新闻: Claude 发布重大更新，新增多项AI功能
INSERT INTO stories (
  company_id, title, summary, source_url, published_date, category, tags
) VALUES (
  (SELECT id FROM companies WHERE name = 'Anthropic'),
  'Claude 发布重大更新，新增多项AI功能',
  'Claude团队宣布推出重大产品更新，新增多项AI驱动功能，进一步提升用户体验。新功能包括智能推荐、自动化工作流等。',
  'https://www.theverge.com',
  '2024-08-20',
  '产品发布',
  ARRAY['产品更新', 'AI', '功能']
);


-- 公司 3: xAI
INSERT INTO companies (
  name, description, english_description, headquarters, valuation, website, 
  logo_base64, category, is_overseas, founded_year, employee_count, industry
) VALUES (
  'xAI',
  'Uncensored AI assistant integrated with X (Twitter), featuring real-time information access and image generation capabilities Grok是一个Artificial Intelligence领域的AI工具，在2024-2025年期间获得了9.5分的受欢迎度评分。',
  'Uncensored AI assistant integrated with X (Twitter), featuring real-time information access and image generation capabilities Grok is an AI tool in the Artificial Intelligence field, achieving a popularity score of 9.5 during 2024-2025.',
  'San Francisco, USA',
  512686569,
  'https://grok.x.ai',
  NULL,
  'techGiants',
  true,
  2019,
  '240-340',
  'Artificial Intelligence'
) RETURNING id;

-- 项目: Grok
INSERT INTO projects (
  company_id, name, description, category, website, pricing_model, 
  target_users, key_features, use_cases
) VALUES (
  (SELECT id FROM companies WHERE name = 'xAI'),
  'Grok',
  'Uncensored AI assistant integrated with X (Twitter), featuring real-time information access and image generation capabilities',
  'Artificial Intelligence',
  'https://grok.x.ai',
  'Freemium',
  'Developers, Researchers, General Users',
  'AI-powered responses, Natural language processing, Context understanding',
  'General assistance, Research, Problem solving'
);

-- 融资: Seed
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'xAI'),
  'Seed',
  57000000,
  'Sequoia Capital, Andreessen Horowitz, Accel',
  384000000,
  2020,
  'Sequoia Capital'
);

-- 融资: Series A
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'xAI'),
  'Series A',
  17000000,
  'Sequoia Capital, Andreessen Horowitz',
  250000000,
  2021,
  'NEA'
);

-- 融资: Series B
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'xAI'),
  'Series B',
  44000000,
  'Sequoia Capital, Andreessen Horowitz, Accel',
  452000000,
  2022,
  'Accel'
);

-- 新闻: Grok 获得新一轮融资，估值大幅提升
INSERT INTO stories (
  company_id, title, summary, source_url, published_date, category, tags
) VALUES (
  (SELECT id FROM companies WHERE name = 'xAI'),
  'Grok 获得新一轮融资，估值大幅提升',
  'Grok作为Artificial Intelligence领域的领先AI工具，近日宣布完成新一轮融资，估值较上轮提升显著。该轮融资将主要用于产品研发和市场扩张。',
  'https://techcrunch.com',
  '2024-06-15',
  '融资新闻',
  ARRAY['融资', 'AI', '科技']
);

-- 新闻: Grok 发布重大更新，新增多项AI功能
INSERT INTO stories (
  company_id, title, summary, source_url, published_date, category, tags
) VALUES (
  (SELECT id FROM companies WHERE name = 'xAI'),
  'Grok 发布重大更新，新增多项AI功能',
  'Grok团队宣布推出重大产品更新，新增多项AI驱动功能，进一步提升用户体验。新功能包括智能推荐、自动化工作流等。',
  'https://www.theverge.com',
  '2024-08-20',
  '产品发布',
  ARRAY['产品更新', 'AI', '功能']
);


-- 公司 4: Google
INSERT INTO companies (
  name, description, english_description, headquarters, valuation, website, 
  logo_base64, category, is_overseas, founded_year, employee_count, industry
) VALUES (
  'Google',
  'Google''s multimodal AI with 2M token context window, audio overview feature, and advanced reasoning capabilities across text, image, and code Gemini是一个Artificial Intelligence领域的AI工具，在2024-2025年期间获得了9.6分的受欢迎度评分。',
  'Google''s multimodal AI with 2M token context window, audio overview feature, and advanced reasoning capabilities across text, image, and code Gemini is an AI tool in the Artificial Intelligence field, achieving a popularity score of 9.6 during 2024-2025.',
  'San Francisco, USA',
  1118422792,
  'https://gemini.google.com',
  NULL,
  'techGiants',
  true,
  2019,
  '242-342',
  'Artificial Intelligence'
) RETURNING id;

-- 项目: Gemini
INSERT INTO projects (
  company_id, name, description, category, website, pricing_model, 
  target_users, key_features, use_cases
) VALUES (
  (SELECT id FROM companies WHERE name = 'Google'),
  'Gemini',
  'Google''s multimodal AI with 2M token context window, audio overview feature, and advanced reasoning capabilities across text, image, and code',
  'Artificial Intelligence',
  'https://gemini.google.com',
  'Freemium',
  'Developers, Researchers, General Users',
  'AI-powered responses, Natural language processing, Context understanding',
  'General assistance, Research, Problem solving'
);

-- 项目: NotebookLM
INSERT INTO projects (
  company_id, name, description, category, website, pricing_model, 
  target_users, key_features, use_cases
) VALUES (
  (SELECT id FROM companies WHERE name = 'Google'),
  'NotebookLM',
  'Google''s AI note-taking with personal knowledge management and 57% growth in 2024, perfect for research and collaborative learning',
  'Productivity',
  'https://notebooklm.google.com',
  'Freemium',
  'Business Professionals, Students',
  'Task automation, Smart scheduling, Document management',
  'Task management, Document creation, Team collaboration'
);

-- 融资: Seed
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Google'),
  'Seed',
  51000000,
  'Sequoia Capital, Andreessen Horowitz, Accel',
  467000000,
  2020,
  'GV'
);

-- 融资: Series A
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Google'),
  'Series A',
  37000000,
  'Sequoia Capital, Andreessen Horowitz',
  110000000,
  2021,
  'Accel'
);

-- 融资: Series B
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Google'),
  'Series B',
  10000000,
  'Sequoia Capital, Andreessen Horowitz, Accel',
  112000000,
  2022,
  'Andreessen Horowitz'
);

-- 新闻: Gemini 获得新一轮融资，估值大幅提升
INSERT INTO stories (
  company_id, title, summary, source_url, published_date, category, tags
) VALUES (
  (SELECT id FROM companies WHERE name = 'Google'),
  'Gemini 获得新一轮融资，估值大幅提升',
  'Gemini作为Artificial Intelligence领域的领先AI工具，近日宣布完成新一轮融资，估值较上轮提升显著。该轮融资将主要用于产品研发和市场扩张。',
  'https://techcrunch.com',
  '2024-06-15',
  '融资新闻',
  ARRAY['融资', 'AI', '科技']
);

-- 新闻: Gemini 发布重大更新，新增多项AI功能
INSERT INTO stories (
  company_id, title, summary, source_url, published_date, category, tags
) VALUES (
  (SELECT id FROM companies WHERE name = 'Google'),
  'Gemini 发布重大更新，新增多项AI功能',
  'Gemini团队宣布推出重大产品更新，新增多项AI驱动功能，进一步提升用户体验。新功能包括智能推荐、自动化工作流等。',
  'https://www.theverge.com',
  '2024-08-20',
  '产品发布',
  ARRAY['产品更新', 'AI', '功能']
);


-- 公司 5: DeepSeek
INSERT INTO companies (
  name, description, english_description, headquarters, valuation, website, 
  logo_base64, category, is_overseas, founded_year, employee_count, industry
) VALUES (
  'DeepSeek',
  'Fastest growing AI tool with 88.6% popularity increase in 2024, offering advanced reasoning and coding capabilities with competitive performance DeepSeek是一个Artificial Intelligence领域的AI工具，在2024-2025年期间获得了9.2分的受欢迎度评分。',
  'Fastest growing AI tool with 88.6% popularity increase in 2024, offering advanced reasoning and coding capabilities with competitive performance DeepSeek is an AI tool in the Artificial Intelligence field, achieving a popularity score of 9.2 during 2024-2025.',
  'San Francisco, USA',
  692253878,
  'https://www.deepseek.com',
  NULL,
  'techGiants',
  true,
  2019,
  '234-334',
  'Artificial Intelligence'
) RETURNING id;

-- 项目: DeepSeek
INSERT INTO projects (
  company_id, name, description, category, website, pricing_model, 
  target_users, key_features, use_cases
) VALUES (
  (SELECT id FROM companies WHERE name = 'DeepSeek'),
  'DeepSeek',
  'Fastest growing AI tool with 88.6% popularity increase in 2024, offering advanced reasoning and coding capabilities with competitive performance',
  'Artificial Intelligence',
  'https://www.deepseek.com',
  'Freemium',
  'Developers, Researchers, General Users',
  'AI-powered responses, Natural language processing, Context understanding',
  'General assistance, Research, Problem solving'
);

-- 融资: Seed
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'DeepSeek'),
  'Seed',
  41000000,
  'Sequoia Capital, Andreessen Horowitz, Accel',
  381000000,
  2020,
  'Sequoia Capital'
);

-- 融资: Series A
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'DeepSeek'),
  'Series A',
  10000000,
  'Sequoia Capital, Andreessen Horowitz',
  418000000,
  2021,
  'GV'
);

-- 融资: Series B
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'DeepSeek'),
  'Series B',
  58000000,
  'Sequoia Capital, Andreessen Horowitz, Accel',
  340000000,
  2022,
  'Sequoia Capital'
);

-- 新闻: DeepSeek 获得新一轮融资，估值大幅提升
INSERT INTO stories (
  company_id, title, summary, source_url, published_date, category, tags
) VALUES (
  (SELECT id FROM companies WHERE name = 'DeepSeek'),
  'DeepSeek 获得新一轮融资，估值大幅提升',
  'DeepSeek作为Artificial Intelligence领域的领先AI工具，近日宣布完成新一轮融资，估值较上轮提升显著。该轮融资将主要用于产品研发和市场扩张。',
  'https://techcrunch.com',
  '2024-06-15',
  '融资新闻',
  ARRAY['融资', 'AI', '科技']
);

-- 新闻: DeepSeek 发布重大更新，新增多项AI功能
INSERT INTO stories (
  company_id, title, summary, source_url, published_date, category, tags
) VALUES (
  (SELECT id FROM companies WHERE name = 'DeepSeek'),
  'DeepSeek 发布重大更新，新增多项AI功能',
  'DeepSeek团队宣布推出重大产品更新，新增多项AI驱动功能，进一步提升用户体验。新功能包括智能推荐、自动化工作流等。',
  'https://www.theverge.com',
  '2024-08-20',
  '产品发布',
  ARRAY['产品更新', 'AI', '功能']
);


-- 公司 6: Perplexity AI
INSERT INTO companies (
  name, description, english_description, headquarters, valuation, website, 
  logo_base64, category, is_overseas, founded_year, employee_count, industry
) VALUES (
  'Perplexity AI',
  'Conversational search engine with 37.7% growth in 2024, combining web search with AI reasoning for accurate, sourced answers Perplexity AI是一个Artificial Intelligence领域的AI工具，在2024-2025年期间获得了8.9分的受欢迎度评分。',
  'Conversational search engine with 37.7% growth in 2024, combining web search with AI reasoning for accurate, sourced answers Perplexity AI is an AI tool in the Artificial Intelligence field, achieving a popularity score of 8.9 during 2024-2025.',
  'San Francisco, USA',
  458519613,
  'https://www.perplexity.ai',
  NULL,
  'techGiants',
  true,
  2019,
  '228-328',
  'Artificial Intelligence'
) RETURNING id;

-- 项目: Perplexity AI
INSERT INTO projects (
  company_id, name, description, category, website, pricing_model, 
  target_users, key_features, use_cases
) VALUES (
  (SELECT id FROM companies WHERE name = 'Perplexity AI'),
  'Perplexity AI',
  'Conversational search engine with 37.7% growth in 2024, combining web search with AI reasoning for accurate, sourced answers',
  'Artificial Intelligence',
  'https://www.perplexity.ai',
  'Freemium',
  'Developers, Researchers, General Users',
  'AI-powered responses, Natural language processing, Context understanding',
  'General assistance, Research, Problem solving'
);

-- 融资: Seed
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Perplexity AI'),
  'Seed',
  11000000,
  'Sequoia Capital, Andreessen Horowitz, Accel',
  578000000,
  2020,
  'Sequoia Capital'
);

-- 融资: Series A
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Perplexity AI'),
  'Series A',
  18000000,
  'Sequoia Capital, Andreessen Horowitz, Accel',
  253000000,
  2021,
  'Sequoia Capital'
);

-- 新闻: Perplexity AI 获得新一轮融资，估值大幅提升
INSERT INTO stories (
  company_id, title, summary, source_url, published_date, category, tags
) VALUES (
  (SELECT id FROM companies WHERE name = 'Perplexity AI'),
  'Perplexity AI 获得新一轮融资，估值大幅提升',
  'Perplexity AI作为Artificial Intelligence领域的领先AI工具，近日宣布完成新一轮融资，估值较上轮提升显著。该轮融资将主要用于产品研发和市场扩张。',
  'https://techcrunch.com',
  '2024-06-15',
  '融资新闻',
  ARRAY['融资', 'AI', '科技']
);

-- 新闻: Perplexity AI 发布重大更新，新增多项AI功能
INSERT INTO stories (
  company_id, title, summary, source_url, published_date, category, tags
) VALUES (
  (SELECT id FROM companies WHERE name = 'Perplexity AI'),
  'Perplexity AI 发布重大更新，新增多项AI功能',
  'Perplexity AI团队宣布推出重大产品更新，新增多项AI驱动功能，进一步提升用户体验。新功能包括智能推荐、自动化工作流等。',
  'https://www.theverge.com',
  '2024-08-20',
  '产品发布',
  ARRAY['产品更新', 'AI', '功能']
);


-- 公司 7: Microsoft
INSERT INTO companies (
  name, description, english_description, headquarters, valuation, website, 
  logo_base64, category, is_overseas, founded_year, employee_count, industry
) VALUES (
  'Microsoft',
  'AI-powered productivity tool and conversational chatbot integrated across Microsoft 365 suite with enterprise-grade security Microsoft Copilot是一个Productivity领域的AI工具，在2024-2025年期间获得了9.1分的受欢迎度评分。',
  'AI-powered productivity tool and conversational chatbot integrated across Microsoft 365 suite with enterprise-grade security Microsoft Copilot is an AI tool in the Productivity field, achieving a popularity score of 9.1 during 2024-2025.',
  'San Francisco, USA',
  995425132,
  'https://copilot.microsoft.com',
  NULL,
  'aiUnicorns',
  true,
  2019,
  '232-332',
  'Artificial Intelligence'
) RETURNING id;

-- 项目: Microsoft Copilot
INSERT INTO projects (
  company_id, name, description, category, website, pricing_model, 
  target_users, key_features, use_cases
) VALUES (
  (SELECT id FROM companies WHERE name = 'Microsoft'),
  'Microsoft Copilot',
  'AI-powered productivity tool and conversational chatbot integrated across Microsoft 365 suite with enterprise-grade security',
  'Productivity',
  'https://copilot.microsoft.com',
  'Freemium',
  'Business Professionals, Students',
  'Task automation, Smart scheduling, Document management',
  'Task management, Document creation, Team collaboration'
);

-- 融资: Seed
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Microsoft'),
  'Seed',
  28000000,
  'Sequoia Capital, Andreessen Horowitz, Accel',
  424000000,
  2020,
  'Sequoia Capital'
);

-- 融资: Series A
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Microsoft'),
  'Series A',
  14000000,
  'Sequoia Capital, Andreessen Horowitz',
  217000000,
  2021,
  'GV'
);

-- 融资: Series B
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Microsoft'),
  'Series B',
  22000000,
  'Sequoia Capital, Andreessen Horowitz, Accel',
  363000000,
  2022,
  'NEA'
);

-- 新闻: Microsoft Copilot 获得新一轮融资，估值大幅提升
INSERT INTO stories (
  company_id, title, summary, source_url, published_date, category, tags
) VALUES (
  (SELECT id FROM companies WHERE name = 'Microsoft'),
  'Microsoft Copilot 获得新一轮融资，估值大幅提升',
  'Microsoft Copilot作为Productivity领域的领先AI工具，近日宣布完成新一轮融资，估值较上轮提升显著。该轮融资将主要用于产品研发和市场扩张。',
  'https://techcrunch.com',
  '2024-06-15',
  '融资新闻',
  ARRAY['融资', 'AI', '科技']
);


-- 公司 8: Cursor
INSERT INTO companies (
  name, description, english_description, headquarters, valuation, website, 
  logo_base64, category, is_overseas, founded_year, employee_count, industry
) VALUES (
  'Cursor',
  'AI-powered IDE for writing code with 56% growth in 2024, featuring intelligent code completion, chat-based programming, and pair programming Cursor是一个Developer Tools领域的AI工具，在2024-2025年期间获得了8.8分的受欢迎度评分。',
  'AI-powered IDE for writing code with 56% growth in 2024, featuring intelligent code completion, chat-based programming, and pair programming Cursor is an AI tool in the Developer Tools field, achieving a popularity score of 8.8 during 2024-2025.',
  'San Francisco, USA',
  489137865,
  'https://cursor.sh',
  NULL,
  'aiUnicorns',
  true,
  2019,
  '226-326',
  'Artificial Intelligence'
) RETURNING id;

-- 项目: Cursor
INSERT INTO projects (
  company_id, name, description, category, website, pricing_model, 
  target_users, key_features, use_cases
) VALUES (
  (SELECT id FROM companies WHERE name = 'Cursor'),
  'Cursor',
  'AI-powered IDE for writing code with 56% growth in 2024, featuring intelligent code completion, chat-based programming, and pair programming',
  'Developer Tools',
  'https://cursor.sh',
  'Freemium',
  'Software Developers, Engineers',
  'Code completion, Debugging assistance, API integration',
  'Code development, Testing, Deployment'
);

-- 融资: Seed
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Cursor'),
  'Seed',
  32000000,
  'Sequoia Capital',
  212000000,
  2020,
  'Andreessen Horowitz'
);

-- 融资: Series A
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Cursor'),
  'Series A',
  59000000,
  'Sequoia Capital, Andreessen Horowitz, Accel',
  456000000,
  2021,
  'NEA'
);

-- 新闻: Cursor 获得新一轮融资，估值大幅提升
INSERT INTO stories (
  company_id, title, summary, source_url, published_date, category, tags
) VALUES (
  (SELECT id FROM companies WHERE name = 'Cursor'),
  'Cursor 获得新一轮融资，估值大幅提升',
  'Cursor作为Developer Tools领域的领先AI工具，近日宣布完成新一轮融资，估值较上轮提升显著。该轮融资将主要用于产品研发和市场扩张。',
  'https://techcrunch.com',
  '2024-06-15',
  '融资新闻',
  ARRAY['融资', 'AI', '科技']
);

-- 新闻: Cursor 发布重大更新，新增多项AI功能
INSERT INTO stories (
  company_id, title, summary, source_url, published_date, category, tags
) VALUES (
  (SELECT id FROM companies WHERE name = 'Cursor'),
  'Cursor 发布重大更新，新增多项AI功能',
  'Cursor团队宣布推出重大产品更新，新增多项AI驱动功能，进一步提升用户体验。新功能包括智能推荐、自动化工作流等。',
  'https://www.theverge.com',
  '2024-08-20',
  '产品发布',
  ARRAY['产品更新', 'AI', '功能']
);


-- 公司 9: Synthesia
INSERT INTO companies (
  name, description, english_description, headquarters, valuation, website, 
  logo_base64, category, is_overseas, founded_year, employee_count, industry
) VALUES (
  'Synthesia',
  'Professional AI video generator with photorealistic avatars for corporate training, marketing content, and multilingual videos Synthesia是一个Video领域的AI工具，在2024-2025年期间获得了8.5分的受欢迎度评分。',
  'Professional AI video generator with photorealistic avatars for corporate training, marketing content, and multilingual videos Synthesia is an AI tool in the Video field, achieving a popularity score of 8.5 during 2024-2025.',
  'San Francisco, USA',
  491518741,
  'https://www.synthesia.io',
  NULL,
  'aiUnicorns',
  true,
  2019,
  '220-320',
  'Artificial Intelligence'
) RETURNING id;

-- 项目: Synthesia
INSERT INTO projects (
  company_id, name, description, category, website, pricing_model, 
  target_users, key_features, use_cases
) VALUES (
  (SELECT id FROM companies WHERE name = 'Synthesia'),
  'Synthesia',
  'Professional AI video generator with photorealistic avatars for corporate training, marketing content, and multilingual videos',
  'Video',
  'https://www.synthesia.io',
  'Freemium',
  'Content Creators, Marketers, Educators',
  'AI video generation, Automated editing, Template library',
  'Marketing videos, Educational content, Social media'
);

-- 融资: Seed
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Synthesia'),
  'Seed',
  56000000,
  'Sequoia Capital, Andreessen Horowitz, Accel',
  284000000,
  2020,
  'Andreessen Horowitz'
);

-- 融资: Series A
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Synthesia'),
  'Series A',
  13000000,
  'Sequoia Capital, Andreessen Horowitz',
  354000000,
  2021,
  'GV'
);

-- 新闻: Synthesia 获得新一轮融资，估值大幅提升
INSERT INTO stories (
  company_id, title, summary, source_url, published_date, category, tags
) VALUES (
  (SELECT id FROM companies WHERE name = 'Synthesia'),
  'Synthesia 获得新一轮融资，估值大幅提升',
  'Synthesia作为Video领域的领先AI工具，近日宣布完成新一轮融资，估值较上轮提升显著。该轮融资将主要用于产品研发和市场扩张。',
  'https://techcrunch.com',
  '2024-06-15',
  '融资新闻',
  ARRAY['融资', 'AI', '科技']
);

-- 新闻: Synthesia 发布重大更新，新增多项AI功能
INSERT INTO stories (
  company_id, title, summary, source_url, published_date, category, tags
) VALUES (
  (SELECT id FROM companies WHERE name = 'Synthesia'),
  'Synthesia 发布重大更新，新增多项AI功能',
  'Synthesia团队宣布推出重大产品更新，新增多项AI驱动功能，进一步提升用户体验。新功能包括智能推荐、自动化工作流等。',
  'https://www.theverge.com',
  '2024-08-20',
  '产品发布',
  ARRAY['产品更新', 'AI', '功能']
);


-- 公司 10: Runway
INSERT INTO companies (
  name, description, english_description, headquarters, valuation, website, 
  logo_base64, category, is_overseas, founded_year, employee_count, industry
) VALUES (
  'Runway',
  'Advanced AI video generation and editing platform with Gen-3 model for cinematic video creation and motion graphics Runway是一个Video领域的AI工具，在2024-2025年期间获得了8.6分的受欢迎度评分。',
  'Advanced AI video generation and editing platform with Gen-3 model for cinematic video creation and motion graphics Runway is an AI tool in the Video field, achieving a popularity score of 8.6 during 2024-2025.',
  'San Francisco, USA',
  547687136,
  'https://runwayml.com',
  NULL,
  'aiUnicorns',
  true,
  2019,
  '222-322',
  'Artificial Intelligence'
) RETURNING id;

-- 项目: Runway
INSERT INTO projects (
  company_id, name, description, category, website, pricing_model, 
  target_users, key_features, use_cases
) VALUES (
  (SELECT id FROM companies WHERE name = 'Runway'),
  'Runway',
  'Advanced AI video generation and editing platform with Gen-3 model for cinematic video creation and motion graphics',
  'Video',
  'https://runwayml.com',
  'Freemium',
  'Content Creators, Marketers, Educators',
  'AI video generation, Automated editing, Template library',
  'Marketing videos, Educational content, Social media'
);

-- 融资: Seed
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Runway'),
  'Seed',
  10000000,
  'Sequoia Capital, Andreessen Horowitz',
  594000000,
  2020,
  'Accel'
);

-- 融资: Series A
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Runway'),
  'Series A',
  13000000,
  'Sequoia Capital, Andreessen Horowitz',
  581000000,
  2021,
  'GV'
);

-- 新闻: Runway 获得新一轮融资，估值大幅提升
INSERT INTO stories (
  company_id, title, summary, source_url, published_date, category, tags
) VALUES (
  (SELECT id FROM companies WHERE name = 'Runway'),
  'Runway 获得新一轮融资，估值大幅提升',
  'Runway作为Video领域的领先AI工具，近日宣布完成新一轮融资，估值较上轮提升显著。该轮融资将主要用于产品研发和市场扩张。',
  'https://techcrunch.com',
  '2024-06-15',
  '融资新闻',
  ARRAY['融资', 'AI', '科技']
);

-- 新闻: Runway 发布重大更新，新增多项AI功能
INSERT INTO stories (
  company_id, title, summary, source_url, published_date, category, tags
) VALUES (
  (SELECT id FROM companies WHERE name = 'Runway'),
  'Runway 发布重大更新，新增多项AI功能',
  'Runway团队宣布推出重大产品更新，新增多项AI驱动功能，进一步提升用户体验。新功能包括智能推荐、自动化工作流等。',
  'https://www.theverge.com',
  '2024-08-20',
  '产品发布',
  ARRAY['产品更新', 'AI', '功能']
);


-- 公司 11: OpusClip
INSERT INTO companies (
  name, description, english_description, headquarters, valuation, website, 
  logo_base64, category, is_overseas, founded_year, employee_count, industry
) VALUES (
  'OpusClip',
  'AI-powered tool to break longer videos into engaging social media clips with automatic highlighting and viral score prediction OpusClip是一个Video领域的AI工具，在2024-2025年期间获得了8.2分的受欢迎度评分。',
  'AI-powered tool to break longer videos into engaging social media clips with automatic highlighting and viral score prediction OpusClip is an AI tool in the Video field, achieving a popularity score of 8.2 during 2024-2025.',
  'San Francisco, USA',
  600310137,
  'https://www.opus.pro',
  NULL,
  'aiUnicorns',
  true,
  2019,
  '214-314',
  'Artificial Intelligence'
) RETURNING id;

-- 项目: OpusClip
INSERT INTO projects (
  company_id, name, description, category, website, pricing_model, 
  target_users, key_features, use_cases
) VALUES (
  (SELECT id FROM companies WHERE name = 'OpusClip'),
  'OpusClip',
  'AI-powered tool to break longer videos into engaging social media clips with automatic highlighting and viral score prediction',
  'Video',
  'https://www.opus.pro',
  'Freemium',
  'Content Creators, Marketers, Educators',
  'AI video generation, Automated editing, Template library',
  'Marketing videos, Educational content, Social media'
);

-- 融资: Seed
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'OpusClip'),
  'Seed',
  38000000,
  'Sequoia Capital',
  573000000,
  2020,
  'Andreessen Horowitz'
);

-- 融资: Series A
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'OpusClip'),
  'Series A',
  28000000,
  'Sequoia Capital, Andreessen Horowitz',
  355000000,
  2021,
  'Accel'
);

-- 新闻: OpusClip 获得新一轮融资，估值大幅提升
INSERT INTO stories (
  company_id, title, summary, source_url, published_date, category, tags
) VALUES (
  (SELECT id FROM companies WHERE name = 'OpusClip'),
  'OpusClip 获得新一轮融资，估值大幅提升',
  'OpusClip作为Video领域的领先AI工具，近日宣布完成新一轮融资，估值较上轮提升显著。该轮融资将主要用于产品研发和市场扩张。',
  'https://techcrunch.com',
  '2024-06-15',
  '融资新闻',
  ARRAY['融资', 'AI', '科技']
);


-- 公司 12: Luma AI
INSERT INTO companies (
  name, description, english_description, headquarters, valuation, website, 
  logo_base64, category, is_overseas, founded_year, employee_count, industry
) VALUES (
  'Luma AI',
  '3D model generation and video creation platform with Dream Machine for realistic video synthesis from text prompts Luma AI是一个Video领域的AI工具，在2024-2025年期间获得了8.4分的受欢迎度评分。',
  '3D model generation and video creation platform with Dream Machine for realistic video synthesis from text prompts Luma AI is an AI tool in the Video field, achieving a popularity score of 8.4 during 2024-2025.',
  'San Francisco, USA',
  866320763,
  'https://lumalabs.ai',
  NULL,
  'aiUnicorns',
  true,
  2019,
  '218-318',
  'Artificial Intelligence'
) RETURNING id;

-- 项目: Luma AI
INSERT INTO projects (
  company_id, name, description, category, website, pricing_model, 
  target_users, key_features, use_cases
) VALUES (
  (SELECT id FROM companies WHERE name = 'Luma AI'),
  'Luma AI',
  '3D model generation and video creation platform with Dream Machine for realistic video synthesis from text prompts',
  'Video',
  'https://lumalabs.ai',
  'Freemium',
  'Content Creators, Marketers, Educators',
  'AI video generation, Automated editing, Template library',
  'Marketing videos, Educational content, Social media'
);

-- 融资: Seed
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Luma AI'),
  'Seed',
  59000000,
  'Sequoia Capital',
  540000000,
  2020,
  'Andreessen Horowitz'
);

-- 融资: Series A
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Luma AI'),
  'Series A',
  18000000,
  'Sequoia Capital, Andreessen Horowitz, Accel',
  594000000,
  2021,
  'Sequoia Capital'
);

-- 新闻: Luma AI 获得新一轮融资，估值大幅提升
INSERT INTO stories (
  company_id, title, summary, source_url, published_date, category, tags
) VALUES (
  (SELECT id FROM companies WHERE name = 'Luma AI'),
  'Luma AI 获得新一轮融资，估值大幅提升',
  'Luma AI作为Video领域的领先AI工具，近日宣布完成新一轮融资，估值较上轮提升显著。该轮融资将主要用于产品研发和市场扩张。',
  'https://techcrunch.com',
  '2024-06-15',
  '融资新闻',
  ARRAY['融资', 'AI', '科技']
);


-- 公司 13: HeyGen
INSERT INTO companies (
  name, description, english_description, headquarters, valuation, website, 
  logo_base64, category, is_overseas, founded_year, employee_count, industry
) VALUES (
  'HeyGen',
  'AI avatar video generation platform for creating spokesperson videos with multilingual support and emotion control HeyGen是一个Video领域的AI工具，在2024-2025年期间获得了8.1分的受欢迎度评分。',
  'AI avatar video generation platform for creating spokesperson videos with multilingual support and emotion control HeyGen is an AI tool in the Video field, achieving a popularity score of 8.1 during 2024-2025.',
  'San Francisco, USA',
  1043782988,
  'https://www.heygen.com',
  NULL,
  'aiUnicorns',
  true,
  2019,
  '212-312',
  'Artificial Intelligence'
) RETURNING id;

-- 项目: HeyGen
INSERT INTO projects (
  company_id, name, description, category, website, pricing_model, 
  target_users, key_features, use_cases
) VALUES (
  (SELECT id FROM companies WHERE name = 'HeyGen'),
  'HeyGen',
  'AI avatar video generation platform for creating spokesperson videos with multilingual support and emotion control',
  'Video',
  'https://www.heygen.com',
  'Freemium',
  'Content Creators, Marketers, Educators',
  'AI video generation, Automated editing, Template library',
  'Marketing videos, Educational content, Social media'
);

-- 融资: Seed
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'HeyGen'),
  'Seed',
  56000000,
  'Sequoia Capital, Andreessen Horowitz',
  156000000,
  2020,
  'Sequoia Capital'
);

-- 融资: Series A
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'HeyGen'),
  'Series A',
  16000000,
  'Sequoia Capital',
  411000000,
  2021,
  'Sequoia Capital'
);

-- 新闻: HeyGen 获得新一轮融资，估值大幅提升
INSERT INTO stories (
  company_id, title, summary, source_url, published_date, category, tags
) VALUES (
  (SELECT id FROM companies WHERE name = 'HeyGen'),
  'HeyGen 获得新一轮融资，估值大幅提升',
  'HeyGen作为Video领域的领先AI工具，近日宣布完成新一轮融资，估值较上轮提升显著。该轮融资将主要用于产品研发和市场扩张。',
  'https://techcrunch.com',
  '2024-06-15',
  '融资新闻',
  ARRAY['融资', 'AI', '科技']
);

-- 新闻: HeyGen 发布重大更新，新增多项AI功能
INSERT INTO stories (
  company_id, title, summary, source_url, published_date, category, tags
) VALUES (
  (SELECT id FROM companies WHERE name = 'HeyGen'),
  'HeyGen 发布重大更新，新增多项AI功能',
  'HeyGen团队宣布推出重大产品更新，新增多项AI驱动功能，进一步提升用户体验。新功能包括智能推荐、自动化工作流等。',
  'https://www.theverge.com',
  '2024-08-20',
  '产品发布',
  ARRAY['产品更新', 'AI', '功能']
);


-- 公司 14: ByteDance
INSERT INTO companies (
  name, description, english_description, headquarters, valuation, website, 
  logo_base64, category, is_overseas, founded_year, employee_count, industry
) VALUES (
  'ByteDance',
  'AI video editing platform with automated editing features, background removal, and social media optimization CapCut是一个Video领域的AI工具，在2024-2025年期间获得了8分的受欢迎度评分。',
  'AI video editing platform with automated editing features, background removal, and social media optimization CapCut is an AI tool in the Video field, achieving a popularity score of 8 during 2024-2025.',
  'San Francisco, USA',
  507710717,
  'https://www.capcut.com',
  NULL,
  'aiUnicorns',
  true,
  2019,
  '210-310',
  'Artificial Intelligence'
) RETURNING id;

-- 项目: CapCut
INSERT INTO projects (
  company_id, name, description, category, website, pricing_model, 
  target_users, key_features, use_cases
) VALUES (
  (SELECT id FROM companies WHERE name = 'ByteDance'),
  'CapCut',
  'AI video editing platform with automated editing features, background removal, and social media optimization',
  'Video',
  'https://www.capcut.com',
  'Freemium',
  'Content Creators, Marketers, Educators',
  'AI video generation, Automated editing, Template library',
  'Marketing videos, Educational content, Social media'
);

-- 融资: Seed
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'ByteDance'),
  'Seed',
  29000000,
  'Sequoia Capital, Andreessen Horowitz',
  245000000,
  2020,
  'GV'
);

-- 融资: Series A
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'ByteDance'),
  'Series A',
  37000000,
  'Sequoia Capital',
  323000000,
  2021,
  'Andreessen Horowitz'
);

-- 新闻: CapCut 获得新一轮融资，估值大幅提升
INSERT INTO stories (
  company_id, title, summary, source_url, published_date, category, tags
) VALUES (
  (SELECT id FROM companies WHERE name = 'ByteDance'),
  'CapCut 获得新一轮融资，估值大幅提升',
  'CapCut作为Video领域的领先AI工具，近日宣布完成新一轮融资，估值较上轮提升显著。该轮融资将主要用于产品研发和市场扩张。',
  'https://techcrunch.com',
  '2024-06-15',
  '融资新闻',
  ARRAY['融资', 'AI', '科技']
);

-- 新闻: CapCut 发布重大更新，新增多项AI功能
INSERT INTO stories (
  company_id, title, summary, source_url, published_date, category, tags
) VALUES (
  (SELECT id FROM companies WHERE name = 'ByteDance'),
  'CapCut 发布重大更新，新增多项AI功能',
  'CapCut团队宣布推出重大产品更新，新增多项AI驱动功能，进一步提升用户体验。新功能包括智能推荐、自动化工作流等。',
  'https://www.theverge.com',
  '2024-08-20',
  '产品发布',
  ARRAY['产品更新', 'AI', '功能']
);


-- 公司 15: Pictory
INSERT INTO companies (
  name, description, english_description, headquarters, valuation, website, 
  logo_base64, category, is_overseas, founded_year, employee_count, industry
) VALUES (
  'Pictory',
  'AI video creation platform that transforms text articles and blog posts into engaging video content with voiceovers Pictory是一个Video领域的AI工具，在2024-2025年期间获得了7.9分的受欢迎度评分。',
  'AI video creation platform that transforms text articles and blog posts into engaging video content with voiceovers Pictory is an AI tool in the Video field, achieving a popularity score of 7.9 during 2024-2025.',
  'San Francisco, USA',
  941363663,
  'https://pictory.ai',
  NULL,
  'aiUnicorns',
  true,
  2018,
  '208-308',
  'Artificial Intelligence'
) RETURNING id;

-- 项目: Pictory
INSERT INTO projects (
  company_id, name, description, category, website, pricing_model, 
  target_users, key_features, use_cases
) VALUES (
  (SELECT id FROM companies WHERE name = 'Pictory'),
  'Pictory',
  'AI video creation platform that transforms text articles and blog posts into engaging video content with voiceovers',
  'Video',
  'https://pictory.ai',
  'Freemium',
  'Content Creators, Marketers, Educators',
  'AI video generation, Automated editing, Template library',
  'Marketing videos, Educational content, Social media'
);

-- 融资: Seed
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Pictory'),
  'Seed',
  29000000,
  'Sequoia Capital, Andreessen Horowitz',
  557000000,
  2020,
  'Accel'
);

-- 融资: Series A
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Pictory'),
  'Series A',
  34000000,
  'Sequoia Capital',
  368000000,
  2021,
  'NEA'
);

-- 新闻: Pictory 获得新一轮融资，估值大幅提升
INSERT INTO stories (
  company_id, title, summary, source_url, published_date, category, tags
) VALUES (
  (SELECT id FROM companies WHERE name = 'Pictory'),
  'Pictory 获得新一轮融资，估值大幅提升',
  'Pictory作为Video领域的领先AI工具，近日宣布完成新一轮融资，估值较上轮提升显著。该轮融资将主要用于产品研发和市场扩张。',
  'https://techcrunch.com',
  '2024-06-15',
  '融资新闻',
  ARRAY['融资', 'AI', '科技']
);

-- 新闻: Pictory 发布重大更新，新增多项AI功能
INSERT INTO stories (
  company_id, title, summary, source_url, published_date, category, tags
) VALUES (
  (SELECT id FROM companies WHERE name = 'Pictory'),
  'Pictory 发布重大更新，新增多项AI功能',
  'Pictory团队宣布推出重大产品更新，新增多项AI驱动功能，进一步提升用户体验。新功能包括智能推荐、自动化工作流等。',
  'https://www.theverge.com',
  '2024-08-20',
  '产品发布',
  ARRAY['产品更新', 'AI', '功能']
);


-- 公司 16: InVideo
INSERT INTO companies (
  name, description, english_description, headquarters, valuation, website, 
  logo_base64, category, is_overseas, founded_year, employee_count, industry
) VALUES (
  'InVideo',
  'Comprehensive AI video generator with 5000+ templates and automated video creation workflows for marketing InVideo是一个Video领域的AI工具，在2024-2025年期间获得了7.8分的受欢迎度评分。',
  'Comprehensive AI video generator with 5000+ templates and automated video creation workflows for marketing InVideo is an AI tool in the Video field, achieving a popularity score of 7.8 during 2024-2025.',
  'San Francisco, USA',
  1148424471,
  'https://invideo.io',
  NULL,
  'aiUnicorns',
  true,
  2018,
  '206-306',
  'Artificial Intelligence'
) RETURNING id;

-- 项目: InVideo
INSERT INTO projects (
  company_id, name, description, category, website, pricing_model, 
  target_users, key_features, use_cases
) VALUES (
  (SELECT id FROM companies WHERE name = 'InVideo'),
  'InVideo',
  'Comprehensive AI video generator with 5000+ templates and automated video creation workflows for marketing',
  'Video',
  'https://invideo.io',
  'Freemium',
  'Content Creators, Marketers, Educators',
  'AI video generation, Automated editing, Template library',
  'Marketing videos, Educational content, Social media'
);

-- 融资: Seed
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'InVideo'),
  'Seed',
  36000000,
  'Sequoia Capital, Andreessen Horowitz',
  105000000,
  2020,
  'GV'
);

-- 融资: Series A
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'InVideo'),
  'Series A',
  50000000,
  'Sequoia Capital',
  350000000,
  2021,
  'Accel'
);

-- 新闻: InVideo 获得新一轮融资，估值大幅提升
INSERT INTO stories (
  company_id, title, summary, source_url, published_date, category, tags
) VALUES (
  (SELECT id FROM companies WHERE name = 'InVideo'),
  'InVideo 获得新一轮融资，估值大幅提升',
  'InVideo作为Video领域的领先AI工具，近日宣布完成新一轮融资，估值较上轮提升显著。该轮融资将主要用于产品研发和市场扩张。',
  'https://techcrunch.com',
  '2024-06-15',
  '融资新闻',
  ARRAY['融资', 'AI', '科技']
);

-- 新闻: InVideo 发布重大更新，新增多项AI功能
INSERT INTO stories (
  company_id, title, summary, source_url, published_date, category, tags
) VALUES (
  (SELECT id FROM companies WHERE name = 'InVideo'),
  'InVideo 发布重大更新，新增多项AI功能',
  'InVideo团队宣布推出重大产品更新，新增多项AI驱动功能，进一步提升用户体验。新功能包括智能推荐、自动化工作流等。',
  'https://www.theverge.com',
  '2024-08-20',
  '产品发布',
  ARRAY['产品更新', 'AI', '功能']
);


-- 公司 17: Descript
INSERT INTO companies (
  name, description, english_description, headquarters, valuation, website, 
  logo_base64, category, is_overseas, founded_year, employee_count, industry
) VALUES (
  'Descript',
  'All-in-one AI video editor with transcription, overdub voice cloning, and collaborative editing features Descript是一个Video领域的AI工具，在2024-2025年期间获得了8.3分的受欢迎度评分。',
  'All-in-one AI video editor with transcription, overdub voice cloning, and collaborative editing features Descript is an AI tool in the Video field, achieving a popularity score of 8.3 during 2024-2025.',
  'San Francisco, USA',
  1070159128,
  'https://www.descript.com',
  NULL,
  'aiUnicorns',
  true,
  2019,
  '216-316',
  'Artificial Intelligence'
) RETURNING id;

-- 项目: Descript
INSERT INTO projects (
  company_id, name, description, category, website, pricing_model, 
  target_users, key_features, use_cases
) VALUES (
  (SELECT id FROM companies WHERE name = 'Descript'),
  'Descript',
  'All-in-one AI video editor with transcription, overdub voice cloning, and collaborative editing features',
  'Video',
  'https://www.descript.com',
  'Freemium',
  'Content Creators, Marketers, Educators',
  'AI video generation, Automated editing, Template library',
  'Marketing videos, Educational content, Social media'
);

-- 融资: Seed
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Descript'),
  'Seed',
  54000000,
  'Sequoia Capital, Andreessen Horowitz, Accel',
  587000000,
  2020,
  'Sequoia Capital'
);

-- 融资: Series A
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Descript'),
  'Series A',
  49000000,
  'Sequoia Capital, Andreessen Horowitz, Accel',
  422000000,
  2021,
  'Andreessen Horowitz'
);

-- 新闻: Descript 获得新一轮融资，估值大幅提升
INSERT INTO stories (
  company_id, title, summary, source_url, published_date, category, tags
) VALUES (
  (SELECT id FROM companies WHERE name = 'Descript'),
  'Descript 获得新一轮融资，估值大幅提升',
  'Descript作为Video领域的领先AI工具，近日宣布完成新一轮融资，估值较上轮提升显著。该轮融资将主要用于产品研发和市场扩张。',
  'https://techcrunch.com',
  '2024-06-15',
  '融资新闻',
  ARRAY['融资', 'AI', '科技']
);


-- 公司 18: Fliki
INSERT INTO companies (
  name, description, english_description, headquarters, valuation, website, 
  logo_base64, category, is_overseas, founded_year, employee_count, industry
) VALUES (
  'Fliki',
  'AI video creation platform that converts text to video with realistic AI voices in multiple languages Fliki是一个Video领域的AI工具，在2024-2025年期间获得了7.7分的受欢迎度评分。',
  'AI video creation platform that converts text to video with realistic AI voices in multiple languages Fliki is an AI tool in the Video field, achieving a popularity score of 7.7 during 2024-2025.',
  'San Francisco, USA',
  785429133,
  'https://fliki.ai',
  NULL,
  'aiUnicorns',
  true,
  2018,
  '204-304',
  'Artificial Intelligence'
) RETURNING id;

-- 项目: Fliki
INSERT INTO projects (
  company_id, name, description, category, website, pricing_model, 
  target_users, key_features, use_cases
) VALUES (
  (SELECT id FROM companies WHERE name = 'Fliki'),
  'Fliki',
  'AI video creation platform that converts text to video with realistic AI voices in multiple languages',
  'Video',
  'https://fliki.ai',
  'Freemium',
  'Content Creators, Marketers, Educators',
  'AI video generation, Automated editing, Template library',
  'Marketing videos, Educational content, Social media'
);

-- 融资: Seed
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Fliki'),
  'Seed',
  15000000,
  'Sequoia Capital',
  186000000,
  2020,
  'NEA'
);

-- 融资: Series A
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Fliki'),
  'Series A',
  57000000,
  'Sequoia Capital, Andreessen Horowitz, Accel',
  479000000,
  2021,
  'Andreessen Horowitz'
);

-- 新闻: Fliki 获得新一轮融资，估值大幅提升
INSERT INTO stories (
  company_id, title, summary, source_url, published_date, category, tags
) VALUES (
  (SELECT id FROM companies WHERE name = 'Fliki'),
  'Fliki 获得新一轮融资，估值大幅提升',
  'Fliki作为Video领域的领先AI工具，近日宣布完成新一轮融资，估值较上轮提升显著。该轮融资将主要用于产品研发和市场扩张。',
  'https://techcrunch.com',
  '2024-06-15',
  '融资新闻',
  ARRAY['融资', 'AI', '科技']
);


-- 公司 19: Steve
INSERT INTO companies (
  name, description, english_description, headquarters, valuation, website, 
  logo_base64, category, is_overseas, founded_year, employee_count, industry
) VALUES (
  'Steve',
  'AI video maker that creates animated and live-action videos from text scripts with customizable characters Steve AI是一个Video领域的AI工具，在2024-2025年期间获得了7.5分的受欢迎度评分。',
  'AI video maker that creates animated and live-action videos from text scripts with customizable characters Steve AI is an AI tool in the Video field, achieving a popularity score of 7.5 during 2024-2025.',
  'San Francisco, USA',
  730411041,
  'https://www.steve.ai',
  NULL,
  'aiUnicorns',
  true,
  2018,
  '200-300',
  'Artificial Intelligence'
) RETURNING id;

-- 项目: Steve AI
INSERT INTO projects (
  company_id, name, description, category, website, pricing_model, 
  target_users, key_features, use_cases
) VALUES (
  (SELECT id FROM companies WHERE name = 'Steve'),
  'Steve AI',
  'AI video maker that creates animated and live-action videos from text scripts with customizable characters',
  'Video',
  'https://www.steve.ai',
  'Freemium',
  'Content Creators, Marketers, Educators',
  'AI video generation, Automated editing, Template library',
  'Marketing videos, Educational content, Social media'
);

-- 融资: Seed
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Steve'),
  'Seed',
  57000000,
  'Sequoia Capital',
  223000000,
  2020,
  'Andreessen Horowitz'
);

-- 融资: Series A
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Steve'),
  'Series A',
  35000000,
  'Sequoia Capital, Andreessen Horowitz',
  233000000,
  2021,
  'Accel'
);

-- 新闻: Steve AI 获得新一轮融资，估值大幅提升
INSERT INTO stories (
  company_id, title, summary, source_url, published_date, category, tags
) VALUES (
  (SELECT id FROM companies WHERE name = 'Steve'),
  'Steve AI 获得新一轮融资，估值大幅提升',
  'Steve AI作为Video领域的领先AI工具，近日宣布完成新一轮融资，估值较上轮提升显著。该轮融资将主要用于产品研发和市场扩张。',
  'https://techcrunch.com',
  '2024-06-15',
  '融资新闻',
  ARRAY['融资', 'AI', '科技']
);

-- 新闻: Steve AI 发布重大更新，新增多项AI功能
INSERT INTO stories (
  company_id, title, summary, source_url, published_date, category, tags
) VALUES (
  (SELECT id FROM companies WHERE name = 'Steve'),
  'Steve AI 发布重大更新，新增多项AI功能',
  'Steve AI团队宣布推出重大产品更新，新增多项AI驱动功能，进一步提升用户体验。新功能包括智能推荐、自动化工作流等。',
  'https://www.theverge.com',
  '2024-08-20',
  '产品发布',
  ARRAY['产品更新', 'AI', '功能']
);


-- 公司 20: Filmora
INSERT INTO companies (
  name, description, english_description, headquarters, valuation, website, 
  logo_base64, category, is_overseas, founded_year, employee_count, industry
) VALUES (
  'Filmora',
  'AI-powered video editing software with automatic scene detection, smart cutout, and AI music generation Wondershare Filmora是一个Video领域的AI工具，在2024-2025年期间获得了7.6分的受欢迎度评分。',
  'AI-powered video editing software with automatic scene detection, smart cutout, and AI music generation Wondershare Filmora is an AI tool in the Video field, achieving a popularity score of 7.6 during 2024-2025.',
  'San Francisco, USA',
  1024859226,
  'https://filmora.wondershare.com',
  NULL,
  'aiUnicorns',
  true,
  2018,
  '202-302',
  'Artificial Intelligence'
) RETURNING id;

-- 项目: Wondershare Filmora
INSERT INTO projects (
  company_id, name, description, category, website, pricing_model, 
  target_users, key_features, use_cases
) VALUES (
  (SELECT id FROM companies WHERE name = 'Filmora'),
  'Wondershare Filmora',
  'AI-powered video editing software with automatic scene detection, smart cutout, and AI music generation',
  'Video',
  'https://filmora.wondershare.com',
  'Freemium',
  'Content Creators, Marketers, Educators',
  'AI video generation, Automated editing, Template library',
  'Marketing videos, Educational content, Social media'
);

-- 融资: Seed
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Filmora'),
  'Seed',
  55000000,
  'Sequoia Capital',
  101000000,
  2020,
  'Sequoia Capital'
);

-- 融资: Series A
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Filmora'),
  'Series A',
  10000000,
  'Sequoia Capital, Andreessen Horowitz',
  165000000,
  2021,
  'Andreessen Horowitz'
);

-- 新闻: Wondershare Filmora 获得新一轮融资，估值大幅提升
INSERT INTO stories (
  company_id, title, summary, source_url, published_date, category, tags
) VALUES (
  (SELECT id FROM companies WHERE name = 'Filmora'),
  'Wondershare Filmora 获得新一轮融资，估值大幅提升',
  'Wondershare Filmora作为Video领域的领先AI工具，近日宣布完成新一轮融资，估值较上轮提升显著。该轮融资将主要用于产品研发和市场扩张。',
  'https://techcrunch.com',
  '2024-06-15',
  '融资新闻',
  ARRAY['融资', 'AI', '科技']
);

-- 新闻: Wondershare Filmora 发布重大更新，新增多项AI功能
INSERT INTO stories (
  company_id, title, summary, source_url, published_date, category, tags
) VALUES (
  (SELECT id FROM companies WHERE name = 'Filmora'),
  'Wondershare Filmora 发布重大更新，新增多项AI功能',
  'Wondershare Filmora团队宣布推出重大产品更新，新增多项AI驱动功能，进一步提升用户体验。新功能包括智能推荐、自动化工作流等。',
  'https://www.theverge.com',
  '2024-08-20',
  '产品发布',
  ARRAY['产品更新', 'AI', '功能']
);


-- 公司 21: Midjourney
INSERT INTO companies (
  name, description, english_description, headquarters, valuation, website, 
  logo_base64, category, is_overseas, founded_year, employee_count, industry
) VALUES (
  'Midjourney',
  'Leading AI image generation platform with painterly aesthetic, advanced prompt engineering, and community-driven improvements Midjourney是一个Design领域的AI工具，在2024-2025年期间获得了9.3分的受欢迎度评分。',
  'Leading AI image generation platform with painterly aesthetic, advanced prompt engineering, and community-driven improvements Midjourney is an AI tool in the Design field, achieving a popularity score of 9.3 during 2024-2025.',
  'San Francisco, USA',
  795211726,
  'https://www.midjourney.com',
  NULL,
  'aiUnicorns',
  true,
  2019,
  '236-336',
  'Artificial Intelligence'
) RETURNING id;

-- 项目: Midjourney
INSERT INTO projects (
  company_id, name, description, category, website, pricing_model, 
  target_users, key_features, use_cases
) VALUES (
  (SELECT id FROM companies WHERE name = 'Midjourney'),
  'Midjourney',
  'Leading AI image generation platform with painterly aesthetic, advanced prompt engineering, and community-driven improvements',
  'Design',
  'https://www.midjourney.com',
  'Freemium',
  'Designers, Artists, Creatives',
  'AI design assistance, Automated layouts, Creative suggestions',
  'Graphic design, UI/UX, Branding'
);

-- 融资: Seed
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Midjourney'),
  'Seed',
  23000000,
  'Sequoia Capital, Andreessen Horowitz',
  142000000,
  2020,
  'Accel'
);

-- 融资: Series A
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Midjourney'),
  'Series A',
  20000000,
  'Sequoia Capital',
  342000000,
  2021,
  'NEA'
);

-- 融资: Series B
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Midjourney'),
  'Series B',
  25000000,
  'Sequoia Capital, Andreessen Horowitz',
  108000000,
  2022,
  'NEA'
);

-- 新闻: Midjourney 获得新一轮融资，估值大幅提升
INSERT INTO stories (
  company_id, title, summary, source_url, published_date, category, tags
) VALUES (
  (SELECT id FROM companies WHERE name = 'Midjourney'),
  'Midjourney 获得新一轮融资，估值大幅提升',
  'Midjourney作为Design领域的领先AI工具，近日宣布完成新一轮融资，估值较上轮提升显著。该轮融资将主要用于产品研发和市场扩张。',
  'https://techcrunch.com',
  '2024-06-15',
  '融资新闻',
  ARRAY['融资', 'AI', '科技']
);


-- 公司 22: Leonardo
INSERT INTO companies (
  name, description, english_description, headquarters, valuation, website, 
  logo_base64, category, is_overseas, founded_year, employee_count, industry
) VALUES (
  'Leonardo',
  'Advanced AI image generation platform with fine-tuned models for different artistic styles and commercial use rights Leonardo是一个Design领域的AI工具，在2024-2025年期间获得了8.3分的受欢迎度评分。',
  'Advanced AI image generation platform with fine-tuned models for different artistic styles and commercial use rights Leonardo is an AI tool in the Design field, achieving a popularity score of 8.3 during 2024-2025.',
  'San Francisco, USA',
  658521429,
  'https://leonardo.ai',
  NULL,
  'aiUnicorns',
  true,
  2019,
  '216-316',
  'Artificial Intelligence'
) RETURNING id;

-- 项目: Leonardo
INSERT INTO projects (
  company_id, name, description, category, website, pricing_model, 
  target_users, key_features, use_cases
) VALUES (
  (SELECT id FROM companies WHERE name = 'Leonardo'),
  'Leonardo',
  'Advanced AI image generation platform with fine-tuned models for different artistic styles and commercial use rights',
  'Design',
  'https://leonardo.ai',
  'Freemium',
  'Designers, Artists, Creatives',
  'AI design assistance, Automated layouts, Creative suggestions',
  'Graphic design, UI/UX, Branding'
);

-- 融资: Seed
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Leonardo'),
  'Seed',
  35000000,
  'Sequoia Capital, Andreessen Horowitz',
  561000000,
  2020,
  'Accel'
);

-- 融资: Series A
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Leonardo'),
  'Series A',
  54000000,
  'Sequoia Capital',
  340000000,
  2021,
  'GV'
);

-- 新闻: Leonardo 获得新一轮融资，估值大幅提升
INSERT INTO stories (
  company_id, title, summary, source_url, published_date, category, tags
) VALUES (
  (SELECT id FROM companies WHERE name = 'Leonardo'),
  'Leonardo 获得新一轮融资，估值大幅提升',
  'Leonardo作为Design领域的领先AI工具，近日宣布完成新一轮融资，估值较上轮提升显著。该轮融资将主要用于产品研发和市场扩张。',
  'https://techcrunch.com',
  '2024-06-15',
  '融资新闻',
  ARRAY['融资', 'AI', '科技']
);


-- 公司 23: Canva
INSERT INTO companies (
  name, description, english_description, headquarters, valuation, website, 
  logo_base64, category, is_overseas, founded_year, employee_count, industry
) VALUES (
  'Canva',
  'AI-powered design suite with automated design generation, background removal, and smart editing features Canva Magic Studio是一个Design领域的AI工具，在2024-2025年期间获得了8.4分的受欢迎度评分。',
  'AI-powered design suite with automated design generation, background removal, and smart editing features Canva Magic Studio is an AI tool in the Design field, achieving a popularity score of 8.4 during 2024-2025.',
  'San Francisco, USA',
  576938025,
  'https://www.canva.com/magic-studio',
  NULL,
  'aiUnicorns',
  true,
  2019,
  '218-318',
  'Artificial Intelligence'
) RETURNING id;

-- 项目: Canva Magic Studio
INSERT INTO projects (
  company_id, name, description, category, website, pricing_model, 
  target_users, key_features, use_cases
) VALUES (
  (SELECT id FROM companies WHERE name = 'Canva'),
  'Canva Magic Studio',
  'AI-powered design suite with automated design generation, background removal, and smart editing features',
  'Design',
  'https://www.canva.com/magic-studio',
  'Freemium',
  'Designers, Artists, Creatives',
  'AI design assistance, Automated layouts, Creative suggestions',
  'Graphic design, UI/UX, Branding'
);

-- 融资: Seed
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Canva'),
  'Seed',
  47000000,
  'Sequoia Capital',
  191000000,
  2020,
  'Sequoia Capital'
);

-- 融资: Series A
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Canva'),
  'Series A',
  25000000,
  'Sequoia Capital, Andreessen Horowitz, Accel',
  548000000,
  2021,
  'Accel'
);

-- 新闻: Canva Magic Studio 获得新一轮融资，估值大幅提升
INSERT INTO stories (
  company_id, title, summary, source_url, published_date, category, tags
) VALUES (
  (SELECT id FROM companies WHERE name = 'Canva'),
  'Canva Magic Studio 获得新一轮融资，估值大幅提升',
  'Canva Magic Studio作为Design领域的领先AI工具，近日宣布完成新一轮融资，估值较上轮提升显著。该轮融资将主要用于产品研发和市场扩张。',
  'https://techcrunch.com',
  '2024-06-15',
  '融资新闻',
  ARRAY['融资', 'AI', '科技']
);


-- 公司 24: Remove
INSERT INTO companies (
  name, description, english_description, headquarters, valuation, website, 
  logo_base64, category, is_overseas, founded_year, employee_count, industry
) VALUES (
  'Remove',
  'AI background removal tool with instant processing for professional photo editing and batch processing Remove.bg是一个Design领域的AI工具，在2024-2025年期间获得了8.1分的受欢迎度评分。',
  'AI background removal tool with instant processing for professional photo editing and batch processing Remove.bg is an AI tool in the Design field, achieving a popularity score of 8.1 during 2024-2025.',
  'Beijing, China',
  1066998456,
  'https://www.remove.bg',
  NULL,
  'domesticUnicorns',
  false,
  2019,
  '212-312',
  'Artificial Intelligence'
) RETURNING id;

-- 项目: Remove.bg
INSERT INTO projects (
  company_id, name, description, category, website, pricing_model, 
  target_users, key_features, use_cases
) VALUES (
  (SELECT id FROM companies WHERE name = 'Remove'),
  'Remove.bg',
  'AI background removal tool with instant processing for professional photo editing and batch processing',
  'Design',
  'https://www.remove.bg',
  'Freemium',
  'Designers, Artists, Creatives',
  'AI design assistance, Automated layouts, Creative suggestions',
  'Graphic design, UI/UX, Branding'
);

-- 融资: Seed
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Remove'),
  'Seed',
  22000000,
  'Sequoia Capital, Andreessen Horowitz',
  529000000,
  2020,
  'GV'
);

-- 融资: Series A
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Remove'),
  'Series A',
  24000000,
  'Sequoia Capital, Andreessen Horowitz',
  221000000,
  2021,
  'NEA'
);

-- 新闻: Remove.bg 获得新一轮融资，估值大幅提升
INSERT INTO stories (
  company_id, title, summary, source_url, published_date, category, tags
) VALUES (
  (SELECT id FROM companies WHERE name = 'Remove'),
  'Remove.bg 获得新一轮融资，估值大幅提升',
  'Remove.bg作为Design领域的领先AI工具，近日宣布完成新一轮融资，估值较上轮提升显著。该轮融资将主要用于产品研发和市场扩张。',
  'https://techcrunch.com',
  '2024-06-15',
  '融资新闻',
  ARRAY['融资', 'AI', '科技']
);

-- 新闻: Remove.bg 发布重大更新，新增多项AI功能
INSERT INTO stories (
  company_id, title, summary, source_url, published_date, category, tags
) VALUES (
  (SELECT id FROM companies WHERE name = 'Remove'),
  'Remove.bg 发布重大更新，新增多项AI功能',
  'Remove.bg团队宣布推出重大产品更新，新增多项AI驱动功能，进一步提升用户体验。新功能包括智能推荐、自动化工作流等。',
  'https://www.theverge.com',
  '2024-08-20',
  '产品发布',
  ARRAY['产品更新', 'AI', '功能']
);


-- 公司 25: Firefly
INSERT INTO companies (
  name, description, english_description, headquarters, valuation, website, 
  logo_base64, category, is_overseas, founded_year, employee_count, industry
) VALUES (
  'Firefly',
  'Adobe''s AI image generation and editing suite integrated into Creative Cloud with commercial safety guarantees Adobe Firefly是一个Design领域的AI工具，在2024-2025年期间获得了8.5分的受欢迎度评分。',
  'Adobe''s AI image generation and editing suite integrated into Creative Cloud with commercial safety guarantees Adobe Firefly is an AI tool in the Design field, achieving a popularity score of 8.5 during 2024-2025.',
  'San Francisco, USA',
  903298667,
  'https://firefly.adobe.com',
  NULL,
  'aiUnicorns',
  true,
  2019,
  '220-320',
  'Artificial Intelligence'
) RETURNING id;

-- 项目: Adobe Firefly
INSERT INTO projects (
  company_id, name, description, category, website, pricing_model, 
  target_users, key_features, use_cases
) VALUES (
  (SELECT id FROM companies WHERE name = 'Firefly'),
  'Adobe Firefly',
  'Adobe''s AI image generation and editing suite integrated into Creative Cloud with commercial safety guarantees',
  'Design',
  'https://firefly.adobe.com',
  'Freemium',
  'Designers, Artists, Creatives',
  'AI design assistance, Automated layouts, Creative suggestions',
  'Graphic design, UI/UX, Branding'
);

-- 融资: Seed
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Firefly'),
  'Seed',
  46000000,
  'Sequoia Capital',
  537000000,
  2020,
  'Accel'
);

-- 融资: Series A
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Firefly'),
  'Series A',
  10000000,
  'Sequoia Capital, Andreessen Horowitz, Accel',
  510000000,
  2021,
  'NEA'
);

-- 新闻: Adobe Firefly 获得新一轮融资，估值大幅提升
INSERT INTO stories (
  company_id, title, summary, source_url, published_date, category, tags
) VALUES (
  (SELECT id FROM companies WHERE name = 'Firefly'),
  'Adobe Firefly 获得新一轮融资，估值大幅提升',
  'Adobe Firefly作为Design领域的领先AI工具，近日宣布完成新一轮融资，估值较上轮提升显著。该轮融资将主要用于产品研发和市场扩张。',
  'https://techcrunch.com',
  '2024-06-15',
  '融资新闻',
  ARRAY['融资', 'AI', '科技']
);

-- 新闻: Adobe Firefly 发布重大更新，新增多项AI功能
INSERT INTO stories (
  company_id, title, summary, source_url, published_date, category, tags
) VALUES (
  (SELECT id FROM companies WHERE name = 'Firefly'),
  'Adobe Firefly 发布重大更新，新增多项AI功能',
  'Adobe Firefly团队宣布推出重大产品更新，新增多项AI驱动功能，进一步提升用户体验。新功能包括智能推荐、自动化工作流等。',
  'https://www.theverge.com',
  '2024-08-20',
  '产品发布',
  ARRAY['产品更新', 'AI', '功能']
);


-- 公司 26: Stability
INSERT INTO companies (
  name, description, english_description, headquarters, valuation, website, 
  logo_base64, category, is_overseas, founded_year, employee_count, industry
) VALUES (
  'Stability',
  'Open-source AI image generation model with community-driven improvements, ControlNet support, and unlimited customizations Stable Diffusion是一个Design领域的AI工具，在2024-2025年期间获得了8.7分的受欢迎度评分。',
  'Open-source AI image generation model with community-driven improvements, ControlNet support, and unlimited customizations Stable Diffusion is an AI tool in the Design field, achieving a popularity score of 8.7 during 2024-2025.',
  'San Francisco, USA',
  987154968,
  'https://stability.ai/stable-diffusion',
  NULL,
  'aiUnicorns',
  true,
  2019,
  '224-324',
  'Artificial Intelligence'
) RETURNING id;

-- 项目: Stable Diffusion
INSERT INTO projects (
  company_id, name, description, category, website, pricing_model, 
  target_users, key_features, use_cases
) VALUES (
  (SELECT id FROM companies WHERE name = 'Stability'),
  'Stable Diffusion',
  'Open-source AI image generation model with community-driven improvements, ControlNet support, and unlimited customizations',
  'Design',
  'https://stability.ai/stable-diffusion',
  'Freemium',
  'Designers, Artists, Creatives',
  'AI design assistance, Automated layouts, Creative suggestions',
  'Graphic design, UI/UX, Branding'
);

-- 融资: Seed
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Stability'),
  'Seed',
  54000000,
  'Sequoia Capital',
  535000000,
  2020,
  'GV'
);

-- 融资: Series A
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Stability'),
  'Series A',
  31000000,
  'Sequoia Capital, Andreessen Horowitz',
  145000000,
  2021,
  'Accel'
);

-- 新闻: Stable Diffusion 获得新一轮融资，估值大幅提升
INSERT INTO stories (
  company_id, title, summary, source_url, published_date, category, tags
) VALUES (
  (SELECT id FROM companies WHERE name = 'Stability'),
  'Stable Diffusion 获得新一轮融资，估值大幅提升',
  'Stable Diffusion作为Design领域的领先AI工具，近日宣布完成新一轮融资，估值较上轮提升显著。该轮融资将主要用于产品研发和市场扩张。',
  'https://techcrunch.com',
  '2024-06-15',
  '融资新闻',
  ARRAY['融资', 'AI', '科技']
);


-- 公司 27: Openai
INSERT INTO companies (
  name, description, english_description, headquarters, valuation, website, 
  logo_base64, category, is_overseas, founded_year, employee_count, industry
) VALUES (
  'Openai',
  'OpenAI''s latest image generation model integrated with ChatGPT, offering photorealistic and artistic image creation DALL-E 3是一个Design领域的AI工具，在2024-2025年期间获得了8.9分的受欢迎度评分。',
  'OpenAI''s latest image generation model integrated with ChatGPT, offering photorealistic and artistic image creation DALL-E 3 is an AI tool in the Design field, achieving a popularity score of 8.9 during 2024-2025.',
  'San Francisco, USA',
  741774373,
  'https://openai.com/dall-e-3',
  NULL,
  'aiUnicorns',
  true,
  2019,
  '228-328',
  'Artificial Intelligence'
) RETURNING id;

-- 项目: DALL-E 3
INSERT INTO projects (
  company_id, name, description, category, website, pricing_model, 
  target_users, key_features, use_cases
) VALUES (
  (SELECT id FROM companies WHERE name = 'Openai'),
  'DALL-E 3',
  'OpenAI''s latest image generation model integrated with ChatGPT, offering photorealistic and artistic image creation',
  'Design',
  'https://openai.com/dall-e-3',
  'Freemium',
  'Designers, Artists, Creatives',
  'AI design assistance, Automated layouts, Creative suggestions',
  'Graphic design, UI/UX, Branding'
);

-- 融资: Seed
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Openai'),
  'Seed',
  40000000,
  'Sequoia Capital',
  128000000,
  2020,
  'Accel'
);

-- 融资: Series A
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Openai'),
  'Series A',
  38000000,
  'Sequoia Capital',
  497000000,
  2021,
  'Accel'
);

-- 新闻: DALL-E 3 获得新一轮融资，估值大幅提升
INSERT INTO stories (
  company_id, title, summary, source_url, published_date, category, tags
) VALUES (
  (SELECT id FROM companies WHERE name = 'Openai'),
  'DALL-E 3 获得新一轮融资，估值大幅提升',
  'DALL-E 3作为Design领域的领先AI工具，近日宣布完成新一轮融资，估值较上轮提升显著。该轮融资将主要用于产品研发和市场扩张。',
  'https://techcrunch.com',
  '2024-06-15',
  '融资新闻',
  ARRAY['融资', 'AI', '科技']
);


-- 公司 28: Figma
INSERT INTO companies (
  name, description, english_description, headquarters, valuation, website, 
  logo_base64, category, is_overseas, founded_year, employee_count, industry
) VALUES (
  'Figma',
  'AI-powered design assistance integrated into Figma with automated layout suggestions and design system generation Figma AI是一个Design领域的AI工具，在2024-2025年期间获得了8分的受欢迎度评分。',
  'AI-powered design assistance integrated into Figma with automated layout suggestions and design system generation Figma AI is an AI tool in the Design field, achieving a popularity score of 8 during 2024-2025.',
  'San Francisco, USA',
  540415071,
  'https://www.figma.com/ai',
  NULL,
  'aiUnicorns',
  true,
  2019,
  '210-310',
  'Artificial Intelligence'
) RETURNING id;

-- 项目: Figma AI
INSERT INTO projects (
  company_id, name, description, category, website, pricing_model, 
  target_users, key_features, use_cases
) VALUES (
  (SELECT id FROM companies WHERE name = 'Figma'),
  'Figma AI',
  'AI-powered design assistance integrated into Figma with automated layout suggestions and design system generation',
  'Design',
  'https://www.figma.com/ai',
  'Freemium',
  'Designers, Artists, Creatives',
  'AI design assistance, Automated layouts, Creative suggestions',
  'Graphic design, UI/UX, Branding'
);

-- 融资: Seed
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Figma'),
  'Seed',
  56000000,
  'Sequoia Capital, Andreessen Horowitz',
  315000000,
  2020,
  'Accel'
);

-- 融资: Series A
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Figma'),
  'Series A',
  19000000,
  'Sequoia Capital, Andreessen Horowitz, Accel',
  444000000,
  2021,
  'Andreessen Horowitz'
);

-- 新闻: Figma AI 获得新一轮融资，估值大幅提升
INSERT INTO stories (
  company_id, title, summary, source_url, published_date, category, tags
) VALUES (
  (SELECT id FROM companies WHERE name = 'Figma'),
  'Figma AI 获得新一轮融资，估值大幅提升',
  'Figma AI作为Design领域的领先AI工具，近日宣布完成新一轮融资，估值较上轮提升显著。该轮融资将主要用于产品研发和市场扩张。',
  'https://techcrunch.com',
  '2024-06-15',
  '融资新闻',
  ARRAY['融资', 'AI', '科技']
);

-- 新闻: Figma AI 发布重大更新，新增多项AI功能
INSERT INTO stories (
  company_id, title, summary, source_url, published_date, category, tags
) VALUES (
  (SELECT id FROM companies WHERE name = 'Figma'),
  'Figma AI 发布重大更新，新增多项AI功能',
  'Figma AI团队宣布推出重大产品更新，新增多项AI驱动功能，进一步提升用户体验。新功能包括智能推荐、自动化工作流等。',
  'https://www.theverge.com',
  '2024-08-20',
  '产品发布',
  ARRAY['产品更新', 'AI', '功能']
);


-- 公司 29: Krea
INSERT INTO companies (
  name, description, english_description, headquarters, valuation, website, 
  logo_base64, category, is_overseas, founded_year, employee_count, industry
) VALUES (
  'Krea',
  'Real-time AI image generation platform with live canvas editing and instant visual feedback Krea AI是一个Design领域的AI工具，在2024-2025年期间获得了7.8分的受欢迎度评分。',
  'Real-time AI image generation platform with live canvas editing and instant visual feedback Krea AI is an AI tool in the Design field, achieving a popularity score of 7.8 during 2024-2025.',
  'San Francisco, USA',
  963679228,
  'https://www.krea.ai',
  NULL,
  'aiUnicorns',
  true,
  2018,
  '206-306',
  'Artificial Intelligence'
) RETURNING id;

-- 项目: Krea AI
INSERT INTO projects (
  company_id, name, description, category, website, pricing_model, 
  target_users, key_features, use_cases
) VALUES (
  (SELECT id FROM companies WHERE name = 'Krea'),
  'Krea AI',
  'Real-time AI image generation platform with live canvas editing and instant visual feedback',
  'Design',
  'https://www.krea.ai',
  'Freemium',
  'Designers, Artists, Creatives',
  'AI design assistance, Automated layouts, Creative suggestions',
  'Graphic design, UI/UX, Branding'
);

-- 融资: Seed
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Krea'),
  'Seed',
  48000000,
  'Sequoia Capital',
  160000000,
  2020,
  'NEA'
);

-- 融资: Series A
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Krea'),
  'Series A',
  24000000,
  'Sequoia Capital, Andreessen Horowitz, Accel',
  343000000,
  2021,
  'Sequoia Capital'
);

-- 新闻: Krea AI 获得新一轮融资，估值大幅提升
INSERT INTO stories (
  company_id, title, summary, source_url, published_date, category, tags
) VALUES (
  (SELECT id FROM companies WHERE name = 'Krea'),
  'Krea AI 获得新一轮融资，估值大幅提升',
  'Krea AI作为Design领域的领先AI工具，近日宣布完成新一轮融资，估值较上轮提升显著。该轮融资将主要用于产品研发和市场扩张。',
  'https://techcrunch.com',
  '2024-06-15',
  '融资新闻',
  ARRAY['融资', 'AI', '科技']
);

-- 新闻: Krea AI 发布重大更新，新增多项AI功能
INSERT INTO stories (
  company_id, title, summary, source_url, published_date, category, tags
) VALUES (
  (SELECT id FROM companies WHERE name = 'Krea'),
  'Krea AI 发布重大更新，新增多项AI功能',
  'Krea AI团队宣布推出重大产品更新，新增多项AI驱动功能，进一步提升用户体验。新功能包括智能推荐、自动化工作流等。',
  'https://www.theverge.com',
  '2024-08-20',
  '产品发布',
  ARRAY['产品更新', 'AI', '功能']
);


-- 公司 30: Ideogram
INSERT INTO companies (
  name, description, english_description, headquarters, valuation, website, 
  logo_base64, category, is_overseas, founded_year, employee_count, industry
) VALUES (
  'Ideogram',
  'AI image generator specializing in text rendering within images and graphic design elements Ideogram是一个Design领域的AI工具，在2024-2025年期间获得了7.9分的受欢迎度评分。',
  'AI image generator specializing in text rendering within images and graphic design elements Ideogram is an AI tool in the Design field, achieving a popularity score of 7.9 during 2024-2025.',
  'San Francisco, USA',
  476405350,
  'https://ideogram.ai',
  NULL,
  'aiUnicorns',
  true,
  2018,
  '208-308',
  'Artificial Intelligence'
) RETURNING id;

-- 项目: Ideogram
INSERT INTO projects (
  company_id, name, description, category, website, pricing_model, 
  target_users, key_features, use_cases
) VALUES (
  (SELECT id FROM companies WHERE name = 'Ideogram'),
  'Ideogram',
  'AI image generator specializing in text rendering within images and graphic design elements',
  'Design',
  'https://ideogram.ai',
  'Freemium',
  'Designers, Artists, Creatives',
  'AI design assistance, Automated layouts, Creative suggestions',
  'Graphic design, UI/UX, Branding'
);

-- 融资: Seed
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Ideogram'),
  'Seed',
  47000000,
  'Sequoia Capital, Andreessen Horowitz',
  552000000,
  2020,
  'Sequoia Capital'
);

-- 融资: Series A
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Ideogram'),
  'Series A',
  17000000,
  'Sequoia Capital, Andreessen Horowitz, Accel',
  271000000,
  2021,
  'GV'
);

-- 新闻: Ideogram 获得新一轮融资，估值大幅提升
INSERT INTO stories (
  company_id, title, summary, source_url, published_date, category, tags
) VALUES (
  (SELECT id FROM companies WHERE name = 'Ideogram'),
  'Ideogram 获得新一轮融资，估值大幅提升',
  'Ideogram作为Design领域的领先AI工具，近日宣布完成新一轮融资，估值较上轮提升显著。该轮融资将主要用于产品研发和市场扩张。',
  'https://techcrunch.com',
  '2024-06-15',
  '融资新闻',
  ARRAY['融资', 'AI', '科技']
);


-- 公司 31: Adobe
INSERT INTO companies (
  name, description, english_description, headquarters, valuation, website, 
  logo_base64, category, is_overseas, founded_year, employee_count, industry
) VALUES (
  'Adobe',
  'AI-powered design platform with quick actions, template customization, and social media optimization Adobe Express是一个Design领域的AI工具，在2024-2025年期间获得了7.7分的受欢迎度评分。',
  'AI-powered design platform with quick actions, template customization, and social media optimization Adobe Express is an AI tool in the Design field, achieving a popularity score of 7.7 during 2024-2025.',
  'San Francisco, USA',
  1105005872,
  'https://www.adobe.com/express',
  NULL,
  'aiUnicorns',
  true,
  2018,
  '204-304',
  'Artificial Intelligence'
) RETURNING id;

-- 项目: Adobe Express
INSERT INTO projects (
  company_id, name, description, category, website, pricing_model, 
  target_users, key_features, use_cases
) VALUES (
  (SELECT id FROM companies WHERE name = 'Adobe'),
  'Adobe Express',
  'AI-powered design platform with quick actions, template customization, and social media optimization',
  'Design',
  'https://www.adobe.com/express',
  'Freemium',
  'Designers, Artists, Creatives',
  'AI design assistance, Automated layouts, Creative suggestions',
  'Graphic design, UI/UX, Branding'
);

-- 融资: Seed
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Adobe'),
  'Seed',
  44000000,
  'Sequoia Capital',
  272000000,
  2020,
  'NEA'
);

-- 融资: Series A
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Adobe'),
  'Series A',
  31000000,
  'Sequoia Capital, Andreessen Horowitz',
  536000000,
  2021,
  'NEA'
);

-- 新闻: Adobe Express 获得新一轮融资，估值大幅提升
INSERT INTO stories (
  company_id, title, summary, source_url, published_date, category, tags
) VALUES (
  (SELECT id FROM companies WHERE name = 'Adobe'),
  'Adobe Express 获得新一轮融资，估值大幅提升',
  'Adobe Express作为Design领域的领先AI工具，近日宣布完成新一轮融资，估值较上轮提升显著。该轮融资将主要用于产品研发和市场扩张。',
  'https://techcrunch.com',
  '2024-06-15',
  '融资新闻',
  ARRAY['融资', 'AI', '科技']
);


-- 公司 32: Recraft
INSERT INTO companies (
  name, description, english_description, headquarters, valuation, website, 
  logo_base64, category, is_overseas, founded_year, employee_count, industry
) VALUES (
  'Recraft',
  'AI design tool for creating brand-consistent graphics, illustrations, and marketing materials with style control Recraft是一个Design领域的AI工具，在2024-2025年期间获得了7.6分的受欢迎度评分。',
  'AI design tool for creating brand-consistent graphics, illustrations, and marketing materials with style control Recraft is an AI tool in the Design field, achieving a popularity score of 7.6 during 2024-2025.',
  'San Francisco, USA',
  741826842,
  'https://www.recraft.ai',
  NULL,
  'aiUnicorns',
  true,
  2018,
  '202-302',
  'Artificial Intelligence'
) RETURNING id;

-- 项目: Recraft
INSERT INTO projects (
  company_id, name, description, category, website, pricing_model, 
  target_users, key_features, use_cases
) VALUES (
  (SELECT id FROM companies WHERE name = 'Recraft'),
  'Recraft',
  'AI design tool for creating brand-consistent graphics, illustrations, and marketing materials with style control',
  'Design',
  'https://www.recraft.ai',
  'Freemium',
  'Designers, Artists, Creatives',
  'AI design assistance, Automated layouts, Creative suggestions',
  'Graphic design, UI/UX, Branding'
);

-- 融资: Seed
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Recraft'),
  'Seed',
  21000000,
  'Sequoia Capital, Andreessen Horowitz',
  509000000,
  2020,
  'Andreessen Horowitz'
);

-- 融资: Series A
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Recraft'),
  'Series A',
  16000000,
  'Sequoia Capital',
  410000000,
  2021,
  'NEA'
);

-- 新闻: Recraft 获得新一轮融资，估值大幅提升
INSERT INTO stories (
  company_id, title, summary, source_url, published_date, category, tags
) VALUES (
  (SELECT id FROM companies WHERE name = 'Recraft'),
  'Recraft 获得新一轮融资，估值大幅提升',
  'Recraft作为Design领域的领先AI工具，近日宣布完成新一轮融资，估值较上轮提升显著。该轮融资将主要用于产品研发和市场扩张。',
  'https://techcrunch.com',
  '2024-06-15',
  '融资新闻',
  ARRAY['融资', 'AI', '科技']
);

-- 新闻: Recraft 发布重大更新，新增多项AI功能
INSERT INTO stories (
  company_id, title, summary, source_url, published_date, category, tags
) VALUES (
  (SELECT id FROM companies WHERE name = 'Recraft'),
  'Recraft 发布重大更新，新增多项AI功能',
  'Recraft团队宣布推出重大产品更新，新增多项AI驱动功能，进一步提升用户体验。新功能包括智能推荐、自动化工作流等。',
  'https://www.theverge.com',
  '2024-08-20',
  '产品发布',
  ARRAY['产品更新', 'AI', '功能']
);


-- 公司 33: Elevenlabs
INSERT INTO companies (
  name, description, english_description, headquarters, valuation, website, 
  logo_base64, category, is_overseas, founded_year, employee_count, industry
) VALUES (
  'Elevenlabs',
  'Leading AI voice generation and cloning platform with realistic speech synthesis and emotion control for content creation ElevenLabs是一个Content Creation领域的AI工具，在2024-2025年期间获得了8.6分的受欢迎度评分。',
  'Leading AI voice generation and cloning platform with realistic speech synthesis and emotion control for content creation ElevenLabs is an AI tool in the Content Creation field, achieving a popularity score of 8.6 during 2024-2025.',
  'San Francisco, USA',
  1043133442,
  'https://elevenlabs.io',
  NULL,
  'aiUnicorns',
  true,
  2019,
  '222-322',
  'Artificial Intelligence'
) RETURNING id;

-- 项目: ElevenLabs
INSERT INTO projects (
  company_id, name, description, category, website, pricing_model, 
  target_users, key_features, use_cases
) VALUES (
  (SELECT id FROM companies WHERE name = 'Elevenlabs'),
  'ElevenLabs',
  'Leading AI voice generation and cloning platform with realistic speech synthesis and emotion control for content creation',
  'Content Creation',
  'https://elevenlabs.io',
  'Freemium',
  'Content Creators, Marketers',
  'Automated content, Multi-format support, SEO optimization',
  'Blog posts, Social media, Marketing materials'
);

-- 融资: Seed
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Elevenlabs'),
  'Seed',
  35000000,
  'Sequoia Capital, Andreessen Horowitz',
  402000000,
  2020,
  'GV'
);

-- 融资: Series A
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Elevenlabs'),
  'Series A',
  51000000,
  'Sequoia Capital',
  390000000,
  2021,
  'GV'
);

-- 新闻: ElevenLabs 获得新一轮融资，估值大幅提升
INSERT INTO stories (
  company_id, title, summary, source_url, published_date, category, tags
) VALUES (
  (SELECT id FROM companies WHERE name = 'Elevenlabs'),
  'ElevenLabs 获得新一轮融资，估值大幅提升',
  'ElevenLabs作为Content Creation领域的领先AI工具，近日宣布完成新一轮融资，估值较上轮提升显著。该轮融资将主要用于产品研发和市场扩张。',
  'https://techcrunch.com',
  '2024-06-15',
  '融资新闻',
  ARRAY['融资', 'AI', '科技']
);


-- 公司 34: Murf
INSERT INTO companies (
  name, description, english_description, headquarters, valuation, website, 
  logo_base64, category, is_overseas, founded_year, employee_count, industry
) VALUES (
  'Murf',
  'Professional AI voice generation platform with clean interface, diverse voice options, and commercial licensing Murf.ai是一个Content Creation领域的AI工具，在2024-2025年期间获得了8.2分的受欢迎度评分。',
  'Professional AI voice generation platform with clean interface, diverse voice options, and commercial licensing Murf.ai is an AI tool in the Content Creation field, achieving a popularity score of 8.2 during 2024-2025.',
  'San Francisco, USA',
  921311143,
  'https://murf.ai',
  NULL,
  'aiUnicorns',
  true,
  2019,
  '214-314',
  'Artificial Intelligence'
) RETURNING id;

-- 项目: Murf.ai
INSERT INTO projects (
  company_id, name, description, category, website, pricing_model, 
  target_users, key_features, use_cases
) VALUES (
  (SELECT id FROM companies WHERE name = 'Murf'),
  'Murf.ai',
  'Professional AI voice generation platform with clean interface, diverse voice options, and commercial licensing',
  'Content Creation',
  'https://murf.ai',
  'Freemium',
  'Content Creators, Marketers',
  'Automated content, Multi-format support, SEO optimization',
  'Blog posts, Social media, Marketing materials'
);

-- 融资: Seed
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Murf'),
  'Seed',
  40000000,
  'Sequoia Capital',
  179000000,
  2020,
  'Andreessen Horowitz'
);

-- 融资: Series A
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Murf'),
  'Series A',
  37000000,
  'Sequoia Capital, Andreessen Horowitz, Accel',
  357000000,
  2021,
  'Accel'
);

-- 新闻: Murf.ai 获得新一轮融资，估值大幅提升
INSERT INTO stories (
  company_id, title, summary, source_url, published_date, category, tags
) VALUES (
  (SELECT id FROM companies WHERE name = 'Murf'),
  'Murf.ai 获得新一轮融资，估值大幅提升',
  'Murf.ai作为Content Creation领域的领先AI工具，近日宣布完成新一轮融资，估值较上轮提升显著。该轮融资将主要用于产品研发和市场扩张。',
  'https://techcrunch.com',
  '2024-06-15',
  '融资新闻',
  ARRAY['融资', 'AI', '科技']
);


-- 公司 35: Suno
INSERT INTO companies (
  name, description, english_description, headquarters, valuation, website, 
  logo_base64, category, is_overseas, founded_year, employee_count, industry
) VALUES (
  'Suno',
  'AI music generator for creating background music, soundtracks, and complete songs with text prompts and style control Suno是一个Content Creation领域的AI工具，在2024-2025年期间获得了8.4分的受欢迎度评分。',
  'AI music generator for creating background music, soundtracks, and complete songs with text prompts and style control Suno is an AI tool in the Content Creation field, achieving a popularity score of 8.4 during 2024-2025.',
  'San Francisco, USA',
  1075804149,
  'https://www.suno.ai',
  NULL,
  'aiUnicorns',
  true,
  2019,
  '218-318',
  'Artificial Intelligence'
) RETURNING id;

-- 项目: Suno
INSERT INTO projects (
  company_id, name, description, category, website, pricing_model, 
  target_users, key_features, use_cases
) VALUES (
  (SELECT id FROM companies WHERE name = 'Suno'),
  'Suno',
  'AI music generator for creating background music, soundtracks, and complete songs with text prompts and style control',
  'Content Creation',
  'https://www.suno.ai',
  'Freemium',
  'Content Creators, Marketers',
  'Automated content, Multi-format support, SEO optimization',
  'Blog posts, Social media, Marketing materials'
);

-- 融资: Seed
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Suno'),
  'Seed',
  47000000,
  'Sequoia Capital, Andreessen Horowitz, Accel',
  445000000,
  2020,
  'GV'
);

-- 融资: Series A
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Suno'),
  'Series A',
  36000000,
  'Sequoia Capital, Andreessen Horowitz, Accel',
  371000000,
  2021,
  'Sequoia Capital'
);

-- 新闻: Suno 获得新一轮融资，估值大幅提升
INSERT INTO stories (
  company_id, title, summary, source_url, published_date, category, tags
) VALUES (
  (SELECT id FROM companies WHERE name = 'Suno'),
  'Suno 获得新一轮融资，估值大幅提升',
  'Suno作为Content Creation领域的领先AI工具，近日宣布完成新一轮融资，估值较上轮提升显著。该轮融资将主要用于产品研发和市场扩张。',
  'https://techcrunch.com',
  '2024-06-15',
  '融资新闻',
  ARRAY['融资', 'AI', '科技']
);


-- 公司 36: Udio
INSERT INTO companies (
  name, description, english_description, headquarters, valuation, website, 
  logo_base64, category, is_overseas, founded_year, employee_count, industry
) VALUES (
  'Udio',
  'AI music generator designed for musicians with advanced composition, arrangement features, and professional audio quality Udio是一个Content Creation领域的AI工具，在2024-2025年期间获得了8.1分的受欢迎度评分。',
  'AI music generator designed for musicians with advanced composition, arrangement features, and professional audio quality Udio is an AI tool in the Content Creation field, achieving a popularity score of 8.1 during 2024-2025.',
  'San Francisco, USA',
  1146468952,
  'https://www.udio.com',
  NULL,
  'aiUnicorns',
  true,
  2019,
  '212-312',
  'Artificial Intelligence'
) RETURNING id;

-- 项目: Udio
INSERT INTO projects (
  company_id, name, description, category, website, pricing_model, 
  target_users, key_features, use_cases
) VALUES (
  (SELECT id FROM companies WHERE name = 'Udio'),
  'Udio',
  'AI music generator designed for musicians with advanced composition, arrangement features, and professional audio quality',
  'Content Creation',
  'https://www.udio.com',
  'Freemium',
  'Content Creators, Marketers',
  'Automated content, Multi-format support, SEO optimization',
  'Blog posts, Social media, Marketing materials'
);

-- 融资: Seed
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Udio'),
  'Seed',
  25000000,
  'Sequoia Capital',
  507000000,
  2020,
  'NEA'
);

-- 融资: Series A
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Udio'),
  'Series A',
  59000000,
  'Sequoia Capital, Andreessen Horowitz, Accel',
  240000000,
  2021,
  'Andreessen Horowitz'
);

-- 新闻: Udio 获得新一轮融资，估值大幅提升
INSERT INTO stories (
  company_id, title, summary, source_url, published_date, category, tags
) VALUES (
  (SELECT id FROM companies WHERE name = 'Udio'),
  'Udio 获得新一轮融资，估值大幅提升',
  'Udio作为Content Creation领域的领先AI工具，近日宣布完成新一轮融资，估值较上轮提升显著。该轮融资将主要用于产品研发和市场扩张。',
  'https://techcrunch.com',
  '2024-06-15',
  '融资新闻',
  ARRAY['融资', 'AI', '科技']
);

-- 新闻: Udio 发布重大更新，新增多项AI功能
INSERT INTO stories (
  company_id, title, summary, source_url, published_date, category, tags
) VALUES (
  (SELECT id FROM companies WHERE name = 'Udio'),
  'Udio 发布重大更新，新增多项AI功能',
  'Udio团队宣布推出重大产品更新，新增多项AI驱动功能，进一步提升用户体验。新功能包括智能推荐、自动化工作流等。',
  'https://www.theverge.com',
  '2024-08-20',
  '产品发布',
  ARRAY['产品更新', 'AI', '功能']
);


-- 公司 37: Speechify
INSERT INTO companies (
  name, description, english_description, headquarters, valuation, website, 
  logo_base64, category, is_overseas, founded_year, employee_count, industry
) VALUES (
  'Speechify',
  'AI text-to-speech platform with natural voices, speed control, and integration across devices for accessibility Speechify是一个Content Creation领域的AI工具，在2024-2025年期间获得了7.9分的受欢迎度评分。',
  'AI text-to-speech platform with natural voices, speed control, and integration across devices for accessibility Speechify is an AI tool in the Content Creation field, achieving a popularity score of 7.9 during 2024-2025.',
  'San Francisco, USA',
  399869939,
  'https://speechify.com',
  NULL,
  'aiUnicorns',
  true,
  2018,
  '208-308',
  'Artificial Intelligence'
) RETURNING id;

-- 项目: Speechify
INSERT INTO projects (
  company_id, name, description, category, website, pricing_model, 
  target_users, key_features, use_cases
) VALUES (
  (SELECT id FROM companies WHERE name = 'Speechify'),
  'Speechify',
  'AI text-to-speech platform with natural voices, speed control, and integration across devices for accessibility',
  'Content Creation',
  'https://speechify.com',
  'Freemium',
  'Content Creators, Marketers',
  'Automated content, Multi-format support, SEO optimization',
  'Blog posts, Social media, Marketing materials'
);

-- 项目: Speechify Education
INSERT INTO projects (
  company_id, name, description, category, website, pricing_model, 
  target_users, key_features, use_cases
) VALUES (
  (SELECT id FROM companies WHERE name = 'Speechify'),
  'Speechify Education',
  'AI text-to-speech platform designed for students with learning differences and accessibility needs',
  'Education',
  'https://speechify.com/education',
  'Freemium',
  'Students, Teachers, Educational Institutions',
  'Personalized learning, Interactive content, Progress tracking',
  'Online learning, Course creation, Student assessment'
);

-- 融资: Seed
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Speechify'),
  'Seed',
  27000000,
  'Sequoia Capital, Andreessen Horowitz',
  429000000,
  2020,
  'NEA'
);

-- 融资: Series A
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Speechify'),
  'Series A',
  54000000,
  'Sequoia Capital, Andreessen Horowitz',
  343000000,
  2021,
  'NEA'
);

-- 新闻: Speechify 获得新一轮融资，估值大幅提升
INSERT INTO stories (
  company_id, title, summary, source_url, published_date, category, tags
) VALUES (
  (SELECT id FROM companies WHERE name = 'Speechify'),
  'Speechify 获得新一轮融资，估值大幅提升',
  'Speechify作为Content Creation领域的领先AI工具，近日宣布完成新一轮融资，估值较上轮提升显著。该轮融资将主要用于产品研发和市场扩张。',
  'https://techcrunch.com',
  '2024-06-15',
  '融资新闻',
  ARRAY['融资', 'AI', '科技']
);

-- 新闻: Speechify 发布重大更新，新增多项AI功能
INSERT INTO stories (
  company_id, title, summary, source_url, published_date, category, tags
) VALUES (
  (SELECT id FROM companies WHERE name = 'Speechify'),
  'Speechify 发布重大更新，新增多项AI功能',
  'Speechify团队宣布推出重大产品更新，新增多项AI驱动功能，进一步提升用户体验。新功能包括智能推荐、自动化工作流等。',
  'https://www.theverge.com',
  '2024-08-20',
  '产品发布',
  ARRAY['产品更新', 'AI', '功能']
);


-- 公司 38: Play
INSERT INTO companies (
  name, description, english_description, headquarters, valuation, website, 
  logo_base64, category, is_overseas, founded_year, employee_count, industry
) VALUES (
  'Play',
  'AI voice generator with ultra-realistic voices, emotion control, and API access for developers and content creators Play.ht是一个Content Creation领域的AI工具，在2024-2025年期间获得了7.8分的受欢迎度评分。',
  'AI voice generator with ultra-realistic voices, emotion control, and API access for developers and content creators Play.ht is an AI tool in the Content Creation field, achieving a popularity score of 7.8 during 2024-2025.',
  'Beijing, China',
  724202778,
  'https://play.ht',
  NULL,
  'domesticUnicorns',
  false,
  2018,
  '206-306',
  'Artificial Intelligence'
) RETURNING id;

-- 项目: Play.ht
INSERT INTO projects (
  company_id, name, description, category, website, pricing_model, 
  target_users, key_features, use_cases
) VALUES (
  (SELECT id FROM companies WHERE name = 'Play'),
  'Play.ht',
  'AI voice generator with ultra-realistic voices, emotion control, and API access for developers and content creators',
  'Content Creation',
  'https://play.ht',
  'Freemium',
  'Content Creators, Marketers',
  'Automated content, Multi-format support, SEO optimization',
  'Blog posts, Social media, Marketing materials'
);

-- 项目: AI Dungeon
INSERT INTO projects (
  company_id, name, description, category, website, pricing_model, 
  target_users, key_features, use_cases
) VALUES (
  (SELECT id FROM companies WHERE name = 'Play'),
  'AI Dungeon',
  'AI-powered text adventure game with infinite storylines and creative writing assistance capabilities',
  'Content Creation',
  'https://play.aidungeon.io',
  'Freemium',
  'Content Creators, Marketers',
  'Automated content, Multi-format support, SEO optimization',
  'Blog posts, Social media, Marketing materials'
);

-- 融资: Seed
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Play'),
  'Seed',
  20000000,
  'Sequoia Capital',
  553000000,
  2020,
  'Accel'
);

-- 融资: Series A
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Play'),
  'Series A',
  49000000,
  'Sequoia Capital',
  587000000,
  2021,
  'NEA'
);

-- 新闻: Play.ht 获得新一轮融资，估值大幅提升
INSERT INTO stories (
  company_id, title, summary, source_url, published_date, category, tags
) VALUES (
  (SELECT id FROM companies WHERE name = 'Play'),
  'Play.ht 获得新一轮融资，估值大幅提升',
  'Play.ht作为Content Creation领域的领先AI工具，近日宣布完成新一轮融资，估值较上轮提升显著。该轮融资将主要用于产品研发和市场扩张。',
  'https://techcrunch.com',
  '2024-06-15',
  '融资新闻',
  ARRAY['融资', 'AI', '科技']
);


-- 公司 39: Resemble
INSERT INTO companies (
  name, description, english_description, headquarters, valuation, website, 
  logo_base64, category, is_overseas, founded_year, employee_count, industry
) VALUES (
  'Resemble',
  'AI voice cloning platform with real-time voice conversion and custom voice model training capabilities Resemble AI是一个Content Creation领域的AI工具，在2024-2025年期间获得了7.7分的受欢迎度评分。',
  'AI voice cloning platform with real-time voice conversion and custom voice model training capabilities Resemble AI is an AI tool in the Content Creation field, achieving a popularity score of 7.7 during 2024-2025.',
  'San Francisco, USA',
  927933710,
  'https://www.resemble.ai',
  NULL,
  'aiUnicorns',
  true,
  2018,
  '204-304',
  'Artificial Intelligence'
) RETURNING id;

-- 项目: Resemble AI
INSERT INTO projects (
  company_id, name, description, category, website, pricing_model, 
  target_users, key_features, use_cases
) VALUES (
  (SELECT id FROM companies WHERE name = 'Resemble'),
  'Resemble AI',
  'AI voice cloning platform with real-time voice conversion and custom voice model training capabilities',
  'Content Creation',
  'https://www.resemble.ai',
  'Freemium',
  'Content Creators, Marketers',
  'Automated content, Multi-format support, SEO optimization',
  'Blog posts, Social media, Marketing materials'
);

-- 融资: Seed
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Resemble'),
  'Seed',
  29000000,
  'Sequoia Capital, Andreessen Horowitz',
  234000000,
  2020,
  'Sequoia Capital'
);

-- 融资: Series A
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Resemble'),
  'Series A',
  17000000,
  'Sequoia Capital, Andreessen Horowitz',
  381000000,
  2021,
  'Andreessen Horowitz'
);

-- 新闻: Resemble AI 获得新一轮融资，估值大幅提升
INSERT INTO stories (
  company_id, title, summary, source_url, published_date, category, tags
) VALUES (
  (SELECT id FROM companies WHERE name = 'Resemble'),
  'Resemble AI 获得新一轮融资，估值大幅提升',
  'Resemble AI作为Content Creation领域的领先AI工具，近日宣布完成新一轮融资，估值较上轮提升显著。该轮融资将主要用于产品研发和市场扩张。',
  'https://techcrunch.com',
  '2024-06-15',
  '融资新闻',
  ARRAY['融资', 'AI', '科技']
);


-- 公司 40: Aiva
INSERT INTO companies (
  name, description, english_description, headquarters, valuation, website, 
  logo_base64, category, is_overseas, founded_year, employee_count, industry
) VALUES (
  'Aiva',
  'AI music composition platform for creating original soundtracks, theme music, and background scores for media AIVA是一个Content Creation领域的AI工具，在2024-2025年期间获得了7.5分的受欢迎度评分。',
  'AI music composition platform for creating original soundtracks, theme music, and background scores for media AIVA is an AI tool in the Content Creation field, achieving a popularity score of 7.5 during 2024-2025.',
  'San Francisco, USA',
  1015340016,
  'https://www.aiva.ai',
  NULL,
  'aiUnicorns',
  true,
  2018,
  '200-300',
  'Artificial Intelligence'
) RETURNING id;

-- 项目: AIVA
INSERT INTO projects (
  company_id, name, description, category, website, pricing_model, 
  target_users, key_features, use_cases
) VALUES (
  (SELECT id FROM companies WHERE name = 'Aiva'),
  'AIVA',
  'AI music composition platform for creating original soundtracks, theme music, and background scores for media',
  'Content Creation',
  'https://www.aiva.ai',
  'Freemium',
  'Content Creators, Marketers',
  'Automated content, Multi-format support, SEO optimization',
  'Blog posts, Social media, Marketing materials'
);

-- 融资: Seed
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Aiva'),
  'Seed',
  58000000,
  'Sequoia Capital, Andreessen Horowitz',
  582000000,
  2020,
  'GV'
);

-- 融资: Series A
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Aiva'),
  'Series A',
  57000000,
  'Sequoia Capital, Andreessen Horowitz',
  288000000,
  2021,
  'NEA'
);

-- 新闻: AIVA 获得新一轮融资，估值大幅提升
INSERT INTO stories (
  company_id, title, summary, source_url, published_date, category, tags
) VALUES (
  (SELECT id FROM companies WHERE name = 'Aiva'),
  'AIVA 获得新一轮融资，估值大幅提升',
  'AIVA作为Content Creation领域的领先AI工具，近日宣布完成新一轮融资，估值较上轮提升显著。该轮融资将主要用于产品研发和市场扩张。',
  'https://techcrunch.com',
  '2024-06-15',
  '融资新闻',
  ARRAY['融资', 'AI', '科技']
);

-- 新闻: AIVA 发布重大更新，新增多项AI功能
INSERT INTO stories (
  company_id, title, summary, source_url, published_date, category, tags
) VALUES (
  (SELECT id FROM companies WHERE name = 'Aiva'),
  'AIVA 发布重大更新，新增多项AI功能',
  'AIVA团队宣布推出重大产品更新，新增多项AI驱动功能，进一步提升用户体验。新功能包括智能推荐、自动化工作流等。',
  'https://www.theverge.com',
  '2024-08-20',
  '产品发布',
  ARRAY['产品更新', 'AI', '功能']
);


-- 公司 41: Soundraw
INSERT INTO companies (
  name, description, english_description, headquarters, valuation, website, 
  logo_base64, category, is_overseas, founded_year, employee_count, industry
) VALUES (
  'Soundraw',
  'AI music generator for content creators with royalty-free music creation and customizable track elements Soundraw是一个Content Creation领域的AI工具，在2024-2025年期间获得了7.4分的受欢迎度评分。',
  'AI music generator for content creators with royalty-free music creation and customizable track elements Soundraw is an AI tool in the Content Creation field, achieving a popularity score of 7.4 during 2024-2025.',
  'San Francisco, USA',
  558064612,
  'https://soundraw.io',
  NULL,
  'aiUnicorns',
  true,
  2018,
  '198-298',
  'Artificial Intelligence'
) RETURNING id;

-- 项目: Soundraw
INSERT INTO projects (
  company_id, name, description, category, website, pricing_model, 
  target_users, key_features, use_cases
) VALUES (
  (SELECT id FROM companies WHERE name = 'Soundraw'),
  'Soundraw',
  'AI music generator for content creators with royalty-free music creation and customizable track elements',
  'Content Creation',
  'https://soundraw.io',
  'Freemium',
  'Content Creators, Marketers',
  'Automated content, Multi-format support, SEO optimization',
  'Blog posts, Social media, Marketing materials'
);

-- 融资: Seed
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Soundraw'),
  'Seed',
  55000000,
  'Sequoia Capital, Andreessen Horowitz',
  431000000,
  2020,
  'Andreessen Horowitz'
);

-- 融资: Series A
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Soundraw'),
  'Series A',
  33000000,
  'Sequoia Capital',
  319000000,
  2021,
  'Sequoia Capital'
);

-- 新闻: Soundraw 获得新一轮融资，估值大幅提升
INSERT INTO stories (
  company_id, title, summary, source_url, published_date, category, tags
) VALUES (
  (SELECT id FROM companies WHERE name = 'Soundraw'),
  'Soundraw 获得新一轮融资，估值大幅提升',
  'Soundraw作为Content Creation领域的领先AI工具，近日宣布完成新一轮融资，估值较上轮提升显著。该轮融资将主要用于产品研发和市场扩张。',
  'https://techcrunch.com',
  '2024-06-15',
  '融资新闻',
  ARRAY['融资', 'AI', '科技']
);


-- 公司 42: Krisp
INSERT INTO companies (
  name, description, english_description, headquarters, valuation, website, 
  logo_base64, category, is_overseas, founded_year, employee_count, industry
) VALUES (
  'Krisp',
  'AI-powered noise cancellation and voice enhancement tool for professional meetings and content recording Krisp是一个Content Creation领域的AI工具，在2024-2025年期间获得了7.6分的受欢迎度评分。',
  'AI-powered noise cancellation and voice enhancement tool for professional meetings and content recording Krisp is an AI tool in the Content Creation field, achieving a popularity score of 7.6 during 2024-2025.',
  'San Francisco, USA',
  859248632,
  'https://krisp.ai',
  NULL,
  'aiUnicorns',
  true,
  2018,
  '202-302',
  'Artificial Intelligence'
) RETURNING id;

-- 项目: Krisp
INSERT INTO projects (
  company_id, name, description, category, website, pricing_model, 
  target_users, key_features, use_cases
) VALUES (
  (SELECT id FROM companies WHERE name = 'Krisp'),
  'Krisp',
  'AI-powered noise cancellation and voice enhancement tool for professional meetings and content recording',
  'Content Creation',
  'https://krisp.ai',
  'Freemium',
  'Content Creators, Marketers',
  'Automated content, Multi-format support, SEO optimization',
  'Blog posts, Social media, Marketing materials'
);

-- 融资: Seed
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Krisp'),
  'Seed',
  22000000,
  'Sequoia Capital, Andreessen Horowitz',
  469000000,
  2020,
  'Accel'
);

-- 融资: Series A
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Krisp'),
  'Series A',
  56000000,
  'Sequoia Capital',
  371000000,
  2021,
  'GV'
);

-- 新闻: Krisp 获得新一轮融资，估值大幅提升
INSERT INTO stories (
  company_id, title, summary, source_url, published_date, category, tags
) VALUES (
  (SELECT id FROM companies WHERE name = 'Krisp'),
  'Krisp 获得新一轮融资，估值大幅提升',
  'Krisp作为Content Creation领域的领先AI工具，近日宣布完成新一轮融资，估值较上轮提升显著。该轮融资将主要用于产品研发和市场扩张。',
  'https://techcrunch.com',
  '2024-06-15',
  '融资新闻',
  ARRAY['融资', 'AI', '科技']
);

-- 新闻: Krisp 发布重大更新，新增多项AI功能
INSERT INTO stories (
  company_id, title, summary, source_url, published_date, category, tags
) VALUES (
  (SELECT id FROM companies WHERE name = 'Krisp'),
  'Krisp 发布重大更新，新增多项AI功能',
  'Krisp团队宣布推出重大产品更新，新增多项AI驱动功能，进一步提升用户体验。新功能包括智能推荐、自动化工作流等。',
  'https://www.theverge.com',
  '2024-08-20',
  '产品发布',
  ARRAY['产品更新', 'AI', '功能']
);


-- 公司 43: Grammarly
INSERT INTO companies (
  name, description, english_description, headquarters, valuation, website, 
  logo_base64, category, is_overseas, founded_year, employee_count, industry
) VALUES (
  'Grammarly',
  'Advanced AI writing assistant and grammar checker with tone detection, style suggestions, and plagiarism detection Grammarly是一个Writing领域的AI工具，在2024-2025年期间获得了8.8分的受欢迎度评分。',
  'Advanced AI writing assistant and grammar checker with tone detection, style suggestions, and plagiarism detection Grammarly is an AI tool in the Writing field, achieving a popularity score of 8.8 during 2024-2025.',
  'San Francisco, USA',
  848297984,
  'https://www.grammarly.com',
  NULL,
  'aiUnicorns',
  true,
  2019,
  '226-326',
  'Artificial Intelligence'
) RETURNING id;

-- 项目: Grammarly
INSERT INTO projects (
  company_id, name, description, category, website, pricing_model, 
  target_users, key_features, use_cases
) VALUES (
  (SELECT id FROM companies WHERE name = 'Grammarly'),
  'Grammarly',
  'Advanced AI writing assistant and grammar checker with tone detection, style suggestions, and plagiarism detection',
  'Writing',
  'https://www.grammarly.com',
  'Freemium',
  'Writers, Content Creators, Students',
  'Grammar checking, Style suggestions, Content generation',
  'Content creation, Editing, Research'
);

-- 项目: Grammarly for Students
INSERT INTO projects (
  company_id, name, description, category, website, pricing_model, 
  target_users, key_features, use_cases
) VALUES (
  (SELECT id FROM companies WHERE name = 'Grammarly'),
  'Grammarly for Students',
  'AI writing assistant specifically designed for academic writing with citation support and plagiarism detection',
  'Education',
  'https://www.grammarly.com/edu',
  'Freemium',
  'Students, Teachers, Educational Institutions',
  'Personalized learning, Interactive content, Progress tracking',
  'Online learning, Course creation, Student assessment'
);

-- 融资: Seed
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Grammarly'),
  'Seed',
  35000000,
  'Sequoia Capital, Andreessen Horowitz, Accel',
  486000000,
  2020,
  'Accel'
);

-- 融资: Series A
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Grammarly'),
  'Series A',
  11000000,
  'Sequoia Capital, Andreessen Horowitz, Accel',
  346000000,
  2021,
  'Accel'
);

-- 新闻: Grammarly 获得新一轮融资，估值大幅提升
INSERT INTO stories (
  company_id, title, summary, source_url, published_date, category, tags
) VALUES (
  (SELECT id FROM companies WHERE name = 'Grammarly'),
  'Grammarly 获得新一轮融资，估值大幅提升',
  'Grammarly作为Writing领域的领先AI工具，近日宣布完成新一轮融资，估值较上轮提升显著。该轮融资将主要用于产品研发和市场扩张。',
  'https://techcrunch.com',
  '2024-06-15',
  '融资新闻',
  ARRAY['融资', 'AI', '科技']
);

-- 新闻: Grammarly 发布重大更新，新增多项AI功能
INSERT INTO stories (
  company_id, title, summary, source_url, published_date, category, tags
) VALUES (
  (SELECT id FROM companies WHERE name = 'Grammarly'),
  'Grammarly 发布重大更新，新增多项AI功能',
  'Grammarly团队宣布推出重大产品更新，新增多项AI驱动功能，进一步提升用户体验。新功能包括智能推荐、自动化工作流等。',
  'https://www.theverge.com',
  '2024-08-20',
  '产品发布',
  ARRAY['产品更新', 'AI', '功能']
);


-- 公司 44: Jasper
INSERT INTO companies (
  name, description, english_description, headquarters, valuation, website, 
  logo_base64, category, is_overseas, founded_year, employee_count, industry
) VALUES (
  'Jasper',
  'Comprehensive AI marketing content creation platform for campaigns, blog posts, and brand messaging with brand voice training Jasper.ai是一个Writing领域的AI工具，在2024-2025年期间获得了8.3分的受欢迎度评分。',
  'Comprehensive AI marketing content creation platform for campaigns, blog posts, and brand messaging with brand voice training Jasper.ai is an AI tool in the Writing field, achieving a popularity score of 8.3 during 2024-2025.',
  'San Francisco, USA',
  1066198294,
  'https://www.jasper.ai',
  NULL,
  'aiUnicorns',
  true,
  2019,
  '216-316',
  'Artificial Intelligence'
) RETURNING id;

-- 项目: Jasper.ai
INSERT INTO projects (
  company_id, name, description, category, website, pricing_model, 
  target_users, key_features, use_cases
) VALUES (
  (SELECT id FROM companies WHERE name = 'Jasper'),
  'Jasper.ai',
  'Comprehensive AI marketing content creation platform for campaigns, blog posts, and brand messaging with brand voice training',
  'Writing',
  'https://www.jasper.ai',
  'Freemium',
  'Writers, Content Creators, Students',
  'Grammar checking, Style suggestions, Content generation',
  'Content creation, Editing, Research'
);

-- 融资: Seed
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Jasper'),
  'Seed',
  33000000,
  'Sequoia Capital, Andreessen Horowitz',
  430000000,
  2020,
  'GV'
);

-- 融资: Series A
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Jasper'),
  'Series A',
  16000000,
  'Sequoia Capital',
  496000000,
  2021,
  'GV'
);

-- 新闻: Jasper.ai 获得新一轮融资，估值大幅提升
INSERT INTO stories (
  company_id, title, summary, source_url, published_date, category, tags
) VALUES (
  (SELECT id FROM companies WHERE name = 'Jasper'),
  'Jasper.ai 获得新一轮融资，估值大幅提升',
  'Jasper.ai作为Writing领域的领先AI工具，近日宣布完成新一轮融资，估值较上轮提升显著。该轮融资将主要用于产品研发和市场扩张。',
  'https://techcrunch.com',
  '2024-06-15',
  '融资新闻',
  ARRAY['融资', 'AI', '科技']
);

-- 新闻: Jasper.ai 发布重大更新，新增多项AI功能
INSERT INTO stories (
  company_id, title, summary, source_url, published_date, category, tags
) VALUES (
  (SELECT id FROM companies WHERE name = 'Jasper'),
  'Jasper.ai 发布重大更新，新增多项AI功能',
  'Jasper.ai团队宣布推出重大产品更新，新增多项AI驱动功能，进一步提升用户体验。新功能包括智能推荐、自动化工作流等。',
  'https://www.theverge.com',
  '2024-08-20',
  '产品发布',
  ARRAY['产品更新', 'AI', '功能']
);


-- 公司 45: Copy
INSERT INTO companies (
  name, description, english_description, headquarters, valuation, website, 
  logo_base64, category, is_overseas, founded_year, employee_count, industry
) VALUES (
  'Copy',
  'AI copywriting tool for marketing content, social media posts, email campaigns, and business communications Copy.ai是一个Writing领域的AI工具，在2024-2025年期间获得了8.1分的受欢迎度评分。',
  'AI copywriting tool for marketing content, social media posts, email campaigns, and business communications Copy.ai is an AI tool in the Writing field, achieving a popularity score of 8.1 during 2024-2025.',
  'San Francisco, USA',
  1113809144,
  'https://www.copy.ai',
  NULL,
  'aiUnicorns',
  true,
  2019,
  '212-312',
  'Artificial Intelligence'
) RETURNING id;

-- 项目: Copy.ai
INSERT INTO projects (
  company_id, name, description, category, website, pricing_model, 
  target_users, key_features, use_cases
) VALUES (
  (SELECT id FROM companies WHERE name = 'Copy'),
  'Copy.ai',
  'AI copywriting tool for marketing content, social media posts, email campaigns, and business communications',
  'Writing',
  'https://www.copy.ai',
  'Freemium',
  'Writers, Content Creators, Students',
  'Grammar checking, Style suggestions, Content generation',
  'Content creation, Editing, Research'
);

-- 融资: Seed
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Copy'),
  'Seed',
  18000000,
  'Sequoia Capital, Andreessen Horowitz',
  165000000,
  2020,
  'GV'
);

-- 融资: Series A
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Copy'),
  'Series A',
  22000000,
  'Sequoia Capital, Andreessen Horowitz',
  407000000,
  2021,
  'Andreessen Horowitz'
);

-- 新闻: Copy.ai 获得新一轮融资，估值大幅提升
INSERT INTO stories (
  company_id, title, summary, source_url, published_date, category, tags
) VALUES (
  (SELECT id FROM companies WHERE name = 'Copy'),
  'Copy.ai 获得新一轮融资，估值大幅提升',
  'Copy.ai作为Writing领域的领先AI工具，近日宣布完成新一轮融资，估值较上轮提升显著。该轮融资将主要用于产品研发和市场扩张。',
  'https://techcrunch.com',
  '2024-06-15',
  '融资新闻',
  ARRAY['融资', 'AI', '科技']
);


-- 公司 46: Quillbot
INSERT INTO companies (
  name, description, english_description, headquarters, valuation, website, 
  logo_base64, category, is_overseas, founded_year, employee_count, industry
) VALUES (
  'Quillbot',
  'AI writing enhancement and paraphrasing tool for improving content quality, clarity, and avoiding plagiarism QuillBot是一个Writing领域的AI工具，在2024-2025年期间获得了8分的受欢迎度评分。',
  'AI writing enhancement and paraphrasing tool for improving content quality, clarity, and avoiding plagiarism QuillBot is an AI tool in the Writing field, achieving a popularity score of 8 during 2024-2025.',
  'San Francisco, USA',
  1108511590,
  'https://quillbot.com',
  NULL,
  'aiUnicorns',
  true,
  2019,
  '210-310',
  'Artificial Intelligence'
) RETURNING id;

-- 项目: QuillBot
INSERT INTO projects (
  company_id, name, description, category, website, pricing_model, 
  target_users, key_features, use_cases
) VALUES (
  (SELECT id FROM companies WHERE name = 'Quillbot'),
  'QuillBot',
  'AI writing enhancement and paraphrasing tool for improving content quality, clarity, and avoiding plagiarism',
  'Writing',
  'https://quillbot.com',
  'Freemium',
  'Writers, Content Creators, Students',
  'Grammar checking, Style suggestions, Content generation',
  'Content creation, Editing, Research'
);

-- 融资: Seed
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Quillbot'),
  'Seed',
  34000000,
  'Sequoia Capital, Andreessen Horowitz, Accel',
  145000000,
  2020,
  'NEA'
);

-- 融资: Series A
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Quillbot'),
  'Series A',
  25000000,
  'Sequoia Capital',
  498000000,
  2021,
  'Accel'
);

-- 新闻: QuillBot 获得新一轮融资，估值大幅提升
INSERT INTO stories (
  company_id, title, summary, source_url, published_date, category, tags
) VALUES (
  (SELECT id FROM companies WHERE name = 'Quillbot'),
  'QuillBot 获得新一轮融资，估值大幅提升',
  'QuillBot作为Writing领域的领先AI工具，近日宣布完成新一轮融资，估值较上轮提升显著。该轮融资将主要用于产品研发和市场扩张。',
  'https://techcrunch.com',
  '2024-06-15',
  '融资新闻',
  ARRAY['融资', 'AI', '科技']
);


-- 公司 47: Rytr
INSERT INTO companies (
  name, description, english_description, headquarters, valuation, website, 
  logo_base64, category, is_overseas, founded_year, employee_count, industry
) VALUES (
  'Rytr',
  'AI writing assistant optimized for short-form content creation, copywriting, and social media posts with tone control Rytr是一个Writing领域的AI工具，在2024-2025年期间获得了7.9分的受欢迎度评分。',
  'AI writing assistant optimized for short-form content creation, copywriting, and social media posts with tone control Rytr is an AI tool in the Writing field, achieving a popularity score of 7.9 during 2024-2025.',
  'Beijing, China',
  782202590,
  'https://rytr.me',
  NULL,
  'domesticUnicorns',
  false,
  2018,
  '208-308',
  'Artificial Intelligence'
) RETURNING id;

-- 项目: Rytr
INSERT INTO projects (
  company_id, name, description, category, website, pricing_model, 
  target_users, key_features, use_cases
) VALUES (
  (SELECT id FROM companies WHERE name = 'Rytr'),
  'Rytr',
  'AI writing assistant optimized for short-form content creation, copywriting, and social media posts with tone control',
  'Writing',
  'https://rytr.me',
  'Freemium',
  'Writers, Content Creators, Students',
  'Grammar checking, Style suggestions, Content generation',
  'Content creation, Editing, Research'
);

-- 融资: Seed
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Rytr'),
  'Seed',
  43000000,
  'Sequoia Capital, Andreessen Horowitz',
  594000000,
  2020,
  'Accel'
);

-- 融资: Series A
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Rytr'),
  'Series A',
  21000000,
  'Sequoia Capital, Andreessen Horowitz',
  405000000,
  2021,
  'Sequoia Capital'
);

-- 新闻: Rytr 获得新一轮融资，估值大幅提升
INSERT INTO stories (
  company_id, title, summary, source_url, published_date, category, tags
) VALUES (
  (SELECT id FROM companies WHERE name = 'Rytr'),
  'Rytr 获得新一轮融资，估值大幅提升',
  'Rytr作为Writing领域的领先AI工具，近日宣布完成新一轮融资，估值较上轮提升显著。该轮融资将主要用于产品研发和市场扩张。',
  'https://techcrunch.com',
  '2024-06-15',
  '融资新闻',
  ARRAY['融资', 'AI', '科技']
);


-- 公司 48: Sudowrite
INSERT INTO companies (
  name, description, english_description, headquarters, valuation, website, 
  logo_base64, category, is_overseas, founded_year, employee_count, industry
) VALUES (
  'Sudowrite',
  'Creative writing assistant specifically designed for fiction writers, novelists, and storytellers with plot development Sudowrite是一个Writing领域的AI工具，在2024-2025年期间获得了7.8分的受欢迎度评分。',
  'Creative writing assistant specifically designed for fiction writers, novelists, and storytellers with plot development Sudowrite is an AI tool in the Writing field, achieving a popularity score of 7.8 during 2024-2025.',
  'San Francisco, USA',
  823450149,
  'https://www.sudowrite.com',
  NULL,
  'aiUnicorns',
  true,
  2018,
  '206-306',
  'Artificial Intelligence'
) RETURNING id;

-- 项目: Sudowrite
INSERT INTO projects (
  company_id, name, description, category, website, pricing_model, 
  target_users, key_features, use_cases
) VALUES (
  (SELECT id FROM companies WHERE name = 'Sudowrite'),
  'Sudowrite',
  'Creative writing assistant specifically designed for fiction writers, novelists, and storytellers with plot development',
  'Writing',
  'https://www.sudowrite.com',
  'Freemium',
  'Writers, Content Creators, Students',
  'Grammar checking, Style suggestions, Content generation',
  'Content creation, Editing, Research'
);

-- 融资: Seed
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Sudowrite'),
  'Seed',
  56000000,
  'Sequoia Capital, Andreessen Horowitz',
  274000000,
  2020,
  'Andreessen Horowitz'
);

-- 融资: Series A
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Sudowrite'),
  'Series A',
  55000000,
  'Sequoia Capital, Andreessen Horowitz',
  175000000,
  2021,
  'GV'
);

-- 新闻: Sudowrite 获得新一轮融资，估值大幅提升
INSERT INTO stories (
  company_id, title, summary, source_url, published_date, category, tags
) VALUES (
  (SELECT id FROM companies WHERE name = 'Sudowrite'),
  'Sudowrite 获得新一轮融资，估值大幅提升',
  'Sudowrite作为Writing领域的领先AI工具，近日宣布完成新一轮融资，估值较上轮提升显著。该轮融资将主要用于产品研发和市场扩张。',
  'https://techcrunch.com',
  '2024-06-15',
  '融资新闻',
  ARRAY['融资', 'AI', '科技']
);


-- 公司 49: Writesonic
INSERT INTO companies (
  name, description, english_description, headquarters, valuation, website, 
  logo_base64, category, is_overseas, founded_year, employee_count, industry
) VALUES (
  'Writesonic',
  'AI content creation platform for articles, ads, emails, and website copy with SEO optimization features Writesonic是一个Writing领域的AI工具，在2024-2025年期间获得了7.7分的受欢迎度评分。',
  'AI content creation platform for articles, ads, emails, and website copy with SEO optimization features Writesonic is an AI tool in the Writing field, achieving a popularity score of 7.7 during 2024-2025.',
  'San Francisco, USA',
  826196240,
  'https://writesonic.com',
  NULL,
  'aiUnicorns',
  true,
  2018,
  '204-304',
  'Artificial Intelligence'
) RETURNING id;

-- 项目: Writesonic
INSERT INTO projects (
  company_id, name, description, category, website, pricing_model, 
  target_users, key_features, use_cases
) VALUES (
  (SELECT id FROM companies WHERE name = 'Writesonic'),
  'Writesonic',
  'AI content creation platform for articles, ads, emails, and website copy with SEO optimization features',
  'Writing',
  'https://writesonic.com',
  'Freemium',
  'Writers, Content Creators, Students',
  'Grammar checking, Style suggestions, Content generation',
  'Content creation, Editing, Research'
);

-- 融资: Seed
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Writesonic'),
  'Seed',
  18000000,
  'Sequoia Capital, Andreessen Horowitz',
  292000000,
  2020,
  'GV'
);

-- 融资: Series A
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Writesonic'),
  'Series A',
  16000000,
  'Sequoia Capital',
  393000000,
  2021,
  'GV'
);

-- 新闻: Writesonic 获得新一轮融资，估值大幅提升
INSERT INTO stories (
  company_id, title, summary, source_url, published_date, category, tags
) VALUES (
  (SELECT id FROM companies WHERE name = 'Writesonic'),
  'Writesonic 获得新一轮融资，估值大幅提升',
  'Writesonic作为Writing领域的领先AI工具，近日宣布完成新一轮融资，估值较上轮提升显著。该轮融资将主要用于产品研发和市场扩张。',
  'https://techcrunch.com',
  '2024-06-15',
  '融资新闻',
  ARRAY['融资', 'AI', '科技']
);


-- 公司 50: Wordtune
INSERT INTO companies (
  name, description, english_description, headquarters, valuation, website, 
  logo_base64, category, is_overseas, founded_year, employee_count, industry
) VALUES (
  'Wordtune',
  'AI writing companion that helps rewrite and improve sentences for clarity, tone, and impact in real-time Wordtune是一个Writing领域的AI工具，在2024-2025年期间获得了7.6分的受欢迎度评分。',
  'AI writing companion that helps rewrite and improve sentences for clarity, tone, and impact in real-time Wordtune is an AI tool in the Writing field, achieving a popularity score of 7.6 during 2024-2025.',
  'San Francisco, USA',
  876669976,
  'https://www.wordtune.com',
  NULL,
  'aiUnicorns',
  true,
  2018,
  '202-302',
  'Artificial Intelligence'
) RETURNING id;

-- 项目: Wordtune
INSERT INTO projects (
  company_id, name, description, category, website, pricing_model, 
  target_users, key_features, use_cases
) VALUES (
  (SELECT id FROM companies WHERE name = 'Wordtune'),
  'Wordtune',
  'AI writing companion that helps rewrite and improve sentences for clarity, tone, and impact in real-time',
  'Writing',
  'https://www.wordtune.com',
  'Freemium',
  'Writers, Content Creators, Students',
  'Grammar checking, Style suggestions, Content generation',
  'Content creation, Editing, Research'
);

-- 融资: Seed
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Wordtune'),
  'Seed',
  25000000,
  'Sequoia Capital, Andreessen Horowitz, Accel',
  373000000,
  2020,
  'Accel'
);

-- 融资: Series A
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Wordtune'),
  'Series A',
  53000000,
  'Sequoia Capital',
  286000000,
  2021,
  'GV'
);

-- 新闻: Wordtune 获得新一轮融资，估值大幅提升
INSERT INTO stories (
  company_id, title, summary, source_url, published_date, category, tags
) VALUES (
  (SELECT id FROM companies WHERE name = 'Wordtune'),
  'Wordtune 获得新一轮融资，估值大幅提升',
  'Wordtune作为Writing领域的领先AI工具，近日宣布完成新一轮融资，估值较上轮提升显著。该轮融资将主要用于产品研发和市场扩张。',
  'https://techcrunch.com',
  '2024-06-15',
  '融资新闻',
  ARRAY['融资', 'AI', '科技']
);


-- 公司 51: Lex
INSERT INTO companies (
  name, description, english_description, headquarters, valuation, website, 
  logo_base64, category, is_overseas, founded_year, employee_count, industry
) VALUES (
  'Lex',
  'AI-powered writing tool designed for long-form content with collaborative features and intelligent suggestions Lex是一个Writing领域的AI工具，在2024-2025年期间获得了7.4分的受欢迎度评分。',
  'AI-powered writing tool designed for long-form content with collaborative features and intelligent suggestions Lex is an AI tool in the Writing field, achieving a popularity score of 7.4 during 2024-2025.',
  'Beijing, China',
  1047998589,
  'https://lex.page',
  NULL,
  'domesticUnicorns',
  false,
  2018,
  '198-298',
  'Artificial Intelligence'
) RETURNING id;

-- 项目: Lex
INSERT INTO projects (
  company_id, name, description, category, website, pricing_model, 
  target_users, key_features, use_cases
) VALUES (
  (SELECT id FROM companies WHERE name = 'Lex'),
  'Lex',
  'AI-powered writing tool designed for long-form content with collaborative features and intelligent suggestions',
  'Writing',
  'https://lex.page',
  'Freemium',
  'Writers, Content Creators, Students',
  'Grammar checking, Style suggestions, Content generation',
  'Content creation, Editing, Research'
);

-- 融资: Seed
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Lex'),
  'Seed',
  56000000,
  'Sequoia Capital, Andreessen Horowitz, Accel',
  290000000,
  2020,
  'NEA'
);

-- 融资: Series A
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Lex'),
  'Series A',
  57000000,
  'Sequoia Capital, Andreessen Horowitz',
  544000000,
  2021,
  'Accel'
);

-- 新闻: Lex 获得新一轮融资，估值大幅提升
INSERT INTO stories (
  company_id, title, summary, source_url, published_date, category, tags
) VALUES (
  (SELECT id FROM companies WHERE name = 'Lex'),
  'Lex 获得新一轮融资，估值大幅提升',
  'Lex作为Writing领域的领先AI工具，近日宣布完成新一轮融资，估值较上轮提升显著。该轮融资将主要用于产品研发和市场扩张。',
  'https://techcrunch.com',
  '2024-06-15',
  '融资新闻',
  ARRAY['融资', 'AI', '科技']
);

-- 新闻: Lex 发布重大更新，新增多项AI功能
INSERT INTO stories (
  company_id, title, summary, source_url, published_date, category, tags
) VALUES (
  (SELECT id FROM companies WHERE name = 'Lex'),
  'Lex 发布重大更新，新增多项AI功能',
  'Lex团队宣布推出重大产品更新，新增多项AI驱动功能，进一步提升用户体验。新功能包括智能推荐、自动化工作流等。',
  'https://www.theverge.com',
  '2024-08-20',
  '产品发布',
  ARRAY['产品更新', 'AI', '功能']
);


-- 公司 52: Jenni
INSERT INTO companies (
  name, description, english_description, headquarters, valuation, website, 
  logo_base64, category, is_overseas, founded_year, employee_count, industry
) VALUES (
  'Jenni',
  'AI writing assistant for academic and research writing with citation management and plagiarism checking Jenni AI是一个Writing领域的AI工具，在2024-2025年期间获得了7.5分的受欢迎度评分。',
  'AI writing assistant for academic and research writing with citation management and plagiarism checking Jenni AI is an AI tool in the Writing field, achieving a popularity score of 7.5 during 2024-2025.',
  'San Francisco, USA',
  582222592,
  'https://jenni.ai',
  NULL,
  'aiUnicorns',
  true,
  2018,
  '200-300',
  'Artificial Intelligence'
) RETURNING id;

-- 项目: Jenni AI
INSERT INTO projects (
  company_id, name, description, category, website, pricing_model, 
  target_users, key_features, use_cases
) VALUES (
  (SELECT id FROM companies WHERE name = 'Jenni'),
  'Jenni AI',
  'AI writing assistant for academic and research writing with citation management and plagiarism checking',
  'Writing',
  'https://jenni.ai',
  'Freemium',
  'Writers, Content Creators, Students',
  'Grammar checking, Style suggestions, Content generation',
  'Content creation, Editing, Research'
);

-- 融资: Seed
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Jenni'),
  'Seed',
  26000000,
  'Sequoia Capital',
  118000000,
  2020,
  'Sequoia Capital'
);

-- 融资: Series A
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Jenni'),
  'Series A',
  40000000,
  'Sequoia Capital, Andreessen Horowitz',
  139000000,
  2021,
  'GV'
);

-- 新闻: Jenni AI 获得新一轮融资，估值大幅提升
INSERT INTO stories (
  company_id, title, summary, source_url, published_date, category, tags
) VALUES (
  (SELECT id FROM companies WHERE name = 'Jenni'),
  'Jenni AI 获得新一轮融资，估值大幅提升',
  'Jenni AI作为Writing领域的领先AI工具，近日宣布完成新一轮融资，估值较上轮提升显著。该轮融资将主要用于产品研发和市场扩张。',
  'https://techcrunch.com',
  '2024-06-15',
  '融资新闻',
  ARRAY['融资', 'AI', '科技']
);

-- 新闻: Jenni AI 发布重大更新，新增多项AI功能
INSERT INTO stories (
  company_id, title, summary, source_url, published_date, category, tags
) VALUES (
  (SELECT id FROM companies WHERE name = 'Jenni'),
  'Jenni AI 发布重大更新，新增多项AI功能',
  'Jenni AI团队宣布推出重大产品更新，新增多项AI驱动功能，进一步提升用户体验。新功能包括智能推荐、自动化工作流等。',
  'https://www.theverge.com',
  '2024-08-20',
  '产品发布',
  ARRAY['产品更新', 'AI', '功能']
);


-- 公司 53: Prowritingaid
INSERT INTO companies (
  name, description, english_description, headquarters, valuation, website, 
  logo_base64, category, is_overseas, founded_year, employee_count, industry
) VALUES (
  'Prowritingaid',
  'AI-powered writing editor with in-depth analysis, style improvement suggestions, and comprehensive writing reports ProWritingAid是一个Writing领域的AI工具，在2024-2025年期间获得了7.3分的受欢迎度评分。',
  'AI-powered writing editor with in-depth analysis, style improvement suggestions, and comprehensive writing reports ProWritingAid is an AI tool in the Writing field, achieving a popularity score of 7.3 during 2024-2025.',
  'San Francisco, USA',
  497799630,
  'https://prowritingaid.com',
  NULL,
  'aiUnicorns',
  true,
  2018,
  '196-296',
  'Artificial Intelligence'
) RETURNING id;

-- 项目: ProWritingAid
INSERT INTO projects (
  company_id, name, description, category, website, pricing_model, 
  target_users, key_features, use_cases
) VALUES (
  (SELECT id FROM companies WHERE name = 'Prowritingaid'),
  'ProWritingAid',
  'AI-powered writing editor with in-depth analysis, style improvement suggestions, and comprehensive writing reports',
  'Writing',
  'https://prowritingaid.com',
  'Freemium',
  'Writers, Content Creators, Students',
  'Grammar checking, Style suggestions, Content generation',
  'Content creation, Editing, Research'
);

-- 融资: Seed
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Prowritingaid'),
  'Seed',
  41000000,
  'Sequoia Capital, Andreessen Horowitz',
  485000000,
  2020,
  'GV'
);

-- 融资: Series A
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Prowritingaid'),
  'Series A',
  12000000,
  'Sequoia Capital, Andreessen Horowitz',
  273000000,
  2021,
  'Sequoia Capital'
);

-- 新闻: ProWritingAid 获得新一轮融资，估值大幅提升
INSERT INTO stories (
  company_id, title, summary, source_url, published_date, category, tags
) VALUES (
  (SELECT id FROM companies WHERE name = 'Prowritingaid'),
  'ProWritingAid 获得新一轮融资，估值大幅提升',
  'ProWritingAid作为Writing领域的领先AI工具，近日宣布完成新一轮融资，估值较上轮提升显著。该轮融资将主要用于产品研发和市场扩张。',
  'https://techcrunch.com',
  '2024-06-15',
  '融资新闻',
  ARRAY['融资', 'AI', '科技']
);

-- 新闻: ProWritingAid 发布重大更新，新增多项AI功能
INSERT INTO stories (
  company_id, title, summary, source_url, published_date, category, tags
) VALUES (
  (SELECT id FROM companies WHERE name = 'Prowritingaid'),
  'ProWritingAid 发布重大更新，新增多项AI功能',
  'ProWritingAid团队宣布推出重大产品更新，新增多项AI驱动功能，进一步提升用户体验。新功能包括智能推荐、自动化工作流等。',
  'https://www.theverge.com',
  '2024-08-20',
  '产品发布',
  ARRAY['产品更新', 'AI', '功能']
);


-- 公司 54: Hypotenuse
INSERT INTO companies (
  name, description, english_description, headquarters, valuation, website, 
  logo_base64, category, is_overseas, founded_year, employee_count, industry
) VALUES (
  'Hypotenuse',
  'AI content generator for e-commerce, marketing copy, and product descriptions with bulk content creation Hypotenuse AI是一个Writing领域的AI工具，在2024-2025年期间获得了7.2分的受欢迎度评分。',
  'AI content generator for e-commerce, marketing copy, and product descriptions with bulk content creation Hypotenuse AI is an AI tool in the Writing field, achieving a popularity score of 7.2 during 2024-2025.',
  'San Francisco, USA',
  1063777146,
  'https://www.hypotenuse.ai',
  NULL,
  'aiUnicorns',
  true,
  2018,
  '194-294',
  'Artificial Intelligence'
) RETURNING id;

-- 项目: Hypotenuse AI
INSERT INTO projects (
  company_id, name, description, category, website, pricing_model, 
  target_users, key_features, use_cases
) VALUES (
  (SELECT id FROM companies WHERE name = 'Hypotenuse'),
  'Hypotenuse AI',
  'AI content generator for e-commerce, marketing copy, and product descriptions with bulk content creation',
  'Writing',
  'https://www.hypotenuse.ai',
  'Freemium',
  'Writers, Content Creators, Students',
  'Grammar checking, Style suggestions, Content generation',
  'Content creation, Editing, Research'
);

-- 融资: Seed
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Hypotenuse'),
  'Seed',
  31000000,
  'Sequoia Capital, Andreessen Horowitz, Accel',
  584000000,
  2020,
  'NEA'
);

-- 融资: Series A
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Hypotenuse'),
  'Series A',
  11000000,
  'Sequoia Capital, Andreessen Horowitz',
  558000000,
  2021,
  'Andreessen Horowitz'
);

-- 新闻: Hypotenuse AI 获得新一轮融资，估值大幅提升
INSERT INTO stories (
  company_id, title, summary, source_url, published_date, category, tags
) VALUES (
  (SELECT id FROM companies WHERE name = 'Hypotenuse'),
  'Hypotenuse AI 获得新一轮融资，估值大幅提升',
  'Hypotenuse AI作为Writing领域的领先AI工具，近日宣布完成新一轮融资，估值较上轮提升显著。该轮融资将主要用于产品研发和市场扩张。',
  'https://techcrunch.com',
  '2024-06-15',
  '融资新闻',
  ARRAY['融资', 'AI', '科技']
);


-- 公司 55: Github
INSERT INTO companies (
  name, description, english_description, headquarters, valuation, website, 
  logo_base64, category, is_overseas, founded_year, employee_count, industry
) VALUES (
  'Github',
  'AI pair programming assistant integrated into development environments for intelligent code completion and generation GitHub Copilot是一个Developer Tools领域的AI工具，在2024-2025年期间获得了8.7分的受欢迎度评分。',
  'AI pair programming assistant integrated into development environments for intelligent code completion and generation GitHub Copilot is an AI tool in the Developer Tools field, achieving a popularity score of 8.7 during 2024-2025.',
  'San Francisco, USA',
  943598267,
  'https://github.com/features/copilot',
  NULL,
  'aiUnicorns',
  true,
  2019,
  '224-324',
  'Artificial Intelligence'
) RETURNING id;

-- 项目: GitHub Copilot
INSERT INTO projects (
  company_id, name, description, category, website, pricing_model, 
  target_users, key_features, use_cases
) VALUES (
  (SELECT id FROM companies WHERE name = 'Github'),
  'GitHub Copilot',
  'AI pair programming assistant integrated into development environments for intelligent code completion and generation',
  'Developer Tools',
  'https://github.com/features/copilot',
  'Freemium',
  'Software Developers, Engineers',
  'Code completion, Debugging assistance, API integration',
  'Code development, Testing, Deployment'
);

-- 项目: CodeT5
INSERT INTO projects (
  company_id, name, description, category, website, pricing_model, 
  target_users, key_features, use_cases
) VALUES (
  (SELECT id FROM companies WHERE name = 'Github'),
  'CodeT5',
  'AI code generation and understanding model for multiple programming languages with code summarization',
  'Developer Tools',
  'https://github.com/salesforce/CodeT5',
  'Freemium',
  'Software Developers, Engineers',
  'Code completion, Debugging assistance, API integration',
  'Code development, Testing, Deployment'
);

-- 融资: Seed
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Github'),
  'Seed',
  50000000,
  'Sequoia Capital, Andreessen Horowitz',
  295000000,
  2020,
  'GV'
);

-- 融资: Series A
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Github'),
  'Series A',
  52000000,
  'Sequoia Capital',
  532000000,
  2021,
  'Sequoia Capital'
);

-- 新闻: GitHub Copilot 获得新一轮融资，估值大幅提升
INSERT INTO stories (
  company_id, title, summary, source_url, published_date, category, tags
) VALUES (
  (SELECT id FROM companies WHERE name = 'Github'),
  'GitHub Copilot 获得新一轮融资，估值大幅提升',
  'GitHub Copilot作为Developer Tools领域的领先AI工具，近日宣布完成新一轮融资，估值较上轮提升显著。该轮融资将主要用于产品研发和市场扩张。',
  'https://techcrunch.com',
  '2024-06-15',
  '融资新闻',
  ARRAY['融资', 'AI', '科技']
);

-- 新闻: GitHub Copilot 发布重大更新，新增多项AI功能
INSERT INTO stories (
  company_id, title, summary, source_url, published_date, category, tags
) VALUES (
  (SELECT id FROM companies WHERE name = 'Github'),
  'GitHub Copilot 发布重大更新，新增多项AI功能',
  'GitHub Copilot团队宣布推出重大产品更新，新增多项AI驱动功能，进一步提升用户体验。新功能包括智能推荐、自动化工作流等。',
  'https://www.theverge.com',
  '2024-08-20',
  '产品发布',
  ARRAY['产品更新', 'AI', '功能']
);


-- 公司 56: Replit
INSERT INTO companies (
  name, description, english_description, headquarters, valuation, website, 
  logo_base64, category, is_overseas, founded_year, employee_count, industry
) VALUES (
  'Replit',
  'AI-powered coding environment with collaborative development, instant deployment, and intelligent code assistance Replit是一个Developer Tools领域的AI工具，在2024-2025年期间获得了8.1分的受欢迎度评分。',
  'AI-powered coding environment with collaborative development, instant deployment, and intelligent code assistance Replit is an AI tool in the Developer Tools field, achieving a popularity score of 8.1 during 2024-2025.',
  'San Francisco, USA',
  755546676,
  'https://replit.com',
  NULL,
  'aiUnicorns',
  true,
  2019,
  '212-312',
  'Artificial Intelligence'
) RETURNING id;

-- 项目: Replit
INSERT INTO projects (
  company_id, name, description, category, website, pricing_model, 
  target_users, key_features, use_cases
) VALUES (
  (SELECT id FROM companies WHERE name = 'Replit'),
  'Replit',
  'AI-powered coding environment with collaborative development, instant deployment, and intelligent code assistance',
  'Developer Tools',
  'https://replit.com',
  'Freemium',
  'Software Developers, Engineers',
  'Code completion, Debugging assistance, API integration',
  'Code development, Testing, Deployment'
);

-- 融资: Seed
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Replit'),
  'Seed',
  10000000,
  'Sequoia Capital, Andreessen Horowitz, Accel',
  268000000,
  2020,
  'NEA'
);

-- 融资: Series A
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Replit'),
  'Series A',
  47000000,
  'Sequoia Capital',
  309000000,
  2021,
  'NEA'
);

-- 新闻: Replit 获得新一轮融资，估值大幅提升
INSERT INTO stories (
  company_id, title, summary, source_url, published_date, category, tags
) VALUES (
  (SELECT id FROM companies WHERE name = 'Replit'),
  'Replit 获得新一轮融资，估值大幅提升',
  'Replit作为Developer Tools领域的领先AI工具，近日宣布完成新一轮融资，估值较上轮提升显著。该轮融资将主要用于产品研发和市场扩张。',
  'https://techcrunch.com',
  '2024-06-15',
  '融资新闻',
  ARRAY['融资', 'AI', '科技']
);


-- 公司 57: Tabnine
INSERT INTO companies (
  name, description, english_description, headquarters, valuation, website, 
  logo_base64, category, is_overseas, founded_year, employee_count, industry
) VALUES (
  'Tabnine',
  'AI code completion platform that works across IDEs with context-aware suggestions and team learning Tabnine是一个Developer Tools领域的AI工具，在2024-2025年期间获得了7.8分的受欢迎度评分。',
  'AI code completion platform that works across IDEs with context-aware suggestions and team learning Tabnine is an AI tool in the Developer Tools field, achieving a popularity score of 7.8 during 2024-2025.',
  'San Francisco, USA',
  531475684,
  'https://www.tabnine.com',
  NULL,
  'aiUnicorns',
  true,
  2018,
  '206-306',
  'Artificial Intelligence'
) RETURNING id;

-- 项目: Tabnine
INSERT INTO projects (
  company_id, name, description, category, website, pricing_model, 
  target_users, key_features, use_cases
) VALUES (
  (SELECT id FROM companies WHERE name = 'Tabnine'),
  'Tabnine',
  'AI code completion platform that works across IDEs with context-aware suggestions and team learning',
  'Developer Tools',
  'https://www.tabnine.com',
  'Freemium',
  'Software Developers, Engineers',
  'Code completion, Debugging assistance, API integration',
  'Code development, Testing, Deployment'
);

-- 融资: Seed
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Tabnine'),
  'Seed',
  40000000,
  'Sequoia Capital, Andreessen Horowitz, Accel',
  244000000,
  2020,
  'GV'
);

-- 融资: Series A
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Tabnine'),
  'Series A',
  53000000,
  'Sequoia Capital',
  498000000,
  2021,
  'Andreessen Horowitz'
);

-- 新闻: Tabnine 获得新一轮融资，估值大幅提升
INSERT INTO stories (
  company_id, title, summary, source_url, published_date, category, tags
) VALUES (
  (SELECT id FROM companies WHERE name = 'Tabnine'),
  'Tabnine 获得新一轮融资，估值大幅提升',
  'Tabnine作为Developer Tools领域的领先AI工具，近日宣布完成新一轮融资，估值较上轮提升显著。该轮融资将主要用于产品研发和市场扩张。',
  'https://techcrunch.com',
  '2024-06-15',
  '融资新闻',
  ARRAY['融资', 'AI', '科技']
);


-- 公司 58: Codeium
INSERT INTO companies (
  name, description, english_description, headquarters, valuation, website, 
  logo_base64, category, is_overseas, founded_year, employee_count, industry
) VALUES (
  'Codeium',
  'Free AI code completion tool with support for 70+ programming languages and IDE integrations Codeium是一个Developer Tools领域的AI工具，在2024-2025年期间获得了7.7分的受欢迎度评分。',
  'Free AI code completion tool with support for 70+ programming languages and IDE integrations Codeium is an AI tool in the Developer Tools field, achieving a popularity score of 7.7 during 2024-2025.',
  'San Francisco, USA',
  1121706420,
  'https://codeium.com',
  NULL,
  'aiUnicorns',
  true,
  2018,
  '204-304',
  'Artificial Intelligence'
) RETURNING id;

-- 项目: Codeium
INSERT INTO projects (
  company_id, name, description, category, website, pricing_model, 
  target_users, key_features, use_cases
) VALUES (
  (SELECT id FROM companies WHERE name = 'Codeium'),
  'Codeium',
  'Free AI code completion tool with support for 70+ programming languages and IDE integrations',
  'Developer Tools',
  'https://codeium.com',
  'Freemium',
  'Software Developers, Engineers',
  'Code completion, Debugging assistance, API integration',
  'Code development, Testing, Deployment'
);

-- 融资: Seed
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Codeium'),
  'Seed',
  50000000,
  'Sequoia Capital, Andreessen Horowitz, Accel',
  389000000,
  2020,
  'GV'
);

-- 融资: Series A
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Codeium'),
  'Series A',
  36000000,
  'Sequoia Capital, Andreessen Horowitz, Accel',
  580000000,
  2021,
  'GV'
);

-- 新闻: Codeium 获得新一轮融资，估值大幅提升
INSERT INTO stories (
  company_id, title, summary, source_url, published_date, category, tags
) VALUES (
  (SELECT id FROM companies WHERE name = 'Codeium'),
  'Codeium 获得新一轮融资，估值大幅提升',
  'Codeium作为Developer Tools领域的领先AI工具，近日宣布完成新一轮融资，估值较上轮提升显著。该轮融资将主要用于产品研发和市场扩张。',
  'https://techcrunch.com',
  '2024-06-15',
  '融资新闻',
  ARRAY['融资', 'AI', '科技']
);

-- 新闻: Codeium 发布重大更新，新增多项AI功能
INSERT INTO stories (
  company_id, title, summary, source_url, published_date, category, tags
) VALUES (
  (SELECT id FROM companies WHERE name = 'Codeium'),
  'Codeium 发布重大更新，新增多项AI功能',
  'Codeium团队宣布推出重大产品更新，新增多项AI驱动功能，进一步提升用户体验。新功能包括智能推荐、自动化工作流等。',
  'https://www.theverge.com',
  '2024-08-20',
  '产品发布',
  ARRAY['产品更新', 'AI', '功能']
);


-- 公司 59: Lovable
INSERT INTO companies (
  name, description, english_description, headquarters, valuation, website, 
  logo_base64, category, is_overseas, founded_year, employee_count, industry
) VALUES (
  'Lovable',
  'Build complete software applications by prompting with natural language descriptions and visual requirements Lovable是一个Developer Tools领域的AI工具，在2024-2025年期间获得了7.9分的受欢迎度评分。',
  'Build complete software applications by prompting with natural language descriptions and visual requirements Lovable is an AI tool in the Developer Tools field, achieving a popularity score of 7.9 during 2024-2025.',
  'Beijing, China',
  980569038,
  'https://lovable.dev',
  NULL,
  'domesticUnicorns',
  false,
  2018,
  '208-308',
  'Artificial Intelligence'
) RETURNING id;

-- 项目: Lovable
INSERT INTO projects (
  company_id, name, description, category, website, pricing_model, 
  target_users, key_features, use_cases
) VALUES (
  (SELECT id FROM companies WHERE name = 'Lovable'),
  'Lovable',
  'Build complete software applications by prompting with natural language descriptions and visual requirements',
  'Developer Tools',
  'https://lovable.dev',
  'Freemium',
  'Software Developers, Engineers',
  'Code completion, Debugging assistance, API integration',
  'Code development, Testing, Deployment'
);

-- 融资: Seed
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Lovable'),
  'Seed',
  58000000,
  'Sequoia Capital, Andreessen Horowitz',
  460000000,
  2020,
  'Andreessen Horowitz'
);

-- 融资: Series A
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Lovable'),
  'Series A',
  50000000,
  'Sequoia Capital, Andreessen Horowitz',
  286000000,
  2021,
  'NEA'
);

-- 新闻: Lovable 获得新一轮融资，估值大幅提升
INSERT INTO stories (
  company_id, title, summary, source_url, published_date, category, tags
) VALUES (
  (SELECT id FROM companies WHERE name = 'Lovable'),
  'Lovable 获得新一轮融资，估值大幅提升',
  'Lovable作为Developer Tools领域的领先AI工具，近日宣布完成新一轮融资，估值较上轮提升显著。该轮融资将主要用于产品研发和市场扩张。',
  'https://techcrunch.com',
  '2024-06-15',
  '融资新闻',
  ARRAY['融资', 'AI', '科技']
);

-- 新闻: Lovable 发布重大更新，新增多项AI功能
INSERT INTO stories (
  company_id, title, summary, source_url, published_date, category, tags
) VALUES (
  (SELECT id FROM companies WHERE name = 'Lovable'),
  'Lovable 发布重大更新，新增多项AI功能',
  'Lovable团队宣布推出重大产品更新，新增多项AI驱动功能，进一步提升用户体验。新功能包括智能推荐、自动化工作流等。',
  'https://www.theverge.com',
  '2024-08-20',
  '产品发布',
  ARRAY['产品更新', 'AI', '功能']
);


-- 公司 60: V0
INSERT INTO companies (
  name, description, english_description, headquarters, valuation, website, 
  logo_base64, category, is_overseas, founded_year, employee_count, industry
) VALUES (
  'V0',
  'AI-powered web development tool that generates React components and complete applications from prompts v0 by Vercel是一个Developer Tools领域的AI工具，在2024-2025年期间获得了8分的受欢迎度评分。',
  'AI-powered web development tool that generates React components and complete applications from prompts v0 by Vercel is an AI tool in the Developer Tools field, achieving a popularity score of 8 during 2024-2025.',
  'Beijing, China',
  842161850,
  'https://v0.dev',
  NULL,
  'domesticUnicorns',
  false,
  2019,
  '210-310',
  'Artificial Intelligence'
) RETURNING id;

-- 项目: v0 by Vercel
INSERT INTO projects (
  company_id, name, description, category, website, pricing_model, 
  target_users, key_features, use_cases
) VALUES (
  (SELECT id FROM companies WHERE name = 'V0'),
  'v0 by Vercel',
  'AI-powered web development tool that generates React components and complete applications from prompts',
  'Developer Tools',
  'https://v0.dev',
  'Freemium',
  'Software Developers, Engineers',
  'Code completion, Debugging assistance, API integration',
  'Code development, Testing, Deployment'
);

-- 融资: Seed
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'V0'),
  'Seed',
  27000000,
  'Sequoia Capital, Andreessen Horowitz, Accel',
  428000000,
  2020,
  'Andreessen Horowitz'
);

-- 融资: Series A
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'V0'),
  'Series A',
  54000000,
  'Sequoia Capital, Andreessen Horowitz, Accel',
  592000000,
  2021,
  'Sequoia Capital'
);

-- 新闻: v0 by Vercel 获得新一轮融资，估值大幅提升
INSERT INTO stories (
  company_id, title, summary, source_url, published_date, category, tags
) VALUES (
  (SELECT id FROM companies WHERE name = 'V0'),
  'v0 by Vercel 获得新一轮融资，估值大幅提升',
  'v0 by Vercel作为Developer Tools领域的领先AI工具，近日宣布完成新一轮融资，估值较上轮提升显著。该轮融资将主要用于产品研发和市场扩张。',
  'https://techcrunch.com',
  '2024-06-15',
  '融资新闻',
  ARRAY['融资', 'AI', '科技']
);

-- 新闻: v0 by Vercel 发布重大更新，新增多项AI功能
INSERT INTO stories (
  company_id, title, summary, source_url, published_date, category, tags
) VALUES (
  (SELECT id FROM companies WHERE name = 'V0'),
  'v0 by Vercel 发布重大更新，新增多项AI功能',
  'v0 by Vercel团队宣布推出重大产品更新，新增多项AI驱动功能，进一步提升用户体验。新功能包括智能推荐、自动化工作流等。',
  'https://www.theverge.com',
  '2024-08-20',
  '产品发布',
  ARRAY['产品更新', 'AI', '功能']
);


-- 公司 61: Codewp
INSERT INTO companies (
  name, description, english_description, headquarters, valuation, website, 
  logo_base64, category, is_overseas, founded_year, employee_count, industry
) VALUES (
  'Codewp',
  'AI code generator specifically for WordPress development with plugin creation and theme customization CodeWP是一个Developer Tools领域的AI工具，在2024-2025年期间获得了7.3分的受欢迎度评分。',
  'AI code generator specifically for WordPress development with plugin creation and theme customization CodeWP is an AI tool in the Developer Tools field, achieving a popularity score of 7.3 during 2024-2025.',
  'San Francisco, USA',
  932115827,
  'https://codewp.ai',
  NULL,
  'aiUnicorns',
  true,
  2018,
  '196-296',
  'Artificial Intelligence'
) RETURNING id;

-- 项目: CodeWP
INSERT INTO projects (
  company_id, name, description, category, website, pricing_model, 
  target_users, key_features, use_cases
) VALUES (
  (SELECT id FROM companies WHERE name = 'Codewp'),
  'CodeWP',
  'AI code generator specifically for WordPress development with plugin creation and theme customization',
  'Developer Tools',
  'https://codewp.ai',
  'Freemium',
  'Software Developers, Engineers',
  'Code completion, Debugging assistance, API integration',
  'Code development, Testing, Deployment'
);

-- 融资: Seed
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Codewp'),
  'Seed',
  20000000,
  'Sequoia Capital, Andreessen Horowitz',
  458000000,
  2020,
  'Sequoia Capital'
);

-- 融资: Series A
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Codewp'),
  'Series A',
  55000000,
  'Sequoia Capital, Andreessen Horowitz, Accel',
  228000000,
  2021,
  'Accel'
);

-- 新闻: CodeWP 获得新一轮融资，估值大幅提升
INSERT INTO stories (
  company_id, title, summary, source_url, published_date, category, tags
) VALUES (
  (SELECT id FROM companies WHERE name = 'Codewp'),
  'CodeWP 获得新一轮融资，估值大幅提升',
  'CodeWP作为Developer Tools领域的领先AI工具，近日宣布完成新一轮融资，估值较上轮提升显著。该轮融资将主要用于产品研发和市场扩张。',
  'https://techcrunch.com',
  '2024-06-15',
  '融资新闻',
  ARRAY['融资', 'AI', '科技']
);


-- 公司 62: Huggingface
INSERT INTO companies (
  name, description, english_description, headquarters, valuation, website, 
  logo_base64, category, is_overseas, founded_year, employee_count, industry
) VALUES (
  'Huggingface',
  'Leading AI model platform and community for sharing, training, and deploying machine learning models and datasets Hugging Face是一个Developer Tools领域的AI工具，在2024-2025年期间获得了8.6分的受欢迎度评分。',
  'Leading AI model platform and community for sharing, training, and deploying machine learning models and datasets Hugging Face is an AI tool in the Developer Tools field, achieving a popularity score of 8.6 during 2024-2025.',
  'Beijing, China',
  1004454098,
  'https://huggingface.co',
  NULL,
  'domesticUnicorns',
  false,
  2019,
  '222-322',
  'Artificial Intelligence'
) RETURNING id;

-- 项目: Hugging Face
INSERT INTO projects (
  company_id, name, description, category, website, pricing_model, 
  target_users, key_features, use_cases
) VALUES (
  (SELECT id FROM companies WHERE name = 'Huggingface'),
  'Hugging Face',
  'Leading AI model platform and community for sharing, training, and deploying machine learning models and datasets',
  'Developer Tools',
  'https://huggingface.co',
  'Freemium',
  'Software Developers, Engineers',
  'Code completion, Debugging assistance, API integration',
  'Code development, Testing, Deployment'
);

-- 融资: Seed
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Huggingface'),
  'Seed',
  23000000,
  'Sequoia Capital, Andreessen Horowitz, Accel',
  226000000,
  2020,
  'Accel'
);

-- 融资: Series A
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Huggingface'),
  'Series A',
  53000000,
  'Sequoia Capital',
  142000000,
  2021,
  'NEA'
);

-- 新闻: Hugging Face 获得新一轮融资，估值大幅提升
INSERT INTO stories (
  company_id, title, summary, source_url, published_date, category, tags
) VALUES (
  (SELECT id FROM companies WHERE name = 'Huggingface'),
  'Hugging Face 获得新一轮融资，估值大幅提升',
  'Hugging Face作为Developer Tools领域的领先AI工具，近日宣布完成新一轮融资，估值较上轮提升显著。该轮融资将主要用于产品研发和市场扩张。',
  'https://techcrunch.com',
  '2024-06-15',
  '融资新闻',
  ARRAY['融资', 'AI', '科技']
);


-- 公司 63: Aistudio
INSERT INTO companies (
  name, description, english_description, headquarters, valuation, website, 
  logo_base64, category, is_overseas, founded_year, employee_count, industry
) VALUES (
  'Aistudio',
  'AI development platform with 80% growth for building and prototyping with Google''s Gemini and PaLM models Google AI Studio是一个Developer Tools领域的AI工具，在2024-2025年期间获得了8.3分的受欢迎度评分。',
  'AI development platform with 80% growth for building and prototyping with Google''s Gemini and PaLM models Google AI Studio is an AI tool in the Developer Tools field, achieving a popularity score of 8.3 during 2024-2025.',
  'San Francisco, USA',
  940609253,
  'https://aistudio.google.com',
  NULL,
  'aiUnicorns',
  true,
  2019,
  '216-316',
  'Artificial Intelligence'
) RETURNING id;

-- 项目: Google AI Studio
INSERT INTO projects (
  company_id, name, description, category, website, pricing_model, 
  target_users, key_features, use_cases
) VALUES (
  (SELECT id FROM companies WHERE name = 'Aistudio'),
  'Google AI Studio',
  'AI development platform with 80% growth for building and prototyping with Google''s Gemini and PaLM models',
  'Developer Tools',
  'https://aistudio.google.com',
  'Freemium',
  'Software Developers, Engineers',
  'Code completion, Debugging assistance, API integration',
  'Code development, Testing, Deployment'
);

-- 融资: Seed
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Aistudio'),
  'Seed',
  26000000,
  'Sequoia Capital, Andreessen Horowitz, Accel',
  561000000,
  2020,
  'GV'
);

-- 融资: Series A
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Aistudio'),
  'Series A',
  22000000,
  'Sequoia Capital, Andreessen Horowitz',
  228000000,
  2021,
  'Andreessen Horowitz'
);

-- 新闻: Google AI Studio 获得新一轮融资，估值大幅提升
INSERT INTO stories (
  company_id, title, summary, source_url, published_date, category, tags
) VALUES (
  (SELECT id FROM companies WHERE name = 'Aistudio'),
  'Google AI Studio 获得新一轮融资，估值大幅提升',
  'Google AI Studio作为Developer Tools领域的领先AI工具，近日宣布完成新一轮融资，估值较上轮提升显著。该轮融资将主要用于产品研发和市场扩张。',
  'https://techcrunch.com',
  '2024-06-15',
  '融资新闻',
  ARRAY['融资', 'AI', '科技']
);


-- 公司 64: Groq
INSERT INTO companies (
  name, description, english_description, headquarters, valuation, website, 
  logo_base64, category, is_overseas, founded_year, employee_count, industry
) VALUES (
  'Groq',
  'High-speed AI inference platform optimized for real-time AI applications with ultra-low latency responses Groq是一个Developer Tools领域的AI工具，在2024-2025年期间获得了8.1分的受欢迎度评分。',
  'High-speed AI inference platform optimized for real-time AI applications with ultra-low latency responses Groq is an AI tool in the Developer Tools field, achieving a popularity score of 8.1 during 2024-2025.',
  'San Francisco, USA',
  930227682,
  'https://groq.com',
  NULL,
  'aiUnicorns',
  true,
  2019,
  '212-312',
  'Artificial Intelligence'
) RETURNING id;

-- 项目: Groq
INSERT INTO projects (
  company_id, name, description, category, website, pricing_model, 
  target_users, key_features, use_cases
) VALUES (
  (SELECT id FROM companies WHERE name = 'Groq'),
  'Groq',
  'High-speed AI inference platform optimized for real-time AI applications with ultra-low latency responses',
  'Developer Tools',
  'https://groq.com',
  'Freemium',
  'Software Developers, Engineers',
  'Code completion, Debugging assistance, API integration',
  'Code development, Testing, Deployment'
);

-- 融资: Seed
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Groq'),
  'Seed',
  59000000,
  'Sequoia Capital, Andreessen Horowitz, Accel',
  176000000,
  2020,
  'Sequoia Capital'
);

-- 融资: Series A
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Groq'),
  'Series A',
  59000000,
  'Sequoia Capital',
  148000000,
  2021,
  'Sequoia Capital'
);

-- 新闻: Groq 获得新一轮融资，估值大幅提升
INSERT INTO stories (
  company_id, title, summary, source_url, published_date, category, tags
) VALUES (
  (SELECT id FROM companies WHERE name = 'Groq'),
  'Groq 获得新一轮融资，估值大幅提升',
  'Groq作为Developer Tools领域的领先AI工具，近日宣布完成新一轮融资，估值较上轮提升显著。该轮融资将主要用于产品研发和市场扩张。',
  'https://techcrunch.com',
  '2024-06-15',
  '融资新闻',
  ARRAY['融资', 'AI', '科技']
);


-- 公司 65: Notion
INSERT INTO companies (
  name, description, english_description, headquarters, valuation, website, 
  logo_base64, category, is_overseas, founded_year, employee_count, industry
) VALUES (
  'Notion',
  'AI-enhanced knowledge management and productivity suite with intelligent content creation and database automation Notion AI是一个Productivity领域的AI工具，在2024-2025年期间获得了8.4分的受欢迎度评分。',
  'AI-enhanced knowledge management and productivity suite with intelligent content creation and database automation Notion AI is an AI tool in the Productivity field, achieving a popularity score of 8.4 during 2024-2025.',
  'Beijing, China',
  627374120,
  'https://www.notion.so/product/ai',
  NULL,
  'domesticUnicorns',
  false,
  2019,
  '218-318',
  'Artificial Intelligence'
) RETURNING id;

-- 项目: Notion AI
INSERT INTO projects (
  company_id, name, description, category, website, pricing_model, 
  target_users, key_features, use_cases
) VALUES (
  (SELECT id FROM companies WHERE name = 'Notion'),
  'Notion AI',
  'AI-enhanced knowledge management and productivity suite with intelligent content creation and database automation',
  'Productivity',
  'https://www.notion.so/product/ai',
  'Freemium',
  'Business Professionals, Students',
  'Task automation, Smart scheduling, Document management',
  'Task management, Document creation, Team collaboration'
);

-- 融资: Seed
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Notion'),
  'Seed',
  55000000,
  'Sequoia Capital',
  326000000,
  2020,
  'Andreessen Horowitz'
);

-- 融资: Series A
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Notion'),
  'Series A',
  56000000,
  'Sequoia Capital, Andreessen Horowitz',
  277000000,
  2021,
  'GV'
);

-- 新闻: Notion AI 获得新一轮融资，估值大幅提升
INSERT INTO stories (
  company_id, title, summary, source_url, published_date, category, tags
) VALUES (
  (SELECT id FROM companies WHERE name = 'Notion'),
  'Notion AI 获得新一轮融资，估值大幅提升',
  'Notion AI作为Productivity领域的领先AI工具，近日宣布完成新一轮融资，估值较上轮提升显著。该轮融资将主要用于产品研发和市场扩张。',
  'https://techcrunch.com',
  '2024-06-15',
  '融资新闻',
  ARRAY['融资', 'AI', '科技']
);


-- 公司 66: Zapier
INSERT INTO companies (
  name, description, english_description, headquarters, valuation, website, 
  logo_base64, category, is_overseas, founded_year, employee_count, industry
) VALUES (
  'Zapier',
  'Automation platform with AI features for connecting 5000+ apps and automating complex business workflows Zapier是一个Productivity领域的AI工具，在2024-2025年期间获得了8.5分的受欢迎度评分。',
  'Automation platform with AI features for connecting 5000+ apps and automating complex business workflows Zapier is an AI tool in the Productivity field, achieving a popularity score of 8.5 during 2024-2025.',
  'San Francisco, USA',
  1071030251,
  'https://zapier.com',
  NULL,
  'aiUnicorns',
  true,
  2019,
  '220-320',
  'Artificial Intelligence'
) RETURNING id;

-- 项目: Zapier
INSERT INTO projects (
  company_id, name, description, category, website, pricing_model, 
  target_users, key_features, use_cases
) VALUES (
  (SELECT id FROM companies WHERE name = 'Zapier'),
  'Zapier',
  'Automation platform with AI features for connecting 5000+ apps and automating complex business workflows',
  'Productivity',
  'https://zapier.com',
  'Freemium',
  'Business Professionals, Students',
  'Task automation, Smart scheduling, Document management',
  'Task management, Document creation, Team collaboration'
);

-- 融资: Seed
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Zapier'),
  'Seed',
  50000000,
  'Sequoia Capital, Andreessen Horowitz, Accel',
  569000000,
  2020,
  'Accel'
);

-- 融资: Series A
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Zapier'),
  'Series A',
  57000000,
  'Sequoia Capital, Andreessen Horowitz, Accel',
  262000000,
  2021,
  'GV'
);

-- 新闻: Zapier 获得新一轮融资，估值大幅提升
INSERT INTO stories (
  company_id, title, summary, source_url, published_date, category, tags
) VALUES (
  (SELECT id FROM companies WHERE name = 'Zapier'),
  'Zapier 获得新一轮融资，估值大幅提升',
  'Zapier作为Productivity领域的领先AI工具，近日宣布完成新一轮融资，估值较上轮提升显著。该轮融资将主要用于产品研发和市场扩张。',
  'https://techcrunch.com',
  '2024-06-15',
  '融资新闻',
  ARRAY['融资', 'AI', '科技']
);

-- 新闻: Zapier 发布重大更新，新增多项AI功能
INSERT INTO stories (
  company_id, title, summary, source_url, published_date, category, tags
) VALUES (
  (SELECT id FROM companies WHERE name = 'Zapier'),
  'Zapier 发布重大更新，新增多项AI功能',
  'Zapier团队宣布推出重大产品更新，新增多项AI驱动功能，进一步提升用户体验。新功能包括智能推荐、自动化工作流等。',
  'https://www.theverge.com',
  '2024-08-20',
  '产品发布',
  ARRAY['产品更新', 'AI', '功能']
);


-- 公司 67: N8n
INSERT INTO companies (
  name, description, english_description, headquarters, valuation, website, 
  logo_base64, category, is_overseas, founded_year, employee_count, industry
) VALUES (
  'N8n',
  'Visual workflow automation tool with AI integrations, self-hosted options, and advanced business process automation n8n是一个Productivity领域的AI工具，在2024-2025年期间获得了8.2分的受欢迎度评分。',
  'Visual workflow automation tool with AI integrations, self-hosted options, and advanced business process automation n8n is an AI tool in the Productivity field, achieving a popularity score of 8.2 during 2024-2025.',
  'San Francisco, USA',
  649367025,
  'https://n8n.io',
  NULL,
  'aiUnicorns',
  true,
  2019,
  '214-314',
  'Artificial Intelligence'
) RETURNING id;

-- 项目: n8n
INSERT INTO projects (
  company_id, name, description, category, website, pricing_model, 
  target_users, key_features, use_cases
) VALUES (
  (SELECT id FROM companies WHERE name = 'N8n'),
  'n8n',
  'Visual workflow automation tool with AI integrations, self-hosted options, and advanced business process automation',
  'Productivity',
  'https://n8n.io',
  'Freemium',
  'Business Professionals, Students',
  'Task automation, Smart scheduling, Document management',
  'Task management, Document creation, Team collaboration'
);

-- 融资: Seed
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'N8n'),
  'Seed',
  45000000,
  'Sequoia Capital, Andreessen Horowitz, Accel',
  403000000,
  2020,
  'GV'
);

-- 融资: Series A
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'N8n'),
  'Series A',
  36000000,
  'Sequoia Capital, Andreessen Horowitz, Accel',
  556000000,
  2021,
  'Sequoia Capital'
);

-- 新闻: n8n 获得新一轮融资，估值大幅提升
INSERT INTO stories (
  company_id, title, summary, source_url, published_date, category, tags
) VALUES (
  (SELECT id FROM companies WHERE name = 'N8n'),
  'n8n 获得新一轮融资，估值大幅提升',
  'n8n作为Productivity领域的领先AI工具，近日宣布完成新一轮融资，估值较上轮提升显著。该轮融资将主要用于产品研发和市场扩张。',
  'https://techcrunch.com',
  '2024-06-15',
  '融资新闻',
  ARRAY['融资', 'AI', '科技']
);


-- 公司 68: Gamma
INSERT INTO companies (
  name, description, english_description, headquarters, valuation, website, 
  logo_base64, category, is_overseas, founded_year, employee_count, industry
) VALUES (
  'Gamma',
  'AI presentation builder that creates beautiful slides, documents, and websites from text prompts and outlines Gamma是一个Productivity领域的AI工具，在2024-2025年期间获得了8.2分的受欢迎度评分。',
  'AI presentation builder that creates beautiful slides, documents, and websites from text prompts and outlines Gamma is an AI tool in the Productivity field, achieving a popularity score of 8.2 during 2024-2025.',
  'Beijing, China',
  902166937,
  'https://gamma.app',
  NULL,
  'domesticUnicorns',
  false,
  2019,
  '214-314',
  'Artificial Intelligence'
) RETURNING id;

-- 项目: Gamma
INSERT INTO projects (
  company_id, name, description, category, website, pricing_model, 
  target_users, key_features, use_cases
) VALUES (
  (SELECT id FROM companies WHERE name = 'Gamma'),
  'Gamma',
  'AI presentation builder that creates beautiful slides, documents, and websites from text prompts and outlines',
  'Productivity',
  'https://gamma.app',
  'Freemium',
  'Business Professionals, Students',
  'Task automation, Smart scheduling, Document management',
  'Task management, Document creation, Team collaboration'
);

-- 融资: Seed
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Gamma'),
  'Seed',
  40000000,
  'Sequoia Capital, Andreessen Horowitz',
  499000000,
  2020,
  'Sequoia Capital'
);

-- 融资: Series A
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Gamma'),
  'Series A',
  31000000,
  'Sequoia Capital, Andreessen Horowitz, Accel',
  586000000,
  2021,
  'Andreessen Horowitz'
);

-- 新闻: Gamma 获得新一轮融资，估值大幅提升
INSERT INTO stories (
  company_id, title, summary, source_url, published_date, category, tags
) VALUES (
  (SELECT id FROM companies WHERE name = 'Gamma'),
  'Gamma 获得新一轮融资，估值大幅提升',
  'Gamma作为Productivity领域的领先AI工具，近日宣布完成新一轮融资，估值较上轮提升显著。该轮融资将主要用于产品研发和市场扩张。',
  'https://techcrunch.com',
  '2024-06-15',
  '融资新闻',
  ARRAY['融资', 'AI', '科技']
);


-- 公司 69: Fathom
INSERT INTO companies (
  name, description, english_description, headquarters, valuation, website, 
  logo_base64, category, is_overseas, founded_year, employee_count, industry
) VALUES (
  'Fathom',
  'AI meeting notetaker that automatically records, transcribes, summarizes, and creates action items from meetings Fathom是一个Productivity领域的AI工具，在2024-2025年期间获得了7.8分的受欢迎度评分。',
  'AI meeting notetaker that automatically records, transcribes, summarizes, and creates action items from meetings Fathom is an AI tool in the Productivity field, achieving a popularity score of 7.8 during 2024-2025.',
  'Beijing, China',
  1071166587,
  'https://fathom.video',
  NULL,
  'domesticUnicorns',
  false,
  2018,
  '206-306',
  'Artificial Intelligence'
) RETURNING id;

-- 项目: Fathom
INSERT INTO projects (
  company_id, name, description, category, website, pricing_model, 
  target_users, key_features, use_cases
) VALUES (
  (SELECT id FROM companies WHERE name = 'Fathom'),
  'Fathom',
  'AI meeting notetaker that automatically records, transcribes, summarizes, and creates action items from meetings',
  'Productivity',
  'https://fathom.video',
  'Freemium',
  'Business Professionals, Students',
  'Task automation, Smart scheduling, Document management',
  'Task management, Document creation, Team collaboration'
);

-- 融资: Seed
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Fathom'),
  'Seed',
  32000000,
  'Sequoia Capital',
  463000000,
  2020,
  'Accel'
);

-- 融资: Series A
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Fathom'),
  'Series A',
  54000000,
  'Sequoia Capital',
  322000000,
  2021,
  'Andreessen Horowitz'
);

-- 新闻: Fathom 获得新一轮融资，估值大幅提升
INSERT INTO stories (
  company_id, title, summary, source_url, published_date, category, tags
) VALUES (
  (SELECT id FROM companies WHERE name = 'Fathom'),
  'Fathom 获得新一轮融资，估值大幅提升',
  'Fathom作为Productivity领域的领先AI工具，近日宣布完成新一轮融资，估值较上轮提升显著。该轮融资将主要用于产品研发和市场扩张。',
  'https://techcrunch.com',
  '2024-06-15',
  '融资新闻',
  ARRAY['融资', 'AI', '科技']
);


-- 公司 70: Reclaim
INSERT INTO companies (
  name, description, english_description, headquarters, valuation, website, 
  logo_base64, category, is_overseas, founded_year, employee_count, industry
) VALUES (
  'Reclaim',
  'AI scheduling assistant that optimizes calendar management, time blocking, and work-life balance automatically Reclaim是一个Productivity领域的AI工具，在2024-2025年期间获得了7.6分的受欢迎度评分。',
  'AI scheduling assistant that optimizes calendar management, time blocking, and work-life balance automatically Reclaim is an AI tool in the Productivity field, achieving a popularity score of 7.6 during 2024-2025.',
  'San Francisco, USA',
  409353891,
  'https://reclaim.ai',
  NULL,
  'aiUnicorns',
  true,
  2018,
  '202-302',
  'Artificial Intelligence'
) RETURNING id;

-- 项目: Reclaim
INSERT INTO projects (
  company_id, name, description, category, website, pricing_model, 
  target_users, key_features, use_cases
) VALUES (
  (SELECT id FROM companies WHERE name = 'Reclaim'),
  'Reclaim',
  'AI scheduling assistant that optimizes calendar management, time blocking, and work-life balance automatically',
  'Productivity',
  'https://reclaim.ai',
  'Freemium',
  'Business Professionals, Students',
  'Task automation, Smart scheduling, Document management',
  'Task management, Document creation, Team collaboration'
);

-- 融资: Seed
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Reclaim'),
  'Seed',
  26000000,
  'Sequoia Capital',
  236000000,
  2020,
  'Accel'
);

-- 融资: Series A
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Reclaim'),
  'Series A',
  43000000,
  'Sequoia Capital, Andreessen Horowitz',
  339000000,
  2021,
  'Andreessen Horowitz'
);

-- 新闻: Reclaim 获得新一轮融资，估值大幅提升
INSERT INTO stories (
  company_id, title, summary, source_url, published_date, category, tags
) VALUES (
  (SELECT id FROM companies WHERE name = 'Reclaim'),
  'Reclaim 获得新一轮融资，估值大幅提升',
  'Reclaim作为Productivity领域的领先AI工具，近日宣布完成新一轮融资，估值较上轮提升显著。该轮融资将主要用于产品研发和市场扩张。',
  'https://techcrunch.com',
  '2024-06-15',
  '融资新闻',
  ARRAY['融资', 'AI', '科技']
);

-- 新闻: Reclaim 发布重大更新，新增多项AI功能
INSERT INTO stories (
  company_id, title, summary, source_url, published_date, category, tags
) VALUES (
  (SELECT id FROM companies WHERE name = 'Reclaim'),
  'Reclaim 发布重大更新，新增多项AI功能',
  'Reclaim团队宣布推出重大产品更新，新增多项AI驱动功能，进一步提升用户体验。新功能包括智能推荐、自动化工作流等。',
  'https://www.theverge.com',
  '2024-08-20',
  '产品发布',
  ARRAY['产品更新', 'AI', '功能']
);


-- 公司 71: Otter
INSERT INTO companies (
  name, description, english_description, headquarters, valuation, website, 
  logo_base64, category, is_overseas, founded_year, employee_count, industry
) VALUES (
  'Otter',
  'AI meeting transcription and note-taking platform with real-time collaboration and automated summaries Otter.ai是一个Productivity领域的AI工具，在2024-2025年期间获得了8分的受欢迎度评分。',
  'AI meeting transcription and note-taking platform with real-time collaboration and automated summaries Otter.ai is an AI tool in the Productivity field, achieving a popularity score of 8 during 2024-2025.',
  'San Francisco, USA',
  910990689,
  'https://otter.ai',
  NULL,
  'aiUnicorns',
  true,
  2019,
  '210-310',
  'Artificial Intelligence'
) RETURNING id;

-- 项目: Otter.ai
INSERT INTO projects (
  company_id, name, description, category, website, pricing_model, 
  target_users, key_features, use_cases
) VALUES (
  (SELECT id FROM companies WHERE name = 'Otter'),
  'Otter.ai',
  'AI meeting transcription and note-taking platform with real-time collaboration and automated summaries',
  'Productivity',
  'https://otter.ai',
  'Freemium',
  'Business Professionals, Students',
  'Task automation, Smart scheduling, Document management',
  'Task management, Document creation, Team collaboration'
);

-- 融资: Seed
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Otter'),
  'Seed',
  21000000,
  'Sequoia Capital, Andreessen Horowitz, Accel',
  304000000,
  2020,
  'NEA'
);

-- 融资: Series A
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Otter'),
  'Series A',
  10000000,
  'Sequoia Capital, Andreessen Horowitz, Accel',
  352000000,
  2021,
  'GV'
);

-- 新闻: Otter.ai 获得新一轮融资，估值大幅提升
INSERT INTO stories (
  company_id, title, summary, source_url, published_date, category, tags
) VALUES (
  (SELECT id FROM companies WHERE name = 'Otter'),
  'Otter.ai 获得新一轮融资，估值大幅提升',
  'Otter.ai作为Productivity领域的领先AI工具，近日宣布完成新一轮融资，估值较上轮提升显著。该轮融资将主要用于产品研发和市场扩张。',
  'https://techcrunch.com',
  '2024-06-15',
  '融资新闻',
  ARRAY['融资', 'AI', '科技']
);

-- 新闻: Otter.ai 发布重大更新，新增多项AI功能
INSERT INTO stories (
  company_id, title, summary, source_url, published_date, category, tags
) VALUES (
  (SELECT id FROM companies WHERE name = 'Otter'),
  'Otter.ai 发布重大更新，新增多项AI功能',
  'Otter.ai团队宣布推出重大产品更新，新增多项AI驱动功能，进一步提升用户体验。新功能包括智能推荐、自动化工作流等。',
  'https://www.theverge.com',
  '2024-08-20',
  '产品发布',
  ARRAY['产品更新', 'AI', '功能']
);


-- 公司 72: Calendly
INSERT INTO companies (
  name, description, english_description, headquarters, valuation, website, 
  logo_base64, category, is_overseas, founded_year, employee_count, industry
) VALUES (
  'Calendly',
  'AI-powered scheduling platform with smart meeting optimization and automated follow-up management Calendly AI是一个Productivity领域的AI工具，在2024-2025年期间获得了7.5分的受欢迎度评分。',
  'AI-powered scheduling platform with smart meeting optimization and automated follow-up management Calendly AI is an AI tool in the Productivity field, achieving a popularity score of 7.5 during 2024-2025.',
  'San Francisco, USA',
  591010310,
  'https://calendly.com',
  NULL,
  'aiUnicorns',
  true,
  2018,
  '200-300',
  'Artificial Intelligence'
) RETURNING id;

-- 项目: Calendly AI
INSERT INTO projects (
  company_id, name, description, category, website, pricing_model, 
  target_users, key_features, use_cases
) VALUES (
  (SELECT id FROM companies WHERE name = 'Calendly'),
  'Calendly AI',
  'AI-powered scheduling platform with smart meeting optimization and automated follow-up management',
  'Productivity',
  'https://calendly.com',
  'Freemium',
  'Business Professionals, Students',
  'Task automation, Smart scheduling, Document management',
  'Task management, Document creation, Team collaboration'
);

-- 融资: Seed
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Calendly'),
  'Seed',
  43000000,
  'Sequoia Capital, Andreessen Horowitz',
  319000000,
  2020,
  'Sequoia Capital'
);

-- 融资: Series A
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Calendly'),
  'Series A',
  28000000,
  'Sequoia Capital',
  556000000,
  2021,
  'NEA'
);

-- 新闻: Calendly AI 获得新一轮融资，估值大幅提升
INSERT INTO stories (
  company_id, title, summary, source_url, published_date, category, tags
) VALUES (
  (SELECT id FROM companies WHERE name = 'Calendly'),
  'Calendly AI 获得新一轮融资，估值大幅提升',
  'Calendly AI作为Productivity领域的领先AI工具，近日宣布完成新一轮融资，估值较上轮提升显著。该轮融资将主要用于产品研发和市场扩张。',
  'https://techcrunch.com',
  '2024-06-15',
  '融资新闻',
  ARRAY['融资', 'AI', '科技']
);

-- 新闻: Calendly AI 发布重大更新，新增多项AI功能
INSERT INTO stories (
  company_id, title, summary, source_url, published_date, category, tags
) VALUES (
  (SELECT id FROM companies WHERE name = 'Calendly'),
  'Calendly AI 发布重大更新，新增多项AI功能',
  'Calendly AI团队宣布推出重大产品更新，新增多项AI驱动功能，进一步提升用户体验。新功能包括智能推荐、自动化工作流等。',
  'https://www.theverge.com',
  '2024-08-20',
  '产品发布',
  ARRAY['产品更新', 'AI', '功能']
);


-- 公司 73: Taskade
INSERT INTO companies (
  name, description, english_description, headquarters, valuation, website, 
  logo_base64, category, is_overseas, founded_year, employee_count, industry
) VALUES (
  'Taskade',
  'AI-powered productivity platform combining task management, mind mapping, and collaborative workspaces with AI automation Taskade是一个Productivity领域的AI工具，在2024-2025年期间获得了7.4分的受欢迎度评分。',
  'AI-powered productivity platform combining task management, mind mapping, and collaborative workspaces with AI automation Taskade is an AI tool in the Productivity field, achieving a popularity score of 7.4 during 2024-2025.',
  'San Francisco, USA',
  845225049,
  'https://www.taskade.com',
  NULL,
  'aiUnicorns',
  true,
  2018,
  '198-298',
  'Artificial Intelligence'
) RETURNING id;

-- 项目: Taskade
INSERT INTO projects (
  company_id, name, description, category, website, pricing_model, 
  target_users, key_features, use_cases
) VALUES (
  (SELECT id FROM companies WHERE name = 'Taskade'),
  'Taskade',
  'AI-powered productivity platform combining task management, mind mapping, and collaborative workspaces with AI automation',
  'Productivity',
  'https://www.taskade.com',
  'Freemium',
  'Business Professionals, Students',
  'Task automation, Smart scheduling, Document management',
  'Task management, Document creation, Team collaboration'
);

-- 融资: Seed
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Taskade'),
  'Seed',
  10000000,
  'Sequoia Capital, Andreessen Horowitz, Accel',
  465000000,
  2020,
  'GV'
);

-- 融资: Series A
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Taskade'),
  'Series A',
  59000000,
  'Sequoia Capital, Andreessen Horowitz, Accel',
  186000000,
  2021,
  'Accel'
);

-- 新闻: Taskade 获得新一轮融资，估值大幅提升
INSERT INTO stories (
  company_id, title, summary, source_url, published_date, category, tags
) VALUES (
  (SELECT id FROM companies WHERE name = 'Taskade'),
  'Taskade 获得新一轮融资，估值大幅提升',
  'Taskade作为Productivity领域的领先AI工具，近日宣布完成新一轮融资，估值较上轮提升显著。该轮融资将主要用于产品研发和市场扩张。',
  'https://techcrunch.com',
  '2024-06-15',
  '融资新闻',
  ARRAY['融资', 'AI', '科技']
);

-- 新闻: Taskade 发布重大更新，新增多项AI功能
INSERT INTO stories (
  company_id, title, summary, source_url, published_date, category, tags
) VALUES (
  (SELECT id FROM companies WHERE name = 'Taskade'),
  'Taskade 发布重大更新，新增多项AI功能',
  'Taskade团队宣布推出重大产品更新，新增多项AI驱动功能，进一步提升用户体验。新功能包括智能推荐、自动化工作流等。',
  'https://www.theverge.com',
  '2024-08-20',
  '产品发布',
  ARRAY['产品更新', 'AI', '功能']
);


-- 公司 74: Manus
INSERT INTO companies (
  name, description, english_description, headquarters, valuation, website, 
  logo_base64, category, is_overseas, founded_year, employee_count, industry
) VALUES (
  'Manus',
  'AI agent platform for automating various business tasks, workflows, and repetitive processes across teams Manus是一个Productivity领域的AI工具，在2024-2025年期间获得了7.7分的受欢迎度评分。',
  'AI agent platform for automating various business tasks, workflows, and repetitive processes across teams Manus is an AI tool in the Productivity field, achieving a popularity score of 7.7 during 2024-2025.',
  'San Francisco, USA',
  549212397,
  'https://www.manus.ai',
  NULL,
  'aiUnicorns',
  true,
  2018,
  '204-304',
  'Artificial Intelligence'
) RETURNING id;

-- 项目: Manus
INSERT INTO projects (
  company_id, name, description, category, website, pricing_model, 
  target_users, key_features, use_cases
) VALUES (
  (SELECT id FROM companies WHERE name = 'Manus'),
  'Manus',
  'AI agent platform for automating various business tasks, workflows, and repetitive processes across teams',
  'Productivity',
  'https://www.manus.ai',
  'Freemium',
  'Business Professionals, Students',
  'Task automation, Smart scheduling, Document management',
  'Task management, Document creation, Team collaboration'
);

-- 融资: Seed
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Manus'),
  'Seed',
  55000000,
  'Sequoia Capital, Andreessen Horowitz, Accel',
  186000000,
  2020,
  'GV'
);

-- 融资: Series A
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Manus'),
  'Series A',
  11000000,
  'Sequoia Capital, Andreessen Horowitz',
  483000000,
  2021,
  'Accel'
);

-- 新闻: Manus 获得新一轮融资，估值大幅提升
INSERT INTO stories (
  company_id, title, summary, source_url, published_date, category, tags
) VALUES (
  (SELECT id FROM companies WHERE name = 'Manus'),
  'Manus 获得新一轮融资，估值大幅提升',
  'Manus作为Productivity领域的领先AI工具，近日宣布完成新一轮融资，估值较上轮提升显著。该轮融资将主要用于产品研发和市场扩张。',
  'https://techcrunch.com',
  '2024-06-15',
  '融资新闻',
  ARRAY['融资', 'AI', '科技']
);


-- 公司 75: Monday
INSERT INTO companies (
  name, description, english_description, headquarters, valuation, website, 
  logo_base64, category, is_overseas, founded_year, employee_count, industry
) VALUES (
  'Monday',
  'AI-enhanced project management platform with automated workflows, predictive analytics, and smart task assignment Monday.com AI是一个Productivity领域的AI工具，在2024-2025年期间获得了7.3分的受欢迎度评分。',
  'AI-enhanced project management platform with automated workflows, predictive analytics, and smart task assignment Monday.com AI is an AI tool in the Productivity field, achieving a popularity score of 7.3 during 2024-2025.',
  'San Francisco, USA',
  662617457,
  'https://monday.com',
  NULL,
  'aiUnicorns',
  true,
  2018,
  '196-296',
  'Artificial Intelligence'
) RETURNING id;

-- 项目: Monday.com AI
INSERT INTO projects (
  company_id, name, description, category, website, pricing_model, 
  target_users, key_features, use_cases
) VALUES (
  (SELECT id FROM companies WHERE name = 'Monday'),
  'Monday.com AI',
  'AI-enhanced project management platform with automated workflows, predictive analytics, and smart task assignment',
  'Productivity',
  'https://monday.com',
  'Freemium',
  'Business Professionals, Students',
  'Task automation, Smart scheduling, Document management',
  'Task management, Document creation, Team collaboration'
);

-- 融资: Seed
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Monday'),
  'Seed',
  55000000,
  'Sequoia Capital, Andreessen Horowitz, Accel',
  498000000,
  2020,
  'NEA'
);

-- 融资: Series A
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Monday'),
  'Series A',
  47000000,
  'Sequoia Capital, Andreessen Horowitz, Accel',
  107000000,
  2021,
  'Accel'
);

-- 新闻: Monday.com AI 获得新一轮融资，估值大幅提升
INSERT INTO stories (
  company_id, title, summary, source_url, published_date, category, tags
) VALUES (
  (SELECT id FROM companies WHERE name = 'Monday'),
  'Monday.com AI 获得新一轮融资，估值大幅提升',
  'Monday.com AI作为Productivity领域的领先AI工具，近日宣布完成新一轮融资，估值较上轮提升显著。该轮融资将主要用于产品研发和市场扩张。',
  'https://techcrunch.com',
  '2024-06-15',
  '融资新闻',
  ARRAY['融资', 'AI', '科技']
);

-- 新闻: Monday.com AI 发布重大更新，新增多项AI功能
INSERT INTO stories (
  company_id, title, summary, source_url, published_date, category, tags
) VALUES (
  (SELECT id FROM companies WHERE name = 'Monday'),
  'Monday.com AI 发布重大更新，新增多项AI功能',
  'Monday.com AI团队宣布推出重大产品更新，新增多项AI驱动功能，进一步提升用户体验。新功能包括智能推荐、自动化工作流等。',
  'https://www.theverge.com',
  '2024-08-20',
  '产品发布',
  ARRAY['产品更新', 'AI', '功能']
);


-- 公司 76: Clickup
INSERT INTO companies (
  name, description, english_description, headquarters, valuation, website, 
  logo_base64, category, is_overseas, founded_year, employee_count, industry
) VALUES (
  'Clickup',
  'AI-powered project management with automated task creation, smart scheduling, and intelligent progress tracking Clickup AI是一个Productivity领域的AI工具，在2024-2025年期间获得了7.6分的受欢迎度评分。',
  'AI-powered project management with automated task creation, smart scheduling, and intelligent progress tracking Clickup AI is an AI tool in the Productivity field, achieving a popularity score of 7.6 during 2024-2025.',
  'San Francisco, USA',
  793875897,
  'https://clickup.com/ai',
  NULL,
  'aiUnicorns',
  true,
  2018,
  '202-302',
  'Artificial Intelligence'
) RETURNING id;

-- 项目: Clickup AI
INSERT INTO projects (
  company_id, name, description, category, website, pricing_model, 
  target_users, key_features, use_cases
) VALUES (
  (SELECT id FROM companies WHERE name = 'Clickup'),
  'Clickup AI',
  'AI-powered project management with automated task creation, smart scheduling, and intelligent progress tracking',
  'Productivity',
  'https://clickup.com/ai',
  'Freemium',
  'Business Professionals, Students',
  'Task automation, Smart scheduling, Document management',
  'Task management, Document creation, Team collaboration'
);

-- 融资: Seed
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Clickup'),
  'Seed',
  37000000,
  'Sequoia Capital, Andreessen Horowitz',
  406000000,
  2020,
  'Accel'
);

-- 融资: Series A
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Clickup'),
  'Series A',
  52000000,
  'Sequoia Capital, Andreessen Horowitz',
  151000000,
  2021,
  'NEA'
);

-- 新闻: Clickup AI 获得新一轮融资，估值大幅提升
INSERT INTO stories (
  company_id, title, summary, source_url, published_date, category, tags
) VALUES (
  (SELECT id FROM companies WHERE name = 'Clickup'),
  'Clickup AI 获得新一轮融资，估值大幅提升',
  'Clickup AI作为Productivity领域的领先AI工具，近日宣布完成新一轮融资，估值较上轮提升显著。该轮融资将主要用于产品研发和市场扩张。',
  'https://techcrunch.com',
  '2024-06-15',
  '融资新闻',
  ARRAY['融资', 'AI', '科技']
);


-- 公司 77: Adcreative
INSERT INTO companies (
  name, description, english_description, headquarters, valuation, website, 
  logo_base64, category, is_overseas, founded_year, employee_count, industry
) VALUES (
  'Adcreative',
  'AI-powered ad creative generation platform for performance marketing campaigns with conversion optimization AdCreative是一个Marketing领域的AI工具，在2024-2025年期间获得了8分的受欢迎度评分。',
  'AI-powered ad creative generation platform for performance marketing campaigns with conversion optimization AdCreative is an AI tool in the Marketing field, achieving a popularity score of 8 during 2024-2025.',
  'San Francisco, USA',
  574167978,
  'https://www.adcreative.ai',
  NULL,
  'aiUnicorns',
  true,
  2019,
  '210-310',
  'Artificial Intelligence'
) RETURNING id;

-- 项目: AdCreative
INSERT INTO projects (
  company_id, name, description, category, website, pricing_model, 
  target_users, key_features, use_cases
) VALUES (
  (SELECT id FROM companies WHERE name = 'Adcreative'),
  'AdCreative',
  'AI-powered ad creative generation platform for performance marketing campaigns with conversion optimization',
  'Marketing',
  'https://www.adcreative.ai',
  'Freemium',
  'Marketers, Business Owners',
  'Campaign optimization, Audience targeting, Performance analytics',
  'Campaign management, Audience engagement, Analytics'
);

-- 融资: Seed
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Adcreative'),
  'Seed',
  35000000,
  'Sequoia Capital, Andreessen Horowitz, Accel',
  494000000,
  2020,
  'Sequoia Capital'
);

-- 融资: Series A
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Adcreative'),
  'Series A',
  58000000,
  'Sequoia Capital, Andreessen Horowitz, Accel',
  121000000,
  2021,
  'Andreessen Horowitz'
);

-- 新闻: AdCreative 获得新一轮融资，估值大幅提升
INSERT INTO stories (
  company_id, title, summary, source_url, published_date, category, tags
) VALUES (
  (SELECT id FROM companies WHERE name = 'Adcreative'),
  'AdCreative 获得新一轮融资，估值大幅提升',
  'AdCreative作为Marketing领域的领先AI工具，近日宣布完成新一轮融资，估值较上轮提升显著。该轮融资将主要用于产品研发和市场扩张。',
  'https://techcrunch.com',
  '2024-06-15',
  '融资新闻',
  ARRAY['融资', 'AI', '科技']
);

-- 新闻: AdCreative 发布重大更新，新增多项AI功能
INSERT INTO stories (
  company_id, title, summary, source_url, published_date, category, tags
) VALUES (
  (SELECT id FROM companies WHERE name = 'Adcreative'),
  'AdCreative 发布重大更新，新增多项AI功能',
  'AdCreative团队宣布推出重大产品更新，新增多项AI驱动功能，进一步提升用户体验。新功能包括智能推荐、自动化工作流等。',
  'https://www.theverge.com',
  '2024-08-20',
  '产品发布',
  ARRAY['产品更新', 'AI', '功能']
);


-- 公司 78: Hubspot
INSERT INTO companies (
  name, description, english_description, headquarters, valuation, website, 
  logo_base64, category, is_overseas, founded_year, employee_count, industry
) VALUES (
  'Hubspot',
  'AI-enhanced CRM and marketing automation platform with lead scoring, content generation, and sales insights HubSpot AI是一个Marketing领域的AI工具，在2024-2025年期间获得了7.9分的受欢迎度评分。',
  'AI-enhanced CRM and marketing automation platform with lead scoring, content generation, and sales insights HubSpot AI is an AI tool in the Marketing field, achieving a popularity score of 7.9 during 2024-2025.',
  'San Francisco, USA',
  905071655,
  'https://www.hubspot.com/artificial-intelligence',
  NULL,
  'aiUnicorns',
  true,
  2018,
  '208-308',
  'Artificial Intelligence'
) RETURNING id;

-- 项目: HubSpot AI
INSERT INTO projects (
  company_id, name, description, category, website, pricing_model, 
  target_users, key_features, use_cases
) VALUES (
  (SELECT id FROM companies WHERE name = 'Hubspot'),
  'HubSpot AI',
  'AI-enhanced CRM and marketing automation platform with lead scoring, content generation, and sales insights',
  'Marketing',
  'https://www.hubspot.com/artificial-intelligence',
  'Freemium',
  'Marketers, Business Owners',
  'Campaign optimization, Audience targeting, Performance analytics',
  'Campaign management, Audience engagement, Analytics'
);

-- 融资: Seed
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Hubspot'),
  'Seed',
  48000000,
  'Sequoia Capital, Andreessen Horowitz',
  167000000,
  2020,
  'NEA'
);

-- 融资: Series A
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Hubspot'),
  'Series A',
  17000000,
  'Sequoia Capital, Andreessen Horowitz, Accel',
  104000000,
  2021,
  'Sequoia Capital'
);

-- 新闻: HubSpot AI 获得新一轮融资，估值大幅提升
INSERT INTO stories (
  company_id, title, summary, source_url, published_date, category, tags
) VALUES (
  (SELECT id FROM companies WHERE name = 'Hubspot'),
  'HubSpot AI 获得新一轮融资，估值大幅提升',
  'HubSpot AI作为Marketing领域的领先AI工具，近日宣布完成新一轮融资，估值较上轮提升显著。该轮融资将主要用于产品研发和市场扩张。',
  'https://techcrunch.com',
  '2024-06-15',
  '融资新闻',
  ARRAY['融资', 'AI', '科技']
);

-- 新闻: HubSpot AI 发布重大更新，新增多项AI功能
INSERT INTO stories (
  company_id, title, summary, source_url, published_date, category, tags
) VALUES (
  (SELECT id FROM companies WHERE name = 'Hubspot'),
  'HubSpot AI 发布重大更新，新增多项AI功能',
  'HubSpot AI团队宣布推出重大产品更新，新增多项AI驱动功能，进一步提升用户体验。新功能包括智能推荐、自动化工作流等。',
  'https://www.theverge.com',
  '2024-08-20',
  '产品发布',
  ARRAY['产品更新', 'AI', '功能']
);


-- 公司 79: Persado
INSERT INTO companies (
  name, description, english_description, headquarters, valuation, website, 
  logo_base64, category, is_overseas, founded_year, employee_count, industry
) VALUES (
  'Persado',
  'AI-powered marketing language optimization platform that generates high-converting marketing copy and messaging Persado是一个Marketing领域的AI工具，在2024-2025年期间获得了7.7分的受欢迎度评分。',
  'AI-powered marketing language optimization platform that generates high-converting marketing copy and messaging Persado is an AI tool in the Marketing field, achieving a popularity score of 7.7 during 2024-2025.',
  'San Francisco, USA',
  1009489660,
  'https://www.persado.com',
  NULL,
  'aiUnicorns',
  true,
  2018,
  '204-304',
  'Artificial Intelligence'
) RETURNING id;

-- 项目: Persado
INSERT INTO projects (
  company_id, name, description, category, website, pricing_model, 
  target_users, key_features, use_cases
) VALUES (
  (SELECT id FROM companies WHERE name = 'Persado'),
  'Persado',
  'AI-powered marketing language optimization platform that generates high-converting marketing copy and messaging',
  'Marketing',
  'https://www.persado.com',
  'Freemium',
  'Marketers, Business Owners',
  'Campaign optimization, Audience targeting, Performance analytics',
  'Campaign management, Audience engagement, Analytics'
);

-- 融资: Seed
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Persado'),
  'Seed',
  33000000,
  'Sequoia Capital',
  174000000,
  2020,
  'Accel'
);

-- 融资: Series A
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Persado'),
  'Series A',
  22000000,
  'Sequoia Capital',
  388000000,
  2021,
  'NEA'
);

-- 新闻: Persado 获得新一轮融资，估值大幅提升
INSERT INTO stories (
  company_id, title, summary, source_url, published_date, category, tags
) VALUES (
  (SELECT id FROM companies WHERE name = 'Persado'),
  'Persado 获得新一轮融资，估值大幅提升',
  'Persado作为Marketing领域的领先AI工具，近日宣布完成新一轮融资，估值较上轮提升显著。该轮融资将主要用于产品研发和市场扩张。',
  'https://techcrunch.com',
  '2024-06-15',
  '融资新闻',
  ARRAY['融资', 'AI', '科技']
);


-- 公司 80: Phrasee
INSERT INTO companies (
  name, description, english_description, headquarters, valuation, website, 
  logo_base64, category, is_overseas, founded_year, employee_count, industry
) VALUES (
  'Phrasee',
  'AI copywriting platform specialized in email subject lines, social media posts, and marketing copy optimization Phrasee是一个Marketing领域的AI工具，在2024-2025年期间获得了7.5分的受欢迎度评分。',
  'AI copywriting platform specialized in email subject lines, social media posts, and marketing copy optimization Phrasee is an AI tool in the Marketing field, achieving a popularity score of 7.5 during 2024-2025.',
  'Beijing, China',
  418303852,
  'https://phrasee.co',
  NULL,
  'domesticUnicorns',
  false,
  2018,
  '200-300',
  'Artificial Intelligence'
) RETURNING id;

-- 项目: Phrasee
INSERT INTO projects (
  company_id, name, description, category, website, pricing_model, 
  target_users, key_features, use_cases
) VALUES (
  (SELECT id FROM companies WHERE name = 'Phrasee'),
  'Phrasee',
  'AI copywriting platform specialized in email subject lines, social media posts, and marketing copy optimization',
  'Marketing',
  'https://phrasee.co',
  'Freemium',
  'Marketers, Business Owners',
  'Campaign optimization, Audience targeting, Performance analytics',
  'Campaign management, Audience engagement, Analytics'
);

-- 融资: Seed
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Phrasee'),
  'Seed',
  40000000,
  'Sequoia Capital, Andreessen Horowitz, Accel',
  234000000,
  2020,
  'Andreessen Horowitz'
);

-- 融资: Series A
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Phrasee'),
  'Series A',
  58000000,
  'Sequoia Capital, Andreessen Horowitz',
  102000000,
  2021,
  'Accel'
);

-- 新闻: Phrasee 获得新一轮融资，估值大幅提升
INSERT INTO stories (
  company_id, title, summary, source_url, published_date, category, tags
) VALUES (
  (SELECT id FROM companies WHERE name = 'Phrasee'),
  'Phrasee 获得新一轮融资，估值大幅提升',
  'Phrasee作为Marketing领域的领先AI工具，近日宣布完成新一轮融资，估值较上轮提升显著。该轮融资将主要用于产品研发和市场扩张。',
  'https://techcrunch.com',
  '2024-06-15',
  '融资新闻',
  ARRAY['融资', 'AI', '科技']
);


-- 公司 81: Patterns
INSERT INTO companies (
  name, description, english_description, headquarters, valuation, website, 
  logo_base64, category, is_overseas, founded_year, employee_count, industry
) VALUES (
  'Patterns',
  'AI-powered ecommerce marketing platform with automated product recommendations and personalization Patterns是一个Marketing领域的AI工具，在2024-2025年期间获得了7.4分的受欢迎度评分。',
  'AI-powered ecommerce marketing platform with automated product recommendations and personalization Patterns is an AI tool in the Marketing field, achieving a popularity score of 7.4 during 2024-2025.',
  'Beijing, China',
  755405841,
  'https://patterns.app',
  NULL,
  'domesticUnicorns',
  false,
  2018,
  '198-298',
  'Artificial Intelligence'
) RETURNING id;

-- 项目: Patterns
INSERT INTO projects (
  company_id, name, description, category, website, pricing_model, 
  target_users, key_features, use_cases
) VALUES (
  (SELECT id FROM companies WHERE name = 'Patterns'),
  'Patterns',
  'AI-powered ecommerce marketing platform with automated product recommendations and personalization',
  'Marketing',
  'https://patterns.app',
  'Freemium',
  'Marketers, Business Owners',
  'Campaign optimization, Audience targeting, Performance analytics',
  'Campaign management, Audience engagement, Analytics'
);

-- 融资: Seed
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Patterns'),
  'Seed',
  38000000,
  'Sequoia Capital, Andreessen Horowitz',
  392000000,
  2020,
  'Andreessen Horowitz'
);

-- 融资: Series A
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Patterns'),
  'Series A',
  39000000,
  'Sequoia Capital, Andreessen Horowitz',
  247000000,
  2021,
  'Sequoia Capital'
);

-- 新闻: Patterns 获得新一轮融资，估值大幅提升
INSERT INTO stories (
  company_id, title, summary, source_url, published_date, category, tags
) VALUES (
  (SELECT id FROM companies WHERE name = 'Patterns'),
  'Patterns 获得新一轮融资，估值大幅提升',
  'Patterns作为Marketing领域的领先AI工具，近日宣布完成新一轮融资，估值较上轮提升显著。该轮融资将主要用于产品研发和市场扩张。',
  'https://techcrunch.com',
  '2024-06-15',
  '融资新闻',
  ARRAY['融资', 'AI', '科技']
);


-- 公司 82: Theseventhsense
INSERT INTO companies (
  name, description, english_description, headquarters, valuation, website, 
  logo_base64, category, is_overseas, founded_year, employee_count, industry
) VALUES (
  'Theseventhsense',
  'AI email delivery optimization platform that uses machine learning to improve open rates and engagement Seventh Sense是一个Marketing领域的AI工具，在2024-2025年期间获得了7.3分的受欢迎度评分。',
  'AI email delivery optimization platform that uses machine learning to improve open rates and engagement Seventh Sense is an AI tool in the Marketing field, achieving a popularity score of 7.3 during 2024-2025.',
  'San Francisco, USA',
  1035158304,
  'https://www.theseventhsense.com',
  NULL,
  'aiUnicorns',
  true,
  2018,
  '196-296',
  'Artificial Intelligence'
) RETURNING id;

-- 项目: Seventh Sense
INSERT INTO projects (
  company_id, name, description, category, website, pricing_model, 
  target_users, key_features, use_cases
) VALUES (
  (SELECT id FROM companies WHERE name = 'Theseventhsense'),
  'Seventh Sense',
  'AI email delivery optimization platform that uses machine learning to improve open rates and engagement',
  'Marketing',
  'https://www.theseventhsense.com',
  'Freemium',
  'Marketers, Business Owners',
  'Campaign optimization, Audience targeting, Performance analytics',
  'Campaign management, Audience engagement, Analytics'
);

-- 融资: Seed
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Theseventhsense'),
  'Seed',
  37000000,
  'Sequoia Capital, Andreessen Horowitz',
  149000000,
  2020,
  'Andreessen Horowitz'
);

-- 融资: Series A
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Theseventhsense'),
  'Series A',
  29000000,
  'Sequoia Capital, Andreessen Horowitz, Accel',
  332000000,
  2021,
  'NEA'
);

-- 新闻: Seventh Sense 获得新一轮融资，估值大幅提升
INSERT INTO stories (
  company_id, title, summary, source_url, published_date, category, tags
) VALUES (
  (SELECT id FROM companies WHERE name = 'Theseventhsense'),
  'Seventh Sense 获得新一轮融资，估值大幅提升',
  'Seventh Sense作为Marketing领域的领先AI工具，近日宣布完成新一轮融资，估值较上轮提升显著。该轮融资将主要用于产品研发和市场扩张。',
  'https://techcrunch.com',
  '2024-06-15',
  '融资新闻',
  ARRAY['融资', 'AI', '科技']
);


-- 公司 83: Brandwatch
INSERT INTO companies (
  name, description, english_description, headquarters, valuation, website, 
  logo_base64, category, is_overseas, founded_year, employee_count, industry
) VALUES (
  'Brandwatch',
  'AI-powered social media monitoring and consumer intelligence platform with sentiment analysis and trend detection Brandwatch是一个Marketing领域的AI工具，在2024-2025年期间获得了7.6分的受欢迎度评分。',
  'AI-powered social media monitoring and consumer intelligence platform with sentiment analysis and trend detection Brandwatch is an AI tool in the Marketing field, achieving a popularity score of 7.6 during 2024-2025.',
  'San Francisco, USA',
  774001414,
  'https://www.brandwatch.com',
  NULL,
  'aiUnicorns',
  true,
  2018,
  '202-302',
  'Artificial Intelligence'
) RETURNING id;

-- 项目: Brandwatch
INSERT INTO projects (
  company_id, name, description, category, website, pricing_model, 
  target_users, key_features, use_cases
) VALUES (
  (SELECT id FROM companies WHERE name = 'Brandwatch'),
  'Brandwatch',
  'AI-powered social media monitoring and consumer intelligence platform with sentiment analysis and trend detection',
  'Marketing',
  'https://www.brandwatch.com',
  'Freemium',
  'Marketers, Business Owners',
  'Campaign optimization, Audience targeting, Performance analytics',
  'Campaign management, Audience engagement, Analytics'
);

-- 融资: Seed
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Brandwatch'),
  'Seed',
  44000000,
  'Sequoia Capital',
  116000000,
  2020,
  'Accel'
);

-- 融资: Series A
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Brandwatch'),
  'Series A',
  54000000,
  'Sequoia Capital',
  524000000,
  2021,
  'NEA'
);

-- 新闻: Brandwatch 获得新一轮融资，估值大幅提升
INSERT INTO stories (
  company_id, title, summary, source_url, published_date, category, tags
) VALUES (
  (SELECT id FROM companies WHERE name = 'Brandwatch'),
  'Brandwatch 获得新一轮融资，估值大幅提升',
  'Brandwatch作为Marketing领域的领先AI工具，近日宣布完成新一轮融资，估值较上轮提升显著。该轮融资将主要用于产品研发和市场扩张。',
  'https://techcrunch.com',
  '2024-06-15',
  '融资新闻',
  ARRAY['融资', 'AI', '科技']
);

-- 新闻: Brandwatch 发布重大更新，新增多项AI功能
INSERT INTO stories (
  company_id, title, summary, source_url, published_date, category, tags
) VALUES (
  (SELECT id FROM companies WHERE name = 'Brandwatch'),
  'Brandwatch 发布重大更新，新增多项AI功能',
  'Brandwatch团队宣布推出重大产品更新，新增多项AI驱动功能，进一步提升用户体验。新功能包括智能推荐、自动化工作流等。',
  'https://www.theverge.com',
  '2024-08-20',
  '产品发布',
  ARRAY['产品更新', 'AI', '功能']
);


-- 公司 84: Albert
INSERT INTO companies (
  name, description, english_description, headquarters, valuation, website, 
  logo_base64, category, is_overseas, founded_year, employee_count, industry
) VALUES (
  'Albert',
  'Autonomous AI marketing platform that manages and optimizes digital advertising campaigns across channels Albert AI是一个Marketing领域的AI工具，在2024-2025年期间获得了7.2分的受欢迎度评分。',
  'Autonomous AI marketing platform that manages and optimizes digital advertising campaigns across channels Albert AI is an AI tool in the Marketing field, achieving a popularity score of 7.2 during 2024-2025.',
  'San Francisco, USA',
  366738145,
  'https://albert.ai',
  NULL,
  'aiUnicorns',
  true,
  2018,
  '194-294',
  'Artificial Intelligence'
) RETURNING id;

-- 项目: Albert AI
INSERT INTO projects (
  company_id, name, description, category, website, pricing_model, 
  target_users, key_features, use_cases
) VALUES (
  (SELECT id FROM companies WHERE name = 'Albert'),
  'Albert AI',
  'Autonomous AI marketing platform that manages and optimizes digital advertising campaigns across channels',
  'Marketing',
  'https://albert.ai',
  'Freemium',
  'Marketers, Business Owners',
  'Campaign optimization, Audience targeting, Performance analytics',
  'Campaign management, Audience engagement, Analytics'
);

-- 融资: Seed
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Albert'),
  'Seed',
  35000000,
  'Sequoia Capital, Andreessen Horowitz, Accel',
  523000000,
  2020,
  'GV'
);

-- 融资: Series A
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Albert'),
  'Series A',
  23000000,
  'Sequoia Capital',
  247000000,
  2021,
  'Sequoia Capital'
);

-- 新闻: Albert AI 获得新一轮融资，估值大幅提升
INSERT INTO stories (
  company_id, title, summary, source_url, published_date, category, tags
) VALUES (
  (SELECT id FROM companies WHERE name = 'Albert'),
  'Albert AI 获得新一轮融资，估值大幅提升',
  'Albert AI作为Marketing领域的领先AI工具，近日宣布完成新一轮融资，估值较上轮提升显著。该轮融资将主要用于产品研发和市场扩张。',
  'https://techcrunch.com',
  '2024-06-15',
  '融资新闻',
  ARRAY['融资', 'AI', '科技']
);


-- 公司 85: Seamless
INSERT INTO companies (
  name, description, english_description, headquarters, valuation, website, 
  logo_base64, category, is_overseas, founded_year, employee_count, industry
) VALUES (
  'Seamless',
  'AI-powered sales prospecting platform for finding verified contact information and building targeted lead lists Seamless.AI是一个Sales领域的AI工具，在2024-2025年期间获得了7.8分的受欢迎度评分。',
  'AI-powered sales prospecting platform for finding verified contact information and building targeted lead lists Seamless.AI is an AI tool in the Sales field, achieving a popularity score of 7.8 during 2024-2025.',
  'San Francisco, USA',
  922405976,
  'https://seamless.ai',
  NULL,
  'aiUnicorns',
  true,
  2018,
  '206-306',
  'Artificial Intelligence'
) RETURNING id;

-- 项目: Seamless.AI
INSERT INTO projects (
  company_id, name, description, category, website, pricing_model, 
  target_users, key_features, use_cases
) VALUES (
  (SELECT id FROM companies WHERE name = 'Seamless'),
  'Seamless.AI',
  'AI-powered sales prospecting platform for finding verified contact information and building targeted lead lists',
  'Sales',
  'https://seamless.ai',
  'Freemium',
  'Sales Teams, Business Development',
  'Lead generation, Pipeline management, Performance tracking',
  'Lead management, Sales tracking, Customer relationship'
);

-- 融资: Seed
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Seamless'),
  'Seed',
  38000000,
  'Sequoia Capital',
  426000000,
  2020,
  'Accel'
);

-- 融资: Series A
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Seamless'),
  'Series A',
  51000000,
  'Sequoia Capital, Andreessen Horowitz',
  298000000,
  2021,
  'Accel'
);

-- 新闻: Seamless.AI 获得新一轮融资，估值大幅提升
INSERT INTO stories (
  company_id, title, summary, source_url, published_date, category, tags
) VALUES (
  (SELECT id FROM companies WHERE name = 'Seamless'),
  'Seamless.AI 获得新一轮融资，估值大幅提升',
  'Seamless.AI作为Sales领域的领先AI工具，近日宣布完成新一轮融资，估值较上轮提升显著。该轮融资将主要用于产品研发和市场扩张。',
  'https://techcrunch.com',
  '2024-06-15',
  '融资新闻',
  ARRAY['融资', 'AI', '科技']
);

-- 新闻: Seamless.AI 发布重大更新，新增多项AI功能
INSERT INTO stories (
  company_id, title, summary, source_url, published_date, category, tags
) VALUES (
  (SELECT id FROM companies WHERE name = 'Seamless'),
  'Seamless.AI 发布重大更新，新增多项AI功能',
  'Seamless.AI团队宣布推出重大产品更新，新增多项AI驱动功能，进一步提升用户体验。新功能包括智能推荐、自动化工作流等。',
  'https://www.theverge.com',
  '2024-08-20',
  '产品发布',
  ARRAY['产品更新', 'AI', '功能']
);


-- 公司 86: Gong
INSERT INTO companies (
  name, description, english_description, headquarters, valuation, website, 
  logo_base64, category, is_overseas, founded_year, employee_count, industry
) VALUES (
  'Gong',
  'AI revenue intelligence platform that analyzes sales conversations to improve deal outcomes and team performance Gong是一个Sales领域的AI工具，在2024-2025年期间获得了8.1分的受欢迎度评分。',
  'AI revenue intelligence platform that analyzes sales conversations to improve deal outcomes and team performance Gong is an AI tool in the Sales field, achieving a popularity score of 8.1 during 2024-2025.',
  'San Francisco, USA',
  531873728,
  'https://www.gong.io',
  NULL,
  'aiUnicorns',
  true,
  2019,
  '212-312',
  'Artificial Intelligence'
) RETURNING id;

-- 项目: Gong
INSERT INTO projects (
  company_id, name, description, category, website, pricing_model, 
  target_users, key_features, use_cases
) VALUES (
  (SELECT id FROM companies WHERE name = 'Gong'),
  'Gong',
  'AI revenue intelligence platform that analyzes sales conversations to improve deal outcomes and team performance',
  'Sales',
  'https://www.gong.io',
  'Freemium',
  'Sales Teams, Business Development',
  'Lead generation, Pipeline management, Performance tracking',
  'Lead management, Sales tracking, Customer relationship'
);

-- 融资: Seed
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Gong'),
  'Seed',
  15000000,
  'Sequoia Capital, Andreessen Horowitz',
  544000000,
  2020,
  'GV'
);

-- 融资: Series A
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Gong'),
  'Series A',
  41000000,
  'Sequoia Capital',
  259000000,
  2021,
  'Accel'
);

-- 新闻: Gong 获得新一轮融资，估值大幅提升
INSERT INTO stories (
  company_id, title, summary, source_url, published_date, category, tags
) VALUES (
  (SELECT id FROM companies WHERE name = 'Gong'),
  'Gong 获得新一轮融资，估值大幅提升',
  'Gong作为Sales领域的领先AI工具，近日宣布完成新一轮融资，估值较上轮提升显著。该轮融资将主要用于产品研发和市场扩张。',
  'https://techcrunch.com',
  '2024-06-15',
  '融资新闻',
  ARRAY['融资', 'AI', '科技']
);

-- 新闻: Gong 发布重大更新，新增多项AI功能
INSERT INTO stories (
  company_id, title, summary, source_url, published_date, category, tags
) VALUES (
  (SELECT id FROM companies WHERE name = 'Gong'),
  'Gong 发布重大更新，新增多项AI功能',
  'Gong团队宣布推出重大产品更新，新增多项AI驱动功能，进一步提升用户体验。新功能包括智能推荐、自动化工作流等。',
  'https://www.theverge.com',
  '2024-08-20',
  '产品发布',
  ARRAY['产品更新', 'AI', '功能']
);


-- 公司 87: Outreach
INSERT INTO companies (
  name, description, english_description, headquarters, valuation, website, 
  logo_base64, category, is_overseas, founded_year, employee_count, industry
) VALUES (
  'Outreach',
  'AI-powered sales engagement platform with automated sequences, conversation intelligence, and pipeline management Outreach是一个Sales领域的AI工具，在2024-2025年期间获得了7.9分的受欢迎度评分。',
  'AI-powered sales engagement platform with automated sequences, conversation intelligence, and pipeline management Outreach is an AI tool in the Sales field, achieving a popularity score of 7.9 during 2024-2025.',
  'San Francisco, USA',
  613566279,
  'https://www.outreach.io',
  NULL,
  'aiUnicorns',
  true,
  2018,
  '208-308',
  'Artificial Intelligence'
) RETURNING id;

-- 项目: Outreach
INSERT INTO projects (
  company_id, name, description, category, website, pricing_model, 
  target_users, key_features, use_cases
) VALUES (
  (SELECT id FROM companies WHERE name = 'Outreach'),
  'Outreach',
  'AI-powered sales engagement platform with automated sequences, conversation intelligence, and pipeline management',
  'Sales',
  'https://www.outreach.io',
  'Freemium',
  'Sales Teams, Business Development',
  'Lead generation, Pipeline management, Performance tracking',
  'Lead management, Sales tracking, Customer relationship'
);

-- 融资: Seed
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Outreach'),
  'Seed',
  41000000,
  'Sequoia Capital, Andreessen Horowitz, Accel',
  585000000,
  2020,
  'Andreessen Horowitz'
);

-- 融资: Series A
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Outreach'),
  'Series A',
  47000000,
  'Sequoia Capital, Andreessen Horowitz',
  591000000,
  2021,
  'Sequoia Capital'
);

-- 新闻: Outreach 获得新一轮融资，估值大幅提升
INSERT INTO stories (
  company_id, title, summary, source_url, published_date, category, tags
) VALUES (
  (SELECT id FROM companies WHERE name = 'Outreach'),
  'Outreach 获得新一轮融资，估值大幅提升',
  'Outreach作为Sales领域的领先AI工具，近日宣布完成新一轮融资，估值较上轮提升显著。该轮融资将主要用于产品研发和市场扩张。',
  'https://techcrunch.com',
  '2024-06-15',
  '融资新闻',
  ARRAY['融资', 'AI', '科技']
);


-- 公司 88: Chorus
INSERT INTO companies (
  name, description, english_description, headquarters, valuation, website, 
  logo_base64, category, is_overseas, founded_year, employee_count, industry
) VALUES (
  'Chorus',
  'AI conversation analytics platform for sales teams with call recording, coaching insights, and deal risk analysis Chorus是一个Sales领域的AI工具，在2024-2025年期间获得了7.7分的受欢迎度评分。',
  'AI conversation analytics platform for sales teams with call recording, coaching insights, and deal risk analysis Chorus is an AI tool in the Sales field, achieving a popularity score of 7.7 during 2024-2025.',
  'San Francisco, USA',
  713369041,
  'https://www.chorus.ai',
  NULL,
  'aiUnicorns',
  true,
  2018,
  '204-304',
  'Artificial Intelligence'
) RETURNING id;

-- 项目: Chorus
INSERT INTO projects (
  company_id, name, description, category, website, pricing_model, 
  target_users, key_features, use_cases
) VALUES (
  (SELECT id FROM companies WHERE name = 'Chorus'),
  'Chorus',
  'AI conversation analytics platform for sales teams with call recording, coaching insights, and deal risk analysis',
  'Sales',
  'https://www.chorus.ai',
  'Freemium',
  'Sales Teams, Business Development',
  'Lead generation, Pipeline management, Performance tracking',
  'Lead management, Sales tracking, Customer relationship'
);

-- 融资: Seed
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Chorus'),
  'Seed',
  56000000,
  'Sequoia Capital, Andreessen Horowitz',
  568000000,
  2020,
  'Accel'
);

-- 融资: Series A
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Chorus'),
  'Series A',
  41000000,
  'Sequoia Capital',
  315000000,
  2021,
  'Andreessen Horowitz'
);

-- 新闻: Chorus 获得新一轮融资，估值大幅提升
INSERT INTO stories (
  company_id, title, summary, source_url, published_date, category, tags
) VALUES (
  (SELECT id FROM companies WHERE name = 'Chorus'),
  'Chorus 获得新一轮融资，估值大幅提升',
  'Chorus作为Sales领域的领先AI工具，近日宣布完成新一轮融资，估值较上轮提升显著。该轮融资将主要用于产品研发和市场扩张。',
  'https://techcrunch.com',
  '2024-06-15',
  '融资新闻',
  ARRAY['融资', 'AI', '科技']
);

-- 新闻: Chorus 发布重大更新，新增多项AI功能
INSERT INTO stories (
  company_id, title, summary, source_url, published_date, category, tags
) VALUES (
  (SELECT id FROM companies WHERE name = 'Chorus'),
  'Chorus 发布重大更新，新增多项AI功能',
  'Chorus团队宣布推出重大产品更新，新增多项AI驱动功能，进一步提升用户体验。新功能包括智能推荐、自动化工作流等。',
  'https://www.theverge.com',
  '2024-08-20',
  '产品发布',
  ARRAY['产品更新', 'AI', '功能']
);


-- 公司 89: Character
INSERT INTO companies (
  name, description, english_description, headquarters, valuation, website, 
  logo_base64, category, is_overseas, founded_year, employee_count, industry
) VALUES (
  'Character',
  'AI character chatbot platform for creating and conversing with custom AI personalities for entertainment and education Character.ai是一个Chatbots领域的AI工具，在2024-2025年期间获得了8分的受欢迎度评分。',
  'AI character chatbot platform for creating and conversing with custom AI personalities for entertainment and education Character.ai is an AI tool in the Chatbots field, achieving a popularity score of 8 during 2024-2025.',
  'San Francisco, USA',
  985620288,
  'https://character.ai',
  NULL,
  'aiUnicorns',
  true,
  2019,
  '210-310',
  'Artificial Intelligence'
) RETURNING id;

-- 项目: Character.ai
INSERT INTO projects (
  company_id, name, description, category, website, pricing_model, 
  target_users, key_features, use_cases
) VALUES (
  (SELECT id FROM companies WHERE name = 'Character'),
  'Character.ai',
  'AI character chatbot platform for creating and conversing with custom AI personalities for entertainment and education',
  'Chatbots',
  'https://character.ai',
  'Freemium',
  'Businesses, Customer Service Teams',
  'Natural conversations, Multi-language support, Integration capabilities',
  'Customer service, Lead qualification, Information provision'
);

-- 融资: Seed
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Character'),
  'Seed',
  50000000,
  'Sequoia Capital, Andreessen Horowitz, Accel',
  246000000,
  2020,
  'Sequoia Capital'
);

-- 融资: Series A
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Character'),
  'Series A',
  41000000,
  'Sequoia Capital, Andreessen Horowitz',
  463000000,
  2021,
  'NEA'
);

-- 新闻: Character.ai 获得新一轮融资，估值大幅提升
INSERT INTO stories (
  company_id, title, summary, source_url, published_date, category, tags
) VALUES (
  (SELECT id FROM companies WHERE name = 'Character'),
  'Character.ai 获得新一轮融资，估值大幅提升',
  'Character.ai作为Chatbots领域的领先AI工具，近日宣布完成新一轮融资，估值较上轮提升显著。该轮融资将主要用于产品研发和市场扩张。',
  'https://techcrunch.com',
  '2024-06-15',
  '融资新闻',
  ARRAY['融资', 'AI', '科技']
);

-- 新闻: Character.ai 发布重大更新，新增多项AI功能
INSERT INTO stories (
  company_id, title, summary, source_url, published_date, category, tags
) VALUES (
  (SELECT id FROM companies WHERE name = 'Character'),
  'Character.ai 发布重大更新，新增多项AI功能',
  'Character.ai团队宣布推出重大产品更新，新增多项AI驱动功能，进一步提升用户体验。新功能包括智能推荐、自动化工作流等。',
  'https://www.theverge.com',
  '2024-08-20',
  '产品发布',
  ARRAY['产品更新', 'AI', '功能']
);


-- 公司 90: Poe
INSERT INTO companies (
  name, description, english_description, headquarters, valuation, website, 
  logo_base64, category, is_overseas, founded_year, employee_count, industry
) VALUES (
  'Poe',
  'AI chatbot aggregator by Quora providing access to multiple AI models including Claude, GPT, and others in one platform Poe是一个Chatbots领域的AI工具，在2024-2025年期间获得了7.9分的受欢迎度评分。',
  'AI chatbot aggregator by Quora providing access to multiple AI models including Claude, GPT, and others in one platform Poe is an AI tool in the Chatbots field, achieving a popularity score of 7.9 during 2024-2025.',
  'San Francisco, USA',
  887164734,
  'https://poe.com',
  NULL,
  'aiUnicorns',
  true,
  2018,
  '208-308',
  'Artificial Intelligence'
) RETURNING id;

-- 项目: Poe
INSERT INTO projects (
  company_id, name, description, category, website, pricing_model, 
  target_users, key_features, use_cases
) VALUES (
  (SELECT id FROM companies WHERE name = 'Poe'),
  'Poe',
  'AI chatbot aggregator by Quora providing access to multiple AI models including Claude, GPT, and others in one platform',
  'Chatbots',
  'https://poe.com',
  'Freemium',
  'Businesses, Customer Service Teams',
  'Natural conversations, Multi-language support, Integration capabilities',
  'Customer service, Lead qualification, Information provision'
);

-- 融资: Seed
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Poe'),
  'Seed',
  30000000,
  'Sequoia Capital, Andreessen Horowitz, Accel',
  181000000,
  2020,
  'Andreessen Horowitz'
);

-- 融资: Series A
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Poe'),
  'Series A',
  40000000,
  'Sequoia Capital, Andreessen Horowitz',
  155000000,
  2021,
  'NEA'
);

-- 新闻: Poe 获得新一轮融资，估值大幅提升
INSERT INTO stories (
  company_id, title, summary, source_url, published_date, category, tags
) VALUES (
  (SELECT id FROM companies WHERE name = 'Poe'),
  'Poe 获得新一轮融资，估值大幅提升',
  'Poe作为Chatbots领域的领先AI工具，近日宣布完成新一轮融资，估值较上轮提升显著。该轮融资将主要用于产品研发和市场扩张。',
  'https://techcrunch.com',
  '2024-06-15',
  '融资新闻',
  ARRAY['融资', 'AI', '科技']
);

-- 新闻: Poe 发布重大更新，新增多项AI功能
INSERT INTO stories (
  company_id, title, summary, source_url, published_date, category, tags
) VALUES (
  (SELECT id FROM companies WHERE name = 'Poe'),
  'Poe 发布重大更新，新增多项AI功能',
  'Poe团队宣布推出重大产品更新，新增多项AI驱动功能，进一步提升用户体验。新功能包括智能推荐、自动化工作流等。',
  'https://www.theverge.com',
  '2024-08-20',
  '产品发布',
  ARRAY['产品更新', 'AI', '功能']
);


-- 公司 91: Intercom
INSERT INTO companies (
  name, description, english_description, headquarters, valuation, website, 
  logo_base64, category, is_overseas, founded_year, employee_count, industry
) VALUES (
  'Intercom',
  'AI-powered customer service chatbot with natural language understanding and seamless handoff to human agents Intercom Fin是一个Customer Support领域的AI工具，在2024-2025年期间获得了8.1分的受欢迎度评分。',
  'AI-powered customer service chatbot with natural language understanding and seamless handoff to human agents Intercom Fin is an AI tool in the Customer Support field, achieving a popularity score of 8.1 during 2024-2025.',
  'San Francisco, USA',
  1046261218,
  'https://www.intercom.com/fin',
  NULL,
  'aiUnicorns',
  true,
  2019,
  '212-312',
  'Artificial Intelligence'
) RETURNING id;

-- 项目: Intercom Fin
INSERT INTO projects (
  company_id, name, description, category, website, pricing_model, 
  target_users, key_features, use_cases
) VALUES (
  (SELECT id FROM companies WHERE name = 'Intercom'),
  'Intercom Fin',
  'AI-powered customer service chatbot with natural language understanding and seamless handoff to human agents',
  'Customer Support',
  'https://www.intercom.com/fin',
  'Freemium',
  'Customer Service Teams, Businesses',
  'Automated responses, Ticket routing, Knowledge base',
  'Customer service, FAQ automation, Ticket management'
);

-- 融资: Seed
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Intercom'),
  'Seed',
  53000000,
  'Sequoia Capital',
  206000000,
  2020,
  'Sequoia Capital'
);

-- 融资: Series A
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Intercom'),
  'Series A',
  42000000,
  'Sequoia Capital, Andreessen Horowitz',
  455000000,
  2021,
  'NEA'
);

-- 新闻: Intercom Fin 获得新一轮融资，估值大幅提升
INSERT INTO stories (
  company_id, title, summary, source_url, published_date, category, tags
) VALUES (
  (SELECT id FROM companies WHERE name = 'Intercom'),
  'Intercom Fin 获得新一轮融资，估值大幅提升',
  'Intercom Fin作为Customer Support领域的领先AI工具，近日宣布完成新一轮融资，估值较上轮提升显著。该轮融资将主要用于产品研发和市场扩张。',
  'https://techcrunch.com',
  '2024-06-15',
  '融资新闻',
  ARRAY['融资', 'AI', '科技']
);

-- 新闻: Intercom Fin 发布重大更新，新增多项AI功能
INSERT INTO stories (
  company_id, title, summary, source_url, published_date, category, tags
) VALUES (
  (SELECT id FROM companies WHERE name = 'Intercom'),
  'Intercom Fin 发布重大更新，新增多项AI功能',
  'Intercom Fin团队宣布推出重大产品更新，新增多项AI驱动功能，进一步提升用户体验。新功能包括智能推荐、自动化工作流等。',
  'https://www.theverge.com',
  '2024-08-20',
  '产品发布',
  ARRAY['产品更新', 'AI', '功能']
);


-- 公司 92: Zendesk
INSERT INTO companies (
  name, description, english_description, headquarters, valuation, website, 
  logo_base64, category, is_overseas, founded_year, employee_count, industry
) VALUES (
  'Zendesk',
  'AI-enhanced customer support platform with automated ticket routing, sentiment analysis, and response suggestions Zendesk AI是一个Customer Support领域的AI工具，在2024-2025年期间获得了7.8分的受欢迎度评分。',
  'AI-enhanced customer support platform with automated ticket routing, sentiment analysis, and response suggestions Zendesk AI is an AI tool in the Customer Support field, achieving a popularity score of 7.8 during 2024-2025.',
  'San Francisco, USA',
  755504739,
  'https://www.zendesk.com/ai',
  NULL,
  'aiUnicorns',
  true,
  2018,
  '206-306',
  'Artificial Intelligence'
) RETURNING id;

-- 项目: Zendesk AI
INSERT INTO projects (
  company_id, name, description, category, website, pricing_model, 
  target_users, key_features, use_cases
) VALUES (
  (SELECT id FROM companies WHERE name = 'Zendesk'),
  'Zendesk AI',
  'AI-enhanced customer support platform with automated ticket routing, sentiment analysis, and response suggestions',
  'Customer Support',
  'https://www.zendesk.com/ai',
  'Freemium',
  'Customer Service Teams, Businesses',
  'Automated responses, Ticket routing, Knowledge base',
  'Customer service, FAQ automation, Ticket management'
);

-- 融资: Seed
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Zendesk'),
  'Seed',
  25000000,
  'Sequoia Capital, Andreessen Horowitz',
  284000000,
  2020,
  'Andreessen Horowitz'
);

-- 融资: Series A
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Zendesk'),
  'Series A',
  18000000,
  'Sequoia Capital, Andreessen Horowitz',
  541000000,
  2021,
  'Accel'
);

-- 新闻: Zendesk AI 获得新一轮融资，估值大幅提升
INSERT INTO stories (
  company_id, title, summary, source_url, published_date, category, tags
) VALUES (
  (SELECT id FROM companies WHERE name = 'Zendesk'),
  'Zendesk AI 获得新一轮融资，估值大幅提升',
  'Zendesk AI作为Customer Support领域的领先AI工具，近日宣布完成新一轮融资，估值较上轮提升显著。该轮融资将主要用于产品研发和市场扩张。',
  'https://techcrunch.com',
  '2024-06-15',
  '融资新闻',
  ARRAY['融资', 'AI', '科技']
);


-- 公司 93: Ada
INSERT INTO companies (
  name, description, english_description, headquarters, valuation, website, 
  logo_base64, category, is_overseas, founded_year, employee_count, industry
) VALUES (
  'Ada',
  'AI chatbot platform for customer service with no-code bot building and automated resolution of common inquiries Ada是一个Customer Support领域的AI工具，在2024-2025年期间获得了7.6分的受欢迎度评分。',
  'AI chatbot platform for customer service with no-code bot building and automated resolution of common inquiries Ada is an AI tool in the Customer Support field, achieving a popularity score of 7.6 during 2024-2025.',
  'Beijing, China',
  1077353209,
  'https://www.ada.cx',
  NULL,
  'domesticUnicorns',
  false,
  2018,
  '202-302',
  'Artificial Intelligence'
) RETURNING id;

-- 项目: Ada
INSERT INTO projects (
  company_id, name, description, category, website, pricing_model, 
  target_users, key_features, use_cases
) VALUES (
  (SELECT id FROM companies WHERE name = 'Ada'),
  'Ada',
  'AI chatbot platform for customer service with no-code bot building and automated resolution of common inquiries',
  'Customer Support',
  'https://www.ada.cx',
  'Freemium',
  'Customer Service Teams, Businesses',
  'Automated responses, Ticket routing, Knowledge base',
  'Customer service, FAQ automation, Ticket management'
);

-- 融资: Seed
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Ada'),
  'Seed',
  33000000,
  'Sequoia Capital, Andreessen Horowitz',
  102000000,
  2020,
  'GV'
);

-- 融资: Series A
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Ada'),
  'Series A',
  32000000,
  'Sequoia Capital',
  590000000,
  2021,
  'Andreessen Horowitz'
);

-- 新闻: Ada 获得新一轮融资，估值大幅提升
INSERT INTO stories (
  company_id, title, summary, source_url, published_date, category, tags
) VALUES (
  (SELECT id FROM companies WHERE name = 'Ada'),
  'Ada 获得新一轮融资，估值大幅提升',
  'Ada作为Customer Support领域的领先AI工具，近日宣布完成新一轮融资，估值较上轮提升显著。该轮融资将主要用于产品研发和市场扩张。',
  'https://techcrunch.com',
  '2024-06-15',
  '融资新闻',
  ARRAY['融资', 'AI', '科技']
);

-- 新闻: Ada 发布重大更新，新增多项AI功能
INSERT INTO stories (
  company_id, title, summary, source_url, published_date, category, tags
) VALUES (
  (SELECT id FROM companies WHERE name = 'Ada'),
  'Ada 发布重大更新，新增多项AI功能',
  'Ada团队宣布推出重大产品更新，新增多项AI驱动功能，进一步提升用户体验。新功能包括智能推荐、自动化工作流等。',
  'https://www.theverge.com',
  '2024-08-20',
  '产品发布',
  ARRAY['产品更新', 'AI', '功能']
);


-- 公司 94: Liveperson
INSERT INTO companies (
  name, description, english_description, headquarters, valuation, website, 
  logo_base64, category, is_overseas, founded_year, employee_count, industry
) VALUES (
  'Liveperson',
  'Conversational AI platform for customer engagement with voice and text capabilities across multiple channels LivePerson是一个Customer Support领域的AI工具，在2024-2025年期间获得了7.5分的受欢迎度评分。',
  'Conversational AI platform for customer engagement with voice and text capabilities across multiple channels LivePerson is an AI tool in the Customer Support field, achieving a popularity score of 7.5 during 2024-2025.',
  'San Francisco, USA',
  610787438,
  'https://www.liveperson.com',
  NULL,
  'aiUnicorns',
  true,
  2018,
  '200-300',
  'Artificial Intelligence'
) RETURNING id;

-- 项目: LivePerson
INSERT INTO projects (
  company_id, name, description, category, website, pricing_model, 
  target_users, key_features, use_cases
) VALUES (
  (SELECT id FROM companies WHERE name = 'Liveperson'),
  'LivePerson',
  'Conversational AI platform for customer engagement with voice and text capabilities across multiple channels',
  'Customer Support',
  'https://www.liveperson.com',
  'Freemium',
  'Customer Service Teams, Businesses',
  'Automated responses, Ticket routing, Knowledge base',
  'Customer service, FAQ automation, Ticket management'
);

-- 融资: Seed
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Liveperson'),
  'Seed',
  59000000,
  'Sequoia Capital',
  314000000,
  2020,
  'Accel'
);

-- 融资: Series A
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Liveperson'),
  'Series A',
  36000000,
  'Sequoia Capital',
  239000000,
  2021,
  'NEA'
);

-- 新闻: LivePerson 获得新一轮融资，估值大幅提升
INSERT INTO stories (
  company_id, title, summary, source_url, published_date, category, tags
) VALUES (
  (SELECT id FROM companies WHERE name = 'Liveperson'),
  'LivePerson 获得新一轮融资，估值大幅提升',
  'LivePerson作为Customer Support领域的领先AI工具，近日宣布完成新一轮融资，估值较上轮提升显著。该轮融资将主要用于产品研发和市场扩张。',
  'https://techcrunch.com',
  '2024-06-15',
  '融资新闻',
  ARRAY['融资', 'AI', '科技']
);


-- 公司 95: Drift
INSERT INTO companies (
  name, description, english_description, headquarters, valuation, website, 
  logo_base64, category, is_overseas, founded_year, employee_count, industry
) VALUES (
  'Drift',
  'AI-powered conversational marketing platform with chatbots for lead qualification and customer engagement Drift是一个Customer Support领域的AI工具，在2024-2025年期间获得了7.7分的受欢迎度评分。',
  'AI-powered conversational marketing platform with chatbots for lead qualification and customer engagement Drift is an AI tool in the Customer Support field, achieving a popularity score of 7.7 during 2024-2025.',
  'San Francisco, USA',
  768179844,
  'https://www.drift.com',
  NULL,
  'aiUnicorns',
  true,
  2018,
  '204-304',
  'Artificial Intelligence'
) RETURNING id;

-- 项目: Drift
INSERT INTO projects (
  company_id, name, description, category, website, pricing_model, 
  target_users, key_features, use_cases
) VALUES (
  (SELECT id FROM companies WHERE name = 'Drift'),
  'Drift',
  'AI-powered conversational marketing platform with chatbots for lead qualification and customer engagement',
  'Customer Support',
  'https://www.drift.com',
  'Freemium',
  'Customer Service Teams, Businesses',
  'Automated responses, Ticket routing, Knowledge base',
  'Customer service, FAQ automation, Ticket management'
);

-- 融资: Seed
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Drift'),
  'Seed',
  32000000,
  'Sequoia Capital',
  536000000,
  2020,
  'NEA'
);

-- 融资: Series A
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Drift'),
  'Series A',
  25000000,
  'Sequoia Capital, Andreessen Horowitz, Accel',
  431000000,
  2021,
  'GV'
);

-- 新闻: Drift 获得新一轮融资，估值大幅提升
INSERT INTO stories (
  company_id, title, summary, source_url, published_date, category, tags
) VALUES (
  (SELECT id FROM companies WHERE name = 'Drift'),
  'Drift 获得新一轮融资，估值大幅提升',
  'Drift作为Customer Support领域的领先AI工具，近日宣布完成新一轮融资，估值较上轮提升显著。该轮融资将主要用于产品研发和市场扩张。',
  'https://techcrunch.com',
  '2024-06-15',
  '融资新闻',
  ARRAY['融资', 'AI', '科技']
);


-- 公司 96: Freshworks
INSERT INTO companies (
  name, description, english_description, headquarters, valuation, website, 
  logo_base64, category, is_overseas, founded_year, employee_count, industry
) VALUES (
  'Freshworks',
  'AI assistant integrated across Freshworks suite for customer service, sales, and marketing automation Freshworks Freddy AI是一个Customer Support领域的AI工具，在2024-2025年期间获得了7.4分的受欢迎度评分。',
  'AI assistant integrated across Freshworks suite for customer service, sales, and marketing automation Freshworks Freddy AI is an AI tool in the Customer Support field, achieving a popularity score of 7.4 during 2024-2025.',
  'San Francisco, USA',
  645917750,
  'https://www.freshworks.com/freddy-ai',
  NULL,
  'aiUnicorns',
  true,
  2018,
  '198-298',
  'Artificial Intelligence'
) RETURNING id;

-- 项目: Freshworks Freddy AI
INSERT INTO projects (
  company_id, name, description, category, website, pricing_model, 
  target_users, key_features, use_cases
) VALUES (
  (SELECT id FROM companies WHERE name = 'Freshworks'),
  'Freshworks Freddy AI',
  'AI assistant integrated across Freshworks suite for customer service, sales, and marketing automation',
  'Customer Support',
  'https://www.freshworks.com/freddy-ai',
  'Freemium',
  'Customer Service Teams, Businesses',
  'Automated responses, Ticket routing, Knowledge base',
  'Customer service, FAQ automation, Ticket management'
);

-- 融资: Seed
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Freshworks'),
  'Seed',
  25000000,
  'Sequoia Capital, Andreessen Horowitz',
  290000000,
  2020,
  'Andreessen Horowitz'
);

-- 融资: Series A
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Freshworks'),
  'Series A',
  41000000,
  'Sequoia Capital, Andreessen Horowitz',
  312000000,
  2021,
  'Accel'
);

-- 新闻: Freshworks Freddy AI 获得新一轮融资，估值大幅提升
INSERT INTO stories (
  company_id, title, summary, source_url, published_date, category, tags
) VALUES (
  (SELECT id FROM companies WHERE name = 'Freshworks'),
  'Freshworks Freddy AI 获得新一轮融资，估值大幅提升',
  'Freshworks Freddy AI作为Customer Support领域的领先AI工具，近日宣布完成新一轮融资，估值较上轮提升显著。该轮融资将主要用于产品研发和市场扩张。',
  'https://techcrunch.com',
  '2024-06-15',
  '融资新闻',
  ARRAY['融资', 'AI', '科技']
);


-- 公司 97: Botpress
INSERT INTO companies (
  name, description, english_description, headquarters, valuation, website, 
  logo_base64, category, is_overseas, founded_year, employee_count, industry
) VALUES (
  'Botpress',
  'Open-source chatbot development platform with AI capabilities and enterprise-grade deployment options Botpress是一个Chatbots领域的AI工具，在2024-2025年期间获得了7.3分的受欢迎度评分。',
  'Open-source chatbot development platform with AI capabilities and enterprise-grade deployment options Botpress is an AI tool in the Chatbots field, achieving a popularity score of 7.3 during 2024-2025.',
  'San Francisco, USA',
  866987618,
  'https://botpress.com',
  NULL,
  'aiUnicorns',
  true,
  2018,
  '196-296',
  'Artificial Intelligence'
) RETURNING id;

-- 项目: Botpress
INSERT INTO projects (
  company_id, name, description, category, website, pricing_model, 
  target_users, key_features, use_cases
) VALUES (
  (SELECT id FROM companies WHERE name = 'Botpress'),
  'Botpress',
  'Open-source chatbot development platform with AI capabilities and enterprise-grade deployment options',
  'Chatbots',
  'https://botpress.com',
  'Freemium',
  'Businesses, Customer Service Teams',
  'Natural conversations, Multi-language support, Integration capabilities',
  'Customer service, Lead qualification, Information provision'
);

-- 融资: Seed
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Botpress'),
  'Seed',
  35000000,
  'Sequoia Capital, Andreessen Horowitz, Accel',
  472000000,
  2020,
  'Sequoia Capital'
);

-- 融资: Series A
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Botpress'),
  'Series A',
  30000000,
  'Sequoia Capital',
  421000000,
  2021,
  'GV'
);

-- 新闻: Botpress 获得新一轮融资，估值大幅提升
INSERT INTO stories (
  company_id, title, summary, source_url, published_date, category, tags
) VALUES (
  (SELECT id FROM companies WHERE name = 'Botpress'),
  'Botpress 获得新一轮融资，估值大幅提升',
  'Botpress作为Chatbots领域的领先AI工具，近日宣布完成新一轮融资，估值较上轮提升显著。该轮融资将主要用于产品研发和市场扩张。',
  'https://techcrunch.com',
  '2024-06-15',
  '融资新闻',
  ARRAY['融资', 'AI', '科技']
);


-- 公司 98: Rasa
INSERT INTO companies (
  name, description, english_description, headquarters, valuation, website, 
  logo_base64, category, is_overseas, founded_year, employee_count, industry
) VALUES (
  'Rasa',
  'Open-source framework for building AI assistants and chatbots with advanced natural language understanding Rasa是一个Chatbots领域的AI工具，在2024-2025年期间获得了7.2分的受欢迎度评分。',
  'Open-source framework for building AI assistants and chatbots with advanced natural language understanding Rasa is an AI tool in the Chatbots field, achieving a popularity score of 7.2 during 2024-2025.',
  'San Francisco, USA',
  531221579,
  'https://rasa.com',
  NULL,
  'aiUnicorns',
  true,
  2018,
  '194-294',
  'Artificial Intelligence'
) RETURNING id;

-- 项目: Rasa
INSERT INTO projects (
  company_id, name, description, category, website, pricing_model, 
  target_users, key_features, use_cases
) VALUES (
  (SELECT id FROM companies WHERE name = 'Rasa'),
  'Rasa',
  'Open-source framework for building AI assistants and chatbots with advanced natural language understanding',
  'Chatbots',
  'https://rasa.com',
  'Freemium',
  'Businesses, Customer Service Teams',
  'Natural conversations, Multi-language support, Integration capabilities',
  'Customer service, Lead qualification, Information provision'
);

-- 融资: Seed
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Rasa'),
  'Seed',
  53000000,
  'Sequoia Capital, Andreessen Horowitz',
  348000000,
  2020,
  'Andreessen Horowitz'
);

-- 融资: Series A
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Rasa'),
  'Series A',
  56000000,
  'Sequoia Capital, Andreessen Horowitz',
  511000000,
  2021,
  'NEA'
);

-- 新闻: Rasa 获得新一轮融资，估值大幅提升
INSERT INTO stories (
  company_id, title, summary, source_url, published_date, category, tags
) VALUES (
  (SELECT id FROM companies WHERE name = 'Rasa'),
  'Rasa 获得新一轮融资，估值大幅提升',
  'Rasa作为Chatbots领域的领先AI工具，近日宣布完成新一轮融资，估值较上轮提升显著。该轮融资将主要用于产品研发和市场扩张。',
  'https://techcrunch.com',
  '2024-06-15',
  '融资新闻',
  ARRAY['融资', 'AI', '科技']
);


-- 公司 99: Datarobot
INSERT INTO companies (
  name, description, english_description, headquarters, valuation, website, 
  logo_base64, category, is_overseas, founded_year, employee_count, industry
) VALUES (
  'Datarobot',
  'Enterprise AI platform for automated machine learning, predictive analytics, and business intelligence insights DataRobot是一个Analytics领域的AI工具，在2024-2025年期间获得了8.2分的受欢迎度评分。',
  'Enterprise AI platform for automated machine learning, predictive analytics, and business intelligence insights DataRobot is an AI tool in the Analytics field, achieving a popularity score of 8.2 during 2024-2025.',
  'San Francisco, USA',
  545240274,
  'https://www.datarobot.com',
  NULL,
  'aiUnicorns',
  true,
  2019,
  '214-314',
  'Artificial Intelligence'
) RETURNING id;

-- 项目: DataRobot
INSERT INTO projects (
  company_id, name, description, category, website, pricing_model, 
  target_users, key_features, use_cases
) VALUES (
  (SELECT id FROM companies WHERE name = 'Datarobot'),
  'DataRobot',
  'Enterprise AI platform for automated machine learning, predictive analytics, and business intelligence insights',
  'Analytics',
  'https://www.datarobot.com',
  'Freemium',
  'Data Analysts, Business Intelligence Teams',
  'Data visualization, Predictive analytics, Real-time insights',
  'Business intelligence, Data analysis, Reporting'
);

-- 融资: Seed
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Datarobot'),
  'Seed',
  14000000,
  'Sequoia Capital',
  105000000,
  2020,
  'Andreessen Horowitz'
);

-- 融资: Series A
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Datarobot'),
  'Series A',
  13000000,
  'Sequoia Capital',
  374000000,
  2021,
  'GV'
);

-- 新闻: DataRobot 获得新一轮融资，估值大幅提升
INSERT INTO stories (
  company_id, title, summary, source_url, published_date, category, tags
) VALUES (
  (SELECT id FROM companies WHERE name = 'Datarobot'),
  'DataRobot 获得新一轮融资，估值大幅提升',
  'DataRobot作为Analytics领域的领先AI工具，近日宣布完成新一轮融资，估值较上轮提升显著。该轮融资将主要用于产品研发和市场扩张。',
  'https://techcrunch.com',
  '2024-06-15',
  '融资新闻',
  ARRAY['融资', 'AI', '科技']
);

-- 新闻: DataRobot 发布重大更新，新增多项AI功能
INSERT INTO stories (
  company_id, title, summary, source_url, published_date, category, tags
) VALUES (
  (SELECT id FROM companies WHERE name = 'Datarobot'),
  'DataRobot 发布重大更新，新增多项AI功能',
  'DataRobot团队宣布推出重大产品更新，新增多项AI驱动功能，进一步提升用户体验。新功能包括智能推荐、自动化工作流等。',
  'https://www.theverge.com',
  '2024-08-20',
  '产品发布',
  ARRAY['产品更新', 'AI', '功能']
);


-- 公司 100: H2o
INSERT INTO companies (
  name, description, english_description, headquarters, valuation, website, 
  logo_base64, category, is_overseas, founded_year, employee_count, industry
) VALUES (
  'H2o',
  'Open-source machine learning platform with automated ML capabilities and enterprise AI deployment solutions H2O.ai是一个Analytics领域的AI工具，在2024-2025年期间获得了7.8分的受欢迎度评分。',
  'Open-source machine learning platform with automated ML capabilities and enterprise AI deployment solutions H2O.ai is an AI tool in the Analytics field, achieving a popularity score of 7.8 during 2024-2025.',
  'San Francisco, USA',
  552593384,
  'https://www.h2o.ai',
  NULL,
  'aiUnicorns',
  true,
  2018,
  '206-306',
  'Artificial Intelligence'
) RETURNING id;

-- 项目: H2O.ai
INSERT INTO projects (
  company_id, name, description, category, website, pricing_model, 
  target_users, key_features, use_cases
) VALUES (
  (SELECT id FROM companies WHERE name = 'H2o'),
  'H2O.ai',
  'Open-source machine learning platform with automated ML capabilities and enterprise AI deployment solutions',
  'Analytics',
  'https://www.h2o.ai',
  'Freemium',
  'Data Analysts, Business Intelligence Teams',
  'Data visualization, Predictive analytics, Real-time insights',
  'Business intelligence, Data analysis, Reporting'
);

-- 融资: Seed
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'H2o'),
  'Seed',
  50000000,
  'Sequoia Capital, Andreessen Horowitz, Accel',
  366000000,
  2020,
  'Accel'
);

-- 融资: Series A
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'H2o'),
  'Series A',
  28000000,
  'Sequoia Capital, Andreessen Horowitz, Accel',
  526000000,
  2021,
  'Andreessen Horowitz'
);

-- 新闻: H2O.ai 获得新一轮融资，估值大幅提升
INSERT INTO stories (
  company_id, title, summary, source_url, published_date, category, tags
) VALUES (
  (SELECT id FROM companies WHERE name = 'H2o'),
  'H2O.ai 获得新一轮融资，估值大幅提升',
  'H2O.ai作为Analytics领域的领先AI工具，近日宣布完成新一轮融资，估值较上轮提升显著。该轮融资将主要用于产品研发和市场扩张。',
  'https://techcrunch.com',
  '2024-06-15',
  '融资新闻',
  ARRAY['融资', 'AI', '科技']
);

-- 新闻: H2O.ai 发布重大更新，新增多项AI功能
INSERT INTO stories (
  company_id, title, summary, source_url, published_date, category, tags
) VALUES (
  (SELECT id FROM companies WHERE name = 'H2o'),
  'H2O.ai 发布重大更新，新增多项AI功能',
  'H2O.ai团队宣布推出重大产品更新，新增多项AI驱动功能，进一步提升用户体验。新功能包括智能推荐、自动化工作流等。',
  'https://www.theverge.com',
  '2024-08-20',
  '产品发布',
  ARRAY['产品更新', 'AI', '功能']
);


-- 公司 101: Tableau
INSERT INTO companies (
  name, description, english_description, headquarters, valuation, website, 
  logo_base64, category, is_overseas, founded_year, employee_count, industry
) VALUES (
  'Tableau',
  'AI-powered data visualization and business intelligence platform with automated insights and natural language queries Tableau AI是一个Analytics领域的AI工具，在2024-2025年期间获得了7.9分的受欢迎度评分。',
  'AI-powered data visualization and business intelligence platform with automated insights and natural language queries Tableau AI is an AI tool in the Analytics field, achieving a popularity score of 7.9 during 2024-2025.',
  'San Francisco, USA',
  844701320,
  'https://www.tableau.com',
  NULL,
  'aiUnicorns',
  true,
  2018,
  '208-308',
  'Artificial Intelligence'
) RETURNING id;

-- 项目: Tableau AI
INSERT INTO projects (
  company_id, name, description, category, website, pricing_model, 
  target_users, key_features, use_cases
) VALUES (
  (SELECT id FROM companies WHERE name = 'Tableau'),
  'Tableau AI',
  'AI-powered data visualization and business intelligence platform with automated insights and natural language queries',
  'Analytics',
  'https://www.tableau.com',
  'Freemium',
  'Data Analysts, Business Intelligence Teams',
  'Data visualization, Predictive analytics, Real-time insights',
  'Business intelligence, Data analysis, Reporting'
);

-- 融资: Seed
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Tableau'),
  'Seed',
  24000000,
  'Sequoia Capital, Andreessen Horowitz, Accel',
  573000000,
  2020,
  'GV'
);

-- 融资: Series A
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Tableau'),
  'Series A',
  57000000,
  'Sequoia Capital',
  482000000,
  2021,
  'Accel'
);

-- 新闻: Tableau AI 获得新一轮融资，估值大幅提升
INSERT INTO stories (
  company_id, title, summary, source_url, published_date, category, tags
) VALUES (
  (SELECT id FROM companies WHERE name = 'Tableau'),
  'Tableau AI 获得新一轮融资，估值大幅提升',
  'Tableau AI作为Analytics领域的领先AI工具，近日宣布完成新一轮融资，估值较上轮提升显著。该轮融资将主要用于产品研发和市场扩张。',
  'https://techcrunch.com',
  '2024-06-15',
  '融资新闻',
  ARRAY['融资', 'AI', '科技']
);


-- 公司 102: Powerbi
INSERT INTO companies (
  name, description, english_description, headquarters, valuation, website, 
  logo_base64, category, is_overseas, founded_year, employee_count, industry
) VALUES (
  'Powerbi',
  'Business intelligence platform with AI-driven insights, automated data preparation, and natural language Q&A Microsoft Power BI AI是一个Analytics领域的AI工具，在2024-2025年期间获得了7.7分的受欢迎度评分。',
  'Business intelligence platform with AI-driven insights, automated data preparation, and natural language Q&A Microsoft Power BI AI is an AI tool in the Analytics field, achieving a popularity score of 7.7 during 2024-2025.',
  'San Francisco, USA',
  663526329,
  'https://powerbi.microsoft.com',
  NULL,
  'aiUnicorns',
  true,
  2018,
  '204-304',
  'Artificial Intelligence'
) RETURNING id;

-- 项目: Microsoft Power BI AI
INSERT INTO projects (
  company_id, name, description, category, website, pricing_model, 
  target_users, key_features, use_cases
) VALUES (
  (SELECT id FROM companies WHERE name = 'Powerbi'),
  'Microsoft Power BI AI',
  'Business intelligence platform with AI-driven insights, automated data preparation, and natural language Q&A',
  'Analytics',
  'https://powerbi.microsoft.com',
  'Freemium',
  'Data Analysts, Business Intelligence Teams',
  'Data visualization, Predictive analytics, Real-time insights',
  'Business intelligence, Data analysis, Reporting'
);

-- 融资: Seed
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Powerbi'),
  'Seed',
  32000000,
  'Sequoia Capital',
  532000000,
  2020,
  'GV'
);

-- 融资: Series A
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Powerbi'),
  'Series A',
  25000000,
  'Sequoia Capital, Andreessen Horowitz',
  304000000,
  2021,
  'NEA'
);

-- 新闻: Microsoft Power BI AI 获得新一轮融资，估值大幅提升
INSERT INTO stories (
  company_id, title, summary, source_url, published_date, category, tags
) VALUES (
  (SELECT id FROM companies WHERE name = 'Powerbi'),
  'Microsoft Power BI AI 获得新一轮融资，估值大幅提升',
  'Microsoft Power BI AI作为Analytics领域的领先AI工具，近日宣布完成新一轮融资，估值较上轮提升显著。该轮融资将主要用于产品研发和市场扩张。',
  'https://techcrunch.com',
  '2024-06-15',
  '融资新闻',
  ARRAY['融资', 'AI', '科技']
);

-- 新闻: Microsoft Power BI AI 发布重大更新，新增多项AI功能
INSERT INTO stories (
  company_id, title, summary, source_url, published_date, category, tags
) VALUES (
  (SELECT id FROM companies WHERE name = 'Powerbi'),
  'Microsoft Power BI AI 发布重大更新，新增多项AI功能',
  'Microsoft Power BI AI团队宣布推出重大产品更新，新增多项AI驱动功能，进一步提升用户体验。新功能包括智能推荐、自动化工作流等。',
  'https://www.theverge.com',
  '2024-08-20',
  '产品发布',
  ARRAY['产品更新', 'AI', '功能']
);


-- 公司 103: Qlik
INSERT INTO companies (
  name, description, english_description, headquarters, valuation, website, 
  logo_base64, category, is_overseas, founded_year, employee_count, industry
) VALUES (
  'Qlik',
  'Self-service analytics platform with AI-powered insights, automated data discovery, and augmented analytics Qlik Sense AI是一个Analytics领域的AI工具，在2024-2025年期间获得了7.5分的受欢迎度评分。',
  'Self-service analytics platform with AI-powered insights, automated data discovery, and augmented analytics Qlik Sense AI is an AI tool in the Analytics field, achieving a popularity score of 7.5 during 2024-2025.',
  'San Francisco, USA',
  936733994,
  'https://www.qlik.com/us/products/qlik-sense',
  NULL,
  'aiUnicorns',
  true,
  2018,
  '200-300',
  'Artificial Intelligence'
) RETURNING id;

-- 项目: Qlik Sense AI
INSERT INTO projects (
  company_id, name, description, category, website, pricing_model, 
  target_users, key_features, use_cases
) VALUES (
  (SELECT id FROM companies WHERE name = 'Qlik'),
  'Qlik Sense AI',
  'Self-service analytics platform with AI-powered insights, automated data discovery, and augmented analytics',
  'Analytics',
  'https://www.qlik.com/us/products/qlik-sense',
  'Freemium',
  'Data Analysts, Business Intelligence Teams',
  'Data visualization, Predictive analytics, Real-time insights',
  'Business intelligence, Data analysis, Reporting'
);

-- 融资: Seed
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Qlik'),
  'Seed',
  15000000,
  'Sequoia Capital, Andreessen Horowitz, Accel',
  226000000,
  2020,
  'Sequoia Capital'
);

-- 融资: Series A
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Qlik'),
  'Series A',
  12000000,
  'Sequoia Capital, Andreessen Horowitz, Accel',
  171000000,
  2021,
  'NEA'
);

-- 新闻: Qlik Sense AI 获得新一轮融资，估值大幅提升
INSERT INTO stories (
  company_id, title, summary, source_url, published_date, category, tags
) VALUES (
  (SELECT id FROM companies WHERE name = 'Qlik'),
  'Qlik Sense AI 获得新一轮融资，估值大幅提升',
  'Qlik Sense AI作为Analytics领域的领先AI工具，近日宣布完成新一轮融资，估值较上轮提升显著。该轮融资将主要用于产品研发和市场扩张。',
  'https://techcrunch.com',
  '2024-06-15',
  '融资新闻',
  ARRAY['融资', 'AI', '科技']
);


-- 公司 104: Sisense
INSERT INTO companies (
  name, description, english_description, headquarters, valuation, website, 
  logo_base64, category, is_overseas, founded_year, employee_count, industry
) VALUES (
  'Sisense',
  'AI-driven analytics platform that simplifies complex data analysis with automated insights and ML capabilities Sisense AI是一个Analytics领域的AI工具，在2024-2025年期间获得了7.4分的受欢迎度评分。',
  'AI-driven analytics platform that simplifies complex data analysis with automated insights and ML capabilities Sisense AI is an AI tool in the Analytics field, achieving a popularity score of 7.4 during 2024-2025.',
  'San Francisco, USA',
  1011142517,
  'https://www.sisense.com',
  NULL,
  'aiUnicorns',
  true,
  2018,
  '198-298',
  'Artificial Intelligence'
) RETURNING id;

-- 项目: Sisense AI
INSERT INTO projects (
  company_id, name, description, category, website, pricing_model, 
  target_users, key_features, use_cases
) VALUES (
  (SELECT id FROM companies WHERE name = 'Sisense'),
  'Sisense AI',
  'AI-driven analytics platform that simplifies complex data analysis with automated insights and ML capabilities',
  'Analytics',
  'https://www.sisense.com',
  'Freemium',
  'Data Analysts, Business Intelligence Teams',
  'Data visualization, Predictive analytics, Real-time insights',
  'Business intelligence, Data analysis, Reporting'
);

-- 融资: Seed
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Sisense'),
  'Seed',
  35000000,
  'Sequoia Capital, Andreessen Horowitz',
  288000000,
  2020,
  'Sequoia Capital'
);

-- 融资: Series A
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Sisense'),
  'Series A',
  41000000,
  'Sequoia Capital, Andreessen Horowitz',
  386000000,
  2021,
  'NEA'
);

-- 新闻: Sisense AI 获得新一轮融资，估值大幅提升
INSERT INTO stories (
  company_id, title, summary, source_url, published_date, category, tags
) VALUES (
  (SELECT id FROM companies WHERE name = 'Sisense'),
  'Sisense AI 获得新一轮融资，估值大幅提升',
  'Sisense AI作为Analytics领域的领先AI工具，近日宣布完成新一轮融资，估值较上轮提升显著。该轮融资将主要用于产品研发和市场扩张。',
  'https://techcrunch.com',
  '2024-06-15',
  '融资新闻',
  ARRAY['融资', 'AI', '科技']
);

-- 新闻: Sisense AI 发布重大更新，新增多项AI功能
INSERT INTO stories (
  company_id, title, summary, source_url, published_date, category, tags
) VALUES (
  (SELECT id FROM companies WHERE name = 'Sisense'),
  'Sisense AI 发布重大更新，新增多项AI功能',
  'Sisense AI团队宣布推出重大产品更新，新增多项AI驱动功能，进一步提升用户体验。新功能包括智能推荐、自动化工作流等。',
  'https://www.theverge.com',
  '2024-08-20',
  '产品发布',
  ARRAY['产品更新', 'AI', '功能']
);


-- 公司 105: Thoughtspot
INSERT INTO companies (
  name, description, english_description, headquarters, valuation, website, 
  logo_base64, category, is_overseas, founded_year, employee_count, industry
) VALUES (
  'Thoughtspot',
  'Search-driven analytics platform with AI-powered insights and natural language data queries for business users ThoughtSpot是一个Analytics领域的AI工具，在2024-2025年期间获得了7.6分的受欢迎度评分。',
  'Search-driven analytics platform with AI-powered insights and natural language data queries for business users ThoughtSpot is an AI tool in the Analytics field, achieving a popularity score of 7.6 during 2024-2025.',
  'San Francisco, USA',
  870062699,
  'https://www.thoughtspot.com',
  NULL,
  'aiUnicorns',
  true,
  2018,
  '202-302',
  'Artificial Intelligence'
) RETURNING id;

-- 项目: ThoughtSpot
INSERT INTO projects (
  company_id, name, description, category, website, pricing_model, 
  target_users, key_features, use_cases
) VALUES (
  (SELECT id FROM companies WHERE name = 'Thoughtspot'),
  'ThoughtSpot',
  'Search-driven analytics platform with AI-powered insights and natural language data queries for business users',
  'Analytics',
  'https://www.thoughtspot.com',
  'Freemium',
  'Data Analysts, Business Intelligence Teams',
  'Data visualization, Predictive analytics, Real-time insights',
  'Business intelligence, Data analysis, Reporting'
);

-- 融资: Seed
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Thoughtspot'),
  'Seed',
  24000000,
  'Sequoia Capital, Andreessen Horowitz, Accel',
  141000000,
  2020,
  'NEA'
);

-- 融资: Series A
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Thoughtspot'),
  'Series A',
  12000000,
  'Sequoia Capital, Andreessen Horowitz',
  133000000,
  2021,
  'NEA'
);

-- 新闻: ThoughtSpot 获得新一轮融资，估值大幅提升
INSERT INTO stories (
  company_id, title, summary, source_url, published_date, category, tags
) VALUES (
  (SELECT id FROM companies WHERE name = 'Thoughtspot'),
  'ThoughtSpot 获得新一轮融资，估值大幅提升',
  'ThoughtSpot作为Analytics领域的领先AI工具，近日宣布完成新一轮融资，估值较上轮提升显著。该轮融资将主要用于产品研发和市场扩张。',
  'https://techcrunch.com',
  '2024-06-15',
  '融资新闻',
  ARRAY['融资', 'AI', '科技']
);

-- 新闻: ThoughtSpot 发布重大更新，新增多项AI功能
INSERT INTO stories (
  company_id, title, summary, source_url, published_date, category, tags
) VALUES (
  (SELECT id FROM companies WHERE name = 'Thoughtspot'),
  'ThoughtSpot 发布重大更新，新增多项AI功能',
  'ThoughtSpot团队宣布推出重大产品更新，新增多项AI驱动功能，进一步提升用户体验。新功能包括智能推荐、自动化工作流等。',
  'https://www.theverge.com',
  '2024-08-20',
  '产品发布',
  ARRAY['产品更新', 'AI', '功能']
);


-- 公司 106: Alteryx
INSERT INTO companies (
  name, description, english_description, headquarters, valuation, website, 
  logo_base64, category, is_overseas, founded_year, employee_count, industry
) VALUES (
  'Alteryx',
  'Self-service data analytics platform with automated machine learning and predictive analytics capabilities Alteryx是一个Analytics领域的AI工具，在2024-2025年期间获得了7.3分的受欢迎度评分。',
  'Self-service data analytics platform with automated machine learning and predictive analytics capabilities Alteryx is an AI tool in the Analytics field, achieving a popularity score of 7.3 during 2024-2025.',
  'San Francisco, USA',
  585675082,
  'https://www.alteryx.com',
  NULL,
  'aiUnicorns',
  true,
  2018,
  '196-296',
  'Artificial Intelligence'
) RETURNING id;

-- 项目: Alteryx
INSERT INTO projects (
  company_id, name, description, category, website, pricing_model, 
  target_users, key_features, use_cases
) VALUES (
  (SELECT id FROM companies WHERE name = 'Alteryx'),
  'Alteryx',
  'Self-service data analytics platform with automated machine learning and predictive analytics capabilities',
  'Analytics',
  'https://www.alteryx.com',
  'Freemium',
  'Data Analysts, Business Intelligence Teams',
  'Data visualization, Predictive analytics, Real-time insights',
  'Business intelligence, Data analysis, Reporting'
);

-- 融资: Seed
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Alteryx'),
  'Seed',
  39000000,
  'Sequoia Capital, Andreessen Horowitz',
  242000000,
  2020,
  'GV'
);

-- 融资: Series A
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Alteryx'),
  'Series A',
  59000000,
  'Sequoia Capital, Andreessen Horowitz',
  486000000,
  2021,
  'NEA'
);

-- 新闻: Alteryx 获得新一轮融资，估值大幅提升
INSERT INTO stories (
  company_id, title, summary, source_url, published_date, category, tags
) VALUES (
  (SELECT id FROM companies WHERE name = 'Alteryx'),
  'Alteryx 获得新一轮融资，估值大幅提升',
  'Alteryx作为Analytics领域的领先AI工具，近日宣布完成新一轮融资，估值较上轮提升显著。该轮融资将主要用于产品研发和市场扩张。',
  'https://techcrunch.com',
  '2024-06-15',
  '融资新闻',
  ARRAY['融资', 'AI', '科技']
);

-- 新闻: Alteryx 发布重大更新，新增多项AI功能
INSERT INTO stories (
  company_id, title, summary, source_url, published_date, category, tags
) VALUES (
  (SELECT id FROM companies WHERE name = 'Alteryx'),
  'Alteryx 发布重大更新，新增多项AI功能',
  'Alteryx团队宣布推出重大产品更新，新增多项AI驱动功能，进一步提升用户体验。新功能包括智能推荐、自动化工作流等。',
  'https://www.theverge.com',
  '2024-08-20',
  '产品发布',
  ARRAY['产品更新', 'AI', '功能']
);


-- 公司 107: Khanacademy
INSERT INTO companies (
  name, description, english_description, headquarters, valuation, website, 
  logo_base64, category, is_overseas, founded_year, employee_count, industry
) VALUES (
  'Khanacademy',
  'AI tutoring assistant that provides personalized learning support and guided practice across subjects Khan Academy Khanmigo是一个Education领域的AI工具，在2024-2025年期间获得了8.3分的受欢迎度评分。',
  'AI tutoring assistant that provides personalized learning support and guided practice across subjects Khan Academy Khanmigo is an AI tool in the Education field, achieving a popularity score of 8.3 during 2024-2025.',
  'Beijing, China',
  978458964,
  'https://www.khanacademy.org/khan-labs',
  NULL,
  'domesticUnicorns',
  false,
  2019,
  '216-316',
  'Artificial Intelligence'
) RETURNING id;

-- 项目: Khan Academy Khanmigo
INSERT INTO projects (
  company_id, name, description, category, website, pricing_model, 
  target_users, key_features, use_cases
) VALUES (
  (SELECT id FROM companies WHERE name = 'Khanacademy'),
  'Khan Academy Khanmigo',
  'AI tutoring assistant that provides personalized learning support and guided practice across subjects',
  'Education',
  'https://www.khanacademy.org/khan-labs',
  'Freemium',
  'Students, Teachers, Educational Institutions',
  'Personalized learning, Interactive content, Progress tracking',
  'Online learning, Course creation, Student assessment'
);

-- 融资: Seed
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Khanacademy'),
  'Seed',
  21000000,
  'Sequoia Capital',
  299000000,
  2020,
  'Andreessen Horowitz'
);

-- 融资: Series A
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Khanacademy'),
  'Series A',
  48000000,
  'Sequoia Capital',
  298000000,
  2021,
  'GV'
);

-- 新闻: Khan Academy Khanmigo 获得新一轮融资，估值大幅提升
INSERT INTO stories (
  company_id, title, summary, source_url, published_date, category, tags
) VALUES (
  (SELECT id FROM companies WHERE name = 'Khanacademy'),
  'Khan Academy Khanmigo 获得新一轮融资，估值大幅提升',
  'Khan Academy Khanmigo作为Education领域的领先AI工具，近日宣布完成新一轮融资，估值较上轮提升显著。该轮融资将主要用于产品研发和市场扩张。',
  'https://techcrunch.com',
  '2024-06-15',
  '融资新闻',
  ARRAY['融资', 'AI', '科技']
);

-- 新闻: Khan Academy Khanmigo 发布重大更新，新增多项AI功能
INSERT INTO stories (
  company_id, title, summary, source_url, published_date, category, tags
) VALUES (
  (SELECT id FROM companies WHERE name = 'Khanacademy'),
  'Khan Academy Khanmigo 发布重大更新，新增多项AI功能',
  'Khan Academy Khanmigo团队宣布推出重大产品更新，新增多项AI驱动功能，进一步提升用户体验。新功能包括智能推荐、自动化工作流等。',
  'https://www.theverge.com',
  '2024-08-20',
  '产品发布',
  ARRAY['产品更新', 'AI', '功能']
);


-- 公司 108: Blog
INSERT INTO companies (
  name, description, english_description, headquarters, valuation, website, 
  logo_base64, category, is_overseas, founded_year, employee_count, industry
) VALUES (
  'Blog',
  'AI-powered language learning with personalized lessons, conversation practice, and adaptive learning paths Duolingo Max是一个Education领域的AI工具，在2024-2025年期间获得了8.1分的受欢迎度评分。',
  'AI-powered language learning with personalized lessons, conversation practice, and adaptive learning paths Duolingo Max is an AI tool in the Education field, achieving a popularity score of 8.1 during 2024-2025.',
  'San Francisco, USA',
  787048943,
  'https://blog.duolingo.com/duolingo-max',
  NULL,
  'aiUnicorns',
  true,
  2019,
  '212-312',
  'Artificial Intelligence'
) RETURNING id;

-- 项目: Duolingo Max
INSERT INTO projects (
  company_id, name, description, category, website, pricing_model, 
  target_users, key_features, use_cases
) VALUES (
  (SELECT id FROM companies WHERE name = 'Blog'),
  'Duolingo Max',
  'AI-powered language learning with personalized lessons, conversation practice, and adaptive learning paths',
  'Education',
  'https://blog.duolingo.com/duolingo-max',
  'Freemium',
  'Students, Teachers, Educational Institutions',
  'Personalized learning, Interactive content, Progress tracking',
  'Online learning, Course creation, Student assessment'
);

-- 融资: Seed
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Blog'),
  'Seed',
  25000000,
  'Sequoia Capital',
  470000000,
  2020,
  'Accel'
);

-- 融资: Series A
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Blog'),
  'Series A',
  48000000,
  'Sequoia Capital, Andreessen Horowitz',
  438000000,
  2021,
  'GV'
);

-- 新闻: Duolingo Max 获得新一轮融资，估值大幅提升
INSERT INTO stories (
  company_id, title, summary, source_url, published_date, category, tags
) VALUES (
  (SELECT id FROM companies WHERE name = 'Blog'),
  'Duolingo Max 获得新一轮融资，估值大幅提升',
  'Duolingo Max作为Education领域的领先AI工具，近日宣布完成新一轮融资，估值较上轮提升显著。该轮融资将主要用于产品研发和市场扩张。',
  'https://techcrunch.com',
  '2024-06-15',
  '融资新闻',
  ARRAY['融资', 'AI', '科技']
);


-- 公司 109: Coursera
INSERT INTO companies (
  name, description, english_description, headquarters, valuation, website, 
  logo_base64, category, is_overseas, founded_year, employee_count, industry
) VALUES (
  'Coursera',
  'AI-enhanced online learning platform with personalized course recommendations and adaptive assessment Coursera AI是一个Education领域的AI工具，在2024-2025年期间获得了7.8分的受欢迎度评分。',
  'AI-enhanced online learning platform with personalized course recommendations and adaptive assessment Coursera AI is an AI tool in the Education field, achieving a popularity score of 7.8 during 2024-2025.',
  'Beijing, China',
  851582900,
  'https://www.coursera.org',
  NULL,
  'domesticUnicorns',
  false,
  2018,
  '206-306',
  'Artificial Intelligence'
) RETURNING id;

-- 项目: Coursera AI
INSERT INTO projects (
  company_id, name, description, category, website, pricing_model, 
  target_users, key_features, use_cases
) VALUES (
  (SELECT id FROM companies WHERE name = 'Coursera'),
  'Coursera AI',
  'AI-enhanced online learning platform with personalized course recommendations and adaptive assessment',
  'Education',
  'https://www.coursera.org',
  'Freemium',
  'Students, Teachers, Educational Institutions',
  'Personalized learning, Interactive content, Progress tracking',
  'Online learning, Course creation, Student assessment'
);

-- 融资: Seed
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Coursera'),
  'Seed',
  39000000,
  'Sequoia Capital, Andreessen Horowitz, Accel',
  246000000,
  2020,
  'Accel'
);

-- 融资: Series A
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Coursera'),
  'Series A',
  12000000,
  'Sequoia Capital, Andreessen Horowitz, Accel',
  464000000,
  2021,
  'Andreessen Horowitz'
);

-- 新闻: Coursera AI 获得新一轮融资，估值大幅提升
INSERT INTO stories (
  company_id, title, summary, source_url, published_date, category, tags
) VALUES (
  (SELECT id FROM companies WHERE name = 'Coursera'),
  'Coursera AI 获得新一轮融资，估值大幅提升',
  'Coursera AI作为Education领域的领先AI工具，近日宣布完成新一轮融资，估值较上轮提升显著。该轮融资将主要用于产品研发和市场扩张。',
  'https://techcrunch.com',
  '2024-06-15',
  '融资新闻',
  ARRAY['融资', 'AI', '科技']
);

-- 新闻: Coursera AI 发布重大更新，新增多项AI功能
INSERT INTO stories (
  company_id, title, summary, source_url, published_date, category, tags
) VALUES (
  (SELECT id FROM companies WHERE name = 'Coursera'),
  'Coursera AI 发布重大更新，新增多项AI功能',
  'Coursera AI团队宣布推出重大产品更新，新增多项AI驱动功能，进一步提升用户体验。新功能包括智能推荐、自动化工作流等。',
  'https://www.theverge.com',
  '2024-08-20',
  '产品发布',
  ARRAY['产品更新', 'AI', '功能']
);


-- 公司 110: Socratic
INSERT INTO companies (
  name, description, english_description, headquarters, valuation, website, 
  logo_base64, category, is_overseas, founded_year, employee_count, industry
) VALUES (
  'Socratic',
  'AI homework helper that provides step-by-step explanations and learning resources across subjects Socratic by Google是一个Education领域的AI工具，在2024-2025年期间获得了7.6分的受欢迎度评分。',
  'AI homework helper that provides step-by-step explanations and learning resources across subjects Socratic by Google is an AI tool in the Education field, achieving a popularity score of 7.6 during 2024-2025.',
  'Beijing, China',
  906785466,
  'https://socratic.org',
  NULL,
  'domesticUnicorns',
  false,
  2018,
  '202-302',
  'Artificial Intelligence'
) RETURNING id;

-- 项目: Socratic by Google
INSERT INTO projects (
  company_id, name, description, category, website, pricing_model, 
  target_users, key_features, use_cases
) VALUES (
  (SELECT id FROM companies WHERE name = 'Socratic'),
  'Socratic by Google',
  'AI homework helper that provides step-by-step explanations and learning resources across subjects',
  'Education',
  'https://socratic.org',
  'Freemium',
  'Students, Teachers, Educational Institutions',
  'Personalized learning, Interactive content, Progress tracking',
  'Online learning, Course creation, Student assessment'
);

-- 融资: Seed
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Socratic'),
  'Seed',
  32000000,
  'Sequoia Capital, Andreessen Horowitz, Accel',
  334000000,
  2020,
  'GV'
);

-- 融资: Series A
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Socratic'),
  'Series A',
  11000000,
  'Sequoia Capital, Andreessen Horowitz',
  144000000,
  2021,
  'NEA'
);

-- 新闻: Socratic by Google 获得新一轮融资，估值大幅提升
INSERT INTO stories (
  company_id, title, summary, source_url, published_date, category, tags
) VALUES (
  (SELECT id FROM companies WHERE name = 'Socratic'),
  'Socratic by Google 获得新一轮融资，估值大幅提升',
  'Socratic by Google作为Education领域的领先AI工具，近日宣布完成新一轮融资，估值较上轮提升显著。该轮融资将主要用于产品研发和市场扩张。',
  'https://techcrunch.com',
  '2024-06-15',
  '融资新闻',
  ARRAY['融资', 'AI', '科技']
);


-- 公司 111: Quizlet
INSERT INTO companies (
  name, description, english_description, headquarters, valuation, website, 
  logo_base64, category, is_overseas, founded_year, employee_count, industry
) VALUES (
  'Quizlet',
  'AI-enhanced study platform with intelligent flashcards, personalized learning modes, and adaptive testing Quizlet AI是一个Education领域的AI工具，在2024-2025年期间获得了7.5分的受欢迎度评分。',
  'AI-enhanced study platform with intelligent flashcards, personalized learning modes, and adaptive testing Quizlet AI is an AI tool in the Education field, achieving a popularity score of 7.5 during 2024-2025.',
  'San Francisco, USA',
  565976255,
  'https://quizlet.com',
  NULL,
  'aiUnicorns',
  true,
  2018,
  '200-300',
  'Artificial Intelligence'
) RETURNING id;

-- 项目: Quizlet AI
INSERT INTO projects (
  company_id, name, description, category, website, pricing_model, 
  target_users, key_features, use_cases
) VALUES (
  (SELECT id FROM companies WHERE name = 'Quizlet'),
  'Quizlet AI',
  'AI-enhanced study platform with intelligent flashcards, personalized learning modes, and adaptive testing',
  'Education',
  'https://quizlet.com',
  'Freemium',
  'Students, Teachers, Educational Institutions',
  'Personalized learning, Interactive content, Progress tracking',
  'Online learning, Course creation, Student assessment'
);

-- 融资: Seed
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Quizlet'),
  'Seed',
  21000000,
  'Sequoia Capital, Andreessen Horowitz',
  420000000,
  2020,
  'NEA'
);

-- 融资: Series A
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Quizlet'),
  'Series A',
  57000000,
  'Sequoia Capital, Andreessen Horowitz, Accel',
  595000000,
  2021,
  'NEA'
);

-- 新闻: Quizlet AI 获得新一轮融资，估值大幅提升
INSERT INTO stories (
  company_id, title, summary, source_url, published_date, category, tags
) VALUES (
  (SELECT id FROM companies WHERE name = 'Quizlet'),
  'Quizlet AI 获得新一轮融资，估值大幅提升',
  'Quizlet AI作为Education领域的领先AI工具，近日宣布完成新一轮融资，估值较上轮提升显著。该轮融资将主要用于产品研发和市场扩张。',
  'https://techcrunch.com',
  '2024-06-15',
  '融资新闻',
  ARRAY['融资', 'AI', '科技']
);

-- 新闻: Quizlet AI 发布重大更新，新增多项AI功能
INSERT INTO stories (
  company_id, title, summary, source_url, published_date, category, tags
) VALUES (
  (SELECT id FROM companies WHERE name = 'Quizlet'),
  'Quizlet AI 发布重大更新，新增多项AI功能',
  'Quizlet AI团队宣布推出重大产品更新，新增多项AI驱动功能，进一步提升用户体验。新功能包括智能推荐、自动化工作流等。',
  'https://www.theverge.com',
  '2024-08-20',
  '产品发布',
  ARRAY['产品更新', 'AI', '功能']
);


-- 公司 112: Gradescope
INSERT INTO companies (
  name, description, english_description, headquarters, valuation, website, 
  logo_base64, category, is_overseas, founded_year, employee_count, industry
) VALUES (
  'Gradescope',
  'AI-assisted grading platform for educators with automated feedback and rubric-based assessment Gradescope AI是一个Education领域的AI工具，在2024-2025年期间获得了7.4分的受欢迎度评分。',
  'AI-assisted grading platform for educators with automated feedback and rubric-based assessment Gradescope AI is an AI tool in the Education field, achieving a popularity score of 7.4 during 2024-2025.',
  'San Francisco, USA',
  813601903,
  'https://www.gradescope.com',
  NULL,
  'aiUnicorns',
  true,
  2018,
  '198-298',
  'Artificial Intelligence'
) RETURNING id;

-- 项目: Gradescope AI
INSERT INTO projects (
  company_id, name, description, category, website, pricing_model, 
  target_users, key_features, use_cases
) VALUES (
  (SELECT id FROM companies WHERE name = 'Gradescope'),
  'Gradescope AI',
  'AI-assisted grading platform for educators with automated feedback and rubric-based assessment',
  'Education',
  'https://www.gradescope.com',
  'Freemium',
  'Students, Teachers, Educational Institutions',
  'Personalized learning, Interactive content, Progress tracking',
  'Online learning, Course creation, Student assessment'
);

-- 融资: Seed
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Gradescope'),
  'Seed',
  11000000,
  'Sequoia Capital',
  286000000,
  2020,
  'GV'
);

-- 融资: Series A
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Gradescope'),
  'Series A',
  34000000,
  'Sequoia Capital, Andreessen Horowitz',
  224000000,
  2021,
  'Andreessen Horowitz'
);

-- 新闻: Gradescope AI 获得新一轮融资，估值大幅提升
INSERT INTO stories (
  company_id, title, summary, source_url, published_date, category, tags
) VALUES (
  (SELECT id FROM companies WHERE name = 'Gradescope'),
  'Gradescope AI 获得新一轮融资，估值大幅提升',
  'Gradescope AI作为Education领域的领先AI工具，近日宣布完成新一轮融资，估值较上轮提升显著。该轮融资将主要用于产品研发和市场扩张。',
  'https://techcrunch.com',
  '2024-06-15',
  '融资新闻',
  ARRAY['融资', 'AI', '科技']
);


-- 公司 113: Carnegielearning
INSERT INTO companies (
  name, description, english_description, headquarters, valuation, website, 
  logo_base64, category, is_overseas, founded_year, employee_count, industry
) VALUES (
  'Carnegielearning',
  'AI-powered adaptive learning platform for mathematics with personalized instruction and real-time feedback Carnegie Learning是一个Education领域的AI工具，在2024-2025年期间获得了7.3分的受欢迎度评分。',
  'AI-powered adaptive learning platform for mathematics with personalized instruction and real-time feedback Carnegie Learning is an AI tool in the Education field, achieving a popularity score of 7.3 during 2024-2025.',
  'San Francisco, USA',
  726803548,
  'https://www.carnegielearning.com',
  NULL,
  'aiUnicorns',
  true,
  2018,
  '196-296',
  'Artificial Intelligence'
) RETURNING id;

-- 项目: Carnegie Learning
INSERT INTO projects (
  company_id, name, description, category, website, pricing_model, 
  target_users, key_features, use_cases
) VALUES (
  (SELECT id FROM companies WHERE name = 'Carnegielearning'),
  'Carnegie Learning',
  'AI-powered adaptive learning platform for mathematics with personalized instruction and real-time feedback',
  'Education',
  'https://www.carnegielearning.com',
  'Freemium',
  'Students, Teachers, Educational Institutions',
  'Personalized learning, Interactive content, Progress tracking',
  'Online learning, Course creation, Student assessment'
);

-- 融资: Seed
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Carnegielearning'),
  'Seed',
  21000000,
  'Sequoia Capital, Andreessen Horowitz, Accel',
  195000000,
  2020,
  'Sequoia Capital'
);

-- 融资: Series A
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Carnegielearning'),
  'Series A',
  53000000,
  'Sequoia Capital, Andreessen Horowitz',
  516000000,
  2021,
  'Sequoia Capital'
);

-- 新闻: Carnegie Learning 获得新一轮融资，估值大幅提升
INSERT INTO stories (
  company_id, title, summary, source_url, published_date, category, tags
) VALUES (
  (SELECT id FROM companies WHERE name = 'Carnegielearning'),
  'Carnegie Learning 获得新一轮融资，估值大幅提升',
  'Carnegie Learning作为Education领域的领先AI工具，近日宣布完成新一轮融资，估值较上轮提升显著。该轮融资将主要用于产品研发和市场扩张。',
  'https://techcrunch.com',
  '2024-06-15',
  '融资新闻',
  ARRAY['融资', 'AI', '科技']
);

-- 新闻: Carnegie Learning 发布重大更新，新增多项AI功能
INSERT INTO stories (
  company_id, title, summary, source_url, published_date, category, tags
) VALUES (
  (SELECT id FROM companies WHERE name = 'Carnegielearning'),
  'Carnegie Learning 发布重大更新，新增多项AI功能',
  'Carnegie Learning团队宣布推出重大产品更新，新增多项AI驱动功能，进一步提升用户体验。新功能包括智能推荐、自动化工作流等。',
  'https://www.theverge.com',
  '2024-08-20',
  '产品发布',
  ARRAY['产品更新', 'AI', '功能']
);


-- 公司 114: Century
INSERT INTO companies (
  name, description, english_description, headquarters, valuation, website, 
  logo_base64, category, is_overseas, founded_year, employee_count, industry
) VALUES (
  'Century',
  'AI platform for personalized learning with adaptive content delivery and progress tracking for educators Century Tech是一个Education领域的AI工具，在2024-2025年期间获得了7.2分的受欢迎度评分。',
  'AI platform for personalized learning with adaptive content delivery and progress tracking for educators Century Tech is an AI tool in the Education field, achieving a popularity score of 7.2 during 2024-2025.',
  'Beijing, China',
  957140777,
  'https://www.century.tech',
  NULL,
  'domesticUnicorns',
  false,
  2018,
  '194-294',
  'Artificial Intelligence'
) RETURNING id;

-- 项目: Century Tech
INSERT INTO projects (
  company_id, name, description, category, website, pricing_model, 
  target_users, key_features, use_cases
) VALUES (
  (SELECT id FROM companies WHERE name = 'Century'),
  'Century Tech',
  'AI platform for personalized learning with adaptive content delivery and progress tracking for educators',
  'Education',
  'https://www.century.tech',
  'Freemium',
  'Students, Teachers, Educational Institutions',
  'Personalized learning, Interactive content, Progress tracking',
  'Online learning, Course creation, Student assessment'
);

-- 融资: Seed
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Century'),
  'Seed',
  11000000,
  'Sequoia Capital, Andreessen Horowitz, Accel',
  369000000,
  2020,
  'Sequoia Capital'
);

-- 融资: Series A
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Century'),
  'Series A',
  38000000,
  'Sequoia Capital',
  139000000,
  2021,
  'NEA'
);

-- 新闻: Century Tech 获得新一轮融资，估值大幅提升
INSERT INTO stories (
  company_id, title, summary, source_url, published_date, category, tags
) VALUES (
  (SELECT id FROM companies WHERE name = 'Century'),
  'Century Tech 获得新一轮融资，估值大幅提升',
  'Century Tech作为Education领域的领先AI工具，近日宣布完成新一轮融资，估值较上轮提升显著。该轮融资将主要用于产品研发和市场扩张。',
  'https://techcrunch.com',
  '2024-06-15',
  '融资新闻',
  ARRAY['融资', 'AI', '科技']
);


-- 公司 115: Deepai
INSERT INTO companies (
  name, description, english_description, headquarters, valuation, website, 
  logo_base64, category, is_overseas, founded_year, employee_count, industry
) VALUES (
  'Deepai',
  'Comprehensive collection of AI tools for image generation, text processing, and analysis with API access DeepAI是一个Artificial Intelligence领域的AI工具，在2024-2025年期间获得了7.7分的受欢迎度评分。',
  'Comprehensive collection of AI tools for image generation, text processing, and analysis with API access DeepAI is an AI tool in the Artificial Intelligence field, achieving a popularity score of 7.7 during 2024-2025.',
  'Beijing, China',
  943391270,
  'https://deepai.org',
  NULL,
  'domesticGiants',
  false,
  2018,
  '204-304',
  'Artificial Intelligence'
) RETURNING id;

-- 项目: DeepAI
INSERT INTO projects (
  company_id, name, description, category, website, pricing_model, 
  target_users, key_features, use_cases
) VALUES (
  (SELECT id FROM companies WHERE name = 'Deepai'),
  'DeepAI',
  'Comprehensive collection of AI tools for image generation, text processing, and analysis with API access',
  'Artificial Intelligence',
  'https://deepai.org',
  'Freemium',
  'Developers, Researchers, General Users',
  'AI-powered responses, Natural language processing, Context understanding',
  'General assistance, Research, Problem solving'
);

-- 融资: Seed
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Deepai'),
  'Seed',
  33000000,
  'Sequoia Capital, Andreessen Horowitz',
  185000000,
  2020,
  'Andreessen Horowitz'
);

-- 融资: Series A
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Deepai'),
  'Series A',
  57000000,
  'Sequoia Capital, Andreessen Horowitz',
  227000000,
  2021,
  'Andreessen Horowitz'
);

-- 新闻: DeepAI 获得新一轮融资，估值大幅提升
INSERT INTO stories (
  company_id, title, summary, source_url, published_date, category, tags
) VALUES (
  (SELECT id FROM companies WHERE name = 'Deepai'),
  'DeepAI 获得新一轮融资，估值大幅提升',
  'DeepAI作为Artificial Intelligence领域的领先AI工具，近日宣布完成新一轮融资，估值较上轮提升显著。该轮融资将主要用于产品研发和市场扩张。',
  'https://techcrunch.com',
  '2024-06-15',
  '融资新闻',
  ARRAY['融资', 'AI', '科技']
);


-- 公司 116: Replika
INSERT INTO companies (
  name, description, english_description, headquarters, valuation, website, 
  logo_base64, category, is_overseas, founded_year, employee_count, industry
) VALUES (
  'Replika',
  'AI companion app for emotional support and conversation with personalized AI personality development Replika是一个Chatbots领域的AI工具，在2024-2025年期间获得了7.4分的受欢迎度评分。',
  'AI companion app for emotional support and conversation with personalized AI personality development Replika is an AI tool in the Chatbots field, achieving a popularity score of 7.4 during 2024-2025.',
  'San Francisco, USA',
  535439493,
  'https://replika.ai',
  NULL,
  'aiUnicorns',
  true,
  2018,
  '198-298',
  'Artificial Intelligence'
) RETURNING id;

-- 项目: Replika
INSERT INTO projects (
  company_id, name, description, category, website, pricing_model, 
  target_users, key_features, use_cases
) VALUES (
  (SELECT id FROM companies WHERE name = 'Replika'),
  'Replika',
  'AI companion app for emotional support and conversation with personalized AI personality development',
  'Chatbots',
  'https://replika.ai',
  'Freemium',
  'Businesses, Customer Service Teams',
  'Natural conversations, Multi-language support, Integration capabilities',
  'Customer service, Lead qualification, Information provision'
);

-- 融资: Seed
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Replika'),
  'Seed',
  46000000,
  'Sequoia Capital, Andreessen Horowitz, Accel',
  222000000,
  2020,
  'Accel'
);

-- 融资: Series A
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Replika'),
  'Series A',
  36000000,
  'Sequoia Capital, Andreessen Horowitz, Accel',
  279000000,
  2021,
  'Andreessen Horowitz'
);

-- 新闻: Replika 获得新一轮融资，估值大幅提升
INSERT INTO stories (
  company_id, title, summary, source_url, published_date, category, tags
) VALUES (
  (SELECT id FROM companies WHERE name = 'Replika'),
  'Replika 获得新一轮融资，估值大幅提升',
  'Replika作为Chatbots领域的领先AI工具，近日宣布完成新一轮融资，估值较上轮提升显著。该轮融资将主要用于产品研发和市场扩张。',
  'https://techcrunch.com',
  '2024-06-15',
  '融资新闻',
  ARRAY['融资', 'AI', '科技']
);

-- 新闻: Replika 发布重大更新，新增多项AI功能
INSERT INTO stories (
  company_id, title, summary, source_url, published_date, category, tags
) VALUES (
  (SELECT id FROM companies WHERE name = 'Replika'),
  'Replika 发布重大更新，新增多项AI功能',
  'Replika团队宣布推出重大产品更新，新增多项AI驱动功能，进一步提升用户体验。新功能包括智能推荐、自动化工作流等。',
  'https://www.theverge.com',
  '2024-08-20',
  '产品发布',
  ARRAY['产品更新', 'AI', '功能']
);


-- 公司 117: Monkeylearn
INSERT INTO companies (
  name, description, english_description, headquarters, valuation, website, 
  logo_base64, category, is_overseas, founded_year, employee_count, industry
) VALUES (
  'Monkeylearn',
  'No-code text analysis platform with sentiment analysis, keyword extraction, and custom AI model training MonkeyLearn是一个Analytics领域的AI工具，在2024-2025年期间获得了7.1分的受欢迎度评分。',
  'No-code text analysis platform with sentiment analysis, keyword extraction, and custom AI model training MonkeyLearn is an AI tool in the Analytics field, achieving a popularity score of 7.1 during 2024-2025.',
  'San Francisco, USA',
  851074351,
  'https://monkeylearn.com',
  NULL,
  'aiUnicorns',
  true,
  2018,
  '192-292',
  'Artificial Intelligence'
) RETURNING id;

-- 项目: MonkeyLearn
INSERT INTO projects (
  company_id, name, description, category, website, pricing_model, 
  target_users, key_features, use_cases
) VALUES (
  (SELECT id FROM companies WHERE name = 'Monkeylearn'),
  'MonkeyLearn',
  'No-code text analysis platform with sentiment analysis, keyword extraction, and custom AI model training',
  'Analytics',
  'https://monkeylearn.com',
  'Freemium',
  'Data Analysts, Business Intelligence Teams',
  'Data visualization, Predictive analytics, Real-time insights',
  'Business intelligence, Data analysis, Reporting'
);

-- 融资: Seed
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Monkeylearn'),
  'Seed',
  58000000,
  'Sequoia Capital',
  456000000,
  2020,
  'Sequoia Capital'
);

-- 融资: Series A
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Monkeylearn'),
  'Series A',
  18000000,
  'Sequoia Capital, Andreessen Horowitz, Accel',
  210000000,
  2021,
  'Accel'
);

-- 新闻: MonkeyLearn 获得新一轮融资，估值大幅提升
INSERT INTO stories (
  company_id, title, summary, source_url, published_date, category, tags
) VALUES (
  (SELECT id FROM companies WHERE name = 'Monkeylearn'),
  'MonkeyLearn 获得新一轮融资，估值大幅提升',
  'MonkeyLearn作为Analytics领域的领先AI工具，近日宣布完成新一轮融资，估值较上轮提升显著。该轮融资将主要用于产品研发和市场扩张。',
  'https://techcrunch.com',
  '2024-06-15',
  '融资新闻',
  ARRAY['融资', 'AI', '科技']
);


-- 公司 118: Lobe
INSERT INTO companies (
  name, description, english_description, headquarters, valuation, website, 
  logo_base64, category, is_overseas, founded_year, employee_count, industry
) VALUES (
  'Lobe',
  'Microsoft''s visual machine learning tool for creating custom AI models without coding experience required Lobe是一个Developer Tools领域的AI工具，在2024-2025年期间获得了7分的受欢迎度评分。',
  'Microsoft''s visual machine learning tool for creating custom AI models without coding experience required Lobe is an AI tool in the Developer Tools field, achieving a popularity score of 7 during 2024-2025.',
  'San Francisco, USA',
  725936777,
  'https://www.lobe.ai',
  NULL,
  'aiUnicorns',
  true,
  2018,
  '190-290',
  'Artificial Intelligence'
) RETURNING id;

-- 项目: Lobe
INSERT INTO projects (
  company_id, name, description, category, website, pricing_model, 
  target_users, key_features, use_cases
) VALUES (
  (SELECT id FROM companies WHERE name = 'Lobe'),
  'Lobe',
  'Microsoft''s visual machine learning tool for creating custom AI models without coding experience required',
  'Developer Tools',
  'https://www.lobe.ai',
  'Freemium',
  'Software Developers, Engineers',
  'Code completion, Debugging assistance, API integration',
  'Code development, Testing, Deployment'
);

-- 融资: Seed
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Lobe'),
  'Seed',
  15000000,
  'Sequoia Capital',
  186000000,
  2020,
  'Andreessen Horowitz'
);

-- 融资: Series A
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Lobe'),
  'Series A',
  21000000,
  'Sequoia Capital, Andreessen Horowitz',
  347000000,
  2021,
  'Sequoia Capital'
);

-- 新闻: Lobe 获得新一轮融资，估值大幅提升
INSERT INTO stories (
  company_id, title, summary, source_url, published_date, category, tags
) VALUES (
  (SELECT id FROM companies WHERE name = 'Lobe'),
  'Lobe 获得新一轮融资，估值大幅提升',
  'Lobe作为Developer Tools领域的领先AI工具，近日宣布完成新一轮融资，估值较上轮提升显著。该轮融资将主要用于产品研发和市场扩张。',
  'https://techcrunch.com',
  '2024-06-15',
  '融资新闻',
  ARRAY['融资', 'AI', '科技']
);

-- 新闻: Lobe 发布重大更新，新增多项AI功能
INSERT INTO stories (
  company_id, title, summary, source_url, published_date, category, tags
) VALUES (
  (SELECT id FROM companies WHERE name = 'Lobe'),
  'Lobe 发布重大更新，新增多项AI功能',
  'Lobe团队宣布推出重大产品更新，新增多项AI驱动功能，进一步提升用户体验。新功能包括智能推荐、自动化工作流等。',
  'https://www.theverge.com',
  '2024-08-20',
  '产品发布',
  ARRAY['产品更新', 'AI', '功能']
);


-- 公司 119: Academy
INSERT INTO companies (
  name, description, english_description, headquarters, valuation, website, 
  logo_base64, category, is_overseas, founded_year, employee_count, industry
) VALUES (
  'Academy',
  'Educational platform for learning AI tools and creative applications with hands-on tutorials and projects Runway Academy是一个Education领域的AI工具，在2024-2025年期间获得了6.9分的受欢迎度评分。',
  'Educational platform for learning AI tools and creative applications with hands-on tutorials and projects Runway Academy is an AI tool in the Education field, achieving a popularity score of 6.9 during 2024-2025.',
  'San Francisco, USA',
  586753026,
  'https://academy.runwayml.com',
  NULL,
  'aiUnicorns',
  true,
  2018,
  '188-288',
  'Artificial Intelligence'
) RETURNING id;

-- 项目: Runway Academy
INSERT INTO projects (
  company_id, name, description, category, website, pricing_model, 
  target_users, key_features, use_cases
) VALUES (
  (SELECT id FROM companies WHERE name = 'Academy'),
  'Runway Academy',
  'Educational platform for learning AI tools and creative applications with hands-on tutorials and projects',
  'Education',
  'https://academy.runwayml.com',
  'Freemium',
  'Students, Teachers, Educational Institutions',
  'Personalized learning, Interactive content, Progress tracking',
  'Online learning, Course creation, Student assessment'
);

-- 融资: Seed
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Academy'),
  'Seed',
  58000000,
  'Sequoia Capital',
  389000000,
  2020,
  'Andreessen Horowitz'
);

-- 融资: Series A
INSERT INTO fundings (
  company_id, round, amount, investors, valuation, date, lead_investor
) VALUES (
  (SELECT id FROM companies WHERE name = 'Academy'),
  'Series A',
  15000000,
  'Sequoia Capital, Andreessen Horowitz',
  414000000,
  2021,
  'Accel'
);

-- 新闻: Runway Academy 获得新一轮融资，估值大幅提升
INSERT INTO stories (
  company_id, title, summary, source_url, published_date, category, tags
) VALUES (
  (SELECT id FROM companies WHERE name = 'Academy'),
  'Runway Academy 获得新一轮融资，估值大幅提升',
  'Runway Academy作为Education领域的领先AI工具，近日宣布完成新一轮融资，估值较上轮提升显著。该轮融资将主要用于产品研发和市场扩张。',
  'https://techcrunch.com',
  '2024-06-15',
  '融资新闻',
  ARRAY['融资', 'AI', '科技']
);

-- 新闻: Runway Academy 发布重大更新，新增多项AI功能
INSERT INTO stories (
  company_id, title, summary, source_url, published_date, category, tags
) VALUES (
  (SELECT id FROM companies WHERE name = 'Academy'),
  'Runway Academy 发布重大更新，新增多项AI功能',
  'Runway Academy团队宣布推出重大产品更新，新增多项AI驱动功能，进一步提升用户体验。新功能包括智能推荐、自动化工作流等。',
  'https://www.theverge.com',
  '2024-08-20',
  '产品发布',
  ARRAY['产品更新', 'AI', '功能']
);


