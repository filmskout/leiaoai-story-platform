#!/usr/bin/env node

import fs from 'fs';

// 手动优化的真实公司数据（只使用现有字段）
const optimizedCompanies = [
  {
    company: {
      name: "OpenAI",
      description: "OpenAI是一家领先的人工智能研究公司，专注于开发安全、有益的通用人工智能。公司成立于2015年，总部位于美国旧金山，以开发GPT系列大语言模型和ChatGPT而闻名全球。"
    },
    projects: [
      {
        name: "ChatGPT",
        description: "Advanced conversational AI assistant powered by GPT-4, capable of natural language understanding, code generation, creative writing, and complex reasoning tasks.",
        category: "Artificial Intelligence",
        website: "https://chatgpt.com"
      },
      {
        name: "GPT-4",
        description: "Large multimodal language model capable of processing text and images, with advanced reasoning capabilities and improved accuracy.",
        category: "Artificial Intelligence",
        website: "https://openai.com/gpt-4"
      },
      {
        name: "DALL-E 3",
        description: "Advanced AI image generation model that creates high-quality images from text descriptions with improved accuracy and creativity.",
        category: "Design",
        website: "https://openai.com/dall-e-3"
      }
    ]
  },
  {
    company: {
      name: "Anthropic",
      description: "Anthropic是一家专注于AI安全的公司，致力于开发有益、无害、诚实的AI系统。公司由OpenAI前研究副总裁创立，以开发Claude AI助手而闻名。"
    },
    projects: [
      {
        name: "Claude",
        description: "Advanced AI assistant designed with constitutional AI principles, featuring enhanced safety, helpfulness, and honesty in conversations and tasks.",
        category: "Artificial Intelligence",
        website: "https://claude.ai"
      }
    ]
  },
  {
    company: {
      name: "Google",
      description: "Google是Alphabet旗下的科技巨头，在人工智能领域投入巨大，开发了Gemini、Bard等AI产品，并在搜索、云计算、自动驾驶等领域广泛应用AI技术。"
    },
    projects: [
      {
        name: "Gemini",
        description: "Google's most advanced AI model with multimodal capabilities, supporting text, image, audio, and video processing with enhanced reasoning and creativity.",
        category: "Artificial Intelligence",
        website: "https://gemini.google.com"
      },
      {
        name: "Google AI Studio",
        description: "Development platform for building and prototyping with Google's AI models, offering easy integration and testing capabilities.",
        category: "Developer Tools",
        website: "https://aistudio.google.com"
      }
    ]
  },
  {
    company: {
      name: "Microsoft",
      description: "Microsoft是全球领先的科技公司，在AI领域投入巨大，开发了Copilot系列产品，并与OpenAI建立了战略合作关系，将AI技术深度集成到Office、Azure等产品中。"
    },
    projects: [
      {
        name: "Microsoft Copilot",
        description: "AI-powered productivity assistant integrated across Microsoft 365 suite, providing intelligent assistance for writing, analysis, and automation tasks.",
        category: "Productivity",
        website: "https://copilot.microsoft.com"
      },
      {
        name: "Azure AI",
        description: "Comprehensive AI platform on Microsoft Azure cloud, offering machine learning, cognitive services, and AI infrastructure for enterprises.",
        category: "Developer Tools",
        website: "https://azure.microsoft.com/ai"
      }
    ]
  },
  {
    company: {
      name: "DeepSeek",
      description: "DeepSeek是中国领先的AI公司，专注于大语言模型和代码生成技术，开发了DeepSeek-Coder等产品，在代码生成和AI推理方面表现优异。"
    },
    projects: [
      {
        name: "DeepSeek-Coder",
        description: "Advanced AI coding assistant specialized in code generation, debugging, and software development with support for multiple programming languages.",
        category: "Developer Tools",
        website: "https://deepseek.com/coder"
      }
    ]
  },
  {
    company: {
      name: "Midjourney",
      description: "Midjourney是一家专注于AI图像生成的创新公司，开发了同名AI艺术创作平台，以其独特的艺术风格和高质量的图像生成能力而闻名。"
    },
    projects: [
      {
        name: "Midjourney",
        description: "Leading AI image generation platform with painterly aesthetic, advanced prompt engineering, and community-driven improvements for creative professionals.",
        category: "Design",
        website: "https://www.midjourney.com"
      }
    ]
  },
  {
    company: {
      name: "Stability AI",
      description: "Stability AI是一家开源AI公司，开发了Stable Diffusion等开源图像生成模型，致力于让AI技术更加开放和可访问。"
    },
    projects: [
      {
        name: "Stable Diffusion",
        description: "Open-source AI image generation model with community-driven improvements, ControlNet support, and unlimited customizations for developers and artists.",
        category: "Design",
        website: "https://stability.ai/stable-diffusion"
      }
    ]
  },
  {
    company: {
      name: "Hugging Face",
      description: "Hugging Face是领先的AI模型平台和社区，为开发者提供机器学习模型的分享、训练和部署服务，是开源AI生态的重要推动者。"
    },
    projects: [
      {
        name: "Hugging Face Hub",
        description: "Leading AI model platform and community for sharing, training, and deploying machine learning models and datasets with comprehensive tools and resources.",
        category: "Developer Tools",
        website: "https://huggingface.co"
      }
    ]
  },
  {
    company: {
      name: "Runway",
      description: "Runway是一家专注于AI视频生成和编辑的创新公司，开发了Gen-3等先进的视频生成模型，为内容创作者提供强大的AI工具。"
    },
    projects: [
      {
        name: "Runway Gen-3",
        description: "Advanced AI video generation and editing platform with Gen-3 model for cinematic video creation and motion graphics with professional-grade quality.",
        category: "Video",
        website: "https://runwayml.com"
      }
    ]
  },
  {
    company: {
      name: "ElevenLabs",
      description: "ElevenLabs是一家专注于AI语音生成和克隆技术的公司，提供逼真的语音合成服务，广泛应用于内容创作和多媒体制作。"
    },
    projects: [
      {
        name: "ElevenLabs Voice AI",
        description: "Leading AI voice generation and cloning platform with realistic speech synthesis and emotion control for content creators and multimedia professionals.",
        category: "Content Creation",
        website: "https://elevenlabs.io"
      }
    ]
  }
];

