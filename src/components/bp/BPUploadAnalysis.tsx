import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Upload, 
  FileText, 
  AlertCircle, 
  CheckCircle, 
  BarChart3,
  TrendingUp,
  Shield,
  Lightbulb,
  X
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
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisScores, setAnalysisScores] = useState<AnalysisScores | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploadedBpId, setUploadedBpId] = useState<string | null>(null);

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
      console.log('🔵 BP Upload: Starting upload to Storage');

      // 1. 上传到Supabase Storage
      const fileName = `${user.id}/${Date.now()}_${fileToUpload.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('bp-documents')
        .upload(fileName, fileToUpload, {
          contentType: fileToUpload.type,
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('🔴 BP Upload: Storage error', uploadError);
        let errorMsg = t('errors.upload_failed', 'Upload failed. Please try again.');
        if (uploadError.message?.includes('not found')) {
          errorMsg = 'Storage bucket not found. Please contact support.';
        } else if (uploadError.message?.includes('policy')) {
          errorMsg = 'Permission denied. Please check your account settings.';
        }
        setError(errorMsg);
        return;
      }

      console.log('🟢 BP Upload: File uploaded to Storage', { path: uploadData.path });

      // 2. 获取文件URL
      const { data: urlData } = supabase.storage
        .from('bp-documents')
        .getPublicUrl(fileName);

      console.log('🔵 BP Upload: Public URL generated', { url: urlData.publicUrl });

      // 3. 保存记录到数据库
      const { data: dbData, error: dbError } = await supabase
        .from('bp_submissions')
        .insert({
          user_id: user.id,
          file_name: fileToUpload.name,
          file_type: fileToUpload.type,
          file_url: urlData.publicUrl,
          file_size: fileToUpload.size,
          analysis_status: 'pending',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (dbError) {
        console.error('🔴 BP Upload: Database error', dbError);
        setError(t('errors.upload_failed', 'Upload failed. Please try again.'));
        return;
      }

      console.log('🟢 BP Upload: Success!', { bpId: dbData.id });
      setUploadedBpId(dbData.id);

    } catch (err: any) {
      console.error('🔴 BP Upload: Error', err);
      setError(t('errors.upload_failed', 'Upload failed. Please try again.'));
    } finally {
      setIsUploading(false);
    }
  };

  // OCR提取文本（简化版 - 直接调用OpenAI Vision API）
  const extractText = async (fileUrl: string, fileType: string): Promise<string> => {
    console.log('🔵 BP OCR: Extracting text', { fileUrl, fileType });

    try {
      // 对于PDF，使用OCR API
      if (fileType === 'application/pdf') {
        const response = await fetch('/api/ocr-extract', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageUrl: fileUrl })
        });

        if (!response.ok) {
          throw new Error('OCR extraction failed');
        }

        const data = await response.json();
        console.log('🟢 BP OCR: Text extracted', { length: data.extractedText?.length });
        return data.extractedText || '';
      } else {
        // 对于DOCX，暂时返回空字符串（需要额外的库支持）
        console.log('⚠️ BP OCR: DOCX extraction not yet implemented');
        return 'DOCX file uploaded. Text extraction for DOCX files will be implemented soon.';
      }
    } catch (err: any) {
      console.error('🔴 BP OCR: Error', err);
      throw new Error('Text extraction failed');
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

      // 2. 获取文件URL
      const { data: bpData } = await supabase
        .from('bp_submissions')
        .select('file_url, file_type')
        .eq('id', uploadedBpId)
        .single();

      if (!bpData) {
        throw new Error('BP submission not found');
      }

      // 3. OCR提取文本
      console.log('🔵 BP Analysis: Extracting text...');
      const extractedText = await extractText(bpData.file_url, bpData.file_type);

      // 4. 更新extracted_text到数据库
      await supabase
        .from('bp_submissions')
        .update({ extracted_text: extractedText })
        .eq('id', uploadedBpId);

      // 5. 调用分析API
      console.log('🔵 BP Analysis: Calling analysis API...');
      const response = await fetch('/api/bp-analysis', {
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
      console.error('🔴 BP Analysis: Error', err);
      setError(err.message || t('errors.analysis_failed', 'Analysis failed. Please try again.'));

      // 更新状态为failed
      if (uploadedBpId) {
        await supabase
          .from('bp_submissions')
          .update({ analysis_status: 'failed', updated_at: new Date().toISOString() })
          .eq('id', uploadedBpId);
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  // 重置
  const resetUpload = () => {
    setFile(null);
    setAnalysisScores(null);
    setError(null);
    setIsUploading(false);
    setIsAnalyzing(false);
    setUploadedBpId(null);
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
          {!file ? (
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
          ) : (
            <div className="space-y-4">
              {/* 文件信息 */}
              <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg border border-border">
                <FileText className="text-primary-500" size={24} />
                <div className="flex-1">
                  <p className="font-medium text-foreground">{file.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatFileSize(file.size)} • {t('bp_analysis.uploaded', 'Uploaded')}
                  </p>
                </div>
                {!isUploading && !isAnalyzing && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={resetUpload}
                  >
                    <X size={16} />
                  </Button>
                )}
              </div>

              {/* 上传中 */}
              {isUploading && (
                <div className="flex justify-center py-4">
                  <UnifiedLoader 
                    variant="inline" 
                    show={true} 
                    size="md"
                    loaderStyle="spinner"
                    text={t('bp_analysis.uploading', 'Uploading...')}
                  />
                </div>
              )}
              
              {/* 分析按钮 */}
              {!isUploading && uploadedBpId && !analysisScores && (
                <div className="flex justify-center">
                  <Button
                    onClick={analyzeBP}
                    disabled={isAnalyzing}
                    className="min-w-48 bg-primary-500 hover:bg-primary-600"
                    size="lg"
                  >
                    {isAnalyzing ? (
                      <>
                        <div className="mr-2 w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        {t('bp_analysis.analyzing', 'Analyzing...')}
                      </>
                    ) : (
                      t('bp_analysis.analysis_report', 'Analyze BP')
                    )}
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
