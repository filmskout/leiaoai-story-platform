-- 将Tier 1/2重命名为Giant/Unicorn
-- 在Supabase SQL Editor中执行

-- 更新 company_tier 字段
UPDATE companies 
SET company_tier = 'Giant' 
WHERE company_tier = 'Tier 1';

UPDATE companies 
SET company_tier = 'Unicorn' 
WHERE company_tier = 'Tier 2';

-- 查看更新结果
SELECT 
    company_tier,
    COUNT(*) as count
FROM companies
GROUP BY company_tier
ORDER BY company_tier;

-- 显示所有公司和它们的tier
SELECT 
    name,
    company_tier,
    valuation,
    headquarters
FROM companies
ORDER BY company_tier, name;

