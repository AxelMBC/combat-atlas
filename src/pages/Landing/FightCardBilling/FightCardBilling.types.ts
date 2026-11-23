import type { MouseEvent } from 'react';
import type { CountryEntry } from '@/pages/countries/registry.types';
import type { CountryFightCount } from '@/pages/Landing/useCountryFightCounts.types';

export type CountryIntentHandler = (entry: CountryEntry) => void;

export type CountryPressHandler = (entry: CountryEntry, pointerType: string) => void;

export type CountryActivateHandler = (
  event: MouseEvent<HTMLAnchorElement>,
  entry: CountryEntry,
) => void;

export interface FightCardBillingProps {
  entries: readonly CountryEntry[];
  selectedSlug: string;
  fightCounts: ReadonlyMap<string, CountryFightCount>;
  reduceMotion: boolean;
  onIntent: CountryIntentHandler;
  onPress: CountryPressHandler;
  onActivate: CountryActivateHandler;
}
