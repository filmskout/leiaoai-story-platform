-- Migration: upgrade_leoai_platform_tables
-- Created at: 1758897569

-- 创建AI投融资问答对话会话表
CREATE TABLE ai_chat_sessions (
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
CREATE TABLE ai_chat_messages (
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
CREATE TABLE business_plans (
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
CREATE TABLE bp_analysis_reports (
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

-- 创建用户偏好设置表，包含语言、AI模型、主题等偏好
CREATE TABLE user_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL,
    preferred_language VARCHAR(10) DEFAULT 'zh-CN',
    preferred_ai_model VARCHAR(50) DEFAULT 'deepseek',
    preferred_image_model VARCHAR(50) DEFAULT 'hailuo',
    theme_preference VARCHAR(20) DEFAULT 'light' CHECK (theme_preference IN ('light', 'dark', 'auto')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 扩展现有的profiles表，添加第三方登录支持
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS social_providers JSONB DEFAULT '{}';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS company TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS job_title TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS industry TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS investment_focus TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS linkedin_url TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS website_url TEXT;;