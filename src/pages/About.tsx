import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { MessageSquare, Upload, Share2, Sparkles, TrendingUp, Globe2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useMobileLayout } from '@/hooks/use-mobile';

const About: React.FC = () => {
  const { actualTheme } = useTheme();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isMobile = useMobileLayout();
  const isEnglish = i18n.language.startsWith('en');

  return (
    <div className={cn(
      "min-h-screen transition-colors duration-300",
      actualTheme === 'dark' ? "bg-gray-900" : "bg-gray-50"
    )}>
      {/* Hero Section - 移动端隐藏 */}
      {!isMobile && (
        <div className={cn(
          "relative py-20 px-4 sm:px-6 lg:px-8",
          actualTheme === 'dark'
            ? "bg-gradient-to-br from-gray-900 via-blue-900/20 to-purple-900/20"
            : "bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50"
        )}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="inline-flex items-center justify-center mb-6">
              <img
                src={actualTheme === 'dark' ? '/leoai-logo-light.png' : '/leoai-logo-dark.png'}
                alt="LeiaoAI"
                className="h-20 w-auto object-contain"
              />
            </div>
            <h1 className={cn(
              "font-bold mb-6",
              actualTheme === 'dark' ? "text-white" : "text-gray-900",
              "text-3xl sm:text-4xl lg:text-5xl"
            )}>
              {t('about.title')}
            </h1>
            <div className={cn(
              "inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8",
              actualTheme === 'dark'
                ? "bg-blue-900/30 text-blue-300"
                : "bg-blue-100 text-blue-700"
            )}>
              <Globe2 size={20} />
              <span className="text-sm font-medium">
                {t('about.slogan_short', i18n.language.startsWith('zh') ? 'AI × 金融 × 创意产业' : 'AI × Finance × Creative Industries')}
              </span>
            </div>
            <p className={cn(
              "text-sm text-center mb-8",
              actualTheme === 'dark' ? "text-gray-400" : "text-gray-600"
            )}>
              {i18n.language.startsWith('zh') ? t('about.company_name_cn') : t('about.company_name_en')}
            </p>
          </div>
        </div>
      </div>
      )}

      {/* Vision & Mission Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className={cn(
          "p-8 rounded-2xl",
          actualTheme === 'dark'
            ? "bg-gray-800/50 border border-gray-700"
            : "bg-white border border-gray-200 shadow-sm"
        )}>
          <h2 className={cn(
            "text-3xl font-bold mb-6",
            actualTheme === 'dark' ? "text-white" : "text-gray-900"
          )}>
            {t('about.vision_mission')}
          </h2>
          
          <div className={cn(
            "prose max-w-none",
            actualTheme === 'dark' ? "prose-invert" : "prose-gray"
          )}>
            <p className="text-lg leading-relaxed">
              {t('about.vision_content')}
            </p>
          </div>
        </div>
      </div>

      {/* Platform Features */}
      <div className={cn(
        "py-16",
        actualTheme === 'dark' ? "bg-gray-800/30" : "bg-gray-100/50"
      )}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className={cn(
            "text-3xl font-bold text-center mb-12",
            actualTheme === 'dark' ? "text-white" : "text-gray-900"
          )}>
            {t('about.what_platform_does')}
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* AI Chat */}
            <div className={cn(
              "p-6 rounded-xl transition-all hover:scale-105",
              actualTheme === 'dark'
                ? "bg-gray-800 border border-gray-700 hover:border-blue-500"
                : "bg-white border border-gray-200 hover:border-blue-400 shadow-sm"
            )}>
              <div className={cn(
                "w-12 h-12 rounded-lg flex items-center justify-center mb-4",
                actualTheme === 'dark' ? "bg-blue-900/30" : "bg-blue-100"
              )}>
                <MessageSquare className="text-blue-500" size={24} />
              </div>
              <h3 className={cn(
                "text-xl font-semibold mb-3",
                actualTheme === 'dark' ? "text-white" : "text-gray-900"
              )}>
                {t('about.ai_investment_expert_title', isEnglish ? 'AI Investment Expert' : 'AI投資專家')}
              </h3>
              <p className={cn(
                "text-sm leading-relaxed",
                actualTheme === 'dark' ? "text-gray-300" : "text-gray-600"
              )}>
                {t('about.ai_investment_expert')}
              </p>
            </div>

            {/* Professional Services */}
            <div className={cn(
              "p-6 rounded-xl transition-all hover:scale-105",
              actualTheme === 'dark'
                ? "bg-gray-800 border border-gray-700 hover:border-purple-500"
                : "bg-white border border-gray-200 hover:border-purple-400 shadow-sm"
            )}>
              <div className={cn(
                "w-12 h-12 rounded-lg flex items-center justify-center mb-4",
                actualTheme === 'dark' ? "bg-purple-900/30" : "bg-purple-100"
              )}>
                <TrendingUp className="text-purple-500" size={24} />
              </div>
              <h3 className={cn(
                "text-xl font-semibold mb-3",
                actualTheme === 'dark' ? "text-white" : "text-gray-900"
              )}>
                {t('about.professional_service_domains_title', isEnglish ? 'Professional Service Domains' : '專業服務領域')}
              </h3>
              <p className={cn(
                "text-sm leading-relaxed",
                actualTheme === 'dark' ? "text-gray-300" : "text-gray-600"
              )}>
                {t('about.professional_service_domains')}
              </p>
            </div>

            {/* BP Analysis */}
            <div className={cn(
              "p-6 rounded-xl transition-all hover:scale-105",
              actualTheme === 'dark'
                ? "bg-gray-800 border border-gray-700 hover:border-green-500"
                : "bg-white border border-gray-200 hover:border-green-400 shadow-sm"
            )}>
              <div className={cn(
                "w-12 h-12 rounded-lg flex items-center justify-center mb-4",
                actualTheme === 'dark' ? "bg-green-900/30" : "bg-green-100"
              )}>
                <Upload className="text-green-500" size={24} />
              </div>
              <h3 className={cn(
                "text-xl font-semibold mb-3",
                actualTheme === 'dark' ? "text-white" : "text-gray-900"
              )}>
                {t('about.ai_bp_analysis_title', isEnglish ? 'AI‑Powered Business Plan Analysis' : 'AI商業計劃書分析')}
              </h3>
              <p className={cn(
                "text-sm leading-relaxed",
                actualTheme === 'dark' ? "text-gray-300" : "text-gray-600"
              )}>
                {t('about.ai_bp_analysis')}
              </p>
            </div>

            {/* BMC */}
            <div className={cn(
              "p-6 rounded-xl transition-all hover:scale-105",
              actualTheme === 'dark'
                ? "bg-gray-800 border border-gray-700 hover:border-orange-500"
                : "bg-white border border-gray-200 hover:border-orange-400 shadow-sm"
            )}>
              <div className={cn(
                "w-12 h-12 rounded-lg flex items-center justify-center mb-4",
                actualTheme === 'dark' ? "bg-orange-900/30" : "bg-orange-100"
              )}>
                <Sparkles className="text-orange-500" size={24} />
              </div>
              <h3 className={cn(
                "text-xl font-semibold mb-3",
                actualTheme === 'dark' ? "text-white" : "text-gray-900"
              )}>
                {t('about.business_model_canvas_title', isEnglish ? 'Business Model Canvas & AI' : '商業模式畫布與AI洞察')}
              </h3>
              <p className={cn(
                "text-sm leading-relaxed",
                actualTheme === 'dark' ? "text-gray-300" : "text-gray-600"
              )}>
                {t('about.business_model_canvas')}
              </p>
            </div>

            {/* Stories */}
            <div className={cn(
              "p-6 rounded-xl transition-all hover:scale-105 md:col-span-2 lg:col-span-1",
              actualTheme === 'dark'
                ? "bg-gray-800 border border-gray-700 hover:border-pink-500"
                : "bg-white border border-gray-200 hover:border-pink-400 shadow-sm"
            )}>
              <div className={cn(
                "w-12 h-12 rounded-lg flex items-center justify-center mb-4",
                actualTheme === 'dark' ? "bg-pink-900/30" : "bg-pink-100"
              )}>
                <Share2 className="text-pink-500" size={24} />
              </div>
              <h3 className={cn(
                "text-xl font-semibold mb-3",
                actualTheme === 'dark' ? "text-white" : "text-gray-900"
              )}>
                {t('about.stories_community_title', isEnglish ? 'Stories & Community' : '用戶故事與社區')}
              </h3>
              <p className={cn(
                "text-sm leading-relaxed",
                actualTheme === 'dark' ? "text-gray-300" : "text-gray-600"
              )}>
                {t('about.stories_community')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className={cn(
          "p-12 rounded-2xl text-center",
          actualTheme === 'dark'
            ? "bg-gradient-to-br from-blue-900/40 to-purple-900/40 border border-blue-800"
            : "bg-gradient-to-br from-blue-100 to-purple-100 border border-blue-200"
        )}>
          <h2 className={cn(
            "text-3xl font-bold mb-4",
            actualTheme === 'dark' ? "text-white" : "text-gray-900"
          )}>
            {t('about.ready_experience', isEnglish ? 'Ready to experience the future of financing?' : '准备开启融资未来体验？')}
          </h2>
          <p className={cn(
            "text-lg mb-8",
            actualTheme === 'dark' ? "text-gray-300" : "text-gray-600"
          )}>
            {t('about.tagline', 'LeiaoAI — empowering the AI economy with intelligence, insight and integrity.')}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => navigate('/ai-chat')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg"
              title={t('about.start_ai_chat_desc', 'Open AI chat for quick answers and guidance')}
            >
              <MessageSquare className="mr-2" size={20} />
              {t('ai_chat.title', 'Start AI Chat')}
            </Button>
            <Button
              onClick={() => navigate('/bp-analysis')}
              variant="outline"
              className={cn(
                "px-8 py-6 text-lg",
                actualTheme === 'dark'
                  ? "border-gray-600 text-white hover:bg-gray-800"
                  : "border-gray-300 text-gray-900 hover:bg-gray-50"
              )}
              title={t('about.upload_bp_desc', 'Upload BP for AI analysis and insights')}
            >
              <Upload className="mr-2" size={20} />
              {t('bp_analysis.upload_bp', 'Upload BP')}
            </Button>
            <Button
              onClick={() => navigate('/stories')}
              variant="outline"
              className={cn(
                "px-8 py-6 text-lg",
                actualTheme === 'dark'
                  ? "border-gray-600 text-white hover:bg-gray-800"
                  : "border-gray-300 text-gray-900 hover:bg-gray-50"
              )}
              title={t('about.share_story_desc', 'Share your story with the community')}
            >
              <Share2 className="mr-2" size={20} />
              {t('about.share_your_story', 'Share Your Story')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;

