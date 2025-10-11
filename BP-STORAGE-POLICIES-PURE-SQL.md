# BP Storage Policies - 纯SQL表达式（无markdown）

## ⚠️ 重要：不要复制 ```sql ``` 这些标记！

只复制SQL表达式本身！

---

## 📍 位置
Supabase Dashboard → Storage → bp-documents → Policies

---

## Policy 1: INSERT (上传权限)

### 在Dashboard中填写：

**Policy Name:**
```
Users can upload BP files to their folder
```

**Allowed operation:**
- ✅ 勾选 INSERT

**Policy definition (USING expression):**
```
(bucket_id = 'bp-documents'::text) AND ((storage.foldername(name))[1] = auth.uid()::text)
```

**Policy definition (WITH CHECK expression):**
```
(bucket_id = 'bp-documents'::text) AND ((storage.foldername(name))[1] = auth.uid()::text)
```

**Target roles:**
- ✅ authenticated

---

## Policy 2: SELECT (查看权限)

**Policy Name:**
```
Users can view their own BP files
```

**Allowed operation:**
- ✅ 勾选 SELECT

**Policy definition (USING expression):**
```
(bucket_id = 'bp-documents'::text) AND ((storage.foldername(name))[1] = auth.uid()::text)
```

**Policy definition (WITH CHECK expression):**
```
留空（不填写任何内容）
```

**Target roles:**
- ✅ authenticated

---

## Policy 3: UPDATE (更新权限)

**Policy Name:**
```
Users can update their own BP files
```

**Allowed operation:**
- ✅ 勾选 UPDATE

**Policy definition (USING expression):**
```
(bucket_id = 'bp-documents'::text) AND ((storage.foldername(name))[1] = auth.uid()::text)
```

**Policy definition (WITH CHECK expression):**
```
(bucket_id = 'bp-documents'::text) AND ((storage.foldername(name))[1] = auth.uid()::text)
```

**Target roles:**
- ✅ authenticated

---

## Policy 4: DELETE (删除权限)

**Policy Name:**
```
Users can delete their own BP files
```

**Allowed operation:**
- ✅ 勾选 DELETE

**Policy definition (USING expression):**
```
(bucket_id = 'bp-documents'::text) AND ((storage.foldername(name))[1] = auth.uid()::text)
```

**Policy definition (WITH CHECK expression):**
```
留空（不填写任何内容）
```

**Target roles:**
- ✅ authenticated

---

## 📝 关键要点

### ✅ USING expression
所有4个policies都使用相同的表达式：
```
(bucket_id = 'bp-documents'::text) AND ((storage.foldername(name))[1] = auth.uid()::text)
```

### ✅ WITH CHECK expression
- **INSERT**: 需要填写（和USING一样）
- **SELECT**: 留空
- **UPDATE**: 需要填写（和USING一样）
- **DELETE**: 留空

### ❌ 常见错误

**错误1: 复制了markdown标记**
```
❌ ```sql (bucket_id = 'bp-documents'::text) ```
✅ (bucket_id = 'bp-documents'::text) AND ((storage.foldername(name))[1] = auth.uid()::text)
```

**错误2: 多余的括号**
```
❌ ((bucket_id = 'bp-documents'::text) AND ...)
✅ (bucket_id = 'bp-documents'::text) AND ...
```

**错误3: WITH CHECK不应该有的地方填了**
```
❌ SELECT的WITH CHECK填了内容
✅ SELECT的WITH CHECK留空
```

---

## 🎯 操作步骤

### 对于每个Policy：

1. 点击 **New Policy**
2. 选择 **For full customization**
3. 填写 **Policy Name**（从上面复制）
4. 勾选 **Allowed operation**（只勾一个）
5. 填写 **USING expression**（从上面复制，注意不要复制markdown标记）
6. 填写 **WITH CHECK expression**（从上面复制，或留空）
7. 勾选 **Target roles** → authenticated
8. 点击 **Save policy**

---

## 📋 快速复制清单

### Policy 1 (INSERT):
- Name: `Users can upload BP files to their folder`
- Operation: INSERT ✅
- USING: `(bucket_id = 'bp-documents'::text) AND ((storage.foldername(name))[1] = auth.uid()::text)`
- WITH CHECK: `(bucket_id = 'bp-documents'::text) AND ((storage.foldername(name))[1] = auth.uid()::text)`
- Role: authenticated ✅

### Policy 2 (SELECT):
- Name: `Users can view their own BP files`
- Operation: SELECT ✅
- USING: `(bucket_id = 'bp-documents'::text) AND ((storage.foldername(name))[1] = auth.uid()::text)`
- WITH CHECK: 留空
- Role: authenticated ✅

### Policy 3 (UPDATE):
- Name: `Users can update their own BP files`
- Operation: UPDATE ✅
- USING: `(bucket_id = 'bp-documents'::text) AND ((storage.foldername(name))[1] = auth.uid()::text)`
- WITH CHECK: `(bucket_id = 'bp-documents'::text) AND ((storage.foldername(name))[1] = auth.uid()::text)`
- Role: authenticated ✅

### Policy 4 (DELETE):
- Name: `Users can delete their own BP files`
- Operation: DELETE ✅
- USING: `(bucket_id = 'bp-documents'::text) AND ((storage.foldername(name))[1] = auth.uid()::text)`
- WITH CHECK: 留空
- Role: authenticated ✅

---

## 💡 理解 USING vs WITH CHECK

### USING expression
- **用于：** 确定用户能否"看到"或"访问"这个资源
- **时机：** 读取（SELECT）和修改前的权限检查（UPDATE/DELETE）
- **所有操作都需要**

### WITH CHECK expression
- **用于：** 确定用户能否"创建"或"修改后"的数据
- **时机：** 插入（INSERT）和修改后的验证（UPDATE）
- **只有INSERT和UPDATE需要**

### 为什么有些不需要WITH CHECK？
- **SELECT**: 只读取，不创建/修改数据，不需要
- **DELETE**: 只删除，不创建/修改数据，不需要
- **INSERT**: 创建新数据，需要验证
- **UPDATE**: 修改数据，需要验证修改后的数据

---

## 🧪 测试

完成4个policies后：
1. 登录应用
2. 访问 BP Analysis
3. 上传PDF文件
4. 应该成功 ✅

