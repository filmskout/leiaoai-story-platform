-- 为国内AI大厂补齐项目
-- 百度、阿里巴巴、腾讯、字节跳动等

BEGIN;

-- =========================================
-- 百度 AI
-- =========================================
INSERT INTO projects (company_id, name, description, website, category)
SELECT 
  c.id,
  '文心一言',
  '文心一言是百度的对话式AI助手，支持对话、创作、问答、代码生成等多种能力，基于百度大语言模型。',
  'https://yiyan.baidu.com',
  'AI Assistant'
FROM companies c
WHERE c.name = '百度 AI'
  AND NOT EXISTS (SELECT 1 FROM projects WHERE company_id = c.id AND name = '文心一言');

INSERT INTO projects (company_id, name, description, website, category)
SELECT 
  c.id,
  '百度智能云AI',
  '百度智能云AI提供企业级AI服务，包括视觉识别、语音识别、自然语言处理等能力。',
  'https://cloud.baidu.com/ai',
  'AI Platform'
FROM companies c
WHERE c.name = '百度 AI'
  AND NOT EXISTS (SELECT 1 FROM projects WHERE company_id = c.id AND name = '百度智能云AI');

-- =========================================
-- 阿里巴巴 AI
-- =========================================
INSERT INTO projects (company_id, name, description, website, category)
SELECT 
  c.id,
  '通义千问',
  '通义千问是阿里巴巴的大语言模型，支持对话、创作、代码生成等多模态能力，应用于阿里云生态。',
  'https://tongyi.aliyun.com',
  'AI Model'
FROM companies c
WHERE c.name = '阿里巴巴 AI'
  AND NOT EXISTS (SELECT 1 FROM projects WHERE company_id = c.id AND name = '通义千问');

INSERT INTO projects (company_id, name, description, website, category)
SELECT 
  c.id,
  '阿里云AI',
  '阿里云AI提供企业级AI服务，包括机器学习平台、视觉识别、语音识别和自然语言处理。',
  'https://www.alibabacloud.com/product/ai',
  'AI Platform'
FROM companies c
WHERE c.name = '阿里巴巴 AI'
  AND NOT EXISTS (SELECT 1 FROM projects WHERE company_id = c.id AND name = '阿里云AI');

-- =========================================
-- 腾讯 AI
-- =========================================
INSERT INTO projects (company_id, name, description, website, category)
SELECT 
  c.id,
  '混元',
  '混元是腾讯的大语言模型，应用于腾讯生态，包括微信、QQ、游戏等场景的AI能力。',
  'https://cloud.tencent.com/product/hunyuan',
  'AI Model'
FROM companies c
WHERE c.name = '腾讯 AI'
  AND NOT EXISTS (SELECT 1 FROM projects WHERE company_id = c.id AND name = '混元');

INSERT INTO projects (company_id, name, description, website, category)
SELECT 
  c.id,
  '腾讯元宝',
  '腾讯元宝是腾讯的AI助手，提供对话、创作、问答等功能，集成到腾讯产品生态中。',
  'https://ybb.tencent.com',
  'AI Assistant'
FROM companies c
WHERE c.name = '腾讯 AI'
  AND NOT EXISTS (SELECT 1 FROM projects WHERE company_id = c.id AND name = '腾讯元宝');

INSERT INTO projects (company_id, name, description, website, category)
SELECT 
  c.id,
  'Code Buddy',
  'Code Buddy是腾讯的AI编程助手，支持代码生成、调试、重构和文档生成，适用于多编程语言。',
  'https://dev.tencent.com',
  'AI Tool'
FROM companies c
WHERE c.name = '腾讯 AI'
  AND NOT EXISTS (SELECT 1 FROM projects WHERE company_id = c.id AND name = 'Code Buddy');

INSERT INTO projects (company_id, name, description, website, category)
SELECT 
  c.id,
  '腾讯云AI',
  '腾讯云AI提供企业级AI服务，包括机器学习、计算机视觉、语音识别和自然语言处理能力。',
  'https://cloud.tencent.com/product/ai',
  'AI Platform'
FROM companies c
WHERE c.name = '腾讯 AI'
  AND NOT EXISTS (SELECT 1 FROM projects WHERE company_id = c.id AND name = '腾讯云AI');

-- =========================================
-- 字节跳动 AI
-- =========================================
INSERT INTO projects (company_id, name, description, website, category)
SELECT 
  c.id,
  '豆包',
  '豆包是字节跳动的大语言模型，集成到抖音、今日头条等产品中，支持对话、创作、推荐等功能。',
  'https://www.doubao.com',
  'AI Model'
FROM companies c
WHERE c.name = '字节跳动 AI'
  AND NOT EXISTS (SELECT 1 FROM projects WHERE company_id = c.id AND name = '豆包');

INSERT INTO projects (company_id, name, description, website, category)
SELECT 
  c.id,
  'Trae',
  'Trae是字节跳动的AI创作工具，提供代码生成、文档编辑和创意内容创作能力。',
  'https://trae.byteplus.com',
  'AI Tool'
FROM companies c
WHERE c.name = '字节跳动 AI'
  AND NOT EXISTS (SELECT 1 FROM projects WHERE company_id = c.id AND name = 'Trae');

INSERT INTO projects (company_id, name, description, website, category)
SELECT 
  c.id,
  'Trae Solo',
  'Trae Solo是Trae的单机版本，提供离线AI创作能力，适用于个人用户和小型团队。',
  'https://trae.byteplus.com/solo',
  'AI Tool'
FROM companies c
WHERE c.name = '字节跳动 AI'
  AND NOT EXISTS (SELECT 1 FROM projects WHERE company_id = c.id AND name = 'Trae Solo');

INSERT INTO projects (company_id, name, description, website, category)
SELECT 
  c.id,
  '火山引擎AI',
  '火山引擎AI提供企业级AI服务，包括机器学习平台、视觉识别、语音识别和推荐算法。',
  'https://www.volcengine.com/product/MLaaS',
  'AI Platform'
FROM companies c
WHERE c.name = '字节跳动 AI'
  AND NOT EXISTS (SELECT 1 FROM projects WHERE company_id = c.id AND name = '火山引擎AI');

-- =========================================
-- 科大讯飞 AI
-- =========================================
INSERT INTO projects (company_id, name, description, website, category)
SELECT 
  c.id,
  '星火认知大模型',
  '星火认知大模型是科大讯飞的大语言模型，专注于语音识别、语音合成和认知理解能力。',
  'https://www.iflytek.com',
  'AI Model'
FROM companies c
WHERE c.name = '科大讯飞 AI'
  AND NOT EXISTS (SELECT 1 FROM projects WHERE company_id = c.id AND name = '星火认知大模型');

-- =========================================
-- 商汤科技
-- =========================================
INSERT INTO projects (company_id, name, description, website, category)
SELECT 
  c.id,
  'SenseCore',
  'SenseCore是商汤的AI基础设施，提供视觉、语音、NLP等多模态AI能力，应用于智慧城市和自动驾驶。',
  'https://www.sensetime.com',
  'AI Platform'
FROM companies c
WHERE c.name = '商汤科技'
  AND NOT EXISTS (SELECT 1 FROM projects WHERE company_id = c.id AND name = 'SenseCore');

-- 显示结果
SELECT '=== 各公司的项目 ===' as info, c.name as company, p.name as project, p.category
FROM projects p
JOIN companies c ON p.company_id = c.id
WHERE c.name IN ('百度 AI', '阿里巴巴 AI', '腾讯 AI', '字节跳动 AI', '科大讯飞 AI', '商汤科技')
ORDER BY c.name, p.name;

COMMIT;
