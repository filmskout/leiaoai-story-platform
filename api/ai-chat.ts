import type { VercelRequest, VercelResponse } from '@vercel/node';

// System prompt for AI investment consultant
const getSystemPrompt = () => `你是一位专业的AI投融资顾问，拥有丰富的商业分析、投资策略和企业咨询经验。你的目标是为用户提供专业、准确且实用的投融资建议。

请遵循以下原则：
1. 提供专业、客观的分析和建议
2. 使用简洁明了的语言，避免过多行业术语
3. 结合实际案例和数据支持你的观点
4. 关注风险评估和投资回报分析
5. 提供可操作的建议和下一步行动计划

当回答问题时，请考虑：
- 商业模式的可行性
- 市场机会和竞争格局
- 财务健康状况和增长潜力
- 团队能力和执行力
- 风险因素和缓解策略

请用用户的语言回复，保持专业且易于理解。`;

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
    
    console.log('🔵 API: Received request', { model, messageLength: message?.length, hasSessionId: !!sessionId });
    
    if (!message || typeof message !== 'string') {
      res.status(400).json({ error: 'Invalid request: message is required' });
      return;
    }

    const mapped = MODEL_MAP[model] || MODEL_MAP['deepseek'];
    console.log('🔵 API: Mapped to provider', { provider: mapped.provider, model: mapped.model });

    // 选择上游与密钥
    let url = '';
    let apiKey = '';
    let authHeader = '';
    if (mapped.provider === 'deepseek') {
      url = 'https://api.deepseek.com/chat/completions';
      apiKey = process.env.DEEPSEEK_API_KEY || '';
      authHeader = `Bearer ${apiKey}`;
      console.log('🔵 API: DeepSeek key present:', !!apiKey, 'length:', apiKey?.length || 0);
      if (!apiKey) {
        res.status(500).json({ error: 'Server misconfigured: missing DEEPSEEK_API_KEY' });
        return;
      }
    } else if (mapped.provider === 'openai') {
      url = 'https://api.openai.com/v1/chat/completions';
      apiKey = process.env.OPENAI_API_KEY || '';
      authHeader = `Bearer ${apiKey}`;
      console.log('🔵 API: OpenAI key present:', !!apiKey, 'length:', apiKey?.length || 0);
      if (!apiKey) {
        res.status(500).json({ error: 'Server misconfigured: missing OPENAI_API_KEY' });
        return;
      }
    } else if (mapped.provider === 'qwen') {
      // Qwen 兼容 OpenAI Chat Completions 协议（DashScope compatible-mode）
      url = 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions';
      apiKey = process.env.QWEN_API_KEY || '';
      authHeader = `Bearer ${apiKey}`;
      console.log('🔵 API: Qwen key present:', !!apiKey, 'length:', apiKey?.length || 0);
      if (!apiKey) {
        res.status(500).json({ error: 'Server misconfigured: missing QWEN_API_KEY' });
        return;
      }
    }

    const startTime = Date.now();

    // 构建请求体 - 不同API支持不同的参数
    const requestBody: any = {
      model: mapped.model,
      messages: [
        { role: 'system', content: getSystemPrompt() },
        { role: 'user', content: message },
      ],
      temperature: 0.7,
      max_tokens: 2000,
      stream: false,
    };

    // 只为DeepSeek添加top_p和session_id
    if (mapped.provider === 'deepseek') {
      requestBody.top_p = 0.9;
      if (sessionId) {
        requestBody.session_id = sessionId;
      }
    }

    console.log(`🔵 API: Calling ${mapped.provider} (${mapped.model})`);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: authHeader,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    console.log(`🔵 API: ${mapped.provider} response status: ${response.status}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`🔴 API: ${mapped.provider} error:`, errorText.slice(0, 500));
      res.status(response.status).json({ error: errorText.slice(0, 500) });
      return;
    }

    const data: any = await response.json();
    const aiResponse: string | undefined = data?.choices?.[0]?.message?.content;

    if (!aiResponse) {
      console.error(`🔴 API: Invalid response from ${mapped.provider}:`, JSON.stringify(data).slice(0, 200));
      res.status(502).json({ error: `Invalid response from ${mapped.provider}` });
      return;
    }

    console.log(`🟢 API: ${mapped.provider} success, response length: ${aiResponse.length}`);

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
