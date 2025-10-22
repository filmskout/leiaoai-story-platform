import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Play, CheckCircle, XCircle } from 'lucide-react';

export default function ReconfigureData() {
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [isLoadingToken, setIsLoadingToken] = useState(false);
  const [generationMode, setGenerationMode] = useState<'quick' | 'full'>('quick');
  const [progress, setProgress] = useState<{
    current: number;
    total: number;
    currentStep: string;
    details: string[];
  }>({
    current: 0,
    total: 0,
    currentStep: '',
    details: []
  });
  const [isClearing, setIsClearing] = useState(false);
  const [clearResult, setClearResult] = useState<any>(null);

  // 获取认证token
  const fetchAuthToken = async () => {
    setIsLoadingToken(true);
    try {
      const response = await fetch('/api/unified?action=auth-token');
      const data = await response.json();
      
      if (data.success) {
        setAuthToken(data.token);
        setError(null);
      } else {
        setError(data.error || '获取认证token失败');
      }
    } catch (err: any) {
      setError(`获取认证token失败: ${err.message}`);
    } finally {
      setIsLoadingToken(false);
    }
  };

  // 组件加载时获取token
  React.useEffect(() => {
    fetchAuthToken();
  }, []);

  const handleReconfigure = async () => {
    if (!authToken) {
      setError('认证token未获取，请刷新页面重试');
      return;
    }

    setIsRunning(true);
    setResult(null);
    setError(null);
    setProgress({
      current: 0,
      total: generationMode === 'full' ? 200 : 40,
      currentStep: '初始化中...',
      details: []
    });

    try {
      const action = generationMode === 'full' ? 'generate-full-data' : 'reconfigure';
      
      // 模拟进度更新
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev.current < prev.total) {
            const newCurrent = prev.current + Math.floor(Math.random() * 3) + 1;
            const newCurrentStep = newCurrent < prev.total * 0.3 
              ? `处理海外公司数据... (${newCurrent}/${prev.total})`
              : newCurrent < prev.total * 0.7
              ? `处理国内公司数据... (${newCurrent}/${prev.total})`
              : `生成新闻故事和关联数据... (${newCurrent}/${prev.total})`;
            
            return {
              ...prev,
              current: Math.min(newCurrent, prev.total),
              currentStep: newCurrentStep,
              details: [...prev.details.slice(-4), `${new Date().toLocaleTimeString()}: ${newCurrentStep}`]
            };
          }
          return prev;
        });
      }, 2000);

      const response = await fetch(`/api/unified?action=${action}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: authToken // 使用从API获取的token
        })
      });

      clearInterval(progressInterval);

      const data = await response.json();

      if (data.success) {
        setResult(data);
        setProgress(prev => ({
          ...prev,
          current: prev.total,
          currentStep: '完成！',
          details: [...prev.details, `${new Date().toLocaleTimeString()}: 数据生成完成`]
        }));
      } else {
        setError(data.error || '数据生成失败');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsRunning(false);
    }
  };

  const handleClearDatabase = async () => {
    if (!authToken) {
      setError('认证token未获取，请刷新页面重试');
      return;
    }

    setIsClearing(true);
    setClearResult(null);
    setError(null);

    try {
      const response = await fetch('/api/unified?action=clear-database', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: authToken
        })
      });

      const data = await response.json();

      if (data.success) {
        setClearResult(data);
      } else {
        setError(data.error || '数据库清理失败');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Play className="h-5 w-5" />
            AI公司数据重新配置
          </CardTitle>
          <CardDescription>
            运行全面的AI公司数据清理和重新配置系统
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertDescription>
              <strong>注意：</strong>此操作将清理现有数据并重新获取最新的AI公司信息。
              请确保在Vercel中已正确配置所有环境变量。
            </AlertDescription>
          </Alert>

          {/* 生成模式选择 */}
          <div className="space-y-3">
            <label className="text-sm font-medium">选择生成模式：</label>
            <div className="grid grid-cols-2 gap-3">
              <div 
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  generationMode === 'quick' 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setGenerationMode('quick')}
              >
                <div className="font-medium text-sm">快速模式</div>
                <div className="text-xs text-gray-600 mt-1">
                  处理40家公司（20海外+20国内）
                  <br />包含：公司信息、产品、融资、新闻故事
                  <br />预计时间：5-10分钟
                </div>
              </div>
              <div 
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  generationMode === 'full' 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setGenerationMode('full')}
              >
                <div className="font-medium text-sm">完整模式</div>
                <div className="text-xs text-gray-600 mt-1">
                  处理200+家公司（100+海外+100+国内）
                  <br />包含：完整公司信息、产品、详细融资、新闻故事、原文链接
                  <br />预计时间：2-3小时
                </div>
              </div>
            </div>
          </div>

          {/* 认证状态 */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              {isLoadingToken ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm">正在获取认证token...</span>
                </>
              ) : authToken ? (
                <>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-600">认证token已获取</span>
                </>
              ) : (
                <>
                  <XCircle className="h-4 w-4 text-red-600" />
                  <span className="text-sm text-red-600">认证token获取失败</span>
                </>
              )}
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={fetchAuthToken}
              disabled={isLoadingToken}
            >
              重新获取
            </Button>
          </div>

          {/* 数据库清理 */}
          <div className="space-y-3">
            <div className="p-4 border border-red-200 bg-red-50 rounded-lg">
              <div className="font-medium text-sm text-red-800 mb-2">⚠️ 数据库清理</div>
              <div className="text-xs text-red-600 mb-3">
                清理所有现有数据，为200+家公司的新数据做准备
                <br />此操作不可逆，请谨慎操作！
              </div>
              <Button 
                onClick={handleClearDatabase} 
                disabled={isClearing || !authToken || isLoadingToken}
                variant="destructive"
                size="sm"
                className="w-full"
              >
                {isClearing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    正在清理数据库...
                  </>
                ) : (
                  <>
                    <XCircle className="mr-2 h-4 w-4" />
                    清理所有数据
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* 进度显示 */}
          {isRunning && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span>{progress.currentStep}</span>
                <span>{progress.current}/{progress.total}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(progress.current / progress.total) * 100}%` }}
                ></div>
              </div>
              <div className="text-xs text-gray-600 space-y-1 max-h-20 overflow-y-auto">
                {progress.details.map((detail, index) => (
                  <div key={index}>{detail}</div>
                ))}
              </div>
            </div>
          )}

          <Button 
            onClick={handleReconfigure} 
            disabled={isRunning || !authToken || isLoadingToken}
            className="w-full"
          >
            {isRunning ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {generationMode === 'full' ? '正在生成完整数据...' : '正在重新配置...'}
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4" />
                {generationMode === 'full' ? '开始生成完整数据' : '开始重新配置'}
              </>
            )}
          </Button>

          {clearResult && (
            <Alert className="border-orange-200 bg-orange-50">
              <CheckCircle className="h-4 w-4 text-orange-600" />
              <AlertDescription className="text-orange-800">
                <strong>数据库清理完成！</strong>
                <div className="mt-2 space-y-2">
                  <div className="text-sm">
                    ✅ 成功清理: {clearResult.results?.clearedCount} 个表
                  </div>
                  <div className="text-sm">
                    ❌ 清理失败: {clearResult.results?.errorCount} 个表
                  </div>
                  <div className="text-sm">
                    📊 总计: {clearResult.results?.totalTables} 个表
                  </div>
                  {clearResult.results?.details && (
                    <div className="text-xs bg-white p-2 rounded border max-h-32 overflow-y-auto">
                      {clearResult.results.details.map((detail: any, index: number) => (
                        <div key={index} className={detail.success ? 'text-green-600' : 'text-red-600'}>
                          {detail.success ? '✅' : '❌'} {detail.table}: {detail.success ? detail.message : detail.error}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </AlertDescription>
            </Alert>
          )}

          {result && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                <strong>数据生成成功！</strong>
                <div className="mt-2 space-y-2">
                  {result.result?.steps?.map((step: any, index: number) => (
                    <div key={index} className="text-sm">
                      <span className="font-medium">✓ {step.step}:</span> {step.message}
                    </div>
                  ))}
                  {result.result?.summary && (
                    <div className="text-sm font-medium mt-2 p-2 bg-white rounded border">
                      {result.result.summary}
                    </div>
                  )}
                </div>
              </AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert className="border-red-200 bg-red-50">
              <XCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                <strong>重新配置失败：</strong> {error}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
