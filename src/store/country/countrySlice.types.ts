import type { Fighter } from "@/types/fighter.types";
import type { MainEvent } from "@/types/fightEvent.types";

export interface CountryState {
  fighters: Fighter[];
  selectedFighter: Fighter | null;
  mainEvents: MainEvent[];
  topEvents: MainEvent[];
  loading: boolean;
  error: string | null;
}
