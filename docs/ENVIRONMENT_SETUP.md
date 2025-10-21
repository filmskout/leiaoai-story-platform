# AI公司数据全面重新配置系统 - 环境变量设置指南

## 必需环境变量

### 1. Supabase配置
```bash
# Supabase项目URL
export SUPABASE_URL="https://your-project.supabase.co"

# Supabase匿名密钥
export SUPABASE_ANON_KEY="your-anon-key"

# Supabase服务角色密钥（推荐，用于脚本操作）
export SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
```

### 2. OpenAI配置（用于海外AI公司数据）
```bash
# OpenAI API密钥
export OPENAI_API_KEY="your-openai-api-key"
```

### 3. DeepSeek配置（用于国内AI公司数据）
```bash
# DeepSeek API密钥（可选，如果没有会使用备用数据）
export DEEPSEEK_API_KEY="your-deepseek-api-key"
```

## Vercel环境变量配置

如果您使用Vercel部署，请在Vercel Dashboard中设置以下环境变量：

### 必需变量
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY` 
- `SUPABASE_SERVICE_ROLE_KEY`
- `OPENAI_API_KEY`

### 可选变量
- `DEEPSEEK_API_KEY`

**注意**：脚本会自动兼容VITE前缀的环境变量，但推荐使用标准的环境变量名称。

## 环境变量设置方法

### 方法1：创建.env文件
在项目根目录创建`.env`文件：
```bash
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
OPENAI_API_KEY=your-openai-api-key
DEEPSEEK_API_KEY=your-deepseek-api-key
```

### 方法2：临时设置（当前终端会话）
```bash
export SUPABASE_URL="https://your-project.supabase.co"
export SUPABASE_ANON_KEY="your-anon-key"
export SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
export OPENAI_API_KEY="your-openai-api-key"
export DEEPSEEK_API_KEY="your-deepseek-api-key"
```

### 方法3：Vercel环境变量
在Vercel Dashboard中设置：
1. 进入项目设置
2. 选择"Environment Variables"
3. 添加上述所有环境变量

## 获取API密钥

### Supabase密钥
1. 登录 [Supabase Dashboard](https://supabase.com/dashboard)
2. 选择您的项目
3. 进入"Settings" > "API"
4. 复制"Project URL"和"anon public"密钥
5. 复制"service_role secret"密钥（用于脚本操作）

### OpenAI API密钥
1. 登录 [OpenAI Platform](https://platform.openai.com)
2. 进入"API Keys"页面
3. 点击"Create new secret key"
4. 复制生成的API密钥

### DeepSeek API密钥
1. 访问 [DeepSeek Platform](https://platform.deepseek.com)
2. 注册/登录账户
3. 进入API管理页面
4. 创建新的API密钥

## 验证环境变量

运行以下命令验证环境变量是否正确设置：
```bash
npm run reconfigure-all
```

脚本会自动检查所有必需的环境变量。

## 注意事项

1. **安全性**：不要将API密钥提交到版本控制系统
2. **权限**：确保API密钥有足够的权限
3. **配额**：注意API使用配额限制
4. **网络**：确保网络连接正常，能够访问相关API服务

## 故障排除

### 常见错误
1. **"Missing Supabase environment variables"**
   - 检查SUPABASE_URL和SUPABASE_ANON_KEY是否正确设置

2. **"Missing OpenAI API key"**
   - 检查OPENAI_API_KEY是否正确设置
   - 验证API密钥是否有效

3. **"DeepSeek API error"**
   - 检查DEEPSEEK_API_KEY是否正确设置
   - 系统会自动使用备用数据，不影响整体流程

4. **"Permission denied"**
   - 确保使用SUPABASE_SERVICE_ROLE_KEY而不是anon key
   - 检查RLS策略设置

### 获取帮助
如果遇到问题，请检查：
1. 环境变量是否正确设置
2. API密钥是否有效
3. 网络连接是否正常
4. 数据库权限是否正确
