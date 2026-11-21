import type { CountryEntry } from '@/pages/countries/registry.types';
import type {
  CountryActivateHandler,
  CountryIntentHandler,
  CountryPressHandler,
} from './FightCardBilling.types';

export interface BillingRowProps {
  entry: CountryEntry;
  position: number;
  isSelected: boolean;
  reduceMotion: boolean;
  onIntent: CountryIntentHandler;
  onPress: CountryPressHandler;
  onActivate: CountryActivateHandler;
}
