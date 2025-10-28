import React, { useState, useEffect, useMemo } from 'react';
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
  PlusCircle,
  Download,
  Loader2,
  ScanText,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { cn, formatFileSize } from '@/lib/utils';

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
  const { user, profile, updateProfile } = useAuth();
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
  const [extractingText, setExtractingText] = useState<string | null>(null); // BMC ID being extracted
  const [extractedTexts, setExtractedTexts] = useState<Record<string, string>>({}); // BMC ID -> extracted text
  const [editForm, setEditForm] = useState({
    full_name: '',
    bio: '',
    location: '',
    company: '',
    website_url: ''
  });
  
  // 分页状态
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const navigate = useNavigate();

  // 合并stories和drafts，按更新时间排序
  const allStories = useMemo(() => {
    const published = userStories.map(story => ({ ...story, isDraft: false }));
    const drafts = draftStories.map(story => ({ ...story, isDraft: true }));
    return [...published, ...drafts].sort((a, b) => 
      new Date(b.updated_at || b.created_at).getTime() - new Date(a.updated_at || a.created_at).getTime()
    );
  }, [userStories, draftStories]);

  // 分页计算
  const totalPages = Math.ceil(allStories.length / itemsPerPage);
  const paginatedStories = allStories.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
        .eq('author', user.id)
        .eq('status', 'published');

      if (storiesError) {
        console.error('Error loading stories:', storiesError);
      }

      // Load saved stories count
      const { data: saves, error: savesError } = await supabase
        .from('story_saves')
        .select('id')
        .eq('user_id', user.id);

      if (savesError) {
        console.error('Error loading saves:', savesError);
      }

      // Load BP submissions count
      const { data: bps, error: bpsError } = await supabase
        .from('bp_submissions')
        .select('id')
        .eq('user_id', user.id);

      if (bpsError) {
        console.error('Error loading BP submissions:', bpsError);
      }

      // Load BMC saves count
      const { data: bmcs, error: bmcsError} = await supabase
        .from('bmc_boards')
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
        .from('story_saves')
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
        .eq('author', user.id)
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
    if (!user) {
      console.warn('⚠️ Profile: Cannot load chat sessions - user not logged in');
      return;
    }

    try {
      console.log('🔵 Profile: Loading chat sessions', { userId: user.id });
      const { data, error } = await supabase
        .from('chat_sessions')
        .select('session_id, title, category, created_at, updated_at, markdown_file_url, markdown_file_path')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })
        .limit(20);

      if (error) {
        console.error('🔴 Profile: Error loading chat sessions:', error);
        console.error('🔴 Query details:', { userId: user.id, errorCode: error.code, errorMessage: error.message });
        return;
      }

      console.log('🔵 Profile: Query returned', { rowCount: data?.length || 0, data });

      if (data && data.length > 0) {
        // 为每个session查询message count
        const sessionsWithCounts = await Promise.all(
          data.map(async (session) => {
            const { count, error: countError } = await supabase
              .from('chat_messages')
              .select('*', { count: 'exact', head: true })
              .eq('session_id', session.session_id);

            if (countError) {
              console.error('🔴 Profile: Error counting messages for session', session.session_id, countError);
            }

            return {
              id: session.session_id,
              title: session.title || '新的对话',
              category: session.category,
              created_at: session.created_at,
              updated_at: session.updated_at,
              message_count: count || 0,
              markdown_file_url: session.markdown_file_url,
              markdown_file_path: session.markdown_file_path
            };
          })
        );

        console.log('🟢 Profile: Loaded chat sessions with counts', { 
          count: sessionsWithCounts.length,
          sessions: sessionsWithCounts.map(s => ({ 
            id: s.id, 
            title: s.title, 
            category: s.category, 
            messages: s.message_count 
          }))
        });
        setChatSessions(sessionsWithCounts as any);
      } else {
        console.log('🟡 Profile: No chat sessions found for user', user.id);
        setChatSessions([]);
      }
    } catch (error) {
      console.error('🔴 Profile: Failed to load chat sessions:', error);
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
          date: dayStart.toLocaleDateString('en', { month: 'short', day: 'numeric' }),
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

    try {
      console.log('🔵 Profile: Loading BP submissions');
      const { data, error } = await supabase
        .from('bp_submissions')
        .select('id, file_name, file_type, file_url, file_size, score, analysis_status, analysis_scores, created_at, updated_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false})
        .limit(10);

      if (error) {
        console.error('🔴 Profile: Error loading BP submissions:', error);
        return;
      }

      console.log('🟢 Profile: Loaded BP submissions', { count: data?.length || 0 });
      if (data) {
        setBpSubmissions(data);
      }
    } catch (error) {
      console.error('🔴 Profile: Failed to load BP submissions:', error);
    }
  };

  // 删除BP文档
  const deleteBpSubmission = async (bpId: string, fileUrl: string) => {
    if (!user) return;
    
    if (!confirm(t('profile.confirm_delete_bp', 'Are you sure you want to delete this business plan?'))) {
      return;
    }

    try {
      console.log('🔵 Profile: Deleting BP', { bpId });
      
      // 1. 从Storage删除文件
      if (fileUrl) {
        // 提取文件路径
        const urlParts = fileUrl.split('/');
        const bucketIndex = urlParts.findIndex(part => part === 'bp-documents');
        if (bucketIndex !== -1 && urlParts.length > bucketIndex + 1) {
          const filePath = urlParts.slice(bucketIndex + 1).join('/');
          
          console.log('🔵 Profile: Deleting from Storage', { filePath });
          const { error: storageError } = await supabase.storage
            .from('bp-documents')
            .remove([filePath]);

          if (storageError) {
            console.error('🔴 Profile: Storage delete error', storageError);
            // 继续删除数据库记录，即使Storage删除失败
          } else {
            console.log('🟢 Profile: File deleted from Storage');
          }
        }
      }

      // 2. 从数据库删除记录
      const { error: dbError } = await supabase
        .from('bp_submissions')
        .delete()
        .eq('id', bpId)
        .eq('user_id', user.id);

      if (dbError) {
        console.error('🔴 Profile: Database delete error', dbError);
        toast.error(t('profile.delete_failed', 'Failed to delete BP'));
        return;
      }

      console.log('🟢 Profile: BP deleted successfully');
      toast.success(t('profile.delete_success', 'BP deleted successfully'));

      // 3. 重新加载列表
      loadBpSubmissions();
      loadUserStats(); // 更新统计
    } catch (error: any) {
      console.error('🔴 Profile: Delete error', error);
      toast.error(error.message || t('profile.delete_failed', 'Failed to delete BP'));
    }
  };

  // 删除AI Chat Session
  const deleteChatSession = async (sessionId: string, markdown_file_path: string | null) => {
    if (!user) return;
    
    if (!confirm(t('profile.confirm_delete_chat', 'Are you sure you want to delete this chat session?'))) {
      return;
    }

    try {
      console.log('🔵 Profile: Deleting chat session', { sessionId });
      
      // 1. 如果有Markdown文件，从Storage删除
      if (markdown_file_path) {
        console.log('🔵 Profile: Deleting Markdown file from Storage', { markdown_file_path });
        const { error: storageError } = await supabase.storage
          .from('chat-sessions')
          .remove([markdown_file_path]);

        if (storageError) {
          console.error('🔴 Profile: Storage delete error', storageError);
        } else {
          console.log('🟢 Profile: Markdown file deleted from Storage');
        }
      }

      // 2. 删除数据库中的消息
      const { error: messagesError } = await supabase
        .from('chat_messages')
        .delete()
        .eq('session_id', sessionId);

      if (messagesError) {
        console.error('🔴 Profile: Messages delete error', messagesError);
      }

      // 3. 从数据库删除会话记录
      const { error: dbError } = await supabase
        .from('chat_sessions')
        .delete()
        .eq('session_id', sessionId)
        .eq('user_id', user.id);

      if (dbError) {
        console.error('🔴 Profile: Database delete error', dbError);
        toast.error(t('profile.delete_failed', 'Failed to delete chat session'));
        return;
      }

      console.log('🟢 Profile: Chat session deleted successfully');
      toast.success(t('profile.delete_success', 'Chat session deleted successfully'));

      // 4. 重新加载列表
      loadChatSessions();
      loadUserStats();
    } catch (error: any) {
      console.error('🔴 Profile: Delete error', error);
      toast.error(error.message || t('profile.delete_failed', 'Failed to delete chat session'));
    }
  };

  const loadBmcSaves = async () => {
    if (!user) return;

    try {
      // 使用正确的表名 'bmc_boards' 而不是 'user_bmc_saves'
      const { data, error } = await supabase
        .from('bmc_boards')
        .select('id, title, image_url, data, extracted_text, created_at, updated_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Error loading BMC saves:', error);
        return;
      }

      if (data) {
        setBmcSaves(data);
        // 加载已提取的文本到state
        const texts: Record<string, string> = {};
        data.forEach((bmc: any) => {
          if (bmc.extracted_text) {
            texts[bmc.id] = bmc.extracted_text;
          }
        });
        setExtractedTexts(texts);
      }
    } catch (error) {
      console.error('Failed to load BMC saves:', error);
    }
  };

  // OCR提取文本功能
  const handleExtractText = async (bmcId: string, imageBase64: string) => {
    if (!imageBase64) {
      toast.error(t('profile.no_image', 'No image available for extraction'));
      return;
    }

    setExtractingText(bmcId);

    try {
      const response = await fetch('/api/unified?action=ocr-extract', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: imageBase64 }),
      });

      if (!response.ok) {
        throw new Error('OCR extraction failed');
      }

      const data = await response.json();
      const extractedText = data.text || '';

      // 更新数据库
      const { error: updateError } = await supabase
        .from('bmc_boards')
        .update({ extracted_text: extractedText, updated_at: new Date().toISOString() })
        .eq('id', bmcId);

      if (updateError) {
        throw updateError;
      }

      // 更新本地state
      setExtractedTexts(prev => ({ ...prev, [bmcId]: extractedText }));
      toast.success(t('profile.text_extracted', 'Text extracted successfully!'));
    } catch (error) {
      console.error('Error extracting text:', error);
      toast.error(t('profile.extraction_failed', 'Failed to extract text. Please try again.'));
    } finally {
      setExtractingText(null);
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
        <h3 className="text-xl font-semibold text-foreground mb-2">{t('auth.login_required', 'Please log in')}</h3>
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
                <h1 className="text-2xl font-bold text-foreground">
                  {profile?.full_name || user.user_metadata?.full_name || user.email}
                </h1>
                <div className="flex gap-2">
                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/user/${user.id}`)}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    {t('profile.view_public', 'Public Profile')}
                  </Button>
                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/profile/edit')}
                  >
                    <Edit3 className="w-4 h-4 mr-2" />
                    {t('profile.edit', 'Edit Profile')}
                  </Button>
                </div>
              </div>
              
              <p className="text-gray-600 mb-4">
                {profile?.bio || user.user_metadata?.bio || t('profile.no_bio', 'No bio available')}
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
                <p className="text-sm font-medium text-foreground-secondary">{t('profile.stats.stories', 'Stories Published')}</p>
                <p className="text-2xl font-bold text-foreground">{stats.totalStories}</p>
                <p className="text-xs text-green-600 dark:text-green-400 mt-1">
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
                <p className="text-sm font-medium text-foreground-secondary">{t('profile.stats.likes', 'Likes Received')}</p>
                <p className="text-2xl font-bold text-foreground">{stats.totalLikes}</p>
              </div>
              <Heart className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground-secondary">{t('profile.stats.comments', 'Comments Made')}</p>
                <p className="text-2xl font-bold text-foreground">{stats.totalComments}</p>
              </div>
              <MessageSquare className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground-secondary">{t('profile.stats.saved', 'Saved Stories')}</p>
                <p className="text-2xl font-bold text-foreground">{stats.savedStories}</p>
              </div>
              <BookMarked className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="submissions" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="submissions">{t('profile.tabs.submissions', 'Submissions')}</TabsTrigger>
          <TabsTrigger value="chat">{t('profile.chat_sessions', 'AI Chat Sessions')}</TabsTrigger>
          <TabsTrigger value="bp">{t('bp_analysis.title', 'BP Analysis')}</TabsTrigger>
          <TabsTrigger value="bmc">{t('bp_analysis.tabs.canvas', 'BMC')}</TabsTrigger>
          <TabsTrigger value="interaction">{t('profile.tabs.interaction', 'Interaction')}</TabsTrigger>
        </TabsList>

        {/* Submissions Tab - 默认第一个 */}
        <TabsContent value="submissions">
          <div className="space-y-6">
            {/* BP Submissions */}
            <Card>
              <CardHeader>
                <CardTitle>{t('profile.bp_submissions', 'Business Plan Submissions')}</CardTitle>
                <CardDescription>
                  {t('profile.bp_desc', 'Your uploaded business plans and analysis results')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {bpSubmissions.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-foreground-secondary mb-4">
                      {t('profile.no_bp', 'No business plan submissions yet')}
                    </p>
                    <Button 
                      onClick={() => navigate('/bp-analysis')}
                      variant="outline"
                    >
                      {t('profile.upload_bp', 'Upload Your First BP')}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {bpSubmissions.map((bp: any) => (
                      <div key={bp.id} className="border border-border rounded-lg p-4 hover:shadow-md transition-shadow bg-card">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <FileText className="w-5 h-5 text-primary-500" />
                              <h4 className="font-semibold text-foreground">{bp.file_name}</h4>
                              {bp.analysis_status && (
                                <Badge variant={
                                  bp.analysis_status === 'completed' ? 'default' : 
                                  bp.analysis_status === 'analyzing' ? 'secondary' :
                                  bp.analysis_status === 'failed' ? 'destructive' : 
                                  'outline'
                                }>
                                  {bp.analysis_status}
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span>{formatDate(bp.created_at)}</span>
                              <span>•</span>
                              <span>{formatFileSize(bp.file_size)}</span>
                              {bp.score && (
                                <>
                                  <span>•</span>
                                  <span className={cn(
                                    "font-semibold",
                                    bp.score >= 80 ? "text-success-600 dark:text-success-400" :
                                    bp.score >= 60 ? "text-warning-600 dark:text-warning-400" :
                                    "text-error-600 dark:text-error-400"
                                  )}>
                                    {t('profile.score', 'Score')}: {bp.score}/100
                                  </span>
                                </>
                              )}
                            </div>
                            
                            {/* 显示4个维度的得分（如果已分析） */}
                            {bp.analysis_scores && (
                              <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                                <div className="p-2 bg-muted/50 rounded">
                                  <p className="text-muted-foreground mb-1">AI Insight</p>
                                  <p className="font-semibold text-foreground">{bp.analysis_scores.aiInsight?.overall || 0}</p>
                                </div>
                                <div className="p-2 bg-muted/50 rounded">
                                  <p className="text-muted-foreground mb-1">Market</p>
                                  <p className="font-semibold text-foreground">{bp.analysis_scores.marketInsights?.overall || 0}</p>
                                </div>
                                <div className="p-2 bg-muted/50 rounded">
                                  <p className="text-muted-foreground mb-1">Risk</p>
                                  <p className="font-semibold text-foreground">{bp.analysis_scores.riskAssessment?.overall || 0}</p>
                                </div>
                                <div className="p-2 bg-muted/50 rounded">
                                  <p className="text-muted-foreground mb-1">Growth</p>
                                  <p className="font-semibold text-foreground">{bp.analysis_scores.growthProjections?.overall || 0}</p>
                                </div>
                              </div>
                            )}
                          </div>
                          <div className="flex gap-2 ml-4">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                if (bp.file_url) {
                                  window.open(bp.file_url, '_blank');
                                }
                              }}
                              disabled={!bp.file_url}
                            >
                              <Download size={16} className="mr-1" />
                              {t('profile.download', 'Download')}
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => deleteBpSubmission(bp.id, bp.file_url)}
                              className="text-error-600 hover:text-error-700 hover:bg-error-50"
                            >
                              <X size={16} className="mr-1" />
                              {t('profile.delete', 'Delete')}
                            </Button>
                          </div>
                        </div>
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
                <CardDescription>
                  {t('profile.bmc_desc', 'Your saved Business Model Canvas designs')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {bmcSaves.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-foreground-secondary mb-4">
                      {t('profile.no_bmc', 'No BMC saves yet')}
                    </p>
                    <Button 
                      onClick={() => navigate('/bp-analysis')}
                      variant="outline"
                    >
                      {t('profile.create_bmc', 'Create Your First BMC')}
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {bmcSaves.map((bmc: any) => (
                      <div key={bmc.id} className="border border-border rounded-lg p-4 hover:shadow-md transition-shadow bg-card">
                        <h4 className="font-semibold text-foreground mb-2">{bmc.title || 'Untitled BMC'}</h4>
                        
                        {/* 显示BMC图片预览 */}
                        {bmc.image_url && (
                          <div className="mb-3 rounded-lg overflow-hidden border border-border">
                            <img 
                              src={bmc.image_url} 
                              alt={bmc.title || 'BMC Preview'}
                              className="w-full h-auto object-contain bg-background"
                            />
                          </div>
                        )}
                        
                        {/* 显示已提取的文本 */}
                        {extractedTexts[bmc.id] && (
                          <div className="mb-3 p-3 bg-muted rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <ScanText size={16} className="text-primary-500" />
                              <span className="text-sm font-semibold text-foreground">
                                {t('profile.extracted_text', 'Extracted Text')}:
                              </span>
                            </div>
                            <p className="text-xs text-foreground-secondary line-clamp-3">
                              {extractedTexts[bmc.id]}
                            </p>
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-foreground-secondary">
                            {formatDate(bmc.created_at)}
                          </span>
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                // 下载图片
                                const link = document.createElement('a');
                                link.href = bmc.image_url;
                                link.download = `${bmc.title || 'BMC'}_${new Date().toISOString().split('T')[0]}.png`;
                                link.click();
                              }}
                            >
                              <Download size={14} className="mr-1" />
                              {t('profile.download', 'Download')}
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleExtractText(bmc.id, bmc.image_url)}
                              disabled={extractingText === bmc.id}
                            >
                              {extractingText === bmc.id ? (
                                <>
                                  <Loader2 size={14} className="mr-1 animate-spin" />
                                  {t('profile.extracting', 'Extracting...')}
                                </>
                              ) : (
                                <>
                                  <ScanText size={14} className="mr-1" />
                                  {t('profile.extract_text', 'Extract Text')}
                                </>
                              )}
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => navigate('/bp-analysis')}
                            >
                              {t('profile.view_edit', 'View/Edit')}
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

          </div>
        </TabsContent>

        {/* Chat Sessions Tab */}
        <TabsContent value="chat">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{t('profile.chat_sessions', 'AI Chat Sessions')}</CardTitle>
                  <Button
                    onClick={() => navigate('/ai-chat')}
                    size="sm"
                    variant="outline"
                  >
                    <PlusCircle size={16} className="mr-1" />
                    {t('profile.new_chat', 'New Chat')}
                  </Button>
                </div>
                <CardDescription>
                  {t('profile.chat_desc', 'Your AI conversation history')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {chatSessions.length === 0 ? (
                  <div className="text-center py-8">
                    <Bot className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-4">
                      {t('profile.no_chats', 'No chat sessions yet')}
                    </p>
                    <Button
                      onClick={() => navigate('/ai-chat')}
                      variant="outline"
                    >
                      {t('profile.start_chat', 'Start Your First Chat')}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {chatSessions.map((chat: any) => (
                      <div 
                        key={chat.id} 
                        className="border border-border rounded-lg p-4 hover:shadow-md transition-shadow bg-card"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold text-foreground mb-1">
                              {chat.title || t('profile.untitled_chat', 'Untitled Chat')}
                            </h4>
                            <div className="flex items-center gap-3 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Clock size={14} />
                                {formatDate(chat.created_at)}
                              </span>
                              {chat.message_count > 0 && (
                                <span className="flex items-center gap-1">
                                  <MessageSquare size={14} />
                                  {chat.message_count} {t('profile.messages', 'messages')}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                navigate('/ai-chat', { 
                                  state: { 
                                    sessionId: chat.id,
                                    from: 'profile'
                                  } 
                                });
                              }}
                            >
                              <ExternalLink size={14} className="mr-1" />
                              {t('profile.view', 'View')}
                            </Button>
                            {chat.markdown_file_url && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={async () => {
                                  try {
                                    const response = await fetch(chat.markdown_file_url);
                                    if (response.ok) {
                                      const markdownContent = await response.text();
                                      const blob = new Blob([markdownContent], { type: 'text/markdown;charset=utf-8' });
                                      const url = URL.createObjectURL(blob);
                                      const a = document.createElement('a');
                                      a.href = url;
                                      a.download = `${chat.title || 'chat'}.md`;
                                      document.body.appendChild(a);
                                      a.click();
                                      document.body.removeChild(a);
                                      URL.revokeObjectURL(url);
                                    } else {
                                      console.error('Failed to fetch markdown content');
                                      alert('无法下载markdown文件');
                                    }
                                  } catch (error) {
                                    console.error('Error downloading markdown:', error);
                                    alert('下载markdown文件时出错');
                                  }
                                }}
                                title={t('profile.download_markdown', 'Download Markdown')}
                              >
                                <Download size={14} />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteChatSession(chat.id, chat.markdown_file_path)}
                              title={t('profile.delete', 'Delete')}
                            >
                              <X size={14} className="text-destructive" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* BP Tab */}
        <TabsContent value="bp">
          <div className="space-y-6">
            <Button onClick={() => navigate('/bp-analysis')}>
              {t('bp_analysis.upload_bp', 'Upload BP')}
            </Button>
          </div>
        </TabsContent>

        {/* BMC Tab */}
        <TabsContent value="bmc">
          <div className="space-y-6">
            <Button onClick={() => navigate('/bp-analysis?tab=canvas')}>
              {t('bp_analysis.tabs.canvas', 'Business Model Canvas')}
            </Button>
          </div>
        </TabsContent>

        {/* Interaction Tab - 移动到最后一个 */}
        <TabsContent value="interaction">
          <div className="space-y-6">
            {/* Liked Stories */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Heart className="w-5 h-5 mr-2" />
                  {t('profile.liked_stories', 'Liked Stories')}
                </CardTitle>
                <CardDescription>
                  {t('profile.liked_desc', 'Stories you have liked')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {savedStories.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    {t('profile.no_liked', 'No liked stories yet')}
                  </p>
                ) : (
                  <div className="space-y-4">
                    {savedStories.slice(0, 5).map((save: any) => (
                      <div key={save.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <Link to={`/story/${save.stories?.id}`} className="block">
                          <h3 className="font-semibold text-gray-900 dark:text-gray-100 hover:text-primary-600 transition-colors">
                            {save.stories?.title}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400 text-sm mt-1 line-clamp-2">
                            {save.stories?.content}
                          </p>
                          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mt-2">
                            <span>{t('profile.liked_on', 'Liked on')} {formatDate(save.created_at)}</span>
                            <span className="flex items-center">
                              <Heart className="w-4 h-4 mr-1 text-red-500" />
                              {save.stories?.like_count || 0}
                            </span>
                          </div>
                        </Link>
                      </div>
                    ))}
                    {savedStories.length > 5 && (
                      <div className="text-center">
                        <Button variant="outline" onClick={() => navigate('/profile?tab=saved')}>
                          {t('profile.view_all_liked', 'View All Liked Stories')}
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Saved Stories */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookMarked className="w-5 h-5 mr-2" />
                  {t('profile.saved_stories', 'Saved Stories')}
                </CardTitle>
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
                    {savedStories.slice(0, 5).map((save: any) => (
                      <div key={save.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <Link to={`/story/${save.stories?.id}`} className="block">
                          <h3 className="font-semibold text-gray-900 dark:text-gray-100 hover:text-primary-600 transition-colors">
                            {save.stories?.title}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400 text-sm mt-1 line-clamp-2">
                            {save.stories?.content}
                          </p>
                          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mt-2">
                            <span>{t('profile.saved_on', 'Saved on')} {formatDate(save.created_at)}</span>
                            <span className="flex items-center">
                              <BookMarked className="w-4 h-4 mr-1 text-blue-500" />
                            </span>
                          </div>
                        </Link>
                      </div>
                    ))}
                    {savedStories.length > 5 && (
                      <div className="text-center">
                        <Button variant="outline" onClick={() => navigate('/profile?tab=saved')}>
                          {t('profile.view_all_saved', 'View All Saved Stories')}
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Comments */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="w-5 h-5 mr-2" />
                  {t('profile.my_comments', 'My Comments')}
                </CardTitle>
                <CardDescription>
                  {t('profile.comments_desc', 'Comments you have made on stories')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <MessageSquare className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500 mb-4">
                    {t('profile.no_comments', 'No comments yet')}
                  </p>
                  <p className="text-sm text-gray-400">
                    {t('profile.comments_help', 'Start engaging with the community by commenting on stories!')}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}