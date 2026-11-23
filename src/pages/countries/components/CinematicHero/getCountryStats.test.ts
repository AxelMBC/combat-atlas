import { describe, expect, it } from 'vitest';

import type { MainEvent } from '@/types/fightEvent.types';

import { getCountryStats } from './getCountryStats';

const baseFight = (overrides: Partial<MainEvent>): MainEvent => ({
  _id: 'fight-1',
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
      baseFight({ _id: 'fight-1', venue: { city: 'CDMX', country: 'MX' } }),
      baseFight({ _id: 'fight-2', venue: { city: 'CDMX', country: 'MX' } }),
      baseFight({ _id: 'fight-3', venue: { city: 'Guadalajara', country: 'MX' } }),
    ];

    const stats = getCountryStats(fights, 'es');

    expect(stats.fightsCount).toBe(3);
    expect(stats.cities).toEqual(['CDMX', 'Guadalajara']);
  });

  it('uses the same city as the title card when location and venue city differ', () => {
    const fights = [
      baseFight({ location: 'Las Vegas', venue: { city: 'Paradise', country: 'USA' } }),
    ];

    expect(getCountryStats(fights, 'es').cities).toEqual(['Las Vegas']);
  });

  it('falls back to location when venue is missing', () => {
    const fights = [baseFight({ location: 'Monterrey' })];

    expect(getCountryStats(fights, 'es').cities).toEqual(['Monterrey']);
  });

  it('collects disciplines from type with localized tag fallback', () => {
    const fights = [
      baseFight({ _id: 'fight-1', type: 'Box' }),
      baseFight({ _id: 'fight-2', tags: { es: ['Muay Thai'], en: ['Muay Thai'] } }),
      baseFight({ _id: 'fight-3', tags: ['MMA'] }),
      baseFight({ _id: 'fight-4', type: 'Box' }),
    ];

    expect(getCountryStats(fights, 'es').disciplines).toEqual(['Box', 'Muay Thai', 'MMA']);
  });

  it('resolves tag disciplines per language', () => {
    const fights = [baseFight({ tags: { es: ['Boxeo'], en: ['Boxing'] } })];

    expect(getCountryStats(fights, 'es').disciplines).toEqual(['Boxeo']);
    expect(getCountryStats(fights, 'en').disciplines).toEqual(['Boxing']);
  });

  it('omits cities and disciplines when data is missing', () => {
    const fights = [baseFight({}), baseFight({ _id: 'fight-2' })];

    const stats = getCountryStats(fights, 'es');

    expect(stats.fightsCount).toBe(2);
    expect(stats.cities).toEqual([]);
    expect(stats.disciplines).toEqual([]);
  });
});
