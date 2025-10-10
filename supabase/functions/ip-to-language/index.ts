// IP地址语言检测 Edge Function
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
    // 从请求中获取IP地址
    const clientIp = req.headers.get('x-forwarded-for') || '127.0.0.1';
    
    console.log(`检测客户端IP地址: ${clientIp}`);
    
    // 调用外部API获取IP信息
    const response = await fetch(`https://ipapi.co/${clientIp}/json/`);
    
    // 检查响应状态
    if (!response.ok) {
      throw new Error(`IP地址查询失败: ${response.status}`);
    }
    
    const ipData = await response.json();
    
    // 验证响应中是否包含国家代码
    if (!ipData || !ipData.country) {
      throw new Error('无法确定客户端位置');
    }
    
    // 确定用户区域
    const country = ipData.country;
    const isChina = country === 'CN';
    const region = isChina ? 'china' : 'overseas';
    
    // 确定默认使用的语言
    const language = isChina ? 'zh-CN' : 'en-US';
    
    // 确定推荐的模型
    const recommendedChatModel = isChina ? 'qwen' : 'openai';
    const recommendedImageModel = 'dall-e';
    
    // 准备可用的模型列表
    const modelConfigs = {
      chat: {
        available: [
          {
            id: 'openai',
            name: 'OpenAI',
            enabled: true,
            recommended: recommendedChatModel === 'openai',
            avgResponseTime: 3000  // 初始值，单位毫秒
          },
          {
            id: 'deepseek',
            name: 'DeepSeek',
            enabled: true,
            recommended: recommendedChatModel === 'deepseek',
            avgResponseTime: 4000  // 初始值，单位毫秒
          },
          {
            id: 'qwen',
            name: '通义千问',
            enabled: true,
            recommended: recommendedChatModel === 'qwen',
            avgResponseTime: 3500  // 初始值，单位毫秒
          }
        ]
      },
      image: {
        available: [
          {
            id: 'dall-e',
            name: 'DALL-E',
            enabled: true,
            recommended: true
          }
        ]
      }
    };
    
    // 返回结果
    return new Response(JSON.stringify({
      data: {
        region,
        country,
        language,
        recommendedModels: {
          chat: recommendedChatModel,
          image: recommendedImageModel
        },
        modelConfigs
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('IP语言检测错误:', error);
    
    // 错误时返回默认设置
    return new Response(JSON.stringify({
      error: error.message,
      data: {
        region: 'overseas',
        country: 'US',
        language: 'en-US',
        recommendedModels: {
          chat: 'openai',
          image: 'dall-e'
        },
        modelConfigs: {
          chat: {
            available: [
              { id: 'openai', name: 'OpenAI', enabled: true, recommended: true },
              { id: 'deepseek', name: 'DeepSeek', enabled: true, recommended: false },
              { id: 'qwen', name: '通义千问', enabled: true, recommended: false }
            ]
          },
          image: {
            available: [
              { id: 'dall-e', name: 'DALL-E', enabled: true, recommended: true }
            ]
          }
        }
      }
    }), {
      status: 200,  // 保证即使出错也返回有效数据
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
