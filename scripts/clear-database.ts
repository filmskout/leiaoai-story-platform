#!/usr/bin/env node

/**
 * 数据库完全清理脚本
 * 清理所有现有数据，为200+家公司的新数据做准备
 */

import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function clearAllData() {
  console.log('🧹 开始清理所有现有数据...');
  console.log('═'.repeat(60));

  try {
    // 定义需要清理的表（按依赖关系排序）
    const tablesToClear = [
      // 关联表（先清理）
      'tool_stories',
      'company_stories', 
      'tool_ratings',
      'company_ratings',
      'user_favorites',
      'tool_stats',
      'company_stats',
      
      // 主要数据表
      'tools',
      'fundings',
      'stories',
      'companies',
      
      // 用户相关表（保留用户数据）
      // 'profiles', // 保留用户资料
      // 'chat_sessions', // 保留聊天会话
    ];

    let clearedCount = 0;
    let errorCount = 0;

    for (const table of tablesToClear) {
      try {
        console.log(`🔄 清理表: ${table}`);
        
        // 删除所有数据
        const { error } = await supabase
          .from(table)
          .delete()
          .neq('id', '00000000-0000-0000-0000-000000000000'); // 删除所有非默认ID的记录

        if (error) {
          console.log(`⚠️ 清理表 ${table} 时出现错误:`, error.message);
          errorCount++;
        } else {
          console.log(`✅ 成功清理表: ${table}`);
          clearedCount++;
        }
      } catch (err) {
        console.log(`❌ 清理表 ${table} 失败:`, err);
        errorCount++;
      }
    }

    console.log('\n' + '═'.repeat(60));
    console.log('📊 清理结果汇总');
    console.log('═'.repeat(60));
    console.log(`✅ 成功清理: ${clearedCount} 个表`);
    console.log(`❌ 清理失败: ${errorCount} 个表`);
    console.log(`📈 成功率: ${((clearedCount / tablesToClear.length) * 100).toFixed(1)}%`);

    // 验证清理结果
    console.log('\n🔍 验证清理结果...');
    for (const table of tablesToClear) {
      try {
        const { count, error } = await supabase
          .from(table)
          .select('*', { count: 'exact', head: true });

        if (error) {
          console.log(`⚠️ 无法验证表 ${table}:`, error.message);
        } else {
          console.log(`📊 表 ${table}: ${count} 条记录`);
        }
      } catch (err) {
        console.log(`❌ 验证表 ${table} 失败:`, err);
      }
    }

    console.log('\n🎉 数据库清理完成！');
    console.log('现在可以开始生成200+家公司的完整数据了。');

  } catch (error) {
    console.error('❌ 数据库清理失败:', error);
    process.exit(1);
  }
}

// 运行清理
clearAllData();
