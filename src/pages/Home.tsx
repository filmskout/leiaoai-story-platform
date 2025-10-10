import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { QuickAIChatInput } from '@/components/ai/QuickAIChatInput';
import { ExpertiseCards } from '@/components/professional/ExpertiseCards';
import { NewStoryCarousel } from '@/components/stories/NewStoryCarousel';
import { useAIChat } from '@/hooks/useAIChat';
import { useWebsiteStats } from '@/hooks/useWebsiteStats';
import { useMobileLayout, useCompactLayout } from '@/hooks/use-mobile';
import { 
  Heart, 
  MessageCircle, 
  Eye, 
  Calendar, 
  User, 
  Filter,
  Sparkles,
  Bot,
  FileText,
  TrendingUp,
  Users,
  ArrowRight,
  Star,
  BarChart3,
  Zap,
  Plus,
  BookOpen
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';

// 故事类型接口
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

const mockStats = {
  totalUsers: 12580,
  totalQuestions: 3240,
  totalBPAnalyzed: 890,
  avgResponseTime: '2.3s'
};

export default function Home() {
  const { t } = useTranslation();
  const { actualTheme } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { sendMessage, isLoading: isAILoading } = useAIChat();
  const { stats, isLoading: isStatsLoading } = useWebsiteStats();
  const isMobile = useMobileLayout();
  const isCompact = useCompactLayout();
  
  // Handle scroll to professional services when returning from AI Chat
  useEffect(() => {
    if (location.state?.scrollTo === 'professional-services' && location.state?.from === 'ai-chat') {
      // Delay scroll to ensure page is fully rendered
      setTimeout(() => {
        const expertiseSection = document.querySelector('[data-section="expertise"]');
        if (expertiseSection) {
          expertiseSection.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
          });
        }
      }, 500);
      
      // Clear the state to prevent scrolling on page refresh
      navigate(location.pathname, { replace: true });
    }
  }, [location.state, navigate, location.pathname]);
  
  // AI消息处理函数
  const handleSendMessage = (message: string) => {
    // 使用useAIChat的sendMessage方法发送消息
    sendMessage(message);
    // 导航到完整的AI聊天页面，查看完整对话历史
    navigate('/ai-chat');
  };

  // 页面渐出动画
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.5, 
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-background"
    >
      {/* 英雄章节 */}
      <motion.section 
        variants={itemVariants}
        className={cn(
          "relative overflow-hidden bg-gradient-subtle",
          isMobile ? "py-6 px-4" : "py-10 md:py-12 px-4"
        )}
      >
        <div className="container-custom">
          <div className="max-w-6xl mx-auto">
            <div className={cn(
              "items-center",
              isMobile ? "space-y-6" : "grid lg:grid-cols-2 gap-12"
            )}>
              {/* 左侧内容 */}
              <div className={cn(
                "space-y-6",
                isMobile && "text-center"
              )}>
                <motion.div 
                  variants={itemVariants}
                  className={cn(
                    "space-y-4",
                    isMobile && "space-y-3"
                  )}
                >
                  <motion.h1 
                    variants={itemVariants}
                    className={cn(
                      "font-bold text-foreground leading-tight",
                      isMobile ? "text-2xl" : "text-4xl md:text-5xl lg:text-6xl"
                    )}
                  >
                    {t('home.hero.title_1')}
                    <span className="text-gradient"> {t('home.hero.title_2')} </span>
                    {t('home.hero.title_3')}
                  </motion.h1>
                  
                  <motion.p 
                    variants={itemVariants}
                    className={cn(
                      "text-foreground-secondary leading-relaxed",
                      isMobile ? "text-base max-w-sm mx-auto" : "text-lg max-w-2xl"
                    )}
                  >
                    {isMobile ? t('home.hero.mobile_description') : t('home.hero.description')}
                  </motion.p>
                </motion.div>
                
                <motion.div 
                  variants={itemVariants}
                  className={cn(
                    "flex gap-3",
                    isMobile ? "flex-col" : "flex-col sm:flex-row gap-4"
                  )}
                >
                  {/* 左侧主按钮：AI Investment Expert */}
                  <Link to="/ai-chat">
                    <Button 
                      size={isMobile ? "default" : "lg"} 
                      className={cn(
                        "group",
                        isMobile && "w-full"
                      )}
                    >
                      <Bot size={16} className="mr-2" />
                      {t('ai_chat.title')}
                      <ArrowRight size={14} className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                  {/* 右侧次按钮：Sign in 橙色 */}
                  {!user && (
                    <Link to="/auth">
                      <Button 
                        size={isMobile ? "default" : "lg"} 
                        className={cn(
                          "bg-orange-500 hover:bg-orange-600 text-white border-0",
                          isMobile && "w-full"
                        )}
                      >
                        {t('auth.sign_in', 'Sign in')}
                      </Button>
                    </Link>
                  )}

                  <Link to="/bp-analysis">
                    <Button 
                      variant="outline" 
                      size={isMobile ? "default" : "lg"} 
                      className={cn(
                        isMobile && "w-full"
                      )}
                    >
                      <FileText size={16} className="mr-2" />
                      {t('bp_analysis.title')}
                    </Button>
                  </Link>
                </motion.div>

                {/* 数据统计 - 移动端优化 */}
                <motion.div 
                  variants={itemVariants}
                  className={cn(
                    "pt-6",
                    isMobile ? "grid grid-cols-2 gap-3" : "grid grid-cols-2 md:grid-cols-4 gap-4 pt-8"
                  )}
                >
                  <motion.div 
                    variants={itemVariants}
                    className="text-center"
                  >
                    <div className={cn(
                      "font-bold text-foreground",
                      isMobile ? "text-lg" : "text-2xl"
                    )}>{isStatsLoading ? mockStats.totalUsers.toLocaleString() : stats.total_users.toLocaleString()}</div>
                    <div className={cn(
                      "text-foreground-muted",
                      isMobile ? "text-xs" : "text-sm"
                    )}>{t('home.stats.total_users')}</div>
                  </motion.div>
                  <motion.div 
                    variants={itemVariants}
                    className="text-center"
                  >
                    <div className={cn(
                      "font-bold text-foreground",
                      isMobile ? "text-lg" : "text-2xl"
                    )}>{isStatsLoading ? mockStats.totalQuestions.toLocaleString() : stats.total_qa.toLocaleString()}</div>
                    <div className={cn(
                      "text-foreground-muted",
                      isMobile ? "text-xs" : "text-sm"
                    )}>{t('home.stats.total_qa')}</div>
                  </motion.div>
                  <motion.div 
                    variants={itemVariants}
                    className="text-center"
                  >
                    <div className={cn(
                      "font-bold text-foreground",
                      isMobile ? "text-lg" : "text-2xl"
                    )}>{isStatsLoading ? mockStats.totalBPAnalyzed.toLocaleString() : stats.total_bp_analysis.toLocaleString()}</div>
                    <div className={cn(
                      "text-foreground-muted",
                      isMobile ? "text-xs" : "text-sm"
                    )}>{t('home.stats.bp_analysis')}</div>
                  </motion.div>
                  <motion.div 
                    variants={itemVariants}
                    className="text-center"
                  >
                    <div className={cn(
                      "font-bold text-foreground",
                      isMobile ? "text-lg" : "text-2xl"
                    )}>{isStatsLoading ? mockStats.avgResponseTime : `${stats.avg_response_time}s`}</div>
                    <div className={cn(
                      "text-foreground-muted",
                      isMobile ? "text-xs" : "text-sm"
                    )}>{t('home.stats.avg_response')}</div>
                  </motion.div>
                </motion.div>
              </div>
              
              {/* 右侧AI问答卡片 - 移动端隐藏 */}
              {!isMobile && (
                <motion.div 
                  variants={itemVariants}
                  className="space-y-6"
                >
                  <QuickAIChatInput onSubmit={handleSendMessage} className="h-[400px]" />
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </motion.section>

      {/* 专业领域展示 - 使用ExpertiseCards组件（移动到最新故事之前）*/}
      <motion.section 
        variants={itemVariants}
        className={cn(
          "px-4",
          isMobile ? "py-6" : "py-10"
        )}
      >
        <div className="container-custom">
          <ExpertiseCards />
        </div>
      </motion.section>

      {/* Latest Stories Carousel */}
      <motion.section 
        variants={itemVariants}
        className={cn(
          "px-4",
          isMobile ? "py-8" : "py-12"
        )}
      >
        <div className="container-custom">
          {/* 标题与操作区：左侧标题，右侧 Create Story */}
          <div className={cn("max-w-6xl mx-auto flex items-center justify-between mb-4")}> 
            <div>
              <h2 className={cn(isMobile ? "text-xl" : "text-2xl", "font-bold text-foreground")}>{t('stories.latest', 'Latest Stories')}</h2>
              <p className="text-foreground-muted text-sm">{t('stories.subtitle', 'Fresh insights and updates')}</p>
            </div>
            <div>
              <Link to={user ? "/create-story" : "/auth"}>
                <Button size={isMobile ? "sm" : "default"} className="bg-orange-500 hover:bg-orange-600 text-white border-0">
                  <Plus size={16} className="mr-2" />
                  {t('stories.create_story', 'Create Story')}
                </Button>
              </Link>
            </div>
          </div>
          <NewStoryCarousel className="max-w-6xl mx-auto" />

          {/* View All Stories Button */}
          <motion.div 
            variants={itemVariants}
            className="text-center mt-8"
          >
            <Link to="/stories">
              <Button 
                size={isMobile ? "default" : "lg"} 
                variant="outline"
                className="group"
              >
                <BookOpen size={16} className="mr-2" />
                {t('stories.view_all_stories', 'View All Stories')}
                <ArrowRight size={14} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </motion.section>



      {/* BP 分析 CTA 区域（统一橙色底，按钮配色按暗/亮模式） */}
      <motion.section 
        variants={itemVariants}
        className={cn(
          "px-4",
          isMobile ? "py-6 pb-10" : "py-10 pb-16"
        )}
      >
        <div className="container-custom">
          <Card className="text-white border-0" style={{ backgroundColor: '#f97316' }}>
            <CardContent className={cn(
              "text-center",
              isMobile ? "p-6" : "p-12"
            )}>
              <h2 className={cn(
                "font-bold mb-4",
                isMobile ? "text-xl" : "text-3xl"
              )}>
                {isMobile ? t('home.cta.mobile_title') : t('home.cta.title')}
              </h2>
              <p className={cn(
                "text-primary-100 mb-6 mx-auto",
                isMobile ? "text-base max-w-sm" : "text-xl mb-8 max-w-2xl"
              )}>
                {isMobile ? t('home.cta.mobile_subtitle') : t('home.cta.subtitle')}
              </p>
              <div className={cn("justify-center gap-3", isMobile ? "flex flex-col" : "flex flex-col sm:flex-row gap-4")}> 
                {/* 左按钮配色：暗-灰底白字；亮-白底黑字 */}
                <Link to="/bp-analysis">
                  <Button size={isMobile ? "default" : "lg"} className={cn(
                    isMobile && "w-full",
                    actualTheme === 'dark' ? 'bg-neutral-600 text-white hover:bg-neutral-500' : 'bg-white text-black hover:bg-neutral-100'
                  )}>
                    <FileText size={16} className="mr-2" />
                    {t('home.cta.upload_bp')}
                  </Button>
                </Link>
                {/* 右按钮配色：暗-黑底白字；亮-白底灰字 */}
                <Link to="/ai-chat">
                  <Button size={isMobile ? "default" : "lg"} className={cn(
                    isMobile && "w-full",
                    actualTheme === 'dark' ? 'bg-black text-white hover:bg-neutral-900' : 'bg-white text-neutral-500 hover:text-neutral-700'
                  )}>
                    <Bot size={16} className="mr-2" />
                    {t('home.cta.ai_chat')}
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.section>
    </motion.div>
  );
}
