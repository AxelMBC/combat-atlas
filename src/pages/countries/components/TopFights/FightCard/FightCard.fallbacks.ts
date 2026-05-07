import type { FightDecision, FightVenue } from '@/types/fightEvent.types';

export interface FightFallback {
  year?: string;
  dateLabel?: string;
  venue?: FightVenue;
  organization?: string;
  weightClass?: string;
  decision?: FightDecision;
  fighterRed?: string;
  fighterBlue?: string;
}

export const FIGHT_FALLBACKS: Record<string, FightFallback> = {
  // Ricardo López vs Hideyuki Ohashi
  ricardoLopezOhashi: {
    year: "'90",
    dateLabel: 'MAR 1990',
    venue: { city: 'Tokyo', country: 'JP' },
    organization: 'WBC',
    weightClass: 'Mini Mosca',
    decision: {
      method: 'KO Téc.',
      round: 12,
      winnerLastName: 'López',
      duration: '36:21',
    },
  },
  // Julio César Chávez vs Meldrick Taylor I
  chavezMeldrick: {
    year: "'90",
    dateLabel: 'MAR 1990',
    venue: { city: 'Las Vegas', country: 'US' },
    organization: 'IBF/WBC',
    weightClass: 'Súper Ligero',
    decision: {
      method: 'KO Téc.',
      round: 12,
      winnerLastName: 'Chávez',
      duration: '38:55',
    },
  },
  // Canelo Álvarez vs Billy Saunders
  caneloSaunders: {
    year: "'21",
    dateLabel: 'MAY 2021',
    venue: { city: 'Arlington', country: 'US' },
    organization: 'S. Mediano',
    weightClass: 'Unificación',
    decision: {
      method: 'Decisión',
      round: 'Unánime',
      winnerLastName: 'Álvarez',
      duration: '36:00',
    },
  },
  // Julio César Chávez vs Juan Laporte
  chavezLaporte: {
    year: "'95",
    dateLabel: 'SEP 1995',
    venue: { city: 'El Paso', country: 'US' },
    organization: 'WBC',
    weightClass: 'Súper Ligero',
    decision: {
      method: 'Decisión',
      round: 'Mayoritaria',
      winnerLastName: 'Chávez',
      duration: '42:10',
    },
  },
  // Juan Manuel Márquez vs Marco Antonio Barrera
  marquezBarrera: {
    year: "'07",
    dateLabel: 'MAR 2007',
    venue: { city: 'Las Vegas', country: 'US' },
    organization: 'WBC',
    weightClass: 'Súper Pluma',
    decision: {
      method: 'Decisión',
      round: 'Dividida',
      winnerLastName: 'Márquez',
      duration: '38:50',
    },
  },
  // Canelo Álvarez vs Gennadiy Golovkin III
  caneloGGG3: {
    year: "'22",
    dateLabel: 'SEP 2022',
    venue: { city: 'Las Vegas', country: 'US' },
    organization: 'S. Mediano',
    weightClass: 'Indiscutido',
    decision: {
      method: 'Decisión',
      round: 'Unánime',
      winnerLastName: 'Golovkin',
      duration: '41:30',
    },
  },
};

const TITLE_FALLBACK_KEYS: Array<{ match: RegExp; key: string }> = [
  { match: /lopez.*ohashi|l(ó|o)pez.*ohashi/i, key: 'ricardoLopezOhashi' },
  { match: /ch(á|a)vez.*meldrick|ch(á|a)vez.*taylor/i, key: 'chavezMeldrick' },
  { match: /canelo.*saunders|(á|a)lvarez.*saunders/i, key: 'caneloSaunders' },
  { match: /ch(á|a)vez.*laporte/i, key: 'chavezLaporte' },
  { match: /m(á|a)rquez.*barrera/i, key: 'marquezBarrera' },
  { match: /canelo.*golovkin|(á|a)lvarez.*golovkin|canelo.*ggg/i, key: 'caneloGGG3' },
];

export const resolveFallback = (title: string): FightFallback | undefined => {
  const entry = TITLE_FALLBACK_KEYS.find(({ match }) => match.test(title));
  return entry ? FIGHT_FALLBACKS[entry.key] : undefined;
};
