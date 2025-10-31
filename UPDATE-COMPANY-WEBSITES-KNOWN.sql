-- Batch update known, verified company websites (safe idempotent)
BEGIN;

-- Giants & major players
UPDATE companies SET website = 'https://openai.com'     WHERE (website IS NULL OR website = '') AND name ILIKE 'OpenAI%';
UPDATE companies SET website = 'https://about.google'   WHERE (website IS NULL OR website = '') AND name ILIKE 'Google%';
UPDATE companies SET website = 'https://deepmind.google' WHERE (website IS NULL OR website = '') AND (name ILIKE 'Google DeepMind%' OR name ILIKE 'DeepMind%');
UPDATE companies SET website = 'https://microsoft.com'  WHERE (website IS NULL OR website = '') AND name ILIKE 'Microsoft%';
UPDATE companies SET website = 'https://about.meta.com' WHERE (website IS NULL OR website = '') AND (name ILIKE 'Meta%' OR name ILIKE 'Facebook%');
UPDATE companies SET website = 'https://amazon.com'     WHERE (website IS NULL OR website = '') AND name ILIKE 'Amazon%';
UPDATE companies SET website = 'https://aws.amazon.com' WHERE (website IS NULL OR website = '') AND name ILIKE 'AWS%';
UPDATE companies SET website = 'https://apple.com'      WHERE (website IS NULL OR website = '') AND name ILIKE 'Apple%';
UPDATE companies SET website = 'https://bytedance.com'  WHERE (website IS NULL OR website = '') AND (name ILIKE 'ByteDance%' OR name ILIKE 'TikTok%');
UPDATE companies SET website = 'https://www.baidu.com'  WHERE (website IS NULL OR website = '') AND name ILIKE 'Baidu%';
UPDATE companies SET website = 'https://www.tencent.com' WHERE (website IS NULL OR website = '') AND name ILIKE 'Tencent%';
UPDATE companies SET website = 'https://www.alibaba.com' WHERE (website IS NULL OR website = '') AND name ILIKE 'Alibaba%';
UPDATE companies SET website = 'https://www.alibabacloud.com' WHERE (website IS NULL OR website = '') AND name ILIKE 'Aliyun%';
UPDATE companies SET website = 'https://www.nvidia.com' WHERE (website IS NULL OR website = '') AND name ILIKE 'NVIDIA%';
UPDATE companies SET website = 'https://www.tesla.com'  WHERE (website IS NULL OR website = '') AND name ILIKE 'Tesla%';
UPDATE companies SET website = 'https://x.ai'           WHERE (website IS NULL OR website = '') AND name ILIKE 'xAI%';

-- Unicorns & strong independents
UPDATE companies SET website = 'https://www.adobe.com'  WHERE (website IS NULL OR website = '') AND name ILIKE 'Adobe%';
UPDATE companies SET website = 'https://www.anthropic.com' WHERE (website IS NULL OR website = '') AND name ILIKE 'Anthropic%';
UPDATE companies SET website = 'https://stability.ai'   WHERE (website IS NULL OR website = '') AND name ILIKE 'Stability AI%';
UPDATE companies SET website = 'https://www.midjourney.com' WHERE (website IS NULL OR website = '') AND name ILIKE 'Midjourney%';
UPDATE companies SET website = 'https://cohere.com'     WHERE (website IS NULL OR website = '') AND name ILIKE 'Cohere%';
UPDATE companies SET website = 'https://www.perplexity.ai' WHERE (website IS NULL OR website = '') AND name ILIKE 'Perplexity%';
UPDATE companies SET website = 'https://runwayml.com'   WHERE (website IS NULL OR website = '') AND name ILIKE 'Runway%';
UPDATE companies SET website = 'https://character.ai'   WHERE (website IS NULL OR website = '') AND name ILIKE 'Character.AI%';
UPDATE companies SET website = 'https://www.notion.so'  WHERE (website IS NULL OR website = '') AND name ILIKE 'Notion%';
UPDATE companies SET website = 'https://www.grammarly.com' WHERE (website IS NULL OR website = '') AND name ILIKE 'Grammarly%';
UPDATE companies SET website = 'https://huggingface.co' WHERE (website IS NULL OR website = '') AND name ILIKE 'Hugging Face%';
UPDATE companies SET website = 'https://scale.com'      WHERE (website IS NULL OR website = '') AND name ILIKE 'Scale AI%';
UPDATE companies SET website = 'https://replit.com'     WHERE (website IS NULL OR website = '') AND name ILIKE 'Replit%';
UPDATE companies SET website = 'https://mistral.ai'     WHERE (website IS NULL OR website = '') AND (name ILIKE 'Mistral%' OR name ILIKE 'Mistral AI%');
UPDATE companies SET website = 'https://www.uipath.com' WHERE (website IS NULL OR website = '') AND name ILIKE 'UiPath%';
UPDATE companies SET website = 'https://www.databricks.com' WHERE (website IS NULL OR website = '') AND name ILIKE 'Databricks%';
UPDATE companies SET website = 'https://www.servicenow.com' WHERE (website IS NULL OR website = '') AND name ILIKE 'ServiceNow%';
UPDATE companies SET website = 'https://www.ibm.com'    WHERE (website IS NULL OR website = '') AND name ILIKE 'IBM%';
UPDATE companies SET website = 'https://cloud.google.com/vertex-ai' WHERE (website IS NULL OR website = '') AND name ILIKE 'Vertex AI%';
UPDATE companies SET website = 'https://ai.facebook.com' WHERE (website IS NULL OR website = '') AND name ILIKE 'Facebook AI%';
UPDATE companies SET website = 'https://research.google' WHERE (website IS NULL OR website = '') AND name ILIKE 'Google Research%';
UPDATE companies SET website = 'https://openxlab.org'   WHERE (website IS NULL OR website = '') AND name ILIKE 'OpenXLab%';
UPDATE companies SET website = 'https://co-pilot.github.com' WHERE (website IS NULL OR website = '') AND name ILIKE 'GitHub Copilot%';
UPDATE companies SET website = 'https://www.salesforce.com' WHERE (website IS NULL OR website = '') AND name ILIKE 'Salesforce%';
UPDATE companies SET website = 'https://openrouter.ai'  WHERE (website IS NULL OR website = '') AND name ILIKE 'OpenRouter%';
UPDATE companies SET website = 'https://www.oracle.com' WHERE (website IS NULL OR website = '') AND name ILIKE 'Oracle%';
UPDATE companies SET website = 'https://www.sap.com'    WHERE (website IS NULL OR website = '') AND name ILIKE 'SAP%';
UPDATE companies SET website = 'https://cloud.tencent.com' WHERE (website IS NULL OR website = '') AND name ILIKE 'Tencent Cloud%';
UPDATE companies SET website = 'https://intl.cloud.tencent.com/zh-cn/products/tia' WHERE (website IS NULL OR website = '') AND name ILIKE 'Tencent AI Lab%';
UPDATE companies SET website = 'https://www.alibabacloud.com/solutions/ai' WHERE (website IS NULL OR website = '') AND name ILIKE 'Alibaba Cloud AI%';
UPDATE companies SET website = 'https://ai.baidu.com'   WHERE (website IS NULL OR website = '') AND name ILIKE 'Baidu AI%';

COMMIT;

-- Verification (run separately)
-- SELECT COUNT(*) FROM companies WHERE website IS NULL OR website = '';
-- SELECT name, website FROM companies WHERE website IS NULL OR website = '' ORDER BY name;
