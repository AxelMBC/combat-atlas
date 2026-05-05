import type { MainEvent } from '@/types/fightEvent.types';

export interface MainEventCardProps {
  video: MainEvent;
  onAnotherFight: () => void;
}
