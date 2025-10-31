-- 手动补齐项目URL - 第一批（常见项目）
-- 在Supabase SQL Editor中执行此脚本

-- =====================================================
-- OpenAI 项目
-- =====================================================
UPDATE projects 
SET website = 'https://chat.openai.com'
WHERE name IN ('ChatGPT', 'ChatGPT API') 
AND company_id = (SELECT id FROM companies WHERE name = 'OpenAI' LIMIT 1);

UPDATE projects 
SET website = 'https://labs.openai.com'
WHERE name = 'Dall-E'
AND company_id = (SELECT id FROM companies WHERE name = 'OpenAI' LIMIT 1);

UPDATE projects 
SET website = 'https://openai.com/research/gpt-4'
WHERE name = 'GPT-4'
AND company_id = (SELECT id FROM companies WHERE name = 'OpenAI' LIMIT 1);

UPDATE projects 
SET website = 'https://openai.com/sora'
WHERE name = 'Sora'
AND company_id = (SELECT id FROM companies WHERE name = 'OpenAI' LIMIT 1);

UPDATE projects 
SET website = 'https://openai.com/codex'
WHERE name = 'Codex'
AND company_id = (SELECT id FROM companies WHERE name = 'OpenAI' LIMIT 1);

-- =====================================================
-- Anthropic 项目
-- =====================================================
UPDATE projects 
SET website = 'https://claude.ai'
WHERE name = 'Claude'
AND company_id = (SELECT id FROM companies WHERE name = 'Anthropic' LIMIT 1);

UPDATE projects 
SET website = 'https://www.anthropic.com/claude'
WHERE name = 'Claude Code'
AND company_id = (SELECT id FROM companies WHERE name = 'Anthropic' LIMIT 1);

-- =====================================================
-- Google 项目
-- =====================================================
UPDATE projects 
SET website = 'https://gemini.google.com'
WHERE name = 'Gemini'
AND company_id = (SELECT id FROM companies WHERE name = 'Google' LIMIT 1);

UPDATE projects 
SET website = 'https://aistudio.google.com'
WHERE name = 'AI Studio'
AND company_id = (SELECT id FROM companies WHERE name = 'Google' LIMIT 1);

UPDATE projects 
SET website = 'https://deepmind.google'
WHERE name = 'Gemini Ultra'
AND company_id = (SELECT id FROM companies WHERE name = 'Google' LIMIT 1);

UPDATE projects 
SET website = 'https://cloud.google.com/vertex-ai'
WHERE name = 'Vertex AI'
AND company_id = (SELECT id FROM companies WHERE name = 'Google' LIMIT 1);

-- =====================================================
-- Microsoft 项目
-- =====================================================
UPDATE projects 
SET website = 'https://copilot.microsoft.com'
WHERE name = 'Copilot'
AND company_id = (SELECT id FROM companies WHERE name = 'Microsoft' LIMIT 1);

UPDATE projects 
SET website = 'https://azure.microsoft.com/products/cognitive-services/openai-service'
WHERE name = 'Azure AI'
AND company_id = (SELECT id FROM companies WHERE name = 'Microsoft' LIMIT 1);

UPDATE projects 
SET website = 'https://powerbi.microsoft.com'
WHERE name = 'Power BI'
AND company_id = (SELECT id FROM companies WHERE name = 'Microsoft' LIMIT 1);

-- =====================================================
-- Adobe 项目
-- =====================================================
UPDATE projects 
SET website = 'https://www.adobe.com/products/firefly.html'
WHERE name = 'Adobe Firefly'
AND company_id = (SELECT id FROM companies WHERE name = 'Adobe' LIMIT 1);

UPDATE projects 
SET website = 'https://www.adobe.com/products/express.html'
WHERE name = 'Adobe Express'
AND company_id = (SELECT id FROM companies WHERE name = 'Adobe' LIMIT 1);

-- =====================================================
-- Vercel 项目
-- =====================================================
UPDATE projects 
SET website = 'https://v0.dev'
WHERE name = 'v0'
AND company_id = (SELECT id FROM companies WHERE name = 'Vercel' LIMIT 1);

-- =====================================================
-- 其他常见项目
-- =====================================================
UPDATE projects 
SET website = 'https://www.grammarly.com'
WHERE name = 'Grammarly'
AND company_id = (SELECT id FROM companies WHERE name = 'Grammarly' LIMIT 1);

UPDATE projects 
SET website = 'https://www.figma.com'
WHERE name = 'Figma AI'
AND company_id = (SELECT id FROM companies WHERE name = 'Figma' LIMIT 1);

UPDATE projects 
SET website = 'https://www.notion.so'
WHERE name = 'Notion AI'
AND company_id = (SELECT id FROM companies WHERE name = 'Notion' LIMIT 1);

UPDATE projects 
SET website = 'https://www.codeium.com'
WHERE name = 'Codeium'
AND company_id = (SELECT id FROM companies WHERE name = 'Codeium' LIMIT 1);

UPDATE projects 
SET website = 'https://www.tabnine.com'
WHERE name = 'Tabnine'
AND company_id = (SELECT id FROM companies WHERE name = 'Tabnine' LIMIT 1);

-- =====================================================
-- 视频/AI工具
-- =====================================================
UPDATE projects 
SET website = 'https://www.remove.bg'
WHERE name = 'Remove.bg'
AND company_id = (SELECT id FROM companies WHERE name = 'Remove.bg' LIMIT 1);

UPDATE projects 
SET website = 'https://www.canva.com'
WHERE name = 'Canva Magic Studio'
AND company_id = (SELECT id FROM companies WHERE name = 'Canva' LIMIT 1);

UPDATE projects 
SET website = 'https://www.capcut.com'
WHERE name = 'CapCut'
AND company_id = (SELECT id FROM companies WHERE name = 'ByteDance' LIMIT 1);

UPDATE projects 
SET website = 'https://ottr.ai'
WHERE name = 'Otter.ai'
AND company_id = (SELECT id FROM companies WHERE name = 'Otter.ai' LIMIT 1);

-- =====================================================
-- 查看更新结果
-- =====================================================
SELECT 
    p.name AS project_name,
    c.name AS company_name,
    p.website
FROM projects p
INNER JOIN companies c ON p.company_id = c.id
WHERE p.website IS NOT NULL
ORDER BY c.name, p.name;

