# Supabase Secret Key 设置指南

## 🎯 概述

Supabase的新API密钥系统使用 **Secret Key** 替代了旧的 `service_role_key`。这个指南帮助你获取并配置Secret Key。

---

## 🔑 获取 Supabase Secret Key

### 步骤 1: 打开 Supabase Dashboard

1. 访问: https://supabase.com/dashboard
2. 选择你的项目
3. 进入 **Settings** → **API**

### 步骤 2: 找到 Secret Key

在 API Settings 页面，你会看到：

#### **Project API keys** 部分：

```
┌─────────────────────────────────────────┐
│ Project URL                             │
│ https://xxx.supabase.co                 │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ API Keys                                │
│                                         │
│ anon public                             │
│ eyJhbGc... (这是前端使用的)              │
│                                         │
│ service_role secret                     │
│ eyJhbGc... (这是后端使用的) ⭐           │
└─────────────────────────────────────────┘
```

### 新的 API 密钥系统（如果你的项目已升级）：

```
┌─────────────────────────────────────────┐
│ API Keys (New System)                   │
│                                         │
│ default (publishable)                   │
│ sk_live_... (这是前端使用的)            │
│                                         │
│ default (secret)                        │
│ sk_secret_... (这是后端使用的) ⭐        │
└─────────────────────────────────────────┘
```

### 步骤 3: 复制 Secret Key

1. 找到标记为 **"secret"** 或 **"service_role"** 的密钥
2. 点击 **"Reveal"** 或 **"Copy"** 按钮
3. 完整复制密钥
   - 旧系统: 以 `eyJhbG` 开头
   - 新系统: 以 `sk_secret_` 开头

---

## 📦 添加到 Vercel

### 步骤 1: 打开 Vercel Dashboard

1. 访问: https://vercel.com/dashboard
2. 选择你的项目
3. 进入 **Settings** → **Environment Variables**

### 步骤 2: 添加新变量

点击 **"Add New"** 并填写：

```
Name:        SUPABASE_SECRET_KEY
Value:       [粘贴你刚才复制的Secret Key]
Environment: ✅ Production
             ✅ Preview (可选)
             ✅ Development (可选)
```

### 步骤 3: 保存并重新部署

1. 点击 **"Save"**
2. Vercel会提示需要重新部署
3. 点击 **"Redeploy"** 或等待自动部署
4. 部署完成后（2-3分钟），新的环境变量生效

---

## 🔍 验证配置

### 方法 1: 检查 Vercel 日志

1. Vercel Dashboard → Deployments
2. 点击最新的部署
3. 进入 **Functions** 标签
4. 找到 `api/ocr-extract`
5. 查看日志，应该看到：
   ```
   🔵 OCR: Using Supabase Secret Key authentication
   ```

### 方法 2: 测试 BP 上传

1. 上传一个测试PDF
2. 点击 "Analyze BP"
3. 如果成功，说明配置正确
4. 如果失败，查看错误消息

### 方法 3: 运行诊断脚本

参考 `BP-DIAGNOSTIC-SCRIPT.md` 运行完整诊断

---

## 📊 环境变量完整清单

### 必需的环境变量：

```bash
# Supabase 配置
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SECRET_KEY=eyJhbG... 或 sk_secret_...  # ← 新增

# 前端使用（通常在.env文件）
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbG... 或 sk_live_...

# OpenAI（必需）
OPENAI_API_KEY=sk-...

# 其他LLM（可选）
QWEN_API_KEY=sk-...
DEEPSEEK_API_KEY=sk-...
```

---

## 🆚 旧系统 vs 新系统对比

### 旧的 Service Role Key 系统

```
环境变量名: SUPABASE_SERVICE_ROLE_KEY
密钥格式:   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
在哪里找:   Settings → API → "service_role" key
状态:      ⚠️ Legacy (遗留，仍然可用)
```

### 新的 Secret Key 系统

```
环境变量名: SUPABASE_SECRET_KEY
密钥格式:   sk_secret_xxxxxxxxxxxxxxxxxxxxx
在哪里找:   Settings → API → "default (secret)" key
状态:      ✅ Current (当前推荐)
```

---

## 🔄 向后兼容

我们的代码同时支持两种密钥系统：

```typescript
// 优先使用新的Secret Key，回退到旧的Service Role Key
const secretKey = process.env.SUPABASE_SECRET_KEY || 
                  process.env.SUPABASE_SERVICE_ROLE_KEY;
```

