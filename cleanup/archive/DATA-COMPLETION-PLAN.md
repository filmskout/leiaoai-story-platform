# 公司数据完善计划

## 📊 数据库字段结构

### companies 表
- `description` (简短描述，100字内，用于列表页)
- `detailed_description` (详细描述，400字+，用于详情页)
- `website` (官网)
- `headquarters` (总部地址)
- `founded_year` (成立年份)
- `employee_count` (员工规模)
- `logo_url` / `logo_storage_url` (Logo)
- `valuation` (估值)
- `industry` (行业分类)

### projects 表
- `company_id` (所属公司)
- `name` (项目名称)
- `description` (简短描述，列表页用)
- `detailed_description` (详细描述，详情页用)
- `website` (项目官网)
- `category` (分类)
- `category_tags` (标签)
- `target_users` (目标用户)
- `pricing_model` (定价模式)
- `key_features` (核心功能)
- `use_cases` (使用场景)
- `user_stories` (用户故事)
- `latest_features` (最新功能)
- `logo_url` (Logo)

### fundings 表
- `company_id` (公司ID)
- `round` (轮次：Seed/A/B/C/D/E/IPO等)
- `amount` (融资金额，USD)
- `investors` (投资者列表)
- `valuation` (该轮估值)
- `date` (日期)
- `lead_investor` (主投)

### stories 表
- `company_id` (公司ID)
- `project_id` (项目ID，可选)
- `title` (标题)
- `content` (内容)
- `excerpt` (摘要)
- `source_url` (源链接)
- `published_date` (发布日期)
- `category` (分类)
- `tags` (标签)

## 🎯 需要完成的具体任务

### 1. 公司简介分离 (优先级: 高)

**问题**: 目前列表页和详情页使用同一个 description 字段

**解决**:
- `description`: 简短版本，100字内，用于列表页卡片
- `detailed_description`: 详细版本，400字+，用于详情页

**实现**: 更新 `AICompaniesCatalog.tsx` 和 `CompanyDetail.tsx` 使用不同字段

### 2. Project 详情页 (优先级: 高)

**当前**: 没有独立的 project 详情页

**需要**:
- 创建 `ProjectDetail.tsx` 页面
- 路由: `/project/:id`
- 显示：详细描述、核心功能、使用场景、用户故事、最新功能

**需要修复的 projects**:
- Adobe Express (链接错误)
- Adobe Firefly (已正确)
- Anthropic Claude
- Anthropic Claude Code
- 其他公司的 projects

### 3. 完善 Projects 数据 (优先级: 高)

**当前**: 许多公司没有 projects，或 projects 数据不完整

**需要为每个公司添加**:
- Anthropic: Claude, Claude Code
- OpenAI: ChatGPT, GPT-4, DALL-E, Sora, Codex
- Google: Gemini, Bard, DeepMind
- Microsoft: Copilot, Azure AI
- Meta: Llama, Reels AI
- 其他114家公司

### 4. 融资信息 (优先级: 中)

**当前**: 大部分公司没有 funding 数据

**需要为每家公司添加**:
- 融资历史（Seed, A轮, B轮, C轮等）
- 各轮融资金额
- 投资者信息
- 估值信息
- 日期

### 5. Stories 新闻生成 (优先级: 中)

**当前**: 大部分公司没有 stories

**需要**:
- 搜索每个公司的最新新闻
- 生成 350-500 字总结
- 添加源链接和发布日期
- 根据公司层级生成不同数量（Tier 1: 4条, Tier 2: 3条, Tier 3: 2条）

## 📝 实施计划

### 阶段1: 数据模型修复
1. 更新数据库 schema（添加 detailed_description 等字段）
2. 更新 API 返回字段
3. 更新前端使用不同字段

### 阶段2: 补齐基础数据
1. 使用大模型补齐所有公司的 description 和 detailed_description
2. 补齐 website、headquarters、founded_year、employee_count
3. 修复已有 projects 的数据
4. 为缺失公司添加 projects

### 阶段3: 添加高级数据
1. 补齐所有 fundings 信息
2. 为每个公司生成 2-4 条 stories
3. 更新所有 logos

### 阶段4: 创建详情页
1. 创建 ProjectDetail 页面
2. 更新路由配置
3. 添加从列表页到详情页的链接

## 🔧 需要的脚本

1. `separate-descriptions.sql` - 分离简介和详细描述字段
2. `generate-detailed-descriptions.mjs` - 使用LLM生成详细描述
3. `add-missing-projects.mjs` - 为所有公司添加projects
4. `generate-fundings.mjs` - 生成融资信息
5. `generate-news-stories.mjs` - 搜索新闻并生成stories
6. `fix-project-links.sql` - 修复project链接错误

现在创建这些脚本和更新。
