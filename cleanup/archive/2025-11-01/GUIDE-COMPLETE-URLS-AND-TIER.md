# 补齐公司URL和项目URL指南

## 步骤1：更新Tier名称
在Supabase SQL Editor中执行 `UPDATE-TIER-NAMES.sql`
- Tier 1 → Giant
- Tier 2 → Unicorn

## 步骤2：补齐公司URL
在Supabase SQL Editor中执行 `UPDATE-COMPANIES-URLS.sql`
- 已有74个常见AI公司的URL

## 步骤3：补齐项目URL
在Supabase SQL Editor中执行 `UPDATE-PROJECT-URLS-MANUAL.sql`
- 覆盖主要AI项目的URL

## 步骤4：查询缺失数据
如需查看仍有URL缺失的公司/项目，执行查询脚本：
- `QUERY-COMPANIES-WITHOUT-URLS.sql` - 查看缺失URL的公司
- `QUERY-PROJECTS-WITHOUT-URLS.sql` - 查看缺失URL的项目

## 注意事项

### 公司URL vs 项目URL
- **公司URL**：通常是公司的主网站（如 `openai.com`）
- **项目URL**：
  - 可能是子域名（如 `chat.openai.com`）
  - 可能是独立产品页（如 `claude.ai`）
  - 有时与公司URL相同

### Tier定义
- **Giant（大厂）**：科技巨头，如 OpenAI, Google, Microsoft, Meta, 等
- **Unicorn（独角兽）**：估值≥$1B的AI初创公司，如 Character.AI, Midjourney, 等
- **Independent（独立）**：估值<$1B的独立AI公司
- **Emerging（新兴）**：早期阶段的AI创业公司

### 推荐执行顺序
1. 先执行 `UPDATE-TIER-NAMES.sql` 统一命名
2. 再执行 `UPDATE-COMPANIES-URLS.sql` 补齐公司URL
3. 最后执行 `UPDATE-PROJECT-URLS-MANUAL.sql` 补齐项目URL
4. 检查剩余缺失项并手动补充

## 手动补充
对于不在现有SQL中的公司和项目，可以：
1. 使用查询脚本查找缺失项
2. 使用LLM深研模式查找真实URL
3. 手动在Supabase SQL Editor中执行UPDATE语句

