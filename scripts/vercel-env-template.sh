#!/usr/bin/env bash
# 用法：将此脚本内容复制到你的 CI 或本地，按需替换占位符后执行
# 注意：勿在仓库中保存真实密钥

set -euo pipefail

# 示例：添加环境变量到 Vercel（需要已登陆 vercel CLI 并处于正确 scope）
# vercel env add <NAME> <VALUE> <ENV>

vercel env add VITE_SUPABASE_URL <your_supabase_url> production
vercel env add VITE_SUPABASE_ANON_KEY <your_supabase_anon_key> production

# 可选（按需开启；生产不建议直接暴露真实 AI Key）
# vercel env add VITE_DEEPSEEK_API_KEY <dev_only_key> preview
# vercel env add VITE_OPENAI_API_KEY <dev_only_key> preview
# vercel env add VITE_QWEN_API_KEY <dev_only_key> preview
# vercel env add GOOGLE_MAPS_API_KEY <maps_key> production
# vercel env add VITE_APP_URL https://leiaoai-story-platform.vercel.app production

echo "Vercel env template applied (placeholders). Please replace with real values in CI or local."
