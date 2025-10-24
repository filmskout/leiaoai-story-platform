-- 修复tools表结构并更新公司数据
-- 第一步：检查并添加缺失的字段

-- 检查tools表当前结构
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'tools' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 添加缺失的字段（如果不存在）
-- 修复tools表
ALTER TABLE public.tools 
ADD COLUMN IF NOT EXISTS url TEXT,
ADD COLUMN IF NOT EXISTS category TEXT,
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- 修复companies表
ALTER TABLE public.companies 
ADD COLUMN IF NOT EXISTS detailed_description TEXT,
ADD COLUMN IF NOT EXISTS website TEXT,
ADD COLUMN IF NOT EXISTS founded_year INTEGER,
ADD COLUMN IF NOT EXISTS headquarters TEXT,
ADD COLUMN IF NOT EXISTS employee_count_range TEXT,
ADD COLUMN IF NOT EXISTS valuation_usd BIGINT,
ADD COLUMN IF NOT EXISTS industry_tags TEXT[],
ADD COLUMN IF NOT EXISTS logo_base64 TEXT,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- 修复tools表
ALTER TABLE public.tools 
ADD COLUMN IF NOT EXISTS company_id UUID REFERENCES public.companies(id),
ADD COLUMN IF NOT EXISTS name TEXT,
ADD COLUMN IF NOT EXISTS description TEXT;

-- 修复fundings表
ALTER TABLE public.fundings 
ADD COLUMN IF NOT EXISTS company_id UUID REFERENCES public.companies(id),
ADD COLUMN IF NOT EXISTS round TEXT,
ADD COLUMN IF NOT EXISTS amount_usd BIGINT,
ADD COLUMN IF NOT EXISTS investors TEXT[],
ADD COLUMN IF NOT EXISTS announced_on DATE,
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- 修复stories表
ALTER TABLE public.stories 
ADD COLUMN IF NOT EXISTS company_id UUID REFERENCES public.companies(id),
ADD COLUMN IF NOT EXISTS title TEXT,
ADD COLUMN IF NOT EXISTS content TEXT,
ADD COLUMN IF NOT EXISTS source_url TEXT,
ADD COLUMN IF NOT EXISTS published_at DATE,
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- 第二步：更新公司数据
-- 更新OpenAI
UPDATE public.companies 
SET 
    description = 'OpenAI是领先的人工智能研究公司，专注于开发安全、有益的AGI（通用人工智能）。',
    detailed_description = 'OpenAI成立于2015年，是一家专注于人工智能研究的公司，致力于确保人工智能造福全人类。公司最著名的产品是ChatGPT，这是一个基于大型语言模型的对话AI系统，能够进行自然语言对话、回答问题、协助写作等多种任务。OpenAI还开发了GPT系列模型，包括GPT-3、GPT-4等，这些模型在自然语言处理领域取得了突破性进展。公司的使命是确保人工智能的发展能够安全、有益地造福全人类，避免潜在的风险。OpenAI采用了一种独特的公司结构，既有营利性子公司，也有非营利性母公司，以平衡商业利益和社会责任。公司还与微软建立了战略合作伙伴关系，获得了大量投资用于模型训练和基础设施开发。',
    website = 'https://openai.com',
    founded_year = 2015,
    headquarters = 'San Francisco, CA, USA',
    employee_count_range = '1000-5000',
    valuation_usd = 80000000000,
    industry_tags = ARRAY['AI Research', 'Large Language Models', 'AGI', 'Machine Learning'],
    logo_base64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
    updated_at = NOW()
WHERE name = 'OpenAI';

