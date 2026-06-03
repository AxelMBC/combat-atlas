export interface FightDecision {
  method: string;
  round?: number | string;
  winnerLastName?: string;
  duration?: string;
}

export interface FightVenue {
  city: string;
  country: string;
}

export interface FightDivision {
  text: {
    en: string;
    es: string;
  };
}

export type LocalizedString = string | { sp: string; en: string } | null;
export type LocalizedTags = string[] | { sp: string[]; en: string[] };

export interface MainEvent {
  id: number;
  idYt: string;
  title: string;
  description: LocalizedString;
  tags: LocalizedTags;
  startTime: string;
  fighterId?: string;
  fighterBlue?: string;
  fighterBlueId?: string;
  fighterRed?: string;
  fighterRedId?: string;
  thumbnail?: string;
  type?: string;
  year?: string;
  dateLabel?: string;
  location?: string;
  venue?: FightVenue;
  organization?: string;
  weightClass?: string;
  divisionId?: FightDivision;
  decision?: FightDecision;
}
