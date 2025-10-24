-- 清空现有数据
DELETE FROM projects;
DELETE FROM companies;

-- 插入高质量的真实AI公司数据
INSERT INTO companies (
  id,
  name,
  description,
  detailed_description,
  headquarters,
  founded_year,
  employee_count_range,
  valuation_usd,
  website,
  industry_tags,
  company_type,
  company_tier,
  company_category,
  created_at,
  updated_at
) VALUES 
-- OpenAI
(gen_random_uuid(), 'OpenAI', '领先的AI研究公司，开发ChatGPT和GPT系列模型', 
 'OpenAI成立于2015年，是一家专注于人工智能研究的公司，致力于确保人工智能造福全人类。公司最著名的产品是ChatGPT，这是一个基于大型语言模型的对话AI系统。OpenAI还开发了GPT系列模型，包括GPT-3、GPT-4等，这些模型在自然语言处理领域取得了突破性进展。公司采用了一种独特的公司结构，既有营利性子公司，也有非营利性母公司，以平衡商业利益和社会责任。',
 'San Francisco, CA, USA', 2015, '1000-5000', 80000000000, 'https://openai.com',
 '["LLM", "AI Research", "Natural Language Processing"]', 'AI Giant', 'Tier 1', 'AI Giant', NOW(), NOW()),

-- Google DeepMind
(gen_random_uuid(), 'Google DeepMind', '谷歌旗下AI研究实验室，专注于深度学习和强化学习',
 'Google DeepMind是谷歌旗下的AI研究实验室，成立于2010年，总部位于伦敦。该公司在深度学习和强化学习领域取得了重大突破，最著名的成就是开发了AlphaGo，这是第一个击败人类围棋世界冠军的AI系统。DeepMind还开发了AlphaFold，能够准确预测蛋白质结构，对生物医学研究具有重要意义。公司致力于解决科学和工程中的复杂问题，推动AI技术的发展。',
 'London, UK', 2010, '1000-5000', 50000000000, 'https://deepmind.google',
 '["Deep Learning", "Reinforcement Learning", "AI Research"]', 'AI Giant', 'Tier 1', 'AI Giant', NOW(), NOW()),

-- Microsoft AI
(gen_random_uuid(), 'Microsoft AI', '微软的AI部门，开发Copilot和Azure AI服务',
 'Microsoft AI是微软公司的AI部门，致力于将人工智能技术集成到微软的各个产品和服务中。公司开发了GitHub Copilot，这是一个AI编程助手，能够帮助开发者编写代码。Microsoft还提供Azure AI服务，包括机器学习、认知服务和AI工具。公司通过投资OpenAI和开发自己的AI模型，在AI领域保持领先地位。',
 'Redmond, WA, USA', 1975, '200000+', 3000000000000, 'https://microsoft.com/ai',
 '["AI Platform", "Cloud AI", "Developer Tools"]', 'AI Giant', 'Tier 1', 'AI Giant', NOW(), NOW()),

-- Meta AI
(gen_random_uuid(), 'Meta AI', 'Meta的AI研究部门，开发Llama和AI助手',
 'Meta AI是Meta公司（前Facebook）的AI研究部门，专注于开发先进的AI技术和产品。公司开发了Llama系列大型语言模型，这些模型在开源AI领域具有重要意义。Meta AI还致力于开发AI助手、计算机视觉技术和虚拟现实中的AI应用。公司通过开源策略推动AI技术的发展，为研究社区提供强大的工具和资源。',
 'Menlo Park, CA, USA', 2004, '80000+', 800000000000, 'https://ai.meta.com',
 '["Open Source AI", "LLM", "Computer Vision", "VR AI"]', 'AI Giant', 'Tier 1', 'AI Giant', NOW(), NOW()),

-- Anthropic
(gen_random_uuid(), 'Anthropic', 'AI安全公司，开发Claude AI助手',
 'Anthropic是一家专注于AI安全的公司，成立于2021年，由OpenAI的前研究人员创立。公司开发了Claude AI助手，这是一个安全、有用、诚实的AI系统。Anthropic专注于AI对齐研究，确保AI系统按照人类价值观行事。公司获得了亚马逊和谷歌等大型科技公司的投资，是AI安全领域的重要参与者。',
 'San Francisco, CA, USA', 2021, '500-1000', 18000000000, 'https://anthropic.com',
 '["AI Safety", "LLM", "AI Alignment", "AI Ethics"]', 'AI Unicorn', 'Tier 2', 'AI Unicorn', NOW(), NOW()),

