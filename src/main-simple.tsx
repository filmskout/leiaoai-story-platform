import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

// 简化的测试应用 - 不使用Supabase
function SimpleApp() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">蕾奥AI</h1>
        <p className="text-gray-600 mb-6">
          网站正在加载...
        </p>
        <div className="space-y-4">
          <div className="w-full h-2 bg-gray-200 rounded">
            <div className="h-2 bg-orange-500 rounded animate-pulse w-3/4"></div>
          </div>
          <p className="text-sm text-gray-500">
            如果您看到此页面，说明基础渲染正常
          </p>
          <p className="text-xs text-gray-400">
            版本：测试版 - {new Date().toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <SimpleApp />
  </React.StrictMode>,
);