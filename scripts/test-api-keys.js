#!/usr/bin/env node

/**
 * API Key测试脚本
 * 用于验证DeepSeek、OpenAI和Qwen的API Keys是否有效
 */

const https = require('https');

// 从环境变量读取API Keys（或手动设置测试）
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY || '';
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || '';
const QWEN_API_KEY = process.env.QWEN_API_KEY || '';

// 测试消息
const TEST_MESSAGE = '请用一句话介绍你自己';

// 测试DeepSeek API
async function testDeepSeek() {
  console.log('\n🔵 测试 DeepSeek API...');
  
  if (!DEEPSEEK_API_KEY) {
    console.log('❌ DEEPSEEK_API_KEY 未设置');
    return false;
  }
  
  console.log(`📍 API Key (前8位): ${DEEPSEEK_API_KEY.substring(0, 8)}...`);
  
  try {
    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'user', content: TEST_MESSAGE }
        ],
        max_tokens: 100
      })
    });

    const data = await response.json();
    
    if (response.ok && data.choices?.[0]?.message?.content) {
      console.log('✅ DeepSeek API 工作正常');
      console.log('📝 响应:', data.choices[0].message.content.substring(0, 100));
      return true;
    } else {
      console.log('❌ DeepSeek API 失败:', response.status, response.statusText);
      console.log('📝 错误详情:', JSON.stringify(data, null, 2).substring(0, 300));
      return false;
    }
  } catch (error) {
    console.log('❌ DeepSeek API 异常:', error.message);
    return false;
  }
}

// 测试OpenAI API
async function testOpenAI() {
  console.log('\n🔵 测试 OpenAI API...');
  
  if (!OPENAI_API_KEY) {
    console.log('❌ OPENAI_API_KEY 未设置');
    return false;
  }
  
  console.log(`📍 API Key (前8位): ${OPENAI_API_KEY.substring(0, 8)}...`);
  
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'user', content: TEST_MESSAGE }
        ],
        max_tokens: 100
      })
    });

    const data = await response.json();
    
    if (response.ok && data.choices?.[0]?.message?.content) {
      console.log('✅ OpenAI API 工作正常');
      console.log('📝 响应:', data.choices[0].message.content.substring(0, 100));
      return true;
    } else {
      console.log('❌ OpenAI API 失败:', response.status, response.statusText);
      console.log('📝 错误详情:', JSON.stringify(data, null, 2).substring(0, 300));
      return false;
    }
  } catch (error) {
    console.log('❌ OpenAI API 异常:', error.message);
    return false;
  }
}

// 测试Qwen API
async function testQwen() {
  console.log('\n🔵 测试 Qwen API...');
  
  if (!QWEN_API_KEY) {
    console.log('❌ QWEN_API_KEY 未设置');
    return false;
  }
  
  console.log(`📍 API Key (前8位): ${QWEN_API_KEY.substring(0, 8)}...`);
  
  try {
    const response = await fetch('https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${QWEN_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'qwen-turbo',
        messages: [
          { role: 'user', content: TEST_MESSAGE }
        ],
        max_tokens: 100
      })
    });

    const data = await response.json();
    
    if (response.ok && data.choices?.[0]?.message?.content) {
      console.log('✅ Qwen API 工作正常');
      console.log('📝 响应:', data.choices[0].message.content.substring(0, 100));
      return true;
    } else {
      console.log('❌ Qwen API 失败:', response.status, response.statusText);
      console.log('📝 错误详情:', JSON.stringify(data, null, 2).substring(0, 300));
      return false;
    }
  } catch (error) {
    console.log('❌ Qwen API 异常:', error.message);
    return false;
  }
}

// 主函数
async function main() {
  console.log('='.repeat(60));
  console.log('🧪 API Key 测试工具');
  console.log('='.repeat(60));
  
  const results = {
    deepseek: await testDeepSeek(),
    openai: await testOpenAI(),
    qwen: await testQwen()
  };
  
  console.log('\n' + '='.repeat(60));
  console.log('📊 测试总结:');
  console.log('='.repeat(60));
  console.log(`DeepSeek: ${results.deepseek ? '✅ 正常' : '❌ 失败'}`);
  console.log(`OpenAI:   ${results.openai ? '✅ 正常' : '❌ 失败'}`);
  console.log(`Qwen:     ${results.qwen ? '✅ 正常' : '❌ 失败'}`);
  console.log('='.repeat(60));
  
  // 提供建议
  if (!results.deepseek || !results.openai) {
    console.log('\n💡 建议:');
    if (!results.deepseek) {
      console.log('   - 请检查DeepSeek API Key是否有效');
      console.log('   - 访问 https://platform.deepseek.com 获取新的API Key');
    }
    if (!results.openai) {
      console.log('   - 请检查OpenAI API Key是否有效');
      console.log('   - 访问 https://platform.openai.com/api-keys 获取新的API Key');
      console.log('   - 确保账户有足够余额');
    }
  }
}

main().catch(console.error);