-- NVIDIA
(gen_random_uuid(), 'NVIDIA', 'GPU和AI计算领导者，提供AI硬件和软件平台',
 'NVIDIA是全球领先的GPU和AI计算公司，成立于1993年。公司不仅提供高性能的GPU硬件，还开发了CUDA编程平台和AI软件框架。NVIDIA的GPU被广泛用于机器学习训练和推理，是AI基础设施的重要组成部分。公司还开发了自动驾驶AI平台、数据中心AI解决方案和专业AI工具。',
 'Santa Clara, CA, USA', 1993, '25000+', 2000000000000, 'https://nvidia.com',
 '["AI Hardware", "GPU Computing", "CUDA", "AI Infrastructure"]', 'AI Giant', 'Tier 1', 'AI Giant', NOW(), NOW()),

-- 百度AI
(gen_random_uuid(), '百度AI', '中国领先的AI公司，开发文心一言大模型',
 '百度是中国领先的AI公司，在人工智能领域投入巨大。公司开发了文心一言大模型，这是中国最先进的大型语言模型之一。百度在自动驾驶、语音识别、图像识别等领域都有重要突破。公司通过Apollo平台提供自动驾驶解决方案，在AI技术商业化方面处于领先地位。',
 '北京, 中国', 2000, '40000+', 50000000000, 'https://baidu.com',
 '["LLM", "Autonomous Driving", "Speech Recognition", "Computer Vision"]', 'Domestic Giant', 'Tier 1', 'Domestic Giant', NOW(), NOW()),

-- 腾讯AI
(gen_random_uuid(), '腾讯AI', '腾讯的AI部门，开发腾讯元宝和AI服务',
 '腾讯AI是腾讯公司的AI部门，致力于将人工智能技术应用到腾讯的各个业务中。公司开发了腾讯元宝AI助手，提供智能对话和内容生成服务。腾讯在游戏AI、社交AI、内容推荐等领域都有重要应用。公司通过腾讯云提供AI服务，为企业和开发者提供AI解决方案。',
 '深圳, 中国', 1998, '100000+', 400000000000, 'https://tencent.com',
 '["AI Assistant", "Game AI", "Social AI", "Cloud AI"]', 'Domestic Giant', 'Tier 1', 'Domestic Giant', NOW(), NOW()),

-- 阿里巴巴AI
(gen_random_uuid(), '阿里巴巴AI', '阿里巴巴的AI部门，开发通义千问大模型',
 '阿里巴巴AI是阿里巴巴集团的AI部门，专注于开发和应用人工智能技术。公司开发了通义千问大模型，这是阿里巴巴的旗舰AI产品。阿里巴巴在电商AI、云计算AI、金融AI等领域都有重要应用。公司通过阿里云提供AI服务，为全球企业提供AI解决方案。',
 '杭州, 中国', 1999, '250000+', 200000000000, 'https://alibaba.com',
 '["LLM", "E-commerce AI", "Cloud AI", "Financial AI"]', 'Domestic Giant', 'Tier 1', 'Domestic Giant', NOW(), NOW()),

-- 字节跳动AI
(gen_random_uuid(), '字节跳动AI', '字节跳动的AI部门，开发豆包AI助手',
 '字节跳动AI是字节跳动公司的AI部门，专注于开发AI技术和产品。公司开发了豆包AI助手，提供智能对话和内容创作服务。字节跳动在推荐算法、内容生成、视频AI等领域都有重要突破。公司通过抖音、今日头条等产品应用AI技术，为用户提供个性化体验。',
 '北京, 中国', 2012, '150000+', 300000000000, 'https://bytedance.com',
 '["AI Assistant", "Recommendation AI", "Content AI", "Video AI"]', 'Domestic Giant', 'Tier 1', 'Domestic Giant', NOW(), NOW()),

-- 商汤科技
(gen_random_uuid(), '商汤科技', '中国领先的AI视觉公司，专注于计算机视觉技术',
 '商汤科技是中国领先的AI视觉公司，成立于2014年，专注于计算机视觉和深度学习技术。公司开发了SenseCore AI平台，提供完整的AI解决方案。商汤在面部识别、图像识别、视频分析等领域都有重要应用，服务客户包括政府、企业和个人用户。',
 '上海, 中国', 2014, '5000-10000', 12000000000, 'https://sensetime.com',
 '["Computer Vision", "Face Recognition", "Image Analysis", "AI Platform"]', 'Domestic Unicorn', 'Tier 2', 'Domestic Unicorn', NOW(), NOW()),

