-- Migration: assign_story_tags
-- Created at: 1759901531

-- Assign tags to the newly created stories

-- First, let's get the story IDs for our newly created stories
-- We'll use the titles to identify them and then assign appropriate tags

-- English stories with tags
-- AI Revolutionizing Healthcare: artificial-intelligence, machine-learning, technology
INSERT INTO story_tag_assignments (story_id, tag_id)
SELECT s.id, t.id
FROM stories s, story_tags t
WHERE s.title = 'AI Revolutionizing Healthcare: From Diagnosis to Treatment'
AND t.name IN ('artificial-intelligence', 'machine-learning', 'technology');

-- The Future of Finance: investment, fintech, artificial-intelligence
INSERT INTO story_tag_assignments (story_id, tag_id)
SELECT s.id, t.id
FROM stories s, story_tags t
WHERE s.title = 'The Future of Finance: AI-Powered Investment Strategies'
AND t.name IN ('investment', 'fintech', 'artificial-intelligence');

-- Building Scalable Startups: startup, business-strategy, venture-capital
INSERT INTO story_tag_assignments (story_id, tag_id)
SELECT s.id, t.id
FROM stories s, story_tags t
WHERE s.title = 'Building Scalable Startups: Lessons from Silicon Valley'
AND t.name IN ('startup', 'business-strategy', 'venture-capital');

-- The Art of AI-Powered Content Creation: content-creation, artificial-intelligence, productivity
INSERT INTO story_tag_assignments (story_id, tag_id)
SELECT s.id, t.id
FROM stories s, story_tags t
WHERE s.title = 'The Art of AI-Powered Content Creation'
AND t.name IN ('content-creation', 'artificial-intelligence', 'productivity');

-- E-commerce Evolution: artificial-intelligence, user-experience, automation
INSERT INTO story_tag_assignments (story_id, tag_id)
SELECT s.id, t.id
FROM stories s, story_tags t
WHERE s.title = 'E-commerce Evolution: AI-Driven Shopping Experiences'
AND t.name IN ('artificial-intelligence', 'user-experience', 'automation');

-- Education Revolution: education-ai, learning, technology
INSERT INTO story_tag_assignments (story_id, tag_id)
SELECT s.id, t.id
FROM stories s, story_tags t
WHERE s.title = 'Education Revolution: AI Tutoring and Personalized Learning'
AND t.name IN ('education-ai', 'learning', 'technology');

-- Manufacturing 4.0: artificial-intelligence, automation, industry
INSERT INTO story_tag_assignments (story_id, tag_id)
SELECT s.id, t.id
FROM stories s, story_tags t
WHERE s.title = 'Manufacturing 4.0: AI-Powered Smart Factories'
AND t.name IN ('artificial-intelligence', 'automation', 'industry');

-- Real Estate Innovation: artificial-intelligence, market-analysis, automation
INSERT INTO story_tag_assignments (story_id, tag_id)
SELECT s.id, t.id
FROM stories s, story_tags t
WHERE s.title = 'Real Estate Innovation: AI in Property Management and Investment'
AND t.name IN ('artificial-intelligence', 'market-analysis', 'automation');

-- The Developer's Guide: coding-assistant, technology, productivity
INSERT INTO story_tag_assignments (story_id, tag_id)
SELECT s.id, t.id
FROM stories s, story_tags t
WHERE s.title = 'The Developer''s Guide to AI-Assisted Programming'
AND t.name IN ('coding-assistant', 'technology', 'productivity');

-- Chinese stories with tags
-- 人工智能在中国: artificial-intelligence, industry, tech-share
INSERT INTO story_tag_assignments (story_id, tag_id)
SELECT s.id, t.id
FROM stories s, story_tags t
WHERE s.title = '人工智能在中国：从概念到商业化的完整路径'
AND t.name IN ('artificial-intelligence', 'industry', 'tech-share');

-- 创业思维: startup-experience, business-strategy, learning
INSERT INTO story_tag_assignments (story_id, tag_id)
SELECT s.id, t.id
FROM stories s, story_tags t
WHERE s.title = '创业思维：如何在不确定性中寻找商业机会'
AND t.name IN ('startup-experience', 'business-strategy', 'learning');

-- 数字化转型: artificial-intelligence, business-strategy, market-analysis
INSERT INTO story_tag_assignments (story_id, tag_id)
SELECT s.id, t.id
FROM stories s, story_tags t
WHERE s.title = '数字化转型：传统企业的AI升级之路'
AND t.name IN ('artificial-intelligence', 'business-strategy', 'market-analysis');

-- 投资理财新时代: investment, fintech, data-analysis
INSERT INTO story_tag_assignments (story_id, tag_id)
SELECT s.id, t.id
FROM stories s, story_tags t
WHERE s.title = '投资理财新时代：AI如何重塑财富管理'
AND t.name IN ('investment', 'fintech', 'data-analysis');

-- 内容创作的未来: content-creation, productivity, tips
INSERT INTO story_tag_assignments (story_id, tag_id)
SELECT s.id, t.id
FROM stories s, story_tags t
WHERE s.title = '内容创作的未来：AI工具如何助力创意产业'
AND t.name IN ('content-creation', 'productivity', 'tips');

-- 教育科技前沿: education-ai, learning, tutorial
INSERT INTO story_tag_assignments (story_id, tag_id)
SELECT s.id, t.id
FROM stories s, story_tags t
WHERE s.title = '教育科技前沿：个性化学习的AI解决方案'
AND t.name IN ('education-ai', 'learning', 'tutorial');

-- 社交媒体的AI革命: artificial-intelligence, user-experience, review
INSERT INTO story_tag_assignments (story_id, tag_id)
SELECT s.id, t.id
FROM stories s, story_tags t
WHERE s.title = '社交媒体的AI革命：从算法推荐到内容审核'
AND t.name IN ('artificial-intelligence', 'user-experience', 'review');

-- 小企业AI应用指南: small-business, automation, tips
INSERT INTO story_tag_assignments (story_id, tag_id)
SELECT s.id, t.id
FROM stories s, story_tags t
WHERE s.title = '小企业AI应用指南：低成本实现智能化升级'
AND t.name IN ('small-business', 'automation', 'tips');

-- 视频生成AI: runway-gen3, luma-ai, ai-video-editing
INSERT INTO story_tag_assignments (story_id, tag_id)
SELECT s.id, t.id
FROM stories s, story_tags t
WHERE s.title = '视频生成AI：创意表达的新边界'
AND t.name IN ('runway-gen3', 'luma-ai', 'ai-video-editing');

-- Update tag usage counts
UPDATE story_tags 
SET usage_count = (
    SELECT COUNT(*) 
    FROM story_tag_assignments 
    WHERE tag_id = story_tags.id
)
WHERE id IN (
    SELECT DISTINCT tag_id 
    FROM story_tag_assignments
);;