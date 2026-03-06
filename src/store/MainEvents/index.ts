import { createSlice } from "@reduxjs/toolkit";
import type { mainEvent } from "@/types/fightEvent.type";
import { fetchCountry } from "@/store/country/thunks";

interface MainEventsState {
  mainEventsList: mainEvent[];
  loading: boolean;
  error: string | null;
}

const initialState: MainEventsState = {
  mainEventsList: [],
  loading: false,
  error: null,
};

export const mainEventsSlice = createSlice({
  name: "mainEvents",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCountry.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCountry.fulfilled, (state, action) => {
        state.loading = false;
        state.mainEventsList = action.payload.allFights;
      })
      .addCase(fetchCountry.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const selectMainEventsState = (state: { mainEvents: MainEventsState }) =>
  state.mainEvents;

export default mainEventsSlice.reducer;
