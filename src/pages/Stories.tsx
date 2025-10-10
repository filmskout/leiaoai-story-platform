import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { SimpleStoriesWall } from '@/components/stories/SimpleStoriesWall';
import { PageHero } from '@/components/PageHero';
import { useMobileLayout } from '@/hooks/use-mobile';
import { 
  ArrowRight,
  PenLine,
  FileText,
  BookOpen,
  PlusCircle,
  Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function Stories() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const isMobile = useMobileLayout();

  // 页面动画
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
      {/* 页面标题 - 使用PageHero组件保持一致性 */}
      <PageHero 
        titleKey={isMobile ? "stories.mobile_page_title" : "stories.page_title"}
        subtitleKey={isMobile ? "stories.mobile_page_subtitle" : "stories.page_subtitle"}
        icon={BookOpen}
      >
        {/* 桌面端创建故事按钮 */}
        {!isMobile && (
          <Button 
            onClick={() => navigate('/create-story')} 
            size="lg"
            className="group"
          >
            <PlusCircle size={18} className="mr-2" />
            {t('stories.create_button')}
            <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        )}
      </PageHero>

      {/* Main Content - Stories Grid */}
      <section className={cn(
        "px-4",
        isMobile ? "py-8 pb-20" : "py-16 pb-24 md:pb-16"
      )}>
        <div className="container-custom max-w-7xl">
          <motion.div variants={itemVariants}>
            <SimpleStoriesWall />
          </motion.div>
        </div>
      </section>

      {/* Share Your Story CTA - 与主页BP分析模块宽度一致 */}
      <motion.section 
        variants={itemVariants}
        className={cn(
          "px-4",
          isMobile ? "py-12" : "py-20"
        )}
      >
        <div className="container-custom">
          <Card 
            className="text-white border-0"
            style={{ backgroundColor: '#f97316' }}
          >
            <CardContent 
              className={cn(
                "text-center space-y-4",
                isMobile ? "p-6" : "p-12 space-y-6"
              )}
            >
              <h2 className={cn(
                "font-bold",
                isMobile ? "text-2xl" : "text-4xl"
              )}>
                {t('stories.cta_title', 'Share Your Story')}
              </h2>
              <p className={cn(
                "text-white/90 mx-auto",
                isMobile ? "text-base max-w-sm" : "text-xl max-w-3xl"
              )}>
                {isMobile 
                  ? t('stories.cta_subtitle_mobile', 'Your experience could inspire others. Join our community and share your journey.')
                  : t('stories.cta_subtitle', 'Your experiences and insights could inspire the next generation of innovators. Join our community of storytellers and make an impact.')
                }
              </p>
              <div className={cn(
                "flex gap-4 pt-4",
                isMobile ? "flex-col" : "flex-row justify-center"
              )}>
                <Button 
                  onClick={() => navigate('/create-story')} 
                  variant="secondary"
                  size={isMobile ? "default" : "lg"}
                  className={cn(
                    "group bg-white text-primary-600 hover:bg-white/90",
                    isMobile && "w-full"
                  )}
                >
                  <PlusCircle size={18} className="mr-2" />
                  {t('stories.create_story', 'Create Story')}
                  <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
                
                <Button 
                  onClick={() => navigate('/ai-chat')} 
                  variant="outline" 
                  size={isMobile ? "default" : "lg"}
                  className={cn(
                    "border-white text-white hover:bg-white hover:text-primary-600",
                    isMobile && "w-full"
                  )}
                >
                  {t('stories.need_ideas', 'Need Ideas? Chat with AI')}
                  <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.section>

      {/* 移动端浮动发布按钮 */}
      <motion.div 
        className={cn(
          "fixed z-[9999]",
          isMobile ? "bottom-4 right-4" : "bottom-6 right-6 md:hidden"
        )}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, type: "spring", stiffness: 200 }}
      >
        <Button
          onClick={() => navigate('/create-story')}
          size={isMobile ? "default" : "lg"}
          className={cn(
            "rounded-full shadow-lg hover:shadow-xl transition-all duration-300 bg-primary-500 hover:bg-primary-600 p-0",
            isMobile ? "w-12 h-12" : "w-14 h-14"
          )}
        >
          <Plus size={isMobile ? 20 : 24} className="text-white" />
        </Button>
      </motion.div>
    </motion.div>
  );
}

