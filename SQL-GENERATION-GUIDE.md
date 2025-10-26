# 使用 LLM 生成 SQL 脚本 - 完整指南

## 🎯 工作流程

在 Cursor 中运行 LLM 脚本，生成完整的 SQL 语句，然后手动复制到 Supabase SQL Editor 执行。

## 📋 步骤说明

### 1. 生成 SQL 脚本

在 Cursor 中运行：

```bash
node generate-complete-sql.mjs
```

这个脚本会：
- 连接 Supabase 获取需要补齐的公司
- 调用 Qwen LLM 为每个公司生成完整的 SQL UPDATE 语句
- 输出可直接复制的 SQL 代码

### 2. 复制和粘贴

脚本输出的 SQL 格式：

```sql
-- =========================================
-- 补齐公司数据的 SQL 脚本
-- 生成时间: 2024-01-01T12:00:00.000Z
-- =========================================

BEGIN;

UPDATE companies 
SET 
  website = 'https://www.anthropic.com',
  description = 'Anthropic是专注于AI安全的公司，开发了Claude AI助手，致力于构建可控、可解释的AI系统。',
  headquarters = 'San Francisco, USA',
  founded_year = 2021,
  employee_count = '200-500人',
  logo_url = 'https://logo.clearbit.com/anthropic.com'
WHERE name = 'Anthropic';

UPDATE companies 
SET 
  website = 'https://www.openai.com',
  description = 'OpenAI是一家AI研究公司，开发了GPT系列大语言模型和DALL-E图像生成模型。',
  headquarters = 'San Francisco, USA',
  founded_year = 2015,
  employee_count = '2000-5000人',
  logo_url = 'https://logo.clearbit.com/openai.com'
WHERE name = 'OpenAI';

COMMIT;
```

### 3. 在 Supabase SQL Editor 中执行

1. 打开 [Supabase Dashboard](https://supabase.com)
2. 进入你的项目
3. 点击左侧菜单的 "SQL Editor"
4. 复制脚本输出的所有 SQL 代码
5. 粘贴到 SQL Editor
6. 点击 "Run" 执行

### 4. 检查结果

脚本还会生成检查语句：

```sql
SELECT name, website, description, headquarters, founded_year, employee_count
FROM companies
WHERE name IN ('Anthropic', 'OpenAI', ...)
ORDER BY name;
```

运行这个查询确认数据已更新。

## 🔧 优点

### ✅ 可靠性
- 不需要配置 Node.js 环境变量
- 避免网络问题导致的中断
- 可以先检查生成的 SQL

### ✅ 可控性
- 可以手动修改某些 SQL 语句
- 可以分批执行
- 可以随时停止和继续

### ✅ 透明性
- 看到完整生成的 SQL
- 便于调试和优化
- 可以保存 SQL 作为备份

## 📊 示例输出

```
🚀 开始生成补齐公司数据的 SQL 脚本...

📊 找到 50 个需要补齐的公司

-- =========================================
-- 补齐公司数据的 SQL 脚本
-- 生成时间: 2024-01-15T10:30:00.000Z
-- =========================================

BEGIN;

UPDATE companies 
SET 
  website = 'https://www.anthropic.com',
  description = 'Anthropic是专注于AI安全的公司...',
  headquarters = 'San Francisco, USA',
  founded_year = 2021,
  employee_count = '200-500人',
  logo_url = 'https://logo.clearbit.com/anthropic.com'
WHERE name = 'Anthropic';

...

COMMIT;

-- ========================================
-- 执行结果检查
-- ========================================

SELECT name, website, description, headquarters, founded_year, employee_count
FROM companies
WHERE name IN ('Anthropic', 'OpenAI', ...)
ORDER BY name;

// =========================================
// 已生成 50 条 SQL 语句
// 请复制上方SQL到 Supabase SQL Editor 执行
// =========================================
```

## 🎯 推荐批次

### 第一批：重点公司（20家）
```bash
node generate-complete-sql.mjs --limit 20
```

### 第二批：扩展（50家）
```bash
node generate-complete-sql.mjs --limit 50
```

### 第三批：全量（所有114家）
```bash
node generate-complete-sql.mjs
```

## ⚠️ 注意事项

1. **执行前检查**: 确保生成的 SQL 正确
2. **备份数据**: 执行前建议备份数据库
3. **分批执行**: 不要一次性更新太多公司
4. **验证结果**: 运行检查语句确认数据正确

## 🔄 故障处理

如果生成的 SQL 有问题：

1. 单独修复某个公司
2. 重新运行脚本为特定公司生成 SQL
3. 手动编辑 SQL 语句

这个方案实现了：
- ✅ 在 Cursor 中调用 LLM
- ✅ 生成完整的 SQL 代码
- ✅ 手动复制到 SQL Editor
- ✅ 一键执行更新
