-- Migration: create_profiles_and_stories_tables
-- Created at: 1759378861

-- Migration: create_profiles_and_stories_tables
-- Creating essential tables for user profiles and stories

-- 创建用户档案表
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE,
    full_name TEXT,
    username TEXT UNIQUE,
    avatar_url TEXT,
    bio TEXT,
    location TEXT,
    company TEXT,
    job_title TEXT,
    industry TEXT,
    investment_focus TEXT,
    linkedin_url TEXT,
    website_url TEXT,
    social_providers JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 创建故事表
CREATE TABLE IF NOT EXISTS stories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    summary TEXT,
    category TEXT DEFAULT 'general',
    tags TEXT[] DEFAULT '{}',
    image_url TEXT,
    is_published BOOLEAN DEFAULT false,
    view_count INTEGER DEFAULT 0,
    like_count INTEGER DEFAULT 0,
    comment_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    published_at TIMESTAMPTZ
);

-- 创建故事媒体表
CREATE TABLE IF NOT EXISTS story_media (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    story_id UUID NOT NULL,
    media_type VARCHAR(20) CHECK (media_type IN ('image', 'video', 'audio')),
    media_url TEXT NOT NULL,
    caption TEXT,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 创建故事评论表
CREATE TABLE IF NOT EXISTS story_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    story_id UUID NOT NULL,
    user_id UUID NOT NULL,
    content TEXT NOT NULL,
    parent_id UUID,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 创建点赞表
CREATE TABLE IF NOT EXISTS likes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    story_id UUID NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, story_id)
);

-- 添加外键约束
ALTER TABLE ai_chat_messages 
ADD CONSTRAINT fk_ai_chat_messages_session_id 
FOREIGN KEY (session_id) REFERENCES ai_chat_sessions(id) ON DELETE CASCADE;

ALTER TABLE bp_analysis_reports 
ADD CONSTRAINT fk_bp_analysis_reports_business_plan_id 
FOREIGN KEY (business_plan_id) REFERENCES business_plans(id) ON DELETE CASCADE;

ALTER TABLE story_media 
ADD CONSTRAINT fk_story_media_story_id 
FOREIGN KEY (story_id) REFERENCES stories(id) ON DELETE CASCADE;

ALTER TABLE story_comments 
ADD CONSTRAINT fk_story_comments_story_id 
FOREIGN KEY (story_id) REFERENCES stories(id) ON DELETE CASCADE;

ALTER TABLE likes 
ADD CONSTRAINT fk_likes_story_id 
FOREIGN KEY (story_id) REFERENCES stories(id) ON DELETE CASCADE;;