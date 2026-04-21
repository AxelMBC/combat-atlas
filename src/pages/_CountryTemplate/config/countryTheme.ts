import { createTheme } from "@mui/material/styles";
import { countryConfig } from "./country.config";

export const theme = createTheme({
  typography: {
    fontFamily: countryConfig.bodyFont,
    h1: { fontFamily: countryConfig.titleFont },
    h2: { fontFamily: countryConfig.titleFont },
    h3: { fontFamily: countryConfig.titleFont },
    body1: { fontFamily: countryConfig.bodyFont },
    button: { fontFamily: countryConfig.buttonFont },
  },
  palette: {
    primary: {
      main: countryConfig.colorPalette.primary,
      dark: countryConfig.colorPalette.primaryDark,
    },
    text: {
      primary: countryConfig.colorPalette.textPrimary,
      secondary: countryConfig.colorPalette.textSecondary,
    },
    background: {
      default: countryConfig.colorPalette.white,
    },
    common: {
      black: countryConfig.colorPalette.black,
    },
  },
});
