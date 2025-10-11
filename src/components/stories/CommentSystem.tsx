import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  MessageSquare, 
  Send, 
  User,
  Calendar,
  Reply,
  MoreVertical
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { getComments, addComment } from '@/lib/storyInteractions';

interface Comment {
  id: string;
  story_id: string;
  user_id: string | null;
  session_id: string | null;
  author_name: string;
  content: string;
  parent_comment_id: string | null;
  created_at: string;
  updated_at: string;
}

interface CommentSystemProps {
  storyId: string;
  userId?: string;
  sessionId: string;
  onCommentAdded?: () => void;
}

export function CommentSystem({ storyId, userId, sessionId, onCommentAdded }: CommentSystemProps) {
  const { t } = useTranslation();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [showNameInput, setShowNameInput] = useState(!userId);

  useEffect(() => {
    fetchComments();
  }, [storyId]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('story_comments')
        .select('*')
        .eq('story_id', storyId)
        .order('created_at', { ascending: true });

      if (error) {
        throw error;
      }

      setComments(data || []);
    } catch (error) {
      console.error('Failed to fetch comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newComment.trim()) return;
    if (!userId && !authorName.trim()) {
      alert('Please enter your name');
      return;
    }

    try {
      setSubmitting(true);

      const result = await addComment(
        storyId,
        newComment.trim(),
        userId || undefined,
        sessionId,
        authorName.trim() || 'Anonymous'
      );

      if (result.success && result.comment) {
        // Add new comment to local state
        setComments(prev => [result.comment, ...prev]);
        
        // Reset form
        setNewComment('');
        
        // Call callback
        if (onCommentAdded) {
          onCommentAdded();
        }
      } else {
        alert('Failed to submit comment. Please try again.');
      }
    } catch (error) {
      console.error('Failed to submit comment:', error);
      alert('Failed to submit comment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffMinutes = Math.ceil(diffTime / (1000 * 60));
    const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffMinutes < 60) {
      return `${diffMinutes}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else if (diffDays < 7) {
      return `${diffDays}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Comment form */}
      <Card>
        <CardContent className="p-4">
          <form onSubmit={handleSubmitComment} className="space-y-4">
            {!userId && (
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-background text-foreground"
                  placeholder="Enter your name..."
                  required={!userId}
                />
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Add a comment
              </label>
              <textarea
                data-comment-input
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none bg-background text-foreground"
                placeholder="Share your thoughts..."
                required
              />
            </div>
            
            <div className="flex justify-end">
              <Button 
                type="submit" 
                disabled={submitting || !newComment.trim() || (!userId && !authorName.trim())}
                className="flex items-center gap-2"
              >
                {submitting ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                {submitting ? 'Posting...' : 'Post Comment'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Comments list */}
      <div className="space-y-4">
        <AnimatePresence>
          {comments.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">
                  No comments yet
                </h3>
                <p className="text-foreground-secondary">
                  Be the first to share your thoughts!
                </p>
              </CardContent>
            </Card>
          ) : (
            comments.map((comment) => (
              <motion.div
                key={comment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-foreground">
                              {comment.author_name}
                            </span>
                            {comment.user_id && (
                              <Badge variant="secondary" className="text-xs">
                                Member
                              </Badge>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-2 text-sm text-foreground-secondary">
                            <Calendar className="w-3 h-3" />
                            <span>{formatDate(comment.created_at)}</span>
                          </div>
                        </div>
                        
                        <p className="text-foreground leading-relaxed">
                          {comment.content}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}