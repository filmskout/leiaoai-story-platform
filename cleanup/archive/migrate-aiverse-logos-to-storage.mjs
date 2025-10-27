#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// AIverse logo文件路径映射
const aiverseLogoMapping = {
  'OpenAI': 'openai-logo.png',
  'Anthropic': 'anthropic-logo.png', 
  'Google': 'google-logo.png',
  'Microsoft': 'microsoft-logo.png',
  'DeepSeek': 'deepseek-logo.png',
  'Midjourney': 'midjourney-logo.png',
  'Stability AI': 'stability-ai-logo.png',
  'Hugging Face': 'hugging-face-logo.png',
  'Runway': 'runway-logo.png',
  'ElevenLabs': 'elevenlabs-logo.png',
  'xAI': 'xai-logo.png',
  'Perplexity AI': 'perplexity-logo.png',
  'Cursor': 'cursor-logo.png',
  'Synthesia': 'synthesia-logo.png',
  'OpusClip': 'opusclip-logo.png',
  'Luma AI': 'luma-ai-logo.png',
  'HeyGen': 'heygen-logo.png',
  'ByteDance': 'bytedance-logo.png',
  'Pictory': 'pictory-logo.png',
  'InVideo': 'invideo-logo.png',
  'Descript': 'descript-logo.png',
  'Fliki': 'fliki-logo.png',
  'Steve AI': 'steve-ai-logo.png',
  'Wondershare Filmora': 'filmora-logo.png',
  'Leonardo': 'leonardo-logo.png',
  'Canva': 'canva-logo.png',
  'Remove.bg': 'remove-bg-logo.png',
  'Adobe Firefly': 'adobe-firefly-logo.png',
  'Figma': 'figma-logo.png',
  'Krea AI': 'krea-ai-logo.png',
  'Ideogram': 'ideogram-logo.png',
  'Adobe Express': 'adobe-express-logo.png',
  'Recraft': 'recraft-logo.png',
  'Murf.ai': 'murf-logo.png',
  'Suno': 'suno-logo.png',
  'Udio': 'udio-logo.png',
  'Speechify': 'speechify-logo.png',
  'Play.ht': 'play-ht-logo.png',
  'Resemble AI': 'resemble-ai-logo.png',
  'AIVA': 'aiva-logo.png',
  'Soundraw': 'soundraw-logo.png',
  'Krisp': 'krisp-logo.png',
  'Grammarly': 'grammarly-logo.png',
  'Jasper.ai': 'jasper-logo.png',
  'Copy.ai': 'copy-ai-logo.png',
  'Quillbot': 'quillbot-logo.png',
  'Rytr': 'rytr-logo.png',
  'Sudowrite': 'sudowrite-logo.png',
  'Writesonic': 'writesonic-logo.png',
  'Wordtune': 'wordtune-logo.png',
  'Lex': 'lex-logo.png',
  'Jenni AI': 'jenni-ai-logo.png',
  'ProWritingAid': 'prowritingaid-logo.png',
  'Hypotenuse AI': 'hypotenuse-ai-logo.png',
  'GitHub Copilot': 'github-copilot-logo.png',
  'Replit': 'replit-logo.png',
  'Tabnine': 'tabnine-logo.png',
  'Codeium': 'codeium-logo.png',
  'Lovable': 'lovable-logo.png',
  'v0 by Vercel': 'v0-logo.png',
  'CodeWP': 'codewp-logo.png',
  'Groq': 'groq-logo.png',
  'Notion AI': 'notion-logo.png',
  'Zapier': 'zapier-logo.png',
  'n8n': 'n8n-logo.png',
  'Gamma': 'gamma-logo.png',
  'Fathom': 'fathom-logo.png',
  'Reclaim': 'reclaim-logo.png',
  'Otter.ai': 'otter-logo.png',
  'Calendly AI': 'calendly-logo.png',
  'Taskade': 'taskade-logo.png',
  'Manus': 'manus-logo.png',
  'Monday.com AI': 'monday-logo.png',
  'ClickUp AI': 'clickup-logo.png',
  'AdCreative': 'adcreative-logo.png',
  'HubSpot AI': 'hubspot-logo.png',
  'Persado': 'persado-logo.png',
  'Phrasee': 'phrasee-logo.png',
  'Patterns': 'patterns-logo.png',
  'Seventh Sense': 'seventh-sense-logo.png',
  'Brandwatch': 'brandwatch-logo.png',
  'Albert AI': 'albert-ai-logo.png',
  'Seamless.AI': 'seamless-ai-logo.png',
  'Gong': 'gong-logo.png',
  'Outreach': 'outreach-logo.png',
  'Chorus': 'chorus-logo.png',
  'Character.ai': 'character-ai-logo.png',
  'Poe': 'poe-logo.png',
  'Intercom Fin': 'intercom-logo.png',
  'Zendesk AI': 'zendesk-logo.png',
  'Ada': 'ada-logo.png',
  'LivePerson': 'liveperson-logo.png',
  'Drift': 'drift-logo.png',
  'Freshworks Freddy AI': 'freshworks-logo.png',
  'Botpress': 'botpress-logo.png',
  'Rasa': 'rasa-logo.png',
  'DataRobot': 'datarobot-logo.png',
  'H2O.ai': 'h2o-logo.png',
  'Tableau AI': 'tableau-logo.png',
  'Microsoft Power BI AI': 'powerbi-logo.png',
  'Qlik Sense AI': 'qlik-logo.png',
  'Sisense AI': 'sisense-logo.png',
  'ThoughtSpot': 'thoughtspot-logo.png',
  'Alteryx': 'alteryx-logo.png',
  'Khan Academy Khanmigo': 'khan-academy-logo.png',
  'Duolingo Max': 'duolingo-logo.png',
  'Coursera AI': 'coursera-logo.png',
  'Socratic by Google': 'socratic-logo.png',
  'Quizlet AI': 'quizlet-logo.png',
  'Gradescope AI': 'gradescope-logo.png',
  'Carnegie Learning': 'carnegie-learning-logo.png',
  'Century Tech': 'century-tech-logo.png',
  'DeepAI': 'deepai-logo.png',
  'Replika': 'replika-logo.png',
  'MonkeyLearn': 'monkeylearn-logo.png',
  'Lobe': 'lobe-logo.png',
  'Runway Academy': 'runway-academy-logo.png'
};

