// This script will query all companies from the database and generate SQL UPDATE statements

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';

const supabaseUrl = 'https://bfrsiwvzelbfqbuvlahc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJmcnNpd3Z6ZWxiZnFidXZzYWxoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNDQwOTcwNywiZXhwIjoyMDQ5OTg1NzA3fQ.QKCtKfE8pP2M0hQb0uQeE-kLOH_JVk0zF7GqzxVXW_c';

const supabase = createClient(supabaseUrl, supabaseKey);

async function listAllCompanies() {
  console.log('📊 Fetching all companies from database...');
  
  const { data: companies, error } = await supabase
    .from('companies')
    .select('id, name, description, website, headquarters, founded_year, employee_count')
    .order('name');

  if (error) {
    console.error('❌ Error:', error);
    return;
  }

  if (!companies || companies.length === 0) {
    console.log('No companies found');
    return;
  }

  console.log(`\nFound ${companies.length} companies:\n`);
  
  companies.forEach((company, index) => {
    console.log(`${index + 1}. ${company.name}`);
    if (company.description) {
      console.log(`   Description: ${company.description.substring(0, 60)}...`);
    }
    if (company.website) {
      console.log(`   Website: ${company.website}`);
    }
    console.log(`   Headquarteres: ${company.headquarters || 'N/A'}`);
    console.log(`   Founded: ${company.founded_year || 'N/A'}`);
    console.log('');
  });

  // Save to file
  const json = JSON.stringify(companies, null, 2);
  fs.writeFileSync('all-companies-list.json', json);
  console.log('\n✅ Company list saved to all-companies-list.json');
}

listAllCompanies().catch(console.error);
