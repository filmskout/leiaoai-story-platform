import { useState, useEffect, useRef } from 'react';
import { useAI } from '@/contexts/AIContext';
import { useTranslation } from 'react-i18next';
import { fetchAIResponse } from '../services/api';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  aiModel?: string;
  processingTime?: number;
  isTyping?: boolean;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}

export function useAIChat() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoadingSessions, setIsLoadingSessions] = useState(true);
  
  const { selectedChatModel, updateModelResponseTime } = useAI();
  const { i18n } = useTranslation();
  const { user } = useAuth() || { user: null };

  // 加载用户的聊天会话
  const loadChatSessions = async () => {
    setIsLoadingSessions(true);
    try {
      const { data: sessionsData, error: sessionsError } = await supabase
        .from('chat_sessions')
        .select('*')
        .eq('user_id', user?.id || null)
        .order('updated_at', { ascending: false });
        
      if (sessionsError) {
        console.error('Failed to load chat sessions:', sessionsError);
        return;
      }
      
      if (sessionsData) {
        const loadedSessions = await Promise.all(
          sessionsData.map(async (sessionData) => {
            // 加载会话的消息
            const { data: messagesData, error: messagesError } = await supabase
              .from('chat_messages')
              .select('*')
              .eq('session_id', sessionData.session_id)
              .order('created_at', { ascending: true });
              
            const messages: ChatMessage[] = messagesData ? messagesData.map(msg => ({
              id: msg.id.toString(),
              role: msg.role as 'user' | 'assistant',
              content: msg.content,
              timestamp: new Date(msg.created_at),
              aiModel: msg.ai_model || undefined,
              processingTime: msg.processing_time || undefined
            })) : [];
            
            return {
              id: sessionData.session_id,
              title: sessionData.title || '新的对话',
              messages,
              createdAt: new Date(sessionData.created_at),
              updatedAt: new Date(sessionData.updated_at)
            } as ChatSession;
          })
        );
        
        setSessions(loadedSessions);
      }
    } catch (error) {
      console.error('Error loading chat sessions:', error);
    } finally {
      setIsLoadingSessions(false);
    }
  };
  
  // 组件挂载时加载聊天历史
  useEffect(() => {
    loadChatSessions();
  }, [user]);

  // 创建新对话
  const createNewSession = async (title?: string) => {
    const sessionId = crypto.randomUUID();
    const sessionTitle = title || '新的投融资咨询';
    
    try {
      // 在数据库中创建新会话
      const { data: newSessionData, error: sessionError } = await supabase
        .from('chat_sessions')
        .insert({
          session_id: sessionId,
          user_id: user?.id || null,
          title: sessionTitle,
          message_count: 0
        })
        .select()
        .maybeSingle();
        
      if (sessionError) {
        console.error('Failed to create session in database:', sessionError);
        throw new Error('创建会话失败');
      }
      
      const newSession: ChatSession = {
        id: sessionId,
        title: sessionTitle,
        messages: [],
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      setSessions(prev => [newSession, ...prev]);
      setCurrentSession(newSession);
      return newSession;
    } catch (error) {
      console.error('Error creating new session:', error);
      // 回退到本地创建
      const fallbackSession: ChatSession = {
        id: sessionId,
        title: sessionTitle,
        messages: [],
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      setSessions(prev => [fallbackSession, ...prev]);
      setCurrentSession(fallbackSession);
      return fallbackSession;
    }
  };

  // 发送消息
  const sendMessage = async (content: string, sessionId?: string, modelOverride?: string) => {
    if (!content.trim()) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // 使用当前会话或创建新会话
      let session = currentSession;
      if (!session) {
        session = await createNewSession();
      }
      
      // 添加用户消息
      const userMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'user',
        content,
        timestamp: new Date()
      };
      
      // 更新会话
      const updatedSession = {
        ...session,
        messages: [...session.messages, userMessage],
        updatedAt: new Date()
      };
      
      setCurrentSession(updatedSession);
      setSessions(prev => 
        prev.map(s => s.id === session!.id ? updatedSession : s)
      );
      
      // 创建AI消息占位符
      const aiMessageId = crypto.randomUUID();
      // 使用传入的模型覆盖或默认模型
      const modelToUse = modelOverride || selectedChatModel;
      
      const aiMessage: ChatMessage = {
        id: aiMessageId,
        role: 'assistant',
        content: '',
        timestamp: new Date(),
        aiModel: modelToUse,
        isTyping: false
      };
      
      // 添加AI消息占位符
      const sessionWithAiPlaceholder = {
        ...updatedSession,
        messages: [...updatedSession.messages, aiMessage],
        updatedAt: new Date()
      };
      
      setCurrentSession(sessionWithAiPlaceholder);
      setSessions(prev => 
        prev.map(s => s.id === session!.id ? sessionWithAiPlaceholder : s)
      );
      
      try {
        // 调用新的API服务
        const response = await fetchAIResponse(
          [{ role: 'user', content }],
          modelToUse,
          i18n.language
        );
        
        // 更新模型响应时间统计
        if (response.processingTime > 0) {
          try {
            // 使用从上下文中获取的 updateModelResponseTime 函数
            updateModelResponseTime(response.model, response.processingTime);
          } catch (updateError) {
            console.warn('更新模型响应时间失败:', updateError);
          }
        }
        
        // 直接更新消息内容，不使用打字机效果
        setSessions(prev => 
          prev.map(session => ({
            ...session,
            messages: session.messages.map(msg => 
              msg.id === aiMessageId 
                ? { 
                    ...msg, 
                    content: response.response,
                    aiModel: response.model,
                    processingTime: response.processingTime,
                    isTyping: false
                  }
                : msg
            )
          }))
        );
        
        setCurrentSession(prev => {
          if (!prev) return prev;
          return {
            ...prev,
            messages: prev.messages.map(msg => 
              msg.id === aiMessageId 
                ? { 
                    ...msg, 
                    content: response.response,
                    aiModel: response.model,
                    processingTime: response.processingTime,
                    isTyping: false
                  }
                : msg
            )
          };
        });
        
        // 保存到数据库（用户和AI消息）
        try {
          await supabase.from('chat_messages').insert([
            {
              session_id: session.id,
              role: 'user',
              content,
              ai_model: null,
              processing_time: null
            },
            {
              session_id: session.id,
              role: 'assistant',
              content: response.response,
              ai_model: response.model,
              processing_time: response.processingTime
            }
          ]);
        } catch (dbError) {
          console.warn('保存消息到数据库失败:', dbError);
          // 不影响用户体验，只是无法持久化
        }
        
      } catch (apiError) {
        throw apiError;
      }
      
    } catch (err) {
      console.error('发送消息失败:', err);
      setError(err instanceof Error ? err.message : '发送消息失败');
      
      // 移除失败的AI消息占位符
      setCurrentSession(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          messages: prev.messages.filter(msg => msg.role !== 'assistant' || msg.content !== '')
        };
      });
      
      setSessions(prev => 
        prev.map(session => ({
          ...session,
          messages: session.messages.filter(msg => msg.role !== 'assistant' || msg.content !== '')
        }))
      );
    } finally {
      setIsLoading(false);
    }
  };

  // 切换会话
  const switchSession = (sessionId: string) => {
    const session = sessions.find(s => s.id === sessionId);
    if (session) {
      setCurrentSession(session);
    }
  };

  // 删除会话
  const deleteSession = (sessionId: string) => {
    setSessions(prev => prev.filter(s => s.id !== sessionId));
    if (currentSession?.id === sessionId) {
      setCurrentSession(null);
    }
  };

  // 清空所有会话
  const clearAllSessions = () => {
    setSessions([]);
    setCurrentSession(null);
  };

  return {
    sessions,
    currentSession,
    isLoading,
    isLoadingSessions,
    error,

    sendMessage,
    createNewSession,
    switchSession,
    deleteSession,
    clearAllSessions,
    loadChatSessions
  };
}
