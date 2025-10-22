import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  Building, 
  BarChart3, 
  Globe, 
  DollarSign, 
  Rocket,
  PieChart,
  MapPin,
  FileCheck,
  Target,
  Calculator,
  Search,
  MessageSquare,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  RefreshCcw,
  ExternalLink,
  Loader2,
  Users
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './ExpertiseCards.module.css';
import { supabase } from '@/lib/supabase';
import { useMediaQuery } from '@/hooks/useMediaQuery';

interface ExpertiseArea {
  key: string;
  name: string;
  icon: any;
  color: string;
  bgColor: string;
  questions: string[];
}

interface ExpertiseCardsProps {
  className?: string;
  onQuestionSelect?: (question: string) => void;
}

export function ExpertiseCards({ className, onQuestionSelect }: ExpertiseCardsProps) {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [refreshKey, setRefreshKey] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const touchStartRef = useRef<number>(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [categoryStats, setCategoryStats] = useState<Record<string, number>>({});
  const [isHoveringCard, setIsHoveringCard] = useState(false);
  const [isQuestionClicked, setIsQuestionClicked] = useState(false);

  // 响应式设置 - 每页显示的卡片数量（桁面端3个，移动端1个）
  const [cardsPerPage, setCardsPerPage] = useState(3);
  
  // 生成随机的初始显示数字 (150-500) - 使用稳定的随机种子
  const getInitialDisplayCount = useCallback((categoryKey: string) => {
    // 使用category key生成稳定的随机数，确保每次刷新显示相同的数字
    let hash = 0;
    for (let i = 0; i < categoryKey.length; i++) {
      hash = ((hash << 5) - hash) + categoryKey.charCodeAt(i);
      hash = hash & hash; // Convert to 32bit integer
    }
    const seed = Math.abs(hash);
    const random = (seed % 351) + 150; // 150 to 500
    return random;
  }, []);

  // 专业领域配置
  const expertiseAreas: ExpertiseArea[] = [
    {
      key: 'cvc_investment',
      name: t('ai_chat.expertise_areas.cvc_investment'),
      icon: Building,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30',
      questions: t('ai_chat.expertise_questions.cvc_investment', { returnObjects: true }) as string[]
    },
    {
      key: 'ma_restructuring',
      name: t('ai_chat.expertise_areas.ma_restructuring'),
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900/30',
      questions: t('ai_chat.expertise_questions.ma_restructuring', { returnObjects: true }) as string[]
    },
    {
      key: 'ipo_a_share',
      name: t('ai_chat.expertise_areas.ipo_a_share'),
      icon: BarChart3,
      color: 'text-red-600',
      bgColor: 'bg-red-100 dark:bg-red-900/30',
      questions: t('ai_chat.expertise_questions.ipo_a_share', { returnObjects: true }) as string[]
    },
    {
      key: 'ipo_hk_share',
      name: t('ai_chat.expertise_areas.ipo_hk_share'),
      icon: Globe,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900/30',
      questions: t('ai_chat.expertise_questions.ipo_hk_share', { returnObjects: true }) as string[]
    },
    {
      key: 'ipo_us_share',
      name: t('ai_chat.expertise_areas.ipo_us_share'),
      icon: DollarSign,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100 dark:bg-indigo-900/30',
      questions: t('ai_chat.expertise_questions.ipo_us_share', { returnObjects: true }) as string[]
    },
    {
      key: 'spac_listing',
      name: t('ai_chat.expertise_areas.spac_listing'),
      icon: Rocket,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100 dark:bg-orange-900/30',
      questions: t('ai_chat.expertise_questions.spac_listing', { returnObjects: true }) as string[]
    },
    {
      key: 'macro_analysis',
      name: t('ai_chat.expertise_areas.macro_analysis'),
      icon: PieChart,
      color: 'text-teal-600',
      bgColor: 'bg-teal-100 dark:bg-teal-900/30',
      questions: t('ai_chat.expertise_questions.macro_analysis', { returnObjects: true }) as string[]
    },
    {
      key: 'investment_environment',
      name: t('ai_chat.expertise_areas.investment_environment'),
      icon: MapPin,
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-100 dark:bg-cyan-900/30',
      questions: t('ai_chat.expertise_questions.investment_environment', { returnObjects: true }) as string[]
    },
    {
      key: 'valuation_adjustment',
      name: t('ai_chat.expertise_areas.valuation_adjustment'),
      icon: FileCheck,
      color: 'text-pink-600',
      bgColor: 'bg-pink-100 dark:bg-pink-900/30',
      questions: t('ai_chat.expertise_questions.valuation_adjustment', { returnObjects: true }) as string[]
    },
    {
      key: 'exit_strategy',
      name: t('ai_chat.expertise_areas.exit_strategy'),
      icon: Target,
      color: 'text-amber-600',
      bgColor: 'bg-amber-100 dark:bg-amber-900/30',
      questions: t('ai_chat.expertise_questions.exit_strategy', { returnObjects: true }) as string[]
    },
    {
      key: 'valuation_model',
      name: t('ai_chat.expertise_areas.valuation_model'),
      icon: Calculator,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-100 dark:bg-emerald-900/30',
      questions: t('ai_chat.expertise_questions.valuation_model', { returnObjects: true }) as string[]
    },
    {
      key: 'due_diligence',
      name: t('ai_chat.expertise_areas.due_diligence'),
      icon: Search,
      color: 'text-violet-600',
      bgColor: 'bg-violet-100 dark:bg-violet-900/30',
      questions: t('ai_chat.expertise_questions.due_diligence', { returnObjects: true }) as string[]
    }
  ];

  // 计算总页数 - 根据每页卡片数量动态计算
  const totalPages = Math.ceil(expertiseAreas.length / cardsPerPage);
  const canGoPrevious = true; // 无限循环，总是可以向前
  const canGoNext = true; // 无限循环，总是可以向后
  
  // 实际的页面索引
  const actualPageIndex = currentIndex;

  // 响应式监听
  useEffect(() => {
    const updateCardsPerPage = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setCardsPerPage(1); // 移动端显示1张
      } else {
        setCardsPerPage(3); // 桁面端固定显示3张（按用户要求）
      }
    };

    updateCardsPerPage();
    window.addEventListener('resize', updateCardsPerPage);
    return () => window.removeEventListener('resize', updateCardsPerPage);
  }, []);

  // 重置到第一页当cardsPerPage改变时
  useEffect(() => {
    setCurrentIndex(0);
  }, [cardsPerPage]);

  // 加载category统计数据
  const loadCategoryStats = useCallback(async () => {
    try {
      console.log('🔵 Loading category stats from database');
      
      // 查询每个category的session数量
      const { data, error } = await supabase
        .from('chat_sessions')
        .select('category')
        .not('category', 'is', null);
      
      if (error) {
        console.error('🔴 Error loading category stats:', error);
        return;
      }
      
      // 统计每个category的数量
      const stats: Record<string, number> = {};
      if (data) {
        data.forEach((session: any) => {
          const category = session.category;
          if (category) {
            stats[category] = (stats[category] || 0) + 1;
          }
        });
      }
      
      console.log('🟢 Category stats loaded:', stats);
      setCategoryStats(stats);
    } catch (error) {
      console.error('🔴 Failed to load category stats:', error);
    }
  }, []);
  
  // 获取显示的统计数字（真实或随机）
  const getDisplayCount = useCallback((categoryKey: string) => {
    const realCount = categoryStats[categoryKey] || 0;
    const initialCount = getInitialDisplayCount(categoryKey);
    
    // 如果真实数字≥50，显示真实数字；否则显示随机数字
    return realCount >= 50 ? realCount : initialCount;
  }, [categoryStats, getInitialDisplayCount]);
  
  // 组件挂载时加载统计数据
  useEffect(() => {
    loadCategoryStats();
    
    // 每30秒刷新一次统计数据
    const interval = setInterval(loadCategoryStats, 30000);
    return () => clearInterval(interval);
  }, [loadCategoryStats]);
  
  // 根据当前语言刷新问题
  useEffect(() => {
    // 语言变化时刷新问题
    setRefreshKey(Date.now());
  }, [i18n.language]);

  // 获取每个领域的随机问题
  const getRandomQuestions = useCallback((questions: string[], count: number = 3) => {
    // 处理问题为空数组或undefined的情况
    if (!questions || !Array.isArray(questions) || questions.length === 0) {
      console.warn(`警告: 领域问题为空 (当前语言: ${i18n.language})`);
      return [
        t('ai_chat.default_questions.q1'),
        t('ai_chat.default_questions.q2'),
        t('ai_chat.default_questions.q3')
      ];
    }
    const shuffled = [...questions].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(count, shuffled.length));
  }, [t, i18n.language]);

  // 处理卡片点击
  const handleCardClick = (area: ExpertiseArea) => {
    if (isDragging) return; // 如果正在拖拽，不触发点击
    // 从该领域的问题中随机选择一个问题
    let randomQuestion;
    if (area.questions && area.questions.length > 0) {
      randomQuestion = area.questions[Math.floor(Math.random() * area.questions.length)];
    } else {
      // 如果没有问题，使用默认问题
      randomQuestion = t('ai_chat.default_questions.q1');
    }
    
    if (onQuestionSelect) {
      // 如果有问题选择回调，使用回调
      onQuestionSelect(randomQuestion);
    } else {
      // 跳转到 AI 问答页面，并自动发送问题
      navigate(`/ai-chat`, { 
        state: { 
          autoAsk: true, 
          question: randomQuestion,
          category: area.key
        } 
      });
    }
  };

  // 处理问题点击
  const handleQuestionClick = (question: string, e: React.MouseEvent, category?: string) => {
    e.stopPropagation();
    if (isDragging) return;
    
    if (onQuestionSelect) {
      // 如果有问题选择回调，使用回调
      onQuestionSelect(question);
    } else {
      // 跳转到 AI 问答页面，并自动发送问题
      navigate(`/ai-chat`, { 
        state: { 
          autoAsk: true, 
          question: question,
          category: category
        } 
      });
    }
  };

  // 刷新建议问题
  const refreshQuestions = () => {
    // 如果正在hover卡片或点击了问题，暂停刷新
    if (isHoveringCard || isQuestionClicked) {
      return;
    }
    
    setIsRefreshing(true);
    // 设置延迟以显示加载效果
    setTimeout(() => {
      setRefreshKey(Date.now());
      setIsRefreshing(false);
    }, 600);
  };

  // Carousel 导航 - 无限循环
  const goToPrevious = useCallback(() => {
    if (!isTransitioning) {
      setIsTransitioning(true);
      setCurrentIndex(prev => {
        if (prev <= 0) {
          // 如果是第一页，跳转到最后一页
          return totalPages - 1;
        }
        return prev - 1;
      });
      setTimeout(() => setIsTransitioning(false), 300);
    }
  }, [isTransitioning, totalPages]);

  const goToNext = useCallback(() => {
    if (!isTransitioning) {
      setIsTransitioning(true);
      setCurrentIndex(prev => {
        if (prev >= totalPages - 1) {
          // 如果是最后一页，跳转到第一页
          return 0;
        }
        return prev + 1;
      });
      setTimeout(() => setIsTransitioning(false), 300);
    }
  }, [isTransitioning, totalPages]);

  const goToPage = (pageIndex: number) => {
    if (pageIndex !== actualPageIndex && !isTransitioning) {
      setIsTransitioning(true);
      setCurrentIndex(pageIndex);
      setTimeout(() => setIsTransitioning(false), 300);
    }
  };

  // 拖拽和触摸事件处理
  const handleDragStart = (clientX: number, target?: HTMLElement) => {
    // 检查是否点击在导航按钮上
    if (target && (target.closest('.navigationButton') || target.closest('button'))) {
      return; // 不启动拖拽
    }
    
    setIsDragging(true);
    setDragStartX(clientX);
    setDragOffset(0);
  };

  const handleDragMove = (clientX: number) => {
    if (isDragging) {
      const offset = clientX - dragStartX;
      setDragOffset(offset);
    }
  };

  const handleDragEnd = () => {
    if (isDragging) {
      const threshold = 80; // 降低拖拽阈值，提高响应性
      
      if (dragOffset > threshold && canGoPrevious) {
        goToPrevious();
      } else if (dragOffset < -threshold && canGoNext) {
        goToNext();
      }
      
      setIsDragging(false);
      setDragOffset(0);
    }
  };

  // 鼠标事件
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    handleDragStart(e.clientX, e.target as HTMLElement);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    handleDragMove(e.clientX);
  };

  const handleMouseUp = () => {
    handleDragEnd();
  };

  // 触摸事件
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartRef.current = touch.clientX;
    handleDragStart(touch.clientX, e.target as HTMLElement);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    handleDragMove(touch.clientX);
  };

  const handleTouchEnd = () => {
    handleDragEnd();
  };

  // 键盘导航
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        goToPrevious();
      } else if (e.key === 'ArrowRight') {
        goToNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToPrevious, goToNext]);

  useEffect(() => {
    setRefreshKey(Date.now());
  }, []);

  // 计算当前页显示的卡片
  const currentCards = expertiseAreas.slice(
    currentIndex * cardsPerPage,
    (currentIndex + 1) * cardsPerPage
  );

  return (
    <div className={cn('space-y-8', className)}>
      {/* 头部 */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }} 
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-2">{t('professional_services.title')}</h2>
          {!isMobile && (
            <p className="text-lg text-foreground-secondary">{t('professional_services.subtitle')}</p>
          )}
        </div>
        <Button 
          variant="outline" 
          onClick={refreshQuestions}
          className="flex items-center gap-2 whitespace-nowrap self-start md:self-center group"
          disabled={isRefreshing}
        >
          {isRefreshing ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <RefreshCcw size={16} className="group-hover:rotate-90 transition-transform duration-300" />
          )}
          {t('professional_services.refresh_suggestions')}
        </Button>
      </motion.div>

      {/* Carousel 容器 */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className={cn("relative", styles.carouselContainer)}
      >
        {/* 左右导航按钮 - 无限循环，一直显示 */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2 }}
        >
          <Button
            variant="outline"
            size="sm"
            className={cn(
              "rounded-full shadow-md",
              styles.navigationButton,
              styles.navigationButtonLeft
            )}
            onClick={goToPrevious}
            disabled={isTransitioning}
          >
            <ChevronLeft size={16} />
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2 }}
        >
          <Button
            variant="outline"
            size="sm"
            className={cn(
              "rounded-full shadow-md",
              styles.navigationButton,
              styles.navigationButtonRight
            )}
            onClick={goToNext}
            disabled={isTransitioning}
          >
            <ChevronRight size={16} />
          </Button>
        </motion.div>

        {/* Carousel 内容区域 */}
        <div
          ref={carouselRef}
          className={cn(
            "cursor-grab active:cursor-grabbing relative",
            styles.carouselContent
          )}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* 垂直导航按钮已移除 */}
          <div 
            className={cn(
              "flex transition-transform duration-300 ease-in-out",
              isTransitioning && "transition-transform"
            )}
            style={{
              transform: `translateX(${-actualPageIndex * 100 + (isDragging ? (dragOffset / carouselRef.current?.offsetWidth! * 100) : 0)}%)`
            }}
          >
            {Array.from({ length: totalPages }).map((_, pageIndex) => (
              <div 
                key={pageIndex}
                className="w-full flex-shrink-0"
              >
                <div className={cn(
                  "grid",
                  styles.cardsGrid,
                  cardsPerPage === 1 && "grid-cols-1",
                  cardsPerPage === 2 && "grid-cols-2",
                  cardsPerPage === 3 && "grid-cols-3",
                  cardsPerPage === 4 && "grid-cols-4"
                )}>
                  {expertiseAreas
                    .slice(pageIndex * cardsPerPage, (pageIndex + 1) * cardsPerPage)
                    .map((area) => {
                      const IconComponent = area.icon;
                      const randomQuestions = getRandomQuestions(area.questions, 3);
                      
                      return (
                        <Card 
                          key={`${area.key}-${refreshKey}`}
                          className={cn(
                            "group cursor-pointer border-0 select-none overflow-hidden bg-background/50 backdrop-blur-sm",
                            styles.expertiseCard
                          )}
                          onClick={() => handleCardClick(area)}
                          onMouseEnter={() => setIsHoveringCard(true)}
                          onMouseLeave={() => setIsHoveringCard(false)}
                        >
                          <CardContent className={cn(
                            "p-6 flex flex-col justify-between h-full",
                            isMobile && "p-4 min-h-screen"
                          )}>
                            {/* 图标、标题和统计 */}
                            <div className={cn("mb-4", isMobile && "mb-6")}>
                              <div className="flex items-start justify-between mb-3">
                                <div className={cn(
                                  'rounded-xl flex items-center justify-center transition-all duration-500 ease-out group-hover:scale-125 group-hover:shadow-lg group-hover:rotate-3 relative overflow-hidden',
                                  isMobile ? 'w-12 h-12' : 'w-12 h-12',
                                  area.bgColor
                                )}>
                                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl" />
                                  <IconComponent className={cn('relative z-10 transition-all duration-500 group-hover:drop-shadow-sm', area.color, isMobile ? 'text-2xl' : 'text-2xl')} size={isMobile ? 24 : 24} />
                                </div>
                                <Badge 
                                  variant="secondary" 
                                  className="flex items-center gap-1 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 border-primary-200 dark:border-primary-800"
                                >
                                  <Users size={isMobile ? 12 : 12} />
                                  <span className={cn("font-semibold", isMobile && "text-sm")}>{getDisplayCount(area.key).toLocaleString()}</span>
                                </Badge>
                              </div>
                              <h3 className={cn(
                                "font-semibold text-foreground group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-all duration-500 group-hover:translate-x-1",
                                isMobile ? "text-xl line-clamp-1" : "text-lg"
                              )}>
                                {area.name}
                              </h3>
                            </div>

                            {/* 建议问题 */}
                            <div className={cn("space-y-2 flex-1", isMobile && "space-y-2")}>
                              <h4 className="font-medium text-foreground-muted mb-2 text-sm">{t('professional_services.suggested_questions')}:</h4>
                              {randomQuestions.length > 0 ? (
                                randomQuestions.map((question, index) => (
                                  <motion.button
                                    key={`${area.key}-q${index}-${refreshKey}`}
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.2, delay: index * 0.1 }}
                                    onClick={(e) => {
                                      setIsQuestionClicked(true);
                                      handleQuestionClick(question, e, area.key);
                                      // 3秒后重置点击状态
                                      setTimeout(() => setIsQuestionClicked(false), 3000);
                                    }}
                                    className={cn(
                                      "w-full text-left p-2 bg-background-secondary hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-all duration-300 border border-transparent hover:border-primary-200 dark:hover:border-primary-800 hover:translate-x-1 hover:shadow-sm group/question",
                                      isMobile && "p-3 text-sm"
                                    )}
                                  >
                                    <div className="flex items-start gap-2">
                                      <ArrowRight size={isMobile ? 12 : 12} className="mt-0.5 text-primary-500 flex-shrink-0 group-hover:animate-pulse group-hover/question:translate-x-1 transition-transform duration-300" />
                                      <span className={cn(
                                        "text-foreground-secondary group-hover/question:text-primary-600 dark:group-hover/question:text-primary-400 transition-colors duration-300",
                                        isMobile ? "text-sm" : "text-xs"
                                      )}>
                                        {question}
                                      </span>
                                    </div>
                                  </motion.button>
                                ))
                              ) : (
                                <div className={styles.loadingContainer}>
                                  <Loader2 size={16} className={styles.loadingSpinner} />
                                  <span>{t('loading')}</span>
                                </div>
                              )}
                            </div>

                            {/* 底部操作按钮 */}
                            {!isMobile && (
                              <div className={cn("mt-4", isMobile && "mt-6")}>
                                <motion.button
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ duration: 0.3, delay: 0.4 }}
                                  onClick={(e) => handleCardClick(area, e)}
                                  className={cn(
                                    "w-full flex items-center justify-center gap-2 py-2 px-4 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-all duration-300 hover:shadow-lg hover:scale-105 group/action",
                                    isMobile && "py-3 text-base"
                                  )}
                                >
                                  <MessageSquare size={isMobile ? 16 : 14} className="group-hover/action:animate-pulse" />
                                  <span className={cn("font-medium", isMobile && "text-base")}>
                                    {t('professional_services.click_for_advice')}
                                  </span>
                                  <ArrowRight size={isMobile ? 16 : 14} className="group-hover/action:translate-x-1 transition-transform duration-300" />
                                </motion.button>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      );
                    })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* 页面指示器已移除 */}

      {/* 底部操作区 - 紧凑布局 */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
        className="text-center space-y-3"
      >
        {!isMobile && (
          <div className="text-sm text-foreground-muted">
            {t('professional_services.bottom_description')}
          </div>
        )}
        <Button 
          variant="outline" 
          size="lg"
          onClick={() => navigate('/ai-chat')}
          className="group relative overflow-hidden border-primary-200 dark:border-primary-800 hover:border-primary-400 dark:hover:border-primary-600"
        >
          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-primary-100/20 to-transparent dark:from-transparent dark:via-primary-900/20 dark:to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
          <MessageSquare size={18} className="mr-2" />
          {t('professional_services.enter_full_chat')}
          <ExternalLink size={16} className="ml-2 group-hover:rotate-45 transition-transform duration-300" />
        </Button>
      </motion.div>
    </div>
  );
}
