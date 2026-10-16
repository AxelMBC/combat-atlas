import type { CountryState } from './countrySlice.types';
import type { RootState } from '@/store';

import { createSlice } from '@reduxjs/toolkit';

import { fetchCountry } from './thunks';

const initialState: CountryState = {
  fighters: [],
  mainEvents: [],
  topEvents: [],
  loading: false,
  error: null,
  requestId: null,
};

export const countrySlice = createSlice({
  name: 'country',
  initialState,
  reducers: {
    resetCountryData: (state) => {
      state.fighters = [];
      state.mainEvents = [];
      state.topEvents = [];
      state.error = null;
      state.loading = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCountry.pending, (state, action) => {
        state.loading = true;
        state.error = null;
        state.requestId = action.meta.requestId;
      })
      .addCase(fetchCountry.fulfilled, (state, action) => {
        if (action.meta.requestId !== state.requestId) return;
        state.loading = false;
        state.fighters = action.payload.topFighters;
        state.mainEvents = action.payload.allFights;
        state.topEvents = action.payload.topEvents;
      })
      .addCase(fetchCountry.rejected, (state, action) => {
        if (action.meta.requestId !== state.requestId) return;
        state.loading = false;
        state.error = action.payload ?? null;
      });
  },
});

export const { resetCountryData } = countrySlice.actions;
export const selectCountryState = (state: RootState) => state.country;

export default countrySlice.reducer;
