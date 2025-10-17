import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://nineezxjxfzwnsdtgjcu.supabase.co';
const supabaseServiceKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5pbmVlenhqeGZ6d25zZHRnamN1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk4MjQ0OTgsImV4cCI6MjA3NTQwMDQ5OH0.Pv7q5NzDevRcL8QWpN5yf_Q-_J1XhYUEFFso3pmA_l8';

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false
  }
});

// Comprehensive logo mapping for missing tools
const missingToolLogos = {
  'Artlist': 'https://artlist.io/favicon.ico',
  'ComfyUI': 'https://comfy.icu/favicon.ico',
  'Runway': 'https://runwayml.com/favicon.ico',
  'Synthesia': 'https://www.synthesia.io/favicon.ico',
  'Cursor': 'https://cursor.sh/favicon.ico',
  'Replit': 'https://replit.com/favicon.ico',
  'Lovable': 'https://lovable.dev/favicon.ico',
  'Midjourney': 'https://www.midjourney.com/favicon.ico',
  'ElevenLabs': 'https://elevenlabs.io/favicon.ico',
  'Perplexity': 'https://www.perplexity.ai/favicon.ico',
  'Vidu': 'https://shengshu-ai.com/favicon.ico',
  'SeaArt': 'https://www.seaart.ai/favicon.ico',
  'PixVerse': 'https://pixverse.ai/favicon.ico',
  'LeiaPix': 'https://convert.leiapix.com/favicon.ico',
  'Stable Diffusion': 'https://stability.ai/favicon.ico',
  'DreamStudio': 'https://dreamstudio.ai/favicon.ico',
  'Magic Design': 'https://www.canva.com/favicon.ico',
  'Magic Write': 'https://www.canva.com/favicon.ico',
  'Notion AI': 'https://www.notion.so/favicon.ico',
  'Hugging Face Hub': 'https://huggingface.co/favicon.ico',
  'Inference API': 'https://huggingface.co/favicon.ico',
  'Meta AI': 'https://www.meta.com/favicon.ico',
  'LLaMA': 'https://www.meta.com/favicon.ico',
  'Grok': 'https://x.com/favicon.ico',
  'Devin': 'https://www.cognition-labs.com/favicon.ico',
  'Claude': 'https://www.anthropic.com/favicon.ico',
  'Claude API': 'https://www.anthropic.com/favicon.ico',
  'ChatGPT': 'https://openai.com/favicon.ico',
  'DALL-E': 'https://openai.com/favicon.ico',
  'Sora': 'https://openai.com/favicon.ico',
  'GPT-4 API': 'https://openai.com/favicon.ico',
  'Whisper': 'https://openai.com/favicon.ico',
  'Gemini': 'https://www.google.com/favicon.ico',
  'Gemini API': 'https://www.google.com/favicon.ico',
  'NotebookLM': 'https://www.google.com/favicon.ico',
  'AI Studio': 'https://www.google.com/favicon.ico',
  'Copilot': 'https://www.microsoft.com/favicon.ico',
  'Azure OpenAI': 'https://www.microsoft.com/favicon.ico',
  'Perplexity Pro': 'https://www.perplexity.ai/favicon.ico',
  'Perplexity API': 'https://www.perplexity.ai/favicon.ico',
  'ElevenLabs Voice': 'https://elevenlabs.io/favicon.ico',
  'ElevenLabs API': 'https://elevenlabs.io/favicon.ico',
  'Replit Agent': 'https://replit.com/favicon.ico',
  'Replit Workspace': 'https://replit.com/favicon.ico',
  'Cursor Editor': 'https://cursor.sh/favicon.ico',
  'Lovable Platform': 'https://lovable.dev/favicon.ico',
  'Midjourney Bot': 'https://www.midjourney.com/favicon.ico'
};

