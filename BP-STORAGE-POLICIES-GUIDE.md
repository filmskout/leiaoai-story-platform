# BP Storage Policies 设置指南

## ⚠️ 重要提示

Storage policies **不能通过SQL创建**，必须在Supabase Dashboard中手动设置。

---

## 📋 步骤 1: 运行SQL修复表的RLS

在Supabase Dashboard → SQL Editor:

```sql
-- 复制并运行 FIX-BP-RLS-SIMPLE.sql 的内容
```

这会修复 `bp_submissions` 表的RLS policies。

---

## 📋 步骤 2: 手动设置Storage Policies

### 2.1 进入Storage设置

1. 打开 Supabase Dashboard
2. 点击左侧菜单 **Storage**
3. 找到 **bp-documents** bucket
4. 点击 **bp-documents**
5. 点击顶部的 **Policies** 标签

---

### 2.2 创建 INSERT Policy（上传权限）

点击 **New Policy** → **For full customization** → 填写:

**Policy Name:**
```
Users can upload BP files to their folder
```

**Allowed operation:**
- ✅ INSERT

**Policy definition - USING expression:**
```sql
(bucket_id = 'bp-documents'::text) 
AND 
((storage.foldername(name))[1] = auth.uid()::text)
```

**Policy definition - WITH CHECK expression:**
```sql
(bucket_id = 'bp-documents'::text) 
AND 
((storage.foldername(name))[1] = auth.uid()::text)
```

**Target roles:**
- ✅ authenticated

点击 **Save policy**

---

### 2.3 创建 SELECT Policy（查看权限）

点击 **New Policy** → **For full customization** → 填写:

**Policy Name:**
```
Users can view their own BP files
```

**Allowed operation:**
- ✅ SELECT

**Policy definition - USING expression:**
```sql
(bucket_id = 'bp-documents'::text) 
AND 
((storage.foldername(name))[1] = auth.uid()::text)
```

**Target roles:**
- ✅ authenticated

点击 **Save policy**

---

### 2.4 创建 UPDATE Policy（更新权限）

点击 **New Policy** → **For full customization** → 填写:

**Policy Name:**
```
Users can update their own BP files
```

**Allowed operation:**
- ✅ UPDATE

**Policy definition - USING expression:**
```sql
(bucket_id = 'bp-documents'::text) 
AND 
((storage.foldername(name))[1] = auth.uid()::text)
```

**Policy definition - WITH CHECK expression:**
```sql
(bucket_id = 'bp-documents'::text) 
AND 
((storage.foldername(name))[1] = auth.uid()::text)
```

**Target roles:**
- ✅ authenticated

点击 **Save policy**

---

### 2.5 创建 DELETE Policy（删除权限）

点击 **New Policy** → **For full customization** → 填写:

**Policy Name:**
```
Users can delete their own BP files
```

**Allowed operation:**
- ✅ DELETE

**Policy definition - USING expression:**
```sql
(bucket_id = 'bp-documents'::text) 
AND 
((storage.foldername(name))[1] = auth.uid()::text)
```

**Target roles:**
- ✅ authenticated

点击 **Save policy**

---

## ✅ 验证设置

完成后，你应该在 **bp-documents → Policies** 看到 4 个policies:

1. ✅ Users can upload BP files to their folder (INSERT)
2. ✅ Users can view their own BP files (SELECT)
3. ✅ Users can update their own BP files (UPDATE)
4. ✅ Users can delete their own BP files (DELETE)

---

## 🧪 测试BP上传

1. 登录到应用
2. 访问 BP Analysis 页面
3. 上传一个PDF或DOCX文件
4. 验证上传成功
5. 查看 Dashboard → Submissions → BP Documents
6. 验证文件出现在列表中

---

## 🐛 如果仍然出错

### 错误: "new row violates row-level security policy"

**原因:** 表的RLS policies不正确

**解决:** 重新运行 `FIX-BP-RLS-SIMPLE.sql`

---

### 错误: "permission denied for bucket"

**原因:** Storage policies不正确

**解决:** 检查以下几点:
1. Bucket `bp-documents` 存在吗？
2. 所有4个Storage policies都创建了吗？
3. Policy表达式是否正确复制？
4. 文件路径格式: `{user_id}/{timestamp}_{filename}`

---

### 错误: "bucket not found"

**原因:** `bp-documents` bucket 不存在

**解决:**
1. Storage → Create a new bucket
2. Name: `bp-documents`
3. Public: ❌ (不要设为public)
4. File size limit: 52428800 (50MB)
5. Allowed MIME types: `application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document`

---

## 📖 理解Storage Policy表达式

```sql
((storage.foldername(name))[1] = auth.uid()::text)
```

**解释:**
- `storage.foldername(name)` - 获取文件路径中的文件夹名称数组
- `[1]` - 取第一个文件夹（用户ID）
- `auth.uid()::text` - 当前登录用户的ID
- `=` - 确保只能访问自己文件夹下的文件

**示例文件路径:**
```
{user-uuid}/1234567890_business-plan.pdf
     ↑                    ↑
   用户ID文件夹          文件名
```

用户只能访问路径以自己的UUID开头的文件。

---

## 🎯 重要提示

### Storage Policy 和 Table Policy 的区别

1. **Table Policy (bp_submissions)**
   - 控制数据库表的访问
   - 使用SQL创建
   - 在 SQL Editor 中运行

2. **Storage Policy (bp-documents)**
   - 控制Storage bucket的访问
   - 必须在Dashboard手动创建
   - 在 Storage → Policies 中设置

### 为什么需要两个？

- **Table Policy:** 控制BP提交记录（元数据：文件名、URL、状态等）
- **Storage Policy:** 控制实际的文件上传/下载/删除

**两者必须都正确设置，BP上传才能正常工作！**

---

## 📞 完成后

设置完成后告诉我:

✅ SQL部分运行成功？  
✅ 4个Storage policies都创建了？  
✅ BP上传测试成功？  

或者报告任何错误信息！🐛

