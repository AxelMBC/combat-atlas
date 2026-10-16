import type { CountryState } from './countrySlice.types';
import type { Fighter } from '@/types/fighter.types';
import type { MainEvent } from '@/types/fightEvent.types';

import { describe, expect, it } from 'vitest';

import countryReducer, { resetCountryData } from './countrySlice';
import { fetchCountry } from './thunks';

const makeFighter = (id: string): Fighter => ({
  _id: id,
  name: `Fighter ${id}`,
  record: '10-0',
  nickName: 'Nick',
  image: '',
  fightsCounter: 10,
});

const makeEvent = (id: number): MainEvent => ({
  id,
  idYt: `yt-${id}`,
  title: `Event ${id}`,
  description: '',
  tags: [],
  startTime: '2026-01-01T00:00:00.000Z',
});

const initialState: CountryState = {
  fighters: [],
  mainEvents: [],
  topEvents: [],
  loading: false,
  error: null,
  requestId: null,
};

describe('countrySlice', () => {
  describe('reducers', () => {
    it('resetCountryData clears arrays and flags loading', () => {
      const prev: CountryState = {
        fighters: [makeFighter('a')],
        mainEvents: [makeEvent(1)],
        topEvents: [makeEvent(2)],
        loading: false,
        error: 'error.countryData',
        requestId: null,
      };
      const next = countryReducer(prev, resetCountryData());
      expect(next).toEqual({
        fighters: [],
        mainEvents: [],
        topEvents: [],
        loading: true,
        error: null,
        requestId: null,
      });
    });
  });

  describe('fetchCountry extraReducers', () => {
    const payload = {
      topFighters: [makeFighter('a'), makeFighter('b')],
      allFights: [makeEvent(1), makeEvent(2)],
      topEvents: [makeEvent(3)],
    };
    const inFlight: CountryState = { ...initialState, loading: true, requestId: 'req-1' };

    it('pending sets loading, clears error and records the request id', () => {
      const prev: CountryState = { ...initialState, error: 'error.countryData' };
      const next = countryReducer(prev, fetchCountry.pending('req-1', 'mexico'));
      expect(next.loading).toBe(true);
      expect(next.error).toBeNull();
      expect(next.requestId).toBe('req-1');
    });

    it('fulfilled populates fighters, mainEvents, topEvents', () => {
      const next = countryReducer(inFlight, fetchCountry.fulfilled(payload, 'req-1', 'mexico'));
      expect(next.loading).toBe(false);
      expect(next.fighters).toEqual(payload.topFighters);
      expect(next.mainEvents).toEqual(payload.allFights);
      expect(next.topEvents).toEqual(payload.topEvents);
    });

    it('rejected stores the error key and clears loading', () => {
      const next = countryReducer(
        inFlight,
        fetchCountry.rejected(null, 'req-1', 'mexico', 'error.countryData'),
      );
      expect(next.loading).toBe(false);
      expect(next.error).toBe('error.countryData');
    });

    it('ignores a fulfilled response from a superseded request', () => {
      const next = countryReducer(inFlight, fetchCountry.fulfilled(payload, 'req-0', 'mexico'));
      expect(next).toEqual(inFlight);
    });

    it('ignores a rejection from a superseded request', () => {
      const next = countryReducer(
        inFlight,
        fetchCountry.rejected(null, 'req-0', 'mexico', 'error.countryData'),
      );
      expect(next).toEqual(inFlight);
    });
  });
});
