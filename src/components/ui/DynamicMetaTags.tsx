import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

export function DynamicMetaTags() {
  const { t, i18n } = useTranslation();
  const location = useLocation();

  useEffect(() => {
    // 获取当前路由信息
    const path = location.pathname;
    
    // 设置基础的网站名称和描述
    const appName = t('app_name', '蕾奥AI');
    const appDescription = t('app_description', '专业AI投资平台');
    
    // 根据路由设置不同的页面标题和描述
    let pageTitle = appName;
    let pageDescription = appDescription;
    
    switch (path) {
      case '/':
        pageTitle = `${appName} - ${appDescription}`;
        pageDescription = t('home.hero.description', '基于先进AI技术，为您提供专业投资分析、商业计划书评估和智能决策支持');
        break;
      case '/ai-chat':
        pageTitle = `${t('ai_chat.page_title', 'AI智能投资问答')} - ${appName}`;
        pageDescription = t('ai_chat.page_subtitle', '基于先进AI技术的专业投资问答服务，为您的投资决策提供智能支持');
        break;
      case '/bp-analysis':
        pageTitle = `${t('bp_analysis.title', '商业计划书分析')} - ${appName}`;
        pageDescription = t('bp_analysis.hero_subtitle', '专业商业计划书分析服务基于先进AI技术，为您的创业项目提供深度洞察和优化建议');
        break;
      case '/stories':
        pageTitle = `${t('stories.page_title', '我和AI人工智能的故事')} - ${appName}`;
        pageDescription = t('stories.page_subtitle', '分享AI投融资，工具锐评，学习实践案例');
        break;
      default:
        // 默认设置
        pageTitle = `${appName} - ${appDescription}`;
        break;
    }

    // 更新页面标题
    document.title = pageTitle;
    
    // 更新meta描述
    let metaDescription = document.querySelector('meta[name="description"]') as HTMLMetaElement;
    if (metaDescription) {
      metaDescription.content = pageDescription;
    } else {
      metaDescription = document.createElement('meta');
      metaDescription.name = 'description';
      metaDescription.content = pageDescription;
      document.head.appendChild(metaDescription);
    }
    
    // 更新Open Graph标签
    const updateOgTag = (property: string, content: string) => {
      let ogTag = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement;
      if (ogTag) {
        ogTag.content = content;
      } else {
        ogTag = document.createElement('meta');
        ogTag.setAttribute('property', property);
        ogTag.content = content;
        document.head.appendChild(ogTag);
      }
    };
    
    updateOgTag('og:title', pageTitle);
    updateOgTag('og:description', pageDescription);
    
    // 更新Twitter标签
    const updateTwitterTag = (name: string, content: string) => {
      let twitterTag = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
      if (twitterTag) {
        twitterTag.content = content;
      } else {
        twitterTag = document.createElement('meta');
        twitterTag.name = name;
        twitterTag.content = content;
        document.head.appendChild(twitterTag);
      }
    };
    
    updateTwitterTag('twitter:title', pageTitle);
    updateTwitterTag('twitter:description', pageDescription);
    
    // 更新语言标签
    const htmlElement = document.documentElement;
    htmlElement.lang = i18n.language || 'zh-CN';
    
  }, [t, i18n.language, location.pathname]);

  return null; // 这个组件不渲染任何内容
}