-- 旷视科技
(gen_random_uuid(), '旷视科技', '中国AI视觉独角兽，专注于人脸识别和计算机视觉',
 '旷视科技是中国领先的AI视觉公司，成立于2011年，专注于人脸识别和计算机视觉技术。公司开发了Brain++ AI平台，提供完整的AI解决方案。旷视在安防、金融、零售等领域都有重要应用，是中国AI视觉领域的重要参与者。',
 '北京, 中国', 2011, '3000-5000', 4000000000, 'https://megvii.com',
 '["Face Recognition", "Computer Vision", "AI Platform", "Security AI"]', 'Domestic Unicorn', 'Tier 2', 'Domestic Unicorn', NOW(), NOW()),

-- Tesla AI
(gen_random_uuid(), 'Tesla AI', '特斯拉的AI部门，开发自动驾驶和机器人技术',
 'Tesla AI是特斯拉公司的AI部门，专注于开发自动驾驶和机器人技术。公司开发了FSD（完全自动驾驶）系统，这是目前最先进的自动驾驶技术之一。特斯拉还开发了Optimus机器人，展示了AI在机器人领域的应用。公司通过神经网络和机器学习技术，推动自动驾驶和AI技术的发展。',
 'Austin, TX, USA', 2003, '100000+', 800000000000, 'https://tesla.com/ai',
 '["Autonomous Driving", "Robotics", "Neural Networks", "AI Hardware"]', 'AI Giant', 'Tier 1', 'AI Giant', NOW(), NOW()),

-- Apple AI
(gen_random_uuid(), 'Apple AI', '苹果的AI部门，开发Siri和机器学习技术',
 'Apple AI是苹果公司的AI部门，专注于开发AI技术和产品。公司开发了Siri语音助手，这是最早的消费级AI助手之一。苹果在机器学习、计算机视觉、自然语言处理等领域都有重要应用。公司通过Core ML框架为开发者提供AI工具，在隐私保护方面有独特优势。',
 'Cupertino, CA, USA', 1976, '160000+', 3000000000000, 'https://apple.com/machine-learning',
 '["Voice AI", "Machine Learning", "Computer Vision", "Privacy AI"]', 'AI Giant', 'Tier 1', 'AI Giant', NOW(), NOW()),

-- Amazon AI
(gen_random_uuid(), 'Amazon AI', '亚马逊的AI部门，开发Alexa和AWS AI服务',
 'Amazon AI是亚马逊公司的AI部门，专注于开发AI技术和产品。公司开发了Alexa语音助手，这是全球最受欢迎的智能音箱助手之一。亚马逊还通过AWS提供AI服务，包括机器学习、自然语言处理、计算机视觉等服务。公司在推荐系统、物流优化等领域都有重要应用。',
 'Seattle, WA, USA', 1994, '1500000+', 1500000000000, 'https://aws.amazon.com/machine-learning',
 '["Voice AI", "Cloud AI", "Recommendation AI", "Logistics AI"]', 'AI Giant', 'Tier 1', 'AI Giant', NOW(), NOW());

-- 插入项目数据
INSERT INTO projects (
  id,
  company_id,
  name,
  description,
  category,
  website,
  pricing_model,
  launch_date,
  status,
  created_at,
  updated_at
)
SELECT 
  gen_random_uuid(),
  c.id,
  unnest(ARRAY['ChatGPT', 'GPT-4', 'DALL-E', 'Codex', 'Whisper']),
  unnest(ARRAY['ChatGPT - OpenAI的对话AI系统', 'GPT-4 - 最先进的大型语言模型', 'DALL-E - AI图像生成工具', 'Codex - AI代码生成工具', 'Whisper - AI语音识别系统']),
  'AI Platform',
  c.website,
  'Freemium',
  '2023-01-01',
  'Active',
  NOW(),
  NOW()
FROM companies c WHERE c.name = 'OpenAI'

UNION ALL

SELECT 
  gen_random_uuid(),
  c.id,
  unnest(ARRAY['AlphaGo', 'AlphaFold', 'Gemini', 'Bard', 'TensorFlow']),
  unnest(ARRAY['AlphaGo - 击败人类围棋冠军的AI', 'AlphaFold - 蛋白质结构预测AI', 'Gemini - 谷歌的多模态AI模型', 'Bard - 谷歌的对话AI助手', 'TensorFlow - 开源机器学习框架']),
  'AI Platform',
  c.website,
  'Freemium',
  '2023-01-01',
  'Active',
  NOW(),
  NOW()
