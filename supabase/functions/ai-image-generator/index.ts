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
    const { prompt, model = 'dalle', title = 'Generated Image' } = requestData;

    if (!prompt) {
      throw new Error('Prompt is required for image generation');
    }

    // Get API keys from environment
    const openaiKey = Deno.env.get('OPENAI_API_KEY');
    
    // Create enhanced image generation prompt
    const enhancedPrompt = `Create a professional, high-quality image for a story about: ${prompt}. 
Make it visually appealing, modern, and suitable for a blog post or article header. 
Style: clean, professional, engaging. 
Avoid text overlays.`;

    let imageUrl = '';
    let actualModel = model;

    if (model === 'dalle' && openaiKey) {
      // DALL-E 3 API call
      const apiResponse = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openaiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'dall-e-3',
          prompt: enhancedPrompt.substring(0, 4000), // DALL-E 3 has a 4000 character limit
          size: '1024x1024',
          quality: 'standard',
          n: 1
        })
      });

      if (!apiResponse.ok) {
        const errorData = await apiResponse.text();
        throw new Error(`DALL-E API error: ${apiResponse.status} - ${errorData}`);
      }

      const dalleData = await apiResponse.json();
      imageUrl = dalleData.data[0]?.url;
      
      if (!imageUrl) {
        throw new Error('No image URL returned from DALL-E');
      }
      
      actualModel = 'dall-e-3';
    } else {
      // Fallback to a placeholder image service or error
      throw new Error(`Image generation model ${model} not available or API key missing`);
    }

    // Download and re-upload to Supabase storage for persistence
    let finalImageUrl = imageUrl;
    
    try {
      const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
      const supabaseUrl = Deno.env.get('SUPABASE_URL');
      
      if (supabaseServiceKey && supabaseUrl) {
        // Download the generated image
        const imageResponse = await fetch(imageUrl);
        if (imageResponse.ok) {
          const imageBlob = await imageResponse.arrayBuffer();
          
          // Generate filename
          const timestamp = Date.now();
          const fileName = `ai-generated-${timestamp}.png`;
          
          // Upload to Supabase Storage
          const uploadResponse = await fetch(`${supabaseUrl}/storage/v1/object/images/${fileName}`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${supabaseServiceKey}`,
              'Content-Type': 'image/png',
              'x-upsert': 'true'
            },
            body: imageBlob
          });
          
          if (uploadResponse.ok) {
            finalImageUrl = `${supabaseUrl}/storage/v1/object/public/images/${fileName}`;
          }
        }
      }
    } catch (uploadError) {
      console.warn('Failed to upload to Supabase storage, using original URL:', uploadError);
      // Continue with original URL if upload fails
    }

    return new Response(JSON.stringify({ 
      data: {
        imageUrl: finalImageUrl,
        model: actualModel,
        prompt: enhancedPrompt,
        originalUrl: imageUrl !== finalImageUrl ? imageUrl : undefined
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Image generation error:', error);
    
    const errorResponse = {
      error: {
        code: 'IMAGE_GENERATION_ERROR',
        message: error.message
      }
    };

    return new Response(JSON.stringify(errorResponse), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});