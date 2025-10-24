-- =====================================================
-- AI公司数据更新SQL脚本
-- 用于更新5家公司的完整高质量数据
-- =====================================================

-- 1. 更新OpenAI数据
UPDATE public.companies 
SET 
  description = 'OpenAI是一家领先的人工智能研究实验室，成立于2015年，总部位于美国加利福尼亚州旧金山。公司最初以非营利组织形式创立，旨在确保人工智能（AI）的发展能够安全、广泛地造福全人类。其使命是构建安全、有益的通用人工智能（AGI），即能够执行任何智能任务的系统。OpenAI以其前沿研究闻名，涵盖自然语言处理、强化学习和生成模型等领域。2023年，公司发布了革命性的生成式AI模型GPT-4，推动了AI在内容创作、编程辅助和商业应用中的普及。OpenAI还开发了DALL-E图像生成器和ChatGPT等产品，这些工具已广泛应用于教育、医疗和娱乐行业。尽管公司后来转型为有限营利实体以吸引投资，但其核心目标仍聚焦于负责任的AI开发，积极参与全球AI安全政策讨论。OpenAI与微软等科技巨头合作，推动AI技术的民主化，同时强调伦理准则，确保技术进步与人类价值观一致。',
  website = 'https://openai.com',
  founded_year = 2015,
  headquarters = '旧金山先驱大厦 3180 18th Street, San Francisco, CA 94110, 美国',
  employee_count_range = '500-1000人',
  valuation_usd = 800000000000,
  industry_tags = ARRAY['人工智能', '机器学习', '自然语言处理', '生成式AI', '科技研究'],
  updated_at = now()
WHERE name = 'OpenAI';

-- 2. 更新Google DeepMind数据
UPDATE public.companies 
SET 
  description = 'Google DeepMind是一家位于英国伦敦的人工智能研究实验室，由Demis Hassabis、Shane Legg和Mustafa Suleyman于2010年创立，最初名为DeepMind Technologies。2014年被Google收购，2015年重组为Alphabet旗下子公司。DeepMind以"解决智能，然后用它解决一切问题"为使命，专注于开发通用人工智能（AGI）。实验室在深度学习、强化学习和神经科学交叉领域取得突破性进展，最著名的成就包括开发战胜人类世界冠军的AlphaGo、用于蛋白质结构预测的AlphaFold（彻底改变结构生物学）、以及提高能源效率的数据中心冷却系统。DeepMind的研究成果广泛应用于医疗健康（如眼部疾病检测）、气候变化、科学发现等领域，同时积极倡导AI伦理与安全研究。',
  website = 'https://deepmind.google',
  founded_year = 2010,
  headquarters = 'London, United Kingdom',
  employee_count_range = '1000-5000',
  valuation_usd = null,
  industry_tags = ARRAY['Artificial Intelligence', 'Machine Learning', 'Deep Learning', 'Research', 'Healthcare', 'Robotics', 'Neuroscience'],
  updated_at = now()
WHERE name = 'Google DeepMind';

-- 3. 更新百度AI数据
UPDATE public.companies 
SET 
  description = '百度AI是百度公司旗下的核心人工智能业务板块，致力于研发和推广前沿AI技术。作为中国AI领域的领军者，百度AI以"科技让复杂的世界更简单"为使命，依托百度在搜索、大数据和云计算方面的深厚积累，构建了完整的AI技术体系。其核心优势包括自然语言处理、知识图谱、计算机视觉和深度学习框架飞桨（PaddlePaddle）——中国首个自主研发、功能完备的产业级深度学习平台。百度AI的业务覆盖智能云、自动驾驶（Apollo）、智能语音助手（DuerOS）及AI芯片等领域，为金融、医疗、教育、交通等千行万业提供智能化解决方案。通过与生态伙伴紧密合作，百度AI持续推动技术突破与产业融合，旨在成为全球领先的人工智能平台型公司，驱动新一轮的科技革命和产业变革。',
  website = 'https://ai.baidu.com',
  founded_year = 2017,
  headquarters = '中国北京市海淀区上地十街10号百度大厦',
  employee_count_range = '10,000+',
  valuation_usd = null,
  industry_tags = ARRAY['人工智能', '深度学习', '自动驾驶', '自然语言处理', '云计算', '智能语音', '计算机视觉', '机器学习平台'],
  updated_at = now()
