-- 检查和修复Stories数据库问题
-- 运行此脚本在Supabase SQL Editor

-- 1. 检查当前stories状态
SELECT 
  'Total Stories' as info,
  COUNT(*) as count
FROM stories;

SELECT 
  'Stories by Status and Visibility' as info,
  status,
  is_public,
  COUNT(*) as count
FROM stories
GROUP BY status, is_public;

-- 2. 检查是否有author为NULL的stories
SELECT 
  'Stories with NULL author' as info,
  COUNT(*) as count
FROM stories
WHERE author IS NULL;

-- 3. 查看前5个stories的详细信息
SELECT 
  id,
  title,
  status,
  is_public,
  author,
  created_at
FROM stories
ORDER BY created_at DESC
LIMIT 5;

-- 4. 检查author是否指向有效的profiles
SELECT 
  s.id,
  s.title,
  s.status,
  s.is_public,
  s.author,
  p.full_name,
  p.username
FROM stories s
LEFT JOIN profiles p ON s.author::uuid = p.id
ORDER BY s.created_at DESC
LIMIT 5;

-- 5. 如果所有stories的status都不是'published'或is_public不是true，则修复
-- 注意：只有在确认需要修复时才运行下面的UPDATE语句

-- 将所有现有stories设置为published和public（如果它们状态不对）
UPDATE stories
SET 
  status = 'published',
  is_public = true,
  updated_at = NOW()
WHERE status != 'published' OR is_public != true;

-- 6. 确保所有stories都有author（设置为Admin用户）
UPDATE stories
SET author = '8e19098b-ac2a-4ae0-b063-1e21a8dea19d'
WHERE author IS NULL;

-- 7. 验证修复结果
SELECT 
  'After Fix - Published and Public Stories' as info,
  COUNT(*) as count
FROM stories
WHERE status = 'published' AND is_public = true;

-- 8. 查看修复后的stories
SELECT 
  s.id,
  s.title,
  s.status,
  s.is_public,
  s.author,
  p.full_name as author_name,
  s.created_at,
  s.updated_at
FROM stories s
LEFT JOIN profiles p ON s.author::uuid = p.id
WHERE s.status = 'published' AND s.is_public = true
ORDER BY s.created_at DESC
LIMIT 10;

