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
        const { message, session_id, language = 'en', context } = await req.json();

        if (!message) {
            throw new Error('Message is required');
        }

        console.log('AI Chat Request:', { message, session_id, language });

        // Get user from auth header if available
        let userId = null;
        const authHeader = req.headers.get('authorization');
        if (authHeader) {
            try {
                const token = authHeader.replace('Bearer ', '');
                const userResponse = await fetch(`${Deno.env.get('SUPABASE_URL')}/auth/v1/user`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'apikey': Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
                    }
                });
                if (userResponse.ok) {
                    const userData = await userResponse.json();
                    userId = userData.id;
                }
            } catch (error) {
                console.log('Could not get user from token:', error.message);
            }
        }

        // Create system prompt based on language
        const systemPrompt = language === 'zh' 
            ? '你是LeiaoAI的智能助手，专门帮助用户进行创意写作和故事创作。你友好、有帮助，并且能够提供有创意的建议。请用中文回答。'
            : 'You are LeiaoAI\'s intelligent assistant, specialized in helping users with creative writing and storytelling. You are friendly, helpful, and provide creative suggestions. Please respond in English.';

        // Build conversation context if available
        let conversationContext = '';
        if (context && Array.isArray(context)) {
            conversationContext = context.map(msg => `${msg.role}: ${msg.content}`).join('\n');
        }

        const fullPrompt = conversationContext 
            ? `Previous conversation:\n${conversationContext}\n\nCurrent message: ${message}`
            : message;

        // Use DeepSeek for chat completions
        const response = await fetch('https://api.deepseek.com/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${Deno.env.get('DEEPSEEK_API_KEY') || 'sk-placeholder-key'}`
            },
            body: JSON.stringify({
                model: 'deepseek-chat',
                messages: [
                    {
                        role: 'system',
                        content: systemPrompt
                    },
                    {
                        role: 'user',
                        content: fullPrompt
                    }
                ],
                max_tokens: 1000,
                temperature: 0.7
            })
        });

        if (!response.ok) {
            console.error('DeepSeek API Error:', response.status);
            throw new Error('AI service temporarily unavailable');
        }

        const aiResponse = await response.json();
        const aiMessage = aiResponse.choices[0]?.message?.content || 'I apologize, but I couldn\'t generate a response. Please try again.';

        // Save message to database if user is authenticated and session_id provided
        if (userId && session_id) {
            try {
                const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
                const supabaseUrl = Deno.env.get('SUPABASE_URL');

                // Save user message
                await fetch(`${supabaseUrl}/rest/v1/ai_chat_messages`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${serviceRoleKey}`,
                        'apikey': serviceRoleKey,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        session_id: session_id,
                        role: 'user',
                        content: message,
                        created_at: new Date().toISOString()
                    })
                });

                // Save AI response
                await fetch(`${supabaseUrl}/rest/v1/ai_chat_messages`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${serviceRoleKey}`,
                        'apikey': serviceRoleKey,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        session_id: session_id,
                        role: 'assistant',
                        content: aiMessage,
                        created_at: new Date().toISOString()
                    })
                });

                console.log('Messages saved to database');
            } catch (dbError) {
                console.error('Database save error:', dbError.message);
                // Continue even if database save fails
            }
        }

        const result = {
            data: {
                message: aiMessage,
                session_id: session_id,
                timestamp: new Date().toISOString()
            }
        };

        console.log('AI Chat response generated successfully');

        return new Response(JSON.stringify(result), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('AI Chat Error:', error);

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