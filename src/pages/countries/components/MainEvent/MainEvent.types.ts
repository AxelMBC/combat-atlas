import type { MainEvent } from '@/types/fightEvent.types';
import type { CountryPageConfig } from '@/pages/countries/components/CountryPage/CountryPage.types';

export interface MainEventProps {
  config: CountryPageConfig;
  loading: boolean;
  error: string | null;
  mainVideo: MainEvent | null;
  fetchMainVideo: () => void;
}
