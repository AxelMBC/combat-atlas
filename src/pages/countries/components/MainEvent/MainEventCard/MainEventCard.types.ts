import type { RefObject } from 'react';
import type { MainEvent } from '@/types/fightEvent.types';

export interface MainEventCardProps {
  video: MainEvent;
  onAnotherFight: () => void;
  /**
   * When provided, the video slot renders as an empty placeholder that reserves
   * the 16:9 space. The actual video is the fixed `MainVideoStage` overlay that
   * collapses onto this rect. When omitted (reduced motion), the iframe renders
   * inline as before.
   */
  placeholderRef?: RefObject<HTMLDivElement | null>;
}
