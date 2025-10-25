import { supabase } from '@/lib/supabase';

// 临时类型定义
interface ApiMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ApiResponse {
  response: string;
  model: string;
  processingTime: number;
}

// AI响应函数 - 使用新的edge function
export async function fetchAIResponse(
  messages: ApiMessage[],
  model: string = 'deepseek',
  language: string = 'zh'
): Promise<ApiResponse> {
  const startTime = Date.now();
  
  try {
    // 获取最新的用户消息
    const lastMessage = messages[messages.length - 1];
    if (!lastMessage || !lastMessage.content) {
      throw new Error('No message content provided');
    }

    console.log('🔵 Frontend: Calling AI Chat API', { model, messageLength: lastMessage.content.length });

    // 调用独立的AI Chat API
    const resp = await fetch('/api/ai-chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: lastMessage.content,
        model,
        language: language
      })
    });

    console.log('🔵 Frontend: API Response Status', resp.status, resp.statusText);

    if (!resp.ok) {
      const txt = await resp.text();
      console.error('🔴 Frontend: API Error Response', txt.slice(0, 200));
      
      // 解析错误消息
      let errorObj;
      try {
        errorObj = JSON.parse(txt);
      } catch {
        errorObj = { error: txt };
      }
      
      const errorMsg = errorObj.error || txt || 'AI service temporarily unavailable';
      
      // 检查是否是API密钥配置错误
      if (errorMsg.includes('missing OPENAI_API_KEY')) {
        throw new Error(
          language.startsWith('zh') 
            ? '❌ OpenAI模型未配置。请切换到Qwen模型，或联系管理员配置OPENAI_API_KEY。'
            : '❌ OpenAI model not configured. Please switch to Qwen, or contact admin to configure OPENAI_API_KEY.'
        );
      }
      
      if (errorMsg.includes('missing DEEPSEEK_API_KEY')) {
        throw new Error(
          language.startsWith('zh') 
            ? '❌ DeepSeek模型未配置。请切换到Qwen模型，或联系管理员配置DEEPSEEK_API_KEY。'
            : '❌ DeepSeek model not configured. Please switch to Qwen, or contact admin to configure DEEPSEEK_API_KEY.'
        );
      }
      
      if (errorMsg.includes('missing QWEN_API_KEY')) {
        throw new Error(
          language.startsWith('zh') 
            ? '❌ Qwen模型未配置。请联系管理员配置QWEN_API_KEY。'
            : '❌ Qwen model not configured. Please contact admin to configure QWEN_API_KEY.'
        );
      }
      
      throw new Error(errorMsg);
    }

    const data = await resp.json();
    
    // 处理新的unified API响应格式
    if (data.success && data.response) {
      const endTime = Date.now();
      const processingTime = Number(((endTime - startTime) / 1000).toFixed(1));

      console.log('🟢 Frontend: Success', { 
        model: data.model || model, 
        responseLength: data.response?.length,
        time: processingTime 
      });

      return {
        response: data.response,
        model: data.model || model,
        processingTime
      };
    }
    
    // 处理错误响应
    if (data.error) {
      console.error('🔴 Frontend: API Error Response', data.error);
      throw new Error(data.error);
    }
    
    console.error('🔴 Frontend: Invalid response structure', data);
    throw new Error('Invalid response from AI service');
  } catch (error) {
    console.error('🔴 Frontend: Error in fetchAIResponse:', error);
    
    // 返回友好的错误消息
    const isZh = language.startsWith('zh');
    const errorMessage = isZh 
      ? '抱歉，AI服务暂时不可用。请稍后再试，或尝试切换其他模型。'
      : 'Sorry, AI service is temporarily unavailable. Please try again later or switch to another model.';
    
    throw new Error(errorMessage);
  }
}

export default { fetchAIResponse };