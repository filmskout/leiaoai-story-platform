#!/usr/bin/env node

import fs from 'fs';
import https from 'https';
import http from 'http';

// AI公司logo URL映射（更新版本，使用更可靠的URL）
const companyLogos = {
  'OpenAI': 'https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg',
  'Anthropic': 'https://upload.wikimedia.org/wikipedia/commons/3/3a/Anthropic_logo.svg',
  'Google': 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg',
  'Microsoft': 'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg',
  'DeepSeek': 'https://www.deepseek.com/favicon.ico',
  'Midjourney': 'https://www.midjourney.com/favicon.ico',
  'Stability AI': 'https://stability.ai/favicon.ico',
  'Hugging Face': 'https://huggingface.co/favicon.ico',
  'Runway': 'https://runwayml.com/favicon.ico',
  'ElevenLabs': 'https://elevenlabs.io/favicon.ico',
  'xAI': 'https://x.ai/favicon.ico',
  'Perplexity AI': 'https://www.perplexity.ai/favicon.ico',
  'Cursor': 'https://cursor.sh/favicon.ico',
  'Synthesia': 'https://www.synthesia.io/favicon.ico',
  'OpusClip': 'https://www.opus.pro/favicon.ico',
  'Luma AI': 'https://lumalabs.ai/favicon.ico',
  'HeyGen': 'https://www.heygen.com/favicon.ico',
  'ByteDance': 'https://www.bytedance.com/favicon.ico',
  'Pictory': 'https://pictory.ai/favicon.ico',
  'InVideo': 'https://invideo.io/favicon.ico',
  'Descript': 'https://www.descript.com/favicon.ico',
  'Fliki': 'https://fliki.ai/favicon.ico',
  'Steve AI': 'https://www.steve.ai/favicon.ico',
  'Wondershare Filmora': 'https://filmora.wondershare.com/favicon.ico',
  'Leonardo': 'https://leonardo.ai/favicon.ico',
  'Canva': 'https://www.canva.com/favicon.ico',
  'Remove.bg': 'https://www.remove.bg/favicon.ico',
  'Adobe Firefly': 'https://firefly.adobe.com/favicon.ico',
  'Figma': 'https://www.figma.com/favicon.ico',
  'Krea AI': 'https://www.krea.ai/favicon.ico',
  'Ideogram': 'https://ideogram.ai/favicon.ico',
  'Adobe Express': 'https://www.adobe.com/express/favicon.ico',
  'Recraft': 'https://www.recraft.ai/favicon.ico',
  'Murf.ai': 'https://murf.ai/favicon.ico',
  'Suno': 'https://www.suno.ai/favicon.ico',
  'Udio': 'https://www.udio.com/favicon.ico',
  'Speechify': 'https://speechify.com/favicon.ico',
  'Play.ht': 'https://play.ht/favicon.ico',
  'Resemble AI': 'https://www.resemble.ai/favicon.ico',
  'AIVA': 'https://www.aiva.ai/favicon.ico',
  'Soundraw': 'https://soundraw.io/favicon.ico',
  'Krisp': 'https://krisp.ai/favicon.ico',
  'Grammarly': 'https://www.grammarly.com/favicon.ico',
  'Jasper.ai': 'https://www.jasper.ai/favicon.ico',
  'Copy.ai': 'https://www.copy.ai/favicon.ico',
  'Quillbot': 'https://quillbot.com/favicon.ico',
  'Rytr': 'https://rytr.me/favicon.ico',
  'Sudowrite': 'https://www.sudowrite.com/favicon.ico',
  'Writesonic': 'https://writesonic.com/favicon.ico',
  'Wordtune': 'https://www.wordtune.com/favicon.ico',
  'Lex': 'https://lex.page/favicon.ico',
  'Jenni AI': 'https://jenni.ai/favicon.ico',
  'ProWritingAid': 'https://prowritingaid.com/favicon.ico',
  'Hypotenuse AI': 'https://www.hypotenuse.ai/favicon.ico',
  'GitHub Copilot': 'https://github.com/favicon.ico',
  'Replit': 'https://replit.com/favicon.ico',
  'Tabnine': 'https://www.tabnine.com/favicon.ico',
  'Codeium': 'https://codeium.com/favicon.ico',
  'Lovable': 'https://lovable.dev/favicon.ico',
  'v0 by Vercel': 'https://v0.dev/favicon.ico',
  'CodeWP': 'https://codewp.ai/favicon.ico',
  'Groq': 'https://groq.com/favicon.ico',
  'Notion AI': 'https://www.notion.so/favicon.ico',
  'Zapier': 'https://zapier.com/favicon.ico',
  'n8n': 'https://n8n.io/favicon.ico',
  'Gamma': 'https://gamma.app/favicon.ico',
  'Fathom': 'https://fathom.video/favicon.ico',
  'Reclaim': 'https://reclaim.ai/favicon.ico',
  'Otter.ai': 'https://otter.ai/favicon.ico',
  'Calendly AI': 'https://calendly.com/favicon.ico',
  'Taskade': 'https://www.taskade.com/favicon.ico',
  'Manus': 'https://www.manus.ai/favicon.ico',
  'Monday.com AI': 'https://monday.com/favicon.ico',
  'ClickUp AI': 'https://clickup.com/favicon.ico',
  'AdCreative': 'https://www.adcreative.ai/favicon.ico',
  'HubSpot AI': 'https://www.hubspot.com/favicon.ico',
  'Persado': 'https://www.persado.com/favicon.ico',
  'Phrasee': 'https://phrasee.co/favicon.ico',
  'Patterns': 'https://patterns.app/favicon.ico',
  'Seventh Sense': 'https://www.theseventhsense.com/favicon.ico',
  'Brandwatch': 'https://www.brandwatch.com/favicon.ico',
  'Albert AI': 'https://albert.ai/favicon.ico',
  'Seamless.AI': 'https://seamless.ai/favicon.ico',
  'Gong': 'https://www.gong.io/favicon.ico',
  'Outreach': 'https://www.outreach.io/favicon.ico',
  'Chorus': 'https://www.chorus.ai/favicon.ico',
  'Character.ai': 'https://character.ai/favicon.ico',
  'Poe': 'https://poe.com/favicon.ico',
  'Intercom Fin': 'https://www.intercom.com/favicon.ico',
  'Zendesk AI': 'https://www.zendesk.com/favicon.ico',
  'Ada': 'https://www.ada.cx/favicon.ico',
  'LivePerson': 'https://www.liveperson.com/favicon.ico',
  'Drift': 'https://www.drift.com/favicon.ico',
  'Freshworks Freddy AI': 'https://www.freshworks.com/favicon.ico',
  'Botpress': 'https://botpress.com/favicon.ico',
  'Rasa': 'https://rasa.com/favicon.ico',
  'DataRobot': 'https://www.datarobot.com/favicon.ico',
  'H2O.ai': 'https://www.h2o.ai/favicon.ico',
  'Tableau AI': 'https://www.tableau.com/favicon.ico',
  'Microsoft Power BI AI': 'https://powerbi.microsoft.com/favicon.ico',
  'Qlik Sense AI': 'https://www.qlik.com/favicon.ico',
  'Sisense AI': 'https://www.sisense.com/favicon.ico',
  'ThoughtSpot': 'https://www.thoughtspot.com/favicon.ico',
  'Alteryx': 'https://www.alteryx.com/favicon.ico',
  'Khan Academy Khanmigo': 'https://www.khanacademy.org/favicon.ico',
  'Duolingo Max': 'https://www.duolingo.com/favicon.ico',
  'Coursera AI': 'https://www.coursera.org/favicon.ico',
  'Socratic by Google': 'https://socratic.org/favicon.ico',
  'Quizlet AI': 'https://quizlet.com/favicon.ico',
  'Gradescope AI': 'https://www.gradescope.com/favicon.ico',
  'Carnegie Learning': 'https://www.carnegielearning.com/favicon.ico',
  'Century Tech': 'https://www.century.tech/favicon.ico',
  'DeepAI': 'https://deepai.org/favicon.ico',
  'Replika': 'https://replika.ai/favicon.ico',
  'MonkeyLearn': 'https://monkeylearn.com/favicon.ico',
  'Lobe': 'https://www.lobe.ai/favicon.ico',
  'Runway Academy': 'https://academy.runwayml.com/favicon.ico'
};

