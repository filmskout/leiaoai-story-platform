import React from 'react';
import { UnifiedLoader, UnifiedLoaderProps } from './UnifiedLoader';

// 为旧的PageLoader组件提供兼容层
interface PageLoaderProps {
  show: boolean;
  onComplete?: () => void;
  minDuration?: number;
  text?: string;
}

export function PageLoader({ 
  show, 
  onComplete, 
  minDuration = 1500, 
  text = '蕾奥AI' 
}: PageLoaderProps) {
  return (
    <UnifiedLoader 
      show={show}
      mode="page"
      onComplete={onComplete}
      minDuration={minDuration}
      text={text}
      subText="专业AI投资顾问"
    />
  );
}

// 为旧的LoadingSpinner组件提供兼容层
interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
  color?: 'primary' | 'white' | 'secondary';
  variant?: 'spinner' | 'dots' | 'full';
}

export function LoadingSpinner({ 
  size = 'md', 
  text, 
  className,
  color = 'primary',
  variant = 'spinner'
}: LoadingSpinnerProps) {
  // 将旧的size映射到新组件的size
  const sizeMap: Record<string, UnifiedLoaderProps['size']> = {
    'sm': 'sm',
    'md': 'md',
    'lg': 'lg'
  };
  
  // 如果是彩色A加载模式
  if (variant === 'full') {
    return (
      <UnifiedLoader 
        mode="inline"
        size={sizeMap[size]}
        text={text}
        className={className}
      />
    );
  }
  
  // 如果是点动画或标准spinner，保留原有行为
  // 注意：这些将仍然使用彩色A效果，但保留旧组件的布局和行为
  return (
    <UnifiedLoader 
      mode="inline"
      size={sizeMap[size]}
      text={text}
      className={className}
    />
  );
}

// 为旧的ColorfulALoader组件提供兼容层
interface ColorfulALoaderProps {
  show: boolean;
  onComplete?: () => void;
}

export function ColorfulALoader({ 
  show, 
  onComplete 
}: ColorfulALoaderProps) {
  return (
    <UnifiedLoader 
      show={show}
      mode="inline"
      size="md"
      onComplete={onComplete}
    />
  );
}

// 为旧的LoadingCover组件提供兼容层
export function LoadingCover() {
  return (
    <UnifiedLoader 
      mode="cover"
      showProgress={true}
      text="蕾奥AI"
      subText="专业AI投资顾问"
    />
  );
}

// 为旧的FullScreenColorfulALoader组件提供兼容层
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
    <UnifiedLoader 
      show={show}
      mode="fullscreen"
      text={text}
      subText="蕾奥AI正在为您准备数据..."
      onComplete={onComplete}
      className={className}
      background="blur"
    />
  );
}