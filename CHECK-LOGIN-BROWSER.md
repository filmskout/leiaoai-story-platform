# 在浏览器中检查登录状态

## ❌ 错误：`supabase is not defined`

这个错误是因为 `supabase` 变量在浏览器控制台中不可直接访问。

---

## ✅ 正确的检查方法

### 方法1: 检查localStorage（最简单）

在浏览器控制台（F12 → Console）运行：

```javascript
// 查看所有localStorage keys
Object.keys(localStorage).forEach(key => {
  if (key.includes('supabase') || key.includes('sb-')) {
    console.log('✅ 找到Auth Token:', key);
    console.log('值长度:', localStorage.getItem(key)?.length, '字符');
  }
});

// 如果看到输出，说明已登录！
```

或者更简单的：

```javascript
// 查找auth token
const authKeys = Object.keys(localStorage).filter(k => k.includes('auth'));
console.log('Auth Keys:', authKeys);
console.log('登录状态:', authKeys.length > 0 ? '✅ 已登录' : '❌ 未登录');
```

---

### 方法2: 检查UI元素（最直观）

**登录成功的标志：**

1. ✅ 右上角显示**用户头像**或**邮箱**（不是"登录"按钮）
2. ✅ 可以访问 **/profile** 页面
3. ✅ Dashboard显示你的数据

**如果看到这些，就是已登录！**

---

### 方法3: 访问Dashboard

直接访问：
```
https://leiaoai-story-platform.vercel.app/profile
```

- **如果能看到Dashboard** → ✅ 已登录
- **如果跳转到登录页** → ❌ 未登录

---

### 方法4: 查看Application标签

1. 按 **F12** 打开开发者工具
2. 切换到 **Application** 标签（可能在顶部或">>更多"里）
3. 左侧选择 **Local Storage**
4. 选择你的网站域名
5. 查找包含 `auth` 或 `supabase` 的键

**如果看到类似这样的键：**
```
sb-[project-id]-auth-token
```

**并且值是一个长JSON字符串** → ✅ 已登录

---

### 方法5: 查看Network请求

1. 按 **F12**
2. 切换到 **Network** 标签
3. 刷新页面
4. 查找对 `supabase.co` 或 API 的请求
5. 查看 **Headers**

如果请求中包含 `Authorization: Bearer eyJ...` → ✅ 已登录

---

## 🎯 最简单的验证方法

### 步骤1: 确认UI

访问网站后，查看右上角：

- ❌ 如果显示"登录"按钮 → 未登录，点击登录
- ✅ 如果显示用户头像/邮箱 → 已登录

### 步骤2: 访问Dashboard

访问：
```
https://leiaoai-story-platform.vercel.app/profile
```

- ✅ 能看到Dashboard → 已登录
- ❌ 跳转到登录页 → 未登录

### 步骤3: 测试功能

尝试以下任一功能：
- Like一个Story
- 上传BP文件
- 访问AI Chat

如果功能工作 → ✅ 已登录且权限正确

---

## 🐛 如果确实未登录

### 注册新账号

1. 访问：https://leiaoai-story-platform.vercel.app
2. 点击"登录"
3. 点击"注册"标签
4. 输入：
   - 邮箱
   - 密码（至少6个字符）
5. 点击"注册"

### 使用现有账号

1. 点击"登录"
2. 输入邮箱和密码
3. 点击"登录"

---

## 📊 验证登录成功

登录后应该看到：

✅ **UI变化：**
- 右上角显示用户头像
- "登录"按钮消失
- 可以看到"Dashboard"链接

✅ **功能可用：**
- Dashboard页面正常显示
- 可以Like/Save Stories
- 可以上传BP文件
- AI Chat保存历史

✅ **控制台无错误：**
```
按F12 → Console标签
应该没有红色的401/403错误
```

---

## 🔍 调试：查看Auth错误

如果功能还是不工作，在控制台查看错误：

```javascript
// 查看控制台的所有错误
// 寻找包含这些关键词的错误：
// - "auth"
// - "401"
// - "403"
// - "unauthorized"
// - "policy"
```

**截图或复制错误信息，告诉我！**

---

## ✅ 快速检查清单

登录后验证：

- [ ] 右上角显示用户信息（不是"登录"按钮）
- [ ] 能访问 /profile 页面
- [ ] Dashboard显示数据
- [ ] localStorage有auth token
- [ ] 控制台无auth相关错误

**都✅后，告诉我哪些功能还不工作！**

---

## 💡 小提示

如果你想在代码中访问supabase，需要：

```javascript
// 在React组件中
import { supabase } from '@/lib/supabase';

// 或使用Hook
import { useAuth } from '@/contexts/AuthContext';
const { user } = useAuth();
```

但对于检查登录状态，最简单的方法就是：
**看右上角有没有用户头像！** 😊

