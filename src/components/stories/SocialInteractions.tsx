import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
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

interface SocialInteractionsProps {
  storyId: string;
  initialStats?: {
    view_count: number;
    like_count: number;
    comment_count: number;
    saves_count: number;
  };
  className?: string;
}

export function SocialInteractions({ storyId, initialStats, className }: SocialInteractionsProps) {
  const { user } = useAuth();
  const [stats, setStats] = useState(initialStats || {
    view_count: 0,
    like_count: 0,
    comment_count: 0,
    saves_count: 0
  });
  const [userInteractions, setUserInteractions] = useState({
    hasLiked: false,
    hasSaved: false
  });
  const [loading, setLoading] = useState(false);
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);

  useEffect(() => {
    fetchUserInteractions();
    fetchStoryStats();
  }, [storyId, user]);

  const fetchUserInteractions = async () => {
    try {
      const { data } = await supabase.functions.invoke('story-interactions', {
        body: {
          action: 'get_user_interactions',
          storyId,
          userId: user?.id,
          sessionId
        }
      });

      if (data?.data) {
        setUserInteractions(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch user interactions:', error);
    }
  };

  const fetchStoryStats = async () => {
    try {
      const { data } = await supabase.functions.invoke('story-interactions', {
        body: {
          action: 'get_story_stats',
          storyId
        }
      });

      if (data?.data) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch story stats:', error);
    }
  };

  const handleInteraction = async (action: string, platform?: string) => {
    if (loading) return;
    
    try {
      setLoading(true);
      
      const { data } = await supabase.functions.invoke('story-interactions', {
        body: {
          action,
          storyId,
          userId: user?.id,
          sessionId,
          platform
        }
      });

      if (data?.data?.success) {
        // Update local state based on action
        if (action === 'like') {
          setUserInteractions(prev => ({ ...prev, hasLiked: true }));
          setStats(prev => ({ ...prev, like_count: prev.like_count + 1 }));
        } else if (action === 'unlike') {
          setUserInteractions(prev => ({ ...prev, hasLiked: false }));
          setStats(prev => ({ ...prev, like_count: Math.max(0, prev.like_count - 1) }));
        } else if (action === 'save') {
          setUserInteractions(prev => ({ ...prev, hasSaved: true }));
        } else if (action === 'unsave') {
          setUserInteractions(prev => ({ ...prev, hasSaved: false }));
        }
      }
    } catch (error) {
      console.error(`Failed to ${action}:`, error);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Check out this story',
          text: 'I found this interesting story',
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
        // You might want to show a toast notification here
      } catch (error) {
        console.error('Failed to copy URL:', error);
      }
    }
  };

  return (
    <div className={cn("flex items-center justify-between", className)}>
      <div className="flex items-center gap-4">
        {/* Like button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleInteraction(userInteractions.hasLiked ? 'unlike' : 'like')}
          disabled={loading}
          className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-full transition-colors",
            userInteractions.hasLiked 
              ? "bg-red-100 text-red-600 hover:bg-red-200" 
              : "bg-gray-100 text-gray-600 hover:bg-gray-200",
            loading && "opacity-50 cursor-not-allowed"
          )}
        >
          <Heart className={cn("w-4 h-4", userInteractions.hasLiked && "fill-current")} />
          <span className="text-sm font-medium">
            {stats.like_count.toLocaleString()}
          </span>
        </motion.button>

        {/* Save button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleInteraction(userInteractions.hasSaved ? 'unsave' : 'save')}
          disabled={loading}
          className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-full transition-colors",
            userInteractions.hasSaved 
              ? "bg-blue-100 text-blue-600 hover:bg-blue-200" 
              : "bg-gray-100 text-gray-600 hover:bg-gray-200",
            loading && "opacity-50 cursor-not-allowed"
          )}
        >
          <Bookmark className={cn("w-4 h-4", userInteractions.hasSaved && "fill-current")} />
          <span className="text-sm font-medium">
            {userInteractions.hasSaved ? 'Saved' : 'Save'}
          </span>
        </motion.button>

        {/* Comments display */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 text-gray-600">
          <MessageSquare className="w-4 h-4" />
          <span className="text-sm font-medium">
            {stats.comment_count.toLocaleString()}
          </span>
        </div>

        {/* Views display */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 text-gray-600">
          <Eye className="w-4 h-4" />
          <span className="text-sm font-medium">
            {stats.view_count.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Share button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleShare}
        disabled={loading}
        className={cn(
          "flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors",
          loading && "opacity-50 cursor-not-allowed"
        )}
      >
        <Share2 className="w-4 h-4" />
        <span className="text-sm font-medium">Share</span>
      </motion.button>
    </div>
  );
}