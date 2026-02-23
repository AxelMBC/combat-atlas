import type { CountryPageConfig } from "@/components/CountryPage/CountryPage.types";

export const mexicoConfig: CountryPageConfig = {
  countryName: "Mexico",
  themeClassName: "mexico-theme",
  headerTitle: "Boxeo al Estilo Mexicano",
  topFightersTitle: "Ídolos de México",
  topEventsTitle: "Peleas Históricas",
  colorPalette: {
    primary: "#ca2626",
    primaryDark: "#780606",
    primaryLight: "#8a3d3d",
    secondary: "#26c954",
    secondaryDark: "#3d744d",
    background: "#031602",
    white: "#f2f2f2",
    textPrimary: "#031602",
    textSecondary: "#f2f2f2",
    error: "#d40000",
    info: "#818589",
  },
  maxWidth: "1120px",
  titleFont: "Anton, sans-serif",
  bodyFont: '"Merriweather", serif',
  buttonFont: "Anton, sans-serif",
};
