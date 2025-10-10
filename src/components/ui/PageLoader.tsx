import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ColorfulALoader } from './ColorfulALoader';

interface PageLoaderProps {
  show: boolean;
  onComplete?: () => void;
  minDuration?: number;
  text?: string;
}

export function PageLoader({ 
  show, 
  onComplete, 
  minDuration = 1500, // 最小持续时间（毫秒）
  text = '蕾奥AI' 
}: PageLoaderProps) {
  const [isVisible, setIsVisible] = useState(show);
  
  // 处理最小持续时间逻辑
  useEffect(() => {
    if (!show) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        if (onComplete) onComplete();
      }, minDuration);
      
      return () => clearTimeout(timer);
    } else {
      setIsVisible(true);
    }
  }, [show, minDuration, onComplete]);
  
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 flex flex-col items-center justify-center z-50 bg-white dark:bg-slate-900 overflow-hidden"
        >
          <div className="w-32 h-32 mb-6">
            <ColorfulALoader show={true} />
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-center"
          >
            <motion.h1 
              className="text-2xl font-bold text-primary-600 dark:text-primary-400"
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              {text}
            </motion.h1>
            <motion.p
              className="mt-2 text-base text-neutral-500 dark:text-neutral-400"
              animate={{ opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            >
              专业AI投资顾问
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}