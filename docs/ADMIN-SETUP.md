# LeiaoAI Agent Admin 账号设置指南

本文档说明如何创建和配置 "LeiaoAI Agent" Admin 账号，并将现有故事迁移到该账号下。

## 目标

1. 创建一个私密的 Admin 账号 "LeiaoAI Agent"
2. 将所有现有故事的作者显示统一为该账号
3. 该账号可以访问 Dashboard、Settings/Edit Profile 页面
4. 支持头像上传与 AI 生成功能

## 步骤一：在 Supabase 创建 Admin 用户

### 1.1 通过 Supabase Dashboard 创建用户

1. 登录 Supabase Dashboard
2. 进入项目 > Authentication > Users
3. 点击 "Add user" > "Create new user"
4. 填写信息：
   ```
   Email: admin@leiaoai.com
   Password: [设置一个强密码，妥善保管]
   Auto Confirm User: ✅ (勾选)
   ```
5. 点击 "Create user"
6. **复制生成的 User UUID**（格式如：`a1b2c3d4-e5f6-7890-abcd-ef1234567890`）

### 1.2 或通过 SQL 创建（高级）

```sql
-- 注意：auth.users 表通常需要通过 Supabase Auth API 操作
-- 这里提供参考 SQL，实际建议使用 Dashboard
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  confirmation_token,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(), -- 或指定特定 UUID
  'authenticated',
  'authenticated',
  'admin@leiaoai.com',
  crypt('your-secure-password', gen_salt('bf')), -- 使用 pgcrypto 扩展
  NOW(),
  NOW(),
  NOW(),
  '',
  ''
);
```

## 步骤二：配置 Admin Profile

### 2.1 执行 SQL 脚本

在 Supabase > SQL Editor 中执行以下脚本（替换 `YOUR_ADMIN_UUID`）：

```sql
-- 替换为步骤一中获取的真实 Admin UUID
-- 例如：'a1b2c3d4-e5f6-7890-abcd-ef1234567890'
\set admin_uuid 'YOUR_ADMIN_UUID'

-- 创建或更新 Admin Profile
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
  :'admin_uuid',
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
```

### 2.2 上传 Admin 头像

1. 将 Admin 头像图片放置在 `/public/imgs/leiaoai-agent-avatar.png`
2. 或在登录 Admin 账号后，通过 Settings 页面上传或 AI 生成头像

## 步骤三：迁移现有故事

### 3.1 迁移所有故事到 Admin 账号

```sql
-- 将所有现有故事的作者更新为 Admin
UPDATE stories
SET 
  author_id = :'admin_uuid',
  updated_at = NOW()
WHERE author_id IS NULL OR author_id != :'admin_uuid';

-- 验证迁移结果
SELECT 
  COUNT(*) as total_stories,
  author_id,
  p.username,
  p.full_name
FROM stories s
LEFT JOIN profiles p ON s.author_id = p.id
GROUP BY author_id, p.username, p.full_name;
```

### 3.2 更新 Admin 统计数据

```sql
-- 创建或更新 Admin 的用户统计
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
  :'admin_uuid',
  COUNT(*),
  COALESCE(SUM(views_count), 0),
  COALESCE(SUM(likes_count), 0),
  COALESCE(SUM(comment_count), 0),
  NOW(),
  NOW()
FROM stories
WHERE author_id = :'admin_uuid'
ON CONFLICT (user_id)
DO UPDATE SET
  total_stories = EXCLUDED.total_stories,
  total_views = EXCLUDED.total_views,
  total_likes = EXCLUDED.total_likes,
  total_comments = EXCLUDED.total_comments,
  updated_at = NOW();
```

## 步骤四：测试 Admin 账号功能

### 4.1 登录测试

1. 访问：`https://leiaoai-story-platform.vercel.app/auth`
2. 使用 Admin 凭据登录：
   ```
   Email: admin@leiaoai.com
   Password: [步骤一中设置的密码]
   ```

### 4.2 验证 Dashboard 访问

1. 登录后访问：`/dashboard`
2. 验证显示内容：
   - ✅ 个人信息（LeiaoAI Agent）
   - ✅ 统计数据（故事数、浏览量、点赞数等）
   - ✅ 最近活动
   - ✅ AI 聊天会话历史
   - ✅ BMC 保存记录

### 4.3 验证 Settings 访问

1. 访问：`/settings`
2. 验证功能：
   - ✅ 可以查看和编辑个人信息
   - ✅ 可以上传头像
   - ✅ 可以使用 AI 生成头像（DALL·E）
   - ✅ 可以更改语言、主题、AI 模型偏好

### 4.4 验证故事管理

1. 访问任一故事详情页
2. 验证：
   - ✅ 作者显示为 "LeiaoAI Agent"
   - ✅ Admin 登录时可以看到"Edit Story"按钮
   - ✅ 点击 Edit 可以编辑故事内容
   - ✅ 其他用户查看时不显示 Edit 按钮

## 步骤五：权限配置（可选）

### 5.1 设置 RLS 策略允许 Admin 编辑所有故事

```sql
-- 为 Admin 创建特殊权限（如果需要）
CREATE POLICY "Admin can edit all stories"
ON stories
FOR UPDATE
USING (
  auth.uid() = :'admin_uuid'
  OR 
  author_id = auth.uid()
);
```

### 5.2 赋予 Admin 特殊标识

```sql
-- 在 profiles 表添加 is_admin 字段（如果需要）
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE;

UPDATE profiles
SET is_admin = TRUE
WHERE id = :'admin_uuid';
```

## 安全注意事项

1. **密码安全**：
   - Admin 密码应该强且唯一
   - 定期更换密码
   - 不要在多个服务中重复使用

2. **访问控制**：
   - Admin 凭据应该严格保密
   - 只在必要时使用 Admin 账号
   - 考虑启用 2FA（如果 Supabase 支持）

3. **审计日志**：
   - 定期检查 Admin 账号的活动日志
   - 监控异常登录行为

## 故障排查

### 问题：无法登录 Admin 账号
- 检查邮箱和密码是否正确
- 确认用户已在 Supabase > Authentication > Users 中显示
- 检查用户的 `email_confirmed_at` 字段是否有值

### 问题：Dashboard 不显示故事
- 确认故事的 `author_id` 已更新为 Admin UUID
- 检查 RLS 策略是否允许查询
- 查看浏览器控制台是否有错误

### 问题：无法编辑故事
- 确认已登录 Admin 账号
- 检查 `stories` 表的 UPDATE 权限
- 验证 StoryDetail 页面的权限逻辑

## 相关文件

- SQL 脚本：`/scripts/create-admin-account.sql`
- Profile 页面：`/src/pages/Profile.tsx`
- Settings 页面：`/src/pages/Settings.tsx`
- StoryDetail 页面：`/src/pages/StoryDetail.tsx`
- 路由保护：`/src/App.tsx`

## 下一步

完成 Admin 账号设置后：
1. 测试所有功能是否正常
2. 创建更多测试故事
3. 体验 AI 聊天并验证历史记录
4. 使用 BMC 工具并保存到 Dashboard
5. 测试头像上传和 AI 生成功能

## 支持

如有问题，请参考：
- [Supabase 文档](https://supabase.com/docs)
- [项目 README](../README.md)
- [Vercel 部署指南](./vercel-setup.md)

