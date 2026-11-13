import type { ReactNode } from 'react';
import type { MainEvent } from '@/types/fightEvent.types';

export interface FightTitleCardProps {
  video: MainEvent;
  footer?: ReactNode;
}
