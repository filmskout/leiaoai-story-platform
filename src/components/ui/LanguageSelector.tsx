import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

// 支持的语言列表
const supportedLanguages = [
  {
    code: 'zh-CN',
    name: '简体中文',
    nativeName: '简体中文',
    flag: '🇨🇳'
  },
  {
    code: 'zh-TW', 
    name: '繁體中文',
    nativeName: '繁體中文',
    flag: '🇭🇰'
  },
  {
    code: 'en-US',
    name: 'English',
    nativeName: 'English',
    flag: '🇺🇸'
  },
  {
    code: 'ja-JP',
    name: '日本語',
    nativeName: '日本語',
    flag: '🇯🇵'
  },
  {
    code: 'ko-KR',
    name: '한국어',
    nativeName: '한국어',
    flag: '🇰🇷'
  },
  {
    code: 'fr-FR',
    name: 'Français',
    nativeName: 'Français',
    flag: '🇫🇷'
  },
  {
    code: 'de-DE',
    name: 'Deutsch',
    nativeName: 'Deutsch',
    flag: '🇩🇪'
  },
  {
    code: 'es-ES',
    name: 'Español',
    nativeName: 'Español',
    flag: '🇪🇸'
  },
  {
    code: 'it-IT',
    name: 'Italiano',
    nativeName: 'Italiano',
    flag: '🇮🇹'
  },
  {
    code: 'pt-PT',
    name: 'Português',
    nativeName: 'Português',
    flag: '🇵🇹'
  },
  {
    code: 'ru-RU',
    name: 'Русский',
    nativeName: 'Русский',
    flag: '🇷🇺'
  },
  {
    code: 'ar-SA',
    name: 'العربية',
    nativeName: 'العربية',
    flag: '🇸🇦'
  },
  {
    code: 'hi-IN',
    name: 'हिन्दी',
    nativeName: 'हिन्दी',
    flag: '🇮🇳'
  }
];

interface LanguageSelectorProps {
  className?: string;
  variant?: 'default' | 'header' | 'footer';
}

export function LanguageSelector({ className, variant = 'default' }: LanguageSelectorProps) {
  const { i18n, t } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);
  const [isDetecting, setIsDetecting] = useState(false);

  // 获取当前语言信息
  const getCurrentLanguageInfo = () => {
    return supportedLanguages.find(lang => lang.code === currentLanguage) || supportedLanguages[0];
  };

  // 切换语言
  const changeLanguage = async (languageCode: string) => {
    try {
      await i18n.changeLanguage(languageCode);
      setCurrentLanguage(languageCode);
      
      // 保存用户选择
      localStorage.setItem('leiaoai-language', languageCode);
      
      // 更新HTML lang属性
      document.documentElement.lang = languageCode;
      
      console.log(`Language changed to: ${languageCode}`);
    } catch (error) {
      console.error('Failed to change language:', error);
    }
  };

  // IP地址检测语言
  const detectLanguageByIP = async () => {
    if (isDetecting) return;
    
    setIsDetecting(true);
    try {
      const response = await fetch('https://ipapi.co/json/');
      if (response.ok) {
        const data = await response.json();
        const countryCode = data.country_code;
        
        // 国家代码到语言的映射
        const countryToLanguage: { [key: string]: string } = {
          'CN': 'zh-CN', 'TW': 'zh-TW', 'HK': 'zh-TW', 'MO': 'zh-TW',
          'JP': 'ja-JP', 'KR': 'ko-KR', 'FR': 'fr-FR', 'DE': 'de-DE', 'ES': 'es-ES',
          'PT': 'pt-PT', 'BR': 'pt-PT', 'RU': 'ru-RU', 'IN': 'hi-IN',
          'SA': 'ar-SA', 'AE': 'ar-SA', 'EG': 'ar-SA', 'IT': 'it-IT'
        };
        
        const detectedLanguage = countryToLanguage[countryCode] || 'en-US';
        
        // 如果没有用户保存的语言选择，使用检测到的语言
        const savedLanguage = localStorage.getItem('leiaoai-language');
        if (!savedLanguage) {
          await changeLanguage(detectedLanguage);
        }
      }
    } catch (error) {
      console.error('IP-based language detection failed:', error);
    } finally {
      setIsDetecting(false);
    }
  };

  useEffect(() => {
    // 初始化语言检测
    detectLanguageByIP();
    
    // 监听语言变化
    const handleLanguageChange = () => {
      setCurrentLanguage(i18n.language);
    };
    
    i18n.on('languageChanged', handleLanguageChange);
    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, [i18n]);

  const currentLangInfo = getCurrentLanguageInfo();

  if (variant === 'footer') {
    return (
      <div className={cn('flex items-center space-x-2', className)}>
        <Globe size={16} className="text-foreground-muted" />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-auto p-1 text-sm text-foreground-muted hover:text-foreground"
              disabled={isDetecting}
            >
              {isDetecting ? t('detecting', 'Detecting...') : currentLangInfo.nativeName}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="min-w-[180px]">
            {supportedLanguages.map((language) => (
              <DropdownMenuItem
                key={language.code}
                onClick={() => changeLanguage(language.code)}
                className="flex items-center justify-between py-2 px-3 cursor-pointer hover:bg-primary-50 dark:hover:bg-primary-900/20"
              >
                <div className="flex items-center space-x-2">
                  <span>{language.flag}</span>
                  <span>{language.nativeName}</span>
                </div>
                {currentLanguage === language.code && (
                  <Check size={16} className="text-primary-500" />
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant={variant === 'header' ? 'ghost' : 'outline'} 
          size="sm" 
          className={cn(
            'flex items-center space-x-2',
            variant === 'header' && 'text-foreground-muted hover:text-foreground',
            className
          )}
          disabled={isDetecting}
        >
          <Globe size={16} />
          <span className={variant === 'header' ? 'hidden sm:inline' : ''}>
            {isDetecting ? t('detecting', 'Detecting...') : currentLangInfo.flag}
          </span>
          {variant !== 'header' && (
            <span className="hidden sm:inline">
              {currentLangInfo.nativeName}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[200px] z-[100] bg-background border border-border shadow-lg">
        <div className="px-3 py-2 text-sm font-medium text-foreground border-b border-border">
          {t('language_selector', 'Select Language')}
        </div>
        {supportedLanguages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => changeLanguage(language.code)}
            className="flex items-center justify-between py-2 px-3 cursor-pointer hover:bg-primary-50 dark:hover:bg-primary-900/20"
          >
            <div className="flex items-center space-x-3">
              <span className="text-lg">{language.flag}</span>
              <div>
                <div className="font-medium">{language.nativeName}</div>
                {language.nativeName !== language.name && (
                  <div className="text-xs text-foreground-muted">{language.name}</div>
                )}
              </div>
            </div>
            {currentLanguage === language.code && (
              <Check size={16} className="text-primary-500" />
            )}
          </DropdownMenuItem>
        ))}
        
        <div className="border-t border-border pt-2 mt-2">
          <DropdownMenuItem
            onClick={detectLanguageByIP}
            disabled={isDetecting}
            className="flex items-center space-x-2 py-2 px-3 cursor-pointer text-foreground-muted hover:bg-primary-50 dark:hover:bg-primary-900/20"
          >
            <Globe size={14} />
            <span className="text-sm">
              {isDetecting ? t('detecting', 'Detecting...') : t('auto_detect_language', 'Auto Detect Language')}
            </span>
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default LanguageSelector;
