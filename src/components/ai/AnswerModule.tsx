import React, { useRef, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAI } from '@/contexts/AIContext';
import { useAuth } from '@/contexts/AuthContext';
import { type ChatMessage } from '@/hooks/useAIChat';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { UnifiedLoader } from '@/components/ui/UnifiedLoader';
import { MarkdownRenderer } from '@/components/ui/MarkdownRenderer';
import { Textarea } from '@/components/ui/textarea';
import { 
  Bot, 
  User, 
  Settings, 
  MessageSquare,
  Clock,
  Download,
  RefreshCcw,
  InfoIcon,
  XCircle,
  Send,
  Mic,
  MicOff,
  Zap,
  FileText
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { formatMessagesToMarkdown, exportAsMarkdown, exportAsDocx } from '@/utils/exportUtils';
import { useMediaQuery } from '@/hooks/useMediaQuery';

interface AnswerModuleProps {
  messages: ChatMessage[];
  isLoading: boolean;
  error?: string | null;
  onClearError?: () => void;
  onRegenerateMessage?: (messageId: string) => void;
  className?: string;
  // 新增输入框相关属性
  inputMessage?: string;
  onInputChange?: (value: string) => void;
  onSendMessage?: () => void;
  isRecording?: boolean;
  onVoiceInput?: () => void;
  onQuestionSelect?: (question: string) => void;
}

export function AnswerModule({ 
  messages, 
  isLoading, 
  error, 
  onClearError,
  onRegenerateMessage,
  className,
  // 输入框相关属性
  inputMessage = '',
  onInputChange,
  onSendMessage,
  isRecording = false,
  onVoiceInput,
  onQuestionSelect
}: AnswerModuleProps) {
  const { t, i18n } = useTranslation();
  const { profile } = useAuth();
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  const {
    selectedChatModel,
    setSelectedChatModel,
    modelConfigs, 
    getModelResponseTime,
    getPerformanceIndicator,
    getSortedModels,
    getRecommendedModel
  } = useAI();
  
  const [showModelSelector, setShowModelSelector] = React.useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // 自动滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 自动调整文本域高度
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [inputMessage]);

  // 显示导出对话选项
  const [showExportOptions, setShowExportOptions] = useState(false);
  
  // 导出对话内容
  const handleExport = (format: 'md' | 'docx') => {
    if (!messages || messages.length === 0) return;
    
    const title = '蕾奥AI投资咨询对话记录';
    const markdown = formatMessagesToMarkdown(messages, title);
    
    if (format === 'md') {
      exportAsMarkdown(markdown);
    } else if (format === 'docx') {
      exportAsDocx(markdown);
    }
    
    // 关闭导出选项弹窗
    setShowExportOptions(false);
  };

  // 处理键盘事件
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (onSendMessage) {
        onSendMessage();
      }
    }
  };

  // 建议问题
  const sampleQuestions = [
    t('ai_chat.sample_questions.q1', '请分析当前股市的投资机会'),
    t('ai_chat.sample_questions.q2', '创业公司如何进行A轮融资？'),
    t('ai_chat.sample_questions.q3', '什么是ESG投资策略？')
  ];

  const renderMessage = (message: ChatMessage) => {
    const isUser = message.role === 'user';
    
    return (
      <motion.div
        key={message.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={cn(
          'w-full transition-all duration-200',
          isUser 
            ? 'bg-primary-50 dark:bg-primary-900/20 p-4' 
            : 'bg-neutral-50 dark:bg-neutral-800/50 p-4'
        )}
      >
        <div className="flex items-center gap-2 mb-3">
          <div className={cn(
            'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center',
            isUser 
              ? 'bg-primary-500 text-white' 
              : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300'
          )}>
            {isUser ? <User size={16} /> : <Bot size={16} />}
          </div>
          
          <span className="text-sm font-medium text-foreground">
            {isUser ? (profile?.full_name || profile?.username || t('user.profile')) : (
              i18n.language.startsWith('zh') ? '蕾奥君' : 'LeiaoAI Agent'
            )}
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
        
        <div className={cn(
          "prose max-w-none",
          isMobile ? "prose-sm" : "prose-sm",
          "dark:prose-invert"
        )}>
          {message.content && (
            <MarkdownRenderer 
              content={message.content} 
              className={cn(
                "text-foreground",
                isMobile ? "text-sm" : "text-sm"
              )}
            />
          )}
        </div>
        
        {!isUser && message.content && (
          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border">
            <div className="relative">
              <Button 
                variant="outline" 
                size="sm" 
                className="text-xs h-7 px-2"
                onClick={() => setShowExportOptions(prev => !prev)}
              >
                <Download size={14} className="mr-1" />
                {t('export')}
              </Button>
              
              {/* 导出选项弹窗 */}
              {showExportOptions && (
                <div className="absolute left-0 top-full mt-1 p-2 bg-background border border-border rounded-md shadow-lg z-10">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="flex items-center w-full mb-1"
                    onClick={() => handleExport('md')}
                  >
                    <FileText size={14} className="mr-2" />
                    <span>导出为 Markdown (.md)</span>
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="flex items-center w-full"
                    onClick={() => handleExport('docx')}
                  >
                    <FileText size={14} className="mr-2" />
                    <span>导出为 Word (.docx)</span>
                  </Button>
                </div>
              )}
            </div>
            
            {onRegenerateMessage && (
              <Button 
                variant="outline" 
                size="sm" 
                className="text-xs h-7 px-2"
                onClick={() => onRegenerateMessage(message.id)}
              >
                <RefreshCcw size={14} className="mr-1" />
                {t('regenerate')}
              </Button>
            )}
            <Button variant="ghost" size="sm" className="text-xs h-7 px-2 ml-auto text-foreground-muted">
              <InfoIcon size={14} className="mr-1" />
              {t('feedback')}
            </Button>
          </div>
        )}
      </motion.div>
    );
  };

  return (
    <div className={cn('w-full', className)}>
      {/* 模型选择器 */}
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-foreground">
          {i18n.language.startsWith('zh') ? '蕾奥君' : 'LeiaoAI Agent'}
        </h2>
        <div className="relative">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowModelSelector(!showModelSelector)}
            className="text-foreground-muted hover:text-foreground"
          >
            <Settings size={16} className="mr-1" />
            <span>{selectedChatModel}</span>
          </Button>
          
          {showModelSelector && (
            <div className="absolute right-0 top-full mt-2 w-64 bg-background border border-border shadow-lg rounded-lg z-50 overflow-hidden backdrop-blur-sm">
              <div className="p-3 bg-card/95">
                <h4 className="text-sm font-medium text-foreground mb-2 flex items-center gap-1">
                  <Bot size={14} className="text-primary-500" />
                  {t('ai_chat.select_model')}
                </h4>
                {getSortedModels().map((model) => {
                  const responseTime = getModelResponseTime(model.id);
                  const performanceIcon = getPerformanceIndicator(model.id);
                  const isRecommended = model.recommended || model.id === getRecommendedModel();
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
      </div>

      {/* 错误提示 */}
      {error && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
          className="p-3 mb-4 bg-error-50 dark:bg-error-900/20 text-error-600 dark:text-error-400 text-sm rounded-md flex items-center gap-2"
        >
          <XCircle size={16} className="flex-shrink-0" />
          <div className="flex-1">
            {error}
          </div>
          {onClearError && (
            <button 
              onClick={onClearError}
              className="p-1 hover:bg-error-100 dark:hover:bg-error-800/50 rounded-full"
            >
              <XCircle size={14} />
            </button>
          )}
        </motion.div>
      )}

      {/* 答案显示区域 */}
      <Card className={cn(
        "min-h-[200px] overflow-hidden shadow w-full",
        isMobile ? "rounded-none border-0 p-0" : "rounded-none border-0 p-0"
      )}>
        <div className={cn("", isMobile && "")}>
          {messages.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center py-12"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900/30 mx-auto mb-4">
                <MessageSquare className="text-primary-600" size={24} />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">
                {t('ai_chat.answer_placeholder')}
              </h3>
              <p className="text-foreground-muted">
                {t('ai_chat.direct_input_hint')}
              </p>
            </motion.div>
          ) : (
            <div className="space-y-4">
              {messages.map(renderMessage)}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex gap-3 p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 mr-8"
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center bg-neutral-200 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300">
                    <Bot size={18} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-medium text-foreground">
                        {i18n.language.startsWith('zh') ? '蕾奥君' : 'LeiaoAI Agent'}
                      </span>
                      <span className="text-xs px-2 py-1 bg-primary-100 dark:bg-primary-800 text-primary-600 dark:text-primary-300 rounded-full">
                        {selectedChatModel}
                      </span>
                      <span className="text-xs text-foreground-muted">
                        {new Date().toLocaleTimeString()}
                      </span>
                    </div>
                    {/* 线性进度条 */}
                    <div className="w-full py-4">
                      <div className="w-full h-2 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary-500 animate-[progress_1.5s_ease-in-out_infinite]"
                          style={{ width: '35%' }}
                        />
                      </div>
                      <div className="mt-2 text-xs text-foreground-muted">
                        {i18n.language.startsWith('zh') ? '正在生成详细回答…' : 'Generating a detailed response…'}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
        
        {/* 输入框区域 */}
        <div className="border-t border-border bg-card/50 p-4">
          {/* 主输入区域 */}
          <div className="relative bg-background rounded-xl border border-border shadow-sm p-4">
            <Textarea 
              ref={textareaRef}
              value={inputMessage}
              onChange={(e) => onInputChange && onInputChange(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={t('ai_chat.placeholder') || '请输入您的投资相关问题...'}
              className="pr-20 resize-none min-h-[60px] max-h-[200px] border-0 bg-transparent focus:ring-0 placeholder:text-neutral-400 dark:placeholder:text-neutral-500"
              disabled={isLoading}
            />
            
            <div className="absolute right-2 bottom-2 flex items-center gap-1">
              {onVoiceInput && (
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="icon" 
                  disabled={isLoading}
                  className="rounded-full w-10 h-10 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                  onClick={onVoiceInput}
                >
                  {isRecording ? (
                    <MicOff size={18} className="text-error-600" />
                  ) : (
                    <Mic size={18} className="text-neutral-500" />
                  )}
                </Button>
              )}
              
              <Button 
                type="button" 
                disabled={!inputMessage.trim() || isLoading}
                onClick={onSendMessage}
                className="rounded-full w-10 h-10 bg-orange-500 text-white hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                <Send size={16} />
              </Button>
            </div>
            
            {/* 底部信息 */}
            {!isMobile && (
              <div className="flex justify-between items-center mt-3 text-xs text-foreground-muted">
                <div>
                  <p>{t('footer_description')}</p>
                </div>
                <div className="mr-24"> {/* 增加右侧外边距，避免与按钮重叠 */}
                  <p>{t('footer_provider')}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}