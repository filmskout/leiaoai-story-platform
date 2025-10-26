import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // 设置CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, model = 'deepseek', language = 'zh' } = req.body || {};
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }
    
    console.log('🤖 AI Chat Request:', { model, messageLength: message.length, language });
    
    // 获取API密钥
    const openaiApiKey = process.env.OPENAI_API_KEY;
    const deepseekApiKey = process.env.DEEPSEEK_API_KEY;
    const qwenApiKey = process.env.QWEN_API_KEY;
    
    console.log('🔑 API Keys Status:', {
      openai: !!openaiApiKey,
      deepseek: !!deepseekApiKey,
      qwen: !!qwenApiKey
    });
    
    let response: string;
    let usedModel: string;
    let lastError: any;
    
    // 定义系统提示词
    const systemPrompt = language.startsWith('zh') 
      ? '你是一个专业的AI助手，请用中文回答用户的问题。'
      : 'You are a professional AI assistant. Please answer user questions in English.';
    
    // 尝试请求的函数
    const tryOpenAI = async (): Promise<{ response: string; model: string }> => {
      if (!openaiApiKey) throw new Error('OPENAI_API_KEY not configured');
      
      const apiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openaiApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: message }
          ],
          temperature: 0.7,
          max_tokens: 800
        })
      });
      
      if (!apiResponse.ok) {
        const errorText = await apiResponse.text();
        console.error('OpenAI API error:', apiResponse.status, errorText);
        throw new Error(`OpenAI API error: ${apiResponse.status}`);
      }
      
      const data = await apiResponse.json();
      return { response: data.choices[0].message.content, model: 'gpt-4o-mini' };
    };
    
    const tryDeepSeek = async (): Promise<{ response: string; model: string }> => {
      if (!deepseekApiKey) throw new Error('DEEPSEEK_API_KEY not configured');
      
      const apiResponse = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${deepseekApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: message }
          ],
          temperature: 0.7,
          max_tokens: 800,  // 减少token数量以提高速度
          stream: false
        })
      });
      
      if (!apiResponse.ok) {
        const errorText = await apiResponse.text();
        throw new Error(`DeepSeek API error: ${apiResponse.status} - ${errorText}`);
      }
      
      const data = await apiResponse.json();
      return { response: data.choices[0].message.content, model: 'deepseek-chat' };
    };
    
    const tryQwen = async (): Promise<{ response: string; model: string }> => {
      if (!qwenApiKey) throw new Error('QWEN_API_KEY not configured');
      
      // 使用正确的Qwen API格式
      const apiResponse = await fetch('https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${qwenApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'qwen-turbo',
          input: {
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: message }
            ]
          },
          parameters: {
            max_tokens: 800
          }
        })
      });
      
      if (!apiResponse.ok) {
        const errorText = await apiResponse.text();
        console.error('Qwen API error:', errorText);
        throw new Error(`Qwen API error: ${apiResponse.status}`);
      }
      
      const data = await apiResponse.json();
      console.log('Qwen API response:', JSON.stringify(data).slice(0, 200));
      
      if (!data.output || !data.output.choices || !data.output.choices[0] || !data.output.choices[0].message) {
        throw new Error(`Invalid Qwen API response structure: ${JSON.stringify(data).slice(0, 200)}`);
      }
      return { response: data.output.choices[0].message.content, model: 'qwen-turbo' };
    };
    
    // 根据选择的模型和可用密钥决定调用顺序
    const attempts: Array<() => Promise<{ response: string; model: string }>> = [];
    
    console.log('🔍 Available API keys:', { 
      openai: !!openaiApiKey, 
      deepseek: !!deepseekApiKey, 
      qwen: !!qwenApiKey,
      requestedModel: model
    });
    
    // 设置优先级
    if (model === 'openai') {
      if (openaiApiKey) attempts.push(tryOpenAI);
      if (qwenApiKey) attempts.push(tryQwen);
      if (deepseekApiKey) attempts.push(tryDeepSeek);
    } else if (model === 'qwen') {
      if (qwenApiKey) attempts.push(tryQwen);
      if (openaiApiKey) attempts.push(tryOpenAI);
      if (deepseekApiKey) attempts.push(tryDeepSeek);
    } else {
      // deepseek或默认
      if (deepseekApiKey) attempts.push(tryDeepSeek);
      if (qwenApiKey) attempts.push(tryQwen);
      if (openaiApiKey) attempts.push(tryOpenAI);
    }
    
    console.log(`📋 Attempting ${attempts.length} API(s):`, attempts.map(a => a.name || 'anonymous'));
    
    // 如果没有任何可用的API
    if (attempts.length === 0) {
      console.error('❌ No API keys available for any model');
      throw new Error('No API keys configured for any model');
    }
    
    // 尝试所有可用的API
    for (const attempt of attempts) {
      try {
        console.log(`🔄 Attempting API: ${attempt.name || 'anonymous'}`);
        const result = await attempt();
        response = result.response;
        usedModel = result.model;
        console.log(`✅ API succeeded: ${usedModel}`);
        break;
      } catch (error: any) {
        console.error(`❌ API尝试失败:`, error.message);
        lastError = error;
        // 继续尝试下一个
      }
    }
    
    // 如果所有API都失败
    if (!response) {
      console.error('❌ All API attempts failed');
      throw lastError || new Error('All API attempts failed');
    }
    
    console.log('✅ AI Chat Response:', { model: usedModel, responseLength: response.length });
    
    return res.status(200).json({
      success: true,
      response: response,
      model: usedModel,
      timestamp: new Date().toISOString()
    });
    
  } catch (error: any) {
    console.error('❌ AI Chat Error:', error);
    return res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
}
