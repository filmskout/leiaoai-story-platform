# 🚨 快速诊断指南 - AI Chat 问题

## 问题：只有 Qwen 工作，DeepSeek 和 OpenAI 不工作

### ✅ 立即检查清单

#### 1. **检查 Vercel 环境变量** (最可能的问题)

访问：https://vercel.com/dashboard → `leiaoai-story-platform` → Settings → Environment Variables

确认以下变量**存在**且**有值**：

- [ ] `DEEPSEEK_API_KEY` - 应该以 `sk-` 开头
- [ ] `OPENAI_API_KEY` - 应该以 `sk-` 开头  
- [ ] `QWEN_API_KEY` - 应该以 `sk-` 开头

⚠️ **重要**：确认这些变量在 **Production** 环境中已设置！

如果缺失或值为空 → **这就是问题所在！**

**解决方法**：
1. 添加缺失的 API Keys
2. 点击右上角 **Redeploy** 按钮重新部署
3. 等待 2-3 分钟让部署完成
4. 测试

---

#### 2. **检查 OpenAI 账户余额** (第二常见问题)

访问：https://platform.openai.com/account/billing/overview

- [ ] 账户余额 > $0
- [ ] 没有欠费
- [ ] API Key 未被撤销

如果余额为 $0 → **需要充值！**

**解决方法**：
1. 在 OpenAI 平台充值（最少 $5）
2. 等待几分钟
3. 测试

---

#### 3. **检查 DeepSeek API Key** (可能过期)

访问：https://platform.deepseek.com/api_keys

- [ ] API Key 状态为"Active"
- [ ] API Key 未过期
- [ ] 账户有足够配额

如果 Key 无效 → **创建新的 Key！**

**解决方法**：
1. 在 DeepSeek 平台创建新的 API Key
2. 复制新的 Key
3. 更新 Vercel 环境变量
4. 重新部署

---

### 🔍 实时诊断步骤

#### 步骤 1: 查看浏览器控制台

1. 打开 https://leiaoai-story-platform.vercel.app/ai-chat
2. 按 F12 打开开发者工具
3. 切换到 **Console** 标签
4. 尝试发送一条消息
5. 查看日志输出

**应该看到的日志**：
```
🔵 Frontend: Calling AI Chat API { model: "deepseek", messageLength: 10 }
🔵 Frontend: API Response Status 200 OK
🟢 Frontend: Success { model: "deepseek-chat", responseLength: 150, time: 2.3 }
```

**如果看到错误**：
```
🔴 Frontend: API Error Response "Server misconfigured: missing DEEPSEEK_API_KEY"
```
→ **去 Vercel 添加 API Key！**

```
🔴 Frontend: API Error Response "Insufficient quota"
```
→ **OpenAI 余额不足，需要充值！**

---

#### 步骤 2: 查看 Vercel 函数日志

1. 访问 https://vercel.com/dashboard
2. 选择项目 → **Deployments** → 点击最新部署
3. 点击 **Functions** 标签
4. 选择 `api/ai-chat`
5. 点击 **View Logs**
6. 尝试发送消息
7. 查看实时日志

**应该看到的日志**：
```
🚀 AI Chat Request: { model: "deepseek", messageLength: 10 }
📍 Mapped Model: { provider: "deepseek", model: "deepseek-chat" }
🌐 Calling API: { url: "https://api.deepseek.com/...", model: "deepseek-chat" }
📡 API Response Status: 200 OK
✅ Success: { model: "deepseek-chat", responseLength: 150, time: 2.3 }
```

**如果看到错误**：
```
❌ Server misconfigured: missing DEEPSEEK_API_KEY
```
→ **Vercel 环境变量未设置！**

```
❌ API Error: 401 Unauthorized
```
→ **API Key 无效或过期！**

```
❌ API Error: 429 Rate Limit Exceeded
```
→ **配额用完或余额不足！**

---

### 🧪 测试单个 API Key（本地）

创建 `.env.local` 文件（不要提交到 Git）：

```bash
DEEPSEEK_API_KEY=sk-your-actual-key-here
OPENAI_API_KEY=sk-your-actual-key-here
QWEN_API_KEY=sk-your-actual-key-here
```

运行测试：

```bash
node scripts/test-api-keys.js
```

