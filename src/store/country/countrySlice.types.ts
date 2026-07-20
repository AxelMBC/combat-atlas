import type { Fighter } from '@/types/fighter.types';
import type { MainEvent } from '@/types/fightEvent.types';
import type { TranslationKey } from '@/i18n';

export interface CountryState {
  fighters: Fighter[];
  mainEvents: MainEvent[];
  topEvents: MainEvent[];
  loading: boolean;
  error: TranslationKey | null;
}
