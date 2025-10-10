import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Heart,
  MessageSquare,
  Eye,
  Calendar,
  User,
  Filter,
  ChevronLeft,
  ChevronRight,
  Plus,
  PenLine,
  ChevronDown
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Story {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  author: string;
  category: string;
  categoryDisplay?: string;
  view_count: number;
  like_count: number;
  comment_count: number;
  created_at: string;
  image: string;
  tags?: string[];
}

interface StoryCarouselProps {
  className?: string;
  initialCategory?: string;
}

export function StoryCarousel({ className, initialCategory = 'all' }: StoryCarouselProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  // 响应式设置 - 每页显示的卡片数量
  const [cardsPerPage, setCardsPerPage] = useState(3);

  // 分类列表
  const categories = [
    { key: 'all', label: t('stories.categories.all') },
    { key: 'ai_tools', label: t('stories.categories.ai_tools') },
    { key: 'startup_interview', label: t('stories.categories.startup_interview') },
    { key: 'investment_outlook', label: t('stories.categories.investment_outlook') },
    { key: 'finance_ai', label: t('stories.categories.finance_ai') },
    { key: 'video_generation', label: t('stories.categories.video_generation') },
    { key: 'domestic_ai', label: t('stories.categories.domestic_ai') },
    { key: 'overseas_ai', label: t('stories.categories.overseas_ai') }
  ];

  // 从数据库获取故事数据
  useEffect(() => {
    fetchStories();
  }, [selectedCategory]);

  const fetchStories = async () => {
    try {
      setLoading(true);

      // Fetch stories with basic info first
      const { data: storiesData, error: storiesError } = await supabase
        .from('stories')
        .select('id, title, content, excerpt, view_count, like_count, comment_count, created_at, featured_image_url, status, publisher, category_id')
        .eq('status', 'published')
        .eq('is_public', true)
        .order('created_at', { ascending: false })
        .limit(16);

      if (storiesError) {
        console.error('查询stories表失败:', storiesError);
        throw storiesError;
      }

      if (!storiesData || storiesData.length === 0) {
        console.log('数据库中没有故事，使用占位符数据');
        setStories(generatePlaceholderStories());
        setCurrentIndex(0);
        return;
      }

      // For now, just use basic story data without complex category joining
      const formattedStories = storiesData.map((story: any) => ({
        id: story.id,
        title: story.title,
        content: story.content,
        excerpt: story.excerpt || story.content?.substring(0, 120) + '...' || 'Story excerpt...',
        author: story.publisher || 'LeiaoAI Agent',
        category: 'ai_tools', // Default category for now
        categoryDisplay: 'AI工具体验',
        view_count: story.view_count || 0,
        like_count: story.like_count || 0,
        comment_count: story.comment_count || 0,
        created_at: story.created_at,
        image: story.featured_image_url || `/story-images/story-${Math.floor(Math.random() * 8) + 1}.jpg`,
        tags: [] // For now, no tags to simplify
      }));

      // Apply category filter
      const filteredStories = selectedCategory === 'all'
        ? formattedStories
        : formattedStories.filter(story => story.category === selectedCategory);

      console.log(`成功加载 ${filteredStories.length} 个故事（分类: ${selectedCategory}）`);
      setStories(filteredStories.length > 0 ? filteredStories : generatePlaceholderStories());
      setCurrentIndex(0);
    } catch (error) {
      console.error('获取故事失败:', error);
      // 出错时使用占位符故事
      setStories(generatePlaceholderStories());
      setCurrentIndex(0);
    } finally {
      setLoading(false);
    }
  };

  // 生成占位符故事
  const generatePlaceholderStories = () => {
    const placeholders: Story[] = [];
    
    const titles = [
      "我是如何用AI辅助写出专业商业计划的",
      "GPT-4的财务分析功能让我惊讶",
      "DeepSeek帮我快速构建金融模型的体验",
      "千问金融模型：中国企业估值新方法",
      "从零开始：AI助手帮我学习财务建模",
      "Claude写投资报告比我更像专业人士",
      "用AI分析上市公司财报的效率提升",
      "Midjourney如何改变我的财务演示文稿",
      "国产大模型在财务分析上的应用对比",
      "用DALL-E生成的数据可视化让客户惊艳",
      "我用AI分析了过去10年的IPO数据",
      "海螺模型：让金融分析更接地气",
      "AI帮我在一天内完成的尽调报告",
      "投资分析中的AI应用：从量化到定性",
      "ChatGPT教我看懂资产负债表只用了半小时",
      "我让AI评估了我的创业想法，结果很意外"
    ];
    
    const categories = [
      "ai_tools", 
      "finance_ai", 
      "domestic_ai", 
      "overseas_ai", 
      "investment_outlook", 
      "video_generation", 
      "startup_interview"
    ];
    
    const excerpts = [
      "最近我用AI辅助撰写了一份商业计划书，不仅节省了大量时间，而且质量比我预期的要高得多。主要用了三个步骤：1）用GPT-4生成初稿框架；2）通过提问引导AI完善细节；3）用Claude优化语言表达和数据可视化部分...",
      "我一直以为AI在财务分析方面只能做简单计算，直到尝试了GPT-4的高级功能。它不仅能理解复杂的财务指标，还能提供深入的行业对比分析。最让我印象深刻的是它能基于有限的输入数据推导出合理的财务预测模型...",
      "DeepSeek的金融模型功能让我眼前一亮，尤其是它处理中国企业特殊会计准则的能力。我只需提供基础数据和几个关键假设，它就能构建出完整的三表模型。比传统Excel模板高效得多，而且错误率大大降低...",
      "千问的金融模型特别适合分析中国企业，它对中国特色会计准则和市场环境的理解非常到位。我最近用它分析了几家A股上市公司，发现它给出的估值比传统外资模型更接近实际情况...",
      "作为金融领域的新手，我一直被财务建模吓到。直到发现可以用AI作为私人教练，一步步引导我学习。最有效的方法是让AI设计递进式的学习计划，然后针对每个概念给出实例和练习...",
      "我最近让Claude写了一份投资分析报告，然后和同事撰写的报告对比。有趣的是，在盲测中，大多数人认为AI写的报告来自有5年以上经验的分析师，而实际上我同事已有8年经验...",
      "传统分析上市公司财报需要数小时，而使用AI后，我能在15分钟内获取关键见解。我开发了一个三步流程：先用GPT提取关键数据，再用专门的AI工具进行同行对比，最后生成异常指标警报...",
      "金融数据可视化通常很枯燥，直到我开始使用Midjourney。我现在的工作流是：用AI生成创意数据展示概念图，然后基于这些创意在专业工具中实现。客户反馈非常积极，特别是对风险可视化部分...",
      "我测试了文心一言、通义千问和ChatGLM在财务分析上的表现。最大的区别在于：文心擅长解读财务报表，千问在预测模型上更准，而ChatGLM则在生成财务叙述时最为自然...",
      "数据可视化一直是我的弱项，直到发现DALL-E可以根据数据描述生成概念图。现在我的流程是：用GPT分析数据并描述关键趋势，用DALL-E生成视觉概念，然后在Tableau中实现专业版本...",
      "我训练了一个专门的AI模型分析过去10年的IPO数据，发现了一些有趣的模式。最令人惊讶的是上市时间与长期表现的相关性，以及某些特定行业估值倍数的周期性变化...",
      "作为一个中国投资人，我发现海螺模型在解读国内金融数据时比海外模型更接地气。尤其是在理解一些中国特色的财务处理方法和市场环境时，它的回答更符合国内实际情况...",
      "在一个紧急的并购项目中，我用AI在24小时内完成了初步尽调报告。关键是设计了一个分层提问框架：先让AI提取关键财务数据，然后针对每个风险领域深入分析，最后生成综合评估...",
      "AI在投资分析中的应用已经从简单的量化分析扩展到复杂的定性评估。我开发的工作流结合了多个AI工具：用专业金融AI进行数据处理，用通用大模型分析市场趋势，再用行业专用模型评估具体机会...",
      "财务报表对非专业人士来说就像天书，但ChatGPT改变了这一点。通过设计递进式学习方案，AI带我从基本概念开始，用形象的比喻和实例，一步步理解复杂的财务指标和它们背后的含义...",
      "我抱着怀疑态度让AI评估了我的创业想法。令人惊讶的是，它不仅指出了几个我没想到的风险点，还提供了减轻这些风险的具体建议，甚至推荐了几个潜在的差异化角度。这次体验彻底改变了我对AI的看法..."
    ];
    
    // 创建16个占位故事
    for (let i = 0; i < 16; i++) {
      const randomViewCount = Math.floor(Math.random() * 500) + 100;
      const randomLikeCount = Math.floor(Math.random() * 50) + 10;
      const randomCommentCount = Math.floor(Math.random() * 20) + 1;
      const randomCategory = categories[Math.floor(Math.random() * categories.length)];
      const randomDaysAgo = Math.floor(Math.random() * 30) + 1;
      
      const placeholderStory: Story = {
        id: `placeholder-${i}`,
        title: titles[i] || `AI投融资体验故事 ${i+1}`,
        content: excerpts[i] || `这是一个AI投融资领域的用户体验故事...

通过使用先进的AI工具，我在投资分析和财务建模方面取得了显著的效率提升。这个故事分享了我的实际体验和心得。`,
        excerpt: excerpts[i]?.substring(0, 120) + '...' || '这是一个关于AI如何帮助投资分析和财务建模的故事，通过使用先进的人工智能工具，我发现...',
        author: '蕾军',
        category: randomCategory,
        categoryDisplay: categories.find(cat => cat === randomCategory) || 'AI工具体验',
        view_count: randomViewCount,
        like_count: randomLikeCount,
        comment_count: randomCommentCount,
        created_at: new Date(Date.now() - randomDaysAgo * 24 * 60 * 60 * 1000).toISOString(),
        image: `/story-images/story-${(i % 8) + 1}.jpg`
      };
      
      placeholders.push(placeholderStory);
    }
    
    return placeholders;
  };

  const [isMobileView, setIsMobileView] = useState(false);

  // 响应式监听
  useEffect(() => {
    const updateCardsPerPage = () => {
      const width = window.innerWidth;
      const mobile = width < 640;
      setIsMobileView(mobile);
      
      if (mobile) {
        setCardsPerPage(1); // 手机显示1个
      } else if (width < 1024) {
        setCardsPerPage(2); // 平板显示2个
      } else {
        setCardsPerPage(3); // 桌面显示3个
      }
    };

    updateCardsPerPage();
    window.addEventListener('resize', updateCardsPerPage);
    return () => window.removeEventListener('resize', updateCardsPerPage);
  }, []);

  // 根据选定的分类过滤故事
  const filteredStories = selectedCategory === 'all'
    ? stories
    : stories.filter(story => story.category === selectedCategory);

  // 计算总页数
  const totalPages = Math.ceil(filteredStories.length / cardsPerPage);
  const canGoPrevious = currentIndex > 0;
  const canGoNext = currentIndex < totalPages - 1;

  // 格式化日期
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return t('date.today', 'Today');
    if (diffDays <= 7) return t('date.days_ago', '{{days}} days ago', {days: diffDays});
    return date.toLocaleDateString();
  };

  // Carousel 导航
  const goToPrevious = useCallback(() => {
    if (canGoPrevious && !isTransitioning) {
      setIsTransitioning(true);
      setCurrentIndex(prev => prev - 1);
      setTimeout(() => setIsTransitioning(false), 300);
    }
  }, [canGoPrevious, isTransitioning]);

  const goToNext = useCallback(() => {
    if (canGoNext && !isTransitioning) {
      setIsTransitioning(true);
      setCurrentIndex(prev => prev + 1);
      setTimeout(() => setIsTransitioning(false), 300);
    }
  }, [canGoNext, isTransitioning]);

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

  // 处理鼠标事件
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

  // 处理触摸事件
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    handleDragStart(touch.clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    handleDragMove(touch.clientX);
  };

  const handleTouchEnd = () => {
    handleDragEnd();
  };

  // 处理发布故事按钮点击
  const handleCreateStory = () => {
    navigate('/create-story');
  };

  return (
    <div className={cn("space-y-8", className)}>
      {/* 头部 */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between"
      >
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-2">{t('stories.section_title')}</h2>
          <p className="text-lg text-foreground-secondary">{t('stories.section_subtitle')}</p>
        </div>

        <Button
          onClick={handleCreateStory}
          className="flex items-center gap-2 group"
        >
          <PenLine size={16} />
          <span>{t('stories.create_button')}</span>
        </Button>
      </motion.div>

      {/* 类别筛选 */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex justify-center mb-8"
      >
        {/* 桌面端：横向按钮 */}
        <div className="hidden md:flex flex-wrap gap-2 p-1 bg-background rounded-lg border border-border">
          {categories.map((category) => (
            <button
              key={category.key}
              onClick={() => setSelectedCategory(category.key)}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200',
                selectedCategory === category.key
                  ? 'bg-primary-500 text-white shadow-sm'
                  : 'text-foreground hover:bg-neutral-100 dark:hover:bg-neutral-800'
              )}
            >
              {category.key === 'all' && <Filter size={16} />}
              <span>{category.label}</span>
            </button>
          ))}
        </div>

        {/* 移动端：下拉选择 */}
        <div className="md:hidden w-full max-w-xs">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={t('stories.categories.all')} />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.key} value={category.key}>
                  <div className="flex items-center gap-2">
                    {category.key === 'all' && <Filter size={16} />}
                    <span>{category.label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </motion.div>

      {/* Carousel 区域 */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="relative"
      >
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(cardsPerPage)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="aspect-video bg-neutral-200 dark:bg-neutral-700 rounded-t-lg"></div>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded"></div>
                    <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-4/5"></div>
                    <div className="h-16 bg-neutral-200 dark:bg-neutral-700 rounded"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredStories.length === 0 ? (
          <div className="text-center py-12 bg-background-secondary rounded-xl border border-border">
            <div className="w-16 h-16 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare size={24} className="text-neutral-400" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">{t('stories.no_stories.title')}</h3>
            <p className="text-foreground-muted mb-6">{t('stories.no_stories.desc')}</p>
            <Button
              onClick={handleCreateStory}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Plus size={16} />
              <span>{t('stories.be_first_share')}</span>
            </Button>
          </div>
        ) : (
          <>
            {/* 导航按钮 */}
            {totalPages > 1 && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  className={cn(
                    "absolute left-2 md:left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 md:w-10 md:h-10 rounded-full shadow-lg bg-background border-2",
                    !canGoPrevious && "opacity-50 cursor-not-allowed"
                  )}
                  onClick={goToPrevious}
                  disabled={!canGoPrevious || isTransitioning}
                >
                  <ChevronLeft size={20} />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className={cn(
                    "absolute right-2 md:right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 md:w-10 md:h-10 rounded-full shadow-lg bg-background border-2",
                    !canGoNext && "opacity-50 cursor-not-allowed"
                  )}
                  onClick={goToNext}
                  disabled={!canGoNext || isTransitioning}
                >
                  <ChevronRight size={20} />
                </Button>
              </>
            )}

            {/* Carousel 内容 */}
            <div
              ref={carouselRef}
              className="overflow-hidden cursor-grab active:cursor-grabbing"
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
                  transform: `translateX(${-currentIndex * 100 + (isDragging ? (dragOffset / carouselRef.current?.offsetWidth! * 100) : 0)}%)`
                }}
              >
                {Array.from({ length: totalPages }).map((_, pageIndex) => (
                  <div
                    key={pageIndex}
                    className="w-full flex-shrink-0"
                  >
                    <div className={cn(
                      "grid gap-6",
                      cardsPerPage === 1 && "grid-cols-1",
                      cardsPerPage === 2 && "grid-cols-2",
                      cardsPerPage === 3 && "grid-cols-3"
                    )}>
                      {filteredStories
                        .slice(pageIndex * cardsPerPage, (pageIndex + 1) * cardsPerPage)
                        .map((story) => (
                          <Link key={story.id} to={`/story/${story.id}`}>
                            <Card className={cn(
                              "cursor-pointer transition-all duration-300",
                              isMobileView 
                                ? "border-0 shadow-sm" // 移动端：无边框，轻微阴影
                                : "group hover:shadow-lg hover:-translate-y-1 border" // 桌面端：保留悬停效果
                            )}>
                              <div className={cn(
                                "rounded-t-lg overflow-hidden",
                                isMobileView ? "aspect-[16/10]" : "aspect-video" // 移动端调整宽高比
                              )}>
                                <img
                                  src={story.image}
                                  alt={story.title}
                                  className={cn(
                                    "w-full h-full object-cover transition-transform duration-300",
                                    !isMobileView && "group-hover:scale-105" // 移动端移除悬停缩放
                                  )}
                                />
                              </div>
                              
                              <CardContent className={cn(
                                "p-6",
                                isMobileView && "p-4" // 移动端压缩内边距
                              )}>
                                <div className="flex items-center space-x-2 mb-3">
                                  <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
                                    <User size={14} className="text-primary-600" />
                                  </div>
                                  <span className="text-sm font-medium text-foreground">{story.author}</span>
                                  <span className="text-xs px-2 py-1 bg-neutral-100 dark:bg-neutral-800 text-foreground-muted rounded-full">
                                    {story.categoryDisplay || story.category}
                                  </span>
                                </div>
                                
                                <h3 className={cn(
                                  "font-semibold text-foreground mb-2 transition-colors line-clamp-2",
                                  isMobileView ? "text-base" : "text-lg group-hover:text-primary-600" // 移动端调整字号和移除悬停效果
                                )}>
                                  {story.title}
                                </h3>
                                
                                <p className={cn(
                                  "text-foreground-secondary leading-relaxed line-clamp-3",
                                  isMobileView ? "text-xs mb-3" : "text-sm mb-4" // 移动端调整字号和间距
                                )}>
                                  {story.excerpt}
                                </p>
                                
                                <div className={cn(
                                  "flex items-center justify-between text-foreground-muted",
                                  isMobileView ? "text-xs" : "text-sm" // 移动端调整字号
                                )}>
                                  <div className="flex items-center space-x-3">
                                    <div className="flex items-center space-x-1">
                                      <Eye size={isMobileView ? 12 : 14} />
                                      <span>{story.view_count}</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                      <Heart size={isMobileView ? 12 : 14} />
                                      <span>{story.like_count}</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                      <MessageSquare size={isMobileView ? 12 : 14} />
                                      <span>{story.comment_count}</span>
                                    </div>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <Calendar size={isMobileView ? 12 : 14} />
                                    <span>{formatDate(story.created_at)}</span>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </Link>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 页面指示器 */}
            {totalPages > 1 && (
              <div className="flex justify-center space-x-2 mt-6">
                {Array.from({ length: totalPages }).map((_, index) => (
                  <motion.button
                    key={index}
                    onClick={() => {
                      if (!isTransitioning) {
                        setIsTransitioning(true);
                        setCurrentIndex(index);
                        setTimeout(() => setIsTransitioning(false), 300);
                      }
                    }}
                    className={cn(
                      "w-3 h-3 rounded-full transition-all duration-300 relative overflow-hidden",
                      index === currentIndex
                        ? "w-6 bg-primary-500 scale-110"
                        : "bg-neutral-300 dark:bg-neutral-600 hover:bg-primary-400 hover:scale-105"
                    )}
                    aria-label={`第 ${index + 1} 页`}
                    animate={{
                      width: index === currentIndex ? 24 : 12,
                      backgroundColor: index === currentIndex ? "var(--color-primary-500)" : ""
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    {index === currentIndex && (
                      <motion.span 
                        className="absolute inset-0 bg-primary-500"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ duration: 0.5 }}
                      />
                    )}
                  </motion.button>
                ))}
              </div>
            )}
          </>
        )}
      </motion.div>
    </div>
  );
}
