-- 修复OpenAI项目的命名和重复问题
-- ChatGPT包含所有GPT版本，DALL-E不带版本号，浏览器叫ChatGPT Atlas

BEGIN;

-- 1. 查看当前的OpenAI项目
SELECT '=== 当前OpenAI项目 ===' as info, id, name, description
FROM projects
WHERE company_id IN (SELECT id FROM companies WHERE name = 'OpenAI')
ORDER BY name;

-- 2. 删除重复项，统一命名
-- 删除GPT-4（应该用ChatGPT代替）
DELETE FROM projects 
WHERE name IN ('GPT-4', 'GPT-3')
  AND company_id IN (SELECT id FROM companies WHERE name = 'OpenAI');

-- 删除DALL-E的重复（保留一个）
WITH ranked AS (
  SELECT id, name, 
    ROW_NUMBER() OVER (PARTITION BY name ORDER BY created_at) as rn
  FROM projects
  WHERE name LIKE '%DALL%'
    AND company_id IN (SELECT id FROM companies WHERE name = 'OpenAI')
)
DELETE FROM projects WHERE id IN (SELECT id FROM ranked WHERE rn > 1);

-- 更新DALL-E名称（确保不带版本号）
UPDATE projects
SET name = 'DALL-E'
WHERE name LIKE '%DALL%'
  AND company_id IN (SELECT id FROM companies WHERE name = 'OpenAI');

-- 3. 确保ChatGPT存在（作为主要的对话项目）
INSERT INTO projects (company_id, name, description, website, category)
SELECT 
  c.id,
  'ChatGPT',
  'ChatGPT是OpenAI的对话式AI助手，支持多轮对话、代码编写、文档分析等多种任务，适用于GPT-3.5和GPT-4等多个版本。',
  'https://chat.openai.com',
  'AI Assistant'
FROM companies c
WHERE c.name = 'OpenAI'
  AND NOT EXISTS (SELECT 1 FROM projects WHERE company_id = c.id AND name = 'ChatGPT');

-- 4. 更新浏览器名称为ChatGPT Atlas
UPDATE projects
SET name = 'ChatGPT Atlas', 
    description = 'ChatGPT Atlas是OpenAI的AI浏览器，提供更智能的网页浏览、搜索和信息获取体验。',
    website = 'https://openai.com/browser'
WHERE name = 'GPT-Browser'
  AND company_id IN (SELECT id FROM companies WHERE name = 'OpenAI');

-- 如果没有GPT-Browser，创建ChatGPT Atlas
INSERT INTO projects (company_id, name, description, website, category)
SELECT 
  c.id,
  'ChatGPT Atlas',
  'ChatGPT Atlas是OpenAI的AI浏览器，提供更智能的网页浏览、搜索和信息获取体验。',
  'https://openai.com/browser',
  'AI Browser'
FROM companies c
WHERE c.name = 'OpenAI'
  AND NOT EXISTS (SELECT 1 FROM projects WHERE company_id = c.id AND name = 'ChatGPT Atlas');

-- 5. 更新Assistant API名称
UPDATE projects
SET name = 'ChatGPT API',
    description = 'ChatGPT API提供AI助手和Agent功能，支持自定义助手、多工具调用和工作流自动化。',
    website = 'https://platform.openai.com/docs/api-reference'
WHERE name = 'Assistant API'
  AND company_id IN (SELECT id FROM companies WHERE name = 'OpenAI');

-- 6. 显示最终结果
SELECT '=== 修复后的OpenAI项目 ===' as info, 
  id, name, description, category, website
FROM projects
WHERE company_id IN (SELECT id FROM companies WHERE name = 'OpenAI')
ORDER BY 
  CASE name
    WHEN 'ChatGPT' THEN 1
    WHEN 'DALL-E' THEN 2
    WHEN 'Sora' THEN 3
    WHEN 'ChatGPT Atlas' THEN 4
    WHEN 'ChatGPT API' THEN 5
    WHEN 'Codex' THEN 6
    ELSE 7
  END;

COMMIT;
