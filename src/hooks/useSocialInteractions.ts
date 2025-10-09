import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

interface SocialInteractionsState {
  hasLiked: boolean;
  hasSaved: boolean;
  isLoading: boolean;
  error: string | null;
  canComment: boolean;
  canSave: boolean;
}

export function useSocialInteractions(storyId: string) {
  const { user } = useAuth();
  const isAuthenticated = Boolean(user);
  
  const [state, setState] = useState<SocialInteractionsState>({
    hasLiked: false,
    hasSaved: false,
    isLoading: false,
    error: null,
    canComment: isAuthenticated, // Only authenticated users can comment
    canSave: isAuthenticated     // Only authenticated users can save
  });

  // Update access controls when authentication status changes
  useEffect(() => {
    setState(prev => ({
      ...prev,
      canComment: isAuthenticated,
      canSave: isAuthenticated
    }));
  }, [isAuthenticated]);

  // Load user's current interactions with this story (works for both authenticated and anonymous)
  const loadInteractions = useCallback(async () => {
    if (!storyId) return;

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const requestBody: any = {
        action: 'get_interactions',
        storyId
      };
      
      // Include userId only if authenticated
      if (user) {
        requestBody.userId = user.id;
      }

      const { data, error } = await supabase.functions.invoke('social-interactions', {
        body: requestBody
      });

      if (error) throw error;

      setState(prev => ({
        ...prev,
        hasLiked: data.data.hasLiked,
        hasSaved: data.data.hasSaved, // Will be false for anonymous users
        isLoading: false
      }));
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        error: error.message || 'Failed to load interactions',
        isLoading: false
      }));
    }
  }, [user, storyId]);

  // Handle like/unlike (works for both authenticated and anonymous users)
  const toggleLike = useCallback(async () => {
    if (!storyId) return;

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const action = state.hasLiked ? 'unlike' : 'like';
      const requestBody: any = {
        action,
        storyId
      };
      
      // Include userId only if authenticated
      if (user) {
        requestBody.userId = user.id;
      }

      const { data, error } = await supabase.functions.invoke('social-interactions', {
        body: requestBody
      });

      if (error) throw error;

      setState(prev => ({
        ...prev,
        hasLiked: !prev.hasLiked,
        isLoading: false
      }));

      // Trigger achievement check only for authenticated users
      if (user) {
        try {
          await supabase.functions.invoke('gamification-system', {
            body: {
              action: 'check_achievements',
              userId: user.id,
              eventType: 'like_story',
              eventData: { storyId }
            }
          });
        } catch (gamificationError) {
          // Don't fail the like operation if gamification fails
          console.warn('Gamification system error:', gamificationError);
        }
      }

      return data.data;
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        error: error.message || 'Failed to toggle like',
        isLoading: false
      }));
      throw error;
    }
  }, [user, storyId, state.hasLiked]);

  // Handle save/unsave
  const toggleSave = useCallback(async () => {
    if (!user || !storyId) return;

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const action = state.hasSaved ? 'unsave' : 'save';
      const { data, error } = await supabase.functions.invoke('social-interactions', {
        body: {
          action,
          userId: user.id,
          storyId
        }
      });

      if (error) throw error;

      setState(prev => ({
        ...prev,
        hasSaved: !prev.hasSaved,
        isLoading: false
      }));

      return data.data;
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        error: error.message || 'Failed to toggle save',
        isLoading: false
      }));
      throw error;
    }
  }, [user, storyId, state.hasSaved]);

  // Add comment
  const addComment = useCallback(async (content: string, parentId?: string) => {
    if (!user || !storyId || !content.trim()) return;

    try {
      const { data, error } = await supabase.functions.invoke('social-interactions', {
        body: {
          action: 'comment',
          userId: user.id,
          storyId,
          content: content.trim(),
          parentId
        }
      });

      if (error) throw error;

      // Trigger achievement check
      await supabase.functions.invoke('gamification-system', {
        body: {
          action: 'check_achievements',
          userId: user.id,
          eventType: 'comment_story',
          eventData: { storyId }
        }
      });

      return data.data;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to add comment');
    }
  }, [user, storyId]);

  // Share story (works for both authenticated and anonymous users)
  const shareStory = useCallback(async () => {
    if (!storyId) return;

    try {
      const requestBody: any = {
        action: 'share',
        storyId
      };
      
      // Include userId only if authenticated
      if (user) {
        requestBody.userId = user.id;
      }

      const { data, error } = await supabase.functions.invoke('social-interactions', {
        body: requestBody
      });

      if (error) throw error;

      // Trigger achievement check only for authenticated users
      if (user) {
        try {
          await supabase.functions.invoke('gamification-system', {
            body: {
              action: 'check_achievements',
              userId: user.id,
              eventType: 'share_story',
              eventData: { storyId }
            }
          });
        } catch (gamificationError) {
          // Don't fail the share operation if gamification fails
          console.warn('Gamification system error:', gamificationError);
        }
      }

      return data.data;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to share story');
    }
  }, [user, storyId]);

  return {
    ...state,
    loadInteractions,
    toggleLike,
    toggleSave,
    addComment,
    shareStory
  };
}