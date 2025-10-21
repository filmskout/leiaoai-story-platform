import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

interface CompanyData {
  id: string;
  name: string;
  name_en: string;
  name_zh_hans: string;
  name_zh_hant: string;
  description: string;
  description_en: string;
  description_zh_hans: string;
  description_zh_hant: string;
  logo_url: string;
  website: string;
  headquarters: string;
  company_type: string;
  company_tier: string;
  company_category: string;
  focus_areas: string[];
  industry_tags: string[];
  social_links: any;
  valuation_usd: number | null;
  funding_status: string;
  created_at: string;
  updated_at: string;
}

interface ToolData {
  id: string;
  name: string;
  name_en: string;
  name_zh_hans: string;
  name_zh_hant: string;
  description: string;
  description_en: string;
  description_zh_hans: string;
  description_zh_hant: string;
  logo_url: string;
  website: string;
  company_id: string;
  tool_category: string;
  tool_subcategory: string;
  focus_areas: string[];
  industry_tags: string[];
  pricing_model: string;
  launch_date: string;
  features: string[];
  api_available: boolean;
  free_tier: boolean;
  created_at: string;
  updated_at: string;
}

async function cleanExistingData() {
  console.log('🧹 开始清理现有数据...');
  
  try {
    // 1. 清理关联表
    console.log('清理关联表...');
    await supabase.from('tool_stories').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('company_stories').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('tool_ratings').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('user_favorites').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('tool_stats').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('company_stats').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    
    // 2. 清理工具表
    console.log('清理工具表...');
    await supabase.from('tools').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    
    // 3. 清理公司表
    console.log('清理公司表...');
    await supabase.from('companies').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    
    // 4. 清理融资数据
    console.log('清理融资数据...');
    await supabase.from('fundings').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    
    console.log('✅ 数据清理完成');
  } catch (error) {
    console.error('❌ 数据清理失败:', error);
    throw error;
  }
}

async function resetAutoIncrement() {
  console.log('🔄 重置自增序列...');
  
  try {
    // 重置companies表的自增序列
    await supabase.rpc('reset_sequence', { 
      table_name: 'companies',
      column_name: 'id'
    });
    
    // 重置tools表的自增序列
    await supabase.rpc('reset_sequence', { 
      table_name: 'tools',
      column_name: 'id'
    });
    
    console.log('✅ 序列重置完成');
  } catch (error) {
    console.log('⚠️ 序列重置失败（可能不需要）:', error);
  }
}

async function createResetSequenceFunction() {
  console.log('🔧 创建序列重置函数...');
  
  const sql = `
    CREATE OR REPLACE FUNCTION reset_sequence(table_name text, column_name text)
    RETURNS void AS $$
    DECLARE
        seq_name text;
    BEGIN
        -- 获取序列名称
        SELECT pg_get_serial_sequence(table_name, column_name) INTO seq_name;
        
        IF seq_name IS NOT NULL THEN
            -- 重置序列
            EXECUTE 'ALTER SEQUENCE ' || seq_name || ' RESTART WITH 1';
        END IF;
    END;
    $$ LANGUAGE plpgsql;
  `;
  
  try {
    await supabase.rpc('exec_sql', { sql });
    console.log('✅ 序列重置函数创建完成');
  } catch (error) {
    console.log('⚠️ 序列重置函数创建失败（可能已存在）:', error);
  }
}

async function main() {
  console.log('🚀 开始全面数据重置...');
  
  try {
    // 1. 创建序列重置函数
    await createResetSequenceFunction();
    
    // 2. 清理现有数据
    await cleanExistingData();
    
    // 3. 重置自增序列
    await resetAutoIncrement();
    
    console.log('🎉 全面数据重置完成！');
    console.log('📋 下一步：运行数据获取脚本');
    
  } catch (error) {
    console.error('❌ 数据重置失败:', error);
    process.exit(1);
  }
}

// 运行主函数
main().catch(console.error);
