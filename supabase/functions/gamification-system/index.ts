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
        const { action, userId, eventType, eventData } = await req.json();

        if (!action || !userId) {
            throw new Error('Action and userId are required');
        }

        const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
        const supabaseUrl = Deno.env.get('SUPABASE_URL');

        if (!serviceRoleKey || !supabaseUrl) {
            throw new Error('Supabase configuration missing');
        }

        let result;

        switch (action) {
            case 'check_achievements':
                result = await checkAndAwardAchievements(supabaseUrl, serviceRoleKey, userId, eventType, eventData);
                break;
            case 'get_user_badges':
                result = await getUserBadges(supabaseUrl, serviceRoleKey, userId);
                break;
            case 'get_user_achievements':
                result = await getUserAchievements(supabaseUrl, serviceRoleKey, userId);
                break;
            case 'get_leaderboard':
                result = await getLeaderboard(supabaseUrl, serviceRoleKey);
                break;
            default:
                throw new Error(`Unknown action: ${action}`);
        }

        return new Response(JSON.stringify({ data: result }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Gamification system error:', error);

        const errorResponse = {
            error: {
                code: 'GAMIFICATION_FAILED',
                message: error.message
            }
        };

        return new Response(JSON.stringify(errorResponse), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
});

async function checkAndAwardAchievements(supabaseUrl: string, serviceRoleKey: string, userId: string, eventType: string, eventData: any) {
    const newBadges = [];
    const updatedAchievements = [];

    // Get user's current stats
    const statsResponse = await fetch(`${supabaseUrl}/rest/v1/social_stats?user_id=eq.${userId}`, {
        headers: {
            'Authorization': `Bearer ${serviceRoleKey}`,
            'apikey': serviceRoleKey,
        }
    });
    
    const stats = await statsResponse.json();
    const userStats = stats[0] || {};

    // Get user's stories count
    const storiesResponse = await fetch(`${supabaseUrl}/rest/v1/stories?user_id=eq.${userId}&select=count`, {
        headers: {
            'Authorization': `Bearer ${serviceRoleKey}`,
            'apikey': serviceRoleKey,
            'Prefer': 'count=exact'
        }
    });
    
    const storiesCount = parseInt(storiesResponse.headers.get('Content-Range')?.split('/')[1] || '0');

    // Define achievement rules
    const achievements = [
        // Story publishing milestones
        { type: 'first_story', name: 'First Storyteller', description: 'Published your first story', condition: () => storiesCount >= 1, badge: 'storyteller_novice' },
        { type: 'story_milestone_5', name: 'Prolific Writer', description: 'Published 5 stories', condition: () => storiesCount >= 5, badge: 'storyteller_active' },
        { type: 'story_milestone_10', name: 'Story Master', description: 'Published 10 stories', condition: () => storiesCount >= 10, badge: 'storyteller_master' },
        { type: 'story_milestone_25', name: 'Story Legend', description: 'Published 25 stories', condition: () => storiesCount >= 25, badge: 'storyteller_legend' },
        
        // Social engagement
        { type: 'social_butterfly', name: 'Social Butterfly', description: 'Made 50 comments', condition: () => (userStats.total_comments_made || 0) >= 50, badge: 'social_active' },
        { type: 'like_giver', name: 'Appreciator', description: 'Gave 100 likes', condition: () => (userStats.total_likes_given || 0) >= 100, badge: 'like_master' },
        { type: 'popular_creator', name: 'Popular Creator', description: 'Received 100 likes', condition: () => (userStats.total_likes_received || 0) >= 100, badge: 'popular_creator' },
        
        // Platform usage
        { type: 'active_user', name: 'Active User', description: 'Active for 30 days', condition: () => (userStats.days_active || 0) >= 30, badge: 'platform_veteran' },
        { type: 'power_user', name: 'Power User', description: 'Active for 100 days', condition: () => (userStats.days_active || 0) >= 100, badge: 'power_user' }
    ];

    // Check each achievement
    for (const achievement of achievements) {
        if (achievement.condition()) {
            // Check if user already has this badge
            const existingBadgeResponse = await fetch(`${supabaseUrl}/rest/v1/user_badges?user_id=eq.${userId}&badge_type=eq.${achievement.badge}`, {
                headers: {
                    'Authorization': `Bearer ${serviceRoleKey}`,
                    'apikey': serviceRoleKey,
                }
            });
            
            const existingBadges = await existingBadgeResponse.json();
            
            if (existingBadges.length === 0) {
                // Award new badge
                const badgeResponse = await fetch(`${supabaseUrl}/rest/v1/user_badges`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${serviceRoleKey}`,
                        'apikey': serviceRoleKey,
                        'Content-Type': 'application/json',
                        'Prefer': 'return=representation'
                    },
                    body: JSON.stringify({
                        user_id: userId,
                        badge_type: achievement.badge,
                        badge_name: achievement.name,
                        badge_description: achievement.description
                    })
                });
                
                if (badgeResponse.ok) {
                    const badge = await badgeResponse.json();
                    newBadges.push(badge[0]);
                    
                    // Log activity
                    await logUserActivity(supabaseUrl, serviceRoleKey, userId, 'earned_badge', `Earned badge: ${achievement.name}`, { badge_type: achievement.badge });
                }
            }
            
            // Update achievement progress
            await upsertAchievement(supabaseUrl, serviceRoleKey, userId, achievement.type, achievement.name, 1, 1);
        }
    }

    return {
        newBadges,
        updatedAchievements,
        summary: {
            newBadgesCount: newBadges.length,
            userStats: {
                storiesCount,
                likesGiven: userStats.total_likes_given || 0,
                likesReceived: userStats.total_likes_received || 0,
                commentsCount: userStats.total_comments_made || 0,
                sharesCount: userStats.total_shares_made || 0,
                daysActive: userStats.days_active || 0
            }
        }
    };
}

async function getUserBadges(supabaseUrl: string, serviceRoleKey: string, userId: string) {
    const badgesResponse = await fetch(`${supabaseUrl}/rest/v1/user_badges?user_id=eq.${userId}&order=earned_at.desc`, {
        headers: {
            'Authorization': `Bearer ${serviceRoleKey}`,
            'apikey': serviceRoleKey,
        }
    });
    
    return await badgesResponse.json();
}

async function getUserAchievements(supabaseUrl: string, serviceRoleKey: string, userId: string) {
    const achievementsResponse = await fetch(`${supabaseUrl}/rest/v1/user_achievements?user_id=eq.${userId}&order=updated_at.desc`, {
        headers: {
            'Authorization': `Bearer ${serviceRoleKey}`,
            'apikey': serviceRoleKey,
        }
    });
    
    return await achievementsResponse.json();
}

async function getLeaderboard(supabaseUrl: string, serviceRoleKey: string) {
    // Get top users by various metrics
    const likesLeaderResponse = await fetch(`${supabaseUrl}/rest/v1/social_stats?select=user_id,total_likes_received&order=total_likes_received.desc&limit=10`, {
        headers: {
            'Authorization': `Bearer ${serviceRoleKey}`,
            'apikey': serviceRoleKey,
        }
    });
    
    const storiesLeaderResponse = await fetch(`${supabaseUrl}/rest/v1/social_stats?select=user_id,total_stories_published&order=total_stories_published.desc&limit=10`, {
        headers: {
            'Authorization': `Bearer ${serviceRoleKey}`,
            'apikey': serviceRoleKey,
        }
    });
    
    const commentsLeaderResponse = await fetch(`${supabaseUrl}/rest/v1/social_stats?select=user_id,total_comments_made&order=total_comments_made.desc&limit=10`, {
        headers: {
            'Authorization': `Bearer ${serviceRoleKey}`,
            'apikey': serviceRoleKey,
        }
    });
    
    const likesLeader = await likesLeaderResponse.json();
    const storiesLeader = await storiesLeaderResponse.json();
    const commentsLeader = await commentsLeaderResponse.json();
    
    return {
        mostLiked: likesLeader,
        mostStories: storiesLeader,
        mostComments: commentsLeader
    };
}

async function upsertAchievement(supabaseUrl: string, serviceRoleKey: string, userId: string, achievementType: string, achievementName: string, progress: number, targetValue: number) {
    // Check if achievement exists
    const existingResponse = await fetch(`${supabaseUrl}/rest/v1/user_achievements?user_id=eq.${userId}&achievement_type=eq.${achievementType}`, {
        headers: {
            'Authorization': `Bearer ${serviceRoleKey}`,
            'apikey': serviceRoleKey,
        }
    });
    
    const existing = await existingResponse.json();
    
    if (existing.length === 0) {
        // Create new achievement
        await fetch(`${supabaseUrl}/rest/v1/user_achievements`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${serviceRoleKey}`,
                'apikey': serviceRoleKey,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user_id: userId,
                achievement_type: achievementType,
                achievement_name: achievementName,
                progress,
                target_value: targetValue,
                completed_at: progress >= targetValue ? new Date().toISOString() : null
            })
        });
    } else {
        // Update existing achievement
        await fetch(`${supabaseUrl}/rest/v1/user_achievements?user_id=eq.${userId}&achievement_type=eq.${achievementType}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${serviceRoleKey}`,
                'apikey': serviceRoleKey,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                progress,
                completed_at: progress >= targetValue && !existing[0].completed_at ? new Date().toISOString() : existing[0].completed_at,
                updated_at: new Date().toISOString()
            })
        });
    }
}

async function logUserActivity(supabaseUrl: string, serviceRoleKey: string, userId: string, activityType: string, description: string, metadata: any) {
    await fetch(`${supabaseUrl}/rest/v1/user_activities`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${serviceRoleKey}`,
            'apikey': serviceRoleKey,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
            user_id: userId,
            activity_type: activityType,
            activity_description: description,
            metadata
        })
    });
}