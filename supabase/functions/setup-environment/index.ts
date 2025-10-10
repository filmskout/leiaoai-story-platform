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
    // 获取Supabase访问令牌和项目信息
    const accessToken = Deno.env.get('SUPABASE_ACCESS_TOKEN');
    const projectId = 'osxzfilrrwdjuqdyesdm';
    
    if (!accessToken) {
      throw new Error('SUPABASE_ACCESS_TOKEN未配置');
    }

    // 需要设置的环境变量
    const envVars = {
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
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 验证设置结果
    const verification = {
      DEEPSEEK_API_KEY: Deno.env.get('DEEPSEEK_API_KEY') ? '✓ 已配置' : '✗ 未配置',
      OPENAI_API_KEY: Deno.env.get('OPENAI_API_KEY') ? '✓ 已配置' : '✗ 未配置',
      QWEN_OVERSEAS_API_KEY: Deno.env.get('QWEN_OVERSEAS_API_KEY') ? '✓ 已配置' : '✗ 未配置',
      QWEN_DOMESTIC_API_KEY: Deno.env.get('QWEN_DOMESTIC_API_KEY') ? '✓ 已配置' : '✗ 未配置'
    };

    const successCount = results.filter(r => r.success).length;
    const totalCount = results.length;

    return new Response(JSON.stringify({ 
      data: {
        message: `环境变量设置完成: ${successCount}/${totalCount}`,
        results: results,
        verification: verification,
        project_id: projectId,
        next_steps: [
          '等待2-3分钟让环境变量在所有edge functions中生效',
          '使用 test-ai-apis function 测试API连接',
          '通过 configure-api-keys function 验证配置状态'
        ]
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      error: {
        code: 'SETUP_ERROR',
        message: error.message
      }
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
