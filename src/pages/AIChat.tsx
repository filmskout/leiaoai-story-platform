import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { AnswerModule } from '@/components/ai/AnswerModule';
import { FixedInputBar } from '@/components/ai/FixedInputBar';
import { ScrollToBottomButton } from '@/components/ui/ScrollToBottomButton';
import { PageHero } from '@/components/PageHero';
import { useSmartAIChat } from '@/hooks/useSmartAIChat';
import { useAI } from '@/contexts/AIContext';
import { downloadMarkdown } from '@/lib/chatMarkdown';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Home, MessageSquare, ArrowUp, ArrowDown, Sparkles, ChevronDown, Save, Download } from 'lucide-react';
import { motion } from 'framer-motion';
import { useMobileLayout } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function AIChat() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const questionParam = searchParams.get('question');
  const locationState = location.state as { 
    autoAsk?: boolean, 
    question?: string, 
    sessionId?: string,
    from?: string 
  } | null;
  const isMobile = useMobileLayout();
  const { selectedChatModel, setSelectedChatModel, modelConfigs } = useAI();
  
  // 使用新的智能聊天Hook
  const {
    currentMessages,
    isLoading,
    error,
    inputMessage,
    isRecording,
    setInputMessage,
    sendMessage,
    handleSendMessage,
    startNewChat,
    handleVoiceInput,
    regenerateMessage,
    clearError,
    selectQuestion,
    switchSession
  } = useSmartAIChat();
  
  // 使用 ref 来跟踪是否已经自动提问过（避免重复触发）
  const hasAutoAskedRef = useRef(false);
  
  // 生成当前会话的唯一标识（基于问题或路由状态）
  const sessionKey = questionParam 
    ? `auto-asked-${questionParam}` 
    : locationState?.question 
      ? `auto-asked-${locationState.question}` 
      : null;

  // 返回专业服务区域
  const handleGoBack = () => {
    // 导航到主页并滚动到专业服务区域
    navigate('/', { 
      state: { 
        scrollTo: 'professional-services',
        from: 'ai-chat'
      } 
    });
  };

  // 滚动到顶部
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 滚动到底部
  const scrollToBottom = () => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  };

  // 保存待发送的消息引用
  const pendingQuestionRef = useRef<{ question: string; category?: string } | null>(null);

  // 处理从Profile传来的session ID
  useEffect(() => {
    if (locationState?.sessionId && locationState?.from === 'profile') {
      console.log('🔵 Loading session from Profile:', locationState.sessionId);
      switchSession(locationState.sessionId);
    }
  }, [locationState?.sessionId, locationState?.from, switchSession]);

  // 自动提问初始问题
  useEffect(() => {
    console.log('🔵 AIChat: Auto-ask effect triggered', { 
      hasSessionKey: !!sessionKey,
      hasQuestionParam: !!questionParam,
      hasLocationState: !!locationState,
      autoAsk: locationState?.autoAsk,
      question: locationState?.question || questionParam,
      hasAutoAsked: hasAutoAskedRef.current,
      isLoading
    });

    // 如果已经自动提问过了，或者是从Profile来的session，跳过
    if (hasAutoAskedRef.current || locationState?.from === 'profile') {
      console.log('⏭️ Already auto-asked or loading from profile, skipping');
      return;
    }

    // 检查路由状态中的问题（优先级更高，因为这是从Professional Services来的）
    if (locationState?.autoAsk && locationState?.question) {
      console.log('🎯 Auto-asking from location state:', locationState.question);
      hasAutoAskedRef.current = true;
      setInputMessage(locationState.question);
      pendingQuestionRef.current = {
        question: locationState.question,
        category: locationState.category
      };
      
      // 清除状态，防止刷新时重复提问
      navigate(location.pathname, { replace: true, state: null });
      return;
    }
    
    // 检查URL参数中的问题
    if (questionParam && !hasAutoAskedRef.current) {
      console.log('🎯 Auto-asking from URL parameter:', questionParam);
      hasAutoAskedRef.current = true;
      setInputMessage(questionParam);
      pendingQuestionRef.current = {
        question: questionParam
      };
      return;
    }
  }, [questionParam, locationState, setInputMessage, navigate, location.pathname, isLoading]);

  // 当组件完全加载后，发送待处理的问题
  useEffect(() => {
    if (pendingQuestionRef.current && !isLoading) {
      const { question, category } = pendingQuestionRef.current;
      console.log('⏰ Executing auto-send now...', { question, category });
      
      // 短延迟确保所有状态已更新
      const timer = setTimeout(() => {
        sendMessage(question, undefined, undefined, category)
          .then(() => {
            console.log('✅ Auto-send completed successfully');
            pendingQuestionRef.current = null;
          })
          .catch((err) => {
            console.error('❌ Auto-send failed:', err);
            // 重置标志，允许用户手动重试
            hasAutoAskedRef.current = false;
            pendingQuestionRef.current = null;
          });
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [isLoading, sendMessage]);

  // 当用户点击"新对话"时，清除会话标记并重置自动提问标志
  const handleStartNewChat = () => {
    if (sessionKey) {
      sessionStorage.removeItem(sessionKey);
    }
    hasAutoAskedRef.current = false;
    startNewChat();
  };

  // 手动下载当前会话为Markdown
  const handleDownloadMarkdown = () => {
    if (!currentSession || currentMessages.length === 0) {
      toast.error(t('ai_chat.no_messages_to_save', 'No messages to save'));
      return;
    }

    try {
      downloadMarkdown(currentSession);
      toast.success(t('ai_chat.download_success', 'Chat downloaded successfully'));
    } catch (error) {
      console.error('Failed to download markdown:', error);
      toast.error(t('ai_chat.download_failed', 'Failed to download chat'));
    }
  };

  // 页面动画
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.5, 
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <>
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="min-h-screen bg-background pb-32" // 为固定输入框留出空间
      >
        {/* 英雄模块 - 使用可复用的PageHero组件 */}
        <PageHero 
          titleKey={isMobile ? "ai_chat.mobile_page_title" : "ai_chat.page_title"}
          subtitleKey={isMobile ? "ai_chat.mobile_page_subtitle" : "ai_chat.page_subtitle"}
          icon={MessageSquare}
        >
          {/* 模型选择下拉菜单 - 与首页Hero保持一致 */}
          <div className="flex justify-center mt-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="text-sm bg-primary-200/90 dark:bg-primary-600/50 backdrop-blur-sm rounded-lg border border-primary-300 dark:border-primary-500 px-4 py-2 flex items-center gap-2 cursor-pointer hover:bg-primary-300 hover:border-primary-400 hover:text-primary-900 dark:hover:bg-primary-500 dark:hover:text-white transition-colors shadow-sm">
                  <span>{i18n.language.startsWith('zh') ? 
                    selectedChatModel === 'openai' ? 'OpenAI' : 
                    selectedChatModel === 'qwen' ? '通义千问' : 
                    'DeepSeek' 
                  : 
                    selectedChatModel === 'openai' ? 'OpenAI' : 
                    selectedChatModel === 'qwen' ? 'Qwen' : 
                    'DeepSeek'
                  }</span>
                  <Sparkles size={16} className="text-primary-500" />
                  <ChevronDown size={16} className="text-primary-500" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" className="bg-primary-100 dark:bg-primary-800/90 border-primary-300 dark:border-primary-700 shadow-lg backdrop-blur-md">
                {modelConfigs && modelConfigs.chat && modelConfigs.chat.available && 
                  modelConfigs.chat.available.map((model) => (
                    <DropdownMenuItem 
                      key={model.id} 
                      onClick={() => {
                        console.log(`选择了模型: ${model.id}`);
                        setSelectedChatModel(model.id);
                        // 触发模型变化事件
                        const event = new CustomEvent('model-changed', {
                          detail: { model: model.id }
                        });
                        window.dispatchEvent(event);
                        console.log(`切换模型为: ${model.id}`);
                      }}
                      className={`${selectedChatModel === model.id ? 'bg-primary-200 dark:bg-primary-700/50' : 'hover:bg-primary-50 dark:hover:bg-primary-700/30'} cursor-pointer p-3 rounded-md transition-all duration-150 my-1`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{i18n.language.startsWith('zh') ? 
                          model.id === 'openai' ? 'OpenAI' : 
                          model.id === 'qwen' ? '通义千问' : 
                          'DeepSeek' 
                        : 
                          model.id === 'openai' ? 'OpenAI' : 
                          model.id === 'qwen' ? 'Qwen' : 
                          'DeepSeek'
                        }</span>
                        {model.recommended && (
                          <span className="text-xs bg-primary-400/30 dark:bg-primary-500/40 text-primary-800 dark:text-primary-100 rounded px-1.5 py-0.5 font-medium">
                            {t('recommended')}
                          </span>
                        )}
                      </div>
                    </DropdownMenuItem>
                  ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </PageHero>

        {/* 主要内容区 */}
        <section className="px-0 py-4 sm:px-4 sm:py-16">
          <div className="container-custom">
            <div className="max-w-6xl mx-auto">
              {/* 返回按钮和新对话按钮 */}
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="mb-8"
              >
                <div className="flex items-center justify-between mb-6">
                  <Button 
                    variant="outline" 
                    onClick={handleGoBack}
                    className="flex items-center gap-2 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
                  >
                    <ArrowLeft size={18} />
                    <span className="hidden sm:inline">{t('back')}</span>
                    <Home size={16} className="sm:hidden" />
                  </Button>
                  
                  <div className="flex items-center gap-2">
                    {/* 下载Markdown按钮 - 仅在有消息时显示 */}
                    {currentMessages.length > 0 && (
                      <Button 
                        variant="outline" 
                        onClick={handleDownloadMarkdown}
                        className="flex items-center gap-2 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors border-green-300 dark:border-green-700 text-green-700 dark:text-green-300"
                        title={t('ai_chat.download_chat', 'Download chat as Markdown')}
                      >
                        <Download size={18} />
                        <span className="hidden sm:inline">{t('ai_chat.download', 'Download')}</span>
                      </Button>
                    )}
                    
                    <Button 
                      variant="outline" 
                      onClick={handleStartNewChat}
                      className="flex items-center gap-2 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
                    >
                      <MessageSquare size={18} />
                      <span className="hidden sm:inline">{t('ai_chat.new_chat')}</span>
                    </Button>
                  </div>
                </div>
              </motion.div>

              {/* 答案模块 - 中部区域，包含输入框 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="mb-8 w-full px-0"
              >
                <AnswerModule
                  messages={currentMessages}
                  isLoading={isLoading}
                  error={error}
                  onClearError={clearError}
                  onRegenerateMessage={regenerateMessage}
                  className="w-full"
                  // 添加输入框相关的props
            inputMessage={inputMessage}
            onInputChange={setInputMessage}
            onSendMessage={handleSendMessage}
            isRecording={isRecording}
            onVoiceInput={handleVoiceInput}
                  onQuestionSelect={selectQuestion}
                />
              </motion.div>
            </div>
          </div>
        </section>

        {/* 快速导航按钮 - 移到角落，变小 */}
        <motion.div 
          className={cn(
            "fixed z-[9998] flex flex-col gap-1 right-2",
            isMobile ? "bottom-20" : "bottom-24" // 移到角落，避免遮挡
          )}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1, type: "spring", stiffness: 200 }}
        >
          <Button
            onClick={scrollToTop}
            size="sm"
            variant="outline"
            className={cn(
              "rounded-full shadow-lg hover:shadow-xl transition-all duration-300 p-0 bg-white/70 backdrop-blur-sm",
              "w-8 h-8" // 统一变小
            )}
          >
            <ArrowUp size={14} />
          </Button>
          <Button
            onClick={scrollToBottom}
            size="sm"
            variant="outline"
            className={cn(
              "rounded-full shadow-lg hover:shadow-xl transition-all duration-300 p-0 bg-white/70 backdrop-blur-sm",
              "w-8 h-8" // 统一变小
            )}
          >
            <ArrowDown size={14} />
          </Button>
        </motion.div>
      </motion.div>
    </>
  );
}