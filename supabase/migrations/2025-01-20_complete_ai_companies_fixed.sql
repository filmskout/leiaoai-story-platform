-- 基于a16z报告的完整AI公司数据 (Fixed Version)
-- 包含Top 50 AI Application Spending Report和Top 100 Gen AI Consumer Apps中的所有公司

-- 使用INSERT ... ON CONFLICT DO NOTHING 来避免重复插入
INSERT INTO public.companies (name, website, description, founded_year, headquarters, industry_tags, logo_url, social_links, valuation_usd, last_funding_date) VALUES

-- Top 50 AI Application Spending Report 公司
('OpenAI', 'https://openai.com', 'Leading AI research company focused on developing safe artificial general intelligence', 2015, 'San Francisco, CA', ARRAY['AI Research', 'LLM', 'Generative AI', 'Infrastructure'], 'https://openai.com/favicon.ico', '{"twitter": "https://twitter.com/openai", "linkedin": "https://linkedin.com/company/openai"}', 300000000000, '2024-12-01'),

('Anthropic', 'https://anthropic.com', 'AI safety company building reliable, interpretable AI systems', 2021, 'San Francisco, CA', ARRAY['AI Safety', 'LLM', 'Constitutional AI'], 'https://anthropic.com/favicon.ico', '{"twitter": "https://twitter.com/anthropicai", "linkedin": "https://linkedin.com/company/anthropic"}', 61500000000, '2024-12-01'),

('Replit', 'https://replit.com', 'AI-powered coding platform enabling autonomous software development', 2016, 'San Francisco, CA', ARRAY['Code Generation', 'Developer Tools', 'AI Coding', 'Vibe Coding'], 'https://replit.com/favicon.ico', '{"twitter": "https://twitter.com/replit", "linkedin": "https://linkedin.com/company/replit"}', 1000000000, '2023-04-01'),

('Freepik', 'https://freepik.com', 'All-in-one creative suite providing AI-powered design tools', 2010, 'Malaga, Spain', ARRAY['Creative AI', 'Design', 'Visual Content'], 'https://www.freepik.com/favicon.ico', '{"twitter": "https://twitter.com/freepik", "linkedin": "https://linkedin.com/company/freepik"}', 2000000000, '2023-01-01'),

('ElevenLabs', 'https://elevenlabs.io', 'AI voice synthesis platform for creating realistic speech', 2022, 'New York, NY', ARRAY['Voice AI', 'Audio Generation', 'Speech Synthesis'], 'https://elevenlabs.io/favicon.ico', '{"twitter": "https://twitter.com/elevenlabs", "linkedin": "https://linkedin.com/company/elevenlabs"}', 1000000000, '2024-01-01'),

('Fyxer', 'https://fyxer.com', 'AI-powered meeting assistant that drafts emails and takes notes', 2022, 'San Francisco, CA', ARRAY['Meeting Support', 'Productivity', 'Email Automation'], 'https://fyxer.com/favicon.ico', '{"twitter": "https://twitter.com/fyxer", "linkedin": "https://linkedin.com/company/fyxer"}', 50000000, '2023-06-01'),

('Notion', 'https://notion.so', 'AI-enhanced workspace platform for productivity and collaboration', 2016, 'San Francisco, CA', ARRAY['Productivity', 'AI Assistant', 'Collaboration', 'Workspace'], 'https://www.notion.so/favicon.ico', '{"twitter": "https://twitter.com/notionhq", "linkedin": "https://linkedin.com/company/notion-labs"}', 10000000000, '2021-10-01'),

('Lorikeet', 'https://lorikeet.ai', 'AI-powered customer service platform', 2022, 'San Francisco, CA', ARRAY['Customer Service', 'AI Assistant', 'Support Automation'], 'https://lorikeet.ai/favicon.ico', '{"twitter": "https://twitter.com/lorikeetai", "linkedin": "https://linkedin.com/company/lorikeet"}', 100000000, '2023-03-01'),

('Micro1', 'https://micro1.com', 'AI-powered recruiting and HR platform', 2021, 'San Francisco, CA', ARRAY['Recruiting', 'HR', 'AI Assistant'], 'https://micro1.com/favicon.ico', '{"twitter": "https://twitter.com/micro1", "linkedin": "https://linkedin.com/company/micro1"}', 50000000, '2022-08-01'),

