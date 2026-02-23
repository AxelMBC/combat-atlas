export interface mainEvent {
  id: number;
  idYt: string;
  title: string;
  description: string;
  tags: string[] | [];
  startTime: string;
  fighterId?: string;
  fighterBlue?: string;
  fighterRed?: string;
  thumbnail?: string;
}
