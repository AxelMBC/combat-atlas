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

export interface MainEvent {
  id: number;
  idYt: string;
  title: string;
  description: string;
  tags: string[] | [];
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
  venue?: FightVenue;
  organization?: string;
  weightClass?: string;
  decision?: FightDecision;
}
