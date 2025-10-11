# Professional Services Area Category Statistics 功能

生成时间: 2025年10月11日

---

## 🎯 功能概述

为每个专业服务区卡片添加session启动统计，显示从该卡片启动的AI Chat session数量。

---

## ✨ 功能特性

### 1. 随机初始显示 (150-500)
- 每个category显示一个随机数字（150-500之间）
- 使用category key作为随机种子，确保数字稳定
- 每次页面刷新显示相同的初始数字

### 2. 真实数据替换
- 当category的实际session数≥50时，自动切换显示真实数字
- 实时从数据库查询最新统计
- 每30秒自动刷新一次数据

### 3. 视觉设计
- 在卡片右上角显示Badge
- 包含Users图标 + 数字
- 使用主题色（Primary）配色
- 支持深色模式
- 数字使用千位分隔符格式化

---

## 📊 实现细节

### 数据查询
```typescript
// 从chat_sessions表查询所有category
const { data, error } = await supabase
  .from('chat_sessions')
  .select('category')
  .not('category', 'is', null);

// 统计每个category的数量
const stats: Record<string, number> = {};
data.forEach((session) => {
  const category = session.category;
  if (category) {
    stats[category] = (stats[category] || 0) + 1;
  }
});
```

### 随机数生成
```typescript
// 使用category key生成稳定的hash值作为随机种子
const getInitialDisplayCount = (categoryKey: string) => {
  let hash = 0;
  for (let i = 0; i < categoryKey.length; i++) {
    hash = ((hash << 5) - hash) + categoryKey.charCodeAt(i);
    hash = hash & hash;
  }
  const seed = Math.abs(hash);
  const random = (seed % 351) + 150; // 150 to 500
  return random;
};
```

### 显示逻辑
```typescript
const getDisplayCount = (categoryKey: string) => {
  const realCount = categoryStats[categoryKey] || 0;
  const initialCount = getInitialDisplayCount(categoryKey);
  
  // 如果真实数字≥50，显示真实数字；否则显示随机数字
  return realCount >= 50 ? realCount : initialCount;
};
```

### UI组件
```tsx
<Badge 
  variant="secondary" 
  className="flex items-center gap-1 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 border-primary-200 dark:border-primary-800"
>
  <Users size={12} />
  <span className="font-semibold">{getDisplayCount(area.key).toLocaleString()}</span>
</Badge>
```

---

## 🔧 修改的文件

### 主要修改:
**src/components/professional/ExpertiseCards.tsx**
- 导入`Badge`, `Users`, `supabase`
- 添加`categoryStats` state
- 实现`getInitialDisplayCount` (稳定随机数生成)
- 实现`loadCategoryStats` (从数据库加载统计)
- 实现`getDisplayCount` (决定显示随机或真实数字)
- 在卡片UI中添加Badge显示统计
- 每30秒自动刷新统计数据

---

## 📈 12个专业服务区的category keys

1. `cvc_investment` - CVC投资
2. `ma_restructuring` - 并购重组
3. `ipo_a_share` - A股IPO
4. `ipo_hk_share` - 港股IPO
5. `ipo_us_share` - 美股IPO
6. `spac_listing` - SPAC上市
7. `macro_analysis` - 宏观分析
8. `investment_environment` - 投资环境
9. `valuation_adjustment` - 估值调整
10. `exit_strategy` - 退出策略
11. `valuation_model` - 估值模型
12. `due_diligence` - 尽职调查

---

## 🎨 UI效果

### 卡片布局:
```
┌─────────────────────────────────────┐
│  [图标]              [Badge: 👥 327] │
│                                      │
│  CVC投资                             │
│                                      │
│  建议问题:                           │
│  → 如何评估CVC投资的价值？           │
│  → ...                               │
│                                      │
│  点击获取专业建议            →      │
└─────────────────────────────────────┘
```

