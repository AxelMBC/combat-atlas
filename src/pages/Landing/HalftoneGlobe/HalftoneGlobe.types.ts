import type { CountryEntry } from '@/pages/countries/registry.types';

export type GlobeCountry = Pick<CountryEntry, 'isoCode' | 'center' | 'accentColor'>;

export interface GlobeSpinRequest {
  id: number;
  isoCode: string;
}

export interface GlobeColors {
  ink: string;
  page: string;
}

export interface HalftoneGlobeProps {
  countries: readonly GlobeCountry[];
  selectedIsoCode: string;
  spin: GlobeSpinRequest | null;
  colors: GlobeColors;
  reduceMotion: boolean;
  onPointCountry: (isoCode: string | null) => void;
  onEnterCountry: (isoCode: string) => void;
  onSpinSettled: () => void;
}
