# 待修复问题清单

生成时间: 2025-10-11

## 🔴 高优先级

### 1. BMC 保存到 Dashboard 功能
**状态**: 🔴 未解决  
**问题**: BMC保存功能不工作  
**需要调试**:
- 检查Supabase Storage上传是否成功
- 检查bucket权限配置
- 检查数据库插入是否成功
- 添加更详细的错误日志

**调试步骤**:
1. 打开浏览器Console (F12)
2. 访问 /bp-analysis > BMC Canvas
3. 填写内容并点击"Save to Dashboard"
4. 查看Console日志:
   - 🔵 应该看到每一步的日志
   - 🔴 查找错误信息

**可能原因**:
- Supabase Storage bucket权限问题
- 文件上传失败
- 数据库RLS策略阻止插入
- 前端代码逻辑错误

---

### 2. Stories 交互功能（Like/Save/Comment/Share）
**状态**: 🔴 未解决  
**问题**: 交互数据不正确同步到Dashboard  

**需要修复**:
- Like功能：点赞后应更新story_likes表和story统计
- Save功能：保存后应更新user_saves表和Dashboard"Saved Stories"计数
- Comment功能：评论后应更新story_comments表和story统计
- Share功能：分享后应更新story_shares表和story统计

**涉及表**:
- `stories` - view_count, like_count, comment_count, share_count
- `story_likes` - 用户点赞记录
- `user_saves` - 用户保存记录
- `story_comments` - 评论记录
- `story_shares` - 分享记录

**涉及文件**:
- `src/components/stories/SocialInteractions.tsx`
- `src/pages/Dashboard.tsx`
- Supabase Edge Function: `story-interactions`

---

### 3. Stories 标签系统（Tagging）
**状态**: 🔴 未解决  
**问题**: 标签系统不工作  

**需要检查**:
- 标签数据是否正确加载
- 标签筛选是否工作
- 故事创建/编辑时标签是否正确保存
- 标签显示是否正确

**涉及文件**:
- `src/components/stories/SimpleStoriesWall.tsx`
- `src/pages/CreateStory.tsx`
- `src/pages/EditStory.tsx`

---

## 🟡 中优先级

### 4. 公开用户资料页面
**状态**: 🟡 待实现  
**需求**: 创建可分享的公开用户资料页面  

**功能需求**:
1. **顶部统计区域**:
   - 用户头像和基本信息
   - Stories Published（已发布故事数）
   - Likes Received（收到的点赞数）
   - Followers（关注者数）
   - Following（关注数）

2. **交互功能**:
   - Follow/Unfollow 按钮
   - Share Profile 按钮
   - Like功能

3. **内容区域**:
   - Tab 1: Stories（该用户发布的所有故事）
   - Tab 2: Achievements/Badges（徽章和成就）

4. **URL结构**:
   - `/profile/:userId` 或 `/u/:username`
   - 可分享链接

**涉及组件**:
- 新建: `src/pages/PublicProfile.tsx`
- 复用: `src/components/stories/StoryCard.tsx`
- 复用: `src/components/ui/Avatar.tsx`

**数据库需求**:
- `user_follows` 表（关注关系）
- `profiles` 表（公开资料）
- `user_social_stats` 表（统计数据）

---

### 5. AI Chat 会话保存到 Dashboard
**状态**: 🟡 待实现  
**问题**: Chat sessions没有显示在Dashboard  

**需要**:
- 确认`chat_sessions`表有数据
- 在Dashboard添加"Chat History"模块
- 显示会话列表（标题、时间、模型）
- 点击可查看完整对话
- 可以删除会话

**涉及文件**:
- `src/pages/Dashboard.tsx`
- `src/hooks/useAIChat.ts`（已有保存逻辑）

---

## 🟢 低优先级

### 6. Settings页面翻译文本
**状态**: ✅ 已修复  
**修复**: 添加了fallback文本  
**提交**: 待推送

---

## 📊 实施计划

### 阶段 1: 调试和修复（1-2小时）
1. ✅ Settings翻译文本
2. 🔴 调试BMC保存功能
3. 🔴 修复Stories交互功能
4. 🔴 修复Stories标签系统

### 阶段 2: 新功能实现（2-3小时）
5. 🟡 实现公开用户资料页面
6. 🟡 实现Chat History in Dashboard

---

## 🧪 测试清单

### BMC保存测试
- [ ] 登录用户
- [ ] 填写BMC Canvas
- [ ] 点击Save to Dashboard
- [ ] 检查Console无错误
- [ ] 检查Dashboard显示BMC
- [ ] 检查可以下载图片

### Stories交互测试
- [ ] 点赞story后，like_count增加
- [ ] Dashboard "Likes Received"增加
- [ ] 保存story后，出现在Dashboard "Saved Stories"
- [ ] 评论story后，comment_count增加
- [ ] 分享story后，share_count增加

### 标签系统测试
- [ ] Stories页面标签筛选工作
- [ ] 创建story时可以选择标签
- [ ] Story详情页显示标签
- [ ] 点击标签可以筛选相关stories

### 公开资料测试
- [ ] 访问 /profile/:userId
- [ ] 显示用户统计
- [ ] 显示用户stories
- [ ] 显示用户badges
- [ ] Follow/Unfollow工作
- [ ] 分享链接可访问

---

## 📝 注意事项

1. **所有修改都要添加Console日志**用于调试
2. **测试前先检查Supabase配置**（Tables, RLS, Storage）
3. **逐个功能测试**，不要一次性修改太多
4. **提交前验证**所有相关功能不受影响

---

## 🔗 相关文档

- `SUPABASE-SETUP-GUIDE.md` - Supabase配置指南
- `NEW-FEATURES-STATUS.md` - 功能状态报告
- `DEBUG-API-ISSUES.md` - API调试指南