// 上传文件到Supabase Storage
async function uploadFileToStorage(filePath, fileName, supabaseUrl, supabaseKey) {
  try {
    const fileBuffer = fs.readFileSync(filePath);
    const mimeType = getMimeType(fileName);
    
    const response = await fetch(`${supabaseUrl}/storage/v1/object/company-logos/${fileName}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${supabaseKey}`,
        'apikey': supabaseKey,
        'Content-Type': mimeType
      },
      body: fileBuffer
    });
    
    if (response.ok) {
      return `${supabaseUrl}/storage/v1/object/public/company-logos/${fileName}`;
    } else {
      throw new Error(`Upload failed: ${response.statusText}`);
    }
  } catch (error) {
    throw new Error(`File upload error: ${error.message}`);
  }
}

// 获取文件MIME类型
function getMimeType(fileName) {
  const ext = path.extname(fileName).toLowerCase();
  const mimeTypes = {
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.webp': 'image/webp'
  };
  return mimeTypes[ext] || 'image/png';
}

// 生成AIverse logo迁移脚本
async function generateAiverseLogoMigration() {
  console.log('🚀 开始生成AIverse logo迁移脚本...');
  
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ 缺少Supabase配置');
    console.log('请设置环境变量: SUPABASE_URL 和 SUPABASE_SERVICE_ROLE_KEY');
    return;
  }
  
  // AIverse logo目录路径（需要根据实际路径调整）
  const aiverseLogoDir = path.join(__dirname, '../Desktop/aidb/aiverse/public/logos');
  
  console.log(`📁 检查AIverse logo目录: ${aiverseLogoDir}`);
  
  if (!fs.existsSync(aiverseLogoDir)) {
    console.log('⚠️  AIverse logo目录不存在，将生成基于URL的迁移脚本');
    return generateUrlBasedMigration();
  }
  
  const logoFiles = fs.readdirSync(aiverseLogoDir);
  console.log(`📊 找到 ${logoFiles.length} 个logo文件`);
  
  const migrationResults = [];
  let successCount = 0;
  let errorCount = 0;
  
  for (const [companyName, expectedFileName] of Object.entries(aiverseLogoMapping)) {
    const logoPath = path.join(aiverseLogoDir, expectedFileName);
    
    if (fs.existsSync(logoPath)) {
      try {
        console.log(`📤 上传 ${companyName} 的logo...`);
        const publicUrl = await uploadFileToStorage(logoPath, expectedFileName, supabaseUrl, supabaseKey);
        
        migrationResults.push({
          company: companyName,
          fileName: expectedFileName,
          publicUrl,
          success: true
        });
        
        successCount++;
        console.log(`✅ ${companyName} logo上传成功: ${publicUrl}`);
        
        // 添加延迟避免请求过快
        await new Promise(resolve => setTimeout(resolve, 500));
        
      } catch (error) {
        console.error(`❌ ${companyName} logo上传失败:`, error.message);
        migrationResults.push({
          company: companyName,
          fileName: expectedFileName,
          success: false,
          error: error.message
        });
        errorCount++;
      }
    } else {
      console.log(`⚠️  ${companyName} logo文件不存在: ${expectedFileName}`);
      migrationResults.push({
        company: companyName,
        fileName: expectedFileName,
        success: false,
        error: 'File not found'
      });
      errorCount++;
    }
  }
  
  // 生成SQL更新脚本
  generateMigrationSQL(migrationResults, successCount, errorCount);
  
  // 保存详细结果
  fs.writeFileSync('aiverse-logo-migration-results.json', JSON.stringify(migrationResults, null, 2));
  
  console.log(`\n🎉 AIverse logo迁移完成！`);
  console.log(`📊 成功: ${successCount}, 失败: ${errorCount}`);
  console.log(`📁 详细结果已保存: aiverse-logo-migration-results.json`);
}

