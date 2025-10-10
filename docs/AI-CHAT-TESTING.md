# AI Chat 三模型集成测试指南

本文档说明如何测试平台支持的三个 AI 模型（DeepSeek、OpenAI GPT-4o、Qwen Turbo）的问答工作流。

## 前置条件

1. 已部署到 Vercel 并配置环境变量：
   - `DEEPSEEK_API_KEY`
   - `OPENAI_API_KEY`
   - `QWEN_API_KEY`

2. 已登录用户账号（用于会话持久化）

## 测试流程

### 1. 访问 AI Chat 页面

访问：`https://leiaoai-story-platform.vercel.app/ai-chat`

### 2. 模型选择测试

**步骤：**
1. 点击右上角的模型选择器（默认显示当前选中模型）
2. 验证以下模型可选：
   - DeepSeek
   - OpenAI GPT-4o
   - Qwen Turbo
3. 根据浏览器语言，系统会推荐不同的默认模型：
   - 中文用户：推荐 DeepSeek
   - 其他语言用户：推荐 OpenAI GPT-4o

### 3. 模型问答测试

对每个模型执行以下测试：

#### Test Case 1: DeepSeek 模型
```
问题：请分析一个初创企业的商业模式画布应该包含哪些关键要素？

预期结果：
- ✅ AI 响应生成成功
- ✅ 响应内容包含 Markdown 格式渲染（标题、列表等）
- ✅ 显示模型名称："DeepSeek"
- ✅ 显示处理时间（秒）
- ✅ 消息保存到 chat_sessions 和 chat_messages 表
```

#### Test Case 2: OpenAI GPT-4o 模型
```
问题：What are the key components of a successful venture capital pitch deck?

预期结果：
- ✅ AI 响应生成成功
- ✅ 响应内容包含 Markdown 格式渲染
- ✅ 显示模型名称："gpt-4o"
- ✅ 显示处理时间（秒）
- ✅ 消息保存到数据库
```

#### Test Case 3: Qwen Turbo 模型
```
问题：如何评估一个科技创业项目的投资价值？

预期结果：
- ✅ AI 响应生成成功
- ✅ 响应内容包含 Markdown 格式渲染
- ✅ 显示模型名称："qwen-turbo"
- ✅ 显示处理时间（秒）
- ✅ 消息保存到数据库
```

### 4. Markdown 渲染测试

**测试问题：**
```
请用Markdown格式列出创业融资的5个阶段，包括标题、列表和代码示例。
```

**验证项：**
- ✅ 标题正确渲染（# ## ###）
- ✅ 列表正确渲染（有序/无序）
- ✅ 代码块正确高亮
- ✅ 粗体/斜体正确显示
- ✅ 链接可点击

### 5. 导出功能测试

**步骤：**
1. 在聊天框中点击"Export"按钮
2. 选择"Export as Markdown"：
   - ✅ 下载 `.md` 文件
   - ✅ 文件内容包含完整对话历史
3. 选择"Export as DOCX"：
   - ✅ 下载 `.docx` 文件
   - ✅ 文件可在 Word 中打开

### 6. 刷新消息测试

**步骤：**
1. 点击某条 AI 回复旁的"Refresh"按钮
2. 验证：
   - ✅ 显示加载状态
   - ✅ 使用相同模型重新生成响应
   - ✅ 新响应替换旧响应
   - ✅ 更新的消息保存到数据库

### 7. 会话持久化测试

**步骤：**
1. 发送几条消息创建会话
2. 刷新页面或关闭浏览器
3. 重新登录并访问 AI Chat
4. 验证：
   - ✅ 会话列表显示历史会话
   - ✅ 点击会话可恢复对话历史
   - ✅ 所有消息内容完整

### 8. Dashboard 查看测试

**步骤：**
1. 访问个人 Dashboard：`/dashboard`
2. 切换到"Activity"标签
3. 验证：
   - ✅ 显示最近的聊天会话（最多10条）
   - ✅ 显示会话标题、模型、消息数量
   - ✅ 显示创建时间
   - ✅ 点击会话可跳转到聊天页面

### 9. 非登录用户测试

**步骤：**
1. 退出登录
2. 访问 AI Chat 页面
3. 发送消息
4. 验证：
   - ✅ 可以正常使用 AI 对话
   - ✅ 消息不会保存到数据库
   - ✅ 刷新页面后对话历史丢失
   - ✅ Dashboard 不显示匿名会话

## 错误处理测试

### Test Case: API Key 错误
1. 暂时移除某个模型的 API Key（在 Vercel 环境变量中）
2. 尝试使用该模型
3. 验证：
   - ✅ 显示友好的错误提示
   - ✅ 不会导致页面崩溃
   - ✅ 可以切换到其他可用模型

### Test Case: 网络错误
1. 使用浏览器开发者工具模拟离线状态
2. 发送消息
3. 验证：
   - ✅ 显示网络错误提示
   - ✅ 用户可以重试

## 性能测试

### 响应时间基准
- DeepSeek: 通常 2-5 秒
- OpenAI GPT-4o: 通常 3-8 秒
- Qwen Turbo: 通常 2-4 秒

### 并发测试
1. 快速连续发送多条消息
2. 验证：
   - ✅ 消息按顺序处理
   - ✅ 不会出现消息混淆
   - ✅ 每条消息显示正确的模型和处理时间

## 数据库验证

### chat_sessions 表
```sql
SELECT * FROM chat_sessions WHERE user_id = '<your-user-id>' ORDER BY updated_at DESC LIMIT 5;
```

验证：
- ✅ session_id 唯一
- ✅ user_id 正确
- ✅ title 合理
- ✅ message_count 准确
- ✅ created_at 和 updated_at 正确

### chat_messages 表
```sql
SELECT * FROM chat_messages WHERE session_id = '<session-id>' ORDER BY created_at ASC;
```

验证：
- ✅ 消息按时间顺序排列
- ✅ role 为 'user' 或 'assistant'
- ✅ content 完整
- ✅ ai_model 正确标记（仅 assistant 消息）
- ✅ processing_time 有值（仅 assistant 消息）

## 回归测试清单

每次更新后，确保以下功能正常：

- [ ] 三个模型都可以正常选择和使用
- [ ] Markdown 渲染完整且美观
- [ ] 导出功能正常（Markdown 和 DOCX）
- [ ] 刷新消息功能正常
- [ ] 会话持久化正常
- [ ] Dashboard 正确显示聊天历史
- [ ] 非登录用户可以使用但不保存历史
- [ ] 错误处理友好
- [ ] 响应时间在合理范围内

## 故障排查

### 问题：模型选择器显示为空
- 检查 `supabase/functions/geo-ai-model-selection/index.ts`
- 检查浏览器控制台是否有错误
- 验证 AIContext 的 fallback 配置

### 问题：消息发送失败
- 检查 `/api/ai-chat` 函数日志（Vercel Dashboard）
- 验证环境变量配置正确
- 检查 API Key 是否有效且有配额

### 问题：会话不保存
- 检查用户是否已登录
- 验证 Supabase 表结构正确
- 检查 RLS 策略是否允许插入

## 相关文档
- [Vercel 部署指南](./vercel-setup.md)
- [API 配置文档](../README.md#environment-variables)
- [数据库 Schema](../supabase/migrations/)

