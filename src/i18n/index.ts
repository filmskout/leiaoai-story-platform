import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files directly
import enTranslation from '../locales/en.json';
import zhCNTranslation from '../locales/zh-CN.json';
import zhHKTranslation from '../locales/zh-HK.json';
import jaJPTranslation from '../locales/ja-JP.json';
import koKRTranslation from '../locales/ko-KR.json';

// Create resources object with proper structure
const resources = {
  'en-US': { translation: enTranslation },
  'en': { translation: enTranslation },
  'zh-CN': { translation: zhCNTranslation },
  'zh-HK': { translation: zhHKTranslation },
  'ja-JP': { translation: jaJPTranslation },
  'ko-KR': { translation: koKRTranslation },
  'fr-FR': { translation: enTranslation }, // Fallback to English
  'de-DE': { translation: enTranslation }, // Fallback to English
  'es-ES': { translation: enTranslation }, // Fallback to English
  'it-IT': { translation: enTranslation }, // Fallback to English
  'pt-PT': { translation: enTranslation }, // Fallback to English
  'ru-RU': { translation: enTranslation }, // Fallback to English
  'ar-SA': { translation: enTranslation }, // Fallback to English
  'hi-IN': { translation: enTranslation }, // Fallback to English
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en-US', // Default language
    fallbackLng: {
      'zh-HK': ['zh-HK'],
      'zh-CN': ['zh-CN'],
      'zh': ['zh-CN'],
      'default': ['en-US']
    },
    supportedLngs: ['zh-CN', 'en-US', 'zh-HK', 'ja-JP', 'ko-KR', 'fr-FR', 'de-DE', 'es-ES', 'it-IT', 'pt-PT', 'ru-RU', 'ar-SA', 'hi-IN'],
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      lookupLocalStorage: 'leoai-language',
      caches: ['localStorage'],
      checkWhitelist: true
    },
    react: {
      useSuspense: false,
      bindI18n: 'languageChanged loaded',
      bindI18nStore: 'added removed',
      transEmptyNodeValue: '',
      transSupportBasicHtmlNodes: true,
      transKeepBasicHtmlNodesFor: ['br', 'strong', 'i']
    },
    debug: true, // Enable debug to see what's happening
    saveMissing: false,
    updateMissing: false,
    initImmediate: true // Change to true for immediate initialization
  });

export default i18n;
