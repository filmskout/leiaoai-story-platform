# BP上传和分析完整诊断脚本

## 🎯 用途

这个脚本帮助你诊断BP上传和分析过程中的所有问题。

---

## 📋 使用方法

1. 打开你的应用: https://leiaoai-story-platform.vercel.app/
2. 按 `F12` 打开浏览器开发者工具
3. 切换到 `Console` 标签
4. 复制下面的完整脚本
5. 粘贴到Console并按回车
6. 复制所有输出结果

---

## 🔍 完整诊断脚本

```javascript
const fullDiagnostic = async () => {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🔍 BP上传和分析完整诊断');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('时间:', new Date().toLocaleString());
  
  // 1. 检查用户登录
  console.log('\n━━━ 1️⃣ 用户登录状态 ━━━');
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    console.error('❌ 未登录');
    console.log('   解决: 请先登录');
    return;
  }
  console.log('✅ 已登录');
  console.log('   User ID:', user.id);
  console.log('   Email:', user.email);
  
  // 2. 检查bucket是否存在
  console.log('\n━━━ 2️⃣ Storage Bucket状态 ━━━');
  try {
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    if (bucketsError) {
      console.error('❌ 无法获取buckets列表:', bucketsError.message);
    } else {
      const bpBucket = buckets?.find(b => b.name === 'bp-documents');
      if (!bpBucket) {
        console.error('❌ bp-documents bucket 不存在');
        console.log('   解决: 在Supabase Dashboard创建bucket');
      } else {
        console.log('✅ bp-documents bucket 存在');
        console.log('   Bucket ID:', bpBucket.id);
        console.log('   公开状态:', bpBucket.public ? '✅ 公开' : '⚠️ 私有');
        console.log('   创建时间:', bpBucket.created_at);
        if (!bpBucket.public) {
          console.log('   💡 提示: bucket是私有的，需要使用服务器端下载模式');
        }
      }
    }
  } catch (err) {
    console.error('❌ 检查bucket时出错:', err.message);
  }
  
  // 3. 获取最近上传的BP
  console.log('\n━━━ 3️⃣ 最近的BP提交 ━━━');
  const { data: bp, error: bpError } = await supabase
    .from('bp_submissions')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(1)
    .single();
  
  if (bpError) {
    console.error('❌ 无法获取BP提交:', bpError.message);
    console.log('   Code:', bpError.code);
    if (bpError.code === '42501') {
      console.log('   问题: RLS权限错误');
      console.log('   解决: 运行 SETUP-ALL-RLS-POLICIES-FIXED.sql');
    }
    return;
  }
  
  if (!bp) {
    console.log('⚠️ 没有找到BP提交');
    console.log('   请先上传一个BP文件');
    return;
  }
  
  console.log('✅ 找到BP提交');
  console.log('   ID:', bp.id);
  console.log('   文件名:', bp.file_name);
  console.log('   文件路径:', bp.file_url);
  console.log('   文件类型:', bp.file_type);
  console.log('   文件大小:', bp.file_size, 'bytes', '(' + (bp.file_size / 1024 / 1024).toFixed(2) + ' MB)');
  console.log('   状态:', bp.analysis_status);
  console.log('   创建时间:', bp.created_at);
  console.log('   更新时间:', bp.updated_at);
  if (bp.extracted_text) {
    console.log('   提取文本长度:', bp.extracted_text.length, '字符');
  }
  if (bp.score) {
    console.log('   分析得分:', bp.score);
  }
  
  // 4. 检查文件是否存在于Storage
  console.log('\n━━━ 4️⃣ Storage文件检查 ━━━');
  try {
    const { data: fileList, error: listError } = await supabase.storage
      .from('bp-documents')
      .list(bp.file_url.split('/')[0], {
        limit: 100,
        offset: 0
      });
    
    if (listError) {
      console.error('❌ 无法列出文件:', listError.message);
    } else {
      const fileName = bp.file_url.split('/').pop();
      const fileExists = fileList.some(f => f.name === fileName);
      if (fileExists) {
        console.log('✅ 文件存在于Storage');
      } else {
        console.error('❌ 文件不存在于Storage');
        console.log('   文件可能已被删除');
      }
    }
  } catch (err) {
    console.error('❌ 检查文件存在性时出错:', err.message);
  }
  
  // 5. 测试签名URL（旧方法）
  console.log('\n━━━ 5️⃣ 签名URL测试（旧方法）━━━');
  try {
    const { data: signedUrlData, error: signedError } = await supabase.storage
      .from('bp-documents')
      .createSignedUrl(bp.file_url, 3600);
    
    if (signedError) {
      console.error('❌ 创建签名URL失败:', signedError.message);
    } else {
      const signedUrl = signedUrlData.signedUrl;
      console.log('✅ 签名URL已创建');
      console.log('   URL长度:', signedUrl.length);
      console.log('   URL预览:', signedUrl.substring(0, 100) + '...');
      
      // 测试URL可访问性
      try {
        const response = await fetch(signedUrl, { method: 'HEAD' });
        console.log('   HTTP状态码:', response.status);
        if (response.ok) {
          console.log('   ✅ URL可从浏览器访问');
          console.log('   Content-Type:', response.headers.get('content-type'));
          console.log('   Content-Length:', response.headers.get('content-length'));
          
          // 尝试下载
          const downloadResponse = await fetch(signedUrl);
          const blob = await downloadResponse.blob();
          console.log('   文件大小:', blob.size, 'bytes');
          console.log('   文件类型:', blob.type);
        } else {
          console.error('   ❌ URL不可访问');
        }
      } catch (fetchErr) {
        console.error('   ❌ 访问URL失败:', fetchErr.message);
      }
    }
  } catch (err) {
    console.error('❌ 签名URL测试失败:', err.message);
  }
  
  // 6. 服务器端下载模式说明
  console.log('\n━━━ 6️⃣ 服务器端下载模式 ━━━');
  console.log('ℹ️ 新的OCR方案使用服务器端下载');
  console.log('   前端传递: filePath (文件路径)');
  console.log('   Vercel API: 使用service_role_key下载文件');
  console.log('   转换: 文件 → Base64 → OpenAI');
  console.log('   优点: 完全可靠，不依赖URL访问');
  
  // 7. 检查环境变量（前端无法检查，需要在Vercel检查）
  console.log('\n━━━ 7️⃣ 环境变量检查 ━━━');
  console.log('⚠️ 以下环境变量需要在Vercel Dashboard检查:');
  console.log('   □ OPENAI_API_KEY (必需)');
  console.log('   □ SUPABASE_URL (必需)');
  console.log('   □ SUPABASE_SERVICE_ROLE_KEY (必需 - 新增)');
  console.log('   □ QWEN_API_KEY (可选)');
  console.log('   □ DEEPSEEK_API_KEY (可选)');
  console.log('\n   获取 SUPABASE_SERVICE_ROLE_KEY:');
  console.log('   1. Supabase Dashboard → Settings → API');
  console.log('   2. 找到 "service_role" key');
  console.log('   3. 复制并添加到Vercel环境变量');
  
  // 8. RLS Policies检查
  console.log('\n━━━ 8️⃣ RLS Policies状态 ━━━');
  console.log('ℹ️ 需要手动检查以下policies:');
  console.log('\n   数据库表 (bp_submissions):');
  console.log('   • Supabase Dashboard → Database → bp_submissions → Policies');
  console.log('   • 应该有4个policies (SELECT, INSERT, UPDATE, DELETE)');
  console.log('\n   Storage (bp-documents):');
  console.log('   • Supabase Dashboard → Storage → bp-documents → Policies');
  console.log('   • 应该有4个policies (SELECT, INSERT, UPDATE, DELETE)');
  console.log('   • 参考: BP-STORAGE-POLICIES-PURE-SQL.md');
  
  // 9. 测试流程建议
  console.log('\n━━━ 9️⃣ 测试建议 ━━━');
  console.log('📝 完整测试流程:');
  console.log('   1. 上传新的PDF文件 (< 20MB)');
  console.log('   2. 验证看到上传成功alert');
  console.log('   3. 检查Dashboard显示文件');
  console.log('   4. 点击 "Analyze BP" 按钮');
  console.log('   5. 打开Console查看详细日志');
  console.log('   6. 等待分析完成（可能需要30-60秒）');
  console.log('   7. 验证显示4个维度的分析结果');
  
  // 10. 常见问题和解决方案
  console.log('\n━━━ 🔟 常见问题 ━━━');
  console.log('\n❌ "Server misconfigured: missing SUPABASE_SERVICE_ROLE_KEY"');
  console.log('   → 需要添加环境变量到Vercel');
  console.log('\n❌ "Failed to download file from storage"');
  console.log('   → 检查文件是否存在于Storage');
  console.log('   → 检查文件路径是否正确');
  console.log('\n❌ "OpenAI API key is invalid"');
  console.log('   → 检查OPENAI_API_KEY环境变量');
  console.log('   → 在OpenAI平台验证key有效性');
  console.log('\n❌ "No text could be extracted"');
  console.log('   → PDF可能是扫描版（纯图片）');
  console.log('   → PDF可能加密或受保护');
  console.log('   → 尝试其他PDF文件');
  
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('✅ 诊断完成！');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('\n📋 请复制以上所有输出给开发者进行分析');
  console.log('🔗 相关文档:');
  console.log('   • BP-OCR-ALTERNATIVE-SOLUTION.md - 服务器端下载方案');
  console.log('   • BP-OCR-FIX-SUMMARY.md - OCR修复总结');
  console.log('   • FIX-BP-STORAGE-ACCESS.md - Storage访问修复');
  console.log('   • BP-STORAGE-POLICIES-PURE-SQL.md - Storage policies配置');
};

// 运行诊断
fullDiagnostic().catch(err => {
  console.error('💥 诊断脚本执行失败:', err);
});
```

