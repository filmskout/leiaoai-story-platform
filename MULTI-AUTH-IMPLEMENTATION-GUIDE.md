# 多重认证系统实施指南

## 🎯 项目概述

为leiao.ai添加Google OAuth和Web3钱包（Ethereum & Solana）认证支持。

---

## ✅ 已完成的工作

### 1. 后端认证逻辑（已完成）

#### AuthContext更新
**文件**: `src/contexts/AuthContext.tsx`
- ✅ 添加 `signInWithGoogle()` 方法
- ✅ 添加 `signInWithWallet()` 方法
- ✅ 支持Ethereum和Solana钱包
- ✅ 完整的错误处理和Toast提示

#### Supabase库更新
**文件**: `src/lib/supabase.ts`
- ✅ `signInWithGoogle()`: OAuth重定向到Google
- ✅ `signInWithWallet()`: 支持钱包地址和签名验证
- ✅ 自动账户创建（首次钱包登录）
- ✅ UserProfile接口添加 `wallet_address` 和 `wallet_type`

### 2. Web3钱包连接组件（已完成）

**文件**: `src/components/auth/WalletConnect.tsx`
- ✅ Ethereum/MetaMask集成
- ✅ Solana/Phantom集成
- ✅ 签名验证流程
- ✅ 加载和连接状态显示
- ✅ 错误处理和用户友好提示

### 3. 数据库Schema（已完成）

**文件**: `ADD-WALLET-AUTH-SCHEMA.sql`
- ✅ 添加 `wallet_address` 列
- ✅ 添加 `wallet_type` 列（CHECK约束：'ethereum' | 'solana'）
- ✅ 创建索引以优化查询
- ✅ 唯一约束防止一个钱包多个账户
- ✅ 包含完整的测试查询

---

## ⏳ 待完成的工作

### 1. 更新登录/注册UI

**文件**: `src/pages/Auth.tsx`

需要添加：
1. **Google登录按钮**
   ```tsx
   <Button onClick={signInWithGoogle} className="w-full bg-white text-gray-700 border hover:bg-gray-50">
     <GoogleIcon /> Sign in with Google
   </Button>
   ```

2. **Web3钱包区域**
   ```tsx
   import { WalletConnect } from '@/components/auth/WalletConnect';
   
   <div className="mt-4">
     <div className="relative my-6">
       <div className="absolute inset-0 flex items-center">
         <div className="w-full border-t border-gray-300"></div>
       </div>
       <div className="relative flex justify-center text-sm">
         <span className="px-2 bg-white text-gray-500">Or connect with</span>
       </div>
     </div>
     
     <WalletConnect 
       onSuccess={() => navigate('/')} 
       onError={(e) => setError(e.message)}
     />
   </div>
   ```

3. **UI布局调整**
   - Email/Password表单保持不变
   - 添加分隔线 "Or continue with"
   - Google按钮（白色背景，Google品牌色图标）
   - Web3钱包按钮（渐变背景）

### 2. 创建法律和信息页面

#### a. About页面
**文件**: `src/pages/About.tsx` (新建)

**内容结构**:
```
- Hero区域
  - 大标题: "关于LeiaoAI"
  - 简介: AI驱动的社交故事平台
  
- 使命和愿景
  - 我们的使命
  - 我们的愿景
  
- 核心功能
  - AI Chat助手
  - 故事创作
  - 社区互动
  - BP分析
  
- 团队
  - Shenzhen办公室
  - Hong Kong办公室
  - San Jose办公室
  
- 技术栈
  - OpenAI, DeepSeek, Qwen
  - React, Supabase
  - Web3集成
```

#### b. Privacy Policy页面
**文件**: `src/pages/PrivacyPolicy.tsx` (新建)

**基于**: https://cdn.deepseek.com/policies/en-US/deepseek-privacy-policy.html

**主要章节**:
1. 引言和数据控制者信息
2. 我们收集的个人数据
3. 如何使用您的数据
4. 如何共享您的数据
5. 您的权利
6. 数据存储和安全
7. Cookie政策
8. 联系我们

**需要调整的内容**:
- 公司名称: Hangzhou DeepSeek → LeiaoAI (leiao.ai)
- 联系邮箱: privacy@deepseek.com → privacy@leiao.ai
- 添加Web3钱包数据收集说明
- 添加Google OAuth数据收集说明

