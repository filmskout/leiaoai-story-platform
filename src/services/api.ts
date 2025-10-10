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

    // 调用AI聊天edge function
    const { data, error } = await supabase.functions.invoke('ai-chat', {
      body: {
        message: lastMessage.content,
        model: model,
        sessionId: crypto.randomUUID() // 临时会话ID
      }
    });

    if (error) {
      console.error('AI Chat function error:', error);
      throw new Error(error.message || 'AI service temporarily unavailable');
    }

    if (!data || !data.data) {
      throw new Error('Invalid response from AI service');
    }

    const endTime = Date.now();
    const processingTime = Number(((endTime - startTime) / 1000).toFixed(1));

    return {
      response: data.data.content || 'No response generated',
      model: data.data.model || model,
      processingTime
    };
  } catch (error) {
    console.error('Error in fetchAIResponse:', error);
    
    // 返回友好的错误消息
    const isZh = language.startsWith('zh');
    const errorMessage = isZh 
      ? '抱歉，AI服务暂时不可用。请稍后再试，或尝试切换其他模型。'
      : 'Sorry, AI service is temporarily unavailable. Please try again later or switch to another model.';
    
    throw new Error(errorMessage);
  }
}

export default { fetchAIResponse };