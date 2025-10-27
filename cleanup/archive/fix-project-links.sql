-- 修复 project 链接错误
-- Adobe Express 等

-- 1. 检查当前链接
SELECT '=== 当前project链接状态 ===' as info,
  p.name as project_name,
  p.website,
  c.name as company_name
FROM projects p
JOIN companies c ON p.company_id = c.id
WHERE p.name IN ('Adobe Express', 'Adobe Firefly', 'v0', 'Claude', 'Claude Code')
ORDER BY c.name, p.name;

-- 2. 修复Adobe Express链接
UPDATE projects
SET website = 'https://www.adobe.com/products/express.html'
WHERE name = 'Adobe Express'
  AND (website IS NULL OR website = '' OR website != 'https://www.adobe.com/products/express.html');

-- 3. 确保Adobe Firefly链接正确
UPDATE projects
SET website = 'https://www.adobe.com/firefly'
WHERE name = 'Adobe Firefly'
  AND (website IS NULL OR website = '' OR website != 'https://www.adobe.com/firefly');

-- 4. 确保v0链接正确
UPDATE projects
SET website = 'https://v0.dev'
WHERE name = 'v0'
  AND (website IS NULL OR website = '' OR website != 'https://v0.dev');

-- 5. 为Anthropic添加Claude和Claude Code projects
INSERT INTO projects (company_id, name, description, website, category)
SELECT 
  c.id,
  'Claude',
  'Claude是Anthropic开发的AI助手，支持对话、代码分析和文档处理，注重安全性和有用性。',
  'https://claude.ai',
  'AI Assistant'
FROM companies c
WHERE c.name = 'Anthropic'
  AND NOT EXISTS (
    SELECT 1 FROM projects WHERE company_id = c.id AND name = 'Claude'
  );

INSERT INTO projects (company_id, name, description, website, category)
SELECT 
  c.id,
  'Claude Code',
  'Claude Code是专为编程任务优化的AI助手，支持代码生成、调试、重构和文档编写。',
  'https://claude.ai',
  'AI Tool'
FROM companies c
WHERE c.name = 'Anthropic'
  AND NOT EXISTS (
    SELECT 1 FROM projects WHERE company_id = c.id AND name = 'Claude Code'
  );

-- 6. 显示修复结果
SELECT '=== 修复后的project链接 ===' as info,
  p.name as project_name,
  p.website,
  c.name as company_name
FROM projects p
JOIN companies c ON p.company_id = c.id
WHERE p.name IN ('Adobe Express', 'Adobe Firefly', 'v0', 'Claude', 'Claude Code')
ORDER BY c.name, p.name;
