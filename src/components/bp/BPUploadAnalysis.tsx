import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Upload, 
  FileText, 
  AlertCircle, 
  CheckCircle, 
  BarChart3,
  TrendingUp,
  Shield,
  Lightbulb,
  X,
  Globe,
  Plus
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatFileSize } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';
import { UnifiedLoader } from '@/components/UnifiedLoader';

interface BPUploadAnalysisProps {
  className?: string;
}

interface AnalysisScores {
  aiInsight: {
    overall: number;
    planStructure: number;
    content: number;
    viability: number;
  };
  marketInsights: {
    overall: number;
    marketCap: number;
    profitPotential: number;
    popularity: number;
    competition: number;
  };
  riskAssessment: {
    overall: number;
    politicalStability: number;
    economicTrend: number;
    policyVolatility: number;
    warSanctions: number;
  };
  growthProjections: {
    overall: number;
    marketGrowth: number;
    fiveYearProjection: number;
    saturationTimeline: number;
    resourceLimitations: number;
  };
  detailedAnalysis: {
    aiInsight: string;
    marketInsights: string;
    riskAssessment: string;
    growthProjections: string;
  };
}

export function BPUploadAnalysis({ className }: BPUploadAnalysisProps) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [websiteUrl, setWebsiteUrl] = useState<string>('');
  const [websiteData, setWebsiteData] = useState<any | null>(null);
  const [sources, setSources] = useState<Array<{ type: 'file' | 'website'; data: any; id: string }>>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isExtractingWebsite, setIsExtractingWebsite] = useState(false);
  const [analysisScores, setAnalysisScores] = useState<AnalysisScores | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploadedBpId, setUploadedBpId] = useState<string | null>(null);
  const [showWebsiteInput, setShowWebsiteInput] = useState(false);

  // 处理文件拖拽
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  // 处理文件放置
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFileSelect(files[0]);
  }, []);

  // 处理文件选择
  const handleFileSelect = (selectedFile: File | undefined) => {
    if (!selectedFile) return;
    
    console.log('🔵 BP Upload: File selected', { 
      name: selectedFile.name, 
      type: selectedFile.type,
      size: selectedFile.size 
    });
    
    // 验证文件类型
    const allowedTypes = [
      'application/pdf', 
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    if (!allowedTypes.includes(selectedFile.type)) {
      setError(t('errors.invalid_format', 'Invalid file format. Only PDF and DOCX are supported.'));
      return;
    }
    
    // 验证文件大小 (50MB)
    if (selectedFile.size > 50 * 1024 * 1024) {
      setError(t('errors.file_too_large', 'File is too large. Maximum size is 50MB.'));
      return;
    }
    
    setFile(selectedFile);
    setError(null);
    setAnalysisScores(null);
    setUploadedBpId(null);
    
    // 自动上传
    uploadFile(selectedFile);
  };

  // 上传文件到Storage
  const uploadFile = async (fileToUpload: File) => {
    if (!user) {
      setError(t('bp_analysis.login_required', 'Please log in to upload your BP'));
      navigate('/auth');
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      console.log('🔵 BP Upload: Starting upload to Storage', {
        userId: user.id,
        fileName: fileToUpload.name,
        fileSize: fileToUpload.size,
        fileType: fileToUpload.type
      });

      // 1. 上传到Supabase Storage
      // 清理文件名，移除特殊字符，保留扩展名
      const cleanFileName = fileToUpload.name
        .replace(/[^a-zA-Z0-9._-]/g, '_') // 替换特殊字符为下划线
        .replace(/_{2,}/g, '_'); // 多个下划线合并为一个
      
      const fileName = `${user.id}/${Date.now()}_${cleanFileName}`;
      console.log('🔵 BP Upload: Uploading to path:', fileName);
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('bp-documents')
        .upload(fileName, fileToUpload, {
          contentType: fileToUpload.type,
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('🔴 BP Upload: Storage error', {
          error: uploadError,
          message: uploadError.message,
          statusCode: (uploadError as any).statusCode,
          name: uploadError.name
        });
        
        let errorMsg = t('errors.upload_failed', 'Upload failed. Please try again.');
        
        // 更详细的错误消息
        if (uploadError.message?.includes('Invalid key')) {
          errorMsg = '文件名包含不支持的字符。请重命名文件（只使用英文字母、数字、点、横线、下划线）。';
        } else if (uploadError.message?.includes('not found') || uploadError.message?.includes('Bucket')) {
          errorMsg = '存储桶不存在。请联系技术支持。';
        } else if (uploadError.message?.includes('policy') || uploadError.message?.includes('permission') || uploadError.message?.includes('JWT')) {
          errorMsg = '权限错误：Storage policies未正确配置。请检查Supabase Storage policies。';
        } else if (uploadError.message?.includes('row-level security') || uploadError.message?.includes('RLS')) {
          errorMsg = 'RLS权限错误。请检查数据库policies。';
        } else if (uploadError.message?.includes('size')) {
          errorMsg = '文件太大。最大支持50MB。';
        } else {
          errorMsg = `上传失败: ${uploadError.message}`;
        }
        
        setError(errorMsg);
        return;
      }

      console.log('🟢 BP Upload: File uploaded to Storage', { path: uploadData.path });

      // 2. 获取文件的签名URL（24小时有效，可被外部访问）
      const { data: urlData, error: urlError } = await supabase.storage
        .from('bp-documents')
        .createSignedUrl(fileName, 86400); // 24小时有效期

      if (urlError || !urlData) {
        console.error('🔴 BP Upload: Failed to create signed URL', urlError);
        setError('无法生成文件访问链接');
        return;
      }

      console.log('🔵 BP Upload: Signed URL generated', { 
        url: urlData.signedUrl.substring(0, 100) + '...' 
      });

      // 3. 保存记录到数据库（保存原始路径，不是签名URL）
      console.log('🔵 BP Upload: Saving to database...');
      const { data: dbData, error: dbError } = await supabase
        .from('bp_submissions')
        .insert({
          user_id: user.id,
          file_name: fileToUpload.name,
          file_type: fileToUpload.type,
          file_url: fileName, // 保存文件路径，而不是签名URL
          file_size: fileToUpload.size,
          analysis_status: 'pending',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (dbError) {
        console.error('🔴 BP Upload: Database error', {
          error: dbError,
          message: dbError.message,
          code: dbError.code,
          details: dbError.details,
          hint: dbError.hint
        });
        
        let errorMsg = t('errors.upload_failed', 'Upload failed. Please try again.');
        
        if (dbError.message?.includes('row-level security') || dbError.code === '42501') {
          errorMsg = '数据库RLS权限错误：请运行 SETUP-ALL-RLS-POLICIES-FIXED.sql';
        } else if (dbError.message?.includes('foreign key') || dbError.code === '23503') {
          errorMsg = '数据库关联错误：用户Profile不存在。';
        } else if (dbError.message?.includes('unique') || dbError.code === '23505') {
          errorMsg = '记录已存在。';
        } else {
          errorMsg = `数据库错误: ${dbError.message}`;
        }
        
        setError(errorMsg);
        return;
      }

      console.log('🟢 BP Upload: Success!', { bpId: dbData.id });
      setUploadedBpId(dbData.id);
      
      // 显示成功提示
      alert(`✅ 文件上传成功！\n\n文件名: ${fileToUpload.name}\n大小: ${formatFileSize(fileToUpload.size)}\n\n已保存到您的Dashboard。\n现在可以点击"Analyze BP"进行分析。`);

    } catch (err: any) {
      console.error('🔴 BP Upload: Unexpected error', {
        error: err,
        message: err.message,
        stack: err.stack
      });
      setError(`上传失败: ${err.message || t('errors.upload_failed', 'Upload failed. Please try again.')}`);
    } finally {
      setIsUploading(false);
    }
  };

  // OCR提取文本（服务器端下载模式）
  const extractText = async (filePath: string, fileType: string): Promise<string> => {
    console.log('🔵 BP OCR: Extracting text', { filePath, fileType });

    try {
      // 对于PDF，使用OCR API（服务器端下载模式）
      if (fileType === 'application/pdf') {
        console.log('🔵 BP OCR: Using server-side download mode');
        console.log('   File path:', filePath);
        
        const response = await fetch('/api/unified?action=ocr-extract', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            filePath: filePath,  // 传递文件路径，让服务器下载
            fileType: fileType   // 传递文件类型，让服务器选择正确的提取方法
          })
        });

        console.log('🔵 BP OCR: API response status:', response.status);

        if (!response.ok) {
          // 先获取原始响应文本，以便调试
          const responseText = await response.text();
          console.error('🔴 BP OCR: Raw response:', responseText);
          
          let errorData: any = { error: 'Unknown error' };
          try {
            errorData = JSON.parse(responseText);
          } catch (e) {
            console.error('🔴 BP OCR: Failed to parse error response as JSON');
            errorData = { error: 'Server error', details: responseText.substring(0, 200) };
          }
          
          console.error('🔴 BP OCR: API error', { 
            status: response.status, 
            error: errorData,
            details: errorData.details,
            fullResponse: errorData
          });
          
          // 显示更详细的错误信息
          const errorMsg = errorData.details 
            ? `${errorData.error}\n详情: ${errorData.details}`
            : errorData.error || `OCR extraction failed with status ${response.status}`;
          
          throw new Error(errorMsg);
        }

        const data = await response.json();
        const extractedText = data.extractedText || data.text || '';
        
        console.log('🟢 BP OCR: Text extracted', { 
          length: extractedText.length,
          preview: extractedText.substring(0, 100) 
        });
        
        if (!extractedText || extractedText.length === 0) {
          throw new Error('No text could be extracted from the PDF');
        }
        
        return extractedText;
      } else if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        // 对于DOCX，暂时返回提示信息
        console.log('⚠️ BP OCR: DOCX extraction not yet implemented');
        return 'DOCX file uploaded. Text extraction for DOCX files will be implemented soon. Please use PDF format for full analysis.';
      } else {
        throw new Error(`Unsupported file type: ${fileType}`);
      }
    } catch (err: any) {
      console.error('🔴 BP OCR: Error', {
        message: err.message,
        stack: err.stack
      });
      throw new Error(err.message || 'Text extraction failed');
    }
  };

  // 分析BP
  const analyzeBP = async () => {
    if (!file || !uploadedBpId) return;

    if (!user) {
      setError(t('bp_analysis.login_required', 'Please log in to analyze your BP'));
      navigate('/auth');
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      console.log('🔵 BP Analysis: Starting');

      // 1. 更新状态为analyzing
      await supabase
        .from('bp_submissions')
        .update({ analysis_status: 'analyzing', updated_at: new Date().toISOString() })
        .eq('id', uploadedBpId);

      // 2. 获取文件路径和类型
      const { data: bpData } = await supabase
        .from('bp_submissions')
        .select('file_url, file_type')
        .eq('id', uploadedBpId)
        .single();

      if (!bpData) {
        throw new Error('BP submission not found');
      }

      // 3. OCR提取文本（直接使用文件路径，让服务器端下载）
      console.log('🔵 BP Analysis: Extracting text using server-side download...');
      console.log('   File path:', bpData.file_url);
      const extractedText = await extractText(bpData.file_url, bpData.file_type);

      // 4. 更新extracted_text到数据库
      await supabase
        .from('bp_submissions')
        .update({ extracted_text: extractedText })
        .eq('id', uploadedBpId);

      // 5. 调用分析API
      console.log('🔵 BP Analysis: Calling analysis API...');
      const response = await fetch('/api/unified?action=bp-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          extractedText,
          model: 'qwen' // 默认使用Qwen
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Analysis failed');
      }

      const analysisData = await response.json();
      const scores: AnalysisScores = analysisData.data.analysisScores;

      console.log('🟢 BP Analysis: Success!', scores);

      // 6. 计算总分（4个维度的平均值）
      const overallScore = Math.round(
        (scores.aiInsight.overall +
          scores.marketInsights.overall +
          scores.riskAssessment.overall +
          scores.growthProjections.overall) / 4
      );

      // 7. 保存分析结果到数据库
      await supabase
        .from('bp_submissions')
        .update({
          analysis_scores: scores,
          score: overallScore,
          analysis_status: 'completed',
          updated_at: new Date().toISOString()
        })
        .eq('id', uploadedBpId);

      setAnalysisScores(scores);

    } catch (err: any) {
      console.error('🔴 BP Analysis: Error', {
        message: err.message,
        stack: err.stack
      });
      
      let errorMsg = err.message || t('errors.analysis_failed', 'Analysis failed. Please try again.');
      
      // 提供更具体的错误消息
      if (err.message?.includes('OCR extraction failed')) {
        errorMsg = 'PDF文本提取失败。可能的原因：\n1. PDF文件损坏或加密\n2. OpenAI API配置问题\n3. 网络连接问题\n\n请尝试重新上传或使用其他PDF文件。';
      } else if (err.message?.includes('No text could be extracted')) {
        errorMsg = '无法从PDF中提取文本。请确保：\n1. PDF不是扫描版（纯图片）\n2. PDF未加密或受保护\n3. 文件未损坏';
      } else if (err.message?.includes('Analysis failed')) {
        errorMsg = 'AI分析失败。请稍后重试。';
      }
      
      setError(errorMsg);

      // 更新状态为failed
      if (uploadedBpId) {
        await supabase
          .from('bp_submissions')
          .update({ 
            analysis_status: 'failed', 
            updated_at: new Date().toISOString() 
          })
          .eq('id', uploadedBpId);
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  // 重置
  // 提取网站内容
  const extractWebsite = async () => {
    if (!websiteUrl.trim()) {
      setError(t('bp_analysis.enter_website', 'Please enter a valid website URL'));
      return;
    }

    if (!user) {
      setError(t('bp_analysis.login_required', 'Please log in to analyze websites'));
      navigate('/auth');
      return;
    }

    setIsExtractingWebsite(true);
    setError(null);

    try {
      console.log('🔵 BP Website: Extracting content from', websiteUrl);

      const response = await fetch('/api/unified?action=extract-website', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: websiteUrl })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to extract website content');
      }

      const result = await response.json();
      console.log('🟢 BP Website: Content extracted', {
        title: result.data.title,
        contentLength: result.textSummary.length
      });

      setWebsiteData(result);
      
      // 自动触发分析
      await analyzeWebsite(result.textSummary);

    } catch (error: any) {
      console.error('🔴 BP Website: Extraction error', error);
      setError(error.message || t('bp_analysis.extract_failed', 'Failed to extract website content'));
    } finally {
      setIsExtractingWebsite(false);
    }
  };

  // 分析网站内容
  const analyzeWebsite = async (websiteContent: string) => {
    if (!user || !websiteContent) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      console.log('🔵 BP Analysis: Analyzing website content');

      const response = await fetch('/api/unified?action=bp-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          extractedText: websiteContent,
          sourceType: 'website',
          sourceUrl: websiteUrl
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Analysis failed');
      }

      const result = await response.json();
      console.log('🟢 BP Analysis: Analysis complete', result.scores);

      setAnalysisScores(result.scores);

    } catch (error: any) {
      console.error('🔴 BP Analysis: Analysis error', error);
      setError(error.message || t('bp_analysis.analysis_failed', 'Analysis failed'));
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetUpload = () => {
    setFile(null);
    setWebsiteUrl('');
    setWebsiteData(null);
    setAnalysisScores(null);
    setError(null);
    setIsUploading(false);
    setIsAnalyzing(false);
    setIsExtractingWebsite(false);
    setUploadedBpId(null);
    setShowWebsiteInput(false);
  };

  // 得分颜色
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-success-600 dark:text-success-400';
    if (score >= 60) return 'text-primary-600 dark:text-primary-400';
    if (score >= 40) return 'text-warning-600 dark:text-warning-400';
    return 'text-error-600 dark:text-error-400';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-success-100 dark:bg-success-900/20';
    if (score >= 60) return 'bg-primary-100 dark:bg-primary-900/20';
    if (score >= 40) return 'bg-warning-100 dark:bg-warning-900/20';
    return 'bg-error-100 dark:bg-error-900/20';
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* 上传区域 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="text-primary-500" size={24} />
            {t('bp_analysis.title', 'Upload Business Plan')}
          </CardTitle>
          <CardDescription>
            {t('bp_analysis.subtitle', 'Upload your business plan for AI-powered analysis')}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {!file && !websiteData ? (
            <div className="space-y-6">
              {/* 文件上传区域 */}
              <div
                className={cn(
                  'border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-200',
                  dragActive 
                    ? 'border-primary-400 bg-primary-50 dark:bg-primary-900/20' 
                    : 'border-border hover:border-primary-300 hover:bg-primary-50/50 dark:hover:bg-primary-900/10'
                )}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <div className="space-y-4">
                  <div className="mx-auto w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
                    <FileText className="text-primary-500" size={32} />
                  </div>
                  
                  <div>
                    <p className="text-lg font-medium text-foreground mb-2">
                      {t('bp_analysis.drag_drop', 'Drag & drop your file here')}
                    </p>
                    <p className="text-sm text-muted-foreground mb-4">
                      {t('bp_analysis.supported_formats', 'PDF or DOCX format')}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {t('bp_analysis.max_size', 'Maximum file size: 50MB')}
                    </p>
                  </div>
                  
                  <div>
                    <Button asChild>
                      <label className="cursor-pointer">
                        <input
                          type="file"
                          accept=".pdf,.docx"
                          onChange={(e) => handleFileSelect(e.target.files?.[0])}
                          className="hidden"
                        />
                        {t('bp_analysis.upload_bp', 'Upload BP')}
                      </label>
                    </Button>
                  </div>
                </div>
              </div>

              {/* 分隔线 */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    {t('bp_analysis.or', 'Or')}
                  </span>
                </div>
              </div>

              {/* 网站链接输入 */}
              <div className="space-y-3">
                {!showWebsiteInput ? (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setShowWebsiteInput(true)}
                  >
                    <Globe size={16} className="mr-2" />
                    {t('bp_analysis.add_website', 'Add Website Link')}
                  </Button>
                ) : (
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <Input
                        type="url"
                        placeholder={t('bp_analysis.website_placeholder', 'https://example.com')}
                        value={websiteUrl}
                        onChange={(e) => setWebsiteUrl(e.target.value)}
                        disabled={isExtractingWebsite}
                      />
                      <Button
                        onClick={extractWebsite}
                        disabled={isExtractingWebsite || !websiteUrl.trim()}
                        className="min-w-24"
                      >
                        {isExtractingWebsite ? (
                          <UnifiedLoader variant="inline" show={true} size="sm" loaderStyle="spinner" />
                        ) : (
                          <>{t('bp_analysis.analyze', 'Analyze')}</>
                        )}
                      </Button>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setShowWebsiteInput(false);
                        setWebsiteUrl('');
                      }}
                    >
                      {t('common.cancel', 'Cancel')}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* 文件或网站信息 */}
              <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg border border-border">
                {file ? (
                  <>
                    <FileText className="text-primary-500" size={24} />
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{file.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatFileSize(file.size)} • {t('bp_analysis.uploaded', 'Uploaded')}
                      </p>
                    </div>
                  </>
                ) : websiteData ? (
                  <>
                    <Globe className="text-primary-500" size={24} />
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{websiteData.data.title || websiteUrl}</p>
                      <p className="text-sm text-muted-foreground">
                        {websiteUrl} • {t('bp_analysis.website_extracted', 'Website content extracted')}
                      </p>
                    </div>
                  </>
                ) : null}
                {!isUploading && !isAnalyzing && !isExtractingWebsite && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={resetUpload}
                  >
                    <X size={16} />
                  </Button>
                )}
              </div>

              {/* 上传中/提取中 */}
              {(isUploading || isExtractingWebsite) && (
                <div className="flex justify-center py-4">
                  <UnifiedLoader 
                    variant="inline" 
                    show={true} 
                    size="md"
                    loaderStyle="spinner"
                    text={isUploading ? t('bp_analysis.uploading', 'Uploading...') : t('bp_analysis.extracting_website', 'Extracting website content...')}
                  />
                </div>
              )}
              
              {/* 分析中 */}
              {isAnalyzing && (
                <div className="flex justify-center py-4">
                  <UnifiedLoader 
                    variant="inline" 
                    show={true} 
                    size="md"
                    loaderStyle="spinner"
                    text={t('bp_analysis.analyzing', 'Analyzing...')}
                  />
                </div>
              )}
              
              {/* 分析按钮（仅文件上传显示） */}
              {!isUploading && !isExtractingWebsite && !isAnalyzing && uploadedBpId && !analysisScores && file && (
                <div className="flex justify-center">
                  <Button
                    onClick={analyzeBP}
                    className="min-w-48 bg-primary-500 hover:bg-primary-600"
                    size="lg"
                  >
                    {t('bp_analysis.analysis_report', 'Analyze BP')}
                  </Button>
                </div>
              )}
            </div>
          )}
          
          {error && (
            <div className="mt-4 p-3 bg-error-50 dark:bg-error-900/20 border border-error-200 dark:border-error-800 rounded-lg flex items-center gap-2">
              <AlertCircle className="text-error-500" size={16} />
              <p className="text-sm text-error-600 dark:text-error-400">{error}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 分析结果 - 4个维度卡片 */}
      {analysisScores && (
        <div className="grid gap-6 md:grid-cols-2">
          {/* 1. AI Insight */}
          <Card className="border-2 border-primary-200 dark:border-primary-800">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Lightbulb className="text-primary-500" size={24} />
                  <CardTitle>AI Insight</CardTitle>
                </div>
                <div className={cn(
                  'w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold',
                  getScoreBgColor(analysisScores.aiInsight.overall)
                )}>
                  <span className={getScoreColor(analysisScores.aiInsight.overall)}>
                    {analysisScores.aiInsight.overall}
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-3 gap-2 text-center text-sm">
                <div>
                  <p className="text-muted-foreground mb-1">Structure</p>
                  <p className="font-semibold">{analysisScores.aiInsight.planStructure}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Content</p>
                  <p className="font-semibold">{analysisScores.aiInsight.content}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Viability</p>
                  <p className="font-semibold">{analysisScores.aiInsight.viability}</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                {analysisScores.detailedAnalysis.aiInsight}
              </p>
            </CardContent>
          </Card>

          {/* 2. Market Insights */}
          <Card className="border-2 border-success-200 dark:border-success-800">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="text-success-500" size={24} />
                  <CardTitle>Market Insights</CardTitle>
                </div>
                <div className={cn(
                  'w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold',
                  getScoreBgColor(analysisScores.marketInsights.overall)
                )}>
                  <span className={getScoreColor(analysisScores.marketInsights.overall)}>
                    {analysisScores.marketInsights.overall}
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-2 text-center text-sm">
                <div>
                  <p className="text-muted-foreground mb-1">Market Cap</p>
                  <p className="font-semibold">{analysisScores.marketInsights.marketCap}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Profit</p>
                  <p className="font-semibold">{analysisScores.marketInsights.profitPotential}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Popularity</p>
                  <p className="font-semibold">{analysisScores.marketInsights.popularity}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Competition</p>
                  <p className="font-semibold">{analysisScores.marketInsights.competition}</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                {analysisScores.detailedAnalysis.marketInsights}
              </p>
            </CardContent>
          </Card>

          {/* 3. Risk Assessment */}
          <Card className="border-2 border-warning-200 dark:border-warning-800">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Shield className="text-warning-500" size={24} />
                  <CardTitle>Risk Assessment</CardTitle>
                </div>
                <div className={cn(
                  'w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold',
                  getScoreBgColor(analysisScores.riskAssessment.overall)
                )}>
                  <span className={getScoreColor(analysisScores.riskAssessment.overall)}>
                    {analysisScores.riskAssessment.overall}
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-2 text-center text-sm">
                <div>
                  <p className="text-muted-foreground mb-1">Political</p>
                  <p className="font-semibold">{analysisScores.riskAssessment.politicalStability}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Economic</p>
                  <p className="font-semibold">{analysisScores.riskAssessment.economicTrend}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Policy</p>
                  <p className="font-semibold">{analysisScores.riskAssessment.policyVolatility}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">War/Sanctions</p>
                  <p className="font-semibold">{analysisScores.riskAssessment.warSanctions}</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                {analysisScores.detailedAnalysis.riskAssessment}
              </p>
            </CardContent>
          </Card>

          {/* 4. Growth Projections */}
          <Card className="border-2 border-blue-200 dark:border-blue-800">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BarChart3 className="text-blue-500" size={24} />
                  <CardTitle>Growth Projections</CardTitle>
                </div>
                <div className={cn(
                  'w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold',
                  getScoreBgColor(analysisScores.growthProjections.overall)
                )}>
                  <span className={getScoreColor(analysisScores.growthProjections.overall)}>
                    {analysisScores.growthProjections.overall}
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-2 text-center text-sm">
                <div>
                  <p className="text-muted-foreground mb-1">Growth</p>
                  <p className="font-semibold">{analysisScores.growthProjections.marketGrowth}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">5-Year</p>
                  <p className="font-semibold">{analysisScores.growthProjections.fiveYearProjection}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Saturation</p>
                  <p className="font-semibold">{analysisScores.growthProjections.saturationTimeline}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Resources</p>
                  <p className="font-semibold">{analysisScores.growthProjections.resourceLimitations}</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                {analysisScores.detailedAnalysis.growthProjections}
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