#### c. Terms of Service页面
**文件**: `src/pages/TermsOfService.tsx` (新建)

**基于**: https://cdn.deepseek.com/policies/en-US/deepseek-terms-of-use.html

**主要章节**:
1. 服务条款接受
2. 服务描述
3. 账户和注册
4. 用户行为规范
5. 知识产权
6. 隐私和数据保护
7. 服务的修改和终止
8. 责任限制
9. 争议解决
10. 联系信息

**需要调整的内容**:
- 公司信息更新为LeiaoAI
- 添加Web3钱包登录条款
- 添加Google OAuth使用条款
- 更新服务描述（AI Chat, Stories, BP Analysis）

#### d. Contact Us页面
**文件**: `src/pages/ContactUs.tsx` (新建)

**内容结构**:
```
- Hero区域
  - 标题: "联系我们"
  - 副标题: "我们很乐意听到您的意见"

- 联系方式
  - Email: support@leiao.ai
  - 社交媒体链接

- 办公室位置（带地图）
  1. Shenzhen办公室
     - 地址: [待确定]
     - 电话: [待确定]
     - 地图: Google Maps嵌入
     
  2. Hong Kong办公室
     - 地址: [待确定]
     - 电话: [待确定]
     - 地图: Google Maps嵌入
     
  3. San Jose, California办公室
     - 地址: [待确定]
     - 电话: [待确定]
     - 地图: Google Maps嵌入

- 联系表单
  - 姓名
  - 邮箱
  - 主题
  - 消息
  - 提交按钮
```

**地图集成**:
```tsx
// 使用iframe嵌入Google Maps
<iframe
  src="https://www.google.com/maps/embed?pb=!1m18!..."
  width="100%"
  height="300"
  style={{ border: 0 }}
  allowFullScreen
  loading="lazy"
  referrerPolicy="no-referrer-when-downgrade"
></iframe>
```

### 3. 更新导航和Footer

#### a. 导航栏更新
**文件**: `src/components/layout/Navbar.tsx`

添加链接到下拉菜单或底部：
```tsx
<Link to="/about">About</Link>
<Link to="/contact">Contact</Link>
```

#### b. Footer更新
**文件**: `src/components/layout/Footer.tsx`

添加"Legal"部分：
```tsx
<div>
  <h3>Legal</h3>
  <Link to="/privacy">Privacy Policy</Link>
  <Link to="/terms">Terms of Service</Link>
</div>

<div>
  <h3>Company</h3>
  <Link to="/about">About Us</Link>
  <Link to="/contact">Contact Us</Link>
</div>
```

### 4. 路由配置

**文件**: `src/App.tsx` 或路由配置文件

添加新路由：
```tsx
import About from '@/pages/About';
import PrivacyPolicy from '@/pages/PrivacyPolicy';
import TermsOfService from '@/pages/TermsOfService';
import ContactUs from '@/pages/ContactUs';

// 在路由中添加
<Route path="/about" element={<About />} />
<Route path="/privacy" element={<PrivacyPolicy />} />
<Route path="/terms" element={<TermsOfService />} />
<Route path="/contact" element={<ContactUs />} />
```

---

## 🔧 Supabase配置（重要！）

### 1. 启用Google OAuth

**位置**: Supabase Dashboard → Authentication → Providers → Google

**步骤**:
1. 进入Google Cloud Console
2. 创建OAuth 2.0 Client ID
3. 授权重定向URI添加:
   ```
   https://nineezxjxfzwnsdtgjcu.supabase.co/auth/v1/callback
   https://leiao.ai/auth/callback
   ```
4. 复制Client ID和Client Secret
5. 在Supabase中粘贴并启用

### 2. 配置Redirect URLs

**位置**: Supabase Dashboard → Authentication → URL Configuration

**Site URL**:
```
https://leiao.ai
```

**Redirect URLs** (添加所有):
```
https://leiao.ai
https://leiao.ai/*
https://leiao.ai/auth/callback
https://leiao.ai/auth-callback.html
```

### 3. 运行数据库迁移

在Supabase SQL Editor中运行:
```sql
-- 文件: ADD-WALLET-AUTH-SCHEMA.sql
-- 添加wallet_address和wallet_type列
-- 创建索引和约束
```

---

## 🎨 UI/UX设计规范

### 颜色方案

