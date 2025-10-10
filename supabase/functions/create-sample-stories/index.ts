import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

interface StoryData {
  title: string
  content: string
  excerpt: string
  language: string
  category: string
  cover_image_url: string
  tags: string[]
  read_time_minutes: number
}

const stories: StoryData[] = [
  // English stories
  {
    title: "AI Revolutionizing Healthcare: From Diagnosis to Treatment",
    content: "Artificial Intelligence is transforming healthcare delivery across every medical specialty. From radiology AI that can detect cancers earlier than human specialists to drug discovery platforms that accelerate pharmaceutical research, AI applications in medicine are saving lives and reducing costs. Machine learning algorithms now assist surgeons in complex procedures, predict patient deterioration in ICUs, and provide personalized treatment recommendations based on genetic profiles. The integration of AI with electronic health records enables physicians to make more informed decisions while natural language processing helps extract insights from clinical notes. Telemedicine platforms powered by AI can perform preliminary diagnoses and triage patients effectively. As we advance into 2025, the convergence of AI, genomics, and precision medicine promises to deliver truly personalized healthcare experiences that were unimaginable just a decade ago.",
    excerpt: "Exploring how AI is revolutionizing healthcare from diagnosis to personalized treatment delivery.",
    language: "en",
    category: "AI Applications",
    cover_image_url: "/story-images/healthcare-ai-1.png",
    tags: ["artificial-intelligence", "machine-learning", "technology"],
    read_time_minutes: 6
  },
  {
    title: "The Future of Finance: AI-Powered Investment Strategies",
    content: "The financial industry is experiencing a paradigm shift as artificial intelligence reshapes investment strategies and risk management practices. Algorithmic trading systems now execute millions of transactions per second, identifying market inefficiencies that human traders would miss. Robo-advisors democratize wealth management by providing sophisticated portfolio optimization to retail investors. Credit scoring models leverage alternative data sources including social media behavior and transaction patterns to assess creditworthiness more accurately. AI-powered fraud detection systems protect consumers by identifying suspicious activities in real-time. Hedge funds employ machine learning to analyze satellite imagery, social sentiment, and macroeconomic indicators for alpha generation. Regulatory technology (RegTech) solutions automate compliance monitoring and reporting. As we move forward, quantum computing integration with AI will unlock even more powerful financial modeling capabilities, while blockchain technology ensures transparency and security in AI-driven financial services.",
    excerpt: "How AI is transforming finance through algorithmic trading and intelligent risk management.",
    language: "en",
    category: "Finance AI",
    cover_image_url: "/story-images/finance-ai-1.png",
    tags: ["investment", "fintech", "artificial-intelligence"],
    read_time_minutes: 7
  },
  {
    title: "Building Scalable Startups: Lessons from Silicon Valley",
    content: "Creating a scalable startup requires more than just a great idea—it demands strategic thinking, execution excellence, and the ability to adapt quickly to market feedback. Successful Silicon Valley entrepreneurs understand that product-market fit is the foundation of any scalable business. This involves iterating rapidly based on user feedback, measuring key metrics religiously, and being willing to pivot when necessary. Building the right team is equally crucial; startups need versatile individuals who can wear multiple hats and grow with the company. Technology infrastructure must be designed for scale from day one, utilizing cloud services and modern development practices. Fundraising strategy should align with growth milestones, securing enough runway while maintaining focus on execution. Customer acquisition requires systematic experimentation with different channels and optimization of the entire sales funnel. Legal and compliance frameworks must be established early to avoid costly mistakes later. The most successful startups develop unique company cultures that attract top talent and foster innovation throughout their growth journey.",
    excerpt: "Essential strategies for building scalable startups based on Silicon Valley best practices.",
    language: "en",
    category: "Startup Interview",
    cover_image_url: "/story-images/startup-ai-1.png",
    tags: ["startup", "business-strategy", "venture-capital"],
    read_time_minutes: 8
  },
  {
    title: "The Art of AI-Powered Content Creation",
    content: "Content creation is being revolutionized by artificial intelligence tools that augment human creativity rather than replace it. Modern AI writing assistants help authors overcome writer's block, generate ideas, and refine their prose while maintaining their unique voice. Video content creators leverage AI for automated editing, color correction, and even generating synthetic media for demonstrations. Social media managers use AI to optimize posting schedules, create engaging captions, and analyze audience sentiment. Graphic designers collaborate with AI tools to generate initial concepts, create variations, and automate repetitive tasks. Podcasters employ AI for transcription, show notes generation, and audio enhancement. The key to successful AI-powered content creation lies in understanding these tools as collaborators rather than replacements. Human creativity, emotional intelligence, and cultural context remain irreplaceable. The most effective content creators combine AI efficiency with human insight to produce authentic, engaging, and valuable content that resonates with their audiences at scale.",
    excerpt: "Exploring how AI tools are enhancing content creation while preserving human creativity.",
    language: "en",
    category: "AI Applications",
    cover_image_url: "/story-images/content-ai-1.png",
    tags: ["content-creation", "artificial-intelligence", "productivity"],
    read_time_minutes: 5
  },
  {
    title: "E-commerce Evolution: AI-Driven Shopping Experiences",
    content: "E-commerce platforms are leveraging artificial intelligence to create personalized shopping experiences that drive customer satisfaction and business growth. Recommendation engines analyze customer behavior, purchase history, and browsing patterns to suggest relevant products with unprecedented accuracy. Visual search technology allows customers to find products using images rather than keywords, revolutionizing product discovery. Chatbots powered by natural language processing provide 24/7 customer support, handling inquiries, processing returns, and upselling relevant items. Dynamic pricing algorithms optimize prices in real-time based on demand, inventory levels, and competitor analysis. Supply chain optimization uses AI to predict demand, manage inventory, and reduce shipping costs. Fraud detection systems protect both merchants and customers by identifying suspicious transactions instantly. Virtual try-on experiences using augmented reality reduce return rates for fashion and furniture retailers. As voice commerce and social commerce gain traction, AI continues to evolve the shopping experience across all touchpoints.",
    excerpt: "How AI is transforming e-commerce through personalization and intelligent automation.",
    language: "en",
    category: "AI Applications",
    cover_image_url: "/story-images/ecommerce-ai-1.png",
    tags: ["artificial-intelligence", "user-experience", "automation"],
    read_time_minutes: 6
  },
  {
    title: "Education Revolution: AI Tutoring and Personalized Learning",
    content: "Educational technology powered by artificial intelligence is personalizing learning experiences and making quality education more accessible worldwide. Adaptive learning platforms adjust difficulty levels and teaching methods based on individual student progress and learning styles. AI tutoring systems provide one-on-one support, explaining concepts in multiple ways until students achieve mastery. Automated grading systems free teachers to focus on instruction rather than administrative tasks while providing detailed feedback to students. Language learning apps use speech recognition and natural language processing to improve pronunciation and conversation skills. Educational analytics help institutions identify at-risk students early and provide targeted interventions. Virtual reality combined with AI creates immersive learning environments for subjects like history, science, and medicine. Accessibility tools powered by AI help students with disabilities participate fully in educational activities. As AI continues to evolve, we're moving toward truly personalized education systems that adapt to each learner's unique needs, pace, and interests.",
    excerpt: "Discovering how AI is revolutionizing education through personalized learning and intelligent tutoring.",
    language: "en",
    category: "AI Applications",
    cover_image_url: "/story-images/education-ai-1.png",
    tags: ["education-ai", "learning", "technology"],
    read_time_minutes: 7
  },
  {
    title: "Manufacturing 4.0: AI-Powered Smart Factories",
    content: "The manufacturing industry is undergoing a digital transformation through Industry 4.0 initiatives that integrate artificial intelligence with traditional production processes. Predictive maintenance systems analyze sensor data to predict equipment failures before they occur, reducing downtime and maintenance costs. Quality control systems use computer vision to detect defects with greater accuracy than human inspectors. Production optimization algorithms balance efficiency, quality, and resource utilization in real-time. Supply chain management leverages AI to forecast demand, optimize inventory levels, and coordinate with suppliers. Robotics and automation continue to evolve with AI, enabling more flexible and adaptable manufacturing systems. Digital twins create virtual replicas of production lines for simulation and optimization. Energy management systems optimize consumption patterns to reduce costs and environmental impact. Worker safety is enhanced through AI-powered monitoring systems that detect hazardous conditions and ensure compliance with safety protocols. The result is smart factories that are more efficient, sustainable, and responsive to market demands.",
    excerpt: "Exploring how AI is transforming manufacturing through smart factories and predictive systems.",
    language: "en",
    category: "AI Applications",
    cover_image_url: "/story-images/manufacturing-ai-1.png",
    tags: ["artificial-intelligence", "automation", "industry"],
    read_time_minutes: 8
  },
  {
    title: "Real Estate Innovation: AI in Property Management and Investment",
    content: "The real estate industry is embracing artificial intelligence to streamline operations, enhance investment decisions, and improve customer experiences. Property valuation models use machine learning to analyze market data, property features, and neighborhood trends for accurate pricing. Virtual property tours powered by AI and augmented reality allow buyers to explore homes remotely. Predictive analytics help investors identify emerging markets and profitable opportunities before they become obvious to competitors. Property management systems automate tenant screening, lease administration, and maintenance scheduling. Smart building technologies optimize energy usage, security, and tenant comfort through AI-driven controls. Market analysis tools process vast amounts of data to identify trends and forecast property values. Customer relationship management systems personalize communications and automate follow-ups with potential buyers and tenants. Construction project management leverages AI for scheduling, resource allocation, and risk assessment. As the industry continues to digitize, AI will play an increasingly important role in making real estate transactions more efficient and transparent.",
    excerpt: "How AI is revolutionizing real estate through smart property management and investment analytics.",
    language: "en",
    category: "AI Applications",
    cover_image_url: "/story-images/realestate-ai-1.png",
    tags: ["artificial-intelligence", "market-analysis", "automation"],
    read_time_minutes: 6
  },
  {
    title: "The Developer's Guide to AI-Assisted Programming",
    content: "Software development is being transformed by artificial intelligence tools that enhance productivity, code quality, and developer experience. AI-powered code completion systems like GitHub Copilot generate entire functions based on comments or partial implementations. Automated testing frameworks create comprehensive test suites and identify edge cases that developers might miss. Code review tools analyze pull requests for potential bugs, security vulnerabilities, and style inconsistencies. Debugging assistants help developers understand complex codebases and suggest fixes for common issues. Documentation generators create API docs and code comments automatically from source code analysis. Performance optimization tools identify bottlenecks and suggest improvements for better application performance. Natural language interfaces allow developers to describe functionality in plain English and receive working code implementations. DevOps automation uses AI to optimize deployment pipelines, predict system failures, and manage infrastructure resources. The key to leveraging these tools effectively is understanding their capabilities and limitations while maintaining coding fundamentals and problem-solving skills.",
    excerpt: "A comprehensive guide to AI tools that are transforming software development and programming.",
    language: "en",
    category: "AI Applications",
    cover_image_url: "/story-images/coding-ai-1.png",
    tags: ["coding-assistant", "technology", "productivity"],
    read_time_minutes: 7
  },
  
  // Chinese stories
  {
    title: "人工智能在中国：从概念到商业化的完整路径",
    content: "中国的人工智能发展已经从早期的概念验证阶段迅速进入大规模商业化应用时代。从百度的搜索算法到阿里巴巴的推荐系统，从腾讯的社交网络分析到字节跳动的内容分发，AI技术已经深度融入中国互联网生态系统。在制造业领域，智能工厂和工业4.0概念正在珠三角和长三角地区快速落地。金融科技公司利用AI进行风险控制、信贷审批和智能投顾。教育行业通过个性化学习平台和智能辅导系统提升教学效果。医疗健康领域，AI辅助诊断和药物研发正在改变传统医疗模式。自动驾驶技术在特定场景下开始商业化运营。语音识别和自然语言处理技术在智能家居和客服领域广泛应用。随着新基建政策的推进，AI技术将在更多传统行业中找到应用场景，推动整个社会的数字化转型升级。",
    excerpt: "深度解析中国AI发展现状，从技术创新到商业化应用的全景展示。",
    language: "zh",
    category: "AI应用",
    cover_image_url: "/story-images/chinese-ai-1.png",
    tags: ["artificial-intelligence", "industry", "tech-share"],
    read_time_minutes: 8
  },
  {
    title: "创业思维：如何在不确定性中寻找商业机会",
    content: "在当今快速变化的商业环境中，成功的创业者必须具备在不确定性中识别和把握机会的能力。首先，要培养敏锐的市场洞察力，通过深度用户调研了解真实需求和痛点。其次，建立快速迭代的产品开发流程，通过MVP验证商业假设。团队建设是关键，需要寻找互补技能的合作伙伴并建立强执行力的团队文化。资金管理要谨慎，控制好现金流，合理规划融资节奏。技术选型要考虑长远发展，避免技术债务积累。市场营销策略要数据驱动，建立完整的用户获取和转化漏斗。法律合规不能忽视，特别是在数据保护和知识产权方面。风险管理要全面，制定应急预案应对各种不确定性。最重要的是保持学习心态，向成功案例学习，从失败中吸取教训，不断调整商业策略以适应市场变化。",
    excerpt: "探讨创业者如何在充满不确定性的环境中发现并抓住商业机会。",
    language: "zh",
    category: "创业访谈",
    cover_image_url: "/story-images/chinese-ai-2.png",
    tags: ["startup-experience", "business-strategy", "learning"],
    read_time_minutes: 9
  },
  {
    title: "数字化转型：传统企业的AI升级之路",
    content: "传统企业在面对数字化浪潮时，AI技术的引入成为转型升级的重要抓手。制造业企业通过部署工业物联网和机器学习算法，实现生产过程的智能化监控和优化。零售企业利用大数据分析和推荐算法，提升用户体验和销售转化率。物流公司采用路径优化算法和自动化仓储系统，降低运营成本提高效率。银行业通过智能风控系统和客户画像分析，提升服务质量和风险管理能力。餐饮行业运用需求预测和供应链优化，减少食材浪费并保证新鲜度。房地产企业通过市场分析模型和客户匹配算法，提高销售效率和客户满意度。成功的数字化转型需要从上至下的组织变革，包括技术基础设施建设、人才培养、业务流程重塑和企业文化转变。关键在于找到AI技术与业务场景的最佳结合点，实现技术价值的最大化。",
    excerpt: "分析传统企业如何通过AI技术实现数字化转型和业务升级。",
    language: "zh",
    category: "商业策略",
    cover_image_url: "/story-images/business-ai-1.png",
    tags: ["artificial-intelligence", "business-strategy", "market-analysis"],
    read_time_minutes: 7
  },
  {
    title: "投资理财新时代：AI如何重塑财富管理",
    content: "人工智能技术正在深刻改变传统的投资理财模式，为个人和机构投资者提供更精准、更高效的财富管理服务。智能投顾平台通过大数据分析和机器学习算法，为用户提供个性化的资产配置建议。量化交易系统能够在毫秒级别内执行复杂的交易策略，捕捉市场微观结构中的套利机会。风险管理模型使用实时数据和预测分析，帮助投资者识别和控制投资组合风险。情绪分析工具通过分析新闻、社交媒体和市场数据，预测市场情绪对价格的影响。另类数据分析包括卫星图像、社交媒体活动、信用卡交易等，为投资决策提供独特视角。智能客服系统提供7x24小时的投资咨询服务，解答客户疑问并提供市场分析。监管科技确保合规性，自动监控交易行为和报告要求。未来，AI将继续推动财富管理行业向更加透明、高效和普惠的方向发展。",
    excerpt: "探索人工智能如何革新投资理财，为财富管理带来智能化解决方案。",
    language: "zh",
    category: "金融科技",
    cover_image_url: "/story-images/finance-ai-2.png",
    tags: ["investment", "fintech", "data-analysis"],
    read_time_minutes: 8
  },
  {
    title: "内容创作的未来：AI工具如何助力创意产业",
    content: "人工智能正在成为内容创作者的得力助手，从文本写作到视频制作，AI工具正在重新定义创意产业的工作流程。文案创作AI能够根据品牌调性和目标受众生成高质量的营销文案和产品描述。视频剪辑工具使用机器学习算法自动完成色彩校正、场景切换和音频同步。图像生成AI让设计师能够快速产出概念图和创意素材。音乐制作平台通过AI作曲和编曲，为视频和游戏提供原创背景音乐。直播和短视频平台利用AI进行实时美颜、背景替换和特效生成。社交媒体管理工具使用自然语言处理技术优化发布时间和内容策略。播客制作中，AI负责转录、摘要生成和音频增强处理。翻译和本地化服务确保内容能够触达全球受众。虽然AI提供了强大的技术支持，但人类的创意思维、情感表达和文化理解仍然是不可替代的核心价值。",
    excerpt: "分析AI工具如何赋能内容创作，推动创意产业的数字化革新。",
    language: "zh",
    category: "AI应用",
    cover_image_url: "/story-images/creative-ai-1.png",
    tags: ["content-creation", "productivity", "tips"],
    read_time_minutes: 6
  },
  {
    title: "教育科技前沿：个性化学习的AI解决方案",
    content: "教育领域正在经历一场由人工智能驱动的深刻变革，个性化学习成为提升教育质量和效率的关键路径。自适应学习平台通过分析学生的学习行为和成绩数据，动态调整教学内容和难度。智能题库系统能够根据学生的知识掌握情况推荐合适的练习题和学习路径。虚拟助教24小时在线回答学生问题，提供即时的学习支持和指导。语言学习应用使用语音识别和自然语言处理技术，帮助学生提高口语和听力能力。在线教育平台通过数据分析识别学习困难的学生，及时提供额外的辅导和支持。教学管理系统自动化处理作业批改、成绩统计和家长沟通等日常事务。特殊教育工具为有学习障碍的学生提供无障碍的学习环境。职业教育平台根据就业市场需求调整课程内容，确保学生掌握实用技能。这些AI应用不仅提高了教学效率，更重要的是让每个学生都能获得适合自己的教育体验。",
    excerpt: "探讨AI技术如何推动教育个性化，创新传统教学模式。",
    language: "zh",
    category: "教育科技",
    cover_image_url: "/story-images/research-ai-1.png",
    tags: ["education-ai", "learning", "tutorial"],
    read_time_minutes: 7
  },
  {
    title: "社交媒体的AI革命：从算法推荐到内容审核",
    content: "社交媒体平台正在利用人工智能技术提升用户体验并维护平台生态健康。推荐算法通过分析用户行为、兴趣偏好和社交关系，为每个用户定制个性化的内容流。内容审核系统使用计算机视觉和自然语言处理技术，自动识别和过滤不当内容。智能客服机器人处理用户投诉和咨询，提供快速响应和问题解决。情感分析工具监测用户情绪和舆论趋势，帮助平台了解用户满意度。反垃圾邮件和反欺诈系统保护用户免受恶意行为影响。个性化广告投放通过精准的用户画像分析，提高广告效果和用户体验。社交图谱分析帮助用户发现志同道合的朋友和感兴趣的群组。实时翻译功能打破语言障碍，促进全球用户之间的交流。隐私保护技术确保用户数据安全，符合各国法律法规要求。随着AI技术的不断进步，社交媒体将变得更加智能、安全和个性化。",
    excerpt: "深入分析AI技术如何改变社交媒体的运营模式和用户体验。",
    language: "zh",
    category: "社交网络",
    cover_image_url: "/story-images/social-ai-1.png",
    tags: ["artificial-intelligence", "user-experience", "review"],
    read_time_minutes: 8
  },
  {
    title: "小企业AI应用指南：低成本实现智能化升级",
    content: "中小企业虽然资源有限，但通过合理的AI工具选择和应用策略，同样可以实现智能化升级并获得竞争优势。客户服务方面，聊天机器人可以处理常见咨询，提高响应效率并降低人工成本。销售管理中，CRM系统的AI功能帮助识别潜在客户和预测销售机会。库存管理利用需求预测算法，优化库存水平减少资金占用。财务管理工具自动化记账和报表生成，提高财务处理效率。市场营销通过社交媒体分析和客户行为数据，制定更精准的营销策略。人力资源管理使用AI筛选简历和评估候选人能力。供应链优化通过供应商评估和物流路径规划，降低采购和运输成本。网络安全工具保护企业数据和系统免受网络攻击。重要的是选择合适的SaaS解决方案，避免大规模定制开发的高成本。通过逐步引入AI工具，小企业可以在不增加太多负担的情况下享受智能化带来的好处。",
    excerpt: "为中小企业提供实用的AI应用建议，实现低成本智能化转型。",
    language: "zh",
    category: "商业应用",
    cover_image_url: "/story-images/video-generation-1.png",
    tags: ["small-business", "automation", "tips"],
    read_time_minutes: 6
  },
  {
    title: "视频生成AI：创意表达的新边界",
    content: "视频生成人工智能技术正在开启创意表达的全新时代，让任何人都能够创造高质量的视频内容。文本到视频的生成模型能够根据文字描述创建相应的视频场景，为故事叙述提供无限可能。图像到视频技术将静态图片转换为动态视频，为摄影师和设计师提供新的创作工具。风格迁移算法可以将一种艺术风格应用到视频内容中，创造独特的视觉效果。人物动画生成让虚拟角色能够表现自然的面部表情和肢体动作。音视频同步技术确保生成的视频与音频完美匹配。实时视频处理允许直播主在直播过程中应用各种特效和滤镜。教育和培训视频制作变得更加便捷，教师可以快速创建生动的教学内容。商业广告制作成本大幅降低，中小企业也能制作专业级的宣传视频。虽然技术进步带来便利，但也需要关注内容真实性和版权保护问题。创作者应该将AI视为增强创意的工具，而非替代人类想象力的手段。",
    excerpt: "探索视频生成AI技术如何革新内容创作，为创意工作者提供强大工具。",
    language: "zh",
    category: "AI应用",
    cover_image_url: "/story-images/video-generation-2.png",
    tags: ["runway-gen3", "luma-ai", "ai-video-editing"],
    read_time_minutes: 7
  }
]

