# 🐛 待修复的问题清单

## 问题总结
用户报告了8个需要修复的问题，按优先级排序：

---

## 🔴 高优先级

### 1. Professional Services Area建议问题跳转
**问题**: 点击建议问题应该跳转到AI Chat并自动发送
**当前状态**: 跳转正常，但不自动发送
**位置**: `src/components/professional/ExpertiseCards.tsx` L228, L242
**修复方案**: 使用`state: { autoAsk: true, question }`传递到AI Chat页面

### 2. OpenAI和DeepSeek不工作
**问题**: 只有Qwen返回结果，OpenAI和DeepSeek失败
**根本原因**: Vercel未配置`OPENAI_API_KEY`和`DEEPSEEK_API_KEY`
**位置**: `api/ai-chat.ts` L52, L60
**修复方案**: 
- 用户需要在Vercel配置环境变量
- 添加前端友好错误提示

### 3. AI故事生成器不工作
**问题**: 输入提示并点击生成没有反应
**位置**: `src/pages/CreateStory.tsx` L155-191
**可能原因**: 
- Supabase Edge Function `ai-story-generator` 未部署或错误
- 缺少DeepSeek API密钥
**修复方案**: 检查函数调用和错误处理

---

## 🟡 中优先级

### 4. 故事加载问题
**问题**: 从详细视图返回时故事加载失败
**位置**: `src/pages/StoryDetail.tsx`, `src/pages/Stories.tsx`
**可能原因**: 状态管理或缓存问题
**修复方案**: 使用React Query或改进状态管理

### 5. 点赞功能
**问题**: 点赞不正常工作
**位置**: 
- `src/components/stories/SocialInteractions.tsx`
- `supabase/functions/story-interactions/index.ts`
**可能原因**: Supabase Edge Function问题
**修复方案**: 检查API调用和状态更新

### 6. 标签加载和标签系统
**问题**: 标签不加载，标签系统需要重新检查
**位置**: 
- `src/pages/Stories.tsx`
- `src/components/stories/TagDisplay.tsx`
**可能原因**: 数据库查询或组件渲染问题
**修复方案**: 检查标签加载逻辑

---

## 🟢 低优先级

### 7. Processing Logo效果
**问题**: 需要替换为更标准的视觉效果
**当前状态**: 使用彩色A Logo切换
**位置**: `src/components/UnifiedLoader.tsx`
**修复方案**: 添加标准的spinner或progress bar选项

---

## 🔧 修复顺序

1. ✅ Professional Services Area自动发送问题（最简单）
2. ✅ Processing Logo效果（UI优化）
3. ⚠️ OpenAI/DeepSeek API密钥（需要用户配置）
4. 🔍 AI故事生成器（需要调试）
5. 🔍 故事加载问题（需要调试）
6. 🔍 点赞功能（需要调试Edge Function）
7. 🔍 标签系统（需要调试数据库）

---

## 📝 详细修复计划

### Fix 1: Professional Services Area自动发送
```typescript
// ExpertiseCards.tsx L228, L242
// 修改导航逻辑，添加 state
navigate(`/ai-chat`, { 
  state: { 
    autoAsk: true, 
    question: randomQuestion 
  } 
});
```

### Fix 2: Processing Logo
```typescript
// UnifiedLoader.tsx
// 添加新的 variant: 'spinner' | 'progress'
// 使用标准的旋转spinner替代彩色Logo切换
```

### Fix 3: OpenAI/DeepSeek API
```markdown
用户操作：
1. 访问 Vercel Dashboard → Settings → Environment Variables
2. 添加 OPENAI_API_KEY=sk-...
3. 添加 DEEPSEEK_API_KEY=sk-...
4. Redeploy

代码改进：
- 添加前端友好错误提示
- 在Settings页面添加API密钥配置提示
```

### Fix 4-7: 需要调试
这些问题需要更深入的调试和测试。

---

## ✅ 完成标记
- [ ] Fix 1: Professional Services自动发送
- [ ] Fix 2: Processing Logo
- [ ] Fix 3: OpenAI/DeepSeek提示
- [ ] Fix 4: 故事加载
- [ ] Fix 5: 点赞功能
- [ ] Fix 6: 标签系统
- [ ] Fix 7: AI故事生成器