**Google按钮**:
- 背景: `bg-white`
- 文字: `text-gray-700`
- 边框: `border border-gray-300`
- Hover: `hover:bg-gray-50`

**Ethereum按钮**:
- 背景: `bg-gradient-to-r from-purple-600 to-blue-600`
- 文字: `text-white`
- Hover: `hover:from-purple-700 hover:to-blue-700`

**Solana按钮**:
- 背景: `bg-gradient-to-r from-purple-400 to-pink-500`
- 文字: `text-white`
- Hover: `hover:from-purple-500 hover:to-pink-600`

### 间距和布局

- 按钮之间: `space-y-3`
- 分隔线上下: `my-6`
- 表单字段: `space-y-4`

### 暗色模式支持

所有新页面必须支持：
- 使用 `useTheme()` hook
- 使用 `actualTheme === 'dark'` 条件
- 应用适当的暗色类（`dark:bg-gray-900`等）

---

## 📋 测试清单

### 认证功能测试

- [ ] Email/Password登录正常
- [ ] Email/Password注册正常
- [ ] Google OAuth登录正常
- [ ] Ethereum钱包连接和登录
- [ ] Solana钱包连接和登录
- [ ] 首次钱包登录自动创建账户
- [ ] 钱包地址正确保存到数据库
- [ ] 退出功能清除所有会话

### UI测试

- [ ] 登录页面显示所有认证选项
- [ ] 按钮样式正确（颜色、间距、Hover效果）
- [ ] 加载状态显示正确
- [ ] 错误消息正确显示
- [ ] 暗色模式下样式正确

### 页面测试

- [ ] About页面正常显示
- [ ] Privacy Policy页面正常显示
- [ ] Terms of Service页面正常显示
- [ ] Contact Us页面正常显示
- [ ] Contact Us地图正常加载
- [ ] 导航栏包含新页面链接
- [ ] Footer包含新页面链接
- [ ] 所有页面暗色模式正常

### 数据库测试

- [ ] wallet_address列已创建
- [ ] wallet_type列已创建
- [ ] 索引已创建
- [ ] 唯一约束生效
- [ ] RLS策略允许钱包用户访问

---

## 🚀 部署流程

### 1. 代码部署

```bash
# 提交所有更改
git add -A
git commit -m "完成多重认证系统和法律页面"
git push origin main

# Vercel自动部署
```

### 2. Supabase配置

1. ✅ 运行 `ADD-WALLET-AUTH-SCHEMA.sql`
2. ✅ 启用Google OAuth Provider
3. ✅ 配置Redirect URLs
4. ✅ 测试所有认证方式

### 3. 测试和验证

1. 在leiao.ai测试所有登录方式
2. 验证数据库正确存储用户信息
3. 检查所有新页面正常显示
4. 验证暗色模式
5. 测试移动端响应式

---

## 📞 获取帮助

如果遇到问题：

1. **认证问题**: 检查Supabase Dashboard的Auth Logs
2. **钱包问题**: 检查浏览器Console的钱包连接错误
3. **UI问题**: 使用浏览器开发者工具检查样式
4. **数据库问题**: 运行提供的测试查询

---

## 📝 注意事项

1. **钱包地址安全**:
   - 钱包地址存储为小写
   - 签名验证在客户端和服务端
   - 不存储私钥或助记词

2. **OAuth安全**:
   - 使用PKCE flow
   - Redirect URL必须匹配配置
   - Token自动刷新

3. **用户体验**:
   - 明确的加载状态
   - 友好的错误消息
   - 平滑的过渡动画

4. **隐私合规**:
   - Privacy Policy必须完整
   - Terms必须明确用户权利
   - GDPR合规（如适用）

---

## ✅ 完成标志

当以下所有项目都完成时，项目即完成：

- ✅ 后端认证逻辑完成
- ✅ Web3钱包组件完成
- ✅ 数据库Schema更新
- ⏳ 登录/注册UI更新
- ⏳ About页面创建
- ⏳ Privacy Policy页面创建
- ⏳ Terms of Service页面创建
- ⏳ Contact Us页面创建（含地图）
- ⏳ 导航和Footer更新
- ⏳ 路由配置完成
- ⏳ Supabase配置完成
- ⏳ 所有测试通过

---

**当前进度**: 3/12 完成 (25%)

**下一步**: 更新登录/注册UI，然后创建法律页面

