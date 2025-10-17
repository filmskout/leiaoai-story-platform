import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import fetch from 'node-fetch';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseServiceKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) as string;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase URL or Service Key environment variables.');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface UpdateResult {
  companyId: string;
  companyName: string;
  updates: Array<{
    type: string;
    oldValue: string;
    newValue: string;
    source: string;
  }>;
}

class UpdateTracker {
  private delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async checkFundingUpdates(): Promise<UpdateResult[]> {
    console.log('💰 Checking funding updates...');
    const results: UpdateResult[] = [];

    try {
      // Get companies with recent funding activity
      const { data: companies, error } = await supabase
        .from('companies')
        .select('id, name, website, valuation_usd')
        .not('website', 'is', null)
        .limit(50);

      if (error) throw error;

      for (const company of companies || []) {
        try {
          // Check for funding news using web search
          const searchQuery = `${company.name} funding round investment news 2024 2025`;
          const updates = await this.searchForFundingNews(company.name, searchQuery);
          
          if (updates.length > 0) {
            results.push({
              companyId: company.id,
              companyName: company.name,
              updates
            });
          }

          await this.delay(1000); // Rate limiting
        } catch (error) {
          console.error(`Error checking funding for ${company.name}:`, error);
        }
      }
    } catch (error) {
      console.error('Error in funding check:', error);
    }

    return results;
  }

  async checkWebsiteUpdates(): Promise<UpdateResult[]> {
    console.log('🌐 Checking website updates...');
    const results: UpdateResult[] = [];

    try {
      const { data: companies, error } = await supabase
        .from('companies')
        .select('id, name, website, description')
        .not('website', 'is', null)
        .limit(30);

      if (error) throw error;

      for (const company of companies || []) {
        try {
          const updates = await this.checkCompanyWebsite(company);
          if (updates.length > 0) {
            results.push({
              companyId: company.id,
              companyName: company.name,
              updates
            });
          }

          await this.delay(2000); // Rate limiting
        } catch (error) {
          console.error(`Error checking website for ${company.name}:`, error);
        }
      }
    } catch (error) {
      console.error('Error in website check:', error);
    }

    return results;
  }

  private async searchForFundingNews(companyName: string, query: string): Promise<any[]> {
    // This would integrate with news APIs like NewsAPI, Google News, etc.
    // For now, we'll simulate with web search
    try {
      const response = await fetch(`https://api.bing.microsoft.com/v7.0/news/search?q=${encodeURIComponent(query)}&count=5`, {
        headers: {
          'Ocp-Apim-Subscription-Key': process.env.BING_SEARCH_KEY || ''
        }
      });

      if (!response.ok) return [];

      const data = await response.json() as any;
      const updates = [];

      for (const article of data.value || []) {
        // Extract funding information from article
        const fundingMatch = article.description?.match(/(\$[\d,]+(?:\.\d+)?[KMB]?)/g);
        if (fundingMatch) {
          updates.push({
            type: 'funding',
            oldValue: 'Unknown',
            newValue: fundingMatch[0],
            source: article.url
          });
        }
      }

      return updates;
    } catch (error) {
      console.error('Error searching for funding news:', error);
      return [];
    }
  }

  private async checkCompanyWebsite(company: any): Promise<any[]> {
    try {
      const response = await fetch(company.website, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; AICompaniesBot/1.0)'
        },
        timeout: 10000
      });

      if (!response.ok) return [];

      const html = await response.text();
      const updates = [];

      // Check for new product announcements
      const productKeywords = ['new product', 'launch', 'announcement', 'release'];
      const hasNewProducts = productKeywords.some(keyword => 
        html.toLowerCase().includes(keyword)
      );

      if (hasNewProducts) {
        updates.push({
          type: 'product',
          oldValue: 'No recent announcements',
          newValue: 'New product announcements detected',
          source: company.website
        });
      }

      // Check for pricing changes
      const pricingKeywords = ['pricing', 'cost', 'subscription', 'plan'];
      const hasPricingInfo = pricingKeywords.some(keyword => 
        html.toLowerCase().includes(keyword)
      );

      if (hasPricingInfo) {
        updates.push({
          type: 'pricing',
          oldValue: 'Unknown',
          newValue: 'Pricing information available',
          source: company.website
        });
      }

      return updates;
    } catch (error) {
      console.error(`Error checking website for ${company.name}:`, error);
      return [];
    }
  }

  async recordUpdates(updates: UpdateResult[]): Promise<void> {
    console.log('📝 Recording updates...');

    for (const result of updates) {
      for (const update of result.updates) {
        try {
          const { error } = await supabase
            .from('company_updates')
            .insert({
              company_id: result.companyId,
              update_type: update.type,
              old_value: update.oldValue,
              new_value: update.newValue,
              source: update.source,
              verified: false
            });

          if (error) {
            console.error(`Error recording update for ${result.companyName}:`, error);
          } else {
            console.log(`✅ Recorded ${update.type} update for ${result.companyName}`);
          }
        } catch (error) {
          console.error(`Error recording update:`, error);
        }
      }
    }
  }

  async updateMonitoringJob(jobType: string, status: string, results?: any): Promise<void> {
    try {
      const { error } = await supabase
        .from('monitoring_jobs')
        .update({
          last_run: new Date().toISOString(),
          next_run: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Next day
          status,
          results,
          updated_at: new Date().toISOString()
        })
        .eq('job_type', jobType);

      if (error) {
        console.error(`Error updating monitoring job ${jobType}:`, error);
      }
    } catch (error) {
      console.error(`Error updating monitoring job:`, error);
    }
  }

  async runUpdateCheck(): Promise<void> {
    console.log('🚀 Starting automated update check...\n');

    try {
      // Check funding updates
      const fundingUpdates = await this.checkFundingUpdates();
      if (fundingUpdates.length > 0) {
        await this.recordUpdates(fundingUpdates);
        await this.updateMonitoringJob('funding_check', 'completed', { updatesFound: fundingUpdates.length });
      } else {
        await this.updateMonitoringJob('funding_check', 'completed', { updatesFound: 0 });
      }

      // Check website updates
      const websiteUpdates = await this.checkWebsiteUpdates();
      if (websiteUpdates.length > 0) {
        await this.recordUpdates(websiteUpdates);
        await this.updateMonitoringJob('website_check', 'completed', { updatesFound: websiteUpdates.length });
      } else {
        await this.updateMonitoringJob('website_check', 'completed', { updatesFound: 0 });
      }

      console.log('\n✅ Update check completed!');
      console.log(`💰 Funding updates found: ${fundingUpdates.length}`);
      console.log(`🌐 Website updates found: ${websiteUpdates.length}`);

    } catch (error) {
      console.error('❌ Error during update check:', error);
      await this.updateMonitoringJob('funding_check', 'failed', { error: error.message });
    }
  }
}

async function main() {
  const tracker = new UpdateTracker();
  await tracker.runUpdateCheck();
}

main().catch(console.error);
