Deno.serve(async (req) => {
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE, PATCH',
        'Access-Control-Max-Age': '86400',
        'Access-Control-Allow-Credentials': 'false'
    };

    if (req.method === 'OPTIONS') {
        return new Response(null, { status: 200, headers: corsHeaders });
    }

    try {
        const { action, storyId, userId, sessionId, content, authorName, platform } = await req.json();
        
        if (!action || !storyId) {
            throw new Error('Action and storyId are required');
        }

        const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
        const supabaseUrl = Deno.env.get('SUPABASE_URL');

        if (!serviceRoleKey || !supabaseUrl) {
            throw new Error('Supabase configuration missing');
        }

        let result;

        switch (action) {
            case 'like':
                result = await handleLike(supabaseUrl, serviceRoleKey, storyId, userId, sessionId);
                break;
            case 'unlike':
                result = await handleUnlike(supabaseUrl, serviceRoleKey, storyId, userId, sessionId);
                break;
            case 'save':
                result = await handleSave(supabaseUrl, serviceRoleKey, storyId, userId, sessionId);
                break;
            case 'unsave':
                result = await handleUnsave(supabaseUrl, serviceRoleKey, storyId, userId, sessionId);
                break;
            case 'comment':
                if (!content) throw new Error('Content is required for comments');
                result = await handleComment(supabaseUrl, serviceRoleKey, storyId, userId, sessionId, content, authorName);
                break;
            case 'share':
                result = await handleShare(supabaseUrl, serviceRoleKey, storyId, userId, sessionId, platform);
                break;
            case 'get_user_interactions':
                result = await getUserInteractions(supabaseUrl, serviceRoleKey, storyId, userId, sessionId);
                break;
            case 'get_story_stats':
                result = await getStoryStats(supabaseUrl, serviceRoleKey, storyId);
                break;
            default:
                throw new Error(`Unknown action: ${action}`);
        }

        return new Response(JSON.stringify({ data: result }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Story interaction error:', error);

        const errorResponse = {
            error: {
                code: 'STORY_INTERACTION_FAILED',
                message: error.message
            }
        };

        return new Response(JSON.stringify(errorResponse), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
});

async function handleLike(supabaseUrl: string, serviceRoleKey: string, storyId: string, userId?: string, sessionId?: string) {
    if (!userId && !sessionId) {
        throw new Error('Either userId or sessionId is required');
    }

    // Check if already liked
    let checkQuery = `story_id=eq.${storyId}`;
    if (userId) {
        checkQuery += `&user_id=eq.${userId}`;
    } else {
        checkQuery += `&session_id=eq.${sessionId}&user_id=is.null`;
    }

    const checkResponse = await fetch(`${supabaseUrl}/rest/v1/story_likes?${checkQuery}`, {
        headers: {
            'Authorization': `Bearer ${serviceRoleKey}`,
            'apikey': serviceRoleKey,
        }
    });
    
    const existingLikes = await checkResponse.json();
    if (existingLikes.length > 0) {
        return { success: false, message: 'Already liked' };
    }

    // Add like
    const likeData = {
        story_id: storyId,
        user_id: userId || null,
        session_id: sessionId || null
    };

    const likeResponse = await fetch(`${supabaseUrl}/rest/v1/story_likes`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${serviceRoleKey}`,
            'apikey': serviceRoleKey,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(likeData)
    });

    if (!likeResponse.ok) {
        throw new Error('Failed to add like');
    }

    // Update story like count
    await updateStoryLikeCount(supabaseUrl, serviceRoleKey, storyId);

    return { success: true, action: 'liked' };
}

async function handleUnlike(supabaseUrl: string, serviceRoleKey: string, storyId: string, userId?: string, sessionId?: string) {
    if (!userId && !sessionId) {
        throw new Error('Either userId or sessionId is required');
    }

    let deleteQuery = `story_id=eq.${storyId}`;
    if (userId) {
        deleteQuery += `&user_id=eq.${userId}`;
    } else {
        deleteQuery += `&session_id=eq.${sessionId}&user_id=is.null`;
    }

    const deleteResponse = await fetch(`${supabaseUrl}/rest/v1/story_likes?${deleteQuery}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${serviceRoleKey}`,
            'apikey': serviceRoleKey,
        }
    });

    if (!deleteResponse.ok) {
        throw new Error('Failed to remove like');
    }

    // Update story like count
    await updateStoryLikeCount(supabaseUrl, serviceRoleKey, storyId);

    return { success: true, action: 'unliked' };
}

async function handleSave(supabaseUrl: string, serviceRoleKey: string, storyId: string, userId?: string, sessionId?: string) {
    if (!userId && !sessionId) {
        throw new Error('Either userId or sessionId is required');
    }

    // Check if already saved
    let checkQuery = `story_id=eq.${storyId}`;
    if (userId) {
        checkQuery += `&user_id=eq.${userId}`;
    } else {
        checkQuery += `&session_id=eq.${sessionId}&user_id=is.null`;
    }

    const checkResponse = await fetch(`${supabaseUrl}/rest/v1/story_saves?${checkQuery}`, {
        headers: {
            'Authorization': `Bearer ${serviceRoleKey}`,
            'apikey': serviceRoleKey,
        }
    });
    
    const existingSaves = await checkResponse.json();
    if (existingSaves.length > 0) {
        return { success: false, message: 'Already saved' };
    }

    const saveData = {
        story_id: storyId,
        user_id: userId || null,
        session_id: sessionId || null
    };

    const saveResponse = await fetch(`${supabaseUrl}/rest/v1/story_saves`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${serviceRoleKey}`,
            'apikey': serviceRoleKey,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(saveData)
    });

    if (!saveResponse.ok) {
        throw new Error('Failed to save story');
    }

    return { success: true, action: 'saved' };
}

async function handleUnsave(supabaseUrl: string, serviceRoleKey: string, storyId: string, userId?: string, sessionId?: string) {
    if (!userId && !sessionId) {
        throw new Error('Either userId or sessionId is required');
    }

    let deleteQuery = `story_id=eq.${storyId}`;
    if (userId) {
        deleteQuery += `&user_id=eq.${userId}`;
    } else {
        deleteQuery += `&session_id=eq.${sessionId}&user_id=is.null`;
    }

    const deleteResponse = await fetch(`${supabaseUrl}/rest/v1/story_saves?${deleteQuery}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${serviceRoleKey}`,
            'apikey': serviceRoleKey,
        }
    });

    if (!deleteResponse.ok) {
        throw new Error('Failed to unsave story');
    }

    return { success: true, action: 'unsaved' };
}

