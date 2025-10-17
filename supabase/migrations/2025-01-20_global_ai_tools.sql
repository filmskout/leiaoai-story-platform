-- 全球AI公司工具数据
-- 包含各公司的具体工具、服务和产品

-- 插入香港AI公司的工具套件
INSERT INTO public.tools (company_id, name, category, description, website, industry_tags, features, api_available, free_tier, pricing_model) 
SELECT c.id, 'Votee Analytics', 'Market Research', 'AI驱动的市场调研和消费者洞察平台', 'https://votee.ai', ARRAY['Market Research', 'Consumer Insights', 'Data Analytics'], '["实时调研", "消费者洞察", "市场分析", "数据可视化"]'::jsonb, true, true, 'Freemium'
FROM public.companies c WHERE c.name = 'Votee AI';

INSERT INTO public.tools (company_id, name, category, description, website, industry_tags, features, api_available, free_tier, pricing_model) 
SELECT c.id, 'FormX OCR', 'Document Processing', 'AI驱动的文档数据提取和OCR服务', 'https://formx.ai', ARRAY['OCR', 'Document Processing', 'Data Extraction'], '["文档识别", "数据提取", "OCR转换", "批量处理"]'::jsonb, true, true, 'Pay-per-page'
FROM public.companies c WHERE c.name = 'FormX';

INSERT INTO public.tools (company_id, name, category, description, website, industry_tags, features, api_available, free_tier, pricing_model) 
SELECT c.id, 'Measurable Insights', 'Email Analytics', '电子邮件和收据数据分析平台', 'https://measurable.ai', ARRAY['Email Analytics', 'Consumer Behavior', 'Data Intelligence'], '["邮件分析", "消费行为", "趋势预测", "竞争分析"]'::jsonb, true, false, 'Subscription'
FROM public.companies c WHERE c.name = 'Measurable AI';

-- 插入新加坡AI公司的工具套件
INSERT INTO public.tools (company_id, name, category, description, website, industry_tags, features, api_available, free_tier, pricing_model) 
SELECT c.id, 'Grab AI', 'AI Platform', 'Grab超级应用的AI驱动服务', 'https://grab.com', ARRAY['Super App', 'AI Platform', 'Transportation'], '["智能匹配", "路线优化", "需求预测", "个性化推荐"]'::jsonb, true, true, 'Freemium'
FROM public.companies c WHERE c.name = 'Grab';

INSERT INTO public.tools (company_id, name, category, description, website, industry_tags, features, api_available, free_tier, pricing_model) 
SELECT c.id, 'Sea AI', 'AI Platform', 'Sea Limited的AI服务平台', 'https://sea.com', ARRAY['Gaming AI', 'E-commerce AI', 'Digital Finance'], '["游戏AI", "电商推荐", "金融风控", "内容生成"]'::jsonb, true, false, 'Enterprise'
FROM public.companies c WHERE c.name = 'Sea Limited';

INSERT INTO public.tools (company_id, name, category, description, website, industry_tags, features, api_available, free_tier, pricing_model) 
SELECT c.id, 'Advance AI', 'Identity Verification', 'AI驱动的身份验证和风险评估平台', 'https://advance.ai', ARRAY['Identity Verification', 'Risk Assessment', 'Fintech'], '["身份验证", "风险评估", "反欺诈", "KYC"]'::jsonb, true, false, 'Pay-per-use'
FROM public.companies c WHERE c.name = 'Advance Intelligence Group';

-- 插入日本AI公司的工具套件
INSERT INTO public.tools (company_id, name, category, description, website, industry_tags, features, api_available, free_tier, pricing_model) 
SELECT c.id, 'Chainer', 'Deep Learning', 'Preferred Networks的深度学习框架', 'https://chainer.org', ARRAY['Deep Learning', 'Framework', 'Open Source'], '["深度学习", "神经网络", "GPU加速", "开源框架"]'::jsonb, true, true, 'Open Source'
FROM public.companies c WHERE c.name = 'Preferred Networks';

INSERT INTO public.tools (company_id, name, category, description, website, industry_tags, features, api_available, free_tier, pricing_model) 
SELECT c.id, 'Sony AI Platform', 'Entertainment AI', '索尼的AI娱乐平台', 'https://ai.sony.com', ARRAY['Entertainment AI', 'Gaming', 'Music AI'], '["游戏AI", "音乐生成", "内容推荐", "创意AI"]'::jsonb, true, false, 'Enterprise'
FROM public.companies c WHERE c.name = 'Sony AI';

