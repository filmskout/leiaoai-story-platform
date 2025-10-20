import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://nineezxjxfzwnsdtgjcu.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5pbmVlenhqeGZ6d25zZHRnamN1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk4MjQ0OTgsImV4cCI6MjA3NTQwMDQ5OH0.Pv7q5NzDevRcL8QWpN5yf_Q-_J1XhYUEFFso3pmA_l8';

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false }
});

// AI大厂定义 - 具有大规模资源和影响力的科技巨头
const AI_GIANTS = {
  // 国际大厂
  'OpenAI': {
    type: 'AI Giant',
    tier: 'Tier 1',
    description: 'Leading AI research company behind GPT, DALL-E, and ChatGPT, pioneering artificial general intelligence',
    market_cap: '>$100B',
    employees: '1000+',
    funding: 'Private',
    focus_areas: ['LLM', 'Generative AI', 'Research', 'AGI']
  },
  'Google': {
    type: 'AI Giant',
    tier: 'Tier 1',
    description: 'Tech giant with comprehensive AI ecosystem including Bard, Gemini, and cloud AI services',
    market_cap: '$1.8T',
    employees: '190,000+',
    funding: 'Public',
    focus_areas: ['Search AI', 'Cloud AI', 'Enterprise AI', 'Multimodal AI']
  },
  'Microsoft': {
    type: 'AI Giant',
    tier: 'Tier 1',
    description: 'Enterprise AI leader with Azure AI, Copilot, and OpenAI partnership',
    market_cap: '$3.0T',
    employees: '220,000+',
    funding: 'Public',
    focus_areas: ['Enterprise AI', 'Productivity AI', 'Cloud AI', 'Copilot']
  },
  'Meta': {
    type: 'AI Giant',
    tier: 'Tier 1',
    description: 'Social media giant advancing AI research with LLaMA, Meta AI, and VR/AR integration',
    market_cap: '$1.2T',
    employees: '77,000+',
    funding: 'Public',
    focus_areas: ['Social AI', 'VR/AR AI', 'Open Source', 'LLM']
  },
  'Apple': {
    type: 'AI Giant',
    tier: 'Tier 1',
    description: 'Consumer tech leader integrating AI into devices and services',
    market_cap: '$3.0T',
    employees: '164,000+',
    funding: 'Public',
    focus_areas: ['Consumer AI', 'Device AI', 'Privacy AI', 'Siri']
  },
  'Amazon': {
    type: 'AI Giant',
    tier: 'Tier 1',
    description: 'E-commerce and cloud leader with AWS AI services and Alexa',
    market_cap: '$1.8T',
    employees: '1.5M+',
    funding: 'Public',
    focus_areas: ['Cloud AI', 'E-commerce AI', 'Voice AI', 'AWS AI']
  },

  // 中国大厂
  '百度': {
    type: 'AI Giant',
    tier: 'Tier 1',
    description: 'Chinese AI leader with ERNIE, autonomous driving, and comprehensive AI ecosystem',
    market_cap: '$30B',
    employees: '45,000+',
    funding: 'Public',
    focus_areas: ['Chinese AI', 'Autonomous Driving', 'Search AI', 'LLM']
  },
  '阿里巴巴': {
    type: 'AI Giant',
    tier: 'Tier 1',
    description: 'E-commerce and cloud AI leader with Tongyi Qianwen and comprehensive business AI solutions',
    market_cap: '$200B',
    employees: '250,000+',
    funding: 'Public',
    focus_areas: ['E-commerce AI', 'Cloud AI', 'Business AI', 'Chinese AI']
  },
  '腾讯': {
    type: 'AI Giant',
    tier: 'Tier 1',
    description: 'Social and gaming AI leader with Hunyuan and comprehensive digital ecosystem',
    market_cap: '$400B',
    employees: '116,000+',
    funding: 'Public',
    focus_areas: ['Gaming AI', 'Social AI', 'Digital AI', 'Chinese AI']
  },
  '字节跳动': {
    type: 'AI Giant',
    tier: 'Tier 1',
    description: 'Content and social media AI leader with Doubao and recommendation systems',
    market_cap: '$220B',
    employees: '150,000+',
    funding: 'Private',
    focus_areas: ['Content AI', 'Recommendation AI', 'Social AI', 'Chinese AI']
  },

  // Tier 2 AI Giants
  'NVIDIA': {
    type: 'AI Giant',
    tier: 'Tier 2',
    description: 'GPU and AI infrastructure leader powering AI development worldwide',
    market_cap: '$1.2T',
    employees: '26,000+',
    funding: 'Public',
    focus_areas: ['AI Hardware', 'GPU Computing', 'AI Infrastructure', 'Deep Learning']
  },
  'Tesla': {
    type: 'AI Giant',
    tier: 'Tier 2',
    description: 'Autonomous driving and robotics AI leader with FSD and Optimus',
    market_cap: '$800B',
    employees: '140,000+',
    funding: 'Public',
    focus_areas: ['Autonomous Driving', 'Robotics AI', 'Computer Vision', 'Neural Networks']
  }
};

