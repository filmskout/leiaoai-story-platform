import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://nineezxjxfzwnsdtgjcu.supabase.co';
const supabaseServiceKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5pbmVlenhqeGZ6d25zZHRnamN1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk4MjQ0OTgsImV4cCI6MjA3NTQwMDQ5OH0.Pv7q5NzDevRcL8QWpN5yf_Q-_J1XhYUEFFso3pmA_l8';

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false
  }
});

// Companies that are synonymous with their main tool/service
const synonymousCompanies = [
  // Video AI Companies
  { companyName: 'Artlist', toolName: 'Artlist', category: 'Video Editing', description: 'Artlist提供高质量的免版税音乐、音效和视频素材，助力视频创作者。', website: 'https://artlist.io', industry_tags: ['Video Editing', 'Creative Assets', 'Music Licensing'] },
  { companyName: 'ComfyUI', toolName: 'ComfyUI', category: 'Image Generation', description: 'ComfyUI是一个强大的稳定扩散WebUI，通过节点图实现复杂的工作流。', website: 'https://comfy.icu', industry_tags: ['Image Generation', 'Stable Diffusion', 'Workflow Automation'] },
  { companyName: 'Runway', toolName: 'Runway', category: 'Video Generation', description: 'Runway提供AI驱动的视频编辑和生成工具，支持多种创意工作流。', website: 'https://runwayml.com', industry_tags: ['Video Generation', 'Video Editing', 'AI Tools'] },
  { companyName: 'Pika', toolName: 'Pika', category: 'Video Generation', description: 'Pika是AI视频生成平台，专注于创意视频内容制作。', website: 'https://pika.art', industry_tags: ['Video Generation', 'Creative Content', 'AI Art'] },
  { companyName: 'Luma', toolName: 'Luma', category: 'Video Generation', description: 'Luma提供AI视频生成和编辑工具，支持高质量视频创作。', website: 'https://lumalabs.ai', industry_tags: ['Video Generation', 'Video Editing', 'AI Tools'] },
  { companyName: 'Synthesia', toolName: 'Synthesia', category: 'AI Video', description: 'Synthesia是AI视频生成平台，可以创建虚拟主播和AI角色视频。', website: 'https://www.synthesia.io', industry_tags: ['AI Video', 'Virtual Presenter', 'AI Avatar'] },
  { companyName: 'D-ID', toolName: 'D-ID', category: 'AI Video', description: 'D-ID提供AI视频生成服务，专注于人脸动画和虚拟角色。', website: 'https://www.d-id.com', industry_tags: ['AI Video', 'Face Animation', 'Virtual Character'] },
  { companyName: 'HeyGen', toolName: 'HeyGen', category: 'AI Video', description: 'HeyGen是AI视频生成平台，支持多语言视频制作。', website: 'https://www.heygen.com', industry_tags: ['AI Video', 'Multilingual', 'Video Generation'] },
  { companyName: 'Rephrase', toolName: 'Rephrase', category: 'AI Video', description: 'Rephrase提供AI视频生成和编辑工具，支持多种语言。', website: 'https://www.rephrase.ai', industry_tags: ['AI Video', 'Video Editing', 'Multilingual'] },
  { companyName: 'InVideo', toolName: 'InVideo', category: 'Video Editing', description: 'InVideo是在线视频编辑平台，提供AI辅助的视频制作工具。', website: 'https://invideo.io', industry_tags: ['Video Editing', 'Online Platform', 'AI Tools'] },
  { companyName: 'Pictory', toolName: 'Pictory', category: 'Video Generation', description: 'Pictory将文本转换为视频，提供AI驱动的视频制作服务。', website: 'https://pictory.ai', industry_tags: ['Video Generation', 'Text-to-Video', 'AI Tools'] },
  { companyName: 'Lumen5', toolName: 'Lumen5', category: 'Video Generation', description: 'Lumen5将博客文章转换为视频，提供AI视频制作工具。', website: 'https://lumen5.com', industry_tags: ['Video Generation', 'Content Creation', 'AI Tools'] },
  { companyName: 'RawShorts', toolName: 'RawShorts', category: 'Video Generation', description: 'RawShorts提供AI视频制作工具，支持快速视频创作。', website: 'https://www.rawshorts.com', industry_tags: ['Video Generation', 'AI Tools', 'Content Creation'] },
  { companyName: 'Animoto', toolName: 'Animoto', category: 'Video Editing', description: 'Animoto是在线视频制作平台，提供简单易用的视频编辑工具。', website: 'https://animoto.com', industry_tags: ['Video Editing', 'Online Platform', 'Content Creation'] },
  { companyName: 'Biteable', toolName: 'Biteable', category: 'Video Generation', description: 'Biteable提供AI视频制作工具，支持多种视频模板。', website: 'https://biteable.com', industry_tags: ['Video Generation', 'AI Tools', 'Templates'] },
  { companyName: 'Promo', toolName: 'Promo', category: 'Video Marketing', description: 'Promo是视频营销平台，提供AI辅助的视频制作工具。', website: 'https://promo.com', industry_tags: ['Video Marketing', 'AI Tools', 'Content Creation'] },
  { companyName: 'Renderforest', toolName: 'Renderforest', category: 'Video Generation', description: 'Renderforest提供AI视频制作和动画工具，支持多种创意模板。', website: 'https://www.renderforest.com', industry_tags: ['Video Generation', 'Animation', 'AI Tools'] },
  { companyName: 'FlexClip', toolName: 'FlexClip', category: 'Video Editing', description: 'FlexClip是在线视频编辑平台，提供AI辅助的视频制作工具。', website: 'https://www.flexclip.com', industry_tags: ['Video Editing', 'Online Platform', 'AI Tools'] },
  { companyName: 'Kapwing', toolName: 'Kapwing', category: 'Video Editing', description: 'Kapwing是在线视频编辑平台，提供协作式视频制作工具。', website: 'https://www.kapwing.com', industry_tags: ['Video Editing', 'Collaboration', 'Online Platform'] },
  
  // AI Development Tools
  { companyName: 'Cursor', toolName: 'Cursor', category: 'Code Editor', description: 'Cursor是AI驱动的代码编辑器，提供智能代码补全和生成功能。', website: 'https://cursor.sh', industry_tags: ['Code Editor', 'AI Tools', 'Development'] },
  { companyName: 'Replit', toolName: 'Replit', category: 'Development Platform', description: 'Replit是在线开发平台，提供AI辅助的编程环境。', website: 'https://replit.com', industry_tags: ['Development Platform', 'AI Tools', 'Online IDE'] },
  { companyName: 'Lovable', toolName: 'Lovable', category: 'AI Development', description: 'Lovable是AI驱动的应用开发平台，支持快速原型制作。', website: 'https://lovable.dev', industry_tags: ['AI Development', 'Rapid Prototyping', 'AI Tools'] },
  { companyName: 'Cognition', toolName: 'Devin', category: 'AI Developer', description: 'Devin是AI软件工程师，能够自主完成复杂的编程任务。', website: 'https://www.cognition-labs.com', industry_tags: ['AI Developer', 'Autonomous Coding', 'AI Tools'] },
  
  // AI Content Creation
  { companyName: 'Midjourney', toolName: 'Midjourney', category: 'Image Generation', description: 'Midjourney是AI图像生成平台，专注于艺术创作和视觉设计。', website: 'https://www.midjourney.com', industry_tags: ['Image Generation', 'AI Art', 'Creative Tools'] },
  { companyName: 'Stability AI', toolName: 'Stable Diffusion', category: 'Image Generation', description: 'Stable Diffusion是开源的AI图像生成模型，支持多种艺术风格。', website: 'https://stability.ai', industry_tags: ['Image Generation', 'Open Source', 'AI Art'] },
  { companyName: 'DreamStudio', toolName: 'DreamStudio', category: 'Image Generation', description: 'DreamStudio是Stability AI的图像生成平台，提供用户友好的界面。', website: 'https://dreamstudio.ai', industry_tags: ['Image Generation', 'AI Art', 'Creative Tools'] },
  
  // AI Voice and Audio
  { companyName: 'ElevenLabs', toolName: 'ElevenLabs', category: 'Voice AI', description: 'ElevenLabs提供AI语音合成和克隆服务，支持多种语言和声音。', website: 'https://elevenlabs.io', industry_tags: ['Voice AI', 'Speech Synthesis', 'AI Tools'] },
  
  // AI Search and Research
  { companyName: 'Perplexity AI', toolName: 'Perplexity', category: 'AI Search', description: 'Perplexity是AI驱动的搜索引擎，提供智能问答和内容发现。', website: 'https://www.perplexity.ai', industry_tags: ['AI Search', 'Intelligent Q&A', 'AI Tools'] },
  
  // AI Productivity
  { companyName: 'Notion', toolName: 'Notion AI', category: 'Productivity', description: 'Notion AI是集成在Notion中的AI助手，提供智能写作和内容生成。', website: 'https://www.notion.so', industry_tags: ['Productivity', 'AI Writing', 'Content Generation'] },
  { companyName: 'Canva', toolName: 'Canva AI', category: 'Design', description: 'Canva AI提供AI驱动的设计工具，支持自动布局和内容生成。', website: 'https://www.canva.com', industry_tags: ['Design', 'AI Tools', 'Content Creation'] },
  
  // AI Models and APIs
  { companyName: 'Hugging Face', toolName: 'Hugging Face Hub', category: 'AI Platform', description: 'Hugging Face Hub是AI模型和数据集的开源平台，支持模型分享和部署。', website: 'https://huggingface.co', industry_tags: ['AI Platform', 'Open Source', 'Model Sharing'] },
  { companyName: 'Inference API', toolName: 'Inference API', category: 'AI API', description: 'Hugging Face的推理API，提供快速访问各种AI模型的服务。', website: 'https://huggingface.co/inference-api', industry_tags: ['AI API', 'Model Inference', 'AI Tools'] },
  
  // Social Media AI
  { companyName: 'X (Twitter)', toolName: 'Grok', category: 'AI Assistant', description: 'Grok是X平台的AI助手，提供实时信息搜索和智能问答。', website: 'https://x.com', industry_tags: ['AI Assistant', 'Social Media', 'Real-time Search'] },
  
  // Meta AI
  { companyName: 'Meta', toolName: 'Meta AI', category: 'AI Assistant', description: 'Meta AI是Meta的AI助手，集成在多个Meta产品中。', website: 'https://www.meta.com', industry_tags: ['AI Assistant', 'Social Media', 'AI Tools'] },
  { companyName: 'LLaMA', toolName: 'LLaMA', category: 'LLM', description: 'LLaMA是Meta开发的大语言模型，支持多种自然语言任务。', website: 'https://ai.meta.com', industry_tags: ['LLM', 'Open Source', 'AI Research'] },
  
  // Additional Video AI Tools
  { companyName: 'Vidu', toolName: 'Vidu', category: 'Video Generation', description: 'Vidu是清华大学和生数科技联合推出的视频生成模型，支持长时长、高分辨率视频生成。', website: 'https://shengshu-ai.com', industry_tags: ['Video Generation', 'Chinese AI', 'Text-to-Video'] },
  { companyName: 'SeaArt', toolName: 'SeaArt', category: 'Image Generation', description: 'SeaArt是一个AI绘画创作平台，提供多种模型和风格，支持用户快速生成高质量图像。', website: 'https://www.seaart.ai', industry_tags: ['Image Generation', 'AI Art', 'Chinese AI'] },
  { companyName: 'PixVerse', toolName: 'PixVerse', category: 'Video Generation', description: 'PixVerse是AI视频生成平台，专注于创意视频内容。', website: 'https://pixverse.ai', industry_tags: ['Video Generation', 'Creative Content', 'Chinese AI'] },
  { companyName: 'LeiaPix', toolName: 'LeiaPix', category: '3D Video', description: 'LeiaPix是AI视频生成平台，专注于3D视频内容。', website: 'https://convert.leiapix.com', industry_tags: ['Video Generation', '3D Video', 'AI Tools'] },
  
  // Additional AI Tools
  { companyName: 'Stable Video Diffusion', toolName: 'Stable Video Diffusion', category: 'Video Generation', description: 'Stable Video Diffusion是Stability AI的视频生成模型，基于Stable Diffusion技术。', website: 'https://stability.ai', industry_tags: ['Video Generation', 'Stable Diffusion', 'AI Art'] },
  
  // Additional Chinese AI Tools
  { companyName: '文心一言', toolName: '文心一言', category: 'LLM', description: '百度开发的大语言模型，具备强大的对话和生成能力。', website: 'https://yiyan.baidu.com', industry_tags: ['对话AI', '文本生成', 'Chinese AI'] },
  { companyName: '通义千问', toolName: '通义千问', category: 'LLM', description: '阿里巴巴开发的大语言模型，支持多模态交互。', website: 'https://tongyi.aliyun.com', industry_tags: ['对话AI', '多模态', 'Chinese AI'] },
  { companyName: '混元大模型', toolName: '混元大模型', category: 'LLM', description: '腾讯开发的大语言模型，具备强大的理解和生成能力。', website: 'https://hunyuan.tencent.com', industry_tags: ['对话AI', '文本生成', 'Chinese AI'] },
  { companyName: '豆包', toolName: '豆包', category: 'LLM', description: '字节跳动开发的AI助手，支持多种任务处理。', website: 'https://www.doubao.com', industry_tags: ['AI助手', '任务处理', 'Chinese AI'] },
  { companyName: '商量', toolName: '商量', category: 'LLM', description: '商汤科技开发的对话AI，具备强大的多模态理解能力。', website: 'https://chat.sensetime.com', industry_tags: ['对话AI', '多模态', 'Chinese AI'] },
  { companyName: '星火认知大模型', toolName: '星火认知大模型', category: 'LLM', description: '科大讯飞开发的大语言模型，具备强大的认知和推理能力。', website: 'https://xinghuo.xfyun.cn', industry_tags: ['认知AI', '推理', 'Chinese AI'] },
  { companyName: 'Face++', toolName: 'Face++', category: 'Computer Vision', description: '旷视科技的人脸识别平台，提供强大的视觉AI服务。', website: 'https://www.faceplusplus.com', industry_tags: ['人脸识别', '视觉AI', 'Chinese AI'] },
  { companyName: 'MLU', toolName: 'MLU', category: 'AI Chip', description: '寒武纪的机器学习单元，专为AI计算优化。', website: 'https://www.cambricon.com', industry_tags: ['AI芯片', '机器学习', 'Chinese AI'] },
  { companyName: 'Walker X', toolName: 'Walker X', category: 'Robotics', description: '优必选的人形机器人，具备先进的运动控制和AI能力。', website: 'https://www.ubtrobot.com', industry_tags: ['人形机器人', '运动控制', 'Chinese AI'] },
  { companyName: 'abab', toolName: 'abab', category: 'LLM', description: 'MiniMax的多模态大模型，支持文本、图像和视频生成。', website: 'https://www.minimax.com', industry_tags: ['多模态', '内容生成', 'Chinese AI'] },
  { companyName: 'ChatGLM', toolName: 'ChatGLM', category: 'LLM', description: '智谱AI开发的大语言模型，具备强大的对话和推理能力。', website: 'https://www.zhipuai.cn', industry_tags: ['对话AI', '推理', 'Chinese AI'] },
  { companyName: 'Kimi', toolName: 'Kimi', category: 'LLM', description: '月之暗面的AI助手，擅长长文本处理和分析。', website: 'https://kimi.moonshot.cn', industry_tags: ['长文本', '文本分析', 'Chinese AI'] },
  { companyName: 'Yi', toolName: 'Yi', category: 'LLM', description: '零一万物的多语言大模型，支持中英文等多种语言。', website: 'https://www.01.ai', industry_tags: ['多语言', '大模型', 'Chinese AI'] },
  { companyName: 'Baichuan', toolName: 'Baichuan', category: 'LLM', description: '百川智能的大语言模型，具备强大的知识理解和生成能力。', website: 'https://www.baichuan-ai.com', industry_tags: ['知识理解', '文本生成', 'Chinese AI'] },
  { companyName: 'DeepSeek', toolName: 'DeepSeek', category: 'LLM', description: '深言科技的AI模型，擅长代码生成和数学推理。', website: 'https://www.deepseek.com', industry_tags: ['代码生成', '数学推理', 'Chinese AI'] },
  { companyName: 'UiBot', toolName: 'UiBot', category: 'RPA', description: '来也科技的RPA平台，提供智能流程自动化解决方案。', website: 'https://www.laiye.com', industry_tags: ['RPA', '流程自动化', 'Chinese AI'] },
  { companyName: 'Sage', toolName: 'Sage', category: 'ML Platform', description: '第四范式的AI平台，提供企业级机器学习解决方案。', website: 'https://www.4paradigm.com', industry_tags: ['机器学习', '企业AI', 'Chinese AI'] },
  { companyName: '云从AI', toolName: '云从AI', category: 'Computer Vision', description: '云从科技的AI平台，提供计算机视觉和智能分析服务。', website: 'https://www.cloudwalk.cn', industry_tags: ['计算机视觉', '智能分析', 'Chinese AI'] },
  { companyName: '依图AI', toolName: '依图AI', category: 'Computer Vision', description: '依图科技的AI平台，提供计算机视觉和语音识别服务。', website: 'https://www.yitutech.com', industry_tags: ['计算机视觉', '语音识别', 'Chinese AI'] },
  { companyName: 'DUI', toolName: 'DUI', category: 'Voice AI', description: '思必驰的对话交互平台，提供智能语音交互解决方案。', website: 'https://www.aichat.com', industry_tags: ['语音交互', '对话AI', 'Chinese AI'] }
];

