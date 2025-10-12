# 增强版BP分析系统设计

## 🎯 目标

支持多种输入源的BP分析：
- ✅ PDF/DOCX文档
- ✅ 网站链接
- ✅ PPT/Pitch Deck
- ✅ 多个文件组合
- ✅ 图文混合内容
- ✅ 动态评分更新

---

## 🏗️ 技术架构

### 方案：使用OpenAI Assistants API

**为什么选择Assistants API？**

1. **多模态理解**
   - 可以同时处理文本和图片
   - 理解上下文和关联
   - 智能提取关键信息

2. **多文件支持**
   - 一次可上传多个文件
   - 文件之间关联分析
   - 增量添加信息

3. **持久化对话**
   - 保持分析上下文
   - 动态更新评分
   - 追问和澄清

4. **工具调用**
   - 可以调用函数计算评分
   - 结构化输出
   - 实时反馈

---

## 📊 支持的输入类型

### 1. 文档类
```
✅ PDF （通过CloudConvert转换）
✅ DOCX （直接提取）
✅ TXT （直接读取）
✅ PPT/PPTX （提取文本和图片）
```

### 2. 网络资源
```
✅ 网站链接 （爬取并解析）
✅ Google Docs 链接
✅ Notion页面
✅ 在线Pitch Deck
```

### 3. 多媒体
```
✅ 图片（产品截图、UI mockup）
✅ PPT中的图表
✅ Infographics
```

### 4. 组合输入
```
✅ BP文档 + 网站链接
✅ Pitch Deck + 产品demo视频链接
✅ 多个文档片段
```

---

## 🔄 工作流程

### 流程1：单一文档分析（当前）

```
文档上传 → 提取文本 → LLM分析 → 显示评分
```

### 流程2：增强版多源分析（新）

```
┌─────────────────┐
│ 创建Analysis    │
│ Session         │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ 添加信息源      │ ← 可多次添加
│ - 文档          │
│ - 链接          │
│ - PPT           │
│ - 图片          │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Assistant分析   │
│ - 综合理解      │
│ - 上下文关联    │
│ - 多模态融合    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ 计算评分        │
│ - 4个维度       │
│ - 动态更新      │
│ - 置信度        │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ 显示结果        │
│ - 评分卡片      │
│ - 建议反馈      │
│ - 追加信息选项  │
└─────────────────┘
```

---

## 💻 技术实现

### 1. 网站内容提取

```typescript
// api/extract-website.ts
import * as cheerio from 'cheerio';

export async function extractWebsite(url: string) {
  const response = await fetch(url);
  const html = await response.text();
  const $ = cheerio.load(html);
  
  // 提取关键信息
  return {
    title: $('title').text(),
    description: $('meta[name="description"]').attr('content'),
    content: $('body').text(),
    images: $('img').map((i, el) => $(el).attr('src')).get(),
    links: $('a').map((i, el) => $(el).attr('href')).get()
  };
}
```

### 2. PPT/PPTX提取

```typescript
// 使用 pptxgenjs 或 mammoth-like库
import * as pptx from 'pptxgenjs';

export async function extractPPT(buffer: Buffer) {
  // 提取文本
  const text = await extractText(buffer);
  // 提取图片
  const images = await extractImages(buffer);
  
  return { text, images };
}
```

### 3. OpenAI Assistants集成

```typescript
// api/bp-assistant.ts
import OpenAI from 'openai';

const openai = new OpenAI();

// 创建分析会话
export async function createAnalysisSession() {
  const assistant = await openai.beta.assistants.create({
    name: "BP Analysis Assistant",
    instructions: `你是一个专业的商业计划分析专家...`,
    tools: [
      { type: "code_interpreter" },
      { type: "retrieval" }
    ],
    model: "gpt-4-turbo-preview"
  });

  const thread = await openai.beta.threads.create();
  
  return { assistantId: assistant.id, threadId: thread.id };
}

// 添加信息源
export async function addInformationSource(
  threadId: string,
  source: {
    type: 'document' | 'website' | 'image' | 'text',
    content: string | Buffer,
    metadata?: any
  }
) {
  let message;
  
  if (source.type === 'document') {
    // 上传文件
    const file = await openai.files.create({
      file: source.content,
      purpose: 'assistants'
    });
    
    message = await openai.beta.threads.messages.create(threadId, {
      role: "user",
      content: "请分析这个文档",
      file_ids: [file.id]
    });
  } else if (source.type === 'website') {
    message = await openai.beta.threads.messages.create(threadId, {
      role: "user",
      content: `以下是从网站提取的内容：\n\n${source.content}`
    });
  }
  
  return message;
}

// 运行分析
export async function runAnalysis(
  assistantId: string,
  threadId: string
) {
  const run = await openai.beta.threads.runs.create(threadId, {
    assistant_id: assistantId,
    instructions: "请基于提供的所有信息，进行全面的BP分析，并给出4个维度的评分..."
  });
  
  // 等待完成
  let runStatus = await openai.beta.threads.runs.retrieve(threadId, run.id);
  while (runStatus.status !== 'completed') {
    await new Promise(resolve => setTimeout(resolve, 1000));
    runStatus = await openai.beta.threads.runs.retrieve(threadId, run.id);
  }
  
  // 获取消息
  const messages = await openai.beta.threads.messages.list(threadId);
  return messages.data[0].content;
}
```

