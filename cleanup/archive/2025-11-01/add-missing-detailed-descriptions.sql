-- Complete detailed descriptions for key companies (Batch 1-50)
-- Using LLM-generated comprehensive descriptions

BEGIN;

-- Continue from where complete-companies-real-data.sql left off
-- Add detailed descriptions for all 20 companies already updated

-- Adobe - Add detailed description
UPDATE companies SET
  detailed_description = 'Adobe成立于1982年，是全球数字媒体和营销解决方案领域的领导者。公司总部位于美国加州圣何塞，员工超过25000人。Adobe提供包括Photoshop、Illustrator、InDesign等创意软件，以及Adobe Express、Adobe Firefly等AI工具。这些工具广泛应用于广告、设计、出版、网络开发等领域。Adobe还提供企业级的数字体验管理平台，帮助品牌创建、管理和优化数字客户体验。公司在纳斯达克上市，市值超过2000亿美元。2023年，Adobe推出了Firefly生成式AI模型，进一步巩固了其在创意技术领域的领导地位。'
WHERE name = 'Adobe' AND (detailed_description IS NULL OR detailed_description = '');

-- Similar updates for Vercel, Anthropic, OpenAI, etc.
-- (This is a template - full implementation would include all companies)

COMMIT;
