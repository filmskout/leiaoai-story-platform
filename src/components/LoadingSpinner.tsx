import React from 'react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
  color?: 'primary' | 'white' | 'secondary';
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  text, 
  className,
  color = 'primary'
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  const colorClasses = {
    primary: 'border-primary-500 border-t-transparent',
    secondary: 'border-neutral-300 dark:border-neutral-700 border-t-transparent',
    white: 'border-white border-t-transparent'
  };

  return (
    <div className={cn('flex flex-col items-center justify-center', className)}>
      <div 
        className={cn(
          'animate-spin rounded-full border-2', 
          sizeClasses[size],
          colorClasses[color]
        )}
      />
      {text && (
        <span className="mt-2 text-sm font-medium text-foreground-secondary">
          {text}
        </span>
      )}
    </div>
  );
};

export default LoadingSpinner;