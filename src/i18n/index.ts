import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files directly
import enTranslation from '../locales/en.json';
import zhCNTranslation from '../locales/zh-CN.json';
import zhHKTranslation from '../locales/zh-HK.json';
import jaJPTranslation from '../locales/ja-JP.json';
import koKRTranslation from '../locales/ko-KR.json';
import frFRTranslation from '../locales/fr-FR.json';
import deDETranslation from '../locales/de-DE.json';
import esESTranslation from '../locales/es-ES.json';
import itITTranslation from '../locales/it-IT.json';
import ptPTTranslation from '../locales/pt-PT.json';
import ruRUTranslation from '../locales/ru-RU.json';
import arSATranslation from '../locales/ar-SA.json';
import faIRTranslation from '../locales/fa-IR.json';
import hiINTranslation from '../locales/hi-IN.json';
import nlNLTranslation from '../locales/nl-NL.json';
import thTHTranslation from '../locales/th-TH.json';
import viVNTranslation from '../locales/vi-VN.json';

// Create resources object with proper structure
const resources = {
  'en': { translation: enTranslation },
  'zh-CN': { translation: zhCNTranslation },
  'zh-HK': { translation: zhHKTranslation },
  'ja-JP': { translation: jaJPTranslation },
  'ko-KR': { translation: koKRTranslation },
  'fr-FR': { translation: frFRTranslation },
  'de-DE': { translation: deDETranslation },
  'es-ES': { translation: esESTranslation },
  'it-IT': { translation: itITTranslation },
  'pt-PT': { translation: ptPTTranslation },
  'ru-RU': { translation: ruRUTranslation },
  'ar-SA': { translation: arSATranslation },
  'fa-IR': { translation: faIRTranslation },
  'hi-IN': { translation: hiINTranslation },
  'nl-NL': { translation: nlNLTranslation },
  'th-TH': { translation: thTHTranslation },
  'vi-VN': { translation: viVNTranslation }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // Default language
    fallbackLng: {
      'zh-HK': ['zh-HK'],
      'zh-CN': ['zh-CN'],
      'zh': ['zh-CN'],
      'ja': ['ja-JP'],
      'fr': ['fr-FR'],
      'de': ['de-DE'],
      'es': ['es-ES'],
      'it': ['it-IT'],
      'pt': ['pt-PT'],
      'ru': ['ru-RU'],
      'ar': ['ar-SA'],
      'hi': ['hi-IN'],
      'nl': ['nl-NL'],
      'vi': ['vi-VN'],
      'th': ['th-TH'],
      'ko': ['ko-KR'],
      'en-US': ['en'],
      'en-GB': ['en'],
      'default': ['en']
    },
    supportedLngs: ['zh-CN', 'en', 'zh-HK', 'ja-JP', 'ko-KR', 'fr-FR', 'de-DE', 'es-ES', 'it-IT', 'pt-PT', 'ru-RU', 'ar-SA', 'fa-IR', 'hi-IN', 'nl-NL', 'th-TH', 'vi-VN'],
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'cookie', 'navigator', 'htmlTag'],
      lookupLocalStorage: 'leoai-language',
      lookupCookie: 'preferred_language',
      caches: ['localStorage', 'cookie'],
      cookieMinutes: 60 * 24 * 30, // 30天
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
