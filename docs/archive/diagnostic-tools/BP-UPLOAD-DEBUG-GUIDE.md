# BP上传失败调试指南

## 🎯 目标
快速定位BP文档上传失败的原因并解决

---

## 📋 第一步：获取详细错误信息

### 1. 打开浏览器开发者工具
- 按 `F12` 或 `Ctrl+Shift+I` (Windows/Linux)
- 按 `Cmd+Option+I` (Mac)

### 2. 切换到 Console 标签
- 点击 "Console" 标签
- 清空之前的日志（点击 🚫 清空按钮）

### 3. 尝试上传文件
- 选择一个PDF或DOCX文件（< 10MB）
- 点击上传

### 4. 查看Console输出
复制所有包含以下标记的日志：
- 🔵 BP Upload: ...
- 🔴 BP Upload: ...
- 🟢 BP Upload: ...

---

## 🔍 常见错误诊断流程

### 错误类型 1: Storage Policies 未配置

**症状：**
```
🔴 BP Upload: Storage error
message: "new row violates row-level security policy"
或
message: "permission denied for bucket"
或
message: "JWT expired" / "Unauthorized"
```

**屏幕显示：**
```
权限错误：Storage policies未正确配置。请检查Supabase Storage policies。
```

**解决方案：**
1. 打开 Supabase Dashboard
2. 进入 Storage → bp-documents → Policies
3. 检查是否有4个policies（如果没有或缺失，需要添加）
4. 参考文件：`BP-STORAGE-POLICIES-PURE-SQL.md`
5. 逐个添加4个policies：
   - ✅ Users can upload BP files to their folder (INSERT)
   - ✅ Users can view their own BP files (SELECT)
   - ✅ Users can update their own BP files (UPDATE)
   - ✅ Users can delete their own BP files (DELETE)

---

### 错误类型 2: 数据库RLS未配置

**症状：**
```
🟢 BP Upload: File uploaded to Storage (文件上传成功)
🔵 BP Upload: Saving to database...
🔴 BP Upload: Database error
code: "42501"
message: "new row violates row-level security policy for table \"bp_submissions\""
```

**屏幕显示：**
```
数据库RLS权限错误：请运行 SETUP-ALL-RLS-POLICIES-FIXED.sql
```

**解决方案：**
1. 打开 Supabase Dashboard → SQL Editor
2. 打开项目文件：`SETUP-ALL-RLS-POLICIES-FIXED.sql`
3. 复制全部内容
4. 粘贴到 SQL Editor
5. 点击 Run
6. 等待 "Success. No rows returned" 消息

---

### 错误类型 3: Bucket 不存在

**症状：**
```
🔴 BP Upload: Storage error
message: "Bucket not found"
```

**屏幕显示：**
```
存储桶不存在。请联系技术支持。
```

**解决方案：**
1. 打开 Supabase Dashboard → Storage
2. 点击 "New bucket"
3. 输入名称：`bp-documents`
4. Public bucket: ❌ **不勾选** (必须是私有的)
5. 点击 "Create bucket"
6. 然后按照 "错误类型 1" 添加 Storage policies

---

### 错误类型 4: 用户未登录

**症状：**
```
console 中没有任何 BP Upload 日志
```

**屏幕显示：**
```
Please log in to upload your BP
```

**解决方案：**
1. 点击右上角登录按钮
2. 使用邮箱/密码登录
3. 或注册新账号
4. 登录成功后重新上传

---

### 错误类型 5: 文件太大或格式不对

**症状（文件太大）：**
```
🔴 BP Upload: Storage error
message: "Payload too large"
```

**屏幕显示：**
```
文件太大。最大支持50MB。
```

**解决方案：**
- 压缩PDF文件
- 或将PDF分割成多个小文件

**症状（格式不对）：**
屏幕显示：
```
Invalid file format. Only PDF and DOCX are supported.
```

**解决方案：**
- 只上传 `.pdf` 或 `.docx` 文件
- 如果是图片，先转换成PDF

---

## 🧪 完整诊断脚本

在浏览器 Console (F12) 中运行以下脚本，获取完整的诊断信息：

