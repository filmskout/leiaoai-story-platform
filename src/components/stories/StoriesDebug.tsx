import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function StoriesDebug() {
  const [stats, setStats] = useState<any>(null);
  const [stories, setStories] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkDatabase();
  }, []);

  const checkDatabase = async () => {
    try {
      // 1. 检查总数
      const { count: totalCount, error: countError } = await supabase
        .from('stories')
        .select('*', { count: 'exact', head: true });

      if (countError) throw countError;

      // 2. 检查published和public的数量
      const { count: publishedCount, error: publishedError } = await supabase
        .from('stories')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'published')
        .eq('is_public', true);

      if (publishedError) throw publishedError;

      // 3. 获取实际的stories数据
      const { data: storiesData, error: storiesError } = await supabase
        .from('stories')
        .select(`
          id,
          title,
          status,
          is_public,
          author,
          created_at
        `)
        .order('created_at', { ascending: false })
        .limit(10);

      if (storiesError) throw storiesError;

      setStats({
        total: totalCount,
        published: publishedCount,
      });
      setStories(storiesData || []);

    } catch (err: any) {
      console.error('Database check error:', err);
      setError(err.message);
    }
  };

  const fixStories = async () => {
    try {
      // 修复所有stories：设置为published和public
      const { error: updateError } = await supabase
        .from('stories')
        .update({
          status: 'published',
          is_public: true,
          updated_at: new Date().toISOString()
        })
        .or('status.neq.published,is_public.eq.false,status.is.null,is_public.is.null');

      if (updateError) throw updateError;

      // 确保所有stories有author
      const { error: authorError } = await supabase
        .from('stories')
        .update({
          author: '8e19098b-ac2a-4ae0-b063-1e21a8dea19d',
          updated_at: new Date().toISOString()
        })
        .is('author', null);

      if (authorError) throw authorError;

      // 重新检查
      await checkDatabase();
      alert('Stories已修复！请刷新页面查看。');
    } catch (err: any) {
      console.error('Fix error:', err);
      setError(err.message);
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Stories数据库诊断</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>错误: {error}</AlertDescription>
            </Alert>
          )}

          {stats && (
            <div className="space-y-2">
              <p><strong>总Stories数:</strong> {stats.total}</p>
              <p><strong>已发布且公开的Stories数:</strong> {stats.published}</p>
              
              {stats.published === 0 && stats.total > 0 && (
                <Alert>
                  <AlertDescription>
                    发现 {stats.total} 个stories，但没有已发布且公开的！
                    <button
                      onClick={fixStories}
                      className="ml-4 px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600"
                    >
                      自动修复
                    </button>
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}

          <div className="mt-4">
            <h3 className="font-bold mb-2">最近的Stories (前10个):</h3>
            <div className="space-y-2">
              {stories.map((story) => (
                <div key={story.id} className="p-2 border rounded">
                  <p><strong>标题:</strong> {story.title}</p>
                  <p><strong>状态:</strong> {story.status}</p>
                  <p><strong>公开:</strong> {story.is_public ? '是' : '否'}</p>
                  <p><strong>作者ID:</strong> {story.author}</p>
                  <p className="text-xs text-gray-500">创建于: {new Date(story.created_at).toLocaleString()}</p>
                </div>
              ))}
              {stories.length === 0 && <p className="text-gray-500">数据库中没有stories！</p>}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

