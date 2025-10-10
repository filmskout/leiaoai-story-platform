import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/lib/supabase';
import { 
  ChevronLeft, 
  ChevronRight, 
  ArrowRight,
  Eye, 
  Heart, 
  MessageSquare,
  Calendar,
  User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useMobileLayout } from '@/hooks/use-mobile';

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
  author: string;
  category: string;
  view_count: number;
  like_count: number;
  comment_count: number;
  created_at: string;
  image: string;
  tags?: Tag[];
}

interface NewStoryCarouselProps {
  className?: string;
}

export function NewStoryCarousel({ className }: NewStoryCarouselProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const isMobile = useMobileLayout();
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  
  // Responsive items per page: 1 on mobile, 3 on desktop
  const itemsPerPage = isMobile ? 3 : 6; // Show 3 stories on mobile, 6 on desktop for 2 rows
  const totalPages = Math.ceil(stories.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentStories = stories.slice(startIndex, endIndex);

  useEffect(() => {
    fetchLatestStories();
  }, []);

  // Reset to first page when screen size changes
  useEffect(() => {
    setCurrentPage(1);
  }, [isMobile]);

  const fetchLatestStories = async () => {
    try {
      setLoading(true);
      
      // Fetch latest published stories (increased limit for grid)
      const { data: storiesData, error } = await supabase
        .from('stories')
        .select(`
          id, title, content, excerpt, view_count, like_count, comment_count, 
          created_at, featured_image_url, author, category
        `)
        .eq('status', 'published')
        .eq('is_public', true)
        .order('created_at', { ascending: false })
        .limit(12);

      if (error) {
        throw error;
      }

      if (storiesData && storiesData.length > 0) {
        // Get story IDs for tag fetching
        const storyIds = storiesData.map(story => story.id);
        
        // Fetch tags for these stories
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

        // Transform data to match Story interface
        const transformedStories = storiesData.map(story => ({
          id: story.id,
          title: story.title,
          content: story.content,
          excerpt: story.excerpt || story.content?.substring(0, 120) + '...' || 'Story excerpt...',
          author: story.author || 'LeiaoAI Agent',
          category: story.category || 'general',
          view_count: story.view_count || 0,
          like_count: story.like_count || 0,
          comment_count: story.comment_count || 0,
          created_at: story.created_at,
          image: story.featured_image_url || `/story-images/story-${Math.floor(Math.random() * 8) + 1}.jpg`,
          tags: storyTagsMap.get(story.id) || []
        }));

        setStories(transformedStories);
      }
    } catch (error) {
      console.error('Failed to fetch stories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePrevious = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return t('date.today', 'Today');
    if (diffDays <= 7) return t('date.days_ago', '{{days}} days ago', { days: diffDays });
    return date.toLocaleDateString();
  };

  const handleStoryClick = (storyId: string) => {
    navigate(`/story/${storyId}`);
  };

  if (loading) {
    return (
      <div className={cn("space-y-6", className)}>
        <div className="text-center space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            {t('stories.latest_stories', 'Latest Stories')}
          </h2>
        </div>
        
        {/* Loading grid */}
        <div className={cn(
          "grid gap-6",
          isMobile ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
        )}>
          {Array.from({ length: itemsPerPage }).map((_, index) => (
            <div key={index} className="space-y-4">
              <div className="aspect-[4/3] bg-gray-200 animate-pulse rounded-xl"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 animate-pulse rounded"></div>
                <div className="h-3 bg-gray-200 animate-pulse rounded w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (stories.length === 0) {
    return (
      <div className={cn("space-y-6", className)}>
        <div className="text-center space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            {t('stories.latest_stories', 'Latest Stories')}
          </h2>
          <p className="text-foreground-secondary">
            {t('stories.no_stories', 'No stories available at the moment.')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Section header */}
      <div className="text-center space-y-4">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-2xl md:text-3xl font-bold text-foreground"
        >
          {t('stories.latest_stories', 'Latest Stories')}
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-foreground-secondary max-w-2xl mx-auto"
        >
          {t('stories.latest_description', 'Discover the latest insights and experiences from our community.')}
        </motion.p>
      </div>

      {/* Story Cards Grid */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className={cn(
          "grid gap-6",
          isMobile ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
        )}
      >
        {currentStories.map((story, index) => (
          <motion.div
            key={story.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 * index }}
            className="group"
          >
            <Card className="overflow-hidden h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer border-0 shadow-md">
              <div className="relative aspect-[4/3] overflow-hidden">
                <img 
                  src={story.image} 
                  alt={story.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = `/story-images/story-${Math.floor(Math.random() * 8) + 1}.jpg`;
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Tags overlay */}
                {story.tags && story.tags.length > 0 && (
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1">
                    {story.tags.slice(0, 2).map((tag) => (
                      <Badge 
                        key={tag.id} 
                        variant="secondary" 
                        className="bg-white/90 text-gray-900 text-xs px-2 py-1"
                      >
                        {tag.display_name}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
              
              <CardContent className="p-6 space-y-4">
                {/* Title */}
                <h3 className="text-lg font-semibold text-foreground line-clamp-2 leading-tight group-hover:text-primary-600 transition-colors">
                  {story.title}
                </h3>
                
                {/* Excerpt */}
                <p className="text-sm text-foreground-secondary line-clamp-3 leading-relaxed">
                  {story.excerpt}
                </p>
                
                {/* Meta info */}
                <div className="flex items-center justify-between text-xs text-foreground-muted">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      <span>{story.view_count.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Heart className="w-3 h-3" />
                      <span>{story.like_count.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageSquare className="w-3 h-3" />
                      <span>{story.comment_count.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{formatDate(story.created_at)}</span>
                  </div>
                </div>
                
                {/* Author */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center">
                      <User className="w-3 h-3 text-primary-600" />
                    </div>
                    <span className="text-sm text-foreground-secondary">{story.author}</span>
                  </div>
                  
                  <Button 
                    onClick={() => handleStoryClick(story.id)}
                    size="sm" 
                    variant="ghost"
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-2 h-auto"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Pagination */}
      {totalPages > 1 && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex items-center justify-center gap-2 pt-4"
        >
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrevious}
            disabled={currentPage === 1}
            className="px-3 py-2"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          
          <div className="flex gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => goToPage(page)}
                className="px-3 py-2 min-w-[40px]"
              >
                {page}
              </Button>
            ))}
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className="px-3 py-2"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </motion.div>
      )}
    </div>
  );
}