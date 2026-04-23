import { createTheme } from "@mui/material/styles";
import { unitedStatesConfig } from "./unitedStates.config";

export const theme = createTheme({
  typography: {
    fontFamily: unitedStatesConfig.bodyFont,
    h1: { fontFamily: unitedStatesConfig.titleFont },
    h2: { fontFamily: unitedStatesConfig.titleFont },
    h3: { fontFamily: unitedStatesConfig.titleFont },
    body1: { fontFamily: unitedStatesConfig.bodyFont },
    button: { fontFamily: unitedStatesConfig.buttonFont },
  },
  palette: {
    primary: {
      main: unitedStatesConfig.colorPalette.primary,
      dark: unitedStatesConfig.colorPalette.primaryDark,
    },
    text: {
      primary: unitedStatesConfig.colorPalette.textPrimary,
      secondary: unitedStatesConfig.colorPalette.textSecondary,
    },
    background: { default: unitedStatesConfig.colorPalette.white },
    info: { main: unitedStatesConfig.colorPalette.info },
    common: { black: unitedStatesConfig.colorPalette.black },
  },
});
