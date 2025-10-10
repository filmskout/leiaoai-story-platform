// Investment chat edge function - 统一模型 API 处理函数 with Auth & Database Persistence
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
    console.log('收到请求，正在处理...');
    const { message, sessionId, model = 'auto', language = 'zh-CN' } = await req.json();

    if (!message) {
      throw new Error('消息内容不能为空');
    }

    console.log(`处理投资请求: model=${model}, language=${language}`);
    const startTime = Date.now();

    // Get environment variables for Supabase
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    // Check user authentication
    let userId = null;
    let isAuthenticated = false;
    const authHeader = req.headers.get('authorization');
    
    if (authHeader && supabaseUrl && serviceRoleKey) {
      try {
        const token = authHeader.replace('Bearer ', '');
        const userResponse = await fetch(`${supabaseUrl}/auth/v1/user`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'apikey': serviceRoleKey
          }
        });
        
        if (userResponse.ok) {
          const userData = await userResponse.json();
          userId = userData.id;
          isAuthenticated = true;
          console.log('用户已认证:', userId);
        }
      } catch (error) {
        console.log('认证检查失败:', error.message);
      }
    }

    // System prompt
    const systemPrompt = language.startsWith('zh') 
      ? '您是蕾奥AI投资顾问，专注于提供专业的投融资分析和建议。'
      : 'You are a LeiaoAI Investment Advisor, specialized in providing professional investment and financing analysis and advice.';

    // 格式化提示语
    const formattedPrompt = language.startsWith('zh')
      ? `请以最专业的投资顾问角色，回答以下问题：${message}`
      : `Please answer the following investment question with professional expertise: ${message}`;

    // 准备请求消息数组
    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: formattedPrompt }
    ];

    // 先获取地理位置建议的模型
    let recommendedModel = model;
    if (model === 'auto') {
      try {
        const response = await fetch(`${req.url.split('/investment-chat-simple')[0]}/geo-ai-model-selection`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({})
        });

        if (response.ok) {
          const geoData = await response.json();
          recommendedModel = geoData?.data?.recommendedModel || 'qwen';
          console.log(`基于IP检测，推荐使用模型: ${recommendedModel}`);
        } else {
          console.log('地理位置检测失败，使用默认模型: qwen');
          recommendedModel = 'qwen';
        }
      } catch (error) {
        console.log('地理位置检测异常，使用默认模型: qwen', error);
        recommendedModel = 'qwen';
      }
    }

    // 针对不同模型的尝试列表
    const modelAttempts = recommendedModel === 'auto' ? ['qwen', 'deepseek', 'openai'] : [recommendedModel, 'deepseek', 'qwen'];
    let lastError = null;
    let success = false;
    let aiResponse;

    for (const currentModel of modelAttempts) {
      try {
        console.log(`尝试使用模型: ${currentModel}`);
        
        if (currentModel === 'openai') {
          // 获取OpenAI API密钥
          const apiKey = Deno.env.get('OPENAI_API_KEY');
          if (!apiKey) {
            throw new Error('OpenAI API 密钥未配置');
          }

          console.log('正在调用 OpenAI API...');

          // 调用OpenAI API
          const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
              model: 'gpt-4o',
              messages,
              temperature: 0.7,
              max_tokens: 2000
            })
          });

          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`OpenAI API 错误: ${response.status} - ${errorText}`);
          }

          const data = await response.json();
          aiResponse = data.choices[0].message.content;
          success = true;
          console.log('OpenAI API 调用成功');
          break;

        } else if (currentModel === 'qwen') {
          // 获取通义千问API密钥
          const apiKey = Deno.env.get('QWEN_API_KEY');
          if (!apiKey) {
            throw new Error('通义千问 API 密钥未配置');
          }

          console.log('正在调用通义千问API...');

          // 调用通义千问API
          const response = await fetch('https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
              model: 'qwen-turbo',
              input: {
                messages
              },
              parameters: {
                temperature: 0.7,
                max_tokens: 2000,
                top_p: 0.9
              }
            })
          });

          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`通义千问 API 错误: ${response.status} - ${errorText}`);
          }

          const data = await response.json();
          aiResponse = data.output.text;
          success = true;
          console.log('通义千问 API 调用成功');
          break;

        } else if (currentModel === 'deepseek') {
          // 获取DeepSeek API密钥
          const apiKey = Deno.env.get('DEEPSEEK_API_KEY');
          if (!apiKey) {
            throw new Error('DeepSeek API 密钥未配置');
          }

          console.log('正在调用 DeepSeek API...');

          // 调用DeepSeek API
          const response = await fetch('https://api.deepseek.com/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
              model: 'deepseek-chat',
              messages,
              temperature: 0.7,
              max_tokens: 2000
            })
          });

          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`DeepSeek API 错误: ${response.status} - ${errorText}`);
          }

          const data = await response.json();
          aiResponse = data.choices[0].message.content;
          success = true;
          console.log('DeepSeek API 调用成功');
          break;
        }

      } catch (error) {
        console.error(`模型 ${currentModel} 调用失败:`, error.message);
        lastError = error;
        continue;
      }
    }

    if (!success) {
      throw new Error(`所有模型调用失败。最后错误: ${lastError?.message}`);
    }

    const endTime = Date.now();
    const responseTime = endTime - startTime;

    console.log(`请求处理完成，耗时: ${responseTime}ms`);

    // Database persistence logic - only for authenticated users
    let dbSessionId = sessionId;
    if (isAuthenticated && userId && supabaseUrl && serviceRoleKey) {
      try {
        console.log('保存聊天记录到数据库...');
        
        // Create or get session
        if (!sessionId) {
          // Create new session
          const sessionResponse = await fetch(`${supabaseUrl}/rest/v1/ai_chat_sessions`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${serviceRoleKey}`,
              'apikey': serviceRoleKey,
              'Content-Type': 'application/json',
              'Prefer': 'return=representation'
            },
            body: JSON.stringify({
              user_id: userId,
              ai_model: recommendedModel,
              language: language,
              title: message.length > 50 ? message.substring(0, 50) + '...' : message,
              is_active: true,
              message_count: 0
            })
          });
          
          if (sessionResponse.ok) {
            const sessionData = await sessionResponse.json();
            dbSessionId = sessionData[0].id;
            console.log('创建新会话:', dbSessionId);
          } else {
            console.error('创建会话失败:', await sessionResponse.text());
          }
        }
        
        if (dbSessionId) {
          // Save user message
          const userMessageResponse = await fetch(`${supabaseUrl}/rest/v1/ai_chat_messages`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${serviceRoleKey}`,
              'apikey': serviceRoleKey,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              session_id: dbSessionId,
              role: 'user',
              content: message,
              tokens: message.length
            })
          });
          
          // Save AI response
          const aiMessageResponse = await fetch(`${supabaseUrl}/rest/v1/ai_chat_messages`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${serviceRoleKey}`,
              'apikey': serviceRoleKey,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              session_id: dbSessionId,
              role: 'assistant',
              content: aiResponse,
              tokens: aiResponse.length
            })
          });
          
          // Update session message count
          await fetch(`${supabaseUrl}/rest/v1/ai_chat_sessions?id=eq.${dbSessionId}`, {
            method: 'PATCH',
            headers: {
              'Authorization': `Bearer ${serviceRoleKey}`,
              'apikey': serviceRoleKey,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              message_count: 2,
              updated_at: new Date().toISOString()
            })
          });
          
          console.log('消息保存成功');
        }
      } catch (dbError) {
        console.error('数据库操作失败:', dbError.message);
        // Don't fail the entire request for database errors
      }
    } else {
      console.log('匿名用户，不保存聊天记录');
    }

    return new Response(JSON.stringify({
      success: true,
      data: {
        response: aiResponse,
        model: recommendedModel,
        responseTime,
        sessionId: dbSessionId,
        isAuthenticated,
        saved: isAuthenticated && userId ? true : false,
        timestamp: new Date().toISOString()
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200
    });

  } catch (error) {
    console.error('投资聊天处理错误:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message || '处理请求时发生未知错误',
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500
    });
  }
});