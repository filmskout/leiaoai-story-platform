-- 全球AI公司数据
-- 包含香港、新加坡、日本、韩国、印度、欧洲等地区的AI公司

-- 插入香港AI公司
INSERT INTO public.companies (name, website, description, founded_year, headquarters, industry_tags, logo_url, social_links, valuation_usd, last_funding_date) VALUES

-- 香港AI公司
('Votee AI', 'https://votee.ai', '基于AI的市场调研和数据分析平台，提供实时消费者洞察', 2020, '香港, 中国', ARRAY['Market Research', 'Data Analytics', 'Consumer Insights'], 'https://votee.ai/favicon.ico', '{"linkedin": "https://linkedin.com/company/votee-ai"}', 50000000, '2023-06-01'),

('FormX', 'https://formx.ai', 'AI驱动的文档数据提取和处理平台', 2019, '香港, 中国', ARRAY['Document Processing', 'Data Extraction', 'OCR'], 'https://formx.ai/favicon.ico', '{"linkedin": "https://linkedin.com/company/formx"}', 30000000, '2023-03-01'),

('Measurable AI', 'https://measurable.ai', '电子邮件和收据数据分析平台，提供消费者行为洞察', 2018, '香港, 中国', ARRAY['Email Analytics', 'Consumer Behavior', 'Data Intelligence'], 'https://measurable.ai/favicon.ico', '{"linkedin": "https://linkedin.com/company/measurable-ai"}', 40000000, '2023-08-01'),

-- 新加坡AI公司
('Grab', 'https://grab.com', '东南亚领先的超级应用，集成AI驱动的交通、配送和金融服务', 2012, '新加坡', ARRAY['Super App', 'Transportation', 'AI Platform'], 'https://grab.com/favicon.ico', '{"linkedin": "https://linkedin.com/company/grab", "twitter": "https://twitter.com/grab"}', 40000000000, '2021-12-01'),

('Sea Limited', 'https://sea.com', '东南亚领先的互联网公司，提供游戏、电商和数字金融服务', 2009, '新加坡', ARRAY['Gaming', 'E-commerce', 'Digital Finance'], 'https://sea.com/favicon.ico', '{"linkedin": "https://linkedin.com/company/sea-limited"}', 20000000000, '2021-01-01'),

('Advance Intelligence Group', 'https://advance.ai', 'AI驱动的金融科技公司，提供身份验证和风险评估', 2016, '新加坡', ARRAY['Fintech', 'Identity Verification', 'Risk Assessment'], 'https://advance.ai/favicon.ico', '{"linkedin": "https://linkedin.com/company/advance-intelligence-group"}', 2000000000, '2021-09-01'),

-- 日本AI公司
('Preferred Networks', 'https://preferred.jp', '日本领先的AI公司，专注于深度学习和边缘计算', 2014, '东京, 日本', ARRAY['Deep Learning', 'Edge Computing', 'Robotics'], 'https://preferred.jp/favicon.ico', '{"linkedin": "https://linkedin.com/company/preferred-networks"}', 1000000000, '2021-03-01'),

('Sony AI', 'https://ai.sony.com', '索尼的AI研究部门，专注于游戏、音乐和娱乐AI', 2020, '东京, 日本', ARRAY['Entertainment AI', 'Gaming', 'Music AI'], 'https://ai.sony.com/favicon.ico', '{"linkedin": "https://linkedin.com/company/sony-ai"}', 500000000, '2020-04-01'),

('SoftBank Robotics', 'https://softbankrobotics.com', '软银机器人公司，开发人形机器人和服务机器人', 2012, '东京, 日本', ARRAY['Robotics', 'Humanoid Robots', 'Service Robots'], 'https://softbankrobotics.com/favicon.ico', '{"linkedin": "https://linkedin.com/company/softbank-robotics"}', 2000000000, '2020-01-01'),

-- 韩国AI公司
('Naver', 'https://naver.com', '韩国领先的互联网公司，提供搜索引擎和AI服务', 1999, '首尔, 韩国', ARRAY['Search Engine', 'AI Platform', 'Korean AI'], 'https://naver.com/favicon.ico', '{"linkedin": "https://linkedin.com/company/naver"}', 30000000000, '2021-01-01'),

('Kakao', 'https://kakao.com', '韩国领先的移动互联网公司，提供AI驱动的通讯和支付服务', 2010, '首尔, 韩国', ARRAY['Mobile AI', 'Communication', 'Payment'], 'https://kakao.com/favicon.ico', '{"linkedin": "https://linkedin.com/company/kakao"}', 15000000000, '2021-01-01'),

