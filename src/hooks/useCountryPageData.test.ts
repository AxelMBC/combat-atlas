import type { ReactNode } from 'react';
import type { CountryDataResponse } from '@/types/country.types';
import type { Fighter } from '@/types/fighter.types';
import type { MainEvent } from '@/types/fightEvent.types';

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { createElement } from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

import countryReducer from '@/store/country/countrySlice';
import eventIngestionReducer from '@/store/eventIngestion/eventIngestionSlice';
import { getCountryData } from '@/services/country.service';
import { useCountryPageData } from './useCountryPageData';

vi.mock('@/services/country.service', () => ({
  getCountryData: vi.fn(),
}));

const mockedGetCountryData = vi.mocked(getCountryData);

const makeFighter = (id: string, image: string): Fighter => ({
  _id: id,
  name: `Fighter ${id}`,
  record: '10-0',
  nickName: 'Nick',
  image,
  fightsCounter: 10,
});

const makeEvent = (id: number, thumbnail?: string): MainEvent => ({
  id,
  idYt: `yt-${id}`,
  title: `Event ${id}`,
  description: '',
  tags: [],
  startTime: '0',
  ...(thumbnail && { thumbnail }),
});

const makePayload = (): CountryDataResponse => ({
  topFighters: [makeFighter('a', 'julio'), makeFighter('b', 'canelo')],
  allFights: [makeEvent(1), makeEvent(2)],
  topEvents: [makeEvent(3, 'thumb-key'), makeEvent(4)],
});

const makeStore = () =>
  configureStore({
    reducer: {
      country: countryReducer,
      eventIngestion: eventIngestionReducer,
    },
  });

const renderCountryHook = (slug: string, options?: Parameters<typeof useCountryPageData>[1]) => {
  const store = makeStore();
  const wrapper = ({ children }: { children: ReactNode }) =>
    createElement(Provider, { store, children });
  return renderHook(() => useCountryPageData(slug, options), { wrapper });
};

describe('useCountryPageData', () => {
  beforeEach(() => {
    sessionStorage.clear();
    mockedGetCountryData.mockReset();
  });

  it('fetches on mount and exposes the country data', async () => {
    mockedGetCountryData.mockResolvedValueOnce(makePayload());

    const { result } = renderCountryHook('mexico');

    expect(result.current.loading).toBe(true);

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(mockedGetCountryData).toHaveBeenCalledWith('mexico');
    expect(result.current.fightersList).toHaveLength(2);
    expect(result.current.mainEvents).toHaveLength(2);
    expect(result.current.topFightsList).toHaveLength(2);
    expect(result.current.error).toBeNull();
  });

  it('applies the image and thumbnail resolvers', async () => {
    mockedGetCountryData.mockResolvedValueOnce(makePayload());

    const { result } = renderCountryHook('thailand', {
      resolveFighterImage: (filename) => `/img/${filename}.webp`,
      resolveTopFightThumbnail: (filename) => `/thumbs/${filename}.jpg`,
    });

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.fightersList.map((f) => f.image)).toEqual([
      '/img/julio.webp',
      '/img/canelo.webp',
    ]);
    expect(result.current.topFightsList[0].thumbnail).toBe('/thumbs/thumb-key.jpg');
    expect(result.current.topFightsList[1].thumbnail).toBeUndefined();
  });

  it('stores the error key on failure and refetches via retry', async () => {
    mockedGetCountryData.mockRejectedValueOnce(new Error('network down'));

    const { result } = renderCountryHook('mexico');

    await waitFor(() => expect(result.current.error).toBe('error.countryData'));
    expect(result.current.loading).toBe(false);

    mockedGetCountryData.mockResolvedValueOnce(makePayload());

    act(() => result.current.retry());

    await waitFor(() => expect(result.current.error).toBeNull());
    expect(result.current.fightersList).toHaveLength(2);
    expect(mockedGetCountryData).toHaveBeenCalledTimes(2);
  });
});
