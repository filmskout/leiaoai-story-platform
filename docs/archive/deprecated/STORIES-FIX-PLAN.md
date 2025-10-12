# Stories功能修复计划

生成时间: 2025-10-11

## 🔍 发现的问题

### 1. 标签系统混乱

#### 问题描述:
代码中存在3个不同的标签相关表，使用不一致：
- `story_tags` - 在 `MultiTagSelector.tsx` 和 `CreateStory.tsx` 中使用
- `tags` - 在 `SimpleStoriesWall.tsx` 和 `PinterestStories.tsx` 中使用  
- `story_tag_assignments` - 在types.ts中定义但很少使用

#### 根本原因:
数据库Schema设计混乱，应该使用以下结构：
- `tags` 表 - 存储所有可用标签
- `story_tag_assignments` 表 - 存储story和tag的多对多关联

#### 修复方案:
1. 统一使用 `tags` 表存储标签
2. 统一使用 `story_tag_assignments` 表存储关联
3. 删除或弃用 `story_tags` 表（如果它是junction table的话）
4. 更新所有组件使用正确的表名

### 2. Story加载时标签为空

#### 问题:
`SimpleStoriesWall.tsx` 的 `loadStoriesTags` 函数直接设置空数组：
```typescript
stories.forEach(story => {
  story.tags = [];
});
```

#### 修复方案:
正确查询并加载每个story的tags：
```typescript
const { data: storyTagsData } = await supabase
  .from('story_tag_assignments')
  .select('story_id, tags!inner(id, name, display_name, color)')
  .in('story_id', storyIds);
```

### 3. 交互功能依赖Edge Function

#### 问题:
`SocialInteractions.tsx` 调用 `story-interactions` Edge Function，但这个函数可能没有正确实现

#### 修复方案:
检查并修复 Supabase Edge Function，或者直接在前端调用Supabase数据库API

### 4. Dashboard统计不同步

#### 问题:
Like/Save/Comment的统计数据没有正确聚合到Dashboard

#### 修复方案:
确保以下表正确更新和查询：
- `story_likes` - 点赞记录
- `story_saves` - 收藏记录
- `story_comments` - 评论记录
- `stories` 表的计数字段 (`like_count`, `saves_count`, `comment_count`)

---

## 📋 修复步骤

### 步骤1: 统一标签数据库Schema (最重要)

**目标结构:**
```sql
-- 标签表
CREATE TABLE tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  color TEXT,
  usage_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Story-Tag关联表
CREATE TABLE story_tag_assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  story_id UUID REFERENCES stories(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(story_id, tag_id)
);
```

**如果`story_tags`是junction table，需要:**
1. 迁移数据到 `story_tag_assignments`
2. 删除 `story_tags` 表
3. 更新所有代码引用

**如果`story_tags`是tags表本身，需要:**
1. 重命名 `story_tags` 为 `tags`
2. 创建 `story_tag_assignments` junction table
3. 更新所有代码引用

### 步骤2: 修复前端组件

#### 2.1 `MultiTagSelector.tsx`
- 查询 `tags` 表而非 `story_tags`
- 创建新tag时插入到 `tags` 表

#### 2.2 `SimpleStoriesWall.tsx`
- 实现正确的 `loadStoriesTags` 函数
- 使用 `story_tag_assignments` 关联查询

#### 2.3 `CreateStory.tsx` 和 `EditStory.tsx`
- 保存tags时使用 `story_tag_assignments` 表
- 删除旧tags再插入新tags

#### 2.4 `StoryDetail.tsx`
- 加载story时正确查询tags
- 显示tags

### 步骤3: 修复交互功能

#### 3.1 检查数据库表是否存在:
- `story_likes`
- `story_saves`
- `story_comments`
- `story_shares`
- `story_views`

#### 3.2 创建/修复 Edge Function: `story-interactions`
或者直接在前端实现：

