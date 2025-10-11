import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { useTranslation } from 'react-i18next';
import {
  User,
  MapPin,
  Link as LinkIcon,
  Calendar,
  FileText,
  Heart,
  MessageSquare,
  Bookmark,
  Trophy,
  Award,
  Share2,
  UserPlus,
  UserCheck,
  Eye,
  TrendingUp,
  Loader2,
  Building,
  Globe
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface PublicUserProfile {
  id: string;
  full_name: string;
  bio: string;
  avatar_url: string;
  location_name: string;
  company: string;
  website_url: string;
  created_at: string;
}

interface UserStats {
  storiesPublished: number;
  totalLikes: number;
  totalComments: number;
  totalViews: number;
  followers: number;
  following: number;
}

export default function UserProfile() {
  const { id } = useParams<{ id: string }>();
  const { user: currentUser } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [profile, setProfile] = useState<PublicUserProfile | null>(null);
  const [stats, setStats] = useState<UserStats>({
    storiesPublished: 0,
    totalLikes: 0,
    totalComments: 0,
    totalViews: 0,
    followers: 0,
    following: 0
  });
  const [stories, setStories] = useState<any[]>([]);
  const [badges, setBadges] = useState<any[]>([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [followLoading, setFollowLoading] = useState(false);

  useEffect(() => {
    if (id) {
      // 如果是当前用户访问自己的公开页面，重定向到dashboard
      if (currentUser && currentUser.id === id) {
        navigate('/profile');
        return;
      }
      loadPublicProfile();
    }
  }, [id, currentUser]);

  const loadPublicProfile = async () => {
    if (!id) return;
    
    setIsLoading(true);
    try {
      console.log('🔵 UserProfile: Loading profile for user', id);

      // Load user profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id, full_name, bio, avatar_url, location_name, company, website_url, created_at')
        .eq('id', id)
        .single();

      if (profileError) throw profileError;

      if (profileData) {
        setProfile(profileData);

        // Load stats
        await loadUserStats(id);

        // Load user's published stories
        await loadUserStories(id);

        // Load user's badges
        await loadUserBadges(id);

        // Check if current user is following this user
        if (currentUser) {
          await checkFollowStatus();
        }
      }
    } catch (error: any) {
      console.error('🔴 UserProfile: Error loading profile:', error);
      toast.error(t('profile.load_error', 'Failed to load profile'));
    } finally {
      setIsLoading(false);
    }
  };

  const loadUserStats = async (targetUserId: string) => {
    try {
      // Load stories
      const { data: storiesData } = await supabase
        .from('stories')
        .select('view_count, like_count, comment_count')
        .eq('author', targetUserId)
        .eq('status', 'published')
        .eq('is_public', true);

      const totalViews = storiesData?.reduce((sum, s) => sum + (s.view_count || 0), 0) || 0;
      const totalLikes = storiesData?.reduce((sum, s) => sum + (s.like_count || 0), 0) || 0;
      const totalComments = storiesData?.reduce((sum, s) => sum + (s.comment_count || 0), 0) || 0;

      // Load followers/following counts (future implementation)
      // const { count: followersCount } = await supabase
      //   .from('user_follows')
      //   .select('*', { count: 'exact', head: true })
      //   .eq('followed_user_id', targetUserId);

      setStats({
        storiesPublished: storiesData?.length || 0,
        totalLikes,
        totalComments,
        totalViews,
        followers: 0, // TODO: Implement follows system
        following: 0
      });

      console.log('🟢 UserProfile: Loaded stats', { 
        stories: storiesData?.length, 
        views: totalViews, 
        likes: totalLikes 
      });
    } catch (error) {
      console.error('🔴 UserProfile: Error loading stats:', error);
    }
  };

  const loadUserStories = async (targetUserId: string) => {
    try {
      const { data, error } = await supabase
        .from('stories')
        .select(`
          id,
          title,
          excerpt,
          featured_image_url,
          view_count,
          like_count,
          comment_count,
          created_at,
          category
        `)
        .eq('author', targetUserId)
        .eq('status', 'published')
        .eq('is_public', true)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;

      setStories(data || []);
      console.log('🟢 UserProfile: Loaded stories', { count: data?.length || 0 });
    } catch (error) {
      console.error('🔴 UserProfile: Error loading stories:', error);
    }
  };

  const loadUserBadges = async (targetUserId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_badges')
        .select('*')
        .eq('user_id', targetUserId)
        .order('earned_at', { ascending: false })
        .limit(10);

      if (error && error.code !== 'PGRST116') {
        // PGRST116 means table doesn't exist or no rows, which is okay
        console.warn('UserProfile: Badges table may not exist yet');
      }

      setBadges(data || []);
      console.log('🟢 UserProfile: Loaded badges', { count: data?.length || 0 });
    } catch (error) {
      console.error('🔴 UserProfile: Error loading badges:', error);
    }
  };

  const checkFollowStatus = async () => {
    if (!currentUser || !id) return;

    try {
      // TODO: Implement follows system
      // const { data } = await supabase
      //   .from('user_follows')
      //   .select('id')
      //   .eq('follower_user_id', currentUser.id)
      //   .eq('followed_user_id', id)
      //   .single();

      // setIsFollowing(!!data);
    } catch (error) {
      // Not following
    }
  };

  const handleFollow = async () => {
    if (!currentUser) {
      toast.error(t('profile.login_required', 'Please log in to follow users'));
      navigate('/auth');
      return;
    }

    setFollowLoading(true);
    try {
      // TODO: Implement follows system
      toast.info(t('profile.follow_coming_soon', 'Follow feature coming soon!'));
      
      // if (isFollowing) {
      //   // Unfollow
      //   await supabase
      //     .from('user_follows')
      //     .delete()
      //     .eq('follower_user_id', currentUser.id)
      //     .eq('followed_user_id', id);
      // } else {
      //   // Follow
      //   await supabase
      //     .from('user_follows')
      //     .insert({
      //       follower_user_id: currentUser.id,
      //       followed_user_id: id
      //     });
      // }

      // setIsFollowing(!isFollowing);
      // toast.success(
      //   isFollowing 
      //     ? t('profile.unfollowed', 'Unfollowed successfully') 
      //     : t('profile.followed', 'Followed successfully')
      // );
    } catch (error: any) {
      console.error('🔴 UserProfile: Error toggling follow:', error);
      toast.error(t('profile.follow_error', 'Failed to update follow status'));
    } finally {
      setFollowLoading(false);
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${profile?.full_name || 'User'}'s Profile - LeiaoAI`,
          text: profile?.bio || '',
          url: url,
        });
      } else {
        await navigator.clipboard.writeText(url);
        toast.success(t('profile.link_copied', 'Profile link copied to clipboard'));
      }
    } catch (error) {
      console.error('Failed to share:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const getBadgeColor = (badgeType: string) => {
    const colors: Record<string, string> = {
      bronze: 'bg-amber-600',
      silver: 'bg-gray-400',
      gold: 'bg-yellow-500',
      platinum: 'bg-purple-600',
      early_adopter: 'bg-blue-600',
      contributor: 'bg-green-600'
    };
    return colors[badgeType] || 'bg-primary-600';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <User className="w-16 h-16 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-bold mb-2">{t('profile.not_found', 'User Not Found')}</h2>
        <p className="text-muted-foreground mb-6">{t('profile.not_found_desc', 'This user does not exist')}</p>
        <Button onClick={() => navigate('/')}>
          {t('common.go_home', 'Go Home')}
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-700 text-white py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
            {/* Avatar */}
            <Avatar className="w-24 h-24 md:w-32 md:h-32 border-4 border-white shadow-lg">
              <AvatarImage src={profile.avatar_url} alt={profile.full_name} />
              <AvatarFallback className="text-3xl md:text-4xl bg-primary-600">
                {profile.full_name?.charAt(0).toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>

            {/* Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{profile.full_name || t('profile.anonymous', 'Anonymous User')}</h1>
              {profile.bio && (
                <p className="text-base md:text-lg opacity-90 mb-4">{profile.bio}</p>
              )}
              <div className="flex flex-wrap gap-3 md:gap-4 justify-center md:justify-start text-sm">
                {profile.location_name && (
                  <span className="flex items-center gap-1">
                    <MapPin size={16} />
                    {profile.location_name}
                  </span>
                )}
                {profile.company && (
                  <span className="flex items-center gap-1">
                    <Building size={16} />
                    {profile.company}
                  </span>
                )}
                {profile.website_url && (
                  <a 
                    href={profile.website_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 hover:underline"
                  >
                    <Globe size={16} />
                    {t('profile.website', 'Website')}
                  </a>
                )}
                <span className="flex items-center gap-1">
                  <Calendar size={16} />
                  {t('profile.joined', 'Joined')} {formatDate(profile.created_at)}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2 w-full md:w-auto">
              <Button
                onClick={handleFollow}
                disabled={followLoading}
                variant={isFollowing ? 'outline' : 'secondary'}
                className="min-w-32"
              >
                {followLoading ? (
                  <Loader2 size={16} className="mr-2 animate-spin" />
                ) : isFollowing ? (
                  <UserCheck size={16} className="mr-2" />
                ) : (
                  <UserPlus size={16} className="mr-2" />
                )}
                {isFollowing ? t('profile.following', 'Following') : t('profile.follow', 'Follow')}
              </Button>
              <Button onClick={handleShare} variant="outline" className="bg-white/10 hover:bg-white/20 border-white/30">
                <Share2 size={16} className="mr-2" />
                {t('profile.share', 'Share Profile')}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="border-b bg-card">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-foreground">{stats.storiesPublished}</div>
              <div className="text-sm text-muted-foreground">{t('profile.stories', 'Stories')}</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">{stats.totalViews.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">{t('profile.views', 'Views')}</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">{stats.totalLikes.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">{t('profile.likes', 'Likes')}</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">{stats.totalComments.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">{t('profile.comments', 'Comments')}</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">{stats.followers.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">{t('profile.followers', 'Followers')}</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">{stats.following.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">{t('profile.following', 'Following')}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Tabs */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Tabs defaultValue="stories" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="stories">
              <FileText size={16} className="mr-2" />
              {t('profile.stories', 'Stories')}
            </TabsTrigger>
            <TabsTrigger value="badges">
              <Award size={16} className="mr-2" />
              {t('profile.badges', 'Badges')}
            </TabsTrigger>
          </TabsList>

          {/* Stories Tab */}
          <TabsContent value="stories" className="space-y-4">
            {stories.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">{t('profile.no_public_stories', 'No public stories yet')}</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {stories.map((story) => (
                  <motion.div
                    key={story.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ y: -4 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Card 
                      className="cursor-pointer hover:shadow-lg transition-shadow h-full"
                      onClick={() => navigate(`/story/${story.id}`)}
                    >
                      {story.featured_image_url && (
                        <div className="aspect-video overflow-hidden rounded-t-lg">
                          <img 
                            src={story.featured_image_url} 
                            alt={story.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <CardContent className="p-4">
                        {story.category && (
                          <Badge variant="secondary" className="mb-2">{story.category}</Badge>
                        )}
                        <h3 className="font-semibold text-lg mb-2 line-clamp-2">{story.title}</h3>
                        {story.excerpt && (
                          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                            {story.excerpt}
                          </p>
                        )}
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Eye size={14} />
                            {story.view_count || 0}
                          </span>
                          <span className="flex items-center gap-1">
                            <Heart size={14} />
                            {story.like_count || 0}
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageSquare size={14} />
                            {story.comment_count || 0}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Badges Tab */}
          <TabsContent value="badges" className="space-y-4">
            {badges.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Award className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">{t('profile.no_badges', 'No badges earned yet')}</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-3 gap-4">
                {badges.map((badge) => (
                  <Card key={badge.id}>
                    <CardContent className="p-6 text-center">
                      <div className={cn(
                        'w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center',
                        getBadgeColor(badge.badge_type)
                      )}>
                        <Trophy className="w-8 h-8 text-white" />
                      </div>
                      <h4 className="font-semibold text-lg mb-2">{badge.badge_name}</h4>
                      {badge.badge_description && (
                        <p className="text-sm text-muted-foreground mb-2">
                          {badge.badge_description}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        {t('profile.earned', 'Earned')} {formatDate(badge.earned_at)}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