async function handleComment(supabaseUrl: string, serviceRoleKey: string, storyId: string, userId?: string, sessionId?: string, content?: string, authorName?: string) {
    if (!content) {
        throw new Error('Content is required for comments');
    }

    const commentData = {
        story_id: storyId,
        user_id: userId || null,
        session_id: sessionId || null,
        content: content.trim(),
        author_name: authorName || 'Anonymous'
    };

    const commentResponse = await fetch(`${supabaseUrl}/rest/v1/story_comments`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${serviceRoleKey}`,
            'apikey': serviceRoleKey,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
        },
        body: JSON.stringify(commentData)
    });

    if (!commentResponse.ok) {
        throw new Error('Failed to add comment');
    }

    const comment = await commentResponse.json();
    
    // Update story comment count
    await updateStoryCommentCount(supabaseUrl, serviceRoleKey, storyId);

    return { success: true, action: 'commented', comment: comment[0] };
}

async function handleShare(supabaseUrl: string, serviceRoleKey: string, storyId: string, userId?: string, sessionId?: string, platform?: string) {
    const shareData = {
        story_id: storyId,
        user_id: userId || null,
        session_id: sessionId || null,
        platform: platform || 'unknown'
    };

    const shareResponse = await fetch(`${supabaseUrl}/rest/v1/story_shares`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${serviceRoleKey}`,
            'apikey': serviceRoleKey,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(shareData)
    });

    if (!shareResponse.ok) {
        throw new Error('Failed to record share');
    }

    return { success: true, action: 'shared' };
}

