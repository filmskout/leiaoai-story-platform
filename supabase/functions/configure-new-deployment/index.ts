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
    // 获取请求数据
    const requestData = await req.json();
    const { deployment_url } = requestData;

    if (!deployment_url) {
      throw new Error('deployment_url is required');
    }

    // 获取Supabase访问令牌和项目信息
    const accessToken = Deno.env.get('SUPABASE_ACCESS_TOKEN');
    const projectId = Deno.env.get('SUPABASE_PROJECT_ID');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');
    
    if (!accessToken || !projectId || !supabaseUrl || !supabaseAnonKey) {
      throw new Error('Missing required Supabase environment variables');
    }

    // 需要设置的环境变量
    const envVars = {
      'VITE_SUPABASE_URL': supabaseUrl,
      'VITE_SUPABASE_ANON_KEY': supabaseAnonKey,
      'DEEPSEEK_API_KEY': 'sk-85720175774449d49569e8a3a15f387a',
      'OPENAI_API_KEY': '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',
      'QWEN_OVERSEAS_API_KEY': 'sk-f4953862edaf40939ffecc97d43e76ac',
      'QWEN_DOMESTIC_API_KEY': 'sk-0d4051f1f7184a628f86e33a3aae6d26'
    };

    const results = [];

    // 逐个设置环境变量
    for (const [key, value] of Object.entries(envVars)) {
      try {
        const response = await fetch(`https://api.supabase.com/v1/projects/${projectId}/secrets`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name: key,
            value: value
          })
        });

        const result = {
          key: key,
          status: response.status,
          success: response.ok
        };

        if (!response.ok) {
          const errorData = await response.text();
          result.error = errorData;
        }

        results.push(result);
      } catch (error) {
        results.push({
          key: key,
          status: 'error',
          success: false,
          error: error.message
        });
      }
    }

    // 等待一下让环境变量生效
    await new Promise(resolve => setTimeout(resolve, 3000));

    const successCount = results.filter(r => r.success).length;
    const totalCount = results.length;

    return new Response(JSON.stringify({ 
      data: {
        message: `新部署环境变量配置完成: ${successCount}/${totalCount}`,
        deployment_url: deployment_url,
        project_id: projectId,
        results: results,
        configured_vars: Object.keys(envVars),
        next_steps: [
          '等待2-3分钟让环境变量在新部署中生效',
          '重新访问部署URL验证应用正常工作',
          '测试国际化系统和AI功能'
        ]
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    const errorResponse = {
      error: {
        code: 'CONFIG_ERROR',
        message: error.message
      }
    };

    return new Response(JSON.stringify(errorResponse), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
