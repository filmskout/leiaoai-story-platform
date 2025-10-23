import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Play, CheckCircle, XCircle, BarChart3, Trash2 } from 'lucide-react';

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
  const [dataProgress, setDataProgress] = useState<any>(null);
  const [isCheckingProgress, setIsCheckingProgress] = useState(false);
  const [singleCompanyName, setSingleCompanyName] = useState('');
  const [isOverseas, setIsOverseas] = useState(true);
  const [includeLogo, setIncludeLogo] = useState(false);
  const [isGeneratingSingle, setIsGeneratingSingle] = useState(false);
  const [singleResult, setSingleResult] = useState<any>(null);
  const [companyCategories, setCompanyCategories] = useState<any>(null);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [dataCompleteness, setDataCompleteness] = useState<any>(null);
  const [isCheckingCompleteness, setIsCheckingCompleteness] = useState(false);
  const [batchResult, setBatchResult] = useState<any>(null);
  const [isBatchGenerating, setIsBatchGenerating] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [batchSize, setBatchSize] = useState<number>(10);

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

      const response = await fetch('/api/unified?action=generate-full-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: authToken,
          generationMode: generationMode
        })
      });

      clearInterval(progressInterval);

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
    let retryCount = 0;
    const maxRetries = 3;
    
    const pollInterval = setInterval(async () => {
      try {
        await checkTaskStatus(taskId);
        retryCount = 0; // 重置重试计数
      } catch (error) {
        console.error('轮询任务状态失败:', error);
        retryCount++;
        
        if (retryCount >= maxRetries) {
          console.error('轮询失败次数过多，停止轮询');
          clearInterval(pollInterval);
          setError('任务状态查询失败次数过多，请手动检查任务状态');
        }
      }
    }, 3000); // 每3秒检查一次

    // 存储interval ID以便清理
    (window as any).statusPollingInterval = pollInterval;
  };

  // 清理重复公司数据
  const cleanDuplicates = async () => {
    try {
      console.log('🧹 开始清理重复公司数据...');
      
      const response = await fetch('/api/unified?action=clean-duplicates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: authToken }),
        signal: AbortSignal.timeout(30000) // 30秒超时
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        throw new Error(`服务器返回非JSON响应: ${text.substring(0, 100)}...`);
      }

      const result = await response.json();
      console.log('🧹 清理结果:', result);
      
      if (result.success) {
        setResult(result);
        setError(null);
        console.log(`✅ 清理完成: 删除了 ${result.results.cleaned} 条重复记录`);
      } else {
        throw new Error(result.error || '清理失败');
      }
    } catch (error: any) {
      console.error('❌ 清理重复数据失败:', error);
      
      if (error.name === 'AbortError') {
        setError('清理超时，请检查网络连接');
      } else if (error instanceof TypeError) {
        setError('网络连接失败，请检查网络连接或稍后重试');
      } else {
        setError(`清理失败: ${error.message}`);
      }
    }
  };

  // 获取公司分类
  const loadCompanyCategories = async () => {
    setIsLoadingCategories(true);
    try {
      console.log('📊 加载公司分类...');

      const response = await fetch('/api/unified?action=company-categories', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(15000) // 15秒超时
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        throw new Error(`服务器返回非JSON响应: ${text.substring(0, 100)}...`);
      }

      const result = await response.json();
      console.log('📊 公司分类结果:', result);

      if (result.success) {
        setCompanyCategories(result);
        setError(null);
        console.log(`✅ 公司分类加载成功: ${result.summary.totalCompanies} 家公司`);
      } else {
        throw new Error(result.error || '加载公司分类失败');
      }
    } catch (error: any) {
      console.error('❌ 加载公司分类失败:', error);

      if (error.name === 'AbortError') {
        setError('加载超时，请检查网络连接');
      } else if (error instanceof TypeError) {
        setError('网络连接失败，请检查网络连接或稍后重试');
      } else {
        setError(`加载失败: ${error.message}`);
      }
    } finally {
      setIsLoadingCategories(false);
    }
  };

  // 检查数据完整性
  const checkDataCompleteness = async () => {
    setIsCheckingCompleteness(true);
    try {
      console.log('🔍 检查数据完整性...');

      const response = await fetch('/api/unified?action=check-data-completeness', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(20000) // 20秒超时
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        throw new Error(`服务器返回非JSON响应: ${text.substring(0, 100)}...`);
      }

      const result = await response.json();
      console.log('🔍 数据完整性结果:', result);

      if (result.success) {
        setDataCompleteness(result);
        setError(null);
        console.log(`✅ 数据完整性检查完成: ${result.report.summary.totalCompanies} 家公司`);
      } else {
        throw new Error(result.error || '检查数据完整性失败');
      }
    } catch (error: any) {
      console.error('❌ 检查数据完整性失败:', error);

      if (error.name === 'AbortError') {
        setError('检查超时，请检查网络连接');
      } else if (error instanceof TypeError) {
        setError('网络连接失败，请检查网络连接或稍后重试');
      } else {
        setError(`检查失败: ${error.message}`);
      }
    } finally {
      setIsCheckingCompleteness(false);
    }
  };

  // 批量补齐公司数据
  const batchCompleteCompanies = async () => {
    setIsBatchGenerating(true);
    try {
      console.log(`🚀 开始批量补齐公司数据 (分类: ${selectedCategory || '全部'}, 批次大小: ${batchSize})`);

      const response = await fetch('/api/unified?action=batch-complete-companies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: authToken,
          category: selectedCategory || undefined,
          batchSize: batchSize
        }),
        signal: AbortSignal.timeout(300000) // 5分钟超时
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        throw new Error(`服务器返回非JSON响应: ${text.substring(0, 100)}...`);
      }

      const result = await response.json();
      console.log('🚀 批量生成结果:', result);

      if (result.success) {
        setBatchResult(result);
        setError(null);
        console.log(`✅ 批量生成完成: 成功 ${result.generated} 家，失败 ${result.failed} 家`);
      } else {
        throw new Error(result.error || '批量生成失败');
      }
    } catch (error: any) {
      console.error('❌ 批量补齐公司数据失败:', error);

      if (error.name === 'AbortError') {
        setError('批量生成超时，请检查网络连接');
      } else if (error instanceof TypeError) {
        setError('网络连接失败，请检查网络连接或稍后重试');
      } else {
        setError(`批量生成失败: ${error.message}`);
      }
    } finally {
      setIsBatchGenerating(false);
    }
  };

  // 生成单个公司数据
  const generateSingleCompany = async () => {
    if (!singleCompanyName.trim()) {
      setError('请输入公司名称');
      return;
    }

    setIsGeneratingSingle(true);
    try {
      console.log(`🏢 开始生成单个公司数据: ${singleCompanyName}`);
      
      const response = await fetch('/api/unified?action=generate-single-company', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          token: authToken,
          companyName: singleCompanyName.trim(),
          isOverseas: isOverseas,
          includeLogo: includeLogo
        }),
        signal: AbortSignal.timeout(60000) // 60秒超时
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        throw new Error(`服务器返回非JSON响应: ${text.substring(0, 100)}...`);
      }

      const result = await response.json();
      console.log('🏢 单公司生成结果:', result);
      
      if (result.success) {
        setSingleResult(result);
        setError(null);
        console.log(`✅ 公司数据生成完成: ${singleCompanyName}`);
      } else {
        throw new Error(result.error || '生成失败');
      }
    } catch (error: any) {
      console.error('❌ 生成单个公司数据失败:', error);
      
      if (error.name === 'AbortError') {
        setError('生成超时，请检查网络连接');
      } else if (error instanceof TypeError) {
        setError('网络连接失败，请检查网络连接或稍后重试');
      } else {
        setError(`生成失败: ${error.message}`);
      }
    } finally {
      setIsGeneratingSingle(false);
    }
  };

  // 检查数据生成进度
  const checkDataProgress = async () => {
    setIsCheckingProgress(true);
    try {
      console.log('🔍 检查数据生成进度...');
      
      const response = await fetch('/api/unified?action=data-progress', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(10000) // 10秒超时
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        throw new Error(`服务器返回非JSON响应: ${text.substring(0, 100)}...`);
      }

      const result = await response.json();
      console.log('📊 数据进度结果:', result);
      
      if (result.success) {
        setDataProgress(result);
        console.log(`✅ 进度检查成功: ${result.progress.current}/${result.progress.target} (${result.progress.percentage}%)`);
      } else {
        throw new Error(result.error || '进度检查失败');
      }
    } catch (error: any) {
      console.error('❌ 检查数据进度失败:', error);
      
      if (error.name === 'AbortError') {
        throw new Error('进度检查超时，请检查网络连接');
      } else if (error instanceof TypeError) {
        throw new Error('网络连接失败，请检查网络连接或稍后重试');
      } else {
        throw new Error(`进度检查失败: ${error.message}`);
      }
    } finally {
      setIsCheckingProgress(false);
    }
  };

  // 检查任务状态
  const checkTaskStatus = async (taskId: string) => {
    setIsCheckingStatus(true);
    
    try {
      console.log(`🔍 查询任务状态: ${taskId}`);
      
      const response = await fetch(`/api/unified?action=check-task-status&taskId=${taskId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        // 添加超时处理
        signal: AbortSignal.timeout(10000) // 10秒超时
      });
      
      console.log(`📡 响应状态: ${response.status} ${response.statusText}`);
      
      // 检查响应状态和内容类型
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error(`服务器返回了非JSON响应 (Content-Type: ${contentType})`);
      }

      const data = await response.json();
      console.log(`📊 任务状态数据:`, data);
      
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
        console.error('❌ 任务状态查询失败:', data.error);
        setError(data.error || '查询任务状态失败');
      }
    } catch (err: any) {
      console.error('❌ 查询任务状态异常:', err);
      
      // 更详细的错误信息
      if (err.name === 'AbortError') {
        setError('查询任务状态超时，请检查网络连接');
      } else if (err.name === 'TypeError' && err.message.includes('fetch')) {
        setError('网络连接失败，请检查网络连接或稍后重试');
      } else {
        setError(`查询任务状态失败: ${err.message}`);
      }
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

            {/* 数据进度检查按钮 */}
            <Button
              onClick={checkDataProgress}
              disabled={isCheckingProgress}
              variant="outline"
              className="w-full"
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

            {/* 清理重复数据按钮 */}
            <Button
              onClick={cleanDuplicates}
              variant="outline"
              className="w-full"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              清理重复数据
            </Button>
          </div>

          {/* 单公司生成区域 */}
          <Card className="border-purple-200 bg-purple-50 dark:bg-purple-950 dark:border-purple-800">
            <CardHeader>
              <CardTitle className="text-purple-800 dark:text-purple-200">
                🏢 精准单公司生成
              </CardTitle>
              <CardDescription className="text-purple-600 dark:text-purple-400">
                逐个生成公司数据，确保质量和完整性
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-purple-800 dark:text-purple-200">
                  公司名称
                </label>
                <input
                  type="text"
                  value={singleCompanyName}
                  onChange={(e) => setSingleCompanyName(e.target.value)}
                  placeholder="例如: OpenAI, 商汤科技"
                  className="w-full px-3 py-2 border border-purple-300 dark:border-purple-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                />
              </div>
              
              <div className="flex space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    checked={isOverseas}
                    onChange={() => setIsOverseas(true)}
                    className="text-purple-600"
                  />
                  <span className="text-sm text-purple-800 dark:text-purple-200">海外公司</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    checked={!isOverseas}
                    onChange={() => setIsOverseas(false)}
                    className="text-purple-600"
                  />
                  <span className="text-sm text-purple-800 dark:text-purple-200">国内公司</span>
                </label>
              </div>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={includeLogo}
                  onChange={(e) => setIncludeLogo(e.target.checked)}
                  className="text-purple-600"
                />
                <span className="text-sm text-purple-800 dark:text-purple-200">包含Logo搜索</span>
              </label>

              <Button
                onClick={generateSingleCompany}
                disabled={isGeneratingSingle || !singleCompanyName.trim()}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white"
              >
                {isGeneratingSingle ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    生成中...
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-4 w-4" />
                    生成公司数据
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

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
                      <span className="font-medium">工具数据:</span>
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

                  {/* 数据完整性 */}
                  <div className="space-y-1 text-sm">
                    <div className="font-medium">数据完整性:</div>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div>
                        工具覆盖率: {dataProgress.completeness.companies_with_tools}%
                      </div>
                      <div>
                        融资覆盖率: {dataProgress.completeness.companies_with_fundings}%
                      </div>
                      <div>
                        故事覆盖率: {dataProgress.completeness.companies_with_stories}%
                      </div>
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

          {/* 批量补齐公司数据 */}
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="dark:text-white">批量补齐公司数据</CardTitle>
              <CardDescription className="dark:text-gray-300">
                一次性补齐200家AI公司的基础数据
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium dark:text-white mb-2 block">选择分类</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    <option value="">全部分类</option>
                    <option value="techGiants">科技巨头 (50家)</option>
                    <option value="aiUnicorns">AI独角兽 (40家)</option>
                    <option value="aiTools">AI工具公司 (35家)</option>
                    <option value="aiApplications">AI应用公司 (25家)</option>
                    <option value="domesticGiants">国内大厂 (30家)</option>
                    <option value="domesticUnicorns">国内独角兽 (20家)</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium dark:text-white mb-2 block">批次大小</label>
                  <select
                    value={batchSize}
                    onChange={(e) => setBatchSize(Number(e.target.value))}
                    className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    <option value={5}>5家公司</option>
                    <option value={10}>10家公司</option>
                    <option value={20}>20家公司</option>
                    <option value={50}>50家公司</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <Button
                    onClick={batchCompleteCompanies}
                    disabled={isBatchGenerating || !authToken}
                    className="w-full dark:bg-green-600 dark:hover:bg-green-700"
                  >
                    {isBatchGenerating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        生成中...
                      </>
                    ) : (
                      <>
                        <Play className="mr-2 h-4 w-4" />
                        开始批量生成
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* 批量生成结果显示 */}
              {batchResult && (
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="text-center mb-4">
                    <div className="text-lg font-bold dark:text-white">批量生成完成</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      {batchResult.category} - {batchResult.requested} 家公司
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-center mb-4">
                    <div>
                      <div className="text-xl font-bold text-green-600 dark:text-green-400">
                        {batchResult.generated}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-300">成功生成</div>
                    </div>
                    <div>
                      <div className="text-xl font-bold text-red-600 dark:text-red-400">
                        {batchResult.failed}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-300">生成失败</div>
                    </div>
                    <div>
                      <div className="text-xl font-bold text-blue-600 dark:text-blue-400">
                        {Math.round((batchResult.generated / batchResult.requested) * 100)}%
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-300">成功率</div>
                    </div>
                  </div>

                  {batchResult.companies.length > 0 && (
                    <div className="max-h-48 overflow-y-auto">
                      <div className="text-sm font-medium dark:text-white mb-2">生成详情:</div>
                      {batchResult.companies.map((company: any, index: number) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-white dark:bg-gray-600 rounded mb-1">
                          <div className="flex-1">
                            <div className="text-sm font-medium dark:text-white">{company.name}</div>
                            <div className="text-xs text-gray-600 dark:text-gray-300">
                              {company.isOverseas ? '海外公司' : '国内公司'}
                            </div>
                          </div>
                          <div className={`text-sm font-bold ${
                            company.status === 'success' 
                              ? 'text-green-600 dark:text-green-400' 
                              : 'text-red-600 dark:text-red-400'
                          }`}>
                            {company.status === 'success' ? '✅' : '❌'}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {batchResult.errors.length > 0 && (
                    <div className="mt-4">
                      <div className="text-sm font-medium dark:text-white mb-2">错误详情:</div>
                      <div className="max-h-32 overflow-y-auto space-y-1">
                        {batchResult.errors.map((error: string, index: number) => (
                          <div key={index} className="text-xs text-red-600 dark:text-red-400">
                            • {error}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* 公司分类管理 */}
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="dark:text-white">AI公司分类管理</CardTitle>
              <CardDescription className="dark:text-gray-300">
                查看200家AI公司的完整分类和完成状态
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Button
                  onClick={loadCompanyCategories}
                  disabled={isLoadingCategories}
                  className="flex-1 dark:bg-blue-600 dark:hover:bg-blue-700"
                >
                  {isLoadingCategories ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      加载中...
                    </>
                  ) : (
                    <>
                      <BarChart3 className="mr-2 h-4 w-4" />
                      加载公司分类
                    </>
                  )}
                </Button>
                <Button
                  onClick={checkDataCompleteness}
                  disabled={isCheckingCompleteness}
                  className="flex-1 dark:bg-green-600 dark:hover:bg-green-700"
                >
                  {isCheckingCompleteness ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      检查中...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      检查完整性
                    </>
                  )}
                </Button>
              </div>

              {/* 公司分类显示 */}
              {companyCategories && (
                <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {companyCategories.summary.overallCompletionRate}%
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      完成度 ({companyCategories.summary.existingCompanies}/{companyCategories.summary.totalCompanies} 家公司)
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(companyCategories.categories).map(([key, category]: [string, any]) => (
                      <div key={key} className="p-3 bg-white dark:bg-gray-600 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-semibold dark:text-white">{category.name}</h4>
                          <span className="text-sm text-gray-600 dark:text-gray-300">
                            {category.completionRate}%
                          </span>
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-300 mb-2">
                          {category.description}
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-500 rounded-full h-2 mb-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${category.completionRate}%` }}
                          />
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-300">
                          {category.existing}/{category.total} 家公司
                        </div>
                        {category.missing.length > 0 && (
                          <div className="mt-2">
                            <div className="text-xs font-medium dark:text-white mb-1">缺失公司:</div>
                            <div className="max-h-20 overflow-y-auto">
                              {category.missing.slice(0, 5).map((name: string, index: number) => (
                                <div key={index} className="text-xs text-red-600 dark:text-red-400">
                                  • {name}
                                </div>
                              ))}
                              {category.missing.length > 5 && (
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                  ...还有 {category.missing.length - 5} 家
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 数据完整性显示 */}
              {dataCompleteness && (
                <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="text-center">
                    <div className="text-lg font-bold dark:text-white">数据完整性报告</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      {dataCompleteness.report.summary.totalCompanies} 家公司的详细分析
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div>
                      <div className="text-xl font-bold text-blue-600 dark:text-blue-400">
                        {dataCompleteness.report.summary.companiesWithTools}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-300">有工具数据</div>
                    </div>
                    <div>
                      <div className="text-xl font-bold text-green-600 dark:text-green-400">
                        {dataCompleteness.report.summary.companiesWithFundings}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-300">有融资数据</div>
                    </div>
                    <div>
                      <div className="text-xl font-bold text-purple-600 dark:text-purple-400">
                        {dataCompleteness.report.summary.companiesWithStories}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-300">有故事数据</div>
                    </div>
                    <div>
                      <div className="text-xl font-bold text-orange-600 dark:text-orange-400">
                        {dataCompleteness.report.summary.companiesWithCompleteData}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-300">数据完整</div>
                    </div>
                  </div>

                  <div className="max-h-64 overflow-y-auto">
                    <div className="text-sm font-medium dark:text-white mb-2">公司完整性详情:</div>
                    {dataCompleteness.report.companies.map((company: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-white dark:bg-gray-600 rounded mb-1">
                        <div className="flex-1">
                          <div className="text-sm font-medium dark:text-white">{company.name}</div>
                          <div className="text-xs text-gray-600 dark:text-gray-300">
                            {company.hasDescription ? '✓' : '✗'} 描述
                            {company.hasWebsite ? ' ✓' : ' ✗'} 网站
                            {company.hasTools ? ' ✓' : ' ✗'} 工具({company.toolsCount})
                            {company.hasFundings ? ' ✓' : ' ✗'} 融资({company.fundingsCount})
                            {company.hasStories ? ' ✓' : ' ✗'} 故事({company.storiesCount})
                          </div>
                        </div>
                        <div className="text-sm font-bold text-blue-600 dark:text-blue-400">
                          {company.completenessScore}%
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 单公司生成结果显示 */}
          {singleResult && (
            <Alert className="border-purple-200 bg-purple-50 dark:bg-purple-950 dark:border-purple-800">
              <CheckCircle className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              <AlertDescription className="text-purple-800 dark:text-purple-200">
                <strong>🏢 公司数据生成完成！</strong>
                <div className="mt-2 space-y-2">
                  <div className="text-sm">
                    <span className="font-medium">公司名称:</span>
                    <span className="ml-2">{singleCompanyName}</span>
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">公司类型:</span>
                    <span className="ml-2">{isOverseas ? '海外公司' : '国内公司'}</span>
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">公司ID:</span>
                    <span className="ml-2 font-mono text-xs">{singleResult.result?.companyId}</span>
                  </div>
                  {singleResult.result?.logoUrl && (
                    <div className="text-sm">
                      <span className="font-medium">Logo:</span>
                      <span className="ml-2 text-green-600 dark:text-green-400">✅ 已找到</span>
                    </div>
                  )}
                  <div className="text-sm">
                    <span className="font-medium">生成时间:</span>
                    <span className="ml-2">{new Date(singleResult.result?.generatedAt).toLocaleString('zh-CN')}</span>
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          )}

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
