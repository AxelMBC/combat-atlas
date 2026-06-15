import type { MainEvent } from '@/types/fightEvent.types';

export interface CountryStats {
  fightsCount: number;
  cities: string[];
  disciplines: string[];
}

export interface CinematicHeroProps {
  video: MainEvent | null;
  countryName: string;
  stats: CountryStats;
  autoplayAllowed: boolean;
  onReady: () => void;
}

export interface UseHeroFullscreenResult {
  isFullscreen: boolean;
  toggleFullscreen: () => void;
}
