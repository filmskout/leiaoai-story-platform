# Supabase完整设置指南

生成时间: 2025年10月11日

---

## 📋 目录

1. [SQL迁移](#sql迁移)
2. [Storage Buckets设置](#storage-buckets设置)
3. [RLS Policies验证](#rls-policies验证)
4. [功能测试](#功能测试)

---

## 🔧 SQL迁移

### 步骤1: 访问Supabase Dashboard

1. 打开浏览器，访问：https://supabase.com/dashboard
2. 登录你的账号
3. 选择你的项目：`leiaoai-story-platform`
4. 左侧菜单点击 **SQL Editor**

---

### 步骤2: 运行迁移文件1 - BMC Storage

📝 **目的：** 创建BMC（Business Model Canvas）相关表和Storage policies

**操作：**
1. 点击 **New Query**
2. 复制以下SQL并粘贴到编辑器
3. 点击 **RUN** 按钮（或按 Ctrl+Enter / Cmd+Enter）

```sql
-- ============================================
-- 迁移文件 1: BMC Storage Setup
-- ============================================

-- 1. 创建bmc_boards表（如果不存在）
CREATE TABLE IF NOT EXISTS bmc_boards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  data JSONB NOT NULL,
  image_url TEXT, -- Storage URL for the saved PNG image
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- 2. 创建索引
CREATE INDEX IF NOT EXISTS idx_bmc_boards_user_id ON bmc_boards(user_id);
CREATE INDEX IF NOT EXISTS idx_bmc_boards_created_at ON bmc_boards(created_at DESC);

-- 3. 启用RLS
ALTER TABLE bmc_boards ENABLE ROW LEVEL SECURITY;

-- 4. 删除旧的policies（如果存在）
DROP POLICY IF EXISTS "Users can view their own BMC boards" ON bmc_boards;
DROP POLICY IF EXISTS "Users can insert their own BMC boards" ON bmc_boards;
DROP POLICY IF EXISTS "Users can update their own BMC boards" ON bmc_boards;
DROP POLICY IF EXISTS "Users can delete their own BMC boards" ON bmc_boards;

-- 5. 创建RLS policies for bmc_boards
CREATE POLICY "Users can view their own BMC boards"
  ON bmc_boards FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own BMC boards"
  ON bmc_boards FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own BMC boards"
  ON bmc_boards FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own BMC boards"
  ON bmc_boards FOR DELETE
  USING (auth.uid() = user_id);

-- 6. Storage policies for bmc-images bucket (注意：需要先在Storage UI创建bucket)
-- 删除旧的policies
DROP POLICY IF EXISTS "Users can upload their own BMC images" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own BMC images" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own BMC images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own BMC images" ON storage.objects;
DROP POLICY IF EXISTS "Public can view BMC images" ON storage.objects;

-- 创建新的policies
CREATE POLICY "Users can upload their own BMC images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'bmc-images' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view their own BMC images"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'bmc-images' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Public can view BMC images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'bmc-images');

CREATE POLICY "Users can update their own BMC images"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'bmc-images' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own BMC images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'bmc-images' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );
```

**预期结果：**
```
Success. No rows returned
```

---

### 步骤3: 运行迁移文件2 - Chat Sessions

📝 **目的：** 创建AI Chat相关表和视图

**操作：**
1. 点击 **New Query**
2. 复制以下SQL并粘贴
3. 点击 **RUN**

```sql
-- ============================================
-- 迁移文件 2: Chat Sessions Setup
-- ============================================

-- 1. 创建chat_sessions表
CREATE TABLE IF NOT EXISTS chat_sessions (
  session_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT '新的对话',
  category TEXT, -- Category from professional services (e.g., 'cvc_investment')
  message_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- 2. 创建chat_messages表
CREATE TABLE IF NOT EXISTS chat_messages (
  id BIGSERIAL PRIMARY KEY,
  session_id UUID REFERENCES chat_sessions(session_id) ON DELETE CASCADE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  ai_model TEXT,
  processing_time NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- 3. 创建索引
CREATE INDEX IF NOT EXISTS idx_chat_sessions_user_id ON chat_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_category ON chat_sessions(category);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_created_at ON chat_sessions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_chat_messages_session_id ON chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages(created_at);

-- 4. 启用RLS
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- 5. 删除旧的policies
DROP POLICY IF EXISTS "Users can view their own chat sessions" ON chat_sessions;
DROP POLICY IF EXISTS "Users can insert their own chat sessions" ON chat_sessions;
DROP POLICY IF EXISTS "Users can update their own chat sessions" ON chat_sessions;
DROP POLICY IF EXISTS "Users can delete their own chat sessions" ON chat_sessions;
DROP POLICY IF EXISTS "Allow anonymous chat sessions" ON chat_sessions;

DROP POLICY IF EXISTS "Users can view their own chat messages" ON chat_messages;
DROP POLICY IF EXISTS "Users can insert chat messages in their sessions" ON chat_messages;

-- 6. 创建RLS policies for chat_sessions
CREATE POLICY "Users can view their own chat sessions"
  ON chat_sessions FOR SELECT
  USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can insert their own chat sessions"
  ON chat_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can update their own chat sessions"
  ON chat_sessions FOR UPDATE
  USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can delete their own chat sessions"
  ON chat_sessions FOR DELETE
  USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Allow anonymous chat sessions"
  ON chat_sessions FOR ALL
  USING (user_id IS NULL);

-- 7. 创建RLS policies for chat_messages
CREATE POLICY "Users can view their own chat messages"
  ON chat_messages FOR SELECT
  USING (
    session_id IN (
      SELECT session_id FROM chat_sessions 
      WHERE user_id = auth.uid() OR user_id IS NULL
    )
  );

CREATE POLICY "Users can insert chat messages in their sessions"
  ON chat_messages FOR INSERT
  WITH CHECK (
    session_id IN (
      SELECT session_id FROM chat_sessions 
      WHERE user_id = auth.uid() OR user_id IS NULL
    )
  );

-- 8. 创建视图：按category统计sessions
CREATE OR REPLACE VIEW sessions_by_category AS
SELECT 
  category,
  COUNT(*) as session_count,
  MAX(created_at) as last_session_at
FROM chat_sessions
WHERE category IS NOT NULL
GROUP BY category
ORDER BY session_count DESC;
```

**预期结果：**
```
Success. No rows returned
```

---

### 步骤4: 运行迁移文件3 - BP Storage

📝 **目的：** 创建BP（Business Plan）相关表和Storage policies

**操作：**
1. 点击 **New Query**
2. 复制以下SQL并粘贴
3. 点击 **RUN**

```sql
-- ============================================
-- 迁移文件 3: BP Storage and Analysis
-- ============================================

-- 1. 创建bp_submissions表
CREATE TABLE IF NOT EXISTS bp_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_url TEXT NOT NULL, -- Storage URL for the uploaded file
  file_size BIGINT NOT NULL,
  extracted_text TEXT, -- OCR extracted text
  analysis_status TEXT DEFAULT 'pending' NOT NULL, -- pending, analyzing, completed, failed
  analysis_scores JSONB, -- Stores the detailed AI analysis scores
  score INTEGER, -- Overall score (0-100)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- 2. 创建索引
CREATE INDEX IF NOT EXISTS idx_bp_submissions_user_id ON bp_submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_bp_submissions_status ON bp_submissions(analysis_status);
CREATE INDEX IF NOT EXISTS idx_bp_submissions_created_at ON bp_submissions(created_at DESC);

-- 3. 启用RLS
ALTER TABLE bp_submissions ENABLE ROW LEVEL SECURITY;

-- 4. 删除旧的policies
DROP POLICY IF EXISTS "Users can view their own BP submissions" ON bp_submissions;
DROP POLICY IF EXISTS "Users can insert their own BP submissions" ON bp_submissions;
DROP POLICY IF EXISTS "Users can update their own BP submissions" ON bp_submissions;
DROP POLICY IF EXISTS "Users can delete their own BP submissions" ON bp_submissions;

-- 5. 创建RLS policies for bp_submissions
CREATE POLICY "Users can view their own BP submissions"
  ON bp_submissions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own BP submissions"
  ON bp_submissions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own BP submissions"
  ON bp_submissions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own BP submissions"
  ON bp_submissions FOR DELETE
  USING (auth.uid() = user_id);

-- 6. Storage policies for bp-documents bucket
DROP POLICY IF EXISTS "Users can upload their own BP documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own BP documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own BP documents" ON storage.objects;

CREATE POLICY "Users can upload their own BP documents"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'bp-documents' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view their own BP documents"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'bp-documents' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own BP documents"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'bp-documents' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );
```

**预期结果：**
```
Success. No rows returned
```

---

### 步骤5: 运行迁移文件4 - Stories and Tags (最重要！)

📝 **目的：** 创建Stories交互功能的所有表、触发器和policies

**操作：**
1. 点击 **New Query**
2. 复制以下SQL并粘贴
3. 点击 **RUN**

```sql
-- ============================================
-- 迁移文件 4: Stories and Tags System
-- ============================================

-- 1. 创建story_tags表（标签定义）
CREATE TABLE IF NOT EXISTS story_tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL, -- 内部标识符，如 'ai_investment'
  display_name TEXT NOT NULL, -- 显示名称，如 'AI投资'
  color TEXT DEFAULT '#3B82F6', -- 标签颜色
  usage_count INTEGER DEFAULT 0, -- 使用次数
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- 2. 创建story_tag_assignments表（故事-标签关联）
CREATE TABLE IF NOT EXISTS story_tag_assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  story_id UUID NOT NULL REFERENCES stories(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES story_tags(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(story_id, tag_id)
);

-- 3. 创建story_likes表
CREATE TABLE IF NOT EXISTS story_likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  story_id UUID NOT NULL REFERENCES stories(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id TEXT, -- For anonymous users
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(story_id, user_id),
  UNIQUE(story_id, session_id)
);

-- 4. 创建story_saves表
CREATE TABLE IF NOT EXISTS story_saves (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  story_id UUID NOT NULL REFERENCES stories(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(story_id, user_id)
);

-- 5. 创建story_comments表
CREATE TABLE IF NOT EXISTS story_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  story_id UUID NOT NULL REFERENCES stories(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  session_id TEXT, -- For anonymous comments
  author_name TEXT NOT NULL,
  content TEXT NOT NULL,
  parent_comment_id UUID REFERENCES story_comments(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- 6. 创建story_shares表
CREATE TABLE IF NOT EXISTS story_shares (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  story_id UUID NOT NULL REFERENCES stories(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  session_id TEXT,
  platform TEXT, -- 'twitter', 'facebook', 'linkedin', 'copy', etc.
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- 7. 创建索引
CREATE INDEX IF NOT EXISTS idx_story_tag_assignments_story ON story_tag_assignments(story_id);
CREATE INDEX IF NOT EXISTS idx_story_tag_assignments_tag ON story_tag_assignments(tag_id);
CREATE INDEX IF NOT EXISTS idx_story_likes_story ON story_likes(story_id);
CREATE INDEX IF NOT EXISTS idx_story_likes_user ON story_likes(user_id);
CREATE INDEX IF NOT EXISTS idx_story_saves_story ON story_saves(story_id);
CREATE INDEX IF NOT EXISTS idx_story_saves_user ON story_saves(user_id);
CREATE INDEX IF NOT EXISTS idx_story_comments_story ON story_comments(story_id);
CREATE INDEX IF NOT EXISTS idx_story_comments_parent ON story_comments(parent_comment_id);
CREATE INDEX IF NOT EXISTS idx_story_shares_story ON story_shares(story_id);

-- 8. 启用RLS
ALTER TABLE story_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE story_tag_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE story_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE story_saves ENABLE ROW LEVEL SECURITY;
ALTER TABLE story_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE story_shares ENABLE ROW LEVEL SECURITY;

-- 9. 删除所有旧的policies
DROP POLICY IF EXISTS "Anyone can view active tags" ON story_tags;
DROP POLICY IF EXISTS "Anyone can view tag assignments" ON story_tag_assignments;
DROP POLICY IF EXISTS "Authenticated users can assign tags to their stories" ON story_tag_assignments;
DROP POLICY IF EXISTS "Anyone can view likes" ON story_likes;
DROP POLICY IF EXISTS "Authenticated users can like stories" ON story_likes;
DROP POLICY IF EXISTS "Anonymous users can like stories" ON story_likes;
DROP POLICY IF EXISTS "Users can unlike their likes" ON story_likes;
DROP POLICY IF EXISTS "Authenticated users can view saves" ON story_saves;
DROP POLICY IF EXISTS "Authenticated users can save stories" ON story_saves;
DROP POLICY IF EXISTS "Users can unsave their saves" ON story_saves;
DROP POLICY IF EXISTS "Anyone can view comments" ON story_comments;
DROP POLICY IF EXISTS "Authenticated users can add comments" ON story_comments;
DROP POLICY IF EXISTS "Anonymous users can add comments" ON story_comments;
DROP POLICY IF EXISTS "Users can update their own comments" ON story_comments;
DROP POLICY IF EXISTS "Users can delete their own comments" ON story_comments;
DROP POLICY IF EXISTS "Anyone can view shares" ON story_shares;
DROP POLICY IF EXISTS "Anyone can record shares" ON story_shares;

-- 10. 创建RLS policies

-- story_tags policies
CREATE POLICY "Anyone can view active tags"
  ON story_tags FOR SELECT
  USING (is_active = true);

-- story_tag_assignments policies
CREATE POLICY "Anyone can view tag assignments"
  ON story_tag_assignments FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can assign tags to their stories"
  ON story_tag_assignments FOR ALL
  USING (
    story_id IN (
      SELECT id FROM stories WHERE author = auth.uid()
    )
  );

-- story_likes policies
CREATE POLICY "Anyone can view likes"
  ON story_likes FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can like stories"
  ON story_likes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Anonymous users can like stories"
  ON story_likes FOR INSERT
  WITH CHECK (session_id IS NOT NULL AND user_id IS NULL);

CREATE POLICY "Users can unlike their likes"
  ON story_likes FOR DELETE
  USING (auth.uid() = user_id OR session_id IS NOT NULL);

-- story_saves policies
CREATE POLICY "Authenticated users can view saves"
  ON story_saves FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can save stories"
  ON story_saves FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unsave their saves"
  ON story_saves FOR DELETE
  USING (auth.uid() = user_id);

-- story_comments policies
CREATE POLICY "Anyone can view comments"
  ON story_comments FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can add comments"
  ON story_comments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Anonymous users can add comments"
  ON story_comments FOR INSERT
  WITH CHECK (session_id IS NOT NULL AND user_id IS NULL);

CREATE POLICY "Users can update their own comments"
  ON story_comments FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments"
  ON story_comments FOR DELETE
  USING (auth.uid() = user_id);

-- story_shares policies
CREATE POLICY "Anyone can view shares"
  ON story_shares FOR SELECT
  USING (true);

CREATE POLICY "Anyone can record shares"
  ON story_shares FOR INSERT
  WITH CHECK (true);

-- 11. 创建数据库函数和触发器（自动更新计数）

-- Function: increment like count
CREATE OR REPLACE FUNCTION increment_story_like_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE stories
  SET like_count = like_count + 1
  WHERE id = NEW.story_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function: decrement like count
CREATE OR REPLACE FUNCTION decrement_story_like_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE stories
  SET like_count = GREATEST(0, like_count - 1)
  WHERE id = OLD.story_id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Function: increment comment count
CREATE OR REPLACE FUNCTION increment_story_comment_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE stories
  SET comment_count = comment_count + 1
  WHERE id = NEW.story_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function: decrement comment count
CREATE OR REPLACE FUNCTION decrement_story_comment_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE stories
  SET comment_count = GREATEST(0, comment_count - 1)
  WHERE id = OLD.story_id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Function: increment saves count
CREATE OR REPLACE FUNCTION increment_story_saves_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE stories
  SET saves_count = saves_count + 1
  WHERE id = NEW.story_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function: decrement saves count
CREATE OR REPLACE FUNCTION decrement_story_saves_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE stories
  SET saves_count = GREATEST(0, saves_count - 1)
  WHERE id = OLD.story_id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Function: increment tag usage count
CREATE OR REPLACE FUNCTION increment_tag_usage_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE story_tags
  SET usage_count = usage_count + 1
  WHERE id = NEW.tag_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function: decrement tag usage count
CREATE OR REPLACE FUNCTION decrement_tag_usage_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE story_tags
  SET usage_count = GREATEST(0, usage_count - 1)
  WHERE id = OLD.tag_id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- 12. 删除旧的触发器
DROP TRIGGER IF EXISTS increment_story_like_trigger ON story_likes;
DROP TRIGGER IF EXISTS decrement_story_like_trigger ON story_likes;
DROP TRIGGER IF EXISTS increment_story_comment_trigger ON story_comments;
DROP TRIGGER IF EXISTS decrement_story_comment_trigger ON story_comments;
DROP TRIGGER IF EXISTS increment_story_saves_trigger ON story_saves;
DROP TRIGGER IF EXISTS decrement_story_saves_trigger ON story_saves;
DROP TRIGGER IF EXISTS increment_tag_usage_trigger ON story_tag_assignments;
DROP TRIGGER IF EXISTS decrement_tag_usage_trigger ON story_tag_assignments;

-- 13. 创建触发器

-- Triggers for story_likes
CREATE TRIGGER increment_story_like_trigger
AFTER INSERT ON story_likes
FOR EACH ROW EXECUTE FUNCTION increment_story_like_count();

CREATE TRIGGER decrement_story_like_trigger
AFTER DELETE ON story_likes
FOR EACH ROW EXECUTE FUNCTION decrement_story_like_count();

-- Triggers for story_comments
CREATE TRIGGER increment_story_comment_trigger
AFTER INSERT ON story_comments
FOR EACH ROW EXECUTE FUNCTION increment_story_comment_count();

CREATE TRIGGER decrement_story_comment_trigger
AFTER DELETE ON story_comments
FOR EACH ROW EXECUTE FUNCTION decrement_story_comment_count();

-- Triggers for story_saves
CREATE TRIGGER increment_story_saves_trigger
AFTER INSERT ON story_saves
FOR EACH ROW EXECUTE FUNCTION increment_story_saves_count();

CREATE TRIGGER decrement_story_saves_trigger
AFTER DELETE ON story_saves
FOR EACH ROW EXECUTE FUNCTION decrement_story_saves_count();

-- Triggers for story_tag_assignments
CREATE TRIGGER increment_tag_usage_trigger
AFTER INSERT ON story_tag_assignments
FOR EACH ROW EXECUTE FUNCTION increment_tag_usage_count();

CREATE TRIGGER decrement_tag_usage_trigger
AFTER DELETE ON story_tag_assignments
FOR EACH ROW EXECUTE FUNCTION decrement_tag_usage_count();

-- 14. 插入默认标签（如果表为空）
INSERT INTO story_tags (name, display_name, color) VALUES
  ('ai_technology', 'AI技术', '#3B82F6'),
  ('investment', '投资', '#10B981'),
  ('startup', '创业', '#F59E0B'),
  ('business', '商业', '#8B5CF6'),
  ('finance', '金融', '#EF4444'),
  ('innovation', '创新', '#06B6D4'),
  ('market', '市场', '#EC4899'),
  ('strategy', '战略', '#6366F1'),
  ('success', '成功案例', '#14B8A6'),
  ('failure', '失败教训', '#F97316')
ON CONFLICT (name) DO NOTHING;
```

**预期结果：**
```
Success. No rows returned
```

---

## 🗄️ Storage Buckets设置

### 步骤6: 创建bmc-images Bucket

📝 **目的：** 存储BMC导出的PNG图片

**操作：**
1. 左侧菜单点击 **Storage**
2. 点击 **Create a new bucket** 按钮
3. 填写以下信息：
   - **Name:** `bmc-images`
   - **Public bucket:** ✅ 勾选（允许公开访问）
   - **File size limit:** `10 MB`
   - **Allowed MIME types:** `image/png`
4. 点击 **Create bucket**

**验证：**
- 在Storage页面应该能看到 `bmc-images` bucket

---

### 步骤7: 创建bp-documents Bucket

📝 **目的：** 存储BP文档（PDF/DOCX）

**操作：**
1. 还在Storage页面，点击 **Create a new bucket**
2. 填写以下信息：
   - **Name:** `bp-documents`
   - **Public bucket:** ❌ 不勾选（私密存储）
   - **File size limit:** `50 MB`
   - **Allowed MIME types:** `application/pdf, application/vnd.openxmlformats-officedocument.wordprocessingml.document`
3. 点击 **Create bucket**

**验证：**
- 在Storage页面应该能看到 `bp-documents` bucket

---

## ✅ RLS Policies验证

### 步骤8: 验证所有表的RLS状态

📝 **目的：** 确认所有表都启用了RLS并有正确的policies

**操作：**
1. 左侧菜单点击 **Authentication** → **Policies**
2. 或者在SQL Editor运行以下查询：

```sql
-- 查看所有表的RLS状态
SELECT 
  schemaname,
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN (
    'bmc_boards',
    'chat_sessions',
    'chat_messages',
    'bp_submissions',
    'stories',
    'story_tags',
    'story_tag_assignments',
    'story_likes',
    'story_saves',
    'story_comments',
    'story_shares'
  )
ORDER BY tablename;
```

**预期结果：** 所有表的 `rls_enabled` 应该为 `true`

---

### 步骤9: 验证Policies数量

📝 **目的：** 确认每个表都有足够的policies

**操作：** 在SQL Editor运行：

```sql
-- 查看每个表的policies数量
SELECT 
  schemaname,
  tablename,
  COUNT(*) as policy_count
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN (
    'bmc_boards',
    'chat_sessions',
    'chat_messages',
    'bp_submissions',
    'stories',
    'story_tags',
    'story_tag_assignments',
    'story_likes',
    'story_saves',
    'story_comments',
    'story_shares'
  )
GROUP BY schemaname, tablename
ORDER BY tablename;
```

**预期结果：**
```
tablename                 | policy_count
--------------------------+-------------
bmc_boards               | 4
bp_submissions           | 4
chat_messages            | 2
chat_sessions            | 5
stories                  | 4-6
story_comments           | 5
story_likes              | 4
story_saves              | 3
story_shares             | 2
story_tag_assignments    | 2
story_tags               | 1
```

---

### 步骤10: 验证Storage Policies

📝 **目的：** 确认Storage buckets有正确的policies

**操作：** 在SQL Editor运行：

```sql
-- 查看Storage policies
SELECT 
  bucket_id,
  name as policy_name,
  definition
FROM storage.policies
WHERE bucket_id IN ('bmc-images', 'bp-documents')
ORDER BY bucket_id, name;
```

**预期结果：** 应该看到至少：
- `bmc-images`: 5个policies（upload, view, public view, update, delete）
- `bp-documents`: 3个policies（upload, view, delete）

---

### 步骤11: 验证触发器

📝 **目的：** 确认所有数据库触发器已创建

**操作：** 在SQL Editor运行：

```sql
-- 查看所有触发器
SELECT 
  event_object_table as table_name,
  trigger_name,
  event_manipulation as event_type
FROM information_schema.triggers
WHERE event_object_schema = 'public'
  AND event_object_table LIKE 'story_%'
ORDER BY event_object_table, trigger_name;
```

**预期结果：** 应该看到8个触发器：
- `story_likes`: increment_story_like_trigger, decrement_story_like_trigger
- `story_comments`: increment_story_comment_trigger, decrement_story_comment_trigger
- `story_saves`: increment_story_saves_trigger, decrement_story_saves_trigger
- `story_tag_assignments`: increment_tag_usage_trigger, decrement_tag_usage_trigger

---

## 🧪 功能测试

### 步骤12: 测试Stories功能

📝 **目的：** 验证Stories交互功能正常工作

**操作：**

1. **测试Like功能：**
```sql
-- 插入一个测试like（替换YOUR_STORY_ID和YOUR_USER_ID）
INSERT INTO story_likes (story_id, user_id)
VALUES ('YOUR_STORY_ID', 'YOUR_USER_ID');

-- 检查stories表的like_count是否增加
SELECT id, title, like_count
FROM stories
WHERE id = 'YOUR_STORY_ID';

-- 删除测试like
DELETE FROM story_likes
WHERE story_id = 'YOUR_STORY_ID' AND user_id = 'YOUR_USER_ID';

-- 再次检查like_count是否减少
SELECT id, title, like_count
FROM stories
WHERE id = 'YOUR_STORY_ID';
```

2. **测试前端功能：**
   - 访问Stories页面
   - 点击任一故事查看详情
   - 点击Like按钮（应该变红并计数+1）
   - 再次点击（应该取消并计数-1）
   - 打开浏览器控制台（F12）查看是否有错误

---

### 步骤13: 测试Chat Sessions

📝 **目的：** 验证Chat Sessions正确保存

**操作：**

1. **查看现有sessions：**
```sql
SELECT 
  session_id,
  user_id,
  title,
  category,
  message_count,
  created_at
FROM chat_sessions
ORDER BY created_at DESC
LIMIT 10;
```

2. **查看category统计：**
```sql
SELECT * FROM sessions_by_category;
```

3. **测试前端：**
   - 访问主页专业服务区
   - 点击任一建议问题
   - 验证AI Chat自动发送
   - 访问Dashboard → AI Chat Sessions
   - 验证新session出现且显示category

---

### 步骤14: 测试BMC Storage

📝 **目的：** 验证BMC保存功能

**操作：**

1. **查看BMC saves：**
```sql
SELECT 
  id,
  user_id,
  title,
  image_url,
  created_at
FROM bmc_boards
ORDER BY created_at DESC
LIMIT 10;
```

2. **测试前端：**
   - 访问BP Analysis → BMC Canvas
   - 填写内容
   - 点击"Save to Dashboard"
   - 访问Dashboard → BMC Saves
   - 验证BMC出现且可以下载

---

### 步骤15: 测试BP Storage

📝 **目的：** 验证BP上传功能

**操作：**

1. **查看BP submissions：**
```sql
SELECT 
  id,
  user_id,
  file_name,
  file_type,
  file_url,
  analysis_status,
  score,
  created_at
FROM bp_submissions
ORDER BY created_at DESC
LIMIT 10;
```

2. **测试前端：**
   - 访问BP Analysis
   - 上传一个PDF文件
   - 点击"Analyze"
   - 访问Dashboard → BP Submissions
   - 验证文件出现且可以下载

---

## 🎊 完成检查清单

### SQL迁移：
- [ ] 步骤2: BMC Storage SQL
- [ ] 步骤3: Chat Sessions SQL
- [ ] 步骤4: BP Storage SQL
- [ ] 步骤5: Stories and Tags SQL（最重要！）

### Storage Buckets：
- [ ] 步骤6: 创建bmc-images bucket（Public, 10MB）
- [ ] 步骤7: 创建bp-documents bucket（Private, 50MB）

### RLS验证：
- [ ] 步骤8: 所有表RLS已启用
- [ ] 步骤9: 所有表有足够的policies
- [ ] 步骤10: Storage有正确的policies
- [ ] 步骤11: 所有触发器已创建

### 功能测试：
- [ ] 步骤12: Stories Like功能正常
- [ ] 步骤13: Chat Sessions保存正常
- [ ] 步骤14: BMC保存功能正常
- [ ] 步骤15: BP上传功能正常

---

## 🔧 常见问题排查

### 问题1: SQL执行出错

**错误示例：**
```
ERROR: relation "stories" does not exist
```

**解决：**
- 确认`stories`表已存在
- 如果不存在，需要先创建stories表的基础schema

### 问题2: RLS policies冲突

**错误示例：**
```
ERROR: policy "policy_name" for table "table_name" already exists
```

**解决：**
- SQL中已包含`DROP POLICY IF EXISTS`语句
- 如果仍报错，手动删除旧policy：
```sql
DROP POLICY "policy_name" ON table_name;
```

### 问题3: Storage bucket已存在

**错误示例：**
```
Bucket already exists
```

**解决：**
- 跳过创建步骤
- 直接验证bucket设置是否正确

### 问题4: 触发器未生效

**症状：** Like后计数不更新

**解决：**
```sql
-- 检查触发器是否存在
SELECT trigger_name, event_object_table
FROM information_schema.triggers
WHERE trigger_name LIKE '%story%';

-- 如果不存在，重新运行步骤5的SQL
```

---

## 📞 获取帮助

如果遇到问题：

1. **查看浏览器控制台：** F12 → Console标签
2. **查看Supabase日志：** Supabase Dashboard → Logs
3. **查看SQL错误：** SQL Editor显示的详细错误信息
4. **运行验证SQL：** 使用上面的验证查询检查状态

---

**最后更新：** 2025年10月11日  
**版本：** 1.0  
**状态：** 生产就绪 ✅
