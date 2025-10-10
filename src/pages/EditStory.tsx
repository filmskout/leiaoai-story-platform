import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/lib/supabase';
import { MultiTagSelector } from '@/components/stories/MultiTagSelector';
import { 
  ArrowLeft, 
  Save, 
  RefreshCw,
  Image as ImageIcon,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';

interface Tag {
  id: string;
  name: string;
  display_name: string;
  color: string;
  usage_count: number;
  is_active: boolean;
}

interface Story {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  featured_image_url: string | null;
  category: string;
  author_id: string;
  status: string;
}

export default function EditStory() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [story, setStory] = useState<Story | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [featuredImage, setFeaturedImage] = useState('');
  const [category, setCategory] = useState('ai_tools');
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [generatingImage, setGeneratingImage] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id && user) {
      loadStory();
    }
  }, [id, user]);

  const loadStory = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('stories')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      // Check if user is the author
      if (data.author !== user?.id) {
        toast.error(t('story.not_authorized', 'You are not authorized to edit this story'));
        navigate('/stories');
        return;
      }

      setStory(data);
      setTitle(data.title || '');
      setContent(data.content || '');
      setExcerpt(data.excerpt || '');
      setFeaturedImage(data.featured_image_url || '');
      setCategory(data.category || 'ai_tools');
    } catch (error: any) {
      console.error('Error loading story:', error);
      toast.error(t('story.load_error', 'Failed to load story'));
      navigate('/stories');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateImage = async () => {
    if (!title.trim()) {
      toast.error(t('story.title_required_for_image', 'Please enter a title first'));
      return;
    }

    setGeneratingImage(true);
    try {
      const prompt = `Professional illustration for article titled: "${title}". Modern, clean, high-quality, suitable for business publication.`;
      
      const response = await fetch('/api/generate-avatar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, size: '1024x1024' })
      });

      const data = await response.json();
      if (data.success && (data.base64Image || data.imageUrl)) {
        const imageData = data.base64Image || data.imageUrl;
        setFeaturedImage(imageData);
        toast.success(t('story.image_generated', 'Image generated successfully'));
      } else {
        throw new Error('Failed to generate image');
      }
    } catch (error: any) {
      console.error('Error generating image:', error);
      toast.error(t('story.image_error', 'Failed to generate image'));
    } finally {
      setGeneratingImage(false);
    }
  };

  const handleSave = async () => {
    if (!user || !story) return;
    
    if (!title.trim() || !content.trim()) {
      setError(t('story.required_fields', 'Title and content are required'));
      return;
    }

    setSaving(true);
    setError('');

    try {
      const { error: updateError } = await supabase
        .from('stories')
        .update({
          title: title.trim(),
          content: content.trim(),
          excerpt: excerpt.trim() || content.trim().substring(0, 200),
          featured_image_url: featuredImage || null,
          category,
          updated_at: new Date().toISOString()
        })
        .eq('id', story.id);

      if (updateError) throw updateError;

      toast.success(t('story.updated', 'Story updated successfully!'));
      navigate(`/story/${story.id}`);
    } catch (error: any) {
      console.error('Error updating story:', error);
      setError(error.message || t('story.update_error', 'Failed to update story'));
      toast.error(error.message || t('story.update_error', 'Failed to update story'));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!story) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-foreground-secondary hover:text-foreground transition-colors"
          >
            <ArrowLeft size={20} />
            <span>{t('common.back', 'Back')}</span>
          </button>
          
          <div className="flex items-center space-x-3">
            <Button
              onClick={handleSave}
              disabled={saving || !title.trim() || !content.trim()}
              className="flex items-center space-x-2"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  <span>{t('story.saving', 'Saving...')}</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>{t('story.save_changes', 'Save Changes')}</span>
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start space-x-3">
            <AlertCircle className="text-red-600 mt-0.5 flex-shrink-0" size={20} />
            <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Main Form */}
        <Card>
          <CardContent className="p-6 space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                {t('story.title', 'Title')} *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-background text-foreground"
                placeholder={t('story.title_placeholder', 'Enter story title...')}
                maxLength={200}
              />
            </div>

            {/* Excerpt */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                {t('story.excerpt', 'Excerpt')}
              </label>
              <textarea
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                rows={2}
                className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none bg-background text-foreground"
                placeholder={t('story.excerpt_placeholder', 'Brief description (optional)...')}
                maxLength={300}
              />
            </div>

            {/* Content */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                {t('story.content', 'Content')} *
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={15}
                className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none bg-background text-foreground font-mono text-sm"
                placeholder={t('story.content_placeholder', 'Write your story content here...')}
              />
            </div>

            {/* Featured Image */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-foreground">
                  {t('story.featured_image', 'Featured Image')}
                </label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleGenerateImage}
                  disabled={generatingImage || !title.trim()}
                >
                  {generatingImage ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      {t('story.generating', 'Generating...')}
                    </>
                  ) : (
                    <>
                      <ImageIcon className="w-4 h-4 mr-2" />
                      {featuredImage ? t('story.regenerate_image', 'Regenerate') : t('story.generate_image', 'Generate with AI')}
                    </>
                  )}
                </Button>
              </div>
              {featuredImage && (
                <div className="mt-2 rounded-lg overflow-hidden border border-border">
                  <img 
                    src={featuredImage} 
                    alt="Featured" 
                    className="w-full h-auto max-h-64 object-cover"
                  />
                </div>
              )}
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                {t('story.tags', 'Tags')}
              </label>
              <MultiTagSelector
                selectedTags={selectedTags}
                onTagsChange={setSelectedTags}
                maxTags={3}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

