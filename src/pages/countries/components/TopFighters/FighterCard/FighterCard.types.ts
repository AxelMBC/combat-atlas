import type { Fighter } from '@/types/fighter.types';

export type FighterCardVariant = 'feature' | 'compact';

export interface FighterCardProps {
  boxer: Fighter;
  rank: number;
  remaining: number;
  variant: FighterCardVariant;
  onSelect: (fighter: Fighter) => void;
}
