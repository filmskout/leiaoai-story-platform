# Story生成详细步骤指南

本指南将一步一步教您如何使用LLM生成包含项目评分的stories。

## 前置条件

1. ✅ 确保已登录管理员账户 (`admin@leiaoai.com`)
2. ✅ 已获得管理员权限（参考 `GRANT-ADMIN-ACCESS.md`）
3. ✅ Vercel/Supabase环境变量中已配置LLM API Key：
   - `QWEN_API_KEY` 或 `OPENAI_API_KEY`

## 方法一：通过UI界面生成（最简单，推荐）✨

### 步骤1：访问公司管理页面

1. 打开浏览器，访问：`https://leiao.ai/company-management`（或本地开发环境）
2. 确保已登录管理员账户
3. 如果没有管理员权限，页面会提示"权限不足"，点击"刷新权限状态"或"前往管理员登录"

### 步骤2：打开Story生成对话框

1. 在页面右上角找到 **"生成Stories"** 按钮（带有✨图标）
2. 点击 **"生成Stories"** 按钮
3. 会弹出一个对话框，标题为"使用LLM生成Stories"

### 步骤3：配置生成选项

在对话框中，您需要设置以下选项：

#### 选项1：选择公司（可选）
- **默认**：选择"所有公司"（为空），将为所有符合条件的公司生成stories
- **指定公司**：从下拉列表中选择特定公司，只为该公司生成stories
- **操作**：点击下拉框，选择公司或保持"所有公司"

#### 选项2：选择类别
- **默认**：`LLM & Language Models`
- **可选类别**：
  - `LLM & Language Models`
  - `Image Processing & Generation`
  - `Video Processing & Generation`
  - `Professional Domain Analysis`
  - `Virtual Companions`
  - `Virtual Employees & Assistants`
  - `Voice & Audio AI`
  - `Search & Information Retrieval`
- **操作**：点击类别下拉框，选择要生成story的项目类别

#### 选项3：设置生成数量
- **默认**：5个
- **范围**：1-20个
- **建议**：5-10个（每个story需要60-90秒）
- **操作**：在"生成数量"输入框中输入数字（如：5）

### 步骤4：开始生成

1. 确认所有选项已设置好
2. 点击 **"开始批量生成"** 按钮（带有✨图标）
3. 按钮会变为"生成中..."（带有旋转的加载图标）
4. 对话框下方会显示进度信息：
   - `开始批量生成 X 个stories...`
   - 生成过程中会显示实时状态

### 步骤5：等待生成完成

- **单个story**：需要60-90秒
- **5个stories**：约5-8分钟
- **10个stories**：约10-15分钟

**注意事项：**
- 生成过程中不要关闭对话框
- 可以查看对话框中的进度信息
- 完成后会显示成功/失败统计

### 步骤6：查看生成结果

1. 生成完成后，会显示：
   - `✅ 批量生成完成：X/Y 成功`（X为成功数，Y为总数）
   - 页面顶部会显示成功提示消息
2. 查看生成的stories：
   - 访问 `/stories` 页面查看所有stories
   - 或访问 `/story/{story-id}` 查看单个story
   - 在公司详情页可以看到相关的stories

### 为公司卡片快速生成

每个公司卡片右上角也有一个✨按钮：
1. 点击公司卡片右上角的 **✨图标**
2. 会直接打开Story生成对话框，并自动选中该公司
3. 设置类别和数量
4. 点击"开始批量生成"
5. 只会为该公司的项目生成stories

---

## 方法二：通过浏览器控制台生成（高级用户）

### 步骤1：打开浏览器开发者工具

1. 访问网站：`https://leiao.ai` 或本地开发环境
2. 登录管理员账户
3. 按 `F12` 或 `Cmd+Option+I` (Mac) 打开开发者工具
4. 点击 **"Console"（控制台）** 标签

### 步骤2：生成单个Story（为特定项目生成）

在控制台中复制粘贴以下代码，替换 `PROJECT_ID`：