-- 更新Google DeepMind
UPDATE public.companies 
SET 
    description = 'Google DeepMind是谷歌旗下的人工智能研究实验室，专注于深度学习、强化学习和通用人工智能研究。',
    detailed_description = 'Google DeepMind成立于2010年，最初是英国的一家独立公司，2014年被谷歌收购。DeepMind在人工智能领域取得了多项突破性成就，最著名的是开发了AlphaGo，这是第一个在围棋比赛中击败人类世界冠军的AI系统。随后，DeepMind又开发了AlphaZero，一个能够自学多种棋类游戏的通用AI系统。DeepMind还开发了AlphaFold，这是一个能够预测蛋白质结构的AI系统，对生物医学研究具有重要意义。公司专注于深度学习、强化学习和通用人工智能的研究，致力于解决科学和工程中的复杂问题。DeepMind的研究成果不仅在游戏领域取得了突破，还在医疗、能源、材料科学等领域有重要应用。公司采用开放的研究文化，经常发表重要的学术论文，推动整个AI领域的发展。',
    website = 'https://deepmind.google',
    founded_year = 2010,
    headquarters = 'London, UK',
    employee_count_range = '1000-2000',
    valuation_usd = 50000000000,
    industry_tags = ARRAY['AI Research', 'Deep Learning', 'Reinforcement Learning', 'Scientific AI'],
    logo_base64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
    updated_at = NOW()
WHERE name = 'Google DeepMind';

-- 更新百度AI
UPDATE public.companies 
SET 
    description = '百度AI是百度公司的人工智能业务部门，专注于文心一言等大语言模型和AI应用开发。',
    detailed_description = '百度AI是百度公司的人工智能业务部门，致力于推动人工智能技术的产业化应用。百度AI的核心产品是文心一言（ERNIE Bot），这是一个基于百度自研的ERNIE（Enhanced Representation through Knowledge Integration）技术构建的大语言模型。文心一言能够进行自然语言对话、文本生成、知识问答等多种任务，在中文理解和生成方面具有显著优势。百度AI还开发了Apollo自动驾驶平台，这是全球领先的自动驾驶开放平台之一。此外，百度AI在计算机视觉、语音识别、自然语言处理等领域也有重要布局，为各行各业提供AI解决方案。百度AI采用"AI+行业"的策略，将人工智能技术应用到搜索、广告、云计算、智能驾驶等多个业务领域，推动传统行业的智能化升级。',
    website = 'https://ai.baidu.com',
    founded_year = 2000,
    headquarters = 'Beijing, China',
    employee_count_range = '10000+',
    valuation_usd = 45000000000,
    industry_tags = ARRAY['Large Language Models', 'Autonomous Driving', 'Computer Vision', 'AI Applications'],
    logo_base64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
    updated_at = NOW()
WHERE name = '百度AI';

-- 更新腾讯AI
UPDATE public.companies 
SET 
    description = '腾讯AI是腾讯公司的人工智能业务部门，专注于腾讯云AI服务和腾讯元宝等AI产品。',
    detailed_description = '腾讯AI是腾讯公司的人工智能业务部门，致力于将AI技术应用到腾讯的各个业务场景中。腾讯AI的核心产品包括腾讯云AI服务，提供语音识别、图像识别、自然语言处理等多种AI能力。腾讯还推出了腾讯元宝，这是一个基于大语言模型的AI助手，能够进行对话、写作、编程等多种任务。腾讯AI在游戏AI、社交AI、内容AI等领域有重要布局，为腾讯的游戏、社交、内容等业务提供AI技术支持。腾讯AI还通过腾讯云对外提供AI服务，帮助企业客户实现智能化转型。腾讯AI采用"技术+场景"的策略，将人工智能技术与腾讯的业务场景深度融合，推动产品和服务的智能化升级。',
    website = 'https://cloud.tencent.com/product/ai',
    founded_year = 1998,
    headquarters = 'Shenzhen, China',
    employee_count_range = '10000+',
    valuation_usd = 40000000000,
    industry_tags = ARRAY['Cloud AI', 'Large Language Models', 'Game AI', 'Social AI'],
    logo_base64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
    updated_at = NOW()
WHERE name = '腾讯AI';

