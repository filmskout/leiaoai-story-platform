import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Supabase配置缺失');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testDatabaseStatus() {
  console.log('🔍 检查数据库状态...');
  
  try {
    // 检查 companies 表
    console.log('\n📊 检查 companies 表...');
    const { data: companies, error: companiesError } = await supabase
      .from('companies')
      .select('id, name')
      .limit(5);
    
    if (companiesError) {
      console.error('❌ companies 表错误:', companiesError);
    } else {
      console.log(`✅ companies 表正常，有 ${companies.length} 条记录`);
      console.log('前5条记录:', companies.map(c => c.name));
    }
    
    // 检查 projects 表
    console.log('\n📊 检查 projects 表...');
    const { data: projects, error: projectsError } = await supabase
      .from('projects')
      .select('id, name, company_id')
      .limit(5);
    
    if (projectsError) {
      console.error('❌ projects 表错误:', projectsError);
    } else {
      console.log(`✅ projects 表正常，有 ${projects.length} 条记录`);
      console.log('前5条记录:', projects.map(p => p.name));
    }
    
    // 检查 tools 表（应该不存在）
    console.log('\n📊 检查 tools 表...');
    const { data: tools, error: toolsError } = await supabase
      .from('tools')
      .select('id, name')
      .limit(1);
    
    if (toolsError) {
      console.log('✅ tools 表不存在（这是正确的）');
    } else {
      console.log(`⚠️ tools 表仍然存在，有 ${tools.length} 条记录`);
    }
    
    // 测试关联查询
    console.log('\n📊 测试关联查询...');
    const { data: companiesWithProjects, error: joinError } = await supabase
      .from('companies')
      .select(`
        id,
        name,
        projects:projects(id, name, category)
      `)
      .limit(3);
    
    if (joinError) {
      console.error('❌ 关联查询错误:', joinError);
    } else {
      console.log('✅ 关联查询正常');
      companiesWithProjects.forEach(company => {
        console.log(`- ${company.name}: ${company.projects?.length || 0} 个项目`);
      });
    }
    
  } catch (error) {
    console.error('❌ 数据库测试失败:', error);
  }
}

testDatabaseStatus();
