import { supabase } from '@/lib/supabase';

export async function listToolsWithCompany() {
  const { data, error } = await supabase
    .from('tools')
    .select('*, company:companies(*), fundings:companies!inner(id, fundings:fundings(*))')
    .limit(100);
  if (error) throw error;
  return data;
}

export async function listCompanyFundings(companyId: string) {
  const { data, error } = await supabase
    .from('fundings')
    .select('*')
    .eq('company_id', companyId)
    .order('announced_on', { ascending: false });
  if (error) throw error;
  return data;
}


