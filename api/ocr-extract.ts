import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import pdf from 'pdf-parse';

/**
 * 文本提取API
 * 支持三种模式：
 * 1. URL模式：直接使用imageUrl（用于BMC图片，使用OpenAI Vision）
 * 2. PDF文件路径模式：从Supabase下载PDF并提取文本（用于BP PDF，使用pdf-parse）
 * 3. 图片文件路径模式：从Supabase下载图片并OCR（使用OpenAI Vision）
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { image, imageUrl, filePath, fileType } = req.body;
    
    let imageData = image || imageUrl;
    let extractedText: string | null = null;
    
    // 如果提供的是Supabase文件路径，从Storage下载
    if (filePath && !imageData) {
      console.log('🔵 Text Extract: Using server-side download mode');
      console.log('   File path:', filePath);
      console.log('   File type:', fileType);
      
      const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
      const secretKey = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
      
      if (!supabaseUrl) {
        console.error('❌ Missing SUPABASE_URL');
        return res.status(500).json({ 
          error: 'Server misconfigured: missing SUPABASE_URL' 
        });
      }
      
      if (!secretKey) {
        console.error('❌ Missing SUPABASE_SECRET_KEY');
        return res.status(500).json({ 
          error: 'Server misconfigured: missing SUPABASE_SECRET_KEY' 
        });
      }
      
      console.log('🔵 Using Supabase Secret Key authentication');
      
      const supabase = createClient(supabaseUrl, secretKey, {
        auth: {
          persistSession: false,
          autoRefreshToken: false
        },
        global: {
          headers: {
            'X-Client-Info': 'leoai-text-extract-api'
          }
        }
      });
      
      console.log('🔵 Downloading file from Supabase Storage...');
      
      const { data: fileData, error: downloadError } = await supabase.storage
        .from('bp-documents')
        .download(filePath);
      
      if (downloadError) {
        console.error('❌ Failed to download file', {
          error: downloadError.message,
          filePath
        });
        return res.status(500).json({ 
          error: 'Failed to download file from storage',
          details: downloadError.message 
        });
      }
      
      console.log('✅ File downloaded successfully');
      console.log('   File size:', fileData.size, 'bytes');
      console.log('   File type:', fileData.type);
      
      // 判断文件类型：PDF使用pdf-parse，图片使用OpenAI Vision
      const mimeType = fileData.type || fileType || 'application/pdf';
      
      if (mimeType === 'application/pdf' || filePath.toLowerCase().endsWith('.pdf')) {
        // PDF文件：使用pdf-parse直接提取文本
        console.log('🔵 PDF detected: Using pdf-parse for text extraction');
        
        try {
          const arrayBuffer = await fileData.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);
          
          console.log('🔵 Parsing PDF...');
          const pdfData = await pdf(buffer);
          
          extractedText = pdfData.text;
          console.log('✅ PDF parsed successfully');
          console.log('   Pages:', pdfData.numpages);
          console.log('   Text length:', extractedText.length);
          console.log('   Text preview:', extractedText.substring(0, 200));
          
          if (!extractedText || extractedText.trim().length === 0) {
            console.warn('⚠️ PDF contains no extractable text');
            return res.status(400).json({
              error: 'PDF不包含可提取的文本',
              details: 'This PDF appears to be empty or is a scanned image. Please use a PDF with selectable text.'
            });
          }
          
          // 直接返回提取的文本
          return res.status(200).json({
            extractedText,
            text: extractedText,
            source: 'pdf-parse',
            pages: pdfData.numpages
          });
          
        } catch (pdfError: any) {
          console.error('❌ PDF parsing failed:', pdfError);
          return res.status(500).json({
            error: 'PDF解析失败',
            details: pdfError.message || 'Failed to parse PDF file'
          });
        }
      } else {
        // 图片文件：转换为Base64供OpenAI Vision使用
        console.log('🔵 Image detected: Converting to Base64 for OpenAI Vision');
        const arrayBuffer = await fileData.arrayBuffer();
        const base64 = Buffer.from(arrayBuffer).toString('base64');
        
        console.log('✅ Converted to Base64');
        console.log('   Base64 length:', base64.length);
        
        imageData = `data:${mimeType};base64,${base64}`;
      }
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

