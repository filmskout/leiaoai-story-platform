import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import LoadingSpinner from '@/components/LoadingSpinner';
import { ArrowLeft, Heart, Share2, Bookmark, MessageCircle, Calendar, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { PageHero } from '@/components/PageHero';
import { Target } from 'lucide-react';

const CATEGORY_CONFIG = {
  'LLM & Language Models': { icon: Target, color: 'text-purple-500', bgColor: 'bg-purple-50 dark:bg-purple-900/20' },
  'Image Processing & Generation': { icon: Target, color: 'text-pink-500', bgColor: 'bg-pink-50 dark:bg-pink-900/20' },
  'Video Processing & Generation': { icon: Target, color: 'text-red-500', bgColor: 'bg-red-50 dark:bg-red-900/20' },
  'Professional Domain Analysis': { icon: Target, color: 'text-blue-500', bgColor: 'bg-blue-50 dark:bg-blue-900/20' },
  'Virtual Companions': { icon: Target, color: 'text-green-500', bgColor: 'bg-green-50 dark:bg-green-900/20' },
  'Virtual Employees & Assistants': { icon: Target, color: 'text-indigo-500', bgColor: 'bg-indigo-50 dark:bg-indigo-900/20' },
  'Voice & Audio AI': { icon: Target, color: 'text-orange-500', bgColor: 'bg-orange-50 dark:bg-orange-900/20' },
  'Search & Information Retrieval': { icon: Target, color: 'text-cyan-500', bgColor: 'bg-cyan-50 dark:bg-cyan-900/20' }
};

type Story = {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  cover_image_url?: string;
  category?: string;
  tags?: string[];
  likes_count?: number;
  views_count?: number;
  comments_count?: number;
  saves_count?: number;
  created_at?: string;
  author_id?: string;
  project?: { id: string; name: string };
  company?: { id: string; name: string };
  user_liked?: boolean;
  user_saved?: boolean;
};

export default function CategoryStories() {
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);

  const config = category ? CATEGORY_CONFIG[category as keyof typeof CATEGORY_CONFIG] : null;
  const Icon = config?.icon || Target;

  useEffect(() => {
    loadStories();
  }, [category, user]);

  const loadStories = async () => {
    if (!category) return;
    
    setLoading(true);
    try {
      let query = supabase
        .from('stories')
        .select(`
          *,
          project_stories(project:projects(id, name)),
          company_stories(company:companies(id, name))
        `)
        .eq('category', decodeURIComponent(category))
        .eq('status', 'published')
        .order('created_at', { ascending: false });

      const { data, error } = await query;

      if (error) throw error;

      // Transform data
      const transformed = (data || []).map(story => ({
        ...story,
        project: story.project_stories?.[0]?.project,
        company: story.company_stories?.[0]?.company
      }));

      setStories(transformed);

      // Load user interactions
      if (user?.id) {
        loadUserInteractions(transformed.map(s => s.id));
      }
    } catch (error) {
      console.error('Error loading stories:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserInteractions = async (storyIds: string[]) => {
    if (!user?.id || storyIds.length === 0) return;

    try {
      // Load likes
      const { data: likes } = await supabase
        .from('story_likes')
        .select('story_id')
        .in('story_id', storyIds)
        .eq('user_id', user.id);

      // Load saves
      const { data: saves } = await supabase
        .from('story_saves')
        .select('story_id')
        .in('story_id', storyIds)
        .eq('user_id', user.id);

      const likedIds = new Set(likes?.map(l => l.story_id) || []);
      const savedIds = new Set(saves?.map(s => s.story_id) || []);

      setStories(prev => prev.map(s => ({
        ...s,
        user_liked: likedIds.has(s.id),
        user_saved: savedIds.has(s.id)
      })));
    } catch (error) {
      console.error('Error loading interactions:', error);
    }
  };

  const handleLike = async (storyId: string, liked: boolean) => {
    if (!user?.id) {
      navigate('/auth');
      return;
    }

    try {
      if (liked) {
        await supabase
          .from('story_likes')
          .delete()
          .eq('story_id', storyId)
          .eq('user_id', user.id);

        await supabase.rpc('decrement_story_count', {
          story_id: storyId,
          column_name: 'likes_count'
        });
      } else {
        await supabase
          .from('story_likes')
          .insert({ story_id: storyId, user_id: user.id });

        await supabase.rpc('increment_story_count', {
          story_id: storyId,
          column_name: 'likes_count'
        });
      }

      setStories(prev => prev.map(s => 
        s.id === storyId 
          ? { ...s, user_liked: !liked, likes_count: (s.likes_count || 0) + (liked ? -1 : 1) }
          : s
      ));
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleSave = async (storyId: string, saved: boolean) => {
    if (!user?.id) {
      navigate('/auth');
      return;
    }

    try {
      if (saved) {
        await supabase
          .from('story_saves')
          .delete()
          .eq('story_id', storyId)
          .eq('user_id', user.id);

        await supabase.rpc('decrement_story_count', {
          story_id: storyId,
          column_name: 'saves_count'
        });
      } else {
        await supabase
          .from('story_saves')
          .insert({ story_id: storyId, user_id: user.id });

        await supabase.rpc('increment_story_count', {
          story_id: storyId,
          column_name: 'saves_count'
        });
      }

      setStories(prev => prev.map(s => 
        s.id === storyId 
          ? { ...s, user_saved: !saved, saves_count: (s.saves_count || 0) + (saved ? -1 : 1) }
          : s
      ));
    } catch (error) {
      console.error('Error toggling save:', error);
    }
  };

  const handleShare = async (story: Story) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: story.title,
          text: story.excerpt || '',
          url: `${window.location.origin}/story/${story.id}`
        });

        // Increment share count
        await supabase.rpc('increment_story_count', {
          story_id: story.id,
          column_name: 'share_count'
        });
      } catch (error) {
        // User cancelled or error
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(`${window.location.origin}/story/${story.id}`);
        // Show toast notification
      } catch (error) {
        console.error('Failed to copy URL:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <PageHero
        title={category ? decodeURIComponent(category) : 'Category Stories'}
        subtitle="Discover stories in this category"
        icon={Icon}
      />

      <div className="container-custom py-8">
        <div className="mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回
          </Button>
        </div>

        <div className="mb-6">
          <Badge className={`${config?.bgColor} ${config?.color} text-lg px-4 py-2`}>
            <Icon className="w-4 h-4 mr-2" />
            {category ? decodeURIComponent(category) : 'All Categories'}
          </Badge>
          <p className="text-muted-foreground mt-2">
            {stories.length} 篇故事
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stories.map((story) => (
            <motion.div
              key={story.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="h-full hover:shadow-lg transition-all duration-300 cursor-pointer"
                    onClick={() => navigate(`/story/${story.id}`, { state: { fromCategory: category } })}>
                {story.cover_image_url && (
                  <div className="aspect-video w-full overflow-hidden rounded-t-lg">
                    <img
                      src={story.cover_image_url}
                      alt={story.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <div>
                      <h3 className="font-semibold text-lg line-clamp-2 mb-2">
                        {story.title}
                      </h3>
                      {story.excerpt && (
                        <p className="text-sm text-muted-foreground line-clamp-3">
                          {story.excerpt}
                        </p>
                      )}
                    </div>

                    {story.tags && story.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {story.tags.slice(0, 3).map(tag => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}

                    {(story.project || story.company) && (
                      <div className="text-xs text-muted-foreground">
                        {story.project && (
                          <Link
                            to={`/project/${story.project.id}`}
                            onClick={(e) => e.stopPropagation()}
                            className="hover:text-primary"
                          >
                            {story.project.name}
                          </Link>
                        )}
                        {story.project && story.company && ' • '}
                        {story.company && (
                          <Link
                            to={`/ai-companies/${story.company.id}`}
                            onClick={(e) => e.stopPropagation()}
                            className="hover:text-primary"
                          >
                            {story.company.name}
                          </Link>
                        )}
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-3 border-t">
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        {story.created_at && (
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(story.created_at).toLocaleDateString()}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleLike(story.id, story.user_liked || false);
                          }}
                        >
                          <Heart className={`w-4 h-4 ${story.user_liked ? 'fill-red-500 text-red-500' : ''}`} />
                          {story.likes_count || 0}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSave(story.id, story.user_saved || false);
                          }}
                        >
                          <Bookmark className={`w-4 h-4 ${story.user_saved ? 'fill-blue-500 text-blue-500' : ''}`} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleShare(story);
                          }}
                        >
                          <Share2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {stories.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">该分类下暂无故事</p>
          </div>
        )}
      </div>
    </div>
  );
}