FROM companies c WHERE c.name = 'Google DeepMind'

UNION ALL

SELECT 
  gen_random_uuid(),
  c.id,
  unnest(ARRAY['GitHub Copilot', 'Azure AI', 'Microsoft Copilot', 'Bing AI', 'Office AI']),
  unnest(ARRAY['GitHub Copilot - AI编程助手', 'Azure AI - 微软云AI服务', 'Microsoft Copilot - 微软AI助手', 'Bing AI - 必应搜索引擎AI', 'Office AI - Office办公套件AI功能']),
  'AI Platform',
  c.website,
  'Freemium',
  '2023-01-01',
  'Active',
  NOW(),
  NOW()
FROM companies c WHERE c.name = 'Microsoft AI'

UNION ALL

SELECT 
  gen_random_uuid(),
  c.id,
  unnest(ARRAY['Llama', 'Meta AI Assistant', 'Ray-Ban AI', 'Quest AI', 'WhatsApp AI']),
  unnest(ARRAY['Llama - Meta的开源大语言模型', 'Meta AI Assistant - Meta的AI助手', 'Ray-Ban AI - 智能眼镜AI功能', 'Quest AI - VR头显AI功能', 'WhatsApp AI - 即时通讯AI功能']),
  'AI Platform',
  c.website,
  'Freemium',
  '2023-01-01',
  'Active',
  NOW(),
  NOW()
FROM companies c WHERE c.name = 'Meta AI'

UNION ALL

SELECT 
  gen_random_uuid(),
  c.id,
  unnest(ARRAY['Claude', 'Claude API', 'Constitutional AI', 'AI Safety Research']),
  unnest(ARRAY['Claude - Anthropic的AI助手', 'Claude API - Claude的API接口', 'Constitutional AI - AI对齐研究', 'AI Safety Research - AI安全研究']),
  'AI Platform',
  c.website,
  'Freemium',
  '2023-01-01',
  'Active',
  NOW(),
  NOW()
FROM companies c WHERE c.name = 'Anthropic'

UNION ALL

SELECT 
  gen_random_uuid(),
  c.id,
  unnest(ARRAY['CUDA', 'TensorRT', 'Jetson', 'Drive', 'Omniverse']),
  unnest(ARRAY['CUDA - GPU并行计算平台', 'TensorRT - AI推理优化引擎', 'Jetson - 边缘AI计算平台', 'Drive - 自动驾驶AI平台', 'Omniverse - 3D协作平台']),
  'AI Hardware',
  c.website,
  'Freemium',
  '2023-01-01',
  'Active',
  NOW(),
  NOW()
FROM companies c WHERE c.name = 'NVIDIA'

UNION ALL

SELECT 
  gen_random_uuid(),
  c.id,
  unnest(ARRAY['文心一言', 'Apollo', '百度AI开放平台', '小度', '百度地图AI']),
  unnest(ARRAY['文心一言 - 百度的大语言模型', 'Apollo - 百度自动驾驶平台', '百度AI开放平台 - 百度AI服务', '小度 - 百度智能音箱', '百度地图AI - 地图AI功能']),
  'AI Platform',
  c.website,
  'Freemium',
  '2023-01-01',
  'Active',
  NOW(),
  NOW()
FROM companies c WHERE c.name = '百度AI'

UNION ALL

SELECT 
  gen_random_uuid(),
  c.id,
  unnest(ARRAY['腾讯元宝', '腾讯云AI', '游戏AI', '微信AI', 'QQ AI']),
  unnest(ARRAY['腾讯元宝 - 腾讯AI助手', '腾讯云AI - 腾讯云AI服务', '游戏AI - 游戏AI技术', '微信AI - 微信AI功能', 'QQ AI - QQ AI功能']),
  'AI Platform',
  c.website,
  'Freemium',
  '2023-01-01',
  'Active',
  NOW(),
  NOW()
FROM companies c WHERE c.name = '腾讯AI'

UNION ALL

SELECT 
  gen_random_uuid(),
  c.id,
  unnest(ARRAY['通义千问', '阿里云AI', '淘宝AI', '支付宝AI', '钉钉AI']),
  unnest(ARRAY['通义千问 - 阿里巴巴大语言模型', '阿里云AI - 阿里云AI服务', '淘宝AI - 电商AI功能', '支付宝AI - 金融AI功能', '钉钉AI - 办公AI功能']),
  'AI Platform',
  c.website,
  'Freemium',
  '2023-01-01',
  'Active',
  NOW(),
  NOW()
