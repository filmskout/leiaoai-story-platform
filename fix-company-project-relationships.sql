-- 修复公司-项目关系
-- 将被错误归类为"公司"的项目转换为父公司的"项目"

-- 步骤1: 找到被错误归类为公司的项目
DO $$
DECLARE
  adobe_id INTEGER;
  vercel_id INTEGER;
  wrong_company_id INTEGER;
  new_project_id INTEGER;
BEGIN
  -- 获取Adobe和Vercel的正确公司ID
  SELECT id INTO adobe_id FROM companies WHERE name = 'Adobe' LIMIT 1;
  SELECT id INTO vercel_id FROM companies WHERE name = 'Vercel' LIMIT 1;
  
  -- ========================================
  -- 修复Adobe相关项目
  -- ========================================
  IF adobe_id IS NOT NULL THEN
    
    -- 处理Adobe Express
    FOR wrong_company_id IN 
      SELECT id FROM companies WHERE name = 'Adobe Express' OR name = 'Express'
    LOOP
      -- 如果还没有对应的project，创建一个
      SELECT id INTO new_project_id FROM projects 
      WHERE company_id = adobe_id AND name = 'Adobe Express' LIMIT 1;
      
      IF new_project_id IS NULL THEN
        INSERT INTO projects (company_id, name, description, website, category)
        SELECT adobe_id, 'Adobe Express', description, website, category
        FROM companies
        WHERE id = wrong_company_id
        ON CONFLICT DO NOTHING;
      END IF;
      
      -- 删除错误分类为公司
      DELETE FROM companies WHERE id = wrong_company_id;
      
      RAISE NOTICE '已将Adobe Express从公司转换为项目';
    END LOOP;
    
    -- 处理Adobe Firefly
    FOR wrong_company_id IN 
      SELECT id FROM companies WHERE name = 'Adobe Firefly' OR name = 'Firefly'
    LOOP
      SELECT id INTO new_project_id FROM projects 
      WHERE company_id = adobe_id AND name = 'Adobe Firefly' LIMIT 1;
      
      IF new_project_id IS NULL THEN
        INSERT INTO projects (company_id, name, description, website, category)
        SELECT adobe_id, 'Adobe Firefly', description, website, category
        FROM companies
        WHERE id = wrong_company_id
        ON CONFLICT DO NOTHING;
      END IF;
      
      DELETE FROM companies WHERE id = wrong_company_id;
      
      RAISE NOTICE '已将Adobe Firefly从公司转换为项目';
    END LOOP;
    
  END IF;
  
  -- ========================================
  -- 修复Vercel相关项目
  -- ========================================
  IF vercel_id IS NOT NULL THEN
    
    -- 处理v0
    FOR wrong_company_id IN 
      SELECT id FROM companies WHERE name = 'v0' OR name = 'v0 by Vercel'
    LOOP
      SELECT id INTO new_project_id FROM projects 
      WHERE company_id = vercel_id AND name = 'v0' LIMIT 1;
      
      IF new_project_id IS NULL THEN
        INSERT INTO projects (company_id, name, description, website, category)
        SELECT vercel_id, 'v0', description, website, category
        FROM companies
        WHERE id = wrong_company_id
        ON CONFLICT DO NOTHING;
      END IF;
      
      DELETE FROM companies WHERE id = wrong_company_id;
      
      RAISE NOTICE '已将v0从公司转换为项目';
    END LOOP;
    
  END IF;
  
END $$;

-- 步骤2: 显示修复结果
SELECT '修复后的Adobe公司项目:' as info, p.name as project
FROM projects p
JOIN companies c ON p.company_id = c.id
WHERE c.name = 'Adobe'
ORDER BY p.name;

SELECT '修复后的Vercel公司项目:' as info, p.name as project
FROM projects p
JOIN companies c ON p.company_id = c.id
WHERE c.name = 'Vercel'
ORDER BY p.name;

-- 步骤3: 检查是否还有错误的公司
SELECT '残留的错误的公司:' as info, name, description
FROM companies
WHERE name IN ('Adobe Express', 'Adobe Firefly', 'Firefly', 'Express', 'v0', 'v0 by Vercel')
ORDER BY name;
