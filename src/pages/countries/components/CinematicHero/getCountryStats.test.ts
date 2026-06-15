import { describe, expect, it } from 'vitest';

import type { MainEvent } from '@/types/fightEvent.types';

import { getCountryStats } from './getCountryStats';

const baseFight = (overrides: Partial<MainEvent>): MainEvent => ({
  id: 1,
  idYt: 'abcdefghijk',
  title: 'Fighter A vs Fighter B',
  description: 'desc',
  tags: [],
  startTime: '0',
  ...overrides,
});

describe('getCountryStats', () => {
  it('returns zero stats for an empty fight list', () => {
    expect(getCountryStats([], 'es')).toEqual({ fightsCount: 0, cities: [], disciplines: [] });
  });

  it('counts fights and deduplicates cities from venue', () => {
    const fights = [
      baseFight({ id: 1, venue: { city: 'CDMX', country: 'MX' } }),
      baseFight({ id: 2, venue: { city: 'CDMX', country: 'MX' } }),
      baseFight({ id: 3, venue: { city: 'Guadalajara', country: 'MX' } }),
    ];

    const stats = getCountryStats(fights, 'es');

    expect(stats.fightsCount).toBe(3);
    expect(stats.cities).toEqual(['CDMX', 'Guadalajara']);
  });

  it('falls back to location when venue is missing', () => {
    const fights = [baseFight({ location: 'Monterrey' })];

    expect(getCountryStats(fights, 'es').cities).toEqual(['Monterrey']);
  });

  it('collects disciplines from type with localized tag fallback', () => {
    const fights = [
      baseFight({ id: 1, type: 'Box' }),
      baseFight({ id: 2, tags: { es: ['Muay Thai'], en: ['Muay Thai'] } }),
      baseFight({ id: 3, tags: ['MMA'] }),
      baseFight({ id: 4, type: 'Box' }),
    ];

    expect(getCountryStats(fights, 'es').disciplines).toEqual(['Box', 'Muay Thai', 'MMA']);
  });

  it('resolves tag disciplines per language', () => {
    const fights = [baseFight({ tags: { es: ['Boxeo'], en: ['Boxing'] } })];

    expect(getCountryStats(fights, 'es').disciplines).toEqual(['Boxeo']);
    expect(getCountryStats(fights, 'en').disciplines).toEqual(['Boxing']);
  });

  it('omits cities and disciplines when data is missing', () => {
    const fights = [baseFight({}), baseFight({ id: 2 })];

    const stats = getCountryStats(fights, 'es');

    expect(stats.fightsCount).toBe(2);
    expect(stats.cities).toEqual([]);
    expect(stats.disciplines).toEqual([]);
  });
});
