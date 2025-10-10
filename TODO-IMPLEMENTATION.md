# 待实现功能清单

## 已完成 ✅

1. ✅ **Dashboard Dark Mode 可见性** - 统计卡片和Saved Stories在dark mode下可见
2. ✅ **Loading Logo 优化** - 移除白点和闪烁效果
3. ✅ **AI Chat 建议问题** - 已移除
4. ✅ **AI Chat 自动提问** - 使用sessionStorage跟踪，1200ms延迟
5. ✅ **API Keys 调试** - 添加详细日志（前端和后端）
6. ✅ **聊天历史保存** - 修复表名为`chat_sessions`
7. ✅ **BMC保存到Dashboard** - 保存PNG (base64) 和JSON数据到`bmc_boards`表

---

## 待完成 ⏳

### 1. DeepSeek 和 OpenAI GPT-4o 不工作 🔴 **最高优先级**

**问题诊断**：
- 90% 可能性：Vercel 环境变量未设置
- 8% 可能性：OpenAI 余额不足
- 2% 可能性：API Keys 过期

**立即行动**：
1. 访问 Vercel Dashboard → Settings → Environment Variables
2. 确认以下变量存在且在 Production 环境：
   - `DEEPSEEK_API_KEY`
   - `OPENAI_API_KEY`
   - `QWEN_API_KEY`
3. 检查 OpenAI 余额：https://platform.openai.com/account/billing/overview
4. 如果缺失或无效，更新 API Keys
5. 重新部署项目

**验证方法**：
```bash
# 查看 Vercel 函数日志
# 应该看到：
# 🚀 AI Chat Request: { model: "deepseek" }
# ✅ Success: { model: "deepseek-chat" }

# 如果看到错误：
# ❌ Server misconfigured: missing DEEPSEEK_API_KEY
# → 去 Vercel 添加环境变量
```

**文档**：
- `VERCEL-ENV-CHECK.md` - 检查清单
- `QUICK-DIAGNOSIS.md` - 快速诊断
- `docs/API-KEYS-SETUP.md` - 详细配置指南

---

### 2. 自动提交问题 🟡 **需要测试**

**当前状态**：
- 代码已修复（使用sessionStorage，延迟1200ms）
- 添加了调试日志
- **需要在部署后测试验证**

**测试步骤**：
1. 访问 https://leiaoai-story-platform.vercel.app/
2. 点击专业服务区域的任意问题
3. 打开浏览器控制台（F12）
4. 应该看到：
   ```
   🎯 Auto-asking question from URL parameter: ...
   📍 Current model: deepseek
   ⏰ Sending auto-ask message now...
   ```
5. 1.2秒后问题应该自动发送

**如果失败**：
- 清除 sessionStorage: `sessionStorage.clear()`
- 刷新页面重试
- 查看控制台错误信息

---

### 3. BP上传功能和Dashboard显示 🟠 **待实现**

**当前状态**：
- ✅ 上传UI已存在（`BPUploadAnalysis.tsx`）
- ✅ 文件验证已实现（PDF/DOCX, 50MB限制）
- ❌ 未保存到数据库
- ❌ Dashboard未显示

**需要实现**：

#### 3.1 修改 BPUploadAnalysis.tsx

```typescript
// 添加到 analyzeFile 函数中
const analyzeFile = async () => {
  if (!file || !user) return;
  
  setIsAnalyzing(true);
  
  try {
    // 1. 将文件转换为base64
    const reader = new FileReader();
    const base64Promise = new Promise<string>((resolve, reject) => {
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
    const fileBase64 = await base64Promise;
    
    // 2. 调用Edge Function进行分析
    const { data: analysisData, error: analysisError } = await supabase
      .functions.invoke('bp-upload-analysis', {
        body: {
          fileData: fileBase64,
          fileName: file.name,
          fileType: file.type
        }
      });
    
    if (analysisError) throw analysisError;
    
    // 3. 保存到数据库
    const { error: saveError } = await supabase
      .from('bp_submissions')
      .insert({
        user_id: user.id,
        file_name: file.name,
        file_type: file.type,
        file_base64: fileBase64, // 保存base64编码的文件
        file_size: file.size,
        analysis_result: analysisData.result,
        score: analysisData.score,
        created_at: new Date().toISOString()
      });
    
    if (saveError) throw saveError;
    
    setAnalysisResult(analysisData.result);
  } catch (err) {
    setError('分析失败，请重试');
  } finally {
    setIsAnalyzing(false);
  }
};
```

#### 3.2 在Profile.tsx中显示BP提交