// 下载图片并上传到Supabase Storage
async function downloadAndUploadLogo(companyName, logoUrl, supabaseUrl, supabaseKey) {
  return new Promise((resolve, reject) => {
    const protocol = logoUrl.startsWith('https:') ? https : http;
    
    protocol.get(logoUrl, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`HTTP ${response.statusCode}: ${response.statusMessage}`));
        return;
      }
      
      const chunks = [];
      response.on('data', (chunk) => chunks.push(chunk));
      response.on('end', async () => {
        try {
          const buffer = Buffer.concat(chunks);
          const mimeType = response.headers['content-type'] || 'image/png';
          
          // 生成文件名
          const extension = mimeType.split('/')[1] || 'png';
          const fileName = `${companyName.toLowerCase().replace(/\s+/g, '-')}.${extension}`;
          
          // 上传到Supabase Storage
          const uploadResponse = await fetch(`${supabaseUrl}/storage/v1/object/company-logos/${fileName}`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${supabaseKey}`,
              'apikey': supabaseKey,
              'Content-Type': mimeType
            },
            body: buffer
          });
          
          if (uploadResponse.ok) {
            const publicUrl = `${supabaseUrl}/storage/v1/object/public/company-logos/${fileName}`;
            resolve({
              company: companyName,
              fileName,
              publicUrl,
              mimeType,
              size: buffer.length,
              success: true
            });
          } else {
            throw new Error(`Upload failed: ${uploadResponse.statusText}`);
          }
        } catch (error) {
          reject(error);
        }
      });
    }).on('error', reject);
  });
}

// 生成Storage版本的SQL更新脚本
async function generateStorageLogoUpdateSQL() {
  console.log('🚀 开始获取AI公司logo并上传到Supabase Storage...');
  
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ 缺少Supabase配置');
    return;
  }
  
  const logoUpdates = [];
  let successCount = 0;
  let errorCount = 0;
  
  for (const [companyName, logoUrl] of Object.entries(companyLogos)) {
    try {
      console.log(`📥 正在处理 ${companyName} 的logo...`);
      const result = await downloadAndUploadLogo(companyName, logoUrl, supabaseUrl, supabaseKey);
      
      logoUpdates.push(result);
      successCount++;
      console.log(`✅ ${companyName} logo上传成功: ${result.publicUrl}`);
      
      // 添加延迟避免请求过快
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (error) {
      console.error(`❌ ${companyName} logo处理失败:`, error.message);
      logoUpdates.push({
        company: companyName,
        logoUrl,
        success: false,
        error: error.message
      });
      errorCount++;
    }
  }
  
  // 生成SQL更新语句
  let sql = `-- AI公司Logo更新脚本 (Storage版本)
-- 在Supabase SQL Editor中执行

-- 更新公司logo信息
UPDATE companies SET 
  logo_url = CASE name
`;

  const logoUrlCases = [];
  
  logoUpdates.forEach(update => {
    if (update.success && update.publicUrl) {
      const companyName = update.company.replace(/'/g, "''");
      logoUrlCases.push(`    WHEN '${companyName}' THEN '${update.publicUrl}'`);
    }
  });
  
  sql += logoUrlCases.join('\n');
  sql += `\n  END,
  logo_updated_at = NOW()
WHERE name IN (${logoUpdates.filter(u => u.success).map(u => `'${u.company.replace(/'/g, "''")}'`).join(', ')});

-- 完成
SELECT 'Storage版Logo更新完成！成功: ${successCount}, 失败: ${errorCount}' as status;`;

  // 写入文件
  fs.writeFileSync('update-company-logos-storage.sql', sql);
  
  // 保存详细结果
  fs.writeFileSync('logo-storage-results.json', JSON.stringify(logoUpdates, null, 2));
  
  console.log(`\n🎉 Logo处理完成！`);
  console.log(`📊 成功: ${successCount}, 失败: ${errorCount}`);
  console.log(`📁 SQL脚本已保存: update-company-logos-storage.sql`);
  console.log(`📁 详细结果已保存: logo-storage-results.json`);
}

// 执行
generateStorageLogoUpdateSQL().catch(console.error);
