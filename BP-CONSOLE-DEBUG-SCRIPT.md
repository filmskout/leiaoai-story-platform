# BP分析 - Console诊断脚本

## 🔍 完整诊断脚本

请在浏览器Console中运行此脚本，然后把**完整输出**发给我。

### 使用方法：

1. 访问: https://leiaoai-story-platform.vercel.app/bp-analysis
2. 按 `F12` 打开 Console
3. 复制下面的脚本
4. 粘贴到 Console 并按回车
5. 等待执行完成（约30秒）
6. 复制**所有输出**发给我

---

## 🚀 诊断脚本

```javascript
(async function() {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🔍 BP分析完整诊断开始');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  // 1. 检查用户登录
  console.log('\n1️⃣ 检查用户登录状态...');
  try {
    const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2');
    const supabaseUrl = 'https://wqcdxmqywjtrnxodwjpy.supabase.co'; // 替换为你的URL
    const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndxY2R4bXF5d2p0cm54b2R3anB5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQzNDA5NDYsImV4cCI6MjA0OTkxNjk0Nn0.zWZlYwQ1pj3iuUhP4gfRvOx-BVH5T84g9PN-lTqbQsU'; // 你的anon key
    
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError) {
      console.error('❌ 认证错误:', authError);
      return;
    }
    
    if (!user) {
      console.error('❌ 未登录 - 请先登录');
      return;
    }
    
    console.log('✅ 已登录:', {
      userId: user.id,
      email: user.email
    });
    
    // 2. 检查最近的BP提交
    console.log('\n2️⃣ 检查最近的BP提交...');
    const { data: bpSubmissions, error: bpError } = await supabase
      .from('bp_submissions')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1);
    
    if (bpError) {
      console.error('❌ 查询BP提交失败:', bpError);
    } else if (!bpSubmissions || bpSubmissions.length === 0) {
      console.warn('⚠️ 没有找到BP提交记录');
      console.log('   请先上传一个PDF文件');
      return;
    } else {
      const bp = bpSubmissions[0];
      console.log('✅ 找到BP提交:', {
        id: bp.id,
        fileName: bp.file_name,
        fileSize: `${(bp.file_size / 1024).toFixed(2)} KB`,
        fileType: bp.file_type,
        filePath: bp.file_url,
        status: bp.analysis_status,
        createdAt: bp.created_at
      });
      
      // 3. 测试文件下载（使用Anon Key）
      console.log('\n3️⃣ 测试文件访问（前端视角）...');
      try {
        const { data: fileData, error: downloadError } = await supabase.storage
          .from('bp-documents')
          .download(bp.file_url);
        
        if (downloadError) {
          console.error('❌ 前端无法下载文件（这是正常的，因为是私有bucket）:', downloadError.message);
          console.log('   文件路径:', bp.file_url);
          console.log('   这说明需要后端使用Secret Key下载');
        } else {
          console.log('✅ 前端可以访问文件（意外！应该是私有的）:', {
            size: fileData.size,
            type: fileData.type
          });
        }
      } catch (e) {
        console.error('❌ 下载测试失败:', e.message);
      }
      
      // 4. 测试OCR API（模拟真实调用）
      console.log('\n4️⃣ 测试OCR API调用...');
      console.log('   发送请求到: /api/ocr-extract');
      console.log('   文件路径:', bp.file_url);
      
      try {
        const startTime = Date.now();
        const response = await fetch('/api/ocr-extract', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            filePath: bp.file_url
          })
        });
        const endTime = Date.now();
        
        console.log('   响应状态:', response.status);
        console.log('   响应时间:', `${endTime - startTime}ms`);
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
          console.error('❌ OCR API错误:', {
            status: response.status,
            error: errorData.error,
            details: errorData.details,
            fullResponse: errorData
          });
          
          console.log('\n💡 问题诊断:');
          if (response.status === 500 && errorData.error?.includes('SUPABASE_URL')) {
            console.log('   - 后端缺少 SUPABASE_URL 环境变量');
            console.log('   - 解决: 在Vercel添加 SUPABASE_URL');
          } else if (response.status === 500 && errorData.error?.includes('SUPABASE_SECRET_KEY')) {
            console.log('   - 后端缺少 SUPABASE_SECRET_KEY 环境变量');
            console.log('   - 解决: 在Vercel添加 SUPABASE_SECRET_KEY');
          } else if (response.status === 500 && errorData.error?.includes('download')) {
            console.log('   - 后端无法从Storage下载文件');
            console.log('   - 可能原因: Secret Key权限不足或bucket配置错误');
          } else if (response.status === 400) {
            console.log('   - OpenAI API拒绝请求');
            console.log('   - 可能原因:', errorData.details);
          } else if (response.status === 401) {
            console.log('   - OpenAI API Key无效');
            console.log('   - 解决: 检查Vercel中的 OPENAI_API_KEY');
          } else {
            console.log('   - 未知错误，详情:', errorData);
          }
        } else {
          const data = await response.json();
          console.log('✅ OCR成功!', {
            textLength: data.extractedText?.length || data.text?.length || 0,
            preview: (data.extractedText || data.text || '').substring(0, 100)
          });
        }
      } catch (e) {
        console.error('❌ API调用失败:', e.message);
      }
    }
    
    // 5. 检查Storage Bucket配置
    console.log('\n5️⃣ 检查Storage Bucket配置...');
    try {
      const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
      
      if (bucketsError) {
        console.error('❌ 无法列出buckets:', bucketsError);
      } else {
        const bpBucket = buckets.find(b => b.name === 'bp-documents');
        if (bpBucket) {
          console.log('✅ bp-documents bucket存在:', {
            id: bpBucket.id,
            name: bpBucket.name,
            public: bpBucket.public,
            createdAt: bpBucket.created_at
          });
          
          if (bpBucket.public) {
            console.warn('⚠️ Bucket是公开的（不推荐，但可以工作）');
          } else {
            console.log('✅ Bucket是私有的（推荐，需要Secret Key）');
          }
        } else {
          console.error('❌ 未找到 bp-documents bucket');
        }
      }
    } catch (e) {
      console.error('❌ Bucket检查失败:', e.message);
    }
    
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ 诊断完成！');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n📋 请复制上面所有输出发送给开发者');
    
  } catch (error) {
    console.error('❌ 诊断脚本执行失败:', error);
  }
})();
```

---

## 📝 注意事项

1. **修改Supabase URL和Anon Key**
   - 在脚本中找到这两行：
   ```javascript
   const supabaseUrl = 'https://wqcdxmqywjtrnxodwjpy.supabase.co';
   const supabaseAnonKey = 'eyJhbGc...';
   ```
   - 替换为你的实际值（从 `.env` 文件或 Supabase Dashboard 获取）

2. **先上传一个测试PDF**
   - 脚本会检查最近的BP提交
   - 如果没有，请先上传一个小PDF（< 5MB）

3. **完整复制所有输出**
   - 包括所有的 ✅ ❌ ⚠️ 标记
   - 包括所有的错误详情
   - 这将帮助我准确定位问题

---

## 🎯 我需要看到的关键信息

- [ ] 用户是否已登录？
- [ ] 是否有BP提交记录？
- [ ] 文件路径是什么？
- [ ] OCR API返回什么状态码？
- [ ] 具体的错误消息是什么？
- [ ] OpenAI返回的详细错误是什么？

运行完脚本后，把**完整输出**发给我！

