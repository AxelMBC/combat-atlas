import type { mainEvent } from "@/types/fightEvent.type";

import { createSlice } from "@reduxjs/toolkit";
import { topEventsList } from "@/pages/Mexico/data/topEventsList";

interface TopEventsState {
  topEventsList: mainEvent[];
}

const initialState: TopEventsState = {
  topEventsList: topEventsList,
};

export const topEventsSlice = createSlice({
  name: "topEvents",
  initialState,
  reducers: {
    setTopEventsList: (state, action) => {
      state.topEventsList = action.payload;
    },
  },
});

export const { setTopEventsList } = topEventsSlice.actions;

export const selectTopEventsState = (state: { topEvents: TopEventsState }) =>
  state.topEvents;

export default topEventsSlice.reducer;
