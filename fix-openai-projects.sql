-- 修复OpenAI的项目数据
-- 删除重复，补齐缺失

BEGIN;

-- 1. 检查当前OpenAI的项目
SELECT '=== 当前OpenAI的项目 ===' as info, id, name, description, category
FROM projects
WHERE company_id IN (SELECT id FROM companies WHERE name = 'OpenAI')
ORDER BY name;

-- 2. 删除重复的项目（保留最早的）
-- ChatGPT和GPT-4重复，保留GPT-4，删除ChatGPT
DELETE FROM projects 
WHERE name = 'ChatGPT' 
  AND company_id IN (SELECT id FROM companies WHERE name = 'OpenAI');

-- DALL-E 3改为DALL-E（不带版本号）
UPDATE projects
SET name = 'DALL-E'
WHERE name = 'DALL-E 3'
  AND company_id IN (SELECT id FROM companies WHERE name = 'OpenAI');

-- 3. 确保所有OpenAI的关键项目存在
INSERT INTO projects (company_id, name, description, website, category)
SELECT 
  c.id,
  'GPT-4',
  'GPT-4是OpenAI的大语言模型，支持多模态输入和推理能力，广泛应用于对话、写作和知识问答。',
  'https://openai.com/gpt-4',
  'AI Model'
FROM companies c
WHERE c.name = 'OpenAI'
  AND NOT EXISTS (SELECT 1 FROM projects WHERE company_id = c.id AND name = 'GPT-4');

INSERT INTO projects (company_id, name, description, website, category)
SELECT 
  c.id,
  'DALL-E',
  'DALL-E是OpenAI的图像生成模型，可以根据文本描述生成高质量图像，支持多种艺术风格和细节调整。',
  'https://openai.com/dall-e',
  'AI Model'
FROM companies c
WHERE c.name = 'OpenAI'
  AND NOT EXISTS (SELECT 1 FROM projects WHERE company_id = c.id AND name = 'DALL-E');

INSERT INTO projects (company_id, name, description, website, category)
SELECT 
  c.id,
  'Sora',
  'Sora是OpenAI的视频生成模型，可以根据文本提示生成高质量、连贯的视频，支持复杂的场景和动作。',
  'https://openai.com/sora',
  'AI Model'
FROM companies c
WHERE c.name = 'OpenAI'
  AND NOT EXISTS (SELECT 1 FROM projects WHERE company_id = c.id AND name = 'Sora');

INSERT INTO projects (company_id, name, description, website, category)
SELECT 
  c.id,
  'Codex',
  'Codex是OpenAI的代码生成模型，专门针对编程任务，可以理解自然语言并生成代码、调试和重构。',
  'https://openai.com/codex',
  'AI Tool'
FROM companies c
WHERE c.name = 'OpenAI'
  AND NOT EXISTS (SELECT 1 FROM projects WHERE company_id = c.id AND name = 'Codex');

INSERT INTO projects (company_id, name, description, website, category)
SELECT 
  c.id,
  'Assistant API',
  'Assistant API提供AI助手功能，支持Agent和Workflow开发，可用于构建智能对话系统和自动化工作流。',
  'https://platform.openai.com/docs/assistants/overview',
  'AI Platform'
FROM companies c
WHERE c.name = 'OpenAI'
  AND NOT EXISTS (SELECT 1 FROM projects WHERE company_id = c.id AND name = 'Assistant API');

INSERT INTO projects (company_id, name, description, website, category)
SELECT 
  c.id,
  'GPT-Browser',
  'GPT-Browser是OpenAI的浏览器产品，集成AI助手功能，提供更智能的网页浏览和搜索体验。',
  'https://openai.com/browser',
  'AI Browser'
FROM companies c
WHERE c.name = 'OpenAI'
  AND NOT EXISTS (SELECT 1 FROM projects WHERE company_id = c.id AND name = 'GPT-Browser');

-- 4. 显示修复后的结果
SELECT '=== 修复后的OpenAI项目 ===' as info, id, name, description, category, website
FROM projects
WHERE company_id IN (SELECT id FROM companies WHERE name = 'OpenAI')
ORDER BY name;

COMMIT;