// 生成基于URL的迁移脚本（当本地文件不存在时）
function generateUrlBasedMigration() {
  console.log('📋 生成基于URL的AIverse logo迁移脚本...');
  
  const migrationSQL = `-- AIverse Logo迁移脚本 (基于URL)
-- 在Supabase SQL Editor中执行

-- 更新公司logo信息，使用AIverse的logo URL
UPDATE companies SET 
  logo_storage_url = CASE name
    WHEN 'OpenAI' THEN 'https://aiverse.ai/logos/openai-logo.png'
    WHEN 'Anthropic' THEN 'https://aiverse.ai/logos/anthropic-logo.png'
    WHEN 'Google' THEN 'https://aiverse.ai/logos/google-logo.png'
    WHEN 'Microsoft' THEN 'https://aiverse.ai/logos/microsoft-logo.png'
    WHEN 'DeepSeek' THEN 'https://aiverse.ai/logos/deepseek-logo.png'
    WHEN 'Midjourney' THEN 'https://aiverse.ai/logos/midjourney-logo.png'
    WHEN 'Stability AI' THEN 'https://aiverse.ai/logos/stability-ai-logo.png'
    WHEN 'Hugging Face' THEN 'https://aiverse.ai/logos/hugging-face-logo.png'
    WHEN 'Runway' THEN 'https://aiverse.ai/logos/runway-logo.png'
    WHEN 'ElevenLabs' THEN 'https://aiverse.ai/logos/elevenlabs-logo.png'
    WHEN 'xAI' THEN 'https://aiverse.ai/logos/xai-logo.png'
    WHEN 'Perplexity AI' THEN 'https://aiverse.ai/logos/perplexity-logo.png'
    WHEN 'Cursor' THEN 'https://aiverse.ai/logos/cursor-logo.png'
    WHEN 'Synthesia' THEN 'https://aiverse.ai/logos/synthesia-logo.png'
    WHEN 'OpusClip' THEN 'https://aiverse.ai/logos/opusclip-logo.png'
    WHEN 'Luma AI' THEN 'https://aiverse.ai/logos/luma-ai-logo.png'
    WHEN 'HeyGen' THEN 'https://aiverse.ai/logos/heygen-logo.png'
    WHEN 'ByteDance' THEN 'https://aiverse.ai/logos/bytedance-logo.png'
    WHEN 'Pictory' THEN 'https://aiverse.ai/logos/pictory-logo.png'
    WHEN 'InVideo' THEN 'https://aiverse.ai/logos/invideo-logo.png'
    WHEN 'Descript' THEN 'https://aiverse.ai/logos/descript-logo.png'
    WHEN 'Fliki' THEN 'https://aiverse.ai/logos/fliki-logo.png'
    WHEN 'Steve AI' THEN 'https://aiverse.ai/logos/steve-ai-logo.png'
    WHEN 'Wondershare Filmora' THEN 'https://aiverse.ai/logos/filmora-logo.png'
    WHEN 'Leonardo' THEN 'https://aiverse.ai/logos/leonardo-logo.png'
    WHEN 'Canva' THEN 'https://aiverse.ai/logos/canva-logo.png'
    WHEN 'Remove.bg' THEN 'https://aiverse.ai/logos/remove-bg-logo.png'
    WHEN 'Adobe Firefly' THEN 'https://aiverse.ai/logos/adobe-firefly-logo.png'
    WHEN 'Figma' THEN 'https://aiverse.ai/logos/figma-logo.png'
    WHEN 'Krea AI' THEN 'https://aiverse.ai/logos/krea-ai-logo.png'
    WHEN 'Ideogram' THEN 'https://aiverse.ai/logos/ideogram-logo.png'
    WHEN 'Adobe Express' THEN 'https://aiverse.ai/logos/adobe-express-logo.png'
    WHEN 'Recraft' THEN 'https://aiverse.ai/logos/recraft-logo.png'
    WHEN 'Murf.ai' THEN 'https://aiverse.ai/logos/murf-logo.png'
    WHEN 'Suno' THEN 'https://aiverse.ai/logos/suno-logo.png'
    WHEN 'Udio' THEN 'https://aiverse.ai/logos/udio-logo.png'
    WHEN 'Speechify' THEN 'https://aiverse.ai/logos/speechify-logo.png'
    WHEN 'Play.ht' THEN 'https://aiverse.ai/logos/play-ht-logo.png'
    WHEN 'Resemble AI' THEN 'https://aiverse.ai/logos/resemble-ai-logo.png'
    WHEN 'AIVA' THEN 'https://aiverse.ai/logos/aiva-logo.png'
    WHEN 'Soundraw' THEN 'https://aiverse.ai/logos/soundraw-logo.png'
    WHEN 'Krisp' THEN 'https://aiverse.ai/logos/krisp-logo.png'
    WHEN 'Grammarly' THEN 'https://aiverse.ai/logos/grammarly-logo.png'
    WHEN 'Jasper.ai' THEN 'https://aiverse.ai/logos/jasper-logo.png'
    WHEN 'Copy.ai' THEN 'https://aiverse.ai/logos/copy-ai-logo.png'
    WHEN 'Quillbot' THEN 'https://aiverse.ai/logos/quillbot-logo.png'
    WHEN 'Rytr' THEN 'https://aiverse.ai/logos/rytr-logo.png'
    WHEN 'Sudowrite' THEN 'https://aiverse.ai/logos/sudowrite-logo.png'
    WHEN 'Writesonic' THEN 'https://aiverse.ai/logos/writesonic-logo.png'
    WHEN 'Wordtune' THEN 'https://aiverse.ai/logos/wordtune-logo.png'
    WHEN 'Lex' THEN 'https://aiverse.ai/logos/lex-logo.png'
    WHEN 'Jenni AI' THEN 'https://aiverse.ai/logos/jenni-ai-logo.png'
    WHEN 'ProWritingAid' THEN 'https://aiverse.ai/logos/prowritingaid-logo.png'
    WHEN 'Hypotenuse AI' THEN 'https://aiverse.ai/logos/hypotenuse-ai-logo.png'
    WHEN 'GitHub Copilot' THEN 'https://aiverse.ai/logos/github-copilot-logo.png'
    WHEN 'Replit' THEN 'https://aiverse.ai/logos/replit-logo.png'
    WHEN 'Tabnine' THEN 'https://aiverse.ai/logos/tabnine-logo.png'
    WHEN 'Codeium' THEN 'https://aiverse.ai/logos/codeium-logo.png'
    WHEN 'Lovable' THEN 'https://aiverse.ai/logos/lovable-logo.png'
    WHEN 'v0 by Vercel' THEN 'https://aiverse.ai/logos/v0-logo.png'
    WHEN 'CodeWP' THEN 'https://aiverse.ai/logos/codewp-logo.png'
    WHEN 'Groq' THEN 'https://aiverse.ai/logos/groq-logo.png'
    WHEN 'Notion AI' THEN 'https://aiverse.ai/logos/notion-logo.png'
    WHEN 'Zapier' THEN 'https://aiverse.ai/logos/zapier-logo.png'
    WHEN 'n8n' THEN 'https://aiverse.ai/logos/n8n-logo.png'
    WHEN 'Gamma' THEN 'https://aiverse.ai/logos/gamma-logo.png'
    WHEN 'Fathom' THEN 'https://aiverse.ai/logos/fathom-logo.png'
    WHEN 'Reclaim' THEN 'https://aiverse.ai/logos/reclaim-logo.png'
    WHEN 'Otter.ai' THEN 'https://aiverse.ai/logos/otter-logo.png'
    WHEN 'Calendly AI' THEN 'https://aiverse.ai/logos/calendly-logo.png'
    WHEN 'Taskade' THEN 'https://aiverse.ai/logos/taskade-logo.png'
    WHEN 'Manus' THEN 'https://aiverse.ai/logos/manus-logo.png'
    WHEN 'Monday.com AI' THEN 'https://aiverse.ai/logos/monday-logo.png'
    WHEN 'ClickUp AI' THEN 'https://aiverse.ai/logos/clickup-logo.png'
    WHEN 'AdCreative' THEN 'https://aiverse.ai/logos/adcreative-logo.png'
    WHEN 'HubSpot AI' THEN 'https://aiverse.ai/logos/hubspot-logo.png'
    WHEN 'Persado' THEN 'https://aiverse.ai/logos/persado-logo.png'
    WHEN 'Phrasee' THEN 'https://aiverse.ai/logos/phrasee-logo.png'
    WHEN 'Patterns' THEN 'https://aiverse.ai/logos/patterns-logo.png'
    WHEN 'Seventh Sense' THEN 'https://aiverse.ai/logos/seventh-sense-logo.png'
    WHEN 'Brandwatch' THEN 'https://aiverse.ai/logos/brandwatch-logo.png'
    WHEN 'Albert AI' THEN 'https://aiverse.ai/logos/albert-ai-logo.png'
    WHEN 'Seamless.AI' THEN 'https://aiverse.ai/logos/seamless-ai-logo.png'
    WHEN 'Gong' THEN 'https://aiverse.ai/logos/gong-logo.png'
    WHEN 'Outreach' THEN 'https://aiverse.ai/logos/outreach-logo.png'
    WHEN 'Chorus' THEN 'https://aiverse.ai/logos/chorus-logo.png'
    WHEN 'Character.ai' THEN 'https://aiverse.ai/logos/character-ai-logo.png'
    WHEN 'Poe' THEN 'https://aiverse.ai/logos/poe-logo.png'
    WHEN 'Intercom Fin' THEN 'https://aiverse.ai/logos/intercom-logo.png'
    WHEN 'Zendesk AI' THEN 'https://aiverse.ai/logos/zendesk-logo.png'
    WHEN 'Ada' THEN 'https://aiverse.ai/logos/ada-logo.png'
    WHEN 'LivePerson' THEN 'https://aiverse.ai/logos/liveperson-logo.png'
    WHEN 'Drift' THEN 'https://aiverse.ai/logos/drift-logo.png'
    WHEN 'Freshworks Freddy AI' THEN 'https://aiverse.ai/logos/freshworks-logo.png'
    WHEN 'Botpress' THEN 'https://aiverse.ai/logos/botpress-logo.png'
    WHEN 'Rasa' THEN 'https://aiverse.ai/logos/rasa-logo.png'
    WHEN 'DataRobot' THEN 'https://aiverse.ai/logos/datarobot-logo.png'
    WHEN 'H2O.ai' THEN 'https://aiverse.ai/logos/h2o-logo.png'
    WHEN 'Tableau AI' THEN 'https://aiverse.ai/logos/tableau-logo.png'
    WHEN 'Microsoft Power BI AI' THEN 'https://aiverse.ai/logos/powerbi-logo.png'
    WHEN 'Qlik Sense AI' THEN 'https://aiverse.ai/logos/qlik-logo.png'
    WHEN 'Sisense AI' THEN 'https://aiverse.ai/logos/sisense-logo.png'
    WHEN 'ThoughtSpot' THEN 'https://aiverse.ai/logos/thoughtspot-logo.png'
    WHEN 'Alteryx' THEN 'https://aiverse.ai/logos/alteryx-logo.png'
    WHEN 'Khan Academy Khanmigo' THEN 'https://aiverse.ai/logos/khan-academy-logo.png'
    WHEN 'Duolingo Max' THEN 'https://aiverse.ai/logos/duolingo-logo.png'
    WHEN 'Coursera AI' THEN 'https://aiverse.ai/logos/coursera-logo.png'
    WHEN 'Socratic by Google' THEN 'https://aiverse.ai/logos/socratic-logo.png'
    WHEN 'Quizlet AI' THEN 'https://aiverse.ai/logos/quizlet-logo.png'
    WHEN 'Gradescope AI' THEN 'https://aiverse.ai/logos/gradescope-logo.png'
    WHEN 'Carnegie Learning' THEN 'https://aiverse.ai/logos/carnegie-learning-logo.png'
    WHEN 'Century Tech' THEN 'https://aiverse.ai/logos/century-tech-logo.png'
    WHEN 'DeepAI' THEN 'https://aiverse.ai/logos/deepai-logo.png'
    WHEN 'Replika' THEN 'https://aiverse.ai/logos/replika-logo.png'
    WHEN 'MonkeyLearn' THEN 'https://aiverse.ai/logos/monkeylearn-logo.png'
    WHEN 'Lobe' THEN 'https://aiverse.ai/logos/lobe-logo.png'
    WHEN 'Runway Academy' THEN 'https://aiverse.ai/logos/runway-academy-logo.png'
  END,
  logo_updated_at = NOW()
WHERE name IN (${Object.keys(aiverseLogoMapping).map(name => `'${name.replace(/'/g, "''")}'`).join(', ')});

