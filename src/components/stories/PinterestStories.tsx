import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TagDisplay } from './TagDisplay';
import {
  Heart,
  MessageSquare,
  Eye,
  Calendar,
  User,
  Loader2,
  ArrowUp,
  Filter,
  Tag,
  X,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Tag {
  id: string;
  name: string;
  display_name: string;
  color: string;
  usage_count?: number;
}

interface Story {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  author: string;
  category: string;
  categoryDisplay?: string;
  view_count: number;
  like_count: number;
  comment_count: number;
  created_at: string;
  image: string;
  tags?: Tag[];
  height?: number; // For masonry layout
}

interface PinterestStoriesProps {
  className?: string;
  initialCategory?: string;
  initialTags?: string[];
}

const STORIES_PER_PAGE = 50;
const PRELOAD_THRESHOLD = 300; // pixels from bottom to trigger load

export function PinterestStories({ className, initialCategory = 'all', initialTags = [] }: PinterestStoriesProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedTags, setSelectedTags] = useState<string[]>(initialTags);
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [showTagFilter, setShowTagFilter] = useState(false);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'popular' | 'views'>('newest');
  const [page, setPage] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Categories list
  const categories = [
    { key: 'all', label: t('stories.categories.all') },
    { key: 'ai_tools', label: t('stories.categories.ai_tools') },
    { key: 'startup_interview', label: t('stories.categories.startup_interview') },
    { key: 'investment_outlook', label: t('stories.categories.investment_outlook') },
    { key: 'finance_ai', label: t('stories.categories.finance_ai') },
    { key: 'video_generation', label: t('stories.categories.video_generation') },
    { key: 'domestic_ai', label: t('stories.categories.domestic_ai') },
    { key: 'overseas_ai', label: t('stories.categories.overseas_ai') }
  ];

  // Sorting options
  const sortOptions = [
    { key: 'newest', label: t('stories.sort.newest', 'Newest First') },
    { key: 'oldest', label: t('stories.sort.oldest', 'Oldest First') },
    { key: 'popular', label: t('stories.sort.popular', 'Most Popular') },
    { key: 'views', label: t('stories.sort.views', 'Most Viewed') }
  ];

  // Calculate height based on content length for better masonry layout
  const getContentHeight = (story: Story): number => {
    const baseHeight = 300;
    const titleLength = story.title?.length || 0;
    const excerptLength = story.excerpt?.length || 0;
    const tagsCount = story.tags?.length || 0;
    
    // Calculate height based on content
    const titleHeight = Math.ceil(titleLength / 50) * 20; // ~20px per line
    const excerptHeight = Math.ceil(excerptLength / 80) * 16; // ~16px per line
    const tagsHeight = tagsCount > 0 ? Math.ceil(tagsCount / 3) * 28 : 0; // ~28px per row of tags
    
    // Add some padding and ensure reasonable bounds
    const calculatedHeight = baseHeight + titleHeight + excerptHeight + tagsHeight;
    
    // Ensure height is within reasonable bounds
    return Math.max(280, Math.min(calculatedHeight, 500));
  };

  // Get category display name with i18n support
  const getCategoryDisplay = (categoryKey: string): string => {
    return categories.find(cat => cat.key === categoryKey)?.label || categoryKey;
  };

  // Load available tags
  const loadAvailableTags = useCallback(async () => {
    try {
      const { data: tagsData, error: tagsError } = await supabase
        .from('story_tags')
        .select('id, name, display_name, color, usage_count')
        .eq('is_active', true)
        .order('usage_count', { ascending: false })
        .limit(20);

      if (tagsError) {
        console.error('Failed to load tags:', tagsError);
        return;
      }

      if (tagsData) {
        setAvailableTags(tagsData);
      }
    } catch (error) {
      console.error('Error loading tags:', error);
    }
  }, []);

  // Handle tag toggle
  const handleTagToggle = (tagName: string) => {
    setSelectedTags(prev => {
      if (prev.includes(tagName)) {
        return prev.filter(tag => tag !== tagName);
      } else {
        return [...prev, tagName];
      }
    });
  };

  // Clear all filters
  const clearAllFilters = () => {
    setSelectedCategory('all');
    setSelectedTags([]);
  };

  // Fetch stories from database with robust error handling
  const fetchStories = useCallback(async (pageNum: number, reset: boolean = false) => {
    try {
      if (reset) {
        setLoading(true);
        setError(null);
      } else {
        setLoadingMore(true);
      }

      const offset = pageNum * STORIES_PER_PAGE;
      
      // Determine sort order based on sortBy state
      let orderColumn = 'created_at';
      let ascending = false;
      
      switch (sortBy) {
        case 'newest':
          orderColumn = 'created_at';
          ascending = false;
          break;
        case 'oldest':
          orderColumn = 'created_at';
          ascending = true;
          break;
        case 'popular':
          orderColumn = 'like_count';
          ascending = false;
          break;
        case 'views':
          orderColumn = 'view_count';
          ascending = false;
          break;
      }
      
      // Build query with tag filtering if needed
      let storiesQuery = supabase
        .from('stories')
        .select(`
          id, title, content, excerpt, view_count, like_count, comment_count, 
          created_at, featured_image_url, status, author, category_id, category
        `)
        .eq('status', 'published')
        .eq('is_public', true)
        .order(orderColumn, { ascending })
        .range(offset, offset + STORIES_PER_PAGE - 1);

      // Apply tag filtering if tags are selected
      if (selectedTags.length > 0) {
        // Get story IDs that have any of the selected tags
        const { data: taggedStoryIds, error: tagError } = await supabase
          .from('story_tags')
          .select('story_id, tags!inner(name)')
          .in('tags.name', selectedTags);

        if (tagError) {
          console.error('Tag filtering failed:', tagError);
          throw tagError;
        }

        if (taggedStoryIds && taggedStoryIds.length > 0) {
          const storyIds = [...new Set(taggedStoryIds.map(item => item.story_id))];
          storiesQuery = storiesQuery.in('id', storyIds);
        } else {
          // No stories match the selected tags
          if (reset) {
            setStories([]);
          }
          setHasMore(false);
          return;
        }
      }

      const { data: storiesData, error: storiesError } = await storiesQuery;

      if (storiesError) {
        console.error('Database query failed:', storiesError);
        throw storiesError;
      }

      console.log(`Fetched ${storiesData?.length || 0} stories from database`);

      if (!storiesData || storiesData.length === 0) {
        console.log('No stories found in database');
        if (reset) {
          setStories([]);
        }
        setHasMore(false);
        return;
      }

      // Create simple category mapping without separate table
      const categoryMap = new Map();

      // Load tags for all stories
      const storyIds = storiesData.map(story => story.id);
      const { data: storyTagsData } = await supabase
        .from('story_tags')
        .select(`
          story_id,
          tags!inner(id, name)
        `)
        .in('story_id', storyIds);

      // Create story tags mapping
      const storyTagsMap = new Map();
      storyTagsData?.forEach(assignment => {
        const storyId = assignment.story_id;
        const tag = assignment.tags;
        if (!storyTagsMap.has(storyId)) {
          storyTagsMap.set(storyId, []);
        }
        storyTagsMap.get(storyId).push({
          id: tag.id,
          name: tag.name,
          display_name: tag.name,
          color: '#3B82F6'
        });
      });

      // Transform database data to match Story interface
      const allStoriesWithCategories = storiesData.map((story: any) => {
        const categoryInfo = categoryMap.get(story.category_id);
        const tags = storyTagsMap.get(story.id) || [];
        
        const storyObj = {
          id: story.id,
          title: story.title,
          content: story.content,
          excerpt: story.excerpt || story.content?.substring(0, 120) + '...' || 'Story excerpt...',
          author: story.author || 'LeiaoAI Agent',
          category: story.category || categoryInfo?.name || 'general',
          categoryDisplay: categoryInfo?.display_name || getCategoryDisplay(story.category || categoryInfo?.name || 'general'),
          view_count: story.view_count || 0,
          like_count: story.like_count || 0,
          comment_count: story.comment_count || 0,
          created_at: story.created_at,
          image: story.featured_image_url || `/story-images/story-${Math.floor(Math.random() * 8) + 1}.jpg`,
          tags: tags
        };
        
        // Calculate height based on content for better layout
        return {
          ...storyObj,
          height: getContentHeight(storyObj)
        };
      });

      // Apply category filter
      const filteredStories = selectedCategory === 'all'
        ? allStoriesWithCategories
        : allStoriesWithCategories.filter(story => story.category === selectedCategory);

      console.log(`Successfully loaded ${filteredStories.length} stories (category: ${selectedCategory})`);
      
      if (reset) {
        setStories(filteredStories);
      } else {
        // Prevent duplicates using Set
        setStories(prev => {
          const existingIds = new Set(prev.map(story => story.id));
          const newStories = filteredStories.filter(story => !existingIds.has(story.id));
          return [...prev, ...newStories];
        });
      }

      // Set hasMore based on actual data returned
      setHasMore(storiesData.length === STORIES_PER_PAGE);
      
    } catch (error) {
      console.error('Failed to fetch stories:', error);
      setError('Failed to load stories. Please try again later.');
      
      if (reset) {
        setStories([]);
      }
      setHasMore(false);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [selectedCategory, selectedTags, sortBy, getCategoryDisplay]);

  // Load available tags on mount
  useEffect(() => {
    loadAvailableTags();
  }, [loadAvailableTags]);

  // Initial load and filter/sort change
  useEffect(() => {
    setPage(0);
    fetchStories(0, true);
  }, [selectedCategory, selectedTags, sortBy, fetchStories]);

  // Infinite scroll implementation
  useEffect(() => {
    const loadMore = () => {
      if (!loadingMore && hasMore) {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchStories(nextPage, false);
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    observerRef.current = observer;

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [page, loadingMore, hasMore, fetchStories]);

  // Scroll to top functionality
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return t('date.today', 'Today');
    if (diffDays <= 7) return t('date.days_ago', '{{days}} days ago', { days: diffDays });
    return date.toLocaleDateString();
  };

  // Filter stories by category
  const filteredStories = selectedCategory === 'all'
    ? stories
    : stories.filter(story => story.category === selectedCategory);

  return (
    <div className={cn("space-y-6", className)}>
      {/* Filter and Sort Controls */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-4 mb-8"
      >
        {/* Category Filter - Desktop */}
        <div className="hidden md:flex justify-center">
          <div className="flex flex-wrap gap-2 p-1 bg-background rounded-lg border border-border">
            {categories.map((category) => (
              <button
                key={category.key}
                onClick={() => setSelectedCategory(category.key)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200',
                  selectedCategory === category.key
                    ? 'bg-primary-500 text-white shadow-sm'
                    : 'text-foreground hover:bg-neutral-100 dark:hover:bg-neutral-800'
                )}
              >
                {category.key === 'all' && <Filter size={16} />}
                <span>{category.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Enhanced Tag Filter - Desktop */}
        <div className="hidden md:block">
          <div className="text-center mb-4">
            <div className="flex items-center justify-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowTagFilter(!showTagFilter)}
                className="flex items-center gap-2"
              >
                <Tag size={16} />
                {t('stories.filter_by_tags', 'Filter by Tags')}
                {selectedTags.length > 0 && (
                  <Badge variant="secondary" className="ml-1">
                    {selectedTags.length}
                  </Badge>
                )}
                {showTagFilter ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </Button>
              
              {selectedTags.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAllFilters}
                  className="text-xs"
                >
                  <X size={14} className="mr-1" />
                  {t('stories.clear_all', 'Clear All')}
                </Button>
              )}
            </div>
          </div>
          
          <AnimatePresence>
            {showTagFilter && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mb-6"
              >
                <div className="max-w-5xl mx-auto">
                  <div className="bg-background border border-border rounded-lg p-6">
                    {availableTags.length === 0 ? (
                      <div className="text-center py-4">
                        <Tag size={24} className="mx-auto text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground">
                          {t('stories.loading_tags', 'Loading tags...')}
                        </p>
                      </div>
                    ) : (
                      <>
                        <div className="flex flex-wrap gap-2 justify-center mb-4">
                          {availableTags.map((tag) => (
                            <Badge
                              key={tag.id}
                              variant={selectedTags.includes(tag.name) ? 'default' : 'outline'}
                              className={cn(
                                'cursor-pointer transition-all duration-200 text-sm py-2 px-4 hover:scale-105',
                                selectedTags.includes(tag.name)
                                  ? 'bg-primary text-primary-foreground shadow-md'
                                  : 'hover:bg-primary/10 hover:border-primary/50'
                              )}
                              onClick={() => handleTagToggle(tag.name)}
                            >
                              {tag.display_name}
                              {tag.usage_count && (
                                <span className="ml-1 text-xs opacity-75">({tag.usage_count})</span>
                              )}
                            </Badge>
                          ))}
                        </div>
                        
                        {selectedTags.length > 0 && (
                          <div className="border-t border-border pt-4">
                            <div className="flex items-center justify-center gap-3">
                              <span className="text-sm font-medium text-foreground">
                                {t('stories.active_filters', 'Active filters')}:
                              </span>
                              <div className="flex flex-wrap gap-2">
                                {selectedTags.map((tagName) => {
                                  const tag = availableTags.find(t => t.name === tagName);
                                  return (
                                    <Badge
                                      key={tagName}
                                      variant="secondary"
                                      className="cursor-pointer flex items-center gap-1 hover:bg-destructive hover:text-destructive-foreground transition-colors"
                                      onClick={() => handleTagToggle(tagName)}
                                    >
                                      {tag?.display_name || tagName}
                                      <X size={12} />
                                    </Badge>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Sort Controls - Desktop */}
        <div className="hidden md:flex justify-center">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>{t('stories.sort_by', 'Sort by')}:</span>
            <div className="flex gap-2 p-1 bg-background rounded-lg border border-border">
              {sortOptions.map((option) => (
                <button
                  key={option.key}
                  onClick={() => setSortBy(option.key as typeof sortBy)}
                  className={cn(
                    'px-3 py-1 rounded-md text-sm font-medium transition-all duration-200',
                    sortBy === option.key
                      ? 'bg-primary-500 text-white shadow-sm'
                      : 'text-foreground hover:bg-neutral-100 dark:hover:bg-neutral-800'
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile: Combined Dropdowns */}
        <div className="md:hidden flex flex-col gap-3 max-w-xs mx-auto">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={t('stories.categories.all')} />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.key} value={category.key}>
                  <div className="flex items-center gap-2">
                    {category.key === 'all' && <Filter size={16} />}
                    <span>{category.label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={sortBy} onValueChange={(value) => setSortBy(value as typeof sortBy)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={t('stories.sort_by', 'Sort by')} />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.key} value={option.key}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </motion.div>

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-amber-800 text-sm text-center"
        >
          {error}
        </motion.div>
      )}

      {/* Pinterest-style Masonry Grid */}
      <div ref={containerRef}>
        {loading ? (
          <PinterestLoadingSkeleton />
        ) : (
          <MasonryGrid stories={filteredStories} formatDate={formatDate} />
        )}
      </div>

      {/* Load More Trigger */}
      <div ref={loadMoreRef} className="h-20 flex items-center justify-center">
        {loadingMore && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 text-muted-foreground"
          >
            <Loader2 className="animate-spin" size={20} />
            <span>Loading more stories...</span>
          </motion.div>
        )}
        {!hasMore && filteredStories.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-muted-foreground text-sm"
          >
            You've reached the end of the stories
          </motion.div>
        )}
      </div>

      {/* Scroll to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <Button
              onClick={scrollToTop}
              size="sm"
              className="rounded-full w-12 h-12 shadow-lg hover:shadow-xl transition-all duration-300 bg-primary-500 hover:bg-primary-600"
            >
              <ArrowUp size={20} className="text-white" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Masonry Grid Component with better performance
function MasonryGrid({ stories, formatDate }: { stories: Story[]; formatDate: (date: string) => string }) {
  return (
    <div className="masonry-grid">
      {stories.map((story, index) => (
        <motion.div
          key={story.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.05 }}
          className="masonry-item"
        >
          <StoryCard story={story} formatDate={formatDate} />
        </motion.div>
      ))}
    </div>
  );
}

// Individual Story Card Component with lazy loading
function StoryCard({ story, formatDate }: { story: Story; formatDate: (date: string) => string }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);

  // Lazy loading with Intersection Observer
  useEffect(() => {
    const imageElement = imageRef.current;
    if (!imageElement) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          imageElement.src = story.image;
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    observer.observe(imageElement);
    return () => observer.disconnect();
  }, [story.image]);

  return (
    <Link to={`/story/${story.id}`}>
      <Card className="pinterest-card group cursor-pointer border">
        {/* Image with max height constraint */}
        <div 
          className="relative overflow-hidden rounded-t-lg"
          style={{ 
            height: story.height ? `${Math.min(story.height * 0.6, 480)}px` : '200px',
            maxHeight: '480px'
          }}
        >
          {!imageError && (
            <img
              ref={imageRef}
              alt={story.title}
              className={cn(
                'w-full h-full object-cover transition-all duration-300 group-hover:scale-105 lazy-image',
                imageLoaded && 'loaded'
              )}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
              loading="lazy"
            />
          )}
          {!imageLoaded && !imageError && (
            <div className="absolute inset-0 shimmer" />
          )}
          {imageError && (
            <div className="w-full h-full bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900 dark:to-purple-900 flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <Eye size={24} className="mx-auto mb-2" />
                <span className="text-sm">Story Image</span>
              </div>
            </div>
          )}
          
          {/* Tags Display */}
          {story.tags && story.tags.length > 0 && (
            <div className="absolute top-3 left-3">
              <TagDisplay 
                tags={story.tags} 
                maxDisplay={2} 
                size="sm"
                className="max-w-[200px]"
              />
            </div>
          )}
        </div>

        {/* Content */}
        <CardContent className="p-4">
          <h3 className="font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
            {story.title}
          </h3>
          
          <p className="text-sm text-muted-foreground mb-3 line-clamp-3">
            {story.excerpt}
          </p>

          {/* Meta Info */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <img 
                src={story.author === 'LeiaoAI Agent' ? '/imgs/leiaoai-agent-avatar.png' : '/default-user-avatar-placeholder-modern-clean.jpg'}
                alt={story.author}
                className="w-4 h-4 rounded-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/default-user-avatar-placeholder-modern-clean.jpg';
                }}
              />
              <span>{story.author}</span>
              <span>•</span>
              <Calendar size={12} />
              <span>{formatDate(story.created_at)}</span>
            </div>
            
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <Eye size={12} />
                  <span>{story.view_count}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Heart size={12} />
                  <span>{story.like_count}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageSquare size={12} />
                  <span>{story.comment_count}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

// Loading Skeleton for Pinterest Layout with better animation
function PinterestLoadingSkeleton() {
  return (
    <div className="masonry-grid">
      {[...Array(12)].map((_, i) => (
        <div key={i} className="masonry-item">
          <Card className="overflow-hidden">
            <div 
              className="shimmer rounded-t-lg"
              style={{ height: `${Math.floor(Math.random() * 200) + 200}px` }}
            />
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="h-4 shimmer rounded w-3/4" />
                <div className="h-3 shimmer rounded" />
                <div className="h-3 shimmer rounded w-5/6" />
                <div className="flex gap-2 mt-3">
                  <div className="h-3 shimmer rounded w-16" />
                  <div className="h-3 shimmer rounded w-12" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  );
}

export default PinterestStories;