-- 修复Google的重复项目并补齐缺失项目
-- Gemini, AI Studio, Veo3, Nano Banana, Vertex AI

BEGIN;

-- 1. 检查当前的Google项目
SELECT '=== 当前Google项目 ===' as info, id, name, description, category
FROM projects
WHERE company_id IN (SELECT id FROM companies WHERE name = 'Google DeepMind')
ORDER BY name;

-- 2. 删除重复的Gemini和AI Studio（保留最早的）
DELETE FROM projects 
WHERE id IN (
  SELECT id FROM (
    SELECT id, name,
      ROW_NUMBER() OVER (PARTITION BY name ORDER BY created_at) as rn
    FROM projects
    WHERE name IN ('Gemini', 'AI Studio')
      AND company_id IN (SELECT id FROM companies WHERE name = 'Google DeepMind')
  ) ranked
  WHERE rn > 1
);

-- 3. 更新Bard为Gemini Assist（Bard已更名为Gemini）
UPDATE projects
SET name = 'Gemini Assist',
    description = 'Gemini Assist是Google的AI助手，基于Gemini模型，集成到Google搜索、邮箱和文档服务中。',
    website = 'https://gemini.google.com'
WHERE name = 'Bard'
  AND company_id IN (SELECT id FROM companies WHERE name = 'Google DeepMind');

-- 4. 补齐Google的关键项目
INSERT INTO projects (company_id, name, description, website, category)
SELECT 
  c.id,
  'Gemini',
  'Gemini是Google的多模态大语言模型，支持文本、图像、音频和视频输入，提供强大的推理和生成能力。',
  'https://deepmind.google/technologies/gemini/',
  'AI Model'
FROM companies c
WHERE c.name = 'Google DeepMind'
  AND NOT EXISTS (SELECT 1 FROM projects WHERE company_id = c.id AND name = 'Gemini');

INSERT INTO projects (company_id, name, description, website, category)
SELECT 
  c.id,
  'Veo3',
  'Veo3是Google的视频生成模型，可以根据文本描述生成高质量视频，支持复杂的场景和动作。',
  'https://deepmind.google/veo',
  'AI Model'
FROM companies c
WHERE c.name = 'Google DeepMind'
  AND NOT EXISTS (SELECT 1 FROM projects WHERE company_id = c.id AND name = 'Veo3');

INSERT INTO projects (company_id, name, description, website, category)
SELECT 
  c.id,
  'Nano Banana',
  'Nano Banana是Google的小型语言模型，专为移动设备和边缘计算优化，提供高效的本地AI能力。',
  'https://ai.google.dev',
  'AI Model'
FROM companies c
WHERE c.name = 'Google DeepMind'
  AND NOT EXISTS (SELECT 1 FROM projects WHERE company_id = c.id AND name = 'Nano Banana');

INSERT INTO projects (company_id, name, description, website, category)
SELECT 
  c.id,
  'Vertex AI',
  'Vertex AI是Google的机器学习平台，提供模型训练、部署和监控工具，支持端到端的ML工作流。',
  'https://cloud.google.com/vertex-ai',
  'AI Platform'
FROM companies c
WHERE c.name = 'Google DeepMind'
  AND NOT EXISTS (SELECT 1 FROM projects WHERE company_id = c.id AND name = 'Vertex AI');

-- 5. 如果AI Studio不存在，添加它
INSERT INTO projects (company_id, name, description, website, category)
SELECT 
  c.id,
  'AI Studio',
  'AI Studio是Google的AI开发平台，提供模型训练、实验管理和部署工具，支持研究和应用开发。',
  'https://aistudio.google.com',
  'AI Platform'
FROM companies c
WHERE c.name = 'Google DeepMind'
  AND NOT EXISTS (SELECT 1 FROM projects WHERE company_id = c.id AND name = 'AI Studio');

-- 6. 显示修复后的结果
SELECT '=== 修复后的Google项目 ===' as info, 
  id, name, description, category, website
FROM projects
WHERE company_id IN (SELECT id FROM companies WHERE name = 'Google DeepMind')
ORDER BY 
  CASE name
    WHEN 'Gemini' THEN 1
    WHEN 'Gemini Assist' THEN 2
    WHEN 'Veo3' THEN 3
    WHEN 'Nano Banana' THEN 4
    WHEN 'Vertex AI' THEN 5
    WHEN 'AI Studio' THEN 6
    ELSE 7
  END;

COMMIT;
