#!/bin/bash

# 批量删除companies表中的所有记录
echo "🧹 开始清理companies表..."

# 获取所有公司ID
echo "📊 获取所有公司ID..."
IDS=$(curl -s -X GET "https://nineezxjxfzwnsdtgjcu.supabase.co/rest/v1/companies?select=id" \
  -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5pbmVlenhqeGZ6d25zZHRnamN1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk4MjQ0OTgsImV4cCI6MjA3NTQwMDQ5OH0.Pv7q5NzDevRcL8QWpN5yf_Q-_J1XhYUEFFso3pmA_l8" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5pbmVlenhqeGZ6d25zZHRnamN1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk4MjQ0OTgsImV4cCI6MjA3NTQwMDQ5OH0.Pv7q5NzDevRcL8QWpN5yf_Q-_J1XhYUEFFso3pmA_l8" | jq -r '.[].id')

# 计算记录数
COUNT=$(echo "$IDS" | wc -l)
echo "📊 找到 $COUNT 条记录需要删除"

if [ "$COUNT" -eq 0 ]; then
    echo "✅ companies表已经是空的"
    exit 0
fi

# 分批删除（每次最多20个ID）
echo "🔄 开始分批删除..."
BATCH_SIZE=20
BATCH_NUM=1

echo "$IDS" | while read -r id; do
    if [ -n "$id" ]; then
        echo "🔄 删除公司ID: $id"
        
        # 删除单个记录
        RESPONSE=$(curl -s -X DELETE "https://nineezxjxfzwnsdtgjcu.supabase.co/rest/v1/companies?id=eq.$id" \
          -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5pbmVlenhqeGZ6d25zZHRnamN1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk4MjQ0OTgsImV4cCI6MjA3NTQwMDQ5OH0.Pv7q5NzDevRcL8QWpN5yf_Q-_J1XhYUEFFso3pmA_l8" \
          -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5pbmVlenhqeGZ6d25zZHRnamN1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk4MjQ0OTgsImV4cCI6MjA3NTQwMDQ5OH0.Pv7q5NzDevRcL8QWpN5yf_Q-_J1XhYUEFFso3pmA_l8")
        
        if [ -z "$RESPONSE" ]; then
            echo "✅ 成功删除: $id"
        else
            echo "❌ 删除失败: $id - $RESPONSE"
        fi
        
        # 每删除10个记录后暂停1秒
        if [ $((BATCH_NUM % 10)) -eq 0 ]; then
            echo "⏳ 暂停1秒..."
            sleep 1
        fi
        
        BATCH_NUM=$((BATCH_NUM + 1))
    fi
done

echo "🎉 companies表清理完成！"

# 验证清理结果
echo "🔍 验证清理结果..."
REMAINING=$(curl -s -X GET "https://nineezxjxfzwnsdtgjcu.supabase.co/rest/v1/companies?select=id" \
  -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5pbmVlenhqeGZ6d25zZHRnamN1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk4MjQ0OTgsImV4cCI6MjA3NTQwMDQ5OH0.Pv7q5NzDevRcL8QWpN5yf_Q-_J1XhYUEFFso3pmA_l8" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5pbmVlenhqeGZ6d25zZHRnamN1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk4MjQ0OTgsImV4cCI6MjA3NTQwMDQ5OH0.Pv7q5NzDevRcL8QWpN5yf_Q-_J1XhYUEFFso3pmA_l8" | jq length)

echo "📊 剩余记录数: $REMAINING"

if [ "$REMAINING" -eq 0 ]; then
    echo "✅ companies表清理成功！"
else
    echo "❌ companies表仍有 $REMAINING 条记录"
fi
