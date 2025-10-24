// AI Chat Debug Test
// 在浏览器控制台中运行此代码来测试AI聊天功能

async function testAIChat() {
  console.log('🧪 开始测试AI聊天功能...');
  
  try {
    // 测试API端点
    const response = await fetch('/api/unified?action=ai-chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'Hello, this is a test message',
        model: 'deepseek',
        language: 'en'
      })
    });
    
    console.log('📡 API响应状态:', response.status, response.statusText);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ API错误:', errorText);
      return;
    }
    
    const data = await response.json();
    console.log('✅ API响应数据:', data);
    
    if (data.success && data.response) {
      console.log('🎉 AI聊天功能正常工作!');
      console.log('🤖 AI回复:', data.response);
      console.log('🔧 使用模型:', data.model);
    } else {
      console.error('❌ API响应格式错误:', data);
    }
    
  } catch (error) {
    console.error('❌ 测试失败:', error);
  }
}

// 运行测试
testAIChat();
