import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

/**
 * OCR文本提取API
 * 支持两种模式：
 * 1. URL模式：直接使用imageUrl（用于BMC图片）
 * 2. 文件路径模式：从Supabase Storage下载并转Base64（用于BP PDF）
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { image, imageUrl, filePath } = req.body;
    
    let imageData = image || imageUrl;
    
    // 如果提供的是Supabase文件路径，从Storage下载并转为Base64
    if (filePath && !imageData) {
      console.log('🔵 OCR: Using server-side download mode');
      console.log('   File path:', filePath);
      
      const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
      // 优先使用新的Secret Key，回退到旧的Service Role Key
      const secretKey = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
      
      if (!supabaseUrl) {
        console.error('❌ OCR: Missing SUPABASE_URL');
        return res.status(500).json({ 
          error: 'Server misconfigured: missing SUPABASE_URL' 
        });
      }
      
      if (!secretKey) {
        console.error('❌ OCR: Missing SUPABASE_SECRET_KEY');
        return res.status(500).json({ 
          error: 'Server misconfigured: missing SUPABASE_SECRET_KEY. Please add this to Vercel environment variables.' 
        });
      }
      
      console.log('🔵 OCR: Using Supabase Secret Key authentication');
      
      // 使用Secret Key创建Supabase客户端（绕过RLS）
      const supabase = createClient(supabaseUrl, secretKey, {
        auth: {
          persistSession: false,
          autoRefreshToken: false
        },
        global: {
          headers: {
            'X-Client-Info': 'leoai-ocr-api'
          }
        }
      });
      
      console.log('🔵 OCR: Downloading file from Supabase Storage...');
      
      // 从Storage下载文件
      const { data: fileData, error: downloadError } = await supabase.storage
        .from('bp-documents')
        .download(filePath);
      
      if (downloadError) {
        console.error('❌ OCR: Failed to download file', {
          error: downloadError.message,
          filePath
        });
        return res.status(500).json({ 
          error: 'Failed to download file from storage',
          details: downloadError.message 
        });
      }
      
      console.log('✅ OCR: File downloaded successfully');
      console.log('   File size:', fileData.size, 'bytes');
      console.log('   File type:', fileData.type);
      
      // 转换为Base64
      const arrayBuffer = await fileData.arrayBuffer();
      const base64 = Buffer.from(arrayBuffer).toString('base64');
      
      console.log('✅ OCR: Converted to Base64');
      console.log('   Base64 length:', base64.length);
      
      // 根据文件类型设置data URL
      const mimeType = fileData.type || 'application/pdf';
      imageData = `data:${mimeType};base64,${base64}`;
    }
    
    // 验证imageData
    if (!imageData) {
      return res.status(400).json({ 
        error: 'Either imageUrl or filePath is required' 
      });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'Server misconfigured: missing OPENAI_API_KEY' });
    }

    console.log('🔍 Starting OCR extraction...', {
      urlLength: imageData.length,
      urlPreview: imageData.substring(0, 100),
      isDataUrl: imageData.startsWith('data:'),
      isHttpUrl: imageData.startsWith('http'),
      sizeInMB: (imageData.length / (1024 * 1024)).toFixed(2)
    });

    // OpenAI Vision API限制：Base64不能超过20MB
    const maxSize = 20 * 1024 * 1024; // 20MB
    if (imageData.length > maxSize) {
      console.error('❌ OCR: File too large for OpenAI Vision API', {
        size: imageData.length,
        maxSize,
        sizeInMB: (imageData.length / (1024 * 1024)).toFixed(2)
      });
      return res.status(400).json({ 
        error: `文件太大。OpenAI Vision API限制为20MB，当前文件为 ${(imageData.length / (1024 * 1024)).toFixed(2)}MB`,
        details: 'Please upload a smaller file or reduce the PDF quality'
      });
    }

    console.log('🔵 OCR: Calling OpenAI Vision API...');

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
                text: 'Extract all text from this PDF document or image. Please return ONLY the extracted text, without any additional commentary or formatting. Extract all readable text you can see.'
              },
              {
                type: 'image_url',
                image_url: {
                  url: imageData,
                  detail: 'high' // 使用高清模式以获得更好的文本识别
                }
              }
            ]
          }
        ],
        max_tokens: 4000 // 增加token限制以支持更长的文档
      })
    });

    console.log('🔵 OpenAI API response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      let errorDetail = errorText;
      
      // 尝试解析JSON错误
      try {
        const errorJson = JSON.parse(errorText);
        errorDetail = errorJson.error?.message || errorText;
        console.error('❌ OpenAI API error:', {
          status: response.status,
          error: errorJson,
          fullError: errorText.slice(0, 1000)
        });
      } catch (e) {
        console.error('❌ OpenAI API error (raw):', {
          status: response.status,
          error: errorText.slice(0, 1000)
        });
      }
      
      // 提供更具体的错误消息
      let errorMessage = 'OCR extraction failed';
      if (response.status === 401) {
        errorMessage = 'OpenAI API key无效或缺失';
      } else if (response.status === 400) {
        errorMessage = `OpenAI API请求无效: ${errorDetail}`;
      } else if (response.status === 429) {
        errorMessage = 'OpenAI API请求频率超限';
      } else if (response.status === 413) {
        errorMessage = '文件太大，OpenAI无法处理';
      }
      
      return res.status(response.status).json({ 
        error: errorMessage,
        details: errorDetail.slice(0, 500),
        status: response.status
      });
    }

    const data = await response.json();
    const extractedText = data?.choices?.[0]?.message?.content;

    if (!extractedText) {
      console.error('❌ Invalid response from OpenAI');
      return res.status(502).json({ error: 'Invalid response from AI service' });
    }

    console.log('✅ OCR extraction successful, text length:', extractedText.length);

    return res.status(200).json({
      extractedText: extractedText, // 前端期望的字段名
      text: extractedText, // 保留兼容性
      success: true
    });

  } catch (error: any) {
    console.error('💥 OCR extraction error:', error?.message || error);
    return res.status(500).json({
      error: error?.message || 'Internal Server Error'
    });
  }
}

