# API Keys 配置和测试指南

## 🔑 获取 API Keys

### 1. DeepSeek API Key
1. 访问 [DeepSeek Platform](https://platform.deepseek.com)
2. 注册/登录账号
3. 进入 API Keys 页面
4. 创建新的 API Key
5. 复制并保存 API Key（格式：`sk-...`）

**价格**：相对便宜，适合大量使用
**模型**：`deepseek-chat`

### 2. OpenAI API Key
1. 访问 [OpenAI Platform](https://platform.openai.com/api-keys)
2. 注册/登录账号
3. 确保账户有足够余额（需要充值）
4. 创建新的 API Key
5. 复制并保存 API Key（格式：`sk-...`）

**价格**：较贵，但质量最好
**模型**：`gpt-4o`

### 3. Qwen (通义千问) API Key
1. 访问 [阿里云 DashScope](https://dashscope.console.aliyun.com/)
2. 注册/登录阿里云账号
3. 开通 DashScope 服务
4. 获取 API Key
5. 复制并保存 API Key（格式：`sk-...`）

**价格**：中等，中国境内访问速度快
**模型**：`qwen-turbo`

---

## 🚀 在 Vercel 配置 API Keys

### 方法 1: 通过 Vercel Dashboard（推荐）

1. 访问 [Vercel Dashboard](https://vercel.com/dashboard)
2. 选择项目：`leiaoai-story-platform`
3. 进入 **Settings** → **Environment Variables**
4. 添加以下环境变量：

| Variable Name | Value | Environment |
|--------------|-------|-------------|
| `DEEPSEEK_API_KEY` | `sk-your-deepseek-key` | Production, Preview, Development |
| `OPENAI_API_KEY` | `sk-your-openai-key` | Production, Preview, Development |
| `QWEN_API_KEY` | `sk-your-qwen-key` | Production, Preview, Development |

5. 点击 **Save**
6. **重新部署项目**以使环境变量生效

### 方法 2: 通过 Vercel CLI

```bash
# 安装 Vercel CLI（如果还没安装）
npm install -g vercel

# 登录
vercel login

# 添加环境变量
vercel env add DEEPSEEK_API_KEY production
vercel env add OPENAI_API_KEY production
vercel env add QWEN_API_KEY production

# 触发重新部署
vercel --prod
```

---

## 🧪 测试 API Keys

### 本地测试

1. 创建 `.env.local` 文件（不要提交到 Git）：

```bash
DEEPSEEK_API_KEY=sk-your-deepseek-key
OPENAI_API_KEY=sk-your-openai-key
QWEN_API_KEY=sk-your-qwen-key
```

2. 运行测试脚本：

```bash
# 安装依赖
npm install

# 运行测试
node scripts/test-api-keys.js
```

### Vercel 生产环境测试

1. 部署到 Vercel 后，访问：`https://leiaoai-story-platform.vercel.app/ai-chat`
2. 打开浏览器开发者工具（F12）→ Console
3. 尝试发送问题
4. 观察日志输出：
   - 🔵 Frontend: Calling AI Chat API
   - 🚀 AI Chat Request (在 Vercel Functions 日志中)
   - ✅ Success / ❌ Error

### 查看 Vercel 函数日志

1. 访问 [Vercel Dashboard](https://vercel.com/dashboard)
2. 选择项目 → **Deployments** → 选择最新部署
3. 点击 **Functions** 标签
4. 选择 `api/ai-chat` 函数
5. 查看实时日志（Real-time Logs）

---

## 🔍 故障排查

### DeepSeek 不工作

**可能原因**：
1. ❌ API Key 无效或过期
2. ❌ 账户余额不足
3. ❌ API Key 没有正确设置在 Vercel

**解决方法**：
```bash
# 测试 API Key
curl https://api.deepseek.com/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_DEEPSEEK_KEY" \
  -d '{
    "model": "deepseek-chat",
    "messages": [{"role": "user", "content": "Hello"}],
    "max_tokens": 50
  }'
```

**预期响应**：
```json
{
  "choices": [
    {
      "message": {
        "role": "assistant",
        "content": "Hello! How can I help you today?"
      }
    }
  ]
}
```

### OpenAI 不工作

**可能原因**：
1. ❌ API Key 无效或过期
2. ❌ 账户余额不足（**最常见**）
3. ❌ 模型访问权限问题
4. ❌ 网络限制（某些地区）

**解决方法**：
```bash
# 测试 API Key
curl https://api.openai.com/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_OPENAI_KEY" \
  -d '{
    "model": "gpt-4o",
    "messages": [{"role": "user", "content": "Hello"}],
    "max_tokens": 50
  }'
```

**检查余额**：
1. 访问 [OpenAI Billing](https://platform.openai.com/account/billing/overview)
2. 确认有足够余额
3. 如果余额为 $0，需要充值

### Qwen 工作但其他不工作

**可能原因**：
1. ✅ Qwen Key 有效
2. ❌ DeepSeek/OpenAI Keys 未设置或无效

**解决方法**：
1. 检查 Vercel 环境变量是否正确设置
2. 确认所有 Keys 都在 Production 环境中设置
3. 重新部署项目

---

## 🛠️ 更新 API Keys

### 步骤：

1. **获取新的 API Key**（从对应平台）
2. **更新 Vercel 环境变量**：
   - 进入 Vercel Dashboard → Settings → Environment Variables
   - 找到对应的变量（如 `DEEPSEEK_API_KEY`）
   - 点击 **Edit** 或 **Delete** 然后重新添加
3. **触发重新部署**：
   - 方法 1: 在 Vercel Dashboard 点击 **Redeploy**
   - 方法 2: Push 一个新的 commit 到 `main` 分支

### 注意事项：

⚠️ **安全**：
- 永远不要在代码中硬编码 API Keys
- 不要将 `.env` 或 `.env.local` 提交到 Git
- 定期轮换 API Keys

⚠️ **重新部署**：
- 更新环境变量后**必须重新部署**才能生效
- 可能需要等待 1-2 分钟才能看到变化

---

## 📊 成本估算

| Provider | 模型 | 输入价格 | 输出价格 | 性价比 |
|---------|------|---------|---------|--------|
| DeepSeek | deepseek-chat | $0.14/1M tokens | $0.28/1M tokens | ⭐⭐⭐⭐⭐ |
| OpenAI | gpt-4o | $2.50/1M tokens | $10.00/1M tokens | ⭐⭐⭐ |
| Qwen | qwen-turbo | ¥0.3/1K tokens | ¥0.6/1K tokens | ⭐⭐⭐⭐ |

**建议**：
- 开发/测试：使用 DeepSeek 或 Qwen
- 生产环境：提供所有三个选项，让用户选择
- 高质量需求：OpenAI GPT-4o
- 成本优化：DeepSeek

---

## 🔗 相关链接

- [DeepSeek Platform](https://platform.deepseek.com)
- [OpenAI Platform](https://platform.openai.com)
- [阿里云 DashScope](https://dashscope.console.aliyun.com/)
- [Vercel Dashboard](https://vercel.com/dashboard)
- [项目部署地址](https://leiaoai-story-platform.vercel.app/)

---

## ❓ 常见问题

### Q: 为什么只有 Qwen 工作？
A: 通常是因为 DeepSeek 和 OpenAI 的 API Keys 没有正确设置，或者账户余额不足（特别是 OpenAI）。

### Q: 如何知道 API Key 是否有效？
A: 使用提供的 curl 命令测试，或运行 `node scripts/test-api-keys.js`。

### Q: 更新环境变量后为什么还不生效？
A: 需要重新部署项目。环境变量在构建时注入，不会自动更新。

### Q: 可以只配置一个 API Key 吗？
A: 可以，但用户只能使用该模型。建议至少配置两个以提供备选。

---

**上次更新**：2025-01-10

