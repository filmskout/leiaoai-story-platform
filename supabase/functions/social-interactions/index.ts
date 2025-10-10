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
        const { action, storyId, userId, sessionId, content, platform } = await req.json();
        
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
                result = await handleLike(supabaseUrl, serviceRoleKey, userId, sessionId, storyId);
                break;
            case 'unlike':
                result = await handleUnlike(supabaseUrl, serviceRoleKey, userId, sessionId, storyId);
                break;
            case 'save':
                result = await handleSave(supabaseUrl, serviceRoleKey, userId, sessionId, storyId);
                break;
            case 'unsave':
                result = await handleUnsave(supabaseUrl, serviceRoleKey, userId, sessionId, storyId);
                break;
            case 'comment':
                if (!content) throw new Error('Content is required for comments');
                result = await handleComment(supabaseUrl, serviceRoleKey, userId, sessionId, storyId, content);
                break;
            case 'share':
                result = await handleShare(supabaseUrl, serviceRoleKey, userId, sessionId, storyId, platform);
                break;
            case 'get_interactions':
                result = await getInteractions(supabaseUrl, serviceRoleKey, userId, sessionId, storyId);
                break;
            default:
                throw new Error(`Unknown action: ${action}`);
        }

        return new Response(JSON.stringify({ data: result }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Social interaction error:', error);

        const errorResponse = {
            error: {
                code: 'SOCIAL_INTERACTION_FAILED',
                message: error.message
            }
        };

        return new Response(JSON.stringify(errorResponse), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
});

async function handleLike(supabaseUrl: string, serviceRoleKey: string, userId: string | null, sessionId: string | null, storyId: string) {
    // Check if already liked
    let checkQuery;
    if (userId) {
        checkQuery = `user_id=eq.${userId}&story_id=eq.${storyId}`;
    } else if (sessionId) {
        checkQuery = `session_id=eq.${sessionId}&story_id=eq.${storyId}`;
    } else {
        throw new Error('Either userId or sessionId is required');
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
    const likeData: any = { story_id: storyId };
    if (userId) {
        likeData.user_id = userId;
    }
    if (sessionId) {
        likeData.session_id = sessionId;
    }

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
        const errorText = await likeResponse.text();
        throw new Error(`Failed to add like: ${errorText}`);
    }

    return { success: true, action: 'liked' };
}

async function handleUnlike(supabaseUrl: string, serviceRoleKey: string, userId: string | null, sessionId: string | null, storyId: string) {
    let deleteQuery;
    if (userId) {
        deleteQuery = `user_id=eq.${userId}&story_id=eq.${storyId}`;
    } else if (sessionId) {
        deleteQuery = `session_id=eq.${sessionId}&story_id=eq.${storyId}`;
    } else {
        throw new Error('Either userId or sessionId is required');
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

    return { success: true, action: 'unliked' };
}

async function handleSave(supabaseUrl: string, serviceRoleKey: string, userId: string | null, sessionId: string | null, storyId: string) {
    // Check if already saved
    let checkQuery;
    if (userId) {
        checkQuery = `user_id=eq.${userId}&story_id=eq.${storyId}`;
    } else if (sessionId) {
        checkQuery = `session_id=eq.${sessionId}&story_id=eq.${storyId}`;
    } else {
        throw new Error('Either userId or sessionId is required');
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

    // Add save
    const saveData: any = { story_id: storyId };
    if (userId) {
        saveData.user_id = userId;
    }
    if (sessionId) {
        saveData.session_id = sessionId;
    }

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

async function handleUnsave(supabaseUrl: string, serviceRoleKey: string, userId: string | null, sessionId: string | null, storyId: string) {
    let deleteQuery;
    if (userId) {
        deleteQuery = `user_id=eq.${userId}&story_id=eq.${storyId}`;
    } else if (sessionId) {
        deleteQuery = `session_id=eq.${sessionId}&story_id=eq.${storyId}`;
    } else {
        throw new Error('Either userId or sessionId is required');
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

async function handleComment(supabaseUrl: string, serviceRoleKey: string, userId: string | null, sessionId: string | null, storyId: string, content: string) {
    const commentData: any = { 
        story_id: storyId, 
        content,
        author_name: userId ? 'User' : 'Anonymous'
    };
    if (userId) {
        commentData.user_id = userId;
    }
    if (sessionId) {
        commentData.session_id = sessionId;
    }

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

    return { success: true, action: 'commented', comment: comment[0] };
}

async function handleShare(supabaseUrl: string, serviceRoleKey: string, userId: string | null, sessionId: string | null, storyId: string, platform: string = 'link') {
    const shareData: any = { 
        story_id: storyId,
        platform: platform
    };
    if (userId) {
        shareData.user_id = userId;
    }
    if (sessionId) {
        shareData.session_id = sessionId;
    }

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

async function getInteractions(supabaseUrl: string, serviceRoleKey: string, userId: string | null, sessionId: string | null, storyId: string) {
    const interactions = {
        likes: 0,
        saves: 0,
        comments: [],
        shares: 0,
        userInteractions: {
            hasLiked: false,
            hasSaved: false
        }
    };

    // Get total likes
    const likesResponse = await fetch(`${supabaseUrl}/rest/v1/story_likes?story_id=eq.${storyId}&select=count`, {
        headers: {
            'Authorization': `Bearer ${serviceRoleKey}`,
            'apikey': serviceRoleKey,
        }
    });
    if (likesResponse.ok) {
        const likesData = await likesResponse.json();
        interactions.likes = likesData.length;
    }

    // Get total saves
    const savesResponse = await fetch(`${supabaseUrl}/rest/v1/story_saves?story_id=eq.${storyId}&select=count`, {
        headers: {
            'Authorization': `Bearer ${serviceRoleKey}`,
            'apikey': serviceRoleKey,
        }
    });
    if (savesResponse.ok) {
        const savesData = await savesResponse.json();
        interactions.saves = savesData.length;
    }

    // Get comments
    const commentsResponse = await fetch(`${supabaseUrl}/rest/v1/story_comments?story_id=eq.${storyId}&order=created_at.desc`, {
        headers: {
            'Authorization': `Bearer ${serviceRoleKey}`,
            'apikey': serviceRoleKey,
        }
    });
    if (commentsResponse.ok) {
        interactions.comments = await commentsResponse.json();
    }

    // Get total shares
    const sharesResponse = await fetch(`${supabaseUrl}/rest/v1/story_shares?story_id=eq.${storyId}&select=count`, {
        headers: {
            'Authorization': `Bearer ${serviceRoleKey}`,
            'apikey': serviceRoleKey,
        }
    });
    if (sharesResponse.ok) {
        const sharesData = await sharesResponse.json();
        interactions.shares = sharesData.length;
    }

    // Check user's interactions
    if (userId || sessionId) {
        let query;
        if (userId) {
            query = `user_id=eq.${userId}&story_id=eq.${storyId}`;
        } else {
            query = `session_id=eq.${sessionId}&story_id=eq.${storyId}`;
        }

        // Check if user has liked
        const userLikesResponse = await fetch(`${supabaseUrl}/rest/v1/story_likes?${query}`, {
            headers: {
                'Authorization': `Bearer ${serviceRoleKey}`,
                'apikey': serviceRoleKey,
            }
        });
        if (userLikesResponse.ok) {
            const userLikes = await userLikesResponse.json();
            interactions.userInteractions.hasLiked = userLikes.length > 0;
        }

        // Check if user has saved
        const userSavesResponse = await fetch(`${supabaseUrl}/rest/v1/story_saves?${query}`, {
            headers: {
                'Authorization': `Bearer ${serviceRoleKey}`,
                'apikey': serviceRoleKey,
            }
        });
        if (userSavesResponse.ok) {
            const userSaves = await userSavesResponse.json();
            interactions.userInteractions.hasSaved = userSaves.length > 0;
        }
    }

    return interactions;
}