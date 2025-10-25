// Supabase Edge Function: Create Company Logos Storage Bucket
// Purpose: Automatically create the company-logos storage bucket with proper configuration

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

    const bucketExists = existingBuckets?.some((b: any) => b.name === 'company-logos')

    if (bucketExists) {
      return new Response(
        JSON.stringify({
          success: true,
          message: 'Bucket "company-logos" already exists',
          bucket: 'company-logos'
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
      .createBucket('company-logos', {
        public: true,
        fileSizeLimit: 2097152, // 2MB
        allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml', 'image/webp']
      })

    if (createError) {
      throw new Error(`Failed to create bucket: ${createError.message}`)
    }

    console.log('✅ Company Logos Storage bucket created successfully:', newBucket)

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Company logos storage bucket created successfully',
        bucket: newBucket
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    )

  } catch (error) {
    console.error('❌ Error creating company logos bucket:', error)
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})
