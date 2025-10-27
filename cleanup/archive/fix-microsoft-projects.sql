-- 修复Microsoft的重复项目并补齐Power BI

BEGIN;

-- 1. 检查当前的Microsoft项目
SELECT '=== 当前Microsoft项目 ===' as info, id, name, description, category
FROM projects
WHERE company_id IN (SELECT id FROM companies WHERE name = 'Microsoft AI')
ORDER BY name;

-- 2. 删除重复的Copilot和Azure AI（保留最早的）
DELETE FROM projects 
WHERE id IN (
  SELECT id FROM (
    SELECT id, name,
      ROW_NUMBER() OVER (PARTITION BY name ORDER BY created_at) as rn
    FROM projects
    WHERE name IN ('GitHub Copilot', 'Microsoft Copilot', 'Azure AI', 'AI Platform')
      AND company_id IN (SELECT id FROM companies WHERE name = 'Microsoft AI')
  ) ranked
  WHERE rn > 1
);

-- 3. 确保只有一个Copilot项目（统称为Microsoft Copilot）
-- 如果存在GitHub Copilot，保留它但更新描述
UPDATE projects
SET description = 'Microsoft Copilot是跨平台AI助手，集成到Windows、Office、Edge等产品中，也可独立使用，包括GitHub Copilot编程版本。',
    website = 'https://www.microsoft.com/microsoft-copilot'
WHERE name = 'GitHub Copilot'
  AND company_id IN (SELECT id FROM companies WHERE name = 'Microsoft AI')
  AND description NOT LIKE '%Microsoft%';

-- 如果存在Microsoft Copilot，合并内容
UPDATE projects
SET description = 'Microsoft Copilot是跨平台AI助手，集成到Windows、Office、Edge等产品中，也可独立使用，包括GitHub Copilot编程版本。'
WHERE name = 'Microsoft Copilot'
  AND company_id IN (SELECT id FROM companies WHERE name = 'Microsoft AI');

-- 4. 补齐Power BI
INSERT INTO projects (company_id, name, description, website, category)
SELECT 
  c.id,
  'Power BI',
  'Power BI是Microsoft的商业智能和数据可视化平台，集成了AI驱动的数据分析和智能洞察功能。',
  'https://powerbi.microsoft.com',
  'BI Platform'
FROM companies c
WHERE c.name = 'Microsoft AI'
  AND NOT EXISTS (SELECT 1 FROM projects WHERE company_id = c.id AND name = 'Power BI');

-- 5. 确保Azure AI存在且描述正确
INSERT INTO projects (company_id, name, description, website, category)
SELECT 
  c.id,
  'Azure AI',
  'Azure AI是Microsoft的云AI平台，提供机器学习、认知服务和端到端AI解决方案，支持企业AI应用开发。',
  'https://azure.microsoft.com/ai',
  'AI Platform'
FROM companies c
WHERE c.name = 'Microsoft AI'
  AND NOT EXISTS (SELECT 1 FROM projects WHERE company_id = c.id AND name = 'Azure AI');

-- 6. 显示修复后的结果
SELECT '=== 修复后的Microsoft项目 ===' as info, 
  id, name, description, category, website
FROM projects
WHERE company_id IN (SELECT id FROM companies WHERE name = 'Microsoft AI')
ORDER BY 
  CASE name
    WHEN 'Microsoft Copilot' THEN 1
    WHEN 'GitHub Copilot' THEN 2
    WHEN 'Azure AI' THEN 3
    WHEN 'Power BI' THEN 4
    ELSE 5
  END;

COMMIT;
