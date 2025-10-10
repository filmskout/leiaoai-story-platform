-- 设置预设标签并更新示例故事
-- 注意：请在Supabase SQL Editor中运行此脚本

-- 1. 创建预设标签（如果不存在）
INSERT INTO tags (name, display_name, color, usage_count, is_active, created_at, updated_at)
VALUES 
  ('ai_investment', 'AI投资', '#3B82F6', 0, true, NOW(), NOW()),
  ('startup', '创业', '#10B981', 0, true, NOW(), NOW()),
  ('finance', '金融', '#F59E0B', 0, true, NOW(), NOW()),
  ('technology', '技术', '#8B5CF6', 0, true, NOW(), NOW()),
  ('innovation', '创新', '#EC4899', 0, true, NOW(), NOW()),
  ('business_model', '商业模式', '#6366F1', 0, true, NOW(), NOW()),
  ('fundraising', '融资', '#EF4444', 0, true, NOW(), NOW()),
  ('ai_tools', 'AI工具', '#06B6D4', 0, true, NOW(), NOW()),
  ('success_story', '成功案例', '#14B8A6', 0, true, NOW(), NOW()),
  ('market_analysis', '市场分析', '#F97316', 0, true, NOW(), NOW())
ON CONFLICT (name) 
DO UPDATE SET
  display_name = EXCLUDED.display_name,
  color = EXCLUDED.color,
  is_active = true,
  updated_at = NOW();

-- 2. 获取Admin用户ID（LeiaoAI Agent）
DO $$
DECLARE
  admin_id UUID := '8e19098b-ac2a-4ae0-b063-1e21a8dea19d';
  story1_id UUID;
  story2_id UUID;
  story3_id UUID;
  tag_ai_investment UUID;
  tag_startup UUID;
  tag_finance UUID;
  tag_technology UUID;
  tag_innovation UUID;
  tag_business_model UUID;
  tag_fundraising UUID;
  tag_ai_tools UUID;
  tag_success_story UUID;
  tag_market_analysis UUID;