WHERE name = '百度AI';

-- 4. 更新腾讯AI数据
UPDATE public.companies 
SET 
  description = '腾讯AI是腾讯公司旗下专注于人工智能技术研发与应用的业务单元，依托腾讯在社交、游戏、内容等领域的海量数据与丰富场景，致力于打造领先的AI技术平台与解决方案。公司以"科技向善"为愿景，聚焦于计算机视觉、自然语言处理、语音识别、机器学习等核心领域的技术突破，并通过腾讯云、微信、QQ等产品生态向各行各业输出AI能力。其研发的AI技术已广泛应用于医疗、教育、金融、智慧城市、自动驾驶等多个行业，例如腾讯觅影在医疗影像诊断中辅助医生分析疾病，腾讯云AI为企业提供智能客服、内容审核等云服务。腾讯AI注重产学研结合，与多家高校及研究机构共建实验室，并积极推动AI伦理治理，确保技术发展的安全与可控。作为中国AI领域的重要力量，腾讯AI持续推动技术创新与产业融合，旨在通过人工智能提升社会效率与用户体验。',
  website = 'https://ai.tencent.com',
  founded_year = 2016,
  headquarters = '中国广东省深圳市南山区高新区科技中一路腾讯大厦',
  employee_count_range = '5000-10000',
  valuation_usd = 20000000000,
  industry_tags = ARRAY['人工智能', '机器学习', '云计算', '医疗AI', '自然语言处理', '计算机视觉'],
  updated_at = now()
WHERE name = '腾讯AI';

-- 5. 更新Anthropic数据
UPDATE public.companies 
SET 
  description = 'Anthropic是一家专注于人工智能安全和研究的公司，由OpenAI前研究副总裁Dario Amodei及其妹妹Daniela Amodei于2021年创立。公司总部位于美国加利福尼亚州旧金山，致力于开发可靠、可解释且符合人类价值观的AI系统。Anthropic的核心使命是确保人工智能技术能够安全地服务于社会，避免潜在风险。公司的主要研究方向包括大型语言模型的训练方法、AI对齐（确保AI系统与人类意图一致）以及AI系统的透明度。Anthropic的团队由顶尖的AI研究人员和工程师组成，他们在机器学习、自然语言处理和AI安全领域具有深厚背景。公司强调长期主义，旨在推动AI技术向更可控、更可信的方向发展。Anthropic还积极参与AI伦理和政策讨论，与学术界、产业界及政府机构合作，共同应对AI发展中的挑战。通过其创新产品如Claude，Anthropic正逐步成为AI领域的重要力量，致力于构建对社会有益的下一代人工智能。',
  website = 'https://www.anthropic.com',
  founded_year = 2021,
  headquarters = '旧金山, 加利福尼亚州, 美国',
  employee_count_range = '200-500人',
  valuation_usd = 15000000000,
  industry_tags = ARRAY['人工智能', '机器学习', 'AI安全', '自然语言处理', '科技'],
  updated_at = now()
WHERE name = 'Anthropic';

-- =====================================================
-- 验证更新结果
-- =====================================================
SELECT 
  name,
  CASE 
    WHEN description IS NOT NULL THEN '✅ 有描述'
    ELSE '❌ 无描述'
  END as description_status,
  CASE 
    WHEN website IS NOT NULL THEN '✅ 有网站'
    ELSE '❌ 无网站'
  END as website_status,
  CASE 
    WHEN founded_year IS NOT NULL THEN '✅ 有成立年份'
    ELSE '❌ 无成立年份'
  END as founded_year_status,
  CASE 
    WHEN headquarters IS NOT NULL THEN '✅ 有总部'
    ELSE '❌ 无总部'
  END as headquarters_status,
  CASE 
    WHEN valuation_usd IS NOT NULL THEN '✅ 有估值'
    ELSE '❌ 无估值'
  END as valuation_status
FROM public.companies 
WHERE name IN ('OpenAI', 'Google DeepMind', '百度AI', '腾讯AI', 'Anthropic')
ORDER BY name;
