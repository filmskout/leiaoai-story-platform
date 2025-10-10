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
    const { api_provider = 'deepseek', test_message = '你好' } = requestData;

    let testResult = null;

    if (api_provider === 'deepseek') {
      const apiKey = Deno.env.get('DEEPSEEK_API_KEY');
      if (!apiKey) {
        throw new Error('DEEPSEEK_API_KEY环境变量未配置');
      }

      const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            {
              role: 'user',
              content: test_message
            }
          ],
          max_tokens: 100,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        throw new Error(`DeepSeek API请求失败: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      testResult = {
        provider: 'deepseek',
        success: true,
        response: data.choices[0]?.message?.content || '无响应内容',
        usage: data.usage,
        model: data.model
      };
    } else if (api_provider === 'openai') {
      const apiKey = Deno.env.get('OPENAI_API_KEY');
      if (!apiKey) {
        throw new Error('OPENAI_API_KEY环境变量未配置');
      }

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'user',
              content: test_message
            }
          ],
          max_tokens: 100,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI API请求失败: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      testResult = {
        provider: 'openai',
        success: true,
        response: data.choices[0]?.message?.content || '无响应内容',
        usage: data.usage,
        model: data.model
      };
    } else if (api_provider === 'qwen') {
      const apiKey = Deno.env.get('QWEN_API_KEY') || 'sk-0d4051f1f7184a628f86e33a3aae6d26';
      
      if (!apiKey) {
        throw new Error(`QWEN_API_KEY环境变量未配置`);
      }

      // 通义千问 API测试
      const endpoint = 'https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation';

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          model: 'qwen-max',
          input: {
            messages: [
              {
                role: 'user',
                content: test_message
              }
            ]
          },
          parameters: {}
        })
      });

      if (!response.ok) {
        throw new Error(`通义千问 API请求失败: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      testResult = {
        provider: 'qwen',
        success: true,
        response: data.output?.text || data.output?.message?.content || '无响应内容',
        usage: data.usage,
        model: 'qwen-max'
      };
    } else {
      throw new Error(`不支持的API提供商: ${api_provider}`);
    }

    return new Response(JSON.stringify({ data: testResult }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    const errorResponse = {
      error: {
        code: 'API_TEST_ERROR',
        message: error.message
      }
    };

    return new Response(JSON.stringify(errorResponse), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
