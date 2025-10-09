import { useState, useEffect, useRef } from 'react';

interface UseLazyImageOptions {
  rootMargin?: string;
  threshold?: number;
  placeholder?: string;
}

interface UseLazyImageReturn {
  src: string | undefined;
  loaded: boolean;
  error: boolean;
  ref: React.RefObject<HTMLImageElement>;
}

export function useLazyImage(
  imageSrc: string,
  options: UseLazyImageOptions = {}
): UseLazyImageReturn {
  const {
    rootMargin = '50px',
    threshold = 0.1,
    placeholder
  } = options;
  
  const [src, setSrc] = useState<string | undefined>(placeholder);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const ref = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const imageElement = ref.current;
    if (!imageElement || !imageSrc) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setSrc(imageSrc);
          observer.disconnect();
        }
      },
      {
        rootMargin,
        threshold
      }
    );

    observer.observe(imageElement);

    return () => {
      observer.disconnect();
    };
  }, [imageSrc, rootMargin, threshold]);

  const handleLoad = () => {
    setLoaded(true);
    setError(false);
  };

  const handleError = () => {
    setError(true);
    setLoaded(false);
  };

  // Add event listeners to the image element
  useEffect(() => {
    const imageElement = ref.current;
    if (!imageElement) return;

    imageElement.addEventListener('load', handleLoad);
    imageElement.addEventListener('error', handleError);

    return () => {
      imageElement.removeEventListener('load', handleLoad);
      imageElement.removeEventListener('error', handleError);
    };
  }, [src]);

  return {
    src,
    loaded,
    error,
    ref
  };
}

export default useLazyImage;