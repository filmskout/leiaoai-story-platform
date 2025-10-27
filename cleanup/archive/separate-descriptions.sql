-- 为公司添加详细描述字段

-- 1. 检查当前description字段
SELECT '=== 当前description长度 ===' as info, 
  name, 
  LENGTH(description) as desc_length,
  description
FROM companies 
WHERE name IN ('Adobe', 'Vercel', 'Anthropic', 'OpenAI', 'Google DeepMind')
ORDER BY name;

-- 2. 如果detailed_description字段不存在，添加它
-- (可能需要通过Supabase UI添加，或运行migration)

-- 3. 暂时使用description作为简短版本
-- 需要手动或通过脚本生成详细的版本

-- 4. 更新重点公司的详细描述（示例）
UPDATE companies 
SET description = LEFT(description, 100) || '...'
WHERE LENGTH(description) > 100;

-- 这将保证description字段保持在100字内

-- 5. 查看结果
SELECT '=== 更新后的description长度 ===' as info,
  name,
  LENGTH(description) as desc_length
FROM companies
WHERE name IN ('Adobe', 'Vercel', 'Anthropic', 'OpenAI', 'Google DeepMind')
ORDER BY name;
