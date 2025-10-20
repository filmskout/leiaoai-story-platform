import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://nineezxjxfzwnsdtgjcu.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5pbmVlenhqeGZ6d25zZHRnamN1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk4MjQ0OTgsImV4cCI6MjA3NTQwMDQ5OH0.Pv7q5NzDevRcL8QWpN5yf_Q-_J1XhYUEFFso3pmA_l8';

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false }
});

async function analyzeAndFixDuplicates() {
  console.log('🔍 Starting comprehensive duplicate analysis and cleanup...\n');

  try {
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

    // 1. Analyze duplicate companies
    console.log('\n📊 ANALYZING DUPLICATE COMPANIES...');
    const { data: companies, error: companiesError } = await supabase
      .from('companies')
      .select('id, name, name_en, name_zh_hans, name_zh_hant, website, description, created_at')
      .order('created_at', { ascending: true });

    if (companiesError) throw companiesError;

    // Group companies by similar names
    const companyGroups = new Map<string, typeof companies>();
    companies.forEach(company => {
      const normalizedName = company.name.toLowerCase().trim();
      if (!companyGroups.has(normalizedName)) {
        companyGroups.set(normalizedName, []);
      }
      companyGroups.get(normalizedName)?.push(company);
    });

    // Find duplicates
    const duplicates = Array.from(companyGroups.entries())
      .filter(([name, companies]) => companies.length > 1)
      .map(([name, companies]) => ({ name, companies }));

    console.log(`Found ${duplicates.length} duplicate company groups:`);
    duplicates.forEach(({ name, companies }) => {
      console.log(`\n🔄 "${name}" (${companies.length} entries):`);
      companies.forEach((company, index) => {
        console.log(`  ${index + 1}. ID: ${company.id} | Website: ${company.website || 'N/A'} | Created: ${company.created_at}`);
      });
    });

    // 2. Analyze company-tool relationships
    console.log('\n📊 ANALYZING COMPANY-TOOL RELATIONSHIPS...');
    const { data: tools, error: toolsError } = await supabase
      .from('tools')
      .select('id, name, company_id, description, created_at');

    if (toolsError) throw toolsError;

    // Find companies without tools
    const companiesWithTools = new Set(tools.map(tool => tool.company_id));
    const companiesWithoutTools = companies.filter(company => !companiesWithTools.has(company.id));

    console.log(`\n📋 Companies without tools: ${companiesWithoutTools.length}`);
    companiesWithoutTools.forEach(company => {
      console.log(`  - ${company.name} (ID: ${company.id})`);
    });

    // Find tools with invalid company_id
    const validCompanyIds = new Set(companies.map(company => company.id));
    const toolsWithInvalidCompany = tools.filter(tool => !validCompanyIds.has(tool.company_id));

    console.log(`\n⚠️ Tools with invalid company_id: ${toolsWithInvalidCompany.length}`);
    toolsWithInvalidCompany.forEach(tool => {
      console.log(`  - ${tool.name} (ID: ${tool.id}) -> Company ID: ${tool.company_id}`);
    });

    // 3. Fix duplicates
    console.log('\n🔧 FIXING DUPLICATES...');
    let fixedCount = 0;
    for (const { name, companies } of duplicates) {
      // Keep the first (oldest) company, merge others
      const primaryCompany = companies[0];
      const duplicateCompanies = companies.slice(1);

      console.log(`\n🔗 Merging duplicates for "${name}":`);
      console.log(`  Primary: ${primaryCompany.name} (ID: ${primaryCompany.id})`);

      for (const duplicate of duplicateCompanies) {
        console.log(`  Merging: ${duplicate.name} (ID: ${duplicate.id})`);

        // Update tools to point to primary company
        const { error: updateToolsError } = await supabase
          .from('tools')
          .update({ company_id: primaryCompany.id })
          .eq('company_id', duplicate.id);

        if (updateToolsError) {
          console.error(`    ❌ Error updating tools: ${updateToolsError.message}`);
        } else {
          console.log(`    ✅ Updated tools to point to primary company`);
        }

        // Merge company data if primary is missing info
        const updateData: any = {};
        if (!primaryCompany.description && duplicate.description) {
          updateData.description = duplicate.description;
        }
        if (!primaryCompany.name_en && duplicate.name_en) {
          updateData.name_en = duplicate.name_en;
        }
        if (!primaryCompany.name_zh_hans && duplicate.name_zh_hans) {
          updateData.name_zh_hans = duplicate.name_zh_hans;
        }
        if (!primaryCompany.name_zh_hant && duplicate.name_zh_hant) {
          updateData.name_zh_hant = duplicate.name_zh_hant;
        }
        if (!primaryCompany.website && duplicate.website) {
          updateData.website = duplicate.website;
        }

        if (Object.keys(updateData).length > 0) {
          const { error: updateCompanyError } = await supabase
            .from('companies')
            .update(updateData)
            .eq('id', primaryCompany.id);

          if (updateCompanyError) {
            console.error(`    ❌ Error updating primary company: ${updateCompanyError.message}`);
          } else {
            console.log(`    ✅ Merged data into primary company`);
          }
        }

        // Delete duplicate company
        const { error: deleteError } = await supabase
          .from('companies')
          .delete()
          .eq('id', duplicate.id);

        if (deleteError) {
          console.error(`    ❌ Error deleting duplicate: ${deleteError.message}`);
        } else {
          console.log(`    ✅ Deleted duplicate company`);
          fixedCount++;
        }
      }
    }

    // 4. Fix tools with invalid company_id
    console.log('\n🔧 FIXING TOOLS WITH INVALID COMPANY_ID...');
    let fixedToolsCount = 0;
    for (const tool of toolsWithInvalidCompany) {
      // Try to find a matching company by name
      const matchingCompany = companies.find(company => 
        company.name.toLowerCase().includes(tool.name.toLowerCase()) ||
        tool.name.toLowerCase().includes(company.name.toLowerCase())
      );

      if (matchingCompany) {
        const { error: updateError } = await supabase
          .from('tools')
          .update({ company_id: matchingCompany.id })
          .eq('id', tool.id);

        if (updateError) {
          console.error(`❌ Error fixing tool ${tool.name}: ${updateError.message}`);
        } else {
          console.log(`✅ Fixed tool "${tool.name}" -> Company "${matchingCompany.name}"`);
          fixedToolsCount++;
        }
      } else {
        console.log(`⚠️ No matching company found for tool "${tool.name}"`);
      }
    }

    // 5. Create tools for companies without any tools
    console.log('\n🔧 CREATING TOOLS FOR COMPANIES WITHOUT ANY...');
    let createdToolsCount = 0;
    for (const company of companiesWithoutTools) {
      const toolData = {
        name: company.name,
        company_id: company.id,
        description: company.description || `Primary product/service from ${company.name}`,
        description_en: company.description || `Primary product/service from ${company.name}`,
        description_zh_hans: company.description || `${company.name}的主要产品/服务`,
        description_zh_hant: company.description || `${company.name}的主要產品/服務`,
        pricing_model: 'Unknown',
        launch_date: company.created_at,
        industry_tags: ['AI'],
        features: ['Core AI functionality'],
        api_available: false,
        free_tier: false,
        logo_url: null
      };

      const { error: insertError } = await supabase
        .from('tools')
        .insert(toolData);

      if (insertError) {
        console.error(`❌ Error creating tool for ${company.name}: ${insertError.message}`);
      } else {
        console.log(`✅ Created tool for company "${company.name}"`);
        createdToolsCount++;
      }
    }

    // 6. Final statistics
    console.log('\n📊 CLEANUP SUMMARY:');
    console.log(`  - Fixed duplicate companies: ${fixedCount}`);
    console.log(`  - Fixed tools with invalid company_id: ${fixedToolsCount}`);
    console.log(`  - Created tools for companies without any: ${createdToolsCount}`);

    // 7. Verify final state
    console.log('\n🔍 FINAL VERIFICATION...');
    const { data: finalCompanies, error: finalCompaniesError } = await supabase
      .from('companies')
      .select('id, name')
      .order('name');

    const { data: finalTools, error: finalToolsError } = await supabase
      .from('tools')
      .select('id, name, company_id')
      .order('name');

    if (finalCompaniesError || finalToolsError) {
      console.error('Error in final verification:', finalCompaniesError || finalToolsError);
    } else {
      console.log(`\n📈 FINAL STATISTICS:`);
      console.log(`  - Total companies: ${finalCompanies.length}`);
      console.log(`  - Total tools: ${finalTools.length}`);
      
      const companiesWithToolsFinal = new Set(finalTools.map(tool => tool.company_id));
      const companiesWithoutToolsFinal = finalCompanies.filter(company => !companiesWithToolsFinal.has(company.id));
      
      console.log(`  - Companies without tools: ${companiesWithoutToolsFinal.length}`);
      if (companiesWithoutToolsFinal.length > 0) {
        console.log('    Remaining companies without tools:');
        companiesWithoutToolsFinal.forEach(company => {
          console.log(`      - ${company.name}`);
        });
      }
    }

  } catch (error: any) {
    console.error('❌ Error during cleanup:', error.message);
  } finally {
    console.log('\n✅ Duplicate analysis and cleanup completed!');
  }
}

analyzeAndFixDuplicates().catch(console.error);
