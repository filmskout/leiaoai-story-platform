import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useAI } from '@/contexts/AIContext';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/lib/supabase';
import { MultiTagSelector } from '@/components/stories/MultiTagSelector';
import { 
  ArrowLeft, 
  PlusCircle, 
  Image, 
  Video, 
  X, 
  AlertCircle,
  Upload,
  Sparkles,
  Bot,
  Wand2,
  RefreshCw,
  Copy,
  Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface MediaFile {
  id: string;
  file: File;
  preview: string;
  type: 'image' | 'video';
  uploading: boolean;
  uploaded: boolean;
  publicUrl?: string;
  fileName?: string;
  fileSize?: number;
  mimeType?: string;
}

interface Tag {
  id: string;
  name: string;
  display_name: string;
  color: string;
  usage_count: number;
  is_active: boolean;
}

export default function CreateStory() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('ai_tools');
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [publishing, setPublishing] = useState(false);
  const [savingDraft, setSavingDraft] = useState(false);
  const [error, setError] = useState('');
  const [draftId, setDraftId] = useState<string | null>(null);
  const [aiAssisting, setAiAssisting] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [selectedModel, setSelectedModel] = useState('deepseek');
  const [aiGeneratedContent, setAiGeneratedContent] = useState('');
  const [showAiSection, setShowAiSection] = useState(false);
  const [copied, setCopied] = useState(false);
  const [location, setLocation] = useState('');
  const [locationSuggestions, setLocationSuggestions] = useState<string[]>([]);
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const [imageGenerationModel, setImageGenerationModel] = useState('none');
  const [generateStoryImage, setGenerateStoryImage] = useState(false);
  
  const { modelConfigs } = useAI();

  // Popular locations for suggestions
  const popularLocations = [
    'New York, NY', 'Los Angeles, CA', 'Chicago, IL', 'Houston, TX', 'Phoenix, AZ',
    'Philadelphia, PA', 'San Antonio, TX', 'San Diego, CA', 'Dallas, TX', 'San Jose, CA',
    'Austin, TX', 'Jacksonville, FL', 'Fort Worth, TX', 'Columbus, OH', 'Charlotte, NC',
    'San Francisco, CA', 'Indianapolis, IN', 'Seattle, WA', 'Denver, CO', 'Washington, DC',
    'Boston, MA', 'El Paso, TX', 'Nashville, TN', 'Detroit, MI', 'Oklahoma City, OK',
    'Portland, OR', 'Las Vegas, NV', 'Memphis, TN', 'Louisville, KY', 'Baltimore, MD',
    'Milwaukee, WI', 'Albuquerque, NM', 'Tucson, AZ', 'Fresno, CA', 'Sacramento, CA',
    'Kansas City, MO', 'Mesa, AZ', 'Atlanta, GA', 'Colorado Springs, CO', 'Omaha, NE',
    'Raleigh, NC', 'Miami, FL', 'Virginia Beach, VA', 'Oakland, CA', 'Minneapolis, MN',
    'Tulsa, OK', 'Arlington, TX', 'Tampa, FL', 'New Orleans, LA', 'Wichita, KS',
    // International locations
    'London, UK', 'Paris, France', 'Tokyo, Japan', 'Sydney, Australia', 'Toronto, Canada',
    'Berlin, Germany', 'Amsterdam, Netherlands', 'Stockholm, Sweden', 'Copenhagen, Denmark',
    'Zurich, Switzerland', 'Singapore', 'Hong Kong', 'Dubai, UAE', 'Mumbai, India',
    'Beijing, China', 'Shanghai, China', 'Seoul, South Korea', 'Bangkok, Thailand',
    'Moscow, Russia', 'São Paulo, Brazil', 'Mexico City, Mexico', 'Buenos Aires, Argentina',
    'Cairo, Egypt', 'Istanbul, Turkey', 'Athens, Greece', 'Rome, Italy', 'Barcelona, Spain',
    'Madrid, Spain', 'Lisbon, Portugal', 'Dublin, Ireland', 'Oslo, Norway', 'Helsinki, Finland'
  ];

  const categories = [
    { value: 'ai_projects', label: t('story.category.ai_projects', 'AI Projects Experience') },
    { value: 'startup_interview', label: t('story.category.startup_interview', 'Startup Interview') },
    { value: 'investment_outlook', label: t('story.category.investment_outlook', 'Investment Outlook') },
    { value: 'finance_ai', label: t('story.category.finance_ai', 'Financial AI Applications') },
    { value: 'video_generation', label: t('story.category.video_generation', 'Video Generation Experience') },
    { value: 'domestic_ai', label: t('story.category.domestic_ai', 'Domestic AI Projects') },
    { value: 'overseas_ai', label: t('story.category.overseas_ai', 'Overseas AI Platforms') }
  ];

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    files.forEach(file => {
      // File size limit (Images 5MB, Videos 50MB)
      const maxSize = file.type.startsWith('image/') ? 5 * 1024 * 1024 : 50 * 1024 * 1024;
      if (file.size > maxSize) {
        setError(t('story.file_size_error', 'File {{fileName}} is too large. Images max 5MB, videos max 50MB.', { fileName: file.name }));
        return;
      }
      
      // File type validation
      if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
        setError(t('story.file_type_error', 'File {{fileName}} type is not supported. Please select image or video files.', { fileName: file.name }));
        return;
      }
      
      const mediaFile: MediaFile = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        file,
        preview: URL.createObjectURL(file),
        type: file.type.startsWith('image/') ? 'image' : 'video',
        uploading: false,
        uploaded: false
      };
      
      setMediaFiles(prev => [...prev, mediaFile]);
    });
    
    // Clear input
    e.target.value = '';
  };

  const removeMediaFile = (id: string) => {
    setMediaFiles(prev => {
      const fileToRemove = prev.find(f => f.id === id);
      if (fileToRemove) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      return prev.filter(f => f.id !== id);
    });
  };

  // AI Writing Assistance
  const handleAiGenerate = async () => {
    console.log('🔵 AI Generate: Starting', { 
      prompt: aiPrompt.slice(0, 50), 
      model: selectedModel,
      tagsCount: selectedTags.length 
    });
    
    if (!aiPrompt.trim()) {
      toast.error(t('story.ai_assist.prompt_required', 'Please enter a prompt for AI story generation.'));
      return;
    }
    
    setAiAssisting(true);
    setAiGeneratedContent('');
    
    try {
      console.log('🔵 AI Generate: Calling Supabase function');
      const { data, error } = await supabase.functions.invoke('ai-story-generator', {
        body: {
          prompt: aiPrompt,
          model: selectedModel,
          tags: selectedTags.map(tag => tag.name),
          title: title || 'Generated Story',
          imageModel: imageGenerationModel !== 'none' ? imageGenerationModel : null,
          generateImage: imageGenerationModel !== 'none'
        }
      });
      
      console.log('🔵 AI Generate: Response received', { 
        hasData: !!data, 
        hasError: !!error,
        dataKeys: data ? Object.keys(data) : []
      });
      
      if (error) {
        console.error('🔴 AI Generate: Supabase function error', error);
        throw error;
      }
      
      const generatedContent = data?.data?.content || data?.content || '';
      console.log('🔵 AI Generate: Content extracted', { length: generatedContent.length });
      
      if (generatedContent) {
        setAiGeneratedContent(generatedContent);
        toast.success(t('story.ai_assist.success', 'AI story generated successfully!'));
      } else {
        console.error('🔴 AI Generate: No content in response', data);
        throw new Error('No content generated. The AI response was empty.');
      }
    } catch (error: any) {
      console.error('🔴 AI Generate: Failed', error);
      const errorMsg = error.message || error.msg || t('story.ai_assist.error', 'AI generation failed. Please try again.');
      toast.error(errorMsg);
    } finally {
      setAiAssisting(false);
      console.log('🔵 AI Generate: Completed');
    }
  };

  const handleUseAiContent = () => {
    if (aiGeneratedContent) {
      setContent(prev => {
        const newContent = prev ? `${prev}\n\n${aiGeneratedContent}` : aiGeneratedContent;
        // Auto-resize textarea
        setTimeout(() => {
          if (contentRef.current) {
            contentRef.current.style.height = 'auto';
            contentRef.current.style.height = contentRef.current.scrollHeight + 'px';
          }
        }, 100);
        return newContent;
      });
      setAiGeneratedContent('');
      setShowAiSection(false);
      toast.success(t('story.ai_assist.content_added', 'AI content added to your story!'));
    }
  };

  const handleCopyAiContent = async () => {
    if (aiGeneratedContent) {
      try {
        await navigator.clipboard.writeText(aiGeneratedContent);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        toast.success(t('story.ai_assist.copied', 'Content copied to clipboard!'));
      } catch (error) {
        toast.error(t('story.ai_assist.copy_failed', 'Failed to copy content'));
      }
    }
  };

  // Auto-resize textarea
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = e.target.scrollHeight + 'px';
  };

  // Location search and suggestions
  const handleLocationChange = (value: string) => {
    setLocation(value);
    
    if (value.length > 0) {
      const filtered = popularLocations.filter(loc => 
        loc.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 8);
      setLocationSuggestions(filtered);
      setShowLocationSuggestions(true);
    } else {
      setLocationSuggestions([]);
      setShowLocationSuggestions(false);
    }
  };

  const selectLocation = (selectedLocation: string) => {
    setLocation(selectedLocation);
    setShowLocationSuggestions(false);
    setLocationSuggestions([]);
  };

  const uploadMediaFile = async (mediaFile: MediaFile): Promise<MediaFile> => {
    try {
      setMediaFiles(prev => prev.map(f => 
        f.id === mediaFile.id ? { ...f, uploading: true } : f
      ));

      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(mediaFile.file);
      });

      const base64Data = await base64Promise;
      const fileName = `story-media-${Date.now()}-${mediaFile.file.name}`;

      const { data, error } = await supabase.functions.invoke('media-upload', {
        body: {
          mediaData: base64Data,
          fileName,
          mediaType: mediaFile.type
        }
      });

      if (error) throw error;

      const uploadedFile: MediaFile = {
        ...mediaFile,
        uploading: false,
        uploaded: true,
        publicUrl: data?.data?.publicUrl,
        fileName: data?.data?.fileName,
        fileSize: data?.data?.fileSize,
        mimeType: data?.data?.mimeType
      };

      setMediaFiles(prev => prev.map(f => 
        f.id === mediaFile.id ? uploadedFile : f
      ));

      return uploadedFile;
    } catch (error: any) {
      console.error('Media file upload failed:', error);
      setMediaFiles(prev => prev.map(f => 
        f.id === mediaFile.id ? { ...f, uploading: false } : f
      ));
      throw error;
    }
  };

  // Save draft function
  const handleSaveDraft = async () => {
    if (!user) {
      toast.error(t('story.login_required', 'Please login to save drafts'));
      navigate('/auth');
      return;
    }

    if (!title.trim()) {
      setError(t('story.title_required', 'Title is required'));
      return;
    }

    setSavingDraft(true);
    setError('');

    try {
      const storyData = {
        title: title.trim(),
        content: content.trim(),
        excerpt: content.trim().substring(0, 200),
        author: user.id,
        category: category,
        status: 'draft' as const,
        is_public: false,
        location: location.trim() || null,
        updated_at: new Date().toISOString()
      };

      if (draftId) {
        // Update existing draft
        const { error } = await supabase
          .from('stories')
          .update(storyData)
          .eq('id', draftId)
          .eq('author', user.id);

        if (error) throw error;
        toast.success(t('story.draft_updated', 'Draft updated successfully'));
      } else {
        // Create new draft
        const { data, error } = await supabase
          .from('stories')
          .insert([storyData])
          .select()
          .single();

        if (error) throw error;
        if (data) {
          setDraftId(data.id);
          toast.success(t('story.draft_saved', 'Draft saved successfully'));
        }
      }
    } catch (error: any) {
      console.error('Draft save failed:', error);
      setError(error.message || t('story.draft_error', 'Failed to save draft'));
      toast.error(t('story.draft_error', 'Failed to save draft'));
    } finally {
      setSavingDraft(false);
    }
  };

  // Publish story function
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error(t('story.login_required', 'Please login to publish stories'));
      navigate('/auth');
      return;
    }

    setError('');

    if (!title.trim() || !content.trim()) {
      setError(t('story.required_fields', 'Title and content are required'));
      return;
    }

    setPublishing(true);

    try {
      // Upload all media files
      const uploadPromises = mediaFiles
        .filter(f => !f.uploaded)
        .map(f => uploadMediaFile(f));
      
      await Promise.all(uploadPromises);

      // Get all uploaded media file information
      const uploadedMediaFiles = mediaFiles
        .filter(f => f.uploaded && f.publicUrl)
        .map(f => ({
          mediaType: f.type,
          publicUrl: f.publicUrl!,
          fileName: f.fileName!,
          fileSize: f.fileSize!,
          mimeType: f.mimeType!
        }));

      const storyData = {
        title: title.trim(),
        content: content.trim(),
        excerpt: content.trim().substring(0, 200),
        author: user.id,
        category: category,
        status: 'published' as const,
        is_public: true,
        location: location.trim() || null,
        featured_image_url: uploadedMediaFiles.find(f => f.mediaType === 'image')?.publicUrl || null,
        updated_at: new Date().toISOString()
      };

      if (draftId) {
        // Update and publish existing draft
        const { error } = await supabase
          .from('stories')
          .update(storyData)
          .eq('id', draftId)
          .eq('author', user.id);

        if (error) throw error;

        // Save tags
        if (selectedTags.length > 0) {
          // 删除旧的tag assignments
          const { error: deleteError } = await supabase
            .from('story_tag_assignments')
            .delete()
            .eq('story_id', draftId);

          if (deleteError) {
            console.warn('Failed to delete old tag assignments:', deleteError);
          }

          // 插入新的tag assignments
          const { error: tagsError } = await supabase
            .from('story_tag_assignments')
            .insert(selectedTags.map(tag => ({
              story_id: draftId,
              tag_id: tag.id
            })));

          if (tagsError) {
            console.error('Failed to save tags:', tagsError);
          }
        }

        navigate(`/story/${draftId}`);
      } else {
        // Create and publish new story
        const { data, error } = await supabase
          .from('stories')
          .insert([storyData])
          .select()
          .single();

        if (error) throw error;

        if (data) {
          // Save tags
          if (selectedTags.length > 0) {
            const { error: tagsError } = await supabase
              .from('story_tag_assignments')
              .insert(selectedTags.map(tag => ({
                story_id: data.id,
                tag_id: tag.id
              })));

            if (tagsError) {
              console.error('Failed to save tags:', tagsError);
            }
          }

          navigate(`/story/${data.id}`);
        }
      }

      toast.success(t('story.published', 'Story published successfully!'));
    } catch (error: any) {
      console.error('Story publishing failed:', error);
      setError(error.message || t('story.publish_error', 'Publishing failed, please try again later'));
      toast.error(error.message || t('story.publish_error', 'Publishing failed'));
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 text-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t('common.back', 'Back')}</span>
          </button>
          <h1 className="text-2xl font-bold text-foreground">{t('story.create_title', 'Create New Story')}</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Main content area */}
        <div className="bg-background border border-border rounded-xl shadow-sm">
          <div className="p-6 space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                {t('story.title_label', 'Title')} *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-3 text-lg border border-border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-background text-foreground"
                placeholder={t('story.title_placeholder', 'Enter your story title...')}
                required
                maxLength={200}
              />
              <p className="text-xs text-foreground-muted mt-1">{title.length}/200 {t('common.characters', 'characters')}</p>
            </div>

            {/* Tags Selection */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                {t('story.tags_label', 'Tags')} ({t('story.tags_max', 'Maximum 3')})
              </label>
              <MultiTagSelector
                selectedTags={selectedTags}
                onTagsChange={setSelectedTags}
                maxTags={3}
              />
            </div>

            {/* Location */}
            <div className="relative">
              <label className="block text-sm font-medium text-foreground mb-2">
                {t('story.location_label', 'Location')} ({t('story.location_optional', 'Optional')})
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={location}
                  onChange={(e) => handleLocationChange(e.target.value)}
                  onFocus={() => {
                    if (location.length > 0) {
                      setShowLocationSuggestions(true);
                    }
                  }}
                  onBlur={() => {
                    // Delay hiding suggestions to allow clicks
                    setTimeout(() => setShowLocationSuggestions(false), 200);
                  }}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-background text-foreground"
                  placeholder={t('story.location_placeholder', 'Where did this happen? e.g., San Francisco, CA')}
                />
                
                {/* Location Suggestions Dropdown */}
                {showLocationSuggestions && locationSuggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 z-10 mt-1 bg-background border border-border rounded-lg shadow-lg max-h-48 overflow-y-auto">
                    {locationSuggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        type="button"
                        className="w-full px-3 py-2 text-left hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground text-sm transition-colors"
                        onClick={() => selectLocation(suggestion)}
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <p className="text-xs text-foreground-muted mt-1">
                {t('story.location_help', 'Adding a location helps readers connect with your story context.')}
              </p>
            </div>

            {/* Content */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-foreground">
                  {t('story.content_label', 'Content')} *
                </label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAiSection(!showAiSection)}
                  className="flex items-center gap-2"
                >
                  <Wand2 className="w-3 h-3" />
                  <span>{t('story.ai_assist.toggle', 'AI Writing Assistant')}</span>
                </Button>
              </div>
              
              {/* AI Writing Assistant Section */}
              {showAiSection && (
                <Card className="mb-4 border-blue-200 dark:border-blue-800">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center">
                      <Bot className="w-4 h-4 mr-2 text-blue-600" />
                      {t('story.ai_assist.title', 'AI Story Generator')}
                    </CardTitle>
                    <CardDescription className="text-xs">
                      {t('story.ai_assist.description', 'Generate compelling story content using AI. Describe what you want to write about.')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-foreground mb-1">
                        {t('story.ai_assist.model_select', 'AI Model')}
                      </label>
                      <Select value={selectedModel} onValueChange={setSelectedModel}>
                        <SelectTrigger className="h-8 text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="deepseek">
                            <div className="flex items-center justify-between w-full">
                              <span>DeepSeek</span>
                              <Badge variant="secondary" className="ml-2 text-xs">Recommended</Badge>
                            </div>
                          </SelectItem>
                          <SelectItem value="qwen">Qwen</SelectItem>
                          <SelectItem value="openai">GPT-4</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-foreground mb-1">
                        {t('story.ai_assist.image_generation', 'Story Image Generation')}
                      </label>
                      <Select value={imageGenerationModel} onValueChange={setImageGenerationModel}>
                        <SelectTrigger className="h-8 text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">No Image Generation</SelectItem>
                          <SelectItem value="dall-e-3">
                            <div className="flex items-center justify-between w-full">
                              <span>DALL-E 3</span>
                              <Badge variant="secondary" className="ml-2 text-xs">Premium</Badge>
                            </div>
                          </SelectItem>
                          <SelectItem value="midjourney">Midjourney Style</SelectItem>
                          <SelectItem value="stable-diffusion">Stable Diffusion</SelectItem>
                        </SelectContent>
                      </Select>
                      {imageGenerationModel !== 'none' && (
                        <p className="text-xs text-foreground-muted mt-1">
                          {t('story.ai_assist.image_generation_help', 'An AI-generated image will be created based on your story content.')}
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-foreground mb-1">
                        {t('story.ai_assist.prompt_label', 'Story Prompt')}
                      </label>
                      <textarea
                        value={aiPrompt}
                        onChange={(e) => setAiPrompt(e.target.value)}
                        className="w-full px-2 py-2 text-sm border border-border rounded focus:ring-1 focus:ring-primary-500 focus:border-transparent resize-none bg-background text-foreground"
                        rows={3}
                        placeholder={t('story.ai_assist.prompt_placeholder', 'Describe what you want to write about, your experiences, insights, or the topic you want to explore...')}
                      />
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        size="sm"
                        onClick={handleAiGenerate}
                        disabled={aiAssisting || !aiPrompt.trim()}
                        className="flex items-center gap-1"
                      >
                        {aiAssisting ? (
                          <>
                            <div className="animate-spin rounded-full h-3 w-3 border-2 border-white border-t-transparent" />
                            <span>{t('story.ai_assist.generating', 'Generating...')}</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-3 h-3" />
                            <span>{t('story.ai_assist.generate', 'Generate Story')}</span>
                          </>
                        )}
                      </Button>
                      
                      {aiGeneratedContent && (
                        <>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={handleUseAiContent}
                          >
                            <Check className="w-3 h-3 mr-1" />
                            {t('story.ai_assist.use_content', 'Use Content')}
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={handleCopyAiContent}
                          >
                            {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                          </Button>
                        </>
                      )}
                    </div>
                    
                    {aiGeneratedContent && (
                      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 border">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-xs font-medium text-foreground">
                            {t('story.ai_assist.generated_content', 'Generated Content')}
                          </h4>
                          <Badge variant="outline" className="text-xs">
                            {selectedModel}
                          </Badge>
                        </div>
                        <div className="text-sm text-foreground max-h-32 overflow-y-auto whitespace-pre-wrap">
                          {aiGeneratedContent}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
              
              <textarea
                ref={contentRef}
                value={content}
                onChange={handleContentChange}
                rows={12}
                className="w-full px-3 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none bg-background text-foreground min-h-[300px]"
                placeholder={t('story.content_placeholder', 'Share your AI experience story, let more people benefit from it...')}
                required
              />
              <div className="flex items-center justify-between mt-1">
                <p className="text-xs text-foreground-muted">{content.length} {t('common.characters', 'characters')}</p>
                {!showAiSection && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAiSection(true)}
                    className="h-auto p-0 text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700"
                  >
                    <Bot className="w-3 h-3 mr-1" />
                    {t('story.ai_assist.hint', 'Need writing help? Try AI Assistant')}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Media files area */}
        <div className="bg-background border border-border rounded-xl shadow-sm">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">{t('story.media_files', 'Media Files')}</h3>
              <label className="flex items-center space-x-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 cursor-pointer transition-colors">
                <Upload className="w-4 h-4" />
                <span>{t('story.upload_files', 'Upload Files')}</span>
                <input
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </label>
            </div>

            {mediaFiles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {mediaFiles.map((media) => (
                  <div key={media.id} className="relative bg-background-secondary rounded-lg overflow-hidden">
                    {media.type === 'image' ? (
                      <img
                        src={media.preview}
                        alt={media.file.name}
                        className="w-full h-32 object-cover"
                      />
                    ) : (
                      <video
                        src={media.preview}
                        className="w-full h-32 object-cover"
                        muted
                      />
                    )}
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      {media.uploading ? (
                        <div className="text-white text-center">
                          <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent mx-auto mb-1"></div>
                          <p className="text-xs">{t('story.uploading', 'Uploading')}</p>
                        </div>
                      ) : media.uploaded ? (
                        <div className="text-white text-center">
                          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-1">
                            <span className="text-xs">✓</span>
                          </div>
                          <p className="text-xs">{t('story.uploaded', 'Uploaded')}</p>
                        </div>
                      ) : (
                        <div className="text-white text-center">
                          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-1">
                            {media.type === 'image' ? <Image className="w-3 h-3" /> : <Video className="w-3 h-3" />}
                          </div>
                          <p className="text-xs">{t('story.pending_upload', 'Pending Upload')}</p>
                        </div>
                      )}
                    </div>
                    
                    {/* Delete button */}
                    <button
                      type="button"
                      onClick={() => removeMediaFile(media.id)}
                      className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                    
                    {/* File information */}
                    <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-2">
                      <p className="text-xs truncate" title={media.file.name}>
                        {media.file.name}
                      </p>
                      <p className="text-xs text-gray-300">
                        {(media.file.size / 1024 / 1024).toFixed(1)} MB
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-foreground-muted">
                <div className="w-12 h-12 bg-background-secondary rounded-full flex items-center justify-center mx-auto mb-3">
                  <PlusCircle className="w-6 h-6" />
                </div>
                <p>{t('story.no_media_files', 'No media files uploaded yet')}</p>
                <p className="text-sm">{t('story.supported_formats', 'Supports image and video formats')}</p>
              </div>
            )}
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-error-50 dark:bg-error-900/20 border border-error-200 dark:border-error-800 rounded-lg p-4 flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-error-500 flex-shrink-0 mt-0.5" />
            <p className="text-error-700 dark:text-error-400">{error}</p>
          </div>
        )}

        {/* Submit buttons */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-foreground-muted">
            <p>{t('story.publish_notice', 'After publishing, your story will be public to all users.')}</p>
          </div>
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="px-6 py-2 border border-border text-foreground rounded-lg hover:bg-background-secondary transition-colors"
            >
              {t('common.cancel', 'Cancel')}
            </button>
            <button
              type="button"
              onClick={handleSaveDraft}
              disabled={savingDraft || !title.trim()}
              className="flex items-center space-x-2 px-6 py-2 border border-primary-500 text-primary-500 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {savingDraft ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary-500 border-t-transparent"></div>
                  <span>{t('story.saving_draft', 'Saving...')}</span>
                </>
              ) : (
                <>
                  <span>{draftId ? t('story.update_draft', 'Update Draft') : t('story.save_draft', 'Save Draft')}</span>
                </>
              )}
            </button>
            <button
              type="submit"
              disabled={publishing || !title.trim() || !content.trim()}
              className="flex items-center space-x-2 px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {publishing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  <span>{t('story.publishing', 'Publishing...')}</span>
                </>
              ) : (
                <>
                  <PlusCircle className="w-4 h-4" />
                  <span>{t('story.publish', 'Publish Story')}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}