import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://nineezxjxfzwnsdtgjcu.supabase.co';
const supabaseServiceKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5pbmVlenhqeGZ6d25zZHRnamN1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk4MjQ0OTgsImV4cCI6MjA3NTQwMDQ5OH0.Pv7q5NzDevRcL8QWpN5yf_Q-_J1XhYUEFFso3pmA_l8';

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false
  }
});

async function findDuplicates() {
  console.log('🔍 Finding duplicate companies and tools...\n');

  try {
    // Find duplicate companies
    const { data: companies, error: companiesError } = await supabase
      .from('companies')
      .select('id, name, website, description')
      .order('name');

    if (companiesError) {
      console.error('Error fetching companies:', companiesError);
      return;
    }

    console.log('🏢 DUPLICATE COMPANIES:');
    const companyMap = new Map();
    const duplicates = [];

    for (const company of companies || []) {
      const key = company.name.toLowerCase().trim();
      if (companyMap.has(key)) {
        duplicates.push({
          original: companyMap.get(key),
          duplicate: company
        });
      } else {
        companyMap.set(key, company);
      }
    }

    if (duplicates.length > 0) {
      duplicates.forEach(({ original, duplicate }) => {
        console.log(`  🔄 ${duplicate.name} (ID: ${duplicate.id}) is duplicate of ${original.name} (ID: ${original.id})`);
      });
    } else {
      console.log('  ✅ No duplicate companies found');
    }

    // Find duplicate tools
    const { data: tools, error: toolsError } = await supabase
      .from('tools')
      .select('id, name, company_id, description')
      .order('name');

    if (toolsError) {
      console.error('Error fetching tools:', toolsError);
      return;
    }

    console.log('\n🛠️ DUPLICATE TOOLS:');
    const toolMap = new Map();
    const toolDuplicates = [];

    for (const tool of tools || []) {
      const key = tool.name.toLowerCase().trim();
      if (toolMap.has(key)) {
        toolDuplicates.push({
          original: toolMap.get(key),
          duplicate: tool
        });
      } else {
        toolMap.set(key, tool);
      }
    }

    if (toolDuplicates.length > 0) {
      toolDuplicates.forEach(({ original, duplicate }) => {
        console.log(`  🔄 ${duplicate.name} (ID: ${duplicate.id}) is duplicate of ${original.name} (ID: ${original.id})`);
      });
    } else {
      console.log('  ✅ No duplicate tools found');
    }

    // Find Google services that should be consolidated
    console.log('\n🔍 GOOGLE SERVICES ANALYSIS:');
    const googleCompanies = (companies || []).filter(c => 
      c.name.toLowerCase().includes('google') || 
      c.name.toLowerCase().includes('alphabet') ||
      c.website?.includes('google.com') ||
      c.website?.includes('alphabet.com')
    );

    const googleTools = (tools || []).filter(t => 
      t.name.toLowerCase().includes('google') ||
      t.name.toLowerCase().includes('gemini') ||
      t.name.toLowerCase().includes('bard') ||
      t.name.toLowerCase().includes('notebooklm') ||
      t.name.toLowerCase().includes('ai studio')
    );

    console.log(`  📊 Found ${googleCompanies.length} Google-related companies:`);
    googleCompanies.forEach(company => {
      console.log(`    - ${company.name} (ID: ${company.id})`);
    });

    console.log(`  📊 Found ${googleTools.length} Google-related tools:`);
    googleTools.forEach(tool => {
      console.log(`    - ${tool.name} (ID: ${tool.id})`);
    });

    return { duplicates, toolDuplicates, googleCompanies, googleTools };

  } catch (error) {
    console.error('Error finding duplicates:', error);
    return null;
  }
}

