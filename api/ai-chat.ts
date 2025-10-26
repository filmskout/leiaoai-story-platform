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
    
    console.log('🔑 API Keys Status:', {
      openai: !!openaiApiKey,
      deepseek: !!deepseekApiKey
    });
    
    let response: string;
    let usedModel: string;
    
    // 优先使用DeepSeek
    if (model === 'deepseek' && deepseekApiKey) {
      try {
        const systemPrompt = language.startsWith('zh') 
          ? '你是一个专业的AI助手，请用中文回答用户的问题。'
          : 'You are a professional AI assistant. Please answer user questions in English.';
          
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
            max_tokens: 2000
          })
        });
        
        if (!apiResponse.ok) {
          throw new Error(`DeepSeek API error: ${apiResponse.status}`);
        }
        
        const data = await apiResponse.json();
        response = data.choices[0].message.content;
        usedModel = 'deepseek-chat';
        
      } catch (error) {
        console.error('DeepSeek failed, trying OpenAI:', error);
        throw error;
      }
    } else if (model === 'openai' && openaiApiKey) {
      // 使用OpenAI
      const systemPrompt = language.startsWith('zh') 
        ? '你是一个专业的AI助手，请用中文回答用户的问题。'
        : 'You are a professional AI assistant. Please answer user questions in English.';
        
      const apiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openaiApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: message }
          ],
          temperature: 0.7,
          max_tokens: 2000
        })
      });
      
      if (!apiResponse.ok) {
        throw new Error(`OpenAI API error: ${apiResponse.status}`);
      }
      
      const data = await apiResponse.json();
      response = data.choices[0].message.content;
      usedModel = 'gpt-4';
      
    } else {
      throw new Error('No valid API key available');
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
