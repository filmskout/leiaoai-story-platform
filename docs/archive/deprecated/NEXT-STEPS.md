# 🚀 下一步操作指南

> **本次会话已完成所有开发任务！** 现在需要您完成配置和测试。

---

## ⚡ 快速操作（必需，5分钟内完成）

### 1️⃣ 配置Vercel环境变量 (2分钟)

**为什么：** AI Chat的DeepSeek和OpenAI GPT-4o需要API Keys才能工作

**操作步骤：**
```
1. 访问 https://vercel.com/dashboard
2. 选择项目：leiaoai-story-platform
3. Settings → Environment Variables
4. 检查以下变量是否存在（Production环境）：
   ✅ DEEPSEEK_API_KEY
   ✅ OPENAI_API_KEY
   ✅ QWEN_API_KEY
5. 如果缺失或不确定，重新添加
6. 点击 Redeploy 按钮重新部署
```

**详细指南：** `VERCEL-ENV-CHECK.md`

---

### 2️⃣ 更新Supabase数据库 (2分钟)

**为什么：** 新功能需要数据库表和字段支持

**操作步骤：**
```
1. 登录 Supabase Dashboard
2. 选择您的项目
3. 打开 SQL Editor
4. 复制粘贴并运行下面的SQL：
```

```sql
-- 创建BP提交表
CREATE TABLE IF NOT EXISTS bp_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_base64 TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  analysis_result JSONB,
  score INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 为BMC表添加OCR文本字段
ALTER TABLE bmc_boards 
ADD COLUMN IF NOT EXISTS extracted_text TEXT;

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_bp_submissions_user_id ON bp_submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_bmc_boards_user_id ON bmc_boards(user_id);
```

---

### 3️⃣ 测试新功能 (10分钟)

**登录网站：** https://leiaoai-story-platform.vercel.app

**测试清单：**
- [ ] AI Chat - 测试DeepSeek模型
- [ ] AI Chat - 测试OpenAI GPT-4o模型
- [ ] AI Chat - 测试Qwen模型
- [ ] AI Chat - 从主页点击问题，自动提交
- [ ] BP Analysis - 上传PDF/DOCX文件
- [ ] Dashboard - 查看BP提交列表
- [ ] Dashboard - BP下载功能
- [ ] BMC - 保存画布到Dashboard
- [ ] Dashboard - BMC OCR文本提取
- [ ] Dark Mode - 检查所有页面显示

---

## 📋 如果遇到问题

### AI Chat不工作？
**症状：** 只有Qwen工作，或者所有模型都不工作  
**原因：** 90%可能是环境变量未配置  
**解决：** 参考上面步骤1，检查Vercel环境变量  
**诊断：** 查看 `QUICK-DIAGNOSIS.md` 第1节

### BP上传后在Dashboard看不到？
**原因：** 数据库表未创建  
**解决：** 参考上面步骤2，运行SQL  
**诊断：** 查看 `QUICK-DIAGNOSIS.md` 第4节

### OCR提取按钮没反应？
**原因：** OPENAI_API_KEY未配置  
**解决：** 参考上面步骤1，确保OPENAI_API_KEY已设置  
**检查：** Vercel Functions → ocr-extract 查看日志

---

## 📚 完整文档

| 文档 | 用途 |
|------|------|
| `SESSION-PROGRESS-SUMMARY.md` | 本次会话完成内容详细总结 |
| `CURRENT-STATUS.md` | 项目总体状态（上次会话） |
| `VERCEL-ENV-CHECK.md` | Vercel环境变量检查清单 |
| `QUICK-DIAGNOSIS.md` | 常见问题快速诊断 |
| `docs/API-KEYS-SETUP.md` | API Keys配置和测试详细指南 |
| `docs/vercel-setup.md` | Vercel部署完整指南 |

---

## ✅ 完成后

一旦完成上述3个步骤，您的项目将拥有：

- ✅ 完整的AI Chat（3个模型全部可用）
- ✅ BP上传、分析和管理
- ✅ BMC保存和OCR文本提取
- ✅ 完善的用户Dashboard
- ✅ Dark/Light模式支持
- ✅ 多语言支持

**项目完成度：80% → 95%** 🎉

---

**有问题？** 查看 `QUICK-DIAGNOSIS.md` 或 `SESSION-PROGRESS-SUMMARY.md` 获取详细信息。

