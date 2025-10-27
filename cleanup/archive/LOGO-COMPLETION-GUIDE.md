# Logo批量补齐功能使用指南

## 🎯 功能说明

使用Qwen Turbo自动为缺失Logo的AI公司补齐Logo，通过以下方式：

1. **Qwen分析公司名称** → 生成域名和关键词
2. **Clearbit Logo** → 优先使用Clearbit官方Logo
3. **Unavatar备选** → 如果Clearbit不可用，使用Unavatar
4. **自动保存** → 更新到数据库

## 📝 使用方法

### 通过API调用

```bash
curl -X POST "https://leiao.ai/api/unified" \
  -H "Content-Type: application/json" \
  -d '{
    "action": "batch-complete-logos",
    "token": "YOUR_ADMIN_TOKEN",
    "limit": 50
  }'
```

### 参数说明

- `token`: 管理员token
- `limit`: 最多处理的公司数量（默认50）

## 🔍 Logo生成流程

### 1. Qwen分析公司
```javascript
为AI公司"OpenAI"提供Logo信息。请返回JSON格式：
{
  "search_keyword": "OpenAI logo",
  "clearbit_domain": "openai.com",
  "description": "AI公司"
}
```

### 2. 生成Logo URL
```javascript
优先使用: https://logo.clearbit.com/openai.com
备选使用: https://unavatar.io/openai
```

### 3. 更新数据库
```javascript
{
  logo_url: "https://logo.clearbit.com/openai.com",
  logo_storage_url: "https://logo.clearbit.com/openai.com",
  logo_updated_at: "2024-10-26T10:00:00Z"
}
```

## ⚡ 特性

1. **智能识别**: Qwen自动识别公司域名
2. **多重备选**: Clearbit → Unavatar → 本机处理
3. **批量处理**: 一次处理最多50家公司
4. **防止限流**: 自动添加500ms延迟
5. **详细报告**: 返回成功/失败统计

## 📊 返回格式

```json
{
  "success": true,
  "message": "Logo批量更新完成: 成功 45, 失败 5",
  "completed": 45,
  "failed": 5,
  "total": 50,
  "results": [
    {
      "company": "OpenAI",
      "status": "success",
      "logoUrl": "https://logo.clearbit.com/openai.com"
    },
    {
      "company": "Anthropic",
      "status": "success",
      "logoUrl": "https://logo.clearbit.com/anthropic.com"
    }
  ]
}
```

## 🎨 Logo来源

### Clearbit Logo API
- 官方Logo服务
- 高质量向量Logo
- URL格式: `https://logo.clearbit.com/{domain}`

### Unavatar API
- 开源Logo聚合
- 多数据源
- URL格式: `https://unavatar.io/{domain}`

## 💡 使用建议

1. **首次使用**: 建议设置 `limit: 20` 进行测试
2. **批量补齐**: 使用 `limit: 50` 处理更多公司
3. **定期运行**: 新公司添加后定期运行补齐Logo
4. **监控结果**: 查看返回的统计信息

## ⚠️ 注意事项

- Logo URL是外部链接，需要稳定访问
- 部分公司可能没有官方Logo，会失败
- 建议分批处理，避免一次性处理太多
- 如有失败，可以手动重新运行
