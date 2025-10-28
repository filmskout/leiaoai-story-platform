-- 统计缺失 founded_year/headquarters 的公司
SELECT 
  COUNT(*) AS total,
  COUNT(founded_year) AS with_founded_year,
  COUNT(headquarters) AS with_headquarters,
  COUNT(*) - COUNT(founded_year) AS missing_founded_year,
  COUNT(*) - COUNT(headquarters) AS missing_headquarters
FROM companies;

-- 按 tier 分组统计
SELECT 
  COALESCE(company_tier, 'Unknown') AS tier,
  COUNT(*) AS total,
  COUNT(founded_year) AS with_founded_year,
  COUNT(headquarters) AS with_headquarters
FROM companies
GROUP BY tier
ORDER BY tier;

-- 列出缺失 founded_year 的公司
SELECT id, name, headquarters, company_tier
FROM companies
WHERE founded_year IS NULL
ORDER BY company_tier, name;

-- 列出缺失 headquarters 的公司
SELECT id, name, founded_year, company_tier
FROM companies
WHERE headquarters IS NULL OR TRIM(headquarters) = ''
ORDER BY company_tier, name;
