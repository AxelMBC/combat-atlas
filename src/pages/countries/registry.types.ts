import type { ComponentType } from 'react';
import type { TranslationKey } from '@/i18n';

export interface GeoPoint {
  lat: number;
  lng: number;
}

export interface CountryPortrait {
  src: string;
  fighterName: string;
}

export interface CountryEntry {
  slug: string;
  nameKey: TranslationKey;
  disciplineKey: TranslationKey;
  isoCode: string;
  center: GeoPoint;
  accentColor: string;
  portrait?: CountryPortrait;
  loader: () => Promise<{ default: ComponentType }>;
}
