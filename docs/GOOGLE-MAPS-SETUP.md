# Google Maps API 配置指南

## 问题描述
当前Contact页面显示"Google Maps API key not configured"错误，需要正确配置Google Maps API密钥。

## 解决方案

### 1. 获取Google Maps API密钥

1. 访问 [Google Cloud Console](https://console.cloud.google.com/)
2. 创建新项目或选择现有项目
3. 启用以下API：
   - Maps JavaScript API
   - Maps Embed API
   - Geocoding API (可选)
4. 创建API密钥：
   - 转到"凭据"页面
   - 点击"创建凭据" > "API密钥"
   - 复制生成的API密钥

### 2. 配置环境变量

#### 本地开发环境
在项目根目录创建 `.env.local` 文件：
```bash
GOOGLE_MAPS_API_KEY=your_api_key_here
```

#### Vercel部署环境
在Vercel Dashboard中设置环境变量：
1. 进入项目设置 > Environment Variables
2. 添加以下变量：
   - `GOOGLE_MAPS_API_KEY`: 你的Google Maps API密钥

### 3. API密钥安全设置

在Google Cloud Console中配置API密钥限制：

#### 应用限制
- **HTTP referrers (web sites)**: 添加你的域名
  - `https://leiaoai-story-platform.vercel.app/*`
  - `http://localhost:3000/*` (开发环境)
  - `http://localhost:5173/*` (Vite开发服务器)

#### API限制
选择以下API：
- Maps JavaScript API
- Maps Embed API
- Geocoding API

### 4. 代码配置

项目已配置两种方式获取API密钥：

#### 客户端方式（推荐）
```typescript
const clientApiKey = import.meta.env.GOOGLE_MAPS_API_KEY;
```

#### 服务端方式
```typescript
// 通过 /api/google-maps-key 端点获取
const response = await fetch('/api/google-maps-key');
const data = await response.json();
const apiKey = data.apiKey;
```

### 5. 测试配置

1. 启动开发服务器：`npm run dev`
2. 访问Contact页面：`http://localhost:3000/contact`
3. 检查浏览器控制台是否有API密钥相关错误
4. 确认地图正常显示

### 6. 故障排查

#### 常见错误及解决方案

**"Google Maps API key not configured"**
- 检查环境变量是否正确设置
- 确认API密钥在Google Cloud Console中已启用

**"RefererNotAllowedMapError"**
- 检查HTTP referrers设置
- 确认域名已添加到允许列表

**"This API project is not authorized"**
- 确认API已启用
- 检查API密钥限制设置

**地图不显示**
- 检查浏览器控制台错误信息
- 确认API密钥有效且有足够配额

### 7. 费用说明

Google Maps API按使用量收费：
- Maps JavaScript API: 每1000次加载 $7
- Maps Embed API: 每1000次加载 $7
- 建议设置使用配额限制

### 8. 备用方案

如果Google Maps在中国大陆访问受限，项目已配置高德地图作为备用：
- 中国用户自动使用高德地图
- 海外用户使用Google Maps
- 通过IP检测自动切换

## 相关文件

- `src/pages/Contact.tsx` - Contact页面组件
- `api/google-maps-key.ts` - API密钥服务端点
- `src/i18n/index.ts` - 国际化配置
- `src/locales/en.json` - 英文翻译文件

## 更新日志

- 2025-01-12: 将环境变量从VITE_GOOGLE_MAPS_API_KEY改为GOOGLE_MAPS_API_KEY
- 2025-01-12: 修复高德地图URL中的硬编码中文地址，改为英文地址
- 2025-01-12: 合并en-US.json和en.json文件
- 2025-01-12: 修复英文地址显示问题
- 2025-01-12: 更新所有语言文件引用
