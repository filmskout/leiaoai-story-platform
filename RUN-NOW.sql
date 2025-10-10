-- ========================================
-- 立即运行此SQL修复Stories显示问题
-- 在Supabase SQL Editor中执行
-- ========================================

-- 步骤1: 检查当前状态
SELECT 
  '当前Stories状态' as info,
  status,
  is_public,
  COUNT(*) as count
FROM stories
GROUP BY status, is_public;

-- 步骤2: 修复 - 设置所有stories为published和public
UPDATE stories
SET 
  status = 'published',
  is_public = true,
  updated_at = NOW()
WHERE status IS NULL 
   OR status != 'published' 
   OR is_public IS NULL 
   OR is_public = false;

-- 步骤3: 确保所有stories有author
UPDATE stories
SET 
  author = '8e19098b-ac2a-4ae0-b063-1e21a8dea19d',
  updated_at = NOW()
WHERE author IS NULL;

-- 步骤4: 验证修复结果
SELECT 
  '✅ 修复完成 - Published Stories' as info,
  COUNT(*) as published_count
FROM stories
WHERE status = 'published' AND is_public = true;

-- 步骤5: 查看修复后的stories（前10个）
SELECT 
  s.id,
  s.title,
  s.status,
  s.is_public,
  s.author,
  p.full_name as author_name,
  s.view_count,
  s.like_count,
  s.comment_count,
  s.created_at
FROM stories s
LEFT JOIN profiles p ON s.author::uuid = p.id
WHERE s.status = 'published' AND s.is_public = true
ORDER BY s.created_at DESC
LIMIT 10;

-- ========================================
-- 运行完成后，刷新以下页面验证：
-- 主页: https://leiaoai-story-platform.vercel.app/
-- Stories页面: https://leiaoai-story-platform.vercel.app/stories
-- ========================================

