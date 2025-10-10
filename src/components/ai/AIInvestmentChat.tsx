import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAI } from '@/contexts/AIContext';
import { useAIChat, type ChatMessage } from '@/hooks/useAIChat';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { MarkdownRenderer } from '@/components/ui/MarkdownRenderer';
import '@/lib/prism'; // 全局 Prism 导入
import { 
  Send, 
  Mic, 
  MicOff, 
  Bot, 
  User, 
  Settings, 
  Plus,
  MessageSquare,
  Clock,
  Zap,
  RefreshCcw,
  XCircle,
  InfoIcon,
  Download
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AIInvestmentChatProps {
  className?: string;
  initialQuestion?: string;
}

export function AIInvestmentChat({ className, initialQuestion }: AIInvestmentChatProps) {
  const { t } = useTranslation();
  const {
    selectedChatModel,
    selectedImageModel, 
    setSelectedChatModel,
    setSelectedImageModel,
    modelConfigs, 
    region,
    getModelResponseTime,
    getPerformanceIndicator,
    getSortedModels,
    getRecommendedModel
  } = useAI();
  const {
    currentSession,
    isLoading,
    error,
    sendMessage,
    createNewSession
  } = useAIChat();
  
  const [inputMessage, setInputMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [showModelSelector, setShowModelSelector] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // 统一错误状态管理
  const currentError = error || localError;
  const setError = (err: string | null) => {
    setLocalError(err);
  };

  // 自动提问初始问题
  useEffect(() => {
    if (initialQuestion && !isLoading) {
      // 如果没有当前会话，创建新会话
      if (!currentSession) {
        createNewSession().then(() => {
          sendMessage(initialQuestion);
        });
      } else if (currentSession.messages.length === 0) {
        // 如果会话存在但没有消息，直接发送
        sendMessage(initialQuestion);
      }
    }
  }, [initialQuestion, isLoading, currentSession]);

  // 自动滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentSession?.messages]);

  // 自动调整文本域高度
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [inputMessage]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;
    
    const message = inputMessage;
    setInputMessage('');
    await sendMessage(message);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleVoiceInput = async () => {
    if (isRecording) {
      setIsRecording(false);
      // TODO: 停止录音并处理音频
    } else {
      setIsRecording(true);
      // TODO: 开始录音
    }
  };

  const renderMessage = (message: ChatMessage) => {
    const isUser = message.role === 'user';
    
    return (
      <motion.div
        key={message.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={cn(
          'flex gap-3 p-4 rounded-xl transition-all duration-200',
          isUser 
            ? 'bg-primary-50 dark:bg-primary-900/20 ml-8' 
            : 'bg-neutral-50 dark:bg-neutral-800/50 mr-8'
        )}
      >
        <div className={cn(
          'flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center',
          isUser 
            ? 'bg-primary-500 text-white' 
            : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300'
        )}>
          {isUser ? <User size={18} /> : <Bot size={18} />}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-medium text-foreground">
              {isUser ? t('user.profile') : t('ai_chat.title')}
            </span>
            {!isUser && message.aiModel && (
              <span className="text-xs px-2 py-1 bg-neutral-100 dark:bg-neutral-700 rounded-full text-foreground-muted">
                {message.aiModel}
              </span>
            )}
            <span className="text-xs text-foreground-muted">
              {message.timestamp.toLocaleTimeString()}
            </span>
            {message.processingTime && (
              <div className="flex items-center gap-1 text-xs text-foreground-muted">
                <Clock size={12} />
                {message.processingTime}s
              </div>
            )}
          </div>
          
          <div className="prose prose-sm dark:prose-invert max-w-none">
            {message.content ? (
              <MarkdownRenderer 
                content={message.content} 
                className="text-foreground"
              />
            ) : (
              // 空内容时显示加载指示器
              <div className="flex items-center gap-2 text-foreground-muted">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <span className="text-sm">{t('ai_chat.analyzing_question')}</span>
              </div>
            )}
          </div>
          
          {!isUser && message.content && (
            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border">
              <Button variant="outline" size="sm" className="text-xs h-7 px-2">
                <Download size={14} className="mr-1" />
                {t('ai_chat.export')}
              </Button>
              <Button variant="outline" size="sm" className="text-xs h-7 px-2">
                <RefreshCcw size={14} className="mr-1" />
                {t('ai_chat.regenerate')}
              </Button>
              <Button variant="ghost" size="sm" className="text-xs h-7 px-2 ml-auto text-foreground-muted">
                <InfoIcon size={14} className="mr-1" />
                {t('ai_chat.feedback')}
              </Button>
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  return (
    <Card className={cn('flex flex-col h-full max-h-[600px]', className)}>
      {/* 头部 */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-center justify-between p-4 border-b border-border"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
            <Bot className="text-white" size={20} />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              {t('ai_chat.title')}
            </h2>
            <p className="text-sm text-foreground-muted">
              {t('ai_chat.subtitle')}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {/* AI模型选择器 */}
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowModelSelector(!showModelSelector)}
              className="text-foreground-muted hover:text-foreground"
            >
              <Settings size={16} className="mr-1" />
              <span className="hidden sm:inline">{selectedChatModel}</span>
            </Button>
            
            {showModelSelector && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-background border border-border shadow-lg rounded-lg z-50 overflow-hidden backdrop-blur-sm">
                <div className="p-3 bg-card/95">
                  <h4 className="text-sm font-medium text-foreground mb-2 flex items-center gap-1">
                    <Bot size={14} className="text-primary-500" />
                    {t('ai_chat.select_model')}
                  </h4>
                  {getSortedModels().map((model) => {
                    // 获取响应时间（秒）
                    const responseTime = getModelResponseTime(model.id);
                    // 获取性能指示图标
                    const performanceIcon = getPerformanceIndicator(model.id);
                    // 是否是推荐模型
                    const isRecommended = model.recommended || model.id === getRecommendedModel();
                    // 是否是当前最快的模型
                    const isFastest = getSortedModels()[0]?.id === model.id;
                    
                    return (
                    <motion.button
                      key={model.id}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: 0.1 }}
                      onClick={() => {
                        setSelectedChatModel(model.id);
                        setShowModelSelector(false);
                      }}
                      className={cn(
                          'w-full text-left p-3 rounded-md text-sm transition-all hover:bg-primary-50/80 dark:hover:bg-primary-900/30',
                          selectedChatModel === model.id
                            ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 border border-primary-200 dark:border-primary-800/60'
                            : 'hover:text-foreground hover:shadow-sm border border-transparent'
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {model.id === 'deepseek' ? (
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                              <path d="M8 15.5C12.1421 15.5 15.5 12.1421 15.5 8C15.5 3.85786 12.1421 0.5 8 0.5C3.85786 0.5 0.5 3.85786 0.5 8C0.5 12.1421 3.85786 15.5 8 15.5Z" fill="#0066FF" fillOpacity="0.1" stroke="#0066FF"/>
                              <path d="M8.51578 4.03395V7.52791L11.8396 6.03395L8.51578 4.03395Z" fill="#0066FF"/>
                              <path d="M8.51578 7.52791V12.0279L11.8396 9.00001L8.51578 7.52791Z" fill="#0066FF"/>
                              <path d="M8.51578 7.52791L5.19199 9.00001L8.51578 12.0279V7.52791Z" fill="#0066FF"/>
                              <path d="M8.51578 7.52791V4.03395L5.19199 6.03395L8.51578 7.52791Z" fill="#0066FF"/>
                            </svg>
                          ) : model.id === 'openai' ? (
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                              <path fillRule="evenodd" clipRule="evenodd" d="M8.68152 1.04948C7.98221 0.734375 7.17731 0.734375 6.47801 1.04948L3.09186 2.57031C2.39256 2.88542 1.90738 3.53385 1.87598 4.28646L1.71153 9.45312C1.6694 10.2057 2.15458 10.901 2.87944 11.2161L6.26559 12.737C6.9649 13.0521 7.7698 13.0521 8.4691 12.737L11.8553 11.2161C12.5546 10.901 13.0397 10.2526 13.0084 9.5L12.844 4.33333C12.8126 3.58073 12.3274 2.93229 11.6281 2.61719L8.68152 1.04948ZM7.40028 3.58073C7.52637 3.51562 7.68356 3.51562 7.80965 3.58073C7.93575 3.64583 8.00293 3.77865 8.00293 3.91146V4.25781C8.31573 4.32292 8.59714 4.47917 8.81514 4.69792C9.03315 4.91667 9.18663 5.19271 9.24822 5.5L9.31072 5.85156C9.34211 6 9.31072 6.14583 9.21774 6.25521C9.12475 6.36458 8.99866 6.42969 8.87256 6.42969H8.7789C8.6528 6.42969 8.5267 6.39323 8.43372 6.32812C8.34073 6.26302 8.27894 6.15365 8.27894 6.04427C8.27894 5.91146 8.24755 5.77865 8.18596 5.66927C8.12437 5.5599 8.03138 5.48177 7.9384 5.41667C7.84541 5.35156 7.73683 5.31511 7.62633 5.31511C7.51584 5.31511 7.40534 5.31511 7.29966 5.35156C7.19398 5.38802 7.10099 5.46615 7.0394 5.57552C6.97781 5.6849 6.94642 5.81771 6.94642 5.95052C6.94642 6.11979 7.0394 6.28906 7.19398 6.39844C7.34856 6.50781 7.52776 6.58594 7.72456 6.65104C7.92136 6.71615 8.11816 6.78125 8.31496 6.86458C8.51177 6.94792 8.68775 7.08073 8.84234 7.23958C8.99692 7.39844 9.0899 7.59375 9.0899 7.82552C9.0899 8.05729 9.02831 8.27604 8.90221 8.45833C8.77612 8.64062 8.59991 8.78646 8.39172 8.88281C8.18352 8.97917 7.95012 9.02865 7.71894 9.01562V9.33073C7.71894 9.46354 7.65176 9.59635 7.52566 9.66146C7.39957 9.72656 7.24238 9.72656 7.11628 9.66146C6.99019 9.59635 6.923 9.46354 6.923 9.33073V9.01562C6.64159 8.96615 6.38157 8.83854 6.17915 8.64062C5.97673 8.44271 5.84504 8.17969 5.81365 7.89062L5.77796 7.52083C5.77796 7.375 5.80936 7.22917 5.90234 7.11979C5.99533 7.01042 6.12142 6.94531 6.24752 6.94531H6.34051C6.46661 6.94531 6.59271 7.01042 6.65429 7.07552C6.71588 7.14062 6.77747 7.25 6.77747 7.35938C6.77747 7.52865 6.83905 7.6849 6.96515 7.79427C7.09125 7.90365 7.25142 7.95312 7.41161 7.95312C7.57179 7.95312 7.71427 7.90365 7.82476 7.82031C7.93526 7.73698 7.99685 7.60417 7.99685 7.46875C7.99685 7.30729 7.90386 7.16146 7.74928 7.05208C7.59469 6.94271 7.4155 6.85938 7.22429 6.79427C7.03308 6.72917 6.83627 6.65104 6.63947 6.5599C6.44267 6.46875 6.25146 6.3125 6.09688 6.13021C5.9423 5.94792 5.84931 5.71615 5.84931 5.45312C5.84931 5.15104 5.95981 4.88802 6.12559 4.66927C6.29137 4.45052 6.53719 4.30469 6.80421 4.23958V3.91146C6.80421 3.77865 6.87139 3.64583 6.99749 3.58073C7.12359 3.51562 7.28077 3.51562 7.40687 3.58073H7.40028Z" fill="#20A17F"/>
                              <path fillRule="evenodd" clipRule="evenodd" d="M4.28708 12.8073C4.48388 12.7422 4.65546 12.6016 4.74845 12.4193C4.84143 12.237 4.84143 12.0234 4.77984 11.8151L4.05498 9.23438C4.02359 9.13802 3.9306 9.07292 3.83762 9.07292H3.80622C3.69073 9.07292 3.61834 9.17187 3.65463 9.28125L4.37949 11.862C4.41089 11.9583 4.38429 12.0547 4.31709 12.1328C4.25551 12.2109 4.16253 12.2474 4.06954 12.2474C4.00795 12.2474 3.94636 12.2292 3.90016 12.1927L3.86877 12.1745C3.79238 12.1328 3.74559 12.0547 3.74559 11.9583L3.03553 9.375C3.03553 9.33333 2.97394 9.29167 2.93016 9.29167H2.89876C2.82717 9.29167 2.76558 9.35156 2.76558 9.42708L3.49044 12.0078C3.59822 12.362 3.96761 12.5964 4.32874 12.5964C4.30294 12.5964 4.30294 12.5964 4.28708 12.5964C4.28708 12.737 4.28708 12.8073 4.28708 12.8073ZM9.79404 12.3307C9.79404 12.3307 9.72685 12.3307 9.69546 12.2891C9.66407 12.2474 9.65848 12.1953 9.69546 12.1536L10.9995 10.7031C11.0309 10.6615 11.0309 10.6615 11.0309 10.6198C11.0309 10.5781 10.9995 10.5365 10.9681 10.5365L9.72126 9.96094C9.68987 9.94792 9.68428 9.91146 9.68428 9.88802C9.68428 9.86458 9.70008 9.82812 9.72687 9.81511L9.74268 9.8099C9.78486 9.79688 9.82184 9.80469 9.85324 9.83594L11.1573 11.4609C11.1887 11.5026 11.1887 11.5547 11.1573 11.5964L9.88546 12.3307C9.85407 12.3724 9.82268 12.3724 9.79128 12.3724L9.79404 12.3307Z" fill="#20A17F"/>
                            </svg>
                          ) : (
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                              <path fillRule="evenodd" clipRule="evenodd" d="M8 14.5C11.5899 14.5 14.5 11.5899 14.5 8C14.5 4.41015 11.5899 1.5 8 1.5C4.41015 1.5 1.5 4.41015 1.5 8C1.5 11.5899 4.41015 14.5 8 14.5ZM5.22222 5.40741C5.22222 5.40741 5.91134 7.92593 5.91134 8C5.91134 8.07407 5.22222 10.5926 5.22222 10.5926H6.59259C6.59259 10.5926 7.43024 8.07407 7.43024 8C7.43024 7.92593 6.59259 5.40741 6.59259 5.40741H5.22222ZM9.40741 5.40741C9.40741 5.40741 8.5687 7.92593 8.5687 8C8.5687 8.07407 9.40741 10.5926 9.40741 10.5926H10.7778C10.7778 10.5926 10.0887 8.07407 10.0887 8C10.0887 7.92593 10.7778 5.40741 10.7778 5.40741H9.40741Z" fill="#00964A"/>
                            </svg>
                          )}
                          <div className="flex flex-col">
                            <span className={cn(isFastest ? "font-bold" : "")}>{model.name}</span>
                            {responseTime !== undefined && (
                              <span className="text-xs text-foreground-muted">{t('ai_chat.avg_response_time', {time: responseTime})}</span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          {isRecommended && (
                            <span className="text-xs bg-primary-100 dark:bg-primary-800 text-primary-600 dark:text-primary-300 px-1.5 py-0.5 rounded">
                              {isFastest ? t('ai_chat.model_fastest') : t('ai_chat.model_recommended')}
                            </span>
                          )}
                          {responseTime !== undefined && (
                            <span className="text-lg" title={t('ai_chat.avg_response_time_title', {time: responseTime})}>
                              {performanceIcon}
                            </span>
                          )}
                        </div>
                      </div>
                    </motion.button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => createNewSession()}
            className="text-foreground-muted hover:text-foreground flex items-center gap-1"
          >
            <Plus size={16} />
            <span className="hidden sm:inline">{t('ai_chat.new_chat')}</span>
          </Button>
        </div>
      </motion.div>

      {/* 消息区域 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {!currentSession || currentSession.messages.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center py-12"
          >
            <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <MessageSquare className="text-white" size={32} />
            </div>
            <h3 className="text-xl font-medium text-foreground mb-3">
              {t('ai_chat.title')}
            </h3>
            <p className="text-foreground-muted mb-8 max-w-lg mx-auto">
              {t('ai_chat.welcome_message')}
            </p>
            
            {/* 专业领域展示 */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-2xl mx-auto">
              {Object.entries(t('ai_chat.expertise_areas', { returnObjects: true }) as Record<string, string>).slice(0, 6).map(([key, value]) => (
                <motion.button
                  key={key}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: Number(key) * 0.05 }}
                  onClick={() => setInputMessage(`请介绍一下${value}的相关内容`)}
                  className="p-4 text-sm bg-background hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-xl text-left transition-colors duration-200 border border-border hover:border-primary-300 group"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 group-hover:bg-primary-200 transition-colors">
                      <Zap size={16} />
                    </div>
                    <span className="text-foreground font-medium">{value}</span>
                  </div>
                  <p className="text-xs text-foreground-muted pl-[52px]">
                    {t('ai_chat.click_to_consult', { area: value })}
                  </p>
                </motion.button>
              ))}
            </div>
            
            <div className="mt-8 text-sm text-foreground-muted">
              <p>{t('ai_chat.direct_input_hint')}</p>
            </div>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {currentSession?.messages?.map(renderMessage)}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* 错误提示 */}
      {currentError && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
          className="p-3 mx-4 mb-1 bg-error-50 dark:bg-error-900/20 text-error-600 dark:text-error-400 text-sm rounded-md flex items-center gap-2"
        >
          <XCircle size={16} className="flex-shrink-0" />
          <div className="flex-1">
            {currentError}
          </div>
          <button 
            onClick={() => setError(null)}
            className="p-1 hover:bg-error-100 dark:hover:bg-error-800/50 rounded-full"
          >
            <XCircle size={14} />
          </button>
        </motion.div>
      )}

      {/* 输入区域 */}
      <div className="p-4 border-t border-border">
        <div className="relative">
          <Textarea 
            ref={textareaRef}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={t('ai_chat.placeholder') || '请输入您的问题...'}
            className="pr-16 resize-none min-h-[60px] max-h-[200px] placeholder:text-neutral-400 dark:placeholder:text-neutral-500"
            disabled={isLoading}
          />
          
          <div className="absolute right-2 bottom-2 flex items-center gap-1">
            <Button 
              type="button" 
              variant="ghost" 
              size="icon" 
              disabled={isLoading}
              className="rounded-full w-8 h-8"
              onClick={handleVoiceInput}
            >
              {isRecording ? <MicOff size={18} className="text-error-600" /> : <Mic size={18} />}
            </Button>
            
            <Button 
              type="button" 
              disabled={!inputMessage.trim() || isLoading}
              onClick={handleSendMessage}
              className="rounded-full w-8 h-8 bg-primary-500 text-white hover:bg-primary-600 disabled:opacity-50"
            >
              <Send size={16} />
            </Button>
          </div>
        </div>
        
        <div className="flex justify-between items-center mt-2 text-xs text-foreground-muted">
          <div>
            <p>{t('ai_chat.footer_description')}</p>
          </div>
          <div>
            <p>{t('ai_chat.footer_provider')}</p>
          </div>
        </div>
      </div>
    </Card>
  );
}
