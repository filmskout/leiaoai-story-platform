import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  Square, 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Database,
  Zap,
  TrendingUp,
  FileText,
  Globe,
  Users
} from 'lucide-react';

export default function ReconfigureData() {
  // 基础状态
  const [isRunning, setIsRunning] = useState(false);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [isLoadingToken, setIsLoadingToken] = useState(false);
  
  // 生成模式
  const [generationMode, setGenerationMode] = useState<'quick' | 'full'>('full');
  
  // 进度状态
  const [progress, setProgress] = useState({
    current: 0,
    total: 0,
    percentage: 0,
    currentStep: '',
    details: [] as string[]
  });
  
  // 结果状态
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  
  // 数据统计
  const [dataStats, setDataStats] = useState({
    companies: 0,
    projects: 0,
    fundings: 0,
    stories: 0,
    lastUpdated: null as Date | null
  });

  // 获取认证token
  const fetchAuthToken = async () => {
    setIsLoadingToken(true);
    try {
      const response = await fetch('/api/unified?action=auth-token');
      const data = await response.json();
      if (data.success) {
        setAuthToken(data.token);
      } else {
        setError('获取认证token失败');
      }
    } catch (err: any) {
      setError(`获取认证token失败: ${err.message}`);
    } finally {
      setIsLoadingToken(false);
    }
  };

  useEffect(() => {
    fetchAuthToken();
  }, []);

  // 检查数据进度
  const checkDataProgress = async () => {
    try {
      const response = await fetch('/api/unified?action=data-progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: authToken })
      });
      const data = await response.json();
      if (data.success) {
        setDataStats({
          companies: data.companies || 0,
          projects: data.projects || 0,
          fundings: data.fundings || 0,
          stories: data.stories || 0,
          lastUpdated: new Date()
        });
      }
    } catch (err) {
      console.error('检查数据进度失败:', err);
    }
  };

  useEffect(() => {
    if (authToken) {
      checkDataProgress();
      const interval = setInterval(checkDataProgress, 10000); // 每10秒检查一次
      return () => clearInterval(interval);
    }
  }, [authToken]);

  // 清理数据库
  const handleClearDatabase = async () => {
    if (!authToken) {
      setError('请先获取认证token');
      return;
    }

    setIsRunning(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/unified?action=clear-database', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: authToken })
      });

      const data = await response.json();
      if (data.success) {
        setResult({
          success: true,
          message: '数据库清理成功',
          details: data.details
        });
        // 清理后重新检查数据
        setTimeout(checkDataProgress, 1000);
      } else {
        setError(data.error || '数据库清理失败');
      }
    } catch (err: any) {
      setError(`数据库清理失败: ${err.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  // 开始生成数据
  const handleGenerateData = async () => {
    if (!authToken) {
      setError('请先获取认证token');
      return;
    }

    setIsRunning(true);
    setError(null);
    setResult(null);
    setProgress({ current: 0, total: 0, percentage: 0, currentStep: '', details: [] });

    try {
      const response = await fetch('/api/unified?action=generate-full-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          token: authToken, 
          generationMode: generationMode 
        })
      });

      const data = await response.json();
      if (data.success) {
        setResult({
          success: true,
          message: data.message,
          details: data.details
        });
        
        // 开始监控进度
        startProgressMonitoring();
      } else {
        setError(data.error || '数据生成失败');
      }
    } catch (err: any) {
      setError(`数据生成失败: ${err.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  // 监控进度
  const startProgressMonitoring = () => {
    const interval = setInterval(async () => {
      try {
        const response = await fetch('/api/unified?action=data-progress', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: authToken })
        });
        const data = await response.json();
        
        if (data.success) {
          setProgress({
            current: data.current || 0,
            total: data.total || 0,
            percentage: data.percentage || 0,
            currentStep: data.currentStep || '',
            details: data.details || []
          });
          
          // 更新数据统计
          setDataStats({
            companies: data.companies || 0,
            projects: data.projects || 0,
            fundings: data.fundings || 0,
            stories: data.stories || 0,
            lastUpdated: new Date()
          });
          
          // 如果完成，停止监控
          if (data.percentage >= 100) {
            clearInterval(interval);
            setResult(prev => ({
              ...prev,
              message: '数据生成完成！',
              completed: true
            }));
          }
        }
      } catch (err) {
        console.error('监控进度失败:', err);
      }
    }, 5000); // 每5秒检查一次

    // 30分钟后停止监控
    setTimeout(() => clearInterval(interval), 30 * 60 * 1000);
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="space-y-6">
        {/* 页面标题 */}
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">AI公司数据生成系统</h1>
          <p className="text-muted-foreground">
            一键生成200+家AI公司的完整数据，包括公司信息、项目、融资和新闻故事
          </p>
        </div>

        {/* 认证状态 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              系统状态
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingToken ? (
              <div className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>正在获取认证token...</span>
              </div>
            ) : authToken ? (
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="h-4 w-4" />
                <span>认证成功</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-red-600">
                <XCircle className="h-4 w-4" />
                <span>认证失败</span>
                <Button size="sm" onClick={fetchAuthToken}>
                  <RefreshCw className="h-4 w-4 mr-1" />
                  重试
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 数据统计 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              当前数据统计
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{dataStats.companies}</div>
                <div className="text-sm text-muted-foreground">公司</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{dataStats.projects}</div>
                <div className="text-sm text-muted-foreground">项目</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{dataStats.fundings}</div>
                <div className="text-sm text-muted-foreground">融资</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{dataStats.stories}</div>
                <div className="text-sm text-muted-foreground">故事</div>
              </div>
            </div>
            {dataStats.lastUpdated && (
              <div className="text-xs text-muted-foreground mt-2 text-center">
                最后更新: {dataStats.lastUpdated.toLocaleTimeString()}
              </div>
            )}
          </CardContent>
        </Card>

        {/* 生成模式选择 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              生成模式
            </CardTitle>
            <CardDescription>
              选择数据生成的规模和详细程度
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div 
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  generationMode === 'quick' 
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-950' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setGenerationMode('quick')}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-4 w-4" />
                  <span className="font-medium">快速模式</span>
                  <Badge variant="secondary">测试</Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  <div>• 40家公司 (20海外 + 20国内)</div>
                  <div>• 基础信息 + 项目 + 融资</div>
                  <div>• 预计时间: 5-10分钟</div>
                </div>
              </div>
              
              <div 
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  generationMode === 'full' 
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-950' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setGenerationMode('full')}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Globe className="h-4 w-4" />
                  <span className="font-medium">完整模式</span>
                  <Badge variant="default">推荐</Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  <div>• 200+家公司 (120海外 + 80国内)</div>
                  <div>• 完整信息 + 新闻故事 + Logo</div>
                  <div>• 预计时间: 2-3小时</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 操作按钮 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Play className="h-5 w-5" />
              数据操作
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={handleClearDatabase}
                disabled={isRunning || !authToken}
                variant="destructive"
                className="flex-1"
              >
                <Database className="h-4 w-4 mr-2" />
                清理数据库
              </Button>
              
              <Button 
                onClick={handleGenerateData}
                disabled={isRunning || !authToken}
                className="flex-1"
              >
                {isRunning ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    生成中...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    开始生成
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 进度显示 */}
        {isRunning && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                生成进度
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span>{progress.currentStep}</span>
                  <span>{progress.current}/{progress.total}</span>
                </div>
                <Progress value={progress.percentage} className="w-full" />
                <div className="text-center text-sm text-muted-foreground">
                  {progress.percentage.toFixed(1)}% 完成
                </div>
                
                {progress.details.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-sm font-medium">详细日志:</div>
                    <div className="max-h-32 overflow-y-auto space-y-1">
                      {progress.details.map((detail, index) => (
                        <div key={index} className="text-xs text-muted-foreground">
                          {detail}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* 结果显示 */}
        {result && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {result.success ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-600" />
                )}
                操作结果
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Alert className={result.success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
                <AlertDescription>
                  {result.message}
                </AlertDescription>
              </Alert>
              
              {result.details && (
                <div className="mt-4 space-y-2">
                  <div className="text-sm font-medium">详细信息:</div>
                  <div className="text-sm text-muted-foreground">
                    {Array.isArray(result.details) ? (
                      <ul className="list-disc list-inside space-y-1">
                        {result.details.map((detail, index) => (
                          <li key={index}>{detail}</li>
                        ))}
                      </ul>
                    ) : (
                      <div>{result.details}</div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* 错误显示 */}
        {error && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600">
                <XCircle className="h-5 w-5" />
                错误信息
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Alert className="border-red-200 bg-red-50">
                <AlertDescription className="text-red-800">
                  {error}
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        )}

        {/* 使用说明 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              使用说明
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-xs font-bold">1</div>
                <div>
                  <div className="font-medium">选择生成模式</div>
                  <div className="text-muted-foreground">快速模式用于测试，完整模式用于生产环境</div>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-xs font-bold">2</div>
                <div>
                  <div className="font-medium">清理数据库</div>
                  <div className="text-muted-foreground">清除现有数据，确保从干净的状态开始</div>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-xs font-bold">3</div>
                <div>
                  <div className="font-medium">开始生成</div>
                  <div className="text-muted-foreground">系统将自动生成公司数据，可以关闭浏览器</div>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-xs font-bold">4</div>
                <div>
                  <div className="font-medium">监控进度</div>
                  <div className="text-muted-foreground">实时查看生成进度和数据统计</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
