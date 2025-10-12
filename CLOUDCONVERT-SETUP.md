# CloudConvert API 配置指南

## 🎯 概述

为了支持PDF文件的自动转换，我们使用CloudConvert API。这是一个可选功能，如果不配置，用户需要手动转换PDF为DOCX。

---

## 📝 获取CloudConvert API Key

### 步骤1: 注册CloudConvert账号

1. 访问: https://cloudconvert.com/
2. 点击右上角 "Sign Up"
3. 注册免费账号

### 步骤2: 获取API Key

1. 登录后，访问: https://cloudconvert.com/dashboard/api/v2/keys
2. 点击 "Create New API Key"
3. 填写以下信息：
   - Name: `leoai-production`
   - Scopes: 选择 `task.read` 和 `task.write`
4. 点击 "Create"
5. **重要**: 立即复制API Key（只显示一次）
   - 格式类似: `eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9...`

---

## 🎁 免费额度

CloudConvert免费账号提供：
- **25分钟转换时间/天** 或 **500次转换/月**
- 对于大多数用户来说足够了

如果需要更多：
- **$9/月**: 500分钟转换时间
- 或按使用量付费: $0.008/分钟

---

## 📦 在Vercel配置

### 步骤1: 添加环境变量

1. 打开 **Vercel Dashboard**
2. 选择你的项目
3. 进入 **Settings** → **Environment Variables**
4. 点击 **"Add New"**
5. 填写：
   ```
   Name:  CLOUDCONVERT_API_KEY
   Value: [粘贴你的CloudConvert API Key]
   Environment: ✅ Production ✅ Preview ✅ Development
   ```
6. 点击 **"Save"**

### 步骤2: 重新部署

1. Vercel会自动重新部署
2. 或手动触发: Deployments → Redeploy
3. 等待2-3分钟

---

## 🧪 测试

### 启用后（已配置API Key）

1. 上传PDF文件
2. 系统会自动尝试转换为DOCX
3. 提取文本并进行分析
4. Console会显示：
   ```
   🔵 PDF detected: Attempting auto-conversion to DOCX...
   🔵 PDF to DOCX: Starting conversion
   ✅ CloudConvert job created
   ✅ PDF uploaded to CloudConvert
   🔵 Waiting for conversion...
   ✅ Conversion completed
   ✅ PDF converted to DOCX, downloading...
   🔵 Extracting text from converted DOCX...
   ✅ Text extracted from converted DOCX
   ```

### 未启用（没有API Key）

1. 上传PDF文件
2. 系统会返回友好提示：
   ```
   PDF文件需要转换
   
   自动PDF转换服务未配置。
   
   请选择以下任一方式：
   1. 将PDF转换为Word文档（.docx）后上传
   2. 复制PDF中的文本内容，直接粘贴
   
   在线转换工具: https://www.ilovepdf.com/pdf_to_word
   ```
3. 用户可以手动转换并重新上传

---

## 🔄 工作流程

### 已配置CloudConvert:

```
PDF上传 → 自动转换为DOCX → 提取文本 → 分析 → 显示结果
```

### 未配置CloudConvert:

```
PDF上传 → 提示用户手动转换 → 用户上传DOCX → 提取文本 → 分析 → 显示结果
```

---

## 💡 是否需要配置？

### 推荐配置，如果：
- ✅ 你的用户主要上传PDF
- ✅ 你想提供更好的用户体验
- ✅ 你的用户量不大（免费额度够用）

### 可以不配置，如果：
- ✅ 用户可以手动转换（大多数用户有Word）
- ✅ 想节省成本
- ✅ 用户主要使用DOCX格式

---

## 🔍 监控使用量

1. 登录CloudConvert: https://cloudconvert.com/dashboard
2. 查看 "Usage" 标签
3. 查看每日/每月转换次数和时间
4. 如果接近限额，考虑升级计划

---

## ⚠️ 限制和注意事项

1. **文件大小限制**
   - 免费账号: 最大1GB/文件
   - 我们限制: 50MB/文件

2. **转换时间**
   - 通常: 5-15秒/文件
   - 复杂PDF可能需要更长

3. **并发限制**
   - 免费账号: 1个并发任务
   - 付费账号: 更多并发

4. **失败处理**
   - 如果转换失败，自动回退到手动提示
   - 不会导致系统崩溃

---

## 🆘 故障排除

### 问题: "CloudConvert API调用失败"

**解决**:
1. 检查API Key是否正确
2. 检查CloudConvert账号是否有足够额度
3. 访问CloudConvert Dashboard查看错误日志

### 问题: "转换超时"

**解决**:
1. PDF文件可能太大或太复杂
2. 建议用户手动转换
3. 或升级CloudConvert计划

### 问题: "Converted DOCX contains no text"

**解决**:
1. PDF可能是纯图片（扫描版）
2. 需要OCR功能（CloudConvert付费功能）
3. 建议用户使用带文本的PDF

---

## 📊 成本估算

### 假设场景：

- **每天10个PDF分析请求**
- **平均转换时间: 10秒/文件**
- **每月**: 10 × 30 = 300次转换
- **总时间**: 300 × 10秒 = 3000秒 ≈ 50分钟

**结论**: 免费额度（500次/月）完全够用！

---

## ✅ 配置完成检查清单

- [ ] 已注册CloudConvert账号
- [ ] 已创建API Key
- [ ] 已添加 `CLOUDCONVERT_API_KEY` 到Vercel
- [ ] Vercel已重新部署
- [ ] 已测试PDF上传（看到自动转换）
- [ ] 已查看CloudConvert usage（确认计费正常）

全部完成 = PDF自动转换功能启用！🎉

---

**注意**: 这是一个可选功能。即使不配置，用户也可以手动转换PDF为DOCX并上传。

