import type { Language } from '@/i18n';
import type { MainEvent } from '@/types/fightEvent.types';
import type { CountryStats } from './CinematicHero.types';

import { getFightCity, getFightDiscipline } from '@/utils/fightBilling';

export const getCountryStats = (fights: MainEvent[], language: Language): CountryStats => {
  const cities = new Set<string>();
  const disciplines = new Set<string>();

  for (const fight of fights) {
    const city = getFightCity(fight);
    if (city) cities.add(city);

    const discipline = getFightDiscipline(fight, language);
    if (discipline) disciplines.add(discipline);
  }

  return {
    fightsCount: fights.length,
    cities: [...cities],
    disciplines: [...disciplines],
  };
};
