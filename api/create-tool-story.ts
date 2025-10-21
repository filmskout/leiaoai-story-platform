import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { title, content, tags, toolId, companyId, userId } = req.body;

    if (!title || !content || !userId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // 创建故事
    const { data: story, error: storyError } = await supabase
      .from('stories')
      .insert({
        title,
        content,
        tags: tags || [],
        user_id: userId,
        status: 'published'
      })
      .select()
      .single();

    if (storyError) {
      console.error('Story creation error:', storyError);
      return res.status(500).json({ error: 'Failed to create story' });
    }

    // 关联到工具
    if (toolId) {
      const { error: toolLinkError } = await supabase
        .from('tool_stories')
        .insert({
          story_id: story.id,
          tool_id: toolId
        });

      if (toolLinkError) {
        console.error('Tool link error:', toolLinkError);
        // 不返回错误，因为故事已经创建成功
      }
    }

    // 关联到公司
    if (companyId) {
      const { error: companyLinkError } = await supabase
        .from('company_stories')
        .insert({
          story_id: story.id,
          company_id: companyId
        });

      if (companyLinkError) {
        console.error('Company link error:', companyLinkError);
        // 不返回错误，因为故事已经创建成功
      }
    }

    return res.status(200).json({ 
      success: true, 
      story: {
        id: story.id,
        title: story.title,
        content: story.content,
        tags: story.tags,
        created_at: story.created_at
      }
    });

  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
