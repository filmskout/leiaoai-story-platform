-- ════════════════════════════════════════════════════════════════════════
-- 完整的RLS Policies设置 - 修复版（类型转换已修复）
-- ════════════════════════════════════════════════════════════════════════
-- 
-- ⚠️  重要: 这个SQL文件只能设置数据库表的RLS policies
-- Storage bucket policies必须在Supabase Dashboard手动设置
-- 完成后请参考 BP-STORAGE-POLICIES-GUIDE.md 设置Storage
--
-- ════════════════════════════════════════════════════════════════════════

-- ════════════════════════════════════════════════════════════════════════
-- 1️⃣ BMC Boards (Business Model Canvas)
-- ════════════════════════════════════════════════════════════════════════

-- 启用RLS
ALTER TABLE IF EXISTS bmc_boards ENABLE ROW LEVEL SECURITY;

-- 删除旧policies（如果存在）
DROP POLICY IF EXISTS "Users can insert their own BMC boards" ON bmc_boards;
DROP POLICY IF EXISTS "Users can view their own BMC boards" ON bmc_boards;
DROP POLICY IF EXISTS "Users can update their own BMC boards" ON bmc_boards;
DROP POLICY IF EXISTS "Users can delete their own BMC boards" ON bmc_boards;

-- 创建新policies（使用::uuid确保类型匹配）
CREATE POLICY "Users can insert their own BMC boards"
ON bmc_boards FOR INSERT
TO authenticated
WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can view their own BMC boards"
ON bmc_boards FOR SELECT
TO authenticated
USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update their own BMC boards"
ON bmc_boards FOR UPDATE
TO authenticated
USING (auth.uid()::text = user_id::text)
WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete their own BMC boards"
ON bmc_boards FOR DELETE
TO authenticated
USING (auth.uid()::text = user_id::text);

-- ════════════════════════════════════════════════════════════════════════
-- 2️⃣ Chat Sessions (AI Chat会话)
-- ════════════════════════════════════════════════════════════════════════

-- 启用RLS
ALTER TABLE IF EXISTS chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS chat_messages ENABLE ROW LEVEL SECURITY;

-- 删除旧policies
DROP POLICY IF EXISTS "Users can insert their own chat sessions" ON chat_sessions;
DROP POLICY IF EXISTS "Users can view their own chat sessions" ON chat_sessions;
DROP POLICY IF EXISTS "Users can update their own chat sessions" ON chat_sessions;
DROP POLICY IF EXISTS "Users can delete their own chat sessions" ON chat_sessions;

DROP POLICY IF EXISTS "Users can insert messages in their sessions" ON chat_messages;
DROP POLICY IF EXISTS "Users can view messages in their sessions" ON chat_messages;
DROP POLICY IF EXISTS "Users can update messages in their sessions" ON chat_messages;
DROP POLICY IF EXISTS "Users can delete messages in their sessions" ON chat_messages;

-- Chat Sessions policies
CREATE POLICY "Users can insert their own chat sessions"
ON chat_sessions FOR INSERT
TO authenticated
WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can view their own chat sessions"
ON chat_sessions FOR SELECT
TO authenticated
USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update their own chat sessions"
ON chat_sessions FOR UPDATE
TO authenticated
USING (auth.uid()::text = user_id::text)
WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete their own chat sessions"
ON chat_sessions FOR DELETE
TO authenticated
USING (auth.uid()::text = user_id::text);

-- Chat Messages policies
CREATE POLICY "Users can insert messages in their sessions"
ON chat_messages FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM chat_sessions
    WHERE chat_sessions.id::text = chat_messages.session_id::text
    AND chat_sessions.user_id::text = auth.uid()::text
  )
);

CREATE POLICY "Users can view messages in their sessions"
ON chat_messages FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM chat_sessions
    WHERE chat_sessions.id::text = chat_messages.session_id::text
    AND chat_sessions.user_id::text = auth.uid()::text
  )
);

