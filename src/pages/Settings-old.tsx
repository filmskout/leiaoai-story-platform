import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguage, supportedLanguages } from '@/contexts/LanguageContext';
import { useTheme, type Theme } from '@/contexts/ThemeContext';
import { useAI } from '@/contexts/AIContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Settings as SettingsIcon, 
  Globe, 
  Palette, 
  Bot, 
  Monitor,
  Sun,
  Moon,
  Check
} from 'lucide-react';
import { cn } from '@/lib/utils';


export default function Settings() {
  const { t } = useTranslation();
  const { currentLanguage, changeLanguage } = useLanguage();
  const { theme, setTheme, actualTheme } = useTheme();
  const { selectedChatModel, selectedImageModel, modelConfigs, setSelectedChatModel, setSelectedImageModel } = useAI();

  const themeOptions: { value: Theme; label: string; icon: React.ReactNode }[] = [
    { value: 'light', label: t('settings.theme_light'), icon: <Sun size={16} /> },
    { value: 'dark', label: t('settings.theme_dark'), icon: <Moon size={16} /> },
    { value: 'auto', label: t('settings.theme_auto'), icon: <Monitor size={16} /> }
  ];

  return (
    <div className="container-custom py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-4 flex items-center gap-3">
              <SettingsIcon className="text-primary-500" size={32} />
              {t('settings.title')}
            </h1>
            <p className="text-lg text-foreground-secondary">
              {t('settings.description', 'Personalize your LeoAI experience')}
            </p>
          </div>

          {/* 语言设置 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="text-primary-500" size={20} />
                {t('settings.language')}
              </CardTitle>
              <CardDescription>
                {t('settings.language_description', 'Choose your preferred language')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {supportedLanguages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => changeLanguage(lang.code)}
                    className={cn(
                      'p-3 rounded-lg text-left transition-all duration-200 border',
                      'hover:border-primary-300 hover:bg-primary-50 dark:hover:bg-primary-900/20',
                      currentLanguage === lang.code
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                        : 'border-border bg-background'
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-foreground">
                          {lang.flag} {lang.name}
                        </div>
                        <div className="text-xs text-foreground-muted">
                          {lang.code}
                        </div>
                      </div>
                      {currentLanguage === lang.code && (
                        <Check className="text-primary-500" size={16} />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 主题设置 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="text-primary-500" size={20} />
                {t('settings.theme')}
              </CardTitle>
              <CardDescription>
                {t('settings.theme_description', 'Choose your visual theme preference')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-3">
                {themeOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setTheme(option.value)}
                    className={cn(
                      'p-4 rounded-lg text-left transition-all duration-200 border',
                      'hover:border-primary-300 hover:bg-primary-50 dark:hover:bg-primary-900/20',
                      theme === option.value
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                        : 'border-border bg-background'
                    )}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      {option.icon}
                      <span className="font-medium text-foreground">
                        {option.label}
                      </span>
                      {theme === option.value && (
                        <Check className="text-primary-500 ml-auto" size={16} />
                      )}
                    </div>
                    <div className="text-xs text-foreground-muted">
                      {option.value === 'auto' && (
                        `${t('settings.current')}: ${actualTheme === 'light' ? t('settings.light') : t('settings.dark')}`
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* AI模型设置 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="text-primary-500" size={20} />
                {t('settings.ai_preferences')}
              </CardTitle>
              <CardDescription>
                {t('settings.ai_description', 'Choose your preferred AI models')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* 对话模型 */}
              <div>
                <h4 className="font-medium text-foreground mb-3">
                  {t('settings.preferred_chat_model')}
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  {modelConfigs?.chat.available.map((model) => (
                    <button
                      key={model.id}
                      onClick={() => model.enabled && setSelectedChatModel(model.id)}
                      disabled={!model.enabled}
                      className={cn(
                        'p-3 rounded-lg text-left transition-all duration-200 border',
                        'disabled:opacity-50 disabled:cursor-not-allowed',
                        model.enabled && 'hover:border-primary-300 hover:bg-primary-50 dark:hover:bg-primary-900/20',
                        selectedChatModel === model.id && model.enabled
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-border bg-background'
                      )}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-foreground">
                          {model.name}
                        </span>
                        {selectedChatModel === model.id && model.enabled && (
                          <Check className="text-primary-500" size={16} />
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {model.recommended && (
                          <span className="text-xs px-2 py-1 bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 rounded-full">
                            {t('settings.recommended', 'Recommended')}
                          </span>
                        )}
                        <span className="text-xs text-foreground-muted">
                          {model.enabled ? t('settings.available', 'Available') : t('settings.unavailable', 'Unavailable')}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* 图像模型 */}
              <div>
                <h4 className="font-medium text-foreground mb-3">
                  {t('settings.preferred_image_model')}
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  {modelConfigs?.image.available.map((model) => (
                    <button
                      key={model.id}
                      onClick={() => model.enabled && setSelectedImageModel(model.id)}
                      disabled={!model.enabled}
                      className={cn(
                        'p-3 rounded-lg text-left transition-all duration-200 border',
                        'disabled:opacity-50 disabled:cursor-not-allowed',
                        model.enabled && 'hover:border-primary-300 hover:bg-primary-50 dark:hover:bg-primary-900/20',
                        selectedImageModel === model.id && model.enabled
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-border bg-background'
                      )}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-foreground">
                          {model.name}
                        </span>
                        {selectedImageModel === model.id && model.enabled && (
                          <Check className="text-primary-500" size={16} />
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {model.recommended && (
                          <span className="text-xs px-2 py-1 bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 rounded-full">
                            {t('settings.recommended', 'Recommended')}
                          </span>
                        )}
                        <span className="text-xs text-foreground-muted">
                          {model.enabled ? t('settings.available', 'Available') : t('settings.unavailable', 'Unavailable')}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 其他设置 */}
          <Card>
            <CardHeader>
              <CardTitle>{t('settings.general')}</CardTitle>
              <CardDescription>
                {t('settings.general_description', 'Other general setting options')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <div>
                    <div className="font-medium text-foreground">{t('settings.notifications')}</div>
                    <div className="text-sm text-foreground-muted">{t('settings.notifications_desc', 'Notification settings')}</div>
                  </div>
                  <Button variant="outline" size="sm">
                    配置
                  </Button>
                </div>
                
                <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <div>
                    <div className="font-medium text-foreground">{t('settings.privacy')}</div>
                    <div className="text-sm text-foreground-muted">{t('settings.privacy_desc', 'Privacy settings')}</div>
                  </div>
                  <Button variant="outline" size="sm">
                    配置
                  </Button>
                </div>
                
                <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <div>
                    <div className="font-medium text-foreground">{t('settings.data_export')}</div>
                    <div className="text-sm text-foreground-muted">{t('settings.data_export_desc', 'Export your data')}</div>
                  </div>
                  <Button variant="outline" size="sm">
                    {t('settings.export', 'Export')}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
    </div>
  );
}