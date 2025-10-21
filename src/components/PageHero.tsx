import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useMobileLayout } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface PageHeroProps {
  titleKey: string;
  subtitleKey: string;
  icon?: LucideIcon;
  className?: string;
  children?: React.ReactNode;
}

export const PageHero: React.FC<PageHeroProps> = ({ 
  titleKey, 
  subtitleKey, 
  icon: Icon,
  className,
  children 
}) => {
  const { t } = useTranslation();
  const isMobile = useMobileLayout();

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <section className={cn(
      "bg-gradient-subtle",
      isMobile ? "hidden" : "py-12 px-4", // 移动端隐藏
      className
    )}>
      <div className="container-custom">
        <motion.div variants={itemVariants} className={cn(
          "mx-auto text-center space-y-3",
          isMobile ? "max-w-sm" : "max-w-3xl space-y-4"
        )}>
          {Icon && (
            <div className={cn(
              "inline-flex items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900/30 mb-3",
              isMobile ? "w-12 h-12 mb-2" : "w-16 h-16 mb-4"
            )}>
              <Icon className="text-primary-600" size={isMobile ? 20 : 24} />
            </div>
          )}
          <h1 className={cn(
            "font-bold text-foreground leading-tight",
            isMobile ? "text-2xl" : "text-4xl md:text-5xl"
          )}>
            {t(titleKey)}
          </h1>
          <p className={cn(
            "text-foreground-secondary leading-relaxed",
            isMobile ? "text-base" : "text-xl"
          )}>
            {t(subtitleKey)}
          </p>
          {children && (
            <div className={cn(
              "pt-4",
              isMobile ? "" : "md:block"
            )}>
              {children}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
};