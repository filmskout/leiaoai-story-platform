import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Mic, MicOff, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface FixedInputBarProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  isLoading?: boolean;
  isRecording?: boolean;
  onVoiceInput?: () => void;
  className?: string;
  onQuestionSelect?: (question: string) => void;
}

export function FixedInputBar({ 
  value, 
  onChange, 
  onSend, 
  isLoading = false,
  isRecording = false,
  onVoiceInput,
  onQuestionSelect,
  className 
}: FixedInputBarProps) {
  const { t } = useTranslation();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // 自动调整文本域高度
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [value]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  const sampleQuestions = [
    t('ai_chat.sample_questions.q1', '请分析当前股市的投资机会'),
    t('ai_chat.sample_questions.q2', '创业公司如何进行A轮融资？'),
    t('ai_chat.sample_questions.q3', '什么是ESG投资策略？')
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn(
        'fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-md border-t border-border z-40',
        className
      )}
    >
      <div className="container-custom py-4">
        <div className="max-w-4xl mx-auto">
          {/* 快速问题建议 - 仅在输入框为空时显示 */}
          {!value.trim() && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-4"
            >
              <div className="flex flex-wrap gap-2 justify-center">
                {sampleQuestions.map((question, index) => (
                  <motion.button
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2, delay: index * 0.1 }}
                    onClick={() => onChange(question)}
                    className="px-3 py-2 text-sm bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded-full hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors duration-200 flex items-center gap-2"
                  >
                    <Zap size={14} />
                    {question}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* 主输入区域 */}
          <div className="relative bg-background rounded-xl border border-border shadow-lg p-4">
            <Textarea 
              ref={textareaRef}
              value={value}
              onChange={(e) => onChange(e.target.value)}
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
                disabled={!value.trim() || isLoading}
                onClick={onSend}
                className="rounded-full w-10 h-10 bg-primary-500 text-white hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send size={16} />
              </Button>
            </div>
            
            {/* 底部信息 */}
            <div className="flex justify-between items-center mt-3 text-xs text-foreground-muted">
              <div>
                <p>{t('ai_chat.footer_description')}</p>
              </div>
              <div>
                <p>{t('ai_chat.footer_provider')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}