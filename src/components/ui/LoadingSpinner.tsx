import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { ColorfulALoader } from '@/components/ui/ColorfulALoader';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
  color?: 'primary' | 'white' | 'secondary';
  variant?: 'spinner' | 'dots' | 'full';
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  text, 
  className,
  color = 'primary',
  variant = 'spinner'
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  const logoSizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-16 h-16',
    lg: 'w-24 h-24'
  };

  const colorClasses = {
    primary: 'border-primary-500 border-t-transparent',
    secondary: 'border-neutral-300 dark:border-neutral-700 border-t-transparent',
    white: 'border-white border-t-transparent'
  };

  // 统一使用彩色A+白点样式
  if (variant === 'full') {
    return (
      <motion.div 
        className={cn(
          'flex flex-col items-center justify-center', 
          className
        )}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className={cn(logoSizeClasses[size])}>
          <ColorfulALoader show={true} />
        </div>
        
        {text && (
          <motion.div 
            className="text-center mt-4"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <p className="text-sm font-medium text-foreground">{text}</p>
            <p className="text-xs text-foreground-muted mt-1">
              蕾奥AI正在为您思考...
            </p>
          </motion.div>
        )}
      </motion.div>
    );
  }
  
  // 点动画
  if (variant === 'dots') {
    return (
      <div className={cn('flex items-center space-x-1', className)}>
        {[1, 2, 3].map((_, index) => (
          <motion.div 
            key={index}
            className={cn(
              'rounded-full bg-primary-500',
              size === 'sm' ? 'w-1.5 h-1.5' : size === 'md' ? 'w-2 h-2' : 'w-2.5 h-2.5'
            )}
            animate={{ y: ['0%', '-50%', '0%'] }}
            transition={{
              duration: 0.5,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: index * 0.1,
            }}
          />
        ))}
        {text && <span className="ml-2 text-sm text-foreground-muted">{text}</span>}
      </div>
    );
  }

  // 标准旋转器
  return (
    <div className={cn('flex flex-col items-center justify-center', className)}>
      <div 
        className={cn(
          'animate-spin rounded-full border-2', 
          sizeClasses[size],
          colorClasses[color]
        )}
      />
      {text && (
        <span className="mt-2 text-sm font-medium text-foreground-muted">{text}</span>
      )}
    </div>
  );
};

export { LoadingSpinner };