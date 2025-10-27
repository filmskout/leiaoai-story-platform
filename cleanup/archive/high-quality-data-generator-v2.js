#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import https from 'https';

dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error('❌ Supabase配置缺失');
    process.exit(1);
}

if (!DEEPSEEK_API_KEY && !OPENAI_API_KEY) {
    console.error('❌ 没有可用的LLM API Key');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// 200+家AI公司列表（全球知名公司）
const AI_COMPANIES = [
    // 美国科技巨头
    'OpenAI', 'Google', 'Microsoft', 'Meta', 'Apple', 'Amazon', 'Tesla', 'NVIDIA', 'IBM', 'Intel',
    'Adobe', 'Salesforce', 'Oracle', 'SAP', 'ServiceNow', 'Workday', 'Snowflake', 'Databricks',
    'Palantir', 'C3.ai', 'UiPath', 'Automation Anywhere', 'Blue Prism', 'Pegasystems', 'Appian',
    'Mendix', 'OutSystems', 'Zapier', 'Airtable', 'Notion', 'Figma', 'Canva', 'Slack', 'Zoom',
    'Teams', 'Discord', 'Twilio', 'SendGrid', 'Mailchimp', 'HubSpot', 'Marketo', 'Pardot',
    'Intercom', 'Zendesk', 'Freshworks', 'Monday.com', 'Asana', 'Trello', 'Jira', 'Confluence',
    
    // AI专业公司
    'Anthropic', 'Cohere', 'Hugging Face', 'Stability AI', 'Midjourney', 'Runway', 'Character.AI',
    'Replika', 'Jasper', 'Copy.ai', 'Writesonic', 'Grammarly', 'DeepL', 'Loom', 'Otter.ai',
    'Rev.com', 'Descript', 'Murf', 'ElevenLabs', 'Synthesia', 'D-ID', 'HeyGen', 'Pictory',
    'InVideo', 'Kapwing', 'Canva', 'Figma', 'Sketch', 'Adobe Creative Suite', 'Framer',
    
    // 企业AI
    'DataRobot', 'H2O.ai', 'Dataiku', 'Alteryx', 'RapidMiner', 'KNIME', 'Weka', 'Orange',
    'BigML', 'MLflow', 'Kubeflow', 'Weights & Biases', 'Neptune', 'Comet', 'Arize',
    'WhyLabs', 'Evidently', 'Great Expectations', 'Deepchecks', 'Monte Carlo',
    
    // 中国AI公司
    '百度', '阿里巴巴', '腾讯', '字节跳动', '华为', '小米', '京东', '美团', '滴滴', '快手',
    '网易', '搜狐', '新浪', '搜狗', '科大讯飞', '商汤科技', '旷视科技', '依图科技',
    '云从科技', '寒武纪', '地平线', '四维图新', '海康威视', '大华股份', '东方网力',
    '格灵深瞳', '云知声', '思必驰', '出门问问', '小i机器人', '图灵机器人',
    
    // 欧洲AI公司
    'DeepMind', 'Element AI', 'Darktrace', 'Benevolent AI', 'Babylon Health', 'Onfido',
    'Tractable', 'Faculty', 'Seldon', 'Hugging Face', 'Stability AI', 'Aleph Alpha',
    'Mistral AI', 'Cohere', 'Anthropic', 'Character.AI', 'Replika', 'Jasper',
    
    // 亚洲其他地区
    'Samsung', 'LG', 'SK Telecom', 'Kakao', 'Naver', 'Line', 'Rakuten', 'SoftBank',
    'Grab', 'Gojek', 'Tokopedia', 'Shopee', 'Lazada', 'Flipkart', 'Paytm',
    
    // 新兴AI公司
    'Perplexity', 'Claude', 'ChatGPT', 'Bard', 'Copilot', 'GitHub Copilot', 'Tabnine',
    'Kite', 'CodeWhisperer', 'Replit', 'Cursor', 'Codeium', 'Sourcegraph', 'Semgrep',
    'SonarQube', 'Checkmarx', 'Veracode', 'Snyk', 'Mend', 'WhiteSource', 'FOSSA',
    
    // 垂直领域AI
    'Tempus', 'PathAI', 'Viz.ai', 'Arterys', 'Zebra Medical', 'Butterfly Network',
    'Caption Health', 'Aidoc', 'Siemens Healthineers', 'GE Healthcare', 'Philips',
    'Medtronic', 'Johnson & Johnson', 'Roche', 'Novartis', 'Pfizer', 'Merck',
    
    // 金融AI
    'Kensho', 'Ayasdi', 'DataRobot', 'H2O.ai', 'Dataiku', 'Alteryx', 'RapidMiner',
    'KNIME', 'Weka', 'Orange', 'BigML', 'MLflow', 'Kubeflow', 'Weights & Biases',
    'Neptune', 'Comet', 'Arize', 'WhyLabs', 'Evidently', 'Great Expectations',
    
    // 自动驾驶
    'Waymo', 'Cruise', 'Argo AI', 'Aurora', 'Pony.ai', 'WeRide', 'AutoX', 'Momenta',
    'TuSimple', 'Embark', 'Kodiak', 'Plus', 'Einride', 'Nuro', 'Starship',
    
    // 机器人
    'Boston Dynamics', 'iRobot', 'Roomba', 'Tesla Bot', 'Honda ASIMO', 'SoftBank Pepper',
    'UBTECH', 'Anki', 'Sphero', 'Wonder Workshop', 'Makeblock', 'LEGO Mindstorms',
    
    // 其他
    'OpenAI', 'Anthropic', 'Cohere', 'Hugging Face', 'Stability AI', 'Midjourney',
    'Runway', 'Character.AI', 'Replika', 'Jasper', 'Copy.ai', 'Writesonic', 'Grammarly'
];

// 调用DeepSeek API
async function callDeepSeek(prompt, model = 'deepseek-chat', max_tokens = 4000, temperature = 0.3) {
    if (!DEEPSEEK_API_KEY) {
        throw new Error('DeepSeek API Key未配置');
    }
    
    const url = 'https://api.deepseek.com/chat/completions';
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
    };
    
    const data = JSON.stringify({
        model: model,
        messages: [
            {
                role: 'system',
                content: '你是一个专业的AI行业研究员，擅长收集和分析AI公司的详细信息。请提供准确、详细、真实的信息。'
            },
            {
                role: 'user',
                content: prompt
            }
        ],
        max_tokens: max_tokens,
        temperature: temperature,
        stream: false
    });

    return new Promise((resolve, reject) => {
        const req = https.request(url, {
            method: 'POST',
            headers: headers,
            timeout: 120000 // 2分钟超时
        }, (res) => {
            let responseData = '';
            res.on('data', (chunk) => {
                responseData += chunk;
            });
            res.on('end', () => {
                try {
                    const jsonResponse = JSON.parse(responseData);
                    if (jsonResponse.choices && jsonResponse.choices.length > 0) {
                        resolve(jsonResponse.choices[0].message.content);
                    } else {
                        reject(new Error('DeepSeek API返回空响应'));
                    }
                } catch (e) {
                    reject(new Error(`DeepSeek API JSON解析错误: ${e.message}`));
                }
            });
        });

        req.on('error', (e) => {
            reject(new Error(`DeepSeek API调用失败: ${e.message}`));
        });

        req.on('timeout', () => {
            req.destroy();
            reject(new Error('DeepSeek API调用超时'));
        });

        req.write(data);
        req.end();
    });
}

