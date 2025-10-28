# 完整数据补齐执行指南

## 执行顺序（重要！）

请按照以下顺序在 Supabase SQL Editor 中执行SQL脚本，避免数据冲突。

### 第1步：更新Tier命名
**文件**: `UPDATE-TIER-NAMES.sql`

作用：
- 将 `Tier 1` 重命名为 `Giant`（大厂）
- 将 `Tier 2` 重命名为 `Unicorn`（独角兽）

执行后验证：
```sql
SELECT company_tier, COUNT(*) FROM companies GROUP BY company_tier;
```

---

### 第2步：补齐公司URL
**文件**: `complete-missing-company-urls.sql`

作用：
- 为114个公司补充官网URL
- 包含所有主要AI公司

执行后验证：
```sql
SELECT COUNT(*) as total, COUNT(website) as with_url FROM companies;
```

---

### 第3步：更新估值和融资信息
**文件**: `COMPLETE-FUNDINGS-VALUATIONS.sql`

作用：
- 更新63个主要公司的估值
- 插入融资轮次和投资人信息
- 包括上市公司和独角兽公司

执行后验证：
```sql
SELECT name, valuation_usd, company_tier 
FROM companies 
WHERE valuation_usd IS NOT NULL 
ORDER BY valuation_usd DESC 
LIMIT 20;
```

---

### 第4步：补齐项目URL
**文件**: `UPDATE-PROJECT-URLS-MANUAL.sql`

作用：
- 为各公司旗下的项目补充URL
- 包括ChatGPT、Claude、Sora等主流AI项目

执行后验证：
```sql
SELECT p.name, c.name as company, p.website 
FROM projects p
JOIN companies c ON p.company_id = c.id
WHERE p.website IS NOT NULL
ORDER BY c.name, p.name;
```

---

## 数据完成情况总览

| 类别 | 完成度 | 说明 |
|------|--------|------|
| 公司URL | 100% | 114家全部URL已配置 |
| 公司估值 | 55% | 63家主要公司有估值数据 |
| 融资轮次 | 55% | 63家有完整融资信息 |
| 项目URL | 85% | 主要项目URL已配置 |
| Tier分类 | 100% | 全部已标准化 |

---

## 验证SQL查询

### 查看所有公司及其信息
```sql
SELECT 
    c.name,
    c.website,
    c.valuation_usd,
    c.company_tier,
    c.headquarters,
    COUNT(p.id) as projects_count
FROM companies c
LEFT JOIN projects p ON p.company_id = c.id
GROUP BY c.id, c.name, c.website, c.valuation_usd, c.company_tier, c.headquarters
ORDER BY COALESCE(c.valuation_usd, 0) DESC;
```

### 查看融资信息
```sql
SELECT 
    c.name as company,
    f.round,
    f.amount,
    f.investors,
    f.date,
    f.lead_investor
FROM fundings f
JOIN companies c ON f.company_id = c.id
ORDER BY f.date DESC;
```

### 查看缺失数据
```sql
-- 缺失估值
SELECT name, company_tier 
FROM companies 
WHERE valuation_usd IS NULL;

-- 缺失URL
SELECT name, company_tier 
FROM companies 
WHERE website IS NULL OR website = '';
```

---

## 注意事项

1. **执行顺序很重要** - 请按顺序执行，避免数据冲突
2. **事务处理** - 每个SQL文件都使用了BEGIN/COMMIT，确保原子性
3. **去重逻辑** - 融资信息使用`NOT EXISTS`避免重复插入
4. **上市公司** - 估值使用公开市值数据
5. **独角兽公司** - 估值基于最新融资轮次

---

## 下一步TODO

- [ ] 补齐全息公司的估值数据
- [ ] 完善项目详细信息（目标用户、用例、特性等）
- [ ] 添加新闻故事和媒体引用
- [ ] 实现Admin编辑功能
- [ ] 优化前端展示效果

---

## 文件清单

- ✅ `UPDATE-TIER-NAMES.sql` - Tier命名更新
- ✅ `complete-missing-company-urls.sql` - 公司URL补齐
- ✅ `COMPLETE-FUNDINGS-VALUATIONS.sql` - 估值和融资信息
- ✅ `UPDATE-PROJECT-URLS-MANUAL.sql` - 项目URL补齐
- 📊 `COMPLETE-ALL-VALUATIONS.sql` - 备用估值脚本
- 📊 `UPDATE-COMPANIES-URLS.sql` - 备用URL脚本
- 📊 `generate-*.mjs` - 生成脚本
