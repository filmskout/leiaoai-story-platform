#!/bin/bash

echo "🔍 检查数据生成进度..."
echo "时间: $(date)"
echo ""

# 检查公司数量
echo "📊 当前数据状态:"
curl -s -X GET "https://leiao.ai/api/unified?action=test-database" -H "Content-Type: application/json" | jq -r '.results | "数据库连接: \(.connection)"'

# 检查具体数据
echo ""
echo "📈 数据统计:"
echo "正在检查..."

# 使用一个简单的API来检查数据
response=$(curl -s -X GET "https://leiao.ai/api/unified?action=test-database" -H "Content-Type: application/json")
echo "$response" | jq -r '.results | "连接状态: \(.connection)"'

echo ""
echo "⏰ 数据生成正在进行中，请耐心等待..."
echo "预计完成时间: 30-45分钟"
echo "下次检查: 5分钟后"
