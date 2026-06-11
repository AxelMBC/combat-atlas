import type { Language } from '@/i18n';
import type { MainEvent } from '@/types/fightEvent.types';
import type { CountryStats } from './CinematicHero.types';

import { resolveLocalizedTags } from '@/utils/resolveLocalizedField';

export const getCountryStats = (fights: MainEvent[], language: Language): CountryStats => {
  const cities = new Set<string>();
  const disciplines = new Set<string>();

  for (const fight of fights) {
    const city = fight.venue?.city ?? fight.location;
    if (city) cities.add(city);

    const discipline = fight.type ?? resolveLocalizedTags(fight.tags, language)[0];
    if (discipline) disciplines.add(discipline);
  }

  return {
    fightsCount: fights.length,
    cities: [...cities],
    disciplines: [...disciplines],
  };
};
