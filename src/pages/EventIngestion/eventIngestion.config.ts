import type { CountryOption } from './eventIngestion.config.types';

import { countryRegistry } from '@/pages/countries/registry';

export const COUNTRY_OPTIONS: CountryOption[] = countryRegistry.map(({ slug, nameKey }) => ({
  slug,
  labelKey: nameKey,
}));

export const YT_ID_REGEX = /^[a-zA-Z0-9_-]{11}$/;

export const VALIDATION_RULES = {
  title: { min: 3, max: 200 },
  description: { min: 10, max: 1000 },
  tags: { max: 10 },
  startTime: { min: 0 },
} as const;
