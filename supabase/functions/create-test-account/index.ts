import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE, PATCH',
  'Access-Control-Max-Age': '86400',
  'Access-Control-Allow-Credentials': 'false'
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (!supabaseServiceRoleKey) {
      throw new Error('Service role key not found');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    if (!supabaseUrl) {
      throw new Error('Supabase URL not found');
    }

    // Create test account with specific credentials
    const testAccountData = {
      email: 'leiaoaiagent@example.com',
      password: 'agentleiaoai',
      user_metadata: {
        username: 'leiaoaiagent',
        full_name: 'LeiaoAI Test Agent',
        is_admin: true,
        is_test_account: true
      }
    };

    // Use Supabase Admin API to create user
    const response = await fetch(`${supabaseUrl}/auth/v1/admin/users`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${supabaseServiceRoleKey}`,
        'Content-Type': 'application/json',
        'apikey': supabaseServiceRoleKey
      },
      body: JSON.stringify({
        email: testAccountData.email,
        password: testAccountData.password,
        user_metadata: testAccountData.user_metadata,
        email_confirm: true
      })
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Failed to create test account:', error);
      
      // Check if user already exists
      if (error.includes('already exists') || error.includes('already registered')) {
        return new Response(JSON.stringify({
          success: true,
          message: 'Test account already exists',
          credentials: {
            username: 'leiaoaiagent',
            password: 'agentleiaoai'
          }
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
      
      throw new Error(`Failed to create test account: ${error}`);
    }

    const userData = await response.json();

    return new Response(JSON.stringify({
      success: true,
      message: 'Test account created successfully',
      user_id: userData.id,
      credentials: {
        username: 'leiaoaiagent',
        password: 'agentleiaoai'
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error creating test account:', error);

    return new Response(JSON.stringify({
      error: {
        code: 'TEST_ACCOUNT_CREATION_ERROR',
        message: error.message
      }
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
