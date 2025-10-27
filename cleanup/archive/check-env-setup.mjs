#!/usr/bin/env node

// 从Vercel Dashboard获取环境变量的指南脚本
console.log(`
🔧 从Vercel获取环境变量的方法：

方法1: 使用Vercel CLI (推荐)
1. 安装Vercel CLI:
   npm install -g vercel

2. 登录Vercel:
   vercel login

3. 拉取环境变量:
   vercel env pull .env.local

4. 运行迁移脚本:
   node migrate-aiverse-logos-to-storage.mjs

方法2: 手动从Vercel Dashboard获取
1. 访问: https://vercel.com/dashboard
2. 选择你的项目: leiaoai-story-platform
3. 进入 Settings > Environment Variables
4. 复制以下变量的值:
   - SUPABASE_URL
   - SUPABASE_SERVICE_ROLE_KEY

方法3: 使用Vercel API
1. 获取Vercel API Token: https://vercel.com/account/tokens
2. 运行以下命令获取环境变量:
   curl -H "Authorization: Bearer YOUR_VERCEL_TOKEN" \\
   "https://api.vercel.com/v1/env?projectId=YOUR_PROJECT_ID"

方法4: 直接设置环境变量运行
export SUPABASE_URL="你的SUPABASE_URL"
export SUPABASE_SERVICE_ROLE_KEY="你的SUPABASE_SERVICE_ROLE_KEY"
node migrate-aiverse-logos-to-storage.mjs
`);

// 检查当前环境变量
console.log('\n📋 当前环境变量状态:');
console.log('SUPABASE_URL:', process.env.SUPABASE_URL ? '✅ 已设置' : '❌ 未设置');
console.log('SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅ 已设置' : '❌ 未设置');

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.log('\n⚠️  环境变量未设置，请选择上述方法之一来设置环境变量');
} else {
  console.log('\n✅ 环境变量已设置，可以直接运行迁移脚本');
  console.log('运行命令: node migrate-aiverse-logos-to-storage.mjs');
}
