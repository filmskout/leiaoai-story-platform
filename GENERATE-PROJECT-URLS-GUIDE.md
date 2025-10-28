# 批量补齐项目URL指南

## 方法一：使用Node.js脚本自动生成SQL

### 步骤1：配置环境变量
确保 `.env` 文件包含以下变量：
```bash
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
QWEN_API_KEY=your_qwen_api_key
```

### 步骤2：运行生成脚本
```bash
cd /Users/kengorgor/repo/leiaoai-story-platform
node generate-project-urls-sql.mjs
```

### 步骤3：查看生成的SQL文件
脚本会生成多个 `update-project-urls-batch{N}.sql` 文件（每批30个项目）

### 步骤4：在Supabase SQL Editor中执行
1. 打开 Supabase Dashboard → SQL Editor
2. 按批次顺序执行SQL文件：
   - `update-project-urls-batch1.sql`
   - `update-project-urls-batch2.sql`
   - 以此类推

---

## 方法二：使用 `/api/unified` API端点

### 调用API
```bash
curl -X POST https://leiao.ai/api/unified \
  -H "Content-Type: application/json" \
  -d '{
    "action": "batch-enrich-projects",
    "token": "your_admin_token",
    "limit": 30
  }'
```

此方法会在后台自动调用LLM补齐项目URL，无需手动执行SQL。

---

## 方法三：手动编写SQL

直接编写SQL更新语句：

```sql
-- 示例：更新OpenAI ChatGPT的URL
UPDATE projects 
SET website = 'https://chat.openai.com'
WHERE name = 'ChatGPT' 
AND company_id = (SELECT id FROM companies WHERE name = 'OpenAI');

-- 示例：更新Anthropic Claude的URL
UPDATE projects 
SET website = 'https://claude.ai'
WHERE name = 'Claude' 
AND company_id = (SELECT id FROM companies WHERE name = 'Anthropic');
```

---

## 推荐流程

1. **首选**：使用方法一（Node.js脚本）
   - 自动调用LLM查找URL
   - 生成可直接执行的SQL文件
   - 分批处理，避免限流

2. **备选**：使用方法二（API端点）
   - 适合少量项目更新
   - 实时查看进度

3. **最后**：使用方法三（手动SQL）
   - 适合已知确切URL的项目
   - 快速批量更新

---

## 注意事项

- ⚠️ 每批处理间隔至少1秒（避免API限流）
- ✅ 已有URL的项目会自动跳过
- 🔍 LLM查找失败的项目需要手动补充
- 📊 建议分批执行，每批30个项目

