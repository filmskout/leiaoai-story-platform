import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ColorfulALoader } from '@/components/ui/ColorfulALoader';
import { useTheme } from '@/contexts/ThemeContext';

export function LoadingCover() {
  const [progress, setProgress] = useState(0);
  const { actualTheme } = useTheme();
  
  // 模拟进度更新
  useEffect(() => {
    let timeoutId: number;
    let interval: number;
    
    // 快速进行到 70%
    interval = window.setInterval(() => {
      setProgress(prev => {
        if (prev >= 70) {
          clearInterval(interval);
          return prev;
        }
        return prev + Math.random() * 5;
      });
    }, 200);
    
    // 5秒后自动完成
    timeoutId = window.setTimeout(() => {
      clearInterval(interval);
      setProgress(100);
    }, 5000);
    
    return () => {
      clearTimeout(timeoutId);
      clearInterval(interval);
    };
  }, []);
  
  // 白色点点组件 - 仅在夜间模式显示，且大于logo
  const renderDots = () => {
    if (actualTheme === 'light') return null;
    
    return [...Array(6)].map((_, index) => (
      <motion.div
        key={index}
        className="absolute w-4 h-4 bg-white rounded-full"
        style={{
          top: '50%',
          left: '50%',
          transformOrigin: '0 0'
        }}
        animate={{
          x: [0, 60 * Math.cos((index * 60) * Math.PI / 180)],
          y: [0, 60 * Math.sin((index * 60) * Math.PI / 180)],
          opacity: [0.6, 1, 0.6]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
          delay: index * 0.1
        }}
      />
    ));
  };
  
  return (
    <motion.div 
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center transition-colors duration-500 ${
        actualTheme === 'light' 
          ? 'bg-background' 
          : 'bg-slate-900'
      }`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* 主要加载区域 */}
      <div className="relative flex items-center justify-center">
        {/* 夜间模式的白色点点 - 统一大小容器 */}
        <div className="relative w-40 h-40 flex items-center justify-center">
          {renderDots()}
          
          {/* 彩色A Logo - 固定大小，始终在中心 */}
          <div className="w-16 h-16 relative z-10">
            <ColorfulALoader show={true} />
          </div>
        </div>
      </div>
      
      {/* 进度条 */}
      <div className="w-64 h-1 bg-neutral-200 dark:bg-neutral-700 rounded-full mt-8 overflow-hidden">
        <motion.div 
          className="h-full bg-primary-500"
          style={{ width: `${progress}%` }}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ ease: "easeInOut" }}
        />
      </div>
    </motion.div>
  );
}