**Like功能:**
```typescript
// Like
await supabase.from('story_likes').insert({
  story_id: storyId,
  user_id: userId
});

// Update count
await supabase.rpc('increment_story_like_count', { story_id: storyId });
```

**Save功能:**
```typescript
// Save
await supabase.from('story_saves').insert({
  story_id: storyId,
  user_id: userId
});
```

**Comment功能:**
```typescript
// Comment
await supabase.from('story_comments').insert({
  story_id: storyId,
  user_id: userId,
  content: comment
});

// Update count
await supabase.rpc('increment_story_comment_count', { story_id: storyId });
```

#### 3.3 创建Database Functions
```sql
-- Increment like count
CREATE OR REPLACE FUNCTION increment_story_like_count(story_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE stories
  SET like_count = like_count + 1
  WHERE id = story_id;
END;
$$ LANGUAGE plpgsql;

-- Decrement like count
CREATE OR REPLACE FUNCTION decrement_story_like_count(story_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE stories
  SET like_count = GREATEST(like_count - 1, 0)
  WHERE id = story_id;
END;
$$ LANGUAGE plpgsql;

-- Similar functions for comment_count, saves_count
```

### 步骤4: 修复Dashboard统计同步

#### 4.1 Profile.tsx 查询修复
```typescript
// Load user's liked stories
const { data: likedStories } = await supabase
  .from('story_likes')
  .select('story_id, stories!inner(id, title)')
  .eq('user_id', user.id);

// Load user's saved stories
const { data: savedStories } = await supabase
  .from('story_saves')
  .select('story_id, stories!inner(id, title, featured_image_url)')
  .eq('user_id', user.id);

// Load total likes received (for user's stories)
const { data: userStories } = await supabase
  .from('stories')
  .select('like_count, comment_count, saves_count')
  .eq('author', user.id);

const totalLikesReceived = userStories?.reduce((sum, s) => sum + s.like_count, 0) || 0;
```

---

## 🗄️ 数据库迁移SQL

### 方案A: 如果story_tags是junction table

```sql
-- 1. 备份数据
CREATE TABLE story_tags_backup AS SELECT * FROM story_tags;

-- 2. 如果tags表不存在，从story_tags提取unique tags
INSERT INTO tags (name, display_name, color, usage_count, is_active)
SELECT DISTINCT
  name,
  COALESCE(display_name, name) as display_name,
  COALESCE(color, '#3B82F6') as color,
  COALESCE(usage_count, 0) as usage_count,
  COALESCE(is_active, true) as is_active
FROM story_tags
ON CONFLICT (name) DO NOTHING;

-- 3. 迁移junction数据到story_tag_assignments
INSERT INTO story_tag_assignments (story_id, tag_id)
SELECT DISTINCT
  st.story_id,
  t.id as tag_id
FROM story_tags st
JOIN tags t ON t.name = st.name
ON CONFLICT (story_id, tag_id) DO NOTHING;

-- 4. 验证数据迁移
SELECT COUNT(*) FROM story_tags; -- 原始数据
SELECT COUNT(*) FROM story_tag_assignments; -- 应该相同或相近

-- 5. 删除旧表 (谨慎!)
-- DROP TABLE story_tags;
```

### 方案B: 如果story_tags就是tags表

```sql
-- 1. 重命名表
ALTER TABLE story_tags RENAME TO tags;

-- 2. 创建junction table (如果不存在)
CREATE TABLE IF NOT EXISTS story_tag_assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  story_id UUID REFERENCES stories(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(story_id, tag_id)
);

-- 3. 如果有旧的关联数据在其他表，迁移它们
-- (需要根据实际情况调整)
```

### 创建必要的表 (如果不存在)

