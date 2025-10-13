import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Upload, FileText, Download, Lightbulb, BarChart3, Target, DollarSign, Users, Zap, CheckCircle, AlertTriangle, TrendingUp, Layers } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BPUploadAnalysis } from '@/components/bp/BPUploadAnalysis';
import BMCCanvas from '@/components/BMCCanvas';
import { cn } from '@/lib/utils';
import { useMobileLayout } from '@/hooks/use-mobile';

export default function BPAnalysis() {
  const { t } = useTranslation();
  const isMobile = useMobileLayout();
  const [activeTab, setActiveTab] = useState('upload');

  // Debug tab changes
  useEffect(() => {
    console.log('Active tab changed to:', activeTab);
  }, [activeTab]);

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

  const features = [
    {
      icon: Upload,
      title: t('bp_analysis.features.ai_analysis'),
      description: t('bp_analysis.features.ai_analysis_desc')
    },
    {
      icon: BarChart3,
      title: t('bp_analysis.features.market_insights'),
      description: t('bp_analysis.features.market_insights_desc')
    },
    {
      icon: Target,
      title: t('bp_analysis.features.risk_assessment'),
      description: t('bp_analysis.features.risk_assessment_desc')
    },
    {
      icon: TrendingUp,
      title: t('bp_analysis.features.growth_projections'),
      description: t('bp_analysis.features.growth_projections_desc')
    }
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-background"
    >
      {/* Hero Section */}
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
              <FileText className="text-primary-600" size={isMobile ? 20 : 24} />
            </div>
            <h1 className={cn(
              "font-bold text-foreground leading-tight",
              isMobile ? "text-2xl" : "text-4xl md:text-5xl"
            )}>
              {isMobile ? t('bp_analysis.mobile_page_title') : t('bp_analysis.page_title')}
            </h1>
            <p className={cn(
              "text-foreground-secondary leading-relaxed",
              isMobile ? "text-base" : "text-xl"
            )}>
              {isMobile ? t('bp_analysis.mobile_page_subtitle') : t('bp_analysis.page_subtitle')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className={cn(
        "px-4",
        isMobile ? "py-8" : "py-16"
      )}>
        <div className="container-custom">
          <div>
            <Tabs 
              value={activeTab} 
              onValueChange={(value) => {
                console.log('Tab change triggered:', value);
                setActiveTab(value);
              }} 
              className="w-full"
              style={{ zIndex: 1000 }}
            >
              <TabsList className="grid w-full grid-cols-2 h-14 mb-8">
                <TabsTrigger value="upload" className="flex items-center gap-2 text-sm px-4">
                  <Upload size={16} />
                  <span className="hidden sm:inline">{t('bp_analysis_tab_upload', t('bp_analysis.tabs.upload', 'Document Upload'))}</span>
                  <span className="sm:hidden">{t('bp_analysis.tabs.upload_short', 'Upload')}</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="canvas" 
                  className="flex items-center gap-2 text-sm px-4"
                  onClick={() => {
                    console.log('Direct canvas tab click');
                    setActiveTab('canvas');
                  }}
                >
                  <Layers size={16} />
                  <span className="hidden sm:inline">{t('bp_analysis_tab_canvas', t('bp_analysis.tabs.canvas', 'Business Model Canvas'))}</span>
                  <span className="sm:hidden">{t('bp_analysis.tabs.canvas_short', 'BMC')}</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="upload" className="space-y-6">
                <BPUploadAnalysis />
              </TabsContent>

              <TabsContent value="canvas" className="space-y-6">
                <div className="bg-background rounded-xl border border-border p-4">
                  <BMCCanvas />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>
    </motion.div>
  );
}