这意味着：
- ✅ 如果你使用新系统，添加 `SUPABASE_SECRET_KEY`
- ✅ 如果你使用旧系统，保持 `SUPABASE_SERVICE_ROLE_KEY`
- ✅ 如果两个都有，优先使用新的 `SUPABASE_SECRET_KEY`

---

## ⚠️ 安全注意事项

### Secret Key 的权限

Secret Key 拥有**完全的后端权限**，包括：
- ✅ 绕过所有 RLS (Row Level Security) 策略
- ✅ 访问所有表和数据
- ✅ 访问所有 Storage buckets
- ✅ 执行管理操作

### 安全最佳实践

1. **永远不要暴露给前端**
   ```typescript
   // ❌ 错误 - 不要在前端代码中使用
   const supabase = createClient(url, SECRET_KEY);
   
   // ✅ 正确 - 只在后端API中使用
   // api/ocr-extract.ts (Vercel Serverless Function)
   const supabase = createClient(url, process.env.SUPABASE_SECRET_KEY);
   ```

2. **只在 Vercel Environment Variables 中配置**
   - ❌ 不要提交到 Git
   - ❌ 不要写在代码里
   - ✅ 只在 Vercel Dashboard 配置

3. **定期轮换密钥**
   - 在 Supabase Dashboard 可以重新生成密钥
   - 重新生成后，旧密钥立即失效
   - 记得更新 Vercel 环境变量

---

## 🧪 测试步骤

### 完整测试流程：

1. **添加环境变量**
   ```
   ✅ SUPABASE_SECRET_KEY 已添加到 Vercel
   ✅ Vercel 已重新部署
   ```

2. **上传测试文件**
   ```
   • 访问 /bp-analysis
   • 上传一个PDF (< 10MB)
   • 验证看到成功 alert
   ```

3. **运行分析**
   ```
   • 点击 "Analyze BP"
   • 打开 Console (F12)
   • 观察日志输出
   ```

4. **验证成功**
   ```
   Console应显示:
   🔵 OCR: Using Supabase Secret Key authentication
   🔵 OCR: Downloading file from Supabase Storage...
   ✅ OCR: File downloaded successfully
   ✅ OCR: Converted to Base64
   🔵 OCR: Calling OpenAI Vision API
   🟢 OCR: Text extraction successful
   ```

---

## ❓ 常见问题

### Q: 我应该使用哪个密钥？

**A**: 优先使用新的 Secret Key (`sk_secret_...`)。如果你的Supabase项目还没有升级到新系统，可以继续使用旧的 Service Role Key (`eyJhbG...`)。

### Q: 旧的 Service Role Key 还能用吗？

**A**: 是的！我们的代码同时支持两种系统。Supabase 会继续支持旧密钥一段时间。

### Q: 如果我有两个密钥，会用哪个？

**A**: 代码会优先使用 `SUPABASE_SECRET_KEY`。如果没有，才会使用 `SUPABASE_SERVICE_ROLE_KEY`。

### Q: 在哪里可以看到我使用的是哪个密钥？

**A**: 查看 Vercel Functions 日志，会显示：
```
🔵 OCR: Using Supabase Secret Key authentication
```

### Q: Secret Key 和 Anon Key 有什么区别？

**A**: 
- **Anon Key** (公开密钥): 用于前端，受 RLS 保护
- **Secret Key** (秘密密钥): 用于后端，绕过 RLS，拥有完全权限

### Q: 为什么需要 Secret Key？

**A**: 因为我们需要从 Storage 下载私有文件并转换为 Base64。Anon Key 没有足够的权限，Secret Key 可以绕过 RLS 限制。

---

## 📚 相关文档

- **Supabase API 文档**: https://supabase.com/docs/guides/api
- **Supabase Auth 文档**: https://supabase.com/docs/guides/auth
- **本项目文档**:
  - `BP-OCR-ALTERNATIVE-SOLUTION.md` - 服务器端下载方案
  - `BP-DIAGNOSTIC-SCRIPT.md` - 诊断脚本
  - `BP-OCR-FIX-SUMMARY.md` - OCR修复总结

---

## ✅ 快速检查清单

配置完成后，检查以下项目：

- [ ] 已从 Supabase Dashboard 获取 Secret Key
- [ ] 已添加 `SUPABASE_SECRET_KEY` 到 Vercel
- [ ] Vercel 已重新部署完成
- [ ] 上传测试 PDF 成功
- [ ] 点击 Analyze 后能看到分析结果
- [ ] Console 显示 "Using Supabase Secret Key authentication"

全部打勾 = 配置成功！🎉

---

**更新时间**: 2025-10-12  
**版本**: 2.0 (支持新的 Secret Key 系统)

