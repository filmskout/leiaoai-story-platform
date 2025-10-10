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
        const { message, sessionId, language = 'zh-CN' } = await req.json();

        if (!message) {
            throw new Error('消息内容不能为空');
        }

        // Get API key from environment
        const apiKey = Deno.env.get('OPENAI_API_KEY');
        if (!apiKey) {
            throw new Error('OpenAI API密钥未配置');
        }

        console.log('Processing OpenAI request:', { sessionId, messageLength: message.length });

        const startTime = Date.now();

        // Create conversation context based on language
        const systemPrompt = language.startsWith('zh') 
            ? '你是一位专业的投融资顾问，具有丰富的资本市场经验。请用中文回答用户的投融资相关问题，提供专业、准确的建议。'
            : 'You are a professional investment and financing consultant with extensive capital market experience. Please provide professional and accurate advice on investment and financing related questions.';

        // Call OpenAI API
        const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'gpt-4o',
                messages: [
                    {
                        role: 'system',
                        content: systemPrompt
                    },
                    {
                        role: 'user',
                        content: message
                    }
                ],
                max_tokens: 4000,
                temperature: 0.3,
                stream: false
            })
        });

        if (!openaiResponse.ok) {
            const errorData = await openaiResponse.text();
            console.error('OpenAI API error:', errorData);
            throw new Error(`OpenAI API请求失败: ${openaiResponse.status}`);
        }

        const responseData = await openaiResponse.json();
        
        if (!responseData.choices || !responseData.choices[0] || !responseData.choices[0].message) {
            throw new Error('OpenAI API返回了无效的响应格式');
        }

        const aiResponse = responseData.choices[0].message.content;
        const processingTime = Date.now() - startTime;

        console.log('OpenAI response generated successfully:', { 
            processingTime, 
            responseLength: aiResponse.length 
        });

        return new Response(JSON.stringify({
            data: {
                response: aiResponse,
                model: 'gpt-4o',
                processingTime,
                sessionId,
                usage: responseData.usage || {}
            }
        }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('OpenAI chat error:', error);

        const errorResponse = {
            error: {
                code: 'OPENAI_CHAT_ERROR',
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