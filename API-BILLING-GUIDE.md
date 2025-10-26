# API 计费方式说明

## 当前 API 调用配置

### 1. **OpenAI (gpt-4)**
- **端点**: `https://api.openai.com/v1/chat/completions`
- **计费**: OpenAI官方账户计费
- **API密钥**: `OPENAI_API_KEY` 环境变量
- **费率**: 
  - Input: $30/1M tokens
  - Output: $60/1M tokens

### 2. **DeepSeek (deepseek-chat)**
- **端点**: `https://api.deepseek.com/v1/chat/completions`
- **计费**: DeepSeek官方账户计费
- **API密钥**: `DEEPSEEK_API_KEY` 环境变量
- **费率**: 
  - 非常便宜（远低于OpenAI）

### 3. **Qwen (qwen-turbo)**
- **端点**: `https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation`
- **计费**: **阿里巴巴通义千问账户独立计费**
- **API密钥**: `QWEN_API_KEY` 环境变量
- **费率**: 通义千问定价
- **说明**: Qwen **NOT** 通过OpenAI计费

## 重要发现

**Qwen API调用是独立的**：
- ✅ 使用阿里巴巴 DashScope API
- ✅ 使用独立的 `QWEN_API_KEY`
- ✅ 独立的计费系统
- ❌ **NOT** 通过OpenAI计费

## 计费详情

### OpenAI 账单
- 所有通过 `api.openai.com` 的调用
- 显示在 OpenAI 账户账单中

### Qwen 账单  
- 所有通过 `dashscope.aliyuncs.com` 的调用
- 显示在阿里巴巴云（阿里云）通义千问账户中
- 需要独立的通义千问账户

### DeepSeek 账单
- 所有通过 `api.deepseek.com` 的调用
- 显示在 DeepSeek 账户账单中

## 建议

1. **监控三个独立账单**：
   - OpenAI 账户
   - 阿里巴巴云通义千问账户
   - DeepSeek 账户

2. **在 Vercel 环境变量中配置**：
   ```
   OPENAI_API_KEY=sk-...
   QWEN_API_KEY=sk-...
   DEEPSEEK_API_KEY=sk-...
   ```

3. **根据需要选择模型**：
   - DeepSeek: 最便宜，速度快
   - Qwen: 中文表现好，价格适中
   - OpenAI: 质量最高，价格较高
