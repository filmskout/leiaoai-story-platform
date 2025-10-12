# Vercel 环境变量检查清单

## 当前问题：DeepSeek 和 OpenAI GPT-4o 不工作

### 必须检查的环境变量

请立即访问 Vercel Dashboard 并确认以下设置：

**URL**: https://vercel.com/dashboard → `leiaoai-story-platform` → Settings → Environment Variables

### ✅ 必需的环境变量

| 变量名 | 示例值 | 环境 | 状态 |
|--------|--------|------|------|
| `DEEPSEEK_API_KEY` | `sk-...` (43字符) | Production ✓ | ⬜ 待确认 |
| `OPENAI_API_KEY` | `sk-...` (51字符) | Production ✓ | ⬜ 待确认 |
| `QWEN_API_KEY` | `sk-...` | Production ✓ | ✅ 工作中 |

### 🔍 验证步骤

1. **打开 Vercel Dashboard**
2. **检查每个变量**：
   - 点击变量名查看详情
   - 确认 "Environments" 包含 **Production**
   - 确认值不为空（显示为 `••••••`）
3. **如果缺失或错误**：
   - 点击 "Edit" 或 "Add New"
   - 输入正确的 API Key
   - 选择所有环境（Production, Preview, Development）
   - 点击 "Save"
4. **重新部署**：
   - 返回 Deployments 页面
   - 点击最新部署的 "⋮" 菜单
   - 选择 "Redeploy"
   - 等待 2-3 分钟

### 🧪 测试 API Keys

#### 方法 1: 使用 curl 测试 DeepSeek

```bash
curl -X POST https://api.deepseek.com/chat/completions \
  -H "Authorization: Bearer YOUR_DEEPSEEK_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "deepseek-chat",
    "messages": [{"role": "user", "content": "你好"}],
    "max_tokens": 50
  }'
```

**预期响应**：
```json
{
  "choices": [{
    "message": {
      "role": "assistant",
      "content": "你好！有什么我可以帮助你的吗？"
    }
  }]
}
```

**如果返回 401**：API Key 无效
**如果返回 429**：配额用尽

#### 方法 2: 使用 curl 测试 OpenAI

```bash
curl -X POST https://api.openai.com/v1/chat/completions \
  -H "Authorization: Bearer YOUR_OPENAI_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-4o",
    "messages": [{"role": "user", "content": "Hello"}],
    "max_tokens": 50
  }'
```

**预期响应**：
```json
{
  "choices": [{
    "message": {
      "role": "assistant",
      "content": "Hello! How can I help you today?"
    }
  }]
}
```

**如果返回 401**：API Key 无效
**如果返回 429**：余额不足或配额限制
**如果返回 403**：账户被限制

### 💳 OpenAI 余额检查

**重要**：OpenAI 需要预付费！

1. 访问：https://platform.openai.com/account/billing/overview
2. 检查：
   - Current balance: **必须 > $0**
   - Usage limits: 确认未达到限制
   - Payment methods: 确认有有效的付款方式

**如果余额为 $0**：
1. 点击 "Add payment details"
2. 添加信用卡
3. 充值至少 $5
4. 等待 5-10 分钟生效

### 🔑 获取新的 API Keys

#### DeepSeek
1. 访问：https://platform.deepseek.com/api_keys
2. 点击 "Create API Key"
3. 命名：`LeiaoAI-Production`
4. 复制密钥（只显示一次！）
5. 保存到 Vercel 环境变量

#### OpenAI
1. 访问：https://platform.openai.com/api-keys
2. 点击 "Create new secret key"
3. 命名：`LeiaoAI-Production`
4. **重要**：立即复制密钥（只显示一次！）
5. 保存到 Vercel 环境变量

### 📊 预期的 Vercel 日志

**成功的日志应该显示**：

```
🚀 AI Chat Request: { model: "deepseek", messageLength: 10 }
📍 Mapped Model: { provider: "deepseek", model: "deepseek-chat" }
🌐 Calling API: { url: "https://api.deepseek.com/...", model: "deepseek-chat" }
📡 API Response Status: 200 OK
✅ Success: { model: "deepseek-chat", responseLength: 150, time: 2.3 }
```

**失败的日志**：

```
❌ Server misconfigured: missing DEEPSEEK_API_KEY
```
→ **Vercel 环境变量未设置**

```
❌ API Error: 401 Unauthorized
```
→ **API Key 无效**

```
❌ API Error: 429 Too Many Requests
```
→ **配额用尽或余额不足**

### 🚨 紧急故障排查

如果所有步骤都完成但仍不工作：

1. **清除浏览器缓存**
2. **使用隐私/无痕模式测试**
3. **检查网络连接**
4. **等待 5 分钟**（DNS 传播）
5. **查看完整的 Vercel 函数日志**

### 📞 需要的信息

如果问题持续，请提供：
- [ ] Vercel 环境变量截图（隐藏实际的 Key 值）
- [ ] Vercel 函数日志截图
- [ ] 浏览器控制台截图
- [ ] 测试的具体时间
- [ ] 使用的模型名称

---

**最后更新**：2025-01-10

