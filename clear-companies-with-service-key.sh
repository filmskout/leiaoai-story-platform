#!/bin/bash

# 使用Supabase Service Role Key删除companies表的所有记录
# 这个脚本会绕过RLS限制

SUPABASE_URL="https://nineezxjxfzwnsdtgjcu.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5pbmVlenhqeGZ6d25zZHRnamN1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTgyNDQ5OCwiZXhwIjoyMDc1NDAwNDk4fQ.8QZQZQZQZQZQZQZQZQZQZQZQZQZQZQZQZQZQZQZQZQ"

echo "🧹 开始清理companies表..."

# 获取所有公司ID
echo "📊 获取所有公司ID..."
COMPANY_IDS=$(curl -s -X GET "${SUPABASE_URL}/rest/v1/companies?select=id" \
  -H "apikey: ${SUPABASE_SERVICE_ROLE_KEY}" \
  -H "Authorization: Bearer ${SUPABASE_SERVICE_ROLE_KEY}" | jq -r '.[].id')

if [ -z "$COMPANY_IDS" ]; then
    echo "📊 没有找到公司记录需要删除。"
    echo "🎉 companies表已是空的！"
    exit 0
fi

echo "📊 找到 $(echo "$COMPANY_IDS" | wc -l | xargs) 条记录需要删除"
echo "🔄 开始分批删除..."

# 逐个删除公司ID
for COMPANY_ID in $COMPANY_IDS; do
    echo "🔄 删除公司ID: $COMPANY_ID"
    DELETE_RESPONSE=$(curl -s -X DELETE "${SUPABASE_URL}/rest/v1/companies?id=eq.${COMPANY_ID}" \
      -H "apikey: ${SUPABASE_SERVICE_ROLE_KEY}" \
      -H "Authorization: Bearer ${SUPABASE_SERVICE_ROLE_KEY}")
    
    if [ -z "$DELETE_RESPONSE" ]; then
        echo "✅ 成功删除: $COMPANY_ID"
    else
        echo "❌ 删除失败: $COMPANY_ID - $DELETE_RESPONSE"
    fi
    sleep 0.1 # 短暂暂停，避免API限速
done

echo "🎉 companies表清理完成！"

# 验证清理结果
echo "🔍 验证清理结果..."
REMAINING_COUNT=$(curl -s -X GET "${SUPABASE_URL}/rest/v1/companies?count=exact" \
  -H "apikey: ${SUPABASE_SERVICE_ROLE_KEY}" \
  -H "Authorization: Bearer ${SUPABASE_SERVICE_ROLE_KEY}" \
  -H "Range-Unit: items" \
  -H "Range: 0-9" | jq -r '.count')

if [ "$REMAINING_COUNT" -eq 0 ]; then
    echo "✅ companies表已完全清空。"
else
    echo "📊 剩余记录数: $REMAINING_COUNT"
    echo "❌ companies表仍有 $REMAINING_COUNT 条记录"
fi
