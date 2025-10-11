/**
 * Story交互功能库
 * 
 * 直接使用Supabase数据库API，不依赖Edge Functions
 * 包含: Like, Save, Comment, Share
 */

import { supabase } from './supabase';

export interface StoryStats {
  like_count: number;
  comment_count: number;
  saves_count: number;
  view_count: number;
}

export interface UserInteractions {
  hasLiked: boolean;
  hasSaved: boolean;
}

/**
 * 获取Story的统计数据
 */
export async function getStoryStats(storyId: string): Promise<StoryStats | null> {
  try {
    const { data, error } = await supabase
      .from('stories')
      .select('like_count, comment_count, saves_count, view_count')
      .eq('id', storyId)
      .single();

    if (error) throw error;
    
    return data || null;
  } catch (error) {
    console.error('Failed to fetch story stats:', error);
    return null;
  }
}

/**
 * 获取用户对Story的交互状态
 */
export async function getUserInteractions(
  storyId: string,
  userId?: string,
  sessionId?: string
): Promise<UserInteractions> {
  const interactions: UserInteractions = {
    hasLiked: false,
    hasSaved: false
  };

  try {
    // Check if user has liked
    if (userId || sessionId) {
      let likeQuery = supabase
        .from('story_likes')
        .select('id')
        .eq('story_id', storyId);

      if (userId) {
        likeQuery = likeQuery.eq('user_id', userId);
      } else if (sessionId) {
        likeQuery = likeQuery.eq('session_id', sessionId);
      }

      const { data: likeData, error: likeError } = await likeQuery.maybeSingle();
      
      if (!likeError) {
        interactions.hasLiked = !!likeData;
        console.log('🔵 getUserInteractions - Like check:', { hasLiked: interactions.hasLiked, userId, sessionId });
      }
    }

    // Check if user has saved (only for logged-in users)
    if (userId) {
      const { data: saveData, error: saveError } = await supabase
        .from('story_saves')
        .select('id')
        .eq('story_id', storyId)
        .eq('user_id', userId)
        .maybeSingle();

      if (!saveError) {
        interactions.hasSaved = !!saveData;
        console.log('🔵 getUserInteractions - Save check:', { hasSaved: interactions.hasSaved, userId });
      }
    }
  } catch (error) {
    console.error('❌ getUserInteractions error:', error);
  }

  return interactions;
}

/**
 * Like Story
 */
export async function likeStory(
  storyId: string,
  userId?: string,
  sessionId?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    console.log('🔵 likeStory:', { storyId, hasUserId: !!userId, hasSessionId: !!sessionId });

    // Insert like record - trigger will automatically increment count
    const { error: insertError } = await supabase
      .from('story_likes')
      .insert({
        story_id: storyId,
        user_id: userId || null,
        session_id: sessionId || null
      });

    if (insertError) {
      // Check if already liked
      if (insertError.code === '23505') { // Unique constraint violation
        console.log('🟡 Already liked');
        return { success: false, error: 'Already liked' };
      }
      console.error('🔴 Insert error:', insertError);
      throw insertError;
    }

    console.log('🟢 Story liked successfully (trigger will update count)');
    return { success: true };
  } catch (error: any) {
    console.error('🔴 Failed to like story:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Unlike Story
 */
export async function unlikeStory(
  storyId: string,
  userId?: string,
  sessionId?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    console.log('🔵 unlikeStory:', { storyId, hasUserId: !!userId, hasSessionId: !!sessionId });

    // Delete like record - trigger will automatically decrement count
    let deleteQuery = supabase
      .from('story_likes')
      .delete()
      .eq('story_id', storyId);

    if (userId) {
      deleteQuery = deleteQuery.eq('user_id', userId);
    } else if (sessionId) {
      deleteQuery = deleteQuery.eq('session_id', sessionId);
    } else {
      return { success: false, error: 'No user or session ID provided' };
    }

    const { error: deleteError } = await deleteQuery;

    if (deleteError) {
      console.error('🔴 Delete error:', deleteError);
      throw deleteError;
    }

    console.log('🟢 Story unliked successfully (trigger will update count)');
    return { success: true };
  } catch (error: any) {
    console.error('🔴 Failed to unlike story:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Save Story
 */
export async function saveStory(
  storyId: string,
  userId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    console.log('🔵 saveStory:', { storyId, userId });

    const { data, error } = await supabase
      .from('story_saves')
      .insert({
        story_id: storyId,
        user_id: userId
      })
      .select();

    if (error) {
      if (error.code === '23505') {
        console.log('🟡 Already saved');
        return { success: false, error: 'Already saved' };
      }
      console.error('🔴 Insert error:', error);
      throw error;
    }

    console.log('🟢 Story saved successfully:', data);
    return { success: true };
  } catch (error: any) {
    console.error('🔴 Failed to save story:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Unsave Story
 */
export async function unsaveStory(
  storyId: string,
  userId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    console.log('🔵 unsaveStory:', { storyId, userId });

    const { data, error } = await supabase
      .from('story_saves')
      .delete()
      .eq('story_id', storyId)
      .eq('user_id', userId)
      .select();

    if (error) {
      console.error('🔴 Delete error:', error);
      throw error;
    }

    console.log('🟢 Story unsaved successfully:', data);
    return { success: true };
  } catch (error: any) {
    console.error('🔴 Failed to unsave story:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Add Comment to Story
 */
export async function addComment(
  storyId: string,
  content: string,
  userId?: string,
  sessionId?: string,
  authorName?: string
): Promise<{ success: boolean; comment?: any; error?: string }> {
  try {
    console.log('🔵 addComment:', { storyId, contentLength: content.length, hasUserId: !!userId });

    const { data, error } = await supabase
      .from('story_comments')
      .insert({
        story_id: storyId,
        user_id: userId || null,
        session_id: sessionId || null,
        content,
        author_name: authorName || 'Anonymous'
      })
      .select()
      .single();

    if (error) throw error;

    // Increment comment count
    const { error: updateError } = await supabase.rpc(
      'increment_story_comment_count',
      { p_story_id: storyId }
    );

    if (updateError) {
      console.warn('Failed to increment comment count:', updateError);
    }

    console.log('🟢 Comment added successfully');
    return { success: true, comment: data };
  } catch (error: any) {
    console.error('🔴 Failed to add comment:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Get Comments for Story
 */
export async function getComments(
  storyId: string,
  limit: number = 50,
  offset: number = 0
): Promise<any[]> {
  try {
    const { data, error } = await supabase
      .from('story_comments')
      .select('*')
      .eq('story_id', storyId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.error('Failed to fetch comments:', error);
    return [];
  }
}

/**
 * Share Story
 */
export async function shareStory(
  storyId: string,
  platform: string,
  userId?: string,
  sessionId?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    console.log('🔵 shareStory:', { storyId, platform, hasUserId: !!userId });

    const { error } = await supabase
      .from('story_shares')
      .insert({
        story_id: storyId,
        user_id: userId || null,
        session_id: sessionId || null,
        platform
      });

    if (error) throw error;

    console.log('🟢 Story shared successfully');
    return { success: true };
  } catch (error: any) {
    console.error('🔴 Failed to share story:', error);
    return { success: false, error: error.message };
  }
}