---

## 🎨 UI/UX设计

### 分析页面改进

```tsx
// 当前状态显示
<AnalysisSession id={sessionId}>
  {/* 已添加的信息源 */}
  <SourceList>
    <SourceItem type="document">熵帧影视项目简介.pdf</SourceItem>
    <SourceItem type="website">https://company.com</SourceItem>
    <SourceItem type="image">产品截图.png</SourceItem>
  </SourceList>
  
  {/* 添加更多信息源 */}
  <AddSourceButton>
    <Option>上传文档</Option>
    <Option>添加网站链接</Option>
    <Option>上传图片</Option>
    <Option>粘贴文本</Option>
  </AddSourceButton>
  
  {/* 当前评分（实时更新）*/}
  <ScoreCards>
    <ScoreCard 
      title="AI Insight" 
      score={85} 
      confidence="高"
      sources={["PDF", "Website"]}
    />
    {/* ... 其他维度 */}
  </ScoreCards>
  
  {/* 分析建议 */}
  <Suggestions>
    <Suggestion>
      建议补充：市场规模数据
      <AddDataButton>添加相关信息</AddDataButton>
    </Suggestion>
  </Suggestions>
</AnalysisSession>
```

---

## 📈 动态评分系统

### 评分逻辑

```typescript
interface AnalysisScore {
  dimension: string;
  score: number;
  confidence: 'low' | 'medium' | 'high';
  basedOn: string[]; // 基于哪些信息源
  suggestions: string[]; // 改进建议
}

// 初始评分（基于第一个文档）
const initialScores = analyzeDocument(document);

// 添加新信息后更新
const updatedScores = updateScores(
  currentScores,
  newInformation,
  context
);

// 置信度计算
function calculateConfidence(sources: Source[]): 'low' | 'medium' | 'high' {
  if (sources.length >= 3) return 'high';
  if (sources.length === 2) return 'medium';
  return 'low';
}
```

---

## 🗄️ 数据库扩展

### 新表：analysis_sessions

```sql
CREATE TABLE analysis_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id),
  assistant_id TEXT,
  thread_id TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE analysis_sources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL REFERENCES analysis_sessions(id),
  source_type TEXT NOT NULL, -- 'document', 'website', 'image', 'text'
  source_url TEXT,
  source_file_id TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE analysis_scores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL REFERENCES analysis_sessions(id),
  dimension TEXT NOT NULL,
  score INTEGER NOT NULL,
  confidence TEXT NOT NULL,
  based_on TEXT[] NOT NULL,
  suggestions JSONB,
  version INTEGER DEFAULT 1, -- 评分版本号
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

---

## 🚀 实施计划

### Phase 1: 网站链接支持（最容易）
- [ ] 创建网站内容提取API
- [ ] 添加"添加网站链接"按钮
- [ ] 将网站内容发送给Assistant
- [ ] 更新UI显示多源

### Phase 2: PPT支持
- [ ] 添加PPT解析库
- [ ] 提取文本和图片
- [ ] 与文档类似处理

### Phase 3: OpenAI Assistants集成
- [ ] 创建Assistant配置
- [ ] 实现会话管理
- [ ] 多源信息综合

### Phase 4: 动态评分
- [ ] 实现增量分析
- [ ] 评分版本控制
- [ ] 置信度计算

### Phase 5: UI增强
- [ ] 多源管理界面
- [ ] 实时评分更新
- [ ] 建议和追问系统

---

## 💰 成本考虑

### OpenAI Assistants API定价

- **GPT-4 Turbo**: $0.01/1K tokens (input), $0.03/1K tokens (output)
- **文件存储**: $0.20/GB/day
- **Code Interpreter**: $0.03/session

### 估算（每次分析）
- 输入: ~5K tokens × $0.01 = $0.05
- 输出: ~2K tokens × $0.03 = $0.06
- **总计**: ~$0.11/次分析

对于多源分析，成本可能是单文档的2-3倍，但提供更全面的结果。

---

## 🎯 优先级建议

### 立即实施（Phase 1）
✅ **网站链接支持**
- 最简单
- 立即增加价值
- 用户需求高

### 短期（1-2周）
⚠️ **PPT支持**
- Pitch Deck常见格式
- 技术可行
- 差异化功能

### 中期（1个月）
📊 **OpenAI Assistants完整集成**
- 需要更多开发
- 提供最强大功能
- 竞争优势

---

想要我先实现哪个Phase？我建议从**Phase 1（网站链接支持）**开始，这样可以立即看到效果！