-- 更新Anthropic
UPDATE public.companies 
SET 
    description = 'Anthropic是专注于AI安全研究的公司，开发了Claude等安全、有益的AI助手。',
    detailed_description = 'Anthropic成立于2021年，是一家专注于AI安全研究的公司，致力于开发安全、有益的人工智能系统。公司的核心产品是Claude，这是一个基于大型语言模型的AI助手，以其安全性和有用性而闻名。Anthropic采用了一种独特的方法来训练AI系统，称为"Constitutional AI"，这种方法通过让AI系统学习遵循一套基本原则来确保其行为符合人类价值观。Anthropic的研究重点包括AI对齐、AI安全、可解释AI等领域，致力于确保人工智能的发展能够安全、可控地进行。公司由OpenAI的前员工创立，他们对AI安全有着深刻的理解和担忧。Anthropic的目标是开发出既强大又安全的AI系统，为人类提供有益的AI助手，同时避免潜在的风险和危害。',
    website = 'https://anthropic.com',
    founded_year = 2021,
    headquarters = 'San Francisco, CA, USA',
    employee_count_range = '100-500',
    valuation_usd = 15000000000,
    industry_tags = ARRAY['AI Safety', 'Large Language Models', 'AI Alignment', 'Constitutional AI'],
    logo_base64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
    updated_at = NOW()
WHERE name = 'Anthropic';

-- 第三步：插入工具/产品数据
-- 先清理现有工具数据
DELETE FROM public.tools WHERE company_id IN (
    SELECT id FROM public.companies WHERE name IN ('OpenAI', 'Google DeepMind', '百度AI', '腾讯AI', 'Anthropic')
);

-- 插入OpenAI的工具
INSERT INTO public.tools (company_id, name, description, url, category, created_at) 
SELECT id, 'ChatGPT', '基于GPT-4的对话AI助手，能够进行自然语言对话、回答问题、协助写作等任务', 'https://chat.openai.com', 'AI助手', NOW()
FROM public.companies WHERE name = 'OpenAI';

INSERT INTO public.tools (company_id, name, description, url, category, created_at) 
SELECT id, 'GPT-4', '先进的大型语言模型，具有强大的文本理解和生成能力', 'https://openai.com/gpt-4', 'AI模型', NOW()
FROM public.companies WHERE name = 'OpenAI';

INSERT INTO public.tools (company_id, name, description, url, category, created_at) 
SELECT id, 'DALL-E', 'AI图像生成工具，能够根据文本描述生成高质量图像', 'https://openai.com/dall-e-2', 'AI图像生成', NOW()
FROM public.companies WHERE name = 'OpenAI';

-- 插入Google DeepMind的工具
INSERT INTO public.tools (company_id, name, description, url, category, created_at) 
SELECT id, 'AlphaGo', '在围棋比赛中击败人类世界冠军的AI系统', 'https://deepmind.google/research/case-studies/alphago-the-story-so-far/', 'AI游戏', NOW()
FROM public.companies WHERE name = 'Google DeepMind';

INSERT INTO public.tools (company_id, name, description, url, category, created_at) 
SELECT id, 'AlphaFold', '能够预测蛋白质结构的AI系统，对生物医学研究具有重要意义', 'https://alphafold.ebi.ac.uk', '科学AI', NOW()
FROM public.companies WHERE name = 'Google DeepMind';

INSERT INTO public.tools (company_id, name, description, url, category, created_at) 
SELECT id, 'AlphaZero', '能够自学多种棋类游戏的通用AI系统', 'https://deepmind.google/research/case-studies/alphago-the-story-so-far/', 'AI游戏', NOW()
FROM public.companies WHERE name = 'Google DeepMind';

-- 插入百度AI的工具
INSERT INTO public.tools (company_id, name, description, url, category, created_at) 
SELECT id, '文心一言', '基于ERNIE技术的大语言模型，在中文理解和生成方面具有显著优势', 'https://yiyan.baidu.com', 'AI助手', NOW()
FROM public.companies WHERE name = '百度AI';

INSERT INTO public.tools (company_id, name, description, url, category, created_at) 
SELECT id, 'Apollo自动驾驶', '全球领先的自动驾驶开放平台', 'https://apollo.auto', '自动驾驶', NOW()
FROM public.companies WHERE name = '百度AI';

INSERT INTO public.tools (company_id, name, description, url, category, created_at) 
SELECT id, '百度智能云', '提供AI能力的云计算平台', 'https://cloud.baidu.com', '云计算', NOW()
FROM public.companies WHERE name = '百度AI';

