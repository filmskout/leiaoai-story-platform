// 浏览器控制台测试脚本
// 在 https://leiao.ai 页面打开浏览器控制台，粘贴并运行此脚本

async function testAIChatFrontend() {
  console.log('🧪 开始测试前端AI Chat...');
  
  try {
    // 测试新的API端点
    const response = await fetch('/api/ai-chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'Hello, test message',
        model: 'deepseek',
        language: 'en'
      })
    });
    
    console.log('📡 API响应状态:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ API错误:', errorText);
      return;
    }
    
    const data = await response.json();
    console.log('✅ API响应数据:', data);
    
    if (data.success) {
      console.log('🎉 前端AI Chat API工作正常！');
      console.log('🤖 AI回复:', data.response);
    } else {
      console.error('❌ AI Chat失败:', data.error);
    }
    
  } catch (error) {
    console.error('❌ 测试失败:', error);
  }
}

// 运行测试
testAIChatFrontend();
