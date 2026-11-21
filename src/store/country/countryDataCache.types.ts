import type { CountryDataResponse } from '@/types/country.types';

export interface SessionCache {
  data: CountryDataResponse;
  fetchedAt: number;
}
