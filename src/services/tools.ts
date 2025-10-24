import { supabase } from '@/lib/supabase';

// 获取AI公司及其工具套件（兼容旧数据库结构）
export async function listAICompaniesWithTools() {
  const { data, error } = await supabase
    .from('companies')
    .select(`
      *,
      tools:tools(*),
      fundings:fundings(*),
      stories:stories(*)
    `)
    .order('name');
  if (error) throw error;
  return data;
}

// 获取单个公司的详细信息
export async function getCompanyDetails(companyId: string) {
  const { data, error } = await supabase
    .from('companies')
    .select(`
      *,
      tools:tools(*, tool_stats:tool_stats(*)),
      fundings:fundings(*),
      company_stats:company_stats(*)
    `)
    .eq('id', companyId)
    .single();
  if (error) throw error;
  return data;
}

// 获取单个工具的详细信息
export async function getToolDetails(toolId: string) {
  const { data, error } = await supabase
    .from('tools')
    .select(`
      *,
      company:companies(*),
      tool_stats:tool_stats(*),
      tool_ratings:tool_ratings(*, user_id),
      tool_stories:tool_stories(story:stories(*))
    `)
    .eq('id', toolId)
    .single();
  if (error) throw error;
  return data;
}

// 用户评分相关功能
export async function getUserRating(userId: string, toolId: string) {
  const { data, error } = await supabase
    .from('tool_ratings')
    .select('*')
    .eq('user_id', userId)
    .eq('tool_id', toolId)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function submitRating(userId: string, toolId: string, rating: number, reviewText?: string) {
  const { data, error } = await supabase
    .from('tool_ratings')
    .upsert({
      user_id: userId,
      tool_id: toolId,
      rating,
      review_text: reviewText
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

// 用户收藏相关功能
export async function getUserFavorites(userId: string) {
  const { data, error } = await supabase
    .from('user_favorites')
    .select(`
      *,
      tool:tools(*, company:companies(*), tool_stats:tool_stats(*))
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function addToFavorites(userId: string, toolId: string) {
  const { data, error } = await supabase
    .from('user_favorites')
    .insert({
      user_id: userId,
      tool_id: toolId
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function removeFromFavorites(userId: string, toolId: string) {
  const { error } = await supabase
    .from('user_favorites')
    .delete()
    .eq('user_id', userId)
    .eq('tool_id', toolId);
  if (error) throw error;
}

export async function isFavorite(userId: string, toolId: string) {
  const { data, error } = await supabase
    .from('user_favorites')
    .select('id')
    .eq('user_id', userId)
    .eq('tool_id', toolId)
    .maybeSingle();
  if (error) throw error;
  return !!data;
}

// 故事关联功能
export async function linkStoryToTool(storyId: string, toolId: string) {
  const { data, error } = await supabase
    .from('tool_stories')
    .insert({
      story_id: storyId,
      tool_id: toolId
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function linkStoryToCompany(storyId: string, companyId: string) {
  const { data, error } = await supabase
    .from('company_stories')
    .insert({
      story_id: storyId,
      company_id: companyId
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

// 获取工具的故事
export async function getToolStories(toolId: string) {
  const { data, error } = await supabase
    .from('tool_stories')
    .select(`
      *,
      story:stories(*)
    `)
    .eq('tool_id', toolId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

// 获取公司的故事
export async function getCompanyStories(companyId: string) {
  const { data, error } = await supabase
    .from('company_stories')
    .select(`
      *,
      story:stories(*)
    `)
    .eq('company_id', companyId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

// 搜索功能
export async function searchAICompanies(query: string) {
  const { data, error } = await supabase
    .from('companies')
    .select(`
      *,
      tools:tools(*, tool_stats:tool_stats(*)),
      company_stats:company_stats(*)
    `)
    .or(`name.ilike.%${query}%, description.ilike.%${query}%, industry_tags.cs.{${query}}`)
    .order('name');
  if (error) throw error;
  return data;
}

export async function searchTools(query: string) {
  const { data, error } = await supabase
    .from('tools')
    .select(`
      *,
      company:companies(*),
      tool_stats:tool_stats(*)
    `)
    .or(`name.ilike.%${query}%, description.ilike.%${query}%, industry_tags.cs.{${query}}`)
    .order('name');
  if (error) throw error;
  return data;
}

// 按类别筛选
export async function getToolsByCategory(category: string) {
  const { data, error } = await supabase
    .from('tools')
    .select(`
      *,
      company:companies(*),
      tool_stats:tool_stats(*)
    `)
    .eq('category', category)
    .order('name');
  if (error) throw error;
  return data;
}

// 按公司筛选
export async function getToolsByCompany(companyId: string) {
  const { data, error } = await supabase
    .from('tools')
    .select(`
      *,
      company:companies(*),
      tool_stats:tool_stats(*)
    `)
    .eq('company_id', companyId)
    .order('name');
  if (error) throw error;
  return data;
}

// 获取热门工具（按评分排序）
export async function getTopRatedTools(limit: number = 20) {
  const { data, error } = await supabase
    .from('tools')
    .select(`
      *,
      company:companies(*),
      tool_stats:tool_stats(*)
    `)
    .order('tool_stats.average_rating', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data;
}

// 获取最新工具
export async function getLatestTools(limit: number = 20) {
  const { data, error } = await supabase
    .from('tools')
    .select(`
      *,
      company:companies(*),
      tool_stats:tool_stats(*)
    `)
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data;
}

// 保留原有函数以保持兼容性
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

export async function getCompanyResearch(domain: string) {
  const { data, error } = await supabase
    .from('company_research')
    .select('*')
    .eq('company_domain', domain)
    .maybeSingle();
  if (error) throw error;
  return data;
}


