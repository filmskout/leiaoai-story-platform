# 🔍 API调试指南 - OpenAI和DeepSeek不工作

## 问题描述

用户报告：API密钥已经配置在Vercel，但OpenAI和DeepSeek仍然不工作，只有Qwen返回结果。

---

## 🔧 已实施的修复

### 1. API参数兼容性问题（提交 607c045）

**问题**：之前的代码为所有API发送了相同的参数，但OpenAI和Qwen不支持`top_p`和`session_id`参数。

**修复**：
```typescript
// 只为DeepSeek添加top_p和session_id
if (mapped.provider === 'deepseek') {
  requestBody.top_p = 0.9;
  if (sessionId) {
    requestBody.session_id = sessionId;
  }
}
```

### 2. 添加详细日志

现在API会输出：
- 🔵 请求接收：模型、消息长度
- 🔵 密钥状态：是否存在、长度（不泄露内容）
- 🔵 API调用：provider和model
- 🔵 响应状态码
- 🟢 成功：响应长度
- 🔴 错误：详细错误信息

---

## 📊 调试步骤

### 步骤1: 检查Vercel Function Logs

1. 访问 [Vercel Dashboard](https://vercel.com/dashboard)
2. 选择项目
3. 进入 **Deployments** → 最新部署
4. 点击 **Functions** 标签
5. 找到 `api/ai-chat` 函数
6. 查看实时日志

**查找关键日志**：
```
🔵 API: Received request { model: 'openai', messageLength: 50, hasSessionId: false }
🔵 API: Mapped to provider { provider: 'openai', model: 'gpt-4o' }
🔵 API: OpenAI key present: true length: 51
🔵 API: Calling openai (gpt-4o)
🔵 API: openai response status: 200
🟢 API: openai success, response length: 342
```

### 步骤2: 验证环境变量

在Vercel Dashboard中：
```
Settings → Environment Variables

检查:
✓ OPENAI_API_KEY - 应该存在且长度51-55字符
✓ DEEPSEEK_API_KEY - 应该存在
✓ QWEN_API_KEY - 应该存在
```

### 步骤3: 测试API直接调用

使用curl测试Vercel Function：

**测试OpenAI：**
```bash
curl -X POST https://your-project.vercel.app/api/ai-chat \
  -H "Content-Type: application/json" \
  -d '{"message":"Say hello in 5 words","model":"openai"}' \
  -v
```

**测试DeepSeek：**
```bash
curl -X POST https://your-project.vercel.app/api/ai-chat \
  -H "Content-Type: application/json" \
  -d '{"message":"Say hello in 5 words","model":"deepseek"}' \
  -v
```

**期望响应：**
```json
{
  "data": {
    "content": "Hello! How are you today?",
    "model": "gpt-4o"
  },
  "processingTime": 1.2
}
```

**错误响应示例：**
```json
{
  "error": "Server misconfigured: missing OPENAI_API_KEY"
}
```

---

## 🐛 可能的问题和解决方案

### 问题1: 环境变量未正确设置

**症状**：
- 日志显示：`OpenAI key present: false`
- 错误：`Server misconfigured: missing OPENAI_API_KEY`

**解决**：
1. 重新添加环境变量
2. 确保选择了所有环境（Production, Preview, Development）
3. **重新部署**项目（重要！）

### 问题2: API密钥格式错误

**症状**：
- 日志显示：`OpenAI key present: true length: 51`
- 错误：`401 Unauthorized` 或 `Invalid API key`

**解决**：
1. 检查密钥是否完整（包括`sk-proj-`前缀）
2. 确认密钥没有空格或换行
3. 在OpenAI Dashboard确认密钥激活状态

### 问题3: API速率限制

**症状**：
- 错误：`429 Too Many Requests`
- 或：`Rate limit exceeded`

**解决**：
1. 检查OpenAI账户的使用配额
2. 等待几分钟后重试
3. 升级OpenAI账户等级

### 问题4: 网络连接问题

**症状**：
- 错误：`ECONNREFUSED` 或 `ETIMEDOUT`
- Vercel函数超时

**解决**：
1. 检查Vercel区域设置
2. 尝试从不同地区访问
3. 检查API端点是否可访问

### 问题5: 请求体格式问题

**症状**：
- 错误：`400 Bad Request`
- 或：`Invalid request`

**解决**：
- 已在607c045提交中修复
- 确保使用最新部署

---

## 🧪 逐步测试流程

### 测试1: 验证Function可访问性

```bash
curl https://your-project.vercel.app/api/ai-chat \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"message":"test"}'
```

**期望**：收到响应（即使是错误也好）  
**失败**：404 - Function未部署或路径错误

### 测试2: 验证环境变量

```bash
# 通过日志查看
# 应该看到：🔵 API: OpenAI key present: true length: XX
```

### 测试3: 验证API密钥有效性

在本地测试OpenAI密钥：
```bash
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer YOUR_OPENAI_KEY"
```

应该返回模型列表，而不是401错误。

### 测试4: 验证Vercel Function

直接在浏览器访问：
```
https://your-project.vercel.app/api/ai-chat
```

应该看到：`Method Not Allowed`（正常，因为需要POST）

---

## 📝 收集调试信息

如果问题仍然存在，请提供：

1. **Vercel Function Logs**（最近5条日志）
   ```
   复制从 Deployments → Functions → api/ai-chat
   ```

2. **浏览器Console错误**
   ```javascript
   // F12 → Console
   // 显示的任何红色错误
   ```

3. **Network请求详情**
   ```
   F12 → Network → 选择失败的请求
   - Status code
   - Response body
   - Request payload
   ```

4. **curl测试结果**
   ```bash
   curl -X POST https://your-project.vercel.app/api/ai-chat \
     -H "Content-Type: application/json" \
     -d '{"message":"test","model":"openai"}' \
     -v
   ```

---

## 🎯 快速排查清单

- [ ] 环境变量已在Vercel配置
- [ ] 选择了所有环境（Production, Preview, Development）
- [ ] 最新代码已部署（提交 607c045 或更新）
- [ ] 部署后已重启/Redeploy
- [ ] Vercel Function Logs显示密钥存在
- [ ] API密钥在OpenAI Dashboard是激活状态
- [ ] 本地curl测试可以访问OpenAI API
- [ ] Vercel Function可以访问（返回任何响应）

---

## 💡 最可能的原因

根据"密钥已配置但不工作"的描述，最可能的原因是：

1. **未重新部署**（80%可能性）
   - 添加环境变量后必须Redeploy
   - 解决方案：Deployments → Redeploy

2. **API参数不兼容**（15%可能性）
   - 已在607c045修复
   - 解决方案：部署最新代码

3. **API密钥格式错误**（5%可能性）
   - 复制时包含了空格或换行
   - 解决方案：重新复制并粘贴密钥

---

**下一步**：请按照上述步骤检查Vercel Function Logs，并分享日志内容，我将帮助进一步诊断问题。

