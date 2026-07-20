import type { Fighter } from '@/types/fighter.types';
import type { MainEvent } from '@/types/fightEvent.types';
import type { TranslationKey } from '@/i18n';

export interface UseCountryPageDataOptions {
  resolveFighterImage?: (filename: string) => string;
  resolveTopFightThumbnail?: (filename: string) => string;
}

export interface UseCountryPageDataResult {
  fightersList: Fighter[];
  mainEvents: MainEvent[];
  topFightsList: MainEvent[];
  loading: boolean;
  error: TranslationKey | null;
  retry: () => void;
}
