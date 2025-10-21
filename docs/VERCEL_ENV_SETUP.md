# Vercel环境变量配置指南

## 在Vercel中配置环境变量

### 步骤1：登录Vercel Dashboard
1. 访问 [Vercel Dashboard](https://vercel.com/dashboard)
2. 选择您的项目 `leiaoai-story-platform`

### 步骤2：进入环境变量设置
1. 点击项目设置（Settings）
2. 在左侧菜单中点击 "Environment Variables"

### 步骤3：添加环境变量
点击 "Add New" 按钮，逐个添加以下环境变量：

#### 必需环境变量

| 变量名 | 值 | 描述 |
|--------|-----|------|
| `SUPABASE_URL` | `https://your-project.supabase.co` | Supabase项目URL |
| `SUPABASE_ANON_KEY` | `your-anon-key` | Supabase匿名密钥 |
| `SUPABASE_SERVICE_ROLE_KEY` | `your-service-role-key` | Supabase服务角色密钥 |
| `OPENAI_API_KEY` | `your-openai-api-key` | OpenAI API密钥 |

#### 可选环境变量

| 变量名 | 值 | 描述 |
|--------|-----|------|
| `DEEPSEEK_API_KEY` | `your-deepseek-api-key` | DeepSeek API密钥 |

### 步骤4：设置环境范围
为每个环境变量选择适用的环境：
- ✅ **Production** (生产环境)
- ✅ **Preview** (预览环境)  
- ✅ **Development** (开发环境)

### 步骤5：保存配置
1. 点击 "Save" 保存每个环境变量
2. 确认所有变量都已正确添加

## 验证配置

### 方法1：检查Vercel Dashboard
在环境变量页面确认所有变量都已添加且状态为 "Active"

### 方法2：通过Vercel CLI
```bash
# 安装Vercel CLI
npm i -g vercel

# 登录Vercel
vercel login

# 检查环境变量
vercel env ls
```

### 方法3：在代码中验证
创建一个临时的API端点来检查环境变量：

```typescript
// api/check-env.ts
export default function handler(req: any, res: any) {
  const envVars = {
    SUPABASE_URL: process.env.SUPABASE_URL ? '✅ Set' : '❌ Missing',
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing',
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅ Set' : '❌ Missing',
    OPENAI_API_KEY: process.env.OPENAI_API_KEY ? '✅ Set' : '❌ Missing',
    DEEPSEEK_API_KEY: process.env.DEEPSEEK_API_KEY ? '✅ Set' : '❌ Missing'
  };
  
  res.status(200).json(envVars);
}
```

## 重要注意事项

### 1. 安全性
- ✅ 环境变量在Vercel中是加密存储的
- ✅ 不会出现在客户端代码中
- ❌ 不要在代码中硬编码API密钥

### 2. 权限
- `SUPABASE_SERVICE_ROLE_KEY` 具有完整数据库访问权限
- `SUPABASE_ANON_KEY` 受RLS策略限制
- 脚本操作建议使用 `SUPABASE_SERVICE_ROLE_KEY`

### 3. 更新
- 修改环境变量后需要重新部署
- 可以通过Vercel Dashboard或CLI更新
- 更新后立即生效

### 4. 调试
如果环境变量未生效：
1. 检查变量名拼写
2. 确认环境范围设置
3. 重新部署项目
4. 检查Vercel构建日志

## 获取API密钥

### Supabase密钥
1. 登录 [Supabase Dashboard](https://supabase.com/dashboard)
2. 选择项目
3. 进入 "Settings" > "API"
4. 复制以下值：
   - **Project URL** → `SUPABASE_URL`
   - **anon public** → `SUPABASE_ANON_KEY`
   - **service_role secret** → `SUPABASE_SERVICE_ROLE_KEY`

### OpenAI API密钥
1. 登录 [OpenAI Platform](https://platform.openai.com)
2. 进入 "API Keys"
3. 点击 "Create new secret key"
4. 复制生成的密钥 → `OPENAI_API_KEY`

### DeepSeek API密钥
1. 访问 [DeepSeek Platform](https://platform.deepseek.com)
2. 注册/登录账户
3. 进入API管理页面
4. 创建新的API密钥 → `DEEPSEEK_API_KEY`

## 完成配置后

配置完成后，您可以：
1. 运行 `npm run reconfigure-all` 开始数据重新配置
2. 检查Vercel部署日志确认环境变量加载成功
3. 验证AI公司目录功能是否正常工作
