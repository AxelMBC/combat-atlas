import type { RefObject } from 'react';
import type { UseHeroFullscreenResult } from './CinematicHero.types';

import { useCallback, useEffect, useState } from 'react';

export const useHeroFullscreen = (
  targetRef: RefObject<HTMLElement | null>,
): UseHeroFullscreenResult => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const sync = () => {
      setIsFullscreen(
        targetRef.current !== null && document.fullscreenElement === targetRef.current,
      );
    };
    document.addEventListener('fullscreenchange', sync);
    return () => document.removeEventListener('fullscreenchange', sync);
  }, [targetRef]);

  const toggleFullscreen = useCallback(() => {
    try {
      if (document.fullscreenElement) {
        document.exitFullscreen()?.catch(() => {});
      } else {
        targetRef.current?.requestFullscreen?.()?.catch(() => {});
      }
    } catch {
      setIsFullscreen(false);
    }
  }, [targetRef]);

  return { isFullscreen, toggleFullscreen };
};
