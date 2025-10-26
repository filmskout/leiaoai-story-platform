# 批量补齐公司数据 - 使用指南

## 🎯 目标
- 补齐所有公司的基本 missing fields（website, description, headquarters等）
- 使用 Qwen Turbo 调用大模型生成真实准确的数据
- 逐步完善公司详情页内容

## 📝 前置要求

### 1. 确保环境变量已配置
在 Vercel 环境变量或本地 `.env` 文件中配置：
```bash
SUPABASE_URL=your-supabase-url
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
QWEN_API_KEY=your-qwen-api-key
```

### 2. 安装依赖
```bash
npm install @supabase/supabase-js node-fetch
```

## 🚀 使用方法

### 方法1: 小批量测试（推荐先测试）

```bash
# 只处理缺失数据最多的前10家公司
node batch-complete-companies.mjs --limit 10
```

### 方法2: 中批量处理
```bash
# 处理缺失数据最多的前50家公司
node batch-complete-companies.mjs --limit 50
```

### 方法3: 全量处理
```bash
# 处理所有114家公司（耗时较长）
node batch-complete-companies.mjs
```

## 📊 脚本功能

### 自动检测缺失字段
- `website` - 公司官网
- `description` - 公司简介（100字内）
- `headquarters` - 总部地址
- `founded_year` - 成立年份
- `employee_count` - 员工规模

### 使用 Qwen Turbo 生成数据
- 基于真实公开资料
- 确保信息准确性
- 输出格式统一

### 自动更新数据库
- 批量更新
- 错误处理
- 进度追踪

## 📈 输出示例

```
🚀 开始批量补齐公司数据...

📊 找到 114 家公司

🏢 开始补齐: Anthropic
  ✅ Anthropic 数据补齐成功
     补齐字段: website, description, headquarters, founded_year, employee_count

🏢 开始补齐: OpenAI
  ✅ OpenAI 数据完整，跳过

...

📊 批量补齐完成:
  总计: 114 家
  成功: 95 家
  跳过: 15 家
  失败: 4 家

❌ 失败的公司:
  - Company1: 解析JSON失败
  - Company2: 未找到信息
```

## ⚠️ 注意事项

1. **API 限流**: Qwen API 有限流，脚本会添加1秒延迟避免限流
2. **费用**: 每次调用会产生 token 费用（约100家公司需要 ~0.5美元）
3. **时间**: 处理100家公司大约需要3-5分钟
4. **数据准确性**: 生成的数据基于公开资料，但仍需人工审核

## 🔧 故障排除

### 问题1: 环境变量未配置
**错误**: `Cannot read property 'SUPABASE_URL' of undefined`  
**解决**: 确保设置了环境变量

### 问题2: API调用失败
**错误**: `Qwen API失败: 429`  
**解决**: 等待一段时间后重试，或减少批处理大小

### 问题3: JSON解析失败
**错误**: `解析JSON失败: Unexpected token`  
**解决**: 这是个别情况，可以手动修复或重新运行失败的公司

## 📊 下一步

补齐公司数据后，需要：
1. ✅ 修复projects的URL（运行 `search-project-urls.mjs`）
2. ✅ 添加projects的详细数据
3. ✅ 生成融资信息（fundings）
4. ✅ 生成新闻故事（stories）

## 🎯 预期结果

运行完成后，所有公司应该具有：
- ✅ 官网URL
- ✅ 100字内的简介
- ✅ 总部地址
- ✅ 成立年份
- ✅ 员工规模

这些数据将在 `ai-companies` 列表页和详情页中显示。
