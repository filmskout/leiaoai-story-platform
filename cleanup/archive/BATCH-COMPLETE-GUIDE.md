# 批量补齐公司数据指南

目前114家公司缺少网址和完整信息，需要使用大模型逐步补齐。

## 🎯 目标
- 补齐所有公司的 website
- 补齐所有公司的 description、headquarters、founded_year、employee_count
- 逐步完善公司详情页内容

## 📋 方法1: 使用 Node.js 脚本（推荐）

### 步骤
1. 确保环境变量已配置（在 Vercel 或 .env 中）：
   ```bash
   SUPABASE_URL=your-supabase-url
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   QWEN_API_KEY=your-qwen-api-key
   ```

2. 安装依赖：
   ```bash
   npm install @supabase/supabase-js node-fetch
   ```

3. 运行脚本：
   ```bash
   node batch-complete-companies.mjs
   ```

### 功能
- 自动检测缺失字段
- 使用 Qwen Turbo 生成真实数据
- 批量更新数据库
- 显示进度和统计

## 📋 方法2: 使用 API 调用

### 步骤

#### 1. 检查数据完整性
```bash
curl -X POST "https://leiao.ai/api/unified" \
  -H "Content-Type: application/json" \
  -d '{
    "action": "check-data-completeness",
    "token": "YOUR_ADMIN_TOKEN"
  }'
```

#### 2. 批量补齐公司数据
```bash
curl -X POST "https://leiao.ai/api/unified" \
  -H "Content-Type: application/json" \
  -d '{
    "action": "complete-company-data",
    "token": "YOUR_ADMIN_TOKEN",
    "companyId": "company-uuid",
    "fields": ["website", "description", "headquarters", "founded_year", "employee_count"]
  }'
```

## 📋 方法3: 直接在 Supabase 中补齐

### 步骤

1. 打开 Supabase SQL Editor
2. 运行以下查询检查缺失数据：
   ```sql
   -- 检查缺失website的公司
   SELECT id, name, website 
   FROM companies 
   WHERE website IS NULL OR website = ''
   ORDER BY name;
   ```

3. 手动更新单个公司（示例）：
   ```sql
   UPDATE companies 
   SET 
     website = 'https://example.com',
     description = '公司描述...',
     headquarters = 'San Francisco, USA',
     founded_year = 2020,
     employee_count = '500-1000人'
   WHERE name = '公司名称';
   ```

## 🎯 推荐流程

### 阶段1: 测试（前10家公司）
```bash
# 只处理前10家公司
node batch-complete-companies.mjs --limit 10
```

### 阶段2: 小批量（50家公司）
```bash
node batch-complete-companies.mjs --limit 50
```

### 阶段3: 全量（所有114家公司）
```bash
node batch-complete-companies.mjs
```

## ⚠️ 注意事项

1. **API 限流**: Qwen API 有限流，脚本会自动添加延迟
2. **费用**: 每次调用会产生token费用
3. **数据准确性**: 大模型生成的数据需要人工审核
4. **备份**: 执行前建议备份数据库

## 🔧 故障排除

如果遇到错误：

1. 检查环境变量是否正确
2. 检查网络连接
3. 查看控制台日志了解具体错误
4. 检查 Supabase 权限设置

## 📊 进度跟踪

脚本会输出：
- 成功补齐的公司数量
- 跳过的公司（数据已完整）
- 失败的公司及错误信息

## 🎨 下一步

补齐公司数据后，需要：
1. 为每个公司创建对应的 projects
2. 添加融资信息 (fundings)
3. 生成新闻故事 (stories)
4. 补齐 Logo
