// AI Chat Frontend Debug Test
// 在浏览器控制台中运行此代码来测试前端AI聊天功能

async function testFrontendAIChat() {
  console.log('🧪 开始测试前端AI聊天功能...');
  
  try {
    // 测试API服务
    const { fetchAIResponse } = await import('/src/services/api.ts');
    
    console.log('📡 测试API服务...');
    
    const response = await fetchAIResponse(
      [{ role: 'user', content: 'Hello, this is a frontend test' }],
      'deepseek',
      'en'
    );
    
    console.log('✅ API服务响应:', response);
    
    if (response.response) {
      console.log('🎉 前端AI聊天功能正常工作!');
      console.log('🤖 AI回复:', response.response);
      console.log('🔧 使用模型:', response.model);
      console.log('⏱️ 处理时间:', response.processingTime + 's');
    } else {
      console.error('❌ API服务响应格式错误:', response);
    }
    
  } catch (error) {
    console.error('❌ 前端测试失败:', error);
    
    // 检查是否是网络问题
    if (error.message.includes('fetch')) {
      console.log('🌐 可能是网络连接问题');
    }
    
    // 检查是否是API密钥问题
    if (error.message.includes('API_KEY')) {
      console.log('🔑 可能是API密钥配置问题');
    }
    
    // 检查是否是CORS问题
    if (error.message.includes('CORS')) {
      console.log('🚫 可能是CORS跨域问题');
    }
  }
}

// 运行测试
testFrontendAIChat();
