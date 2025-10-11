-- 检查用户登录状态的SQL查询
-- 在Supabase SQL Editor中运行

-- ═══════════════════════════════════════════════════════════════
-- 方法1: 检查当前auth用户 (最推荐)
-- ═══════════════════════════════════════════════════════════════
SELECT 
  auth.uid() as user_id,
  CASE 
    WHEN auth.uid() IS NOT NULL THEN '✅ SQL Editor中已登录'
    ELSE '❌ SQL Editor中未登录 (这是正常的！)'
  END as sql_editor_status;

-- 注意: 在SQL Editor中auth.uid()通常返回NULL，这是正常的！
-- SQL Editor和前端应用使用不同的认证会话

-- ═══════════════════════════════════════════════════════════════
-- 方法2: 查看auth.users表 (检查是否有注册用户)
-- ═══════════════════════════════════════════════════════════════
SELECT 
  id,
  email,
  created_at,
  last_sign_in_at,
  email_confirmed_at IS NOT NULL as email_verified
FROM auth.users
ORDER BY created_at DESC
LIMIT 5;

-- 如果这个查询返回数据，说明有注册用户

-- ═══════════════════════════════════════════════════════════════
-- 方法3: 检查最近的登录活动
-- ═══════════════════════════════════════════════════════════════
SELECT 
  COUNT(*) as total_users,
  COUNT(CASE WHEN last_sign_in_at > NOW() - INTERVAL '1 day' THEN 1 END) as active_last_24h,
  COUNT(CASE WHEN last_sign_in_at > NOW() - INTERVAL '7 days' THEN 1 END) as active_last_7days
FROM auth.users;

-- ═══════════════════════════════════════════════════════════════
-- 总结
-- ═══════════════════════════════════════════════════════════════
/*
⚠️  重要说明:

1. SQL Editor中的auth.uid()通常返回NULL
   - 这是正常的！
   - SQL Editor使用的是管理员权限，不是用户登录
   
2. 真正的用户登录需要在前端应用中完成
   - 访问 https://leiaoai-story-platform.vercel.app
   - 点击"登录"或"注册"
   - 使用邮箱+密码登录

3. 检查前端登录状态的方法见下面的说明
*/

