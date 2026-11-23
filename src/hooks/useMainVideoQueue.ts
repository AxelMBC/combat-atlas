import type { MainEvent } from '@/types/fightEvent.types';
import type { Fighter } from '@/types/fighter.types';
import type { TranslationKey } from '@/i18n';
import type { UseMainVideoQueueResult } from './useMainVideoQueue.types';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import pickRandomEvent from '@/utils/pickRandomEvent';
import scrollToMainEvent from '@/utils/scrollToMainEvent';
import { useTranslation } from '@/i18n';
import { countUnwatched, forgetFights } from '@/store/watchHistory/watchHistory';

const involvesFighter = (fighterId: string) => (event: MainEvent) =>
  event.fighterBlueId === fighterId || event.fighterRedId === fighterId;

const pickPreferringUnshown = (
  candidates: MainEvent[],
  shownIds: ReadonlySet<string>,
): MainEvent | null => {
  if (candidates.length === 0) return null;
  const unshown = candidates.filter((event) => !shownIds.has(event._id));
  return pickRandomEvent(unshown.length > 0 ? unshown : candidates).randomEvent;
};

export const useMainVideoQueue = (
  initialEvents: MainEvent[],
  watched: ReadonlySet<string>,
): UseMainVideoQueueResult => {
  const { t } = useTranslation();
  const [mainVideo, setMainEvent] = useState<MainEvent | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorKey, setErrorKey] = useState<TranslationKey | null>(null);
  const [shownIds, setShownIds] = useState<ReadonlySet<string>>(() => new Set());
  const prevEventsRef = useRef<string>('');
  const initializedRef = useRef<boolean>(false);
  const watchedRef = useRef(watched);
  watchedRef.current = watched;

  const poolIds = useMemo(() => initialEvents.map((event) => event._id), [initialEvents]);

  const heroId = mainVideo?._id;
  const candidates = useMemo(
    () => initialEvents.filter((event) => !watched.has(event._id) && event._id !== heroId),
    [initialEvents, watched, heroId],
  );

  const showInHero = useCallback((event: MainEvent, scroll: boolean) => {
    setMainEvent(event);
    setShownIds((previous) => new Set(previous).add(event._id));
    if (scroll) scrollToMainEvent();
    setErrorKey(null);
    setLoading(false);
  }, []);

  const fetchNextVideo = useCallback((): void => {
    const next = pickPreferringUnshown(candidates, shownIds);
    if (next) showInHero(next, true);
  }, [candidates, shownIds, showInHero]);

  const fetchVideoByFighter = useCallback(
    (fighter: Fighter) => {
      const next = pickPreferringUnshown(candidates.filter(involvesFighter(fighter._id)), shownIds);
      if (next) {
        showInHero(next, true);
        return;
      }
      setErrorKey('error.noFighterEvent');
      setMainEvent(null);
    },
    [candidates, shownIds, showInHero],
  );

  const startOver = useCallback((): void => {
    forgetFights(poolIds);
    const others = initialEvents.filter((event) => event._id !== heroId);
    if (others.length === 0) return;
    const next = pickRandomEvent(others).randomEvent;
    setShownIds(new Set());
    showInHero(next, true);
  }, [poolIds, initialEvents, heroId, showInHero]);

  const onVideoSelect = useCallback((video: MainEvent) => {
    setMainEvent(video);
    setErrorKey(null);
    scrollToMainEvent();
  }, []);

  const remainingByFighter = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const event of candidates) {
      if (event.fighterBlueId) {
        counts[event.fighterBlueId] = (counts[event.fighterBlueId] ?? 0) + 1;
      }
      if (event.fighterRedId) {
        counts[event.fighterRedId] = (counts[event.fighterRedId] ?? 0) + 1;
      }
    }
    return counts;
  }, [candidates]);

  const unwatchedCount = useMemo(() => countUnwatched(poolIds, watched), [poolIds, watched]);

  useEffect(() => {
    if (initialEvents.length === 0) return;

    const serialized = JSON.stringify(initialEvents.map((e) => e._id).sort());

    if (serialized === prevEventsRef.current) return;

    prevEventsRef.current = serialized;
    const isFirstPick = !initializedRef.current;
    initializedRef.current = true;
    const unwatched = initialEvents.filter((event) => !watchedRef.current.has(event._id));
    const first = pickRandomEvent(unwatched.length > 0 ? unwatched : initialEvents).randomEvent;
    setShownIds(new Set());
    showInHero(first, !isFirstPick);
  }, [initialEvents, showInHero]);

  const error = errorKey ? t(errorKey) : null;

  return {
    mainVideo,
    loading,
    error,
    fetchNextVideo,
    fetchVideoByFighter,
    onVideoSelect,
    remainingByFighter,
    unwatchedCount,
    isExhausted: candidates.length === 0,
    startOver,
  };
};