// 调用OpenAI API
async function callOpenAI(prompt, model = 'gpt-4o', max_tokens = 4000, temperature = 0.3) {
    if (!OPENAI_API_KEY) {
        throw new Error('OpenAI API Key未配置');
    }
    
    const url = 'https://api.openai.com/v1/chat/completions';
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
    };
    
    const data = JSON.stringify({
        model: model,
        messages: [
            {
                role: 'system',
                content: '你是一个专业的AI行业研究员，擅长收集和分析AI公司的详细信息。请提供准确、详细、真实的信息。'
            },
            {
                role: 'user',
                content: prompt
            }
        ],
        max_tokens: max_tokens,
        temperature: temperature,
        stream: false
    });

    return new Promise((resolve, reject) => {
        const req = https.request(url, {
            method: 'POST',
            headers: headers,
            timeout: 120000 // 2分钟超时
        }, (res) => {
            let responseData = '';
            res.on('data', (chunk) => {
                responseData += chunk;
            });
            res.on('end', () => {
                try {
                    const jsonResponse = JSON.parse(responseData);
                    if (jsonResponse.choices && jsonResponse.choices.length > 0) {
                        resolve(jsonResponse.choices[0].message.content);
                    } else {
                        reject(new Error('OpenAI API返回空响应'));
                    }
                } catch (e) {
                    reject(new Error(`OpenAI API JSON解析错误: ${e.message}`));
                }
            });
        });

        req.on('error', (e) => {
            reject(new Error(`OpenAI API调用失败: ${e.message}`));
        });

        req.on('timeout', () => {
            req.destroy();
            reject(new Error('OpenAI API调用超时'));
        });

        req.write(data);
        req.end();
    });
}

