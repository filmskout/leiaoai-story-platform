#!/bin/bash

# 批量补齐logo的curl命令
ADMIN_TOKEN="R8mn6AEgDmpKaAxE56XrejEbrL6AfBEn"

echo "开始批量补齐缺失的logo..."

curl -X POST "https://leiao.ai/api/unified" \
  -H "Content-Type: application/json" \
  -d '{
    "action": "batch-complete-logos",
    "token": "'$ADMIN_TOKEN'",
    "limit": 200
  }'

echo ""
echo "批量补齐logo完成！"
