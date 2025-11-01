# 授予管理员权限指南

## 管理员验证码
**验证码：** `LEOAI2025ADMIN`

## 方法1：通过登录页面（推荐）

1. 访问 `/admin-login` 页面
2. 输入邮箱：`admin@leiaoai.com`
3. 输入账户密码
4. 点击 "Continue to Verification"
5. 输入验证码：`LEOAI2025ADMIN`
6. 点击 "Grant Admin Access"

## 方法2：浏览器控制台（快速）

如果已经用 `admin@leiaoai.com` 登录了，可以直接在浏览器控制台运行：

```javascript
localStorage.setItem('leoai-admin-verified', 'true');
localStorage.setItem('leoai-admin-session', Date.now().toString());
window.location.reload();
```

## 方法3：永久设置（开发环境）

如果需要永久权限（仅在开发环境推荐），可以修改 `src/contexts/AdminContext.tsx`：

```typescript
// 在 checkAdminStatus 函数中添加
const ADMIN_EMAILS = ['admin@leiaoai.com'];
if (user?.email && ADMIN_EMAILS.includes(user.email)) {
  localStorage.setItem('leoai-admin-verified', 'true');
  localStorage.setItem('leoai-admin-session', Date.now().toString());
  return true;
}
```

## 验证管理员权限

访问以下页面确认权限：
- `/company-management` - 公司管理
- `/company-enrich-tool` - LLM补齐工具
- `/monitoring` - 监控面板

## 管理员功能

获得管理员权限后可以使用：
1. **公司管理** (`/company-management`)
   - 创建/编辑/删除公司
   - 上传Logo
   
2. **LLM补齐工具** (`/company-enrich-tool`)
   - 使用AI自动补齐公司信息
   
3. **数据监控** (`/monitoring`)
   - 查看系统状态

## 权限有效期

管理员权限有效期为 **24小时**，过期后需要重新验证。

如果需要延长，可以再次运行控制台脚本或重新登录。

