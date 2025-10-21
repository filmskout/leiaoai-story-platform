import React, { useState, useRef, KeyboardEvent, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAI } from '@/contexts/AIContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Bot, ArrowRight, Sparkles, Send, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { UnifiedLoader } from '@/components/ui/UnifiedLoader';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface QuickAIChatInputProps {
  className?: string;
  onSubmit?: (message: string) => void;
}

export function QuickAIChatInput({ className, onSubmit }: QuickAIChatInputProps) {
  const { t, i18n } = useTranslation();
  const { selectedChatModel, setSelectedChatModel, modelConfigs } = useAI();
  const [inputMessage, setInputMessage] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const navigate = useNavigate();

  // 模拟AI响应的欢迎消息
  useEffect(() => {
    setResponse(t('ai_expert_greeting'));
  }, [t]);

  // 自动调整文本域高度
  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  };

  // 组件将监听模型变化事件
  useEffect(() => {
    const handleModelChange = (event: any) => {
      const { model } = event.detail;
      console.log(`模型变化事件触发，新模型: ${model}`);
      setSelectedChatModel(model);
    };

    window.addEventListener('model-changed', handleModelChange);
    return () => {
      window.removeEventListener('model-changed', handleModelChange);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputMessage(e.target.value);
    adjustTextareaHeight();
  };

  const handleSubmit = () => {
    if (inputMessage.trim() && !isLoading) {
      // 直接跳转到AI问答页面，并传递额外状态标志
      navigate(`/ai-chat`, {
        state: { autoAsk: true, question: inputMessage.trim() }
      });
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // 示例问题列表
  const sampleQuestions = [
    t('ai_chat.sample_questions.q1'),
    t('ai_chat.sample_questions.q2'),
    t('ai_chat.sample_questions.q3')
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn(
        'bg-card border rounded-xl p-4 shadow-sm transition-all duration-300',
        isFocused ? 'border-primary-300 dark:border-primary-700 shadow-md' : 'border-border',
        className
      )}
    >
      <div className="flex flex-col gap-3">
        {/* 头部 - 简化版本 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/50 rounded-full flex items-center justify-center">
              <Bot size={16} className="text-primary-600" />
            </div>
            <h3 className="text-md font-medium text-foreground">{t('quick_ai_consultation_title')}</h3>
          </div>
          
            {/* 模型选择组件 */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="text-xs bg-primary-200/90 dark:bg-primary-600/50 backdrop-blur-sm rounded-md border border-primary-300 dark:border-primary-500 p-1.5 flex items-center gap-1 cursor-pointer hover:bg-primary-300 hover:border-primary-400 hover:text-primary-900 dark:hover:bg-primary-500 dark:hover:text-white transition-colors shadow-sm">
                  <span className="hidden md:inline">{i18n.language.startsWith('zh') ? 
                    selectedChatModel === 'openai' ? 'OpenAI' : 
                    selectedChatModel === 'qwen' ? '通义千问' : 
                    'DeepSeek' 
                  : 
                    selectedChatModel === 'openai' ? 'OpenAI' : 
                    selectedChatModel === 'qwen' ? 'Qwen' : 
                    'DeepSeek'
                  }</span>
                  <Sparkles size={14} className="text-primary-500" />
                  <ChevronDown size={14} className="text-primary-500" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-primary-100 dark:bg-primary-800/90 border-primary-300 dark:border-primary-700 shadow-lg backdrop-blur-md">
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

        {/* AI响应区域 - 压缩版本 */}
        <div className="h-[120px] overflow-hidden rounded-lg bg-background-secondary border border-border flex items-center justify-center">
          {isLoading ? (
            <div className="flex items-center justify-center w-full h-full">
              <UnifiedLoader 
                size="md" 
                variant="inline"
                loaderStyle="spinner"
                text={t('ai_chat.processing')}
              />
            </div>
          ) : response ? (
            <div className="w-full h-full p-4 overflow-y-auto">
              <div className="text-foreground text-sm leading-relaxed">
                {response}
              </div>
            </div>
          ) : (
            <div className="text-center text-foreground-muted">
              <div className="text-sm">
                {t('ai_chat.placeholder_response', '询问投资相关问题，获得专业AI建议')}
              </div>
            </div>
          )}
        </div>
        
        {/* 输入区域 */}
        <div className="relative">
          <Textarea
            ref={textareaRef}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={t('ai_chat.placeholder')}
            className="resize-none min-h-[60px] pr-12 transition-all duration-200 focus:border-primary-300 focus:ring-primary-300"
            disabled={isLoading}
          />
          <Button
            type="submit"
            size="sm"
            onClick={handleSubmit}
            disabled={!inputMessage.trim() || isLoading}
            className="absolute right-2 top-2 h-8 w-8 p-0 bg-orange-500 hover:bg-orange-600 text-white shadow-lg"
          >
            {isLoading ? (
              <div className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
            ) : (
              <Send size={14} />
            )}
          </Button>
        </div>
        
        {/* 示例问题 */}
        <div className="flex flex-wrap gap-2">
          {sampleQuestions.map((question, index) => (
            <button
              key={index}
              onClick={() => {
                setInputMessage(question);
                if (textareaRef.current) {
                  textareaRef.current.focus();
                }
                adjustTextareaHeight();
              }}
              className="inline-flex items-center gap-1 px-3 py-1 text-xs rounded-full bg-background-secondary border border-border hover:border-primary-300 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all duration-200"
            >
              <Sparkles size={10} className="text-primary-500" />
              {question}
            </button>
          ))}
        </div>
        
        {/* 底部 */}
        <div className="pt-1 text-center">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-primary-600 hover:text-primary-700 text-xs h-6 px-2"
            onClick={() => navigate('/ai-chat')}
          >
            {t('view_complete_ai_chat')} <ArrowRight size={12} className="ml-1" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
