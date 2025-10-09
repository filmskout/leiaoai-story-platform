import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ColorfulALoader } from './ColorfulALoader';
import { cn } from '@/lib/utils';

interface FullScreenColorfulALoaderProps {
  show: boolean;
  text?: string;
  onComplete?: () => void;
  className?: string;
}

export function FullScreenColorfulALoader({ 
  show, 
  text = '加载中...', 
  onComplete,
  className 
}: FullScreenColorfulALoaderProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className={cn(
            "fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm",
            className
          )}
        >
          <div className="relative w-24 h-24 mb-8">
            <ColorfulALoader show={true} onComplete={onComplete} />
          </div>
          
          {text && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center"
            >
              <p className="text-lg font-medium text-foreground mb-2">
                {text}
              </p>
              <p className="text-sm text-foreground-muted">
                蕾奥AI正在为您准备数据...
              </p>
            </motion.div>
          )}
          
          {/* 颜色渐变底部装饰条 */}
          <motion.div 
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
            animate={{
              y: [0, 5, 0]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <div className="h-1 w-48 bg-gradient-to-r from-primary-300 via-primary-500 to-primary-300 rounded-full opacity-70" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
