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
        const { imageData, fileName, bucket = 'story-images', isAvatar = false } = await req.json();

        if (!imageData || !fileName) {
            throw new Error('Image data and filename are required');
        }

        console.log('Image Upload Request:', { fileName, bucket, isAvatar });

        // Get environment variables
        const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
        const supabaseUrl = Deno.env.get('SUPABASE_URL');

        if (!serviceRoleKey || !supabaseUrl) {
            throw new Error('Supabase configuration missing');
        }

        // Get user from auth header
        let userId = null;
        const authHeader = req.headers.get('authorization');
        if (authHeader) {
            try {
                const token = authHeader.replace('Bearer ', '');
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
                console.log('Could not get user from token:', error.message);
            }
        }

        // Extract base64 data from data URL
        const base64Data = imageData.split(',')[1];
        const mimeType = imageData.split(';')[0].split(':')[1];

        // Convert base64 to binary
        const binaryData = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));

        // Determine target bucket
        const targetBucket = isAvatar ? 'avatars' : bucket;
        const filePath = userId ? `${userId}/${fileName}` : `public/${fileName}`;

        // Upload to Supabase Storage
        const uploadResponse = await fetch(`${supabaseUrl}/storage/v1/object/${targetBucket}/${filePath}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${serviceRoleKey}`,
                'Content-Type': mimeType,
                'x-upsert': 'true'
            },
            body: binaryData
        });

        if (!uploadResponse.ok) {
            const errorText = await uploadResponse.text();
            console.error('Upload failed:', errorText);
            throw new Error(`Upload failed: ${errorText}`);
        }

        // Get public URL
        const publicUrl = `${supabaseUrl}/storage/v1/object/public/${targetBucket}/${filePath}`;

        // If it's an avatar upload, update the user's profile
        if (isAvatar && userId) {
            try {
                await fetch(`${supabaseUrl}/rest/v1/profiles`, {
                    method: 'PATCH',
                    headers: {
                        'Authorization': `Bearer ${serviceRoleKey}`,
                        'apikey': serviceRoleKey,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        avatar_url: publicUrl,
                        updated_at: new Date().toISOString()
                    })
                });
            } catch (profileError) {
                console.error('Profile update error:', profileError.message);
            }
        }

        const result = {
            data: {
                publicUrl,
                fileName,
                bucket: targetBucket,
                filePath,
                fileSize: binaryData.length,
                mimeType
            }
        };

        console.log('Image uploaded successfully:', publicUrl);

        return new Response(JSON.stringify(result), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Image Upload Error:', error);

        const errorResponse = {
            error: {
                code: 'IMAGE_UPLOAD_FAILED',
                message: error.message
            }
        };

        return new Response(JSON.stringify(errorResponse), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
});