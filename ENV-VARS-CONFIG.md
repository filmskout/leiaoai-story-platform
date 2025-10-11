# 🔐 环境变量配置指南

## ✅ 部署成功！

现在需要配置环境变量以启用所有功能。

---

## 📋 必需的环境变量

### 1. Supabase（数据库 - 必需）

```bash
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
```

**如何获取：**
1. 登录 https://supabase.com/dashboard
2. 选择你的项目 `nineezxjxfzwnsdtgjcu`
3. 进入 **Settings** → **API**
4. 复制以下信息：
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public** key → `VITE_SUPABASE_ANON_KEY`

**当前默认值（已在代码中）：**
```
URL: https://nineezxjxfzwnsdtgjcu.supabase.co
Key: eyJhbGc...（已有）
```

---

### 2. OpenAI（AI Chat + 头像生成 + OCR - 必需）

```bash
OPENAI_API_KEY
```

**用于：**
- AI Chat（GPT-4o模型）
- 头像生成（DALL-E API）
- OCR文本提取（Vision API）

**如何获取：**
1. 登录 https://platform.openai.com
2. 点击 **API keys**
3. 点击 **Create new secret key**
4. 给key命名（如：`vercel-leiaoai`）
5. 复制key（格式：`sk-...`）
6. **注意：** key只显示一次，请妥善保存

**测试API：**
- `/api/ai-chat` - GPT-4o聊天
- `/api/generate-avatar` - DALL-E头像生成
- `/api/ocr-extract` - OCR文本提取

---

### 3. DeepSeek（AI Chat - 可选）

```bash
DEEPSEEK_API_KEY
```

**用于：**
- AI Chat（DeepSeek模型）

**如何获取：**
1. 登录 https://platform.deepseek.com
2. 进入 **API Keys**
3. 创建新的API key
4. 复制key（格式：`sk-...`）

**测试API：**
- `/api/ai-chat` with `model: "deepseek"`

---

### 4. Qwen/DashScope（AI Chat - 可选）

```bash
QWEN_API_KEY
```

**用于：**
- AI Chat（Qwen模型，适合中国用户）

**如何获取：**
1. 登录 https://dashscope.console.aliyun.com
2. 进入 **API-KEY管理**
3. 创建新的API-KEY
4. 复制key（格式：`sk-...`）

**测试API：**
- `/api/ai-chat` with `model: "qwen"`

---

### 5. Thirdweb（Web3钱包登录 - 已配置）

```bash
# 不需要配置！已在代码中硬编码
```

**当前配置：**
```javascript
THIRDWEB_CLIENT_ID = '13c65c9847366b6e9b0d302cd4e3acee'
```

这个ID已经在代码中（`src/lib/thirdweb.ts`），**不需要**作为环境变量。

---

## 🚀 在Vercel添加环境变量

### 步骤1：访问Vercel项目设置

1. 登录 https://vercel.com/dashboard
2. 选择你的项目 `leiaoai-story-platform`
3. 点击顶部的 **Settings**
4. 左侧菜单选择 **Environment Variables**

### 步骤2：添加环境变量

对于每个环境变量：

1. 点击 **Add New**
2. **Name**: 输入变量名（如 `OPENAI_API_KEY`）
3. **Value**: 粘贴密钥值
4. **Environments**: 选择 **Production**, **Preview**, **Development**（全选）
5. 点击 **Save**

### 步骤3：按优先级添加

**必需（按顺序）：**
```
1. OPENAI_API_KEY          # 用于3个API
2. VITE_SUPABASE_URL       # 如果与默认值不同
3. VITE_SUPABASE_ANON_KEY  # 如果与默认值不同
```

**推荐添加：**
```
4. DEEPSEEK_API_KEY        # 为DeepSeek模型启用
5. QWEN_API_KEY            # 为Qwen模型启用
```

### 步骤4：重新部署

添加环境变量后：

1. 进入 **Deployments** 页面
2. 找到最新的部署
3. 点击右侧的 **...** → **Redeploy**
4. 勾选 **Use existing Build Cache** 取消选择（强制重新构建）
5. 点击 **Redeploy**

---

## 🧪 测试环境变量

### 测试OpenAI（必需）

**测试GPT-4o：**
```bash
curl -X POST https://your-project.vercel.app/api/ai-chat \
  -H "Content-Type: application/json" \
  -d '{"message":"Hello, test GPT-4o","model":"gpt-4o"}'
```

**测试DALL-E头像生成：**
```bash
curl -X POST https://your-project.vercel.app/api/generate-avatar \
  -H "Content-Type: application/json" \
  -d '{"prompt":"professional business person avatar, minimalist style"}'
```

