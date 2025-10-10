# 故事系统整合文档

## 概述
本文档记录了故事展示和创建系统的整合，简化了架构并改善了用户体验。

## 核心改进

### 1. 故事展示组件整合

**之前的问题：**
- 多个重复的故事展示组件（StoryCarousel, NewStoryCarousel, NewStoriesGrid, PinterestStories）
- 功能重叠，维护困难
- 数据库字段不一致（publisher vs author）

**整合后：**
- **主页**：使用 `NewStoryCarousel` - 轮播展示，左对齐标题和副标题
- **Stories页面**：使用 `PinterestStories` - Pinterest瀑布流墙，支持标签筛选和排序
- 删除冗余组件：`StoryCarousel.tsx`, `NewStoriesGrid.tsx`

### 2. 故事创建流程简化

**单一创建流程：**
- 路径：`/create-story`
- 组件：`CreateStory.tsx`

**新增功能：**

#### 草稿保存
```typescript
// 保存草稿
handleSaveDraft() {
  - 仅需标题即可保存
  - 自动保存到stories表，status='draft'
  - 更新时自动更新updated_at
  - 保存成功后显示draftId
}
```

#### 发布故事
```typescript
// 发布故事
handleSubmit() {
  - 需要标题和内容
  - 如果有draftId，更新草稿并发布
  - 如果没有draftId，创建新故事并发布
  - status='published', is_public=true
  - 保存标签关联
  - 跳转到故事详情页
}
```

**权限控制：**
- 未登录用户尝试保存草稿或发布 → 重定向到登录页
- 登录用户可以保存草稿和发布

### 3. 仪表板草稿管理

**新增Drafts标签：**
- 位置：`/dashboard` 或 `/profile` 的Drafts标签
- 功能：
  - 显示用户的所有草稿（仅作者可见）
  - 按更新时间倒序排列
  - 显示草稿徽章
  - 点击草稿卡片或编辑按钮 → 跳转到编辑页面

**草稿卡片信息：**
- 标题
- 摘要（前150字符）
- 最后编辑时间
- Draft徽章
- 编辑按钮

### 4. 数据库字段统一

**修复的组件：**
- `NewStoryCarousel.tsx`：`publisher` → `author`
- `StoryCarousel.tsx`：`publisher` → `author` (已删除)
- `NewStoriesGrid.tsx`：`publisher` → `author` (已删除)
- `PinterestStories.tsx`：`publisher` → `author`
- `Profile.tsx`：`author_id` → `author`

## 组件架构

### 保留的故事展示组件

#### 1. NewStoryCarousel
- **用途**：主页故事轮播
- **特点**：
  - 左对齐标题和副标题
  - 响应式设计
  - 支持移动端和桌面端
  - 获取最新发布的故事

#### 2. PinterestStories
- **用途**：Stories页面瀑布流展示
- **特点**：
  - Pinterest风格布局
  - 标签筛选
  - 排序功能（最新、最旧、最受欢迎、浏览量）
  - 无限滚动加载
  - 支持分类过滤

### 辅助组件

- `TagDisplay.tsx`：标签显示
- `SocialInteractions.tsx`：社交互动（点赞、评论、分享）
- `MultiTagSelector.tsx`：多标签选择器
- `EnhancedSharing.tsx`：增强分享功能
- `CommentSystem.tsx`：评论系统

## 数据流

### 草稿工作流

```
1. 用户登录 → /create-story
2. 填写标题（必填）
3. 点击"Save Draft"
   ↓
   保存到stories表
   status = 'draft'
   is_public = false
   author = user.id
   ↓
4. 继续编辑或稍后编辑
5. 从Dashboard的Drafts标签访问
6. 点击编辑 → /edit-story/:id
7. 完善内容
8. 点击"Publish Story"
   ↓
   更新stories表
   status = 'published'
   is_public = true
   ↓
9. 跳转到故事详情页
```

### 发布工作流

```
1. 用户登录 → /create-story
2. 填写标题和内容（必填）
3. 选择分类和标签（可选）
4. 上传媒体文件（可选）
5. 点击"Publish Story"
   ↓
   插入到stories表
   status = 'published'
   is_public = true
   author = user.id
   ↓
6. 保存标签关联到story_tags表
7. 跳转到故事详情页
```

## Stories页面CTA模块

