import type { MainEvent } from '@/types/fightEvent.types';

import caneloVsGolovkinIiiImg from './canelo_vs_golovkin_iii.webp';
import caneloVsSaundersImg from './canelo_vs_saunders.webp';
import chavezVsLaporteImg from './chavez_vs_laporte.webp';
import chavezVsTaylorIImg from './chavez_vs_taylor_i.webp';
import marquezVsBarreraImg from './marquez_vs_barrera.webp';
import ricardoLopezVsHideyukiOhashiImg from './ricardo_lopez_vs_hideyuki_ohashi.webp';

const topFightPostersByIdYt: Record<string, string> = {
  '6rZCJGsoGxI': caneloVsGolovkinIiiImg,
  FpsGoanw4S4: caneloVsSaundersImg,
  '12J_QOE0esU': chavezVsLaporteImg,
  LQYscDiQUS8: chavezVsTaylorIImg,
  n9gRn6h6mDk: marquezVsBarreraImg,
  gdqZIabo2qI: ricardoLopezVsHideyukiOhashiImg,
};

export const getTopFightPoster = (fight: MainEvent): string | undefined =>
  topFightPostersByIdYt[fight.idYt];
