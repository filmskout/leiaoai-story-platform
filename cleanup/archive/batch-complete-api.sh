#!/bin/bash
# 批量补齐公司数据 - 通过API调用

ADMIN_TOKEN="R8mn6AEgDmpKaAxE56XrejEbrL6AfBEn"

echo "🚀 开始批量补齐公司数据..."
echo ""
echo "📝 步骤1: 检查数据完整性"
curl -X POST "https://leiao.ai/api/unified" \
  -H "Content-Type: application/json" \
  -d '{
    "action": "check-data-completeness",
    "token": "'$ADMIN_TOKEN'"
  }'

echo ""
echo ""
echo "📊 步骤2: 开始批量补齐（处理前10家公司作为测试）"
curl -X POST "https://leiao.ai/api/unified" \
  -H "Content-Type: application/json" \
  -d '{
    "action": "batch-complete-companies",
    "token": "'$ADMIN_TOKEN'",
    "batchSize": 10,
    "limit": 10
  }'

echo ""
echo ""
echo "✅ 批量补齐完成！"
