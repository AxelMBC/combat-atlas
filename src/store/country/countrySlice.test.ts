import type { CountryState } from "./countrySlice.types";
import type { Fighter } from "@/types/fighter.types";
import type { MainEvent } from "@/types/fightEvent.types";

import { describe, expect, it } from "vitest";

import countryReducer, {
  resetCountryData,
  setSelectedFighter,
} from "./countrySlice";
import { fetchCountry } from "./thunks";

const makeFighter = (id: string): Fighter => ({
  _id: id,
  name: `Fighter ${id}`,
  record: "10-0",
  nickName: "Nick",
  image: "",
  fightsCounter: 10,
});

const makeEvent = (id: number): MainEvent => ({
  id,
  idYt: `yt-${id}`,
  title: `Event ${id}`,
  description: "",
  tags: [],
  startTime: "2026-01-01T00:00:00.000Z",
});

const initialState: CountryState = {
  fighters: [],
  selectedFighter: null,
  mainEvents: [],
  topEvents: [],
  loading: false,
  error: null,
};

describe("countrySlice", () => {
  describe("reducers", () => {
    it("setSelectedFighter stores the payload", () => {
      const fighter = makeFighter("abc");
      const next = countryReducer(initialState, setSelectedFighter(fighter));
      expect(next.selectedFighter).toEqual(fighter);
    });

    it("setSelectedFighter with null clears the selection", () => {
      const prev: CountryState = {
        ...initialState,
        selectedFighter: makeFighter("abc"),
      };
      const next = countryReducer(prev, setSelectedFighter(null));
      expect(next.selectedFighter).toBeNull();
    });

    it("resetCountryData clears arrays and flags loading", () => {
      const prev: CountryState = {
        fighters: [makeFighter("a")],
        selectedFighter: makeFighter("a"),
        mainEvents: [makeEvent(1)],
        topEvents: [makeEvent(2)],
        loading: false,
        error: "previous",
      };
      const next = countryReducer(prev, resetCountryData());
      expect(next).toEqual({
        fighters: [],
        selectedFighter: null,
        mainEvents: [],
        topEvents: [],
        loading: true,
        error: null,
      });
    });
  });

  describe("fetchCountry extraReducers", () => {
    it("pending sets loading and clears error", () => {
      const prev: CountryState = { ...initialState, error: "prior" };
      const action = { type: fetchCountry.pending.type };
      const next = countryReducer(prev, action);
      expect(next.loading).toBe(true);
      expect(next.error).toBeNull();
    });

    it("fulfilled populates fighters, mainEvents, topEvents", () => {
      const payload = {
        topFighters: [makeFighter("a"), makeFighter("b")],
        allFights: [makeEvent(1), makeEvent(2)],
        topEvents: [makeEvent(3)],
      };
      const action = { type: fetchCountry.fulfilled.type, payload };
      const next = countryReducer(
        { ...initialState, loading: true },
        action
      );
      expect(next.loading).toBe(false);
      expect(next.fighters).toEqual(payload.topFighters);
      expect(next.mainEvents).toEqual(payload.allFights);
      expect(next.topEvents).toEqual(payload.topEvents);
    });

    it("rejected stores the error message and clears loading", () => {
      const action = {
        type: fetchCountry.rejected.type,
        payload: "boom",
      };
      const next = countryReducer(
        { ...initialState, loading: true },
        action
      );
      expect(next.loading).toBe(false);
      expect(next.error).toBe("boom");
    });
  });
});
