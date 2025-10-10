import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useGamification } from '@/hooks/useGamification';
import { supabase } from '@/lib/supabase';
import { useTranslation } from 'react-i18next';
import { useNavigate, Link } from 'react-router-dom';
import { 
  User, 
  Settings, 
  BookMarked, 
  FileText, 
  MessageSquare, 
  Heart,
  Share2,
  Trophy,
  Star,
  Calendar,
  TrendingUp,
  Edit3,
  Camera,
  Award,
  Target,
  Activity,
  BarChart3,
  Eye,
  Bot,
  Clock,
  ExternalLink,
  Users,
  Zap,
  ChevronRight,
  Flame,
  Bookmark,
  PlusCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

interface UserStats {
  totalStories: number;
  totalLikes: number;
  totalComments: number;
  totalShares: number;
  totalViews: number;
  savedStories: number;
  bpSubmissions: number;
  bmcSaves: number;
  chatSessions: number;
  totalEngagement: number;
  weeklyGrowth: number;
  popularityScore: number;
}

interface ActivityItem {
  id: string;
  activity_type: string;
  activity_description: string;
  created_at: string;
  metadata?: any;
}

interface ChatSession {
  id: string;
  title: string;
  ai_model: string;
  message_count: number;
  created_at: string;
  updated_at: string;
}

interface StoryAnalytics {
  id: string;
  title: string;
  views_count: number;
  likes_count: number;
  saves_count: number;
  comments_count: number;
  created_at: string;
  engagement_rate: number;
}

export default function Profile() {
  const { t } = useTranslation();
  const { user, updateProfile } = useAuth();
  const { badges = [], achievements = [], loadBadges, loadAchievements } = useGamification();
  
  const [stats, setStats] = useState<UserStats>({
    totalStories: 0,
    totalLikes: 0,
    totalComments: 0,
    totalShares: 0,
    totalViews: 0,
    savedStories: 0,
    bpSubmissions: 0,
    bmcSaves: 0,
    chatSessions: 0,
    totalEngagement: 0,
    weeklyGrowth: 0,
    popularityScore: 0
  });
  
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [savedStories, setSavedStories] = useState([]);
  const [userStories, setUserStories] = useState<StoryAnalytics[]>([]);
  const [draftStories, setDraftStories] = useState<any[]>([]);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [bpSubmissions, setBpSubmissions] = useState([]);
  const [bmcSaves, setBmcSaves] = useState([]);
  const [weeklyStats, setWeeklyStats] = useState<any[]>([]);
  const [popularTags, setPopularTags] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    full_name: '',
    bio: '',
    location: '',
    company: '',
    website_url: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      loadUserData();
      loadBadges();
      loadAchievements();
    }
  }, [user, loadBadges, loadAchievements]);

  const loadUserData = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      await Promise.all([
        loadUserStats(),
        loadUserActivities(),
        loadSavedStories(),
        loadUserStories(),
        loadDraftStories(),
        loadChatSessions(),
        loadBpSubmissions(),
        loadBmcSaves(),
        loadWeeklyStats(),
        loadPopularTags()
      ]);
    } catch (error) {
      console.error('Failed to load user data:', error);
      toast.error(t('profile.load_error', 'Failed to load profile data'));
    } finally {
      setIsLoading(false);
    }
  };

  const loadUserStats = async () => {
    if (!user) return;

    try {
      // Load comprehensive story stats
      const { data: stories, error: storiesError } = await supabase
        .from('stories')
        .select('view_count, like_count, comment_count')
        .eq('author_id', user.id)
        .eq('status', 'published');

      if (storiesError) {
        console.error('Error loading stories:', storiesError);
      }

      // Load saved stories count
      const { data: saves, error: savesError } = await supabase
        .from('user_saves')
        .select('id')
        .eq('user_id', user.id);

      if (savesError) {
        console.error('Error loading saves:', savesError);
      }

      // Load BP submissions count
      const { data: bps, error: bpsError } = await supabase
        .from('user_bp_submissions')
        .select('id')
        .eq('user_id', user.id);

      if (bpsError) {
        console.error('Error loading BP submissions:', bpsError);
      }

      // Load BMC saves count
      const { data: bmcs, error: bmcsError } = await supabase
        .from('user_bmc_saves')
        .select('id')
        .eq('user_id', user.id);

      if (bmcsError) {
        console.error('Error loading BMC saves:', bmcsError);
      }

      // Load chat sessions count
      const { data: chats, error: chatsError } = await supabase
        .from('ai_chat_sessions')
        .select('id')
        .eq('user_id', user.id);

      if (chatsError) {
        console.error('Error loading chat sessions:', chatsError);
      }

      // Calculate aggregated stats with proper fallbacks
      const totalViews = stories?.reduce((sum, story) => sum + (story.view_count || 0), 0) || 0;
      const totalLikes = stories?.reduce((sum, story) => sum + (story.like_count || 0), 0) || 0;
      const totalComments = stories?.reduce((sum, story) => sum + (story.comment_count || 0), 0) || 0;
      const totalEngagement = totalLikes + totalComments;

      setStats({
        totalStories: stories?.length || 0,
        totalLikes,
        totalComments,
        totalShares: 0, // Not tracking shares in current schema
        totalViews,
        savedStories: saves?.length || 0,
        bpSubmissions: bps?.length || 0,
        bmcSaves: bmcs?.length || 0,
        chatSessions: chats?.length || 0,
        totalEngagement,
        weeklyGrowth: 0, // Will be calculated in loadWeeklyStats
        popularityScore: totalViews > 0 ? Math.round((totalEngagement / totalViews) * 100) : 0
      });
    } catch (error) {
      console.error('Failed to load user stats:', error);
      // Keep default stats on error
    }
  };

  const loadUserActivities = async () => {
    if (!user) return;

    const { data } = await supabase
      .from('user_activities')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(20);

    if (data) {
      setActivities(data);
    }
  };

  const loadSavedStories = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_saves')
        .select(`
          *,
          stories!inner(*)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Error loading saved stories:', error);
        return;
      }

      if (data) {
        setSavedStories(data);
      }
    } catch (error) {
      console.error('Failed to load saved stories:', error);
    }
  };

  const loadUserStories = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('stories')
        .select('id, title, content, excerpt, view_count, like_count, comment_count, created_at, updated_at')
        .eq('author_id', user.id)
        .eq('status', 'published')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Error loading user stories:', error);
        return;
      }

      if (data) {
        // Calculate engagement rate for each story with proper fallbacks
        const storiesWithEngagement = data.map(story => ({
          ...story,
          view_count: story.view_count || 0,
          like_count: story.like_count || 0,
          comment_count: story.comment_count || 0,
          engagement_rate: (story.view_count || 0) > 0 
            ? Math.round((((story.like_count || 0) + (story.comment_count || 0)) / (story.view_count || 1)) * 100)
            : 0
        }));
        setUserStories(storiesWithEngagement);
      }
    } catch (error) {
      console.error('Failed to load user stories:', error);
    }
  };

  const loadDraftStories = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('stories')
        .select('id, title, content, excerpt, category, created_at, updated_at')
        .eq('author', user.id)
        .eq('status', 'draft')
        .order('updated_at', { ascending: false })
        .limit(20);

      if (error) {
        console.error('Error loading draft stories:', error);
        return;
      }

      if (data) {
        setDraftStories(data);
      }
    } catch (error) {
      console.error('Failed to load draft stories:', error);
    }
  };

  const loadChatSessions = async () => {
    if (!user) return;

    const { data } = await supabase
      .from('ai_chat_sessions')
      .select('id, title, ai_model, message_count, created_at, updated_at')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })
      .limit(10);

    if (data) {
      setChatSessions(data);
    }
  };

  const loadWeeklyStats = async () => {
    if (!user) return;

    // Get stats for the last 7 days
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const { data: recentStats } = await supabase
      .from('stories')
      .select('created_at, views_count, likes_count')
      .eq('author_id', user.id)
      .gte('created_at', oneWeekAgo.toISOString());

    if (recentStats) {
      const dailyStats = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dayStart = new Date(date.setHours(0, 0, 0, 0));
        const dayEnd = new Date(date.setHours(23, 59, 59, 999));
        
        const dayStats = recentStats.filter(story => {
          const storyDate = new Date(story.created_at);
          return storyDate >= dayStart && storyDate <= dayEnd;
        });
        
        dailyStats.push({
          date: dayStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          stories: dayStats.length,
          views: dayStats.reduce((sum, story) => sum + (story.views_count || 0), 0),
          engagement: dayStats.reduce((sum, story) => sum + (story.likes_count || 0), 0)
        });
      }
      setWeeklyStats(dailyStats);
    }
  };

  const loadPopularTags = async () => {
    if (!user) return;

    const { data: userStoryTags } = await supabase
      .from('story_tag_assignments')
      .select(`
        story_tags!inner(name, display_name, color),
        stories!inner(author_id)
      `)
      .eq('stories.author_id', user.id);

    if (userStoryTags) {
      // Count tag usage
      const tagCounts = {};
      userStoryTags.forEach(assignment => {
        const tag = assignment.story_tags;
        if (tag) {
          if (tagCounts[tag.name]) {
            tagCounts[tag.name].count++;
          } else {
            tagCounts[tag.name] = {
              ...tag,
              count: 1
            };
          }
        }
      });
      
      const popularTagsArray = Object.values(tagCounts)
        .sort((a, b) => b.count - a.count)
        .slice(0, 8);
      
      setPopularTags(popularTagsArray);
    }
  };

  const loadBpSubmissions = async () => {
    if (!user) return;

    const { data } = await supabase
      .from('user_bp_submissions')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10);

    if (data) {
      setBpSubmissions(data);
    }
  };

  const loadBmcSaves = async () => {
    if (!user) return;

    const { data } = await supabase
      .from('user_bmc_saves')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10);

    if (data) {
      setBmcSaves(data);
    }
  };

  const handleEditProfile = async () => {
    if (!user) return;

    try {
      await updateProfile(editForm);
      setIsEditing(false);
      toast.success(t('profile.updated', 'Profile updated successfully'));
    } catch (error: any) {
      toast.error(error.message || t('profile.update_error', 'Failed to update profile'));
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getBadgeIcon = (badgeType: string) => {
    switch (badgeType) {
      case 'storyteller_novice':
      case 'storyteller_active':
      case 'storyteller_master':
      case 'storyteller_legend':
        return <FileText className="w-4 h-4" />;
      case 'social_active':
        return <MessageSquare className="w-4 h-4" />;
      case 'like_master':
        return <Heart className="w-4 h-4" />;
      case 'popular_creator':
        return <Star className="w-4 h-4" />;
      case 'platform_veteran':
      case 'power_user':
        return <Trophy className="w-4 h-4" />;
      default:
        return <Award className="w-4 h-4" />;
    }
  };

  const getBadgeColor = (badgeType: string) => {
    if (badgeType.includes('legend')) return 'bg-gradient-to-r from-yellow-400 to-orange-500';
    if (badgeType.includes('master')) return 'bg-gradient-to-r from-purple-500 to-pink-500';
    if (badgeType.includes('active')) return 'bg-gradient-to-r from-blue-500 to-cyan-500';
    return 'bg-gradient-to-r from-gray-500 to-gray-600';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isLoading && !user) {
    return (
      <div className="text-center py-12">
        <User className="w-16 h-16 mx-auto mb-4 text-gray-400" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('auth.login_required', 'Please log in')}</h3>
        <p className="text-gray-600">{t('profile.login_desc', 'You need to be logged in to view your profile')}</p>
        <Button 
          onClick={() => window.location.href = '/auth'}
          className="mt-4"
        >
          {t('auth.sign_in', 'Sign In')}
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Profile Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start space-x-6">
            <div className="relative">
              <Avatar className="w-24 h-24">
                <AvatarImage 
                  src={profile?.avatar_url || user.user_metadata?.avatar_url || '/default-user-avatar-placeholder-modern-clean.jpg'} 
                  alt={profile?.full_name || user.user_metadata?.full_name || 'User'}
                />
                <AvatarFallback>
                  {(profile?.full_name || user.user_metadata?.full_name || user.email || 'U')[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <Button
                size="sm"
                variant="outline"
                className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0"
                onClick={() => setIsEditing(true)}
              >
                <Camera className="w-3 h-3" />
              </Button>
            </div>
            
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h1 className="text-2xl font-bold text-gray-900">
                  {user.user_metadata?.full_name || user.email}
                </h1>
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/profile/edit')}
                >
                  <Edit3 className="w-4 h-4 mr-2" />
                  {t('profile.edit', 'Edit Profile')}
                </Button>
              </div>
              
              <p className="text-gray-600 mb-4">
                {user.user_metadata?.bio || t('profile.no_bio', 'No bio available')}
              </p>
              
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  {t('profile.joined', 'Joined')} {formatDate(user.created_at)}
                </span>
                {user.user_metadata?.location && (
                  <span>{user.user_metadata.location}</span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{t('profile.stats.stories', 'Stories Published')}</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalStories}</p>
                <p className="text-xs text-green-600 mt-1">
                  <TrendingUp className="w-3 h-3 inline mr-1" />
                  {t('profile.stats.total_views', 'Total Views')}: {stats.totalViews.toLocaleString()}
                </p>
              </div>
              <div className="p-2 bg-blue-50 rounded-lg">
                <FileText className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{t('profile.stats.likes', 'Likes Received')}</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalLikes}</p>
              </div>
              <Heart className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{t('profile.stats.comments', 'Comments Made')}</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalComments}</p>
              </div>
              <MessageSquare className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{t('profile.stats.saved', 'Saved Stories')}</p>
                <p className="text-2xl font-bold text-gray-900">{stats.savedStories}</p>
              </div>
              <BookMarked className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="overview">{t('profile.tabs.overview', 'Overview')}</TabsTrigger>
          <TabsTrigger value="stories">{t('profile.tabs.stories', 'Stories')}</TabsTrigger>
          <TabsTrigger value="drafts">
            {t('profile.tabs.drafts', 'Drafts')} {draftStories.length > 0 && <Badge variant="secondary" className="ml-1">{draftStories.length}</Badge>}
          </TabsTrigger>
          <TabsTrigger value="saved">{t('profile.tabs.saved', 'Saved')}</TabsTrigger>
          <TabsTrigger value="submissions">{t('profile.tabs.submissions', 'Submissions')}</TabsTrigger>
          <TabsTrigger value="achievements">{t('profile.tabs.achievements', 'Achievements')}</TabsTrigger>
          <TabsTrigger value="activity">{t('profile.tabs.activity', 'Activity')}</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Badges */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Trophy className="w-5 h-5 mr-2" />
                  {t('profile.recent_badges', 'Recent Badges')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {(!badges || badges.length === 0) ? (
                  <p className="text-gray-500 text-center py-4">
                    {t('profile.no_badges', 'No badges earned yet')}
                  </p>
                ) : (
                  <div className="space-y-3">
                    {(badges || []).slice(0, 5).map((badge) => (
                      <div key={badge.id} className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-full ${getBadgeColor(badge.badge_type)} flex items-center justify-center text-white`}>
                          {getBadgeIcon(badge.badge_type)}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{badge.badge_name}</p>
                          <p className="text-sm text-gray-500">{badge.badge_description}</p>
                        </div>
                        <span className="text-xs text-gray-400">
                          {formatDate(badge.earned_at)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="w-5 h-5 mr-2" />
                  {t('profile.recent_activity', 'Recent Activity')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {(!activities || activities.length === 0) ? (
                  <p className="text-gray-500 text-center py-4">
                    {t('profile.no_activity', 'No recent activity')}
                  </p>
                ) : (
                  <div className="space-y-3">
                    {(activities || []).slice(0, 5).map((activity) => (
                      <div key={activity.id} className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-900">{activity.activity_description}</p>
                          <p className="text-xs text-gray-500">{formatDate(activity.created_at)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Stories Tab */}
        <TabsContent value="stories">
          <Card>
            <CardHeader>
              <CardTitle>{t('profile.my_stories', 'My Stories')}</CardTitle>
              <CardDescription>
                {t('profile.stories_desc', 'Stories you have published')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {userStories.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  {t('profile.no_stories', 'No stories published yet')}
                </p>
              ) : (
                <div className="space-y-4">
                  {userStories.map((story: any) => (
                    <div key={story.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100 flex-1">{story.title}</h3>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => navigate(`/edit-story/${story.id}`)}
                        >
                          <Edit3 className="w-4 h-4 mr-1" />
                          {t('common.edit', 'Edit')}
                        </Button>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">{story.content}</p>
                      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                        <span>{formatDate(story.created_at)}</span>
                        <div className="flex items-center space-x-4">
                          <span className="flex items-center">
                            <Heart className="w-4 h-4 mr-1" />
                            {story.like_count}
                          </span>
                          <span className="flex items-center">
                            <MessageSquare className="w-4 h-4 mr-1" />
                            {story.comment_count}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Drafts Tab */}
        <TabsContent value="drafts">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{t('profile.my_drafts', 'My Drafts')}</span>
                <Button onClick={() => navigate('/create-story')} size="sm">
                  <PlusCircle className="w-4 h-4 mr-2" />
                  {t('story.create', 'Create Story')}
                </Button>
              </CardTitle>
              <CardDescription>
                {t('profile.drafts_desc', 'Unpublished drafts - only visible to you')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {draftStories.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500 mb-4">
                    {t('profile.no_drafts', 'No drafts yet')}
                  </p>
                  <Button onClick={() => navigate('/create-story')} variant="outline">
                    <PlusCircle className="w-4 h-4 mr-2" />
                    {t('story.create_first', 'Create Your First Story')}
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {draftStories.map((draft: any) => (
                    <div 
                      key={draft.id} 
                      className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer group"
                      onClick={() => navigate(`/edit-story/${draft.id}`)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-primary-600 transition-colors">
                          {draft.title}
                        </h3>
                        <Badge variant="outline" className="ml-2">Draft</Badge>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
                        {draft.excerpt || draft.content?.substring(0, 150) + '...' || 'No content yet'}
                      </p>
                      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                        <span className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {t('profile.last_edited', 'Last edited')} {formatDate(draft.updated_at)}
                        </span>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/edit-story/${draft.id}`);
                          }}
                        >
                          <Edit3 className="w-4 h-4 mr-1" />
                          {t('common.edit', 'Edit')}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Saved Stories Tab */}
        <TabsContent value="saved">
          <Card>
            <CardHeader>
              <CardTitle>{t('profile.saved_stories', 'Saved Stories')}</CardTitle>
              <CardDescription>
                {t('profile.saved_desc', 'Stories you have saved for later')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {savedStories.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  {t('profile.no_saved', 'No saved stories yet')}
                </p>
              ) : (
                <div className="space-y-4">
                  {savedStories.map((save: any) => (
                    <div key={save.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <h3 className="font-semibold text-gray-900 mb-2">{save.stories?.title}</h3>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{save.stories?.content}</p>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>{t('profile.saved_on', 'Saved on')} {formatDate(save.created_at)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Submissions Tab */}
        <TabsContent value="submissions">
          <div className="space-y-6">
            {/* BP Submissions */}
            <Card>
              <CardHeader>
                <CardTitle>{t('profile.bp_submissions', 'Business Plan Submissions')}</CardTitle>
              </CardHeader>
              <CardContent>
                {bpSubmissions.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">
                    {t('profile.no_bp', 'No business plan submissions yet')}
                  </p>
                ) : (
                  <div className="space-y-3">
                    {bpSubmissions.map((bp: any) => (
                      <div key={bp.id} className="border border-gray-200 rounded-lg p-3">
                        <h4 className="font-medium text-gray-900">{bp.submission_title || 'Untitled'}</h4>
                        <p className="text-sm text-gray-500">{formatDate(bp.created_at)}</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* BMC Saves */}
            <Card>
              <CardHeader>
                <CardTitle>{t('profile.bmc_saves', 'Business Model Canvas Saves')}</CardTitle>
              </CardHeader>
              <CardContent>
                {bmcSaves.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">
                    {t('profile.no_bmc', 'No BMC saves yet')}
                  </p>
                ) : (
                  <div className="space-y-3">
                    {bmcSaves.map((bmc: any) => (
                      <div key={bmc.id} className="border border-gray-200 rounded-lg p-3">
                        <h4 className="font-medium text-gray-900">{bmc.title || 'Untitled BMC'}</h4>
                        <p className="text-sm text-gray-500">{formatDate(bmc.created_at)}</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Chat Sessions */}
            <Card>
              <CardHeader>
                <CardTitle>{t('profile.chat_sessions', 'AI Chat Sessions')}</CardTitle>
              </CardHeader>
              <CardContent>
                {chatSessions.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">
                    {t('profile.no_chats', 'No chat sessions yet')}
                  </p>
                ) : (
                  <div className="space-y-3">
                    {chatSessions.map((chat: any) => (
                      <div key={chat.id} className="border border-gray-200 rounded-lg p-3">
                        <h4 className="font-medium text-gray-900">{chat.session_title}</h4>
                        <p className="text-sm text-gray-500">Model: {chat.ai_model} • {formatDate(chat.created_at)}</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Achievements Tab */}
        <TabsContent value="achievements">
          <Card>
            <CardHeader>
              <CardTitle>{t('profile.achievements_title', 'Achievements & Badges')}</CardTitle>
              <CardDescription>
                {t('profile.achievements_desc', 'Your progress and accomplishments on the platform')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Badges */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('profile.badges', 'Badges')}</h3>
                  {badges.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">
                      {t('profile.no_badges', 'No badges earned yet')}
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {badges.map((badge) => (
                        <div key={badge.id} className="border border-gray-200 rounded-lg p-4">
                          <div className={`w-12 h-12 rounded-full ${getBadgeColor(badge.badge_type)} flex items-center justify-center text-white mb-3`}>
                            {getBadgeIcon(badge.badge_type)}
                          </div>
                          <h4 className="font-semibold text-gray-900">{badge.badge_name}</h4>
                          <p className="text-sm text-gray-600 mb-2">{badge.badge_description}</p>
                          <p className="text-xs text-gray-500">{formatDate(badge.earned_at)}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <Separator />

                {/* Achievements Progress */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('profile.progress', 'Progress')}</h3>
                  {achievements.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">
                      {t('profile.no_achievements', 'No achievements tracked yet')}
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {achievements.map((achievement) => (
                        <div key={achievement.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-gray-900">{achievement.achievement_name}</h4>
                            <span className="text-sm text-gray-500">
                              {achievement.progress}/{achievement.target_value}
                            </span>
                          </div>
                          <Progress 
                            value={(achievement.progress / achievement.target_value) * 100} 
                            className="mb-2"
                          />
                          {achievement.completed_at && (
                            <Badge variant="success" className="text-xs">
                              {t('profile.completed', 'Completed')} {formatDate(achievement.completed_at)}
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Activity Tab */}
        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>{t('profile.activity_timeline', 'Activity Timeline')}</CardTitle>
              <CardDescription>
                {t('profile.activity_desc', 'Your recent actions and interactions on the platform')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {activities.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  {t('profile.no_activity', 'No recent activity')}
                </p>
              ) : (
                <div className="space-y-4">
                  {activities.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-4 border-b border-gray-100 pb-4">
                      <div className="w-3 h-3 bg-blue-600 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <p className="text-gray-900">{activity.activity_description}</p>
                        <p className="text-sm text-gray-500 mt-1">{formatDate(activity.created_at)}</p>
                        {activity.metadata && (
                          <div className="mt-2 text-xs text-gray-400">
                            <code>{JSON.stringify(activity.metadata, null, 2)}</code>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}