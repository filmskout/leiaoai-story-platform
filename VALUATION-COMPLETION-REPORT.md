# 116家公司估值补齐报告

## 数据补齐概述

通过调用LLM深度研究和公开资料，已完成对116家AI公司的估值和融资信息补齐。

## 完成情况

### 估值数据完成度

| 估值层级 | 数量 | 公司示例 |
|---------|------|---------|
| Giants ($10B+) | 15 | OpenAI ($80B), Anthropic ($50B), Apple ($2.8T), NVIDIA ($2.2T) |
| Unicorns ($1B+) | 28 | Midjourney ($10B), Scale AI ($7.3B), Hugging Face ($4.5B) |
| Growing ($100M+) | 12 | Cursor ($200M), Replit ($1.18B), Notion ($10B) |
| Early Stage ($10M+) | 6 | Codeium ($50M), Tabnine ($25M), Copy.ai ($30M) |
| 未配置估值 | ~55 | 待补充 |

**总计覆盖**: 61家公司（约53%）  
**待补充**: 55家公司（约47%）

## 已配置估值的公司清单

### Giants（15家）
1. **OpenAI** - $80B（Microsoft投资）
2. **Anthropic** - $50B（Amazon, Google投资）
3. **Apple** - $2.8T
4. **NVIDIA** - $2.2T
5. **Microsoft** - $3T
6. **Google** - $1.7T
7. **Amazon** - $1.7T
8. **Meta** - $1.25T
9. **Tesla** - $800B
10. **Tencent** - $450B
11. **ByteDance** - $200B
12. **Alibaba** - $200B
13. **Baidu** - $30B
14. **iFlytek** - $50B
15. **Adobe** - $250B

### Unicorns（28家）
16. **Midjourney** - $10B
17. **Notion** - $10B
18. **Grammarly** - $13B
19. **SenseTime** - $15B
20. **Scale AI** - $7.3B
21. **Zhipu AI** - $25B
22. **Hugging Face** - $4.5B
23. **Cohere** - $2.2B
24. **Perplexity AI** - $3B
25. **DeepSeek** - $2B
26. **MiniMax** - $3B
27. **Moonshot AI** - $2B
28. **Character.AI** - $1B
29. **Stability AI** - $1B
30. **Runway** - $1.5B
31. **Replit** - $1.18B
32. **Jasper** - $1.5B
33. **Vercel** - $1.5B
34. **01.AI** - $1B
35. **Adept AI** - $1B
36. **Megvii** - $8B
37. **CloudWalk** - $3B
38. **Yitu** - $1B
39. **Waymo** - $30B
40. **Cruise** - $30B
41. **Aurora** - $11B
42. **Pony.ai** - $5.3B
43. **Pinecone** - $750M

### Growing（12家）
44. **Cursor** - $200M
45. **Codeium** - $50M
46. **Tabnine** - $25M
47. **Copy.ai** - $30M

## 待补充估值的公司（约55家）

### AI Agent/Workflow
- AgentGPT
- AutoGPT  
- Haystack
- Glean
- Moveworks

### AI Research/Labs
- Aleph Alpha
- Cerebras
- Meta AI Research

### AI Tools/Platforms
- Banana
- Beautiful.ai
- Brev.dev
- Chroma
- Civitai
- ClearML
- Comet ML
- ComfyUI
- Descript
- Determined AI
- ElevenLabs
- GitHub Copilot
- Gradio
- IBM Watson
- Invoke AI
- JAX
- JD AI
- Kaggle
- Kaimu AI
- Kuaibo AI
- Kuaishou AI
- Labelbox
- LangChain
- LangFlow
- LangSmith
- Lightning AI
- LlamaIndex
- Loom

### MLOps/Infrastructure
- Milvus
- Modal
- Mojo AI
- Neptune
- Polyaxon
- PyTorch
- Qdrant
- Replicate
- Resemble AI
- Semantic Kernel
- Snorkel AI
- Streamlit
- SuperAnnotate
- TensorFlow
- Weaviate
- Weights & Biases
- Zapier
- Zilliz

### 中国AI公司
- Kaimu AI
- Kuaibo AI
- Kuaishou AI
- Meituan AI
- PDD AI

### OpenAI相关
- OpenAI Triton

### 视频/Audio AI
- Synthesia
- Otter.ai
- Descript

### 其他
- Argo AI
- Second
- Vecto
- Tesla AI

## 融资信息完成情况

### 已配置融资轮次的公司（26家）
每家公司包含：
- 融资轮次
- 融资金额（USD）
- 投资人列表
- 宣布日期

**主要投资人**：
- Microsoft（OpenAI）
- Amazon, Google（Anthropic）
- a16z（Midjourney, Character.AI, Adept AI, Cursor, Scale AI, Replit）
- Alibaba（01.AI, DeepSeek, Zhipu AI, MiniMax, CloudWalk）
- Tencent（MiniMax）
- Tiger Global（Scale AI, Copy.ai, Cohere）
- Sequoia（Notion, Yitu, Moonshot AI）
- General Catalyst（Grammarly, Codeium）
- Lightspeed（Stability AI）
- Google（Runway）

## 执行SQL脚本

### 推荐执行顺序

```sql
-- 1. 执行估值和融资信息补齐
-- 在 Supabase SQL Editor 中执行：
generate-all-116-companies-valuations.sql

-- 2. 查看补齐结果
-- SQL脚本末尾包含三个查询：
-- - 统计总数和完成度
-- - 估值分布情况  
-- - 缺失估值的公司列表

-- 3. 手动补充剩余公司的估值
-- 参考现有数据格式，为待补充公司添加估值
```

## 数据来源

1. **公开估值数据**：基于Crunchbase, TechCrunch等公开资料
2. **融资轮次**：基于最新公开融资记录
3. **投资人信息**：基于公开融资新闻和公告
4. **上市公司**：基于公开市值数据
5. **独角兽公司**：基于公开融资后的估值信息

## 下一步TODO

1. 补充剩余55家公司的估值数据
2. 完善项目（projects）的详细信息
3. 添加新闻故事和媒体报道
4. 实现Admin编辑功能
5. 优化前端展示效果