// 清理和解析JSON内容
function cleanJSONContent(content) {
    // 尝试找到JSON对象的开始
    const jsonStartIndex = content.indexOf('{');
    const jsonArrayStartIndex = content.indexOf('[');

    let startIndex = -1;
    if (jsonStartIndex !== -1 && (jsonArrayStartIndex === -1 || jsonStartIndex < jsonArrayStartIndex)) {
        startIndex = jsonStartIndex;
    } else if (jsonArrayStartIndex !== -1) {
        startIndex = jsonArrayStartIndex;
    }

    if (startIndex === -1) {
        throw new Error('无法在内容中找到有效的JSON起始符');
    }

    let cleanedContent = content.substring(startIndex);

    // 移除尾部的非JSON字符
    const lastBraceIndex = cleanedContent.lastIndexOf('}');
    const lastBracketIndex = cleanedContent.lastIndexOf(']');

    let endIndex = -1;
    if (lastBraceIndex !== -1 && (lastBracketIndex === -1 || lastBraceIndex > lastBracketIndex)) {
        endIndex = lastBraceIndex;
    } else if (lastBracketIndex !== -1) {
        endIndex = lastBracketIndex;
    }

    if (endIndex !== -1) {
        cleanedContent = cleanedContent.substring(0, endIndex + 1);
    }

    // 移除markdown代码块标记
    if (cleanedContent.startsWith('```json')) {
        cleanedContent = cleanedContent.substring(7);
    }
    if (cleanedContent.endsWith('```')) {
        cleanedContent = cleanedContent.substring(0, cleanedContent.length - 3);
    }

    return JSON.parse(cleanedContent);
}

// 生成公司数据
async function generateCompanyData(companyName) {
    console.log(`🔍 正在生成 ${companyName} 的详细信息...`);

    const prompt = `
请为AI公司"${companyName}"提供详细、准确、真实的信息。请进行深度研究，确保信息的准确性和完整性。

请提供以下信息，并以JSON格式返回：

{
  "name": "公司名称",
  "description": "公司简介（50-100字）",
  "detailed_description": "详细描述（300-500字，包含公司历史、核心业务、技术优势、市场地位等）",
  "founded_year": 年份,
  "headquarters": "总部地址（城市，国家）",
  "employee_count_range": "员工数量范围（如：1-10, 11-50, 51-200, 201-500, 501-1000, 1001-5000, 5001-10000, 10000+）",
  "valuation_usd": 估值（美元，如果公开的话，否则为0）,
  "industry_tags": ["行业标签1", "行业标签2", "行业标签3"],
  "logo_url": "公司logo的URL（如果找不到，使用公司官网）",
  "website": "公司官网URL",
  "company_type": "公司类型（AI Giant, Independent AI, AI Company, Tech Giant等）",
  "company_tier": "公司层级（Tier 1, Tier 2, Independent, Emerging等）",
  "company_category": "公司分类（AI Platform, AI Hardware, AI Software, AI Services等）",
  "projects": [
    {
      "name": "项目/产品名称",
      "description": "项目描述（50-100字）",
      "category": "项目分类（LLM & Language Models, Image Processing & Generation, Video Processing & Generation, Professional Domain Analysis, Virtual Companions等）",
      "website": "项目官网URL",
      "pricing_model": "定价模式（Freemium, Subscription, One-time purchase, Enterprise等）",
      "launch_date": "发布日期（YYYY-MM-DD）",
      "status": "状态（Active, Beta, Discontinued等）"
    }
  ],
  "fundings": [
    {
      "round": "融资轮次（Seed, Series A, Series B, Series C, Series D, Series E, IPO等）",
      "amount_usd": 融资金额（美元）,
      "date": "融资日期（YYYY-MM-DD）",
      "investors": ["投资者1", "投资者2"]
    }
  ],
  "stories": [
    {
      "title": "新闻标题",
      "content": "新闻内容摘要（150-200字）",
      "source_url": "新闻源URL",
      "published_date": "发布日期（YYYY-MM-DD）",
      "category": "新闻分类（Funding News, Product Launch, Partnership, Research Breakthrough等）"
    }
  ]
}

请确保：
1. 所有信息都是真实、准确的
2. 项目/产品信息详细且具体
3. 融资信息准确（如果公开的话）
4. 新闻故事真实且相关
5. 所有URL都是有效的
6. 公司分类和层级合理
`;

    let responseContent = null;
    try {
        // 优先使用DeepSeek
        if (DEEPSEEK_API_KEY) {
            responseContent = await callDeepSeek(prompt, 'deepseek-chat', 4000, 0.3);
        } else {
            responseContent = await callOpenAI(prompt, 'gpt-4o', 4000, 0.3);
        }
    } catch (error) {
        console.warn(`⚠️ 主要API调用失败，尝试备用API: ${error.message}`);
        try {
            if (DEEPSEEK_API_KEY && OPENAI_API_KEY) {
                responseContent = await callOpenAI(prompt, 'gpt-4o', 4000, 0.3);
            } else {
                throw new Error('没有可用的备用API');
            }
        } catch (backupError) {
            throw new Error(`所有API调用均失败: ${error.message}, ${backupError.message}`);
        }
    }

    try {
        const data = cleanJSONContent(responseContent);
        return data;
    } catch (e) {
        throw new Error(`JSON解析错误: ${e.message}, 原始内容: ${responseContent.substring(0, 200)}...`);
    }
}

