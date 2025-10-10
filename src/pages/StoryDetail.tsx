import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { SocialInteractions } from '@/components/stories/SocialInteractions';
import { CommentSystem } from '@/components/stories/CommentSystem';
import { TagDisplay } from '@/components/stories/TagDisplay';
import { 
  ArrowLeft, 
  Clock, 
  Eye, 
  Calendar,
  MapPin,
  User,
  Share2,
  Heart,
  Bookmark,
  MessageSquare,
  Edit
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface Tag {
  id: string;
  name: string;
  display_name: string;
  color: string;
}

interface Story {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  author_id: string;
  category: string;
  category_id: string;
  status: string;
  featured_image_url: string;
  publisher: string;
  is_public: boolean;
  location: string | null;
  view_count: number;
  like_count: number;
  comment_count: number;
  saves_count: number;
  read_time_minutes: number;
  created_at: string;
  updated_at: string;
  published_at: string;
  profiles?: {
    full_name: string;
    username: string;
    avatar_url: string;
  };
  tags?: Tag[];
}

export default function StoryDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user } = useAuth();
  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userInteractions, setUserInteractions] = useState({
    hasLiked: false,
    hasSaved: false
  });
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);

  // Fetch story details
  useEffect(() => {
    if (!id) {
      setError('Story ID is required');
      setLoading(false);
      return;
    }

    fetchStoryDetails();
  }, [id]);

  // Fetch user interactions
  useEffect(() => {
    if (story) {
      fetchUserInteractions();
      incrementViewCount();
    }
  }, [story, user]);

  const fetchStoryDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch story with author profile
      const { data: storyData, error: storyError } = await supabase
        .from('stories')
        .select(`
          *,
          profiles:author_id (
            full_name,
            username,
            avatar_url
          )
        `)
        .eq('id', id)
        .eq('status', 'published')
        .eq('is_public', true)
        .maybeSingle();

      if (storyError) {
        throw storyError;
      }

      if (!storyData) {
        setError('Story not found');
        return;
      }

      // Fetch story tags
      const { data: tagAssignments } = await supabase
        .from('story_tags')
        .select(`
          tags!inner(id, name)
        `)
        .eq('story_id', id);

      const tags = tagAssignments?.map(assignment => ({
        id: assignment.tags.id,
        name: assignment.tags.name,
        display_name: assignment.tags.name,
        color: '#3B82F6'
      })) || [];

      setStory({ ...storyData, tags });
    } catch (error: any) {
      console.error('Failed to fetch story:', error);
      setError(error.message || 'Failed to load story');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserInteractions = async () => {
    if (!story) return;

    try {
      const { data } = await supabase.functions.invoke('social-interactions', {
        body: {
          action: 'get_interactions',
          storyId: story.id,
          userId: user?.id,
          sessionId: sessionId
        }
      });

      if (data?.data) {
        setUserInteractions(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch user interactions:', error);
    }
  };

  const incrementViewCount = async () => {
    if (!story) return;

    try {
      // Only increment view count once per session
      const viewKey = `story_viewed_${story.id}`;
      if (sessionStorage.getItem(viewKey)) {
        return;
      }

      await supabase
        .from('stories')
        .update({ view_count: (story.view_count || 0) + 1 })
        .eq('id', story.id);

      sessionStorage.setItem(viewKey, 'true');

      // Update local state
      setStory(prev => prev ? { ...prev, view_count: (prev.view_count || 0) + 1 } : null);
    } catch (error) {
      console.error('Failed to increment view count:', error);
    }
  };

  const handleInteraction = async (action: string, platform?: string) => {
    if (!story) return;

    try {
      const { data } = await supabase.functions.invoke('social-interactions', {
        body: {
          action,
          storyId: story.id,
          userId: user?.id,
          sessionId: sessionId,
          platform
        }
      });

      if (data?.data?.success) {
        // Update local interactions state
        if (action === 'like') {
          setUserInteractions(prev => ({ ...prev, hasLiked: true }));
          setStory(prev => prev ? { ...prev, like_count: (prev.like_count || 0) + 1 } : null);
        } else if (action === 'unlike') {
          setUserInteractions(prev => ({ ...prev, hasLiked: false }));
          setStory(prev => prev ? { ...prev, like_count: Math.max(0, (prev.like_count || 0) - 1) } : null);
        } else if (action === 'save') {
          setUserInteractions(prev => ({ ...prev, hasSaved: true }));
        } else if (action === 'unsave') {
          setUserInteractions(prev => ({ ...prev, hasSaved: false }));
        }
      }
    } catch (error) {
      console.error(`Failed to ${action} story:`, error);
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: story?.title,
          text: story?.excerpt,
          url: url
        });
        handleInteraction('share', 'native');
      } catch (error) {
        // User cancelled sharing
      }
    } else {
      // Fallback to copying URL
      try {
        await navigator.clipboard.writeText(url);
        handleInteraction('share', 'clipboard');
        // Show success toast
      } catch (error) {
        console.error('Failed to copy URL:', error);
      }
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleGoBack = () => {
    // Try to go back to the previous page
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      // Fallback to stories page
      navigate('/stories');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error || !story) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-red-800 mb-2">
                {error || 'Story not found'}
              </h2>
              <p className="text-red-600 mb-4">
                The story you're looking for might have been moved or deleted.
              </p>
              <Button onClick={handleGoBack} variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go Back
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto px-4 py-8"
    >
      {/* Header with back button */}
      <div className="mb-6">
        <Button 
          onClick={handleGoBack}
          variant="ghost" 
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t('common.back', 'Back')}
        </Button>
      </div>

      {/* Story content */}
      <article className="space-y-6">
        {/* Featured image */}
        {story.featured_image_url && (
          <div className="aspect-video w-full overflow-hidden rounded-xl">
            <img 
              src={story.featured_image_url} 
              alt={story.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = `/story-images/story-${Math.floor(Math.random() * 8) + 1}.jpg`;
              }}
            />
          </div>
        )}

        {/* Story header */}
        <div className="space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground leading-tight">
            {story.title}
          </h1>

          {/* Meta information */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-foreground-secondary">
            <div className="flex items-center gap-1">
              <User className="w-4 h-4" />
              <span>{story.profiles?.full_name || story.profiles?.username || story.publisher || 'LeiaoAI Agent'}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>
                {formatDate(story.published_at || story.created_at)}
                {story.updated_at && story.updated_at !== story.created_at && (
                  <span className="ml-2 text-xs text-muted-foreground">
                    ({t('story.edited', 'edited')})
                  </span>
                )}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{story.read_time_minutes || 5} min read</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              <span>{(story.view_count || 0).toLocaleString()} views</span>
            </div>
            {story.location && (
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{story.location}</span>
              </div>
            )}
          </div>

          {/* Tags */}
          {story.tags && story.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {story.tags.map((tag) => (
                <Badge 
                  key={tag.id} 
                  variant="outline" 
                  style={{ 
                    borderColor: tag.color,
                    color: tag.color 
                  }}
                >
                  {tag.display_name}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Social interactions */}
        <div className="flex items-center justify-between py-4 border-y border-border">
          <div className="flex items-center gap-4">
            <button
              onClick={() => handleInteraction(userInteractions.hasLiked ? 'unlike' : 'like')}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-full transition-colors",
                userInteractions.hasLiked 
                  ? "bg-red-100 text-red-600 hover:bg-red-200" 
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              )}
            >
              <Heart className={cn("w-4 h-4", userInteractions.hasLiked && "fill-current")} />
              <span>{(story.like_count || 0).toLocaleString()}</span>
            </button>

            <button
              onClick={() => handleInteraction(userInteractions.hasSaved ? 'unsave' : 'save')}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-full transition-colors",
                userInteractions.hasSaved 
                  ? "bg-blue-100 text-blue-600 hover:bg-blue-200" 
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              )}
            >
              <Bookmark className={cn("w-4 h-4", userInteractions.hasSaved && "fill-current")} />
              <span>{userInteractions.hasSaved ? 'Saved' : 'Save'}</span>
            </button>

            <button
              onClick={() => {
                const commentsSection = document.getElementById('comments-section');
                if (commentsSection) {
                  commentsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  // Focus on comment input after scroll
                  setTimeout(() => {
                    const commentInput = document.querySelector<HTMLTextAreaElement>('[data-comment-input]');
                    if (commentInput) commentInput.focus();
                  }, 500);
                }
              }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" />
              <span>{(story.comment_count || 0).toLocaleString()}</span>
            </button>
          </div>

          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
          >
            <Share2 className="w-4 h-4" />
            <span>Share</span>
          </button>
        </div>

        {/* Edit button for story author */}
        {user && story.author_id === user.id && (
          <div className="flex justify-end mb-4">
            <Button 
              onClick={() => navigate(`/edit-story/${story.id}`)}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Edit size={16} />
              {t('story.edit', 'Edit Story')}
            </Button>
          </div>
        )}

        {/* Story content */}
        <div className="prose prose-lg max-w-none">
          <div className="whitespace-pre-wrap text-foreground leading-relaxed">
            {story.content}
          </div>
        </div>

        {/* Comments section */}
        <div id="comments-section" className="mt-12 pt-8 border-t border-border">
          <h3 className="text-xl font-semibold mb-6">Comments ({story.comment_count || 0})</h3>
          <CommentSystem 
            storyId={story.id} 
            userId={user?.id}
            sessionId={sessionId}
            onCommentAdded={() => {
              setStory(prev => prev ? { ...prev, comment_count: (prev.comment_count || 0) + 1 } : null);
            }}
          />
        </div>
      </article>
    </motion.div>
  );
}