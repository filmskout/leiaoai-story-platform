// 测试AI Chat API的脚本
// 在浏览器控制台中运行

async function testAIChat() {
  console.log('🧪 开始测试AI Chat API...');
  
  try {
    const response = await fetch('/api/unified?action=ai-chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'Hello, can you help me?',
        model: 'deepseek',
        sessionId: 'test-session-' + Date.now(),
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
    
    if (data.success) {
      console.log('🎉 AI Chat工作正常！');
      console.log('🤖 使用的模型:', data.model);
      console.log('💬 AI回复:', data.response);
    } else {
      console.error('❌ AI Chat失败:', data.error);
    }
    
  } catch (error) {
    console.error('❌ 测试失败:', error);
  }
}

// 运行测试
testAIChat();
