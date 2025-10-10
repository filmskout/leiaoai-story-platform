# 修复Stories不显示问题

## 问题描述
主页和Stories页面都无法显示stories内容。

## 可能的原因
1. 数据库中的stories状态不是 `published`
2. 数据库中的stories `is_public` 字段为 `false`
3. stories缺少 `author_id`
4. stories缺少 `published_at` 时间戳

## 诊断步骤

### 方法1: 使用Web界面诊断
1. 访问: `https://leiaoai-story-platform.vercel.app/debug-stories`
2. 查看统计信息
3. 如果发现问题，点击"自动修复"按钮

### 方法2: 使用Supabase SQL Editor
1. 登录 [Supabase Dashboard](https://supabase.com)
2. 选择项目
3. 进入 SQL Editor
4. 运行诊断脚本：`scripts/check-and-fix-stories.sql`
5. 或运行快速修复脚本：`scripts/fix-stories-quick.sql`

## 快速修复SQL

在Supabase SQL Editor中运行以下SQL：

```sql
-- 1. 查看当前问题
SELECT 
  status,
  is_public,
  COUNT(*) as count
FROM stories
GROUP BY status, is_public;

-- 2. 如果发现stories的status不是'published'或is_public为false，运行修复：
UPDATE stories
SET 
  status = 'published',
  is_public = true,
  published_at = COALESCE(published_at, created_at),
  updated_at = NOW()
WHERE status != 'published' OR is_public = false OR published_at IS NULL;

-- 3. 确保所有stories都有author_id
UPDATE stories
SET 
  author_id = '8e19098b-ac2a-4ae0-b063-1e21a8dea19d',
  updated_at = NOW()
WHERE author_id IS NULL;

-- 4. 验证修复
SELECT COUNT(*) as published_stories
FROM stories
WHERE status = 'published' AND is_public = true;
```

## 验证修复

修复后，应该看到：
1. 主页的"Latest Stories"轮播显示stories
2. Stories页面的墙壁视图显示所有stories
3. Dashboard显示用户已发布的stories数量

## 前端查询逻辑

前端使用以下条件查询stories：
```typescript
.eq('status', 'published')
.eq('is_public', true)
```

因此数据库中的stories必须满足：
- `status = 'published'`
- `is_public = true`
- `author_id` 不为 NULL
- `published_at` 不为 NULL

## 预防措施

1. 创建新story时，确保设置正确的status和is_public
2. CreateStory页面已更新：
   - 保存草稿: `status='draft', is_public=false`
   - 发布: `status='published', is_public=true`
3. EditStory页面已更新：
   - 重新发布时更新 `published_at` 和 `updated_at`

## 相关文件
- `/src/components/stories/NewStoryCarousel.tsx` - 主页轮播
- `/src/components/stories/SimpleStoriesWall.tsx` - Stories页面墙壁
- `/src/pages/CreateStory.tsx` - 创建story
- `/src/pages/EditStory.tsx` - 编辑story
- `/src/pages/Profile.tsx` - 用户dashboard
- `/scripts/fix-stories-quick.sql` - 快速修复脚本
- `/scripts/check-and-fix-stories.sql` - 完整诊断脚本

## 联系支持
如果问题持续存在，请检查：
1. Supabase连接是否正常
2. 浏览器控制台是否有错误信息
3. Network标签中API请求的响应