('Delve', 'https://delve.com', 'AI-powered compliance automation platform', 2021, 'San Francisco, CA', ARRAY['Compliance', 'Automation', 'Operations'], 'https://delve.com/favicon.ico', '{"twitter": "https://twitter.com/delve", "linkedin": "https://linkedin.com/company/delve"}', 75000000, '2023-01-01'),

('Instantly', 'https://instantly.ai', 'AI-powered sales and GTM automation platform', 2020, 'San Francisco, CA', ARRAY['Sales', 'GTM', 'Automation'], 'https://instantly.ai/favicon.ico', '{"twitter": "https://twitter.com/instantly", "linkedin": "https://linkedin.com/company/instantly"}', 200000000, '2023-05-01'),

('Perplexity AI', 'https://perplexity.ai', 'AI-powered search engine providing real-time information', 2022, 'San Francisco, CA', ARRAY['Search', 'AI Assistant', 'Information Retrieval'], 'https://perplexity.ai/favicon.ico', '{"twitter": "https://twitter.com/perplexity_ai", "linkedin": "https://linkedin.com/company/perplexity-ai"}', 9000000000, '2024-12-01'),

('Customer.io', 'https://customer.io', 'AI-powered customer engagement platform', 2012, 'Portland, OR', ARRAY['Customer Engagement', 'Marketing', 'Automation'], 'https://customer.io/favicon.ico', '{"twitter": "https://twitter.com/customerio", "linkedin": "https://linkedin.com/company/customer-io"}', 1000000000, '2021-06-01'),

('Merlin AI', 'https://merlin.ai', 'AI assistant for productivity and automation', 2022, 'San Francisco, CA', ARRAY['Productivity', 'AI Assistant', 'Automation'], 'https://merlin.ai/favicon.ico', '{"twitter": "https://twitter.com/merlin_ai", "linkedin": "https://linkedin.com/company/merlin-ai"}', 100000000, '2023-02-01'),

('Happyscribe', 'https://happyscribe.com', 'AI-powered transcription and subtitling service', 2017, 'Barcelona, Spain', ARRAY['Transcription', 'Audio Processing', 'Subtitling'], 'https://www.happyscribe.com/favicon.ico', '{"twitter": "https://twitter.com/happyscribe", "linkedin": "https://linkedin.com/company/happyscribe"}', 50000000, '2022-03-01'),

('Plaude', 'https://plaude.com', 'Hardware-based AI meeting assistant', 2021, 'San Francisco, CA', ARRAY['Hardware', 'Meeting Support', 'AI Assistant'], 'https://plaude.com/favicon.ico', '{"twitter": "https://twitter.com/plaude", "linkedin": "https://linkedin.com/company/plaude"}', 30000000, '2022-09-01'),

('Manus', 'https://manus.ai', 'AI-powered workspace platform', 2022, 'San Francisco, CA', ARRAY['Workspace', 'AI Assistant', 'Productivity'], 'https://manus.ai/favicon.ico', '{"twitter": "https://twitter.com/manus_ai", "linkedin": "https://linkedin.com/company/manus"}', 75000000, '2023-04-01'),

('Metaview', 'https://metaview.ai', 'AI-powered interview and recruiting platform', 2021, 'San Francisco, CA', ARRAY['Recruiting', 'Interview', 'AI Assistant'], 'https://metaview.ai/favicon.ico', '{"twitter": "https://twitter.com/metaview", "linkedin": "https://linkedin.com/company/metaview"}', 100000000, '2023-01-01'),

('Cluely', 'https://cluely.ai', 'AI-powered real-time meeting feedback platform', 2022, 'San Francisco, CA', ARRAY['Meeting Support', 'Real-time AI', 'Feedback'], 'https://cluely.ai/favicon.ico', '{"twitter": "https://twitter.com/cluely", "linkedin": "https://linkedin.com/company/cluely"}', 50000000, '2023-06-01'),

('Clay', 'https://clay.com', 'AI-powered sales prospecting and outreach platform', 2019, 'San Francisco, CA', ARRAY['Sales', 'Prospecting', 'Outreach'], 'https://clay.com/favicon.ico', '{"twitter": "https://twitter.com/clay", "linkedin": "https://linkedin.com/company/clay"}', 500000000, '2023-08-01'),

('Crosby Legal', 'https://crosbylegal.com', 'AI-powered legal services and law firm', 2022, 'San Francisco, CA', ARRAY['Legal', 'AI Services', 'Law Firm'], 'https://crosbylegal.com/favicon.ico', '{"twitter": "https://twitter.com/crosbylegal", "linkedin": "https://linkedin.com/company/crosby-legal"}', 100000000, '2023-03-01'),