// 独立AI公司定义 - 专注于特定AI领域的创新公司
const INDEPENDENT_AI_COMPANIES = {
  // LLM和对话AI
  'Anthropic': {
    type: 'Independent AI',
    category: 'LLM & Conversational AI',
    description: 'AI safety-focused company behind Claude, advancing helpful and harmless AI systems',
    valuation: '$18B',
    employees: '500+',
    funding: 'Series C',
    focus_areas: ['AI Safety', 'LLM', 'Constitutional AI', 'Research']
  },
  'Cohere': {
    type: 'Independent AI',
    category: 'LLM & Conversational AI',
    description: 'Enterprise-focused AI company providing language models and AI tools for businesses',
    valuation: '$2.2B',
    employees: '200+',
    funding: 'Series C',
    focus_areas: ['Enterprise AI', 'LLM', 'Business AI', 'API']
  },
  'Mistral AI': {
    type: 'Independent AI',
    category: 'LLM & Conversational AI',
    description: 'European AI company developing efficient large language models with open-source focus',
    valuation: '$6B',
    employees: '100+',
    funding: 'Series A',
    focus_areas: ['Open Source AI', 'LLM', 'European AI', 'Efficient Models']
  },

  // 图像/视频生成和处理
  'Midjourney': {
    type: 'Independent AI',
    category: 'Image & Video Generation',
    description: 'Leading AI image generation platform known for artistic and creative visual outputs',
    valuation: '$10B',
    employees: '50+',
    funding: 'Series A',
    focus_areas: ['Image Generation', 'Art AI', 'Creative AI', 'Visual Content']
  },
  'Stability AI': {
    type: 'Independent AI',
    category: 'Image & Video Generation',
    description: 'Open-source AI company behind Stable Diffusion, democratizing image generation',
    valuation: '$1B',
    employees: '200+',
    funding: 'Series A',
    focus_areas: ['Open Source AI', 'Image Generation', 'Video AI', 'Diffusion Models']
  },
  'Runway': {
    type: 'Independent AI',
    category: 'Image & Video Generation',
    description: 'Creative AI platform specializing in video generation, editing, and multimedia content creation',
    valuation: '$1.5B',
    employees: '150+',
    funding: 'Series C',
    focus_areas: ['Video AI', 'Creative AI', 'Content Creation', 'Multimedia']
  },
  'Pika Labs': {
    type: 'Independent AI',
    category: 'Image & Video Generation',
    description: 'AI video generation platform creating high-quality video content from text and images',
    valuation: '$500M',
    employees: '50+',
    funding: 'Series A',
    focus_areas: ['Video Generation', 'Text-to-Video', 'Creative AI', 'High Quality']
  },
  'Luma AI': {
    type: 'Independent AI',
    category: 'Image & Video Generation',
    description: '3D content creation platform using AI for realistic 3D models and environments',
    valuation: '$300M',
    employees: '30+',
    funding: 'Series A',
    focus_areas: ['3D AI', 'Content Creation', 'Computer Vision', '3D Models']
  },

  // 专业领域分析
  'Palantir': {
    type: 'Independent AI',
    category: 'Professional Domain Analysis',
    description: 'Big data analytics company using AI for government and commercial data analysis',
    valuation: '$20B',
    employees: '3,000+',
    funding: 'Public',
    focus_areas: ['Data Analytics', 'Government AI', 'Enterprise AI', 'Pattern Recognition']
  },
  'Scale AI': {
    type: 'Independent AI',
    category: 'Professional Domain Analysis',
    description: 'AI data platform providing high-quality training data and AI infrastructure for enterprises',
    valuation: '$7.3B',
    employees: '1,000+',
    funding: 'Series E',
    focus_areas: ['Data Platform', 'AI Infrastructure', 'Training Data', 'Enterprise AI']
  },
  'Databricks': {
    type: 'Independent AI',
    category: 'Professional Domain Analysis',
    description: 'Unified analytics platform for big data and AI, enabling data-driven decision making',
    valuation: '$43B',
    employees: '6,000+',
    funding: 'Series I',
    focus_areas: ['Data Analytics', 'MLOps', 'Big Data', 'Enterprise AI']
  },

  // 拟人陪伴和虚拟助手
  'Character.AI': {
    type: 'Independent AI',
    category: 'Virtual Companions & Assistants',
    description: 'AI character platform creating personalized virtual companions and chatbots',
    valuation: '$1B',
    employees: '100+',
    funding: 'Series A',
    focus_areas: ['Virtual Companions', 'Character AI', 'Conversational AI', 'Personalization']
  },
  'Replika': {
    type: 'Independent AI',
    category: 'Virtual Companions & Assistants',
    description: 'AI companion app providing emotional support and personalized conversations',
    valuation: '$200M',
    employees: '50+',
    funding: 'Series A',
    focus_areas: ['Emotional AI', 'Virtual Companions', 'Mental Health', 'Personalization']
  },
  'Synthesia': {
    type: 'Independent AI',
    category: 'Virtual Companions & Assistants',
    description: 'AI video generation platform creating virtual presenters and avatars for business',
    valuation: '$1B',
    employees: '200+',
    funding: 'Series C',
    focus_areas: ['Virtual Presenters', 'AI Avatars', 'Video AI', 'Business AI']
  },

  // 语音和音频AI
  'ElevenLabs': {
    type: 'Independent AI',
    category: 'Voice & Audio AI',
    description: 'AI voice synthesis platform creating realistic and expressive speech from text',
    valuation: '$1.1B',
    employees: '50+',
    funding: 'Series B',
    focus_areas: ['Voice AI', 'Speech Synthesis', 'Audio Generation', 'Voice Cloning']
  },

  // 搜索和信息检索
  'Perplexity AI': {
    type: 'Independent AI',
    category: 'Search & Information Retrieval',
    description: 'AI-powered search engine providing accurate answers with source citations',
    valuation: '$1B',
    employees: '100+',
    funding: 'Series B',
    focus_areas: ['Search AI', 'Information Retrieval', 'Research AI', 'Citations']
  }
};