```sql
-- Story Likes
CREATE TABLE IF NOT EXISTS story_likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  story_id UUID REFERENCES stories(id) ON DELETE CASCADE,
  user_id UUID,
  session_id TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(story_id, user_id),
  UNIQUE(story_id, session_id)
);

-- Story Saves
CREATE TABLE IF NOT EXISTS story_saves (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  story_id UUID REFERENCES stories(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(story_id, user_id)
);

-- Story Comments
CREATE TABLE IF NOT EXISTS story_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  story_id UUID REFERENCES stories(id) ON DELETE CASCADE,
  user_id UUID,
  session_id TEXT,
  content TEXT NOT NULL,
  author_name TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Story Shares
CREATE TABLE IF NOT EXISTS story_shares (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  story_id UUID REFERENCES stories(id) ON DELETE CASCADE,
  user_id UUID,
  session_id TEXT,
  platform TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Story Views
CREATE TABLE IF NOT EXISTS story_views (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  story_id UUID REFERENCES stories(id) ON DELETE CASCADE,
  user_id UUID,
  session_id TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_story_likes_story_id ON story_likes(story_id);
CREATE INDEX IF NOT EXISTS idx_story_likes_user_id ON story_likes(user_id);
CREATE INDEX IF NOT EXISTS idx_story_saves_story_id ON story_saves(story_id);
CREATE INDEX IF NOT EXISTS idx_story_saves_user_id ON story_saves(user_id);
CREATE INDEX IF NOT EXISTS idx_story_comments_story_id ON story_comments(story_id);
CREATE INDEX IF NOT EXISTS idx_story_tag_assignments_story_id ON story_tag_assignments(story_id);
CREATE INDEX IF NOT EXISTS idx_story_tag_assignments_tag_id ON story_tag_assignments(tag_id);
```

### 创建Database Functions

```sql
-- Increment like count
CREATE OR REPLACE FUNCTION increment_story_like_count(p_story_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE stories
  SET like_count = like_count + 1,
      updated_at = now()
  WHERE id = p_story_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Decrement like count
CREATE OR REPLACE FUNCTION decrement_story_like_count(p_story_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE stories
  SET like_count = GREATEST(like_count - 1, 0),
      updated_at = now()
  WHERE id = p_story_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Increment comment count
CREATE OR REPLACE FUNCTION increment_story_comment_count(p_story_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE stories
  SET comment_count = comment_count + 1,
      updated_at = now()
  WHERE id = p_story_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update tag usage count
CREATE OR REPLACE FUNCTION update_tag_usage_count(p_tag_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE tags
  SET usage_count = (
    SELECT COUNT(*)
    FROM story_tag_assignments
    WHERE tag_id = p_tag_id
  )
  WHERE id = p_tag_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

## 🧪 测试清单

### 标签系统测试
- [ ] 创建新story时可以选择/创建tags
- [ ] Tags显示在story列表中
- [ ] Tags显示在story详情页
- [ ] 点击tag可以过滤stories
- [ ] Tag usage_count正确更新
- [ ] 编辑story时可以修改tags

### 交互功能测试
- [ ] 点赞功能工作
- [ ] 取消点赞功能工作
- [ ] 收藏功能工作
- [ ] 取消收藏功能工作
- [ ] 评论功能工作
- [ ] 分享功能工作
- [ ] 计数器实时更新

### Dashboard测试
- [ ] "Stories Published" 正确统计
- [ ] "Likes Received" 正确统计（自己stories的总点赞）
- [ ] "Comments Made" 正确统计
- [ ] "Saved Stories" 正确统计
- [ ] "My Stories" 显示自己的stories
- [ ] "Saved Stories" 显示收藏的stories
- [ ] Like/Comment/Save数字正确显示

---

## 📝 实施优先级

### 🔴 高优先级 (必须先做)
1. 统一标签数据库Schema
2. 修复标签加载和显示
3. 修复标签过滤

### 🟡 中优先级
4. 实现Like/Save/Comment功能
5. 修复Dashboard统计

### 🟢 低优先级
6. Share功能优化
7. View统计
8. 性能优化

---

## 🚀 准备开始实施

建议顺序：
1. 先调查数据库当前状态（story_tags是什么？）
2. 运行数据库迁移
3. 修复前端组件
4. 测试完整流程