**测试OCR：**
```bash
curl -X POST https://your-project.vercel.app/api/ocr-extract \
  -H "Content-Type: application/json" \
  -d '{"imageUrl":"https://example.com/test-image.png"}'
```

### 测试DeepSeek（可选）

```bash
curl -X POST https://your-project.vercel.app/api/ai-chat \
  -H "Content-Type: application/json" \
  -d '{"message":"你好，测试DeepSeek","model":"deepseek"}'
```

### 测试Qwen（可选）

```bash
curl -X POST https://your-project.vercel.app/api/ai-chat \
  -H "Content-Type: application/json" \
  -d '{"message":"你好，测试Qwen","model":"qwen"}'
```

---

## 📊 环境变量总结表

| 变量名 | 用途 | 必需 | 使用位置 |
|--------|------|------|---------|
| `VITE_SUPABASE_URL` | 数据库连接 | ✅ 是 | 前端 |
| `VITE_SUPABASE_ANON_KEY` | 数据库认证 | ✅ 是 | 前端 |
| `OPENAI_API_KEY` | GPT-4o + DALL-E + OCR | ✅ 是 | API函数 |
| `DEEPSEEK_API_KEY` | DeepSeek AI | ⭕ 可选 | API函数 |
| `QWEN_API_KEY` | Qwen AI | ⭕ 可选 | API函数 |

---

## ⚠️ 安全提示

### 前端环境变量（VITE_*）
- ✅ 可以暴露给浏览器
- ✅ 用于公开的配置（如Supabase URL和anon key）
- ❌ 不要放置敏感的API密钥

### API环境变量（无VITE_前缀）
- ✅ 仅在服务器端使用
- ✅ 不会暴露给浏览器
- ✅ 用于敏感的API密钥（OpenAI, DeepSeek, Qwen）

### 最佳实践
1. ✅ 永远不要在代码中硬编码API密钥
2. ✅ 定期轮换API密钥
3. ✅ 使用Vercel环境变量而非代码
4. ✅ 为不同环境使用不同的密钥
5. ✅ 监控API使用情况和费用

---

## 🔍 检查环境变量是否生效

### 方法1：查看Vercel日志

1. 进入 **Deployments** → 选择最新部署
2. 点击 **Functions** 标签
3. 查看函数日志中是否有错误
4. 如果看到 "missing API key" 错误，说明环境变量未正确配置

### 方法2：测试API端点

使用上面的curl命令测试每个API。

**成功响应示例：**
```json
{
  "response": "...",
  "model": "gpt-4o",
  "processingTime": 1.23
}
```

**失败响应示例：**
```json
{
  "error": "Server misconfigured: missing OPENAI_API_KEY"
}
```

### 方法3：浏览器开发者工具

1. 打开你的网站
2. 按F12打开开发者工具
3. 进入 **Console** 标签
4. 测试AI Chat功能
5. 查看是否有API错误

---

## 💰 API费用估算

### OpenAI（按使用量计费）
- **GPT-4o**: ~$0.005/1K tokens
- **DALL-E 3**: ~$0.04/image
- **Vision API**: ~$0.01/image

### DeepSeek（按使用量计费）
- **DeepSeek Chat**: ~$0.0014/1M tokens（非常便宜）

### Qwen（按使用量计费）
- **Qwen Turbo**: 参考阿里云价格

**建议：**
- 在OpenAI和DeepSeek设置使用限额
- 监控每日API调用次数
- 为测试和生产使用不同的密钥

---

## 🎉 完成检查清单

- [ ] 在Vercel添加 `OPENAI_API_KEY`
- [ ] 测试GPT-4o API（必需）
- [ ] 测试DALL-E API（必需）
- [ ] 测试OCR API（必需）
- [ ] 检查Supabase连接（默认应该工作）
- [ ] （可选）添加 `DEEPSEEK_API_KEY`
- [ ] （可选）添加 `QWEN_API_KEY`
- [ ] 重新部署Vercel项目
- [ ] 在浏览器测试所有功能
- [ ] 检查Vercel函数日志无错误

---

## 📞 获取帮助

如果环境变量配置后仍有问题：

1. 检查Vercel **Functions** 日志中的具体错误
2. 确认API密钥格式正确（通常是 `sk-...`）
3. 验证API密钥在对应平台上是激活的
4. 确认API密钥有足够的配额
5. 检查是否选择了所有环境（Production, Preview, Development）

---

**现在就开始配置环境变量吧！** 🚀

最低要求：只需 `OPENAI_API_KEY` 就可以启用所有核心功能（AI Chat, 头像生成, OCR）。

