import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { MessageSquare, Upload, Share2, Sparkles, TrendingUp, Globe2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const About: React.FC = () => {
  const { actualTheme } = useTheme();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isEnglish = i18n.language.startsWith('en');

  return (
    <div className={cn(
      "min-h-screen transition-colors duration-300",
      actualTheme === 'dark' ? "bg-gray-900" : "bg-gray-50"
    )}>
      {/* Hero Section */}
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
                {i18n.language.startsWith('zh') ? 'AI × 金融 × 创意产业' : 'AI × Finance × Creative Industries'}
              </span>
            </div>
            <p className={cn(
              "text-sm text-center mb-8",
              actualTheme === 'dark' ? "text-gray-400" : "text-gray-600"
            )}>
              {i18n.language.startsWith('zh')
                ? t('about.company_name_cn')
                : t('about.company_name_en')
              }
            </p>
          </div>
        </div>
      </div>

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
                {isEnglish ? 'AI Investment Expert' : 'AI投资专家'}
              </h3>
              <p className={cn(
                "text-sm leading-relaxed",
                actualTheme === 'dark' ? "text-gray-300" : "text-gray-600"
              )}>
                {isEnglish 
                  ? 'Ask any investment‑related question and get immediate, model‑optimized answers. Choose from recommended, fastest or localised models for topics such as macroeconomic trends, CVC investment, M&A strategy and IPO planning. Support for voice input and chat history makes getting advice as simple as a conversation.'
                  : '针对宏观经济、CVC投资、并购策略、IPO规划等问题，提供即时的模型优化解答。可选择推荐模型、极速模型或本地化模型，并支持语音输入和对话历史。'
                }
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
                {isEnglish ? 'Professional Service Domains' : '专业服务领域'}
              </h3>
              <p className={cn(
                "text-sm leading-relaxed",
                actualTheme === 'dark' ? "text-gray-300" : "text-gray-600"
              )}>
                {isEnglish
                  ? 'Dive into curated areas covering macroeconomic analysis, investment environments, CVC investment, valuation models, exit strategies, ESG compliance and more. Each domain card suggests targeted questions to help you explore relevant issues quickly.'
                  : '包含宏观经济分析、投资环境、CVC产业投资、估值模型、退出策略、ESG合规等多个主题。每个领域卡片都提供针对性的建议和推荐问题，帮助用户快速聚焦。'
                }
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
                {isEnglish ? 'AI-Powered BP Analysis' : 'AI商业计划书分析'}
              </h3>
              <p className={cn(
                "text-sm leading-relaxed",
                actualTheme === 'dark' ? "text-gray-300" : "text-gray-600"
              )}>
                {isEnglish
                  ? 'Upload your business plan (PDF or DOCX) to receive an AI‑generated report on structure, market potential, risk exposure and growth trajectory. The system scores each section and offers actionable recommendations for improvement.'
                  : '上传您的BP（PDF或DOCX），系统将从结构、市场潜力、风险敞口和成长路径等方面进行AI分析，并提供综合评分和改进建议。'
                }
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
                {isEnglish ? 'Business Model Canvas & AI' : '商业模式画布与AI洞察'}
              </h3>
              <p className={cn(
                "text-sm leading-relaxed",
                actualTheme === 'dark' ? "text-gray-300" : "text-gray-600"
              )}>
                {isEnglish
                  ? 'Beyond document upload, our AI helps you refine your business model canvas, turning a static framework into a dynamic, data‑driven blueprint.'
                  : '除文件上传外，AI还可帮助您优化商业模式画布，让静态框架成为动态的数据驱动蓝图。'
                }
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
                {isEnglish ? 'Stories & Community' : '用户故事与社区'}
              </h3>
              <p className={cn(
                "text-sm leading-relaxed",
                actualTheme === 'dark' ? "text-gray-300" : "text-gray-600"
              )}>
                {isEnglish
                  ? 'Share your journey using AI for investment analysis, financial modelling or entrepreneurship. Discover stories on AI tools, startup interviews, investment outlooks and financial AI applications. Our community turns individual experiences into collective intelligence.'
                  : '分享您在投资分析、财务建模或创业过程中使用AI的经验。浏览AI工具体验、创业访谈、投资展望和金融AI应用等类别的故事，让个体经验汇聚成集体智慧。'
                }
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
            {isEnglish ? 'Ready to Experience the Future of Financing?' : '准备开启融资未来体验？'}
          </h2>
          <p className={cn(
            "text-lg mb-8",
            actualTheme === 'dark' ? "text-gray-300" : "text-gray-600"
          )}>
            {isEnglish 
              ? 'LeiaoAI — empowering the AI economy with intelligence, insight and integrity.'
              : '蕾奥AI——以智能、洞察与诚信，赋能AI经济的未来。'
            }
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => navigate('/ai-chat')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg"
            >
              <MessageSquare className="mr-2" size={20} />
              {isEnglish ? 'Start AI Chat' : '启动AI问答'}
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
            >
              <Upload className="mr-2" size={20} />
              {isEnglish ? 'Upload Your BP' : '上传BP分析'}
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
            >
              <Share2 className="mr-2" size={20} />
              {isEnglish ? 'Share Your Story' : '分享故事'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;

