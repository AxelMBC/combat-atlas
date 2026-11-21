import type { CountryDataResponse } from '@/types/country.types';
import type { SessionCache } from './countryDataCache.types';

import { getCountryData } from '@/services/country.service';

const TTL_MS = 30 * 60 * 1000;

const inFlightRequests = new Map<string, Promise<CountryDataResponse>>();

const readCache = (slug: string): SessionCache['data'] | null => {
  try {
    const raw = sessionStorage.getItem(`country_${slug}`);
    if (!raw) return null;

    const cached: SessionCache = JSON.parse(raw);
    const isExpired = Date.now() - cached.fetchedAt > TTL_MS;

    if (isExpired) {
      sessionStorage.removeItem(`country_${slug}`);
      return null;
    }

    return cached.data;
  } catch {
    return null;
  }
};

const writeCache = (slug: string, data: SessionCache['data']): boolean => {
  try {
    const payload: SessionCache = { data, fetchedAt: Date.now() };
    sessionStorage.setItem(`country_${slug}`, JSON.stringify(payload));
    return true;
  } catch {
    return false;
  }
};

export const loadCountryData = (slug: string): Promise<CountryDataResponse> => {
  const cached = readCache(slug);
  if (cached) return Promise.resolve(cached);

  const inFlight = inFlightRequests.get(slug);
  if (inFlight) return inFlight;

  const request = getCountryData(slug)
    .then((data) => {
      writeCache(slug, data);
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
