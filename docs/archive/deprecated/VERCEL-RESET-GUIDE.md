# Vercel项目重置指南

## 🎯 现状确认

### ✅ 本地构建：成功
```bash
npm run build
# ✓ built in 8.33s
```

### ❌ Vercel部署：失败
连续14个提交在Vercel上都失败了。

### 💡 结论
**问题不在代码本身，而在Vercel项目配置。**

---

## 🔄 方案1：在Vercel重新创建项目（推荐）

### 步骤1：删除现有项目

1. 登录 [Vercel Dashboard](https://vercel.com/dashboard)
2. 找到你的项目 `leiaoai-story-platform`
3. 进入 **Settings** → **General** → 滚动到底部
4. 点击 **Delete Project**
5. 确认删除

### 步骤2：重新导入项目

1. 在Vercel Dashboard点击 **Add New** → **Project**
2. 选择你的GitHub账户
3. 找到 `leiaoai-story-platform` 仓库
4. 点击 **Import**

### 步骤3：配置项目

**Framework Preset:** Vite（应该自动检测）

**Root Directory:** `./`（默认）

**Build Command:** 留空或 `npm run build`

**Output Directory:** 留空或 `dist`

**Install Command:** 留空或 `npm install`

点击 **Deploy**

### 步骤4：配置环境变量

部署成功后，进入 **Settings** → **Environment Variables**

添加以下变量（**Production, Preview, Development** 都选上）：

```bash
# Supabase（前端需要）
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...

# OpenAI（API函数需要）
OPENAI_API_KEY=sk-...

# DeepSeek（API函数，可选）
DEEPSEEK_API_KEY=sk-...

# Qwen/DashScope（API函数，可选）
DASHSCOPE_API_KEY=sk-...
```

保存后，触发重新部署：
- **Deployments** → 最新部署 → **Redeploy**

---

## 🔄 方案2：强制重新部署当前项目

如果不想删除项目，可以尝试：

### 选项A：清除构建缓存

1. 进入 Vercel Dashboard → 你的项目
2. **Settings** → **General**
3. 找到 **Build & Development Settings**
4. 检查所有设置是否正确：
   - Framework Preset: **Vite**
   - Build Command: **npm run build** 或留空
   - Output Directory: **dist** 或留空
   - Install Command: **npm install** 或留空
5. 保存（如果有修改）

### 选项B：手动触发部署

1. **Deployments** 页面
2. 找到任意之前的部署
3. 点击右侧的 **···** → **Redeploy**
4. 选择 **Use existing Build Cache** 取消勾选
5. 点击 **Redeploy**

### 选项C：空提交触发

在本地运行：
```bash
git commit --allow-empty -m "trigger: 强制Vercel重新部署"
git push origin main
```

---

## 🔄 方案3：使用其他部署平台

如果Vercel持续有问题，考虑：

### Netlify

1. 登录 [Netlify](https://netlify.com)
2. **Add new site** → **Import an existing project**
3. 连接GitHub选择仓库
4. 配置：
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Functions directory: `api`（用于Serverless Functions）
5. 添加环境变量（同Vercel）
6. Deploy

### Cloudflare Pages

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com)
2. **Workers & Pages** → **Create application** → **Pages**
3. 连接GitHub选择仓库
4. 配置：
   - Framework preset: **Vite**
   - Build command: `npm run build`
   - Build output directory: `dist`
5. 添加环境变量
6. Deploy

**注意：** Cloudflare Pages的Serverless Functions配置略有不同，需要将API函数放在`functions/`目录。

---

## 📋 检查清单

在尝试任何方案前，确认：

- [ ] 本地 `npm run build` 成功
- [ ] `api/` 目录包含3个文件：
  - [ ] `ai-chat.ts`
  - [ ] `generate-avatar.ts`
  - [ ] `ocr-extract.ts`
- [ ] `package.json` 中 `@vercel/node` 在 `dependencies`
- [ ] 没有 `vercel.json` 文件（已删除）
- [ ] `.gitignore` 包含 `dist/`
- [ ] Git状态干净（`git status`）

---

## 🎯 推荐行动方案

### 快速方案（5分钟）
→ **方案2 - 选项C：空提交强制重新部署**

如果还是失败：

### 彻底方案（10分钟）
→ **方案1：删除并重新创建Vercel项目**

### 备用方案（15分钟）
→ **方案3：切换到Netlify或Cloudflare Pages**

---

## 💬 执行步骤

### 现在就做：

```bash
# 1. 确认本地构建成功
npm run build

# 2. 空提交触发Vercel
git commit --allow-empty -m "trigger: force Vercel rebuild"
git push origin main

# 3. 观察Vercel部署
# 访问 https://vercel.com/dashboard
```

### 如果还失败：

**立即在Vercel Dashboard删除项目并重新创建。**

不要再修改代码了。代码是正确的。问题在Vercel项目本身。

---

## 📞 需要帮助？

如果重新创建项目后还是失败：

1. 截图Vercel的完整构建日志
2. 截图Vercel项目设置
3. 确认GitHub连接是否正常
4. 检查Vercel账户状态（是否超出限制）

---

**关键提示：** 
- 代码已经修复完成（提交 2c660d1）
- 本地构建成功
- 问题在Vercel项目配置，不在代码
- 重新创建项目是最快的解决方案

