# 🚀 快速环境变量设置指南

## 方法1：使用设置脚本（推荐）

运行环境变量设置助手：
```bash
./setup-env.sh
```

脚本会引导您输入所有必需的环境变量值。

## 方法2：手动创建.env文件

在项目根目录创建`.env`文件：

```bash
# Supabase配置
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# OpenAI配置
OPENAI_API_KEY=your-openai-api-key

# DeepSeek配置（可选）
DEEPSEEK_API_KEY=your-deepseek-api-key
```

## 方法3：临时设置环境变量

```bash
export SUPABASE_URL="https://your-project.supabase.co"
export SUPABASE_ANON_KEY="your-anon-key"
export SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
export OPENAI_API_KEY="your-openai-api-key"
export DEEPSEEK_API_KEY="your-deepseek-api-key"
```

## 获取API密钥

### Supabase密钥
1. 登录 [Supabase Dashboard](https://supabase.com/dashboard)
2. 选择您的项目
3. 进入 "Settings" > "API"
4. 复制：
   - **Project URL** → `SUPABASE_URL`
   - **anon public** → `SUPABASE_ANON_KEY`
   - **service_role secret** → `SUPABASE_SERVICE_ROLE_KEY`

### OpenAI API密钥
1. 登录 [OpenAI Platform](https://platform.openai.com)
2. 进入 "API Keys"
3. 点击 "Create new secret key"
4. 复制密钥 → `OPENAI_API_KEY`

### DeepSeek API密钥（可选）
1. 访问 [DeepSeek Platform](https://platform.deepseek.com)
2. 注册/登录账户
3. 进入API管理页面
4. 创建新的API密钥 → `DEEPSEEK_API_KEY`

## 验证设置

设置完成后，运行以下命令验证：
```bash
npm run reconfigure-all
```

如果环境变量设置正确，系统会开始数据重新配置过程。

## 故障排除

### 常见问题
1. **"Missing Supabase environment variables"**
   - 检查.env文件是否存在
   - 确认变量名拼写正确
   - 确保没有多余的空格

2. **"Missing OpenAI API key"**
   - 检查OPENAI_API_KEY是否正确设置
   - 验证API密钥是否有效

3. **权限问题**
   - 确保使用SUPABASE_SERVICE_ROLE_KEY
   - 检查Supabase RLS策略设置

### 获取帮助
如果遇到问题：
1. 检查环境变量设置
2. 查看详细文档：`docs/ENVIRONMENT_SETUP.md`
3. 查看Vercel配置：`docs/VERCEL_ENV_SETUP.md`
