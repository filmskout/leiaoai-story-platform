# Supabase SQL 快速执行指南

## ⚠️ 重要：如何正确复制粘贴SQL

### ❌ 错误的做法：
从 `SUPABASE-SETUP-GUIDE.md` 复制带有 ` ```sql ` 标记的代码块

### ✅ 正确的做法：
使用项目根目录下的4个纯SQL文件：

```
SQL-MIGRATION-01-BMC.sql       ← BMC功能
SQL-MIGRATION-02-CHAT.sql      ← Chat Sessions
SQL-MIGRATION-03-BP.sql        ← BP分析
SQL-MIGRATION-04-STORIES.sql   ← Stories交互（最重要！）
```

---

## 📋 执行步骤

### 1️⃣ 打开Supabase
1. 访问：https://supabase.com/dashboard
2. 选择项目：`leiaoai-story-platform`
3. 左侧菜单 → **SQL Editor**
4. 点击 **New Query**

### 2️⃣ 执行迁移文件1 - BMC

**在本地打开：** `SQL-MIGRATION-01-BMC.sql`

**复制全部内容** → 粘贴到Supabase SQL Editor → 点击 **RUN**

✅ 预期结果：`Success. No rows returned`

---

### 3️⃣ 执行迁移文件2 - Chat Sessions

**在本地打开：** `SQL-MIGRATION-02-CHAT.sql`

**复制全部内容** → 粘贴到Supabase SQL Editor → 点击 **RUN**

✅ 预期结果：`Success. No rows returned`

---

### 4️⃣ 执行迁移文件3 - BP

**在本地打开：** `SQL-MIGRATION-03-BP.sql`

**复制全部内容** → 粘贴到Supabase SQL Editor → 点击 **RUN**

✅ 预期结果：`Success. No rows returned`

---

### 5️⃣ 执行迁移文件4 - Stories（最重要！）

**在本地打开：** `SQL-MIGRATION-04-STORIES.sql`

**复制全部内容** → 粘贴到Supabase SQL Editor → 点击 **RUN**

✅ 预期结果：`Success. No rows returned`

---

## 🗄️ 创建Storage Buckets

### Bucket 1: bmc-images

1. 左侧菜单 → **Storage**
2. 点击 **Create a new bucket**
3. 填写：
   - Name: `bmc-images`
   - Public bucket: ✅ **勾选**
   - File size limit: `10 MB`
   - Allowed MIME types: `image/png`
4. 点击 **Create bucket**

### Bucket 2: bp-documents

1. 点击 **Create a new bucket**
2. 填写：
   - Name: `bp-documents`
   - Public bucket: ❌ **不勾选**
   - File size limit: `50 MB`
   - Allowed MIME types: `application/pdf, application/vnd.openxmlformats-officedocument.wordprocessingml.document`
3. 点击 **Create bucket**

---

## ✅ 验证设置

### 检查表是否创建成功

在SQL Editor运行：

```sql
SELECT tablename 
FROM pg_tables 
WHERE schemaname = 'public'
  AND tablename LIKE '%bmc%' 
   OR tablename LIKE '%chat%'
   OR tablename LIKE '%bp%'
   OR tablename LIKE 'story_%'
ORDER BY tablename;
```

**预期看到：**
- bmc_boards
- bp_submissions
- chat_messages
- chat_sessions
- story_comments
- story_likes
- story_saves
- story_shares
- story_tag_assignments
- story_tags

### 检查触发器

```sql
SELECT trigger_name, event_object_table
FROM information_schema.triggers
WHERE event_object_schema = 'public'
  AND trigger_name LIKE '%story%'
ORDER BY event_object_table, trigger_name;
```

**预期看到：** 8个触发器

---

## 🎉 完成！

现在可以测试前端功能：

1. ✅ AI Chat自动发送和保存
2. ✅ Stories Like/Save/Comment功能
3. ✅ BMC保存到Dashboard
4. ✅ BP文档上传和分析

---

## 🆘 遇到错误？

### 错误：`syntax error at or near "```"`

**原因：** 复制了markdown代码块标记

**解决：** 
1. ❌ 不要从 `SUPABASE-SETUP-GUIDE.md` 复制SQL
2. ✅ 使用 `SQL-MIGRATION-XX-XXX.sql` 文件

### 错误：`relation "stories" does not exist`

**原因：** `stories`表还未创建

**解决：** 确保之前已经创建了`stories`表的基础schema

### 其他错误

查看完整排查指南：`SUPABASE-SETUP-GUIDE.md` → "常见问题排查"

---

**最后更新：** 2025年10月11日

