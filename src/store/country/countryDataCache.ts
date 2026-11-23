import type { CountryDataResponse, CountrySummary } from '@/types/country.types';
import type { SessionCache } from './countryDataCache.types';

import { getCountryData, getCountrySummaries } from '@/services/country.service';

const TTL_MS = 30 * 60 * 1000;
const COUNTRY_SUMMARIES_KEY = 'country_summaries';

const inFlightRequests = new Map<string, Promise<CountryDataResponse>>();
let inFlightSummaries: Promise<CountrySummary[]> | null = null;

const countryCacheKey = (slug: string) => `country_${slug}`;

const readCache = <T>(key: string): T | null => {
  try {
    const raw = sessionStorage.getItem(key);
    if (!raw) return null;

    const cached: SessionCache<T> = JSON.parse(raw);
    const isExpired = Date.now() - cached.fetchedAt > TTL_MS;

    if (isExpired) {
      sessionStorage.removeItem(key);
      return null;
    }

    return cached.data;
  } catch {
    return null;
  }
};

const writeCache = <T>(key: string, data: T): boolean => {
  try {
    const payload: SessionCache<T> = { data, fetchedAt: Date.now() };
    sessionStorage.setItem(key, JSON.stringify(payload));
    return true;
  } catch {
    return false;
  }
};

export const loadCountryData = (slug: string): Promise<CountryDataResponse> => {
  const cached = readCache<CountryDataResponse>(countryCacheKey(slug));
  if (cached) return Promise.resolve(cached);

  const inFlight = inFlightRequests.get(slug);
  if (inFlight) return inFlight;

  const request = getCountryData(slug)
    .then((data) => {
      writeCache(countryCacheKey(slug), data);
      return data;
    })
    .finally(() => {
      inFlightRequests.delete(slug);
    });

  inFlightRequests.set(slug, request);
  return request;
};

export const prefetchCountryData = (slug: string): void => {
  loadCountryData(slug).catch(() => {});
};

export const loadCountrySummaries = (): Promise<CountrySummary[]> => {
  const cached = readCache<CountrySummary[]>(COUNTRY_SUMMARIES_KEY);
  if (cached) return Promise.resolve(cached);

  if (inFlightSummaries) return inFlightSummaries;

  const request = getCountrySummaries()
    .then((summaries) => {
      writeCache(COUNTRY_SUMMARIES_KEY, summaries);
      return summaries;
    })
    .finally(() => {
      inFlightSummaries = null;
    });

  inFlightSummaries = request;
  return request;
};
