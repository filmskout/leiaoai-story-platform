import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * Vercel Serverless Function: 使用 DALL·E 生成用户头像
 * 
 * POST /api/generate-avatar
 * Body: { prompt: string, size?: '256x256' | '512x512' | '1024x1024' }
 * 
 * 该函数使用服务端的 OPENAI_API_KEY，避免在前端暴露密钥
 */

const OPENAI_API_URL = 'https://api.openai.com/v1/images/generations';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // 只允许 POST 请求
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  try {
    const { prompt, size = '512x512' } = req.body || {};

    // 验证输入
    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      res.status(400).json({ error: 'Invalid request: prompt is required' });
      return;
    }

    // 获取服务端 API Key
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      res.status(500).json({ error: 'Server misconfigured: missing OPENAI_API_KEY' });
      return;
    }

    // 验证尺寸
    const validSizes = ['256x256', '512x512', '1024x1024'];
    if (!validSizes.includes(size)) {
      res.status(400).json({ error: `Invalid size. Must be one of: ${validSizes.join(', ')}` });
      return;
    }

    // 调用 OpenAI DALL·E API
    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt: prompt,
        n: 1,
        size: size === '1024x1024' ? '1024x1024' : '1024x1024', // DALL·E 3 只支持 1024x1024
        quality: 'standard',
        style: 'vivid'
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', errorText);
      res.status(response.status).json({ 
        error: `OpenAI API error: ${errorText.slice(0, 200)}` 
      });
      return;
    }

    const data = await response.json();

    // 返回生成的图片 URL
    if (data?.data?.[0]?.url) {
      res.status(200).json({
        success: true,
        imageUrl: data.data[0].url,
        revisedPrompt: data.data[0].revised_prompt || prompt
      });
    } else {
      res.status(502).json({ error: 'Invalid response from OpenAI API' });
    }
  } catch (err: any) {
    console.error('Error in generate-avatar:', err);
    res.status(500).json({ 
      error: err?.message || 'Internal Server Error' 
    });
  }
}

