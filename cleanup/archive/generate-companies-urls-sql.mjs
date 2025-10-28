import fs from 'fs';

// 公司URL映射（基于常见AI公司的官方网站）
// 此脚本会生成手动SQL，然后可以在Supabase SQL Editor中执行

const companyUrls = {
  // Giants
  'OpenAI': 'https://openai.com',
  'Google': 'https://www.google.com',
  'Microsoft': 'https://www.microsoft.com',
  'Meta': 'https://about.meta.com',
  'xAI': 'https://x.ai',
  'Anthropic': 'https://www.anthropic.com',
  
  // 中国巨头
  'Baidu': 'https://www.baidu.com',
  'Tencent': 'https://www.tencent.com',
  'ByteDance': 'https://www.bytedance.com',
  'Alibaba': 'https://www.alibaba.com',
  
  // Unicorns
  'Adobe': 'https://www.adobe.com',
  'Vercel': 'https://vercel.com',
  'Stability AI': 'https://stability.ai',
  'Midjourney': 'https://www.midjourney.com',
  'Character.AI': 'https://character.ai',
  'Notion': 'https://www.notion.so',
  'Replit': 'https://replit.com',
  'Scale AI': 'https://scale.ai',
  'Hugging Face': 'https://huggingface.co',
  'Runway': 'https://runwayml.com',
  'Jasper': 'https://www.jasper.ai',
  'Copy.ai': 'https://www.copy.ai',
  'Grammarly': 'https://www.grammarly.com',
  'Canva': 'https://www.canva.com',
  'Figma': 'https://www.figma.com',
  'Codeium': 'https://www.codeium.com',
  'Tabnine': 'https://www.tabnine.com',
  'DeepSeek': 'https://www.deepseek.com',
  'Minimax': 'https://www.minimax.chat',
  
  // 视频/音频AI
  'Synthesia': 'https://www.synthesia.io',
  'HeyGen': 'https://www.heygen.com',
  'InVideo': 'https://invideo.io',
  'Luma AI': 'https://lumalabs.ai',
  'CapCut': 'https://www.capcut.com',
  'Descript': 'https://www.descript.com',
  'Otter.ai': 'https://otter.ai',
  'Rev.com': 'https://www.rev.com',
  
  // 内容生成
  'Jasper AI': 'https://www.jasper.ai',
  'Copy.ai': 'https://www.copy.ai',
  'Writesonic': 'https://writesonic.com',
  'Rytr': 'https://rytr.me',
  'Conversion.ai': 'https://www.conversion.ai',
  
  // 图像AI
  'Midjourney': 'https://www.midjourney.com',
  'Leonardo.AI': 'https://leonardo.ai',
  'Playground AI': 'https://playgroundai.com',
  'Imagine AI': 'https://www.imagine.art',
  'DALL-E': 'https://openai.com/dall-e',
  'Krea AI': 'https://www.krea.ai',
  'Remove.bg': 'https://www.remove.bg',
  
  // 3D/空间AI
  'Luma AI': 'https://lumalabs.ai',
  'Rodin': 'https://www.rodin.ai',
  'Hopper': 'https://www.hopper.com',
  
  // 代码AI
  'GitHub Copilot': 'https://github.com/features/copilot',
  'Amazon CodeWhisperer': 'https://aws.amazon.com/codewhisperer',
  'Codeium': 'https://www.codeium.com',
  'Tabnine': 'https://www.tabnine.com',
  'Sourcegraph Cody': 'https://about.sourcegraph.com/cody',
  'Replit': 'https://replit.com',
  
  // 音乐AI
  'AIVA': 'https://www.aiva.ai',
  'Amper Music': 'https://ampermusic.com',
  'Boomy': 'https://boomy.com',
  
  // 安全AI
  'Darktrace': 'https://www.darktrace.com',
  'Snyk': 'https://snyk.io',
  
  // 搜索AI
  'You.com': 'https://you.com',
  'Perplexity': 'https://www.perplexity.ai',
  'Neeva': 'https://neeva.com',
  
  // 数据分析AI
  'DataRobot': 'https://www.datarobot.com',
  'H2O.ai': 'https://h2o.ai',
  'Dataiku': 'https://www.dataiku.com',
  'Domino Data Lab': 'https://www.dominodatalab.com',
  
  // 更多独角兽
  'Automatic': 'https://automattic.com',
  'Framer': 'https://www.framer.com',
  'Linear': 'https://linear.app',
  'Cursor': 'https://cursor.sh',
  'Lovable': 'https://lovable.dev',
  'Manus': 'https://manus.ai',
  'Trae': 'https://trae.ai',
  'Trae Solo': 'https://trae.ai/solo',
  'Code Buddy': 'https://codebuddy.dev',
  '腾讯元宝': 'https://yuanbao.tencent.com',
};

function generateSQL() {
  console.log('📝 生成公司URL补齐SQL脚本...\n');
  
  const sqlStatements = [];
  
  for (const [companyName, url] of Object.entries(companyUrls)) {
    sqlStatements.push(`UPDATE companies SET website = '${url}' WHERE name = '${companyName}';`);
  }
  
  const sqlContent = `-- 公司URL补齐SQL脚本
-- 在Supabase SQL Editor中执行此脚本

${sqlStatements.join('\n')}

-- 查看更新结果
SELECT name, website, company_tier, headquarters 
FROM companies 
WHERE website IS NOT NULL 
ORDER BY name;
`;

  fs.writeFileSync('UPDATE-COMPANIES-URLS.sql', sqlContent, 'utf-8');
  
  console.log('✅ 已生成SQL脚本: UPDATE-COMPANIES-URLS.sql');
  console.log(`📊 共包含 ${sqlStatements.length} 个公司的URL更新`);
  console.log('\n📋 执行方式:');
  console.log('1. 打开 Supabase SQL Editor');
  console.log('2. 复制 UPDATE-COMPANIES-URLS.sql 的内容');
  console.log('3. 粘贴并执行');
}

generateSQL();