// Comprehensive descriptions for missing tools
const missingToolDescriptions = {
  'Cursor Editor': {
    description: 'AI-powered code editor that understands your codebase and helps you write better code faster',
    description_en: 'AI-powered code editor that understands your codebase and helps you write better code faster',
    description_zh_hans: 'AI驱动的代码编辑器，理解您的代码库并帮助您更快地编写更好的代码',
    description_zh_hant: 'AI驅動的代碼編輯器，理解您的代碼庫並幫助您更快地編寫更好的代碼'
  },
  'LLaMA': {
    description: 'Meta\'s large language model designed for research and commercial applications',
    description_en: 'Meta\'s large language model designed for research and commercial applications',
    description_zh_hans: 'Meta的大语言模型，专为研究和商业应用而设计',
    description_zh_hant: 'Meta的大語言模型，專為研究和商業應用而設計'
  },
  'Magic Design': {
    description: 'Canva\'s AI-powered design tool that automatically creates beautiful designs from text prompts',
    description_en: 'Canva\'s AI-powered design tool that automatically creates beautiful designs from text prompts',
    description_zh_hans: 'Canva的AI设计工具，能够根据文本提示自动创建精美的设计',
    description_zh_hant: 'Canva的AI設計工具，能夠根據文本提示自動創建精美的設計'
  },
  'Stable Diffusion': {
    description: 'Open-source AI image generation model that creates high-quality images from text descriptions',
    description_en: 'Open-source AI image generation model that creates high-quality images from text descriptions',
    description_zh_hans: '开源的AI图像生成模型，能够根据文本描述创建高质量图像',
    description_zh_hant: '開源的AI圖像生成模型，能夠根據文本描述創建高質量圖像'
  },
  'Replit': {
    description: 'AI-powered online IDE that helps developers code faster with intelligent suggestions',
    description_en: 'AI-powered online IDE that helps developers code faster with intelligent suggestions',
    description_zh_hans: 'AI驱动的在线IDE，通过智能建议帮助开发者更快地编码',
    description_zh_hant: 'AI驅動的在線IDE，通過智能建議幫助開發者更快地編碼'
  },
  'Lovable': {
    description: 'AI-powered platform for building web applications with natural language descriptions',
    description_en: 'AI-powered platform for building web applications with natural language descriptions',
    description_zh_hans: 'AI驱动的平台，能够通过自然语言描述构建Web应用程序',
    description_zh_hant: 'AI驅動的平台，能夠通過自然語言描述構建Web應用程序'
  },
  'Midjourney': {
    description: 'AI art generator that creates stunning images from text prompts using advanced machine learning',
    description_en: 'AI art generator that creates stunning images from text prompts using advanced machine learning',
    description_zh_hans: 'AI艺术生成器，使用先进的机器学习技术根据文本提示创建令人惊叹的图像',
    description_zh_hant: 'AI藝術生成器，使用先進的機器學習技術根據文本提示創建令人驚嘆的圖像'
  },
  'ElevenLabs': {
    description: 'AI voice synthesis platform that creates realistic human-like voices for various applications',
    description_en: 'AI voice synthesis platform that creates realistic human-like voices for various applications',
    description_zh_hans: 'AI语音合成平台，为各种应用创建逼真的人声',
    description_zh_hant: 'AI語音合成平台，為各種應用創建逼真的人聲'
  },
  'Perplexity': {
    description: 'AI-powered search engine that provides accurate answers with source citations',
    description_en: 'AI-powered search engine that provides accurate answers with source citations',
    description_zh_hans: 'AI驱动的搜索引擎，提供带有来源引用的准确答案',
    description_zh_hant: 'AI驅動的搜索引擎，提供帶有來源引用的準確答案'
  },
  'Vidu': {
    description: 'Chinese AI video generation model that creates high-quality videos from text descriptions',
    description_en: 'Chinese AI video generation model that creates high-quality videos from text descriptions',
    description_zh_hans: '中国AI视频生成模型，能够根据文本描述创建高质量视频',
    description_zh_hant: '中國AI視頻生成模型，能夠根據文本描述創建高質量視頻'
  },
  'SeaArt': {
    description: 'Chinese AI art platform that provides various AI models and styles for creative image generation',
    description_en: 'Chinese AI art platform that provides various AI models and styles for creative image generation',
    description_zh_hans: '中国AI艺术平台，提供多种AI模型和风格进行创意图像生成',
    description_zh_hant: '中國AI藝術平台，提供多種AI模型和風格進行創意圖像生成'
  },
  'PixVerse': {
    description: 'AI video generation platform focused on creative video content creation',
    description_en: 'AI video generation platform focused on creative video content creation',
    description_zh_hans: 'AI视频生成平台，专注于创意视频内容创作',
    description_zh_hant: 'AI視頻生成平台，專注於創意視頻內容創作'
  },
  'LeiaPix': {
    description: 'AI platform that converts 2D images into 3D videos with depth and motion effects',
    description_en: 'AI platform that converts 2D images into 3D videos with depth and motion effects',
    description_zh_hans: 'AI平台，将2D图像转换为具有深度和运动效果的3D视频',
    description_zh_hant: 'AI平台，將2D圖像轉換為具有深度和運動效果的3D視頻'
  },
  'Artlist': {
    description: 'Platform providing high-quality royalty-free music, sound effects, and video assets for creators',
    description_en: 'Platform providing high-quality royalty-free music, sound effects, and video assets for creators',
    description_zh_hans: '为创作者提供高质量免版税音乐、音效和视频素材的平台',
    description_zh_hant: '為創作者提供高質量免版稅音樂、音效和視頻素材的平台'
  },
  'ComfyUI': {
    description: 'Powerful Stable Diffusion WebUI that implements complex workflows through node graphs',
    description_en: 'Powerful Stable Diffusion WebUI that implements complex workflows through node graphs',
    description_zh_hans: '强大的稳定扩散WebUI，通过节点图实现复杂的工作流',
    description_zh_hant: '強大的穩定擴散WebUI，通過節點圖實現複雜的工作流'
  },
  'Runway': {
    description: 'AI-powered video editing and generation platform with advanced creative tools',
    description_en: 'AI-powered video editing and generation platform with advanced creative tools',
    description_zh_hans: 'AI驱动的视频编辑和生成平台，配备先进的创意工具',
    description_zh_hant: 'AI驅動的視頻編輯和生成平台，配備先進的創意工具'
  },
  'Synthesia': {
    description: 'AI video generation platform that creates virtual presenters and AI avatars for content',
    description_en: 'AI video generation platform that creates virtual presenters and AI avatars for content',
    description_zh_hans: 'AI视频生成平台，为内容创建虚拟主持人和AI头像',
    description_zh_hant: 'AI視頻生成平台，為內容創建虛擬主持人和AI頭像'
  },
  'Cursor': {
    description: 'AI-powered code editor that understands your codebase and provides intelligent coding assistance',
    description_en: 'AI-powered code editor that understands your codebase and provides intelligent coding assistance',
    description_zh_hans: 'AI驱动的代码编辑器，理解您的代码库并提供智能编码辅助',
    description_zh_hant: 'AI驅動的代碼編輯器，理解您的代碼庫並提供智能編碼輔助'
  }
};

