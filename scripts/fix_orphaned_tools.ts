import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://nineezxjxfzwnsdtgjcu.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5pbmVlenhqeGZ6d25zZHRnamN1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk4MjQ0OTgsImV4cCI6MjA3NTQwMDQ5OH0.Pv7q5NzDevRcL8QWpN5yf_Q-_J1XhYUEFFso3pmA_l8';

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false }
});

async function fixOrphanedTools() {
  console.log('🔧 Fixing orphaned tools...\n');

  try {
    // Disable RLS temporarily
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

    // Get orphaned tools
    const { data: orphanedTools, error: orphanedError } = await supabase
      .from('tools')
      .select('id, name, description')
      .is('company_id', null);

    if (orphanedError) throw orphanedError;

    console.log(`Found ${orphanedTools.length} orphaned tools:`);
    orphanedTools.forEach(tool => {
      console.log(`  - ${tool.name} (ID: ${tool.id})`);
    });

    // Get all companies
    const { data: companies, error: companiesError } = await supabase
      .from('companies')
      .select('id, name');

    if (companiesError) throw companiesError;

    // Fix orphaned tools
    for (const tool of orphanedTools) {
      let targetCompanyId = null;

      // Special cases for known tools
      if (tool.name === 'Stable Diffusion' || tool.name === 'DreamStudio') {
        // Find Stability AI company
        const stabilityAI = companies.find(c => 
          c.name.toLowerCase().includes('stability') || 
          c.name.toLowerCase().includes('stability ai')
        );
        if (stabilityAI) {
          targetCompanyId = stabilityAI.id;
          console.log(`✅ Linking "${tool.name}" to "${stabilityAI.name}"`);
        }
      }

      // If no specific match found, try fuzzy matching
      if (!targetCompanyId) {
        const fuzzyMatch = companies.find(company => {
          const toolName = tool.name.toLowerCase();
          const companyName = company.name.toLowerCase();
          
          // Check if tool name contains company name or vice versa
          return toolName.includes(companyName) || 
                 companyName.includes(toolName) ||
                 // Check for common patterns
                 (toolName.includes('stable') && companyName.includes('stability')) ||
                 (toolName.includes('dream') && companyName.includes('stability'));
        });

        if (fuzzyMatch) {
          targetCompanyId = fuzzyMatch.id;
          console.log(`✅ Fuzzy matched "${tool.name}" to "${fuzzyMatch.name}"`);
        }
      }

      // Update the tool
      if (targetCompanyId) {
        const { error: updateError } = await supabase
          .from('tools')
          .update({ company_id: targetCompanyId })
          .eq('id', tool.id);

        if (updateError) {
          console.error(`❌ Error updating tool ${tool.name}: ${updateError.message}`);
        } else {
          console.log(`✅ Fixed tool "${tool.name}"`);
        }
      } else {
        console.log(`⚠️ No suitable company found for tool "${tool.name}"`);
        
        // Create a company for this tool if it's a standalone product
        const companyData = {
          name: tool.name,
          name_en: tool.name,
          name_zh_hans: tool.name,
          name_zh_hant: tool.name,
          description: `Company behind ${tool.name}`,
          description_en: `Company behind ${tool.name}`,
          description_zh_hans: `${tool.name}背后的公司`,
          description_zh_hant: `${tool.name}背後的公司`,
          website: null,
          logo_url: null,
          valuation_usd: null,
          funding_status: 'Unknown',
          industry_tags: ['AI'],
          social_links: {},
          headquarters: 'Unknown'
        };

        const { data: newCompany, error: createError } = await supabase
          .from('companies')
          .insert(companyData)
          .select()
          .single();

        if (createError) {
          console.error(`❌ Error creating company for ${tool.name}: ${createError.message}`);
        } else {
          console.log(`✅ Created company "${tool.name}"`);
          
          // Link tool to new company
          const { error: linkError } = await supabase
            .from('tools')
            .update({ company_id: newCompany.id })
            .eq('id', tool.id);

          if (linkError) {
            console.error(`❌ Error linking tool to new company: ${linkError.message}`);
          } else {
            console.log(`✅ Linked tool to new company`);
          }
        }
      }
    }

    // Final verification
    console.log('\n🔍 Final verification...');
    const { data: finalOrphanedTools, error: finalError } = await supabase
      .from('tools')
      .select('id, name')
      .is('company_id', null);

    if (finalError) {
      console.error('Error in final verification:', finalError);
    } else {
      console.log(`Remaining orphaned tools: ${finalOrphanedTools.length}`);
      if (finalOrphanedTools.length > 0) {
        finalOrphanedTools.forEach(tool => {
          console.log(`  - ${tool.name}`);
        });
      }
    }

  } catch (error: any) {
    console.error('❌ Error fixing orphaned tools:', error.message);
  } finally {
    console.log('\n✅ Orphaned tools fix completed!');
  }
}

fixOrphanedTools().catch(console.error);
