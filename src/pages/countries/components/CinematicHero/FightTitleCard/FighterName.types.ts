export type FighterNameSide = 'left' | 'right' | 'solo';

export interface FighterNameProps {
  name: string;
  side: FighterNameSide;
  delay: number;
}
