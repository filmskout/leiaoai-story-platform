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
        const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
        const supabaseUrl = Deno.env.get('SUPABASE_URL');

        if (!serviceRoleKey || !supabaseUrl) {
            throw new Error('Supabase configuration missing');
        }

        // SQL for creating new tables
        const createTablesSQL = `
            -- 创建AI投融资问答对话会话表
            CREATE TABLE IF NOT EXISTS ai_chat_sessions (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                user_id UUID,
                session_title TEXT DEFAULT '新的对话',
                created_at TIMESTAMPTZ DEFAULT NOW(),
                updated_at TIMESTAMPTZ DEFAULT NOW(),
                language VARCHAR(10) DEFAULT 'zh-CN',
                ai_model VARCHAR(50) DEFAULT 'deepseek',
                is_active BOOLEAN DEFAULT TRUE
            );

            -- 创建AI投融资问答消息记录表
            CREATE TABLE IF NOT EXISTS ai_chat_messages (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                session_id UUID NOT NULL,
                user_id UUID,
                role VARCHAR(20) NOT NULL CHECK (role IN ('user', 'assistant')),
                content TEXT NOT NULL,
                message_type VARCHAR(20) DEFAULT 'text' CHECK (message_type IN ('text', 'audio', 'image')),
                audio_url TEXT,
                created_at TIMESTAMPTZ DEFAULT NOW(),
                ai_model VARCHAR(50),
                processing_time_ms INTEGER
            );

            -- 创建商业计划书BP文件上传管理表
            CREATE TABLE IF NOT EXISTS business_plans (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                user_id UUID NOT NULL,
                file_name TEXT NOT NULL,
                file_url TEXT NOT NULL,
                file_size INTEGER,
                file_type VARCHAR(20) DEFAULT 'pdf',
                upload_status VARCHAR(20) DEFAULT 'uploaded' CHECK (upload_status IN ('uploaded', 'processing', 'analyzed', 'failed')),
                analysis_result JSONB,
                analysis_summary TEXT,
                created_at TIMESTAMPTZ DEFAULT NOW(),
                updated_at TIMESTAMPTZ DEFAULT NOW()
            );

            -- 创建BP分析报告表
            CREATE TABLE IF NOT EXISTS bp_analysis_reports (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                business_plan_id UUID NOT NULL,
                user_id UUID NOT NULL,
                analysis_type VARCHAR(50) DEFAULT 'comprehensive',
                analysis_content JSONB NOT NULL,
                recommendations TEXT,
                score INTEGER CHECK (score >= 0 AND score <= 100),
                generated_at TIMESTAMPTZ DEFAULT NOW(),
                ai_model VARCHAR(50) DEFAULT 'deepseek'
            );

            -- 创建用户偏好设置表
            CREATE TABLE IF NOT EXISTS user_preferences (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                user_id UUID UNIQUE NOT NULL,
                preferred_language VARCHAR(10) DEFAULT 'zh-CN',
                preferred_ai_model VARCHAR(50) DEFAULT 'deepseek',
                preferred_image_model VARCHAR(50) DEFAULT 'hailuo',
                theme_preference VARCHAR(20) DEFAULT 'light' CHECK (theme_preference IN ('light', 'dark', 'auto')),
                created_at TIMESTAMPTZ DEFAULT NOW(),
                updated_at TIMESTAMPTZ DEFAULT NOW()
            );

            -- 扩展现有的profiles表
            ALTER TABLE profiles ADD COLUMN IF NOT EXISTS social_providers JSONB DEFAULT '{}';
            ALTER TABLE profiles ADD COLUMN IF NOT EXISTS company TEXT;
            ALTER TABLE profiles ADD COLUMN IF NOT EXISTS job_title TEXT;
            ALTER TABLE profiles ADD COLUMN IF NOT EXISTS industry TEXT;
            ALTER TABLE profiles ADD COLUMN IF NOT EXISTS investment_focus TEXT;
            ALTER TABLE profiles ADD COLUMN IF NOT EXISTS linkedin_url TEXT;
            ALTER TABLE profiles ADD COLUMN IF NOT EXISTS website_url TEXT;
        `;

        // Execute SQL using REST API
        const response = await fetch(`${supabaseUrl}/rest/v1/rpc/sql`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${serviceRoleKey}`,
                'apikey': serviceRoleKey,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ query: createTablesSQL })
        });

        // Try alternative approach if RPC doesn't work
        if (!response.ok) {
            // Use psql approach
            const queries = createTablesSQL.split(';').filter(q => q.trim());
            const results = [];
            
            for (const query of queries) {
                if (query.trim()) {
                    const queryResponse = await fetch(`${supabaseUrl}/rest/v1/query`, {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${serviceRoleKey}`,
                            'apikey': serviceRoleKey,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ query: query.trim() })
                    });
                    
                    results.push({
                        query: query.trim().substring(0, 50) + '...',
                        success: queryResponse.ok,
                        status: queryResponse.status
                    });
                }
            }
            
            return new Response(JSON.stringify({
                data: {
                    message: 'Database initialization attempted with individual queries',
                    results
                }
            }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
        }

        const result = await response.json();
        
        return new Response(JSON.stringify({
            data: {
                message: 'Database tables created successfully',
                details: result
            }
        }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Database initialization error:', error);

        const errorResponse = {
            error: {
                code: 'DATABASE_INIT_FAILED',
                message: error.message
            }
        };

        return new Response(JSON.stringify(errorResponse), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
});