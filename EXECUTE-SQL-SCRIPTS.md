# 在 Supabase SQL Editor 执行 SQL 脚本指南

## ⚠️ 重要：必须先在 Supabase 中执行 SQL 脚本更新数据

前端页面 `https://leiao.ai/ai-companies` 显示不完整的URL、估值和融资信息，是因为数据库中的数据还没有更新。需要先在 Supabase 中执行 SQL 脚本。

---

## 📋 执行顺序（按顺序执行）

### 第1步：更新Tier命名
**文件**: `UPDATE-TIER-NAMES.sql`

```sql
-- 打开 Supabase Dashboard → SQL Editor
-- 复制 UPDATE-TIER-NAMES.sql 的内容
-- 粘贴并执行
```

作用：将 `Tier 1` 重命名为 `Giant`，`Tier 2` 重命名为 `Unicorn`

---

### 第2步：补齐公司URL
**文件**: `complete-missing-company-urls.sql`

```sql
-- 在 Supabase SQL Editor 中执行
-- 将为114个公司配置官网URL
```

作用：补齐所有公司的官网URL，覆盖114家公司

---

### 第3步：更新估值和融资信息
**文件**: `generate-all-116-companies-valuations.sql`

```sql
-- 在 Supabase SQL Editor 中执行
-- 将为116个公司配置估值信息
-- 包含30+家公司的融资轮次数据
```

作用：
- 更新所有公司的估值
- 插入融资轮次、金额、投资人信息

---

### 第4步：补齐项目URL
**文件**: `UPDATE-PROJECT-URLS-MANUAL.sql`

```sql
-- 在 Supabase SQL Editor 中执行
-- 将为主要项目配置URL
```

作用：补齐主要AI项目的URL

---

## ✅ 验证数据更新

### 查询脚本：`QUERY-DATA-COMPLETENESS.sql`

执行此脚本查看数据完整性：

```sql
-- 在 Supabase SQL Editor 中执行
-- 将显示：
-- 1. 总体统计（公司数、URL配置率、估值配置率）
-- 2. 融资信息统计
-- 3. 项目统计
-- 4. 按tier分类的完成情况
-- 5. 缺失URL的公司列表
-- 6. 缺失估值的公司列表
-- 7. 前20家公司示例数据
```

---

## 🎯 预期结果

执行完成后，应该看到：

1. **URL配置率**: 100%（114家公司全部有URL）
2. **估值配置率**: 100%（116家公司全部有估值）
3. **融资记录**: 30+个融资轮次
4. **项目URL**: 主要项目全部配置URL

---

## 🐛 故障排除

### 如果前端仍然显示旧数据

1. **清除浏览器缓存**
   - 按 `Cmd+Shift+R` (Mac) 或 `Ctrl+F5` (Windows) 强制刷新

2. **检查浏览器控制台**
   - 打开开发者工具 (F12)
   - 查看 Console 是否有错误
   - 查看 Network 标签，检查 API 请求

3. **验证数据库更新**
   - 在 Supabase Dashboard → Table Editor 中查看 `companies` 表
   - 确认 `website`, `valuation_usd` 字段有数据
   - 检查 `fundings` 表是否有融资记录

4. **重新部署**
   - 如果使用的是 Vercel，触发一次重新部署

---

## 📊 SQL脚本说明

| 文件 | 作用 | 执行时间 |
|------|------|---------|
| UPDATE-TIER-NAMES.sql | 重命名Tier | 1秒 |
| complete-missing-company-urls.sql | 补齐公司URL | 5秒 |
| generate-all-116-companies-valuations.sql | 补齐估值和融资 | 10-20秒 |
| UPDATE-PROJECT-URLS-MANUAL.sql | 补齐项目URL | 5秒 |

**总执行时间**: 约1-2分钟

---

## 🔍 检查清单

执行SQL脚本后，使用以下查询验证：

```sql
-- 1. 检查URL配置率
SELECT 
    COUNT(*) as total,
    COUNT(website) as with_url,
    ROUND(COUNT(website)::numeric / COUNT(*) * 100, 2) as percentage
FROM companies;

-- 2. 检查估值配置率
SELECT 
    COUNT(*) as total,
    COUNT(valuation_usd) as with_valuation,
    ROUND(COUNT(valuation_usd)::numeric / COUNT(*) * 100, 2) as percentage
FROM companies;

-- 3. 查看估值最高的10家公司
SELECT 
    name,
    valuation_usd,
    website,
    company_tier
FROM companies
WHERE valuation_usd IS NOT NULL
ORDER BY valuation_usd DESC
LIMIT 10;

-- 4. 查看融资信息
SELECT 
    c.name as company,
    f.round,
    f.amount_usd,
    f.investors,
    f.announced_on
FROM fundings f
JOIN companies c ON f.company_id = c.id
ORDER BY f.announced_on DESC
LIMIT 10;
```

---

## 📝 注意事项

1. **使用BEGIN/COMMIT**
   - 所有SQL脚本都使用事务，避免部分更新

2. **使用NOT EXISTS**
   - 融资信息使用 `NOT EXISTS` 避免重复插入

3. **按顺序执行**
   - Tier命名 → URL → 估值 → 项目URL

4. **验证后再刷新前端**
   - 确保数据库已更新后再刷新浏览器

---

## ✅ 完成标志

当以下查询都返回 100% 时，数据补齐完成：

```sql
SELECT 
    'URL配置率' as metric,
    ROUND(COUNT(website)::numeric / COUNT(*) * 100, 2) as percentage
FROM companies
UNION ALL
SELECT 
    '估值配置率',
    ROUND(COUNT(valuation_usd)::numeric / COUNT(*) * 100, 2)
FROM companies;
```

**预期结果**:
```
metric          | percentage
----------------+------------
URL配置率       | 100.00
估值配置率      | 100.00
```

