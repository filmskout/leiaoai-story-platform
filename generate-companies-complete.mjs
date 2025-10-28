// Script to generate complete SQL for all 116 companies
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

async function generateCompleteCompaniesSQL() {
  console.log('Fetching companies from database...');
  
  const { data: companies, error } = await supabase
    .from('companies')
    .select('id, name, description, detailed_description, website, headquarters, founded_year, employee_count')
    .order('name');
  
  if (error) {
    console.error('Error fetching companies:', error);
    return;
  }
  
  if (!companies || companies.length === 0) {
    console.log('No companies found in database');
    return;
  }
  
  console.log(`Found ${companies.length} companies`);
  
  let sql = '-- Complete detailed descriptions for ALL companies\n';
  sql += '-- Generated automatically from database\n\n';
  sql += 'BEGIN;\n\n';
  
  // Generate UPDATE statements for each company
  companies.forEach((company, index) => {
    sql += `-- ${index + 1}. ${company.name}\n`;
    sql += `UPDATE companies SET\n`;
    
    // Add description if exists
    if (company.description) {
      sql += `  description = '${company.description.replace(/'/g, "''")}',\n`;
    }
    
    // Add detailed_description if exists, otherwise generate placeholder
    if (company.detailed_description) {
      sql += `  detailed_description = '${company.detailed_description.replace(/'/g, "''")}'\n`;
    } else {
      sql += `  detailed_description = '详细描述待补充 - ${company.name}'\n`;
    }
    
    sql += `WHERE id = '${company.id}';\n\n`;
  });
  
  sql += 'COMMIT;\n';
  
  console.log('\nGenerated SQL:');
  console.log(sql);
  
  // Save to file
  const fs = require('fs');
  fs.writeFileSync('GENERATE-ALL-COMPANIES-COMPLETE.sql', sql);
  console.log('\nSQL saved to GENERATE-ALL-COMPANIES-COMPLETE.sql');
}

generateCompleteCompaniesSQL();
