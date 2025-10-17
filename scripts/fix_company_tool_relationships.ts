import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://nineezxjxfzwnsdtgjcu.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5pbmVlenhqeGZ6d25zZHRnamN1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk4MjQ0OTgsImV4cCI6MjA3NTQwMDQ5OH0.Pv7q5NzDevRcL8QWpN5yf_Q-_J1XhYUEFFso3pmA_l8';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Companies that are synonymous with their main product/tool
const companyToolMappings = [
  // OpenAI products
  { company: 'OpenAI', tools: ['ChatGPT', 'DALL-E', 'Sora', 'GPT-4 API', 'Whisper'] },
  
  // Anthropic products
  { company: 'Anthropic', tools: ['Claude', 'Claude API'] },
  
  // Google products
  { company: 'Google', tools: ['Gemini', 'Gemini API', 'NotebookLM', 'AI Studio'] },
  
  // Microsoft products
  { company: 'Microsoft', tools: ['Copilot', 'Azure OpenAI'] },
  
  // Perplexity products
  { company: 'Perplexity AI', tools: ['Perplexity Pro', 'Perplexity API'] },
  
  // ElevenLabs products
  { company: 'ElevenLabs', tools: ['ElevenLabs Voice', 'ElevenLabs API'] },
  
  // Notion products
  { company: 'Notion', tools: ['Notion AI'] },
  
  // Canva products
  { company: 'Canva', tools: ['Magic Design', 'Magic Write'] },
  
  // Midjourney products
  { company: 'Midjourney', tools: ['Midjourney Bot'] },
  
  // Cursor products
  { company: 'Cursor', tools: ['Cursor Editor'] },
  
  // Replit products
  { company: 'Replit', tools: ['Replit Agent', 'Replit Workspace'] },
  
  // Lovable products
  { company: 'Lovable', tools: ['Lovable Platform'] },
  
  // Cognition products
  { company: 'Cognition', tools: ['Devin'] },
  
  // X/Twitter products
  { company: 'X (Twitter)', tools: ['Grok'] },
  
  // Meta products
  { company: 'Meta', tools: ['Meta AI', 'LLaMA'] },
  
  // Hugging Face products
  { company: 'Hugging Face', tools: ['Hugging Face Hub', 'Inference API'] },
  
  // Stability AI products
  { company: 'Stability AI', tools: ['Stable Diffusion', 'DreamStudio'] },
];

async function fixCompanyToolRelationships() {
  console.log('🔗 Starting company-tool relationship fixes...\n');

  try {
    // Get all companies and tools
    const [companiesResult, toolsResult] = await Promise.all([
      supabase.from('companies').select('id, name'),
      supabase.from('tools').select('id, name, company_id')
    ]);

    if (companiesResult.error) throw companiesResult.error;
    if (toolsResult.error) throw toolsResult.error;

    const companies = companiesResult.data || [];
    const tools = toolsResult.data || [];

    console.log(`Found ${companies.length} companies and ${tools.length} tools`);

    // Create company name to ID mapping
    const companyMap = new Map();
    companies.forEach(company => {
      companyMap.set(company.name.toLowerCase(), company.id);
    });

    // Create tool name to ID mapping
    const toolMap = new Map();
    tools.forEach(tool => {
      toolMap.set(tool.name.toLowerCase(), tool.id);
    });

    let updatedCount = 0;
    let createdCount = 0;

    // Process each company-tool mapping
    for (const mapping of companyToolMappings) {
      const companyId = companyMap.get(mapping.company.toLowerCase());
      
      if (!companyId) {
        console.log(`⚠️ Company not found: ${mapping.company}`);
        continue;
      }

      console.log(`\n🏢 Processing ${mapping.company}:`);

      for (const toolName of mapping.tools) {
        const toolId = toolMap.get(toolName.toLowerCase());
        
        if (!toolId) {
          console.log(`  ⚠️ Tool not found: ${toolName}`);
          continue;
        }

        // Check if tool already has a company_id
        const tool = tools.find(t => t.id === toolId);
        
        if (tool?.company_id) {
          if (tool.company_id === companyId) {
            console.log(`  ✅ ${toolName} already linked to ${mapping.company}`);
          } else {
            console.log(`  🔄 ${toolName} linked to different company, updating...`);
            const { error } = await supabase
              .from('tools')
              .update({ company_id: companyId })
              .eq('id', toolId);
            
            if (error) {
              console.log(`  ❌ Error updating ${toolName}: ${error.message}`);
            } else {
              console.log(`  ✅ Updated ${toolName} to link with ${mapping.company}`);
              updatedCount++;
            }
          }
        } else {
          console.log(`  🔗 Linking ${toolName} to ${mapping.company}...`);
          const { error } = await supabase
            .from('tools')
            .update({ company_id: companyId })
            .eq('id', toolId);
          
          if (error) {
            console.log(`  ❌ Error linking ${toolName}: ${error.message}`);
          } else {
            console.log(`  ✅ Linked ${toolName} to ${mapping.company}`);
            createdCount++;
          }
        }
      }
    }

    console.log(`\n📊 Summary:`);
    console.log(`  - Tools linked: ${createdCount}`);
    console.log(`  - Tools updated: ${updatedCount}`);
    console.log(`  - Total processed: ${createdCount + updatedCount}`);

  } catch (error) {
    console.error('❌ Error fixing company-tool relationships:', error);
  }
}

