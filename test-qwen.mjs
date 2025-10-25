import fetch from 'node-fetch';

const testPrompt = 'Hello, please respond with a simple JSON: {"test": "success"}';

try {
  console.log('Testing Qwen API...');
  const response = await fetch('https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + process.env.QWEN_API_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'qwen-turbo',
      input: { messages: [{ role: 'user', content: testPrompt }] },
      parameters: { temperature: 0.3, max_tokens: 100 }
    })
  });
  
  const data = await response.json();
  console.log('Qwen API Response:', JSON.stringify(data, null, 2));
} catch (error) {
  console.error('Qwen API Error:', error.message);
}
