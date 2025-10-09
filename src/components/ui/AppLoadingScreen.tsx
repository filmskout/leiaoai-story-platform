import React, { useState, useEffect } from 'react';
import { FullScreenColorfulALoader } from './FullScreenColorfulALoader';
import { useTranslation } from 'react-i18next';

interface AppLoadingScreenProps {
  isVisible: boolean;
  onComplete?: () => void;
  minimumDuration?: number;
}

export function AppLoadingScreen({ 
  isVisible, 
  onComplete, 
  minimumDuration = 1500 
}: AppLoadingScreenProps) {
  const { t } = useTranslation();
  const [progress, setProgress] = useState(0);
  const [canComplete, setCanComplete] = useState(false);

  useEffect(() => {
    if (!isVisible) return;

    // 模拟加载进度
    const progressTimer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressTimer);
          return 100;
        }
        // 非线性进度增长，开始快，后面慢
        const increment = prev < 50 ? Math.random() * 15 + 10 : Math.random() * 5 + 2;
        return Math.min(prev + increment, 100);
      });
    }, 150);

    // 最小显示时间
    const minDurationTimer = setTimeout(() => {
      setCanComplete(true);
    }, minimumDuration);

    return () => {
      clearInterval(progressTimer);
      clearTimeout(minDurationTimer);
    };
  }, [isVisible, minimumDuration]);

  // 当进度完成且达到最小时间时，触发完成回调
  useEffect(() => {
    if (progress >= 100 && canComplete && onComplete) {
      setTimeout(onComplete, 300); // 稍微延迟一下让动画完成
    }
  }, [progress, canComplete, onComplete]);

  return (
    <FullScreenColorfulALoader 
      show={isVisible} 
      text={t('loading.app', '正在加载应用...')}
      onComplete={() => {
        if (canComplete && onComplete) {
          onComplete();
        }
      }} 
    />
  );
}