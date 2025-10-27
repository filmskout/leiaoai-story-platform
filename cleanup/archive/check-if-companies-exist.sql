-- 最小化测试：先检查数据库中是否有这些公司

-- 检查所有公司
SELECT id, name, logo_url, logo_storage_url, category, is_overseas
FROM companies
WHERE name IN (
  'Adobe', 'Vercel', 'Codeium', 'DeepSeek', 'Lovable', 'Manus', 
  'Stability AI', 'OpenAI', 'Anthropic',
  'Adobe Express', 'Adobe Firefly', 'Firefly', 'Express',
  'v0', 'v0 by Vercel'
)
ORDER BY name;

-- 检查projects表
SELECT p.id, p.name as project_name, c.name as company_name, p.company_id
FROM projects p
LEFT JOIN companies c ON p.company_id = c.id
WHERE p.name IN ('Adobe Express', 'Adobe Firefly', 'v0', 'Express', 'Firefly')
ORDER BY c.name, p.name;

-- 如果上面的查询结果为空，说明这些公司根本不存在
SELECT 'Companies table count:' as info, COUNT(*) as total_companies FROM companies;
SELECT 'Projects table count:' as info, COUNT(*) as total_projects FROM projects;