```typescript
// 已存在的loadBpSubmissions函数
const loadBpSubmissions = async () => {
  if (!user) return;

  try {
    const { data, error } = await supabase
      .from('bp_submissions')
      .select('id, file_name, file_type, file_base64, file_size, score, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) {
      console.error('Error loading BP submissions:', error);
      return;
    }

    if (data) {
      setBpSubmissions(data);
    }
  } catch (error) {
    console.error('Failed to load BP submissions:', error);
  }
};

// UI部分添加下载按钮
{bpSubmissions.map((bp: any) => (
  <div key={bp.id} className="border border-border rounded-lg p-4 bg-card">
    <div className="flex items-center justify-between">
      <div>
        <h4 className="font-semibold text-foreground">{bp.file_name}</h4>
        <p className="text-sm text-foreground-secondary">
          Score: {bp.score}/100 · {formatDate(bp.created_at)}
        </p>
      </div>
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => {
            // 下载文件
            const link = document.createElement('a');
            link.href = bp.file_base64;
            link.download = bp.file_name;
            link.click();
          }}
        >
          <Download size={16} className="mr-1" />
          下载
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => {
            // 查看分析结果
            navigate(`/bp-analysis?submission=${bp.id}`);
          }}
        >
          查看分析
        </Button>
      </div>
    </div>
  </div>
))}
```

---

### 4. OCR功能 🟣 **待实现**

**目标**：
- 读取BMC保存的PNG图片中的文字
- 提取PDF和DOCX文件的文本内容

**技术方案**：

#### 4.1 OCR for PNG (BMC图片)

**选项 A**: 使用 Tesseract.js（客户端OCR）
```bash
npm install tesseract.js
```

```typescript
import { createWorker } from 'tesseract.js';

const extractTextFromImage = async (imageBase64: string) => {
  const worker = await createWorker('eng+chi_sim');
  const { data: { text } } = await worker.recognize(imageBase64);
  await worker.terminate();
  return text;
};
```

**选项 B**: 使用 OpenAI Vision API（更准确）
```typescript
const extractTextWithOpenAI = async (imageBase64: string) => {
  const response = await fetch('/api/ocr-extract', {
    method: 'POST',
    body: JSON.stringify({ image: imageBase64 })
  });
  return await response.json();
};
```

```typescript
// api/ocr-extract.ts
export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { image } = req.body;
  
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [{
        role: 'user',
        content: [
          { type: 'text', text: 'Extract all text from this Business Model Canvas image.' },
          { type: 'image_url', image_url: { url: image } }
        ]
      }]
    })
  });
  
  const data = await response.json();
  res.json({ text: data.choices[0].message.content });
}
```

#### 4.2 文本提取 for PDF/DOCX

**PDF提取**：
```bash
npm install pdf-parse
```

```typescript
import pdfParse from 'pdf-parse';

const extractPdfText = async (pdfBase64: string) => {
  const buffer = Buffer.from(pdfBase64.split(',')[1], 'base64');
  const data = await pdfParse(buffer);
  return data.text;
};
```

**DOCX提取**：
```bash
npm install mammoth
```

```typescript
import mammoth from 'mammoth';

const extractDocxText = async (docxBase64: string) => {
  const buffer = Buffer.from(docxBase64.split(',')[1], 'base64');
  const result = await mammoth.extractRawText({ buffer });
  return result.value;
};
```

#### 4.3 集成到Dashboard

```typescript
// 在BMC显示section添加OCR按钮
<Button 
  variant="outline" 
  size="sm"
  onClick={async () => {
    setExtracting(true);
    try {
      const text = await extractTextFromImage(bmc.image_base64);
      // 显示提取的文本
      setExtractedText(text);
      // 或保存到数据库
      await supabase
        .from('bmc_boards')
        .update({ extracted_text: text })
        .eq('id', bmc.id);
    } finally {
      setExtracting(false);
    }
  }}
>
  提取文本 (OCR)
</Button>
```

---

## 数据库结构

### 需要的表结构：

```sql
-- BP提交表
CREATE TABLE IF NOT EXISTS bp_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_base64 TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  analysis_result JSONB,
  score INTEGER,
  extracted_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- BMC表（已存在，添加extracted_text列）
ALTER TABLE bmc_boards 
ADD COLUMN IF NOT EXISTS extracted_text TEXT;

-- 聊天会话表（已存在）
-- chat_sessions 和 chat_messages

-- 索引
CREATE INDEX IF NOT EXISTS idx_bp_user ON bp_submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_bmc_user ON bmc_boards(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_user ON chat_sessions(user_id);
```

---

## 优先级顺序

1. **🔴 最高优先级**：修复 DeepSeek/OpenAI API Keys（需要用户配置Vercel环境变量）
2. **🟡 高优先级**：测试自动提交功能（已修复，需验证）
3. **🟠 中优先级**：实现BP上传保存和Dashboard显示
4. **🟣 低优先级**：添加OCR功能

---

## 依赖包

需要安装的新依赖：

```json
{
  "dependencies": {
    "html2canvas": "^1.4.1",  // ✅ 已用于BMC截图
    "tesseract.js": "^5.0.0",  // OCR功能
    "pdf-parse": "^1.1.1",     // PDF文本提取
    "mammoth": "^1.6.0"        // DOCX文本提取
  }
}
```

---

**上次更新**：2025-01-10