INSERT INTO public.tools (company_id, name, category, description, website, industry_tags, features, api_available, free_tier, pricing_model) 
SELECT c.id, 'Pepper', 'Service Robot', '软银的人形服务机器人', 'https://softbankrobotics.com', ARRAY['Humanoid Robot', 'Service Robot', 'AI Assistant'], '["人形机器人", "服务助手", "情感交互", "商业应用"]'::jsonb, false, false, 'Enterprise'
FROM public.companies c WHERE c.name = 'SoftBank Robotics';

-- 插入韩国AI公司的工具套件
INSERT INTO public.tools (company_id, name, category, description, website, industry_tags, features, api_available, free_tier, pricing_model) 
SELECT c.id, 'Naver AI', 'AI Platform', 'Naver的AI服务平台', 'https://naver.com', ARRAY['Korean AI', 'Search AI', 'Language Processing'], '["韩语AI", "智能搜索", "语言处理", "内容推荐"]'::jsonb, true, true, 'Freemium'
FROM public.companies c WHERE c.name = 'Naver';

INSERT INTO public.tools (company_id, name, category, description, website, industry_tags, features, api_available, free_tier, pricing_model) 
SELECT c.id, 'Kakao AI', 'Mobile AI', 'Kakao的移动AI服务', 'https://kakao.com', ARRAY['Mobile AI', 'Communication', 'Payment AI'], '["移动AI", "智能通讯", "支付AI", "生活服务"]'::jsonb, true, true, 'Freemium'
FROM public.companies c WHERE c.name = 'Kakao';

INSERT INTO public.tools (company_id, name, category, description, website, industry_tags, features, api_available, free_tier, pricing_model) 
SELECT c.id, 'SKT AI', 'Telecom AI', 'SK Telecom的5G和AI服务', 'https://sktelecom.com', ARRAY['5G AI', 'Telecom AI', 'Network AI'], '["5G优化", "网络AI", "智能运维", "边缘计算"]'::jsonb, true, false, 'Enterprise'
FROM public.companies c WHERE c.name = 'SK Telecom';

-- 插入印度AI公司的工具套件
INSERT INTO public.tools (company_id, name, category, description, website, industry_tags, features, api_available, free_tier, pricing_model) 
SELECT c.id, 'Zoho AI', 'Enterprise AI', 'Zoho的AI驱动企业软件套件', 'https://zoho.com', ARRAY['Enterprise AI', 'CRM AI', 'Business Intelligence'], '["CRM AI", "商业智能", "自动化", "数据分析"]'::jsonb, true, true, 'Freemium'
FROM public.companies c WHERE c.name = 'Zoho';

INSERT INTO public.tools (company_id, name, category, description, website, industry_tags, features, api_available, free_tier, pricing_model) 
SELECT c.id, 'Freshworks AI', 'Customer Service', 'Freshworks的AI客户服务平台', 'https://freshworks.com', ARRAY['Customer Service', 'AI Support', 'Automation'], '["智能客服", "自动回复", "工单分类", "客户洞察"]'::jsonb, true, true, 'Freemium'
FROM public.companies c WHERE c.name = 'Freshworks';

INSERT INTO public.tools (company_id, name, category, description, website, industry_tags, features, api_available, free_tier, pricing_model) 
SELECT c.id, 'Ola AI', 'Mobility AI', 'Ola的AI驱动出行平台', 'https://ola.com', ARRAY['Mobility AI', 'Transportation', 'Route Optimization'], '["智能匹配", "路线优化", "需求预测", "动态定价"]'::jsonb, true, true, 'Freemium'
FROM public.companies c WHERE c.name = 'Ola';

-- 插入欧洲AI公司的工具套件
INSERT INTO public.tools (company_id, name, category, description, website, industry_tags, features, api_available, free_tier, pricing_model) 
SELECT c.id, 'AlphaGo', 'Game AI', 'DeepMind的围棋AI系统', 'https://deepmind.com', ARRAY['Game AI', 'Reinforcement Learning', 'Strategy AI'], '["围棋AI", "强化学习", "策略AI", "决策优化"]'::jsonb, false, false, 'Research'
FROM public.companies c WHERE c.name = 'DeepMind';

