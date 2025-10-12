# 域名认证配置验证脚本

## 🧪 在浏览器Console中运行此脚本

打开 https://leiao.ai 并按F12打开Console，然后运行以下脚本：

```javascript
// ============================================
// LeiaoAI 域名认证配置检查
// ============================================

console.log('🔍 开始检查域名和认证配置...\n');

// 1. 检查当前域名
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('1️⃣ 域名检查');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('当前域名:', window.location.hostname);
console.log('完整URL:', window.location.href);
console.log('协议:', window.location.protocol);

const isCorrectDomain = window.location.hostname === 'leiao.ai' || 
                       window.location.hostname === 'www.leiao.ai';
console.log(isCorrectDomain ? '✅ 域名正确' : '❌ 域名不正确');

// 2. 检查搜索引擎屏蔽
console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('2️⃣ 搜索引擎屏蔽检查');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

const robotsMeta = document.querySelector('meta[name="robots"]');
if (robotsMeta) {
  console.log('✅ 发现robots meta标签');
  console.log('   内容:', robotsMeta.content);
  const isBlocked = robotsMeta.content.includes('noindex');
  console.log(isBlocked ? '✅ 搜索引擎已屏蔽' : '❌ 搜索引擎未屏蔽');
} else {
  console.log('❌ 未发现robots meta标签');
}

// 检查robots.txt
fetch('/robots.txt')
  .then(r => r.text())
  .then(text => {
    console.log('\n✅ robots.txt内容:');
    console.log(text.split('\n').slice(0, 5).join('\n'));
    console.log('...');
  })
  .catch(e => console.log('❌ 无法读取robots.txt'));

// 3. 检查Supabase连接
console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('3️⃣ Supabase连接检查');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

// 尝试访问Supabase客户端
setTimeout(async () => {
  try {
    // 获取环境变量
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    console.log('Supabase URL:', supabaseUrl ? '✅ 已配置' : '❌ 未配置');
    console.log('Supabase Key:', supabaseKey ? '✅ 已配置' : '❌ 未配置');
    
    if (!supabaseUrl || !supabaseKey) {
      console.log('❌ Supabase环境变量未配置，停止检查');
      return;
    }
    
    // 创建临时客户端
    const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2');
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    console.log('✅ Supabase客户端已创建');
    
    // 检查会话
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.log('❌ 获取会话失败:', error.message);
    } else if (session) {
      console.log('✅ 用户已登录');
      console.log('   用户ID:', session.user.id);
      console.log('   邮箱:', session.user.email);
      console.log('   登录时间:', new Date(session.user.last_sign_in_at).toLocaleString());
    } else {
      console.log('ℹ️  用户未登录');
    }
    
  } catch (error) {
    console.log('❌ 检查失败:', error.message);
  }
}, 1000);

// 4. 检查认证回调URL
console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('4️⃣ 认证回调URL检查');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

const expectedCallbacks = [
  `${window.location.origin}/auth/callback`,
  `${window.location.origin}/auth-callback.html`,
];

console.log('当前域名的预期回调URL:');
expectedCallbacks.forEach(url => console.log('  -', url));

console.log('\n⚠️  请确保这些URL已添加到Supabase Dashboard:');
console.log('   Authentication → URL Configuration → Redirect URLs');

// 5. 测试登录功能
console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('5️⃣ 登录功能测试指南');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

console.log('请手动测试以下功能：');
console.log('1. 点击右上角"登录"按钮');
console.log('2. 输入邮箱和密码');
console.log('3. 点击"Sign In"');
console.log('4. 观察是否成功登录并停留在 leiao.ai 域名');
console.log('\n如果跳转到其他域名，请检查Supabase Site URL配置');

// 6. 总结
console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('📋 配置检查总结');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

setTimeout(() => {
  console.log('\n✅ 自动检查完成！');
  console.log('\n下一步:');
  console.log('1. 在Supabase Dashboard中设置Site URL为:', window.location.origin);
  console.log('2. 添加所有回调URL到Redirect URLs列表');
  console.log('3. 手动测试登录和注册流程');
  console.log('4. 验证邮件确认链接是否正确');
  console.log('\n详细指南请查看: DOMAIN-SETUP-GUIDE.md');
}, 2000);
```

---

## 📋 Supabase配置清单

### 必须配置的URL（复制到Supabase）

**Site URL**:
```
https://leiao.ai
```

**Redirect URLs**（逐行添加）:
```
https://leiao.ai
https://leiao.ai/*
https://leiao.ai/auth/callback
https://leiao.ai/auth-callback.html
```

### 配置位置
Supabase Dashboard → Authentication → URL Configuration

---

## 🧪 手动测试步骤

### 测试1: 首页加载
1. 访问: https://leiao.ai
2. 检查页面是否正常加载
3. 检查Console是否有错误

### 测试2: 登录测试
1. 点击右上角"登录"
2. 输入测试账户
3. 点击"Sign In"
4. **验证**:
   - ✅ 成功登录
   - ✅ URL仍然是leiao.ai
   - ✅ 显示用户信息

### 测试3: 注册测试
1. 点击"Sign Up"
2. 填写注册信息
3. 提交表单
4. **验证**:
   - ✅ 收到确认邮件
   - ✅ 邮件链接指向leiao.ai
   - ✅ 点击链接后成功激活

### 测试4: 退出测试
1. 点击用户头像
2. 选择"Log Out"
3. **验证**:
   - ✅ 成功退出
   - ✅ 跳转到首页
   - ✅ 显示登录按钮

---

## ⚠️ 常见问题

### 问题: 登录后跳转到vercel.app域名
**原因**: Supabase Site URL未更新  
**解决**: 在Supabase中设置Site URL为 https://leiao.ai

### 问题: "Invalid redirect URL" 错误
**原因**: 回调URL未添加到允许列表  
**解决**: 在Redirect URLs中添加所有必需的URL

### 问题: 邮件链接不正确
**原因**: Email Templates使用了硬编码的URL  
**解决**: 确保模板使用 `{{ .SiteURL }}` 变量

---

## ✅ 配置完成标志

当所有这些都正常时，配置就完成了：

- ✅ 首页在leiao.ai正常加载
- ✅ 登录功能正常且不跳转域名
- ✅ 注册确认邮件链接正确
- ✅ 所有认证流程在leiao.ai完成
- ✅ Console无CORS或认证错误
- ✅ robots.txt和meta标签正确屏蔽搜索引擎

