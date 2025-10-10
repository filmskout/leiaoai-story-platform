import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface Story {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  featured_image_url: string | null;
  view_count: number;
  like_count: number;
  comment_count: number;
  created_at: string;
  publisher: string;
}

export default function DebugStories() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rawData, setRawData] = useState<any>(null);

  useEffect(() => {
    fetchStoriesDebug();
  }, []);

  const fetchStoriesDebug = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('DEBUG: Starting Supabase query...');
      
      // Simple, direct query
      const { data, error: fetchError } = await supabase
        .from('stories')
        .select(`
          id,
          title,
          content,
          excerpt,
          featured_image_url,
          view_count,
          like_count,
          comment_count,
          created_at,
          publisher
        `)
        .eq('status', 'published')
        .eq('is_public', true)
        .order('created_at', { ascending: false })
        .limit(5);

      console.log('DEBUG: Query completed');
      console.log('DEBUG: Error:', fetchError);
      console.log('DEBUG: Data:', data);
      
      setRawData({ data, error: fetchError });

      if (fetchError) {
        console.error('Database query error:', fetchError);
        throw fetchError;
      }

      console.log(`DEBUG: Successfully fetched ${data?.length || 0} stories`);
      
      if (data && data.length > 0) {
        setStories(data);
      } else {
        console.log('DEBUG: No stories found');
        setStories([]);
      }
      
    } catch (err: any) {
      console.error('DEBUG: Failed to fetch stories:', err);
      setError(`Failed to load stories: ${err.message}`);
      setStories([]);
    } finally {
      setLoading(false);
    }
  };

  const testImageLoad = (imageUrl: string) => {
    const img = new Image();
    img.onload = () => console.log(`✅ Image loaded: ${imageUrl}`);
    img.onerror = () => console.log(`❌ Image failed: ${imageUrl}`);
    img.src = imageUrl;
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-foreground">Stories Debug Page</h1>
        
        {/* Debug Controls */}
        <div className="mb-8 p-4 bg-muted rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Debug Controls</h2>
          <button 
            onClick={fetchStoriesDebug}
            className="px-4 py-2 bg-primary text-primary-foreground rounded mr-4"
          >
            Refetch Stories
          </button>
          <button 
            onClick={() => console.log('Current stories state:', stories)}
            className="px-4 py-2 bg-secondary text-secondary-foreground rounded mr-4"
          >
            Log Stories State
          </button>
          <button 
            onClick={() => {
              stories.forEach(story => {
                if (story.featured_image_url) {
                  testImageLoad(story.featured_image_url);
                }
              });
            }}
            className="px-4 py-2 bg-accent text-accent-foreground rounded"
          >
            Test Image Loading
          </button>
        </div>

        {/* Raw Data Display */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Raw Database Response</h2>
          <pre className="bg-muted p-4 rounded-lg text-xs overflow-auto max-h-64">
            {JSON.stringify(rawData, null, 2)}
          </pre>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-flex items-center space-x-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              <span>Loading stories...</span>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-8">
            <h3 className="text-destructive font-semibold mb-2">Error:</h3>
            <p className="text-destructive">{error}</p>
          </div>
        )}

        {/* Stories Display */}
        {!loading && !error && (
          <div>
            <h2 className="text-xl font-semibold mb-4">
              Stories ({stories.length} found)
            </h2>
            
            {stories.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No stories found in database
              </div>
            ) : (
              <div className="space-y-6">
                {stories.map((story, index) => (
                  <div key={story.id} className="border rounded-lg p-6">
                    <div className="flex items-start space-x-4">
                      {/* Image */}
                      <div className="w-24 h-24 bg-muted rounded-lg flex-shrink-0">
                        {story.featured_image_url ? (
                          <img
                            src={story.featured_image_url}
                            alt={story.title}
                            className="w-full h-full object-cover rounded-lg"
                            onLoad={() => console.log(`✅ Image rendered: ${story.featured_image_url}`)}
                            onError={() => console.log(`❌ Image render failed: ${story.featured_image_url}`)}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                            No Image
                          </div>
                        )}
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold mb-2">{story.title}</h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          {story.excerpt || story.content?.substring(0, 120) + '...'}
                        </p>
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                          <span>👁 {story.view_count}</span>
                          <span>❤️ {story.like_count}</span>
                          <span>💬 {story.comment_count}</span>
                          <span>📅 {new Date(story.created_at).toLocaleDateString()}</span>
                          <span>👤 {story.publisher}</span>
                        </div>
                        <div className="mt-2 text-xs font-mono text-muted-foreground">
                          ID: {story.id}
                        </div>
                        <div className="mt-1 text-xs font-mono text-muted-foreground">
                          Image: {story.featured_image_url || 'null'}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
