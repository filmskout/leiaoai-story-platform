import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { ArrowDown, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ScrollToBottomButtonProps {
  className?: string;
  threshold?: number; // 显示按钮的滚动阈值（像素）
}

export function ScrollToBottomButton({ className, threshold = 200 }: ScrollToBottomButtonProps) {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      // 当距离底部超过阈值时显示按钮
      const distanceFromBottom = documentHeight - (scrollTop + windowHeight);
      setIsVisible(distanceFromBottom > threshold);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // 初始检查

    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]);

  const scrollToBottom = () => {
    // 滚动到页面底部的输入框
    const inputElement = document.querySelector('[data-scroll-target="input-bar"]');
    if (inputElement) {
      inputElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      // 如果找不到输入框，直接滚动到底部
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ duration: 0.2 }}
          className={cn(
            'fixed bottom-20 right-6 z-30',
            className
          )}
        >
          <Button
            onClick={scrollToBottom}
            size="lg"
            className="rounded-full w-14 h-14 bg-primary-500 hover:bg-primary-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 group"
          >
            <div className="flex flex-col items-center">
              <MessageSquare size={16} className="mb-0.5" />
              <ArrowDown size={14} className="group-hover:translate-y-0.5 transition-transform" />
            </div>
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}