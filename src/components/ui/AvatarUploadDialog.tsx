import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, Sparkles, RefreshCw, Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface AvatarUploadDialogProps {
  open: boolean;
  onClose: () => void;
  onAvatarUpdate: (avatarUrl: string) => void;
  userId: string;
  currentAvatarUrl?: string;
  userName?: string;
}

export function AvatarUploadDialog({
  open,
  onClose,
  onAvatarUpdate,
  userId,
  currentAvatarUrl,
  userName = 'User'
}: AvatarUploadDialogProps) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'upload' | 'generate'>('upload');
  const [uploading, setUploading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [generatedUrl, setGeneratedUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file
    if (!file.type.startsWith('image/')) {
      toast.error(t('settings.avatar_error_type', 'Please select an image file'));
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error(t('settings.avatar_error_size', 'Image must be less than 5MB'));
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!selectedFile || !previewUrl) return;

    setUploading(true);
    try {
      // 直接使用base64上传到profiles表，不经过edge function
      const base64Data = previewUrl;
      
      // 更新profile中的avatar_url为base64
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
          avatar_url: base64Data,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (updateError) throw updateError;

      onAvatarUpdate(base64Data);
      toast.success(t('settings.avatar_uploaded', 'Avatar uploaded successfully'));
      handleClose();
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(error.message || t('settings.avatar_error', 'Failed to upload avatar'));
    } finally {
      setUploading(false);
    }
  };

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const prompt = `Professional business avatar portrait for ${userName}, modern style, high quality, suitable for business profile picture`;

      const response = await fetch('/api/generate-avatar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          size: '1024x1024'
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate avatar');
      }

      const data = await response.json();

      if (data.success && (data.base64Image || data.imageUrl)) {
        // 优先使用base64，如果没有则使用URL
        const imageData = data.base64Image || data.imageUrl;
        setGeneratedUrl(imageData);
        setPreviewUrl(imageData);
      } else {
        throw new Error('Invalid response from avatar generation service');
      }
    } catch (error: any) {
      console.error('Avatar generation error:', error);
      toast.error(error.message || t('settings.avatar_generate_error', 'Failed to generate avatar'));
    } finally {
      setGenerating(false);
    }
  };

  const handleConfirmGenerated = async () => {
    if (!generatedUrl) return;

    setUploading(true);
    try {
      let base64Data = generatedUrl;

      // 如果不是base64格式（以data:开头），则需要下载
      if (!generatedUrl.startsWith('data:')) {
        try {
          const imageResponse = await fetch(generatedUrl, {
            mode: 'cors',
            credentials: 'omit'
          });
          
          if (!imageResponse.ok) {
            throw new Error('Failed to download image');
          }
          
          const imageBlob = await imageResponse.blob();

          // Convert to base64
          const reader = new FileReader();
          const base64Promise = new Promise<string>((resolve, reject) => {
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(imageBlob);
          });

          base64Data = await base64Promise;
        } catch (fetchError) {
          console.error('Failed to fetch image, using direct URL:', fetchError);
          throw new Error('Unable to download generated image. Please try generating again.');
        }
      }

      // 直接保存base64到profiles表
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
          avatar_url: base64Data,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (updateError) throw updateError;

      onAvatarUpdate(base64Data);
      toast.success(t('settings.avatar_generated', 'Avatar generated and saved successfully'));
      handleClose();
    } catch (error: any) {
      console.error('Confirm error:', error);
      toast.error(error.message || t('settings.avatar_error', 'Failed to save avatar'));
    } finally {
      setUploading(false);
    }
  };

  const handleClose = () => {
    setPreviewUrl(null);
    setGeneratedUrl(null);
    setSelectedFile(null);
    setActiveTab('upload');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('settings.change_avatar', 'Change Avatar')}</DialogTitle>
          <DialogDescription>
            {t('settings.avatar_dialog_desc', 'Upload a photo or generate one with AI')}
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'upload' | 'generate')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload">
              <Upload className="w-4 h-4 mr-2" />
              {t('settings.upload', 'Upload')}
            </TabsTrigger>
            <TabsTrigger value="generate">
              <Sparkles className="w-4 h-4 mr-2" />
              {t('settings.ai_generate', 'AI Generate')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-4 mt-4">
            {/* Preview */}
            <div className="flex justify-center">
              <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-border">
                <img
                  src={previewUrl || currentAvatarUrl || '/default-avatar.png'}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* File input */}
            <div>
              <label className="block">
                <div className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary-500 transition-colors">
                  <Upload className="w-5 h-5 mr-2 flex-shrink-0 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground truncate max-w-[250px]" title={selectedFile?.name}>
                    {selectedFile ? selectedFile.name : t('settings.select_file', 'Select a file')}
                  </span>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </label>
              <p className="text-xs text-muted-foreground mt-2">
                {t('settings.photo_requirements', 'JPG, PNG or GIF. Max size 5MB.')}
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleClose} className="flex-1">
                <X className="w-4 h-4 mr-2" />
                {t('common.cancel', 'Cancel')}
              </Button>
              <Button
                onClick={handleUpload}
                disabled={!selectedFile || uploading}
                className="flex-1"
              >
                {uploading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent mr-2" />
                    {t('common.uploading', 'Uploading...')}
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    {t('common.confirm', 'Confirm')}
                  </>
                )}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="generate" className="space-y-4 mt-4">
            {/* Preview */}
            <div className="flex justify-center">
              <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-border">
                {generating ? (
                  <div className="w-full h-full flex items-center justify-center bg-muted">
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
                  </div>
                ) : (
                  <img
                    src={previewUrl || currentAvatarUrl || '/default-avatar.png'}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            </div>

            {/* Info */}
            <p className="text-sm text-muted-foreground text-center">
              {t('settings.ai_avatar_desc', 'Generate a professional avatar using AI based on your profile')}
            </p>

            {/* Actions */}
            <div className="flex gap-2">
              {generatedUrl ? (
                <>
                  <Button
                    variant="outline"
                    onClick={handleGenerate}
                    disabled={generating}
                    className="flex-1"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    {t('settings.regenerate', 'Regenerate')}
                  </Button>
                  <Button
                    onClick={handleConfirmGenerated}
                    disabled={uploading}
                    className="flex-1"
                  >
                    {uploading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent mr-2" />
                        {t('common.saving', 'Saving...')}
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        {t('common.confirm', 'Confirm')}
                      </>
                    )}
                  </Button>
                </>
              ) : (
                <Button
                  onClick={handleGenerate}
                  disabled={generating}
                  className="w-full"
                >
                  {generating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent mr-2" />
                      {t('settings.generating', 'Generating...')}
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      {t('settings.generate_avatar', 'Generate Avatar')}
                    </>
                  )}
                </Button>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

