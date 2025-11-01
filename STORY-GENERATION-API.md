# Story生成API使用指南

## 概述

已实现基于LLM的Story生成功能，能够在权威主流媒体中搜索原文，并生成包含项目评分的真实用户故事。

## API端点

### 1. 生成单个Story

**端点**: `/api/unified`  
**方法**: `POST`

**请求体**:
```json
{
  "action": "generate-story",
  "token": "admin-token-123",
  "companyId": "company-uuid",  // 可选
  "projectId": "project-uuid",   // 可选，至少需要提供companyId或projectId
  "category": "LLM & Language Models"  // 可选，如果不提供会使用项目的category
}
```

**响应示例**:
```json
{
  "success": true,
  "message": "Story生成成功",
  "story": {
    "id": "story-uuid",
    "title": "...",
    "content": "...",
    "excerpt": "...",
    "rating": 4.5,
    "source_media": "TechCrunch"
  }
}
```

### 2. 批量生成Stories

**端点**: `/api/unified`  
**方法**: `POST`

**请求体**:
```json
{
  "action": "generate-stories-batch",
  "token": "admin-token-123",
  "category": "LLM & Language Models",  // 可选，按类别筛选
  "companyId": "company-uuid",          // 可选，按公司筛选
  "count": 10                           // 可选，默认10
}
```

**响应示例**:
```json
{
  "success": true,
  "message": "批量生成完成: 8/10 成功",
  "results": [
    {
      "success": true,
      "project": "Project Name",
      "storyId": "story-uuid",
      "rating": 4.5,
      "source_media": "TechCrunch"
    }
  ]
}
```

## 功能特点

1. **权威媒体搜索**: 使用LLM在TechCrunch、The Verge、Wired、Ars Technica、MIT Technology Review等权威媒体中搜索原文
2. **真实评测**: 基于媒体评测生成包含专业评分的用户故事
3. **项目评分**: 自动更新项目的rating字段
4. **自动关联**: 自动将story链接到对应的公司和项目
5. **封面图片**: 使用Unsplash自动生成相关封面图片

## LLM API配置

系统会自动使用以下环境变量（按优先级）：
1. `QWEN_API_KEY` + `QWEN_REGION` (默认: 'singapore')
2. `OPENAI_API_KEY`

在Vercel或Supabase的环境变量中配置这些key即可。

## 生成内容包含

- **标题**: 吸引人的标题（50-80字符）
- **内容**: 详细的用户使用体验（600-1000字）
  - 首次使用印象
  - 核心功能测试
  - 实际应用场景
  - 优缺点分析
  - 竞品对比
  - 专业评分
  - 推荐建议
- **摘要**: 2-3句话总结
- **标签**: 3-5个相关标签
- **项目评分**: 1-5星，精确到0.5

## 使用示例

### JavaScript/TypeScript调用

```typescript
// 生成单个story
const response = await fetch('/api/unified', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    action: 'generate-story',
    token: localStorage.getItem('leoai-admin-session') || 'admin-token-123',
    projectId: 'project-uuid-here',
    category: 'LLM & Language Models'
  })
});

const result = await response.json();
if (result.success) {
  console.log('Story生成成功:', result.story);
  console.log('项目评分:', result.rating);
}
```

### 批量生成

```typescript
// 为某个类别的所有项目生成stories
const response = await fetch('/api/unified', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    action: 'generate-stories-batch',
    token: localStorage.getItem('leoai-admin-session') || 'admin-token-123',
    category: 'LLM & Language Models',
    count: 10
  })
});

const result = await response.json();
console.log(`成功生成 ${result.results.filter(r => r.success).length} 个stories`);
```

## 注意事项

1. **限流**: 批量生成时，每次请求之间会自动等待2秒，避免API限流
2. **权限**: 需要管理员token才能调用
3. **LLM响应时间**: 深度研究模式可能需要60-90秒，请耐心等待
4. **错误处理**: 如果LLM API不可用，会返回明确的错误信息

## 数据库表结构要求

- `stories` 表必须存在
- `company_stories` 关联表（用于链接公司和story）
- `project_stories` 关联表（如果存在，用于链接项目和story）
- `projects` 表需要有 `rating` 字段（用于更新项目评分）

## 故障排除

如果遇到"没有可用的LLM API"错误：
1. 检查Vercel/Supabase环境变量中是否配置了 `QWEN_API_KEY` 或 `OPENAI_API_KEY`
2. 确保API key有效且有足够额度
3. 检查网络连接是否正常

