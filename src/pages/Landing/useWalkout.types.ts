import type { CountryEntry } from '@/pages/countries/registry.types';

export interface Walkout {
  walkoutEntry: CountryEntry | null;
  startWalkout: (entry: CountryEntry) => void;
}
