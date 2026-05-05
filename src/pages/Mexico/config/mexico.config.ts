import type { CountryPageConfig } from '@/pages/countries/components/CountryPage/CountryPage.types';

export const mexicoConfig: CountryPageConfig = {
  countryName: 'Mexico',
  themeClassName: 'mexico-theme',
  headerTitleKey: 'country.mexico.headerTitle',
  countryNameKey: 'country.mexico.name',
  topFightersTitleKey: 'country.mexico.topFightersTitle',
  topEventsTitleKey: 'country.mexico.topEventsTitle',
  colorPalette: {
    primary: '#ca2626',
    primaryDark: '#780606',
    secondary: '#26c954',
    white: '#f2f2f2',
    textPrimary: '#031602',
    textSecondary: '#f2f2f2',
    error: '#d40000',
    info: '#818589',
    black: '#000',
  },
  maxWidth: '1120px',
};
