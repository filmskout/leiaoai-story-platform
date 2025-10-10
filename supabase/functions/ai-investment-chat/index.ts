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
        const { message, sessionId, aiModel, language, messageType = 'text' } = await req.json();

        if (!message) {
            throw new Error('Message is required');
        }

        // Get user from auth header
        const authHeader = req.headers.get('authorization');
        let userId = null;
        
        if (authHeader) {
            const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
            const supabaseUrl = Deno.env.get('SUPABASE_URL');
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
            }
        }

        // 只使用DeepSeek模型
        const selectedModel = 'deepseek';
        const apiKey = 'sk-85720175774449d49569e8a3a15f387a';
        const apiUrl = 'https://api.deepseek.com/chat/completions';

        // Investment-focused system prompt
        const systemPrompt = `你是蕾奥AI投融资专家助手，专注于提供专业的投融资咨询服务。你的专业领域包括：

1. 宏观经济展望分析
2. 国内外投融资环境差异化对比
3. CVC产业投资模式专业指导
4. 并购对赌策略分析
5. IPO/SPAC上市流程（A股/港股/美股差异化）
6. 上市准备材料清单指导

请用专业、准确、有深度的方式回答用户的投融资相关问题。如果问题超出投融资领域，请礼貌地引导用户回到相关话题。`;

        const startTime = Date.now();
        let aiResponse = '';

        // 调用DeepSeek API
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'deepseek-chat',
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: message }
                ],
                temperature: 0.7,
                max_tokens: 2000,
                top_p: 0.9
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`DeepSeek API error: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        aiResponse = data.choices?.[0]?.message?.content || '抱歉，无法生成回复。请稍后重试。';

        const processingTime = Date.now() - startTime;

        // Save conversation to database (if tables exist)
        // Note: In a real implementation, you would check if tables exist first
        const conversationData = {
            sessionId: sessionId || crypto.randomUUID(),
            userMessage: message,
            aiResponse: aiResponse,
            aiModel: selectedModel,
            processingTime: processingTime,
            language: language || 'zh-CN',
            messageType: messageType
        };

        return new Response(JSON.stringify({
            data: {
                response: aiResponse,
                sessionId: conversationData.sessionId,
                aiModel: selectedModel,
                processingTime: processingTime
            }
        }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('AI chat error:', error);

        const errorResponse = {
            error: {
                code: 'AI_CHAT_FAILED',
                message: error.message
            }
        };

        return new Response(JSON.stringify(errorResponse), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
});
