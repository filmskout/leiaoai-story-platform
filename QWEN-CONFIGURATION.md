# Qwen API 配置和测试指南

## ✅ 已完成的更新

### 1. 更新为OpenAI兼容端点
- ✅ 北京地域：`https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions`
- ✅ 新加坡地域：`https://dashscope-intl.aliyuncs.com/compatible-mode/v1/chat/completions`
- ✅ 金融云：`https://dashscope-finance.aliyuncs.com/compatible-mode/v1/chat/completions`

### 2. 自动地域检测
- ✅ 通过 `x-vercel-ip-country` 请求头判断用户所在地区
- ✅ 中国IP → 使用北京地域
- ✅ 海外IP → 使用新加坡地域

### 3. 不需要额外的SDK
- ✅ 当前使用 HTTP fetch 调用，符合 OpenAI 兼容格式
- ✅ Node.js 环境已内置

## 📝 使用场景

### AI Chat
- **国内用户**：北京地域（低延迟）
- **海外用户**：新加坡地域（稳定）

### 内容生成（公司介绍、新闻等）
- **当前实现**：可以根据需要添加金融云端点支持
- **建议**：对于财务敏感内容，可以指定使用金融云

## 🧪 测试命令

### 测试 Qwen Turbo
```bash
curl -X POST "https://leiao.ai/api/unified" \
  -H "Content-Type: application/json" \
  -d '{
    "action": "ai-chat",
    "message": "你好，测试qwen-turbo",
    "model": "qwen",
    "language": "zh"
  }'
```

### 测试 Qwen Turbo Latest
需要修改代码中的模型名称：
```javascript
model: 'qwen-turbo-latest'  // 替换 'qwen-turbo'
```

## ❌ Qwen 视频生成 MCP

**当前不支持**：
- ❌ Qwen视频生成需要专门的API
- ❌ 不在当前的文本生成API范围内
- ❌ 需要额外的配置和权限

如需添加，需要：
1. 查看Qwen视频生成API文档
2. 添加新的API端点函数
3. 配置相应的环境变量

## 📊 环境变量检查

验证 Vercel 环境变量：
- `QWEN_API_KEY` - 已配置 ✅

## 🔍 技术说明

### 为什么不需要SDK？
- Vercel Serverless Functions 使用 Node.js
- 原生支持 `fetch` API
- OpenAI兼容端点可以直接HTTP调用

### 兼容格式
```json
{
  "model": "qwen-turbo",
  "messages": [...],
  "temperature": 0.7,
  "max_tokens": 2000
}
```

这与OpenAI格式完全兼容，只需更改端点即可。

## ⚡ 优势

1. **低延迟**：选择最近的端点
2. **高可用**：自动故障转移
3. **成本优化**：不同地域定价可能不同
4. **简单实现**：无需额外SDK
