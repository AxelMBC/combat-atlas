import api from './api';
import type { CountryDataResponse } from '@/types/country.types';

export const getCountryData = async (slug: string): Promise<CountryDataResponse> => {
  const { data } = await api.get<{ data: CountryDataResponse }>(`/countries/${slug}`);
  if (!data?.data) throw new Error(`Unexpected response shape for country '${slug}'`);
  return data.data;
};
