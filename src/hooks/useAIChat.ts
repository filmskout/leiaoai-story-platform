import { useState, useEffect, useRef } from 'react';
import { useAI } from '@/contexts/AIContext';
import { useTranslation } from 'react-i18next';
import { fetchAIResponse } from '../services/api';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { useWebsiteStats } from './useWebsiteStats';
import { sessionToMarkdown, generateMarkdownFilename } from '@/lib/chatMarkdown';

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
  category?: string; // 来源分类（从哪个专业服务区来的）
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
  const { updateResponseTime: updateAvgResponseTime, incrementStat } = useWebsiteStats();

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

  // 保存会话为Markdown文件到Storage
  const saveSessionAsMarkdown = async (session: ChatSession) => {
    if (!user) return;
    
    try {
      console.log('🔵 Saving session as Markdown', { sessionId: session.id });
      
      // 获取当前最新的session状态（包含最新消息）
      const currentSessionState = currentSession?.id === session.id ? currentSession : session;
      
      // 生成Markdown内容
      const markdown = sessionToMarkdown(currentSessionState);
      const filename = generateMarkdownFilename(currentSessionState);
      const filePath = `${user.id}/${filename}`;
      
      // 转换为Blob
      const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
      
      // 上传到Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('chat-sessions')
        .upload(filePath, blob, {
          contentType: 'text/markdown',
          upsert: true // 覆盖已存在的文件
        });
      
      if (uploadError) {
        console.error('🔴 Failed to upload Markdown:', uploadError);
        return;
      }
      
      console.log('🟢 Markdown uploaded successfully', { filePath });
      
      // 获取公开URL
      const { data: urlData } = supabase.storage
        .from('chat-sessions')
        .getPublicUrl(filePath);
      
      // 更新数据库中的markdown_file_url字段
      const { error: updateError } = await supabase
        .from('chat_sessions')
        .update({ 
          markdown_file_url: urlData.publicUrl,
          markdown_file_path: filePath
        })
        .eq('session_id', session.id);
      
      if (updateError) {
        console.error('🔴 Failed to update session with Markdown URL:', updateError);
      } else {
        console.log('✅ Session updated with Markdown URL');
      }
      
    } catch (error) {
      console.error('🔴 Error saving session as Markdown:', error);
    }
  };

  // 创建新对话
  const createNewSession = async (title?: string, category?: string) => {
    const sessionId = crypto.randomUUID();
    const sessionTitle = title || '新的投融资咨询';
    
    console.log('🔵 Creating new chat session', { 
      sessionId, 
      title: sessionTitle, 
      category,
      userId: user?.id,
      isUserLoggedIn: !!user 
    });
    
    try {
      // 在数据库中创建新会话
      const { data: newSessionData, error: sessionError } = await supabase
        .from('chat_sessions')
        .insert({
          session_id: sessionId,
          user_id: user?.id || null,
          title: sessionTitle,
          category: category || null, // 保存category字段
          message_count: 0
        })
        .select()
        .maybeSingle();
        
      if (sessionError) {
        console.error('🔴 Failed to create session in database:', sessionError);
        console.error('🔴 Session data attempted:', {
          session_id: sessionId,
          user_id: user?.id || null,
          title: sessionTitle,
          category: category || null
        });
        throw new Error('创建会话失败');
      }
      
      console.log('✅ Session created in database:', newSessionData);
      
      const newSession: ChatSession = {
        id: sessionId,
        title: sessionTitle,
        messages: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        category: category
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
  const sendMessage = async (content: string, sessionId?: string, modelOverride?: string, category?: string) => {
    if (!content.trim()) return;
    
    console.log('🔵 Sending message', { 
      hasSession: !!currentSession, 
      model: modelOverride || selectedChatModel,
      category 
    });
    
    setIsLoading(true);
    setError(null);
    
    try {
      // 使用当前会话或创建新会话
      let session = currentSession;
      if (!session) {
        session = await createNewSession(undefined, category);
        
        // 增加会话统计（如果是新会话）
        try {
          await incrementStat('qa');
          console.log('✅ Incremented Q&A session stats');
        } catch (err) {
          console.warn('Failed to increment session stats', err);
        }
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
            
            // 同时更新到数据库统计（全局平均响应时间）
            await updateAvgResponseTime(response.processingTime);
            console.log('✅ Updated average response time to database', response.processingTime);
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
          
          // 保存会话为Markdown文件
          await saveSessionAsMarkdown(session);
          
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
  const deleteSession = async (sessionId: string) => {
    if (!user) return;
    
    try {
      console.log('🔵 Deleting session', { sessionId });
      
      // 1. 从数据库获取session信息（包含markdown_file_path）
      const { data: sessionData } = await supabase
        .from('chat_sessions')
        .select('markdown_file_path')
        .eq('session_id', sessionId)
        .eq('user_id', user.id)
        .single();
      
      // 2. 如果有Markdown文件，从Storage删除
      if (sessionData?.markdown_file_path) {
        const { error: storageError } = await supabase.storage
          .from('chat-sessions')
          .remove([sessionData.markdown_file_path]);
        
        if (storageError) {
          console.error('🔴 Failed to delete Markdown file:', storageError);
        } else {
          console.log('✅ Markdown file deleted');
        }
      }
      
      // 3. 删除数据库中的消息
      const { error: messagesError } = await supabase
        .from('chat_messages')
        .delete()
        .eq('session_id', sessionId);
      
      if (messagesError) {
        console.error('🔴 Failed to delete messages:', messagesError);
      }
      
      // 4. 删除数据库中的会话
      const { error: sessionError } = await supabase
        .from('chat_sessions')
        .delete()
        .eq('session_id', sessionId)
        .eq('user_id', user.id);
      
      if (sessionError) {
        console.error('🔴 Failed to delete session:', sessionError);
        throw sessionError;
      }
      
      // 5. 更新本地状态
      setSessions(prev => prev.filter(s => s.id !== sessionId));
      if (currentSession?.id === sessionId) {
        setCurrentSession(null);
      }
      
      console.log('✅ Session deleted successfully');
      
    } catch (error) {
      console.error('🔴 Error deleting session:', error);
      throw error;
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
