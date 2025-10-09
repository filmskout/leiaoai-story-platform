import { useState, useEffect, useRef, useCallback } from 'react';

interface UseInfiniteScrollOptions {
  threshold?: number;
  rootMargin?: string;
  enabled?: boolean;
}

interface UseInfiniteScrollReturn {
  isFetching: boolean;
  setIsFetching: (isFetching: boolean) => void;
  loadMoreRef: React.RefObject<HTMLElement>;
}

export function useInfiniteScroll(
  fetchMore: () => Promise<void> | void,
  options: UseInfiniteScrollOptions = {}
): UseInfiniteScrollReturn {
  const {
    threshold = 0.1,
    rootMargin = '100px',
    enabled = true
  } = options;
  
  const [isFetching, setIsFetching] = useState(false);
  const loadMoreRef = useRef<HTMLElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const handleFetchMore = useCallback(async () => {
    if (isFetching || !enabled) return;
    
    setIsFetching(true);
    try {
      await fetchMore();
    } catch (error) {
      console.error('Error fetching more content:', error);
    } finally {
      setIsFetching(false);
    }
  }, [fetchMore, isFetching, enabled]);

  useEffect(() => {
    const loadMoreElement = loadMoreRef.current;
    
    if (!loadMoreElement || !enabled) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !isFetching) {
          handleFetchMore();
        }
      },
      {
        threshold,
        rootMargin
      }
    );

    observerRef.current = observer;
    observer.observe(loadMoreElement);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [handleFetchMore, threshold, rootMargin, enabled, isFetching]);

  return {
    isFetching,
    setIsFetching,
    loadMoreRef
  };
}

export default useInfiniteScroll;