```javascript
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('🔍 BP上传完整诊断');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

// 1. 检查Supabase客户端
if (typeof supabase === 'undefined') {
  console.error('❌ 问题: Supabase客户端未加载');
} else {
  console.log('✅ Supabase客户端已加载');
}

// 2. 检查登录状态
try {
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError) {
    console.error('❌ 获取用户失败:', userError.message);
  } else if (!user) {
    console.error('❌ 问题: 用户未登录！');
    console.log('   → 解决: 点击右上角登录');
  } else {
    console.log('✅ 用户已登录');
    console.log('   User ID:', user.id);
    console.log('   Email:', user.email);
  }
} catch (e) {
  console.error('❌ 检查登录状态失败:', e.message);
}

// 3. 检查 bp-documents bucket
try {
  const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
  if (bucketsError) {
    console.error('❌ 获取buckets失败:', bucketsError.message);
  } else {
    const bpBucket = buckets.find(b => b.name === 'bp-documents');
    if (!bpBucket) {
      console.error('❌ 问题: bp-documents bucket 不存在！');
      console.log('   → 解决: Storage → New bucket → 名称: bp-documents (私有)');
    } else {
      console.log('✅ bp-documents bucket 存在');
      console.log('   Bucket ID:', bpBucket.id);
      console.log('   Public:', bpBucket.public ? '是 (应该改为私有)' : '否 ✓');
    }
  }
} catch (e) {
  console.error('❌ 检查bucket失败:', e.message);
}

// 4. 检查Storage权限（尝试list）
try {
  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    const { data, error } = await supabase.storage
      .from('bp-documents')
      .list(user.id, { limit: 1 });
    
    if (error) {
      if (error.message.includes('not found')) {
        console.error('❌ 问题: bp-documents bucket 不存在');
      } else if (error.message.includes('policy') || error.message.includes('JWT')) {
        console.error('❌ 问题: Storage policies 未配置或不正确');
        console.log('   → 解决: 参考 BP-STORAGE-POLICIES-PURE-SQL.md');
      } else {
        console.error('❌ Storage访问错误:', error.message);
      }
    } else {
      console.log('✅ Storage可访问（SELECT policy正确）');
      console.log('   当前文件数:', data?.length || 0);
    }
  }
} catch (e) {
  console.error('❌ 检查Storage权限失败:', e.message);
}

// 5. 检查数据库表RLS
try {
  const { count, error } = await supabase
    .from('bp_submissions')
    .select('*', { count: 'exact', head: true });
  
  if (error) {
    if (error.code === '42501') {
      console.error('❌ 问题: bp_submissions 表 RLS未配置');
      console.log('   → 解决: 运行 SETUP-ALL-RLS-POLICIES-FIXED.sql');
    } else if (error.code === '42P01') {
      console.error('❌ 问题: bp_submissions 表不存在');
      console.log('   → 解决: 运行数据库迁移脚本');
    } else {
      console.error('❌ 数据库访问错误:', error.message, '(code:', error.code, ')');
    }
  } else {
    console.log('✅ bp_submissions 表可访问（RLS正确）');
    console.log('   当前记录数:', count);
  }
} catch (e) {
  console.error('❌ 检查数据库RLS失败:', e.message);
}

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('✅ 诊断完成！');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('📋 把以上所有输出复制给开发者进行诊断');
```

---

## 📝 报告问题时请提供

1. **完整的Console日志**（包括所有 🔵 🔴 🟢 标记的消息）
2. **完整的诊断脚本输出**
3. **屏幕上显示的错误消息**
4. **文件信息**：
   - 文件类型（PDF 或 DOCX）
   - 文件大小
5. **Supabase Dashboard截图**：
   - Storage → bp-documents → Policies 页面
   - SQL Editor → 表 → bp_submissions → Policies 页面

---

## ✅ 验证修复

修复后，重新上传文件，应该看到：

```
🔵 BP Upload: Starting upload to Storage
🔵 BP Upload: Uploading to path: xxxxx/1234567890_filename.pdf
🟢 BP Upload: File uploaded to Storage
🔵 BP Upload: Public URL generated
🔵 BP Upload: Saving to database...
🟢 BP Upload: Success!
```

此时：
- 屏幕显示文件信息
- 出现橙色 "Analyze BP" 按钮
- 没有错误消息

---

## 🚀 快速修复检查清单

- [ ] 1. 用户已登录（右上角显示用户信息）
- [ ] 2. bp-documents bucket 存在且为私有
- [ ] 3. bp-documents bucket 有4个Storage policies
- [ ] 4. bp_submissions 表 RLS policies 已配置（运行了 SETUP-ALL-RLS-POLICIES-FIXED.sql）
- [ ] 5. 文件格式正确（PDF 或 DOCX）
- [ ] 6. 文件大小 < 50MB

全部打勾 = 应该可以正常上传了！

