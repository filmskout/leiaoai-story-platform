-- 批量补齐116家公司数据的SQL模板
-- 使用方法：先用LLM深研生成数据，然后替换此处占位符

-- 示例：补齐公司官网、估值、融资等
-- UPDATE companies 
-- SET 
--   website = 'https://www.anthropic.com',
--   description = 'Anthropic致力于构建安全、可控的AI系统，开发了Claude助手。',
--   detailed_description = 'Anthropic是一家专注于AI安全的公司...（400+字详细描述）',
--   valuation = 15000000000,
--   founded_year = 2021,
--   employee_count = '200-500',
--   headquarters = 'San Francisco, USA'
-- WHERE id = '公司ID';

-- 注意：实际执行前需用LLM生成每家公司真实数据并替换占位符

