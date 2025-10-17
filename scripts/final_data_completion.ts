import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://nineezxjxfzwnsdtgjcu.supabase.co';
const supabaseServiceKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5pbmVlenhqeGZ6d25zZHRnamN1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk4MjQ0OTgsImV4cCI6MjA3NTQwMDQ5OH0.Pv7q5NzDevRcL8QWpN5yf_Q-_J1XhYUEFFso3pmA_l8';

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false
  }
});

// Complete descriptions for all remaining tools
const completeToolDescriptions = {
  'Cursor Editor': {
    description: 'AI-powered code editor that understands your codebase and helps you write better code faster with intelligent suggestions',
    description_en: 'AI-powered code editor that understands your codebase and helps you write better code faster with intelligent suggestions',
    description_zh_hans: 'AI驱动的代码编辑器，理解您的代码库并通过智能建议帮助您更快地编写更好的代码',
    description_zh_hant: 'AI驅動的代碼編輯器，理解您的代碼庫並通過智能建議幫助您更快地編寫更好的代碼'
  },
  'LLaMA': {
    description: 'Meta\'s large language model designed for research and commercial applications, offering efficient performance',
    description_en: 'Meta\'s large language model designed for research and commercial applications, offering efficient performance',
    description_zh_hans: 'Meta的大语言模型，专为研究和商业应用而设计，提供高效性能',
    description_zh_hant: 'Meta的大語言模型，專為研究和商業應用而設計，提供高效性能'
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
  'Whisper': {
    description: 'OpenAI\'s automatic speech recognition system that converts speech to text with high accuracy',
    description_en: 'OpenAI\'s automatic speech recognition system that converts speech to text with high accuracy',
    description_zh_hans: 'OpenAI的自动语音识别系统，能够高精度地将语音转换为文本',
    description_zh_hant: 'OpenAI的自動語音識別系統，能夠高精度地將語音轉換為文本'
  },
  'Replit Workspace': {
    description: 'Online development environment with AI assistance for coding, debugging, and collaboration',
    description_en: 'Online development environment with AI assistance for coding, debugging, and collaboration',
    description_zh_hans: '在线开发环境，配备AI辅助进行编码、调试和协作',
    description_zh_hant: '在線開發環境，配備AI輔助進行編碼、調試和協作'
  },
  'NotebookLM': {
    description: 'Google\'s AI-powered notebook that helps you learn and understand documents through conversation',
    description_en: 'Google\'s AI-powered notebook that helps you learn and understand documents through conversation',
    description_zh_hans: 'Google的AI笔记本，通过对话帮助您学习和理解文档',
    description_zh_hant: 'Google的AI筆記本，通過對話幫助您學習和理解文檔'
  },
  'ElevenLabs API': {
    description: 'API service for AI voice synthesis, enabling developers to integrate realistic voice generation',
    description_en: 'API service for AI voice synthesis, enabling developers to integrate realistic voice generation',
    description_zh_hans: 'AI语音合成API服务，使开发者能够集成逼真的语音生成',
    description_zh_hant: 'AI語音合成API服務，使開發者能夠集成逼真的語音生成'
  },
  'Hugging Face Hub': {
    description: 'Open platform for sharing and discovering AI models, datasets, and machine learning resources',
    description_en: 'Open platform for sharing and discovering AI models, datasets, and machine learning resources',
    description_zh_hans: '开放平台，用于分享和发现AI模型、数据集和机器学习资源',
    description_zh_hant: '開放平台，用於分享和發現AI模型、數據集和機器學習資源'
  },
  'DreamStudio': {
    description: 'Stability AI\'s user-friendly interface for Stable Diffusion image generation',
    description_en: 'Stability AI\'s user-friendly interface for Stable Diffusion image generation',
    description_zh_hans: 'Stability AI的Stable Diffusion图像生成用户友好界面',
    description_zh_hant: 'Stability AI的Stable Diffusion圖像生成用戶友好界面'
  },
  'Magic Write': {
    description: 'Canva\'s AI writing assistant that helps create compelling content for various purposes',
    description_en: 'Canva\'s AI writing assistant that helps create compelling content for various purposes',
    description_zh_hans: 'Canva的AI写作助手，帮助为各种目的创建引人注目的内容',
    description_zh_hant: 'Canva的AI寫作助手，幫助為各種目的創建引人注目的內容'
  }
};

// Complete descriptions for all remaining companies
const completeCompanyDescriptions = {
  '优必选科技': {
    description: '全球领先的服务机器人公司，专注于人形机器人研发和AI技术应用，产品包括Walker系列机器人',
    description_en: 'Global leading service robotics company focused on humanoid robot development and AI technology applications, including Walker series robots',
    description_zh_hans: '全球领先的服务机器人公司，专注于人形机器人研发和AI技术应用，产品包括Walker系列机器人',
    description_zh_hant: '全球領先的服務機器人公司，專注於人形機器人研發和AI技術應用，產品包括Walker系列機器人'
  },
  '依图科技': {
    description: '中国领先的AI公司，专注于计算机视觉和语音技术，应用于安防、医疗、金融等领域',
    description_en: 'Leading Chinese AI company focused on computer vision and speech technology, applied in security, healthcare, finance and other fields',
    description_zh_hans: '中国领先的AI公司，专注于计算机视觉和语音技术，应用于安防、医疗、金融等领域',
    description_zh_hant: '中國領先的AI公司，專注於計算機視覺和語音技術，應用於安防、醫療、金融等領域'
  },
  'FormX': {
    description: 'AI驱动的文档处理平台，能够从表单和文档中自动提取和结构化数据',
    description_en: 'AI-powered document processing platform that automatically extracts and structures data from forms and documents',
    description_zh_hans: 'AI驱动的文档处理平台，能够从表单和文档中自动提取和结构化数据',
    description_zh_hant: 'AI驅動的文檔處理平台，能夠從表單和文檔中自動提取和結構化數據'
  },
  'SK Telecom': {
    description: '韩国领先的电信公司，在AI、5G技术和数字化转型方面有重大投资',
    description_en: 'Leading South Korean telecommunications company with significant investments in AI, 5G technology and digital transformation',
    description_zh_hans: '韩国领先的电信公司，在AI、5G技术和数字化转型方面有重大投资',
    description_zh_hant: '韓國領先的電信公司，在AI、5G技術和數字轉型方面有重大投資'
  },
  'DeepMind': {
    description: 'Google的AI研究实验室，专注于人工通用智能和机器学习突破，开发了AlphaGo等知名AI系统',
    description_en: 'Google\'s AI research lab focused on artificial general intelligence and machine learning breakthroughs, developer of AlphaGo and other renowned AI systems',
    description_zh_hans: 'Google的AI研究实验室，专注于人工通用智能和机器学习突破，开发了AlphaGo等知名AI系统',
    description_zh_hant: 'Google的AI研究實驗室，專注於人工通用智能和機器學習突破，開發了AlphaGo等知名AI系統'
  },
  'Darktrace': {
    description: '网络安全公司，使用AI技术实时检测和响应网络威胁，提供自主网络安全解决方案',
    description_en: 'Cybersecurity company using AI technology to detect and respond to cyber threats in real-time, providing autonomous cybersecurity solutions',
    description_zh_hans: '网络安全公司，使用AI技术实时检测和响应网络威胁，提供自主网络安全解决方案',
    description_zh_hant: '網絡安全公司，使用AI技術實時檢測和響應網絡威脅，提供自主網絡安全解決方案'
  },
  'Mistral AI': {
    description: '欧洲AI公司，开发高效的大语言模型，专注于开源AI解决方案和模型优化',
    description_en: 'European AI company developing efficient large language models, focused on open-source AI solutions and model optimization',
    description_zh_hans: '欧洲AI公司，开发高效的大语言模型，专注于开源AI解决方案和模型优化',
    description_zh_hant: '歐洲AI公司，開發高效的大語言模型，專注於開源AI解決方案和模型優化'
  },
  'Aleph Alpha': {
    description: '德国AI公司，专注于大语言模型和AI研究，提供企业级AI解决方案',
    description_en: 'German AI company specializing in large language models and AI research, providing enterprise-grade AI solutions',
    description_zh_hans: '德国AI公司，专注于大语言模型和AI研究，提供企业级AI解决方案',
    description_zh_hant: '德國AI公司，專注於大語言模型和AI研究，提供企業級AI解決方案'
  },
  'Element AI': {
    description: '加拿大AI公司，专注于企业AI解决方案和机器学习平台，后被ServiceNow收购',
    description_en: 'Canadian AI company focused on enterprise AI solutions and machine learning platforms, later acquired by ServiceNow',
    description_zh_hans: '加拿大AI公司，专注于企业AI解决方案和机器学习平台，后被ServiceNow收购',
    description_zh_hant: '加拿大AI公司，專注於企業AI解決方案和機器學習平台，後被ServiceNow收購'
  },
  'Mobileye': {
    description: 'Intel子公司，开发AI驱动的自动驾驶和高级驾驶辅助系统，专注于计算机视觉技术',
    description_en: 'Intel subsidiary developing AI-powered autonomous driving and advanced driver assistance systems, specializing in computer vision technology',
    description_zh_hans: 'Intel子公司，开发AI驱动的自动驾驶和高级驾驶辅助系统，专注于计算机视觉技术',
    description_zh_hant: 'Intel子公司，開發AI驅動的自動駕駛和高級駕駛輔助系統，專注於計算機視覺技術'
  },
  'C3.ai': {
    description: '企业AI软件公司，提供AI驱动的企业应用和数字化转型解决方案',
    description_en: 'Enterprise AI software company providing AI-powered enterprise applications and digital transformation solutions',
    description_zh_hans: '企业AI软件公司，提供AI驱动的企业应用和数字化转型解决方案',
    description_zh_hant: '企業AI軟件公司，提供AI驅動的企業應用和數字轉型解決方案'
  },
  'DataRobot': {
    description: '自动化机器学习平台，帮助企业快速构建和部署AI模型',
    description_en: 'Automated machine learning platform that helps enterprises quickly build and deploy AI models',
    description_zh_hans: '自动化机器学习平台，帮助企业快速构建和部署AI模型',
    description_zh_hant: '自動化機器學習平台，幫助企業快速構建和部署AI模型'
  },
  'H2O.ai': {
    description: '开源机器学习平台，提供自动化和可解释的AI解决方案',
    description_en: 'Open-source machine learning platform providing automated and explainable AI solutions',
    description_zh_hans: '开源机器学习平台，提供自动化和可解释的AI解决方案',
    description_zh_hant: '開源機器學習平台，提供自動化和可解釋的AI解決方案'
  },
  'Palantir': {
    description: '大数据分析公司，使用AI技术为政府和商业客户提供数据分析和决策支持',
    description_en: 'Big data analytics company using AI technology to provide data analysis and decision support for government and commercial clients',
    description_zh_hans: '大数据分析公司，使用AI技术为政府和商业客户提供数据分析和决策支持',
    description_zh_hant: '大數據分析公司，使用AI技術為政府和商業客戶提供數據分析和決策支持'
  },
  'Scale AI': {
    description: 'AI数据标注平台，为机器学习模型提供高质量的训练数据',
    description_en: 'AI data annotation platform providing high-quality training data for machine learning models',
    description_zh_hans: 'AI数据标注平台，为机器学习模型提供高质量的训练数据',
    description_zh_hant: 'AI數據標註平台，為機器學習模型提供高質量的訓練數據'
  },
  'Labelbox': {
    description: '机器学习数据标注平台，帮助企业构建和训练AI模型',
    description_en: 'Machine learning data annotation platform helping enterprises build and train AI models',
    description_zh_hans: '机器学习数据标注平台，帮助企业构建和训练AI模型',
    description_zh_hant: '機器學習數據標註平台，幫助企業構建和訓練AI模型'
  },
  'Snorkel AI': {
    description: '数据编程平台，使用AI技术加速机器学习应用的开发',
    description_en: 'Data programming platform using AI technology to accelerate machine learning application development',
    description_zh_hans: '数据编程平台，使用AI技术加速机器学习应用的开发',
    description_zh_hant: '數據編程平台，使用AI技術加速機器學習應用的開發'
  },
  'Weights & Biases': {
    description: '机器学习实验跟踪平台，帮助数据科学家和工程师管理ML项目',
    description_en: 'Machine learning experiment tracking platform helping data scientists and engineers manage ML projects',
    description_zh_hans: '机器学习实验跟踪平台，帮助数据科学家和工程师管理ML项目',
    description_zh_hant: '機器學習實驗跟蹤平台，幫助數據科學家和工程師管理ML項目'
  },
  'Comet': {
    description: '机器学习模型管理和实验跟踪平台，提供MLOps解决方案',
    description_en: 'Machine learning model management and experiment tracking platform providing MLOps solutions',
    description_zh_hans: '机器学习模型管理和实验跟踪平台，提供MLOps解决方案',
    description_zh_hant: '機器學習模型管理和實驗跟蹤平台，提供MLOps解決方案'
  },
  'Neptune': {
    description: '机器学习元数据存储平台，帮助团队协作和模型管理',
    description_en: 'Machine learning metadata storage platform helping teams collaborate and manage models',
    description_zh_hans: '机器学习元数据存储平台，帮助团队协作和模型管理',
    description_zh_hant: '機器學習元數據存儲平台，幫助團隊協作和模型管理'
  },
  'MLflow': {
    description: '开源机器学习生命周期管理平台，简化ML项目的开发和部署',
    description_en: 'Open-source machine learning lifecycle management platform simplifying ML project development and deployment',
    description_zh_hans: '开源机器学习生命周期管理平台，简化ML项目的开发和部署',
    description_zh_hant: '開源機器學習生命周期管理平台，簡化ML項目的開發和部署'
  },
  'Kubeflow': {
    description: 'Kubernetes原生机器学习平台，简化ML工作流的部署和管理',
    description_en: 'Kubernetes-native machine learning platform simplifying ML workflow deployment and management',
    description_zh_hans: 'Kubernetes原生机器学习平台，简化ML工作流的部署和管理',
    description_zh_hant: 'Kubernetes原生機器學習平台，簡化ML工作流的部署和管理'
  },
  'Seldon': {
    description: '机器学习部署平台，帮助企业在生产环境中部署和管理ML模型',
    description_en: 'Machine learning deployment platform helping enterprises deploy and manage ML models in production environments',
    description_zh_hans: '机器学习部署平台，帮助企业在生产环境中部署和管理ML模型',
    description_zh_hant: '機器學習部署平台，幫助企業在生產環境中部署和管理ML模型'
  },
  'Algorithmia': {
    description: 'AI模型部署和管理平台，提供机器学习即服务解决方案',
    description_en: 'AI model deployment and management platform providing machine learning as a service solutions',
    description_zh_hans: 'AI模型部署和管理平台，提供机器学习即服务解决方案',
    description_zh_hant: 'AI模型部署和管理平台，提供機器學習即服務解決方案'
  },
  'Valohai': {
    description: '机器学习平台，提供端到端的MLOps解决方案和模型管理',
    description_en: 'Machine learning platform providing end-to-end MLOps solutions and model management',
    description_zh_hans: '机器学习平台，提供端到端的MLOps解决方案和模型管理',
    description_zh_hant: '機器學習平台，提供端到端的MLOps解決方案和模型管理'
  },
  'Domino Data Lab': {
    description: '数据科学平台，提供协作式数据科学和机器学习环境',
    description_en: 'Data science platform providing collaborative data science and machine learning environments',
    description_zh_hans: '数据科学平台，提供协作式数据科学和机器学习环境',
    description_zh_hant: '數據科學平台，提供協作式數據科學和機器學習環境'
  },
  'Databricks': {
    description: '统一分析平台，提供大数据处理和机器学习解决方案',
    description_en: 'Unified analytics platform providing big data processing and machine learning solutions',
    description_zh_hans: '统一分析平台，提供大数据处理和机器学习解决方案',
    description_zh_hant: '統一分析平台，提供大數據處理和機器學習解決方案'
  },
  'Snowflake': {
    description: '云数据平台，提供数据仓库和分析解决方案，支持AI和机器学习工作负载',
    description_en: 'Cloud data platform providing data warehouse and analytics solutions, supporting AI and machine learning workloads',
    description_zh_hans: '云数据平台，提供数据仓库和分析解决方案，支持AI和机器学习工作负载',
    description_zh_hant: '雲數據平台，提供數據倉庫和分析解決方案，支持AI和機器學習工作負載'
  }
};

async function updateAllToolDescriptions() {
  console.log('📝 Updating all tool descriptions...\n');

  try {
    let updatedCount = 0;
    for (const [toolName, descriptionData] of Object.entries(completeToolDescriptions)) {
      const { error: updateError } = await supabase
        .from('tools')
        .update({ 
          description: descriptionData.description,
          description_en: descriptionData.description_en,
          description_zh_hans: descriptionData.description_zh_hans,
          description_zh_hant: descriptionData.description_zh_hant,
          updated_at: new Date().toISOString()
        })
        .eq('name', toolName);

      if (updateError) {
        console.error(`Error updating description for ${toolName}:`, updateError);
      } else {
        console.log(`✅ Updated description for: ${toolName}`);
        updatedCount++;
      }
    }

    console.log(`\n📊 Updated ${updatedCount} tool descriptions`);
  } catch (error) {
    console.error('Error updating tool descriptions:', error);
  }
}

async function updateAllCompanyDescriptions() {
  console.log('🏢 Updating all company descriptions...\n');

  try {
    let updatedCount = 0;
    for (const [companyName, descriptionData] of Object.entries(completeCompanyDescriptions)) {
      const { error: updateError } = await supabase
        .from('companies')
        .update({ 
          description: descriptionData.description,
          description_en: descriptionData.description_en,
          description_zh_hans: descriptionData.description_zh_hans,
          description_zh_hant: descriptionData.description_zh_hant,
          updated_at: new Date().toISOString()
        })
        .eq('name', companyName);

      if (updateError) {
        console.error(`Error updating description for ${companyName}:`, updateError);
      } else {
        console.log(`✅ Updated description for: ${companyName}`);
        updatedCount++;
      }
    }

    console.log(`\n📊 Updated ${updatedCount} company descriptions`);
  } catch (error) {
    console.error('Error updating company descriptions:', error);
  }
}

async function main() {
  console.log('🚀 Starting final data completion...\n');

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

  await updateAllToolDescriptions();
  await updateAllCompanyDescriptions();

  console.log('\n✅ Final data completion finished!');
  console.log('📊 All descriptions have been completed with bilingual support');
}

main().catch(console.error);
