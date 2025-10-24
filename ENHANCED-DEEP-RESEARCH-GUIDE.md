# 🚀 Enhanced Deep Research AI Company Data Generation System

## 📋 完整执行步骤

### 第一步：更新数据库结构
1. 打开 Supabase SQL Editor
2. 复制并执行 `enhance-database-schema.sql` 脚本
3. 确认所有表结构已更新（tools → projects，新增字段）

### 第二步：测试增强版系统
```bash
# 测试增强版生成系统
node test-enhanced-system.js
```

### 第三步：运行完整生成
```bash
# 运行200+公司完整生成
node enhanced-deep-research-generator.js
```

## 🎯 系统特性

### 📊 增强数据结构

#### Companies表 (20个增强字段)
- **基础信息**: name, description, detailed_description, website
- **公司详情**: founded_year, headquarters, employee_count_range, valuation_usd
- **分类标签**: industry_tags, tier, company_type
- **商业模式**: business_model, key_technologies, market_focus
- **市场信息**: geographic_presence, partnerships, awards
- **研究数据**: research_papers, patents, open_source_projects
- **时间信息**: last_funding_date, last_product_launch, updated_at

#### Projects表 (15个详细字段)
- **基础信息**: name, description, url, category
- **项目详情**: project_type, launch_date, status, pricing_model
- **目标用户**: target_audience, technology_stack, use_cases
- **集成信息**: integrations, documentation_url, github_url
- **演示信息**: demo_url, pricing_url
- **时间信息**: created_at, updated_at

#### Stories表 (10个增强字段)
- **基础信息**: title, content, source_url, published_at
- **分类信息**: story_type, sentiment, impact_score, tags
- **作者信息**: author, word_count, reading_time
- **时间信息**: created_at, updated_at

### 🔬 深度研究内容

#### 公司详情 (20个研究领域)
1. 公司概述与使命声明
2. 核心AI产品与服务组合
3. 技术栈与创新能力
4. 市场地位与竞争格局
5. 商业模式与收入来源
6. 关键领导层与创始团队
7. 融资历史与主要投资者
8. 最新发展与战略举措
9. 行业影响与认可
10. 未来路线图与愿景
11. 技术能力与专利
12. 战略合作伙伴关系
13. 地理分布与市场覆盖
14. 员工数量与公司文化
15. 监管与伦理方法
16. 研究出版物与学术贡献
17. 开源贡献与社区
18. 客户基础与用例
19. 定价策略与市场可访问性
20. 竞争优势与差异化

#### 项目产品 (10个研究领域)
1. 主要AI产品与平台
2. 特定AI工具与应用
3. 软件与开发平台
4. 硬件与基础设施解决方案
5. 云服务与API
6. 开发者工具与SDK
7. 企业解决方案与服务
8. 消费者应用与服务
9. 研究工具与数据集
10. 开源项目与库

#### 融资历史 (8个研究领域)
1. 种子轮与早期融资
2. A、B、C、D、E+轮融资
3. 战略投资与企业合作
4. 政府资助与研究资金
5. IPO信息与公开市场数据
6. 收购详情与退出信息
7. 当前估值与市值
8. 主要投资者与董事会成员

#### 新闻故事 (10个研究领域)
1. 最新产品发布与更新
2. 重大合作伙伴关系与战略合作
3. 融资公告与投资新闻
4. 领导层变动与高管变动
5. 技术突破与创新
6. 市场扩张与地理增长
7. 监管发展与合规
8. 竞争动态与市场定位
9. 行业认可与奖项
10. 未来公告与路线图更新

### 📈 公司分类层级 (10个层级，200+公司)

1. **Tier 1 - Tech Giants** (10家)
   - OpenAI, Google DeepMind, Microsoft AI, Meta AI, Apple AI, Amazon AI, Tesla AI, NVIDIA, IBM Watson, Intel AI

2. **Tier 2 - AI Unicorns** (14家)
   - Anthropic, Cohere, Stability AI, Midjourney, Hugging Face, Jasper, Copy.ai, Notion, Figma, Canva, Character.AI, Runway, Replicate, Together AI, Perplexity

3. **Tier 3 - Enterprise AI** (15家)
   - Salesforce Einstein, Adobe AI, SAP AI, ServiceNow AI, Workday AI, Oracle AI, Cisco AI, HubSpot, Intercom, Freshworks, Zendesk, Slack, Microsoft Copilot, Google Workspace AI, Zoom AI

