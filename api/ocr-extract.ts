import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * OCR文本提取API
 * 使用OpenAI Vision API从图片中提取文本
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { image, imageUrl } = req.body;
    const imageData = image || imageUrl; // 支持两种参数名

    if (!imageData) {
      return res.status(400).json({ error: 'Image data or imageUrl is required' });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'Server misconfigured: missing OPENAI_API_KEY' });
    }

    console.log('🔍 Starting OCR extraction...', {
      urlLength: imageData.length,
      urlPreview: imageData.substring(0, 100),
      isDataUrl: imageData.startsWith('data:'),
      isHttpUrl: imageData.startsWith('http')
    });

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
      console.error('❌ OpenAI API error:', {
        status: response.status,
        error: errorText.slice(0, 500)
      });
      
      // 提供更具体的错误消息
      let errorMessage = 'OCR extraction failed';
      if (response.status === 401) {
        errorMessage = 'OpenAI API key is invalid or missing';
      } else if (response.status === 400) {
        errorMessage = 'Invalid request to OpenAI API - URL may not be accessible';
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

