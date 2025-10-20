import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://nineezxjxfzwnsdtgjcu.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5pbmVlenhqeGZ6d25zZHRnamN1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk4MjQ0OTgsImV4cCI6MjA3NTQwMDQ5OH0.Pv7q5NzDevRcL8QWpN5yf_Q-_J1XhYUEFFso3pmA_l8';

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false }
});

// Comprehensive company categorization and optimization
const companyOptimizations = {
  // Major AI Platforms & Infrastructure
  'OpenAI': {
    category: 'AI Platforms',
    priority: 1,
    description: 'Leading AI research company behind GPT, DALL-E, and ChatGPT, pioneering artificial general intelligence',
    industry_tags: ['AI Platforms', 'LLM', 'Generative AI', 'Research'],
    tools_optimization: [
      { name: 'GPT-4', description: 'Advanced large language model with multimodal capabilities' },
      { name: 'ChatGPT', description: 'Conversational AI assistant for various tasks' },
      { name: 'DALL-E', description: 'AI image generation model' },
      { name: 'Whisper', description: 'Speech recognition and transcription model' },
      { name: 'Codex', description: 'AI code generation and completion' }
    ]
  },
  'Google': {
    category: 'AI Platforms',
    priority: 1,
    description: 'Tech giant with comprehensive AI ecosystem including Bard, Gemini, and cloud AI services',
    industry_tags: ['AI Platforms', 'Cloud AI', 'Search AI', 'Enterprise AI'],
    tools_optimization: [
      { name: 'Gemini', description: 'Multimodal AI model for text, image, and code understanding' },
      { name: 'Bard', description: 'Conversational AI assistant integrated with Google services' },
      { name: 'Google Cloud AI', description: 'Enterprise AI platform and services' },
      { name: 'TensorFlow', description: 'Open-source machine learning framework' },
      { name: 'Google Translate', description: 'AI-powered translation service' }
    ]
  },
  'Microsoft': {
    category: 'AI Platforms',
    priority: 1,
    description: 'Enterprise AI leader with Azure AI, Copilot, and OpenAI partnership',
    industry_tags: ['AI Platforms', 'Enterprise AI', 'Productivity AI', 'Cloud AI'],
    tools_optimization: [
      { name: 'Copilot', description: 'AI assistant integrated across Microsoft products' },
      { name: 'Azure AI', description: 'Cloud-based AI services and platform' },
      { name: 'GitHub Copilot', description: 'AI pair programmer for code generation' },
      { name: 'Bing Chat', description: 'AI-powered search and conversation' }
    ]
  },
  'Meta': {
    category: 'AI Platforms',
    priority: 1,
    description: 'Social media giant advancing AI research with LLaMA, Meta AI, and VR/AR integration',
    industry_tags: ['AI Platforms', 'Social AI', 'VR/AR AI', 'Open Source'],
    tools_optimization: [
      { name: 'LLaMA', description: 'Large language model for research and applications' },
      { name: 'Meta AI', description: 'AI assistant integrated in Meta platforms' },
      { name: 'Segment Anything', description: 'AI model for image segmentation' },
      { name: 'Code Llama', description: 'AI model specialized for code generation' }
    ]
  },

  // Chinese AI Leaders
  '百度': {
    category: 'AI Platforms',
    priority: 1,
    description: 'Chinese AI leader with ERNIE, autonomous driving, and comprehensive AI ecosystem',
    industry_tags: ['AI Platforms', 'Chinese AI', 'Autonomous Driving', 'Search AI'],
    tools_optimization: [
      { name: '文心一言', description: 'Large language model for Chinese language understanding' },
      { name: 'Apollo', description: 'Autonomous driving platform' },
      { name: 'PaddlePaddle', description: 'Deep learning framework' }
    ]
  },
  '阿里巴巴': {
    category: 'AI Platforms',
    priority: 1,
    description: 'E-commerce and cloud AI leader with Tongyi Qianwen and comprehensive business AI solutions',
    industry_tags: ['AI Platforms', 'Chinese AI', 'E-commerce AI', 'Cloud AI'],
    tools_optimization: [
      { name: '通义千问', description: 'Large language model for business applications' },
      { name: '阿里云AI', description: 'Cloud AI services and platform' }
    ]
  },
  '腾讯': {
    category: 'AI Platforms',
    priority: 1,
    description: 'Social and gaming AI leader with Hunyuan and comprehensive digital ecosystem',
    industry_tags: ['AI Platforms', 'Chinese AI', 'Gaming AI', 'Social AI'],
    tools_optimization: [
      { name: '混元大模型', description: 'Multimodal AI model for various applications' },
      { name: '腾讯云AI', description: 'Cloud AI services and solutions' }
    ]
  },

  // AI Development Tools
  'Hugging Face': {
    category: 'AI Development',
    priority: 2,
    description: 'Open-source AI community and model hub, democratizing access to AI models and tools',
    industry_tags: ['AI Development', 'Open Source', 'Model Hub', 'MLOps'],
    tools_optimization: [
      { name: 'Hugging Face Hub', description: 'Platform for sharing and discovering AI models' },
      { name: 'Transformers', description: 'Library for state-of-the-art NLP models' },
      { name: 'Inference API', description: 'Easy-to-use API for running AI models' },
      { name: 'Datasets', description: 'Library for accessing and sharing datasets' }
    ]
  },
  'Anthropic': {
    category: 'AI Development',
    priority: 2,
    description: 'AI safety-focused company behind Claude, advancing helpful and harmless AI systems',
    industry_tags: ['AI Development', 'AI Safety', 'LLM', 'Research'],
    tools_optimization: [
      { name: 'Claude', description: 'AI assistant focused on helpfulness and safety' },
      { name: 'Constitutional AI', description: 'AI training methodology for alignment' }
    ]
  },
  'Cohere': {
    category: 'AI Development',
    priority: 2,
    description: 'Enterprise-focused AI company providing language models and AI tools for businesses',
    industry_tags: ['AI Development', 'Enterprise AI', 'LLM', 'Business AI'],
    tools_optimization: [
      { name: 'Command', description: 'Large language model for enterprise applications' },
      { name: 'Embed', description: 'Text embedding model for semantic search' },
      { name: 'Classify', description: 'Text classification API' }
    ]
  },

  // Creative AI Tools
  'Midjourney': {
    category: 'Creative AI',
    priority: 2,
    description: 'Leading AI image generation platform known for artistic and creative visual outputs',
    industry_tags: ['Creative AI', 'Image Generation', 'Art AI', 'Design'],
    tools_optimization: [
      { name: 'Midjourney', description: 'AI image generation with artistic focus' }
    ]
  },
  'Stability AI': {
    category: 'Creative AI',
    priority: 2,
    description: 'Open-source AI company behind Stable Diffusion, democratizing image generation',
    industry_tags: ['Creative AI', 'Image Generation', 'Open Source', 'Video AI'],
    tools_optimization: [
      { name: 'Stable Diffusion', description: 'Open-source image generation model' },
      { name: 'DreamStudio', description: 'Web interface for Stable Diffusion' },
      { name: 'Stable Video Diffusion', description: 'AI video generation model' }
    ]
  },
  'Runway': {
    category: 'Creative AI',
    priority: 2,
    description: 'Creative AI platform specializing in video generation, editing, and multimedia content creation',
    industry_tags: ['Creative AI', 'Video AI', 'Content Creation', 'Multimedia'],
    tools_optimization: [
      { name: 'Runway', description: 'AI-powered video editing and generation platform' },
      { name: 'Gen-2', description: 'Text-to-video generation model' }
    ]
  },

  // Enterprise AI Solutions
  'Databricks': {
    category: 'Enterprise AI',
    priority: 2,
    description: 'Unified analytics platform for big data and AI, enabling data-driven decision making',
    industry_tags: ['Enterprise AI', 'Data Analytics', 'MLOps', 'Big Data'],
    tools_optimization: [
      { name: 'Databricks', description: 'Unified analytics platform for data and AI' },
      { name: 'MLflow', description: 'Machine learning lifecycle management' },
      { name: 'Delta Lake', description: 'Data lakehouse platform' }
    ]
  },
  'Scale AI': {
    category: 'Enterprise AI',
    priority: 2,
    description: 'AI data platform providing high-quality training data and AI infrastructure for enterprises',
    industry_tags: ['Enterprise AI', 'Data Platform', 'AI Infrastructure', 'Training Data'],
    tools_optimization: [
      { name: 'Scale AI', description: 'AI data platform for training and validation' }
    ]
  },

  // Specialized AI Tools
  'ElevenLabs': {
    category: 'Specialized AI',
    priority: 3,
    description: 'AI voice synthesis platform creating realistic and expressive speech from text',
    industry_tags: ['Specialized AI', 'Voice AI', 'Audio Generation', 'Synthesis'],
    tools_optimization: [
      { name: 'ElevenLabs', description: 'AI voice synthesis and cloning platform' }
    ]
  },
  'Perplexity AI': {
    category: 'Specialized AI',
    priority: 3,
    description: 'AI-powered search engine providing accurate answers with source citations',
    industry_tags: ['Specialized AI', 'Search AI', 'Information Retrieval', 'Research'],
    tools_optimization: [
      { name: 'Perplexity', description: 'AI-powered search engine with citations' }
    ]
  }
};