serve(async (req) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE, PATCH',
    'Access-Control-Max-Age': '86400'
  }

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    // Create stories one by one
    const results = []
    
    for (const story of stories) {
      try {
        // Create story
        const storyResponse = await fetch(`${supabaseUrl}/rest/v1/stories`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${supabaseKey}`,
            'Content-Type': 'application/json',
            'apikey': supabaseKey
          },
          body: JSON.stringify({
            author_id: 'aaaaaaaa-1111-2222-3333-444444444444', // AI-generated user
            title: story.title,
            content: story.content,
            excerpt: story.excerpt,
            cover_image_url: story.cover_image_url,
            status: 'published',
            category: story.category,
            read_time_minutes: story.read_time_minutes,
            language: story.language,
            views_count: Math.floor(Math.random() * 50000) + 10000,
            likes_count: Math.floor(Math.random() * 500) + 50,
            saves_count: Math.floor(Math.random() * 100) + 10,
            comments_count: Math.floor(Math.random() * 50) + 5,
            published_at: new Date().toISOString()
          })
        })
        
        if (!storyResponse.ok) {
          const error = await storyResponse.text()
          throw new Error(`Failed to create story: ${error}`)
        }
        
        let storyId = null
        const responseText = await storyResponse.text()
        if (responseText) {
          try {
            const createdStory = JSON.parse(responseText)
            storyId = Array.isArray(createdStory) ? createdStory[0]?.id : createdStory?.id
          } catch (parseError) {
            console.log('Response text:', responseText)
            throw new Error(`JSON parse error: ${parseError.message}`)
          }
        }
        
        if (storyId) {
          // Assign tags to story
          for (const tagName of story.tags) {
            // Get tag ID
            const tagResponse = await fetch(`${supabaseUrl}/rest/v1/story_tags?name=eq.${tagName}&select=id`, {
              headers: {
                'Authorization': `Bearer ${supabaseKey}`,
                'apikey': supabaseKey
              }
            })
            
            if (tagResponse.ok) {
              const tags = await tagResponse.json()
              if (tags.length > 0) {
                const tagId = tags[0].id
                
                // Create tag assignment
                await fetch(`${supabaseUrl}/rest/v1/story_tag_assignments`, {
                  method: 'POST',
                  headers: {
                    'Authorization': `Bearer ${supabaseKey}`,
                    'Content-Type': 'application/json',
                    'apikey': supabaseKey
                  },
                  body: JSON.stringify({
                    story_id: storyId,
                    tag_id: tagId
                  })
                })
                
                // Update tag usage count
                await fetch(`${supabaseUrl}/rest/v1/story_tags?id=eq.${tagId}`, {
                  method: 'PATCH',
                  headers: {
                    'Authorization': `Bearer ${supabaseKey}`,
                    'Content-Type': 'application/json',
                    'apikey': supabaseKey
                  },
                  body: JSON.stringify({
                    usage_count: tags[0].usage_count + 1
                  })
                })
              }
            }
          }
        }
        
        results.push({ success: true, title: story.title, id: storyId })
      } catch (error) {
        results.push({ success: false, title: story.title, error: error.message })
      }
    }
    
    return new Response(JSON.stringify({ 
      success: true, 
      message: `Created ${results.filter(r => r.success).length} stories`,
      results 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
    
  } catch (error) {
    return new Response(JSON.stringify({ 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
