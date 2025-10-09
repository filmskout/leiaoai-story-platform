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
  DollarSign,
  Users,
  Target,
  AlertTriangle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatFileSize } from '@/lib/utils';

interface BPUploadAnalysisProps {
  className?: string;
}

interface AnalysisResult {
  score: number;
  summary: string;
  details: {
    marketAnalysis: string;
    businessModel: string;
    teamAssessment: string;
    financialProjection: string;
    riskAssessment: string;
    investmentValue: string;
  };
  recommendations: string[];
}

export function BPUploadAnalysis({ className }: BPUploadAnalysisProps) {
  const { t } = useTranslation();
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

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
    
    // 验证文件类型
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(selectedFile.type)) {
      setError(t('errors.invalid_format'));
      return;
    }
    
    // 验证文件大小 (50MB)
    if (selectedFile.size > 50 * 1024 * 1024) {
      setError(t('errors.file_too_large'));
      return;
    }
    
    setFile(selectedFile);
    setError(null);
  };

  // 分析文件
  const analyzeFile = async () => {
    if (!file) return;
    
    setIsAnalyzing(true);
    setError(null);
    
    try {
      // 模拟分析过程（在实际应用中调用 bp-upload-analysis Edge Function）
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // 模拟分析结果
      const mockResult: AnalysisResult = {
        score: 85,
        summary: '该商业计划书在市场机会、商业模式和团队能力方面表现出色，但在财务预测和风险管理方面仍有改进空间。',
        details: {
          marketAnalysis: '目标市场规模巨大，增长潜力明显，竞争对手分散，存在明显的市场空白。目标客户群体定位准确，需求痛点明确。',
          businessModel: '商业模式清晰，盈利模式可行，具有一定的可扩展性。产品价值主张突出，差异化优势明显。',
          teamAssessment: '创始人和核心团队经验丰富，背景互补，具备行业深度和执行能力。需要进一步完善技术团队配置。',
          financialProjection: '财务预测相对保守，收入增长预期合理。成本结构需要优化，现金流计划需要更加详细。',
          riskAssessment: '主要风险包括市场竞争加剧、技术更新迭代和政策变化。风险识别较为全面，但缺乏具体的应对措施。',
          investmentValue: '投资价值较高，具有较好的成长性和退出前景。建议在A轮或B轮进入，估值范围合理。'
        },
        recommendations: [
          '完善财务模型，提供更详细的成本分析和现金流预测',
          '加强技术团队建设，引入更多技术专家',
          '制定更具体的风险应对方案和应急预案',
          '进一步验证商业模式，考虑多元化收入来源',
          '完善市场进入策略，制定明确的里程碑计划'
        ]
      };
      
      setAnalysisResult(mockResult);
    } catch (err) {
      setError(t('errors.analysis_failed'));
    } finally {
      setIsAnalyzing(false);
    }
  };

  // 重置状态
  const resetUpload = () => {
    setFile(null);
    setAnalysisResult(null);
    setError(null);
    setIsAnalyzing(false);
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-success-600';
    if (score >= 80) return 'text-primary-600';
    if (score >= 70) return 'text-warning-600';
    return 'text-error-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 90) return 'bg-success-100 dark:bg-success-900/20';
    if (score >= 80) return 'bg-primary-100 dark:bg-primary-900/20';
    if (score >= 70) return 'bg-warning-100 dark:bg-warning-900/20';
    return 'bg-error-100 dark:bg-error-900/20';
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* 上传区域 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="text-primary-500" size={24} />
            {t('bp_analysis.title')}
          </CardTitle>
          <CardDescription>
            {t('bp_analysis.subtitle')}
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
                    {t('bp_analysis.drag_drop')}
                  </p>
                  <p className="text-sm text-foreground-muted mb-4">
                    {t('bp_analysis.supported_formats')}
                  </p>
                  <p className="text-xs text-foreground-muted">
                    {t('bp_analysis.max_size')}
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
                      {t('bp_analysis.upload_bp')}
                    </label>
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-background-secondary rounded-lg">
                <FileText className="text-primary-500" size={20} />
                <div className="flex-1">
                  <p className="font-medium text-foreground">{file.name}</p>
                  <p className="text-sm text-foreground-muted">
                    {formatFileSize(file.size)}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={resetUpload}
                  disabled={isAnalyzing}
                >
                  重新上传
                </Button>
              </div>
              
              {!analysisResult && (
                <div className="flex justify-center">
                  <Button
                    onClick={analyzeFile}
                    disabled={isAnalyzing}
                    className="min-w-32"
                  >
                    {isAnalyzing ? (
                      <>
                        <div className="mr-2 w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        {t('bp_analysis.analyzing')}
                      </>
                    ) : (
                      t('bp_analysis.analysis_report')
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

      {/* 分析结果 */}
      {analysisResult && (
        <div className="space-y-6">
          {/* 综合评分 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="text-primary-500" size={24} />
                {t('bp_analysis.analysis_complete')}
              </CardTitle>
            </CardHeader>
            
            <CardContent>
              <div className="flex items-center gap-6">
                <div className={cn(
                  'w-24 h-24 rounded-full flex items-center justify-center text-2xl font-bold',
                  getScoreBgColor(analysisResult.score)
                )}>
                  <span className={getScoreColor(analysisResult.score)}>
                    {analysisResult.score}
                  </span>
                </div>
                
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {t('bp_analysis.score')}: {analysisResult.score}/100
                  </h3>
                  <p className="text-foreground-secondary">
                    {analysisResult.summary}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 详细分析 */}
          <Card>
            <CardHeader>
              <CardTitle>{t('bp_analysis.analysis_report')}</CardTitle>
            </CardHeader>
            
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="text-primary-500" size={16} />
                    <h4 className="font-semibold text-foreground">{t('bp_analysis.market_analysis')}</h4>
                  </div>
                  <p className="text-sm text-foreground-secondary">
                    {analysisResult.details.marketAnalysis}
                  </p>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Target className="text-primary-500" size={16} />
                    <h4 className="font-semibold text-foreground">{t('bp_analysis.business_model')}</h4>
                  </div>
                  <p className="text-sm text-foreground-secondary">
                    {analysisResult.details.businessModel}
                  </p>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Users className="text-primary-500" size={16} />
                    <h4 className="font-semibold text-foreground">{t('bp_analysis.team_assessment')}</h4>
                  </div>
                  <p className="text-sm text-foreground-secondary">
                    {analysisResult.details.teamAssessment}
                  </p>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <DollarSign className="text-primary-500" size={16} />
                    <h4 className="font-semibold text-foreground">{t('bp_analysis.financial_projection')}</h4>
                  </div>
                  <p className="text-sm text-foreground-secondary">
                    {analysisResult.details.financialProjection}
                  </p>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="text-warning-500" size={16} />
                    <h4 className="font-semibold text-foreground">{t('bp_analysis.risk_assessment')}</h4>
                  </div>
                  <p className="text-sm text-foreground-secondary">
                    {analysisResult.details.riskAssessment}
                  </p>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="text-success-500" size={16} />
                    <h4 className="font-semibold text-foreground">{t('bp_analysis.investment_value')}</h4>
                  </div>
                  <p className="text-sm text-foreground-secondary">
                    {analysisResult.details.investmentValue}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 改进建议 */}
          <Card>
            <CardHeader>
              <CardTitle>{t('bp_analysis.recommendations')}</CardTitle>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-3">
                {analysisResult.recommendations.map((recommendation, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-medium text-primary-600 dark:text-primary-400">
                        {index + 1}
                      </span>
                    </div>
                    <p className="text-sm text-foreground-secondary">
                      {recommendation}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}