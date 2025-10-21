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

    try {
      const response = await fetch('/api/unified?action=reconfigure', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: authToken // 使用从API获取的token
        })
      });

      const data = await response.json();

      if (data.success) {
        setResult(data);
      } else {
        setError(data.error || '重新配置失败');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsRunning(false);
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

          <Button 
            onClick={handleReconfigure} 
            disabled={isRunning || !authToken || isLoadingToken}
            className="w-full"
          >
            {isRunning ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                正在重新配置...
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4" />
                开始重新配置
              </>
            )}
          </Button>

          {result && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                <strong>重新配置成功！</strong>
                <pre className="mt-2 text-xs bg-white p-2 rounded border overflow-auto max-h-40">
                  {result.output}
                </pre>
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
