import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseServiceKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) as string;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase URL or Service Key environment variables.');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface DataIntegrityReport {
  companies: {
    total: number;
    withDescriptions: number;
    withLogos: number;
    withFunding: number;
    withTools: number;
    missingData: string[];
  };
  tools: {
    total: number;
    withDescriptions: number;
    withLogos: number;
    withPricing: number;
    withFeatures: number;
    missingData: string[];
  };
  fundings: {
    total: number;
    recentUpdates: number;
    missingAmounts: number;
  };
  issues: string[];
}

async function checkDataIntegrity(): Promise<DataIntegrityReport> {
  console.log('🔍 Starting data integrity check...\n');

  const report: DataIntegrityReport = {
    companies: { total: 0, withDescriptions: 0, withLogos: 0, withFunding: 0, withTools: 0, missingData: [] },
    tools: { total: 0, withDescriptions: 0, withLogos: 0, withPricing: 0, withFeatures: 0, missingData: [] },
    fundings: { total: 0, recentUpdates: 0, missingAmounts: 0 },
    issues: []
  };

  try {
    // Check Companies
    console.log('📊 Checking companies...');
    const { data: companies, error: companiesError } = await supabase
      .from('companies')
      .select('id, name, description, logo_url, valuation_usd, industry_tags, website');

    if (companiesError) {
      report.issues.push(`Companies query error: ${companiesError.message}`);
    } else {
      report.companies.total = companies?.length || 0;
      
      companies?.forEach(company => {
        if (!company.description || company.description.length < 20) {
          report.companies.missingData.push(`${company.name}: Missing or short description`);
        } else {
          report.companies.withDescriptions++;
        }

        if (!company.logo_url) {
          report.companies.missingData.push(`${company.name}: Missing logo URL`);
        } else {
          report.companies.withLogos++;
        }

        if (!company.valuation_usd) {
          report.companies.missingData.push(`${company.name}: Missing valuation`);
        }

        if (!company.industry_tags || company.industry_tags.length === 0) {
          report.companies.missingData.push(`${company.name}: Missing industry tags`);
        }

        if (!company.website) {
          report.companies.missingData.push(`${company.name}: Missing website`);
        }
      });
    }

    // Check Tools
    console.log('🛠️ Checking tools...');
    const { data: tools, error: toolsError } = await supabase
      .from('tools')
      .select('id, name, description, logo_url, pricing_model, features, category, company_id');

    if (toolsError) {
      report.issues.push(`Tools query error: ${toolsError.message}`);
    } else {
      report.tools.total = tools?.length || 0;
      
      tools?.forEach(tool => {
        if (!tool.description || tool.description.length < 20) {
          report.tools.missingData.push(`${tool.name}: Missing or short description`);
        } else {
          report.tools.withDescriptions++;
        }

        if (!tool.logo_url) {
          report.tools.missingData.push(`${tool.name}: Missing logo URL`);
        } else {
          report.tools.withLogos++;
        }

        if (!tool.pricing_model) {
          report.tools.missingData.push(`${tool.name}: Missing pricing model`);
        } else {
          report.tools.withPricing++;
        }

        if (!tool.features || tool.features.length === 0) {
          report.tools.missingData.push(`${tool.name}: Missing features`);
        } else {
          report.tools.withFeatures++;
        }
      });
    }

    // Check Fundings
    console.log('💰 Checking fundings...');
    const { data: fundings, error: fundingsError } = await supabase
      .from('fundings')
      .select('id, amount_usd, announced_on, company_id');

    if (fundingsError) {
      report.issues.push(`Fundings query error: ${fundingsError.message}`);
    } else {
      report.fundings.total = fundings?.length || 0;
      
      fundings?.forEach(funding => {
        if (!funding.amount_usd) {
          report.fundings.missingAmounts++;
        }

        // Check for recent updates (last 6 months)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        if (funding.announced_on && new Date(funding.announced_on) > sixMonthsAgo) {
          report.fundings.recentUpdates++;
        }
      });
    }

    // Check Company-Tool relationships
    console.log('🔗 Checking company-tool relationships...');
    const { data: companyTools, error: companyToolsError } = await supabase
      .from('tools')
      .select('company_id, companies!inner(id, name)');

    if (companyToolsError) {
      report.issues.push(`Company-tools relationship error: ${companyToolsError.message}`);
    } else {
      const companyIds = new Set(companyTools?.map(ct => ct.company_id));
      report.companies.withTools = companyIds.size;
    }

    // Check Company-Funding relationships
    console.log('💼 Checking company-funding relationships...');
    const { data: companyFundings, error: companyFundingsError } = await supabase
      .from('fundings')
      .select('company_id, companies!inner(id, name)');

    if (companyFundingsError) {
      report.issues.push(`Company-fundings relationship error: ${companyFundingsError.message}`);
    } else {
      const fundedCompanyIds = new Set(companyFundings?.map(cf => cf.company_id));
      report.companies.withFunding = fundedCompanyIds.size;
    }

  } catch (error) {
    report.issues.push(`General error: ${error}`);
  }

  return report;
}

