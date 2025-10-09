import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/lib/supabase';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  X, 
  Search, 
  ChevronDown, 
  ChevronUp,
  AlertCircle 
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Tag {
  id: string;
  name: string;
  display_name: string;
  color: string;
  usage_count: number;
  is_active: boolean;
}

interface MultiTagSelectorProps {
  selectedTags: Tag[];
  onTagsChange: (tags: Tag[]) => void;
  maxTags?: number;
}

const POPULAR_TAG_COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
  '#DDA0DD', '#98D8C8', '#FF7675', '#74B9FF', '#00B894'
];

export function MultiTagSelector({ 
  selectedTags, 
  onTagsChange, 
  maxTags = 3 
}: MultiTagSelectorProps) {
  const { t } = useTranslation();
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAll, setShowAll] = useState(false);
  const [isCreateTagOpen, setIsCreateTagOpen] = useState(false);
  const [newTagName, setNewTagName] = useState('');
  const [newTagDescription, setNewTagDescription] = useState('');
  const [newTagColor, setNewTagColor] = useState('#FF6B6B');
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');

  // Load tags from database
  useEffect(() => {
    loadTags();
  }, []);

  const loadTags = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('story_tags')
        .select('*')
        .eq('is_active', true)
        .order('usage_count', { ascending: false });

      if (error) throw error;
      setAvailableTags(data || []);
    } catch (error) {
      console.error('Failed to load tags:', error);
      setError('Failed to load tags');
    } finally {
      setLoading(false);
    }
  };

  // Filter tags based on search
  const filteredTags = availableTags.filter(tag => 
    tag.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tag.display_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get popular tags (top 5)
  const popularTags = filteredTags.slice(0, 5);
  const remainingTags = filteredTags.slice(5);

  // Check if tag is selected
  const isTagSelected = (tagId: string) => {
    return selectedTags.some(tag => tag.id === tagId);
  };

  // Handle tag selection/deselection
  const handleTagToggle = (tag: Tag) => {
    if (isTagSelected(tag.id)) {
      // Remove tag
      const newTags = selectedTags.filter(t => t.id !== tag.id);
      onTagsChange(newTags);
    } else {
      // Add tag (check max limit)
      if (selectedTags.length >= maxTags) {
        setError(t('tags.max_tags_reached', 'Maximum 3 tags allowed'));
        setTimeout(() => setError(''), 3000);
        return;
      }
      const newTags = [...selectedTags, tag];
      onTagsChange(newTags);
    }
  };

  // Remove selected tag
  const removeSelectedTag = (tagId: string) => {
    const newTags = selectedTags.filter(tag => tag.id !== tagId);
    onTagsChange(newTags);
  };

  // Create new tag
  const handleCreateTag = async () => {
    if (!newTagName.trim()) {
      setError('Tag name is required');
      return;
    }

    // Check if tag name already exists
    const existingTag = availableTags.find(
      tag => tag.name.toLowerCase() === newTagName.toLowerCase().trim()
    );
    
    if (existingTag) {
      setError('Tag name already exists');
      return;
    }

    try {
      setCreating(true);
      setError('');

      const { data, error } = await supabase
        .from('story_tags')
        .insert({
          name: newTagName.toLowerCase().trim().replace(/\s+/g, '-'),
          display_name: newTagName.trim(),
          color: newTagColor,
          usage_count: 0,
          is_active: true
        })
        .select()
        .single();

      if (error) throw error;

      // Add to available tags and select it
      const newTag = data as Tag;
      setAvailableTags(prev => [newTag, ...prev]);
      
      // Auto-select the newly created tag if under limit
      if (selectedTags.length < maxTags) {
        onTagsChange([...selectedTags, newTag]);
      }

      // Reset form and close dialog
      setNewTagName('');
      setNewTagDescription('');
      setNewTagColor('#FF6B6B');
      setIsCreateTagOpen(false);
    } catch (error: any) {
      console.error('Failed to create tag:', error);
      setError(error.message || 'Failed to create tag');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Selected Tags Display */}
      {selectedTags.length > 0 && (
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            {t('tags.selected_tags', 'Selected Tags')} ({selectedTags.length}/{maxTags})
          </label>
          <div className="flex flex-wrap gap-2">
            {selectedTags.map(tag => (
              <Badge
                key={tag.id}
                variant="secondary"
                className="flex items-center gap-1 px-2 py-1"
                style={{ backgroundColor: tag.color + '20', borderColor: tag.color }}
              >
                <span>{tag.display_name}</span>
                <button
                  type="button"
                  onClick={() => removeSelectedTag(tag.id)}
                  className="ml-1 hover:bg-red-500 hover:text-white rounded-full w-4 h-4 flex items-center justify-center transition-colors"
                >
                  <X size={10} />
                </button>
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Tag Selection Area */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-foreground">
            {t('tags.select_tags', 'Select Tags')}
          </label>
          <div className="flex items-center gap-2">
            {/* Create New Tag Button */}
            <Dialog open={isCreateTagOpen} onOpenChange={setIsCreateTagOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="text-xs">
                  <Plus size={14} className="mr-1" />
                  {t('tags.create_new_tag', 'Create New Tag')}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{t('tags.create_new_tag', 'Create New Tag')}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      {t('tags.tag_name', 'Tag Name')}
                    </label>
                    <Input
                      value={newTagName}
                      onChange={(e) => setNewTagName(e.target.value)}
                      placeholder="Enter tag name..."
                      maxLength={50}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      {t('tags.tag_color', 'Tag Color')}
                    </label>
                    <div className="flex gap-2 flex-wrap">
                      {POPULAR_TAG_COLORS.map(color => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => setNewTagColor(color)}
                          className={cn(
                            'w-8 h-8 rounded-full border-2 transition-all',
                            newTagColor === color ? 'border-foreground scale-110' : 'border-border'
                          )}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>

                  {error && (
                    <div className="flex items-center gap-2 text-red-600 text-sm">
                      <AlertCircle size={16} />
                      <span>{error}</span>
                    </div>
                  )}

                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setIsCreateTagOpen(false)}
                      disabled={creating}
                    >
                      {t('cancel', 'Cancel')}
                    </Button>
                    <Button
                      onClick={handleCreateTag}
                      disabled={creating || !newTagName.trim()}
                    >
                      {creating ? 'Creating...' : t('tags.create_tag', 'Create Tag')}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
          <Input
            placeholder={t('tags.search_tags', 'Search tags...')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Popular Tags */}
        {!searchQuery && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">
              {t('tags.popular_tags', 'Popular Tags')}
            </h4>
            <div className="flex flex-wrap gap-2">
              {popularTags.map(tag => (
                <TagButton
                  key={tag.id}
                  tag={tag}
                  isSelected={isTagSelected(tag.id)}
                  onClick={() => handleTagToggle(tag)}
                  disabled={!isTagSelected(tag.id) && selectedTags.length >= maxTags}
                />
              ))}
            </div>
          </div>
        )}

        {/* All Tags */}
        {(remainingTags.length > 0 || searchQuery) && (
          <div className="space-y-2">
            {!searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAll(!showAll)}
                className="text-sm text-muted-foreground p-0 h-auto"
              >
                {showAll ? (
                  <>
                    <ChevronUp size={16} className="mr-1" />
                    Hide Additional Tags
                  </>
                ) : (
                  <>
                    <ChevronDown size={16} className="mr-1" />
                    {t('tags.all_tags', 'Show All Tags')} ({remainingTags.length})
                  </>
                )}
              </Button>
            )}
            
            {(showAll || searchQuery) && (
              <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
                {(searchQuery ? filteredTags : remainingTags).map(tag => (
                  <TagButton
                    key={tag.id}
                    tag={tag}
                    isSelected={isTagSelected(tag.id)}
                    onClick={() => handleTagToggle(tag)}
                    disabled={!isTagSelected(tag.id) && selectedTags.length >= maxTags}
                  />
                ))}
                {filteredTags.length === 0 && searchQuery && (
                  <div className="text-sm text-muted-foreground w-full text-center py-4">
                    {t('tags.no_tags_found', 'No tags found')}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Error Display */}
        {error && !isCreateTagOpen && (
          <div className="flex items-center gap-2 text-red-600 text-sm">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}
      </div>
    </div>
  );
}

// Individual Tag Button Component
function TagButton({ 
  tag, 
  isSelected, 
  onClick, 
  disabled 
}: { 
  tag: Tag; 
  isSelected: boolean; 
  onClick: () => void; 
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium transition-all',
        'border border-border hover:border-foreground',
        isSelected 
          ? 'bg-primary text-primary-foreground border-primary'
          : 'bg-background text-foreground hover:bg-accent',
        disabled && 'opacity-50 cursor-not-allowed'
      )}
      style={isSelected ? { backgroundColor: tag.color, borderColor: tag.color } : {}}
    >
      {tag.display_name}
      {tag.usage_count > 0 && (
        <span className="ml-1 text-xs opacity-75">({tag.usage_count})</span>
      )}
    </button>
  );
}

export default MultiTagSelector;