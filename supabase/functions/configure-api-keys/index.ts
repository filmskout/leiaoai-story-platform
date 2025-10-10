import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

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
        console.log('配置API密钥...');
        
        // 配置 API 密钥环境变量
        const deepSeekKey = 'sk-85720175774449d49569e8a3a15f387a';
        const openaiKey = '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';
        const qwenKey = 'sk-0d4051f1f7184a628f86e33a3aae6d26';
        
        // 设置环境变量 —— 注意：这在Deno中不能永久化，只在当前进程中生效
        Object.defineProperty(Deno.env, 'DEEPSEEK_API_KEY', { value: deepSeekKey });
        Object.defineProperty(Deno.env, 'OPENAI_API_KEY', { value: openaiKey });
        Object.defineProperty(Deno.env, 'QWEN_API_KEY', { value: qwenKey });
        
        console.log('API密钥配置完成');
        
        return new Response(JSON.stringify({
            data: {
                message: 'API密钥配置成功',
                keys: {
                    deepSeek: !!deepSeekKey, 
                    openai: !!openaiKey,
                    qwen: !!qwenKey
                }
            }
        }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
        
    } catch (error) {
        console.error('配置API密钥失败:', error);
        
        return new Response(JSON.stringify({
            error: {
                code: 'CONFIGURE_KEYS_FAILED',
                message: error.message || '配置API密钥失败'
            }
        }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
});