('SK Telecom', 'https://sktelecom.com', '韩国领先的电信公司，提供5G和AI服务', 1984, '首尔, 韩国', ARRAY['Telecommunications', '5G', 'AI Services'], 'https://sktelecom.com/favicon.ico', '{"linkedin": "https://linkedin.com/company/sk-telecom"}', 20000000000, '2021-01-01'),

-- 印度AI公司
('Zoho', 'https://zoho.com', '印度领先的软件公司，提供AI驱动的企业软件套件', 1996, '钦奈, 印度', ARRAY['Enterprise Software', 'AI Platform', 'CRM'], 'https://zoho.com/favicon.ico', '{"linkedin": "https://linkedin.com/company/zoho"}', 10000000000, '2021-01-01'),

('Freshworks', 'https://freshworks.com', '印度SaaS公司，提供AI驱动的客户服务软件', 2010, '钦奈, 印度', ARRAY['SaaS', 'Customer Service', 'AI Platform'], 'https://freshworks.com/favicon.ico', '{"linkedin": "https://linkedin.com/company/freshworks"}', 5000000000, '2021-09-01'),

('Ola', 'https://ola.com', '印度领先的出行平台，提供AI驱动的交通服务', 2010, '班加罗尔, 印度', ARRAY['Transportation', 'Mobility', 'AI Platform'], 'https://ola.com/favicon.ico', '{"linkedin": "https://linkedin.com/company/ola"}', 7000000000, '2021-07-01'),

-- 欧洲AI公司
('DeepMind', 'https://deepmind.com', '谷歌的AI研究部门，专注于通用人工智能', 2010, '伦敦, 英国', ARRAY['AI Research', 'General AI', 'Deep Learning'], 'https://deepmind.com/favicon.ico', '{"linkedin": "https://linkedin.com/company/deepmind", "twitter": "https://twitter.com/deepmind"}', 1000000000, '2014-01-01'),

('Graphcore', 'https://graphcore.ai', '英国AI芯片公司，提供高性能AI计算硬件', 2016, '布里斯托, 英国', ARRAY['AI Chips', 'Hardware', 'Deep Learning'], 'https://graphcore.ai/favicon.ico', '{"linkedin": "https://linkedin.com/company/graphcore", "twitter": "https://twitter.com/graphcore"}', 2800000000, '2020-12-01'),

('Darktrace', 'https://darktrace.com', '英国网络安全公司，使用AI进行威胁检测', 2013, '剑桥, 英国', ARRAY['Cybersecurity', 'Threat Detection', 'AI Security'], 'https://darktrace.com/favicon.ico', '{"linkedin": "https://linkedin.com/company/darktrace", "twitter": "https://twitter.com/darktrace"}', 3000000000, '2021-04-01'),

('Mistral AI', 'https://mistral.ai', '法国AI公司，开发开源大语言模型', 2023, '巴黎, 法国', ARRAY['LLM', 'Open Source', 'French AI'], 'https://mistral.ai/favicon.ico', '{"linkedin": "https://linkedin.com/company/mistral-ai", "twitter": "https://twitter.com/mistralai"}', 2000000000, '2024-02-01'),

('Aleph Alpha', 'https://aleph-alpha.com', '德国AI公司，开发欧洲大语言模型', 2019, '海德堡, 德国', ARRAY['LLM', 'European AI', 'Multilingual'], 'https://aleph-alpha.com/favicon.ico', '{"linkedin": "https://linkedin.com/company/aleph-alpha"}', 500000000, '2023-11-01'),

-- 加拿大AI公司
('Cohere', 'https://cohere.ai', '加拿大AI公司，提供企业级大语言模型API', 2019, '多伦多, 加拿大', ARRAY['LLM', 'Enterprise AI', 'API'], 'https://cohere.ai/favicon.ico', '{"linkedin": "https://linkedin.com/company/cohere", "twitter": "https://twitter.com/cohere"}', 2000000000, '2023-06-01'),

('Element AI', 'https://elementai.com', '加拿大AI公司，提供企业AI解决方案', 2016, '蒙特利尔, 加拿大', ARRAY['Enterprise AI', 'AI Solutions', 'Consulting'], 'https://elementai.com/favicon.ico', '{"linkedin": "https://linkedin.com/company/element-ai"}', 1000000000, '2020-01-01'),