```javascript
// 步骤2.1：设置项目ID（从公司详情页或项目管理页面获取）
const PROJECT_ID = 'your-project-id-here'; // 替换为实际项目ID

// 步骤2.2：调用生成API
fetch('/api/unified', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    action: 'generate-story',
    token: localStorage.getItem('leoai-admin-session') || 'admin-token-123',
    projectId: PROJECT_ID,
    category: 'LLM & Language Models' // 可选，会根据项目自动确定
  })
})
.then(res => res.json())
.then(data => {
  if (data.success) {
    console.log('✅ Story生成成功！');
    console.log('Story ID:', data.story.id);
    console.log('标题:', data.story.title);
    console.log('项目评分:', data.rating);
    console.log('来源媒体:', data.source_media);
    // 自动打开新生成的story页面
    window.open(`/story/${data.story.id}`, '_blank');
  } else {
    console.error('❌ 生成失败:', data.error);
    alert('生成失败: ' + data.error);
  }
})
.catch(error => {
  console.error('❌ 请求失败:', error);
  alert('请求失败: ' + error.message);
});
```

**执行步骤：**
1. 将上面的代码复制到控制台
2. 替换 `PROJECT_ID` 为实际的项目ID
3. 按 `Enter` 执行
4. 等待60-90秒（LLM需要时间搜索和生成）
5. 查看结果和控制台输出

### 步骤3：批量生成Stories（为某个类别的所有项目生成）

在控制台中复制粘贴以下代码：

```javascript
// 步骤3.1：选择类别
const CATEGORY = 'LLM & Language Models'; // 可选类别见下方列表
const COUNT = 10; // 要生成的数量

// 步骤3.2：调用批量生成API
fetch('/api/unified', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    action: 'generate-stories-batch',
    token: localStorage.getItem('leoai-admin-session') || 'admin-token-123',
    category: CATEGORY,
    count: COUNT
  })
})
.then(res => res.json())
.then(data => {
  if (data.success) {
    console.log('✅ 批量生成完成！');
    console.log('成功:', data.message);
    console.log('详细信息:', data.results);
    
    // 显示成功统计
    const successCount = data.results.filter(r => r.success).length;
    const failCount = data.results.filter(r => !r.success).length;
    alert(`生成完成：${successCount} 成功，${failCount} 失败`);
  } else {
    console.error('❌ 批量生成失败:', data.error);
    alert('批量生成失败: ' + data.error);
  }
})
.catch(error => {
  console.error('❌ 请求失败:', error);
  alert('请求失败: ' + error.message);
});
```

**执行步骤：**
1. 复制代码到控制台
2. 修改 `CATEGORY` 和 `COUNT`（可选）
3. 按 `Enter` 执行
4. 等待完成（每个story需要约2-3分钟）
5. 查看控制台输出

### 可用类别列表

```
- LLM & Language Models
- Image Processing & Generation
- Video Processing & Generation
- Professional Domain Analysis
- Virtual Companions
- Virtual Employees & Assistants
- Voice & Audio AI
- Search & Information Retrieval
```

## 方法二：通过公司详情页生成（推荐）

### 步骤1：访问公司详情页

1. 访问 `/ai-companies` 页面
2. 找到要生成story的公司
3. 点击公司卡片，进入公司详情页

### 步骤2：获取项目ID

1. 在公司详情页中找到项目列表
2. 右键点击项目名称，选择"检查元素"或"Inspect"
3. 在HTML中找到项目的 `data-project-id` 或查看链接中的项目ID
4. 或者打开浏览器控制台，运行：
```javascript
// 查看当前页面的项目信息
console.log('Projects on this page:', document.querySelectorAll('[data-project-id]'));
```

### 步骤3：生成Story

使用上面"方法一"中的步骤2代码，将获取到的项目ID填入。

## 方法三：通过项目管理页面生成（如果存在）

如果您有项目管理页面，可以：

1. 访问项目管理页面（如果有）
2. 找到要生成story的项目
3. 点击"生成Story"按钮（如果已实现UI）
4. 或使用控制台方法

## 如何查找项目ID？

### 方法A：从URL获取

如果项目有独立页面：
```
https://leiao.ai/project/123e4567-e89b-12d3-a456-426614174000
                                   ↑ 这就是项目ID
```

### 方法B：从数据库查询

在Supabase SQL Editor中运行：
```sql
SELECT id, name, project_category, company_id 
FROM projects 
WHERE company_id = 'your-company-id'
ORDER BY created_at DESC;
```

