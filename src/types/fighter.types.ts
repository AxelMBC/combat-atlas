export interface Fighter {
  _id: string;
  name: string;
  record: string;
  nickName: string;
  image: string;
  fightsCounter: number;
  cityState?: string;
  activePeriod?: string;
  kos?: number;
  totalFights?: number;
}
