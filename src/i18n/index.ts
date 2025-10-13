import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    // 使用中文作为备用语言
    fallbackLng: 'zh-CN',
    // 简化为主要语言，避免复杂性
    supportedLngs: ['zh-CN', 'en-US', 'zh-HK', 'ja-JP', 'ko-KR', 'fr-FR', 'de-DE', 'es-ES', 'it-IT', 'pt-PT', 'ru-RU', 'ar-SA', 'hi-IN'],
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    backend: {
      loadPath: '/locales/{{lng}}.json',
      // 添加请求选项以确保文件正确加载
      requestOptions: {
        cache: 'default'
      }
    },
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      lookupLocalStorage: 'leoai-language',
      caches: ['localStorage'],
      // 检测选项
      checkWhitelist: true
    },
    react: {
      useSuspense: false,
      // 确保组件在翻译加载后重新渲染
      bindI18n: 'languageChanged loaded',
      bindI18nStore: 'added removed',
      transEmptyNodeValue: '',
      transSupportBasicHtmlNodes: true,
      transKeepBasicHtmlNodesFor: ['br', 'strong', 'i']
    },
    // 移除可能导致问题的选项
    load: 'all',
    preload: ['zh-CN', 'en-US'],
    // 简化语言检测
    nonExplicitSupportedLngs: false,
    lowerCaseLng: false,
    debug: false,
    // 添加错误处理
    saveMissing: false,
    updateMissing: false,
    // 确保初始化完成
    initImmediate: false
  });

export default i18n;
