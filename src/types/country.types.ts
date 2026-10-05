import type { Fighter } from './fighter.types';
import type { MainEvent } from './fightEvent.types';

export interface CountryDataResponse {
  topFighters: Fighter[];
  allFights: MainEvent[];
  topEvents: MainEvent[];
}
