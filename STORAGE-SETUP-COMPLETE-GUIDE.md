# Storage Buckets 完整设置指南

## 📦 需要创建的2个Buckets

---

## 1️⃣ BMC Images Bucket

### 用途
存储Business Model Canvas导出的PNG图片

### 创建步骤

1. **访问Storage页面**
   - 打开Supabase Dashboard
   - 左侧菜单点击 **Storage**

2. **创建新Bucket**
   - 点击 **New Bucket** 按钮（右上角）

3. **填写配置**
   ```
   Name: bmc-images
   Public bucket: ✅ 勾选（重要！）
   File size limit: 10 MB
   Allowed MIME types: image/png
   ```

4. **点击 Create bucket**

### ✅ 验证
- 在Storage页面应该看到 `bmc-images` bucket
- 图标应该显示为"Public"（公开）

---

## 2️⃣ BP Documents Bucket

### 用途
存储Business Plan文档（PDF和DOCX文件）

### 创建步骤

1. **还在Storage页面**
   - 点击 **New Bucket** 按钮

2. **填写配置**
   ```
   Name: bp-documents
   Public bucket: ❌ 不勾选（私密存储）
   File size limit: 50 MB
   Allowed MIME types: application/pdf, application/vnd.openxmlformats-officedocument.wordprocessingml.document
   ```

3. **点击 Create bucket**

### ✅ 验证
- 在Storage页面应该看到 `bp-documents` bucket
- 图标应该显示为"Private"（私密）

---

## 📊 完成检查清单

### Buckets创建
- [ ] `bmc-images` bucket已创建（Public, 10MB, PNG）
- [ ] `bp-documents` bucket已创建（Private, 50MB, PDF/DOCX）

### SQL迁移（之前完成的）
- [x] SQL迁移1: BMC Storage
- [x] SQL迁移2: Chat Sessions
- [x] SQL迁移3: BP Storage
- [x] SQL迁移4: Stories and Tags
- [x] 8个触发器全部创建

---

## 🎊 完成后的状态

### 数据库表（已创建）
✅ `bmc_boards` - BMC保存记录
✅ `chat_sessions` - AI聊天会话
✅ `chat_messages` - 聊天消息
✅ `bp_submissions` - BP提交记录
✅ `story_tags` - 故事标签定义
✅ `story_tag_assignments` - 故事-标签关联
✅ `story_likes` - 故事点赞
✅ `story_saves` - 故事收藏
✅ `story_comments` - 故事评论
✅ `story_shares` - 故事分享

### Storage Buckets（需要创建）
⏳ `bmc-images` - BMC图片存储
⏳ `bp-documents` - BP文档存储

### 触发器（已创建）
✅ 8个自动计数触发器

### RLS Policies（已创建）
✅ 所有表的行级安全策略
✅ Storage的访问控制策略

---

## 🚀 下一步

完成Storage创建后：

1. **测试前端功能**
   - ✅ AI Chat（自动发送、保存session）
   - ✅ Stories（Like/Save/Comment/Share）
   - ✅ BMC（保存到Dashboard）
   - ✅ BP上传和分析

2. **验证数据流**
   - Dashboard正确显示所有数据
   - 计数自动更新
   - Storage文件可访问

3. **监控日志**
   - 浏览器控制台无错误
   - Supabase日志正常

---

## 📸 参考截图位置

### 创建Bucket界面应该看到：
```
┌─────────────────────────────────────┐
│ Create a new bucket                 │
├─────────────────────────────────────┤
│ Name: [输入bucket名称]              │
│                                     │
│ ☐ Public bucket                     │
│   (bmc-images勾选，bp-documents不勾选) │
│                                     │
│ File size limit: [10 MB / 50 MB]   │
│                                     │
│ Allowed MIME types: [输入类型]      │
│                                     │
│ [Cancel]  [Create bucket]           │
└─────────────────────────────────────┘
```

---

## ⚠️ 常见问题

### 问题1: 找不到"New Bucket"按钮

**位置：** Supabase Dashboard → Storage → 右上角绿色按钮

### 问题2: MIME type不知道怎么输入

**BMC Images:** 直接输入 `image/png`

**BP Documents:** 输入以下两个（用逗号分隔）：
```
application/pdf, application/vnd.openxmlformats-officedocument.wordprocessingml.document
```

### 问题3: Bucket创建后不显示

**解决：** 刷新页面（F5或Cmd+R）

### 问题4: 不确定是否选Public

**规则：**
- BMC Images: ✅ Public（需要直接在浏览器显示）
- BP Documents: ❌ Private（敏感商业文件）

---

## 📞 需要帮助？

如果遇到问题：
1. 截图Storage页面
2. 说明具体错误信息
3. 我会帮你排查

---

**创建完成后，告诉我"buckets创建完成"，我们继续下一步！** 🚀