// 插入公司数据到数据库
async function insertCompanyData(companyData) {
    try {
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
            throw new Error(`公司插入失败: ${companyError.message}`);
        }

        console.log(`✅ 成功插入公司: ${companyData.name}`);

        // 插入项目信息
        if (companyData.projects && companyData.projects.length > 0) {
            const projects = companyData.projects.map(project => ({
                company_id: company.id,
                name: project.name,
                description: project.description,
                category: project.category,
                website: project.website,
                pricing_model: project.pricing_model,
                launch_date: project.launch_date,
                status: project.status
            }));

            const { error: projectsError } = await supabase
                .from('projects')
                .insert(projects);

            if (projectsError) {
                console.warn(`⚠️ 项目插入失败: ${projectsError.message}`);
            } else {
                console.log(`✅ 成功插入 ${projects.length} 个项目`);
            }
        }

        // 插入融资信息
        if (companyData.fundings && companyData.fundings.length > 0) {
            const fundings = companyData.fundings.map(funding => ({
                company_id: company.id,
                round: funding.round,
                amount_usd: funding.amount_usd,
                date: funding.date,
                investors: funding.investors
            }));

            const { error: fundingsError } = await supabase
                .from('fundings')
                .insert(fundings);

            if (fundingsError) {
                console.warn(`⚠️ 融资信息插入失败: ${fundingsError.message}`);
            } else {
                console.log(`✅ 成功插入 ${fundings.length} 条融资信息`);
            }
        }

        // 插入新闻故事
        if (companyData.stories && companyData.stories.length > 0) {
            const stories = companyData.stories.map(story => ({
                company_id: company.id,
                title: story.title,
                content: story.content,
                source_url: story.source_url,
                published_date: story.published_date,
                category: story.category
            }));

            const { error: storiesError } = await supabase
                .from('stories')
                .insert(stories);

            if (storiesError) {
                console.warn(`⚠️ 新闻故事插入失败: ${storiesError.message}`);
            } else {
                console.log(`✅ 成功插入 ${stories.length} 条新闻故事`);
            }
        }

        return company;

    } catch (error) {
        throw new Error(`数据插入失败: ${error.message}`);
    }
}

// 主函数
async function main() {
    console.log('🚀 开始生成高质量AI公司数据...');
    console.log(`📊 计划生成 ${AI_COMPANIES.length} 家公司的数据`);

    let successCount = 0;
    let errorCount = 0;
    const errors = [];

    for (let i = 0; i < AI_COMPANIES.length; i++) {
        const companyName = AI_COMPANIES[i];
        console.log(`\n📈 进度: ${i + 1}/${AI_COMPANIES.length} - ${companyName}`);

        try {
            const companyData = await generateCompanyData(companyName);
            await insertCompanyData(companyData);
            successCount++;
            console.log(`✅ ${companyName} 数据生成成功`);
        } catch (error) {
            errorCount++;
            errors.push({ company: companyName, error: error.message });
            console.error(`❌ ${companyName} 数据生成失败: ${error.message}`);
        }

        // 添加延迟避免API限速
        if (i < AI_COMPANIES.length - 1) {
            console.log('⏳ 等待2秒...');
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
    }

    console.log('\n🎉 数据生成完成！');
    console.log(`✅ 成功: ${successCount} 家公司`);
    console.log(`❌ 失败: ${errorCount} 家公司`);

    if (errors.length > 0) {
        console.log('\n❌ 失败的公司:');
        errors.forEach(({ company, error }) => {
            console.log(`  - ${company}: ${error}`);
        });
    }

    // 验证最终结果
    console.log('\n📊 最终数据统计:');
    const { data: companies } = await supabase.from('companies').select('id');
    const { data: projects } = await supabase.from('projects').select('id');
    const { data: fundings } = await supabase.from('fundings').select('id');
    const { data: stories } = await supabase.from('stories').select('id');

    console.log(`  - 公司: ${companies?.length || 0} 家`);
    console.log(`  - 项目: ${projects?.length || 0} 个`);
    console.log(`  - 融资: ${fundings?.length || 0} 条`);
    console.log(`  - 新闻: ${stories?.length || 0} 条`);
}

// 运行主函数
main().catch(console.error);
