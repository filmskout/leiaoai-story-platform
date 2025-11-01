# 公司信息补齐指南

## 功能说明

现在你可以使用LLM工具手动补齐公司信息，包括：

### 1. LLM自动补齐工具

访问 `/company-enrich-tool` 页面（需要管理员权限）

**功能：**
- 输入公司名称（如：百度、阿里巴巴、腾讯）
- 自动调用LLM（OpenAI/DeepSeek）搜索并补齐以下信息：
  - 公司描述
  - 官方网站
  - 市场估值（USD）
  - 成立年份
  - 总部地址
  - 公司层级（Giant/Unicorn/Independent/Emerging）
  - 行业标签

**使用方法：**
1. 打开 `/company-enrich-tool` 页面
2. 输入公司名称
3. 点击"补齐信息"按钮
4. 查看补齐的信息
5. 可以选择：
   - **复制SQL** - 复制生成的SQL语句，手动在Supabase SQL Editor中执行
   - **保存到数据库** - 直接保存（如果公司已存在则更新，不存在则创建）

### 2. 手动编辑公司

访问 `/company-management` 页面（需要管理员权限）

**功能：**
- 查看所有公司列表
- 编辑公司信息（名称、描述、网站、估值、成立年份等）
- 上传/替换公司Logo（支持URL或Base64）
- 创建新公司
- 删除公司

## 补齐国内公司

### 需要补齐的国内公司列表：
- 百度 (Baidu)
- 阿里巴巴 (Alibaba)
- 腾讯 (Tencent)
- 字节跳动 (ByteDance)
- 华为 (Huawei)
- 其他...

### 批量补齐步骤：

1. **使用LLM工具逐个补齐：**
   - 访问 `/company-enrich-tool`
   - 输入"百度"，补齐信息，保存
   - 输入"阿里巴巴"，补齐信息，保存
   - 以此类推...

2. **或者使用SQL脚本：**
   - 补齐后可以复制SQL
   - 在Supabase SQL Editor中批量执行

## Story生成问题

如果Stories没有生成成功，可能的原因：

1. **数据库中没有stories数据**
   - 运行 `scripts/generate-category-stories.mjs`
   - 需要配置环境变量（SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, PPLX_API_KEY或OPENAI_API_KEY）

2. **运行生成脚本：**
```bash
cd /Users/kengorgor/repo/leiaoai-story-platform
node scripts/generate-category-stories.mjs
```

这将：
- 为每个category生成至少10篇story
- 自动链接到项目和公司
- 生成封面图片URL
- 插入到数据库

## 常见问题

### Q: 为什么找不到某些公司？
A: 可能原因：
- 公司名称拼写不同（如：Baidu vs 百度）
- 数据库中确实不存在
- 使用 `/company-enrich-tool` 补齐即可

### Q: Logo错误怎么办？
A: 使用 `/company-management` 页面：
- 找到对应的公司
- 点击"编辑"
- 在"Logo"标签页中上传新Logo或提供URL

### Q: 如何批量补齐公司信息？
A: 可以：
1. 逐个使用 `/company-enrich-tool`
2. 或者运行批量脚本（需要创建）

## API端点

### enrich-company-llm
```javascript
POST /api/unified
{
  action: 'enrich-company-llm',
  token: 'admin-token',
  companyName: 'Baidu'
}
```

### save-enriched-company
```javascript
POST /api/unified
{
  action: 'save-enriched-company',
  token: 'admin-token',
  companyData: {
    name: 'Baidu',
    description: '...',
    website: 'https://www.baidu.com',
    // ... 其他字段
  }
}
```

