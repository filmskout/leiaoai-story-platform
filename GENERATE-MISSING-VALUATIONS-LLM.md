# 使用LLM补齐缺失估值和成立年份的指南

## 步骤1：生成SQL脚本

运行以下脚本生成包含所有缺失数据的SQL更新语句：

```bash
node scripts/enrich-companies-web.mjs
```

这将：
- 读取所有缺失估值或成立年份的公司
- 调用LLM（Perplexity/OpenAI）搜索最新数据
- 生成 `OUT/enriched_companies_*.sql` 文件

## 步骤2：检查并执行SQL

1. 查看生成的SQL文件
2. 在Supabase SQL Editor中执行
3. 使用 `VERIFY-TIERS-AND-URLS.sql` 验证完成度

## 步骤3：手动补充（如需要）

如果有LLM无法找到的数据，可以手动添加到SQL脚本中。