-- 完成
SELECT 'AIverse logo迁移完成！' as status;`;

  fs.writeFileSync('aiverse-logo-migration-url.sql', migrationSQL);
  console.log('📁 URL版本迁移脚本已保存: aiverse-logo-migration-url.sql');
}

// 生成迁移SQL
function generateMigrationSQL(results, successCount, errorCount) {
  let sql = `-- AIverse Logo迁移脚本 (Storage版本)
-- 在Supabase SQL Editor中执行

-- 更新公司logo信息
UPDATE companies SET 
  logo_storage_url = CASE name
`;

  const logoUrlCases = [];
  
  results.forEach(result => {
    if (result.success && result.publicUrl) {
      const companyName = result.company.replace(/'/g, "''");
      logoUrlCases.push(`    WHEN '${companyName}' THEN '${result.publicUrl}'`);
    }
  });
  
  sql += logoUrlCases.join('\n');
  sql += `\n  END,
  logo_updated_at = NOW()
WHERE name IN (${results.filter(r => r.success).map(r => `'${r.company.replace(/'/g, "''")}'`).join(', ')});

-- 完成
SELECT 'AIverse logo迁移完成！成功: ${successCount}, 失败: ${errorCount}' as status;`;

  fs.writeFileSync('aiverse-logo-migration-storage.sql', sql);
  console.log('📁 Storage版本迁移脚本已保存: aiverse-logo-migration-storage.sql');
}

// 执行
generateAiverseLogoMigration().catch(console.error);