INSERT INTO public.tools (company_id, name, category, description, website, industry_tags, features, api_available, free_tier, pricing_model) 
SELECT c.id, 'Graphcore IPU', 'AI Hardware', 'Graphcore的智能处理单元', 'https://graphcore.ai', ARRAY['AI Chips', 'Hardware', 'Deep Learning'], '["AI芯片", "深度学习", "高性能计算", "边缘AI"]'::jsonb, false, false, 'Hardware'
FROM public.companies c WHERE c.name = 'Graphcore';

INSERT INTO public.tools (company_id, name, category, description, website, industry_tags, features, api_available, free_tier, pricing_model) 
SELECT c.id, 'Darktrace AI', 'Cybersecurity', 'Darktrace的AI网络安全平台', 'https://darktrace.com', ARRAY['Cybersecurity', 'Threat Detection', 'AI Security'], '["威胁检测", "异常识别", "自动响应", "安全分析"]'::jsonb, true, false, 'Subscription'
FROM public.companies c WHERE c.name = 'Darktrace';

INSERT INTO public.tools (company_id, name, category, description, website, industry_tags, features, api_available, free_tier, pricing_model) 
SELECT c.id, 'Mistral 7B', 'LLM', 'Mistral AI的开源大语言模型', 'https://mistral.ai', ARRAY['LLM', 'Open Source', 'French AI'], '["大语言模型", "开源", "多语言", "高效推理"]'::jsonb, true, true, 'Open Source'
FROM public.companies c WHERE c.name = 'Mistral AI';

INSERT INTO public.tools (company_id, name, category, description, website, industry_tags, features, api_available, free_tier, pricing_model) 
SELECT c.id, 'Aleph Alpha Luminous', 'LLM', 'Aleph Alpha的欧洲大语言模型', 'https://aleph-alpha.com', ARRAY['LLM', 'European AI', 'Multilingual'], '["大语言模型", "欧洲AI", "多语言", "隐私保护"]'::jsonb, true, true, 'Freemium'
FROM public.companies c WHERE c.name = 'Aleph Alpha';

-- 插入加拿大AI公司的工具套件
INSERT INTO public.tools (company_id, name, category, description, website, industry_tags, features, api_available, free_tier, pricing_model) 
SELECT c.id, 'Cohere API', 'LLM API', 'Cohere的企业级大语言模型API', 'https://cohere.ai', ARRAY['LLM', 'Enterprise API', 'Text Generation'], '["文本生成", "对话AI", "企业API", "多语言"]'::jsonb, true, true, 'Pay-per-token'
FROM public.companies c WHERE c.name = 'Cohere';

INSERT INTO public.tools (company_id, name, category, description, website, industry_tags, features, api_available, free_tier, pricing_model) 
SELECT c.id, 'Element AI Platform', 'Enterprise AI', 'Element AI的企业AI解决方案平台', 'https://elementai.com', ARRAY['Enterprise AI', 'AI Solutions', 'Consulting'], '["企业AI", "AI咨询", "解决方案", "数字化转型"]'::jsonb, true, false, 'Enterprise'
FROM public.companies c WHERE c.name = 'Element AI';

-- 插入以色列AI公司的工具套件
INSERT INTO public.tools (company_id, name, category, description, website, industry_tags, features, api_available, free_tier, pricing_model) 
SELECT c.id, 'Mobileye EyeQ', 'Autonomous Driving', 'Mobileye的自动驾驶芯片和软件', 'https://mobileye.com', ARRAY['Autonomous Driving', 'Computer Vision', 'ADAS'], '["自动驾驶", "计算机视觉", "ADAS", "安全系统"]'::jsonb, false, false, 'Hardware'
FROM public.companies c WHERE c.name = 'Mobileye';

INSERT INTO public.tools (company_id, name, category, description, website, industry_tags, features, api_available, free_tier, pricing_model) 
SELECT c.id, 'Waze AI', 'Navigation AI', 'Waze的AI驱动导航服务', 'https://waze.com', ARRAY['Navigation', 'Traffic AI', 'Maps'], '["智能导航", "交通预测", "路线优化", "实时更新"]'::jsonb, true, true, 'Freemium'
FROM public.companies c WHERE c.name = 'Waze';