---

## 📊 输出说明

### 成功的输出应该包含：

✅ **用户登录状态**: 已登录  
✅ **bucket存在**: bp-documents存在  
✅ **BP提交**: 找到最近的提交  
✅ **文件存在**: 文件在Storage中  
✅ **签名URL**: 可创建且可访问（如果是公开bucket）  

### 如果有错误：

❌ **RLS权限错误** (code: 42501)  
   → 运行 `SETUP-ALL-RLS-POLICIES-FIXED.sql`

❌ **bucket不存在**  
   → 在Supabase Dashboard创建bucket

❌ **文件不存在**  
   → 重新上传文件

❌ **URL不可访问**  
   → 使用服务器端下载方案（已实施）

---

## 🚀 下一步

### 如果诊断显示一切正常但仍然失败：

1. **检查Vercel环境变量**：
   - Vercel Dashboard → Settings → Environment Variables
   - 确保有 `SUPABASE_SERVICE_ROLE_KEY`

2. **查看Vercel函数日志**：
   - Vercel Dashboard → Deployments → [最新部署] → Functions
   - 查找 `api/ocr-extract` 的日志
   - 看具体的错误消息

3. **测试新上传**：
   - 上传一个新的PDF文件
   - 使用简单的、文本清晰的PDF
   - 文件大小 < 10MB

---

## 💡 提示

- 诊断脚本需要在**应用页面**运行（不是Supabase Dashboard）
- 确保**已登录**再运行脚本
- 如果有多个BP提交，脚本只检查最新的一个
- 服务器端下载模式不依赖签名URL，更可靠
- 完整的日志输出对于问题诊断非常重要

---

**创建时间**: 2025-10-12  
**版本**: 2.0 (服务器端下载模式)

