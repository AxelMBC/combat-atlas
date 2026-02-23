import { createTheme } from "@mui/material/styles";
import { thailandConfig } from "./thailand.config";

export const theme = createTheme({
  typography: {
    fontFamily: thailandConfig.bodyFont,
    h1: {
      fontFamily: thailandConfig.titleFont,
    },
    h2: {
      fontFamily: thailandConfig.titleFont,
    },
    h3: {
      fontFamily: thailandConfig.titleFont,
    },
    body1: {
      fontFamily: thailandConfig.bodyFont,
    },
    button: {
      fontFamily: thailandConfig.buttonFont,
    },
  },
  palette: {
    primary: {
      main: thailandConfig.colorPalette.primary,
      dark: thailandConfig.colorPalette.primaryDark,
    },
    secondary: {
      main: thailandConfig.colorPalette.secondary,
    },
    text: {
      primary: thailandConfig.colorPalette.textPrimary,
      secondary: thailandConfig.colorPalette.textSecondary,
    },
    background: {
      default: thailandConfig.colorPalette.white,
    },
  },
});
