-- 简单的修复脚本 - 使用直接的SQL语句
-- 先运行诊断脚本查看结果，然后根据结果修改这里的ID

-- 步骤1: 创建临时变量存储正确的公司ID
-- 假设这里是你从诊断脚本中获得的真实ID
-- 你需要先运行 diagnose-v0-adobe-direct.sql 获取这些ID

-- 示例：假设从诊断脚本得到：
-- Adobe ID: 假设是 'abc-123-def'
-- Vercel ID: 假设是 'def-456-ghi'

-- 步骤2: 手动插入正确的项目（根据实际ID修改）
-- 注意：你需要先运行诊断脚本获取实际的company ID，然后替换下面的'YOUR_ADOBE_ID'和'YOUR_VERCEL_ID'

-- 修复Adobe Express
INSERT INTO projects (company_id, name, description, website, category)
SELECT id, 'Adobe Express', 'Adobe Express是一款面向社交媒体和营销内容的在线创作工具', 'https://www.adobe.com/products/express.html', 'AI Application'
FROM companies 
WHERE name = 'Adobe'
ON CONFLICT (company_id, name) DO NOTHING;

-- 修复Adobe Firefly
INSERT INTO projects (company_id, name, description, website, category)
SELECT id, 'Adobe Firefly', 'Adobe Firefly是Adobe的生成式AI图像工具', 'https://www.adobe.com/firefly', 'AI Model'
FROM companies 
WHERE name = 'Adobe'
ON CONFLICT (company_id, name) DO NOTHING;

-- 修复v0
INSERT INTO projects (company_id, name, description, website, category)
SELECT id, 'v0', 'v0是Vercel的AI代码生成工具', 'https://v0.dev', 'AI Tool'
FROM companies 
WHERE name = 'Vercel'
ON CONFLICT (company_id, name) DO NOTHING;

-- 步骤3: 删除错误的公司（谨慎操作）
-- 注意：这会删除fundings和stories的关联数据
-- 只有在确认后才可以执行
/*
-- 取消注释下面的语句来执行删除
DELETE FROM companies WHERE name IN ('Adobe Express', 'Express', 'Adobe Firefly', 'Firefly') AND id NOT IN (SELECT id FROM companies WHERE name = 'Adobe');
DELETE FROM companies WHERE (name = 'v0' OR name LIKE '%v0%') AND id NOT IN (SELECT id FROM companies WHERE name = 'Vercel');
*/

-- 步骤4: 显示修复结果
SELECT 'Adobe的项目:' as info, p.name
FROM projects p
JOIN companies c ON p.company_id = c.id
WHERE c.name = 'Adobe'
ORDER BY p.name;

SELECT 'Vercel的项目:' as info, p.name
FROM projects p
JOIN companies c ON p.company_id = c.id
WHERE c.name = 'Vercel'
ORDER BY p.name;
