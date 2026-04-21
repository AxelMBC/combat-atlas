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
}
