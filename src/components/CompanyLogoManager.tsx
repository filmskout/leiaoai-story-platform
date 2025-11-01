import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Upload, Image, Wand2, CheckCircle, XCircle } from 'lucide-react';

interface Company {
  id: string;
  name: string;
  description: string;
  logo_base64?: string;
  logo_url?: string;
  logo_updated_at?: string;
  [key: string]: any;
}

interface CompanyLogoManagerProps {
  company: Company;
  onUpdate: (updatedCompany: Company) => void;
}

export default function CompanyLogoManager({ company, onUpdate }: CompanyLogoManagerProps) {
  const [logoBase64, setLogoBase64] = useState(company.logo_base64 || '');
  const [logoUrl, setLogoUrl] = useState(company.logo_url || '');
  const [isUploading, setIsUploading] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [missingFields, setMissingFields] = useState<string[]>([]);

  // 检查缺失字段
  useEffect(() => {
    const fields = ['english_description', 'headquarters', 'valuation', 'website', 'founded_year', 'employee_count', 'industry'];
    const missing = fields.filter(field => !company[field] || company[field] === '');
    setMissingFields(missing);
  }, [company]);

  // 处理文件上传
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setMessage({ type: 'error', text: '请选择图片文件' });
      return;
    }

    if (file.size > 2 * 1024 * 1024) { // 2MB
      setMessage({ type: 'error', text: '图片大小不能超过2MB' });
      return;
    }

    setIsUploading(true);
    try {
      const base64 = await fileToBase64(file);
      setLogoBase64(base64);
      setMessage({ type: 'success', text: '图片上传成功' });
    } catch (error) {
      setMessage({ type: 'error', text: '图片上传失败' });
    } finally {
      setIsUploading(false);
    }
  };

  // 文件转base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  // 保存logo到Storage
  const handleSaveLogoToStorage = async () => {
    if (!logoBase64 && !logoUrl) {
      setMessage({ type: 'error', text: '请上传图片或输入图片URL' });
      return;
    }

    setIsUploading(true);
    try {
      const response = await fetch('/api/unified', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'upload-logo-to-storage',
          token: localStorage.getItem('leoai-admin-session') || localStorage.getItem('adminToken') || 'admin-token-123',
          companyId: company.id,
          logoBase64: logoBase64,
          fileName: `${company.name.toLowerCase().replace(/\s+/g, '-')}-logo.png`
        })
      });

      const result = await response.json();
      if (result.success) {
        setMessage({ type: 'success', text: 'Logo上传到Storage成功' });
        onUpdate(result.company);
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: `上传失败: ${error.message}` });
    } finally {
      setIsUploading(false);
    }
  };

  // 将URL转换为Base64
  const urlToBase64 = async (url: string): Promise<string> => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      throw new Error('无法加载图片URL');
    }
  };

  // 保存logo（兼容模式）
  const handleSaveLogo = async () => {
    if (!logoBase64 && !logoUrl) {
      setMessage({ type: 'error', text: '请上传图片或输入图片URL' });
      return;
    }

    setIsUploading(true);
    try {
      let finalLogoBase64 = logoBase64;
      
      // 如果只有URL没有Base64，尝试将URL转换为Base64
      if (!finalLogoBase64 && logoUrl) {
        try {
          finalLogoBase64 = await urlToBase64(logoUrl);
          setLogoBase64(finalLogoBase64);
        } catch (error: any) {
          // 如果转换失败，直接保存URL
          console.warn('URL转Base64失败，将保存URL:', error.message);
        }
      }

      const response = await fetch('/api/unified', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update-company-logo',
          token: localStorage.getItem('leoai-admin-session') || localStorage.getItem('adminToken') || 'admin-token-123',
          companyId: company.id,
          logoBase64: finalLogoBase64,
          logoUrl: logoUrl && !finalLogoBase64 ? logoUrl : undefined
        })
      });

      const result = await response.json();
      if (result.success) {
        setMessage({ type: 'success', text: 'Logo保存成功' });
        onUpdate(result.company);
        // 如果URL转换成功，清除URL输入
        if (finalLogoBase64 && logoUrl) {
          setLogoUrl('');
        }
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: `保存失败: ${error.message}` });
    } finally {
      setIsUploading(false);
    }
  };

  // 使用LLM补齐数据
  const handleCompleteData = async () => {
    if (missingFields.length === 0) {
      setMessage({ type: 'success', text: '所有字段都已完整' });
      return;
    }

    setIsCompleting(true);
    try {
      const response = await fetch('/api/unified', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'complete-company-data',
          token: localStorage.getItem('leoai-admin-session') || localStorage.getItem('adminToken') || 'admin-token-123',
          companyId: company.id,
          fields: missingFields
        })
      });

      const result = await response.json();
      if (result.success) {
        setMessage({ type: 'success', text: `数据补齐成功: ${result.completedFields.join(', ')}` });
        onUpdate(result.company);
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: `补齐失败: ${error.message}` });
    } finally {
      setIsCompleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Logo管理 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Image className="h-5 w-5" />
            公司Logo管理
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* 当前Logo显示 */}
          {logoBase64 && (
            <div className="flex items-center gap-4">
              <img 
                src={logoBase64} 
                alt={`${company.name} logo`}
                className="h-16 w-16 object-contain border rounded"
              />
              <div>
                <p className="text-sm text-muted-foreground">当前Logo</p>
                <p className="text-xs text-muted-foreground">
                  {company.logo_updated_at && `更新于: ${new Date(company.logo_updated_at).toLocaleString()}`}
                </p>
              </div>
            </div>
          )}

          {/* Logo上传 */}
          <div className="space-y-2">
            <Label htmlFor="logo-upload">上传Logo图片</Label>
            <Input
              id="logo-upload"
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              disabled={isUploading}
            />
            <p className="text-xs text-muted-foreground">
              支持PNG、JPG、SVG格式，最大2MB
            </p>
          </div>

          {/* Logo URL */}
          <div className="space-y-2">
            <Label htmlFor="logo-url">或输入Logo URL</Label>
            <Input
              id="logo-url"
              value={logoUrl}
              onChange={(e) => setLogoUrl(e.target.value)}
              placeholder="https://example.com/logo.png"
            />
          </div>

          {/* 保存按钮 */}
          <div className="grid grid-cols-2 gap-2">
            <Button 
              onClick={handleSaveLogoToStorage} 
              disabled={isUploading || (!logoBase64 && !logoUrl)}
              className="w-full"
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  上传中...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  上传到Storage
                </>
              )}
            </Button>
            
            <Button 
              onClick={handleSaveLogo} 
              disabled={isUploading || (!logoBase64 && !logoUrl)}
              variant="outline"
              className="w-full"
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  保存中...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  保存Base64
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 数据补齐 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wand2 className="h-5 w-5" />
            AI数据补齐
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* 缺失字段 */}
          {missingFields.length > 0 ? (
            <div className="space-y-2">
              <p className="text-sm font-medium">缺失字段:</p>
              <div className="flex flex-wrap gap-2">
                {missingFields.map(field => (
                  <Badge key={field} variant="outline" className="text-xs">
                    {field}
                  </Badge>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle className="h-4 w-4" />
              <span className="text-sm">所有字段都已完整</span>
            </div>
          )}

          {/* 补齐按钮 */}
          <Button 
            onClick={handleCompleteData} 
            disabled={isCompleting || missingFields.length === 0}
            className="w-full"
            variant="outline"
          >
            {isCompleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                AI补齐中...
              </>
            ) : (
              <>
                <Wand2 className="mr-2 h-4 w-4" />
                使用AI补齐数据
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* 消息提示 */}
      {message && (
        <Alert className={message.type === 'success' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
          {message.type === 'success' ? (
            <CheckCircle className="h-4 w-4 text-green-600" />
          ) : (
            <XCircle className="h-4 w-4 text-red-600" />
          )}
          <AlertDescription className={message.type === 'success' ? 'text-green-800' : 'text-red-800'}>
            {message.text}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
