-- ============================================================================
-- AI Chat Markdown 保存功能设置
-- ============================================================================
-- 用途: 添加Markdown文件URL和路径字段，创建Storage bucket
-- 创建时间: 2025-01-12
-- ============================================================================

-- 步骤1: 添加新字段到 chat_sessions 表
-- ============================================================================

ALTER TABLE chat_sessions 
ADD COLUMN IF NOT EXISTS markdown_file_url TEXT,
ADD COLUMN IF NOT EXISTS markdown_file_path TEXT;

-- 添加注释
COMMENT ON COLUMN chat_sessions.markdown_file_url IS 'Markdown文件的公开访问URL';
COMMENT ON COLUMN chat_sessions.markdown_file_path IS 'Markdown文件在Storage中的路径';

-- 步骤2: 验证字段添加
-- ============================================================================

SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'chat_sessions'
  AND column_name IN ('markdown_file_url', 'markdown_file_path');

-- 预期结果：应该看到两个新字段
-- markdown_file_url | text | NULL
-- markdown_file_path | text | NULL

-- ============================================================================
-- 步骤3: 创建 Storage Bucket (需要在Supabase Dashboard手动操作)
-- ============================================================================

/*
请在 Supabase Dashboard 中完成以下步骤：

1. 进入 Storage > Create a new bucket
2. 设置以下参数：
   - Name: chat-sessions
   - Public: ✅ (勾选，使文件可公开访问)
   - File size limit: 10 MB
   - Allowed MIME types: text/markdown, text/plain

3. 点击 "Create bucket"
*/

-- ============================================================================
-- 步骤4: 设置 Storage RLS 策略
-- ============================================================================

-- 4.1 允许用户上传自己的Markdown文件
CREATE POLICY "Users can upload their own chat markdown files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'chat-sessions' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- 4.2 允许用户查看自己的Markdown文件
CREATE POLICY "Users can view their own chat markdown files"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'chat-sessions' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- 4.3 允许所有人查看公开的Markdown文件（因为bucket是public）
CREATE POLICY "Anyone can view public chat markdown files"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'chat-sessions');

-- 4.4 允许用户更新自己的Markdown文件
CREATE POLICY "Users can update their own chat markdown files"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'chat-sessions' 
  AND (storage.foldername(name))[1] = auth.uid()::text
)
WITH CHECK (
  bucket_id = 'chat-sessions' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- 4.5 允许用户删除自己的Markdown文件
CREATE POLICY "Users can delete their own chat markdown files"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'chat-sessions' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- ============================================================================
-- 步骤5: 验证 RLS 策略
-- ============================================================================

SELECT policyname, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'objects'
  AND schemaname = 'storage'
  AND policyname LIKE '%chat markdown%'
ORDER BY policyname;

-- 预期结果：应该看到5个策略
-- 1. Users can upload their own chat markdown files
-- 2. Users can view their own chat markdown files
-- 3. Anyone can view public chat markdown files
-- 4. Users can update their own chat markdown files
-- 5. Users can delete their own chat markdown files

-- ============================================================================
-- 完成！
-- ============================================================================

/*
设置完成后，功能说明：

1. 每次AI回答完成后，会自动：
   - 生成包含完整对话的Markdown文件
   - 上传到Supabase Storage的 chat-sessions bucket
   - 更新 chat_sessions 表的 markdown_file_url 和 markdown_file_path

2. 用户可以：
   - 在Dashboard的"AI Chat Sessions"模块查看会话
   - 点击查看Markdown格式的完整对话
   - 下载Markdown文件到本地
   - 删除会话（会同时删除Markdown文件）

3. Markdown文件命名格式：
   {timestamp}_{title}.md
   例如: 1736697600000_新的投融资咨询.md

4. Markdown文件内容包括：
   - 会话标题
   - 创建和更新时间
   - 分类（如果有）
   - 所有问答对
   - AI模型和响应时间信息
*/

