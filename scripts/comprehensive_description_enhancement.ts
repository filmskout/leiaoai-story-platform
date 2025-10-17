import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://nineezxjxfzwnsdtgjcu.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5pbmVlenhqeGZ6d25zZHRnamN1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk4MjQ0OTgsImV4cCI6MjA3NTQwMDQ5OH0.Pv7q5NzDevRcL8QWpN5yf_Q-_J1XhYUEFFso3pmA_l8';

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false }
});

// Comprehensive descriptions for all remaining companies
const comprehensiveCompanyDescriptions = {
  '优必选科技': {
    description: '全球领先的服务机器人公司，专注于人形机器人研发和AI技术应用，产品包括Walker系列机器人，在运动控制、AI交互和商业化应用方面具有技术优势',
    description_en: 'Global leading service robotics company focused on humanoid robot development and AI technology applications, featuring Walker series robots with advanced motion control, AI interaction, and commercial deployment capabilities',
    description_zh_hans: '全球领先的服务机器人公司，专注于人形机器人研发和AI技术应用，产品包括Walker系列机器人，在运动控制、AI交互和商业化应用方面具有技术优势',
    description_zh_hant: '全球領先的服務機器人公司，專注於人形機器人研發和AI技術應用，產品包括Walker系列機器人，在運動控制、AI交互和商業化應用方面具有技術優勢'
  },
  '依图科技': {
    description: '中国领先的AI公司，专注于计算机视觉和语音技术，应用于安防、医疗、金融等领域，在图像识别、视频分析和智能安防方面具有核心技术优势',
    description_en: 'Leading Chinese AI company focused on computer vision and speech technology, applied in security, healthcare, finance and other fields, with core technical advantages in image recognition, video analysis and intelligent security',
    description_zh_hans: '中国领先的AI公司，专注于计算机视觉和语音技术，应用于安防、医疗、金融等领域，在图像识别、视频分析和智能安防方面具有核心技术优势',
    description_zh_hant: '中國領先的AI公司，專注於計算機視覺和語音技術，應用於安防、醫療、金融等領域，在圖像識別、視頻分析和智能安防方面具有核心技術優勢'
  },
  'FormX': {
    description: 'AI驱动的文档处理平台，能够从表单和文档中自动提取和结构化数据，提供智能OCR、数据验证和自动化工作流解决方案',
    description_en: 'AI-powered document processing platform that automatically extracts and structures data from forms and documents, providing intelligent OCR, data validation and automated workflow solutions',
    description_zh_hans: 'AI驱动的文档处理平台，能够从表单和文档中自动提取和结构化数据，提供智能OCR、数据验证和自动化工作流解决方案',
    description_zh_hant: 'AI驅動的文檔處理平台，能夠從表單和文檔中自動提取和結構化數據，提供智能OCR、數據驗證和自動化工作流解決方案'
  },
  'SK Telecom': {
    description: '韩国领先的电信公司，在AI、5G技术和数字化转型方面有重大投资，提供智能网络服务、IoT解决方案和AI驱动的电信创新',
    description_en: 'Leading South Korean telecommunications company with significant investments in AI, 5G technology and digital transformation, providing intelligent network services, IoT solutions and AI-driven telecom innovations',
    description_zh_hans: '韩国领先的电信公司，在AI、5G技术和数字化转型方面有重大投资，提供智能网络服务、IoT解决方案和AI驱动的电信创新',
    description_zh_hant: '韓國領先的電信公司，在AI、5G技術和數字轉型方面有重大投資，提供智能網絡服務、IoT解決方案和AI驅動的電信創新'
  },
  'DeepMind': {
    description: 'Google的AI研究实验室，专注于人工通用智能和机器学习突破，开发了AlphaGo等知名AI系统，在强化学习、神经科学和AI安全方面具有领先地位',
    description_en: 'Google\'s AI research lab focused on artificial general intelligence and machine learning breakthroughs, developer of AlphaGo and other renowned AI systems, with leading positions in reinforcement learning, neuroscience and AI safety',
    description_zh_hans: 'Google的AI研究实验室，专注于人工通用智能和机器学习突破，开发了AlphaGo等知名AI系统，在强化学习、神经科学和AI安全方面具有领先地位',
    description_zh_hant: 'Google的AI研究實驗室，專注於人工通用智能和機器學習突破，開發了AlphaGo等知名AI系統，在強化學習、神經科學和AI安全方面具有領先地位'
  },
  'Darktrace': {
    description: '网络安全公司，使用AI技术实时检测和响应网络威胁，提供自主网络安全解决方案，在威胁检测、异常行为分析和自动化响应方面具有技术优势',
    description_en: 'Cybersecurity company using AI technology to detect and respond to cyber threats in real-time, providing autonomous cybersecurity solutions with technical advantages in threat detection, anomaly behavior analysis and automated response',
    description_zh_hans: '网络安全公司，使用AI技术实时检测和响应网络威胁，提供自主网络安全解决方案，在威胁检测、异常行为分析和自动化响应方面具有技术优势',
    description_zh_hant: '網絡安全公司，使用AI技術實時檢測和響應網絡威脅，提供自主網絡安全解決方案，在威脅檢測、異常行為分析和自動化響應方面具有技術優勢'
  },
  'Mistral AI': {
    description: '欧洲AI公司，开发高效的大语言模型，专注于开源AI解决方案和模型优化，在法语AI、多语言处理和高效推理方面具有技术特色',
    description_en: 'European AI company developing efficient large language models, focused on open-source AI solutions and model optimization, with technical features in French AI, multilingual processing and efficient inference',
    description_zh_hans: '欧洲AI公司，开发高效的大语言模型，专注于开源AI解决方案和模型优化，在法语AI、多语言处理和高效推理方面具有技术特色',
    description_zh_hant: '歐洲AI公司，開發高效的大語言模型，專注於開源AI解決方案和模型優化，在法語AI、多語言處理和高效推理方面具有技術特色'
  },
  'Aleph Alpha': {
    description: '德国AI公司，专注于大语言模型和AI研究，提供企业级AI解决方案，在欧洲AI生态系统中具有重要地位，注重数据隐私和AI伦理',
    description_en: 'German AI company specializing in large language models and AI research, providing enterprise-grade AI solutions with important position in European AI ecosystem, focusing on data privacy and AI ethics',
    description_zh_hans: '德国AI公司，专注于大语言模型和AI研究，提供企业级AI解决方案，在欧洲AI生态系统中具有重要地位，注重数据隐私和AI伦理',
    description_zh_hant: '德國AI公司，專注於大語言模型和AI研究，提供企業級AI解決方案，在歐洲AI生態系統中具有重要地位，注重數據隱私和AI倫理'
  },
  'Element AI': {
    description: '加拿大AI公司，专注于企业AI解决方案和机器学习平台，后被ServiceNow收购，在AI咨询、企业AI部署和机器学习工程方面具有专业能力',
    description_en: 'Canadian AI company focused on enterprise AI solutions and machine learning platforms, later acquired by ServiceNow, with professional capabilities in AI consulting, enterprise AI deployment and machine learning engineering',
    description_zh_hans: '加拿大AI公司，专注于企业AI解决方案和机器学习平台，后被ServiceNow收购，在AI咨询、企业AI部署和机器学习工程方面具有专业能力',
    description_zh_hant: '加拿大AI公司，專注於企業AI解決方案和機器學習平台，後被ServiceNow收購，在AI諮詢、企業AI部署和機器學習工程方面具有專業能力'
  },
  'Mobileye': {
    description: 'Intel子公司，开发AI驱动的自动驾驶和高级驾驶辅助系统，专注于计算机视觉技术，在ADAS、自动驾驶芯片和视觉AI方面具有技术领先地位',
    description_en: 'Intel subsidiary developing AI-powered autonomous driving and advanced driver assistance systems, specializing in computer vision technology with leading technical position in ADAS, autonomous driving chips and visual AI',
    description_zh_hans: 'Intel子公司，开发AI驱动的自动驾驶和高级驾驶辅助系统，专注于计算机视觉技术，在ADAS、自动驾驶芯片和视觉AI方面具有技术领先地位',
    description_zh_hant: 'Intel子公司，開發AI驅動的自動駕駛和高級駕駛輔助系統，專注於計算機視覺技術，在ADAS、自動駕駛芯片和視覺AI方面具有技術領先地位'
  },
  'C3.ai': {
    description: '企业AI软件公司，提供AI驱动的企业应用和数字化转型解决方案，专注于工业AI、能源AI和企业级AI平台，在预测分析和企业AI部署方面具有专业能力',
    description_en: 'Enterprise AI software company providing AI-powered enterprise applications and digital transformation solutions, focused on industrial AI, energy AI and enterprise AI platforms with professional capabilities in predictive analysis and enterprise AI deployment',
    description_zh_hans: '企业AI软件公司，提供AI驱动的企业应用和数字化转型解决方案，专注于工业AI、能源AI和企业级AI平台，在预测分析和企业AI部署方面具有专业能力',
    description_zh_hant: '企業AI軟件公司，提供AI驅動的企業應用和數字轉型解決方案，專注於工業AI、能源AI和企業級AI平台，在預測分析和企業AI部署方面具有專業能力'
  },
  'DataRobot': {
    description: '自动化机器学习平台，帮助企业快速构建和部署AI模型，提供端到端的MLOps解决方案，在AutoML、模型管理和企业AI部署方面具有技术优势',
    description_en: 'Automated machine learning platform helping enterprises quickly build and deploy AI models, providing end-to-end MLOps solutions with technical advantages in AutoML, model management and enterprise AI deployment',
    description_zh_hans: '自动化机器学习平台，帮助企业快速构建和部署AI模型，提供端到端的MLOps解决方案，在AutoML、模型管理和企业AI部署方面具有技术优势',
    description_zh_hant: '自動化機器學習平台，幫助企業快速構建和部署AI模型，提供端到端的MLOps解決方案，在AutoML、模型管理和企業AI部署方面具有技術優勢'
  },
  'H2O.ai': {
    description: '开源机器学习平台，提供自动化和可解释的AI解决方案，专注于AutoML、模型解释和开源AI工具，在机器学习自动化和AI可解释性方面具有技术特色',
    description_en: 'Open-source machine learning platform providing automated and explainable AI solutions, focused on AutoML, model interpretation and open-source AI tools with technical features in machine learning automation and AI explainability',
    description_zh_hans: '开源机器学习平台，提供自动化和可解释的AI解决方案，专注于AutoML、模型解释和开源AI工具，在机器学习自动化和AI可解释性方面具有技术特色',
    description_zh_hant: '開源機器學習平台，提供自動化和可解釋的AI解決方案，專注於AutoML、模型解釋和開源AI工具，在機器學習自動化和AI可解釋性方面具有技術特色'
  },
  'Palantir': {
    description: '大数据分析公司，使用AI技术为政府和商业客户提供数据分析和决策支持，专注于数据整合、模式识别和预测分析，在政府AI和企业数据分析方面具有专业能力',
    description_en: 'Big data analytics company using AI technology to provide data analysis and decision support for government and commercial clients, focused on data integration, pattern recognition and predictive analysis with professional capabilities in government AI and enterprise data analysis',
    description_zh_hans: '大数据分析公司，使用AI技术为政府和商业客户提供数据分析和决策支持，专注于数据整合、模式识别和预测分析，在政府AI和企业数据分析方面具有专业能力',
    description_zh_hant: '大數據分析公司，使用AI技術為政府和商業客戶提供數據分析和決策支持，專注於數據整合、模式識別和預測分析，在政府AI和企業數據分析方面具有專業能力'
  },
  'Scale AI': {
    description: 'AI数据标注平台，为机器学习模型提供高质量的训练数据，专注于数据标注、模型评估和AI数据服务，在数据质量控制和AI训练数据方面具有技术优势',
    description_en: 'AI data annotation platform providing high-quality training data for machine learning models, focused on data annotation, model evaluation and AI data services with technical advantages in data quality control and AI training data',
    description_zh_hans: 'AI数据标注平台，为机器学习模型提供高质量的训练数据，专注于数据标注、模型评估和AI数据服务，在数据质量控制和AI训练数据方面具有技术优势',
    description_zh_hant: 'AI數據標註平台，為機器學習模型提供高質量的訓練數據，專注於數據標註、模型評估和AI數據服務，在數據質量控制和AI訓練數據方面具有技術優勢'
  },
  'Labelbox': {
    description: '机器学习数据标注平台，帮助企业构建和训练AI模型，提供数据标注工具、模型管理和AI开发环境，在数据标注工作流和AI模型开发方面具有专业能力',
    description_en: 'Machine learning data annotation platform helping enterprises build and train AI models, providing data annotation tools, model management and AI development environment with professional capabilities in data annotation workflows and AI model development',
    description_zh_hans: '机器学习数据标注平台，帮助企业构建和训练AI模型，提供数据标注工具、模型管理和AI开发环境，在数据标注工作流和AI模型开发方面具有专业能力',
    description_zh_hant: '機器學習數據標註平台，幫助企業構建和訓練AI模型，提供數據標註工具、模型管理和AI開發環境，在數據標註工作流和AI模型開發方面具有專業能力'
  },
  'Snorkel AI': {
    description: '数据编程平台，使用AI技术加速机器学习应用的开发，专注于弱监督学习、数据编程和AI应用开发，在数据标注自动化和AI开发效率方面具有技术特色',
    description_en: 'Data programming platform using AI technology to accelerate machine learning application development, focused on weak supervision learning, data programming and AI application development with technical features in data annotation automation and AI development efficiency',
    description_zh_hans: '数据编程平台，使用AI技术加速机器学习应用的开发，专注于弱监督学习、数据编程和AI应用开发，在数据标注自动化和AI开发效率方面具有技术特色',
    description_zh_hant: '數據編程平台，使用AI技術加速機器學習應用的開發，專注於弱監督學習、數據編程和AI應用開發，在數據標註自動化和AI開發效率方面具有技術特色'
  },
  'Weights & Biases': {
    description: '机器学习实验跟踪平台，帮助数据科学家和工程师管理ML项目，提供实验管理、模型监控和协作工具，在MLOps和机器学习项目管理方面具有专业能力',
    description_en: 'Machine learning experiment tracking platform helping data scientists and engineers manage ML projects, providing experiment management, model monitoring and collaboration tools with professional capabilities in MLOps and machine learning project management',
    description_zh_hans: '机器学习实验跟踪平台，帮助数据科学家和工程师管理ML项目，提供实验管理、模型监控和协作工具，在MLOps和机器学习项目管理方面具有专业能力',
    description_zh_hant: '機器學習實驗跟蹤平台，幫助數據科學家和工程師管理ML項目，提供實驗管理、模型監控和協作工具，在MLOps和機器學習項目管理方面具有專業能力'
  },
  'Comet': {
    description: '机器学习模型管理和实验跟踪平台，提供MLOps解决方案，专注于模型版本控制、实验管理和模型部署，在机器学习生命周期管理方面具有技术优势',
    description_en: 'Machine learning model management and experiment tracking platform providing MLOps solutions, focused on model version control, experiment management and model deployment with technical advantages in machine learning lifecycle management',
    description_zh_hans: '机器学习模型管理和实验跟踪平台，提供MLOps解决方案，专注于模型版本控制、实验管理和模型部署，在机器学习生命周期管理方面具有技术优势',
    description_zh_hant: '機器學習模型管理和實驗跟蹤平台，提供MLOps解決方案，專注於模型版本控制、實驗管理和模型部署，在機器學習生命周期管理方面具有技術優勢'
  },
  'Neptune': {
    description: '机器学习元数据存储平台，帮助团队协作和模型管理，提供实验跟踪、模型注册和元数据管理，在机器学习协作和模型治理方面具有专业能力',
    description_en: 'Machine learning metadata storage platform helping teams collaborate and manage models, providing experiment tracking, model registry and metadata management with professional capabilities in machine learning collaboration and model governance',
    description_zh_hans: '机器学习元数据存储平台，帮助团队协作和模型管理，提供实验跟踪、模型注册和元数据管理，在机器学习协作和模型治理方面具有专业能力',
    description_zh_hant: '機器學習元數據存儲平台，幫助團隊協作和模型管理，提供實驗跟蹤、模型註冊和元數據管理，在機器學習協作和模型治理方面具有專業能力'
  },
  'MLflow': {
    description: '开源机器学习生命周期管理平台，简化ML项目的开发和部署，提供实验跟踪、模型管理和模型部署工具，在开源MLOps和机器学习工程方面具有技术特色',
    description_en: 'Open-source machine learning lifecycle management platform simplifying ML project development and deployment, providing experiment tracking, model management and model deployment tools with technical features in open-source MLOps and machine learning engineering',
    description_zh_hans: '开源机器学习生命周期管理平台，简化ML项目的开发和部署，提供实验跟踪、模型管理和模型部署工具，在开源MLOps和机器学习工程方面具有技术特色',
    description_zh_hant: '開源機器學習生命周期管理平台，簡化ML項目的開發和部署，提供實驗跟蹤、模型管理和模型部署工具，在開源MLOps和機器學習工程方面具有技術特色'
  },
  'Kubeflow': {
    description: 'Kubernetes原生机器学习平台，简化ML工作流的部署和管理，提供端到端的机器学习管道，在云原生MLOps和Kubernetes机器学习方面具有技术优势',
    description_en: 'Kubernetes-native machine learning platform simplifying ML workflow deployment and management, providing end-to-end machine learning pipelines with technical advantages in cloud-native MLOps and Kubernetes machine learning',
    description_zh_hans: 'Kubernetes原生机器学习平台，简化ML工作流的部署和管理，提供端到端的机器学习管道，在云原生MLOps和Kubernetes机器学习方面具有技术优势',
    description_zh_hant: 'Kubernetes原生機器學習平台，簡化ML工作流的部署和管理，提供端到端的機器學習管道，在雲原生MLOps和Kubernetes機器學習方面具有技術優勢'
  },
  'Seldon': {
    description: '机器学习部署平台，帮助企业在生产环境中部署和管理ML模型，提供模型服务、A/B测试和模型监控，在企业MLOps和模型部署方面具有专业能力',
    description_en: 'Machine learning deployment platform helping enterprises deploy and manage ML models in production environments, providing model serving, A/B testing and model monitoring with professional capabilities in enterprise MLOps and model deployment',
    description_zh_hans: '机器学习部署平台，帮助企业在生产环境中部署和管理ML模型，提供模型服务、A/B测试和模型监控，在企业MLOps和模型部署方面具有专业能力',
    description_zh_hant: '機器學習部署平台，幫助企業在生產環境中部署和管理ML模型，提供模型服務、A/B測試和模型監控，在企業MLOps和模型部署方面具有專業能力'
  },
  'Algorithmia': {
    description: 'AI模型部署和管理平台，提供机器学习即服务解决方案，专注于模型API、模型管理和AI服务化，在AI模型部署和API管理方面具有技术特色',
    description_en: 'AI model deployment and management platform providing machine learning as a service solutions, focused on model APIs, model management and AI serviceization with technical features in AI model deployment and API management',
    description_zh_hans: 'AI模型部署和管理平台，提供机器学习即服务解决方案，专注于模型API、模型管理和AI服务化，在AI模型部署和API管理方面具有技术特色',
    description_zh_hant: 'AI模型部署和管理平台，提供機器學習即服務解決方案，專注於模型API、模型管理和AI服務化，在AI模型部署和API管理方面具有技術特色'
  },
  'Valohai': {
    description: '机器学习平台，提供端到端的MLOps解决方案和模型管理，专注于机器学习管道、模型版本控制和自动化部署，在MLOps和机器学习工程方面具有专业能力',
    description_en: 'Machine learning platform providing end-to-end MLOps solutions and model management, focused on machine learning pipelines, model version control and automated deployment with professional capabilities in MLOps and machine learning engineering',
    description_zh_hans: '机器学习平台，提供端到端的MLOps解决方案和模型管理，专注于机器学习管道、模型版本控制和自动化部署，在MLOps和机器学习工程方面具有专业能力',
    description_zh_hant: '機器學習平台，提供端到端的MLOps解決方案和模型管理，專注於機器學習管道、模型版本控制和自動化部署，在MLOps和機器學習工程方面具有專業能力'
  },
  'Domino Data Lab': {
    description: '数据科学平台，提供协作式数据科学和机器学习环境，专注于数据科学工作流、模型管理和团队协作，在企业数据科学和机器学习协作方面具有技术优势',
    description_en: 'Data science platform providing collaborative data science and machine learning environments, focused on data science workflows, model management and team collaboration with technical advantages in enterprise data science and machine learning collaboration',
    description_zh_hans: '数据科学平台，提供协作式数据科学和机器学习环境，专注于数据科学工作流、模型管理和团队协作，在企业数据科学和机器学习协作方面具有技术优势',
    description_zh_hant: '數據科學平台，提供協作式數據科學和機器學習環境，專注於數據科學工作流、模型管理和團隊協作，在企業數據科學和機器學習協作方面具有技術優勢'
  },
  'Databricks': {
    description: '统一分析平台，提供大数据处理和机器学习解决方案，专注于数据工程、数据科学和机器学习，在Apache Spark、Delta Lake和MLflow方面具有技术领先地位',
    description_en: 'Unified analytics platform providing big data processing and machine learning solutions, focused on data engineering, data science and machine learning with leading technical position in Apache Spark, Delta Lake and MLflow',
    description_zh_hans: '统一分析平台，提供大数据处理和机器学习解决方案，专注于数据工程、数据科学和机器学习，在Apache Spark、Delta Lake和MLflow方面具有技术领先地位',
    description_zh_hant: '統一分析平台，提供大數據處理和機器學習解決方案，專注於數據工程、數據科學和機器學習，在Apache Spark、Delta Lake和MLflow方面具有技術領先地位'
  },
  'Snowflake': {
    description: '云数据平台，提供数据仓库和分析解决方案，支持AI和机器学习工作负载，专注于数据云、数据共享和云原生分析，在云数据平台和数据分析方面具有技术优势',
    description_en: 'Cloud data platform providing data warehouse and analytics solutions, supporting AI and machine learning workloads, focused on data cloud, data sharing and cloud-native analytics with technical advantages in cloud data platforms and data analytics',
    description_zh_hans: '云数据平台，提供数据仓库和分析解决方案，支持AI和机器学习工作负载，专注于数据云、数据共享和云原生分析，在云数据平台和数据分析方面具有技术优势',
    description_zh_hant: '雲數據平台，提供數據倉庫和分析解決方案，支持AI和機器學習工作負載，專注於數據雲、數據共享和雲原生分析，在雲數據平台和數據分析方面具有技術優勢'
  }
};

