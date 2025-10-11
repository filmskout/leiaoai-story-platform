# Supabase 配置指南

本指南说明如何配置 BMC 图片存储和会话跟踪功能。

## 方法 1：使用 Supabase Dashboard（推荐）

### 步骤 1: 运行 SQL 迁移

1. 访问 [Supabase Dashboard](https://app.supabase.com)
2. 选择你的项目
3. 进入 **SQL Editor**
4. 创建新查询，复制并运行以下内容：

**迁移 1: 更新数据库架构**
```sql
-- 文件: supabase/migrations/1760211600_create_bmc_storage_and_update_schema.sql

-- 1. Add image_url column to bmc_boards table
ALTER TABLE bmc_boards 
ADD COLUMN IF NOT EXISTS image_url TEXT;

-- 2. Add category column to chat_sessions table
ALTER TABLE chat_sessions
ADD COLUMN IF NOT EXISTS category TEXT;

-- 3. Create index on category
CREATE INDEX IF NOT EXISTS idx_chat_sessions_category 
ON chat_sessions(category) 
WHERE category IS NOT NULL;

-- 4. Create a view for session statistics
CREATE OR REPLACE VIEW sessions_by_category AS
SELECT 
  category,
  COUNT(*) as session_count,
  COUNT(DISTINCT user_id) as unique_users,
  AVG(CASE 
    WHEN updated_at > created_at 
    THEN EXTRACT(EPOCH FROM (updated_at - created_at)) 
    ELSE 0 
  END) as avg_duration_seconds
FROM chat_sessions
WHERE category IS NOT NULL
GROUP BY category;
```

### 步骤 2: 创建 Storage Bucket

1. 在 Supabase Dashboard 中，进入 **Storage**
2. 点击 **New bucket**
3. 配置如下：
   - **Name**: `bmc-images`
   - **Public bucket**: ✅ 开启
   - **File size limit**: 10 MB
   - **Allowed MIME types**: `image/png, image/jpeg, image/jpg`
4. 点击 **Create bucket**

### 步骤 3: 配置 Storage 策略

1. 在 Storage 页面，选择 `bmc-images` bucket
2. 点击 **Policies** 标签
3. 点击 **New policy**
4. 创建以下策略（复制 SQL）：

```sql
-- 文件: supabase/migrations/1760211700_create_bmc_storage_policies.sql

-- 允许用户上传自己的图片
CREATE POLICY "Users can upload their own BMC images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'bmc-images' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- 允许所有人查看图片
CREATE POLICY "Anyone can view BMC images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'bmc-images');

-- 允许用户更新自己的图片
CREATE POLICY "Users can update their own BMC images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'bmc-images' 
  AND (storage.foldername(name))[1] = auth.uid()::text
)
WITH CHECK (
  bucket_id = 'bmc-images' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- 允许用户删除自己的图片
CREATE POLICY "Users can delete their own BMC images"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'bmc-images' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);
```

---

## 方法 2：使用 Supabase CLI（高级）

如果你已经安装了 Supabase CLI：

```bash
# 1. 确保已登录
supabase login

# 2. 链接到你的项目
supabase link --project-ref YOUR_PROJECT_REF

# 3. 应用迁移
supabase db push

# 4. 部署 Edge Function（可选，用于自动创建 bucket）
supabase functions deploy create-bmc-storage-bucket
```

---

## 方法 3：使用 Edge Function（自动化）

我们已经创建了一个 Edge Function 可以自动创建 bucket：

### 部署 Function

1. 在 Supabase Dashboard 中，进入 **Edge Functions**
2. 创建新 function: `create-bmc-storage-bucket`
3. 复制 `supabase/functions/create-bmc-storage-bucket/index.ts` 的内容
4. 部署 function

### 调用 Function

```bash
# 使用 curl 调用
curl -X POST \
  https://YOUR_PROJECT_REF.supabase.co/functions/v1/create-bmc-storage-bucket \
  -H "Authorization: Bearer YOUR_ANON_KEY"
```

或者在浏览器中访问：
```javascript
const { data, error } = await supabase.functions.invoke('create-bmc-storage-bucket')
console.log(data) // { success: true, message: "Bucket created" }
```

---

## 验证配置

运行以下 SQL 验证一切就绪：

```sql
-- 1. 检查 bmc_boards 表结构
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'bmc_boards' 
AND column_name IN ('image_url', 'image_base64');

-- 2. 检查 chat_sessions 表结构
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'chat_sessions' 
AND column_name = 'category';

-- 3. 检查视图是否存在
SELECT viewname FROM pg_views 
WHERE viewname = 'sessions_by_category';

-- 4. 检查 storage bucket
SELECT * FROM storage.buckets WHERE name = 'bmc-images';

-- 5. 检查 storage policies
SELECT policyname, cmd, qual 
FROM pg_policies 
WHERE tablename = 'objects' 
AND policyname LIKE '%BMC%';
```

预期结果：
- ✅ `bmc_boards.image_url` 存在（TEXT 类型）
- ✅ `chat_sessions.category` 存在（TEXT 类型）
- ✅ `sessions_by_category` 视图存在
- ✅ `bmc-images` bucket 存在且为 public
- ✅ 4个 storage policies 存在

---

## 迁移现有数据（如果需要）

如果你之前使用 `image_base64` 字段，可以保留它作为备份：

```sql
-- 可选: 为旧数据添加注释
COMMENT ON COLUMN bmc_boards.image_base64 IS 'Deprecated: Use image_url instead. Kept for backward compatibility.';

-- 将来可以删除（确保所有数据已迁移）
-- ALTER TABLE bmc_boards DROP COLUMN image_base64;
```

---

## 故障排除

### 问题：无法上传图片

**检查 1**: Bucket 是否存在且为 public？
```sql
SELECT name, public FROM storage.buckets WHERE name = 'bmc-images';
```

**检查 2**: Policies 是否正确？
```sql
SELECT * FROM pg_policies WHERE tablename = 'objects' AND policyname LIKE '%BMC%';
```

**检查 3**: 用户是否已登录？
```javascript
const { data: { user } } = await supabase.auth.getUser()
console.log('User:', user) // 应该有值
```

### 问题：会话分类不显示

**检查**: category 字段是否存在？
```sql
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'chat_sessions' AND column_name = 'category';
```

---

## 测试

### 测试 BMC 保存

```javascript
// 1. 登录
await supabase.auth.signInWithPassword({ email, password })

// 2. 访问 /bp-analysis
// 3. 填写 BMC Canvas
// 4. 点击 "Save to Dashboard"
// 5. 检查 Console 日志：
//    🔵 BMC Save: Starting
//    🔵 BMC Save: Data prepared
//    🔵 BMC Save: Generating image...
//    🟢 BMC Save: Image generated
//    🟢 BMC Save: Image uploaded
//    🔵 BMC Save: Saving to database...
//    🟢 BMC Save: Success!

// 6. 验证数据库
// SELECT * FROM bmc_boards WHERE user_id = 'YOUR_USER_ID' ORDER BY created_at DESC LIMIT 1;
// 应该看到 image_url 字段有值
```

### 测试会话跟踪

```javascript
// 1. 访问首页
// 2. 点击任意专业服务区卡片（例如：Startup Funding）
// 3. 自动跳转到 AI Chat 并发送问题
// 4. 检查数据库：
// SELECT * FROM chat_sessions WHERE user_id = 'YOUR_USER_ID' ORDER BY created_at DESC LIMIT 1;
// 应该看到 category 字段有值（例如：'startup'）

// 5. 查看统计：
// SELECT * FROM sessions_by_category;
```

---

## 完成！

配置完成后：
- ✅ BMC 图片保存到 Supabase Storage
- ✅ Dashboard 显示图片（从 URL）
- ✅ 可以下载 PNG 文件
- ✅ AI Chat 会话带有分类标签
- ✅ 可以统计各专业服务区的使用情况

如有问题，查看 Console 中的详细日志 🔍