async function fixSynonymousRelationships() {
  console.log('🔗 Fixing synonymous company-tool relationships...\n');

  try {
    let processedCount = 0;
    let createdCount = 0;
    let updatedCount = 0;

    for (const item of synonymousCompanies) {
      console.log(`\n🏢 Processing: ${item.companyName} / ${item.toolName}`);

      // Find the company
      const { data: company, error: companyError } = await supabase
        .from('companies')
        .select('id, name')
        .eq('name', item.companyName)
        .single();

      if (companyError) {
        console.log(`⚠️ Company not found: ${item.companyName}`);
        continue;
      }

      // Check if tool already exists
      const { data: existingTool, error: toolError } = await supabase
        .from('tools')
        .select('id, company_id')
        .eq('name', item.toolName)
        .single();

      if (toolError && toolError.code !== 'PGRST116') {
        console.error(`Error checking tool ${item.toolName}:`, toolError);
        continue;
      }

      if (existingTool) {
        // Update existing tool to link with company
        if (existingTool.company_id !== company.id) {
          const { error: updateError } = await supabase
            .from('tools')
            .update({ 
              company_id: company.id,
              updated_at: new Date().toISOString()
            })
            .eq('id', existingTool.id);

          if (updateError) {
            console.error(`❌ Error updating tool ${item.toolName}:`, updateError);
          } else {
            console.log(`✅ Updated tool: ${item.toolName} → ${item.companyName}`);
            updatedCount++;
          }
        } else {
          console.log(`✅ Tool already linked: ${item.toolName} → ${item.companyName}`);
        }
      } else {
        // Create new tool
        const { error: createError } = await supabase
          .from('tools')
          .insert({
            name: item.toolName,
            description: item.description,
            website: item.website,
            category: item.category,
            industry_tags: item.industry_tags,
            company_id: company.id,
            pricing_model: 'Freemium',
            features: ['AI能力', '多语言支持', 'AI Capabilities', 'Multilingual Support'],
            api_available: true,
            free_tier: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });

        if (createError) {
          console.error(`❌ Error creating tool ${item.toolName}:`, createError);
        } else {
          console.log(`✅ Created tool: ${item.toolName} → ${item.companyName}`);
          createdCount++;
        }
      }

      processedCount++;
      await new Promise(resolve => setTimeout(resolve, 200)); // Rate limiting
    }

    console.log(`\n📊 Summary:`);
    console.log(`  - Processed: ${processedCount} company-tool pairs`);
    console.log(`  - Created: ${createdCount} new tools`);
    console.log(`  - Updated: ${updatedCount} existing tools`);

  } catch (error) {
    console.error('Error fixing synonymous relationships:', error);
  }
}

async function main() {
  console.log('🚀 Starting synonymous company-tool relationship fixes...\n');

  // Disable RLS temporarily
  console.log('🔓 Disabling RLS for relationship fixes...');
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

  await fixSynonymousRelationships();

  console.log('\n✅ Synonymous relationship fixes completed!');
}

main().catch(console.error);