function generateSimplifiedSQL() {
  console.log('🔧 生成简化版SQL脚本（只使用现有字段）...');
  
  let sql = `-- 简化版AIverse数据插入脚本
-- 只使用现有字段：companies(name, description), projects(company_id, name, description, category, website)
-- 在Supabase SQL Editor中执行

-- 1. 插入所有公司数据
INSERT INTO companies (name, description) VALUES\n`;

  const companyInserts = [];
  const projectValues = [];
  
  optimizedCompanies.forEach((item) => {
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
SELECT '简化版AIverse数据插入完成！' as status;`;
  
  // 写入文件
  fs.writeFileSync('insert-simplified-optimized-data.sql', sql);
  
  console.log(`✅ 简化版SQL脚本已生成: insert-simplified-optimized-data.sql`);
  console.log(`📊 包含 ${companyInserts.length} 家公司`);
  console.log(`📊 包含 ${projectValues.length} 个项目`);
}

// 保存优化后的数据
fs.writeFileSync('simplified-optimized-companies.json', JSON.stringify(optimizedCompanies, null, 2));

console.log('🚀 生成简化版优化数据...');
console.log(`📊 包含 ${optimizedCompanies.length} 家公司的真实信息`);

// 生成SQL脚本
generateSimplifiedSQL();

console.log('✅ 简化版优化完成！');
console.log('📁 结果已保存到: simplified-optimized-companies.json');
console.log('📁 SQL脚本已保存到: insert-simplified-optimized-data.sql');
