# Story系统实现指南

## 已完成功能

### 1. Story生成脚本
- **文件**: `scripts/generate-category-stories.mjs`
- **功能**: 使用LLM为每个category生成至少10篇Story
- **特性**:
  - 自动搜索项目并为每个category生成故事
  - 包含项目评分、用户体验、配图建议
  - 自动链接到项目和公司
  - 生成标签和分类

### 2. Category分页
- **路由**: `/stories/category/:category`
- **文件**: `src/pages/CategoryStories.tsx`
- **功能**: 显示特定category的所有stories
- **特性**:
  - 响应式卡片布局
  - 互动功能（Like、Save、Share）
  - 显示项目/公司链接
  - 分类标签和图标

### 3. Company详情页增强
- **文件**: `src/pages/CompanyDetail.tsx`
- **更新**: 
  - 显示完整的stories信息流
  - 包含封面图、摘要、互动统计
  - 支持导航状态传递

### 4. 导航回退机制
- **实现位置**: `StoryDetail.tsx`, `CompanyDetail.tsx`, `ProjectDetail.tsx`
- **功能**:
  - 记录来源页面（category/company/project）
  - 返回按钮正确导航到来源页面
  - 浏览器返回键支持

### 5. 互动功能
- **服务文件**: `src/services/storyInteractions.ts`
- **功能**:
  - Like/Unlike（带计数）
  - Save/Unsave（收藏）
  - Share（原生分享或剪贴板）
  - Comment（评论系统）

### 6. 数据库函数
- **文件**: `supabase/migrations/9999999999_add_story_count_functions.sql`
- **函数**:
  - `increment_story_count()`: 增加计数
  - `decrement_story_count()`: 减少计数

## 使用步骤

### 步骤1: 补齐缺失数据（估值和成立年份）

使用已有的脚本：
```bash
node scripts/enrich-companies-web.mjs
```

这将生成SQL文件到 `OUT/` 目录，在Supabase SQL Editor中执行。

### 步骤2: 生成Category Stories

1. **配置环境变量**（`.env`文件）:
```env
SUPABASE_URL=你的Supabase项目URL
SUPABASE_SERVICE_ROLE_KEY=你的Service Role密钥
PPLX_API_KEY=你的Perplexity API Key  # 推荐
# 或
OPENAI_API_KEY=你的OpenAI API Key
```

2. **运行生成脚本**:
```bash
node scripts/generate-category-stories.mjs
```

3. **脚本将**:
   - 为每个category查找相关项目
   - 为每个category生成至少10篇story
   - 自动插入到数据库
   - 链接story到项目和公司

### 步骤3: 执行数据库函数迁移

在Supabase SQL Editor中执行：
```sql
-- 运行文件: supabase/migrations/9999999999_add_story_count_functions.sql
```

这将创建计数函数，支持Like、Share、Save、Comment的自动计数。

### 步骤4: 验证功能

1. **检查Category页面**: 访问 `/stories/category/{category-name}`
2. **检查Company页面**: 访问 `/ai-companies/{company-id}`，查看stories部分
3. **测试导航**: 
   - 从category页面进入story，返回应回到category页面
   - 从company页面进入story，返回应回到company页面
4. **测试互动**: Like、Save、Share、Comment功能

## 路由结构

```
/stories                          # Stories主页面
/stories/category/:category       # Category分页（新）
/story/:id                        # Story详情页（支持回退）
/ai-companies                     # 公司目录
/ai-companies/:id                 # 公司详情（显示stories）
/project/:id                      # 项目详情
```

## 数据结构

### Story表字段
- `id`: UUID
- `title`: 标题
- `content`: 内容
- `excerpt`: 摘要
- `cover_image_url`: 封面图
- `category`: 分类（对应project_category）
- `tags`: 标签数组
- `likes_count`, `comments_count`, `saves_count`, `share_count`: 计数
- `author_id`: 作者ID（系统用户）
- `ai_generated`: 是否AI生成
- `status`: 状态（'published'）

### 关联表
- `project_stories`: story与project的关联
- `company_stories`: story与company的关联
- `story_likes`: 点赞记录
- `story_saves`: 收藏记录
- `story_comments`: 评论记录

## 下一步工作

1. **完善Comment组件**: 实现完整的评论显示和交互
2. **添加图片生成**: 使用AI生成真实的配图（而非Unsplash占位）
3. **Story详情页增强**: 显示更多相关信息、相关stories推荐
4. **搜索和过滤**: 在Stories页面添加搜索和过滤功能
5. **用户生成内容**: 允许用户创建自己的stories

## 注意事项

- Story生成需要API密钥（Perplexity或OpenAI）
- 生成过程可能需要较长时间（每个category约20-30秒）
- 确保数据库中有足够的项目数据
- Story会链接到第一个匹配的项目和公司