-- 插入腾讯AI的工具
INSERT INTO public.tools (company_id, name, description, url, category, created_at) 
SELECT id, '腾讯元宝', '基于大语言模型的AI助手，能够进行对话、写作、编程等任务', 'https://ybao.qq.com', 'AI助手', NOW()
FROM public.companies WHERE name = '腾讯AI';

INSERT INTO public.tools (company_id, name, description, url, category, created_at) 
SELECT id, '腾讯云AI', '提供语音识别、图像识别、自然语言处理等多种AI能力', 'https://cloud.tencent.com/product/ai', '云计算', NOW()
FROM public.companies WHERE name = '腾讯AI';

INSERT INTO public.tools (company_id, name, description, url, category, created_at) 
SELECT id, '腾讯混元', '腾讯自研的大语言模型', 'https://cloud.tencent.com/product/hunyuan', 'AI模型', NOW()
FROM public.companies WHERE name = '腾讯AI';

-- 插入Anthropic的工具
INSERT INTO public.tools (company_id, name, description, url, category, created_at) 
SELECT id, 'Claude', '安全、有益的AI助手，基于Constitutional AI方法训练', 'https://claude.ai', 'AI助手', NOW()
FROM public.companies WHERE name = 'Anthropic';

INSERT INTO public.tools (company_id, name, description, url, category, created_at) 
SELECT id, 'Claude API', '为开发者提供的Claude API服务', 'https://console.anthropic.com', 'API服务', NOW()
FROM public.companies WHERE name = 'Anthropic';

-- 第四步：插入融资数据
-- 先清理现有融资数据
DELETE FROM public.fundings WHERE company_id IN (
    SELECT id FROM public.companies WHERE name IN ('OpenAI', 'Google DeepMind', '百度AI', '腾讯AI', 'Anthropic')
);

-- 插入OpenAI的融资数据
INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on, created_at) 
SELECT id, 'Series C', 10000000000, ARRAY['Microsoft', 'Khosla Ventures', 'Reid Hoffman'], '2023-01-01', NOW()
FROM public.companies WHERE name = 'OpenAI';

-- 插入Google DeepMind的融资数据（被收购）
INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on, created_at) 
SELECT id, 'Acquisition', 500000000, ARRAY['Google'], '2014-01-01', NOW()
FROM public.companies WHERE name = 'Google DeepMind';

-- 插入百度AI的融资数据（内部投资）
INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on, created_at) 
SELECT id, 'Internal Investment', 3000000000, ARRAY['百度'], '2020-01-01', NOW()
FROM public.companies WHERE name = '百度AI';

-- 插入腾讯AI的融资数据（内部投资）
INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on, created_at) 
SELECT id, 'Internal Investment', 2000000000, ARRAY['腾讯'], '2019-01-01', NOW()
FROM public.companies WHERE name = '腾讯AI';

-- 插入Anthropic的融资数据
INSERT INTO public.fundings (company_id, round, amount_usd, investors, announced_on, created_at) 
SELECT id, 'Series C', 450000000, ARRAY['Google', 'Salesforce Ventures', 'Zoom Ventures'], '2023-05-01', NOW()
FROM public.companies WHERE name = 'Anthropic';

-- 第五步：插入新闻故事
-- 先清理现有故事数据
DELETE FROM public.stories WHERE company_id IN (
    SELECT id FROM public.companies WHERE name IN ('OpenAI', 'Google DeepMind', '百度AI', '腾讯AI', 'Anthropic')
);

-- 插入OpenAI的新闻故事
INSERT INTO public.stories (company_id, title, content, source_url, published_at, created_at, category) 
SELECT id, 'OpenAI发布GPT-4，AI能力再上新台阶', 'OpenAI近日发布了其最新的大型语言模型GPT-4，该模型在多个基准测试中表现优异，展现了强大的文本理解和生成能力。GPT-4不仅在传统的语言任务上有所提升，还在数学、编程、创意写作等领域展现出令人印象深刻的能力。这一发布标志着人工智能技术发展的新里程碑，为各行各业的应用提供了更强大的AI支持。', 'https://techcrunch.com/2023/03/14/openai-gpt-4-release', '2023-03-14', NOW(), 'AI新闻'
FROM public.companies WHERE name = 'OpenAI';