### Badge样式:
- 浅色模式: 浅蓝背景 + 深蓝文字
- 深色模式: 深蓝半透明背景 + 浅蓝文字
- Users图标 (12px)
- 数字使用千位分隔符 (如: 1,234)

---

## 🧪 测试场景

### 场景1: 初始显示 (< 50 sessions)
```
访问主页 → 查看专业服务区
预期: 每个卡片显示150-500之间的随机数字
验证: 刷新页面，数字保持不变
```

### 场景2: 真实数据显示 (≥ 50 sessions)
```
某category的session达到50个
预期: Badge显示真实数字（如52）
验证: 控制台日志显示真实统计
```

### 场景3: 实时更新
```
等待30秒
预期: 自动刷新统计数据
验证: 控制台显示"🟢 Category stats loaded"
```

### 场景4: 数据库查询
```sql
-- 查看每个category的session数量
SELECT category, COUNT(*) as count
FROM chat_sessions
WHERE category IS NOT NULL
GROUP BY category
ORDER BY count DESC;
```

---

## 📊 数据库依赖

### 必需表:
- `chat_sessions` 表
  - `category` 字段 (TEXT, nullable)
  - 已在之前的修复中添加

### 查询性能:
- 查询所有category字段 (轻量级)
- 前端聚合统计 (不增加数据库负载)
- 每30秒刷新一次 (合理频率)

---

## 🎯 用户体验

### 心理效果:
- 初始显示随机数字（150-500）营造"活跃"氛围
- 当真实数据≥50时切换，展示真实增长
- 数字变化激励用户参与

### 技术优势:
- 稳定的随机数（基于category key）
- 自动刷新保持数据最新
- 不影响页面加载性能
- 支持深色模式

---

## 💡 未来增强建议

### 1. 趋势图标
```typescript
// 显示7天增长趋势
<Badge>
  <TrendingUp size={12} />
  <span>+12%</span>
</Badge>
```

### 2. 排行榜
```typescript
// 标记最热门的category
{isTopCategory && <Badge variant="destructive">🔥 HOT</Badge>}
```

### 3. 详细统计弹窗
```typescript
// 点击Badge显示详细统计
<Dialog>
  <DialogContent>
    <h3>{area.name} 统计</h3>
    <p>总sessions: {count}</p>
    <p>7天增长: +{weeklyGrowth}%</p>
    <p>最活跃时间: {peakHour}</p>
  </DialogContent>
</Dialog>
```

### 4. 动画效果
```typescript
// 数字增长动画
<motion.span
  key={displayCount}
  initial={{ scale: 1.2, color: '#22c55e' }}
  animate={{ scale: 1, color: 'inherit' }}
  transition={{ duration: 0.3 }}
>
  {displayCount}
</motion.span>
```

---

## 🔍 调试日志

### 成功日志:
```
🔵 Loading category stats from database
🟢 Category stats loaded: {
  cvc_investment: 45,
  ma_restructuring: 52,
  ipo_a_share: 67,
  ...
}
```

### 预期行为:
- 初始加载: 显示随机数字（150-500）
- 达到阈值: 自动切换到真实数字
- 定期刷新: 每30秒更新一次
- 格式化: 数字使用千位分隔符

---

## 🎊 总结

成功实现专业服务区category统计功能：

✅ **随机初始显示** - 150-500之间的稳定随机数  
✅ **真实数据替换** - ≥50时显示真实统计  
✅ **自动刷新** - 每30秒更新一次  
✅ **UI集成** - Badge + Users图标  
✅ **性能优化** - 轻量级查询 + 前端聚合  
✅ **深色模式支持** - 完整主题适配  

代码已提交并准备部署！🚀

---

**实现时间**: 2025年10月11日  
**修改文件**: 1个 (`src/components/professional/ExpertiseCards.tsx`)  
**新增代码**: ~60行  
**影响功能**: 专业服务区卡片 + 统计显示

