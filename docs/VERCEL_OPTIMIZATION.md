# 🚀 Vercel Hobby计划优化指南

## 问题解决

### 问题：Serverless Functions数量限制
- **限制**：Vercel Hobby计划最多12个Serverless Functions
- **解决方案**：创建统一的API处理器

### 优化措施

#### 1. 统一API处理器
- 创建了 `api/unified.ts` 统一处理所有API请求
- 通过 `action` 参数区分不同的功能
- 减少了Serverless Functions数量

#### 2. API端点映射
```
/api/unified?action=check-env          → 环境变量检查
/api/unified?action=reconfigure        → 数据重新配置
/api/unified?action=ai-chat            → AI聊天
/api/unified?action=bp-analysis        → BP分析
/api/unified?action=extract-website    → 网站提取
/api/unified?action=generate-avatar    → 头像生成
/api/unified?action=google-maps-key    → Google Maps密钥
/api/unified?action=ocr-extract        → OCR提取
/api/unified?action=pdf-to-docx        → PDF转DOCX
/api/unified?action=save-language-preference → 保存语言偏好
/api/unified?action=track-language     → 跟踪语言
/api/unified?action=tools-research     → 工具研究
/api/unified?action=create-tool-story  → 创建工具故事
```

## 使用方法

### 1. 环境变量检查
```bash
curl https://your-app.vercel.app/api/unified?action=check-env
```

### 2. 数据重新配置
```bash
curl -X POST https://your-app.vercel.app/api/unified?action=reconfigure \
  -H "Content-Type: application/json" \
  -d '{"token": "admin-token-123"}'
```

### 3. Web界面
访问：`https://your-app.vercel.app/reconfigure`

## 部署验证

### 检查Serverless Functions数量
1. 进入Vercel Dashboard
2. 选择项目
3. 查看"Functions"标签
4. 确认只有1个函数：`unified`

### 测试API端点
```bash
# 测试环境变量检查
curl https://your-app.vercel.app/api/unified?action=check-env

# 测试重新配置
curl -X POST https://your-app.vercel.app/api/unified?action=reconfigure \
  -H "Content-Type: application/json" \
  -d '{"token": "admin-token-123"}'
```

## 进一步优化建议

### 1. 升级到Pro计划
- 移除Serverless Functions数量限制
- 获得更多功能和资源
- 适合生产环境使用

### 2. 代码分割
- 将大型API处理器分割成更小的模块
- 使用动态导入减少初始加载时间
- 优化内存使用

### 3. 缓存策略
- 实现API响应缓存
- 减少重复计算
- 提高响应速度

## 故障排除

### 常见问题

1. **"Function timeout"**
   - 增加函数执行时间限制
   - 优化代码性能
   - 考虑异步处理

2. **"Memory limit exceeded"**
   - 减少内存使用
   - 优化数据处理逻辑
   - 考虑分批处理

3. **"Cold start delay"**
   - 使用预热机制
   - 优化函数初始化
   - 考虑保持连接

### 监控和调试

1. **查看函数日志**
   - Vercel Dashboard → Functions
   - 查看实时日志
   - 分析性能指标

2. **性能监控**
   - 监控响应时间
   - 跟踪错误率
   - 优化瓶颈

## 成功部署后

部署成功后，您可以：
1. 访问 `/reconfigure` 页面运行数据重新配置
2. 使用统一的API端点进行各种操作
3. 享受Hobby计划的所有功能

## 下一步

1. **测试部署**：确认所有功能正常工作
2. **运行重新配置**：使用Web界面或API
3. **验证结果**：检查AI公司目录页面
4. **监控性能**：观察系统运行状况
