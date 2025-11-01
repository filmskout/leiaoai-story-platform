import { supabase } from '@/lib/supabase';

export interface StoryInteraction {
  storyId: string;
  userId?: string;
  sessionId?: string;
}

export async function toggleLike(storyId: string, userId?: string, sessionId?: string): Promise<boolean> {
  try {
    // Check if already liked
    const query = supabase
      .from('story_likes')
      .select('id')
      .eq('story_id', storyId);
    
    if (userId) {
      query.eq('user_id', userId);
    } else if (sessionId) {
      query.eq('session_id', sessionId);
    }

    const { data: existing } = await query.single();

    if (existing) {
      // Unlike
      await supabase
        .from('story_likes')
        .delete()
        .eq('story_id', storyId)
        .eq(userId ? 'user_id' : 'session_id', userId || sessionId);

      // Decrement count
      await supabase.rpc('decrement_story_count', {
        story_id: storyId,
        column_name: 'likes_count'
      });

      return false;
    } else {
      // Like
      await supabase
        .from('story_likes')
        .insert({
          story_id: storyId,
          user_id: userId || null,
          session_id: sessionId || null
        });

      // Increment count
      await supabase.rpc('increment_story_count', {
        story_id: storyId,
        column_name: 'likes_count'
      });

      return true;
    }
  } catch (error) {
    console.error('Error toggling like:', error);
    throw error;
  }
}

export async function toggleSave(storyId: string, userId?: string, sessionId?: string): Promise<boolean> {
  try {
    const query = supabase
      .from('story_saves')
      .select('id')
      .eq('story_id', storyId);
    
    if (userId) {
      query.eq('user_id', userId);
    } else if (sessionId) {
      query.eq('session_id', sessionId);
    }

    const { data: existing } = await query.single();

    if (existing) {
      await supabase
        .from('story_saves')
        .delete()
        .eq('story_id', storyId)
        .eq(userId ? 'user_id' : 'session_id', userId || sessionId);

      await supabase.rpc('decrement_story_count', {
        story_id: storyId,
        column_name: 'saves_count'
      });

      return false;
    } else {
      await supabase
        .from('story_saves')
        .insert({
          story_id: storyId,
          user_id: userId || null,
          session_id: sessionId || null
        });

      await supabase.rpc('increment_story_count', {
        story_id: storyId,
        column_name: 'saves_count'
      });

      return true;
    }
  } catch (error) {
    console.error('Error toggling save:', error);
    throw error;
  }
}

export async function shareStory(storyId: string, storyTitle: string, storyUrl: string): Promise<void> {
  try {
    if (navigator.share) {
      await navigator.share({
        title: storyTitle,
        text: '',
        url: storyUrl
      });
    } else {
      await navigator.clipboard.writeText(storyUrl);
    }

    // Increment share count
    await supabase.rpc('increment_story_count', {
      story_id: storyId,
      column_name: 'share_count'
    });
  } catch (error) {
    // User cancelled or error - silently handle
    console.log('Share cancelled or failed');
  }
}

export async function addComment(storyId: string, content: string, userId?: string, authorName?: string, sessionId?: string): Promise<any> {
  try {
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
    await supabase.rpc('increment_story_count', {
      story_id: storyId,
      column_name: 'comments_count'
    });

    return data;
  } catch (error) {
    console.error('Error adding comment:', error);
    throw error;
  }
}

export async function getStoryComments(storyId: string): Promise<any[]> {
  try {
    const { data, error } = await supabase
      .from('story_comments')
      .select('*')
      .eq('story_id', storyId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching comments:', error);
    return [];
  }
}

export async function checkUserInteractions(storyIds: string[], userId?: string, sessionId?: string): Promise<{
  likes: Set<string>;
  saves: Set<string>;
}> {
  const likes = new Set<string>();
  const saves = new Set<string>();

  if (storyIds.length === 0) return { likes, saves };

  try {
    if (userId) {
      const { data: userLikes } = await supabase
        .from('story_likes')
        .select('story_id')
        .in('story_id', storyIds)
        .eq('user_id', userId);

      const { data: userSaves } = await supabase
        .from('story_saves')
        .select('story_id')
        .in('story_id', storyIds)
        .eq('user_id', userId);

      userLikes?.forEach(l => likes.add(l.story_id));
      userSaves?.forEach(s => saves.add(s.story_id));
    } else if (sessionId) {
      const { data: sessionLikes } = await supabase
        .from('story_likes')
        .select('story_id')
        .in('story_id', storyIds)
        .eq('session_id', sessionId);

      const { data: sessionSaves } = await supabase
        .from('story_saves')
        .select('story_id')
        .in('story_id', storyIds)
        .eq('session_id', sessionId);

      sessionLikes?.forEach(l => likes.add(l.story_id));
      sessionSaves?.forEach(s => saves.add(s.story_id));
    }
  } catch (error) {
    console.error('Error checking interactions:', error);
  }

  return { likes, saves };
}

