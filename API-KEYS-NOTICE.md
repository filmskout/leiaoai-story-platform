# 🔑 API密钥配置说明

## 📊 当前状态

✅ **Qwen (通义千问)**: 已配置并工作正常  
⚠️ **OpenAI (GPT-4o)**: 需要配置 `OPENAI_API_KEY`  
⚠️ **DeepSeek**: 需要配置 `DEEPSEEK_API_KEY`

---

## 🐛 用户报告的问题

**问题**: AI Chat只有Qwen返回结果，OpenAI和DeepSeek不工作

**根本原因**: Vercel环境变量未配置`OPENAI_API_KEY`和`DEEPSEEK_API_KEY`

---

## ✅ 解决方案

### 方法1: 在Vercel配置环境变量（推荐）

1. 登录 [Vercel Dashboard](https://vercel.com/dashboard)
2. 选择项目 `leiaoai-story-platform`
3. 进入 **Settings** → **Environment Variables**
4. 添加以下变量：

```bash
# OpenAI API密钥（必需，用于GPT-4o、DALL-E、OCR）
OPENAI_API_KEY=sk-...

# DeepSeek API密钥（可选，用于DeepSeek Chat）
DEEPSEEK_API_KEY=sk-...

# Qwen API密钥（已配置）
QWEN_API_KEY=sk-...
```

5. 选择环境：✅ Production ✅ Preview ✅ Development
6. 点击 **Save**
7. 重新部署：**Deployments** → 最新部署 → **Redeploy**

### 方法2: 添加友好的前端错误提示（已实现）

当API密钥未配置时，显示清晰的错误信息，指导用户：
- 当前模型不可用
- 需要配置哪个API密钥
- 建议切换到Qwen（已配置）

---

## 🔍 API密钥获取方法

### OpenAI API密钥
1. 访问 [OpenAI Platform](https://platform.openai.com)
2. 登录账户
3. 进入 **API keys** 页面
4. 点击 **Create new secret key**
5. 给密钥命名（如：`vercel-leiaoai`）
6. 复制密钥（格式：`sk-...`）
7. ⚠️ **注意**：密钥只显示一次，请妥善保存

### DeepSeek API密钥
1. 访问 [DeepSeek Platform](https://platform.deepseek.com)
2. 登录账户
3. 进入 **API Keys** 页面
4. 创建新的API密钥
5. 复制密钥（格式：`sk-...`）

### Qwen API密钥（已配置）
1. 访问 [DashScope Console](https://dashscope.console.aliyun.com)
2. 登录阿里云账户
3. 进入 **API-KEY管理**
4. 创建新的API-KEY
5. 复制密钥

---

## 🧪 测试API

配置环境变量后，可以使用以下命令测试：

```bash
# 测试OpenAI GPT-4o
curl -X POST https://your-project.vercel.app/api/ai-chat \
  -H "Content-Type: application/json" \
  -d '{"message":"Hello","model":"openai"}'

# 测试DeepSeek
curl -X POST https://your-project.vercel.app/api/ai-chat \
  -H "Content-Type: application/json" \
  -d '{"message":"Hello","model":"deepseek"}'

# 测试Qwen（应该已经工作）
curl -X POST https://your-project.vercel.app/api/ai-chat \
  -H "Content-Type: application/json" \
  -d '{"message":"你好","model":"qwen"}'
```

---

## 💡 建议

1. **最低配置**：只配置`OPENAI_API_KEY`即可启用：
   - AI Chat (GPT-4o)
   - 头像生成 (DALL-E)
   - OCR文本提取 (Vision API)

2. **完整配置**：配置所有3个密钥，让用户可以自由选择模型

3. **仅中国市场**：如果只面向中国市场，可以只使用Qwen（已配置）

---

## 🔒 安全提示

- ✅ 永远不要在代码中硬编码API密钥
- ✅ 使用Vercel环境变量存储敏感信息
- ✅ 定期轮换API密钥
- ✅ 监控API使用情况和费用
- ✅ 为不同环境使用不同的密钥

---

## 📝 相关文件

- `api/ai-chat.ts` - AI Chat API函数
- `api/generate-avatar.ts` - 头像生成API函数
- `api/ocr-extract.ts` - OCR文本提取API函数
- `ENV-VARS-CONFIG.md` - 完整的环境变量配置指南

---

**下一步**：配置API密钥后，所有3个模型应该都能正常工作！🚀

