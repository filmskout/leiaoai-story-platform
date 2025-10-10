import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Heart,
  MessageSquare,
  Eye,
  Calendar,
  BookOpen,
  Loader2,
  Filter,
  Grid
} from 'lucide-react';
import { TagDisplay } from '@/components/stories/TagDisplay';
import { SocialInteractions } from '@/components/stories/SocialInteractions';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface Tag {
  id: string;
  name: string;
  display_name: string;
  color: string;
}

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
  tags?: Tag[];
  height?: number; // For masonry layout
}

interface NewStoriesGridProps {
  className?: string;
}

const STORIES_PER_PAGE = 12; // Reduced for better performance

export function NewStoriesGrid({ className }: NewStoriesGridProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Mobile detection
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Generate random height for masonry effect
  const getRandomHeight = (): number => {
    const heights = [300, 350, 400, 450, 500];
    return heights[Math.floor(Math.random() * heights.length)];
  };

  // Fetch stories from database with caching
  const fetchStories = useCallback(async (pageNum: number, reset: boolean = false) => {
    try {
      if (reset) {
        setLoading(true);
        setError(null);
      } else {
        setLoadingMore(true);
      }

      const offset = pageNum * STORIES_PER_PAGE;
      
      console.log(`NewStoriesGrid: Fetching stories page ${pageNum}, offset ${offset}`);
      
      // Check cache first for better performance
      const cacheKey = `stories_page_${pageNum}`;
      const cached = sessionStorage.getItem(cacheKey);
      
      if (cached && !reset) {
        try {
          const cachedData = JSON.parse(cached);
          const cacheTime = cachedData.timestamp;
          const now = Date.now();
          
          // Use cache if less than 5 minutes old
          if (now - cacheTime < 5 * 60 * 1000) {
            console.log('Using cached stories data');
            const storiesWithHeights = cachedData.data.map((story: any) => ({
              ...story,
              height: getRandomHeight(),
              tags: []
            }));
            
            if (reset) {
              setStories(storiesWithHeights);
            } else {
              setStories(prev => {
                const existingIds = new Set(prev.map(story => story.id));
                const newStories = storiesWithHeights.filter(story => !existingIds.has(story.id));
                return [...prev, ...newStories];
              });
            }
            
            setHasMore(cachedData.data.length === STORIES_PER_PAGE);
            return;
          }
        } catch (e) {
          console.warn('Failed to parse cached data:', e);
        }
      }
      
      // Optimized query with limited fields for better performance
      const { data, error: fetchError } = await supabase
        .from('stories')
        .select(`
          id,
          title,
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
        .not('title', 'is', null)
        .order('created_at', { ascending: false })
        .range(offset, offset + STORIES_PER_PAGE - 1);

      if (fetchError) {
        console.error('Database query error:', fetchError);
        throw fetchError;
      }

      console.log(`NewStoriesGrid: Successfully fetched ${data?.length || 0} stories`);
      console.log('NewStoriesGrid: Sample story data:', data?.[0]);
      
      if (!data || data.length === 0) {
        console.log('No more stories found');
        if (reset) {
          setStories([]);
        }
        setHasMore(false);
        return;
      }

      // Cache the fetched data
      try {
        sessionStorage.setItem(cacheKey, JSON.stringify({
          data,
          timestamp: Date.now()
        }));
      } catch (e) {
        console.warn('Failed to cache data:', e);
      }

      // Add random heights for masonry layout - optimize for performance
      const storiesWithHeights = data.map(story => ({
        ...story,
        height: getRandomHeight(),
        tags: [], // Skip tags for better performance
        // Ensure excerpt exists for better display
        excerpt: story.excerpt || (story.content ? story.content.substring(0, 150) + '...' : 'Click to read this story...')
      }));

      if (reset) {
        setStories(storiesWithHeights);
      } else {
        setStories(prev => {
          // Prevent duplicates
          const existingIds = new Set(prev.map(story => story.id));
          const newStories = storiesWithHeights.filter(story => !existingIds.has(story.id));
          return [...prev, ...newStories];
        });
      }

      // Check if we have more stories
      setHasMore(data.length === STORIES_PER_PAGE);
      
    } catch (err: any) {
      console.error('Failed to fetch stories:', err);
      setError('Failed to load stories. Please try again later.');
      
      if (reset) {
        setStories([]);
      }
      setHasMore(false);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  // Initial load with cleanup
  useEffect(() => {
    // Clear cache on component mount for fresh data
    const clearOldCache = () => {
      const keys = Object.keys(sessionStorage);
      keys.forEach(key => {
        if (key.startsWith('stories_page_')) {
          try {
            const cached = sessionStorage.getItem(key);
            if (cached) {
              const data = JSON.parse(cached);
              const age = Date.now() - data.timestamp;
              // Clear cache older than 10 minutes
              if (age > 10 * 60 * 1000) {
                sessionStorage.removeItem(key);
              }
            }
          } catch (e) {
            sessionStorage.removeItem(key);
          }
        }
      });
    };
    
    clearOldCache();
    fetchStories(0, true);
  }, [fetchStories]);

  // Infinite scroll setup
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loadingMore && hasMore) {
          const nextPage = page + 1;
          setPage(nextPage);
          fetchStories(nextPage, false);
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

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Clean up any pending operations
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [page, loadingMore, hasMore, fetchStories]);

  // Navigate to story detail with state for smart back navigation
  const handleStoryClick = (storyId: string) => {
    navigate(`/story/${storyId}`, {
      state: { from: '/stories' }
    });
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Today';
    if (diffDays <= 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  // Loading state
  if (loading && stories.length === 0) {
    return (
      <div className={cn('space-y-6', className)}>
        <div className="text-center py-12">
          <div className="flex justify-center mb-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
          </div>
          <p className="text-muted-foreground">Loading stories...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && stories.length === 0) {
    return (
      <div className={cn('space-y-6', className)}>
        <div className="text-center py-12">
          <div className="flex flex-col items-center space-y-4">
            <BookOpen size={48} className="text-muted-foreground" />
            <p className="text-muted-foreground max-w-md">
              {error}
            </p>
            <Button onClick={() => fetchStories(0, true)} variant="outline">
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  if (stories.length === 0) {
    return (
      <div className={cn('space-y-6', className)}>
        <div className="text-center py-12">
          <div className="flex flex-col items-center space-y-4">
            <Grid size={48} className="text-muted-foreground" />
            <h3 className="text-lg font-semibold text-foreground">No Stories Found</h3>
            <p className="text-muted-foreground max-w-md">
              There are no stories available at the moment. Check back later for new content.
            </p>
            <Button onClick={() => navigate('/create-story')} variant="outline">
              Create First Story
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Stats */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-muted-foreground">
          Showing {stories.length} stories
        </p>
        <div className="flex items-center space-x-2">
          <Filter size={16} className="text-muted-foreground" />
          <span className="text-sm text-muted-foreground">All Stories</span>
        </div>
      </div>

      {/* Stories Grid - Masonry Layout */}
      <div className={cn(
        "grid gap-6",
        isMobile 
          ? "grid-cols-1" 
          : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      )}>
        <AnimatePresence>
          {stories.map((story, index) => (
            <motion.div
              key={story.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              style={{ height: isMobile ? 'auto' : story.height }}
            >
              <Card 
                className="h-full cursor-pointer group hover:shadow-xl transition-all duration-300 border-0 shadow-md overflow-hidden"
                onClick={() => handleStoryClick(story.id)}
              >
                <CardContent className="p-0 h-full flex flex-col">
                  {/* Story Image */}
                  <div className="relative h-48 flex-shrink-0 overflow-hidden bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20">
                    {story.featured_image_url ? (
                      <img
                        src={story.featured_image_url}
                        alt={story.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          console.log('Image failed to load:', story.featured_image_url);
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <BookOpen size={32} className="text-primary-400" />
                      </div>
                    )}
                    
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Stats on hover */}
                    <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="flex items-center space-x-3 text-white text-xs">
                        <div className="flex items-center space-x-1">
                          <Eye size={12} />
                          <span>{story.view_count || 0}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Heart size={12} />
                          <span>{story.like_count || 0}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MessageSquare size={12} />
                          <span>{story.comment_count || 0}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Story Content */}
                  <div className="p-4 flex-1 flex flex-col">
                    <h3 className="font-semibold text-base text-foreground mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
                      {story.title}
                    </h3>
                    
                    <p className="text-muted-foreground text-sm mb-2 line-clamp-3 flex-1">
                      {story.excerpt || story.content?.substring(0, 100) + '...' || 'Click to read this story...'}
                    </p>
                    
                    {/* Tags */}
                    {story.tags && story.tags.length > 0 && (
                      <div className="mb-2">
                        <TagDisplay 
                          tags={story.tags} 
                          maxDisplay={2} 
                          size="sm"
                          className="flex-wrap"
                        />
                      </div>
                    )}
                    
                    {/* Meta info */}
                    <div className="flex items-center justify-between text-xs text-muted-foreground mt-auto">
                      <span className="flex items-center space-x-1">
                        <Calendar size={10} />
                        <span>{formatDate(story.created_at)}</span>
                      </span>
                      <span className="font-medium truncate ml-2">
                        {story.publisher}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Load More Trigger */}
      <div ref={loadMoreRef} className="flex justify-center py-8">
        {loadingMore && (
          <div className="flex items-center space-x-2 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Loading more stories...</span>
          </div>
        )}
        
        {!hasMore && stories.length > 0 && (
          <p className="text-muted-foreground text-center">
            You've reached the end! No more stories to load.
          </p>
        )}
      </div>
    </div>
  );
}
