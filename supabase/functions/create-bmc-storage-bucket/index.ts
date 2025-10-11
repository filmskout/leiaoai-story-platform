// Supabase Edge Function: Create BMC Storage Bucket
// Purpose: Automatically create the bmc-images storage bucket with proper configuration

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase credentials')
    }

    // Create Supabase admin client
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

    // Check if bucket already exists
    const { data: existingBuckets, error: listError } = await supabaseAdmin
      .storage
      .listBuckets()

    if (listError) {
      throw new Error(`Failed to list buckets: ${listError.message}`)
    }

    const bucketExists = existingBuckets?.some((b: any) => b.name === 'bmc-images')

    if (bucketExists) {
      return new Response(
        JSON.stringify({
          success: true,
          message: 'Bucket "bmc-images" already exists',
          bucket: 'bmc-images'
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200
        }
      )
    }

    // Create the bucket
    const { data: newBucket, error: createError } = await supabaseAdmin
      .storage
      .createBucket('bmc-images', {
        public: true,
        fileSizeLimit: 10485760, // 10MB
        allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg']
      })

    if (createError) {
      throw new Error(`Failed to create bucket: ${createError.message}`)
    }

    console.log('✅ BMC Storage bucket created successfully:', newBucket)

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Bucket "bmc-images" created successfully',
        bucket: newBucket
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    )

  } catch (error: any) {
    console.error('❌ Error creating BMC storage bucket:', error)
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'Internal server error'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})

