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
        const { message, sessionId, language = 'zh-CN', region = 'overseas' } = await req.json();

        if (!message) {
            throw new Error('消息内容不能为空');
        }

        // Choose API key based on region
        let apiKey;
        let apiUrl;
        
        if (region === 'china') {
            apiKey = Deno.env.get('QWEN_DOMESTIC_API_KEY');
            apiUrl = 'https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation';
        } else {
            apiKey = Deno.env.get('QWEN_OVERSEAS_API_KEY');
            apiUrl = 'https://dashscope-intl.aliyuncs.com/api/v1/services/aigc/text-generation/generation';
        }

        if (!apiKey) {
            throw new Error(`Qwen API密钥未配置 (${region})`);
        }

        console.log('Processing Qwen request:', { sessionId, messageLength: message.length, region });

        const startTime = Date.now();

        // Create conversation context based on language
        const systemPrompt = language.startsWith('zh') 
            ? '你是一位专业的投融资顾问，具有丰富的资本市场经验。请用中文回答用户的投融资相关问题，提供专业、准确的建议。'
            : 'You are a professional investment and financing consultant with extensive capital market experience. Please provide professional and accurate advice on investment and financing related questions.';

        // Call Qwen API
        const qwenResponse = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'qwen-plus',
                input: {
                    messages: [
                        {
                            role: 'system',
                            content: systemPrompt
                        },
                        {
                            role: 'user',
                            content: message
                        }
                    ]
                },
                parameters: {
                    max_tokens: 4000,
                    temperature: 0.3
                }
            })
        });

        if (!qwenResponse.ok) {
            const errorData = await qwenResponse.text();
            console.error('Qwen API error:', errorData);
            throw new Error(`Qwen API请求失败: ${qwenResponse.status}`);
        }

        const responseData = await qwenResponse.json();
        
        if (!responseData.output || !responseData.output.text) {
            throw new Error('Qwen API返回了无效的响应格式');
        }

        const aiResponse = responseData.output.text;
        const processingTime = Date.now() - startTime;

        console.log('Qwen response generated successfully:', { 
            processingTime, 
            responseLength: aiResponse.length 
        });

        return new Response(JSON.stringify({
            data: {
                response: aiResponse,
                model: 'qwen-plus',
                processingTime,
                sessionId,
                region,
                usage: responseData.usage || {}
            }
        }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Qwen chat error:', error);

        const errorResponse = {
            error: {
                code: 'QWEN_CHAT_ERROR',
                message: error.message,
                timestamp: new Date().toISOString()
            }
        };

        return new Response(JSON.stringify(errorResponse), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
});