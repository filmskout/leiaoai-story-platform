import React, { useState, useRef, KeyboardEvent, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAI } from '@/contexts/AIContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Bot, ArrowRight, Sparkles, Send, ChevronDown, Mic, MicOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { UnifiedLoader } from '@/components/ui/UnifiedLoader';
import { useMobileLayout } from '@/hooks/use-mobile';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// 语音识别类型声明
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onstart: (() => void) | null;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
}

interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  [index: number]: SpeechRecognitionResult;
  length: number;
}

interface SpeechRecognitionResult {
  [index: number]: SpeechRecognitionAlternative;
  length: number;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionErrorEvent {
  error: string;
}

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
  const [isRecording, setIsRecording] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const navigate = useNavigate();
  const isMobile = useMobileLayout();

  // 模拟AI响应的欢迎消息
  useEffect(() => {
    setResponse(t('ai_expert_greeting'));
  }, [t]);

  // 初始化语音识别
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        setIsSupported(true);
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'zh-CN,en-US'; // 支持中文和英文
        
        recognition.onstart = () => {
          setIsRecording(true);
        };
        
        recognition.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          setInputMessage(transcript);
          adjustTextareaHeight();
        };
        
        recognition.onerror = (event) => {
          console.error('语音识别错误:', event.error);
          setIsRecording(false);
        };
        
        recognition.onend = () => {
          setIsRecording(false);
        };
        
        recognitionRef.current = recognition;
      }
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

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

  // 语音识别处理
  const handleVoiceInput = () => {
    if (!isSupported || !recognitionRef.current) {
      console.warn('语音识别不支持');
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
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

        {/* AI响应区域 - 移动端压缩版本 */}
        <div className={cn(
          "overflow-hidden rounded-lg bg-background-secondary border border-border flex items-center justify-center",
          isMobile ? "h-[80px]" : "h-[120px]"
        )}>
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
            placeholder={isMobile ? "" : t('ai_chat.placeholder')}
            className="resize-none min-h-[60px] pr-20 transition-all duration-200 focus:border-primary-300 focus:ring-primary-300"
            disabled={isLoading}
          />
          
          {/* 麦克风按钮 */}
          {isSupported && (
            <Button
              type="button"
              size="sm"
              onClick={handleVoiceInput}
              disabled={isLoading}
              className={cn(
                "absolute right-10 top-2 h-8 w-8 p-0 transition-all duration-200",
                isRecording 
                  ? "bg-red-500 hover:bg-red-600 text-white animate-pulse" 
                  : "bg-gray-500 hover:bg-gray-600 text-white"
              )}
            >
              {isRecording ? <MicOff size={14} /> : <Mic size={14} />}
            </Button>
          )}
          
          {/* 发送按钮 */}
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
        
        {/* 示例问题 - 移动端优化布局 */}
        <div className={cn(
          "flex flex-wrap gap-2",
          isMobile ? "py-1" : "py-2"
        )}>
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
              className={cn(
                "inline-flex items-center gap-1 px-3 py-2 text-xs rounded-full bg-background-secondary border border-border hover:border-primary-300 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all duration-200",
                isMobile && "flex-1 min-w-0"
              )}
            >
              <Sparkles size={10} className="text-primary-500 flex-shrink-0" />
              <span className={cn(
                "truncate",
                isMobile && "text-xs leading-tight"
              )}>
                {question}
              </span>
            </button>
          ))}
        </div>
        
        {/* 底部 */}
        <div className="pt-2 text-center">
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
