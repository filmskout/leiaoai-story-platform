import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PinterestStories } from '@/components/stories/PinterestStories';
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
      {/* 页面标题 */}
      <section className={cn(
        "bg-gradient-subtle",
        isMobile ? "py-8 px-4" : "py-12 px-4"
      )}>
        <div className="container-custom">
          <motion.div variants={itemVariants} className={cn(
            "mx-auto text-center space-y-3",
            isMobile ? "max-w-sm" : "max-w-3xl space-y-4"
          )}>
            <div className={cn(
              "inline-flex items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900/30 mb-3",
              isMobile ? "w-12 h-12 mb-2" : "w-16 h-16 mb-4"
            )}>
              <BookOpen className="text-primary-600" size={isMobile ? 20 : 24} />
            </div>
            <h1 className={cn(
              "font-bold text-foreground leading-tight",
              isMobile ? "text-2xl" : "text-4xl md:text-5xl"
            )}>
              {isMobile ? t('stories.mobile_page_title') : t('stories.page_title')}
            </h1>
            <p className={cn(
              "text-foreground-secondary leading-relaxed",
              isMobile ? "text-base" : "text-xl"
            )}>
              {isMobile ? t('stories.mobile_page_subtitle') : t('stories.page_subtitle')}
            </p>
            {/* 桌面端按钮 */}
            <div className={cn(
              "hidden",
              !isMobile && "pt-4 md:block"
            )}>
              <Button 
                onClick={() => navigate('/create-story')} 
                size="lg"
                className="group"
              >
                <PlusCircle size={18} className="mr-2" />
                {t('stories.create_button')}
                <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content - Pinterest-style Stories Grid */}
      <section className={cn(
        "px-4",
        isMobile ? "py-8 pb-20" : "py-16 pb-24 md:pb-16"
      )}>
        <div className="container-custom">
          <motion.div variants={itemVariants}>
            <div className={cn(
              "mx-auto text-center space-y-3 mb-8",
              isMobile ? "max-w-sm" : "max-w-3xl space-y-4"
            )}>
              <h2 className={cn(
                "font-bold text-foreground",
                isMobile ? "text-xl" : "text-3xl"
              )}>
                {t('stories.section_title')}
              </h2>
              <p className={cn(
                "text-foreground-secondary",
                isMobile ? "text-sm" : "text-lg"
              )}>
                {t('stories.section_subtitle')}
              </p>
            </div>
            <PinterestStories />
          </motion.div>
        </div>
      </section>

      {/* 故事撰写提示区 */}
      <motion.section 
        variants={itemVariants}
        className={cn(
          "px-4 bg-background-secondary",
          isMobile ? "py-8 pb-20" : "py-16 pb-24 md:pb-16"
        )}
      >
        <div className="container-custom">
          <div className={cn(
            "mx-auto bg-background rounded-xl border border-border shadow-sm",
            isMobile ? "max-w-sm p-4" : "max-w-4xl p-8"
          )}>
            <div className={cn(
              "items-center",
              isMobile ? "flex flex-col gap-4 text-center" : "flex flex-col md:flex-row gap-8"
            )}>
              <div className={cn(
                "text-center",
                !isMobile && "md:w-1/3"
              )}>
                <div className={cn(
                  "inline-flex items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900/30 mb-3",
                  isMobile ? "w-16 h-16" : "w-20 h-20 mb-4"
                )}>
                  <FileText className="text-primary-600" size={isMobile ? 24 : 32} />
                </div>
              </div>
              <div className={cn(
                "space-y-3",
                !isMobile && "md:w-2/3 space-y-4"
              )}>
                <h2 className={cn(
                  "font-bold text-foreground",
                  isMobile ? "text-lg" : "text-2xl"
                )}>
                  {isMobile ? t('stories.mobile_writing_section_title') : t('stories.writing_section_title')}
                </h2>
                <p className={cn(
                  "text-foreground-secondary",
                  isMobile ? "text-sm" : ""
                )}>
                  {isMobile ? t('stories.mobile_writing_section_desc') : t('stories.writing_section_desc')}
                </p>
                <div className="pt-1">
                  <Button 
                    onClick={() => navigate('/create-story')} 
                    variant="outline"
                    size={isMobile ? "sm" : "default"}
                    className="group"
                  >
                    <PenLine size={14} className="mr-2" />
                    {t('stories.start_writing')}
                    <ArrowRight size={12} className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
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