FROM companies c WHERE c.name = '阿里巴巴AI'

UNION ALL

SELECT 
  gen_random_uuid(),
  c.id,
  unnest(ARRAY['豆包', '抖音AI', '今日头条AI', 'TikTok AI', '飞书AI']),
  unnest(ARRAY['豆包 - 字节跳动AI助手', '抖音AI - 短视频AI功能', '今日头条AI - 新闻推荐AI', 'TikTok AI - 海外版抖音AI', '飞书AI - 办公协作AI']),
  'AI Platform',
  c.website,
  'Freemium',
  '2023-01-01',
  'Active',
  NOW(),
  NOW()
FROM companies c WHERE c.name = '字节跳动AI'

UNION ALL

SELECT 
  gen_random_uuid(),
  c.id,
  unnest(ARRAY['SenseCore', '人脸识别', '图像识别', '视频分析', 'AI开放平台']),
  unnest(ARRAY['SenseCore - 商汤AI平台', '人脸识别 - 面部识别技术', '图像识别 - 图像分析技术', '视频分析 - 视频内容分析', 'AI开放平台 - 商汤AI服务']),
  'Computer Vision',
  c.website,
  'Freemium',
  '2023-01-01',
  'Active',
  NOW(),
  NOW()
FROM companies c WHERE c.name = '商汤科技'

UNION ALL

SELECT 
  gen_random_uuid(),
  c.id,
  unnest(ARRAY['Brain++', '人脸识别', '计算机视觉', 'AI开放平台', '智能安防']),
  unnest(ARRAY['Brain++ - 旷视AI平台', '人脸识别 - 面部识别技术', '计算机视觉 - 视觉AI技术', 'AI开放平台 - 旷视AI服务', '智能安防 - 安防AI解决方案']),
  'Computer Vision',
  c.website,
  'Freemium',
  '2023-01-01',
  'Active',
  NOW(),
  NOW()
FROM companies c WHERE c.name = '旷视科技'

UNION ALL

SELECT 
  gen_random_uuid(),
  c.id,
  unnest(ARRAY['FSD', 'Optimus', 'Tesla Bot', 'Neural Networks', 'Dojo']),
  unnest(ARRAY['FSD - 完全自动驾驶系统', 'Optimus - 特斯拉人形机器人', 'Tesla Bot - 特斯拉机器人', 'Neural Networks - 神经网络技术', 'Dojo - AI训练超级计算机']),
  'Autonomous Driving',
  c.website,
  'Freemium',
  '2023-01-01',
  'Active',
  NOW(),
  NOW()
FROM companies c WHERE c.name = 'Tesla AI'

UNION ALL

SELECT 
  gen_random_uuid(),
  c.id,
  unnest(ARRAY['Siri', 'Core ML', 'Create ML', 'Vision Framework', 'Natural Language']),
  unnest(ARRAY['Siri - 苹果语音助手', 'Core ML - 苹果机器学习框架', 'Create ML - 苹果ML工具', 'Vision Framework - 苹果视觉框架', 'Natural Language - 苹果自然语言处理']),
  'Voice AI',
  c.website,
  'Freemium',
  '2023-01-01',
  'Active',
  NOW(),
  NOW()
FROM companies c WHERE c.name = 'Apple AI'

UNION ALL

SELECT 
  gen_random_uuid(),
  c.id,
  unnest(ARRAY['Alexa', 'AWS AI', 'SageMaker', 'Rekognition', 'Comprehend']),
  unnest(ARRAY['Alexa - 亚马逊语音助手', 'AWS AI - 亚马逊云AI服务', 'SageMaker - 机器学习平台', 'Rekognition - 图像识别服务', 'Comprehend - 自然语言处理服务']),
  'Voice AI',
  c.website,
  'Freemium',
  '2023-01-01',
  'Active',
  NOW(),
  NOW()
FROM companies c WHERE c.name = 'Amazon AI';

-- 验证插入结果
SELECT 'Companies inserted:' as status, COUNT(*) as count FROM companies;
SELECT 'Projects inserted:' as status, COUNT(*) as count FROM projects;

-- 显示一些示例数据
SELECT 'Sample companies:' as status;
SELECT name, headquarters, valuation_usd, company_type FROM companies ORDER BY valuation_usd DESC LIMIT 5;

SELECT 'Sample projects:' as status;
SELECT p.name as project_name, c.name as company_name, p.category 
FROM projects p 
JOIN companies c ON p.company_id = c.id 
ORDER BY c.name 
LIMIT 10;
