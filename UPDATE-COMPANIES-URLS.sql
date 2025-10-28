-- 公司URL补齐SQL脚本
-- 在Supabase SQL Editor中执行此脚本

UPDATE companies SET website = 'https://openai.com' WHERE name = 'OpenAI';
UPDATE companies SET website = 'https://www.google.com' WHERE name = 'Google';
UPDATE companies SET website = 'https://www.microsoft.com' WHERE name = 'Microsoft';
UPDATE companies SET website = 'https://about.meta.com' WHERE name = 'Meta';
UPDATE companies SET website = 'https://x.ai' WHERE name = 'xAI';
UPDATE companies SET website = 'https://www.anthropic.com' WHERE name = 'Anthropic';
UPDATE companies SET website = 'https://www.baidu.com' WHERE name = 'Baidu';
UPDATE companies SET website = 'https://www.tencent.com' WHERE name = 'Tencent';
UPDATE companies SET website = 'https://www.bytedance.com' WHERE name = 'ByteDance';
UPDATE companies SET website = 'https://www.alibaba.com' WHERE name = 'Alibaba';
UPDATE companies SET website = 'https://www.adobe.com' WHERE name = 'Adobe';
UPDATE companies SET website = 'https://vercel.com' WHERE name = 'Vercel';
UPDATE companies SET website = 'https://stability.ai' WHERE name = 'Stability AI';
UPDATE companies SET website = 'https://www.midjourney.com' WHERE name = 'Midjourney';
UPDATE companies SET website = 'https://character.ai' WHERE name = 'Character.AI';
UPDATE companies SET website = 'https://www.notion.so' WHERE name = 'Notion';
UPDATE companies SET website = 'https://replit.com' WHERE name = 'Replit';
UPDATE companies SET website = 'https://scale.ai' WHERE name = 'Scale AI';
UPDATE companies SET website = 'https://huggingface.co' WHERE name = 'Hugging Face';
UPDATE companies SET website = 'https://runwayml.com' WHERE name = 'Runway';
UPDATE companies SET website = 'https://www.jasper.ai' WHERE name = 'Jasper';
UPDATE companies SET website = 'https://www.copy.ai' WHERE name = 'Copy.ai';
UPDATE companies SET website = 'https://www.grammarly.com' WHERE name = 'Grammarly';
UPDATE companies SET website = 'https://www.canva.com' WHERE name = 'Canva';
UPDATE companies SET website = 'https://www.figma.com' WHERE name = 'Figma';
UPDATE companies SET website = 'https://www.codeium.com' WHERE name = 'Codeium';
UPDATE companies SET website = 'https://www.tabnine.com' WHERE name = 'Tabnine';
UPDATE companies SET website = 'https://www.deepseek.com' WHERE name = 'DeepSeek';
UPDATE companies SET website = 'https://www.minimax.chat' WHERE name = 'Minimax';
UPDATE companies SET website = 'https://www.synthesia.io' WHERE name = 'Synthesia';
UPDATE companies SET website = 'https://www.heygen.com' WHERE name = 'HeyGen';
UPDATE companies SET website = 'https://invideo.io' WHERE name = 'InVideo';
UPDATE companies SET website = 'https://lumalabs.ai' WHERE name = 'Luma AI';
UPDATE companies SET website = 'https://www.capcut.com' WHERE name = 'CapCut';
UPDATE companies SET website = 'https://www.descript.com' WHERE name = 'Descript';
UPDATE companies SET website = 'https://otter.ai' WHERE name = 'Otter.ai';
UPDATE companies SET website = 'https://www.rev.com' WHERE name = 'Rev.com';
UPDATE companies SET website = 'https://www.jasper.ai' WHERE name = 'Jasper AI';
UPDATE companies SET website = 'https://writesonic.com' WHERE name = 'Writesonic';
UPDATE companies SET website = 'https://rytr.me' WHERE name = 'Rytr';
UPDATE companies SET website = 'https://www.conversion.ai' WHERE name = 'Conversion.ai';
UPDATE companies SET website = 'https://leonardo.ai' WHERE name = 'Leonardo.AI';
UPDATE companies SET website = 'https://playgroundai.com' WHERE name = 'Playground AI';
UPDATE companies SET website = 'https://www.imagine.art' WHERE name = 'Imagine AI';
UPDATE companies SET website = 'https://openai.com/dall-e' WHERE name = 'DALL-E';
UPDATE companies SET website = 'https://www.krea.ai' WHERE name = 'Krea AI';
UPDATE companies SET website = 'https://www.remove.bg' WHERE name = 'Remove.bg';
UPDATE companies SET website = 'https://www.rodin.ai' WHERE name = 'Rodin';
UPDATE companies SET website = 'https://www.hopper.com' WHERE name = 'Hopper';
UPDATE companies SET website = 'https://github.com/features/copilot' WHERE name = 'GitHub Copilot';
UPDATE companies SET website = 'https://aws.amazon.com/codewhisperer' WHERE name = 'Amazon CodeWhisperer';
UPDATE companies SET website = 'https://about.sourcegraph.com/cody' WHERE name = 'Sourcegraph Cody';
UPDATE companies SET website = 'https://www.aiva.ai' WHERE name = 'AIVA';
UPDATE companies SET website = 'https://ampermusic.com' WHERE name = 'Amper Music';
UPDATE companies SET website = 'https://boomy.com' WHERE name = 'Boomy';
UPDATE companies SET website = 'https://www.darktrace.com' WHERE name = 'Darktrace';
UPDATE companies SET website = 'https://snyk.io' WHERE name = 'Snyk';
UPDATE companies SET website = 'https://you.com' WHERE name = 'You.com';
UPDATE companies SET website = 'https://www.perplexity.ai' WHERE name = 'Perplexity';
UPDATE companies SET website = 'https://neeva.com' WHERE name = 'Neeva';
UPDATE companies SET website = 'https://www.datarobot.com' WHERE name = 'DataRobot';
UPDATE companies SET website = 'https://h2o.ai' WHERE name = 'H2O.ai';
UPDATE companies SET website = 'https://www.dataiku.com' WHERE name = 'Dataiku';
UPDATE companies SET website = 'https://www.dominodatalab.com' WHERE name = 'Domino Data Lab';
UPDATE companies SET website = 'https://automattic.com' WHERE name = 'Automatic';
UPDATE companies SET website = 'https://www.framer.com' WHERE name = 'Framer';
UPDATE companies SET website = 'https://linear.app' WHERE name = 'Linear';
UPDATE companies SET website = 'https://cursor.sh' WHERE name = 'Cursor';
UPDATE companies SET website = 'https://lovable.dev' WHERE name = 'Lovable';
UPDATE companies SET website = 'https://manus.ai' WHERE name = 'Manus';
UPDATE companies SET website = 'https://trae.ai' WHERE name = 'Trae';
UPDATE companies SET website = 'https://trae.ai/solo' WHERE name = 'Trae Solo';
UPDATE companies SET website = 'https://codebuddy.dev' WHERE name = 'Code Buddy';
UPDATE companies SET website = 'https://yuanbao.tencent.com' WHERE name = '腾讯元宝';

-- 查看更新结果
SELECT name, website, company_tier, headquarters 
FROM companies 
WHERE website IS NOT NULL 
ORDER BY name;
