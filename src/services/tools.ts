import { supabase } from '@/lib/supabase';

// 获取AI公司及其项目套件
export async function listAICompaniesWithTools() {
  const { data, error } = await supabase
    .from('companies')
    .select(`
      *,
      projects:projects(*),
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
      projects:projects(*),
      fundings:fundings(*),
      stories:stories(*)
    `)
    .eq('id', companyId)
    .single();
  if (error) throw error;
  return data;
}

// 获取单个项目的详细信息
export async function getToolDetails(toolId: string) {
  const { data, error } = await supabase
    .from('projects')
    .select(`
      *,
      company:companies(*),
      project_stats:project_stats(*),
      project_ratings:project_ratings(*, user_id),
      project_stories:project_stories(story:stories(*))
    `)
    .eq('id', toolId)
    .single();
  if (error) throw error;
  return data;
}

// 用户评分相关功能
export async function getUserRating(userId: string, toolId: string) {
  const { data, error } = await supabase
    .from('project_ratings')
    .select('*')
    .eq('user_id', userId)
    .eq('project_id', toolId)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function submitRating(userId: string, toolId: string, rating: number, reviewText?: string) {
  const { data, error } = await supabase
    .from('project_ratings')
    .upsert({
      user_id: userId,
      project_id: toolId,
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
      project:projects(*, company:companies(*), project_stats:project_stats(*))
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
      project_id: toolId
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
    .eq('project_id', toolId);
  if (error) throw error;
}

export async function isFavorite(userId: string, toolId: string) {
  const { data, error } = await supabase
    .from('user_favorites')
    .select('id')
    .eq('user_id', userId)
    .eq('project_id', toolId)
    .maybeSingle();
  if (error) throw error;
  return !!data;
}

// 故事关联功能
export async function linkStoryToTool(storyId: string, toolId: string) {
  const { data, error } = await supabase
    .from('project_stories')
    .insert({
      story_id: storyId,
      project_id: toolId
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

// 获取项目的故事
export async function getToolStories(toolId: string) {
  const { data, error } = await supabase
    .from('project_stories')
    .select(`
      *,
      story:stories(*)
    `)
    .eq('project_id', toolId)
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
      story:stories(
        id,
        title,
        content,
        excerpt,
        cover_image_url,
        category,
        tags,
        likes_count,
        views_count,
        comments_count,
        saves_count,
        share_count,
        created_at,
        author_id,
        status
      )
    `)
    .eq('company_id', companyId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  
  // Transform to flat structure
  return (data || []).map(item => ({
    ...item.story,
    id: item.story.id
  }));
}

// 搜索功能
export async function searchAICompanies(query: string) {
  const { data, error } = await supabase
    .from('companies')
    .select(`
      *,
      projects:projects(*, project_stats:project_stats(*)),
      company_stats:company_stats(*)
    `)
    .or(`name.ilike.%${query}%, description.ilike.%${query}%, industry_tags.cs.{${query}}`)
    .order('name');
  if (error) throw error;
  return data;
}

export async function searchTools(query: string) {
  const { data, error } = await supabase
    .from('projects')
    .select(`
      *,
      company:companies(*),
      project_stats:project_stats(*)
    `)
    .or(`name.ilike.%${query}%, description.ilike.%${query}%, category.ilike.%${query}%`)
    .order('name');
  if (error) throw error;
  return data;
}

// 按类别筛选
export async function getToolsByCategory(category: string) {
  const { data, error } = await supabase
    .from('projects')
    .select(`
      *,
      company:companies(*),
      project_stats:project_stats(*)
    `)
    .eq('category', category)
    .order('name');
  if (error) throw error;
  return data;
}

// 按公司筛选
export async function getToolsByCompany(companyId: string) {
  const { data, error } = await supabase
    .from('projects')
    .select(`
      *,
      company:companies(*),
      project_stats:project_stats(*)
    `)
    .eq('company_id', companyId)
    .order('name');
  if (error) throw error;
  return data;
}

// 获取热门项目（按评分排序）
export async function getTopRatedTools(limit: number = 20) {
  const { data, error } = await supabase
    .from('projects')
    .select(`
      *,
      company:companies(*),
      project_stats:project_stats(*)
    `)
    .order('project_stats.average_rating', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data;
}

// 获取最新项目
export async function getLatestTools(limit: number = 20) {
  const { data, error } = await supabase
    .from('projects')
    .select(`
      *,
      company:companies(*),
      project_stats:project_stats(*)
    `)
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data;
}

// 保留原有函数以保持兼容性
export async function listToolsWithCompany() {
  const { data, error } = await supabase
    .from('projects')
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