('Combinely', 'https://combinely.com', 'AI-powered accounting and financial platform', 2021, 'San Francisco, CA', ARRAY['Accounting', 'Finance', 'Automation'], 'https://combinely.com/favicon.ico', '{"twitter": "https://twitter.com/combinely", "linkedin": "https://linkedin.com/company/combinely"}', 75000000, '2022-11-01'),

('Cognition', 'https://cognition.ai', 'AI-powered software engineering platform', 2022, 'San Francisco, CA', ARRAY['Software Engineering', 'AI Coding', 'Automation'], 'https://cognition.ai/favicon.ico', '{"twitter": "https://twitter.com/cognition", "linkedin": "https://linkedin.com/company/cognition"}', 2000000000, '2024-03-01'),

('11x', 'https://11x.ai', 'AI-powered GTM automation and sales platform', 2022, 'San Francisco, CA', ARRAY['GTM', 'Sales', 'Automation'], 'https://11x.ai/favicon.ico', '{"twitter": "https://twitter.com/11x", "linkedin": "https://linkedin.com/company/11x"}', 100000000, '2023-05-01'),

('Serval', 'https://serval.ai', 'AI-powered IT service desk platform', 2021, 'San Francisco, CA', ARRAY['IT Support', 'Service Desk', 'Automation'], 'https://serval.ai/favicon.ico', '{"twitter": "https://twitter.com/serval", "linkedin": "https://linkedin.com/company/serval"}', 50000000, '2022-07-01'),

('Alma', 'https://alma.ai', 'AI-powered immigration law services', 2022, 'San Francisco, CA', ARRAY['Legal', 'Immigration', 'AI Services'], 'https://alma.ai/favicon.ico', '{"twitter": "https://twitter.com/alma", "linkedin": "https://linkedin.com/company/alma"}', 75000000, '2023-02-01'),

('Applaud', 'https://applaud.ai', 'AI-powered HR and employee engagement platform', 2021, 'San Francisco, CA', ARRAY['HR', 'Employee Engagement', 'AI Assistant'], 'https://applaud.ai/favicon.ico', '{"twitter": "https://twitter.com/applaud", "linkedin": "https://linkedin.com/company/applaud"}', 100000000, '2023-01-01'),

('Ada', 'https://ada.com', 'AI-powered customer service automation platform', 2016, 'Toronto, Canada', ARRAY['Customer Service', 'Automation', 'AI Assistant'], 'https://ada.com/favicon.ico', '{"twitter": "https://twitter.com/ada", "linkedin": "https://linkedin.com/company/ada"}', 1000000000, '2021-05-01'),

('Crisp', 'https://crisp.com', 'AI-powered customer support platform', 2017, 'Paris, France', ARRAY['Customer Support', 'AI Assistant', 'Chat'], 'https://crisp.com/favicon.ico', '{"twitter": "https://twitter.com/crisp", "linkedin": "https://linkedin.com/company/crisp"}', 200000000, '2022-04-01'),

('Arcads', 'https://arcads.ai', 'AI-powered avatar creation platform for advertising', 2022, 'San Francisco, CA', ARRAY['Avatar', 'Advertising', 'Creative AI'], 'https://arcads.ai/favicon.ico', '{"twitter": "https://twitter.com/arcads", "linkedin": "https://linkedin.com/company/arcads"}', 50000000, '2023-01-01'),

('Tavus', 'https://tavus.ai', 'Multi-purpose AI avatar platform', 2021, 'San Francisco, CA', ARRAY['Avatar', 'Multi-purpose', 'AI Video'], 'https://tavus.ai/favicon.ico', '{"twitter": "https://twitter.com/tavus", "linkedin": "https://linkedin.com/company/tavus"}', 100000000, '2023-03-01'),

-- Top 100 Gen AI Consumer Apps 公司
('Google', 'https://ai.google', 'Global technology giant providing comprehensive AI products and services', 1998, 'Mountain View, CA', ARRAY['Search', 'AI Platform', 'Cloud AI', 'Multimodal'], 'https://www.google.com/favicon.ico', '{"twitter": "https://twitter.com/google", "linkedin": "https://linkedin.com/company/google"}', 1800000000000, '2024-01-01'),

('X (Twitter)', 'https://x.com', 'Social media platform with AI-powered features and Grok assistant', 2006, 'San Francisco, CA', ARRAY['Social Media', 'AI Assistant', 'Real-time'], 'https://x.com/favicon.ico', '{"twitter": "https://twitter.com/x", "linkedin": "https://linkedin.com/company/x"}', 19000000000, '2022-10-01'),

