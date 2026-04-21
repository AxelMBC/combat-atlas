import type { Fighter } from "@/types/fighter.types";

export interface EventFormData {
  country: string;
  idYt: string;
  startTime: number;
  title: string;
  description: string;
  tags: string[];
  fighterRed: string;
  fighterRedId: string;
  fighterBlue: string;
  fighterBlueId: string;
  fighterId: string;
}

export interface EventIngestionState {
  form: EventFormData;
  availableFighters: Fighter[];
  loadingFighters: boolean;
  fetchFightersError: string | null;
  submitting: boolean;
  submitSuccess: boolean;
  submitError: string | null;
}
