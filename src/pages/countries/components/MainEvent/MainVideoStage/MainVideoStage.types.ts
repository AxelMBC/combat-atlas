import type { RefObject } from 'react';
import type { MainEvent } from '@/types/fightEvent.types';

export interface MainVideoStageProps {
  video: MainEvent;
  placeholderRef: RefObject<HTMLDivElement | null>;
  onReady: () => void;
}
