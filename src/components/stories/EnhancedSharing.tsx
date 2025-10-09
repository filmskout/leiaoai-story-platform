import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Share2, Copy, X } from 'lucide-react';
import { getAvailablePlatforms, addNativeSharing, Platform } from '@/lib/geolocation';
import { toast } from 'sonner';

interface EnhancedSharingProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
  title: string;
  onShare?: () => void;
}

export function EnhancedSharing({ isOpen, onClose, url, title, onShare }: EnhancedSharingProps) {
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      loadPlatforms();
    }
  }, [isOpen, url, title]);

  const loadPlatforms = async () => {
    try {
      setLoading(true);
      const availablePlatforms = await getAvailablePlatforms();
      const platformsWithNative = addNativeSharing(availablePlatforms, url, title);
      setPlatforms(platformsWithNative);
    } catch (error) {
      console.error('Failed to load sharing platforms:', error);
      toast.error('Failed to load sharing options');
    } finally {
      setLoading(false);
    }
  };

  const handlePlatformShare = async (platform: Platform) => {
    try {
      await platform.action(url, title);
      onShare?.();
      toast.success(`Shared via ${platform.name}!`);
      
      // Close modal after a short delay for better UX
      setTimeout(() => {
        onClose();
      }, 800);
    } catch (error) {
      console.error('Sharing failed:', error);
      toast.error(`Failed to share via ${platform.name}`);
    }
  };

  if (loading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Share Story
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Story preview */}
          <div className="bg-muted/50 p-3 rounded-lg">
            <h4 className="font-medium text-sm line-clamp-2 mb-1">{title}</h4>
            <p className="text-xs text-muted-foreground break-all">{url}</p>
          </div>

          {/* Sharing platforms grid */}
          <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
            {platforms.map((platform, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => handlePlatformShare(platform)}
                className="flex items-center gap-2 justify-start h-12"
                style={{ 
                  borderColor: platform.color + '20',
                  backgroundColor: platform.color + '05'
                }}
              >
                <span className="text-lg">{platform.icon}</span>
                <span className="text-sm truncate">{platform.name}</span>
              </Button>
            ))}
          </div>

          {/* Quick copy URL - only show if Copy Link is not already in the platforms list */}
          {!platforms.some(p => p.name === 'Copy Link') && (
            <div className="border-t pt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  navigator.clipboard.writeText(url);
                  onShare?.();
                  toast.success('Link copied to clipboard!');
                  setTimeout(() => onClose(), 800);
                }}
                className="w-full flex items-center gap-2"
              >
                <Copy className="h-4 w-4" />
                Copy Link
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