// 工具细分领域分类
const TOOL_CATEGORIES = {
  // 主流大模型
  'LLM & Language Models': {
    description: 'Large Language Models and text generation tools',
    subcategories: ['GPT Models', 'Claude Models', 'Gemini Models', 'Open Source LLMs', 'Specialized LLMs'],
    examples: ['GPT-4', 'Claude', 'Gemini', 'LLaMA', 'Mistral', '文心一言', '通义千问']
  },

  // 图像处理、识别、生成
  'Image Processing & Generation': {
    description: 'AI tools for image analysis, recognition, and generation',
    subcategories: ['Image Generation', 'Image Recognition', 'Image Editing', 'Computer Vision', 'Art Generation'],
    examples: ['DALL-E', 'Midjourney', 'Stable Diffusion', 'DreamStudio', 'Face++', 'Image Recognition APIs']
  },

  // 视频处理、识别、生成
  'Video Processing & Generation': {
    description: 'AI tools for video analysis, editing, and generation',
    subcategories: ['Video Generation', 'Video Editing', 'Video Analysis', 'Motion Graphics', '3D Video'],
    examples: ['Runway', 'Pika Labs', 'Stable Video Diffusion', 'Synthesia', 'Luma AI', 'Video Editing AI']
  },

  // 专业领域分析
  'Professional Domain Analysis': {
    description: 'AI tools for specialized industry analysis and decision making',
    subcategories: ['Financial Analysis', 'Healthcare AI', 'Legal AI', 'Scientific Research', 'Business Intelligence'],
    examples: ['Financial AI', 'Medical Diagnosis AI', 'Legal Document Analysis', 'Research AI', 'Business Analytics']
  },

  // 拟人陪伴
  'Virtual Companions': {
    description: 'AI companions and emotional support systems',
    subcategories: ['Chat Companions', 'Emotional Support', 'Character AI', 'Personalization', 'Mental Health'],
    examples: ['Character.AI', 'Replika', 'Virtual Friends', 'Emotional AI', 'Personalized Companions']
  },

  // 虚拟员工/助手
  'Virtual Employees & Assistants': {
    description: 'AI-powered virtual workers and productivity assistants',
    subcategories: ['Virtual Assistants', 'Customer Service AI', 'Sales AI', 'HR AI', 'Administrative AI'],
    examples: ['Virtual Customer Service', 'AI Sales Reps', 'HR Assistants', 'Administrative AI', 'Workflow Automation']
  },

  // 语音和音频
  'Voice & Audio AI': {
    description: 'AI tools for speech processing, synthesis, and audio generation',
    subcategories: ['Speech Recognition', 'Speech Synthesis', 'Voice Cloning', 'Audio Generation', 'Music AI'],
    examples: ['Whisper', 'ElevenLabs', 'Voice Cloning', 'Music Generation', 'Audio Processing']
  },

  // 搜索和信息检索
  'Search & Information Retrieval': {
    description: 'AI-powered search and information processing tools',
    subcategories: ['AI Search', 'Document Analysis', 'Knowledge Graphs', 'Information Extraction', 'Research AI'],
    examples: ['Perplexity', 'AI Search Engines', 'Document AI', 'Knowledge Extraction', 'Research Assistants']
  }
};