async function consolidateGoogleServices() {
  console.log('\n🔧 Consolidating Google services...\n');

  try {
    // Find the main Google company
    const { data: mainGoogle, error: mainGoogleError } = await supabase
      .from('companies')
      .select('id, name')
      .eq('name', 'Google')
      .single();

    if (mainGoogleError) {
      console.log('⚠️ Main Google company not found, creating one...');
      const { data: newGoogle, error: createError } = await supabase
        .from('companies')
        .insert({
          name: 'Google',
          name_en: 'Google',
          name_zh_hans: '谷歌',
          name_zh_hant: '谷歌',
          description: '全球领先的科技公司，专注于搜索引擎、云计算、AI和数字服务',
          description_en: 'Global leading technology company focused on search engines, cloud computing, AI and digital services',
          description_zh_hans: '全球领先的科技公司，专注于搜索引擎、云计算、AI和数字服务',
          description_zh_hant: '全球領先的科技公司，專注於搜索引擎、雲計算、AI和數字服務',
          website: 'https://www.google.com',
          logo_url: 'https://www.google.com/favicon.ico',
          headquarters: 'Mountain View, CA',
          founded_year: 1998,
          industry_tags: ['搜索引擎', '云计算', 'AI', 'Search Engine', 'Cloud Computing', 'AI'],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (createError) {
        console.error('Error creating Google company:', createError);
        return;
      }
      console.log('✅ Created main Google company');
      return;
    }

    // Find all Google-related tools and link them to main Google
    const { data: googleTools, error: toolsError } = await supabase
      .from('tools')
      .select('id, name, company_id')
      .or('name.ilike.%google%,name.ilike.%gemini%,name.ilike.%bard%,name.ilike.%notebooklm%,name.ilike.%ai studio%');

    if (toolsError) {
      console.error('Error fetching Google tools:', toolsError);
      return;
    }

    let updatedCount = 0;
    for (const tool of googleTools || []) {
      if (tool.company_id !== mainGoogle.id) {
        const { error: updateError } = await supabase
          .from('tools')
          .update({ 
            company_id: mainGoogle.id,
            updated_at: new Date().toISOString()
          })
          .eq('id', tool.id);

        if (updateError) {
          console.error(`Error updating tool ${tool.name}:`, updateError);
        } else {
          console.log(`✅ Linked ${tool.name} to main Google company`);
          updatedCount++;
        }
      }
    }

    console.log(`\n📊 Consolidated ${updatedCount} Google tools`);

  } catch (error) {
    console.error('Error consolidating Google services:', error);
  }
}

async function removeDuplicates(duplicates, toolDuplicates) {
  console.log('\n🗑️ Removing duplicates...\n');

  try {
    // Remove duplicate companies (keep the first one)
    for (const { duplicate } of duplicates) {
      console.log(`🗑️ Removing duplicate company: ${duplicate.name} (ID: ${duplicate.id})`);
      
      // First, unlink any tools from the duplicate company
      const { error: unlinkError } = await supabase
        .from('tools')
        .update({ company_id: null })
        .eq('company_id', duplicate.id);

      if (unlinkError) {
        console.error(`Error unlinking tools from ${duplicate.name}:`, unlinkError);
        continue;
      }

      // Then delete the duplicate company
      const { error: deleteError } = await supabase
        .from('companies')
        .delete()
        .eq('id', duplicate.id);

      if (deleteError) {
        console.error(`Error deleting company ${duplicate.name}:`, deleteError);
      } else {
        console.log(`✅ Removed duplicate company: ${duplicate.name}`);
      }
    }

    // Remove duplicate tools (keep the first one)
    for (const { duplicate } of toolDuplicates) {
      console.log(`🗑️ Removing duplicate tool: ${duplicate.name} (ID: ${duplicate.id})`);
      
      const { error: deleteError } = await supabase
        .from('tools')
        .delete()
        .eq('id', duplicate.id);

      if (deleteError) {
        console.error(`Error deleting tool ${duplicate.name}:`, deleteError);
      } else {
        console.log(`✅ Removed duplicate tool: ${duplicate.name}`);
      }
    }

  } catch (error) {
    console.error('Error removing duplicates:', error);
  }
}

async function main() {
  console.log('🚀 Starting duplicate detection and cleanup...\n');

  // Disable RLS temporarily
  console.log('🔓 Disabling RLS for cleanup operations...');
  try {
    await supabase.rpc('exec_sql', { 
      sql: 'ALTER TABLE public.companies DISABLE ROW LEVEL SECURITY;' 
    });
    await supabase.rpc('exec_sql', { 
      sql: 'ALTER TABLE public.tools DISABLE ROW LEVEL SECURITY;' 
    });
  } catch (error) {
    console.log('Note: RLS disable may need to be done manually in SQL Editor');
  }

  const analysis = await findDuplicates();
  
  if (analysis) {
    await consolidateGoogleServices();
    
    if (analysis.duplicates.length > 0 || analysis.toolDuplicates.length > 0) {
      await removeDuplicates(analysis.duplicates, analysis.toolDuplicates);
    }
  }

  console.log('\n✅ Duplicate cleanup completed!');
}

main().catch(console.error);
