# Supabase 配置 - 分步 SQL 脚本

## ⚠️ 重要提示
- **不要**复制 \`\`\`sql 这些标记
- 只复制 SQL 代码本身
- 每个步骤单独运行

---

## 步骤 1: 更新数据库表结构

在 Supabase Dashboard > SQL Editor > New Query 中，复制粘贴以下内容并点击 **RUN**：

### 代码（步骤 1）：

```
-- 添加 image_url 字段到 bmc_boards 表
ALTER TABLE bmc_boards 
ADD COLUMN IF NOT EXISTS image_url TEXT;

-- 添加 category 字段到 chat_sessions 表
ALTER TABLE chat_sessions
ADD COLUMN IF NOT EXISTS category TEXT;

-- 创建索引加速查询
CREATE INDEX IF NOT EXISTS idx_chat_sessions_category 
ON chat_sessions(category) 
WHERE category IS NOT NULL;

-- 创建会话统计视图
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

-- 添加注释
COMMENT ON COLUMN bmc_boards.image_url IS 'Public URL of BMC image stored in Supabase Storage';
COMMENT ON COLUMN chat_sessions.category IS 'Source category from professional services area';
```

✅ 运行成功后应该看到：`Success. No rows returned`

---

## 步骤 2: 创建 Storage Bucket

### 方法 A: 通过 Dashboard（推荐）

1. 在左侧菜单点击 **Storage**
2. 点击 **New bucket** 按钮（右上角绿色按钮）
3. 填写表单：
   - **Name**: `bmc-images`
   - **Public bucket**: ✅ **勾选这个！**
   - **File size limit**: `10` MB
   - **Allowed MIME types**: `image/png,image/jpeg,image/jpg`
4. 点击 **Create bucket**

### 方法 B: 通过 SQL（如果方法A不可用）

在 SQL Editor 中运行：

```
-- 通过 SQL 创建 bucket（需要 service_role 权限）
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'bmc-images',
  'bmc-images',
  true,
  10485760,
  ARRAY['image/png', 'image/jpeg', 'image/jpg']
)
ON CONFLICT (id) DO NOTHING;
```

✅ 创建成功后，在 Storage 页面应该能看到 `bmc-images` bucket

---

## 步骤 3: 配置 Storage 策略

### 如何添加策略：

#### 选项 A: 通过 Dashboard UI（最简单）

1. 点击左侧 **Storage**
2. 点击 **bmc-images** bucket
3. 点击 **Policies** 标签
4. 点击 **New Policy** 按钮
5. 选择 **Create a policy from scratch**
6. 每个策略需要单独创建，一共4个策略

##### 策略 1: 允许上传（INSERT）

**Policy name**: `Users can upload their own BMC images`

**Target roles**: `authenticated`

**Policy command**: `INSERT`

**USING expression**: 留空

**WITH CHECK expression**:
```
bucket_id = 'bmc-images' AND (storage.foldername(name))[1] = auth.uid()::text
```

点击 **Review** → **Save policy**

---

##### 策略 2: 允许查看（SELECT）

**Policy name**: `Anyone can view BMC images`

**Target roles**: `public`

**Policy command**: `SELECT`

**USING expression**:
```
bucket_id = 'bmc-images'
```

**WITH CHECK expression**: 留空

点击 **Review** → **Save policy**

---

##### 策略 3: 允许更新（UPDATE）

**Policy name**: `Users can update their own BMC images`

**Target roles**: `authenticated`

**Policy command**: `UPDATE`

**USING expression**:
```
bucket_id = 'bmc-images' AND (storage.foldername(name))[1] = auth.uid()::text
```

**WITH CHECK expression**:
```
bucket_id = 'bmc-images' AND (storage.foldername(name))[1] = auth.uid()::text
```

点击 **Review** → **Save policy**

---

##### 策略 4: 允许删除（DELETE）

**Policy name**: `Users can delete their own BMC images`

**Target roles**: `authenticated`

**Policy command**: `DELETE`

**USING expression**:
```
bucket_id = 'bmc-images' AND (storage.foldername(name))[1] = auth.uid()::text
```

**WITH CHECK expression**: 留空

点击 **Review** → **Save policy**

---

#### 选项 B: 通过 SQL Editor（如果UI不可用）

在 SQL Editor 中，**分别运行**以下4个策略（一次运行一个）：

##### 策略 1:
```
CREATE POLICY "Users can upload their own BMC images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'bmc-images' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);
```

##### 策略 2:
```
CREATE POLICY "Anyone can view BMC images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'bmc-images');
```

##### 策略 3:
```
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
```

##### 策略 4:
```
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

## 验证配置

在 SQL Editor 中运行以下查询：

```
-- 1. 检查字段是否添加成功
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'bmc_boards' 
AND column_name = 'image_url';

-- 2. 检查 chat_sessions 字段
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'chat_sessions' 
AND column_name = 'category';

-- 3. 检查视图是否创建
SELECT viewname FROM pg_views 
WHERE viewname = 'sessions_by_category';

-- 4. 检查 bucket 是否创建
SELECT name, public, file_size_limit 
FROM storage.buckets 
WHERE name = 'bmc-images';

-- 5. 检查策略数量（应该是4个）
SELECT COUNT(*) as policy_count 
FROM pg_policies 
WHERE tablename = 'objects' 
AND policyname LIKE '%BMC%';
```

### 预期结果：
- 查询 1: 返回 1 行（image_url, text）
- 查询 2: 返回 1 行（category, text）
- 查询 3: 返回 1 行（sessions_by_category）
- 查询 4: 返回 1 行（bmc-images, true, 10485760）
- 查询 5: 返回 1 行（policy_count = 4）

---

## 常见问题

### Q: SQL Editor 提示 "syntax error at or near ```"
**A**: 不要复制 markdown 代码块标记（\`\`\`sql 和 \`\`\`），只复制纯 SQL 代码

### Q: 如何找到 Policies 设置？
**A**: Storage → 选择 bmc-images bucket → Policies 标签（顶部）

### Q: Policy 创建失败
**A**: 
1. 确保先创建了 bucket
2. 检查 Target roles 是否选对（authenticated 或 public）
3. 尝试用 SQL Editor 方式创建

### Q: 验证时某些查询返回 0 行
**A**: 
- 查询 1-3 返回 0 行：步骤 1 的 SQL 没有成功运行
- 查询 4 返回 0 行：步骤 2 的 bucket 没有创建
- 查询 5 返回 0：步骤 3 的策略没有创建

---

## ✅ 完成检查清单

- [ ] 步骤 1: 数据库表结构已更新（验证查询 1-3 通过）
- [ ] 步骤 2: bmc-images bucket 已创建（验证查询 4 通过）
- [ ] 步骤 3: 4个策略已创建（验证查询 5 返回 4）
- [ ] 所有验证查询都通过

完成后，BMC 保存功能就可以正常工作了！🎉

