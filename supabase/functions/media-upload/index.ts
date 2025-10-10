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
    const { mediaData, fileName, mediaType = 'image' } = requestData;

    if (!mediaData || !fileName) {
      throw new Error('Media data and filename are required');
    }

    // Get Supabase configuration
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');

    if (!serviceRoleKey || !supabaseUrl) {
      throw new Error('Supabase configuration missing');
    }

    // Extract base64 data from data URL
    const base64Data = mediaData.includes(',') ? mediaData.split(',')[1] : mediaData;
    const mimeType = mediaData.includes(';') ? mediaData.split(';')[0].split(':')[1] : (mediaType === 'image' ? 'image/jpeg' : 'video/mp4');

    // Convert base64 to binary
    const binaryData = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));

    // Determine bucket based on media type
    const bucket = mediaType === 'image' ? 'images' : 'videos';
    
    // Create unique filename with timestamp
    const timestamp = Date.now();
    const fileExtension = fileName.split('.').pop() || (mediaType === 'image' ? 'jpg' : 'mp4');
    const uniqueFileName = `${timestamp}-${fileName.replace(/[^a-zA-Z0-9.-]/g, '_')}`;

    // Upload to Supabase Storage
    const uploadResponse = await fetch(`${supabaseUrl}/storage/v1/object/${bucket}/${uniqueFileName}`, {
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
      
      // Try to create bucket if it doesn't exist
      if (uploadResponse.status === 404 || errorText.includes('not found')) {
        const createBucketResponse = await fetch(`${supabaseUrl}/storage/v1/bucket`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${serviceRoleKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            id: bucket,
            name: bucket,
            public: true
          })
        });

        if (createBucketResponse.ok) {
          // Retry upload after creating bucket
          const retryUploadResponse = await fetch(`${supabaseUrl}/storage/v1/object/${bucket}/${uniqueFileName}`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${serviceRoleKey}`,
              'Content-Type': mimeType,
              'x-upsert': 'true'
            },
            body: binaryData
          });

          if (!retryUploadResponse.ok) {
            const retryErrorText = await retryUploadResponse.text();
            throw new Error(`Upload failed after bucket creation: ${retryErrorText}`);
          }
        } else {
          throw new Error(`Failed to create bucket and upload: ${errorText}`);
        }
      } else {
        throw new Error(`Upload failed: ${errorText}`);
      }
    }

    // Get public URL
    const publicUrl = `${supabaseUrl}/storage/v1/object/public/${bucket}/${uniqueFileName}`;

    // Verify the uploaded file is accessible
    const verifyResponse = await fetch(publicUrl, { method: 'HEAD' });
    if (!verifyResponse.ok) {
      console.warn('Uploaded file may not be immediately accessible:', verifyResponse.status);
    }

    const result = {
      publicUrl,
      fileName: uniqueFileName,
      originalFileName: fileName,
      fileSize: binaryData.length,
      mimeType,
      bucket,
      uploadedAt: new Date().toISOString()
    };

    return new Response(JSON.stringify({ data: result }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Media upload error:', error);
    
    const errorResponse = {
      error: {
        code: 'MEDIA_UPLOAD_ERROR',
        message: error.message
      }
    };

    return new Response(JSON.stringify(errorResponse), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});