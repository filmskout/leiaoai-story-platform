-- 深入诊断logo和关系问题

-- 1. 检查所有公司的logo状态（包括NULL、空字符串、Clearbit域名）
SELECT 
  name,
  logo_url,
  logo_storage_url,
  CASE 
    WHEN logo_url IS NULL THEN 'NULL'
    WHEN logo_url = '' THEN '空字符串'
    WHEN logo_url LIKE '%clearbit%' THEN 'Clearbit URL'
    WHEN logo_url LIKE '%unavatar%' THEN 'Unavatar URL'
    ELSE '其他URL'
  END as logo_status
FROM companies
WHERE name IN ('Adobe', 'Vercel', 'Codeium', 'DeepSeek', 'Lovable', 'Manus', 'Stability AI', 'OpenAI', 'Anthropic')
ORDER BY name;

-- 2. 检查是否有被错误归类为公司的项目
SELECT name, description, website, category, created_at
FROM companies
WHERE name IN ('Adobe Express', 'Adobe Firefly', 'Express', 'Firefly', 'v0', 'v0 by Vercel')
ORDER BY name;

-- 3. 检查projects表中是否已经有Adobe Express、Firefly、v0
SELECT p.name as project_name, c.name as parent_company, p.company_id
FROM projects p
JOIN companies c ON p.company_id = c.id
WHERE p.name IN ('Adobe Express', 'Adobe Firefly', 'v0', 'Express', 'Firefly')
ORDER BY c.name, p.name;

-- 4. 检查是否有重复的项目记录
SELECT p.name, COUNT(*) as count, STRING_AGG(c.name, ', ') as parent_companies
FROM projects p
JOIN companies c ON p.company_id = c.id
WHERE p.name IN ('Adobe Express', 'Adobe Firefly', 'v0')
GROUP BY p.name
HAVING COUNT(*) > 1;

-- 5. 检查是否存在Adobe和Vercel公司
SELECT id, name, website FROM companies WHERE name IN ('Adobe', 'Vercel') ORDER BY name;
