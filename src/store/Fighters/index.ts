import type { fighter } from "@/types/fighter.type";

import { createSlice } from "@reduxjs/toolkit";
import { topFightersData } from "@/pages/Mexico/data/topFightersList";

interface FighterState {
  fightersList: fighter[];
  selectedFighter: fighter | null;
}

const initialState: FighterState = {
  fightersList: topFightersData,
  selectedFighter: null,
};

export const fighterSlice = createSlice({
  name: "fighters",
  initialState,
  reducers: {
    setFightersList: (state, action) => {
      state.fightersList = action.payload;
    },
    setSelectedFighter: (state, action) => {
      state.selectedFighter = action.payload;
    },
  },
});

export const { setFightersList, setSelectedFighter } = fighterSlice.actions;

export const selectFightersState = (state: { fighter: FighterState }) =>
  state.fighter;

export default fighterSlice.reducer;
