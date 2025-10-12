# BP上传和分析功能实施计划

生成时间: 2025-10-11

## 📋 功能需求

### 1. 文件上传到Storage
- [x] 创建`bp-documents` bucket (类似bmc-images)
- [ ] 上传PDF/DOCX文件到Storage
- [ ] 使用`{user_id}/{filename}` 路径结构
- [ ] 文件大小限制: 50MB
- [ ] 支持的格式: PDF, DOCX

### 2. Dashboard显示已上传的BP
- [ ] 在Dashboard添加"Business Plans"模块
- [ ] 显示BP列表（文件名、上传日期、分析状态）
- [ ] 下载功能（点击下载原始文件）
- [ ] 删除功能（删除时同步删除Storage文件）
- [ ] 显示分析得分

### 3. OCR文本提取
- [ ] 对于PDF: 使用OpenAI Vision API或PDF.js
- [ ] 对于DOCX: 使用mammoth.js或类似库
- [ ] 提取所有文本内容
- [ ] 保存extracted_text到数据库

### 4. AI分析（4个维度）

#### 维度1: AI Insight (0-100分)
评估子项:
- Plan Structure (计划结构)
- Content (内容完整性)
- Viability (可行性)
- 平均分作为AI Insight得分

#### 维度2: Market Insights (0-100分)
评估子项:
- Market Cap (市场规模)
- Profit Potential (盈利潜力)
- Popularity (市场热度)
- Competition (竞争程度)
- 平均分作为Market Insights得分

#### 维度3: Risk Assessment (0-100分)
评估子项:
- Regional Political Stability (地区政治稳定性)
- Country Economic Trend (国家经济趋势)
- Country Policy Volatility (政策波动性)
- War/Sanctions Impact (战争/制裁影响)
- 平均分作为Risk Assessment得分

#### 维度4: Growth Projections (0-100分)
评估子项:
- Overall Market Growth (整体市场增长)
- 5-Year Market Size Growth Projection (5年市场规模增长预测)
- Market Saturation Timeline (市场饱和时间线)
- Key Resources Limitations (关键资源限制)
- 平均分作为Growth Projections得分

### 5. UI重新设计
- [ ] 移除Tabs（Upload和Analysis tabs）
- [ ] 简化为单页面布局:
  1. 文件上传区域
  2. 上传后显示文件信息
  3. 橙色"Analyze BP"按钮
  4. 点击后显示4个分析维度卡片（在下方）
  5. 每个卡片显示: 标题、得分、子项评分、详细说明

---

## 🗄️ 数据库Schema

### bp_submissions 表

需要更新字段:

```sql
-- 更新bp_submissions表
ALTER TABLE bp_submissions 
DROP COLUMN IF EXISTS file_base64;  -- 不再存储base64

ALTER TABLE bp_submissions
ADD COLUMN IF NOT EXISTS file_url TEXT,  -- Storage URL
ADD COLUMN IF NOT EXISTS extracted_text TEXT,  -- OCR提取的文本
ADD COLUMN IF NOT EXISTS analysis_scores JSONB;  -- 详细的分析得分

-- analysis_scores格式:
{
  "aiInsight": {
    "overall": 85,
    "planStructure": 90,
    "content": 85,
    "viability": 80
  },
  "marketInsights": {
    "overall": 78,
    "marketCap": 80,
    "profitPotential": 75,
    "popularity": 82,
    "competition": 75
  },
  "riskAssessment": {
    "overall": 72,
    "politicalStability": 75,
    "economicTrend": 70,
    "policyVolatility": 68,
    "warSanctions": 75
  },
  "growthProjections": {
    "overall": 82,
    "marketGrowth": 85,
    "fiveYearProjection": 80,
    "saturationTimeline": 78,
    "resourceLimitations": 85
  }
}
```

### Storage Bucket: bp-documents

