import { createSlice } from "@reduxjs/toolkit";
import type { mainEvent } from "@/types/fightEvent.type";
import { fetchCountry } from "@/store/country/thunks";

interface TopEventsState {
  topEventsList: mainEvent[];
  loading: boolean;
  error: string | null;
}

const initialState: TopEventsState = {
  topEventsList: [],
  loading: false,
  error: null,
};

export const topEventsSlice = createSlice({
  name: "topEvents",
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
        state.topEventsList = action.payload.topEvents;
      })
      .addCase(fetchCountry.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const selectTopEventsState = (state: { topEvents: TopEventsState }) =>
  state.topEvents;

export default topEventsSlice.reducer;
