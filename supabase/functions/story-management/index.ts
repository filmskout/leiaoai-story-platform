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
    const requestData = await req.json();
    const { title, content, tags = [], category = 'ai_tools', mediaFiles = [], location } = requestData;

    if (!title || !content) {
      throw new Error('Title and content are required');
    }

    // Get Supabase configuration
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');

    if (!serviceRoleKey || !supabaseUrl) {
      throw new Error('Supabase configuration missing');
    }

    let userId = null;
    
    // Get user from auth header if provided
    const authHeader = req.headers.get('authorization');
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      
      try {
        const userResponse = await fetch(`${supabaseUrl}/auth/v1/user`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'apikey': serviceRoleKey
          }
        });

        if (userResponse.ok) {
          const userData = await userResponse.json();
          userId = userData.id;
        }
      } catch (error) {
        console.warn('Failed to get user from token:', error);
      }
    }

    // Get category ID from name
    let categoryId = null;
    if (category) {
      const categoryResponse = await fetch(`${supabaseUrl}/rest/v1/story_categories?name=eq.${category}`, {
        headers: {
          'Authorization': `Bearer ${serviceRoleKey}`,
          'apikey': serviceRoleKey
        }
      });
      
      if (categoryResponse.ok) {
        const categories = await categoryResponse.json();
        if (categories.length > 0) {
          categoryId = categories[0].id;
        }
      }
    }

    // Generate featured image URL based on category or use first media file
    let featuredImageUrl = null;
    if (mediaFiles && mediaFiles.length > 0) {
      const imageFile = mediaFiles.find(f => f.mediaType === 'image');
      if (imageFile) {
        featuredImageUrl = imageFile.publicUrl;
      }
    } else {
      // Use category-based default image
      const imageMap = {
        'ai_tools': '/story-images/coding-ai-1.png',
        'startup_interview': '/story-images/startup-ai-1.png',
        'investment_outlook': '/story-images/finance-ai-1.png',
        'finance_ai': '/story-images/finance-ai-2.png',
        'video_generation': '/story-images/content-ai-1.png',
        'domestic_ai': '/story-images/chinese-ai-1.png',
        'overseas_ai': '/story-images/creative-ai-1.png'
      };
      featuredImageUrl = imageMap[category] || `/story-images/story-${Math.floor(Math.random() * 8) + 1}.jpg`;
    }

    // Prepare story data using correct column names
    const storyData = {
      title: title.trim(),
      content: content.trim(),
      author_id: userId || '00000000-0000-0000-0000-000000000000', // Default UUID for anonymous
      category: category,
      category_id: categoryId,
      status: 'published',
      excerpt: content.substring(0, 200).trim() + (content.length > 200 ? '...' : ''),
      read_time_minutes: Math.ceil(content.split(' ').length / 200), // Average reading speed
      published_at: new Date().toISOString(),
      featured_image_url: featuredImageUrl,
      publisher: 'LeiaoAI Agent',
      is_public: true,
      location: location || null,
      view_count: 0,
      like_count: 0,
      comment_count: 0,
      saves_count: 0
    };

    // Insert story
    const storyResponse = await fetch(`${supabaseUrl}/rest/v1/stories`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${serviceRoleKey}`,
        'apikey': serviceRoleKey,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(storyData)
    });

    if (!storyResponse.ok) {
      const errorText = await storyResponse.text();
      throw new Error(`Failed to create story: ${errorText}`);
    }

    const storyResult = await storyResponse.json();
    const story = storyResult[0];

    if (!story) {
      throw new Error('Story creation failed - no data returned');
    }

    // Handle tag assignments
    if (tags && tags.length > 0) {
      const tagAssignments = tags.map(tagId => ({
        story_id: story.id,
        tag_id: tagId
      }));

      const tagResponse = await fetch(`${supabaseUrl}/rest/v1/story_tag_assignments`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${serviceRoleKey}`,
          'apikey': serviceRoleKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(tagAssignments)
      });

      if (!tagResponse.ok) {
        console.warn('Failed to assign tags:', await tagResponse.text());
      } else {
        // Update tag usage counts
        for (const tagId of tags) {
          try {
            // Get current usage count
            const currentTagResponse = await fetch(`${supabaseUrl}/rest/v1/story_tags?id=eq.${tagId}`, {
              headers: {
                'Authorization': `Bearer ${serviceRoleKey}`,
                'apikey': serviceRoleKey
              }
            });
            
            if (currentTagResponse.ok) {
              const tagData = await currentTagResponse.json();
              if (tagData.length > 0) {
                const currentCount = tagData[0].usage_count || 0;
                await fetch(`${supabaseUrl}/rest/v1/story_tags?id=eq.${tagId}`, {
                  method: 'PATCH',
                  headers: {
                    'Authorization': `Bearer ${serviceRoleKey}`,
                    'apikey': serviceRoleKey,
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({
                    usage_count: currentCount + 1
                  })
                });
              }
            }
          } catch (error) {
            console.warn(`Failed to update usage count for tag ${tagId}:`, error);
          }
        }
      }
    }

    // Handle media file associations
    if (mediaFiles && mediaFiles.length > 0) {
      const mediaAssociations = mediaFiles.map((media, index) => ({
        story_id: story.id,
        media_url: media.publicUrl,
        media_type: media.mediaType,
        file_name: media.fileName,
        file_size: media.fileSize,
        mime_type: media.mimeType,
        display_order: index
      }));

      const mediaResponse = await fetch(`${supabaseUrl}/rest/v1/story_media`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${serviceRoleKey}`,
          'apikey': serviceRoleKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(mediaAssociations)
      });

      if (!mediaResponse.ok) {
        console.warn('Failed to associate media files:', await mediaResponse.text());
      }
    }

    // Track user activity if user is logged in
    if (userId) {
      try {
        await fetch(`${supabaseUrl}/rest/v1/user_activities`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${serviceRoleKey}`,
            'apikey': serviceRoleKey,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            user_id: userId,
            activity_type: 'story_published',
            activity_description: `Published story: ${title}`,
            metadata: {
              story_id: story.id,
              category,
              tags: tags.length
            }
          })
        });
      } catch (error) {
        console.warn('Failed to track user activity:', error);
      }
    }

    return new Response(JSON.stringify({ 
      data: {
        story,
        message: 'Story published successfully'
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Story management error:', error);
    
    const errorResponse = {
      error: {
        code: 'STORY_MANAGEMENT_ERROR',
        message: error.message
      }
    };

    return new Response(JSON.stringify(errorResponse), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});