async function optimizeCompanyCatalog() {
  console.log('🚀 Starting comprehensive company catalog optimization...\n');

  try {
    // Disable RLS temporarily
    try {
      await supabase.rpc('exec_sql', { 
        sql: 'ALTER TABLE public.companies DISABLE ROW LEVEL SECURITY;' 
      });
      await supabase.rpc('exec_sql', { 
        sql: 'ALTER TABLE public.tools DISABLE ROW LEVEL SECURITY;' 
      });
    } catch (error) {
      console.log('Note: RLS disable may need to be done manually in SQL Editor');
    }

    // Get all companies and their tools
    const { data: companies, error: companiesError } = await supabase
      .from('companies')
      .select(`
        id, name, name_en, name_zh_hans, name_zh_hant,
        description, description_en, description_zh_hans, description_zh_hant,
        website, logo_url, industry_tags, created_at
      `)
      .order('name');

    if (companiesError) throw companiesError;

    const { data: tools, error: toolsError } = await supabase
      .from('tools')
      .select('id, name, company_id, description, description_en, description_zh_hans, description_zh_hant')
      .order('name');

    if (toolsError) throw toolsError;

    console.log(`📊 Found ${companies.length} companies and ${tools.length} tools`);

    // Group tools by company
    const toolsByCompany = new Map<string, typeof tools>();
    tools.forEach(tool => {
      if (!toolsByCompany.has(tool.company_id)) {
        toolsByCompany.set(tool.company_id, []);
      }
      toolsByCompany.get(tool.company_id)?.push(tool);
    });

    let optimizedCount = 0;
    let toolsOptimizedCount = 0;

    // Optimize each company
    for (const company of companies) {
      const companyKey = company.name.toLowerCase().trim();
      const optimization = companyOptimizations[companyKey as keyof typeof companyOptimizations];

      if (optimization) {
        console.log(`\n🔧 Optimizing: ${company.name}`);
        
        // Update company information
        const updateData: any = {
          industry_tags: optimization.industry_tags,
          updated_at: new Date().toISOString()
        };

        // Update descriptions if they're missing or too short
        if (!company.description || company.description.length < 50) {
          updateData.description = optimization.description;
          updateData.description_en = optimization.description;
          updateData.description_zh_hans = `${optimization.description} (中文描述待完善)`;
          updateData.description_zh_hant = `${optimization.description} (繁體中文描述待完善)`;
        }

        const { error: updateError } = await supabase
          .from('companies')
          .update(updateData)
          .eq('id', company.id);

        if (updateError) {
          console.error(`  ❌ Error updating company: ${updateError.message}`);
        } else {
          console.log(`  ✅ Updated company information`);
          optimizedCount++;
        }

        // Optimize tools
        const companyTools = toolsByCompany.get(company.id) || [];
        console.log(`  📋 Found ${companyTools.length} tools for this company`);

        for (const toolOptimization of optimization.tools_optimization) {
          // Find existing tool or create new one
          let existingTool = companyTools.find(tool => 
            tool.name.toLowerCase().includes(toolOptimization.name.toLowerCase()) ||
            toolOptimization.name.toLowerCase().includes(tool.name.toLowerCase())
          );

          if (existingTool) {
            // Update existing tool
            const toolUpdateData: any = {
              description: toolOptimization.description,
              description_en: toolOptimization.description,
              description_zh_hans: `${toolOptimization.description} (中文描述待完善)`,
              description_zh_hant: `${toolOptimization.description} (繁體中文描述待完善)`,
              updated_at: new Date().toISOString()
            };

            const { error: toolUpdateError } = await supabase
              .from('tools')
              .update(toolUpdateData)
              .eq('id', existingTool.id);

            if (toolUpdateError) {
              console.error(`    ❌ Error updating tool ${existingTool.name}: ${toolUpdateError.message}`);
            } else {
              console.log(`    ✅ Updated tool: ${existingTool.name}`);
              toolsOptimizedCount++;
            }
          } else {
            // Create new tool if it doesn't exist
            const newToolData = {
              name: toolOptimization.name,
              company_id: company.id,
              description: toolOptimization.description,
              description_en: toolOptimization.description,
              description_zh_hans: `${toolOptimization.description} (中文描述待完善)`,
              description_zh_hant: `${toolOptimization.description} (繁體中文描述待完善)`,
              pricing_model: 'Unknown',
              launch_date: company.created_at,
              industry_tags: optimization.industry_tags,
              features: ['Core functionality'],
              api_available: false,
              free_tier: false,
              logo_url: null
            };

            const { error: createError } = await supabase
              .from('tools')
              .insert(newToolData);

            if (createError) {
              console.error(`    ❌ Error creating tool ${toolOptimization.name}: ${createError.message}`);
            } else {
              console.log(`    ✅ Created new tool: ${toolOptimization.name}`);
              toolsOptimizedCount++;
            }
          }
        }
      }
    }

    // Add category-based organization
    console.log('\n📊 Adding category-based organization...');
    
    const categoryUpdates = [
      { category: 'AI Platforms', companies: ['OpenAI', 'Google', 'Microsoft', 'Meta', '百度', '阿里巴巴', '腾讯'] },
      { category: 'AI Development', companies: ['Hugging Face', 'Anthropic', 'Cohere', 'Mistral AI'] },
      { category: 'Creative AI', companies: ['Midjourney', 'Stability AI', 'Runway', 'Pika Labs', 'Luma AI'] },
      { category: 'Enterprise AI', companies: ['Databricks', 'Scale AI', 'Palantir', 'C3.ai'] },
      { category: 'Specialized AI', companies: ['ElevenLabs', 'Perplexity AI', 'Notion', 'Cursor'] }
    ];

    for (const categoryUpdate of categoryUpdates) {
      for (const companyName of categoryUpdate.companies) {
        const company = companies.find(c => 
          c.name.toLowerCase().includes(companyName.toLowerCase()) ||
          c.name_en?.toLowerCase().includes(companyName.toLowerCase())
        );

        if (company) {
          const { error: categoryError } = await supabase
            .from('companies')
            .update({ 
              industry_tags: [...(company.industry_tags || []), categoryUpdate.category],
              updated_at: new Date().toISOString()
            })
            .eq('id', company.id);

          if (!categoryError) {
            console.log(`  ✅ Added category "${categoryUpdate.category}" to ${company.name}`);
          }
        }
      }
    }

    // Final statistics
    console.log('\n📈 OPTIMIZATION SUMMARY:');
    console.log(`  - Companies optimized: ${optimizedCount}`);
    console.log(`  - Tools optimized/created: ${toolsOptimizedCount}`);
    console.log(`  - Categories applied: ${categoryUpdates.length}`);

    // Verify final state
    const { data: finalCompanies, error: finalError } = await supabase
      .from('companies')
      .select('id, name, industry_tags')
      .not('industry_tags', 'is', null);

    if (!finalError) {
      console.log(`\n📊 Final state: ${finalCompanies.length} companies with categories`);
      
      // Show category distribution
      const categoryCount = new Map<string, number>();
      finalCompanies.forEach(company => {
        company.industry_tags?.forEach(tag => {
          categoryCount.set(tag, (categoryCount.get(tag) || 0) + 1);
        });
      });

      console.log('\n📋 Category distribution:');
      Array.from(categoryCount.entries())
        .sort((a, b) => b[1] - a[1])
        .forEach(([category, count]) => {
          console.log(`  - ${category}: ${count} companies`);
        });
    }

  } catch (error: any) {
    console.error('❌ Error during optimization:', error.message);
  } finally {
    console.log('\n✅ Company catalog optimization completed!');
  }
}

optimizeCompanyCatalog().catch(console.error);
