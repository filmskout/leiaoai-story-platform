# BP OCR替代解决方案 - 服务器端下载

如果将bucket改为公开仍然无法解决问题，这里提供一个完全可靠的替代方案：
**让Vercel服务器端直接从Supabase下载文件，转换为Base64后发送给OpenAI**

---

## 🎯 方案优势

1. ✅ **完全可靠** - 不依赖外部URL访问
2. ✅ **保持私有** - bucket可以继续保持私有
3. ✅ **绕过CORS** - 服务器端使用service_role_key
4. ✅ **无需签名URL** - 直接读取文件内容

---

## 📝 实现步骤

### 步骤1: 添加环境变量

在Vercel Dashboard添加：

```
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

**获取Service Role Key**:
1. Supabase Dashboard → Settings → API
2. 找到 "service_role" key（⚠️ 不是anon key）
3. 复制完整的key

### 步骤2: 修改OCR API

创建新文件或替换现有的 `api/ocr-extract.ts`:

```typescript
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { imageUrl, filePath } = req.body;
    
    let imageData = imageUrl;
    
    // 如果提供的是Supabase文件路径，从Storage下载
    if (filePath && !imageUrl) {
      console.log('🔵 OCR: Downloading file from Supabase Storage');
      console.log('   File path:', filePath);
      
      const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
      const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
      
      if (!supabaseUrl || !serviceKey) {
        return res.status(500).json({ 
          error: 'Server misconfigured: missing Supabase credentials' 
        });
      }
      
      // 使用service_role_key创建Supabase客户端（绕过RLS）
      const supabase = createClient(supabaseUrl, serviceKey, {
        auth: {
          persistSession: false
        }
      });
      
      // 从Storage下载文件
      const { data: fileData, error: downloadError } = await supabase.storage
        .from('bp-documents')
        .download(filePath);
      
      if (downloadError) {
        console.error('❌ OCR: Failed to download file', downloadError);
        return res.status(500).json({ 
          error: 'Failed to download file from storage',
          details: downloadError.message 
        });
      }
      
      console.log('✅ OCR: File downloaded successfully');
      console.log('   File size:', fileData.size, 'bytes');
      
      // 转换为Base64
      const arrayBuffer = await fileData.arrayBuffer();
      const base64 = Buffer.from(arrayBuffer).toString('base64');
      
      // 根据文件类型设置data URL
      const mimeType = fileData.type || 'application/pdf';
      imageData = `data:${mimeType};base64,${base64}`;
      
      console.log('✅ OCR: Converted to Base64');
      console.log('   Base64 length:', base64.length);
    }

    // OpenAI API配置
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ 
        error: 'Server misconfigured: missing OPENAI_API_KEY' 
      });
    }

    console.log('🔵 OCR: Calling OpenAI Vision API');

    // 调用OpenAI Vision API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Extract all text from this PDF document. Please return ONLY the extracted text, without any additional commentary or formatting. Extract all readable text you can see.'
              },
              {
                type: 'image_url',
                image_url: {
                  url: imageData,
                  detail: 'high'
                }
              }
            ]
          }
        ],
        max_tokens: 4000
      })
    });

    console.log('🔵 OCR: OpenAI response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ OCR: OpenAI API error:', errorText.slice(0, 500));
      
      let errorMessage = 'OCR extraction failed';
      if (response.status === 401) {
        errorMessage = 'OpenAI API key is invalid or missing';
      } else if (response.status === 400) {
        errorMessage = 'Invalid request to OpenAI API';
      } else if (response.status === 429) {
        errorMessage = 'OpenAI API rate limit exceeded';
      }
      
      return res.status(response.status).json({ 
        error: errorMessage,
        details: errorText.slice(0, 200)
      });
    }

    const data = await response.json();
    const extractedText = data?.choices?.[0]?.message?.content;

    if (!extractedText) {
      console.error('❌ OCR: Invalid response from OpenAI');
      return res.status(502).json({ 
        error: 'Invalid response from AI service' 
      });
    }

    console.log('✅ OCR: Text extraction successful');
    console.log('   Text length:', extractedText.length);

    return res.status(200).json({
      extractedText: extractedText,
      text: extractedText,
      success: true
    });

  } catch (error: any) {
    console.error('💥 OCR: Unexpected error:', error);
    return res.status(500).json({
      error: error?.message || 'Internal Server Error'
    });
  }
}
```

### 步骤3: 修改前端调用

更新 `src/components/bp/BPUploadAnalysis.tsx` 中的 `extractText` 函数：

```typescript
const extractText = async (fileUrl: string, fileType: string): Promise<string> => {
  console.log('🔵 BP OCR: Extracting text', { fileUrl, fileType });

  try {
    if (fileType === 'application/pdf') {
      console.log('🔵 BP OCR: Calling API with file path:', fileUrl);
      
      // 传递文件路径而不是URL
      const response = await fetch('/api/ocr-extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          filePath: fileUrl  // 传递文件路径
        })
      });

      console.log('🔵 BP OCR: API response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('🔴 BP OCR: API error', { 
          status: response.status, 
          error: errorData 
        });
        throw new Error(errorData.error || `OCR extraction failed with status ${response.status}`);
      }

      const data = await response.json();
      const extractedText = data.extractedText || data.text || '';
      
      console.log('🟢 BP OCR: Text extracted', { 
        length: extractedText.length,
        preview: extractedText.substring(0, 100) 
      });
      
      if (!extractedText || extractedText.length === 0) {
        throw new Error('No text could be extracted from the PDF');
      }
      
      return extractedText;
    } else if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      console.log('⚠️ BP OCR: DOCX extraction not yet implemented');
      return 'DOCX file uploaded. Text extraction for DOCX files will be implemented soon.';
    } else {
      throw new Error(`Unsupported file type: ${fileType}`);
    }
  } catch (err: any) {
    console.error('🔴 BP OCR: Error', {
      message: err.message,
      stack: err.stack
    });
    throw new Error(err.message || 'Text extraction failed');
  }
};
```

### 步骤4: 安装依赖（如果需要）

```bash
npm install @supabase/supabase-js
```

---

## 🎯 工作原理

```
前端 → 传递文件路径（不是URL）
         ↓
