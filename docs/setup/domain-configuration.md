# 域名迁移指南 - leiao.ai

## 🌐 域名更新概览

**旧域名**: leiaoai-story-platform.vercel.app  
**新域名**: leiao.ai  
**状态**: 已连接，需要配置

---

## ✅ 已完成的搜索引擎屏蔽

### 1. robots.txt
**文件**: `public/robots.txt`
- ✅ 阻止所有搜索引擎爬取
- ✅ 包含Google, Bing, Baidu, Yandex等
- 🚀 部署后自动生效

### 2. Meta标签
**文件**: `index.html`
- ✅ `<meta name="robots" content="noindex, nofollow">`
- ✅ 阻止Google和Bing索引
- 🚀 部署后自动生效

**结果**: 搜索引擎将不会索引网站内容

---

## 🔐 Supabase 认证配置（必需！）

### 步骤1: 添加新域名到Supabase允许列表

1. **打开Supabase Dashboard**
   - 访问: https://supabase.com/dashboard
   - 选择你的项目

2. **进入Authentication设置**
   - 左侧菜单 → Authentication
   - 点击 "URL Configuration"

3. **添加新域名到Site URL**
   ```
   Site URL: https://leiao.ai
   ```

4. **添加到Redirect URLs（重要！）**
   在 "Redirect URLs" 部分添加以下URL：
   ```
   https://leiao.ai
   https://leiao.ai/auth/callback
   https://leiao.ai/auth-callback.html
   https://leiao.ai/*
   ```

5. **保留旧域名（暂时）**
   同时保留旧的Vercel域名以便测试：
   ```
   https://leiaoai-story-platform.vercel.app
   https://leiaoai-story-platform.vercel.app/auth/callback
   https://leiaoai-story-platform.vercel.app/auth-callback.html
   https://leiaoai-story-platform.vercel.app/*
   ```

### 步骤2: 检查CORS设置

在同一个 "URL Configuration" 页面：

1. **Additional Redirect URLs**
   确保包含：
   ```
   https://leiao.ai
   https://leiao.ai/*
   ```

2. **保存设置**
   点击 "Save" 按钮

---

## 🔧 Vercel 域名配置

### 步骤1: 验证域名连接

1. **打开Vercel Dashboard**
   - 访问: https://vercel.com/dashboard
   - 选择 leiaoai-story-platform 项目

2. **检查Domains设置**
   - Settings → Domains
   - 确认 leiao.ai 已连接且状态为 "Active"

### 步骤2: 配置环境变量（如果需要）

如果你的代码中硬编码了域名，可能需要添加环境变量：

1. Settings → Environment Variables
2. 添加（如果不存在）：
   ```
   VITE_APP_URL=https://leiao.ai
   ```

3. 重新部署以应用更改

---

## 🧪 测试认证功能

### 测试1: 访问新域名
1. 打开浏览器访问: https://leiao.ai
2. 应该能正常加载首页

### 测试2: 测试登录流程
1. 点击右上角 "登录" 按钮
2. 输入邮箱和密码
3. 点击 "Sign In"
4. **期望结果**: 
   - ✅ 成功登录并跳转到Dashboard
   - ✅ 右上角显示用户头像
   - ✅ 可以访问用户功能

### 测试3: 测试注册流程
1. 点击 "Sign Up" 按钮
2. 输入邮箱、密码、用户名
3. 点击 "Create Account"
4. **期望结果**:
   - ✅ 收到确认邮件
   - ✅ 点击邮件链接跳转回 leiao.ai
   - ✅ 账户激活成功

### 测试4: 测试第三方登录（如果启用）
如果你启用了Google/GitHub等OAuth登录：
1. 点击对应的登录按钮
2. 授权后应该跳转回 leiao.ai
3. 验证登录成功

---

## ⚠️ 可能的问题和解决方案

### 问题1: 登录后跳转到错误的域名
**症状**: 登录成功但跳转到旧的 .vercel.app 域名

**解决方案**:
1. 检查Supabase的 "Site URL" 是否设置为 https://leiao.ai
2. 清除浏览器缓存和Cookie
3. 重新尝试登录

### 问题2: "Invalid redirect URL" 错误
**症状**: 登录时出现错误提示

**解决方案**:
1. 确认已在Supabase "Redirect URLs" 中添加所有必需的URL
2. URL必须完全匹配（包括尾部斜杠）
3. 等待几分钟让配置生效

