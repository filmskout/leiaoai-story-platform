-- 检查当前Logo状态和公司-项目关系
-- 1. 检查Logo
SELECT 
  name, 
  logo_url, 
  logo_storage_url,
  CASE 
    WHEN logo_url IS NOT NULL AND logo_url != '' THEN '✅有Logo'
    ELSE '❌无Logo'
  END as logo_status
FROM companies 
WHERE name IN ('Adobe', 'Vercel', 'Anthropic', 'Codeium', 'DeepSeek', 'Lovable', 'Manus', 'Stability AI', 'OpenAI')
ORDER BY name;

-- 2. 检查Adobe Express和Firefly
SELECT 
  p.id,
  p.name as project_name,
  c.name as company_name,
  p.company_id
FROM projects p
JOIN companies c ON p.company_id = c.id
WHERE p.name IN ('Adobe Express', 'Adobe Firefly', 'v0')
ORDER BY c.name, p.name;

-- 3. 检查v0和Vercel的关系
SELECT 
  c.name as company_name,
  p.name as project_name,
  p.company_id
FROM companies c
LEFT JOIN projects p ON c.id = p.company_id
WHERE c.name = 'Vercel' OR p.name = 'v0'
ORDER BY c.name;