async function getUserInteractions(supabaseUrl: string, serviceRoleKey: string, storyId: string, userId?: string, sessionId?: string) {
    if (!userId && !sessionId) {
        return { hasLiked: false, hasSaved: false };
    }

    let queryFilter = `story_id=eq.${storyId}`;
    if (userId) {
        queryFilter += `&user_id=eq.${userId}`;
    } else {
        queryFilter += `&session_id=eq.${sessionId}&user_id=is.null`;
    }

    // Check likes
    const likeResponse = await fetch(`${supabaseUrl}/rest/v1/story_likes?${queryFilter}`, {
        headers: {
            'Authorization': `Bearer ${serviceRoleKey}`,
            'apikey': serviceRoleKey,
        }
    });
    
    // Check saves
    const saveResponse = await fetch(`${supabaseUrl}/rest/v1/story_saves?${queryFilter}`, {
        headers: {
            'Authorization': `Bearer ${serviceRoleKey}`,
            'apikey': serviceRoleKey,
        }
    });

    const likes = await likeResponse.json();
    const saves = await saveResponse.json();

    return {
        hasLiked: likes.length > 0,
        hasSaved: saves.length > 0
    };
}

async function getStoryStats(supabaseUrl: string, serviceRoleKey: string, storyId: string) {
    // Get current story data
    const storyResponse = await fetch(`${supabaseUrl}/rest/v1/stories?id=eq.${storyId}`, {
        headers: {
            'Authorization': `Bearer ${serviceRoleKey}`,
            'apikey': serviceRoleKey,
        }
    });

    if (!storyResponse.ok) {
        throw new Error('Failed to fetch story');
    }

    const stories = await storyResponse.json();
    if (stories.length === 0) {
        throw new Error('Story not found');
    }

    const story = stories[0];
    
    return {
        view_count: story.view_count || 0,
        like_count: story.like_count || 0,
        comment_count: story.comment_count || 0,
        saves_count: story.saves_count || 0
    };
}

async function updateStoryLikeCount(supabaseUrl: string, serviceRoleKey: string, storyId: string) {
    // Get total likes count
    const likesResponse = await fetch(`${supabaseUrl}/rest/v1/story_likes?story_id=eq.${storyId}&select=count`, {
        headers: {
            'Authorization': `Bearer ${serviceRoleKey}`,
            'apikey': serviceRoleKey,
            'Prefer': 'count=exact'
        }
    });
    
    const likesCount = parseInt(likesResponse.headers.get('Content-Range')?.split('/')[1] || '0');
    
    // Update story
    await fetch(`${supabaseUrl}/rest/v1/stories?id=eq.${storyId}`, {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${serviceRoleKey}`,
            'apikey': serviceRoleKey,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ like_count: likesCount })
    });
}

async function updateStoryCommentCount(supabaseUrl: string, serviceRoleKey: string, storyId: string) {
    // Get total comments count
    const commentsResponse = await fetch(`${supabaseUrl}/rest/v1/story_comments?story_id=eq.${storyId}&select=count`, {
        headers: {
            'Authorization': `Bearer ${serviceRoleKey}`,
            'apikey': serviceRoleKey,
            'Prefer': 'count=exact'
        }
    });
    
    const commentsCount = parseInt(commentsResponse.headers.get('Content-Range')?.split('/')[1] || '0');
    
    // Update story
    await fetch(`${supabaseUrl}/rest/v1/stories?id=eq.${storyId}`, {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${serviceRoleKey}`,
            'apikey': serviceRoleKey,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ comment_count: commentsCount })
    });
}