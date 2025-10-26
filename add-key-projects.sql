-- 为其他重点公司补齐项目
-- Anthropic, Google, Microsoft, Meta等

BEGIN;

-- =========================================
-- Anthropic - Claude系列
-- =========================================
INSERT INTO projects (company_id, name, description, website, category)
SELECT 
  c.id,
  'Claude',
  'Claude是Anthropic的AI助手，具有强大的理解能力和安全性，支持长文本处理和多轮对话。',
  'https://claude.ai',
  'AI Assistant'
FROM companies c
WHERE c.name = 'Anthropic'
  AND NOT EXISTS (SELECT 1 FROM projects WHERE company_id = c.id AND name = 'Claude');

INSERT INTO projects (company_id, name, description, website, category)
SELECT 
  c.id,
  'Claude Code',
  'Claude Code专为编程任务优化，支持代码生成、调试、重构和文档编写，具有出色的代码理解能力。',
  'https://claude.ai',
  'AI Tool'
FROM companies c
WHERE c.name = 'Anthropic'
  AND NOT EXISTS (SELECT 1 FROM projects WHERE company_id = c.id AND name = 'Claude Code');

-- =========================================
-- Google - Gemini系列
-- =========================================
INSERT INTO projects (company_id, name, description, website, category)
SELECT 
  c.id,
  'Gemini',
  'Gemini是Google的大语言模型，支持多模态输入和推理，集成到Google搜索、邮箱和文档服务中。',
  'https://deepmind.google/technologies/gemini/',
  'AI Model'
FROM companies c
WHERE c.name = 'Google DeepMind'
  AND NOT EXISTS (SELECT 1 FROM projects WHERE company_id = c.id AND name = 'Gemini');

INSERT INTO projects (company_id, name, description, website, category)
SELECT 
  c.id,
  'Bard',
  'Bard是Google的AI对话助手，基于Gemini模型，提供搜索、写作和知识问答功能。',
  'https://bard.google.com',
  'AI Assistant'
FROM companies c
WHERE c.name = 'Google DeepMind'
  AND NOT EXISTS (SELECT 1 FROM projects WHERE company_id = c.id AND name = 'Bard');

-- =========================================
-- Microsoft - Copilot系列
-- =========================================
INSERT INTO projects (company_id, name, description, website, category)
SELECT 
  c.id,
  'GitHub Copilot',
  'GitHub Copilot是AI编程助手，可以在IDE中自动生成代码、提供建议和帮助调试，支持多种编程语言。',
  'https://github.com/features/copilot',
  'AI Tool'
FROM companies c
WHERE c.name = 'Microsoft AI'
  AND NOT EXISTS (SELECT 1 FROM projects WHERE company_id = c.id AND name = 'GitHub Copilot');

INSERT INTO projects (company_id, name, description, website, category)
SELECT 
  c.id,
  'Microsoft Copilot',
  'Microsoft Copilot集成到Office、Windows和Edge中，提供AI写作、翻译、总结和创意生成功能。',
  'https://www.microsoft.com/microsoft-copilot',
  'AI Assistant'
FROM companies c
WHERE c.name = 'Microsoft AI'
  AND NOT EXISTS (SELECT 1 FROM projects WHERE company_id = c.id AND name = 'Microsoft Copilot');

-- =========================================
-- Meta - Llama系列
-- =========================================
INSERT INTO projects (company_id, name, description, website, category)
SELECT 
  c.id,
  'Llama',
  'Llama是Meta的开源大语言模型系列，包括Llama 2和Llama 3，支持文本生成、对话和多种下游任务。',
  'https://llama.meta.com',
  'AI Model'
FROM companies c
WHERE c.name = 'Meta AI'
  AND NOT EXISTS (SELECT 1 FROM projects WHERE company_id = c.id AND name = 'Llama');

INSERT INTO projects (company_id, name, description, website, category)
SELECT 
  c.id,
  'Reels AI',
  'Reels AI是Meta的内容推荐系统，基于机器学习为用户推荐短视频内容，优化用户参与度。',
  'https://ai.meta.com',
  'AI Platform'
FROM companies c
WHERE c.name = 'Meta AI'
  AND NOT EXISTS (SELECT 1 FROM projects WHERE company_id = c.id AND name = 'Reels AI');

-- =========================================
-- Amazon - Alexa系列
-- =========================================
INSERT INTO projects (company_id, name, description, website, category)
SELECT 
  c.id,
  'Alexa',
  'Alexa是Amazon的语音助手，集成到智能音箱、手机和汽车中，支持语音控制、信息查询和智能家居控制。',
  'https://developer.amazon.com/alexa',
  'AI Assistant'
FROM companies c
WHERE c.name = 'Amazon AI'
  AND NOT EXISTS (SELECT 1 FROM projects WHERE company_id = c.id AND name = 'Alexa');

INSERT INTO projects (company_id, name, description, website, category)
SELECT 
  c.id,
  'SageMaker',
  'Amazon SageMaker是机器学习平台，提供模型训练、部署和监控工具，支持端到端的ML工作流。',
  'https://aws.amazon.com/sagemaker',
  'AI Platform'
FROM companies c
WHERE c.name = 'Amazon AI'
  AND NOT EXISTS (SELECT 1 FROM projects WHERE company_id = c.id AND name = 'SageMaker');

-- 显示结果
SELECT '=== 各公司的项目 ===' as info, c.name as company, p.name as project, p.category
FROM projects p
JOIN companies c ON p.company_id = c.id
WHERE c.name IN ('Anthropic', 'Google DeepMind', 'Microsoft AI', 'Meta AI', 'Amazon AI', 'OpenAI')
ORDER BY c.name, p.name;

COMMIT;
