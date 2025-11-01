import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Heart, 
  MessageSquare, 
  Eye, 
  Calendar,
  Loader2,
  Share2,
  Bookmark,
  User
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface Story {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  featured_image_url: string | null;
  view_count: number;
  like_count: number;
  comment_count: number;
  created_at: string;
  author: string;
  category: string;
  tags?: Array<{ id: string; name: string; display_name: string; color: string }>;
}

interface Tag {
  id: string;
  name: string;
  display_name: string;
  color: string;
  usage_count: number;
}

export function SimpleStoriesWall() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [stories, setStories] = useState<Story[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'newest' | 'popular' | 'views'>('newest');

  // Load stories
  useEffect(() => {
    console.log('🔵 SimpleStoriesWall: Loading stories', { selectedTags, sortBy });
    loadStories();
    loadTags();
  }, [selectedTags, sortBy]);

  const loadStories = async () => {
    try {
      console.log('🔵 SimpleStoriesWall: loadStories started');
      setLoading(true);

      // Build query
      let query = supabase
        .from('stories')
        .select(`
          id,
          title,
          excerpt,
          content,
          cover_image_url,
          views_count,
          likes_count,
          comments_count,
          created_at,
          category,
          tags
        `)
        .eq('status', 'published');

      // Apply sorting
      switch (sortBy) {
        case 'popular':
          query = query.order('likes_count', { ascending: false });
          break;
        case 'views':
          query = query.order('views_count', { ascending: false });
          break;
        default:
          query = query.order('created_at', { ascending: false });
      }

      query = query.limit(50);

      const { data: storiesData, error } = await query;

      if (error) {
        console.error('🔴 SimpleStoriesWall: Database error:', error);
        console.error('🔴 Error details:', {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint
        });
        toast.error(`Failed to load stories: ${error.message || 'Database error'}`);
        setStories([]);
        setLoading(false);
        return;
      }

      if (!storiesData || storiesData.length === 0) {
        console.log('🟡 SimpleStoriesWall: No stories found');
        setStories([]);
        setLoading(false);
        return;
      }
      
      console.log('🟢 SimpleStoriesWall: Loaded stories', { count: storiesData.length });

      // Filter by tags if selected - use tags array from story directly
      if (selectedTags.length > 0) {
        const filteredStories = storiesData.filter((s: any) => {
          const storyTags = (s.tags || []).map((t: string) => t.toLowerCase());
          return selectedTags.some(selectedTag => storyTags.includes(selectedTag.toLowerCase()));
        });
        
        console.log('🟢 SimpleStoriesWall: Filtered by tags', { 
          originalCount: storiesData.length,
          filteredCount: filteredStories.length,
          selectedTags
        });
        
        if (filteredStories.length > 0) {
          // Transform and load tags for filtered stories
          const transformedStories = filteredStories.map((story: any) => ({
            ...story,
            featured_image_url: story.cover_image_url,
            view_count: story.views_count || 0,
            like_count: story.likes_count || 0,
            comment_count: story.comments_count || 0,
            author: 'Community'
          }));
          await loadStoriesTags(transformedStories);
          setStories(transformedStories);
        } else {
          console.log('🟡 SimpleStoriesWall: No stories found with selected tags');
          setStories([]);
        }
      } else {
        // Transform and load tags for all stories
        const transformedStories = storiesData.map((story: any) => ({
          ...story,
          featured_image_url: story.cover_image_url,
          view_count: story.views_count || 0,
          like_count: story.likes_count || 0,
          comment_count: story.comments_count || 0,
          author: 'Community'
        }));
        await loadStoriesTags(transformedStories);
        setStories(transformedStories);
        
        // Extract unique tags from stories for filter
        const uniqueTags = new Set<string>();
        transformedStories.forEach((story: any) => {
          (story.tags || []).forEach((tag: any) => {
            if (typeof tag === 'string') {
              uniqueTags.add(tag);
            } else if (tag.name) {
              uniqueTags.add(tag.name);
            }
          });
        });
        
        // Update tags state with extracted tags
        const tagArray = Array.from(uniqueTags).map(name => ({
          id: name,
          name,
          display_name: name,
          color: '#3B82F6',
          usage_count: transformedStories.filter((s: any) => 
            (s.tags || []).some((t: any) => 
              (typeof t === 'string' ? t : t.name) === name
            )
          ).length
        }));
        setTags(tagArray);
      }
    } catch (error: any) {
      console.error('🔴 SimpleStoriesWall: Error loading stories:', error);
      console.error('🔴 Error details:', {
        message: error?.message,
        stack: error?.stack
      });
      toast.error(`Failed to load stories: ${error?.message || 'Unknown error'}`);
      setStories([]);
    } finally {
      setLoading(false);
      console.log('🔵 SimpleStoriesWall: loadStories completed');
    }
  };

  const loadStoriesTags = async (stories: any[]) => {
    if (stories.length === 0) return;

    try {
      // Tags are already in the story.tags array from the query
      // Just ensure they're in the correct format
      stories.forEach(story => {
        if (!story.tags || story.tags.length === 0) {
          story.tags = [];
        } else if (typeof story.tags[0] === 'string') {
          // Convert string array to tag objects
          story.tags = story.tags.map((t: string) => ({
            id: t,
            name: t,
            display_name: t,
            color: '#3B82F6'
          }));
        }
      });

      console.log('🟢 SimpleStoriesWall: Processed story tags');
    } catch (error) {
      console.error('🔴 SimpleStoriesWall: Error in loadStoriesTags:', error);
      stories.forEach(story => {
        story.tags = [];
      });
    }
  };

  const loadTags = async () => {
    try {
      // Tags will be extracted from stories after they're loaded
      // Initial load - tags will be populated in loadStories after stories are loaded
      console.log('🔵 SimpleStoriesWall: Tags will be extracted from stories');
      // Don't query database - tags come from stories
    } catch (error) {
      console.error('🔴 SimpleStoriesWall: Error in loadTags:', error);
      // Don't show error to user, just log it
    }
  };

  const toggleTag = (tagName: string) => {
    setSelectedTags(prev => 
      prev.includes(tagName) 
        ? prev.filter(t => t !== tagName)
        : [...prev, tagName]
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return t('date.today', 'Today');
    if (diffDays <= 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Filter and Sort Controls */}
      <div className="space-y-4">
        {/* Tags Filter */}
        <div>
          <h3 className="text-sm font-medium text-foreground mb-3">
            {t('stories.filter_by_tags', 'Filter by Tags')}
          </h3>
          <div className="flex flex-wrap gap-2">
            {tags.map(tag => (
              <Badge
                key={tag.id}
                onClick={() => toggleTag(tag.name)}
                className={cn(
                  "cursor-pointer transition-all",
                  selectedTags.includes(tag.name)
                    ? "bg-primary-500 text-white hover:bg-primary-600"
                    : "bg-background-secondary text-foreground hover:bg-background-tertiary"
                )}
                style={{
                  backgroundColor: selectedTags.includes(tag.name) ? tag.color : undefined
                }}
              >
                {tag.display_name}
              </Badge>
            ))}
          </div>
          {selectedTags.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedTags([])}
              className="mt-2"
            >
              {t('stories.clear_filters', 'Clear filters')}
            </Button>
          )}
        </div>

        {/* Sort Options */}
        <div className="flex items-center gap-2">
            <span className="text-sm text-foreground-secondary">
            {t('stories.sort_by', 'Sort by')}:
            </span>
          <div className="flex gap-2">
            <Button
              variant={sortBy === 'newest' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSortBy('newest')}
            >
              {t('stories.sort.newest', 'Newest')}
            </Button>
            <Button
              variant={sortBy === 'popular' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSortBy('popular')}
            >
              {t('stories.sort.popular', 'Popular')}
            </Button>
            <Button
              variant={sortBy === 'views' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSortBy('views')}
            >
              {t('stories.sort.views', 'Most Viewed')}
            </Button>
          </div>
        </div>
      </div>

      {/* Stories Grid */}
      {stories.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-foreground-secondary">
            {t('stories.no_stories_found', 'No stories found')}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stories.map((story, index) => (
            <motion.div
              key={story.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Card 
                className="group overflow-hidden h-full hover:shadow-xl transition-all duration-300 cursor-pointer border"
                onClick={() => navigate(`/story/${story.id}`)}
              >
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900 dark:to-purple-900">
                  {story.featured_image_url ? (
                    <img
                      src={story.featured_image_url}
                      alt={story.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Eye className="w-12 h-12 text-muted-foreground" />
                    </div>
                  )}
                  
                  {/* Tags Overlay */}
                  {story.tags && story.tags.length > 0 && (
                    <div className="absolute top-3 left-3 flex flex-wrap gap-1">
                      {story.tags.slice(0, 2).map(tag => (
                        <Badge
                          key={tag.id}
                          className="bg-white/90 text-gray-900 text-xs"
                          style={{ backgroundColor: `${tag.color}20`, color: tag.color, border: `1px solid ${tag.color}` }}
                        >
                          {tag.display_name}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                <CardContent className="p-5 space-y-3">
                  {/* Title */}
                  <h3 className="text-lg font-semibold text-foreground line-clamp-2 group-hover:text-primary-600 transition-colors">
                    {story.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="text-sm text-foreground-secondary line-clamp-3">
                    {story.excerpt || story.content?.substring(0, 150) + '...'}
                  </p>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-xs text-foreground-muted pt-2">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        <span>{story.view_count || 0}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Heart className="w-3 h-3" />
                        <span>{story.like_count || 0}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageSquare className="w-3 h-3" />
                        <span>{story.comment_count || 0}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(story.created_at)}</span>
                    </div>
                  </div>

                  {/* Author */}
                  <div className="flex items-center gap-2 pt-2 border-t border-border">
                    <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center">
                      <User className="w-3 h-3 text-primary-600" />
                    </div>
                    <span className="text-sm text-foreground-secondary">
                      LeiaoAI Agent
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