-- 以色列AI公司
('Mobileye', 'https://mobileye.com', '英特尔子公司，专注于自动驾驶技术', 1999, '耶路撒冷, 以色列', ARRAY['Autonomous Driving', 'Computer Vision', 'ADAS'], 'https://mobileye.com/favicon.ico', '{"linkedin": "https://linkedin.com/company/mobileye", "twitter": "https://twitter.com/mobileye"}', 50000000000, '2022-10-01'),

('Waze', 'https://waze.com', '谷歌子公司，提供AI驱动的导航服务', 2008, '特拉维夫, 以色列', ARRAY['Navigation', 'Traffic AI', 'Maps'], 'https://waze.com/favicon.ico', '{"linkedin": "https://linkedin.com/company/waze", "twitter": "https://twitter.com/waze"}', 1000000000, '2013-06-01'),

-- 澳大利亚AI公司
('Canva', 'https://canva.com', '澳大利亚设计平台，集成AI设计工具', 2013, '悉尼, 澳大利亚', ARRAY['Design', 'Creative AI', 'Visual Content'], 'https://www.canva.com/favicon.ico', '{"linkedin": "https://linkedin.com/company/canva", "twitter": "https://twitter.com/canva"}', 40000000000, '2023-09-01'),

('Atlassian', 'https://atlassian.com', '澳大利亚软件公司，提供AI驱动的协作工具', 2002, '悉尼, 澳大利亚', ARRAY['Collaboration', 'Project Management', 'AI Tools'], 'https://atlassian.com/favicon.ico', '{"linkedin": "https://linkedin.com/company/atlassian", "twitter": "https://twitter.com/atlassian"}', 100000000000, '2021-01-01'),

-- 巴西AI公司
('Nubank', 'https://nubank.com.br', '巴西金融科技公司，使用AI进行风险评估', 2013, '圣保罗, 巴西', ARRAY['Fintech', 'Digital Banking', 'AI Risk'], 'https://nubank.com.br/favicon.ico', '{"linkedin": "https://linkedin.com/company/nubank", "twitter": "https://twitter.com/nubank"}', 30000000000, '2021-12-01'),

('StoneCo', 'https://stone.co', '巴西支付公司，提供AI驱动的金融服务', 2012, '圣保罗, 巴西', ARRAY['Payments', 'Fintech', 'AI Services'], 'https://stone.co/favicon.ico', '{"linkedin": "https://linkedin.com/company/stoneco"}', 5000000000, '2021-01-01'),

-- 墨西哥AI公司
('Kavak', 'https://kavak.com', '墨西哥二手车平台，使用AI进行车辆评估', 2016, '墨西哥城, 墨西哥', ARRAY['Automotive', 'Marketplace', 'AI Assessment'], 'https://kavak.com/favicon.ico', '{"linkedin": "https://linkedin.com/company/kavak", "twitter": "https://twitter.com/kavak"}', 4000000000, '2021-09-01'),

-- 阿根廷AI公司
('MercadoLibre', 'https://mercadolibre.com', '拉美领先的电商平台，集成AI推荐系统', 1999, '布宜诺斯艾利斯, 阿根廷', ARRAY['E-commerce', 'Marketplace', 'AI Recommendations'], 'https://mercadolibre.com/favicon.ico', '{"linkedin": "https://linkedin.com/company/mercadolibre", "twitter": "https://twitter.com/mercadolibre"}', 80000000000, '2021-01-01'),

-- 南非AI公司
('Dimension Data', 'https://dimensiondata.com', '南非IT服务公司，提供AI驱动的企业解决方案', 1983, '约翰内斯堡, 南非', ARRAY['IT Services', 'Enterprise AI', 'Digital Transformation'], 'https://dimensiondata.com/favicon.ico', '{"linkedin": "https://linkedin.com/company/dimension-data"}', 2000000000, '2021-01-01'),

-- 阿联酋AI公司
('Careem', 'https://careem.com', '中东出行平台，使用AI优化交通服务', 2012, '迪拜, 阿联酋', ARRAY['Transportation', 'Mobility', 'AI Optimization'], 'https://careem.com/favicon.ico', '{"linkedin": "https://linkedin.com/company/careem", "twitter": "https://twitter.com/careem"}', 1000000000, '2019-03-01')

ON CONFLICT (name) DO UPDATE SET
  website = EXCLUDED.website,
  description = EXCLUDED.description,
  founded_year = EXCLUDED.founded_year,
  headquarters = EXCLUDED.headquarters,
  industry_tags = EXCLUDED.industry_tags,
  logo_url = EXCLUDED.logo_url,
  social_links = EXCLUDED.social_links,
  valuation_usd = EXCLUDED.valuation_usd,
  last_funding_date = EXCLUDED.last_funding_date;
