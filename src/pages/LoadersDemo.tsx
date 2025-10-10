import React, { useState } from 'react';
import { UnifiedLoader, AppLoader, LazyLoad } from '../components/ui/loaders';
import { Button } from '../components/ui/Button';
import { Slider } from '../components/ui/Slider';

export default function LoadersDemo() {
  const [progress, setProgress] = useState(50);
  const [showFullscreen, setShowFullscreen] = useState(false);
  const [showCover, setShowCover] = useState(false);
  const [showApp, setShowApp] = useState(false);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">统一加载组件展示</h1>
      
      <div className="grid gap-8">
        {/* 内联加载器 */}
        <section className="bg-background-subtle p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">内联加载器</h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            <div className="flex flex-col items-center">
              <h3 className="text-sm font-medium mb-2">超小尺寸 (XS)</h3>
              <UnifiedLoader size="xs" />
            </div>
            <div className="flex flex-col items-center">
              <h3 className="text-sm font-medium mb-2">小尺寸 (SM)</h3>
              <UnifiedLoader size="sm" />
            </div>
            <div className="flex flex-col items-center">
              <h3 className="text-sm font-medium mb-2">中尺寸 (MD)</h3>
              <UnifiedLoader size="md" text="加载中..." />
            </div>
            <div className="flex flex-col items-center">
              <h3 className="text-sm font-medium mb-2">大尺寸 (LG)</h3>
              <UnifiedLoader size="lg" text="加载中..." subText="请稍候" />
            </div>
            <div className="flex flex-col items-center">
              <h3 className="text-sm font-medium mb-2">超大尺寸 (XL)</h3>
              <UnifiedLoader size="xl" text="加载中..." subText="请稍候" />
            </div>
          </div>
        </section>
        
        {/* 全屏模态加载器 */}
        <section className="bg-background-subtle p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">全屏模态加载器</h2>
          <div className="flex gap-4">
            <Button onClick={() => setShowFullscreen(true)}>
              显示全屏加载器
            </Button>
            <UnifiedLoader 
              mode="fullscreen" 
              show={showFullscreen} 
              text="全屏加载示例" 
              subText="点击外部区域关闭"
              size="lg"
              onComplete={() => setShowFullscreen(false)}
            />
          </div>
        </section>
        
        {/* 带进度条的覆盖加载器 */}
        <section className="bg-background-subtle p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">带进度条的覆盖加载器</h2>
          <div className="space-y-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">进度值: {progress}%</label>
              <Slider 
                value={[progress]} 
                onValueChange={(v) => setProgress(v[0])} 
                max={100} 
                step={1}
              />
            </div>
            <Button onClick={() => setShowCover(true)}>
              显示带进度条加载器
            </Button>
            <UnifiedLoader 
              mode="cover" 
              show={showCover} 
              text="处理中..."
              subText="正在上传文件"
              progress={progress}
              showProgress={true}
              onComplete={() => setShowCover(false)}
            />
          </div>
        </section>
        
        {/* 应用初始化加载器 */}
        <section className="bg-background-subtle p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">应用初始化加载器</h2>
          <div className="flex gap-4">
            <Button onClick={() => setShowApp(true)}>
              显示应用加载画面
            </Button>
            <AppLoader 
              show={showApp}
              minDuration={3000}
              onComplete={() => setShowApp(false)}
            />
          </div>
        </section>
      </div>
    </div>
  );
}