CREATE POLICY "Users can update messages in their sessions"
ON chat_messages FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM chat_sessions
    WHERE chat_sessions.id::text = chat_messages.session_id::text
    AND chat_sessions.user_id::text = auth.uid()::text
  )
);

CREATE POLICY "Users can delete messages in their sessions"
ON chat_messages FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM chat_sessions
    WHERE chat_sessions.id::text = chat_messages.session_id::text
    AND chat_sessions.user_id::text = auth.uid()::text
  )
);

-- ════════════════════════════════════════════════════════════════════════
-- 3️⃣ BP Submissions (商业计划书上传)
-- ════════════════════════════════════════════════════════════════════════

-- 启用RLS
ALTER TABLE IF EXISTS bp_submissions ENABLE ROW LEVEL SECURITY;

-- 删除旧policies
DROP POLICY IF EXISTS "Users can insert their own BP submissions" ON bp_submissions;
DROP POLICY IF EXISTS "Users can view their own BP submissions" ON bp_submissions;
DROP POLICY IF EXISTS "Users can update their own BP submissions" ON bp_submissions;
DROP POLICY IF EXISTS "Users can delete their own BP submissions" ON bp_submissions;

-- 创建新policies
CREATE POLICY "Users can insert their own BP submissions"
ON bp_submissions FOR INSERT
TO authenticated
WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can view their own BP submissions"
ON bp_submissions FOR SELECT
TO authenticated
USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update their own BP submissions"
ON bp_submissions FOR UPDATE
TO authenticated
USING (auth.uid()::text = user_id::text)
WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete their own BP submissions"
ON bp_submissions FOR DELETE
TO authenticated
USING (auth.uid()::text = user_id::text);

-- ════════════════════════════════════════════════════════════════════════
-- 4️⃣ Story Interactions (Stories的Like/Save/Comment/Share)
-- ════════════════════════════════════════════════════════════════════════

-- 启用RLS
ALTER TABLE IF EXISTS story_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS story_saves ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS story_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS story_shares ENABLE ROW LEVEL SECURITY;

-- ────────────────────────────────────────────────────────────────────────
-- Story Likes
-- ────────────────────────────────────────────────────────────────────────

DROP POLICY IF EXISTS "Anyone can view likes" ON story_likes;
DROP POLICY IF EXISTS "Authenticated users can like stories" ON story_likes;
DROP POLICY IF EXISTS "Anonymous users can like stories" ON story_likes;
DROP POLICY IF EXISTS "Users can unlike their own likes" ON story_likes;
DROP POLICY IF EXISTS "Sessions can unlike their own likes" ON story_likes;

-- 查看likes（公开）
CREATE POLICY "Anyone can view likes"
ON story_likes FOR SELECT
TO public
USING (true);

-- 插入likes（认证用户）
CREATE POLICY "Authenticated users can like stories"
ON story_likes FOR INSERT
TO authenticated
WITH CHECK (auth.uid()::text = user_id::text);

-- 插入likes（匿名用户，通过session_id）
CREATE POLICY "Anonymous users can like stories"
ON story_likes FOR INSERT
TO anon
WITH CHECK (user_id IS NULL AND session_id IS NOT NULL);

-- 删除likes（认证用户）
CREATE POLICY "Users can unlike their own likes"
ON story_likes FOR DELETE
TO authenticated
USING (auth.uid()::text = user_id::text);

-- 删除likes（匿名用户）
CREATE POLICY "Sessions can unlike their own likes"
ON story_likes FOR DELETE
TO anon
USING (user_id IS NULL AND session_id IS NOT NULL);

-- ────────────────────────────────────────────────────────────────────────
-- Story Saves
-- ────────────────────────────────────────────────────────────────────────

DROP POLICY IF EXISTS "Users can view their own saves" ON story_saves;
DROP POLICY IF EXISTS "Users can save stories" ON story_saves;
DROP POLICY IF EXISTS "Users can unsave stories" ON story_saves;

-- 只有用户自己可以查看自己的saves
CREATE POLICY "Users can view their own saves"
ON story_saves FOR SELECT
TO authenticated
USING (auth.uid()::text = user_id::text);

