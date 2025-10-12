# BP Storage Policies - 复制粘贴版本

## 📍 位置
Supabase Dashboard → Storage → bp-documents → Policies

---

## Policy 1️⃣: INSERT (上传权限)

### 步骤：
1. 点击 **New Policy**
2. 选择 **For full customization**
3. 复制粘贴以下内容：

**Policy Name:**
```
Users can upload BP files to their folder
```

**Allowed operation:**
- ✅ 勾选 **INSERT**
- ❌ 不勾选其他

**Policy definition (USING expression):**
```sql
(bucket_id = 'bp-documents'::text) AND ((storage.foldername(name))[1] = auth.uid()::text)
```

**Policy definition (WITH CHECK expression):**
```sql
(bucket_id = 'bp-documents'::text) AND ((storage.foldername(name))[1] = auth.uid()::text)
```

**Target roles:**
- ✅ 勾选 **authenticated**
- ❌ 不勾选其他

4. 点击 **Save policy**

---

## Policy 2️⃣: SELECT (查看权限)

### 步骤：
1. 点击 **New Policy**
2. 选择 **For full customization**
3. 复制粘贴以下内容：

**Policy Name:**
```
Users can view their own BP files
```

**Allowed operation:**
- ✅ 勾选 **SELECT**
- ❌ 不勾选其他

**Policy definition (USING expression):**
```sql
(bucket_id = 'bp-documents'::text) AND ((storage.foldername(name))[1] = auth.uid()::text)
```

**Policy definition (WITH CHECK expression):**
```
留空（SELECT不需要WITH CHECK）
```

**Target roles:**
- ✅ 勾选 **authenticated**
- ❌ 不勾选其他

4. 点击 **Save policy**

---

## Policy 3️⃣: UPDATE (更新权限)

### 步骤：
1. 点击 **New Policy**
2. 选择 **For full customization**
3. 复制粘贴以下内容：

**Policy Name:**
```
Users can update their own BP files
```

**Allowed operation:**
- ✅ 勾选 **UPDATE**
- ❌ 不勾选其他

**Policy definition (USING expression):**
```sql
(bucket_id = 'bp-documents'::text) AND ((storage.foldername(name))[1] = auth.uid()::text)
```

**Policy definition (WITH CHECK expression):**
```sql
(bucket_id = 'bp-documents'::text) AND ((storage.foldername(name))[1] = auth.uid()::text)
```

**Target roles:**
- ✅ 勾选 **authenticated**
- ❌ 不勾选其他

4. 点击 **Save policy**

---

## Policy 4️⃣: DELETE (删除权限)

### 步骤：
1. 点击 **New Policy**
2. 选择 **For full customization**
3. 复制粘贴以下内容：

**Policy Name:**
```
Users can delete their own BP files
```

**Allowed operation:**
- ✅ 勾选 **DELETE**
- ❌ 不勾选其他

**Policy definition (USING expression):**
```sql
(bucket_id = 'bp-documents'::text) AND ((storage.foldername(name))[1] = auth.uid()::text)
```

**Policy definition (WITH CHECK expression):**
```
留空（DELETE不需要WITH CHECK）
```

**Target roles:**
- ✅ 勾选 **authenticated**
- ❌ 不勾选其他

4. 点击 **Save policy**

---

## ✅ 完成验证

完成后，在 Storage → bp-documents → Policies 应该看到：

1. ✅ Users can upload BP files to their folder (INSERT)
2. ✅ Users can view their own BP files (SELECT)
3. ✅ Users can update their own BP files (UPDATE)
4. ✅ Users can delete their own BP files (DELETE)

---

## 📝 快速参考

### 所有policies使用相同的USING表达式：
```sql
(bucket_id = 'bp-documents'::text) AND ((storage.foldername(name))[1] = auth.uid()::text)
```

### 需要WITH CHECK的操作：
- INSERT: ✅ 需要
- SELECT: ❌ 不需要
- UPDATE: ✅ 需要
- DELETE: ❌ 不需要

### 所有policies的Target roles：
- ✅ authenticated
- ❌ anon（BP上传只允许登录用户）

---

## 🧪 测试

完成后测试BP上传：
1. 登录到应用
2. 访问 BP Analysis 页面
3. 上传PDF或DOCX文件
4. 应该成功上传
5. 在Dashboard → Submissions → BP Documents 查看

---

## 🐛 如果还有错误

### 错误："new row violates row-level security policy"
- 原因：数据库表的RLS policies不正确
- 解决：运行 `SETUP-ALL-RLS-POLICIES.sql`

### 错误："permission denied for bucket"
- 原因：Storage policies不正确
- 解决：重新检查上面4个policies的配置

### 错误："bucket not found"
- 原因：bp-documents bucket不存在
- 解决：Storage → Create bucket → Name: `bp-documents`

---

## ✨ 提示

- 可以先创建所有4个policies，再测试
- 每个policy的SQL表达式都一样（只是操作类型不同）
- 记得勾选 **authenticated** role
- Policy Name可以自定义，但建议使用上面的名称便于识别

