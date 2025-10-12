# 验证BP Storage Policies设置

## 🎯 方法1: 在Supabase Dashboard检查（推荐）

### 步骤：

1. **打开** Supabase Dashboard
2. **进入** Storage → bp-documents → Policies
3. **检查** 应该看到4个policies

### ✅ 正确的配置应该是：

```
✅ Users can upload BP files to their folder (INSERT)
✅ Users can view their own BP files (SELECT)
✅ Users can update their own BP files (UPDATE)
✅ Users can delete their own BP files (DELETE)
```

### 📋 检查每个Policy的详细配置：

点击每个policy查看详情，确认：

**Policy 1: INSERT**
- Policy definition: `(bucket_id = 'bp-documents'::text) AND ((storage.foldername(name))[1] = auth.uid()::text)`
- With check: `(bucket_id = 'bp-documents'::text) AND ((storage.foldername(name))[1] = auth.uid()::text)`
- Target roles: authenticated ✅

**Policy 2: SELECT**
- Policy definition: `(bucket_id = 'bp-documents'::text) AND ((storage.foldername(name))[1] = auth.uid()::text)`
- With check: (空)
- Target roles: authenticated ✅

**Policy 3: UPDATE**
- Policy definition: `(bucket_id = 'bp-documents'::text) AND ((storage.foldername(name))[1] = auth.uid()::text)`
- With check: `(bucket_id = 'bp-documents'::text) AND ((storage.foldername(name))[1] = auth.uid()::text)`
- Target roles: authenticated ✅

**Policy 4: DELETE**
- Policy definition: `(bucket_id = 'bp-documents'::text) AND ((storage.foldername(name))[1] = auth.uid()::text)`
- With check: (空)
- Target roles: authenticated ✅

---

## 🎯 方法2: SQL查询检查

在Supabase SQL Editor中运行：

```sql
-- 检查bp-documents bucket是否存在
SELECT 
  id,
  name,
  public as is_public,
  file_size_limit / 1024 / 1024 as size_limit_mb,
  created_at
FROM storage.buckets
WHERE name = 'bp-documents';
```

**期望结果:**
- name: `bp-documents`
- is_public: `false`
- size_limit_mb: 应该显示一个数字（如50MB）

---

## 🎯 方法3: 实际测试（最可靠）

### 测试步骤：

1. **登录应用**
   - 访问你的应用
   - 使用测试账号登录
   - 确保右上角显示用户头像

2. **访问BP Analysis页面**
   - 点击导航菜单中的 "BP Analysis"
   - 或直接访问: `https://your-app-url.vercel.app/bp-analysis`

3. **准备测试文件**
   - 准备一个小的PDF文件（< 10MB）
   - 或准备一个DOCX文件

4. **测试上传**
   - 拖放文件到上传区域
   - 或点击上传按钮选择文件

5. **观察结果**
   
   **✅ 成功的表现:**
   - 文件上传进度显示
   - 显示 "上传成功" 或类似消息
   - 没有错误提示

   **❌ 失败的表现:**
   - 显示 "Upload failed" 错误
   - 显示 "Permission denied" 错误
   - 显示 "Bucket not found" 错误

6. **验证Dashboard**
   - 访问 Dashboard → Submissions → BP Documents
   - 检查上传的文件是否显示
   - 尝试下载文件
   - 尝试删除文件

---

## 🐛 常见问题诊断

### 错误1: "new row violates row-level security policy"

**原因:** 数据库表的RLS policies有问题

**检查:**
```sql
-- 在SQL Editor运行
SELECT 
  tablename,
  CASE WHEN rowsecurity THEN '✅' ELSE '❌' END as rls_enabled
FROM pg_tables
WHERE schemaname = 'public' AND tablename = 'bp_submissions';
```

**解决:** 应该显示 ✅，如果显示 ❌，重新运行 `SETUP-ALL-RLS-POLICIES-FIXED.sql`

