import type { Fighter } from '@/types/fighter.types';

export type PortraitDim = number | string | { xs?: number | string; md?: number | string };

export interface PortraitSize {
  width: PortraitDim;
  height: PortraitDim;
}

export interface FighterPortraitProps {
  boxer: Fighter;
  rankLabel: string;
  remaining: number;
  disabled: boolean;
  size: PortraitSize;
  emphasis: 'feature' | 'compact';
}
