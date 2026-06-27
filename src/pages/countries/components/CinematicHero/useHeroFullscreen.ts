import type { RefObject } from 'react';
import type { LockableScreenOrientation, UseHeroFullscreenResult } from './CinematicHero.types';

import { useCallback, useEffect, useState } from 'react';

const getOrientation = (): LockableScreenOrientation | undefined =>
  typeof screen !== 'undefined'
    ? (screen.orientation as LockableScreenOrientation | undefined)
    : undefined;

const lockLandscape = () => {
  const orientation = getOrientation();
  if (!orientation || typeof orientation.lock !== 'function') return;
  orientation.lock('landscape').catch(() => {});
};

const unlockOrientation = () => {
  const orientation = getOrientation();
  if (!orientation || typeof orientation.unlock !== 'function') return;
  try {
    orientation.unlock();
  } catch {
    /* unsupported or not locked */
  }
};

export const useHeroFullscreen = (
  targetRef: RefObject<HTMLElement | null>,
): UseHeroFullscreenResult => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const sync = () => {
      setIsFullscreen(
        targetRef.current !== null && document.fullscreenElement === targetRef.current,
      );
      if (!document.fullscreenElement) unlockOrientation();
    };
    document.addEventListener('fullscreenchange', sync);
    return () => document.removeEventListener('fullscreenchange', sync);
  }, [targetRef]);

  const toggleFullscreen = useCallback(() => {
    try {
      if (document.fullscreenElement) {
        unlockOrientation();
        document.exitFullscreen()?.catch(() => {});
      } else {
        targetRef.current
          ?.requestFullscreen?.()
          ?.then(lockLandscape)
          .catch(() => {});
      }
    } catch {
      setIsFullscreen(false);
    }
  }, [targetRef]);

  return { isFullscreen, toggleFullscreen };
};