**预期输出**：
```
🔵 测试 DeepSeek API...
📍 API Key (前8位): sk-12345...
✅ DeepSeek API 工作正常
📝 响应: 你好！我是 DeepSeek...

🔵 测试 OpenAI API...
📍 API Key (前8位): sk-67890...
✅ OpenAI API 工作正常
📝 响应: Hello! I'm an AI assistant...

🔵 测试 Qwen API...
📍 API Key (前8位): sk-abcde...
✅ Qwen API 工作正常
📝 响应: 你好！我是通义千问...

📊 测试总结:
DeepSeek: ✅ 正常
OpenAI:   ✅ 正常
Qwen:     ✅ 正常
```

**如果失败**：
```
❌ DeepSeek API 失败: 401 Unauthorized
📝 错误详情: {"error": {"message": "Invalid API key"}}
```
→ **API Key 无效！**

---

### 🛠️ 快速修复方案

#### 修复方案 A: 更新 Vercel 环境变量

1. 访问 https://vercel.com/dashboard
2. 选择项目 → Settings → Environment Variables
3. 找到 `DEEPSEEK_API_KEY` 和 `OPENAI_API_KEY`
4. 如果不存在，点击 **Add New**
5. 如果存在但无效，点击 **Edit** 更新值
6. 确保选中 **Production** 环境
7. 点击 **Save**
8. 返回 Deployments 页面
9. 点击最新部署旁边的 **⋮** → **Redeploy**
10. 等待 2-3 分钟

#### 修复方案 B: 获取新的 API Keys

**DeepSeek**:
1. 访问 https://platform.deepseek.com/api_keys
2. 点击 **Create API Key**
3. 复制新 Key（格式：`sk-...`）
4. 更新 Vercel 环境变量
5. 重新部署

**OpenAI**:
1. 访问 https://platform.openai.com/api-keys
2. 点击 **Create new secret key**
3. 给 Key 命名（如 "LeiaoAI Production"）
4. 复制新 Key（格式：`sk-...`）
5. **检查余额**：https://platform.openai.com/account/billing/overview
6. 如果余额为 $0，充值至少 $5
7. 更新 Vercel 环境变量
8. 重新部署

---

### 📱 问题：问题跳转到输入框但不自动提交

这是另一个问题，可能原因：

1. **JavaScript 未加载完成** → 增加了延迟到 1200ms
2. **sessionStorage 阻止** → 清除浏览器缓存
3. **组件初始化问题** → 查看控制台错误

**快速测试**：
1. 打开 https://leiaoai-story-platform.vercel.app/
2. 点击专业服务区域的任意问题
3. 打开浏览器控制台（F12）
4. 应该看到：
```
🎯 Auto-asking question from URL parameter: ...
📍 Current model: deepseek
⏰ Sending auto-ask message now...
🔵 Frontend: Calling AI Chat API ...
```

**如果没有看到 `⏰ Sending auto-ask message now...`**：
- 清除 sessionStorage: 
  ```javascript
  sessionStorage.clear()
  ```
- 刷新页面
- 重试

---

### 🎯 最可能的问题（按概率排序）

1. **90% 概率**: Vercel 环境变量未设置或设置错误
   - 解决：检查 Vercel Dashboard → Environment Variables
   
2. **8% 概率**: OpenAI 账户余额不足
   - 解决：充值 OpenAI 账户
   
3. **2% 概率**: API Keys 过期或无效
   - 解决：重新生成 API Keys

---

### ⚡ 最快的解决路径

```
1. 打开 Vercel Dashboard → Environment Variables
   ↓
2. 确认 DEEPSEEK_API_KEY 和 OPENAI_API_KEY 存在
   ↓
3. 如果缺失 → 添加 → 重新部署 → 完成 ✅
   ↓
4. 如果存在 → 检查 OpenAI 余额
   ↓
5. 如果余额为 $0 → 充值 → 完成 ✅
   ↓
6. 如果余额充足 → API Keys 可能无效 → 重新生成 → 完成 ✅
```

---

### 📞 需要帮助？

如果以上步骤都无效，请提供：
1. Vercel 函数日志截图
2. 浏览器控制台截图
3. 使用的模型名称
4. 错误消息

---

**上次更新**：2025-01-10

