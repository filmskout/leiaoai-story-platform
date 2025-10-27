# 公司和项目数据重构说明

## 🔍 发现的问题

### 1. Adobe相关
- ❌ **错误**: Adobe Express 和 Adobe Firefly 是独立公司
- ✅ **正确**: 
  - Adobe (公司) → Adobe Express (项目)
  - Adobe (公司) → Adobe Firefly (项目)
  - 只有一个Adobe公司，使用Adobe的logo

### 2. Vercel相关
- ❌ **错误**: v0 by Vercel 是独立公司
- ✅ **正确**:
  - Vercel (公司) → v0 (项目)
  - 使用Vercel的logo

### 3. 失效的Logo公司列表
需要重新补齐以下公司的logo：
- Anthropic
- Codeium
- DeepSeek
- Lovable
- Manus
- OpenAI
- Stability AI
- Adobe (合并)

## 🛠️ 需要执行的操作

### 1. 合并公司
```sql
-- 合并Adobe Express和Adobe Firefly到Adobe
UPDATE projects SET company_id = (SELECT id FROM companies WHERE name = 'Adobe') WHERE name IN ('Adobe Express', 'Adobe Firefly');
DELETE FROM companies WHERE name IN ('Adobe Express', 'Adobe Firefly');

-- 合并v0到Vercel
UPDATE projects SET company_id = (SELECT id FROM companies WHERE name = 'Vercel') WHERE name = 'v0 by Vercel';
DELETE FROM companies WHERE name = 'v0 by Vercel';
```

### 2. 补齐Logo
重新运行Logo补齐功能，为以上公司添加logo

### 3. 验证数据
确保每个公司都有唯一正确的logo和项目列表
