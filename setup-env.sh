#!/bin/bash

echo "🔧 AI公司数据重新配置系统 - 环境变量设置助手"
echo "════════════════════════════════════════════════════════════"

# 检查是否已有.env文件
if [ -f ".env" ]; then
    echo "⚠️ 发现现有.env文件"
    read -p "是否要覆盖现有配置？(y/N): " overwrite
    if [[ ! $overwrite =~ ^[Yy]$ ]]; then
        echo "❌ 取消设置"
        exit 1
    fi
fi

echo ""
echo "📋 请提供以下环境变量值："
echo ""

# 获取Supabase URL
read -p "🔗 Supabase URL (https://your-project.supabase.co): " supabase_url
if [ -z "$supabase_url" ]; then
    echo "❌ Supabase URL不能为空"
    exit 1
fi

# 获取Supabase Anon Key
read -p "🔑 Supabase Anon Key: " supabase_anon_key
if [ -z "$supabase_anon_key" ]; then
    echo "❌ Supabase Anon Key不能为空"
    exit 1
fi

# 获取Supabase Service Role Key
read -p "🔐 Supabase Service Role Key: " supabase_service_key
if [ -z "$supabase_service_key" ]; then
    echo "❌ Supabase Service Role Key不能为空"
    exit 1
fi

# 获取OpenAI API Key
read -p "🤖 OpenAI API Key: " openai_key
if [ -z "$openai_key" ]; then
    echo "❌ OpenAI API Key不能为空"
    exit 1
fi

# 获取DeepSeek API Key（可选）
read -p "🧠 DeepSeek API Key (可选，按Enter跳过): " deepseek_key

echo ""
echo "📝 创建.env文件..."

# 创建.env文件
cat > .env << EOF
# Supabase配置
SUPABASE_URL=$supabase_url
SUPABASE_ANON_KEY=$supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=$supabase_service_key

# OpenAI配置（用于海外AI公司数据）
OPENAI_API_KEY=$openai_key

# DeepSeek配置（用于国内AI公司数据，可选）
EOF

if [ ! -z "$deepseek_key" ]; then
    echo "DEEPSEEK_API_KEY=$deepseek_key" >> .env
else
    echo "# DEEPSEEK_API_KEY=your-deepseek-api-key" >> .env
fi

cat >> .env << EOF

# 备用VITE前缀变量（可选）
VITE_SUPABASE_URL=$supabase_url
VITE_SUPABASE_ANON_KEY=$supabase_anon_key
EOF

echo "✅ .env文件创建成功！"
echo ""
echo "🔍 验证环境变量..."
echo "SUPABASE_URL: ${supabase_url:0:30}..."
echo "SUPABASE_ANON_KEY: ${supabase_anon_key:0:20}..."
echo "SUPABASE_SERVICE_ROLE_KEY: ${supabase_service_key:0:20}..."
echo "OPENAI_API_KEY: ${openai_key:0:20}..."
if [ ! -z "$deepseek_key" ]; then
    echo "DEEPSEEK_API_KEY: ${deepseek_key:0:20}..."
fi

echo ""
echo "🚀 现在可以运行以下命令开始数据重新配置："
echo "   npm run reconfigure-all"
echo ""
echo "📖 如需更多帮助，请查看："
echo "   - docs/ENVIRONMENT_SETUP.md"
echo "   - docs/VERCEL_ENV_SETUP.md"
