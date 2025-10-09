import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface Tag {
  id: string;
  name: string;
  display_name: string;
  color: string;
  usage_count?: number;
}

interface TagDisplayProps {
  tags: Tag[];
  maxDisplay?: number;
  size?: 'sm' | 'md' | 'lg';
  onTagClick?: (tag: Tag) => void;
  className?: string;
}

export function TagDisplay({ 
  tags, 
  maxDisplay = 3, 
  size = 'sm', 
  onTagClick,
  className 
}: TagDisplayProps) {
  const visibleTags = tags.slice(0, maxDisplay);
  const hiddenCount = tags.length - maxDisplay;

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2 py-1',
    lg: 'text-base px-3 py-1.5'
  };

  return (
    <div className={cn('flex flex-wrap gap-1', className)}>
      {visibleTags.map(tag => (
        <Badge
          key={tag.id}
          variant="secondary"
          className={cn(
            sizeClasses[size],
            onTagClick && 'cursor-pointer hover:opacity-80 transition-opacity',
            'inline-flex items-center'
          )}
          style={{ 
            backgroundColor: tag.color + '20', 
            borderColor: tag.color,
            color: tag.color
          }}
          onClick={() => onTagClick?.(tag)}
        >
          {tag.display_name}
        </Badge>
      ))}
      
      {hiddenCount > 0 && (
        <Badge variant="outline" className={cn(sizeClasses[size], 'opacity-70')}>
          +{hiddenCount}
        </Badge>
      )}
    </div>
  );
}

export default TagDisplay;