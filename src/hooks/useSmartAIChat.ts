import { useState, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAI } from '@/contexts/AIContext';
import { useAIChat, type ChatMessage } from '@/hooks/useAIChat';

/**
 * 检测文本语言
 */
function detectLanguage(text: string): 'zh' | 'en' {
  // 简单的中文检测：如果包含中文字符，则认为是中文
  const chineseRegex = /[\u4e00-\u9fa5]/;
  return chineseRegex.test(text) ? 'zh' : 'en';
}

/**
 * 为消息添加语言提示
 */
function addLanguagePrompt(message: string, targetLanguage: 'zh' | 'en'): string {
  if (targetLanguage === 'zh') {
    return `请用中文回答以下问题：${message}`;
  } else {
    return `Please answer the following question in English: ${message}`;
  }
}

export function useSmartAIChat() {
  const { i18n } = useTranslation();
  const { selectedChatModel, setSelectedChatModel } = useAI();
  const {
    currentSession,
    isLoading,
    error,
    sendMessage: originalSendMessage,
    createNewSession
  } = useAIChat();
  
  const [inputMessage, setInputMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  
  // 获取当前显示的消息（只显示一个对话）
  const currentMessages = currentSession?.messages || [];
  
  // 统一错误状态管理
  const currentError = error || localError;

  // 智能语言匹配的发送消息函数
  const sendMessage = useCallback(async (messageToSend?: string) => {
    const message = messageToSend || inputMessage;
    if (!message.trim()) return;
    
    try {
      // 1. 检测用户输入的语言
      const userLanguage = detectLanguage(message);
      
      // 2. 获取当前界面语言
      const currentUILanguage = i18n.language.startsWith('zh') ? 'zh' : 'en';
      
      // 3. 优先使用用户输入的语言，如果检测不出则使用界面语言
      const targetLanguage = userLanguage || currentUILanguage;
      
      // 4. 为消息添加语言提示
      const enhancedMessage = addLanguagePrompt(message, targetLanguage);
      
      // 5. 发送增强后的消息
      await originalSendMessage(enhancedMessage);
      
      // 6. 清理输入
      setInputMessage('');
      
    } catch (err) {
      console.error('Error sending message:', err);
      setLocalError(err instanceof Error ? err.message : 'Failed to send message');
    }
  }, [inputMessage, originalSendMessage, i18n.language]);

  // 创建新会话（清理之前的所有消息）
  const startNewChat = useCallback(async () => {
    try {
      await createNewSession();
      setLocalError(null);
    } catch (err) {
      console.error('Error creating new session:', err);
      setLocalError('Failed to create new session');
    }
  }, [createNewSession]);

  // 设置 AI 模型
  const setAIContextModel = useCallback((model: string) => {
    setSelectedChatModel(model);
  }, [setSelectedChatModel]);

  // 发送当前输入的消息
  const handleSendMessage = useCallback(async () => {
    if (!inputMessage.trim() || isLoading) return;
    
    try {
      await sendMessage();
    } catch (error) {
      console.error("发送失败，尝试使用备用模型", error);
      // 如果主模型发送失败，尝试使用 Qwen 作为备用
      try {
        // 切换到 Qwen 模型
        setAIContextModel('qwen');
        // 重新发送消息
        await sendMessage();
      } catch (fallbackError) {
        console.error("备用模型也失败", fallbackError);
        setLocalError("所有可用模型都无法响应，请稍后再试");
      }
    }
  }, [inputMessage, isLoading, sendMessage, setAIContextModel]);

  // 处理语音输入
  const handleVoiceInput = useCallback(async () => {
    if (isRecording) {
      setIsRecording(false);
      // TODO: 停止录音并处理音频
    } else {
      setIsRecording(true);
      // TODO: 开始录音
    }
  }, [isRecording]);

  // 重新生成消息
  const regenerateMessage = useCallback(async (messageId: string) => {
    // 找到该消息的上一条用户消息
    const messageIndex = currentMessages.findIndex(msg => msg.id === messageId);
    if (messageIndex > 0) {
      const userMessage = currentMessages[messageIndex - 1];
      if (userMessage.role === 'user') {
        // 重新发送用户消息
        await sendMessage(userMessage.content);
      }
    }
  }, [currentMessages, sendMessage]);

  // 清理错误
  const clearError = useCallback(() => {
    setLocalError(null);
  }, []);

  // 选择问题建议
  const selectQuestion = useCallback((question: string) => {
    setInputMessage(question);
  }, []);

  return {
    // 状态
    currentMessages,
    isLoading,
    error: currentError,
    inputMessage,
    isRecording,
    
    // 操作
    setInputMessage,
    sendMessage: handleSendMessage,
    startNewChat,
    handleVoiceInput,
    regenerateMessage,
    clearError,
    selectQuestion,
    
    // 原始数据
    currentSession,
    selectedModel: selectedChatModel
  };
}