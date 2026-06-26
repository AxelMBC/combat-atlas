import { useEffect, useRef, useState } from 'react';
import type { UseScrollFocusOptions, UseScrollFocusResult } from './useScrollFocus.types';

const DEFAULT_ROOT_MARGIN = '-47% 0px -47% 0px';

const useScrollFocus = <T extends HTMLElement = HTMLElement>({
  rootMargin = DEFAULT_ROOT_MARGIN,
}: UseScrollFocusOptions = {}): UseScrollFocusResult<T> => {
  const ref = useRef<T | null>(null);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia('(hover: none)').matches) return;

    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => setIsFocused(entry.isIntersecting), {
      rootMargin,
      threshold: 0,
    });

    observer.observe(element);

    return () => observer.disconnect();
  }, [rootMargin]);

  return { ref, isFocused };
};

export default useScrollFocus;