```sql
-- 需要在Supabase中创建
Bucket Name: bp-documents
Public: No (私有，需要认证)
File Size Limit: 50MB
Allowed MIME types: 
  - application/pdf
  - application/vnd.openxmlformats-officedocument.wordprocessingml.document
```

### RLS Policies

```sql
-- 用户上传自己的BP
CREATE POLICY "Users can upload own BP"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'bp-documents' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- 用户查看自己的BP
CREATE POLICY "Users can view own BP"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'bp-documents' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- 用户删除自己的BP
CREATE POLICY "Users can delete own BP"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'bp-documents' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);
```

---

## 📁 文件结构

### 需要修改的文件

1. **src/components/bp/BPUploadAnalysis.tsx** (重大重构)
   - 移除Tabs
   - 添加Storage上传逻辑
   - 添加OCR调用
   - 添加AI分析逻辑
   - 新的UI布局

2. **src/pages/Dashboard.tsx** (添加BP模块)
   - 添加"Business Plans"卡片
   - 显示BP列表
   - 下载和删除功能

3. **api/bp-analysis.ts** (新建Edge Function)
   - 接收文件URL
   - OCR文本提取
   - 调用LLM分析
   - 返回4个维度的详细得分

4. **src/lib/bpAnalysis.ts** (新建工具库)
   - 文件上传辅助函数
   - 分析结果解析
   - 得分计算

---

## 🔄 工作流程

```
用户上传文件
    ↓
1. 验证文件类型和大小
    ↓
2. 上传到Supabase Storage (bp-documents/{user_id}/{filename})
    ↓
3. 保存记录到bp_submissions表 (status: 'uploaded')
    ↓
4. 用户点击"Analyze BP"按钮
    ↓
5. 调用Edge Function: bp-analysis
    ↓
6. Edge Function处理:
   a. 从Storage下载文件
   b. OCR提取文本
   c. 调用LLM分析（4个维度）
   d. 计算每个维度的得分
   e. 更新bp_submissions表 (status: 'analyzed', analysis_scores)
    ↓
7. 前端显示分析结果
   - 4个卡片显示各维度得分
   - 展开显示子项得分
   - 显示详细分析文本
```

---

## 🎨 UI设计

### 上传页面布局

```
┌─────────────────────────────────────────────┐
│  📤 Upload Business Plan                     │
│  Upload your business plan for AI analysis   │
├─────────────────────────────────────────────┤
│                                              │
│  [  Drag & Drop or Click to Upload  ]       │
│       PDF or DOCX, Max 50MB                  │
│                                              │
└─────────────────────────────────────────────┘

文件已上传:
┌─────────────────────────────────────────────┐
│ 📄 business_plan_2024.pdf                   │
│ Size: 2.5 MB  •  Uploaded: Just now         │
│                                              │
│ [ 🗑 Remove ]    [ 🔍 Analyze BP ]          │
│                   (橙色按钮)                  │
└─────────────────────────────────────────────┘

分析结果:
┌─────────────────────────────────────────────┐
│ 💡 AI Insight                    Score: 85   │
│ ├─ Plan Structure:       90                  │
│ ├─ Content:              85                  │
│ └─ Viability:            80                  │
│                                              │
│ [Detailed analysis text...]                 │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ 📊 Market Insights              Score: 78   │
│ ├─ Market Cap:           80                  │
│ ├─ Profit Potential:     75                  │
│ ├─ Popularity:           82                  │
│ └─ Competition:          75                  │
│                                              │
│ [Detailed analysis text...]                 │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ ⚠️  Risk Assessment             Score: 72   │
│ ├─ Political Stability:  75                  │
│ ├─ Economic Trend:       70                  │
│ ├─ Policy Volatility:    68                  │
│ └─ War/Sanctions:        75                  │
│                                              │
│ [Detailed analysis text...]                 │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ 📈 Growth Projections           Score: 82   │
│ ├─ Market Growth:        85                  │
│ ├─ 5-Year Projection:    80                  │
│ ├─ Saturation Timeline:  78                  │
│ └─ Resource Limits:      85                  │
│                                              │
│ [Detailed analysis text...]                 │
└─────────────────────────────────────────────┘
```

