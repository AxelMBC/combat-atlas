import { createAsyncThunk } from '@reduxjs/toolkit';
import { getCountryData } from '@/services/country.service';
import { submitEventData } from '@/services/event.service';
import type { EventFormData } from './eventIngestionSlice.types';
import type { Fighter } from '@/types/fighter.types';
import type { TranslationKey } from '@/i18n';

export const fetchFightersByCountry = createAsyncThunk<
  Fighter[],
  string,
  { rejectValue: TranslationKey }
>('eventIngestion/fetchFightersByCountry', async (slug, { rejectWithValue }) => {
  try {
    const data = await getCountryData(slug);
    return data.topFighters;
  } catch {
    return rejectWithValue('error.fightersLoad');
  }
});

export const submitEvent = createAsyncThunk<void, EventFormData, { rejectValue: TranslationKey }>(
  'eventIngestion/submitEvent',
  async (formData, { rejectWithValue }) => {
    try {
      await submitEventData(formData);
    } catch {
      return rejectWithValue('error.eventSubmit');
    }
  },
);
