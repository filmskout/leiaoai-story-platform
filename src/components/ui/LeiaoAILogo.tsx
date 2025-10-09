import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface LeiaoAILogoProps {
  className?: string;
  size?: number;
  animate?: boolean;
}

// 彩色调色板 - 蕾奥AI品牌色彩
const colorPalette = [
  '#0066FF', // 主蓝色
  '#00C896', // 青绿色
  '#FF6B35', // 橙色
  '#8B5CF6', // 紫色
  '#EF4444', // 红色
  '#F59E0B', // 黄色
  '#06B6D4', // 青色
  '#EC4899', // 粉色
];

export function LeiaoAILogo({ className, size = 40, animate = true }: LeiaoAILogoProps) {
  const [currentColors, setCurrentColors] = useState({
    primary: colorPalette[0],
    secondary: colorPalette[1],
    accent: colorPalette[2]
  });

  // 随机变换颜色
  const randomizeColors = () => {
    const shuffled = [...colorPalette].sort(() => Math.random() - 0.5);
    setCurrentColors({
      primary: shuffled[0],
      secondary: shuffled[1], 
      accent: shuffled[2]
    });
  };

  // 每0.25秒随机跳转颜色
  useEffect(() => {
    if (!animate) return;
    
    const interval = setInterval(() => {
      randomizeColors();
    }, 250); // 0.25秒

    return () => clearInterval(interval);
  }, [animate]);

  return (
    <motion.div 
      className={cn('flex items-center justify-center', className)}
      animate={animate ? {
        scale: [1, 1.05, 1],
        rotate: [0, 5, -5, 0]
      } : {}}
      transition={{
        duration: 0.6,
        repeat: animate ? Infinity : 0,
        ease: "easeInOut"
      }}
    >
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 100 100" 
        className="drop-shadow-md"
      >
        {/* 外圈 - 代表AI的无限可能 */}
        <motion.circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke={currentColors.primary}
          strokeWidth="3"
          strokeDasharray="10 5"
          animate={animate ? {
            strokeDashoffset: [0, -100],
            rotate: 360
          } : {}}
          transition={{
            strokeDashoffset: {
              duration: 2,
              repeat: Infinity,
              ease: "linear"
            },
            rotate: {
              duration: 3,
              repeat: Infinity,
              ease: "linear"
            }
          }}
          style={{ transformOrigin: '50px 50px' }}
        />

        {/* 中央的"A"字母 - 蕾奥AI核心 */}
        <motion.path
          d="M35 75 L50 25 L65 75 M40 60 L60 60"
          fill="none"
          stroke={currentColors.secondary}
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          animate={animate ? {
            strokeWidth: [4, 6, 4],
            opacity: [0.8, 1, 0.8]
          } : {}}
          transition={{
            duration: 0.8,
            repeat: animate ? Infinity : 0,
            ease: "easeInOut"
          }}
        />

        {/* 装饰性的几何元素 - 代表创新和智能 */}
        <motion.circle
          cx="75"
          cy="25"
          r="6"
          fill={currentColors.accent}
          animate={animate ? {
            scale: [1, 1.3, 1],
            opacity: [0.6, 1, 0.6]
          } : {}}
          transition={{
            duration: 0.4,
            repeat: animate ? Infinity : 0,
            ease: "easeInOut",
            delay: 0.1
          }}
        />
        
        <motion.rect
          x="20"
          y="20"
          width="8"
          height="8"
          rx="2"
          fill={currentColors.accent}
          animate={animate ? {
            rotate: [0, 90, 180, 270, 360],
            scale: [1, 0.8, 1]
          } : {}}
          transition={{
            duration: 1.2,
            repeat: animate ? Infinity : 0,
            ease: "easeInOut"
          }}
          style={{ transformOrigin: '24px 24px' }}
        />

        {/* 流动的数据点 */}
        {[0, 1, 2].map((index) => (
          <motion.circle
            key={index}
            cx="50"
            cy="50"
            r="2"
            fill={currentColors.primary}
            animate={animate ? {
              x: [0, 20 * Math.cos(index * 120 * Math.PI / 180), 0],
              y: [0, 20 * Math.sin(index * 120 * Math.PI / 180), 0],
              scale: [0, 1, 0]
            } : {}}
            transition={{
              duration: 1.5,
              repeat: animate ? Infinity : 0,
              ease: "easeInOut",
              delay: index * 0.2
            }}
          />
        ))}
      </svg>
    </motion.div>
  );
}

// 简化版本的logo（用于小尺寸显示）
export function LeiaoAILogoSimple({ className, size = 24, animate = true }: LeiaoAILogoProps) {
  const [currentColor, setCurrentColor] = useState(colorPalette[0]);

  useEffect(() => {
    if (!animate) return;
    
    const interval = setInterval(() => {
      setCurrentColor(colorPalette[Math.floor(Math.random() * colorPalette.length)]);
    }, 250);

    return () => clearInterval(interval);
  }, [animate]);

  return (
    <motion.div 
      className={cn('flex items-center justify-center', className)}
      animate={animate ? {
        rotate: [0, 360]
      } : {}}
      transition={{
        duration: 2,
        repeat: animate ? Infinity : 0,
        ease: "linear"
      }}
    >
      <svg width={size} height={size} viewBox="0 0 24 24">
        <motion.path
          d="M7 18 L12 6 L17 18 M9 14 L15 14"
          fill="none"
          stroke={currentColor}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          animate={animate ? {
            strokeWidth: [2.5, 3, 2.5]
          } : {}}
          transition={{
            duration: 0.5,
            repeat: animate ? Infinity : 0,
            ease: "easeInOut"
          }}
        />
        <motion.circle
          cx="12"
          cy="12"
          r="10"
          fill="none"
          stroke={currentColor}
          strokeWidth="1"
          strokeDasharray="4 2"
          opacity="0.3"
          animate={animate ? {
            rotate: 360
          } : {}}
          transition={{
            duration: 3,
            repeat: animate ? Infinity : 0,
            ease: "linear"
          }}
          style={{ transformOrigin: '12px 12px' }}
        />
      </svg>
    </motion.div>
  );
}