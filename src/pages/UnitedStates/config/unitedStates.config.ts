import type { CountryPageConfig } from '@/pages/countries/components/CountryPage/CountryPage.types';

export const unitedStatesConfig: CountryPageConfig = {
  countryNameKey: 'country.unitedStates.name',
  topFightersTitleKey: 'country.unitedStates.topFightersTitle',
  topEventsTitleKey: 'country.unitedStates.topEventsTitle',
  colorPalette: {
    primary: '#bf0a30',
    primaryDark: '#7a0414',
    secondary: '#002868',
    white: '#f2f2f2',
    textPrimary: '#0a0a0a',
    textSecondary: '#f2f2f2',
    error: '#d40000',
    info: '#818589',
    black: '#000',
  },
  maxWidth: '1120px',
};
