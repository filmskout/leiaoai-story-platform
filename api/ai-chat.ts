import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getSystemPrompt } from '../src/lib/apiConfig';

const MODEL_MAP: Record<string, { provider: 'deepseek' | 'openai' | 'qwen'; model: string }> = {
  deepseek: { provider: 'deepseek', model: 'deepseek-chat' },
  'deepseek-chat': { provider: 'deepseek', model: 'deepseek-chat' },
  openai: { provider: 'openai', model: 'gpt-4o' },
  'gpt-4o': { provider: 'openai', model: 'gpt-4o' },
  qwen: { provider: 'qwen', model: 'qwen-turbo' },
  'qwen-turbo': { provider: 'qwen', model: 'qwen-turbo' },
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  try {
    const { message, model = 'deepseek', sessionId } = req.body || {};
    if (!message || typeof message !== 'string') {
      res.status(400).json({ error: 'Invalid request: message is required' });
      return;
    }

    const mapped = MODEL_MAP[model] || MODEL_MAP['deepseek'];

    // 选择上游与密钥
    let url = '';
    let apiKey = '';
    let authHeader = '';
    if (mapped.provider === 'deepseek') {
      url = 'https://api.deepseek.com/chat/completions';
      apiKey = process.env.DEEPSEEK_API_KEY || '';
      authHeader = `Bearer ${apiKey}`;
      if (!apiKey) {
        res.status(500).json({ error: 'Server misconfigured: missing DEEPSEEK_API_KEY' });
        return;
      }
    } else if (mapped.provider === 'openai') {
      url = 'https://api.openai.com/v1/chat/completions';
      apiKey = process.env.OPENAI_API_KEY || '';
      authHeader = `Bearer ${apiKey}`;
      if (!apiKey) {
        res.status(500).json({ error: 'Server misconfigured: missing OPENAI_API_KEY' });
        return;
      }
    } else if (mapped.provider === 'qwen') {
      // Qwen 兼容 OpenAI Chat Completions 协议（DashScope compatible-mode）
      url = 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions';
      apiKey = process.env.QWEN_API_KEY || '';
      authHeader = `Bearer ${apiKey}`;
      if (!apiKey) {
        res.status(500).json({ error: 'Server misconfigured: missing QWEN_API_KEY' });
        return;
      }
    }

    const startTime = Date.now();

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: authHeader,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: mapped.model,
        messages: [
          { role: 'system', content: getSystemPrompt() },
          { role: 'user', content: message },
        ],
        temperature: 0.7,
        max_tokens: 2000,
        top_p: 0.9,
        stream: false,
        session_id: sessionId,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      res.status(response.status).json({ error: errorText.slice(0, 500) });
      return;
    }

    const data: any = await response.json();
    const aiResponse: string | undefined = data?.choices?.[0]?.message?.content;

    if (!aiResponse) {
      res.status(502).json({ error: 'Invalid response from DeepSeek' });
      return;
    }

    const endTime = Date.now();
    const processingTimeSeconds = Number(((endTime - startTime) / 1000).toFixed(1));

    res.status(200).json({
      data: {
        content: aiResponse,
        model: mapped.model,
      },
      processingTime: processingTimeSeconds,
    });
  } catch (err: any) {
    res.status(500).json({ error: err?.message || 'Internal Server Error' });
  }
}