**更新：**
- 背景色：橙色 (#f97316)，深色和浅色模式统一
- 按钮样式：
  - "Create Story"按钮：
    - 深色模式：灰色背景 + 白色文字
    - 浅色模式：白色背景 + 黑色文字
  - "Need Ideas? Chat with AI"按钮：
    - 深色模式：黑色背景 + 白色文字
    - 浅色模式：白色背景 + 灰色文字
- 文本可见性：白色文字在橙色背景上清晰可见

## API端点

### 故事相关

```typescript
// 获取已发布故事
GET /stories?status=published&is_public=true

// 获取用户草稿
GET /stories?author=:userId&status=draft

// 创建草稿
POST /stories
{
  title: string,
  content?: string,
  status: 'draft',
  is_public: false,
  author: userId
}

// 更新草稿
PATCH /stories/:id
{
  title: string,
  content?: string,
  updated_at: timestamp
}

// 发布故事
PATCH /stories/:id
{
  status: 'published',
  is_public: true,
  featured_image_url?: string
}
```

## UI/UX改进

1. **主页**
   - Latest Stories标题左对齐
   - 轮播展示最新故事
   - "Create Story"按钮在右上角

2. **Stories页面**
   - Pinterest瀑布流布局
   - 标签筛选器
   - 排序选项
   - 橙色CTA模块

3. **仪表板**
   - 新增Drafts标签
   - 草稿列表展示
   - 快速编辑入口
   - 徽章标识草稿状态

4. **创建故事页**
   - 保存草稿按钮
   - 发布故事按钮
   - AI辅助生成内容
   - 媒体文件上传

## 权限和可见性

| 操作 | 未登录用户 | 登录用户 | 故事作者 |
|------|-----------|---------|---------|
| 查看已发布故事 | ✅ | ✅ | ✅ |
| 保存草稿 | ❌ (重定向登录) | ✅ | ✅ |
| 发布故事 | ❌ (重定向登录) | ✅ | ✅ |
| 查看草稿列表 | ❌ | ✅ (仅自己的) | ✅ |
| 编辑草稿 | ❌ | ❌ | ✅ (仅自己的) |
| 编辑已发布故事 | ❌ | ❌ | ✅ (仅自己的) |
| 保存他人故事 | ❌ | ✅ | ✅ |
| 评论故事 | ❌ | ✅ | ✅ |

## 国际化更新

新增翻译键：

```json
{
  "story": {
    "login_required": "请登录以保存草稿/发布故事",
    "title_required": "标题为必填项",
    "draft_saved": "草稿已保存",
    "draft_updated": "草稿已更新",
    "draft_error": "保存草稿失败",
    "save_draft": "保存草稿",
    "update_draft": "更新草稿",
    "saving_draft": "保存中...",
    "published": "故事已发布！",
    "create": "创建故事",
    "create_first": "创建您的第一个故事"
  },
  "profile": {
    "tabs": {
      "drafts": "草稿"
    },
    "my_drafts": "我的草稿",
    "drafts_desc": "未发布的草稿 - 仅您可见",
    "no_drafts": "暂无草稿",
    "last_edited": "最后编辑"
  }
}
```

## 测试场景

### 草稿功能测试

1. **创建草稿**
   - 未登录用户尝试保存 → 重定向到登录
   - 登录用户仅填写标题 → 保存成功
   - 保存后继续编辑 → 更新草稿

2. **草稿列表**
   - Dashboard显示草稿标签
   - 草稿按更新时间排序
   - 显示草稿徽章
   - 点击草稿进入编辑页

3. **发布草稿**
   - 从草稿编辑页发布
   - 状态更新为published
   - 跳转到故事详情页
   - Dashboard中草稿消失，出现在Stories标签

### 故事展示测试

1. **主页轮播**
   - 显示最新12个故事
   - 左对齐标题
   - 响应式布局
   - 标签正确显示

2. **Stories页面**
   - Pinterest布局
   - 标签筛选工作正常
   - 排序功能正常
   - 无限滚动加载

## 部署清单

- [x] 删除冗余组件文件
- [x] 更新所有导入路径
- [x] 数据库字段统一
- [x] 添加草稿功能
- [x] 更新仪表板UI
- [x] 国际化翻译
- [x] 样式优化（橙色CTA）
- [x] 权限控制
- [x] Linter检查通过
- [x] Git提交和推送
- [x] Vercel自动部署

## 下一步优化

1. **草稿自动保存**
   - 定时自动保存草稿
   - 防止内容丢失

2. **协作功能**
   - 草稿分享
   - 多人协作编辑

3. **版本控制**
   - 故事编辑历史
   - 版本回滚

4. **高级编辑器**
   - 富文本编辑
   - Markdown支持
   - 代码高亮

5. **SEO优化**
   - 故事元数据
   - Open Graph标签
   - 结构化数据

## 相关文档

- [Vercel部署指南](./vercel-setup.md)
- [Admin设置指南](./ADMIN-SETUP.md)
- [AI聊天测试指南](./AI-CHAT-TESTING.md)
- [主README](../README.md)

