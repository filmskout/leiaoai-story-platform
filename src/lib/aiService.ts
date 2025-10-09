import { getAPIConfig, getAPIKey, getSystemPrompt, API_TIMEOUT } from './apiConfig';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ChatResponse {
  response: string;
  sessionId: string;
  aiModel: string;
  processingTime: number;
  timestamp: string;
}

export interface ChatError {
  code: string;
  message: string;
  timestamp: string;
}

/**
 * 安全的DeepSeek API调用服务
 * 在生产环境中，这个服务应该通过安全的后端代理实现
 */
export class AIService {
  private static instance: AIService;
  private config = getAPIConfig();
  
  private constructor() {}
  
  public static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }
  
  /**
   * 发送聊天消息到DeepSeek API
   */
  public async sendMessage(
    message: string, 
    sessionId?: string
  ): Promise<ChatResponse> {
    const startTime = Date.now();
    
    try {
      // 获取API密钥（从安全配置）
      const apiKey = await getAPIKey();
      
      if (!apiKey) {
        throw new Error('配置错误：API密钥不可用');
      }
      
      // 准备请求数据
      const messages: ChatMessage[] = [
        { role: 'system', content: getSystemPrompt() },
        { role: 'user', content: message }
      ];
      
      // 创建可取消的请求
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        controller.abort();
      }, API_TIMEOUT);
      
      try {
        // 调用DeepSeek API
        const response = await fetch(this.config.deepseek.baseUrl, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: this.config.deepseek.model,
            messages: messages,
            temperature: this.config.deepseek.temperature,
            max_tokens: this.config.deepseek.maxTokens,
            top_p: this.config.deepseek.topP,
            stream: false
          }),
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          const errorText = await response.text();
          const errorDetail = errorText.length > 100 ? errorText.substring(0, 100) + '...' : errorText;
          throw new Error(`API调用失败: ${response.status} - ${errorDetail}`);
        }
        
        const data = await response.json();
        const aiResponse = data.choices?.[0]?.message?.content;
        
        if (!aiResponse) {
          throw new Error('无效的API响应格式');
        }
        
        const processingTime = Date.now() - startTime;
        
        return {
          response: aiResponse,
          sessionId: sessionId || crypto.randomUUID(),
          aiModel: 'deepseek',
          processingTime,
          timestamp: new Date().toISOString()
        };
        
      } catch (fetchError) {
        clearTimeout(timeoutId);
        
        if (fetchError.name === 'AbortError') {
          throw new Error('请求超时，请稍后重试');
        }
        
        throw fetchError;
      }
      
    } catch (error) {
      console.error('AI Service Error:', error);
      
      // 返回统一的错误格式
      throw {
        code: 'AI_SERVICE_ERROR',
        message: error instanceof Error ? error.message : '未知错误',
        timestamp: new Date().toISOString()
      } as ChatError;
    }
  }
  
  /**
   * 检查服务状态
   */
  public async checkServiceHealth(): Promise<boolean> {
    try {
      const testResponse = await this.sendMessage('你好');
      return testResponse.response.length > 0;
    } catch (error) {
      console.error('Service health check failed:', error);
      return false;
    }
  }
}

// 导出单例实例
export const aiService = AIService.getInstance();