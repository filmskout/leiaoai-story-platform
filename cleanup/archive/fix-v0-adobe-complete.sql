-- 专门修复v0和Adobe项目的完整脚本

BEGIN;

-- 步骤1: 获取正确的公司ID
DO $$
DECLARE
  adobe_company_id UUID;
  vercel_company_id UUID;
  express_company_id UUID;
  firefly_company_id UUID;
  v0_company_id UUID;
BEGIN
  -- 获取Adobe公司ID
  SELECT id INTO adobe_company_id FROM companies WHERE name = 'Adobe' LIMIT 1;
  
  -- 获取Vercel公司ID  
  SELECT id INTO vercel_company_id FROM companies WHERE name = 'Vercel' LIMIT 1;
  
  RAISE NOTICE 'Adobe公司ID: %', adobe_company_id;
  RAISE NOTICE 'Vercel公司ID: %', vercel_company_id;
  
  -- 查找被错误归类的公司
  SELECT id INTO express_company_id FROM companies WHERE name IN ('Adobe Express', 'Express') LIMIT 1;
  SELECT id INTO firefly_company_id FROM companies WHERE name IN ('Adobe Firefly', 'Firefly') LIMIT 1;
  SELECT id INTO v0_company_id FROM companies WHERE name IN ('v0', 'v0 by Vercel') LIMIT 1;
  
  -- ==================== 修复Adobe Express ====================
  IF adobe_company_id IS NOT NULL AND express_company_id IS NOT NULL THEN
    -- 检查是否已经有正确的项目
    IF NOT EXISTS (
      SELECT 1 FROM projects 
      WHERE company_id = adobe_company_id AND name = 'Adobe Express'
    ) THEN
      -- 从错误公司中提取信息并创建正确项目
      INSERT INTO projects (company_id, name, description, website, category)
      SELECT 
        adobe_company_id,
        'Adobe Express',
        COALESCE(description, 'Adobe Express是一款面向社交媒体和营销内容的在线创作工具'),
        COALESCE(website, 'https://www.adobe.com/products/express.html'),
        'AI Application'
      FROM companies
      WHERE id = express_company_id;
      
      RAISE NOTICE '已创建Adobe Express项目';
    ELSE
      RAISE NOTICE 'Adobe Express项目已存在';
    END IF;
    
    -- 删除错误的公司记录（包括相关的fundings和stories）
    DELETE FROM fundings WHERE company_id = express_company_id;
    DELETE FROM stories WHERE company_id = express_company_id;
    DELETE FROM projects WHERE company_id = express_company_id; -- 删除可能的错误项目
    DELETE FROM companies WHERE id = express_company_id;
    
    RAISE NOTICE '已删除错误的Adobe Express公司';
  END IF;
  
  -- ==================== 修复Adobe Firefly ====================
  IF adobe_company_id IS NOT NULL AND firefly_company_id IS NOT NULL THEN
    IF NOT EXISTS (
      SELECT 1 FROM projects 
      WHERE company_id = adobe_company_id AND name = 'Adobe Firefly'
    ) THEN
      INSERT INTO projects (company_id, name, description, website, category)
      SELECT 
        adobe_company_id,
        'Adobe Firefly',
        COALESCE(description, 'Adobe Firefly是Adobe的生成式AI图像工具'),
        COALESCE(website, 'https://www.adobe.com/firefly'),
        'AI Model'
      FROM companies
      WHERE id = firefly_company_id;
      
      RAISE NOTICE '已创建Adobe Firefly项目';
    ELSE
      RAISE NOTICE 'Adobe Firefly项目已存在';
    END IF;
    
    DELETE FROM fundings WHERE company_id = firefly_company_id;
    DELETE FROM stories WHERE company_id = firefly_company_id;
    DELETE FROM projects WHERE company_id = firefly_company_id;
    DELETE FROM companies WHERE id = firefly_company_id;
    
    RAISE NOTICE '已删除错误的Adobe Firefly公司';
  END IF;
  
  -- ==================== 修复v0 ====================
  IF vercel_company_id IS NOT NULL AND v0_company_id IS NOT NULL THEN
    IF NOT EXISTS (
      SELECT 1 FROM projects 
      WHERE company_id = vercel_company_id AND name = 'v0'
    ) THEN
      INSERT INTO projects (company_id, name, description, website, category)
      SELECT 
        vercel_company_id,
        'v0',
        COALESCE(description, 'v0是Vercel的AI代码生成工具'),
        COALESCE(website, 'https://v0.dev'),
        'AI Tool'
      FROM companies
      WHERE id = v0_company_id;
      
      RAISE NOTICE '已创建v0项目';
    ELSE
      RAISE NOTICE 'v0项目已存在';
    END IF;
    
    DELETE FROM fundings WHERE company_id = v0_company_id;
    DELETE FROM stories WHERE company_id = v0_company_id;
    DELETE FROM projects WHERE company_id = v0_company_id;
    DELETE FROM companies WHERE id = v0_company_id;
    
    RAISE NOTICE '已删除错误的v0公司';
  END IF;
  
END $$;

-- 步骤2: 显示修复结果
SELECT '修复后的Adobe项目:' as info, p.name as project_name
FROM projects p
JOIN companies c ON p.company_id = c.id
WHERE c.name = 'Adobe'
ORDER BY p.name;

SELECT '修复后的Vercel项目:' as info, p.name as project_name
FROM projects p
JOIN companies c ON p.company_id = c.id
WHERE c.name = 'Vercel'
ORDER BY p.name;

COMMIT;
