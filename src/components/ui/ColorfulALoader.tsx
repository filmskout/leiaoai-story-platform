import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ColorfulALoaderProps {
  show: boolean;
  onComplete?: () => void;
}

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

export function ColorfulALoader({ show, onComplete }: ColorfulALoaderProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(true);
  const animationDuration = 3000; // 总动画时长

  // 图片切换效果
  useEffect(() => {
    if (!show) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % logoImages.length);
    }, 200); // 每200ms切换一次图片

    const timer = setTimeout(() => {
      setIsAnimating(false);
      if (onComplete) onComplete();
    }, animationDuration);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [show, onComplete]);

  if (!show) return null;

  return (
    <div className="relative h-full w-full flex items-center justify-center">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ 
          scale: [0.5, 1.2, 1.0],
          opacity: 1
        }}
        transition={{
          duration: 0.5,
          repeat: 0,
        }}
        className="relative h-full w-full flex items-center justify-center"
      >
        {/* 固定大小的logo容器，不受主题影响 */}
        <img 
          src={logoImages[currentImageIndex]} 
          alt="AI Logo" 
          className="w-full h-full object-contain"
        />
      </motion.div>
    </div>
  );
}