import { createTheme } from "@mui/material/styles";
import { mexicoConfig } from "./mexico.config";

export const theme = createTheme({
  typography: {
    fontFamily: mexicoConfig.bodyFont,
    h1: {
      fontFamily: mexicoConfig.titleFont,
    },
    h2: {
      fontFamily: mexicoConfig.titleFont,
    },
    h3: {
      fontFamily: mexicoConfig.titleFont,
    },
    body1: {
      fontFamily: mexicoConfig.bodyFont,
    },
    button: {
      fontFamily: mexicoConfig.buttonFont,
    },
  },
  palette: {
    primary: {
      main: mexicoConfig.colorPalette.primary,
      dark: mexicoConfig.colorPalette.primaryDark,
    },
    secondary: {
      main: mexicoConfig.colorPalette.secondary,
    },
    text: {
      primary: mexicoConfig.colorPalette.textPrimary,
      secondary: mexicoConfig.colorPalette.textSecondary,
    },
    background: {
      default: mexicoConfig.colorPalette.white,
    },
    info: {
      main: mexicoConfig.colorPalette.info,
    },
  },
});
