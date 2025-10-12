-- ========================================
-- 诊断Stories不显示的问题
-- ========================================

-- 1. 检查stories表是否有数据
SELECT 'Total stories in database' as check_point, COUNT(*) as count FROM stories;

-- 2. 检查stories的状态分布
SELECT 
  'Stories by status' as check_point,
  status,
  is_public,
  COUNT(*) as count
FROM stories
GROUP BY status, is_public;

-- 3. 查看实际的stories数据（前5个）
SELECT 
  'Sample stories data' as check_point,
  id,
  title,
  status,
  is_public,
  author,
  created_at
FROM stories
ORDER BY created_at DESC
LIMIT 5;

-- 4. 检查author字段是否为NULL
SELECT 
  'Stories with NULL author' as check_point,
  COUNT(*) as count
FROM stories
WHERE author IS NULL;

-- 5. 检查符合前端查询条件的stories
SELECT 
  'Stories that SHOULD show on frontend' as check_point,
  COUNT(*) as count
FROM stories
WHERE status = 'published' AND is_public = true;

-- 6. 如果上面显示0，说明需要修复，运行以下UPDATE
-- 如果上面显示>0但前端还是不显示，那是前端代码问题

-- ========================================
-- 如果第5步显示0，请运行以下修复：
-- ========================================

/*
UPDATE stories
SET 
  status = 'published',
  is_public = true,
  updated_at = NOW()
WHERE status IS NULL OR status != 'published' OR is_public IS NULL OR is_public = false;

UPDATE stories
SET 
  author = '8e19098b-ac2a-4ae0-b063-1e21a8dea19d',
  updated_at = NOW()
WHERE author IS NULL;
*/