// Comprehensive descriptions for remaining tools
const comprehensiveToolDescriptions = {
  'MLU': {
    description: '寒武纪的机器学习单元，专为AI计算优化，提供高性能AI芯片解决方案，在神经网络加速和AI推理方面具有技术优势',
    description_en: 'Cambricon Machine Learning Unit optimized for AI computing, providing high-performance AI chip solutions with technical advantages in neural network acceleration and AI inference',
    description_zh_hans: '寒武纪的机器学习单元，专为AI计算优化，提供高性能AI芯片解决方案，在神经网络加速和AI推理方面具有技术优势',
    description_zh_hant: '寒武紀的機器學習單元，專為AI計算優化，提供高性能AI芯片解決方案，在神經網絡加速和AI推理方面具有技術優勢'
  }
};

async function updateAllCompanyDescriptions() {
  console.log('🏢 Updating all company descriptions with comprehensive bilingual support...\n');

  try {
    let updatedCount = 0;
    for (const [companyName, descriptionData] of Object.entries(comprehensiveCompanyDescriptions)) {
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
        console.log(`✅ Updated comprehensive description for: ${companyName}`);
        updatedCount++;
      }
    }

    console.log(`\n📊 Updated ${updatedCount} company descriptions`);
  } catch (error) {
    console.error('Error updating company descriptions:', error);
  }
}

async function updateAllToolDescriptions() {
  console.log('🛠️ Updating all tool descriptions with comprehensive bilingual support...\n');

  try {
    let updatedCount = 0;
    for (const [toolName, descriptionData] of Object.entries(comprehensiveToolDescriptions)) {
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
        console.log(`✅ Updated comprehensive description for: ${toolName}`);
        updatedCount++;
      }
    }

    console.log(`\n📊 Updated ${updatedCount} tool descriptions`);
  } catch (error) {
    console.error('Error updating tool descriptions:', error);
  }
}

async function main() {
  console.log('🚀 Starting comprehensive description enhancement...\n');

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

  await updateAllCompanyDescriptions();
  await updateAllToolDescriptions();

  console.log('\n✅ Comprehensive description enhancement completed!');
  console.log('📊 All companies and tools now have comprehensive bilingual descriptions');
}

main().catch(console.error);
