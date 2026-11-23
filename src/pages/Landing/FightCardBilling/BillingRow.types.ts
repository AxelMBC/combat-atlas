import type { CountryEntry } from '@/pages/countries/registry.types';
import type { CountryFightCount } from '@/pages/Landing/useCountryFightCounts.types';
import type {
  CountryActivateHandler,
  CountryIntentHandler,
  CountryPressHandler,
} from './FightCardBilling.types';

export interface BillingRowProps {
  entry: CountryEntry;
  position: number;
  isSelected: boolean;
  fightCount: CountryFightCount | undefined;
  reduceMotion: boolean;
  onIntent: CountryIntentHandler;
  onPress: CountryPressHandler;
  onActivate: CountryActivateHandler;
}
