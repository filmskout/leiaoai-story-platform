import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase, Profile, Story } from '@/lib/supabase';
import { 
  User, 
  MapPin, 
  Calendar, 
  Edit, 
  MessageSquare,
  Heart,
  Eye
} from 'lucide-react';

interface UserProfileData extends Profile {
  stories?: Story[];
  story_count?: number;
  total_views?: number;
  total_likes?: number;
}

export default function UserProfile() {
  const { id } = useParams<{ id: string }>();
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      fetchUserProfile(id);
    }
  }, [id]);

  const fetchUserProfile = async (userId: string) => {
    try {
      setLoading(true);
      
      // 获取用户资料
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();
      
      if (profileError) throw profileError;
      
      if (!profileData) {
        setError('用户不存在');
        return;
      }

      // 获取用户的公开故事
      const { data: storiesData, error: storiesError } = await supabase
        .from('stories')
        .select('*')
        .eq('user_id', userId)
        .eq('is_public', true)
        .order('created_at', { ascending: false });
      
      if (storiesError) throw storiesError;
      
      // 计算统计数据
      const storyCount = storiesData?.length || 0;
      const totalViews = storiesData?.reduce((sum, story) => sum + story.view_count, 0) || 0;
      const totalLikes = storiesData?.reduce((sum, story) => sum + story.like_count, 0) || 0;

      setProfile({
        ...profileData,
        story_count: storyCount,
        total_views: totalViews,
        total_likes: totalLikes
      });
      
      setStories(storiesData || []);
      
    } catch (error: any) {
      console.error('获取用户资料失败:', error);
      setError('加载用户资料失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long'
    });
  };

  const truncateContent = (content: string, maxLength: number = 100) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">用户未找到</h3>
          <p className="text-gray-600 mb-4">{error || '该用户可能不存在'}</p>
          <Link
            to="/"
            className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium"
          >
            <span>返回首页</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* 用户信息卡片 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* 头部背景 */}
        <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600"></div>
        
        <div className="px-6 pb-6">
          {/* 头像和基本信息 */}
          <div className="flex items-start space-x-6 -mt-16">
            <img
              src={profile.avatar_url || '/default-user-avatar-placeholder-modern-clean.jpg'}
              alt="用户头像"
              className="w-24 h-24 rounded-full border-4 border-white bg-white object-cover"
            />
            <div className="flex-1 pt-16">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-1">
                    {profile.full_name || profile.username || '匿名用户'}
                  </h1>
                  {profile.username && profile.full_name && (
                    <p className="text-gray-600 mb-2">@{profile.username}</p>
                  )}
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                    {profile.location && (
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4" />
                        <span>{profile.location}</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>加入于 {formatDate(profile.created_at)}</span>
                    </div>
                  </div>
                  {profile.bio && (
                    <p className="text-gray-700 leading-relaxed max-w-2xl">
                      {profile.bio}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* 统计数据 */}
          <div className="mt-6 grid grid-cols-3 gap-6 p-4 bg-gray-50 rounded-lg">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{profile.story_count || 0}</div>
              <div className="text-sm text-gray-600">发布故事</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{profile.total_views || 0}</div>
              <div className="text-sm text-gray-600">总阅读量</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{profile.total_likes || 0}</div>
              <div className="text-sm text-gray-600">总点赞数</div>
            </div>
          </div>
        </div>
      </div>

      {/* 用户故事 */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">
            {profile.full_name || profile.username || '用户'} 的故事
          </h2>
        </div>

        {stories.length > 0 ? (
          <div className="grid gap-6">
            {stories.map((story) => (
              <article key={story.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="space-y-4">
                  {/* 故事头部 */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                        {story.category}
                      </span>
                      <span className="text-gray-500 text-sm">
                        {formatDate(story.created_at)}
                      </span>
                    </div>
                  </div>
                  
                  {/* 故事内容 */}
                  <Link to={`/story/${story.id}`} className="group">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {story.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {truncateContent(story.content, 150)}
                    </p>
                  </Link>

                  {/* 故事统计 */}
                  <div className="flex items-center space-x-6 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Eye className="w-4 h-4" />
                      <span>{story.view_count}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Heart className="w-4 h-4" />
                      <span>{story.like_count}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MessageSquare className="w-4 h-4" />
                      <span>{story.comment_count}</span>
                    </div>
                    <Link
                      to={`/story/${story.id}`}
                      className="text-blue-600 hover:text-blue-700 font-medium ml-auto"
                    >
                      阅读更多
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Edit className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">还没有发布任何故事</h3>
            <p className="text-gray-600">
              {profile.full_name || profile.username || '该用户'} 还没有分享任何 AI 体验故事。
            </p>
          </div>
        )}
      </div>
    </div>
  );
}