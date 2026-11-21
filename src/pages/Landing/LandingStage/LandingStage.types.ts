import type { ReactNode } from 'react';
import type { CountryEntry } from '@/pages/countries/registry.types';

export interface LandingStageProps {
  entries: readonly CountryEntry[];
  selectedEntry: CountryEntry;
  reduceMotion: boolean;
  children: ReactNode;
}
