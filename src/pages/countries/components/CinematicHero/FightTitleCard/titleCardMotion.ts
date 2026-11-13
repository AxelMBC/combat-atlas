import type { EntranceOffset } from './titleCardMotion.types';

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;
const ENTRANCE_DURATION_S = 0.7;

export const titleCardEntrance = (
  shouldReduceMotion: boolean | null,
  offset: EntranceOffset,
  delay: number,
) => ({
  initial: { opacity: 0, ...(shouldReduceMotion ? {} : offset) },
  animate: { opacity: 1, x: 0, y: 0, scale: 1 },
  transition: { duration: ENTRANCE_DURATION_S, delay, ease: EASE_OUT_EXPO },
});
