import React, { useState, useEffect, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

// 定义图片路径
const logoImages = [
  '/assets/images/colorful-a-logos/4e6b2617027479935bf1b7784ea5fda6.png', // 紫色A
  '/assets/images/colorful-a-logos/0dd4e7a645d39d47a1a37edbea1903a6.png', // 红色A
  '/assets/images/colorful-a-logos/f14b90310c75515811ea373edd51317e.png', // 绿色A
  '/assets/images/colorful-a-logos/b8aa7ded0d232cbb1927a4b96950a01b.png', // 橙色A
  '/assets/images/colorful-a-logos/8cc34242080cef98b02f02eaeeb5688a.png', // 黄色A
  '/assets/images/colorful-a-logos/04d54a35c3aa502601ee949629703971.png', // 青色A
  '/assets/images/colorful-a-logos/1e569cd5f45203b861823cafd46b01c3.png', // 蓝色A
  '/assets/images/colorful-a-logos/c8c215033b0ab701f198b4520348c12f.png', // 粉色A
];

// 统一加载组件的属性接口
export interface UnifiedLoaderProps {
  // 显示控制
  show?: boolean;
  
  // 显示模式
  variant?: 'inline' | 'fullscreen' | 'page' | 'cover';
  
  // 尺寸配置
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  
  // 文本配置
  text?: string;
  subText?: string;
  
  // 自定义样式
  className?: string;
  
  // 加载完成回调
  onComplete?: () => void;
  
  // 最小持续时间（毫秒）
  minDuration?: number;
  
  // 是否显示进度条
  showProgress?: boolean;
  
  // 自定义进度值（0-100）
  progress?: number;
  
  // 背景配置
  background?: 'blur' | 'solid' | 'none';
}

export function UnifiedLoader({ 
  show = true,
  variant = 'inline',
  size = 'md',
  text,
  subText = variant === 'page' || variant === 'fullscreen' ? '蕾奥AI正在为您思考...' : undefined,
  className,
  onComplete,
  minDuration = 1500,
  showProgress = variant === 'cover',
  progress: customProgress,
  background = variant === 'fullscreen' ? 'blur' : variant === 'page' ? 'solid' : 'none',
}: UnifiedLoaderProps) {
  const [isVisible, setIsVisible] = useState(show);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  
  // 尺寸类配置
  const sizesConfig = {
    xs: { logo: 'w-6 h-6', dots: 1, dotsCount: 3, dotsRadius: 15 },
    sm: { logo: 'w-10 h-10', dots: 1.5, dotsCount: 4, dotsRadius: 20 },
    md: { logo: 'w-16 h-16', dots: 2, dotsCount: 5, dotsRadius: 25 },
    lg: { logo: 'w-24 h-24', dots: 2.5, dotsCount: 5, dotsRadius: 30 },
    xl: { logo: 'w-32 h-32', dots: 3, dotsCount: 6, dotsRadius: 35 },
  };
  
  // 背景样式配置
  const backgroundClasses = {
    blur: 'bg-background/80 backdrop-blur-sm',
    solid: 'bg-white dark:bg-slate-900',
    none: ''
  };
  
  // 处理最小持续时间逻辑
  useEffect(() => {
    if (!show && variant !== 'inline') {
      const timer = setTimeout(() => {
        setIsVisible(false);
        if (onComplete) onComplete();
      }, minDuration);
      
      return () => clearTimeout(timer);
    } else {
      setIsVisible(show);
    }
  }, [show, minDuration, onComplete, variant]);
  
  // 图片静态切换（无旋转/闪烁特效），每 250ms 切换一次
  useEffect(() => {
    if (!show) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % logoImages.length);
    }, 250);
    
    return () => {
      clearInterval(interval);
    };
  }, [show]);
  
  // 进度条模拟
  useEffect(() => {
    if (!showProgress || !show) return;
    
    // 如果有自定义进度，使用自定义进度
    if (customProgress !== undefined) {
      setProgress(customProgress);
      return;
    }
    
    let interval: number;
    
    // 快速进行到 70%
    interval = window.setInterval(() => {
      setProgress(prev => {
        if (prev >= 70) {
          clearInterval(interval);
          return prev;
        }
        return Math.min(70, prev + Math.random() * 5);
      });
    }, 200);
    
    // 5秒后自动完成
    const timeoutId = window.setTimeout(() => {
      clearInterval(interval);
      setProgress(100);
    }, 5000);
    
    return () => {
      clearTimeout(timeoutId);
      clearInterval(interval);
    };
  }, [show, showProgress, customProgress]);
  
  // 渲染白色旋转点
  const renderDots = () => {
    const { dots, dotsCount, dotsRadius } = sizesConfig[size];
    
    return [...Array(dotsCount)].map((_, index) => (
      <motion.div
        key={index}
        className={`absolute bg-white rounded-full`}
        style={{
          width: `${dots}px`,
          height: `${dots}px`,
          top: '50%',
          left: '50%',
          marginTop: `-${dots/2}px`,
          marginLeft: `-${dots/2}px`,
          transformOrigin: `${dotsRadius}px 0px` // 动态调整旋转半径
        }}
        animate={{
          rotate: [0 + (index * (360 / dotsCount)), 360 + (index * (360 / dotsCount))],
          opacity: [0.7, 0.9, 0.7]
        }}
        transition={{
          rotate: {
            duration: 3,
            repeat: Infinity,
            ease: "linear"
          },
          opacity: {
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          },
          delay: index * 0.1
        }}
      />
    ));
  };
  
  // 彩色A Logo渲染（移除旋转/闪烁/白点等动画，仅静态切换图片）
  const renderColorfulALogo = () => {
    return (
      <div className="relative h-full w-full flex items-center justify-center">
        <div className="relative h-full w-full">
          <div className="absolute inset-0 bg-white/90 dark:bg-white/80 rounded-full flex items-center justify-center shadow-md"></div>
          <img
            src={logoImages[currentImageIndex]}
            alt="蕾奥AI Logo"
            className="absolute inset-0 w-full h-full object-contain relative z-10"
          />
        </div>
      </div>
    );
  };
  
  // 内联加载器
  if (variant === 'inline') {
    if (!show) return null;
    
    return (
      <motion.div 
        className={cn(
          'flex flex-col items-center justify-center', 
          className
        )}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className={cn(sizesConfig[size].logo)}>
          {renderColorfulALogo()}
        </div>
        
        {text && (
          <motion.div 
            className="text-center mt-4"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <p className="text-sm font-medium text-foreground">{text}</p>
            {subText && (
              <p className="text-xs text-foreground-muted mt-1">{subText}</p>
            )}
          </motion.div>
        )}
      </motion.div>
    );
  }
  
  // 全屏加载器（模态框风格）
  if (variant === 'fullscreen') {
    return (
      <AnimatePresence>
        {isVisible && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={cn(
              "fixed inset-0 z-50 flex flex-col items-center justify-center",
              backgroundClasses[background],
              className
            )}
          >
            <div className={cn(sizesConfig[size].logo, "mb-8")}>
              {renderColorfulALogo()}
            </div>
            
            {(text || subText) && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-center"
              >
                {text && (
                  <p className="text-lg font-medium text-foreground mb-2">
                    {text}
                  </p>
                )}
                {subText && (
                  <p className="text-sm text-foreground-muted">
                    {subText}
                  </p>
                )}
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
  
  // 页面加载器（应用初始化加载）
  if (variant === 'page') {
    return (
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className={cn(
              "fixed inset-0 flex flex-col items-center justify-center z-50",
              backgroundClasses[background],
              "overflow-hidden",
              className
            )}
          >
            <div className={cn(sizesConfig[size].logo, "mb-6")}>
              {renderColorfulALogo()}
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
                {text || '蕾奥AI'}
              </motion.h1>
              <motion.p
                className="mt-2 text-base text-neutral-500 dark:text-neutral-400"
                animate={{ opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              >
                {subText || '专业AI投资顾问'}
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }
  
  // 带进度条的覆盖加载器
  if (variant === 'cover') {
    return (
      <AnimatePresence>
        {isVisible && (
          <motion.div 
            className={cn(
              "fixed inset-0 z-50 flex flex-col items-center justify-center",
              backgroundClasses[background],
              className
            )}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className={cn(sizesConfig[size].logo, "mb-8")}>
              {renderColorfulALogo()}
            </div>
            <h1 
              className="text-2xl font-bold text-primary-600 dark:text-primary-400"
            >
              {text || '蕾奥AI'}
            </h1>
            <p
              className="mt-2 text-base text-neutral-500 dark:text-neutral-400"
            >
              {subText || '专业AI投资顾问'}
            </p>
            
            {showProgress && (
              <div className="w-64 h-1 bg-neutral-200 dark:bg-neutral-700 rounded-full mt-8 overflow-hidden">
                <motion.div 
                  className="h-full bg-primary-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ ease: "easeInOut" }}
                />
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    );
  }
  
  // 默认返回内联加载器
  return null;
}

// 懒加载版本
export const LazyUnifiedLoader = lazy(() => 
  Promise.resolve({ default: UnifiedLoader })
);

// 包装懒加载版本的组件
export function UnifiedLoaderLazy(props: UnifiedLoaderProps) {
  return (
    <Suspense fallback={null}>
      <LazyUnifiedLoader {...props} />
    </Suspense>
  );
}