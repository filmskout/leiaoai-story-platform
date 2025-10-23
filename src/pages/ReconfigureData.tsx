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
  const [agentMode, setAgentMode] = useState(false);
  const [currentTaskId, setCurrentTaskId] = useState<string | null>(null);
  const [taskStatus, setTaskStatus] = useState<any>(null);
  const [taskLogs, setTaskLogs] = useState<any[]>([]);
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);

  // 获取认证token
  const fetchAuthToken = async () => {
    setIsLoadingToken(true);
    try {
      const response = await fetch('/api/unified?action=auth-token');
      
      // 检查响应状态和内容类型
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error(`服务器返回了非JSON响应 (Content-Type: ${contentType})`);
      }

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

  // Agent模式 - 启动后台任务
  const handleStartAgentTask = async () => {
    if (!authToken) {
      setError('认证token未获取，请刷新页面重试');
      return;
    }

    setIsRunning(true);
    setResult(null);
    setError(null);
    setTaskStatus(null);
    setTaskLogs([]);

    try {
      const taskType = generationMode === 'full' ? 'generate-full-data' : 'reconfigure';
      
      const response = await fetch('/api/unified?action=start-agent-task', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: authToken,
          taskType: taskType
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setCurrentTaskId(data.taskId);
        setResult({
          success: true,
          message: data.message,
          taskId: data.taskId,
          note: data.note
        });
        
        // 开始轮询任务状态
        startStatusPolling(data.taskId);
      } else {
        setError(data.error || '启动Agent任务失败');
      }
    } catch (err: any) {
      setError(`启动Agent任务失败: ${err.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  // 开始轮询任务状态
  const startStatusPolling = (taskId: string) => {
    const pollInterval = setInterval(async () => {
      try {
        await checkTaskStatus(taskId);
      } catch (error) {
        console.error('轮询任务状态失败:', error);
      }
    }, 3000); // 每3秒检查一次

    // 存储interval ID以便清理
    (window as any).statusPollingInterval = pollInterval;
  };

  // 检查任务状态
  const checkTaskStatus = async (taskId: string) => {
    setIsCheckingStatus(true);
    
    try {
      const response = await fetch(`/api/unified?action=check-task-status&taskId=${taskId}`);
      const data = await response.json();
      
      if (data.success) {
        setTaskStatus(data.task);
        setTaskLogs(data.logs || []);
        
        // 更新进度
        if (data.task.progress) {
          setProgress({
            current: data.task.progress.current || 0,
            total: data.task.progress.total || 0,
            currentStep: data.task.current_step || '',
            details: data.logs?.map((log: any) => `${log.created_at}: ${log.message}`) || []
          });
        }
        
        // 如果任务完成或失败，停止轮询
        if (data.isCompleted || data.isFailed) {
          clearInterval((window as any).statusPollingInterval);
          setIsRunning(false);
          
          if (data.isCompleted) {
            setResult(prev => ({
              ...prev,
              message: 'Agent任务已完成！',
              completed: true
            }));
          } else if (data.isFailed) {
            setError(`Agent任务失败: ${data.task.error_message || '未知错误'}`);
          }
        }
      } else {
        setError(data.error || '查询任务状态失败');
      }
    } catch (err: any) {
      setError(`查询任务状态失败: ${err.message}`);
    } finally {
      setIsCheckingStatus(false);
    }
  };

  // 手动检查任务状态
  const handleCheckStatus = async () => {
    if (!currentTaskId) {
      setError('没有正在运行的任务');
      return;
    }
    
    await checkTaskStatus(currentTaskId);
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

      // 检查响应状态和内容类型
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error(`服务器返回了非JSON响应 (Content-Type: ${contentType})`);
      }

      const data = await response.json();

      if (data.success) {
        setClearResult(data);
      } else {
        setError(data.error || '数据库清理失败');
      }
    } catch (err: any) {
      setError(`数据库清理失败: ${err.message}`);
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

          {/* 执行模式选择 */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground">选择执行模式：</label>
            <div className="grid grid-cols-2 gap-3">
              <div
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  !agentMode
                    ? 'border-green-500 bg-green-50 dark:bg-green-950 dark:border-green-400'
                    : 'border-border hover:border-border/80'
                }`}
                onClick={() => setAgentMode(false)}
              >
                <div className="font-medium text-sm text-foreground">实时模式</div>
                <div className="text-xs text-muted-foreground mt-1">
                  需要保持浏览器打开
                  <br />实时显示进度和日志
                  <br />适合：快速测试和小规模数据
                </div>
              </div>
              <div
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  agentMode
                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-950 dark:border-purple-400'
                    : 'border-border hover:border-border/80'
                }`}
                onClick={() => setAgentMode(true)}
              >
                <div className="font-medium text-sm text-foreground">Agent模式</div>
                <div className="text-xs text-muted-foreground mt-1">
                  后台执行，可关闭浏览器
                  <br />断网续传，任务状态查询
                  <br />适合：大规模数据生成
                </div>
              </div>
            </div>
          </div>

          {/* 生成模式选择 */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground">选择生成模式：</label>
            <div className="grid grid-cols-2 gap-3">
              <div 
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  generationMode === 'quick' 
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-950 dark:border-blue-400' 
                    : 'border-border hover:border-border/80'
                }`}
                onClick={() => setGenerationMode('quick')}
              >
                <div className="font-medium text-sm text-foreground">快速模式</div>
                <div className="text-xs text-muted-foreground mt-1">
                  处理40家公司（20海外+20国内）
                  <br />包含：公司信息、产品、融资、新闻故事
                  <br />预计时间：5-10分钟
                </div>
              </div>
              <div 
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  generationMode === 'full' 
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-950 dark:border-blue-400' 
                    : 'border-border hover:border-border/80'
                }`}
                onClick={() => setGenerationMode('full')}
              >
                <div className="font-medium text-sm text-foreground">完整模式</div>
                <div className="text-xs text-muted-foreground mt-1">
                  处理200+家公司（100+海外+100+国内）
                  <br />包含：完整公司信息、产品、详细融资、新闻故事、原文链接
                  <br />预计时间：2-3小时
                </div>
              </div>
            </div>
          </div>

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
                <span className="text-sm text-red-600 dark:text-red-400">认证token获取失败，可手动输入</span>
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
              如API返回非JSON导致自动获取失败，可临时手动输入。建议同时检查服务端环境变量是否正确配置。
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

          {/* 进度显示 */}
          {isRunning && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-foreground">{progress.currentStep}</span>
                <span className="text-muted-foreground">{progress.current}/{progress.total}</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(progress.current / progress.total) * 100}%` }}
                ></div>
              </div>
              <div className="text-xs text-muted-foreground space-y-1 max-h-20 overflow-y-auto">
                {progress.details.map((detail, index) => (
                  <div key={index}>{detail}</div>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Button 
              onClick={agentMode ? handleStartAgentTask : handleReconfigure} 
              disabled={isRunning || !authToken || isLoadingToken}
              className="w-full"
            >
              {isRunning ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {agentMode ? '启动Agent任务中...' : (generationMode === 'full' ? '正在生成完整数据...' : '正在重新配置...')}
                </>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4" />
                  {agentMode ? '启动Agent任务' : (generationMode === 'full' ? '开始生成完整数据' : '开始重新配置')}
                </>
              )}
            </Button>
            
            {agentMode && currentTaskId && (
              <Button
                onClick={handleCheckStatus}
                disabled={isCheckingStatus}
                variant="outline"
                className="w-full"
              >
                {isCheckingStatus ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    检查状态中...
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    检查任务状态
                  </>
                )}
              </Button>
            )}
          </div>

          {clearResult && (
            <Alert className="border-orange-200 bg-orange-50 dark:bg-orange-950 dark:border-orange-800">
              <CheckCircle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
              <AlertDescription className="text-orange-800 dark:text-orange-200">
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
                    <div className="text-xs bg-background p-2 rounded border border-border max-h-32 overflow-y-auto">
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
            <Alert className="border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800">
              <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
              <AlertDescription className="text-green-800 dark:text-green-200">
                <div className="space-y-2">
                  <div className="font-medium">{result.message}</div>
                  {result.taskId && (
                    <div className="text-sm">
                      <strong>Task ID:</strong> {result.taskId}
                    </div>
                  )}
                  {result.note && (
                    <div className="text-sm italic">
                      {result.note}
                    </div>
                  )}
                  {result.result?.steps?.map((step: any, index: number) => (
                    <div key={index} className="text-sm">
                      <span className="font-medium">✓ {step.step}:</span> {step.message}
                    </div>
                  ))}
                  {result.result?.summary && (
                    <div className="text-sm font-medium mt-2 p-2 bg-background rounded border border-border">
                      {result.result.summary}
                    </div>
                  )}
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Agent模式任务状态显示 */}
        {agentMode && taskStatus && (
          <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-800">
            <CheckCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <AlertDescription className="text-blue-800 dark:text-blue-200">
                <div className="space-y-2">
                  <div className="font-medium">Agent任务状态</div>
                  <div className="text-sm">
                    <strong>状态:</strong> {taskStatus.status}
                  </div>
                  {taskStatus.progress && (
                    <div className="text-sm">
                      <strong>进度:</strong> {taskStatus.progress.current}/{taskStatus.progress.total} 
                      ({Math.round(taskStatus.progress.percentage || 0)}%)
                    </div>
                  )}
                  {taskStatus.current_step && (
                    <div className="text-sm">
                      <strong>当前步骤:</strong> {taskStatus.current_step}
                    </div>
                  )}
                  {taskStatus.started_at && (
                    <div className="text-sm">
                      <strong>开始时间:</strong> {new Date(taskStatus.started_at).toLocaleString()}
                    </div>
                  )}
                  {taskStatus.completed_at && (
                    <div className="text-sm">
                      <strong>完成时间:</strong> {new Date(taskStatus.completed_at).toLocaleString()}
                    </div>
                  )}
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Agent模式任务日志显示 */}
        {agentMode && taskLogs.length > 0 && (
          <Alert className="border-border bg-muted">
            <AlertDescription>
              <div className="space-y-2">
                <div className="font-medium text-foreground">任务日志</div>
                <div className="max-h-40 overflow-y-auto text-sm">
                  {taskLogs.map((log: any, index: number) => (
                    <div key={index} className={`py-1 ${log.log_level === 'error' ? 'text-red-600 dark:text-red-400' : log.log_level === 'warning' ? 'text-yellow-600 dark:text-yellow-400' : 'text-muted-foreground'}`}>
                      <span className="text-xs text-muted-foreground">
                        {new Date(log.created_at).toLocaleTimeString()}
                      </span>
                      <span className="ml-2">{log.message}</span>
                    </div>
                  ))}
                </div>
              </div>
            </AlertDescription>
          </Alert>
        )}

          {error && (
            <Alert className="border-red-200 bg-red-50 dark:bg-red-950 dark:border-red-800">
              <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
              <AlertDescription className="text-red-800 dark:text-red-200">
                <strong>重新配置失败：</strong> {error}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
