#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error('❌ Supabase配置缺失');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// 测试数据
const testCompanies = [
    {
        name: 'OpenAI',
        description: 'Leading AI research company focused on developing safe artificial general intelligence.',
        detailed_description: 'OpenAI is an American artificial intelligence research laboratory consisting of the for-profit OpenAI LP and its parent company, the non-profit OpenAI Inc. Founded in December 2015, OpenAI\'s mission is to ensure that artificial general intelligence (AGI) benefits all of humanity. The company is known for developing advanced language models like GPT-3, GPT-4, and ChatGPT, as well as image generation models like DALL-E. OpenAI has received significant funding from Microsoft and other investors, making it one of the most valuable AI companies in the world.',
        founded_year: 2015,
        headquarters: 'San Francisco, California, USA',
        employee_count_range: '501-1000',
        valuation_usd: 80000000000,
        industry_tags: ['AI Research', 'Language Models', 'Machine Learning'],
        logo_url: 'https://openai.com/images/openai-logo.png',
        website: 'https://openai.com',
        company_type: 'AI Giant',
        company_tier: 'Tier 1',
        company_category: 'AI Platform'
    },
    {
        name: 'Google',
        description: 'Multinational technology company specializing in Internet-related services and products.',
        detailed_description: 'Google LLC is an American multinational technology company that specializes in Internet-related services and products, which include online advertising technologies, a search engine, cloud computing, software, and hardware. Founded in 1998 by Larry Page and Sergey Brin, Google has become one of the world\'s most valuable companies. In the AI space, Google has developed numerous AI products including Google Assistant, Google Translate, Google Photos, and advanced AI models like BERT, T5, and PaLM. The company\'s AI research division, Google AI, continues to push the boundaries of machine learning and artificial intelligence.',
        founded_year: 1998,
        headquarters: 'Mountain View, California, USA',
        employee_count_range: '10000+',
        valuation_usd: 1500000000000,
        industry_tags: ['Search Engine', 'AI Research', 'Cloud Computing'],
        logo_url: 'https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png',
        website: 'https://google.com',
        company_type: 'Tech Giant',
        company_tier: 'Tier 1',
        company_category: 'AI Platform'
    },
    {
        name: 'Microsoft',
        description: 'Multinational technology corporation developing computer software, consumer electronics, and cloud services.',
        detailed_description: 'Microsoft Corporation is an American multinational technology corporation which produces computer software, consumer electronics, personal computers, and related services. Founded in 1975 by Bill Gates and Paul Allen, Microsoft has evolved into one of the world\'s largest technology companies. In the AI space, Microsoft has invested heavily in AI research and development, including partnerships with OpenAI, development of Azure AI services, Microsoft Copilot, and various AI-powered products. The company\'s AI initiatives span across productivity tools, cloud computing, and enterprise solutions.',
        founded_year: 1975,
        headquarters: 'Redmond, Washington, USA',
        employee_count_range: '10000+',
        valuation_usd: 2800000000000,
        industry_tags: ['Software', 'Cloud Computing', 'AI Services'],
        logo_url: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg',
        website: 'https://microsoft.com',
        company_type: 'Tech Giant',
        company_tier: 'Tier 1',
        company_category: 'AI Platform'
    }
];

async function insertTestData() {
    console.log('🚀 开始插入测试数据...');
    
    for (const companyData of testCompanies) {
        try {
            console.log(`📝 插入公司: ${companyData.name}`);
            
            // 插入公司信息
            const { data: company, error: companyError } = await supabase
                .from('companies')
                .insert({
                    name: companyData.name,
                    description: companyData.description,
                    detailed_description: companyData.detailed_description,
                    founded_year: companyData.founded_year,
                    headquarters: companyData.headquarters,
                    employee_count_range: companyData.employee_count_range,
                    valuation_usd: companyData.valuation_usd,
                    industry_tags: companyData.industry_tags,
                    logo_url: companyData.logo_url,
                    website: companyData.website,
                    company_type: companyData.company_type,
                    company_tier: companyData.company_tier,
                    company_category: companyData.company_category
                })
                .select()
                .single();

            if (companyError) {
                console.error(`❌ 公司插入失败: ${companyError.message}`);
                continue;
            }

            console.log(`✅ 成功插入公司: ${companyData.name}`);

            // 为每家公司添加一些项目
            const projects = [
                {
                    company_id: company.id,
                    name: companyData.name === 'OpenAI' ? 'ChatGPT' : 
                          companyData.name === 'Google' ? 'Gemini' : 'Copilot',
                    description: companyData.name === 'OpenAI' ? 'Advanced conversational AI system' :
                                companyData.name === 'Google' ? 'Multimodal AI model' : 'AI-powered coding assistant',
                    category: 'LLM & Language Models',
                    website: companyData.website,
                    pricing_model: 'Freemium',
                    launch_date: '2023-01-01',
                    status: 'Active'
                }
            ];

            const { error: projectsError } = await supabase
                .from('projects')
                .insert(projects);

            if (projectsError) {
                console.warn(`⚠️ 项目插入失败: ${projectsError.message}`);
            } else {
                console.log(`✅ 成功插入项目`);
            }

        } catch (error) {
            console.error(`❌ 处理 ${companyData.name} 时出错: ${error.message}`);
        }
    }

    // 验证结果
    console.log('\n📊 验证结果:');
    const { data: companies } = await supabase.from('companies').select('id,name');
    const { data: projects } = await supabase.from('projects').select('id');
    
    console.log(`  - 公司: ${companies?.length || 0} 家`);
    console.log(`  - 项目: ${projects?.length || 0} 个`);
    
    if (companies && companies.length > 0) {
        console.log('\n✅ 插入的公司:');
        companies.forEach(company => {
            console.log(`  - ${company.name}`);
        });
    }
}

insertTestData().catch(console.error);
