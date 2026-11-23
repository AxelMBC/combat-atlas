import api from './api';
import type { CountryDataResponse, CountrySummary } from '@/types/country.types';

import { isStringArray } from '@/utils/isStringArray';

const isCountrySummary = (value: unknown): value is CountrySummary =>
  typeof value === 'object' &&
  value !== null &&
  'slug' in value &&
  typeof value.slug === 'string' &&
  'fightIds' in value &&
  isStringArray(value.fightIds);

export const getCountryData = async (slug: string): Promise<CountryDataResponse> => {
  const { data } = await api.get<{ data: CountryDataResponse }>(`/countries/${slug}`);
  if (!data?.data) throw new Error(`Unexpected response shape for country '${slug}'`);
  return data.data;
};

export const getCountrySummaries = async (): Promise<CountrySummary[]> => {
  const { data } = await api.get<{ data: unknown }>('/countries');
  const summaries = data?.data;
  if (!Array.isArray(summaries) || !summaries.every(isCountrySummary)) {
    throw new Error('Unexpected response shape for country summaries');
  }
  return summaries;
};
