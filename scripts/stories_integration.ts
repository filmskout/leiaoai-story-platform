import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

interface StoryCompanyLink {
  story_id: string;
  company_id: string;
  company_name: string;
  company_name_en?: string;
  company_name_zh_hans?: string;
}

interface StoryToolLink {
  story_id: string;
  tool_id: string;
  tool_name: string;
  company_id: string;
  company_name: string;
}

interface StoryWithLinks {
  id: string;
  title: string;
  content: string;
  tags: string[];
  category: string;
  status: string;
  created_at: string;
  updated_at: string;
  companies: StoryCompanyLink[];
  tools: StoryToolLink[];
}

// 创建公司-Stories关联表
async function createCompanyStoriesTable(): Promise<void> {
  try {
    console.log('🔄 创建 company_stories 关联表...');
    
    const { error } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS company_stories (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
          story_id UUID NOT NULL REFERENCES stories(id) ON DELETE CASCADE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          UNIQUE(company_id, story_id)
        );
        
        CREATE INDEX IF NOT EXISTS idx_company_stories_company_id ON company_stories(company_id);
        CREATE INDEX IF NOT EXISTS idx_company_stories_story_id ON company_stories(story_id);
        
        -- 启用RLS
        ALTER TABLE company_stories ENABLE ROW LEVEL SECURITY;
        
        -- 创建RLS策略
        CREATE POLICY IF NOT EXISTS "company_stories_read_all" ON company_stories
          FOR SELECT USING (true);
          
        CREATE POLICY IF NOT EXISTS "company_stories_insert_service_role" ON company_stories
          FOR INSERT WITH CHECK (auth.role() = 'service_role');
          
        CREATE POLICY IF NOT EXISTS "company_stories_update_service_role" ON company_stories
          FOR UPDATE USING (auth.role() = 'service_role');
          
        CREATE POLICY IF NOT EXISTS "company_stories_delete_service_role" ON company_stories
          FOR DELETE USING (auth.role() = 'service_role');
      `
    });

    if (error) {
      console.error('❌ 创建 company_stories 表失败:', error);
      throw error;
    }

    console.log('✅ company_stories 表创建成功');
  } catch (error) {
    console.error('❌ 创建 company_stories 表失败:', error);
    throw error;
  }
}

// 创建工具-Stories关联表
async function createToolStoriesTable(): Promise<void> {
  try {
    console.log('🔄 创建 tool_stories 关联表...');
    
    const { error } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS tool_stories (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          tool_id UUID NOT NULL REFERENCES tools(id) ON DELETE CASCADE,
          story_id UUID NOT NULL REFERENCES stories(id) ON DELETE CASCADE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          UNIQUE(tool_id, story_id)
        );
        
        CREATE INDEX IF NOT EXISTS idx_tool_stories_tool_id ON tool_stories(tool_id);
        CREATE INDEX IF NOT EXISTS idx_tool_stories_story_id ON tool_stories(story_id);
        
        -- 启用RLS
        ALTER TABLE tool_stories ENABLE ROW LEVEL SECURITY;
        
        -- 创建RLS策略
        CREATE POLICY IF NOT EXISTS "tool_stories_read_all" ON tool_stories
          FOR SELECT USING (true);
          
        CREATE POLICY IF NOT EXISTS "tool_stories_insert_service_role" ON tool_stories
          FOR INSERT WITH CHECK (auth.role() = 'service_role');
          
        CREATE POLICY IF NOT EXISTS "tool_stories_update_service_role" ON tool_stories
          FOR UPDATE USING (auth.role() = 'service_role');
          
        CREATE POLICY IF NOT EXISTS "tool_stories_delete_service_role" ON tool_stories
          FOR DELETE USING (auth.role() = 'service_role');
      `
    });

    if (error) {
      console.error('❌ 创建 tool_stories 表失败:', error);
      throw error;
    }

    console.log('✅ tool_stories 表创建成功');
  } catch (error) {
    console.error('❌ 创建 tool_stories 表失败:', error);
    throw error;
  }
}

// 为现有Stories创建公司关联
async function linkStoriesToCompanies(): Promise<void> {
  try {
    console.log('🔄 为现有Stories创建公司关联...');
    
    // 获取所有Stories
    const { data: stories, error: storiesError } = await supabase
      .from('stories')
      .select('id, title, content, tags')
      .eq('status', 'published');

    if (storiesError) {
      console.error('❌ 获取Stories失败:', storiesError);
      return;
    }

    if (!stories || stories.length === 0) {
      console.log('⚠️ 没有找到已发布的Stories');
      return;
    }

    console.log(`📊 找到 ${stories.length} 篇已发布的Stories`);

    let linkedCount = 0;

    for (const story of stories) {
      // 从tags中提取公司名称
      const companyNames = story.tags?.filter(tag => 
        tag && typeof tag === 'string' && tag.length > 0
      ) || [];

      for (const companyName of companyNames) {
        // 查找匹配的公司
        const { data: company } = await supabase
          .from('companies')
          .select('id, name')
          .or(`name.ilike.%${companyName}%,name_en.ilike.%${companyName}%,name_zh_hans.ilike.%${companyName}%`)
          .single();

        if (company) {
          // 创建关联
          const { error } = await supabase
            .from('company_stories')
            .insert({
              company_id: company.id,
              story_id: story.id
            });

          if (!error) {
            linkedCount++;
            console.log(`✅ 关联 ${story.title} -> ${company.name}`);
          }
        }
      }
    }

    console.log(`✅ 成功创建 ${linkedCount} 个公司-Stories关联`);
  } catch (error) {
    console.error('❌ 创建公司关联失败:', error);
  }
}

