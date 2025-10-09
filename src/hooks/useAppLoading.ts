import { useState, useEffect } from 'react';

interface UseAppLoadingOptions {
  minDuration?: number;
  dependencies?: any[];
}

export function useAppLoading({ 
  minDuration = 1500, 
  dependencies = [] 
}: UseAppLoadingOptions = {}) {
  const [isLoading, setIsLoading] = useState(true);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    // 检查所有依赖是否已准备好
    const allDependenciesReady = dependencies.every(dep => {
      if (dep === null || dep === undefined) return false;
      if (Array.isArray(dep)) return dep.length > 0;
      if (typeof dep === 'object') return Object.keys(dep).length > 0;
      return true;
    });

    if (allDependenciesReady && !isComplete) {
      // 确保最小加载时间
      const timer = setTimeout(() => {
        setIsComplete(true);
        setIsLoading(false);
      }, minDuration);

      return () => clearTimeout(timer);
    }
  }, [dependencies, minDuration, isComplete]);

  const completeLoading = () => {
    setIsComplete(true);
    setIsLoading(false);
  };

  return {
    isLoading,
    isComplete,
    completeLoading
  };
}