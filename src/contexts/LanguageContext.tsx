import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

// 支持的语言列表
export const supportedLanguages = [
  { code: 'zh-CN', name: '简体中文', flag: '🇨🇳' },
  { code: 'zh-HK', name: '繁體中文', flag: '🇭🇰' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'ja-JP', name: '日本語', flag: '🇯🇵' },
  { code: 'ko-KR', name: '한국어', flag: '🇰🇷' },
  { code: 'fr-FR', name: 'Français', flag: '🇫🇷' },
  { code: 'de-DE', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'es-ES', name: 'Español', flag: '🇪🇸' },
  { code: 'pt-PT', name: 'Português', flag: '🇵🇹' },
  { code: 'it-IT', name: 'Italiano', flag: '🇮🇹' },
  { code: 'ru-RU', name: 'Русский', flag: '🇷🇺' },
  { code: 'ar-SA', name: 'العربية', flag: '🇸🇦' },
  { code: 'hi-IN', name: 'हिन्दी', flag: '🇮🇳' }
];

interface LanguageContextType {
  currentLanguage: string;
  changeLanguage: (lang: string) => void;
  getSupportedLanguages: () => typeof supportedLanguages;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const { i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language || 'zh-CN');
  const [isRTL, setIsRTL] = useState(false);

  useEffect(() => {
    const handleLanguageChange = (lng: string) => {
      setCurrentLanguage(lng);
      // 针对阿拉伯语是RTL布局
      setIsRTL(lng.startsWith('ar'));
      
      // Update document direction
      document.documentElement.dir = lng.startsWith('ar') ? 'rtl' : 'ltr';
      document.documentElement.lang = lng;
    };

    // Set initial state
    handleLanguageChange(i18n.language);

    // Listen for language changes
    i18n.on('languageChanged', handleLanguageChange);

    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, [i18n]);

  const changeLanguage = async (lang: string) => {
    try {
      await i18n.changeLanguage(lang);
      // Save to localStorage for persistence
      localStorage.setItem('leoai-language', lang);
    } catch (error) {
      console.error('Failed to change language:', error);
    }
  };

  const getSupportedLanguages = () => supportedLanguages;

  const value = {
    currentLanguage,
    changeLanguage,
    getSupportedLanguages,
    isRTL
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

// Utility function to get language display name
export function getLanguageDisplayName(code: string): string {
  const lang = supportedLanguages.find(l => l.code === code);
  return lang ? `${lang.flag} ${lang.name}` : code;
}