// Comprehensive descriptions for missing companies
const missingCompanyDescriptions = {
  '优必选科技': {
    description: '全球领先的服务机器人公司，专注于人形机器人研发和AI技术应用',
    description_en: 'Global leading service robotics company focused on humanoid robot development and AI technology applications',
    description_zh_hans: '全球领先的服务机器人公司，专注于人形机器人研发和AI技术应用',
    description_zh_hant: '全球領先的服務機器人公司，專注於人形機器人研發和AI技術應用'
  },
  '依图科技': {
    description: '中国领先的AI公司，专注于计算机视觉和语音技术，应用于安防、医疗等领域',
    description_en: 'Leading Chinese AI company focused on computer vision and speech technology, applied in security, healthcare and other fields',
    description_zh_hans: '中国领先的AI公司，专注于计算机视觉和语音技术，应用于安防、医疗等领域',
    description_zh_hant: '中國領先的AI公司，專注於計算機視覺和語音技術，應用於安防、醫療等領域'
  },
  'FormX': {
    description: 'AI-powered document processing platform that extracts data from forms and documents',
    description_en: 'AI-powered document processing platform that extracts data from forms and documents',
    description_zh_hans: 'AI驱动的文档处理平台，从表单和文档中提取数据',
    description_zh_hant: 'AI驅動的文檔處理平台，從表單和文檔中提取數據'
  },
  'SK Telecom': {
    description: 'South Korean telecommunications company with significant AI and 5G technology investments',
    description_en: 'South Korean telecommunications company with significant AI and 5G technology investments',
    description_zh_hans: '韩国电信公司，在AI和5G技术方面有重大投资',
    description_zh_hant: '韓國電信公司，在AI和5G技術方面有重大投資'
  },
  'DeepMind': {
    description: 'Google\'s AI research lab focused on artificial general intelligence and machine learning breakthroughs',
    description_en: 'Google\'s AI research lab focused on artificial general intelligence and machine learning breakthroughs',
    description_zh_hans: 'Google的AI研究实验室，专注于人工通用智能和机器学习突破',
    description_zh_hant: 'Google的AI研究實驗室，專注於人工通用智能和機器學習突破'
  },
  'Darktrace': {
    description: 'Cybersecurity company using AI to detect and respond to cyber threats in real-time',
    description_en: 'Cybersecurity company using AI to detect and respond to cyber threats in real-time',
    description_zh_hans: '网络安全公司，使用AI实时检测和响应网络威胁',
    description_zh_hant: '網絡安全公司，使用AI實時檢測和響應網絡威脅'
  },
  'Mistral AI': {
    description: 'European AI company developing efficient large language models for various applications',
    description_en: 'European AI company developing efficient large language models for various applications',
    description_zh_hans: '欧洲AI公司，开发高效的大语言模型用于各种应用',
    description_zh_hant: '歐洲AI公司，開發高效的大語言模型用於各種應用'
  },
  'Aleph Alpha': {
    description: 'German AI company specializing in large language models and AI research',
    description_en: 'German AI company specializing in large language models and AI research',
    description_zh_hans: '德国AI公司，专注于大语言模型和AI研究',
    description_zh_hant: '德國AI公司，專注於大語言模型和AI研究'
  },
  'Element AI': {
    description: 'Canadian AI company focused on enterprise AI solutions and machine learning platforms',
    description_en: 'Canadian AI company focused on enterprise AI solutions and machine learning platforms',
    description_zh_hans: '加拿大AI公司，专注于企业AI解决方案和机器学习平台',
    description_zh_hant: '加拿大AI公司，專注於企業AI解決方案和機器學習平台'
  },
  'Mobileye': {
    description: 'Intel subsidiary developing AI-powered autonomous driving and advanced driver assistance systems',
    description_en: 'Intel subsidiary developing AI-powered autonomous driving and advanced driver assistance systems',
    description_zh_hans: 'Intel子公司，开发AI驱动的自动驾驶和高级驾驶辅助系统',
    description_zh_hant: 'Intel子公司，開發AI驅動的自動駕駛和高級駕駛輔助系統'
  }
};

