-- 初始化故事标签数据
-- 10个推荐标签，涵盖主要的AI和投融资类别

-- 删除已有的测试标签(如果需要)
-- DELETE FROM story_tags WHERE is_active = true;

-- 插入10个推荐标签
INSERT INTO story_tags (name, display_name, color, usage_count, is_active, created_at, updated_at)
VALUES 
  -- AI工具和平台
  ('ai-tools', 'AI Tools Experience', '#4ECDC4', 0, true, NOW(), NOW()),
  ('domestic-ai', 'Domestic AI Tools', '#FF6B6B', 0, true, NOW(), NOW()),
  ('overseas-ai', 'Overseas AI Platforms', '#45B7D1', 0, true, NOW(), NOW()),
  
  -- 投融资
  ('startup-interview', 'Startup Interviews', '#96CEB4', 0, true, NOW(), NOW()),
  ('investment-outlook', 'Investment Outlook', '#FFEAA7', 0, true, NOW(), NOW()),
  
  -- 行业应用
  ('financial-ai', 'Financial AI Applications', '#DDA0DD', 0, true, NOW(), NOW()),
  ('video-generation', 'Video Generation Experience', '#98D8C8', 0, true, NOW(), NOW()),
  
  -- 技术类别
  ('machine-learning', 'Machine Learning', '#FF7675', 0, true, NOW(), NOW()),
  ('deep-learning', 'Deep Learning', '#74B9FF', 0, true, NOW(), NOW()),
  ('nlp', 'Natural Language Processing', '#00B894', 0, true, NOW(), NOW())
ON CONFLICT (name) 
DO UPDATE SET
  display_name = EXCLUDED.display_name,
  color = EXCLUDED.color,
  is_active = EXCLUDED.is_active,
  updated_at = NOW();

-- 验证插入结果
SELECT id, name, display_name, color, usage_count, is_active 
FROM story_tags 
WHERE is_active = true
ORDER BY created_at DESC
LIMIT 15;

-- 显示总数
SELECT COUNT(*) as total_active_tags 
FROM story_tags 
WHERE is_active = true;

