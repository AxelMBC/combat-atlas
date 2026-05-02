import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import type { MainEvent } from "@/types/fightEvent.types";
import type { Fighter } from "@/types/fighter.types";
import shuffleArray from "@/utils/shuffleArray";
import pickRandomEvent from "@/utils/pickRandomEvent";
import scrollToMainEvent from "@/utils/scrollToMainEvent";
import { useTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";

export const useMainVideoQueue = (initialEvents: MainEvent[]) => {
  const { t } = useTranslation();
  const [mainVideo, setMainEvent] = useState<MainEvent | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorKey, setErrorKey] = useState<TranslationKey | null>(null);
  const [mainEventQueue, setMainEventQueue] = useState<MainEvent[]>([]);
  const prevEventsRef = useRef<string>("");
  const initializedRef = useRef<boolean>(false);

  const pickAndConsume = useCallback((queue: MainEvent[]) => {
    setLoading(true);

    if (queue.length === 0) {
      setErrorKey("error.noMoreVideos");
      setMainEvent(null);
      setLoading(false);
      return;
    }

    const { randomEvent, randomIndex } = pickRandomEvent(queue);
    const next = [...queue];
    next.splice(randomIndex, 1);
    setMainEventQueue(next);

    setMainEvent(randomEvent);
    scrollToMainEvent();
    setErrorKey(null);
    setLoading(false);
  }, []);

  const fetchNextVideo = useCallback((): void => {
    pickAndConsume(mainEventQueue);
  }, [mainEventQueue, pickAndConsume]);

  const fetchVideoByFighter = useCallback(
    (fighter: Fighter) => {
      const fighterEvents = mainEventQueue
        .map((event, index) => ({ event, index }))
        .filter(
          ({ event }) =>
            event.fighterBlueId === fighter._id ||
            event.fighterRedId === fighter._id
        );

      if (fighterEvents.length > 0) {
        const randomIndexInFighterEvents = Math.floor(
          Math.random() * fighterEvents.length
        );
        const { event: randomEvent, index: originalIndex } =
          fighterEvents[randomIndexInFighterEvents];

        const next = [...mainEventQueue];
        next.splice(originalIndex, 1);
        setMainEventQueue(next);

        setMainEvent(randomEvent);
        scrollToMainEvent();
        setErrorKey(null);
      } else {
        setErrorKey("error.noFighterEvent");
        setMainEvent(null);
      }
    },
    [mainEventQueue]
  );

  const onVideoSelect = useCallback((video: MainEvent) => {
    setMainEvent(video);
    setErrorKey(null);
    scrollToMainEvent();
  }, []);

  const remainingByFighter = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const event of mainEventQueue) {
      if (event.fighterBlueId) {
        counts[event.fighterBlueId] = (counts[event.fighterBlueId] ?? 0) + 1;
      }
      if (event.fighterRedId) {
        counts[event.fighterRedId] = (counts[event.fighterRedId] ?? 0) + 1;
      }
    }
    return counts;
  }, [mainEventQueue]);

  useEffect(() => {
    if (initialEvents.length === 0) return;

    const serialized = JSON.stringify(initialEvents.map((e) => e.id).sort());

    if (serialized === prevEventsRef.current) return;

    prevEventsRef.current = serialized;
    initializedRef.current = true;
    const shuffled = shuffleArray([...initialEvents]);
    pickAndConsume(shuffled);
  }, [initialEvents, pickAndConsume]);

  const error = errorKey ? t(errorKey) : null;

  return {
    mainVideo,
    loading,
    error,
    fetchNextVideo,
    fetchVideoByFighter,
    onVideoSelect,
    remainingByFighter,
  };
};
