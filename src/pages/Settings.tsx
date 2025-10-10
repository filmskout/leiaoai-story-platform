import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { useLanguage, supportedLanguages } from '@/contexts/LanguageContext';
import { useTheme, type Theme } from '@/contexts/ThemeContext';
import { useAI } from '@/contexts/AIContext';
import { useGamification } from '@/hooks/useGamification';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { AvatarUploadDialog } from '@/components/ui/AvatarUploadDialog';
import { 
  Settings as SettingsIcon, 
  Globe, 
  Palette, 
  Bot, 
  Monitor,
  Sun,
  Moon,
  Check,
  User,
  Camera,
  Upload,
  Trophy,
  Star,
  Save,
  AlertCircle,
  Tag,
  MapPin,
  Link,
  Building,
  Mail
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface BadgeItem {
  id: string;
  badge_type: string;
  badge_name: string;
  badge_description: string;
  earned_at: string;
}

interface ProfileFormData {
  full_name: string;
  bio: string;
  location: string;
  company: string;
  website_url: string;
  avatar_url?: string;
}

export default function EnhancedSettings() {
  const { t } = useTranslation();
  const { user, updateProfile } = useAuth();
  const { currentLanguage, changeLanguage } = useLanguage();
  const { theme, setTheme, actualTheme } = useTheme();
  const { selectedChatModel, selectedImageModel, modelConfigs, setSelectedChatModel, setSelectedImageModel } = useAI();
  const { badges = [], loadBadges } = useGamification();

  const [profileForm, setProfileForm] = useState<ProfileFormData>({
    full_name: '',
    bio: '',
    location: '',
    company: '',
    website_url: ''
  });
  
  const [selectedBadges, setSelectedBadges] = useState<string[]>([]);
  const [popularTags, setPopularTags] = useState<any[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [showAvatarDialog, setShowAvatarDialog] = useState(false);
  const [error, setError] = useState('');

  const themeOptions: { value: Theme; label: string; icon: React.ReactNode }[] = [
    { value: 'light', label: t('settings.theme_light'), icon: <Sun size={16} /> },
    { value: 'dark', label: t('settings.theme_dark'), icon: <Moon size={16} /> },
    { value: 'auto', label: t('settings.theme_auto'), icon: <Monitor size={16} /> }
  ];

  useEffect(() => {
    if (user) {
      loadUserProfile();
      loadBadges();
      loadUserTags();
      loadSelectedBadges();
    }
  }, [user, loadBadges]);

  const loadUserProfile = async () => {
    if (!user) return;

    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error loading profile:', error);
      }

      if (profile) {
        setProfileForm({
          full_name: profile.full_name || '',
          bio: profile.bio || '',
          location: profile.location || '',
          company: profile.company || '',
          website_url: profile.website_url || '',
          avatar_url: profile.avatar_url || ''
        });
      } else {
        // Set defaults from user metadata or empty values
        setProfileForm({
          full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || '',
          bio: user.user_metadata?.bio || '',
          location: user.user_metadata?.location || '',
          company: user.user_metadata?.company || '',
          website_url: user.user_metadata?.website_url || '',
          avatar_url: user.user_metadata?.avatar_url || ''
        });
      }
    } catch (error) {
      console.error('Failed to load user profile:', error);
    }
  };

  const loadSelectedBadges = async () => {
    if (!user) return;

    try {
      const { data: preferences, error } = await supabase
        .from('user_preferences')
        .select('preferred_badges')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error loading selected badges:', error);
        return;
      }

      if (preferences?.preferred_badges && Array.isArray(preferences.preferred_badges)) {
        setSelectedBadges(preferences.preferred_badges);
      }
    } catch (error) {
      console.error('Failed to load selected badges:', error);
    }
  };

  const loadUserTags = async () => {
    if (!user) return;

    try {
      const { data: userStoryTags, error } = await supabase
        .from('story_tags')
        .select(`
          tags!inner(name),
          stories!inner(author_id)
        `)
        .eq('stories.author_id', user.id);

      if (error) {
        console.error('Error loading user tags:', error);
        return;
      }

      if (userStoryTags) {
        const tagCounts: Record<string, any> = {};
        userStoryTags.forEach(assignment => {
          const tag = assignment.tags;
          if (tag && tag.name) {
            if (tagCounts[tag.name]) {
              tagCounts[tag.name].count++;
            } else {
              tagCounts[tag.name] = {
                name: tag.name,
                display_name: tag.name,
                color: '#3B82F6',
                count: 1
              };
            }
          }
        });
        
        const popularTagsArray = Object.values(tagCounts)
          .sort((a: any, b: any) => b.count - a.count)
          .slice(0, 10);
        
        setPopularTags(popularTagsArray);
      }
    } catch (error) {
      console.error('Failed to load user tags:', error);
    }
  };

  const handleAvatarUpdate = (avatarUrl: string) => {
    setProfileForm(prev => ({ ...prev, avatar_url: avatarUrl }));
  };

  const handleBadgeToggle = (badgeId: string) => {
    setSelectedBadges(prev => {
      if (prev.includes(badgeId)) {
        return prev.filter(id => id !== badgeId);
      } else if (prev.length < 3) {
        return [...prev, badgeId];
      } else {
        toast.warning(t('settings.max_badges', 'You can select up to 3 badges to showcase'));
        return prev;
      }
    });
  };

  const handleSaveProfile = async () => {
    if (!user) return;

    setIsSaving(true);
    setError('');

    try {
      // Update profile through auth context
      if (updateProfile) {
        await updateProfile(profileForm);
      }

      // Save selected badges preferences
      const { error: prefsError } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: user.id,
          preferred_badges: selectedBadges,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        });

      if (prefsError) {
        console.error('Error saving preferences:', prefsError);
        // Don't throw here - profile update might have succeeded
      }

      toast.success(t('settings.profile_saved', 'Profile updated successfully'));
    } catch (error: any) {
      console.error('Failed to save profile:', error);
      setError(error.message || t('settings.save_error', 'Failed to save profile'));
      toast.error(error.message || t('settings.save_error', 'Failed to save profile'));
    } finally {
      setIsSaving(false);
    }
  };

  const getBadgeIcon = (badgeType: string) => {
    switch (badgeType) {
      case 'storyteller_novice':
      case 'storyteller_active':
      case 'storyteller_master':
      case 'storyteller_legend':
        return <Star className="w-4 h-4" />;
      default:
        return <Trophy className="w-4 h-4" />;
    }
  };

  const getBadgeColor = (badgeType: string) => {
    if (badgeType.includes('legend')) return 'bg-gradient-to-r from-yellow-400 to-orange-500';
    if (badgeType.includes('master')) return 'bg-gradient-to-r from-purple-500 to-pink-500';
    if (badgeType.includes('active')) return 'bg-gradient-to-r from-blue-500 to-cyan-500';
    return 'bg-gradient-to-r from-gray-500 to-gray-600';
  };

  if (!user) {
    return (
      <div className="text-center py-12">
        <User className="w-16 h-16 mx-auto mb-4 text-gray-400" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('auth.login_required', 'Please log in')}</h3>
        <p className="text-gray-600">{t('settings.login_desc', 'You need to be logged in to access settings')}</p>
      </div>
    );
  }

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

        {/* Profile Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="text-primary-500" size={20} />
              {t('settings.profile_information', 'Profile Information')}
            </CardTitle>
            <CardDescription>
              {t('settings.profile_description', 'Manage your public profile and personal information')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Avatar Section */}
            <div className="flex items-center space-x-6">
              <div className="relative">
                <Avatar className="w-20 h-20">
                  <AvatarImage 
                    src={profileForm.avatar_url || '/default-user-avatar-placeholder-modern-clean.jpg'} 
                    alt={profileForm.full_name || 'User'}
                  />
                  <AvatarFallback>
                    {(profileForm.full_name || user.email || 'U')[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <button
                  onClick={() => setShowAvatarDialog(true)}
                  className="absolute -bottom-2 -right-2 bg-primary-500 text-white rounded-full p-2 cursor-pointer hover:bg-primary-600 transition-colors"
                  title={t('settings.change_avatar', 'Change Avatar')}
                >
                  <Camera className="w-4 h-4" />
                </button>
              </div>
              <div>
                <h3 className="font-medium text-foreground mb-1">{t('settings.profile_photo', 'Profile Photo')}</h3>
                <p className="text-sm text-foreground-muted mb-2">
                  {t('settings.photo_requirements', 'JPG, PNG or GIF. Max size 5MB.')}
                </p>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => setShowAvatarDialog(true)}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {t('settings.change_avatar', 'Change Avatar')}
                </Button>
              </div>
            </div>

            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  <User className="w-4 h-4 inline mr-1" />
                  {t('settings.full_name', 'Full Name')}
                </label>
                <Input
                  value={profileForm.full_name}
                  onChange={(e) => setProfileForm(prev => ({ ...prev, full_name: e.target.value }))}
                  placeholder={t('settings.full_name_placeholder', 'Enter your full name')}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  <Mail className="w-4 h-4 inline mr-1" />
                  {t('settings.email', 'Email')}
                </label>
                <Input
                  value={user.email}
                  disabled
                  className="bg-gray-50 dark:bg-gray-800"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                {t('settings.bio', 'Bio')}
              </label>
              <Textarea
                value={profileForm.bio}
                onChange={(e) => setProfileForm(prev => ({ ...prev, bio: e.target.value }))}
                placeholder={t('settings.bio_placeholder', 'Tell us about yourself...')}
                rows={3}
                maxLength={500}
              />
              <p className="text-xs text-foreground-muted mt-1">
                {profileForm.bio.length}/500 {t('common.characters', 'characters')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  {t('settings.location', 'Location')}
                </label>
                <Input
                  value={profileForm.location}
                  onChange={(e) => setProfileForm(prev => ({ ...prev, location: e.target.value }))}
                  placeholder={t('settings.location_placeholder', 'City, Country')}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  <Building className="w-4 h-4 inline mr-1" />
                  {t('settings.company', 'Company')}
                </label>
                <Input
                  value={profileForm.company}
                  onChange={(e) => setProfileForm(prev => ({ ...prev, company: e.target.value }))}
                  placeholder={t('settings.company_placeholder', 'Your company or organization')}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                <Link className="w-4 h-4 inline mr-1" />
                {t('settings.website', 'Website')}
              </label>
              <Input
                value={profileForm.website_url}
                onChange={(e) => setProfileForm(prev => ({ ...prev, website_url: e.target.value }))}
                placeholder={t('settings.website_placeholder', 'https://your-website.com')}
                type="url"
              />
            </div>

            {error && (
              <div className="flex items-center space-x-2 text-red-600 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            <Button onClick={handleSaveProfile} disabled={isSaving} className="w-full md:w-auto">
              {isSaving ? (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              {t('settings.save_profile', 'Save Profile')}
            </Button>
          </CardContent>
        </Card>

        {/* Badge Showcase */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="text-primary-500" size={20} />
              {t('settings.badge_showcase', 'Badge Showcase')}
            </CardTitle>
            <CardDescription>
              {t('settings.badge_description', 'Select up to 3 badges to display on your profile')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {badges.length === 0 ? (
              <p className="text-foreground-muted text-center py-8">
                {t('settings.no_badges', 'No badges earned yet. Complete activities to earn badges!')}
              </p>
            ) : (
              <div className="space-y-4">
                <div className="text-sm text-foreground-muted">
                  {t('settings.selected_badges', 'Selected badges')}: {selectedBadges.length}/3
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {badges.map((badge) => (
                    <div
                      key={badge.id}
                      onClick={() => handleBadgeToggle(badge.id)}
                      className={cn(
                        'p-3 rounded-lg border cursor-pointer transition-all duration-200',
                        selectedBadges.includes(badge.id)
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-border bg-background hover:border-primary-300'
                      )}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-full ${getBadgeColor(badge.badge_type)} flex items-center justify-center text-white`}>
                          {getBadgeIcon(badge.badge_type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-foreground">{badge.badge_name}</h4>
                            {selectedBadges.includes(badge.id) && (
                              <Check className="text-primary-500" size={16} />
                            )}
                          </div>
                          <p className="text-sm text-foreground-muted">{badge.badge_description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Popular Tags */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Tag className="text-primary-500" size={20} />
              {t('settings.content_tags', 'Your Content Tags')}
            </CardTitle>
            <CardDescription>
              {t('settings.tags_description', 'Tags from your published stories')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {popularTags.length === 0 ? (
              <p className="text-foreground-muted text-center py-8">
                {t('settings.no_tags', 'No tags used yet. Publish stories to see your tag usage!')}
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {popularTags.map((tag) => (
                  <Badge 
                    key={tag.name} 
                    variant="secondary" 
                    className="text-sm py-1 px-3"
                    style={{ backgroundColor: tag.color + '20', color: tag.color }}
                  >
                    {tag.display_name}
                    <span className="ml-2 text-xs opacity-75 bg-white/20 rounded px-1">
                      {tag.count}
                    </span>
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Language Settings */}
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

        {/* Theme Settings */}
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

        {/* AI Model Preferences */}
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
            {/* Chat Model */}
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

            {/* Image Model */}
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
      </div>

      {/* Avatar Upload Dialog */}
      <AvatarUploadDialog
        open={showAvatarDialog}
        onClose={() => setShowAvatarDialog(false)}
        onAvatarUpdate={handleAvatarUpdate}
        userId={user?.id || ''}
        currentAvatarUrl={profileForm.avatar_url}
        userName={profileForm.full_name || user?.email || 'User'}
      />
    </div>
  );
}