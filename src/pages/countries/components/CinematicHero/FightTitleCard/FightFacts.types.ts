import type { MainEvent } from '@/types/fightEvent.types';

export interface FightFactsProps {
  video: MainEvent;
  delay: number;
}

export interface FightFact {
  key: string;
  label: string;
  value?: string;
  detail?: string;
}
