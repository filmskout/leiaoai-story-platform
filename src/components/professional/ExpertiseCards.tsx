import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  Building2, 
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
  RefreshCcw,
  ExternalLink,
  Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './ExpertiseCards.module.css';

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
  const [refreshKey, setRefreshKey] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const touchStartRef = useRef<number>(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // 响应式设置 - 每页显示的卡片数量（桁面端3个，移动端1个）
  const [cardsPerPage, setCardsPerPage] = useState(3);

  // 专业领域配置
  const expertiseAreas: ExpertiseArea[] = [
    {
      key: 'cvc_investment',
      name: t('ai_chat.expertise_areas.cvc_investment'),
      icon: Building2,
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

  // 计算总页数 - 实现无限循环
  const totalPages = 4; // 固定4页
  const canGoPrevious = true; // 无限循环，总是可以前进
  const canGoNext = true; // 无限循环，总是可以后退
  
  // 实际的页面索引，处理循环逻辑
  const actualPageIndex = ((currentIndex % totalPages) + totalPages) % totalPages;

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
      // 否则跳转到 AI 问答页面，并带上预填充的问题
      navigate(`/ai-chat?question=${encodeURIComponent(randomQuestion)}&category=${area.key}`);
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
      // 否则跳转到 AI 问答页面
      navigate(`/ai-chat?question=${encodeURIComponent(question)}${category ? `&category=${category}` : ''}`);
    }
  };

  // 刷新建议问题
  const refreshQuestions = () => {
    setIsRefreshing(true);
    // 设置延迟以显示加载效果
    setTimeout(() => {
      setRefreshKey(Date.now());
      setIsRefreshing(false);
    }, 600);
  };

  // Carousel 导航
  const goToPrevious = useCallback(() => {
    if (canGoPrevious && !isTransitioning) {
      setIsTransitioning(true);
      setCurrentIndex(prev => {
        const newIndex = prev - 1;
        // 处理循环：如果到达-1，跳到最后一页
        return newIndex < 0 ? totalPages - 1 : newIndex;
      });
      setTimeout(() => setIsTransitioning(false), 300);
    }
  }, [canGoPrevious, isTransitioning, totalPages]);

  const goToNext = useCallback(() => {
    if (canGoNext && !isTransitioning) {
      setIsTransitioning(true);
      setCurrentIndex(prev => {
        const newIndex = prev + 1;
        // 处理循环：如果超过最大页数，跳回第一页
        return newIndex >= totalPages ? 0 : newIndex;
      });
      setTimeout(() => setIsTransitioning(false), 300);
    }
  }, [canGoNext, isTransitioning, totalPages]);

  const goToPage = (pageIndex: number) => {
    if (pageIndex !== actualPageIndex && !isTransitioning) {
      setIsTransitioning(true);
      setCurrentIndex(pageIndex);
      setTimeout(() => setIsTransitioning(false), 300);
    }
  };

  // 拖拽和触摸事件处理
  const handleDragStart = (clientX: number) => {
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
      const threshold = 100; // 拖拽阈值
      
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
    handleDragStart(e.clientX);
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
    handleDragStart(touch.clientX);
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
          <p className="text-lg text-foreground-secondary">{t('professional_services.subtitle')}</p>
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
        {/* 左右导航按钮 */}
        <AnimatePresence>
          {canGoPrevious && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  "w-10 h-10 rounded-full shadow-md",
                  styles.navigationButton,
                  styles.navigationButtonLeft
                )}
                onClick={goToPrevious}
                disabled={!canGoPrevious || isTransitioning}
              >
                <ChevronLeft size={18} />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {canGoNext && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
            >
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  "w-10 h-10 rounded-full shadow-md",
                  styles.navigationButton,
                  styles.navigationButtonRight
                )}
                onClick={goToNext}
                disabled={!canGoNext || isTransitioning}
              >
                <ChevronRight size={18} />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

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
                            "group cursor-pointer border border-border/50 hover:border-primary-400/80 dark:hover:border-primary-500/80 select-none overflow-hidden bg-gradient-to-br from-background via-background to-background/95 hover:from-background hover:via-primary-50/20 hover:to-primary-100/30 dark:hover:from-background dark:hover:via-primary-900/10 dark:hover:to-primary-800/20 backdrop-blur-sm",
                            styles.expertiseCard
                          )}
                          onClick={() => handleCardClick(area)}
                        >
                          <CardContent className="p-6">
                            {/* 图标和标题 */}
                            <div className="mb-4">
                              <div className={cn(
                                'w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-all duration-500 ease-out group-hover:scale-125 group-hover:shadow-lg group-hover:rotate-3 relative overflow-hidden',
                                area.bgColor
                              )}>
                                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl" />
                                <IconComponent className={cn('text-2xl relative z-10 transition-all duration-500 group-hover:drop-shadow-sm', area.color)} size={24} />
                              </div>
                              <h3 className="text-lg font-semibold text-foreground group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-all duration-500 group-hover:translate-x-1">
                                {area.name}
                              </h3>
                            </div>

                            {/* 建议问题 */}
                            <div className="space-y-2">
                              <h4 className="text-sm font-medium text-foreground-muted mb-2">{t('professional_services.suggested_questions')}:</h4>
                              {randomQuestions.length > 0 ? (
                                randomQuestions.map((question, index) => (
                                  <motion.button
                                    key={`${area.key}-q${index}-${refreshKey}`}
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.2, delay: index * 0.1 }}
                                    onClick={(e) => handleQuestionClick(question, e, area.key)}
                                    className="w-full text-left p-2 text-xs bg-background-secondary hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-all duration-300 border border-transparent hover:border-primary-200 dark:hover:border-primary-800 hover:translate-x-1 hover:shadow-sm group/question"
                                  >
                                    <div className="flex items-start gap-2">
                                      <ArrowRight size={12} className="mt-0.5 text-primary-500 flex-shrink-0 group-hover:animate-pulse group-hover/question:translate-x-1 transition-transform duration-300" />
                                      <span className="text-foreground-secondary group-hover/question:text-primary-600 dark:group-hover/question:text-primary-400 transition-colors duration-300 line-clamp-2">
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

                            {/* 底部提示 */}
                            <div className="mt-4 pt-3 border-t border-border">
                              <div className="flex items-center justify-between text-xs text-foreground-muted">
                                <span>{t('professional_services.click_for_advice')}</span>
                                <ArrowRight size={12} className="group-hover:translate-x-2 group-hover:text-primary-500 transition-all duration-500 ease-out" />
                              </div>
                            </div>
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

      {/* 页面指示器 */}
      {totalPages > 1 && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className={styles.pageIndicators}
        >
          {Array.from({ length: totalPages }).map((_, index) => (
            <button
              key={index}
              onClick={() => goToPage(index)}
              className={cn(
                styles.pageIndicator,
                actualPageIndex === index && styles.pageIndicatorActive
              )}
              aria-label={`第 ${index + 1} 页`}
            />
          ))}
        </motion.div>
      )}

      {/* 底部操作区 - 紧凑布局 */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
        className="text-center space-y-3"
      >
        <div className="text-sm text-foreground-muted">
          {t('professional_services.bottom_description')}
        </div>
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