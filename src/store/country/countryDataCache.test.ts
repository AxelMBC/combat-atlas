import type { CountryDataResponse } from '@/types/country.types';

import { beforeEach, describe, expect, it, vi } from 'vitest';

import { getCountryData } from '@/services/country.service';
import { loadCountryData, prefetchCountryData } from './countryDataCache';

vi.mock('@/services/country.service', () => ({
  getCountryData: vi.fn(),
}));

const mockedGetCountryData = vi.mocked(getCountryData);

const makePayload = (): CountryDataResponse => ({
  topFighters: [],
  allFights: [],
  topEvents: [],
});

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0));

describe('countryDataCache', () => {
  beforeEach(() => {
    sessionStorage.clear();
    mockedGetCountryData.mockReset();
  });

  it('shares one request between concurrent loads of the same country', async () => {
    const payload = makePayload();
    mockedGetCountryData.mockResolvedValueOnce(payload);

    const [first, second] = await Promise.all([
      loadCountryData('mexico'),
      loadCountryData('mexico'),
    ]);

    expect(mockedGetCountryData).toHaveBeenCalledTimes(1);
    expect(first).toEqual(payload);
    expect(second).toEqual(payload);
  });

  it('swallows a failed prefetch and requests again on the next load', async () => {
    const payload = makePayload();
    mockedGetCountryData.mockRejectedValueOnce(new Error('network down'));
    mockedGetCountryData.mockResolvedValueOnce(payload);

    prefetchCountryData('thailand');
    await flushPromises();

    await expect(loadCountryData('thailand')).resolves.toEqual(payload);
    expect(mockedGetCountryData).toHaveBeenCalledTimes(2);
  });

  it('serves a fresh cache entry without a request', async () => {
    const payload = makePayload();
    sessionStorage.setItem(
      'country_united-states',
      JSON.stringify({ data: payload, fetchedAt: Date.now() }),
    );

    await expect(loadCountryData('united-states')).resolves.toEqual(payload);
    expect(mockedGetCountryData).not.toHaveBeenCalled();
  });
});
