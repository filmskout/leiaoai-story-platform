# BP分析 - 快速测试脚本

## 🚀 最简单的测试方法

### 步骤1: 在Console中运行

打开 https://leiaoai-story-platform.vercel.app/bp-analysis

按 F12，在Console中粘贴：

```javascript
// 测试OCR API是否可访问
fetch('/api/ocr-extract', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    filePath: 'test-path/test-file.pdf'
  })
})
.then(res => {
  console.log('API状态码:', res.status);
  return res.json();
})
.then(data => {
  console.log('API响应:', data);
})
.catch(err => {
  console.error('API错误:', err);
});
```

---

## 📊 期望的响应

### 如果配置正确，你会看到以下之一：

#### ✅ 情况1: 环境变量正确，但文件不存在
```javascript
API状态码: 500
API响应: {
  error: "Failed to download file from storage",
  details: "Object not found"
}
```
**这是好的！** 说明：
- ✅ SUPABASE_URL 已配置
- ✅ SUPABASE_SECRET_KEY 已配置
- ✅ 后端可以连接Supabase
- ℹ️ 只是测试文件路径不存在（正常）

#### ❌ 情况2: 缺少 SUPABASE_URL
```javascript
API状态码: 500
API响应: {
  error: "Server misconfigured: missing SUPABASE_URL"
}
```
**需要修复：** 在Vercel添加 `SUPABASE_URL`

#### ❌ 情况3: 缺少 SUPABASE_SECRET_KEY
```javascript
API状态码: 500
API响应: {
  error: "Server misconfigured: missing SUPABASE_SECRET_KEY. Please add this to Vercel environment variables."
}
```
**需要修复：** 在Vercel添加 `SUPABASE_SECRET_KEY`

---

## 🔍 如果还是显示 "Invalid request to OpenAI API"

说明问题在OpenAI调用阶段，可能原因：

1. **PDF Base64太大（> 20MB）**
   - 解决: 使用更小的PDF

2. **OpenAI不支持该PDF格式**
   - 解决: 尝试不同的PDF

3. **OpenAI API Key问题**
   - 解决: 检查 `OPENAI_API_KEY`

---

## 🎯 请告诉我

运行上面的快速测试后，告诉我：

1. **API状态码** 是多少？
2. **API响应** 的完整内容是什么？
3. 你看到的是上面的哪种情况？

这样我就能立即知道问题所在！🔍

