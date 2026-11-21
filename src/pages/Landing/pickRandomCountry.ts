import type { CountryEntry } from '@/pages/countries/registry.types';

export const pickRandomCountry = (
  entries: readonly CountryEntry[],
  excludeSlug: string,
  random: () => number = Math.random,
): CountryEntry => {
  const candidates =
    entries.length > 1 ? entries.filter(({ slug }) => slug !== excludeSlug) : entries;
  return candidates[Math.floor(random() * candidates.length)];
};
