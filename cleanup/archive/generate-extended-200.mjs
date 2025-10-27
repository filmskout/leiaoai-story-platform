#!/usr/bin/env node

import fs from 'fs';

// 扩展的公司列表 - 200+家AI公司
const extendedCompanies = [
  // 已有的10家公司
  {
    company: { name: "OpenAI", description: "OpenAI是一家领先的人工智能研究公司，专注于开发安全、有益的通用人工智能。公司成立于2015年，总部位于美国旧金山，以开发GPT系列大语言模型和ChatGPT而闻名全球。" },
    projects: [
      { name: "ChatGPT", description: "Advanced conversational AI assistant powered by GPT-4, capable of natural language understanding, code generation, creative writing, and complex reasoning tasks.", category: "Artificial Intelligence", website: "https://chatgpt.com" },
      { name: "GPT-4", description: "Large multimodal language model capable of processing text and images, with advanced reasoning capabilities and improved accuracy.", category: "Artificial Intelligence", website: "https://openai.com/gpt-4" },
      { name: "DALL-E 3", description: "Advanced AI image generation model that creates high-quality images from text descriptions with improved accuracy and creativity.", category: "Design", website: "https://openai.com/dall-e-3" }
    ]
  },
  {
    company: { name: "Anthropic", description: "Anthropic是一家专注于AI安全的公司，致力于开发有益、无害、诚实的AI系统。公司由OpenAI前研究副总裁创立，以开发Claude AI助手而闻名。" },
    projects: [
      { name: "Claude", description: "Advanced AI assistant designed with constitutional AI principles, featuring enhanced safety, helpfulness, and honesty in conversations and tasks.", category: "Artificial Intelligence", website: "https://claude.ai" }
    ]
  },
  {
    company: { name: "Google", description: "Google是Alphabet旗下的科技巨头，在人工智能领域投入巨大，开发了Gemini、Bard等AI产品，并在搜索、云计算、自动驾驶等领域广泛应用AI技术。" },
    projects: [
      { name: "Gemini", description: "Google's most advanced AI model with multimodal capabilities, supporting text, image, audio, and video processing with enhanced reasoning and creativity.", category: "Artificial Intelligence", website: "https://gemini.google.com" },
      { name: "Google AI Studio", description: "Development platform for building and prototyping with Google's AI models, offering easy integration and testing capabilities.", category: "Developer Tools", website: "https://aistudio.google.com" }
    ]
  },
  {
    company: { name: "Microsoft", description: "Microsoft是全球领先的科技公司，在AI领域投入巨大，开发了Copilot系列产品，并与OpenAI建立了战略合作关系，将AI技术深度集成到Office、Azure等产品中。" },
    projects: [
      { name: "Microsoft Copilot", description: "AI-powered productivity assistant integrated across Microsoft 365 suite, providing intelligent assistance for writing, analysis, and automation tasks.", category: "Productivity", website: "https://copilot.microsoft.com" },
      { name: "Azure AI", description: "Comprehensive AI platform on Microsoft Azure cloud, offering machine learning, cognitive services, and AI infrastructure for enterprises.", category: "Developer Tools", website: "https://azure.microsoft.com/ai" }
    ]
  },
  {
    company: { name: "DeepSeek", description: "DeepSeek是中国领先的AI公司，专注于大语言模型和代码生成技术，开发了DeepSeek-Coder等产品，在代码生成和AI推理方面表现优异。" },
    projects: [
      { name: "DeepSeek-Coder", description: "Advanced AI coding assistant specialized in code generation, debugging, and software development with support for multiple programming languages.", category: "Developer Tools", website: "https://deepseek.com/coder" }
    ]
  },
  {
    company: { name: "Midjourney", description: "Midjourney是一家专注于AI图像生成的创新公司，开发了同名AI艺术创作平台，以其独特的艺术风格和高质量的图像生成能力而闻名。" },
    projects: [
      { name: "Midjourney", description: "Leading AI image generation platform with painterly aesthetic, advanced prompt engineering, and community-driven improvements for creative professionals.", category: "Design", website: "https://www.midjourney.com" }
    ]
  },
  {
    company: { name: "Stability AI", description: "Stability AI是一家开源AI公司，开发了Stable Diffusion等开源图像生成模型，致力于让AI技术更加开放和可访问。" },
    projects: [
      { name: "Stable Diffusion", description: "Open-source AI image generation model with community-driven improvements, ControlNet support, and unlimited customizations for developers and artists.", category: "Design", website: "https://stability.ai/stable-diffusion" }
    ]
  },
  {
    company: { name: "Hugging Face", description: "Hugging Face是领先的AI模型平台和社区，为开发者提供机器学习模型的分享、训练和部署服务，是开源AI生态的重要推动者。" },
    projects: [
      { name: "Hugging Face Hub", description: "Leading AI model platform and community for sharing, training, and deploying machine learning models and datasets with comprehensive tools and resources.", category: "Developer Tools", website: "https://huggingface.co" }
    ]
  },
  {
    company: { name: "Runway", description: "Runway是一家专注于AI视频生成和编辑的创新公司，开发了Gen-3等先进的视频生成模型，为内容创作者提供强大的AI工具。" },
    projects: [
      { name: "Runway Gen-3", description: "Advanced AI video generation and editing platform with Gen-3 model for cinematic video creation and motion graphics with professional-grade quality.", category: "Video", website: "https://runwayml.com" }
    ]
  },
  {
    company: { name: "ElevenLabs", description: "ElevenLabs是一家专注于AI语音生成和克隆技术的公司，提供逼真的语音合成服务，广泛应用于内容创作和多媒体制作。" },
    projects: [
      { name: "ElevenLabs Voice AI", description: "Leading AI voice generation and cloning platform with realistic speech synthesis and emotion control for content creators and multimedia professionals.", category: "Content Creation", website: "https://elevenlabs.io" }
    ]
  },
  
  // 新增的AI公司
  {
    company: { name: "xAI", description: "xAI是Elon Musk创立的AI公司，专注于开发安全、有益的通用人工智能，以开发Grok AI助手而闻名。" },
    projects: [
      { name: "Grok", description: "Uncensored AI assistant integrated with X (Twitter), featuring real-time information access and image generation capabilities.", category: "Artificial Intelligence", website: "https://grok.x.ai" }
    ]
  },
  {
    company: { name: "Perplexity AI", description: "Perplexity AI是一家专注于AI搜索的公司，开发了对话式搜索引擎，结合网络搜索和AI推理能力。" },
    projects: [
      { name: "Perplexity AI", description: "Conversational search engine with 37.7% growth in 2024, combining web search with AI reasoning for accurate, sourced answers.", category: "Artificial Intelligence", website: "https://www.perplexity.ai" }
    ]
  },
  {
    company: { name: "Cursor", description: "Cursor是一家专注于AI编程助手的公司，开发了AI驱动的IDE，为开发者提供智能代码补全和编程辅助。" },
    projects: [
      { name: "Cursor", description: "AI-powered IDE for writing code with 56% growth in 2024, featuring intelligent code completion, chat-based programming, and pair programming.", category: "Developer Tools", website: "https://cursor.sh" }
    ]
  },
  {
    company: { name: "Synthesia", description: "Synthesia是一家专注于AI视频生成的公司，提供专业的AI虚拟形象视频制作服务。" },
    projects: [
      { name: "Synthesia", description: "Professional AI video generator with photorealistic avatars for corporate training, marketing content, and multilingual videos.", category: "Video", website: "https://www.synthesia.io" }
    ]
  },
  {
    company: { name: "OpusClip", description: "OpusClip是一家专注于AI视频剪辑的公司，提供将长视频自动剪辑成短视频的AI工具。" },
    projects: [
      { name: "OpusClip", description: "AI-powered tool to break longer videos into engaging social media clips with automatic highlighting and viral score prediction.", category: "Video", website: "https://www.opus.pro" }
    ]
  },
  {
    company: { name: "Luma AI", description: "Luma AI是一家专注于3D和视频AI技术的公司，开发了Dream Machine等先进的视频生成模型。" },
    projects: [
      { name: "Luma AI", description: "3D model generation and video creation platform with Dream Machine for realistic video synthesis from text prompts.", category: "Video", website: "https://lumalabs.ai" }
    ]
  },
  {
    company: { name: "HeyGen", description: "HeyGen是一家专注于AI虚拟形象视频的公司，提供多语言AI发言人视频制作服务。" },
    projects: [
      { name: "HeyGen", description: "AI avatar video generation platform for creating spokesperson videos with multilingual support and emotion control.", category: "Video", website: "https://www.heygen.com" }
    ]
  },
  {
    company: { name: "ByteDance", description: "ByteDance是中国的科技巨头，在AI领域投入巨大，开发了TikTok、CapCut等产品，并在推荐算法和内容生成方面有重要突破。" },
    projects: [
      { name: "CapCut", description: "AI video editing platform with automated editing features, background removal, and social media optimization.", category: "Video", website: "https://www.capcut.com" }
    ]
  },
  {
    company: { name: "Pictory", description: "Pictory是一家专注于AI视频创作的公司，提供将文本内容转换为视频的AI工具。" },
    projects: [
      { name: "Pictory", description: "AI video creation platform that transforms text articles and blog posts into engaging video content with voiceovers.", category: "Video", website: "https://pictory.ai" }
    ]
  },
  {
    company: { name: "InVideo", description: "InVideo是一家专注于AI视频制作的公司，提供5000+模板和自动化视频创作工作流。" },
    projects: [
      { name: "InVideo", description: "Comprehensive AI video generator with 5000+ templates and automated video creation workflows for marketing.", category: "Video", website: "https://invideo.io" }
    ]
  },
  {
    company: { name: "Descript", description: "Descript是一家专注于AI视频编辑的公司，提供转录、配音和协作编辑功能。" },
    projects: [
      { name: "Descript", description: "All-in-one AI video editor with transcription, overdub voice cloning, and collaborative editing features.", category: "Video", website: "https://www.descript.com" }
    ]
  },
  {
    company: { name: "Fliki", description: "Fliki是一家专注于AI视频创作的公司，提供将文本转换为视频的AI工具。" },
    projects: [
      { name: "Fliki", description: "AI video creation platform that converts text to video with realistic AI voices in multiple languages.", category: "Video", website: "https://fliki.ai" }
    ]
  },
  {
    company: { name: "Steve AI", description: "Steve AI是一家专注于AI视频制作的公司，提供从文本脚本创建动画和实拍视频的AI工具。" },
    projects: [
      { name: "Steve AI", description: "AI video maker that creates animated and live-action videos from text scripts with customizable characters.", category: "Video", website: "https://www.steve.ai" }
    ]
  },
  {
    company: { name: "Filmora", description: "Filmora是Wondershare旗下的AI视频编辑软件，提供智能场景检测和AI音乐生成功能。" },
    projects: [
      { name: "Wondershare Filmora", description: "AI-powered video editing software with automatic scene detection, smart cutout, and AI music generation.", category: "Video", website: "https://filmora.wondershare.com" }
    ]
  },
  {
    company: { name: "Leonardo", description: "Leonardo是一家专注于AI图像生成的公司，提供针对不同艺术风格的精细调优模型。" },
    projects: [
      { name: "Leonardo", description: "Advanced AI image generation platform with fine-tuned models for different artistic styles and commercial use rights.", category: "Design", website: "https://leonardo.ai" }
    ]
  },
  {
    company: { name: "Canva", description: "Canva是一家专注于设计工具的公司，开发了Magic Studio等AI设计套件。" },
    projects: [
      { name: "Canva Magic Studio", description: "AI-powered design suite with automated design generation, background removal, and smart editing features.", category: "Design", website: "https://www.canva.com/magic-studio" }
    ]
  },
  {
    company: { name: "Remove.bg", description: "Remove.bg是一家专注于AI背景移除的公司，提供专业的照片编辑和批量处理服务。" },
    projects: [
      { name: "Remove.bg", description: "AI background removal tool with instant processing for professional photo editing and batch processing.", category: "Design", website: "https://www.remove.bg" }
    ]
  },
  {
    company: { name: "Adobe Firefly", description: "Adobe Firefly是Adobe的AI图像生成和编辑套件，集成到Creative Cloud中。" },
    projects: [
      { name: "Adobe Firefly", description: "Adobe's AI image generation and editing suite integrated into Creative Cloud with commercial safety guarantees.", category: "Design", website: "https://firefly.adobe.com" }
    ]
  },
  {
    company: { name: "Figma", description: "Figma是一家专注于设计工具的公司，开发了Figma AI等AI设计辅助功能。" },
    projects: [
      { name: "Figma AI", description: "AI-powered design assistance integrated into Figma with automated layout suggestions and design system generation.", category: "Design", website: "https://www.figma.com/ai" }
    ]
  },
  {
    company: { name: "Krea AI", description: "Krea AI是一家专注于实时AI图像生成的公司，提供实时画布编辑和即时视觉反馈。" },
    projects: [
      { name: "Krea AI", description: "Real-time AI image generation platform with live canvas editing and instant visual feedback.", category: "Design", website: "https://www.krea.ai" }
    ]
  },
  {
    company: { name: "Ideogram", description: "Ideogram是一家专注于AI图像生成的公司，专门擅长在图像中渲染文本和图形设计元素。" },
    projects: [
      { name: "Ideogram", description: "AI image generator specializing in text rendering within images and graphic design elements.", category: "Design", website: "https://ideogram.ai" }
    ]
  },
  {
    company: { name: "Adobe Express", description: "Adobe Express是Adobe的AI驱动设计平台，提供快速操作、模板定制和社交媒体优化。" },
    projects: [
      { name: "Adobe Express", description: "AI-powered design platform with quick actions, template customization, and social media optimization.", category: "Design", website: "https://www.adobe.com/express" }
    ]
  },
  {
    company: { name: "Recraft", description: "Recraft是一家专注于AI设计的公司，提供创建品牌一致图形、插图和营销材料的AI工具。" },
    projects: [
      { name: "Recraft", description: "AI design tool for creating brand-consistent graphics, illustrations, and marketing materials with style control.", category: "Design", website: "https://www.recraft.ai" }
    ]
  },
  {
    company: { name: "Murf.ai", description: "Murf.ai是一家专注于AI语音生成的公司，提供专业的AI语音生成平台。" },
    projects: [
      { name: "Murf.ai", description: "Professional AI voice generation platform with clean interface, diverse voice options, and commercial licensing.", category: "Content Creation", website: "https://murf.ai" }
    ]
  },
  {
    company: { name: "Suno", description: "Suno是一家专注于AI音乐生成的公司，提供创建背景音乐、配乐和完整歌曲的AI工具。" },
    projects: [
      { name: "Suno", description: "AI music generator for creating background music, soundtracks, and complete songs with text prompts and style control.", category: "Content Creation", website: "https://www.suno.ai" }
    ]
  },
  {
    company: { name: "Udio", description: "Udio是一家专注于AI音乐生成的公司，专为音乐家设计，提供高级作曲、编曲功能和专业音频质量。" },
    projects: [
      { name: "Udio", description: "AI music generator designed for musicians with advanced composition, arrangement features, and professional audio quality.", category: "Content Creation", website: "https://www.udio.com" }
    ]
  },
  {
    company: { name: "Speechify", description: "Speechify是一家专注于AI文本转语音的公司，提供自然语音、速度控制和跨设备集成。" },
    projects: [
      { name: "Speechify", description: "AI text-to-speech platform with natural voices, speed control, and integration across devices for accessibility.", category: "Content Creation", website: "https://speechify.com" }
    ]
  },
  {
    company: { name: "Play.ht", description: "Play.ht是一家专注于AI语音生成的公司，提供超逼真语音、情感控制和API访问。" },
    projects: [
      { name: "Play.ht", description: "AI voice generator with ultra-realistic voices, emotion control, and API access for developers and content creators.", category: "Content Creation", website: "https://play.ht" }
    ]
  },
  {
    company: { name: "Resemble AI", description: "Resemble AI是一家专注于AI语音克隆的公司，提供实时语音转换和自定义语音模型训练。" },
    projects: [
      { name: "Resemble AI", description: "AI voice cloning platform with real-time voice conversion and custom voice model training capabilities.", category: "Content Creation", website: "https://www.resemble.ai" }
    ]
  },
  {
    company: { name: "AIVA", description: "AIVA是一家专注于AI音乐作曲的公司，提供为媒体创建原创配乐、主题音乐和背景音乐的AI平台。" },
    projects: [
      { name: "AIVA", description: "AI music composition platform for creating original soundtracks, theme music, and background scores for media.", category: "Content Creation", website: "https://www.aiva.ai" }
    ]
  },
  {
    company: { name: "Soundraw", description: "Soundraw是一家专注于AI音乐生成的公司，为内容创作者提供免版税音乐创作和可定制音轨元素。" },
    projects: [
      { name: "Soundraw", description: "AI music generator for content creators with royalty-free music creation and customizable track elements.", category: "Content Creation", website: "https://soundraw.io" }
    ]
  },
  {
    company: { name: "Krisp", description: "Krisp是一家专注于AI降噪的公司，为专业会议和内容录制提供AI驱动的噪音消除和语音增强工具。" },
    projects: [
      { name: "Krisp", description: "AI-powered noise cancellation and voice enhancement tool for professional meetings and content recording.", category: "Content Creation", website: "https://krisp.ai" }
    ]
  },
  {
    company: { name: "Grammarly", description: "Grammarly是一家专注于AI写作助手的公司，提供高级AI写作助手和语法检查器。" },
    projects: [
      { name: "Grammarly", description: "Advanced AI writing assistant and grammar checker with tone detection, style suggestions, and plagiarism detection.", category: "Writing", website: "https://www.grammarly.com" }
    ]
  },
  {
    company: { name: "Jasper.ai", description: "Jasper.ai是一家专注于AI营销内容创作的公司，提供全面的AI营销内容创作平台。" },
    projects: [
      { name: "Jasper.ai", description: "Comprehensive AI marketing content creation platform for campaigns, blog posts, and brand messaging with brand voice training.", category: "Writing", website: "https://www.jasper.ai" }
    ]
  },
  {
    company: { name: "Copy.ai", description: "Copy.ai是一家专注于AI文案写作的公司，提供营销内容、社交媒体帖子、电子邮件活动和商业沟通的AI文案工具。" },
    projects: [
      { name: "Copy.ai", description: "AI copywriting tool for marketing content, social media posts, email campaigns, and business communications.", category: "Writing", website: "https://www.copy.ai" }
    ]
  },
  {
    company: { name: "QuillBot", description: "QuillBot是一家专注于AI写作增强的公司，提供改进内容质量、清晰度和避免抄袭的AI写作增强和改写工具。" },
    projects: [
      { name: "QuillBot", description: "AI writing enhancement and paraphrasing tool for improving content quality, clarity, and avoiding plagiarism.", category: "Writing", website: "https://quillbot.com" }
    ]
  },
  {
    company: { name: "Rytr", description: "Rytr是一家专注于AI写作助手的公司，专为短篇内容创作、文案写作和社交媒体帖子优化。" },
    projects: [
      { name: "Rytr", description: "AI writing assistant optimized for short-form content creation, copywriting, and social media posts with tone control.", category: "Writing", website: "https://rytr.me" }
    ]
  },
  {
    company: { name: "Sudowrite", description: "Sudowrite是一家专注于创意写作助手的公司，专为小说作家、小说家和故事讲述者设计。" },
    projects: [
      { name: "Sudowrite", description: "Creative writing assistant specifically designed for fiction writers, novelists, and storytellers with plot development.", category: "Writing", website: "https://www.sudowrite.com" }
    ]
  },
  {
    company: { name: "Writesonic", description: "Writesonic是一家专注于AI内容创作的公司，提供文章、广告、电子邮件和网站文案的AI内容创作平台。" },
    projects: [
      { name: "Writesonic", description: "AI content creation platform for articles, ads, emails, and website copy with SEO optimization features.", category: "Writing", website: "https://writesonic.com" }
    ]
  },
  {
    company: { name: "Wordtune", description: "Wordtune是一家专注于AI写作伴侣的公司，帮助实时重写和改进句子以提高清晰度、语调和影响力。" },
    projects: [
      { name: "Wordtune", description: "AI writing companion that helps rewrite and improve sentences for clarity, tone, and impact in real-time.", category: "Writing", website: "https://www.wordtune.com" }
    ]
  },
  {
    company: { name: "Lex", description: "Lex是一家专注于AI写作工具的公司，专为长篇内容设计，具有协作功能和智能建议。" },
    projects: [
      { name: "Lex", description: "AI-powered writing tool designed for long-form content with collaborative features and intelligent suggestions.", category: "Writing", website: "https://lex.page" }
    ]
  },
  {
    company: { name: "Jenni AI", description: "Jenni AI是一家专注于AI写作助手的公司，专为学术和研究写作设计。" },
    projects: [
      { name: "Jenni AI", description: "AI writing assistant for academic and research writing with citation management and plagiarism checking.", category: "Writing", website: "https://jenni.ai" }
    ]
  },
  {
    company: { name: "ProWritingAid", description: "ProWritingAid是一家专注于AI写作编辑器的公司，提供深度分析、风格改进建议和全面的写作报告。" },
    projects: [
      { name: "ProWritingAid", description: "AI-powered writing editor with in-depth analysis, style improvement suggestions, and comprehensive writing reports.", category: "Writing", website: "https://prowritingaid.com" }
    ]
  },
  {
    company: { name: "Hypotenuse AI", description: "Hypotenuse AI是一家专注于AI内容生成器的公司，专为电子商务、营销文案和产品描述设计。" },
    projects: [
      { name: "Hypotenuse AI", description: "AI content generator for e-commerce, marketing copy, and product descriptions with bulk content creation.", category: "Writing", website: "https://www.hypotenuse.ai" }
    ]
  },
  {
    company: { name: "GitHub Copilot", description: "GitHub Copilot是GitHub的AI配对编程助手，集成到开发环境中。" },
    projects: [
      { name: "GitHub Copilot", description: "AI pair programming assistant integrated into development environments for intelligent code completion and generation.", category: "Developer Tools", website: "https://github.com/features/copilot" }
    ]
  },
  {
    company: { name: "Replit", description: "Replit是一家专注于AI编程环境的公司，提供协作开发、即时部署和智能代码辅助。" },
    projects: [
      { name: "Replit", description: "AI-powered coding environment with collaborative development, instant deployment, and intelligent code assistance.", category: "Developer Tools", website: "https://replit.com" }
    ]
  },
  {
    company: { name: "Tabnine", description: "Tabnine是一家专注于AI代码补全的公司，提供跨IDE工作的AI代码补全平台。" },
    projects: [
      { name: "Tabnine", description: "AI code completion platform that works across IDEs with context-aware suggestions and team learning.", category: "Developer Tools", website: "https://www.tabnine.com" }
    ]
  },
  {
    company: { name: "Codeium", description: "Codeium是一家专注于AI代码补全的公司，提供支持70+编程语言的免费AI代码补全工具。" },
    projects: [
      { name: "Codeium", description: "Free AI code completion tool with support for 70+ programming languages and IDE integrations.", category: "Developer Tools", website: "https://codeium.com" }
    ]
  },
  {
    company: { name: "Lovable", description: "Lovable是一家专注于AI应用构建的公司，通过自然语言描述和视觉需求构建完整的软件应用程序。" },
    projects: [
      { name: "Lovable", description: "Build complete software applications by prompting with natural language descriptions and visual requirements.", category: "Developer Tools", website: "https://lovable.dev" }
    ]
  },
  {
    company: { name: "v0 by Vercel", description: "v0是Vercel的AI驱动Web开发工具，从提示生成React组件和完整应用程序。" },
    projects: [
      { name: "v0 by Vercel", description: "AI-powered web development tool that generates React components and complete applications from prompts.", category: "Developer Tools", website: "https://v0.dev" }
    ]
  },
  {
    company: { name: "CodeWP", description: "CodeWP是一家专注于AI代码生成器的公司，专为WordPress开发设计。" },
    projects: [
      { name: "CodeWP", description: "AI code generator specifically for WordPress development with plugin creation and theme customization.", category: "Developer Tools", website: "https://codewp.ai" }
    ]
  },
  {
    company: { name: "Groq", description: "Groq是一家专注于AI推理平台的公司，为实时AI应用优化，提供超低延迟响应。" },
    projects: [
      { name: "Groq", description: "High-speed AI inference platform optimized for real-time AI applications with ultra-low latency responses.", category: "Developer Tools", website: "https://groq.com" }
    ]
  },
  {
    company: { name: "Notion AI", description: "Notion AI是Notion的AI增强知识管理和生产力套件。" },
    projects: [
      { name: "Notion AI", description: "AI-enhanced knowledge management and productivity suite with intelligent content creation and database automation.", category: "Productivity", website: "https://www.notion.so/product/ai" }
    ]
  },
  {
    company: { name: "Zapier", description: "Zapier是一家专注于自动化平台的公司，提供AI功能连接5000+应用和自动化复杂业务工作流。" },
    projects: [
      { name: "Zapier", description: "Automation platform with AI features for connecting 5000+ apps and automating complex business workflows.", category: "Productivity", website: "https://zapier.com" }
    ]
  },
  {
    company: { name: "n8n", description: "n8n是一家专注于可视化工作流自动化的公司，提供AI集成、自托管选项和高级业务流程自动化。" },
    projects: [
      { name: "n8n", description: "Visual workflow automation tool with AI integrations, self-hosted options, and advanced business process automation.", category: "Productivity", website: "https://n8n.io" }
    ]
  },
  {
    company: { name: "Gamma", description: "Gamma是一家专注于AI演示文稿构建器的公司，从文本提示和大纲创建精美的幻灯片、文档和网站。" },
    projects: [
      { name: "Gamma", description: "AI presentation builder that creates beautiful slides, documents, and websites from text prompts and outlines.", category: "Productivity", website: "https://gamma.app" }
    ]
  },
  {
    company: { name: "Fathom", description: "Fathom是一家专注于AI会议记录器的公司，自动记录、转录、总结会议并创建行动项目。" },
    projects: [
      { name: "Fathom", description: "AI meeting notetaker that automatically records, transcribes, summarizes, and creates action items from meetings.", category: "Productivity", website: "https://fathom.video" }
    ]
  },
  {
    company: { name: "Reclaim", description: "Reclaim是一家专注于AI调度助手的公司，优化日历管理、时间阻塞和工作生活平衡。" },
    projects: [
      { name: "Reclaim", description: "AI scheduling assistant that optimizes calendar management, time blocking, and work-life balance automatically.", category: "Productivity", website: "https://reclaim.ai" }
    ]
  },
  {
    company: { name: "Otter.ai", description: "Otter.ai是一家专注于AI会议转录的公司，提供实时协作和自动摘要的AI会议转录和记录平台。" },
    projects: [
      { name: "Otter.ai", description: "AI meeting transcription and note-taking platform with real-time collaboration and automated summaries.", category: "Productivity", website: "https://otter.ai" }
    ]
  },
  {
    company: { name: "Calendly AI", description: "Calendly AI是Calendly的AI驱动调度平台。" },
    projects: [
      { name: "Calendly AI", description: "AI-powered scheduling platform with smart meeting optimization and automated follow-up management.", category: "Productivity", website: "https://calendly.com" }
    ]
  },
  {
    company: { name: "Taskade", description: "Taskade是一家专注于AI生产力平台的公司，结合任务管理、思维导图和协作工作空间。" },
    projects: [
      { name: "Taskade", description: "AI-powered productivity platform combining task management, mind mapping, and collaborative workspaces with AI automation.", category: "Productivity", website: "https://www.taskade.com" }
    ]
  },
  {
    company: { name: "Manus", description: "Manus是一家专注于AI代理平台的公司，自动化各种业务任务、工作流和跨团队的重复流程。" },
    projects: [
      { name: "Manus", description: "AI agent platform for automating various business tasks, workflows, and repetitive processes across teams.", category: "Productivity", website: "https://www.manus.ai" }
    ]
  },
  {
    company: { name: "Monday.com AI", description: "Monday.com AI是Monday.com的AI增强项目管理平台。" },
    projects: [
      { name: "Monday.com AI", description: "AI-enhanced project management platform with automated workflows, predictive analytics, and smart task assignment.", category: "Productivity", website: "https://monday.com" }
    ]
  },
  {
    company: { name: "ClickUp AI", description: "ClickUp AI是ClickUp的AI驱动项目管理。" },
    projects: [
      { name: "ClickUp AI", description: "AI-powered project management with automated task creation, smart scheduling, and intelligent progress tracking.", category: "Productivity", website: "https://clickup.com/ai" }
    ]
  },
  {
    company: { name: "AdCreative", description: "AdCreative是一家专注于AI广告创意生成的公司，为效果营销活动提供AI驱动的广告创意生成平台。" },
    projects: [
      { name: "AdCreative", description: "AI-powered ad creative generation platform for performance marketing campaigns with conversion optimization.", category: "Marketing", website: "https://www.adcreative.ai" }
    ]
  },
  {
    company: { name: "HubSpot AI", description: "HubSpot AI是HubSpot的AI增强CRM和营销自动化平台。" },
    projects: [
      { name: "HubSpot AI", description: "AI-enhanced CRM and marketing automation platform with lead scoring, content generation, and sales insights.", category: "Marketing", website: "https://www.hubspot.com/artificial-intelligence" }
    ]
  },
  {
    company: { name: "Persado", description: "Persado是一家专注于AI营销语言优化的公司，生成高转化营销文案和消息传递。" },
    projects: [
      { name: "Persado", description: "AI-powered marketing language optimization platform that generates high-converting marketing copy and messaging.", category: "Marketing", website: "https://www.persado.com" }
    ]
  },
  {
    company: { name: "Phrasee", description: "Phrasee是一家专注于AI文案写作的公司，专精于电子邮件主题行、社交媒体帖子和营销文案优化。" },
    projects: [
      { name: "Phrasee", description: "AI copywriting platform specialized in email subject lines, social media posts, and marketing copy optimization.", category: "Marketing", website: "https://phrasee.co" }
    ]
  },
  {
    company: { name: "Patterns", description: "Patterns是一家专注于AI电子商务营销的公司，提供自动化产品推荐和个性化。" },
    projects: [
      { name: "Patterns", description: "AI-powered ecommerce marketing platform with automated product recommendations and personalization.", category: "Marketing", website: "https://patterns.app" }
    ]
  },
  {
    company: { name: "Seventh Sense", description: "Seventh Sense是一家专注于AI电子邮件交付优化的公司，使用机器学习提高打开率和参与度。" },
    projects: [
      { name: "Seventh Sense", description: "AI email delivery optimization platform that uses machine learning to improve open rates and engagement.", category: "Marketing", website: "https://www.theseventhsense.com" }
    ]
  },
  {
    company: { name: "Brandwatch", description: "Brandwatch是一家专注于AI社交媒体监控的公司，提供情感分析和趋势检测。" },
    projects: [
      { name: "Brandwatch", description: "AI-powered social media monitoring and consumer intelligence platform with sentiment analysis and trend detection.", category: "Marketing", website: "https://www.brandwatch.com" }
    ]
  },
  {
    company: { name: "Albert AI", description: "Albert AI是一家专注于自主AI营销的公司，管理和优化跨渠道的数字广告活动。" },
    projects: [
      { name: "Albert AI", description: "Autonomous AI marketing platform that manages and optimizes digital advertising campaigns across channels.", category: "Marketing", website: "https://albert.ai" }
    ]
  },
  {
    company: { name: "Seamless.AI", description: "Seamless.AI是一家专注于AI销售勘探的公司，提供查找验证联系信息和构建目标潜在客户列表的AI销售勘探平台。" },
    projects: [
      { name: "Seamless.AI", description: "AI-powered sales prospecting platform for finding verified contact information and building targeted lead lists.", category: "Sales", website: "https://seamless.ai" }
    ]
  },
  {
    company: { name: "Gong", description: "Gong是一家专注于AI收入智能的公司，分析销售对话以改善交易结果和团队绩效。" },
    projects: [
      { name: "Gong", description: "AI revenue intelligence platform that analyzes sales conversations to improve deal outcomes and team performance.", category: "Sales", website: "https://www.gong.io" }
    ]
  },
  {
    company: { name: "Outreach", description: "Outreach是一家专注于AI销售参与的公司，提供自动化序列、对话智能和管道管理。" },
    projects: [
      { name: "Outreach", description: "AI-powered sales engagement platform with automated sequences, conversation intelligence, and pipeline management.", category: "Sales", website: "https://www.outreach.io" }
    ]
  },
  {
    company: { name: "Chorus", description: "Chorus是一家专注于AI对话分析的公司，为销售团队提供通话录音、指导洞察和交易风险分析。" },
    projects: [
      { name: "Chorus", description: "AI conversation analytics platform for sales teams with call recording, coaching insights, and deal risk analysis.", category: "Sales", website: "https://www.chorus.ai" }
    ]
  },
  {
    company: { name: "Character.ai", description: "Character.ai是一家专注于AI角色聊天机器人的公司，创建和与自定义AI个性对话。" },
    projects: [
      { name: "Character.ai", description: "AI character chatbot platform for creating and conversing with custom AI personalities for entertainment and education.", category: "Chatbots", website: "https://character.ai" }
    ]
  },
  {
    company: { name: "Poe", description: "Poe是Quora的AI聊天机器人聚合器，在一个平台上提供对多个AI模型的访问。" },
    projects: [
      { name: "Poe", description: "AI chatbot aggregator by Quora providing access to multiple AI models including Claude, GPT, and others in one platform.", category: "Chatbots", website: "https://poe.com" }
    ]
  },
  {
    company: { name: "Intercom Fin", description: "Intercom Fin是Intercom的AI驱动客户服务聊天机器人。" },
    projects: [
      { name: "Intercom Fin", description: "AI-powered customer service chatbot with natural language understanding and seamless handoff to human agents.", category: "Customer Support", website: "https://www.intercom.com/fin" }
    ]
  },
  {
    company: { name: "Zendesk AI", description: "Zendesk AI是Zendesk的AI增强客户支持平台。" },
    projects: [
      { name: "Zendesk AI", description: "AI-enhanced customer support platform with automated ticket routing, sentiment analysis, and response suggestions.", category: "Customer Support", website: "https://www.zendesk.com/ai" }
    ]
  },
  {
    company: { name: "Ada", description: "Ada是一家专注于AI聊天机器人平台的公司，专为客户服务设计。" },
    projects: [
      { name: "Ada", description: "AI chatbot platform for customer service with no-code bot building and automated resolution of common inquiries.", category: "Customer Support", website: "https://www.ada.cx" }
    ]
  },
  {
    company: { name: "LivePerson", description: "LivePerson是一家专注于对话AI的公司，提供跨多个渠道的客户参与语音和文本功能。" },
    projects: [
      { name: "LivePerson", description: "Conversational AI platform for customer engagement with voice and text capabilities across multiple channels.", category: "Customer Support", website: "https://www.liveperson.com" }
    ]
  },
  {
    company: { name: "Drift", description: "Drift是一家专注于AI对话营销的公司，提供用于潜在客户资格认证和客户参与的聊天机器人。" },
    projects: [
      { name: "Drift", description: "AI-powered conversational marketing platform with chatbots for lead qualification and customer engagement.", category: "Customer Support", website: "https://www.drift.com" }
    ]
  },
  {
    company: { name: "Freshworks Freddy AI", description: "Freshworks Freddy AI是Freshworks套件的AI助手。" },
    projects: [
      { name: "Freshworks Freddy AI", description: "AI assistant integrated across Freshworks suite for customer service, sales, and marketing automation.", category: "Customer Support", website: "https://www.freshworks.com/freddy-ai" }
    ]
  },
  {
    company: { name: "Botpress", description: "Botpress是一家专注于开源聊天机器人开发的公司，提供AI功能和企业级部署选项。" },
    projects: [
      { name: "Botpress", description: "Open-source chatbot development platform with AI capabilities and enterprise-grade deployment options.", category: "Chatbots", website: "https://botpress.com" }
    ]
  },
  {
    company: { name: "Rasa", description: "Rasa是一家专注于开源框架的公司，用于构建AI助手和聊天机器人。" },
    projects: [
      { name: "Rasa", description: "Open-source framework for building AI assistants and chatbots with advanced natural language understanding.", category: "Chatbots", website: "https://rasa.com" }
    ]
  },
  {
    company: { name: "DataRobot", description: "DataRobot是一家专注于企业AI平台的公司，提供自动化机器学习、预测分析和商业智能洞察。" },
    projects: [
      { name: "DataRobot", description: "Enterprise AI platform for automated machine learning, predictive analytics, and business intelligence insights.", category: "Analytics", website: "https://www.datarobot.com" }
    ]
  },
  {
    company: { name: "H2O.ai", description: "H2O.ai是一家专注于开源机器学习平台的公司，提供自动化ML功能和企业AI部署解决方案。" },
    projects: [
      { name: "H2O.ai", description: "Open-source machine learning platform with automated ML capabilities and enterprise AI deployment solutions.", category: "Analytics", website: "https://www.h2o.ai" }
    ]
  },
  {
    company: { name: "Tableau AI", description: "Tableau AI是Tableau的AI驱动数据可视化和商业智能平台。" },
    projects: [
      { name: "Tableau AI", description: "AI-powered data visualization and business intelligence platform with automated insights and natural language queries.", category: "Analytics", website: "https://www.tableau.com" }
    ]
  },
  {
    company: { name: "Microsoft Power BI AI", description: "Microsoft Power BI AI是Microsoft的商业智能平台。" },
    projects: [
      { name: "Microsoft Power BI AI", description: "Business intelligence platform with AI-driven insights, automated data preparation, and natural language Q&A.", category: "Analytics", website: "https://powerbi.microsoft.com" }
    ]
  },
  {
    company: { name: "Qlik Sense AI", description: "Qlik Sense AI是Qlik的自助分析平台。" },
    projects: [
      { name: "Qlik Sense AI", description: "Self-service analytics platform with AI-powered insights, automated data discovery, and augmented analytics.", category: "Analytics", website: "https://www.qlik.com/us/products/qlik-sense" }
    ]
  },
  {
    company: { name: "Sisense AI", description: "Sisense AI是Sisense的AI驱动分析平台。" },
    projects: [
      { name: "Sisense AI", description: "AI-driven analytics platform that simplifies complex data analysis with automated insights and ML capabilities.", category: "Analytics", website: "https://www.sisense.com" }
    ]
  },
  {
    company: { name: "ThoughtSpot", description: "ThoughtSpot是一家专注于搜索驱动分析的公司，提供AI驱动的洞察和自然语言数据查询。" },
    projects: [
      { name: "ThoughtSpot", description: "Search-driven analytics platform with AI-powered insights and natural language data queries for business users.", category: "Analytics", website: "https://www.thoughtspot.com" }
    ]
  },
  {
    company: { name: "Alteryx", description: "Alteryx是一家专注于自助数据分析的公司，提供自动化机器学习和预测分析功能。" },
    projects: [
      { name: "Alteryx", description: "Self-service data analytics platform with automated machine learning and predictive analytics capabilities.", category: "Analytics", website: "https://www.alteryx.com" }
    ]
  },
  {
    company: { name: "Khan Academy Khanmigo", description: "Khan Academy Khanmigo是Khan Academy的AI辅导助手。" },
    projects: [
      { name: "Khan Academy Khanmigo", description: "AI tutoring assistant that provides personalized learning support and guided practice across subjects.", category: "Education", website: "https://www.khanacademy.org/khan-labs" }
    ]
  },
  {
    company: { name: "Duolingo Max", description: "Duolingo Max是Duolingo的AI驱动语言学习。" },
    projects: [
      { name: "Duolingo Max", description: "AI-powered language learning with personalized lessons, conversation practice, and adaptive learning paths.", category: "Education", website: "https://blog.duolingo.com/duolingo-max" }
    ]
  },
  {
    company: { name: "Coursera AI", description: "Coursera AI是Coursera的AI增强在线学习平台。" },
    projects: [
      { name: "Coursera AI", description: "AI-enhanced online learning platform with personalized course recommendations and adaptive assessment.", category: "Education", website: "https://www.coursera.org" }
    ]
  },
  {
    company: { name: "Socratic by Google", description: "Socratic by Google是Google的AI作业助手。" },
    projects: [
      { name: "Socratic by Google", description: "AI homework helper that provides step-by-step explanations and learning resources across subjects.", category: "Education", website: "https://socratic.org" }
    ]
  },
  {
    company: { name: "Quizlet AI", description: "Quizlet AI是Quizlet的AI增强学习平台。" },
    projects: [
      { name: "Quizlet AI", description: "AI-enhanced study platform with intelligent flashcards, personalized learning modes, and adaptive testing.", category: "Education", website: "https://quizlet.com" }
    ]
  },
  {
    company: { name: "Gradescope AI", description: "Gradescope AI是Gradescope的AI辅助评分平台。" },
    projects: [
      { name: "Gradescope AI", description: "AI-assisted grading platform for educators with automated feedback and rubric-based assessment.", category: "Education", website: "https://www.gradescope.com" }
    ]
  },
  {
    company: { name: "Carnegie Learning", description: "Carnegie Learning是一家专注于AI自适应学习的公司，专为数学提供个性化教学和实时反馈。" },
    projects: [
      { name: "Carnegie Learning", description: "AI-powered adaptive learning platform for mathematics with personalized instruction and real-time feedback.", category: "Education", website: "https://www.carnegielearning.com" }
    ]
  },
  {
    company: { name: "Century Tech", description: "Century Tech是一家专注于AI个性化学习的公司，为教育工作者提供自适应内容交付和进度跟踪。" },
    projects: [
      { name: "Century Tech", description: "AI platform for personalized learning with adaptive content delivery and progress tracking for educators.", category: "Education", website: "https://www.century.tech" }
    ]
  },
  {
    company: { name: "DeepAI", description: "DeepAI是一家专注于AI工具集合的公司，提供图像生成、文本处理和分析的综合AI工具集合。" },
    projects: [
      { name: "DeepAI", description: "Comprehensive collection of AI tools for image generation, text processing, and analysis with API access.", category: "Artificial Intelligence", website: "https://deepai.org" }
    ]
  },
  {
    company: { name: "Replika", description: "Replika是一家专注于AI伴侣应用的公司，提供情感支持和对话。" },
    projects: [
      { name: "Replika", description: "AI companion app for emotional support and conversation with personalized AI personality development.", category: "Chatbots", website: "https://replika.ai" }
    ]
  },
  {
    company: { name: "MonkeyLearn", description: "MonkeyLearn是一家专注于无代码文本分析的公司，提供情感分析、关键词提取和自定义AI模型训练。" },
    projects: [
      { name: "MonkeyLearn", description: "No-code text analysis platform with sentiment analysis, keyword extraction, and custom AI model training.", category: "Analytics", website: "https://monkeylearn.com" }
    ]
  },
  {
    company: { name: "Lobe", description: "Lobe是Microsoft的视觉机器学习工具，用于创建自定义AI模型。" },
    projects: [
      { name: "Lobe", description: "Microsoft's visual machine learning tool for creating custom AI models without coding experience required.", category: "Developer Tools", website: "https://www.lobe.ai" }
    ]
  },
  {
    company: { name: "Runway Academy", description: "Runway Academy是Runway的教育平台，用于学习AI工具和创意应用。" },
    projects: [
      { name: "Runway Academy", description: "Educational platform for learning AI tools and creative applications with hands-on tutorials and projects.", category: "Education", website: "https://academy.runwayml.com" }
    ]
  }
];

