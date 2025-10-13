# 地图API配置指南

## 问题描述
当前Contact页面需要配置地图API密钥以显示静态地图图片，支持Google Maps和高德地图两种服务。

## 解决方案

### 1. 获取Google Maps API密钥

1. 访问 [Google Cloud Console](https://console.cloud.google.com/)
2. 创建新项目或选择现有项目
3. 启用以下API：
   - Maps Static API (用于静态地图图片)
   - Maps JavaScript API (可选)
   - Geocoding API (可选)
4. 创建API密钥：
   - 转到"凭据"页面
   - 点击"创建凭据" > "API密钥"
   - 复制生成的API密钥

### 2. 获取高德地图API密钥

1. 访问 [高德开放平台](https://lbs.amap.com/)
2. 注册并登录账号
3. 创建应用：
   - 进入控制台
   - 点击"创建应用"
   - 选择"Web端(JS API)"
4. 添加Key：
   - 在应用中添加Key
   - 选择"Web服务"类型
   - 复制生成的Key

### 3. 配置环境变量

#### 本地开发环境
在项目根目录创建 `.env.local` 文件：
```bash
GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
GAODE_MAPS_API_KEY=your_gaode_maps_api_key_here
```

#### Vercel部署环境
在Vercel Dashboard中设置环境变量：
1. 进入项目设置 > Environment Variables
2. 添加以下变量：
   - `GOOGLE_MAPS_API_KEY`: 你的Google Maps API密钥
   - `GAODE_MAPS_API_KEY`: 你的高德地图API密钥

### 4. API密钥安全设置

#### Google Maps API限制
在Google Cloud Console中配置API密钥限制：

#### 应用限制
- **HTTP referrers (web sites)**: 添加你的域名
  - `https://leiaoai-story-platform.vercel.app/*`
  - `http://localhost:3000/*` (开发环境)
  - `http://localhost:5173/*` (Vite开发服务器)

#### API限制
选择以下API：
- Maps Static API
- Maps JavaScript API (可选)
- Geocoding API (可选)

#### 高德地图API限制
在高德开放平台中配置：
1. 进入应用管理
2. 设置Key的安全限制
3. 添加域名白名单
4. 设置IP白名单（可选）

### 5. 功能说明

#### 地图显示逻辑
- **中国用户**: 自动使用高德地图，显示中文地址的静态地图
- **海外用户**: 自动使用Google Maps，显示英文地址的静态地图
- **点击交互**: 点击静态地图可跳转到对应的动态地图页面

#### 地址语言
- **高德地图**: 使用中文地址搜索和显示
- **Google Maps**: 使用英文地址搜索和显示

#### 静态地图API
- **Google Maps**: 使用Maps Static API生成静态图片
- **高德地图**: 使用高德静态地图API生成静态图片

### 6. 测试配置

1. 启动开发服务器：`npm run dev`
2. 访问Contact页面：`http://localhost:3000/contact`
3. 检查浏览器控制台是否有API密钥相关错误
4. 确认静态地图正常显示
5. 测试点击地图跳转功能

### 7. 故障排查

#### 常见错误及解决方案

**"Google Maps API key not configured"**
- 检查`GOOGLE_MAPS_API_KEY`环境变量是否正确设置
- 确认API密钥在Google Cloud Console中已启用Maps Static API

**"Gaode Maps API key not configured"**
- 检查`GAODE_MAPS_API_KEY`环境变量是否正确设置
- 确认API密钥在高德开放平台中已启用Web服务

**"RefererNotAllowedMapError"**
- 检查Google Maps API的HTTP referrers设置
- 确认域名已添加到允许列表

**"This API project is not authorized"**
- 确认Google Maps API已启用
- 检查API密钥限制设置

**静态地图不显示**
- 检查浏览器控制台错误信息
- 确认API密钥有效且有足够配额
- 检查网络连接和API服务状态

### 8. 费用说明

#### Google Maps API费用
- Maps Static API: 每1000次请求 $2
- Maps JavaScript API: 每1000次加载 $7
- 建议设置使用配额限制

#### 高德地图API费用
- 静态地图API: 免费额度内免费使用
- 超出免费额度后按量计费
- 建议关注使用量和费用

### 9. 备用方案

如果API服务不可用，项目会显示占位符：
- 显示办公室地址信息
- 提供手动导航选项
- 保持页面功能完整性

## 相关文件

- `src/pages/Contact.tsx` - Contact页面组件
- `api/google-maps-key.ts` - API密钥服务端点
- `src/i18n/index.ts` - 国际化配置
- `src/locales/en.json` - 英文翻译文件

## 更新日志

- 2025-01-12: 实现静态地图显示功能，支持Google Maps和高德地图
- 2025-01-12: 添加点击跳转到动态地图的功能
- 2025-01-12: 高德地图使用中文地址，Google Maps使用英文地址
- 2025-01-12: 将环境变量从VITE_GOOGLE_MAPS_API_KEY改为GOOGLE_MAPS_API_KEY
- 2025-01-12: 修复高德地图URL中的硬编码中文地址，改为英文地址
- 2025-01-12: 合并en-US.json和en.json文件
- 2025-01-12: 修复英文地址显示问题
- 2025-01-12: 更新所有语言文件引用