async function categorizeCompaniesAndTools() {
  console.log('🚀 Starting comprehensive company and tool categorization...\n');

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

    // Get all companies and tools
    const { data: companies, error: companiesError } = await supabase
      .from('companies')
      .select(`
        id, name, name_en, name_zh_hans, name_zh_hant,
        description, description_en, description_zh_hans, description_zh_hant,
        website, logo_url, industry_tags, valuation_usd, founded_year
      `)
      .order('name');

    if (companiesError) throw companiesError;

    const { data: tools, error: toolsError } = await supabase
      .from('tools')
      .select('id, name, company_id, description, description_en, description_zh_hans, description_zh_hant, industry_tags')
      .order('name');

    if (toolsError) throw toolsError;

    console.log(`📊 Found ${companies.length} companies and ${tools.length} tools`);

    let companiesUpdated = 0;
    let toolsUpdated = 0;

    // Categorize companies
    console.log('\n🏢 CATEGORIZING COMPANIES...');
    for (const company of companies) {
      const companyKey = company.name.toLowerCase().trim();
      const aiGiantInfo = AI_GIANTS[companyKey as keyof typeof AI_GIANTS];
      const independentInfo = INDEPENDENT_AI_COMPANIES[companyKey as keyof typeof INDEPENDENT_AI_COMPANIES];

      let updateData: any = {
        updated_at: new Date().toISOString()
      };

      if (aiGiantInfo) {
        updateData.company_type = aiGiantInfo.type;
        updateData.company_tier = aiGiantInfo.tier;
        updateData.company_category = 'AI Giant';
        updateData.focus_areas = aiGiantInfo.focus_areas;
        
        // Update description with tier information
        updateData.description = `${aiGiantInfo.description} (${aiGiantInfo.tier} AI Giant)`;
        updateData.description_en = `${aiGiantInfo.description} (${aiGiantInfo.tier} AI Giant)`;
        updateData.description_zh_hans = `${aiGiantInfo.description} (${aiGiantInfo.tier} AI巨头)`;
        updateData.description_zh_hant = `${aiGiantInfo.description} (${aiGiantInfo.tier} AI巨頭)`;

        console.log(`  ✅ ${company.name} → AI Giant (${aiGiantInfo.tier})`);
        companiesUpdated++;
      } else if (independentInfo) {
        updateData.company_type = independentInfo.type;
        updateData.company_tier = 'Independent';
        updateData.company_category = independentInfo.category;
        updateData.focus_areas = independentInfo.focus_areas;
        
        // Update description with category information
        updateData.description = `${independentInfo.description} (Independent AI - ${independentInfo.category})`;
        updateData.description_en = `${independentInfo.description} (Independent AI - ${independentInfo.category})`;
        updateData.description_zh_hans = `${independentInfo.description} (独立AI - ${independentInfo.category})`;
        updateData.description_zh_hant = `${independentInfo.description} (獨立AI - ${independentInfo.category})`;

        console.log(`  ✅ ${company.name} → Independent AI (${independentInfo.category})`);
        companiesUpdated++;
      } else {
        // Default categorization for other companies
        updateData.company_type = 'AI Company';
        updateData.company_tier = 'Emerging';
        updateData.company_category = 'Specialized AI';
        updateData.focus_areas = ['AI Innovation'];

        console.log(`  📝 ${company.name} → Emerging AI Company`);
        companiesUpdated++;
      }

      // Update company
      const { error: updateError } = await supabase
        .from('companies')
        .update(updateData)
        .eq('id', company.id);

      if (updateError) {
        console.error(`    ❌ Error updating company ${company.name}: ${updateError.message}`);
      }
    }

    // Categorize tools
    console.log('\n🛠️ CATEGORIZING TOOLS...');
    for (const tool of tools) {
      let toolCategory = 'General AI';
      let toolSubcategory = 'AI Tools';
      let focusAreas: string[] = [];

      // Determine tool category based on name and description
      const toolName = tool.name.toLowerCase();
      const toolDesc = (tool.description || '').toLowerCase();

      if (toolName.includes('gpt') || toolName.includes('claude') || toolName.includes('gemini') || 
          toolName.includes('llama') || toolName.includes('mistral') || toolName.includes('文心') || 
          toolName.includes('通义') || toolName.includes('混元') || toolDesc.includes('language model') ||
          toolDesc.includes('大模型') || toolDesc.includes('llm')) {
        toolCategory = 'LLM & Language Models';
        toolSubcategory = 'Large Language Models';
        focusAreas = ['Text Generation', 'Conversation', 'Language Understanding'];
      } else if (toolName.includes('dall') || toolName.includes('midjourney') || toolName.includes('stable diffusion') ||
                 toolName.includes('dreamstudio') || toolName.includes('image') || toolName.includes('art') ||
                 toolDesc.includes('image generation') || toolDesc.includes('art generation')) {
        toolCategory = 'Image Processing & Generation';
        toolSubcategory = 'Image Generation';
        focusAreas = ['Image Creation', 'Art Generation', 'Visual Content'];
      } else if (toolName.includes('runway') || toolName.includes('pika') || toolName.includes('video') ||
                 toolName.includes('synthesia') || toolName.includes('luma') || toolDesc.includes('video generation') ||
                 toolDesc.includes('video editing')) {
        toolCategory = 'Video Processing & Generation';
        toolSubcategory = 'Video Generation';
        focusAreas = ['Video Creation', 'Video Editing', 'Motion Graphics'];
      } else if (toolName.includes('whisper') || toolName.includes('elevenlabs') || toolName.includes('voice') ||
                 toolName.includes('speech') || toolName.includes('audio') || toolDesc.includes('speech') ||
                 toolDesc.includes('voice') || toolDesc.includes('audio')) {
        toolCategory = 'Voice & Audio AI';
        toolSubcategory = 'Speech Processing';
        focusAreas = ['Speech Recognition', 'Voice Synthesis', 'Audio Processing'];
      } else if (toolName.includes('perplexity') || toolName.includes('search') || toolName.includes('retrieval') ||
                 toolDesc.includes('search') || toolDesc.includes('information retrieval')) {
        toolCategory = 'Search & Information Retrieval';
        toolSubcategory = 'AI Search';
        focusAreas = ['Information Retrieval', 'Search AI', 'Research'];
      } else if (toolName.includes('character') || toolName.includes('replika') || toolName.includes('companion') ||
                 toolDesc.includes('companion') || toolDesc.includes('virtual friend')) {
        toolCategory = 'Virtual Companions';
        toolSubcategory = 'AI Companions';
        focusAreas = ['Emotional Support', 'Personalization', 'Conversation'];
      } else if (toolName.includes('assistant') || toolName.includes('copilot') || toolName.includes('virtual employee') ||
                 toolDesc.includes('assistant') || toolDesc.includes('virtual worker')) {
        toolCategory = 'Virtual Employees & Assistants';
        toolSubcategory = 'AI Assistants';
        focusAreas = ['Productivity', 'Automation', 'Workflow'];
      } else if (toolName.includes('analysis') || toolName.includes('analytics') || toolName.includes('business') ||
                 toolDesc.includes('analysis') || toolDesc.includes('analytics')) {
        toolCategory = 'Professional Domain Analysis';
        toolSubcategory = 'Business Intelligence';
        focusAreas = ['Data Analysis', 'Business Intelligence', 'Decision Support'];
      }

      const updateData = {
        tool_category: toolCategory,
        tool_subcategory: toolSubcategory,
        focus_areas: focusAreas,
        updated_at: new Date().toISOString()
      };

      const { error: updateError } = await supabase
        .from('tools')
        .update(updateData)
        .eq('id', tool.id);

      if (updateError) {
        console.error(`    ❌ Error updating tool ${tool.name}: ${updateError.message}`);
      } else {
        console.log(`  ✅ ${tool.name} → ${toolCategory} (${toolSubcategory})`);
        toolsUpdated++;
      }
    }

    // Final statistics
    console.log('\n📈 CATEGORIZATION SUMMARY:');
    console.log(`  - Companies categorized: ${companiesUpdated}`);
    console.log(`  - Tools categorized: ${toolsUpdated}`);

    // Show distribution
    console.log('\n📊 COMPANY DISTRIBUTION:');
    const { data: companyStats, error: companyStatsError } = await supabase
      .from('companies')
      .select('company_type, company_tier, company_category')
      .not('company_type', 'is', null);

    if (!companyStatsError) {
      const typeCount = new Map<string, number>();
      const tierCount = new Map<string, number>();
      const categoryCount = new Map<string, number>();

      companyStats.forEach(company => {
        typeCount.set(company.company_type, (typeCount.get(company.company_type) || 0) + 1);
        tierCount.set(company.company_tier, (tierCount.get(company.company_tier) || 0) + 1);
        categoryCount.set(company.company_category, (categoryCount.get(company.company_category) || 0) + 1);
      });

      console.log('\n  By Type:');
      Array.from(typeCount.entries()).forEach(([type, count]) => {
        console.log(`    - ${type}: ${count} companies`);
      });

      console.log('\n  By Tier:');
      Array.from(tierCount.entries()).forEach(([tier, count]) => {
        console.log(`    - ${tier}: ${count} companies`);
      });

      console.log('\n  By Category:');
      Array.from(categoryCount.entries()).forEach(([category, count]) => {
        console.log(`    - ${category}: ${count} companies`);
      });
    }

    console.log('\n📊 TOOL DISTRIBUTION:');
    const { data: toolStats, error: toolStatsError } = await supabase
      .from('tools')
      .select('tool_category, tool_subcategory')
      .not('tool_category', 'is', null);

    if (!toolStatsError) {
      const toolCategoryCount = new Map<string, number>();
      const toolSubcategoryCount = new Map<string, number>();

      toolStats.forEach(tool => {
        toolCategoryCount.set(tool.tool_category, (toolCategoryCount.get(tool.tool_category) || 0) + 1);
        toolSubcategoryCount.set(tool.tool_subcategory, (toolSubcategoryCount.get(tool.tool_subcategory) || 0) + 1);
      });

      console.log('\n  By Category:');
      Array.from(toolCategoryCount.entries())
        .sort((a, b) => b[1] - a[1])
        .forEach(([category, count]) => {
          console.log(`    - ${category}: ${count} tools`);
        });

      console.log('\n  By Subcategory:');
      Array.from(toolSubcategoryCount.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .forEach(([subcategory, count]) => {
          console.log(`    - ${subcategory}: ${count} tools`);
        });
    }

  } catch (error: any) {
    console.error('❌ Error during categorization:', error.message);
  } finally {
    console.log('\n✅ Company and tool categorization completed!');
  }
}

categorizeCompaniesAndTools().catch(console.error);