async function addMissingTools() {
  console.log('\n🛠️ Adding missing tools for companies...\n');

  try {
    // Get companies that don't have tools - using a different approach
    const { data: allCompanies, error: allCompaniesError } = await supabase
      .from('companies')
      .select('id, name, website');
    
    const { data: companiesWithTools, error: companiesWithToolsError } = await supabase
      .from('tools')
      .select('company_id')
      .not('company_id', 'is', null);

    if (allCompaniesError) throw allCompaniesError;
    if (companiesWithToolsError) throw companiesWithToolsError;

    const companiesWithToolsIds = new Set((companiesWithTools || []).map(t => t.company_id));
    const companiesWithoutTools = (allCompanies || []).filter(c => !companiesWithToolsIds.has(c.id));

    console.log(`Found ${companiesWithoutTools?.length || 0} companies without tools`);

    // Add tools for companies that are synonymous with their product
    const missingTools = [
      { company: '百度', toolName: '文心一言', category: 'LLM', website: 'https://yiyan.baidu.com' },
      { company: '阿里巴巴', toolName: '通义千问', category: 'LLM', website: 'https://tongyi.aliyun.com' },
      { company: '腾讯', toolName: '混元大模型', category: 'LLM', website: 'https://hunyuan.tencent.com' },
      { company: '字节跳动', toolName: '豆包', category: 'LLM', website: 'https://www.doubao.com' },
      { company: '商汤科技', toolName: '商量', category: 'LLM', website: 'https://chat.sensetime.com' },
      { company: '科大讯飞', toolName: '星火认知大模型', category: 'LLM', website: 'https://xinghuo.xfyun.cn' },
      { company: '旷视科技', toolName: 'Face++', category: 'Computer Vision', website: 'https://www.faceplusplus.com' },
      { company: '寒武纪科技', toolName: 'MLU', category: 'AI Chip', website: 'https://www.cambricon.com' },
      { company: '优必选科技', toolName: 'Walker X', category: 'Robotics', website: 'https://www.ubtrobot.com' },
      { company: 'MiniMax', toolName: 'abab', category: 'LLM', website: 'https://www.minimax.com' },
      { company: '智谱AI', toolName: 'ChatGLM', category: 'LLM', website: 'https://www.zhipuai.cn' },
      { company: '月之暗面', toolName: 'Kimi', category: 'LLM', website: 'https://kimi.moonshot.cn' },
      { company: '零一万物', toolName: 'Yi', category: 'LLM', website: 'https://www.01.ai' },
      { company: '百川智能', toolName: 'Baichuan', category: 'LLM', website: 'https://www.baichuan-ai.com' },
      { company: '深言科技', toolName: 'DeepSeek', category: 'LLM', website: 'https://www.deepseek.com' },
      { company: '来也科技', toolName: 'UiBot', category: 'RPA', website: 'https://www.laiye.com' },
      { company: '第四范式', toolName: 'Sage', category: 'ML Platform', website: 'https://www.4paradigm.com' },
      { company: '云从科技', toolName: '云从AI', category: 'Computer Vision', website: 'https://www.cloudwalk.cn' },
      { company: '依图科技', toolName: '依图AI', category: 'Computer Vision', website: 'https://www.yitutech.com' },
      { company: '思必驰', toolName: 'DUI', category: 'Voice AI', website: 'https://www.aichat.com' },
    ];

    let addedCount = 0;

    for (const { company, toolName, category, website } of missingTools) {
      // Find company
      const { data: companyData, error: companyError } = await supabase
        .from('companies')
        .select('id')
        .eq('name', company)
        .single();

      if (companyError || !companyData) {
        console.log(`⚠️ Company not found: ${company}`);
        continue;
      }

      // Check if tool already exists
      const { data: existingTool } = await supabase
        .from('tools')
        .select('id')
        .eq('name', toolName)
        .single();

      if (existingTool) {
        console.log(`✅ Tool already exists: ${toolName}`);
        continue;
      }

      // Add the tool
      const { error: insertError } = await supabase
        .from('tools')
        .insert({
          name: toolName,
          company_id: companyData.id,
          category,
          website,
          description: `${toolName}是${company}开发的核心AI产品，提供先进的AI能力。`,
          pricing_model: 'Freemium',
          features: ['AI能力', '多模态支持', 'API接口'],
          industry_tags: ['AI', 'LLM', 'Enterprise'],
          api_available: true,
          free_tier: true
        });

      if (insertError) {
        console.log(`❌ Error adding tool ${toolName}: ${insertError.message}`);
      } else {
        console.log(`✅ Added tool: ${toolName} for ${company}`);
        addedCount++;
      }
    }

    console.log(`\n📊 Added ${addedCount} new tools`);

  } catch (error) {
    console.error('❌ Error adding missing tools:', error);
  }
}

async function main() {
  console.log('🚀 Starting company-tool relationship optimization...\n');
  
  await fixCompanyToolRelationships();
  await addMissingTools();
  
  console.log('\n✅ Company-tool relationship optimization completed!');
}

main().catch(console.error);
