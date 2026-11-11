import { createTheme, type Theme } from '@mui/material/styles';
import type { CountryPageConfig } from '@/pages/countries/components/CountryPage/CountryPage.types';

import './muiPalette.types';
import { getSurfacePalette } from './createAppTheme';
import type { ThemeMode } from './themeMode.types';
import { BODY_FONT, HEADLINE_FONT } from '@/styles/fonts/newspaperFonts';

export const createCountryTheme = (config: CountryPageConfig, mode: ThemeMode): Theme =>
  createTheme({
    typography: {
      fontFamily: BODY_FONT,
      h1: { fontFamily: HEADLINE_FONT },
      h2: { fontFamily: HEADLINE_FONT },
      h3: { fontFamily: HEADLINE_FONT },
      body1: { fontFamily: BODY_FONT },
      button: { fontFamily: HEADLINE_FONT },
    },
    palette: {
      mode,
      surfaces: getSurfacePalette(mode),
      primary: {
        main: config.colorPalette.primary,
        dark: config.colorPalette.primaryDark,
      },
      secondary: {
        main: config.colorPalette.secondary,
      },
      text: {
        primary: config.colorPalette.textPrimary,
        secondary: config.colorPalette.textSecondary,
      },
      background: { default: config.colorPalette.white },
      info: { main: config.colorPalette.info },
      common: { black: config.colorPalette.black },
    },
  });