### 方法C：从浏览器控制台查询

在 `/ai-companies` 或公司详情页的控制台运行：
```javascript
// 获取所有项目ID
fetch('/api/unified?action=data-progress')
  .then(res => res.json())
  .then(data => {
    console.log('所有项目:', data.projects);
    // 查找特定项目
    const project = data.projects.find(p => p.name === '项目名称');
    console.log('项目ID:', project?.id);
  });
```

## 生成过程说明

### 单个Story生成流程

1. **验证权限** → 检查管理员token
2. **获取项目/公司信息** → 从数据库读取详细信息
3. **构建LLM提示** → 包含产品名称、描述、类别
4. **调用LLM搜索** → 在TechCrunch、The Verge等权威媒体搜索原文
5. **生成Story内容** → LLM基于搜索结果生成：
   - 标题（50-80字符）
   - 详细内容（600-1000字）
   - 摘要（120-180字符）
   - 标签（3-5个）
   - 项目评分（1-5星）
6. **保存到数据库** → 插入stories表
7. **关联项目和公司** → 创建关联记录
8. **更新项目评分** → 将评分写入projects表

**预计耗时：** 60-90秒/个

### 批量生成流程

1. **查询项目列表** → 根据类别/公司筛选
2. **逐个生成** → 对每个项目调用单个生成流程
3. **限流处理** → 每次请求间隔2秒，避免API限流
4. **统计结果** → 返回成功/失败统计

**预计耗时：** 10个项目约需20-30分钟

## 常见问题

### Q1: 提示"没有可用的LLM API"

**解决方法：**
1. 检查Vercel环境变量：
   - 进入 Vercel Dashboard → Project → Settings → Environment Variables
   - 确认 `QWEN_API_KEY` 或 `OPENAI_API_KEY` 已配置
2. 检查API Key是否有效
3. 检查是否有足够额度

### Q2: 生成失败，提示"LLM调用失败"

**可能原因：**
- API Key无效或过期
- 网络连接问题
- API额度用尽

**解决方法：**
1. 检查API Key有效性
2. 检查网络连接
3. 尝试使用另一个LLM API（切换Qwen/OpenAI）

### Q3: 生成时间太长

**说明：**
- 单个story需要60-90秒是正常的
- LLM需要搜索权威媒体并生成详细内容
- 批量生成会自动限流（每次间隔2秒）

**优化建议：**
- 批量生成时减少数量（如5个一组）
- 在非高峰期运行

### Q4: 生成的story没有评分

**检查：**
1. LLM响应中是否包含 `project_rating` 字段
2. 项目表是否有 `rating` 字段
3. 查看控制台错误信息

### Q5: 如何查看已生成的stories？

1. 访问 `/stories` 页面
2. 或访问 `/story/{story-id}` 查看单个story
3. 在数据库查询：
```sql
SELECT id, title, category, ai_generated, created_at 
FROM stories 
WHERE ai_generated = true 
ORDER BY created_at DESC;
```

## 验证生成结果

### 检查Story是否生成成功

```javascript
// 在控制台运行，查看最近生成的stories
fetch('/api/unified?action=data-progress')
  .then(res => res.json())
  .then(data => {
    console.log('最近的stories:', data.stories?.slice(0, 10));
  });
```

### 检查项目评分是否更新

```sql
-- 在Supabase SQL Editor中运行
SELECT name, rating, updated_at 
FROM projects 
WHERE rating IS NOT NULL 
ORDER BY updated_at DESC 
LIMIT 10;
```

## 最佳实践

1. **小批量测试**：先为1-2个项目生成，确认格式和内容符合要求
2. **分类生成**：按类别分批生成，便于管理和查看
3. **定期检查**：生成后检查story质量和评分准确性
4. **保存日志**：记录生成的项目和结果，便于追踪

## 下一步

生成stories后，您可以：
- 在 `/stories` 页面查看所有生成的stories
- 在项目详情页查看相关的stories
- 在公司详情页查看公司的所有stories
- 编辑story内容（如果有需要）

## 技术支持

如果遇到问题：
1. 检查浏览器控制台的错误信息
2. 查看Vercel函数日志（Function Logs）
3. 确认环境变量配置正确
4. 验证管理员权限是否有效

