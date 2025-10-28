import fs from 'fs';

// 从文件读取公司列表
const companiesList = fs.readFileSync('all-companies-list.txt', 'utf-8')
  .split('\n')
  .filter(line => line.trim())
  .map(line => line.trim());

console.log(`📊 处理 ${companiesList.length} 个公司\n`);

// 扩展URL映射
const urlMap = {
  // Giants
  'OpenAI': 'https://openai.com',
  'Google DeepMind': 'https://deepmind.google',
  'Google': 'https://www.google.com',
  'Microsoft AI': 'https://www.microsoft.com',
  'Amazon AI': 'https://aws.amazon.com',
  'Apple AI': 'https://www.apple.com',
  'Meta AI': 'https://ai.meta.com',
  'Tencent AI Lab': 'https://ai.tencent.com',
  'Tencent Cloud AI': 'https://www.tencentcloud.com',
  'ByteDance AI': 'https://www.bytedance.com',
  'Baidu AI': 'https://ai.baidu.com',
  'Alibaba Cloud AI': 'https://www.alibabacloud.com',
  
  // Unicorns
  'Anthropic': 'https://www.anthropic.com',
  'Adobe': 'https://www.adobe.com',
  'Stability AI': 'https://stability.ai',
  'Midjourney': 'https://www.midjourney.com',
  'Character.AI': 'https://character.ai',
  'Runway': 'https://runwayml.com',
  'Notion': 'https://www.notion.so',
  'Notion AI': 'https://www.notion.so',
  'Jasper': 'https://www.jasper.ai',
  'Copy.ai': 'https://www.copy.ai',
  'Descript': 'https://www.descript.com',
  'Grammarly': 'https://www.grammarly.com',
  'Tabnine': 'https://www.tabnine.com',
  'Codeium': 'https://www.codeium.com',
  'DeepSeek': 'https://www.deepseek.com',
  
  // AI Infrastructure
  'Hugging Face': 'https://huggingface.co',
  'Replit': 'https://replit.com',
  'Vercel': 'https://vercel.com',
  'Modal': 'https://modal.com',
  'Lightning AI': 'https://lightning.ai',
  'Scale AI': 'https://scale.ai',
  'Anyscale': 'https://www.anyscale.com',
  
  // Other companies
  'ElevenLabs': 'https://elevenlabs.io',
  'Resemble AI': 'https://resemble.ai',
  'Otter.ai': 'https://otter.ai',
  'Zapier': 'https://zapier.com',
  'Perplexity AI': 'https://www.perplexity.ai',
  'Cohere': 'https://cohere.com',
  'Pinecone': 'https://www.pinecone.io',
  'Weights & Biases': 'https://wandb.ai',
  
  // Chinese AI
  'Zhipu AI': 'https://www.zhipuai.cn',
  'Moonshot AI': 'https://www.moonshot.cn',
  'MiniMax': 'https://www.minimax.chat',
  'Kaimu AI': 'https://www.kaimu.ai',
  'iFlytek': 'https://www.iflytek.com',
  'SenseTime': 'https://www.sensetime.com',
  'Megvii': 'https://megvii.com',
  'Yitu': 'https://www.yitu.com',
  'CloudWalk': 'https://www.cloudwalk-inc.com',
  
  // Hardware
  'NVIDIA': 'https://www.nvidia.com',
  'Tesla AI': 'https://www.tesla.com',
  'Cerebras': 'https://www.cerebras.net',
  
  // Autonomous
  'Waymo': 'https://waymo.com',
  'Cruise': 'https://getcruise.com',
  'Aurora': 'https://aurora.tech',
  'Pony.ai': 'https://www.pony.ai',
  
  // Tools
  'LangChain': 'https://www.langchain.com',
  'LlamaIndex': 'https://www.llamaindex.ai',
  'Gradio': 'https://gradio.app',
  'Streamlit': 'https://streamlit.io',
  'Replicate': 'https://replicate.com',
  'ComfyUI': 'https://github.com/comfyanonymous/ComfyUI',
  'Chroma': 'https://www.trychroma.com',
  'Weaviate': 'https://weaviate.io',
  'Qdrant': 'https://qdrant.tech',
  'Milvus': 'https://milvus.io',
};

// 生成SQL
const sqlStatements = [];

companiesList.forEach(company => {
  const url = urlMap[company];
  if (url) {
    sqlStatements.push(`UPDATE companies SET website = '${url}' WHERE name = '${company}';`);
  } else {
    // 生成默认URL建议
    const domain = company.toLowerCase().replace(/[^a-z0-9]/g, '');
    sqlStatements.push(`-- TODO: ${company} → https://www.${domain}.com`);
  }
});

// 保存SQL文件
const sqlContent = `-- 完整的公司URL补齐SQL
-- 在Supabase SQL Editor中执行此脚本
-- 包含 ${companiesList.length} 个公司

${sqlStatements.join('\n')}

-- 查看更新结果
SELECT name, website, company_tier 
FROM companies 
WHERE website IS NOT NULL 
ORDER BY company_tier, name;
`;

fs.writeFileSync('UPDATE-ALL-COMPANIES-URLS.sql', sqlContent, 'utf-8');

console.log(`✅ 已生成SQL脚本: UPDATE-ALL-COMPANIES-URLS.sql`);
console.log(`📊 包含 ${sqlStatements.filter(s => !s.startsWith('--')).length} 个实际URL更新`);
console.log(`📝 包含 ${sqlStatements.filter(s => s.startsWith('--')).length} 个待补充URL`);
console.log('\n📋 执行方式:');
console.log('1. 在 Supabase SQL Editor 中执行 UPDATE-ALL-COMPANIES-URLS.sql');
console.log('2. 检查结果并手动补充缺失的URL');

