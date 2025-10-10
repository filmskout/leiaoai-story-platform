### Vercel 部署与环境变量指南

本项目已配置 vercel.json，默认使用 Vite 构建，产物输出到 dist。推送到 main 分支会触发自动部署。

#### 一、前置条件
- 已绑定 GitHub 仓库到 Vercel 项目
- Node 版本 >= 18（Vercel 默认满足）
- 包管理器：pnpm（项目配置已兼容）

#### 二、构建配置（vercel.json）
- framework: vite
- installCommand: pnpm install
- buildCommand: pnpm build
- outputDirectory: dist
- rewrites: SPA 回退到 index.html

#### 三、环境变量（Vercel Dashboard > Project > Settings > Environment Variables）
必填（公共）
- VITE_SUPABASE_URL：Supabase 项目 URL
- VITE_SUPABASE_ANON_KEY：Supabase anon key

可选（按需）
- VITE_DEEPSEEK_API_KEY：仅限开发；生产请使用后端代理
- VITE_OPENAI_API_KEY
- VITE_QWEN_API_KEY
- VITE_GOOGLE_MAPS_API_KEY
- VITE_APP_URL：站点 URL

服务端专用（不暴露给浏览器）
- DEEPSEEK_API_KEY：在 Vercel 环境变量中配置（仅 Serverless Function 使用）。前端改为请求 `/api/ai-chat`，由该函数使用 `process.env.DEEPSEEK_API_KEY` 代理调用上游。

安全注意
- 任意 VITE_* 变量都会注入到浏览器，勿放置生产密钥。
- 生产应通过受保护后端代理访问上游 AI 服务。
- 若发现密钥泄露，立即在服务控制台吊销并旋转。

#### 四、部署步骤
1) 推送代码到 main：
```bash
git push origin main
```
2) 等待 Vercel 自动构建与部署完成。
3) 访问生产地址：`https://leiaoai-story-platform.vercel.app/`

#### 五、故障排查
- 构建失败：检查 Vercel 构建日志及环境变量配置。
- 404/白屏：确认 vercel.json 的 rewrites 指向 index.html。
- API 失败：确认未在前端暴露真实密钥；后端代理与 CORS 设置正确。

#### 六、相关源码
- 构建配置：vercel.json
- 环境读取：src/lib/apiConfig.ts 的 getAPIKey
- 通用说明：README.md

#### 七、参考
- 部署地址：https://leiaoai-story-platform.vercel.app/
