import React, { Component, ErrorInfo, ReactNode } from 'react';
// import { getInitializationState } from '@/lib/supabase';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
  isSupabaseError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { 
      hasError: false, 
      isSupabaseError: false 
    };
  }

  static getDerivedStateFromError(error: Error): State {
    const isSupabaseError = error.message.toLowerCase().includes('supabase');
    return { 
      hasError: true, 
      error,
      isSupabaseError
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('错误边界捕获到错误:', error, errorInfo);
    
    this.setState({ errorInfo });
    
    // 检查是否与Supabase相关的错误
    const isSupabaseError = error.message.toLowerCase().includes('supabase');
    
    if (isSupabaseError) {
      console.log('检测到Supabase相关错误，尝试恢复...');
      
      // 尝试重新初始化Supabase
      // const supabaseState = getInitializationState();
      
      // if (!supabaseState.initialized && !supabaseState.initializing) {
        // 如果初始化失败，3秒后自动刷新
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      // }
    }
  }

  // 处理重试
  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
          <div className="text-center p-8 bg-white/10 backdrop-blur-md rounded-xl shadow-2xl max-w-md mx-auto border border-white/20">
            <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.732 15.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white mb-4">蝕奥AI</h1>
            <p className="text-gray-300 mb-6">
              {this.state.isSupabaseError 
                ? '服务连接暂时不可用，正在自动尝试恢复...'
                : '应用遇到问题，正在尝试恢复...'}
            </p>
            <div className="space-y-3">
              <button 
                onClick={this.handleRetry}
                className="w-full bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors font-medium"
              >
                重试
              </button>
              <button 
                onClick={() => window.location.reload()}
                className="w-full bg-white/20 text-white px-6 py-3 rounded-lg hover:bg-white/30 transition-colors font-medium backdrop-blur-sm"
              >
                刷新页面
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-6">
              如果问题持续，请联系我们的技术支持团队
            </p>
            {this.state.error && (
              <details className="mt-4 text-xs">
                <summary className="text-gray-400 cursor-pointer">查看错误详情</summary>
                <pre className="text-red-300 mt-2 p-2 bg-black/20 rounded text-left overflow-auto max-h-32">
                  {this.state.error.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;