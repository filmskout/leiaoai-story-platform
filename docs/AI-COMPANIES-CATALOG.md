# AI公司目录功能

## 概述

AI公司目录是一个全面的AI公司及其工具套件的展示平台，基于a16z的AI应用支出报告和Top 100 Gen AI应用列表构建。该功能将原有的工具页面转换为一个结构化的AI公司目录，包含评分、收藏、故事创建等互动功能。

## 功能特性

### 1. 公司展示
- **公司信息**: 名称、描述、成立年份、总部位置
- **估值信息**: 最新估值和融资轮次
- **行业标签**: 公司所属的技术领域
- **官方链接**: 公司官网和社交媒体链接

### 2. 工具套件
- **工具列表**: 每个公司提供的AI工具和模型
- **功能特性**: 工具的主要功能和能力
- **定价信息**: 免费版本和API可用性
- **行业应用**: 工具适用的行业和场景

### 3. 用户互动
- **1-5星评分系统**: 用户可以对工具进行评分
- **收藏功能**: 用户可以收藏感兴趣的工具
- **故事创建**: 用户可以创建使用体验和评价故事
- **预填充标签**: 创建故事时自动填充相关标签

### 4. 搜索和筛选
- **智能搜索**: 支持公司名称、工具名称、技术标签搜索
- **类别筛选**: 按工具类别筛选
- **多种排序**: 按名称、估值、工具数量、评分排序

## 技术实现

### 数据库结构
- `companies`: 公司基本信息
- `tools`: 工具详细信息
- `tool_ratings`: 用户评分
- `user_favorites`: 用户收藏
- `tool_stories`: 工具故事关联
- `company_stories`: 公司故事关联
- `tool_stats`: 工具统计信息
- `company_stats`: 公司统计信息

### API端点
- `GET /api/ai-companies`: 获取AI公司列表
- `POST /api/create-tool-story`: 创建工具相关故事
- `POST /api/submit-rating`: 提交工具评分
- `POST /api/toggle-favorite`: 切换收藏状态

### 前端组件
- `AICompaniesCatalog`: 主页面组件
- 响应式设计，支持移动端
- 动画效果和交互反馈
- 模态对话框用于故事创建

## 数据来源

### 主要AI公司
1. **OpenAI**: ChatGPT, DALL-E, Sora, Whisper, GPT-4 API
2. **Anthropic**: Claude, Claude API
3. **Google**: Gemini, Gemini API, NotebookLM
4. **Microsoft**: Copilot, Azure OpenAI
5. **Meta**: LLaMA, Code Llama
6. **Perplexity AI**: Perplexity Pro, Perplexity API
7. **Replit**: Replit Agent, Replit Workspace
8. **ElevenLabs**: ElevenLabs Voice, ElevenLabs API
9. **Midjourney**: Midjourney Bot
10. **Notion**: Notion AI
11. **Canva**: Magic Design, Magic Write
12. **Scale AI**: 数据标注服务
13. **Databricks**: 数据分析平台
14. **Hugging Face**: 模型和数据集平台
15. **Stability AI**: 开源AI模型

### 融资信息
- OpenAI: $300B估值，$40B融资
- Anthropic: $61.5B估值，$3.5B融资
- Databricks: $62B估值，$10B融资
- Scale AI: $14B估值，$1B融资

## 使用方法

### 访问页面
访问 `/ai-companies` 路径查看AI公司目录

### 搜索和筛选
1. 使用搜索框输入关键词
2. 选择工具类别进行筛选
3. 选择排序方式

### 评分和收藏
1. 点击工具卡片上的星星进行评分
2. 点击心形图标收藏工具
3. 需要登录才能使用这些功能

### 创建故事
1. 点击工具或公司卡片上的"故事"按钮
2. 填写故事标题和内容
3. 系统会自动预填充相关标签
4. 提交后故事会关联到对应的工具或公司

## 未来扩展

### 计划功能
- 实时数据更新
- 更多AI公司数据
- 用户评论系统
- 工具对比功能
- 投资信息展示
- 技术趋势分析

### 数据集成
- 集成更多数据源
- 自动化数据更新
- 实时融资信息
- 技术新闻集成

## 维护说明

### 数据更新
- 定期更新公司信息
- 添加新的AI工具
- 更新融资信息
- 维护logo链接

### 功能优化
- 性能优化
- 用户体验改进
- 移动端适配
- 无障碍访问

## 相关文件

- `src/pages/AICompaniesCatalog.tsx`: 主页面组件
- `src/services/tools.ts`: 工具相关API服务
- `api/create-tool-story.ts`: 故事创建API
- `supabase/migrations/2025-01-20_ai_companies_catalog.sql`: 数据库迁移
- `supabase/migrations/2025-01-20_seed_ai_companies.sql`: 种子数据
