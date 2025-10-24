import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Play, CheckCircle, XCircle, BarChart3, Trash2 } from 'lucide-react';

export default function ReconfigureDataSimplified() {
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [isLoadingToken, setIsLoadingToken] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [clearResult, setClearResult] = useState<any>(null);
  const [dataProgress, setDataProgress] = useState<any>(null);
  const [isCheckingProgress, setIsCheckingProgress] = useState(false);

  // 获取认证token
  const fetchAuthToken = async () => {
    setIsLoadingToken(true);
    try {
      const response = await fetch('/api/unified', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'auth-token' })
      });
      const data = await response.json();
      if (data.success) {
        setAuthToken(data.token);
        setError(null);
      } else {
        setError(data.error || '获取认证token失败');
      }
    } catch (err) {
      setError('网络连接失败，请检查网络连接或稍后重试');
    } finally {
      setIsLoadingToken(false);
    }
  };

  // 清理数据库
  const handleClearDatabase = async () => {
    setIsClearing(true);
    setClearResult(null);
    try {
      const response = await fetch('/api/unified', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'clear-database',
          adminToken: authToken 
        })
      });
      const data = await response.json();
      setClearResult(data);
      if (data.success) {
        setError(null);
      } else {
        setError(data.error || '数据库清理失败');
      }
    } catch (err) {
      setError('网络连接失败，请检查网络连接或稍后重试');
    } finally {
      setIsClearing(false);
    }
  };

  // 生成完整数据
  const handleGenerateFullData = async () => {
    setIsRunning(true);
    setResult(null);
    setError(null);
    try {
      const response = await fetch('/api/unified', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'generate-full-data',
          adminToken: authToken 
        })
      });
      const data = await response.json();
      setResult(data);
      if (data.success) {
        setError(null);
      } else {
        setError(data.error || '数据生成失败');
      }
    } catch (err) {
      setError('网络连接失败，请检查网络连接或稍后重试');
    } finally {
      setIsRunning(false);
    }
  };

  // 检查数据进度
  const checkDataProgress = async () => {
    setIsCheckingProgress(true);
    try {
      const response = await fetch('/api/unified', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'data-progress' })
      });
      const data = await response.json();
      if (data.success) {
        setDataProgress(data.data);
        setError(null);
      } else {
        setError(data.error || '检查数据进度失败');
      }
    } catch (err) {
      setError('网络连接失败，请检查网络连接或稍后重试');
    } finally {
      setIsCheckingProgress(false);
    }
  };

  // 清理重复数据
  const cleanDuplicates = async () => {
    try {
      const response = await fetch('/api/unified', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'clean-duplicates',
          adminToken: authToken 
        })
      });
      const data = await response.json();
      if (data.success) {
        setError(null);
        alert(`清理完成！删除了 ${data.duplicatesRemoved} 条重复记录`);
      } else {
        setError(data.error || '清理重复数据失败');
      }
    } catch (err) {
      setError('网络连接失败，请检查网络连接或稍后重试');
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              AI公司数据管理系统
            </CardTitle>
            <CardDescription>
              简化版数据生成和管理界面 - 只保留必要功能
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            
            {/* 认证状态 */}
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-2">
                {isLoadingToken ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">正在获取认证token...</span>
                  </>
                ) : authToken ? (
                  <>
                    <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                    <span className="text-sm text-green-600 dark:text-green-400">认证token已获取</span>
                  </>
                ) : (
                  <>
                    <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                    <span className="text-sm text-red-600 dark:text-red-400">认证token获取失败</span>
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

            {/* 手动输入ADMIN_TOKEN兜底 */}
            {!authToken && (
              <div className="grid grid-cols-1 gap-2">
                <input
                  type="password"
                  placeholder="在此粘贴ADMIN_TOKEN（仅本地/受信环境使用）"
                  className="border border-input rounded px-3 py-2 text-sm bg-background text-foreground"
                  onChange={(e) => setAuthToken(e.target.value || null)}
                />
                <div className="text-xs text-muted-foreground">
                  如API返回非JSON导致自动获取失败，可临时手动输入。
                </div>
              </div>
            )}

            {/* 数据库清理 */}
            <div className="space-y-3">
              <div className="p-4 border border-red-200 bg-red-50 dark:bg-red-950 dark:border-red-800 rounded-lg">
                <div className="font-medium text-sm text-red-800 dark:text-red-200 mb-2">⚠️ 数据库清理</div>
                <div className="text-xs text-red-600 dark:text-red-300 mb-3">
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

            {/* 主要操作按钮 */}
            <div className="space-y-3">
              <Button 
                onClick={handleGenerateFullData} 
                disabled={isRunning || !authToken || isLoadingToken}
                className="w-full"
                size="lg"
              >
                {isRunning ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    正在生成完整数据...
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-5 w-5" />
                    开始生成200+家AI公司完整数据
                  </>
                )}
              </Button>

              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={checkDataProgress}
                  disabled={isCheckingProgress}
                  variant="outline"
                >
                  {isCheckingProgress ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      检查进度中...
                    </>
                  ) : (
                    <>
                      <BarChart3 className="mr-2 h-4 w-4" />
                      检查数据进度
                    </>
                  )}
                </Button>

                <Button
                  onClick={cleanDuplicates}
                  variant="outline"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  清理重复数据
                </Button>
              </div>
            </div>

            {/* 数据进度显示 */}
            {dataProgress && (
              <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-800">
                <BarChart3 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <AlertDescription className="text-blue-800 dark:text-blue-200">
                  <strong>📊 数据生成进度报告</strong>
                  <div className="mt-3 space-y-3">
                    {/* 总体进度 */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>总体进度</span>
                        <span className="font-medium">
                          {dataProgress.progress.current}/{dataProgress.progress.target} 
                          ({dataProgress.progress.percentage}%)
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${dataProgress.progress.percentage}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        状态: {dataProgress.progress.status === 'completed' ? '✅ 已完成' : '🔄 进行中'}
                      </div>
                    </div>

                    {/* 详细数据统计 */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">公司数据:</span>
                        <span className="ml-2 text-green-600 dark:text-green-400">
                          {dataProgress.data.companies.total} 家
                        </span>
                      </div>
                      <div>
                        <span className="font-medium">项目数据:</span>
                        <span className="ml-2 text-blue-600 dark:text-blue-400">
                          {dataProgress.data.tools} 个
                        </span>
                      </div>
                      <div>
                        <span className="font-medium">融资数据:</span>
                        <span className="ml-2 text-purple-600 dark:text-purple-400">
                          {dataProgress.data.fundings} 条
                        </span>
                      </div>
                      <div>
                        <span className="font-medium">故事数据:</span>
                        <span className="ml-2 text-orange-600 dark:text-orange-400">
                          {dataProgress.data.stories} 篇
                        </span>
                      </div>
                    </div>

                    {/* 最后更新时间 */}
                    {dataProgress.last_updated && (
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        最后更新: {new Date(dataProgress.last_updated).toLocaleString('zh-CN')}
                      </div>
                    )}
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {/* 结果显示 */}
            {(result || clearResult) && (
              <Alert className="border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800">
                <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                <AlertDescription className="text-green-800 dark:text-green-200">
                  <strong>✅ 操作完成</strong>
                  <div className="mt-2 text-sm">
                    {result && (
                      <div>
                        <p>生成结果: {result.message}</p>
                        {result.data && (
                          <div className="mt-2 space-y-1">
                            <p>• 公司: {result.data.companies || 0} 家</p>
                            <p>• 项目: {result.data.projects || 0} 个</p>
                            <p>• 融资: {result.data.fundings || 0} 条</p>
                            <p>• 故事: {result.data.stories || 0} 篇</p>
                          </div>
                        )}
                      </div>
                    )}
                    {clearResult && (
                      <div>
                        <p>清理结果: {clearResult.message}</p>
                        {clearResult.data && (
                          <div className="mt-2 space-y-1">
                            <p>• 公司: {clearResult.data.companies || 0} 条已删除</p>
                            <p>• 项目: {clearResult.data.projects || 0} 条已删除</p>
                            <p>• 融资: {clearResult.data.fundings || 0} 条已删除</p>
                            <p>• 故事: {clearResult.data.stories || 0} 条已删除</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {/* 错误显示 */}
            {error && (
              <Alert className="border-red-200 bg-red-50 dark:bg-red-950 dark:border-red-800">
                <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                <AlertDescription className="text-red-800 dark:text-red-200">
                  <strong>❌ 操作失败</strong>
                  <div className="mt-2 text-sm">{error}</div>
                </AlertDescription>
              </Alert>
            )}

          </CardContent>
        </Card>
      </div>
    </div>
  );
}