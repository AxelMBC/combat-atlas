import type { CountryDataResponse, CountrySummary } from '@/types/country.types';

import { beforeEach, describe, expect, it, vi } from 'vitest';

import { getCountryData, getCountrySummaries } from '@/services/country.service';
import { loadCountryData, loadCountrySummaries, prefetchCountryData } from './countryDataCache';

vi.mock('@/services/country.service', () => ({
  getCountryData: vi.fn(),
  getCountrySummaries: vi.fn(),
}));

const mockedGetCountryData = vi.mocked(getCountryData);
const mockedGetCountrySummaries = vi.mocked(getCountrySummaries);

const SUMMARIES: CountrySummary[] = [{ slug: 'thailand', fightIds: ['t1', 't2'] }];
const SUMMARIES_TTL_MS = 30 * 60 * 1000;

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
    mockedGetCountrySummaries.mockReset();
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

  describe('loadCountrySummaries', () => {
    it('serves a fresh cached summary without a request', async () => {
      sessionStorage.setItem(
        'country_summaries',
        JSON.stringify({ data: SUMMARIES, fetchedAt: Date.now() }),
      );

      await expect(loadCountrySummaries()).resolves.toEqual(SUMMARIES);
      expect(mockedGetCountrySummaries).not.toHaveBeenCalled();
    });

    it('requests again once the cached summary is older than 30 minutes', async () => {
      sessionStorage.setItem(
        'country_summaries',
        JSON.stringify({ data: [], fetchedAt: Date.now() - SUMMARIES_TTL_MS - 1 }),
      );
      mockedGetCountrySummaries.mockResolvedValueOnce(SUMMARIES);

      await expect(loadCountrySummaries()).resolves.toEqual(SUMMARIES);
      expect(mockedGetCountrySummaries).toHaveBeenCalledTimes(1);
      expect(JSON.parse(sessionStorage.getItem('country_summaries') ?? 'null')).toMatchObject({
        data: SUMMARIES,
      });
    });

    it('shares one request between concurrent loads', async () => {
      mockedGetCountrySummaries.mockResolvedValueOnce(SUMMARIES);

      const [first, second] = await Promise.all([loadCountrySummaries(), loadCountrySummaries()]);

      expect(mockedGetCountrySummaries).toHaveBeenCalledTimes(1);
      expect(first).toEqual(SUMMARIES);
      expect(second).toEqual(SUMMARIES);
    });

    it('requests again after a failed load', async () => {
      mockedGetCountrySummaries.mockRejectedValueOnce(new Error('404'));
      mockedGetCountrySummaries.mockResolvedValueOnce(SUMMARIES);

      await expect(loadCountrySummaries()).rejects.toThrow('404');
      await expect(loadCountrySummaries()).resolves.toEqual(SUMMARIES);
      expect(mockedGetCountrySummaries).toHaveBeenCalledTimes(2);
    });
  });
});