4. **Tier 4 - Chinese Tech Giants** (16家)
   - 百度AI, 腾讯AI, 阿里巴巴AI, 字节跳动AI, 美团AI, 滴滴AI, 京东AI, 拼多多AI, 小米AI, 华为AI, OPPO AI, vivo AI, 一加AI, realme AI, 魅族AI, 联想AI

5. **Tier 5 - Chinese AI Unicorns** (16家)
   - 商汤科技, 旷视科技, 依图科技, 云从科技, 第四范式, 明略科技, 思必驰, 科大讯飞, 海康威视, 寒武纪, 地平线, Momenta, 驭势科技, 小马智行, 文远知行, 百度Apollo

6. **Tier 6 - Autonomous Driving** (16家)
   - Waymo, Cruise, Argo AI, Aurora, Tesla Autopilot, Mobileye, NVIDIA Drive, Qualcomm Snapdragon Ride, Intel Mobileye, Bosch, Continental, Magna, Aptiv, Veoneer, Luminar, Innoviz

7. **Tier 7 - AI Infrastructure** (16家)
   - Databricks, Snowflake, Palantir, Scale AI, Labelbox, Weights & Biases, MLflow, Kubeflow, Ray, Apache Spark, TensorFlow, PyTorch, Hugging Face Transformers, LangChain, LlamaIndex, Pinecone

8. **Tier 8 - AI Applications** (18家)
   - Grammarly, Zoom, Twilio, Discord, SendGrid, Pardot, Loom, Calendly, Notion, Airtable, Monday.com, Asana, Trello, Miro, Figma, Canva, Adobe Creative Suite, Framer

9. **Tier 9 - AI Research Labs** (15家)
   - DeepMind, OpenAI Research, Anthropic Research, Google Research, Microsoft Research, Meta AI Research, Apple Machine Learning, Amazon Science, IBM Research, Intel AI Lab, NVIDIA Research, Stanford AI Lab, MIT CSAIL, CMU AI, Berkeley AI Research

10. **Tier 10 - AI Hardware** (15家)
    - NVIDIA, AMD, Intel, Qualcomm, Apple Silicon, Google TPU, Tesla Dojo, Cerebras, Graphcore, SambaNova, Groq, Mythic, Syntiant, Hailo, Kneron, Horizon Robotics

### ⚡ 技术特性

- **三重Fallback机制**: DeepSeek → OpenAI → Qwen
- **速率限制保护**: 3秒间隔防止API限制
- **错误处理**: 自动重试和错误恢复
- **实时进度**: 详细日志和进度跟踪
- **数据验证**: JSON格式标准化和内容清理
- **报告生成**: 自动生成执行报告

## 🔧 环境配置

### 必需的API Keys
```bash
# DeepSeek API Key (主要)
export DEEPSEEK_API_KEY="sk-55e94a8cacc041e29b3d43310575e2dd"

# OpenAI API Key (备用)
export OPENAI_API_KEY="your-openai-key"

# Qwen API Key (备用)
export QWEN_API_KEY="your-qwen-key"
```

### Admin Token
```bash
# 已在脚本中配置
ADMIN_TOKEN="R8mn6AEgDmpKaAxE56XrejEbrL6AfBEn"
```

## 📈 预期结果

### 数据量
- **公司数量**: 200+ 家 (覆盖10个层级)
- **项目产品**: 1000-2400+ 个 (每公司5-12个)
- **融资记录**: 600-1600+ 条 (每公司3-8轮)
- **新闻故事**: 200+ 篇 (每公司1篇)

### 内容质量
- **英文内容**: 所有内容均为英文
- **深度研究**: 基于真实数据和最新信息
- **结构化数据**: 标准化的JSON格式
- **完整性**: 每个公司包含所有四个维度

### 执行时间
- **预计时长**: 3-6小时
- **API调用**: 800+ 次 (每公司4次)
- **速率限制**: 3秒间隔保护

## 🎉 完成后的验证

1. **数据库验证**: 检查Supabase中的companies、projects、fundings、stories数据
2. **前端验证**: 访问 https://leiao.ai/ai-companies 查看展示效果
3. **内容质量**: 检查生成的英文内容质量和准确性
4. **报告查看**: 检查 `enhanced-deep-research-report.json` 执行报告

## 🚨 故障排除

### 常见问题
1. **API Key错误**: 检查环境变量配置
2. **网络超时**: 检查网络连接和API服务状态
3. **数据库错误**: 确认Supabase连接和表结构
4. **JSON解析错误**: 检查API返回内容格式

### 恢复机制
- 脚本支持断点续传
- 失败的公司会记录在报告中
- 可以单独重新生成失败的公司
- 支持部分成功的数据保留