---

### 错误2: "permission denied for bucket"

**原因:** Storage policies不正确

**检查在Dashboard:**
1. Storage → bp-documents → Policies
2. 确认有4个policies
3. 点击每个policy检查配置

**可能的问题:**
- Policy expression拼写错误
- Target roles没有勾选 authenticated
- WITH CHECK在SELECT/DELETE中填了内容（应该留空）

---

### 错误3: "bucket not found"

**原因:** bp-documents bucket不存在

**解决:**
1. Storage → Create a new bucket
2. Name: `bp-documents`
3. Public: ❌ (不要设为public)
4. File size limit: 52428800 (50MB)

---

### 错误4: 文件上传后Dashboard看不到

**原因:** 数据库insert成功，但文件URL不正确

**检查:**
```sql
-- 查看最近的BP提交记录
SELECT 
  id,
  file_name,
  file_url,
  created_at
FROM bp_submissions
ORDER BY created_at DESC
LIMIT 5;
```

**应该看到:**
- file_url 以 `https://` 开头
- file_url 包含你的Supabase project URL
- file_url 包含 `/storage/v1/object/public/bp-documents/`

---

## 📊 完整验证清单

在浏览器Console (F12 → Console) 运行以下测试：

```javascript
// 检查Supabase Storage是否可访问
const { data, error } = await supabase.storage.getBucket('bp-documents');
if (error) {
  console.error('❌ Bucket不存在或无权限:', error);
} else {
  console.log('✅ Bucket存在:', data);
}

// 检查当前用户
const { data: { user } } = await supabase.auth.getUser();
if (user) {
  console.log('✅ 用户已登录:', user.id);
} else {
  console.error('❌ 用户未登录');
}

// 测试上传权限（不实际上传）
const { data: policies, error: policyError } = await supabase
  .storage
  .from('bp-documents')
  .list();

if (policyError) {
  console.error('❌ Storage权限错误:', policyError);
} else {
  console.log('✅ Storage可访问');
}
```

---

## ✅ 成功的标志

如果一切正常，你应该能够：

1. ✅ 登录应用
2. ✅ 访问BP Analysis页面
3. ✅ 上传PDF/DOCX文件
4. ✅ 看到上传成功消息
5. ✅ 在Dashboard看到上传的文件
6. ✅ 下载文件
7. ✅ 删除文件

---

## 🚀 下一步

**如果测试成功:**
```
告诉我: "BP上传测试成功 ✅"
我会继续修复剩余的功能！
```

**如果测试失败:**
```
告诉我具体的错误信息:
- 错误提示文字
- 浏览器Console的错误（F12 → Console）
- 哪一步失败了
```

---

## 📝 快速测试命令

打开浏览器Console (F12)，复制粘贴运行：

```javascript
// 快速检查BP上传配置
console.log('🔍 开始检查BP上传配置...');

// 1. 检查登录状态
const { data: { user } } = await supabase.auth.getUser();
console.log('1. 登录状态:', user ? '✅ 已登录 (' + user.email + ')' : '❌ 未登录');

// 2. 检查bucket
try {
  const { data: bucket, error: bucketError } = await supabase.storage.getBucket('bp-documents');
  console.log('2. Bucket状态:', bucketError ? '❌ ' + bucketError.message : '✅ bp-documents存在');
} catch (e) {
  console.log('2. Bucket状态:', '❌ 检查失败', e);
}

// 3. 检查RLS
try {
  const { count, error: countError } = await supabase
    .from('bp_submissions')
    .select('*', { count: 'exact', head: true });
  console.log('3. 数据库RLS:', countError ? '❌ ' + countError.message : '✅ bp_submissions可访问');
} catch (e) {
  console.log('3. 数据库RLS:', '❌ 检查失败', e);
}

console.log('✅ 检查完成！');
```

---

现在去测试BP上传功能吧！🚀

