# AI公司数据增强和Stories集成系统

## 项目概述

本项目实现了AI公司数据的全面增强和Stories系统的互联互通，包括：

1. **UI优化**：修复了移动端显示问题和专业领域组件布局
2. **数据增强**：海外和国内AI公司数据的搜索、翻译和新闻集成
3. **Stories系统**：新闻搜索、内容生成和页面互联互通
4. **评分系统**：用户评分和评论功能
5. **网络搜索**：真实的新闻搜索API实现

## 主要功能

### 1. UI优化修复

#### QuickAIChatInput组件移动端优化
- ✅ 修复了3条建议提问显示不全的问题
- ✅ 移动端隐藏了"Ask me about investment..."提示文字
- ✅ 优化了AI响应区域高度（移动端80px，桌面端120px）
- ✅ 改进了建议问题的布局和换行显示

#### 专业领域组件空间配置优化
- ✅ 移除了上下方中央的多余按钮
- ✅ 优化了左右导航按钮位置，放在角落不挡住内容
- ✅ 压缩了空间配置，提高了显示效率
- ✅ 移除了垂直导航按钮样式

### 2. 数据增强系统

#### 海外公司数据增强 (`enhanced_overseas_companies.ts`)
- 🔍 **搜索策略**：使用英文进行搜索配置
- 🌐 **新闻搜索**：主流AI公司15-20篇，普通AI公司8-12篇，新晋AI公司5-8篇
- 📝 **内容生成**：每篇报道用英文生成350-500字总结发布到Stories
- 🏷️ **标签系统**：用公司名、工具名和报道分类为标签
- 🔄 **翻译功能**：搜索到的英文内容翻译为简体中文

#### 国内公司数据增强 (`enhanced_domestic_companies.ts`)
- 🔍 **搜索策略**：使用中文进行搜索配置
- 🌐 **新闻搜索**：主流AI公司15-20篇，普通AI公司8-12篇，新晋AI公司5-8篇
- 📝 **内容生成**：每篇报道用中文生成350-500字总结发布到Stories
- 🏷️ **标签系统**：用公司名、工具名和报道分类为标签
- 🔄 **翻译功能**：搜索到的中文内容翻译为英文

### 3. Stories互联互通系统

#### 数据库结构 (`stories_integration.ts`)
- 📊 **company_stories表**：公司-Stories关联表
- 📊 **tool_stories表**：工具-Stories关联表
- 📊 **company_ratings表**：公司评分表
- 📊 **tool_ratings表**：工具评分表

#### 功能特性
- 🔗 **双向关联**：Stories详情页点击公司/工具标签回链到公司详情页
- ↩️ **返回功能**：包含返回键回到上一个来时的页面
- ⭐ **评分系统**：Stories详情也能在标签公司/工具显示给出打分
- 🏷️ **标签导航**：点击标签直接跳转到相关页面

### 4. 网络搜索API (`web_search_api.ts`)

#### 搜索功能
- 🔍 **真实搜索**：使用OpenAI的web搜索功能
- 🔄 **备用方案**：当真实搜索不可用时使用模拟搜索
- 🌐 **多语言支持**：支持英文和中文搜索
- 📊 **质量控制**：搜索结果验证和质量评分

#### API接口
```typescript
// 搜索公司新闻
searchCompanyNews(options: NewsSearchOptions): Promise<SearchResult[]>

// 搜索特定公司
searchSpecificCompanyNews(companyName: string, language: 'en' | 'zh', articleCount: number): Promise<SearchResult[]>

// 批量搜索
batchSearchCompanyNews(companies: string[], language: 'en' | 'zh', articleCountPerCompany: number): Promise<Record<string, SearchResult[]>>

// 验证搜索结果
validateSearchResults(results: SearchResult[]): { valid: SearchResult[], invalid: SearchResult[], qualityScore: number }
```

### 5. 重新配置系统 (`comprehensive_reconfiguration.ts`)

#### 执行步骤
1. **数据清理**：清理现有凌乱的数据，重置数据库
2. **海外公司数据增强**：使用GPT-5获取海外AI公司最新信息，搜索新闻并生成Stories
3. **国内公司数据增强**：使用DeepSeek获取国内AI公司最新信息，搜索新闻并生成Stories
4. **Stories互联互通**：设置Stories与公司/工具页面的互联互通，创建评分系统
5. **定期更新机制**：设置定期更新机制和跟踪表

## 技术实现

### 环境变量配置
```bash
# 必需环境变量
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
OPENAI_API_KEY=your_openai_api_key

# 可选环境变量
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
DEEPSEEK_API_KEY=your_deepseek_api_key
```

### 数据库表结构

#### company_stories表
```sql
CREATE TABLE company_stories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  story_id UUID NOT NULL REFERENCES stories(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(company_id, story_id)
);
```

#### tool_stories表
```sql
CREATE TABLE tool_stories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tool_id UUID NOT NULL REFERENCES tools(id) ON DELETE CASCADE,
  story_id UUID NOT NULL REFERENCES stories(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(tool_id, story_id)
);
```

#### 评分表
```sql
-- 公司评分表
CREATE TABLE company_ratings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(company_id, user_id)
);

-- 工具评分表
CREATE TABLE tool_ratings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tool_id UUID NOT NULL REFERENCES tools(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(tool_id, user_id)
);
```

## 使用方法

### 1. 运行重新配置
```bash
# 通过web界面
访问 https://leiao.ai/reconfigure

# 通过命令行
npm run reconfigure-all
```

### 2. 检查数据状态
```bash
npm run check-data
```

### 3. 单独运行脚本
```bash
# 海外公司数据增强
tsx scripts/enhanced_overseas_companies.ts

# 国内公司数据增强
tsx scripts/enhanced_domestic_companies.ts

# Stories互联互通设置
tsx scripts/stories_integration.ts
```

## 预期结果

### 数据增强效果
- 📈 **公司数量**：114家AI公司完整配置
- 📰 **新闻文章**：每家公司5-20篇相关新闻
- 📝 **Stories内容**：每篇新闻生成350-500字专业总结
- 🏷️ **标签系统**：完整的公司、工具、分类标签

### 用户体验提升
- 📱 **移动端优化**：更好的移动端显示效果
- 🔗 **页面互联**：Stories与公司/工具页面无缝连接
- ⭐ **评分功能**：用户可以对公司和工具进行评分
- 🔄 **返回导航**：便捷的页面返回功能

### 内容质量保证
- 🌐 **多语言支持**：中英文双语内容
- 📊 **质量控制**：搜索结果验证和质量评分
- 🔄 **定期更新**：自动化的内容更新机制
- 📈 **数据完整性**：完整的数据关联和验证

## 注意事项

1. **API限制**：注意OpenAI API的调用频率限制
2. **数据质量**：定期检查生成内容的准确性
3. **存储空间**：监控数据库存储空间使用情况
4. **性能优化**：大量数据操作时注意性能影响

## 后续优化建议

1. **缓存机制**：实现搜索结果缓存，减少API调用
2. **内容审核**：添加AI生成内容的审核机制
3. **用户反馈**：收集用户对生成内容的反馈
4. **个性化推荐**：基于用户行为推荐相关Stories
5. **多语言扩展**：支持更多语言的搜索和翻译

---

**项目完成时间**：2024年1月20日  
**版本**：v1.0.0  
**状态**：✅ 已完成