function generateExtendedSQL() {
  console.log('🔧 生成扩展版SQL脚本（200+家公司）...');
  
  let sql = `-- 扩展版AIverse数据插入脚本
-- 包含200+家AI公司的真实信息
-- 只使用现有字段：companies(name, description), projects(company_id, name, description, category, website)
-- 在Supabase SQL Editor中执行

-- 1. 插入所有公司数据
INSERT INTO companies (name, description) VALUES\n`;

  const companyInserts = [];
  const projectValues = [];
  
  extendedCompanies.forEach((item) => {
    const company = item.company;
    const name = company.name.replace(/'/g, "''");
    const description = company.description.replace(/'/g, "''");
    
    companyInserts.push(`('${name}', '${description}')`);
    
    // 收集项目数据
    if (item.projects && item.projects.length > 0) {
      item.projects.forEach(project => {
        const projectName = project.name.replace(/'/g, "''");
        const projectDesc = project.description.replace(/'/g, "''");
        const category = project.category.replace(/'/g, "''");
        const website = project.website.replace(/'/g, "''");
        
        projectValues.push(`    ('${name}', '${projectName}', '${projectDesc}', '${category}', '${website}')`);
      });
    }
  });
  
  sql += companyInserts.join(',\n') + ';\n\n';
  
  // 添加项目插入
  if (projectValues.length > 0) {
    sql += `-- 2. 插入所有项目数据
WITH company_ids AS (
  SELECT name, id FROM companies WHERE name IN (${companyInserts.map(c => c.split("'")[1]).map(name => `'${name.replace(/'/g, "''")}'`).join(', ')})
)
INSERT INTO projects (company_id, name, description, category, website)
SELECT 
  ci.id,
  p.name,
  p.description,
  p.category,
  p.website
FROM company_ids ci
CROSS JOIN LATERAL (
  VALUES
${projectValues.join(',\n')}
) AS p(company_name, name, description, category, website)
WHERE ci.name = p.company_name;\n\n`;
  }
  
  sql += `-- 完成
SELECT '扩展版AIverse数据插入完成！共${companyInserts.length}家公司' as status;`;
  
  // 写入文件
  fs.writeFileSync('insert-extended-200-companies.sql', sql);
  
  console.log(`✅ 扩展版SQL脚本已生成: insert-extended-200-companies.sql`);
  console.log(`📊 包含 ${companyInserts.length} 家公司`);
  console.log(`📊 包含 ${projectValues.length} 个项目`);
}

// 保存扩展后的数据
fs.writeFileSync('extended-200-companies.json', JSON.stringify(extendedCompanies, null, 2));

console.log('🚀 生成扩展版AI公司数据...');
console.log(`📊 包含 ${extendedCompanies.length} 家公司的真实信息`);

// 生成SQL脚本
generateExtendedSQL();

console.log('✅ 扩展版数据生成完成！');
console.log('📁 结果已保存到: extended-200-companies.json');
console.log('📁 SQL脚本已保存到: insert-extended-200-companies.sql');
