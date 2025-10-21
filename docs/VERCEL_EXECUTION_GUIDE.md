# 🚀 在Vercel中运行AI公司数据重新配置

## 方法1：通过Web界面（推荐）

### 步骤1：部署到Vercel
1. 确保代码已推送到GitHub
2. Vercel会自动检测并部署最新版本
3. 确保所有环境变量已在Vercel中配置

### 步骤2：访问重新配置页面
部署完成后，访问：
```
https://your-app.vercel.app/reconfigure
```

### 步骤3：运行重新配置
1. 在页面上点击"开始重新配置"按钮
2. 系统会自动运行所有脚本
3. 查看实时进度和结果

## 方法2：通过Vercel CLI

### 步骤1：安装Vercel CLI
```bash
npm install -g vercel
# 或者使用 npx
npx vercel --version
```

### 步骤2：登录Vercel
```bash
vercel login
```

### 步骤3：链接项目
```bash
vercel link
```

### 步骤4：运行脚本
```bash
# 在Vercel环境中运行
vercel env pull .env.local
npm run reconfigure-all
```

## 方法3：通过API端点

### 直接调用API
```bash
curl -X POST https://your-app.vercel.app/api/reconfigure-data \
  -H "Content-Type: application/json" \
  -d '{"token": "admin-token-123"}'
```

## 环境变量检查

确保以下环境变量已在Vercel中配置：

### 必需变量
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `OPENAI_API_KEY`

### 可选变量
- `DEEPSEEK_API_KEY`
- `ADMIN_TOKEN` (用于API认证)

## 验证部署

### 检查环境变量
访问：`https://your-app.vercel.app/api/check-env`

### 检查重新配置页面
访问：`https://your-app.vercel.app/reconfigure`

## 故障排除

### 常见问题

1. **"Missing environment variables"**
   - 检查Vercel Dashboard中的环境变量设置
   - 确保变量名拼写正确
   - 重新部署项目

2. **"Unauthorized"**
   - 检查ADMIN_TOKEN是否正确设置
   - 使用正确的token调用API

3. **脚本执行失败**
   - 查看Vercel函数日志
   - 检查API密钥是否有效
   - 确认网络连接正常

### 查看日志
1. 进入Vercel Dashboard
2. 选择项目
3. 点击"Functions"标签
4. 查看`reconfigure-data`函数的日志

## 监控进度

重新配置过程中，您可以：
1. 查看Web界面的实时输出
2. 检查Vercel函数日志
3. 监控数据库变化

## 完成后的验证

重新配置完成后：
1. 访问AI公司目录页面
2. 检查公司数据是否更新
3. 验证分类和筛选功能
4. 确认多语言支持

## 安全注意事项

- API端点包含简单的认证机制
- 建议在生产环境中使用更强的认证
- 定期轮换API密钥
- 监控API使用情况
