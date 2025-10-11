import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { 
  Heart, 
  Bookmark, 
  Share2, 
  MessageSquare,
  Eye
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { 
  getStoryStats,
  getUserInteractions,
  likeStory,
  unlikeStory,
  saveStory,
  unsaveStory,
  shareStory,
  type StoryStats,
  type UserInteractions
} from '@/lib/storyInteractions';

interface SocialInteractionsProps {
  storyId: string;
  initialStats?: Partial<StoryStats>;
  className?: string;
  onCommentClick?: () => void;
}

export function SocialInteractions({ 
  storyId, 
  initialStats, 
  className,
  onCommentClick 
}: SocialInteractionsProps) {
  const { user } = useAuth();
  const [stats, setStats] = useState<StoryStats>({
    view_count: initialStats?.view_count || 0,
    like_count: initialStats?.like_count || 0,
    comment_count: initialStats?.comment_count || 0,
    saves_count: initialStats?.saves_count || 0
  });
  const [userInteractions, setUserInteractions] = useState<UserInteractions>({
    hasLiked: false,
    hasSaved: false
  });
  const [loading, setLoading] = useState(false);
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);

  useEffect(() => {
    loadData();
  }, [storyId, user]);

  const loadData = async () => {
    // Load story stats
    const statsData = await getStoryStats(storyId);
    if (statsData) {
      setStats(statsData);
    }

    // Load user interactions
    const interactionsData = await getUserInteractions(storyId, user?.id, sessionId);
    setUserInteractions(interactionsData);
  };

  const handleLike = async () => {
    if (loading) return;
    
    setLoading(true);
    try {
      if (userInteractions.hasLiked) {
        // Unlike
        const result = await unlikeStory(storyId, user?.id, sessionId);
        if (result.success) {
          setUserInteractions(prev => ({ ...prev, hasLiked: false }));
          setStats(prev => ({ ...prev, like_count: Math.max(0, prev.like_count - 1) }));
        }
      } else {
        // Like
        const result = await likeStory(storyId, user?.id, sessionId);
        if (result.success) {
          setUserInteractions(prev => ({ ...prev, hasLiked: true }));
          setStats(prev => ({ ...prev, like_count: prev.like_count + 1 }));
        }
      }
    } catch (error) {
      console.error('Failed to toggle like:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (loading || !user) return;
    
    setLoading(true);
    try {
      if (userInteractions.hasSaved) {
        // Unsave
        const result = await unsaveStory(storyId, user.id);
        if (result.success) {
          setUserInteractions(prev => ({ ...prev, hasSaved: false }));
        }
      } else {
        // Save
        const result = await saveStory(storyId, user.id);
        if (result.success) {
          setUserInteractions(prev => ({ ...prev, hasSaved: true }));
        }
      }
    } catch (error) {
      console.error('Failed to toggle save:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Check out this story',
          url: url,
        });
        // Record share
        await shareStory(storyId, 'native', user?.id, sessionId);
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(url);
        alert('Link copied to clipboard!');
        await shareStory(storyId, 'clipboard', user?.id, sessionId);
      }
    } catch (error) {
      console.error('Failed to share:', error);
    }
  };

  return (
    <div className={cn('flex items-center gap-4', className)}>
      {/* Views */}
      <div className="flex items-center gap-1.5 text-muted-foreground">
        <Eye className="w-4 h-4" />
        <span className="text-sm">{stats.view_count.toLocaleString()}</span>
      </div>

      {/* Like Button */}
      <motion.div whileTap={{ scale: 0.95 }}>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLike}
          disabled={loading}
          className={cn(
            'flex items-center gap-1.5 px-3',
            userInteractions.hasLiked && 'text-error-500'
          )}
        >
          <Heart 
            className={cn(
              'w-4 h-4 transition-all',
              userInteractions.hasLiked && 'fill-current'
            )} 
          />
          <span className="text-sm">{stats.like_count.toLocaleString()}</span>
        </Button>
      </motion.div>

      {/* Comment Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={onCommentClick}
        className="flex items-center gap-1.5 px-3"
      >
        <MessageSquare className="w-4 h-4" />
        <span className="text-sm">{stats.comment_count.toLocaleString()}</span>
      </Button>

      {/* Save Button (only for logged-in users) */}
      {user && (
        <motion.div whileTap={{ scale: 0.95 }}>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSave}
            disabled={loading}
            className={cn(
              'flex items-center gap-1.5 px-3',
              userInteractions.hasSaved && 'text-primary-500'
            )}
          >
            <Bookmark 
              className={cn(
                'w-4 h-4 transition-all',
                userInteractions.hasSaved && 'fill-current'
              )} 
            />
          </Button>
        </motion.div>
      )}

      {/* Share Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={handleShare}
        className="flex items-center gap-1.5 px-3"
      >
        <Share2 className="w-4 h-4" />
      </Button>
    </div>
  );
}