// 为现有Stories创建工具关联
async function linkStoriesToTools(): Promise<void> {
  try {
    console.log('🔄 为现有Stories创建工具关联...');
    
    // 获取所有Stories
    const { data: stories, error: storiesError } = await supabase
      .from('stories')
      .select('id, title, content, tags')
      .eq('status', 'published');

    if (storiesError) {
      console.error('❌ 获取Stories失败:', storiesError);
      return;
    }

    if (!stories || stories.length === 0) {
      console.log('⚠️ 没有找到已发布的Stories');
      return;
    }

    console.log(`📊 找到 ${stories.length} 篇已发布的Stories`);

    let linkedCount = 0;

    for (const story of stories) {
      // 从tags中提取工具名称
      const toolNames = story.tags?.filter(tag => 
        tag && typeof tag === 'string' && tag.length > 0
      ) || [];

      for (const toolName of toolNames) {
        // 查找匹配的工具
        const { data: tool } = await supabase
          .from('tools')
          .select('id, name, company_id')
          .or(`name.ilike.%${toolName}%,name_en.ilike.%${toolName}%,name_zh_hans.ilike.%${toolName}%`)
          .single();

        if (tool) {
          // 创建关联
          const { error } = await supabase
            .from('tool_stories')
            .insert({
              tool_id: tool.id,
              story_id: story.id
            });

          if (!error) {
            linkedCount++;
            console.log(`✅ 关联 ${story.title} -> ${tool.name}`);
          }
        }
      }
    }

    console.log(`✅ 成功创建 ${linkedCount} 个工具-Stories关联`);
  } catch (error) {
    console.error('❌ 创建工具关联失败:', error);
  }
}

// 获取Stories的关联公司信息
async function getStoryCompanies(storyId: string): Promise<StoryCompanyLink[]> {
  try {
    const { data, error } = await supabase
      .from('company_stories')
      .select(`
        company_id,
        companies!inner (
          id,
          name,
          name_en,
          name_zh_hans
        )
      `)
      .eq('story_id', storyId);

    if (error) {
      console.error('❌ 获取Stories公司关联失败:', error);
      return [];
    }

    return data?.map(item => ({
      story_id: storyId,
      company_id: item.company_id,
      company_name: item.companies.name,
      company_name_en: item.companies.name_en,
      company_name_zh_hans: item.companies.name_zh_hans
    })) || [];
  } catch (error) {
    console.error('❌ 获取Stories公司关联失败:', error);
    return [];
  }
}

// 获取Stories的关联工具信息
async function getStoryTools(storyId: string): Promise<StoryToolLink[]> {
  try {
    const { data, error } = await supabase
      .from('tool_stories')
      .select(`
        tool_id,
        tools!inner (
          id,
          name,
          company_id,
          companies!inner (
            id,
            name
          )
        )
      `)
      .eq('story_id', storyId);

    if (error) {
      console.error('❌ 获取Stories工具关联失败:', error);
      return [];
    }

    return data?.map(item => ({
      story_id: storyId,
      tool_id: item.tool_id,
      tool_name: item.tools.name,
      company_id: item.tools.company_id,
      company_name: item.tools.companies.name
    })) || [];
  } catch (error) {
    console.error('❌ 获取Stories工具关联失败:', error);
    return [];
  }
}

// 获取公司的相关Stories
async function getCompanyStories(companyId: string, limit: number = 10): Promise<StoryWithLinks[]> {
  try {
    const { data, error } = await supabase
      .from('company_stories')
      .select(`
        story_id,
        stories!inner (
          id,
          title,
          content,
          tags,
          category,
          status,
          created_at,
          updated_at
        )
      `)
      .eq('company_id', companyId)
      .eq('stories.status', 'published')
      .order('stories.created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('❌ 获取公司Stories失败:', error);
      return [];
    }

    const stories: StoryWithLinks[] = [];

    for (const item of data || []) {
      const story = item.stories;
      const companies = await getStoryCompanies(story.id);
      const tools = await getStoryTools(story.id);

      stories.push({
        id: story.id,
        title: story.title,
        content: story.content,
        tags: story.tags || [],
        category: story.category,
        status: story.status,
        created_at: story.created_at,
        updated_at: story.updated_at,
        companies,
        tools
      });
    }

    return stories;
  } catch (error) {
    console.error('❌ 获取公司Stories失败:', error);
    return [];
  }
}