-- 插入澳大利亚AI公司的工具套件
INSERT INTO public.tools (company_id, name, category, description, website, industry_tags, features, api_available, free_tier, pricing_model) 
SELECT c.id, 'Canva AI', 'Design AI', 'Canva的AI设计工具', 'https://canva.com', ARRAY['Design AI', 'Creative AI', 'Visual Content'], '["AI设计", "自动布局", "内容生成", "品牌一致性"]'::jsonb, true, true, 'Freemium'
FROM public.companies c WHERE c.name = 'Canva';

INSERT INTO public.tools (company_id, name, category, description, website, industry_tags, features, api_available, free_tier, pricing_model) 
SELECT c.id, 'Atlassian AI', 'Collaboration AI', 'Atlassian的AI协作工具', 'https://atlassian.com', ARRAY['Collaboration AI', 'Project Management', 'AI Tools'], '["智能协作", "项目管理", "自动化", "团队洞察"]'::jsonb, true, true, 'Freemium'
FROM public.companies c WHERE c.name = 'Atlassian';

-- 插入巴西AI公司的工具套件
INSERT INTO public.tools (company_id, name, category, description, website, industry_tags, features, api_available, free_tier, pricing_model) 
SELECT c.id, 'Nubank AI', 'Fintech AI', 'Nubank的AI金融科技平台', 'https://nubank.com.br', ARRAY['Fintech AI', 'Digital Banking', 'Risk Assessment'], '["智能风控", "数字银行", "信用评估", "反欺诈"]'::jsonb, true, true, 'Freemium'
FROM public.companies c WHERE c.name = 'Nubank';

INSERT INTO public.tools (company_id, name, category, description, website, industry_tags, features, api_available, free_tier, pricing_model) 
SELECT c.id, 'Stone AI', 'Payment AI', 'StoneCo的AI支付服务', 'https://stone.co', ARRAY['Payment AI', 'Fintech', 'AI Services'], '["支付AI", "风控系统", "数据分析", "商户服务"]'::jsonb, true, false, 'Pay-per-transaction'
FROM public.companies c WHERE c.name = 'StoneCo';

-- 插入墨西哥AI公司的工具套件
INSERT INTO public.tools (company_id, name, category, description, website, industry_tags, features, api_available, free_tier, pricing_model) 
SELECT c.id, 'Kavak AI', 'Automotive AI', 'Kavak的AI车辆评估平台', 'https://kavak.com', ARRAY['Automotive AI', 'Vehicle Assessment', 'Marketplace'], '["车辆评估", "价格预测", "质量检测", "市场分析"]'::jsonb, true, true, 'Freemium'
FROM public.companies c WHERE c.name = 'Kavak';

-- 插入阿根廷AI公司的工具套件
INSERT INTO public.tools (company_id, name, category, description, website, industry_tags, features, api_available, free_tier, pricing_model) 
SELECT c.id, 'MercadoLibre AI', 'E-commerce AI', 'MercadoLibre的AI电商平台', 'https://mercadolibre.com', ARRAY['E-commerce AI', 'Recommendation', 'Marketplace'], '["智能推荐", "搜索优化", "价格分析", "用户行为"]'::jsonb, true, true, 'Freemium'
FROM public.companies c WHERE c.name = 'MercadoLibre';

-- 插入南非AI公司的工具套件
INSERT INTO public.tools (company_id, name, category, description, website, industry_tags, features, api_available, free_tier, pricing_model) 
SELECT c.id, 'Dimension Data AI', 'Enterprise AI', 'Dimension Data的企业AI解决方案', 'https://dimensiondata.com', ARRAY['Enterprise AI', 'IT Services', 'Digital Transformation'], '["企业AI", "IT服务", "数字化转型", "智能运维"]'::jsonb, true, false, 'Enterprise'
FROM public.companies c WHERE c.name = 'Dimension Data';

-- 插入阿联酋AI公司的工具套件
INSERT INTO public.tools (company_id, name, category, description, website, industry_tags, features, api_available, free_tier, pricing_model) 
SELECT c.id, 'Careem AI', 'Mobility AI', 'Careem的AI出行优化平台', 'https://careem.com', ARRAY['Mobility AI', 'Transportation', 'AI Optimization'], '["智能匹配", "路线优化", "需求预测", "动态定价"]'::jsonb, true, true, 'Freemium'
FROM public.companies c WHERE c.name = 'Careem';
