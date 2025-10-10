import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getSystemPrompt } from '../src/lib/apiConfig';

const MODEL_MAP: Record<string, string> = {
  deepseek: 'deepseek-chat',
  'deepseek-chat': 'deepseek-chat',
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: 'Server misconfigured: missing DEEPSEEK_API_KEY' });
    return;
  }

  try {
    const { message, model = 'deepseek', sessionId } = req.body || {};
    if (!message || typeof message !== 'string') {
      res.status(400).json({ error: 'Invalid request: message is required' });
      return;
    }

    const modelToUse = MODEL_MAP[model] || MODEL_MAP['deepseek'];

    const startTime = Date.now();

    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: modelToUse,
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
        model: modelToUse,
      },
      processingTime: processingTimeSeconds,
    });
  } catch (err: any) {
    res.status(500).json({ error: err?.message || 'Internal Server Error' });
  }
}
