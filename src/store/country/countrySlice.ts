import type { PayloadAction } from "@reduxjs/toolkit";
import type { CountryState } from "./countrySlice.types";
import type { Fighter } from "@/types/fighter.types";
import type { RootState } from "@/store";

import { createSlice } from "@reduxjs/toolkit";

import { fetchCountry } from "./thunks";

const initialState: CountryState = {
  fighters: [],
  selectedFighter: null,
  mainEvents: [],
  topEvents: [],
  loading: false,
  error: null,
};

export const countrySlice = createSlice({
  name: "country",
  initialState,
  reducers: {
    setSelectedFighter: (state, action: PayloadAction<Fighter | null>) => {
      state.selectedFighter = action.payload;
    },
    resetCountryData: (state) => {
      state.fighters = [];
      state.mainEvents = [];
      state.topEvents = [];
      state.selectedFighter = null;
      state.error = null;
      state.loading = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCountry.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCountry.fulfilled, (state, action) => {
        state.loading = false;
        state.fighters = action.payload.topFighters;
        state.mainEvents = action.payload.allFights;
        state.topEvents = action.payload.topEvents;
      })
      .addCase(fetchCountry.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setSelectedFighter, resetCountryData } = countrySlice.actions;
export const selectCountryState = (state: RootState) => state.country;

export default countrySlice.reducer;
