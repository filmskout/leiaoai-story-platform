// 在浏览器控制台运行此脚本来测试前端AI Chat
// 访问 https://leiao.ai 后打开控制台，粘贴并运行

console.log('🧪 开始测试前端AI Chat功能...');

// 测试1: 检查API端点是否可访问
async function testAPIEndpoint() {
  try {
    const response = await fetch('/api/ai-chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'Test message from browser',
        model: 'deepseek',
        language: 'en'
      })
    });
    
    console.log('📡 API端点测试 - 状态:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ API端点工作正常:', data);
      return true;
    } else {
      const errorText = await response.text();
      console.error('❌ API端点错误:', errorText);
      return false;
    }
  } catch (error) {
    console.error('❌ API端点测试失败:', error);
    return false;
  }
}

// 测试2: 检查前端服务函数
async function testFrontendService() {
  try {
    // 模拟前端API调用
    const messages = [{ role: 'user', content: 'Hello from frontend test' }];
    const model = 'deepseek';
    const language = 'en';
    
    console.log('🔵 测试前端服务函数...');
    
    const response = await fetch('/api/ai-chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: messages[0].content,
        model,
        language
      })
    });
    
    console.log('📡 前端服务测试 - 状态:', response.status);
    
    if (!response.ok) {
      const txt = await response.text();
      console.error('🔴 前端服务错误:', txt.slice(0, 200));
      return false;
    }
    
    const data = await response.json();
    console.log('✅ 前端服务工作正常:', data);
    return true;
    
  } catch (error) {
    console.error('❌ 前端服务测试失败:', error);
    return false;
  }
}

// 运行所有测试
async function runAllTests() {
  console.log('🚀 开始运行所有测试...');
  
  const apiTest = await testAPIEndpoint();
  const serviceTest = await testFrontendService();
  
  console.log('\n📊 测试结果:');
  console.log('API端点测试:', apiTest ? '✅ 通过' : '❌ 失败');
  console.log('前端服务测试:', serviceTest ? '✅ 通过' : '❌ 失败');
  
  if (apiTest && serviceTest) {
    console.log('\n🎉 所有测试通过！AI Chat应该正常工作。');
    console.log('如果前端仍然不工作，可能是缓存问题，请尝试：');
    console.log('1. 硬刷新页面 (Ctrl+Shift+R 或 Cmd+Shift+R)');
    console.log('2. 清除浏览器缓存');
    console.log('3. 检查浏览器控制台是否有其他错误');
  } else {
    console.log('\n❌ 发现问题，需要进一步调试。');
  }
}

// 执行测试
runAllTests();
