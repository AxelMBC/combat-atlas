import type { CountryEntry } from '@/pages/countries/registry.types';

import { describe, expect, it } from 'vitest';

import { pickRandomCountry } from './pickRandomCountry';

const makeEntry = (slug: string): CountryEntry => ({
  slug,
  nameKey: 'country.mexico.name',
  disciplineKey: 'country.mexico.discipline',
  isoCode: slug.slice(0, 2).toUpperCase(),
  center: { lat: 0, lng: 0 },
  accentColor: '#000000',
  loader: () => Promise.resolve({ default: () => null }),
});

const ENTRIES = [makeEntry('mexico'), makeEntry('thailand'), makeEntry('united-states')];

describe('pickRandomCountry', () => {
  it('never picks the excluded country when others exist', () => {
    const picks = [0, 0.49, 0.5, 0.99].map((value) =>
      pickRandomCountry(ENTRIES, 'thailand', () => value),
    );

    expect(picks.map(({ slug }) => slug)).toEqual([
      'mexico',
      'mexico',
      'united-states',
      'united-states',
    ]);
  });

  it('picks the only country even when it is excluded', () => {
    const [onlyEntry] = ENTRIES;

    expect(pickRandomCountry([onlyEntry], onlyEntry.slug, () => 0.7)).toBe(onlyEntry);
  });
});