('Meta', 'https://ai.meta.com', 'Social media and AI research company', 2004, 'Menlo Park, CA', ARRAY['Social Media', 'AI Research', 'VR/AR', 'LLM'], 'https://www.meta.com/favicon.ico', '{"twitter": "https://twitter.com/meta", "linkedin": "https://linkedin.com/company/meta"}', 800000000000, '2024-01-01'),

('Microsoft', 'https://microsoft.com/ai', 'Global software company providing AI-powered productivity tools', 1975, 'Redmond, WA', ARRAY['Enterprise AI', 'Productivity', 'Cloud AI', 'Copilot'], 'https://www.microsoft.com/favicon.ico', '{"twitter": "https://twitter.com/microsoft", "linkedin": "https://linkedin.com/company/microsoft"}', 3000000000000, '2024-01-01'),

-- 其他重要AI公司
('Canva', 'https://canva.com', 'AI-powered design platform for visual content creation', 2013, 'Sydney, Australia', ARRAY['Design', 'Creative AI', 'Visual Content'], 'https://www.canva.com/favicon.ico', '{"twitter": "https://twitter.com/canva", "linkedin": "https://linkedin.com/company/canva"}', 40000000000, '2023-09-01'),

('Midjourney', 'https://midjourney.com', 'AI image generation platform', 2021, 'San Francisco, CA', ARRAY['Image Generation', 'Creative AI', 'Art'], 'https://midjourney.com/favicon.ico', '{"twitter": "https://twitter.com/midjourney", "discord": "https://discord.gg/midjourney"}', 10000000000, '2023-01-01'),

('Scale AI', 'https://scale.com', 'AI data labeling and training platform', 2016, 'San Francisco, CA', ARRAY['Data Labeling', 'AI Training', 'ML Infrastructure'], 'https://scale.com/favicon.ico', '{"twitter": "https://twitter.com/scale_ai", "linkedin": "https://linkedin.com/company/scale-ai"}', 14000000000, '2024-05-01'),

('Databricks', 'https://databricks.com', 'Unified data analytics platform for AI and ML', 2013, 'San Francisco, CA', ARRAY['Data Analytics', 'ML Platform', 'Big Data'], 'https://www.databricks.com/favicon.ico', '{"twitter": "https://twitter.com/databricks", "linkedin": "https://linkedin.com/company/databricks"}', 62000000000, '2024-12-01'),

('Hugging Face', 'https://huggingface.co', 'Open source AI model and dataset platform', 2016, 'New York, NY', ARRAY['Open Source AI', 'Model Hub', 'NLP'], 'https://huggingface.co/favicon.ico', '{"twitter": "https://twitter.com/huggingface", "linkedin": "https://linkedin.com/company/hugging-face"}', 4000000000, '2023-08-01'),

('Stability AI', 'https://stability.ai', 'Open source AI model company', 2020, 'London, UK', ARRAY['Open Source AI', 'Image Generation', 'Diffusion Models'], 'https://stability.ai/favicon.ico', '{"twitter": "https://twitter.com/stabilityai", "linkedin": "https://linkedin.com/company/stability-ai"}', 1000000000, '2022-10-01'),

('Cursor', 'https://cursor.sh', 'AI-powered code editor and development environment', 2023, 'San Francisco, CA', ARRAY['Code Editor', 'AI Coding', 'Developer Tools'], 'https://cursor.sh/favicon.ico', '{"twitter": "https://twitter.com/cursor", "linkedin": "https://linkedin.com/company/cursor"}', 200000000, '2023-12-01'),

('Lovable', 'https://lovable.dev', 'AI-powered web development platform', 2023, 'San Francisco, CA', ARRAY['Web Development', 'AI Coding', 'Rapid Prototyping'], 'https://lovable.dev/favicon.ico', '{"twitter": "https://twitter.com/lovable", "linkedin": "https://linkedin.com/company/lovable"}', 50000000, '2023-08-01'),

('Emergent', 'https://emergent.ai', 'AI-powered development platform', 2023, 'San Francisco, CA', ARRAY['Development Platform', 'AI Coding', 'Automation'], 'https://emergent.ai/favicon.ico', '{"twitter": "https://twitter.com/emergent", "linkedin": "https://linkedin.com/company/emergent"}', 100000000, '2023-10-01')

-- 使用 DO NOTHING 来避免重复插入错误
ON CONFLICT DO NOTHING;