-- 用户可以save stories
CREATE POLICY "Users can save stories"
ON story_saves FOR INSERT
TO authenticated
WITH CHECK (auth.uid()::text = user_id::text);

-- 用户可以unsave stories
CREATE POLICY "Users can unsave stories"
ON story_saves FOR DELETE
TO authenticated
USING (auth.uid()::text = user_id::text);

-- ────────────────────────────────────────────────────────────────────────
-- Story Comments
-- ────────────────────────────────────────────────────────────────────────

DROP POLICY IF EXISTS "Anyone can view comments" ON story_comments;
DROP POLICY IF EXISTS "Authenticated users can comment" ON story_comments;
DROP POLICY IF EXISTS "Anonymous users can comment" ON story_comments;
DROP POLICY IF EXISTS "Users can delete their own comments" ON story_comments;

-- 查看comments（公开）
CREATE POLICY "Anyone can view comments"
ON story_comments FOR SELECT
TO public
USING (true);

-- 插入comments（认证用户）
CREATE POLICY "Authenticated users can comment"
ON story_comments FOR INSERT
TO authenticated
WITH CHECK (auth.uid()::text = user_id::text);

-- 插入comments（匿名用户）
CREATE POLICY "Anonymous users can comment"
ON story_comments FOR INSERT
TO anon
WITH CHECK (user_id IS NULL AND session_id IS NOT NULL);

-- 删除comments（只有作者）
CREATE POLICY "Users can delete their own comments"
ON story_comments FOR DELETE
TO authenticated
USING (auth.uid()::text = user_id::text);

-- ────────────────────────────────────────────────────────────────────────
-- Story Shares
-- ────────────────────────────────────────────────────────────────────────

DROP POLICY IF EXISTS "Anyone can view shares" ON story_shares;
DROP POLICY IF EXISTS "Authenticated users can share stories" ON story_shares;
DROP POLICY IF EXISTS "Anonymous users can share stories" ON story_shares;

-- 查看shares（公开）
CREATE POLICY "Anyone can view shares"
ON story_shares FOR SELECT
TO public
USING (true);

-- 插入shares（认证用户）
CREATE POLICY "Authenticated users can share stories"
ON story_shares FOR INSERT
TO authenticated
WITH CHECK (auth.uid()::text = user_id::text OR user_id IS NULL);

-- 插入shares（匿名用户）
CREATE POLICY "Anonymous users can share stories"
ON story_shares FOR INSERT
TO anon
WITH CHECK (user_id IS NULL);

-- ════════════════════════════════════════════════════════════════════════
-- ✅ 完成！数据库表的RLS policies已全部设置
-- ════════════════════════════════════════════════════════════════════════

-- 验证所有表的RLS状态
SELECT 
  tablename,
  CASE WHEN rowsecurity THEN '✅ RLS已启用' ELSE '❌ RLS未启用' END as status
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN (
    'bmc_boards',
    'chat_sessions',
    'chat_messages',
    'bp_submissions',
    'story_likes',
    'story_saves',
    'story_comments',
    'story_shares'
  )
ORDER BY tablename;

-- ════════════════════════════════════════════════════════════════════════
-- ⚠️  重要提醒：Storage Policies
-- ════════════════════════════════════════════════════════════════════════
--
-- 以下Storage buckets的policies必须在Supabase Dashboard手动设置:
--
-- 1. bmc-images bucket
--    - Users can upload images to their folder (INSERT)
--    - Users can view their own images (SELECT)
--    - Users can delete their own images (DELETE)
--
-- 2. bp-documents bucket  
--    - Users can upload BP files to their folder (INSERT)
--    - Users can view their own BP files (SELECT)
--    - Users can update their own BP files (UPDATE)
--    - Users can delete their own BP files (DELETE)
--
-- 📖 详细设置步骤请查看: BP-STORAGE-POLICIES-COPY-PASTE.md
--
-- ════════════════════════════════════════════════════════════════════════

