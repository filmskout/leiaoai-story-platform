-- 简化版Stories修复脚本（不使用published_at）
-- 在Supabase SQL Editor中运行

-- 步骤1: 查看当前stories状态
SELECT 
  'Current Stories Status' as step,
  status,
  is_public,
  COUNT(*) as count
FROM stories
GROUP BY status, is_public
ORDER BY count DESC;

-- 步骤2: 查看前5个stories
SELECT 
  id,
  title,
  status,
  is_public,
  author_id,
  created_at
FROM stories
ORDER BY created_at DESC
LIMIT 5;

-- 步骤3: 修复 - 将所有stories设置为published和public
-- 注意：这个脚本不依赖published_at列
UPDATE stories
SET 
  status = 'published',
  is_public = true,
  updated_at = NOW()
WHERE status IS NULL 
   OR status != 'published' 
   OR is_public IS NULL 
   OR is_public = false;

-- 步骤4: 确保所有stories都有author（使用Admin账户ID）
UPDATE stories
SET 
  author = '8e19098b-ac2a-4ae0-b063-1e21a8dea19d',
  updated_at = NOW()
WHERE author IS NULL;

-- 步骤5: 验证修复结果
SELECT 
  'After Fix - Published Stories' as step,
  COUNT(*) as published_count
FROM stories
WHERE status = 'published' AND is_public = true;

-- 步骤6: 查看修复后的stories（与profiles关联）
SELECT 
  s.id,
  s.title,
  s.status,
  s.is_public,
  s.author,
  p.full_name as author_name,
  p.username as author_username,
  s.view_count,
  s.like_count,
  s.comment_count,
  s.created_at
FROM stories s
LEFT JOIN profiles p ON s.author::uuid = p.id
WHERE s.status = 'published' AND s.is_public = true
ORDER BY s.created_at DESC
LIMIT 10;

-- 如果上面查询返回了stories，说明修复成功！
-- 现在刷新网站：
-- 主页: https://leiaoai-story-platform.vercel.app/
-- Stories页面: https://leiaoai-story-platform.vercel.app/stories

