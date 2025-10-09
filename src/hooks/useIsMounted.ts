import { useEffect, useRef } from 'react';

// 用于检查组件是否已挂载的自定义Hook
export function useIsMounted() {
  const isMountedRef = useRef(false);
  
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);
  
  return isMountedRef;
}