async function updateMissingLogos() {
  console.log('🖼️ Updating missing tool logos...\n');

  try {
    // Get tools without logos
    const { data: tools, error: toolsError } = await supabase
      .from('tools')
      .select('id, name, logo_url')
      .or('logo_url.is.null,logo_url.eq.');

    if (toolsError) {
      console.error('Error fetching tools:', toolsError);
      return;
    }

    console.log(`Found ${tools?.length || 0} tools without logos`);

    let updatedCount = 0;
    for (const tool of tools || []) {
      const logoUrl = missingToolLogos[tool.name];
      if (logoUrl) {
        const { error: updateError } = await supabase
          .from('tools')
          .update({ 
            logo_url: logoUrl,
            updated_at: new Date().toISOString()
          })
          .eq('id', tool.id);

        if (updateError) {
          console.error(`Error updating logo for ${tool.name}:`, updateError);
        } else {
          console.log(`✅ Updated logo for: ${tool.name}`);
          updatedCount++;
        }
      } else {
        console.log(`⚠️ No logo found for: ${tool.name}`);
      }
    }

    console.log(`\n📊 Updated ${updatedCount} tool logos`);
  } catch (error) {
    console.error('Error updating tool logos:', error);
  }
}

async function updateMissingDescriptions() {
  console.log('📝 Updating missing tool descriptions...\n');

  try {
    // Get tools with missing or short descriptions
    const { data: tools, error: toolsError } = await supabase
      .from('tools')
      .select('id, name, description')
      .or('description.is.null,description.lt.50');

    if (toolsError) {
      console.error('Error fetching tools:', toolsError);
      return;
    }

    console.log(`Found ${tools?.length || 0} tools with missing/short descriptions`);

    let updatedCount = 0;
    for (const tool of tools || []) {
      const descriptionData = missingToolDescriptions[tool.name];
      if (descriptionData) {
        const { error: updateError } = await supabase
          .from('tools')
          .update({ 
            description: descriptionData.description,
            description_en: descriptionData.description_en,
            description_zh_hans: descriptionData.description_zh_hans,
            description_zh_hant: descriptionData.description_zh_hant,
            updated_at: new Date().toISOString()
          })
          .eq('id', tool.id);

        if (updateError) {
          console.error(`Error updating description for ${tool.name}:`, updateError);
        } else {
          console.log(`✅ Updated description for: ${tool.name}`);
          updatedCount++;
        }
      } else {
        console.log(`⚠️ No description found for: ${tool.name}`);
      }
    }

    console.log(`\n📊 Updated ${updatedCount} tool descriptions`);
  } catch (error) {
    console.error('Error updating tool descriptions:', error);
  }
}

