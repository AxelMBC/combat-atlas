import { mainEvent } from "@/types/fightEvent.type";

import { createSlice } from "@reduxjs/toolkit";
import { mainEventFights } from "@/pages/Mexico/data/allEventsList";

interface MainEventsState {
  mainEventsList: mainEvent[];
}

const initialState: MainEventsState = {
  mainEventsList: mainEventFights,
};

export const mainEventsSlice = createSlice({
  name: "mainEvents",
  initialState,
  reducers: {
    setMainEventsList: (state, action) => {
      state.mainEventsList = action.payload;
    },
  },
});

export const { setMainEventsList } = mainEventsSlice.actions;

export const selectMainEventsState = (state: { mainEvents: MainEventsState }) =>
  state.mainEvents;

export default mainEventsSlice.reducer;
