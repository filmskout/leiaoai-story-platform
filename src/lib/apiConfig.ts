/**
 * 安全的API配置管理
 * 在生产环境中，这些配置应该通过环境变量或安全的配置服务提供
 */

// API配置类型定义
export interface APIConfig {
  deepseek: {
    baseUrl: string;
    model: string;
    temperature: number;
    maxTokens: number;
    topP: number;
  };
}

// 默认API配置
const defaultConfig: APIConfig = {
  deepseek: {
    baseUrl: 'https://api.deepseek.com/chat/completions',
    model: 'deepseek-chat',
    temperature: 0.7,
    maxTokens: 2000,
    topP: 0.9
  }
};

// 获取API配置
export const getAPIConfig = (): APIConfig => {
  // 在实际生产环境中，这里应该从安全的配置服务获取
  return defaultConfig;
};

// 安全的API密钥获取（临时解决方案）
// 在生产环境中，这应该通过安全的后端服务提供
export const getAPIKey = async (): Promise<string> => {
  // 优先从环境变量获取（如果支持的话）
  if (typeof window !== 'undefined' && (window as any).__API_KEY__) {
    return (window as any).__API_KEY__;
  }
  
  // 在实际生产环境中，这里应该调用安全的后端API获取临时密钥
  // 目前使用配置的密钥作为临时解决方案
  return 'sk-85720175774449d49569e8a3a15f387a';
};

// 投融资专业系统提示词
export const getSystemPrompt = (): string => {
  return `你是蕾奥AI投融资专家助手，专注于提供专业的投融资咨询服务。你的专业领域包括：

1. 宏观经济展望分析
2. 国内外投融资环境差异化对比
3. CVC产业投资模式专业指导
4. 并购对赌策略分析
5. IPO/SPAC上市流程（A股/港股/美股差异化）
6. 上市准备材料清单指导

请用专业、准确、有深度的方式回答用户的投融资相关问题。如果问题超出投融资领域，请礼貌地引导用户回到相关话题。`;
};

// API调用超时设置
export const API_TIMEOUT = 30000; // 30秒

// 添加安全警告日志
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  console.warn('⚠️ 开发环境警告: API密钥当前在客户端配置。在生产环境中，请确保通过安全的后端服务提供API密钥。');
}