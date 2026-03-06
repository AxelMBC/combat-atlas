import { createSlice } from "@reduxjs/toolkit";
import type { fighter } from "@/types/fighter.type";
import { fetchCountry } from "@/store/country/thunks";

interface FighterState {
  fightersList: fighter[];
  selectedFighter: fighter | null;
  loading: boolean;
  error: string | null;
}

const initialState: FighterState = {
  fightersList: [],
  selectedFighter: null,
  loading: false,
  error: null,
};

export const fighterSlice = createSlice({
  name: "fighters",
  initialState,
  reducers: {
    setSelectedFighter: (state, action) => {
      state.selectedFighter = action.payload;
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
        state.fightersList = action.payload.topFighters;
      })
      .addCase(fetchCountry.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setSelectedFighter } = fighterSlice.actions;

export const selectFightersState = (state: { fighter: FighterState }) =>
  state.fighter;

export default fighterSlice.reducer;