BEGIN
  -- 获取标签ID
  SELECT id INTO tag_ai_investment FROM tags WHERE name = 'ai_investment';
  SELECT id INTO tag_startup FROM tags WHERE name = 'startup';
  SELECT id INTO tag_finance FROM tags WHERE name = 'finance';
  SELECT id INTO tag_technology FROM tags WHERE name = 'technology';
  SELECT id INTO tag_innovation FROM tags WHERE name = 'innovation';
  SELECT id INTO tag_business_model FROM tags WHERE name = 'business_model';
  SELECT id INTO tag_fundraising FROM tags WHERE name = 'fundraising';
  SELECT id INTO tag_ai_tools FROM tags WHERE name = 'ai_tools';
  SELECT id INTO tag_success_story FROM tags WHERE name = 'success_story';
  SELECT id INTO tag_market_analysis FROM tags WHERE name = 'market_analysis';

  -- 3. 创建或更新示例故事1：AI投资趋势分析
  INSERT INTO stories (
    id,
    title,
    content,
    excerpt,
    author,
    category,
    status,
    is_public,
    featured_image_url,
    view_count,
    like_count,
    comment_count,
    created_at,
    updated_at
  )
  VALUES (
    'c1e1f1a1-b1c1-41d1-a1e1-f1a1b1c1d1e1'::UUID,
    'AI驱动的投资决策：2024年趋势分析',
    E'在2024年，人工智能已经成为投资领域的重要工具。本文深入分析了AI如何改变传统投资决策流程，以及投资者应如何适应这一变革。\n\n## 主要趋势\n\n1. **算法交易的普及化**：机器学习算法现在能够处理更复杂的市场数据，为投资者提供实时洞察。\n\n2. **风险评估自动化**：AI模型可以快速分析数千个变量，提供更准确的风险评估。\n\n3. **个性化投资建议**：基于用户行为和偏好的AI推荐系统正在重塑投资咨询行业。\n\n## 实践案例\n\n许多对冲基金已经采用AI驱动的策略，取得了显著成果。例如，某知名基金利用深度学习模型预测市场趋势，年化收益率提升了15%。\n\n## 未来展望\n\n随着技术的不断进步，AI将在投资决策中扮演更重要的角色。投资者需要拥抱这一变革，同时保持谨慎和理性。',
    'AI正在重塑投资决策流程。了解2024年AI投资的最新趋势，把握投资机遇。',
    admin_id,
    'investment_outlook',
    'published',
    true,
    '/story-images/finance-ai-1.png',
    1250,
    89,
    23,
    NOW() - INTERVAL '5 days',
    NOW() - INTERVAL '2 days'
  )
  ON CONFLICT (id) 
  DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    excerpt = EXCLUDED.excerpt,
    updated_at = EXCLUDED.updated_at;

  story1_id := 'c1e1f1a1-b1c1-41d1-a1e1-f1a1b1c1d1e1'::UUID;

  -- 为故事1添加标签
  DELETE FROM story_tags WHERE story_id = story1_id;
  INSERT INTO story_tags (story_id, tag_id) VALUES
    (story1_id, tag_ai_investment),
    (story1_id, tag_finance),
    (story1_id, tag_technology),
    (story1_id, tag_market_analysis);

  -- 4. 创建或更新示例故事2：创业公司融资指南
  INSERT INTO stories (
    id,
    title,
    content,
    excerpt,
    author,
    category,
    status,
    is_public,
    featured_image_url,
    view_count,
    like_count,
    comment_count,
    created_at,
    updated_at
  )
  VALUES (
    'c2e2f2a2-b2c2-42d2-a2e2-f2a2b2c2d2e2'::UUID,
    '从零到一：创业公司如何成功获得首轮融资',
    E'对于许多创业者来说，获得首轮融资是一个关键的里程碑。本文分享实用的融资策略和注意事项。\n\n## 准备阶段\n\n1. **完善商业计划书**：确保你的BP清晰地阐述问题、解决方案和市场机会。\n\n2. **打造MVP**：最小可行产品可以帮助你验证商业模式，增强投资者信心。\n\n3. **组建强大团队**：投资人投的不仅是项目，更是团队。\n\n## 融资策略\n\n- **精准定位投资人**：研究投资人的投资偏好和成功案例\n- **讲好故事**：用数据和故事打动投资人\n- **估值合理**：过高或过低的估值都可能导致融资失败\n\n## 注意事项\n\n融资不仅是获得资金，更是找到合适的合作伙伴。选择与你理念一致的投资人，才能走得更远。',
    '创业公司如何成功获得首轮融资？实用策略和避坑指南全解析。',
    admin_id,
    'startup_interview',
    'published',
    true,
    '/story-images/startup-ai-1.png',
    2100,
    156,
    45,
    NOW() - INTERVAL '3 days',
    NOW() - INTERVAL '1 day'
  )
  ON CONFLICT (id) 
  DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    excerpt = EXCLUDED.excerpt,
    updated_at = EXCLUDED.updated_at;

  story2_id := 'c2e2f2a2-b2c2-42d2-a2e2-f2a2b2c2d2e2'::UUID;

  -- 为故事2添加标签
  DELETE FROM story_tags WHERE story_id = story2_id;
  INSERT INTO story_tags (story_id, tag_id) VALUES
    (story2_id, tag_startup),
    (story2_id, tag_fundraising),
    (story2_id, tag_business_model),
    (story2_id, tag_innovation);

  -- 5. 创建或更新示例故事3：AI工具实战体验
  INSERT INTO stories (
    id,
    title,
    content,
    excerpt,
    author,
    category,
    status,
    is_public,
    featured_image_url,
    view_count,
    like_count,
    comment_count,
    created_at,
    updated_at
  )
  VALUES (
    'c3e3f3a3-b3c3-43d3-a3e3-f3a3b3c3d3e3'::UUID,
    'ChatGPT在商业分析中的实战应用：效率提升300%',
    E'作为一名投资分析师，我在工作中大量使用ChatGPT来提升分析效率。以下是我的实战经验分享。\n\n## 应用场景\n\n### 1. 行业研究\nChatGPT可以快速整理行业报告，提取关键信息，节省了我70%的时间。\n\n### 2. 财务分析\n使用ChatGPT分析财报数据，自动生成分析报告，准确度超过90%。\n\n### 3. 投资备忘录撰写\nAI辅助撰写投资备忘录，提高了文档质量和一致性。\n\n## 实际效果\n\n引入AI工具后，我的工作效率提升了300%，能够同时分析更多项目，做出更明智的投资决策。\n\n## 最佳实践\n\n1. **明确提示词**：清晰的指令能获得更好的结果\n2. **人工审核**：AI生成的内容需要人工验证\n3. **持续学习**：了解AI的局限性和优势\n\n## 结语\n\nAI不是要取代分析师，而是让我们成为更好的分析师。拥抱AI，就是拥抱未来。',
    'ChatGPT如何帮助投资分析师提升300%工作效率？实战经验全分享。',
    admin_id,
    'ai_tools',
    'published',
    true,
    '/story-images/business-ai-1.png',
    3500,
    234,
    67,
    NOW() - INTERVAL '1 day',
    NOW()
  )
  ON CONFLICT (id) 
  DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    excerpt = EXCLUDED.excerpt,
    updated_at = EXCLUDED.updated_at;

  story3_id := 'c3e3f3a3-b3c3-43d3-a3e3-f3a3b3c3d3e3'::UUID;

  -- 为故事3添加标签
  DELETE FROM story_tags WHERE story_id = story3_id;
  INSERT INTO story_tags (story_id, tag_id) VALUES
    (story3_id, tag_ai_tools),
    (story3_id, tag_technology),
    (story3_id, tag_success_story),
    (story3_id, tag_ai_investment);

  -- 6. 更新标签使用次数
  UPDATE tags SET usage_count = (
    SELECT COUNT(*) FROM story_tags WHERE tag_id = tags.id
  );

  RAISE NOTICE '示例故事和标签设置完成！';
END $$;

-- 7. 验证结果
SELECT 
  s.id,
  s.title,
  s.category,
  s.view_count,
  s.like_count,
  ARRAY_AGG(t.display_name ORDER BY t.display_name) as tags
FROM stories s
LEFT JOIN story_tags st ON s.id = st.story_id
LEFT JOIN tags t ON st.tag_id = t.id
WHERE s.author = '8e19098b-ac2a-4ae0-b063-1e21a8dea19d'::UUID
  AND s.status = 'published'
GROUP BY s.id, s.title, s.category, s.view_count, s.like_count
ORDER BY s.created_at DESC
LIMIT 5;

-- 8. 查看所有预设标签
SELECT 
  name,
  display_name,
  color,
  usage_count,
  is_active
FROM tags
WHERE is_active = true
ORDER BY usage_count DESC, name;

