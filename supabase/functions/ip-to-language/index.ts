import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

Deno.serve(async (req) => {
  const origin = req.headers.get('origin') || '';
  let allowed = false;
  try {
    const host = new URL(origin).hostname;
    allowed = origin === 'https://leiao.ai' || host.endsWith('.vercel.app') || origin === 'http://localhost:5173';
  } catch {}
  const corsHeaders = {
    'Access-Control-Allow-Origin': allowed ? origin : 'https://leiao.ai',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE, PATCH',
    'Access-Control-Max-Age': '86400',
    'Access-Control-Allow-Credentials': 'false'
  };

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // 简化：从请求头中推断区域，或返回默认
    const countryCode = req.headers.get('x-country-code') || 'US';
    const isChina = countryCode === 'CN';

    // 构造返回数据（示例）
    const data = {
      region: isChina ? 'china' : 'overseas',
      country: isChina ? 'CN' : countryCode,
      language: isChina ? 'zh-CN' : 'en-US',
      modelConfigs: {
        chat: { available: [] },
        image: { available: [] }
      },
      recommendedModels: {
        chat: 'openai',
        image: 'dall-e'
      }
    };

    return new Response(JSON.stringify({ data }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