function printReport(report: DataIntegrityReport) {
  console.log('\n📋 DATA INTEGRITY REPORT');
  console.log('='.repeat(50));
  
  console.log('\n🏢 COMPANIES:');
  console.log(`  Total: ${report.companies.total}`);
  console.log(`  With descriptions: ${report.companies.withDescriptions} (${Math.round(report.companies.withDescriptions/report.companies.total*100)}%)`);
  console.log(`  With logos: ${report.companies.withLogos} (${Math.round(report.companies.withLogos/report.companies.total*100)}%)`);
  console.log(`  With funding data: ${report.companies.withFunding} (${Math.round(report.companies.withFunding/report.companies.total*100)}%)`);
  console.log(`  With tools: ${report.companies.withTools} (${Math.round(report.companies.withTools/report.companies.total*100)}%)`);

  console.log('\n🛠️ TOOLS:');
  console.log(`  Total: ${report.tools.total}`);
  console.log(`  With descriptions: ${report.tools.withDescriptions} (${Math.round(report.tools.withDescriptions/report.tools.total*100)}%)`);
  console.log(`  With logos: ${report.tools.withLogos} (${Math.round(report.tools.withLogos/report.tools.total*100)}%)`);
  console.log(`  With pricing info: ${report.tools.withPricing} (${Math.round(report.tools.withPricing/report.tools.total*100)}%)`);
  console.log(`  With features: ${report.tools.withFeatures} (${Math.round(report.tools.withFeatures/report.tools.total*100)}%)`);

  console.log('\n💰 FUNDINGS:');
  console.log(`  Total: ${report.fundings.total}`);
  console.log(`  Recent updates (6 months): ${report.fundings.recentUpdates}`);
  console.log(`  Missing amounts: ${report.fundings.missingAmounts}`);

  if (report.companies.missingData.length > 0) {
    console.log('\n⚠️ COMPANY DATA ISSUES:');
    report.companies.missingData.slice(0, 10).forEach(issue => console.log(`  - ${issue}`));
    if (report.companies.missingData.length > 10) {
      console.log(`  ... and ${report.companies.missingData.length - 10} more`);
    }
  }

  if (report.tools.missingData.length > 0) {
    console.log('\n⚠️ TOOL DATA ISSUES:');
    report.tools.missingData.slice(0, 10).forEach(issue => console.log(`  - ${issue}`));
    if (report.tools.missingData.length > 10) {
      console.log(`  ... and ${report.tools.missingData.length - 10} more`);
    }
  }

  if (report.issues.length > 0) {
    console.log('\n❌ ERRORS:');
    report.issues.forEach(issue => console.log(`  - ${issue}`));
  }

  console.log('\n✅ Data integrity check completed!');
}

async function main() {
  try {
    const report = await checkDataIntegrity();
    printReport(report);
  } catch (error) {
    console.error('❌ Error during data integrity check:', error);
  }
}

main();
