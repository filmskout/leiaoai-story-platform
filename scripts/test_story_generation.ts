import 'dotenv/config';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

// 测试海外公司英文报道生成
async function testOverseasStoryGeneration() {
  console.log('🧪 测试海外公司英文报道生成...');
  
  const mockArticle = {
    title: "OpenAI Announces New AI Model Breakthrough",
    content: "OpenAI has announced a significant breakthrough in their latest AI model, demonstrating improved capabilities in natural language processing and reasoning.",
    url: "https://example.com/openai-news",
    published_date: new Date().toISOString(),
    source: "TechCrunch"
  };

  const prompt = `
Please generate a 350-500 word Stories content based on the following news article, with requirements:
1. Write in English
2. Professional and easy to understand content
3. Highlight AI technology and innovation points
4. Include company background information
5. Suitable for investors and technology enthusiasts
6. Strictly control word count between 350-500 words

News Title: ${mockArticle.title}
News Content: ${mockArticle.content}
Company Name: OpenAI
Related Tools: GPT-4, ChatGPT, DALL-E

Please generate title and content:
`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 1000,
      temperature: 0.7
    });

    const generatedContent = response.choices[0]?.message?.content || '';
    const wordCount = generatedContent.split(' ').length;
    
    console.log(`✅ 英文报道生成成功`);
    console.log(`📊 字数统计: ${wordCount} 个单词`);
    console.log(`📝 内容预览: ${generatedContent.substring(0, 200)}...`);
    
    return wordCount >= 350 && wordCount <= 500;
  } catch (error) {
    console.error('❌ 英文报道生成失败:', error);
    return false;
  }
}

// 测试国内公司中文报道生成
async function testDomesticStoryGeneration() {
  console.log('🧪 测试国内公司中文报道生成...');
  
  const mockArticle = {
    title: "百度发布文心一言最新版本",
    content: "百度公司发布了文心一言AI模型的最新版本，在自然语言处理和推理能力方面取得了显著突破。",
    url: "https://example.com/baidu-news",
    published_date: new Date().toISOString(),
    source: "36氪"
  };

  const prompt = `
请基于以下新闻文章生成一篇350-500字的Stories内容，要求：
1. 用简体中文写作
2. 内容专业且易懂
3. 突出AI技术和创新点
4. 包含公司背景信息
5. 适合投资人和技术爱好者阅读
6. 严格控制字数在350-500字之间

新闻标题: ${mockArticle.title}
新闻内容: ${mockArticle.content}
公司名称: 百度
相关工具: 文心一言, 百度AI, 百度云

请生成标题和内容：
`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 1000,
      temperature: 0.7
    });

    const generatedContent = response.choices[0]?.message?.content || '';
    const charCount = generatedContent.length;
    
    console.log(`✅ 中文报道生成成功`);
    console.log(`📊 字数统计: ${charCount} 个字符`);
    console.log(`📝 内容预览: ${generatedContent.substring(0, 100)}...`);
    
    return charCount >= 350 && charCount <= 500;
  } catch (error) {
    console.error('❌ 中文报道生成失败:', error);
    return false;
  }
}

// 测试字数控制功能
async function testWordCountControl() {
  console.log('🧪 测试字数控制功能...');
  
  const testCases = [
    {
      name: "短内容测试",
      prompt: "请生成一篇关于AI技术的文章，要求350-500字。",
      expectedMin: 350,
      expectedMax: 500
    },
    {
      name: "长内容测试", 
      prompt: "请生成一篇关于人工智能发展的详细分析文章，要求350-500字，包含技术背景、市场分析、未来展望等内容。",
      expectedMin: 350,
      expectedMax: 500
    }
  ];

  let passedTests = 0;
  
  for (const testCase of testCases) {
    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: testCase.prompt }],
        max_tokens: 1000,
        temperature: 0.7
      });

      const content = response.choices[0]?.message?.content || '';
      const wordCount = content.split(' ').length;
      
      const passed = wordCount >= testCase.expectedMin && wordCount <= testCase.expectedMax;
      
      console.log(`${passed ? '✅' : '❌'} ${testCase.name}: ${wordCount} 字 (期望: ${testCase.expectedMin}-${testCase.expectedMax})`);
      
      if (passed) passedTests++;
      
    } catch (error) {
      console.error(`❌ ${testCase.name} 失败:`, error);
    }
  }
  
  console.log(`📊 字数控制测试通过率: ${passedTests}/${testCases.length} (${(passedTests/testCases.length*100).toFixed(1)}%)`);
  return passedTests === testCases.length;
}

async function main() {
  console.log('🚀 开始测试报道生成功能...');
  console.log('═'.repeat(60));

  try {
    // 测试海外公司英文报道
    const overseasTest = await testOverseasStoryGeneration();
    
    console.log('\n' + '─'.repeat(40));
    
    // 测试国内公司中文报道
    const domesticTest = await testDomesticStoryGeneration();
    
    console.log('\n' + '─'.repeat(40));
    
    // 测试字数控制
    const wordCountTest = await testWordCountControl();
    
    console.log('\n' + '═'.repeat(60));
    console.log('📊 测试结果汇总');
    console.log('═'.repeat(60));
    console.log(`✅ 海外公司英文报道: ${overseasTest ? '通过' : '失败'}`);
    console.log(`✅ 国内公司中文报道: ${domesticTest ? '通过' : '失败'}`);
    console.log(`✅ 字数控制功能: ${wordCountTest ? '通过' : '失败'}`);
    
    const allPassed = overseasTest && domesticTest && wordCountTest;
    console.log(`\n🎯 总体测试结果: ${allPassed ? '✅ 全部通过' : '❌ 部分失败'}`);
    
    if (allPassed) {
      console.log('\n🎉 所有测试通过！报道生成功能已准备就绪。');
    } else {
      console.log('\n⚠️ 部分测试失败，请检查配置和API设置。');
    }
    
  } catch (error) {
    console.error('❌ 测试执行失败:', error);
    process.exit(1);
  }
}

// 运行测试
main().catch(console.error);
