import type { Fighter } from '@/types/fighter.types';
import type { TranslationKey } from '@/i18n';

export interface EventFormData {
  country: string;
  idYt: string;
  startTime: string;
  title: string;
  description: string;
  tags: string[];
  fighterRed: string;
  fighterRedId: string;
  fighterBlue: string;
  fighterBlueId: string;
  fighterId: string;
}

export type EventFormFieldUpdate = {
  [K in keyof EventFormData]: { field: K; value: EventFormData[K] };
}[keyof EventFormData];

export interface EventIngestionState {
  form: EventFormData;
  availableFighters: Fighter[];
  loadingFighters: boolean;
  fetchFightersError: TranslationKey | null;
  submitting: boolean;
  submitSuccess: boolean;
  submitError: TranslationKey | null;
}