OCR API → 使用service_role_key
         → 从Supabase Storage下载文件
         → 转换为Base64
         → 发送给OpenAI
         ↓
OpenAI → 处理Base64图片/PDF
        → 返回提取的文本
         ↓
前端 ← 收到提取的文本
```

---

## ✅ 优点

1. **完全可靠**: 不依赖外部URL访问
2. **保持私有**: bucket可以继续是私有的
3. **绕过RLS**: 使用service_role_key
4. **无CORS问题**: 所有操作在服务器端

---

## ⚠️ 注意事项

### 文件大小限制

- Vercel函数有payload限制（默认4.5MB）
- 对于大文件，Base64会增加~33%大小
- 建议文件 < 15MB

### 成本考虑

- 每次分析都会下载完整文件
- 增加Vercel函数的执行时间
- 可能会增加一些成本

### 安全

- ⚠️ **Service Role Key非常重要**
- 只能在服务器端使用
- 不要暴露给前端
- 有完全绕过RLS的权限

---

## 🧪 测试

1. 添加环境变量后重新部署
2. 上传新的PDF
3. 点击"Analyze BP"
4. 查看Vercel函数日志（Dashboard → Functions → Logs）
5. 应该看到:
   ```
   🔵 OCR: Downloading file from Supabase Storage
   ✅ OCR: File downloaded successfully
   ✅ OCR: Converted to Base64
   🔵 OCR: Calling OpenAI Vision API
   ✅ OCR: Text extraction successful
   ```

---

## 📋 环境变量清单

需要在Vercel中配置：

```
OPENAI_API_KEY=sk-...
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...  ← 新增
```

---

## 🎯 什么时候使用这个方案？

**使用场景**：
- ✅ 将bucket改为公开后仍然失败
- ✅ 需要保持bucket完全私有
- ✅ 有CORS或访问权限问题
- ✅ 想要更可靠的解决方案

**不推荐场景**：
- ❌ 文件非常大（> 20MB）
- ❌ 分析频率非常高（成本考虑）
- ❌ 简单的公开bucket就能解决问题

---

这个方案是**完全可靠**的，因为它完全在服务器端处理，不依赖任何外部URL访问！

