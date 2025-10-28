// 基于地理位置的模型选择 Edge Function
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

Deno.serve(async (req) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': 'https://leiao.ai',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE, PATCH',
    'Access-Control-Max-Age': '86400',
    'Access-Control-Allow-Credentials': 'false'
  };

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    // 创建Supabase客户端
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // 从请求中获取IP地址
    const clientIp = req.headers.get('x-forwarded-for') || '127.0.0.1';
    
    console.log(`检测客户端IP地址: ${clientIp}`);
    
    // 调用ip-to-language函数获取地理信息
    const { data, error } = await supabase.functions.invoke('ip-to-language', {
      body: {},
      headers: {
        'x-forwarded-for': clientIp
      }
    });

    if (error) {
      throw new Error(`地理信息获取失败: ${error.message}`);
    }

    // 检查API密钥状态
    const openaiKeyExists = !!Deno.env.get('OPENAI_API_KEY');
    const qwenKeyExists = !!Deno.env.get('QWEN_API_KEY');
    const deepseekKeyExists = !!Deno.env.get('DEEPSEEK_API_KEY');

    // 更新模型状态
    const modelConfigs = data.data.modelConfigs;
    
    // 更新模型启用状态基于API密钥是否存在
    if (modelConfigs && modelConfigs.chat && modelConfigs.chat.available) {
      modelConfigs.chat.available = modelConfigs.chat.available.map(model => {
        if (model.id === 'openai') {
          return { ...model, enabled: openaiKeyExists };
        } else if (model.id === 'qwen') {
          return { ...model, enabled: qwenKeyExists };
        } else if (model.id === 'deepseek') {
          return { ...model, enabled: deepseekKeyExists };
        }
        return model;
      });
    }

    // 确保推荐的模型是可用的
    const region = data.data.region;
    let recommendedChatModel = data.data.recommendedModels.chat;

    // 如果推荐的模型不可用，选择备用模型
    if ((recommendedChatModel === 'openai' && !openaiKeyExists) ||
        (recommendedChatModel === 'qwen' && !qwenKeyExists) ||
        (recommendedChatModel === 'deepseek' && !deepseekKeyExists)) {
      
      // 选择可用的模型
      if (deepseekKeyExists) {
        recommendedChatModel = 'deepseek';
      } else if (openaiKeyExists) {
        recommendedChatModel = 'openai';
      } else if (qwenKeyExists) {
        recommendedChatModel = 'qwen';
      } else {
        // 所有模型都不可用时默认为OpenAI
        recommendedChatModel = 'openai';
      }
    }

    // 更新推荐模型状态
    if (modelConfigs && modelConfigs.chat && modelConfigs.chat.available) {
      modelConfigs.chat.available = modelConfigs.chat.available.map(model => {
        return { ...model, recommended: model.id === recommendedChatModel };
      });
    }

    // 返回更新后的结果
    const response = {
      data: {
        ...data.data,
        recommendedModels: {
          ...data.data.recommendedModels,
          chat: recommendedChatModel
        },
        modelConfigs,
        apiKeyStatus: {
          openai: openaiKeyExists,
          qwen: qwenKeyExists,
          deepseek: deepseekKeyExists
        }
      }
    };

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('模型选择服务错误:', error);
    
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
        },
        apiKeyStatus: {
          openai: true,
          qwen: true,
          deepseek: true
        }
      }
    }), {
      status: 200,  // 保证即使出错也返回有效数据
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

// 返回可用模型配置与推荐模型（基于语言/区域的简单启发式）
// 已移除重复的 Deno.serve。上面已包含完整的 CORS 与主逻辑处理。