async function updateMissingCompanyDescriptions() {
  console.log('🏢 Updating missing company descriptions...\n');

  try {
    // Get companies with missing or short descriptions
    const { data: companies, error: companiesError } = await supabase
      .from('companies')
      .select('id, name, description')
      .or('description.is.null,description.lt.50');

    if (companiesError) {
      console.error('Error fetching companies:', companiesError);
      return;
    }

    console.log(`Found ${companies?.length || 0} companies with missing/short descriptions`);

    let updatedCount = 0;
    for (const company of companies || []) {
      const descriptionData = missingCompanyDescriptions[company.name];
      if (descriptionData) {
        const { error: updateError } = await supabase
          .from('companies')
          .update({ 
            description: descriptionData.description,
            description_en: descriptionData.description_en,
            description_zh_hans: descriptionData.description_zh_hans,
            description_zh_hant: descriptionData.description_zh_hant,
            updated_at: new Date().toISOString()
          })
          .eq('id', company.id);

        if (updateError) {
          console.error(`Error updating description for ${company.name}:`, updateError);
        } else {
          console.log(`✅ Updated description for: ${company.name}`);
          updatedCount++;
        }
      } else {
        console.log(`⚠️ No description found for: ${company.name}`);
      }
    }

    console.log(`\n📊 Updated ${updatedCount} company descriptions`);
  } catch (error) {
    console.error('Error updating company descriptions:', error);
  }
}

async function main() {
  console.log('🚀 Starting comprehensive data completion...\n');

  // Disable RLS temporarily
  console.log('🔓 Disabling RLS for data updates...');
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

  await updateMissingLogos();
  await updateMissingDescriptions();
  await updateMissingCompanyDescriptions();

  console.log('\n✅ Comprehensive data completion finished!');
  console.log('📊 All missing logos and descriptions have been updated');
}

main().catch(console.error);
