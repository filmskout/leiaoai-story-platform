# 环境变量配置说明

## 需要创建 .env 文件

请在项目根目录创建 `.env` 文件，包含以下配置：

```bash
# Supabase配置
SUPABASE_URL=your_supabase_url_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# API Keys
DEEPSEEK_API_KEY=your_deepseek_api_key_here
OPENAI_API_KEY=your_openai_api_key_here
QWEN_API_KEY=your_qwen_api_key_here

# Admin Token
ADMIN_TOKEN=R8mn6AEgDmpKaAxE56XrejEbrL6AfBEn
```

## 获取配置值

### Supabase配置
1. 登录 Supabase Dashboard
2. 选择您的项目
3. 进入 Settings > API
4. 复制 Project URL 和 service_role key

### API Keys
1. **DeepSeek API Key**: 登录 DeepSeek 平台获取
2. **OpenAI API Key**: 登录 OpenAI 平台获取
3. **Qwen API Key**: 登录阿里云获取（可选）

## 运行脚本

配置完成后，运行：
```bash
node optimized-batch-generator-fixed.js
```

## 注意事项

- 确保所有API Key都有足够的额度
- 建议先在测试环境验证配置
- 生产环境请使用环境变量而不是硬编码
