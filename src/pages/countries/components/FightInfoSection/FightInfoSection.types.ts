import type { MainEvent } from '@/types/fightEvent.types';

export interface FightInfoSectionProps {
  loading: boolean;
  error: string | null;
  video: MainEvent | null;
  onAnotherFight: () => void;
  anotherFightDisabled: boolean;
}
