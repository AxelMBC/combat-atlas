import type { CountryEntry } from '@/pages/countries/registry.types';

export interface StagePortraitProps {
  entries: readonly CountryEntry[];
  selectedSlug: string;
  coordinates: string;
}
