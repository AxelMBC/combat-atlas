import { createAsyncThunk } from '@reduxjs/toolkit';
import type { CountryDataResponse } from '@/types/country.types';
import type { TranslationKey } from '@/i18n';
import { loadCountryData } from './countryDataCache';

export const fetchCountry = createAsyncThunk<
  CountryDataResponse,
  string,
  { rejectValue: TranslationKey }
>('country/fetchBySlug', async (slug, { rejectWithValue }) => {
  try {
    return await loadCountryData(slug);
  } catch {
    return rejectWithValue('error.countryData');
  }
});
