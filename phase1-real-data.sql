-- 渐进式数据更新：先处理5家头部AI公司
-- 清空现有数据
DELETE FROM projects;
DELETE FROM companies;

-- 插入5家高质量的真实AI公司数据
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
-- 1. OpenAI
(gen_random_uuid(), 'OpenAI', '领先的AI研究公司，开发ChatGPT和GPT系列模型', 
 'OpenAI成立于2015年，是一家专注于人工智能研究的公司，致力于确保人工智能造福全人类。公司最著名的产品是ChatGPT，这是一个基于大型语言模型的对话AI系统。OpenAI还开发了GPT系列模型，包括GPT-3、GPT-4等，这些模型在自然语言处理领域取得了突破性进展。公司采用了一种独特的公司结构，既有营利性子公司，也有非营利性母公司，以平衡商业利益和社会责任。',
 'San Francisco, CA, USA', 2015, '1000-5000', 80000000000, 'https://openai.com',
 '["LLM", "AI Research", "Natural Language Processing"]', 'AI Giant', 'Tier 1', 'AI Giant', NOW(), NOW()),

-- 2. Google DeepMind
(gen_random_uuid(), 'Google DeepMind', '谷歌旗下AI研究实验室，专注于深度学习和强化学习',
 'Google DeepMind是谷歌旗下的AI研究实验室，成立于2010年，总部位于伦敦。该公司在深度学习和强化学习领域取得了重大突破，最著名的成就是开发了AlphaGo，这是第一个击败人类围棋世界冠军的AI系统。DeepMind还开发了AlphaFold，能够准确预测蛋白质结构，对生物医学研究具有重要意义。公司致力于解决科学和工程中的复杂问题，推动AI技术的发展。',
 'London, UK', 2010, '1000-5000', 50000000000, 'https://deepmind.google',
 '["Deep Learning", "Reinforcement Learning", "AI Research"]', 'AI Giant', 'Tier 1', 'AI Giant', NOW(), NOW()),

-- 3. Microsoft AI
(gen_random_uuid(), 'Microsoft AI', '微软的AI部门，开发Copilot和Azure AI服务',
 'Microsoft AI是微软公司的AI部门，致力于将人工智能技术集成到微软的各个产品和服务中。公司开发了GitHub Copilot，这是一个AI编程助手，能够帮助开发者编写代码。Microsoft还提供Azure AI服务，包括机器学习、认知服务和AI工具。公司通过投资OpenAI和开发自己的AI模型，在AI领域保持领先地位。',
 'Redmond, WA, USA', 1975, '200000+', 3000000000000, 'https://microsoft.com/ai',
 '["AI Platform", "Cloud AI", "Developer Tools"]', 'AI Giant', 'Tier 1', 'AI Giant', NOW(), NOW()),

-- 4. Anthropic
(gen_random_uuid(), 'Anthropic', 'AI安全公司，开发Claude AI助手',
 'Anthropic是一家专注于AI安全的公司，成立于2021年，由OpenAI的前研究人员创立。公司开发了Claude AI助手，这是一个安全、有用、诚实的AI系统。Anthropic专注于AI对齐研究，确保AI系统按照人类价值观行事。公司获得了亚马逊和谷歌等大型科技公司的投资，是AI安全领域的重要参与者。',
 'San Francisco, CA, USA', 2021, '500-1000', 18000000000, 'https://anthropic.com',
 '["AI Safety", "LLM", "AI Alignment", "AI Ethics"]', 'AI Unicorn', 'Tier 2', 'AI Unicorn', NOW(), NOW()),

-- 5. NVIDIA
(gen_random_uuid(), 'NVIDIA', 'GPU和AI计算领导者，提供AI硬件和软件平台',
 'NVIDIA是全球领先的GPU和AI计算公司，成立于1993年。公司不仅提供高性能的GPU硬件，还开发了CUDA编程平台和AI软件框架。NVIDIA的GPU被广泛用于机器学习训练和推理，是AI基础设施的重要组成部分。公司还开发了自动驾驶AI平台、数据中心AI解决方案和专业AI工具。',
 'Santa Clara, CA, USA', 1993, '25000+', 2000000000000, 'https://nvidia.com',
 '["AI Hardware", "GPU Computing", "CUDA", "AI Infrastructure"]', 'AI Giant', 'Tier 1', 'AI Giant', NOW(), NOW());

-- 插入对应的项目数据
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
FROM companies c WHERE c.name = 'NVIDIA';

-- 验证插入结果
SELECT 'Phase 1 Complete - 5 companies inserted:' as status;
SELECT name, headquarters, valuation_usd, company_type FROM companies ORDER BY valuation_usd DESC;

SELECT 'Projects inserted:' as status;
SELECT COUNT(*) as project_count FROM projects;

SELECT 'Sample projects:' as status;
SELECT p.name as project_name, c.name as company_name, p.category 
FROM projects p 
JOIN companies c ON p.company_id = c.id 
ORDER BY c.name;