-- 插入Google DeepMind的新闻故事
INSERT INTO public.stories (company_id, title, content, source_url, published_at, created_at, category) 
SELECT id, 'DeepMind AlphaFold突破蛋白质结构预测难题', 'Google DeepMind的AlphaFold系统在蛋白质结构预测方面取得了重大突破，成功预测了超过2亿个蛋白质的结构。这一成就对生物医学研究具有重要意义，为药物发现和疾病治疗提供了重要工具。AlphaFold的突破性进展展示了AI在科学发现中的巨大潜力，为生命科学研究开辟了新的道路。', 'https://www.nature.com/articles/d41586-021-02025-4', '2021-07-22', NOW(), 'AI新闻'
FROM public.companies WHERE name = 'Google DeepMind';

-- 插入百度AI的新闻故事
INSERT INTO public.stories (company_id, title, content, source_url, published_at, created_at, category) 
SELECT id, '百度文心一言正式发布，中文AI助手迎来新突破', '百度正式发布了其大语言模型产品文心一言，这是国内首个对标ChatGPT的AI助手产品。文心一言基于百度自研的ERNIE技术，在中文理解和生成方面具有显著优势，能够进行自然语言对话、文本生成、知识问答等多种任务。这一发布标志着中国在AI大模型领域的重要进展，为中文AI应用提供了强有力的支持。', 'https://36kr.com/p/2171234567890', '2023-03-16', NOW(), 'AI新闻'
FROM public.companies WHERE name = '百度AI';

-- 插入腾讯AI的新闻故事
INSERT INTO public.stories (company_id, title, content, source_url, published_at, created_at, category) 
SELECT id, '腾讯元宝AI助手上线，AI应用再添新成员', '腾讯正式发布了其AI助手产品腾讯元宝，这是基于腾讯自研大语言模型开发的智能助手。腾讯元宝能够进行对话、写作、编程等多种任务，为用户提供智能化的服务体验。这一产品的发布进一步丰富了腾讯的AI产品矩阵，展现了腾讯在人工智能领域的持续投入和创新成果。', 'https://www.geekpark.net/news/355202', '2023-04-20', NOW(), 'AI新闻'
FROM public.companies WHERE name = '腾讯AI';

-- 插入Anthropic的新闻故事
INSERT INTO public.stories (company_id, title, content, source_url, published_at, created_at, category) 
SELECT id, 'Anthropic获得4.5亿美元融资，AI安全研究获重要支持', '专注于AI安全研究的公司Anthropic宣布获得4.5亿美元的C轮融资，投资方包括Google、Salesforce Ventures等知名机构。这笔融资将用于进一步推进AI安全研究，开发更安全、有益的AI系统。Anthropic的Constitutional AI方法为AI安全研究提供了新的思路，其Claude产品在安全性和有用性方面获得了广泛认可。', 'https://techcrunch.com/2023/05/23/anthropic-funding', '2023-05-23', NOW(), 'AI新闻'
FROM public.companies WHERE name = 'Anthropic';

-- 验证更新结果
SELECT 
    c.name,
    c.description,
    c.website,
    c.founded_year,
    c.headquarters,
    c.valuation_usd,
    COUNT(DISTINCT t.id) as tools_count,
    COUNT(DISTINCT f.id) as fundings_count,
    COUNT(DISTINCT s.id) as stories_count
FROM public.companies c
LEFT JOIN public.tools t ON c.id = t.company_id
LEFT JOIN public.fundings f ON c.id = f.company_id
LEFT JOIN public.stories s ON c.id = s.company_id
WHERE c.name IN ('OpenAI', 'Google DeepMind', '百度AI', '腾讯AI', 'Anthropic')
GROUP BY c.id, c.name, c.description, c.website, c.founded_year, c.headquarters, c.valuation_usd
ORDER BY c.name;
