import type { Theme } from "@mui/material/styles";
import type { fighter } from "@/types/fighter.type";
import type { mainEvent } from "@/types/fightEvent.type";

export interface ColorPalette {
  primary: string;
  primaryDark: string;
  primaryLight: string;
  secondary: string;
  secondaryDark: string;
  background: string;
  white?: string;
  error: string;
  textPrimary?: string;
  textSecondary?: string;
  info: string;
}

export interface CountryPageConfig {
  countryName: string;
  themeClassName: string;
  headerTitle: string;
  topFightersTitle: string;
  topEventsTitle: string;
  colorPalette: ColorPalette;
  maxWidth: string;
  bodyFont?: string;
  titleFont?: string;
  buttonFont?: string;
}

export interface CountryPageProps {
  config: CountryPageConfig;
  topFightersData: fighter[];
  topEventsList: mainEvent[];
  mainEventFights: mainEvent[];
  theme: Theme;
}
