#!/bin/bash

echo "🧪 测试tsx命令修复..."
echo "════════════════════════════════════════════════════════════"

echo "📋 检查npx是否可用:"
if command -v npx &> /dev/null; then
    echo "✅ npx 可用"
    npx --version
else
    echo "❌ npx 不可用"
    exit 1
fi

echo ""
echo "📋 检查tsx是否可通过npx运行:"
if npx tsx --version &> /dev/null; then
    echo "✅ npx tsx 可用"
    npx tsx --version
else
    echo "❌ npx tsx 不可用"
    exit 1
fi

echo ""
echo "📋 测试脚本执行权限:"
if [ -f "scripts/verify_configuration.ts" ]; then
    echo "✅ 验证脚本存在"
    echo "🔄 运行验证脚本..."
    npx tsx scripts/verify_configuration.ts
else
    echo "❌ 验证脚本不存在"
fi

echo ""
echo "🎉 tsx命令修复测试完成！"
echo "现在可以通过以下方式运行重新配置:"
echo "1. Web界面: https://leiao.ai/reconfigure"
echo "2. 命令行: npm run reconfigure-all"