---

## 🔧 实施步骤

### Phase 1: Storage设置 (10分钟)
1. 在Supabase创建bp-documents bucket
2. 配置RLS policies
3. 更新bp_submissions表schema
4. 运行SQL迁移

### Phase 2: 文件上传 (30分钟)
1. 修改BPUploadAnalysis组件
2. 添加Storage上传逻辑
3. 保存file_url到数据库
4. 测试文件上传

### Phase 3: Dashboard显示 (20分钟)
1. 在Dashboard添加BP模块
2. 从bp_submissions表加载数据
3. 实现下载功能
4. 实现删除功能（Storage + DB）

### Phase 4: OCR和AI分析 (60分钟)
1. 创建Edge Function: bp-analysis
2. 实现OCR文本提取
3. 实现LLM调用（4个维度分析）
4. 解析和存储分析结果
5. 测试整个流程

### Phase 5: UI重新设计 (40分钟)
1. 移除Tabs
2. 创建新的分析结果卡片组件
3. 实现展开/折叠子项
4. 样式调整
5. 响应式设计

总时间估计: **2.5-3小时**

---

## 📝 Prompt for LLM Analysis

```
You are a professional investment analyst. Analyze the following business plan and provide scores (0-100) for each criterion.

Business Plan Text:
{extracted_text}

Please analyze and score the following dimensions:

1. AI Insight:
   - Plan Structure (0-100): How well is the plan organized and structured?
   - Content (0-100): Is the content comprehensive and complete?
   - Viability (0-100): Is the business model viable and practical?

2. Market Insights:
   - Market Cap (0-100): What is the market size potential?
   - Profit Potential (0-100): What is the profit-making potential?
   - Popularity (0-100): How popular/trending is this market?
   - Competition (0-100): What is the competitive intensity? (lower score = more competition)

3. Risk Assessment:
   - Political Stability (0-100): Regional political stability (higher = more stable)
   - Economic Trend (0-100): Country's economic trend (higher = better)
   - Policy Volatility (0-100): Policy stability (higher = more stable)
   - War/Sanctions (0-100): Impact of war or sanctions (higher = less impact)

4. Growth Projections:
   - Market Growth (0-100): Overall market growth potential
   - 5-Year Projection (0-100): 5-year market size growth outlook
   - Saturation Timeline (0-100): Time before market saturation (higher = longer)
   - Resource Limitations (0-100): Availability of key resources (higher = less limitations)

Return JSON format:
{
  "aiInsight": {...},
  "marketInsights": {...},
  "riskAssessment": {...},
  "growthProjections": {...},
  "detailedAnalysis": {
    "aiInsight": "Detailed text analysis...",
    "marketInsights": "Detailed text analysis...",
    "riskAssessment": "Detailed text analysis...",
    "growthProjections": "Detailed text analysis..."
  }
}
```

---

## ✅ 测试清单

- [ ] 上传PDF文件成功
- [ ] 上传DOCX文件成功
- [ ] 文件大小验证工作
- [ ] 文件类型验证工作
- [ ] 文件出现在Dashboard
- [ ] 可以下载文件
- [ ] 可以删除文件（Storage和DB都删除）
- [ ] 点击"Analyze BP"触发分析
- [ ] OCR成功提取文本
- [ ] LLM返回4个维度的得分
- [ ] 分析结果正确保存到数据库
- [ ] UI正确显示4个维度卡片
- [ ] 得分和子项正确显示
- [ ] 详细分析文本正确显示

---

## 🚀 准备就绪

所有计划已完成，可以开始实施！

**建议顺序**:
1. 先设置Storage (最简单)
2. 然后修改上传逻辑
3. 再添加Dashboard显示
4. 最后实现AI分析

这样可以逐步测试每个功能！

