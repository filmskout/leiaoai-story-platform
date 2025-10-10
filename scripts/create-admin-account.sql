-- 创建Admin账号 "LeiaoAI Agent"
-- 这个脚本需要在 Supabase SQL Editor 中执行

-- 1. 插入 Admin 用户到 auth.users 表（需要 Supabase Dashboard）
-- 注意：由于 auth.users 只能通过 Supabase Auth API 创建，这里提供参考SQL
-- 实际操作需要在 Supabase Dashboard > Authentication > Users 中手动创建
-- Email: admin@leiaoai.com
-- Password: 自行设置一个安全密码
-- 创建后获取该用户的 UUID

-- 假设创建的 Admin 用户 ID 为: '00000000-0000-0000-0000-000000000001'
-- 请在实际使用时替换为真实的 UUID

-- 2. 更新或创建 Admin 的 profile
INSERT INTO profiles (
  id,
  username,
  full_name,
  avatar_url,
  bio,
  location,
  website,
  created_at,
  updated_at
)
VALUES (
  '00000000-0000-0000-0000-000000000001', -- 替换为实际的 Admin UUID
  'leiaoai-agent',
  'LeiaoAI Agent',
  '/imgs/leiaoai-agent-avatar.png',
  'AI投融资专家，为您提供专业的商业分析和投资建议',
  'Global',
  'https://leiaoai.com',
  NOW(),
  NOW()
)
ON CONFLICT (id) 
DO UPDATE SET
  username = 'leiaoai-agent',
  full_name = 'LeiaoAI Agent',
  avatar_url = '/imgs/leiaoai-agent-avatar.png',
  bio = 'AI投融资专家，为您提供专业的商业分析和投资建议',
  location = 'Global',
  website = 'https://leiaoai.com',
  updated_at = NOW();

-- 3. 将所有现有故事的作者迁移到 Admin 账号
-- 注意：请先确认 Admin UUID 已正确创建
UPDATE stories
SET 
  author_id = '00000000-0000-0000-0000-000000000001', -- 替换为实际的 Admin UUID
  updated_at = NOW()
WHERE author_id IS NULL OR author_id != '00000000-0000-0000-0000-000000000001';

-- 4. 可选：创建 Admin 的初始统计数据
INSERT INTO user_stats (
  user_id,
  total_stories,
  total_views,
  total_likes,
  total_comments,
  created_at,
  updated_at
)
SELECT 
  '00000000-0000-0000-0000-000000000001', -- 替换为实际的 Admin UUID
  COUNT(*),
  COALESCE(SUM(views_count), 0),
  COALESCE(SUM(likes_count), 0),
  COALESCE(SUM(comment_count), 0),
  NOW(),
  NOW()
FROM stories
WHERE author_id = '00000000-0000-0000-0000-000000000001'
ON CONFLICT (user_id)
DO UPDATE SET
  total_stories = EXCLUDED.total_stories,
  total_views = EXCLUDED.total_views,
  total_likes = EXCLUDED.total_likes,
  total_comments = EXCLUDED.total_comments,
  updated_at = NOW();

-- 验证查询
SELECT 
  s.id,
  s.title,
  s.author_id,
  p.username,
  p.full_name
FROM stories s
LEFT JOIN profiles p ON s.author_id = p.id
LIMIT 10;