### 问题3: 邮件确认链接跳转失败
**症状**: 点击确认邮件中的链接无法跳转

**解决方案**:
1. 检查Supabase Email Templates
2. 确认模板中的URL使用变量 `{{ .SiteURL }}`
3. 不要硬编码域名

### 问题4: CORS错误
**症状**: Console显示CORS policy错误

**解决方案**:
1. 检查Supabase "Additional Redirect URLs"
2. 添加新域名到列表
3. 如果使用Edge Functions，更新函数的CORS headers

---

## 🔍 验证清单

### Supabase配置
- [ ] Site URL设置为 https://leiao.ai
- [ ] Redirect URLs包含所有leiao.ai路径
- [ ] 保留旧域名用于测试
- [ ] CORS设置包含新域名

### Vercel配置
- [ ] 域名状态为 Active
- [ ] SSL证书已配置
- [ ] 最新代码已部署

### 前端代码
- [ ] robots.txt已添加
- [ ] Meta标签已添加
- [ ] 没有硬编码的域名URL

### 功能测试
- [ ] 首页正常加载
- [ ] 登录功能正常
- [ ] 注册功能正常
- [ ] 邮件确认流程正常
- [ ] 登出功能正常
- [ ] Dashboard访问正常

---

## 📊 Supabase认证配置示例

### 完整的URL Configuration设置

```
Site URL:
https://leiao.ai

Additional Redirect URLs:
https://leiao.ai
https://leiao.ai/*
https://leiao.ai/auth/callback
https://leiao.ai/auth-callback.html
https://leiaoai-story-platform.vercel.app
https://leiaoai-story-platform.vercel.app/*
https://leiaoai-story-platform.vercel.app/auth/callback
https://leiaoai-story-platform.vercel.app/auth-callback.html
```

### Email Templates（如果需要更新）

确保邮件模板使用动态变量：

**Confirm Signup Template**:
```html
<h2>Confirm your signup</h2>
<p>Follow this link to confirm your account:</p>
<p><a href="{{ .SiteURL }}/auth/callback?token_hash={{ .TokenHash }}&type=signup">Confirm your mail</a></p>
```

**Reset Password Template**:
```html
<h2>Reset Password</h2>
<p>Follow this link to reset your password:</p>
<p><a href="{{ .SiteURL }}/auth/callback?token_hash={{ .TokenHash }}&type=recovery">Reset Password</a></p>
```

---

## 🚀 部署和发布准备

### 当前状态
- ✅ 搜索引擎已屏蔽
- ⏳ 需要配置Supabase认证
- ⏳ 需要测试完整登录流程

### 发布前清单
1. [ ] 完成Supabase认证配置
2. [ ] 测试所有认证流程
3. [ ] 验证搜索引擎屏蔽生效
4. [ ] 检查所有功能正常工作
5. [ ] 备份当前数据库
6. [ ] 准备监控和错误日志

### 正式发布时（移除搜索引擎屏蔽）
1. 删除或修改 `public/robots.txt`:
   ```
   User-agent: *
   Allow: /
   
   Sitemap: https://leiao.ai/sitemap.xml
   ```

2. 删除 `index.html` 中的noindex meta标签

3. 添加sitemap.xml（可选）

4. 提交到Google Search Console

---

## 📝 注意事项

1. **DNS传播时间**: 域名更新可能需要24-48小时完全传播
2. **SSL证书**: Vercel自动配置，通常在几分钟内完成
3. **缓存**: 用户可能需要清除缓存才能看到新域名
4. **SEO**: 屏蔽期间不会有搜索引擎流量
5. **邮件**: 确认邮件中的链接会使用新域名

---

## 🆘 获取帮助

如果遇到问题：

1. **Supabase文档**: https://supabase.com/docs/guides/auth
2. **Vercel文档**: https://vercel.com/docs/custom-domains
3. **检查浏览器Console**: 查看具体错误信息
4. **查看Supabase Logs**: Authentication → Logs

---

## ✅ 快速开始

**现在就开始配置：**

1. ⏳ 打开Supabase Dashboard
2. ⏳ Authentication → URL Configuration
3. ⏳ 设置Site URL为 https://leiao.ai
4. ⏳ 添加所有Redirect URLs
5. ⏳ 保存并等待部署完成
6. ⏳ 测试登录和注册流程

**完成这些步骤后，leiao.ai就可以正常支持用户登录和注册了！**