// 获取工具的相关Stories
async function getToolStories(toolId: string, limit: number = 10): Promise<StoryWithLinks[]> {
  try {
    const { data, error } = await supabase
      .from('tool_stories')
      .select(`
        story_id,
        stories!inner (
          id,
          title,
          content,
          tags,
          category,
          status,
          created_at,
          updated_at
        )
      `)
      .eq('tool_id', toolId)
      .eq('stories.status', 'published')
      .order('stories.created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('❌ 获取工具Stories失败:', error);
      return [];
    }

    const stories: StoryWithLinks[] = [];

    for (const item of data || []) {
      const story = item.stories;
      const companies = await getStoryCompanies(story.id);
      const tools = await getStoryTools(story.id);

      stories.push({
        id: story.id,
        title: story.title,
        content: story.content,
        tags: story.tags || [],
        category: story.category,
        status: story.status,
        created_at: story.created_at,
        updated_at: story.updated_at,
        companies,
        tools
      });
    }

    return stories;
  } catch (error) {
    console.error('❌ 获取工具Stories失败:', error);
    return [];
  }
}

// 创建评分系统
async function createRatingSystem(): Promise<void> {
  try {
    console.log('🔄 创建评分系统...');
    
    const { error } = await supabase.rpc('exec_sql', {
      sql: `
        -- 创建公司评分表
        CREATE TABLE IF NOT EXISTS company_ratings (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
          user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
          rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
          review_text TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          UNIQUE(company_id, user_id)
        );
        
        -- 创建工具评分表
        CREATE TABLE IF NOT EXISTS tool_ratings (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          tool_id UUID NOT NULL REFERENCES tools(id) ON DELETE CASCADE,
          user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
          rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
          review_text TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          UNIQUE(tool_id, user_id)
        );
        
        -- 创建索引
        CREATE INDEX IF NOT EXISTS idx_company_ratings_company_id ON company_ratings(company_id);
        CREATE INDEX IF NOT EXISTS idx_company_ratings_user_id ON company_ratings(user_id);
        CREATE INDEX IF NOT EXISTS idx_tool_ratings_tool_id ON tool_ratings(tool_id);
        CREATE INDEX IF NOT EXISTS idx_tool_ratings_user_id ON tool_ratings(user_id);
        
        -- 启用RLS
        ALTER TABLE company_ratings ENABLE ROW LEVEL SECURITY;
        ALTER TABLE tool_ratings ENABLE ROW LEVEL SECURITY;
        
        -- 创建RLS策略
        CREATE POLICY IF NOT EXISTS "company_ratings_read_all" ON company_ratings
          FOR SELECT USING (true);
          
        CREATE POLICY IF NOT EXISTS "company_ratings_insert_authenticated" ON company_ratings
          FOR INSERT WITH CHECK (auth.role() = 'authenticated');
          
        CREATE POLICY IF NOT EXISTS "company_ratings_update_own" ON company_ratings
          FOR UPDATE USING (auth.uid() = user_id);
          
        CREATE POLICY IF NOT EXISTS "company_ratings_delete_own" ON company_ratings
          FOR DELETE USING (auth.uid() = user_id);
          
        CREATE POLICY IF NOT EXISTS "tool_ratings_read_all" ON tool_ratings
          FOR SELECT USING (true);
          
        CREATE POLICY IF NOT EXISTS "tool_ratings_insert_authenticated" ON tool_ratings
          FOR INSERT WITH CHECK (auth.role() = 'authenticated');
          
        CREATE POLICY IF NOT EXISTS "tool_ratings_update_own" ON tool_ratings
          FOR UPDATE USING (auth.uid() = user_id);
          
        CREATE POLICY IF NOT EXISTS "tool_ratings_delete_own" ON tool_ratings
          FOR DELETE USING (auth.uid() = user_id);
      `
    });

    if (error) {
      console.error('❌ 创建评分系统失败:', error);
      throw error;
    }

    console.log('✅ 评分系统创建成功');
  } catch (error) {
    console.error('❌ 创建评分系统失败:', error);
    throw error;
  }
}

async function main() {
  console.log('🚀 开始设置Stories与公司/工具页面互联互通...');
  console.log('═'.repeat(60));

  try {
    // 1. 创建关联表
    await createCompanyStoriesTable();
    await createToolStoriesTable();
    
    // 2. 创建评分系统
    await createRatingSystem();
    
    // 3. 为现有Stories创建关联
    await linkStoriesToCompanies();
    await linkStoriesToTools();

    console.log('\n' + '═'.repeat(60));
    console.log('📊 设置完成');
    console.log('═'.repeat(60));
    console.log('✅ 关联表创建完成');
    console.log('✅ 评分系统创建完成');
    console.log('✅ 现有Stories关联完成');
    console.log('✅ Stories与公司/工具页面互联互通设置完成');

  } catch (error) {
    console.error('❌ 主程序执行失败:', error);
    process.exit(1);
  }
}

// 运行主函数
main().catch(console.error);
