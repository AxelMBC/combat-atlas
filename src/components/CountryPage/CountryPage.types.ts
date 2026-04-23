import type { Theme } from "@mui/material/styles";
import type { Fighter } from "@/types/fighter.types";
import type { MainEvent } from "@/types/fightEvent.types";

export interface ColorPalette {
  primary: string;
  primaryDark: string;
  secondary: string;
  white?: string;
  error: string;
  textPrimary?: string;
  textSecondary?: string;
  info: string;
  black: string;
}

export interface CountryPageConfig {
  countryName: string;
  themeClassName: string;
  headerTitle: string;
  topFightersTitle: string;
  topEventsTitle: string;
  colorPalette: ColorPalette;
  maxWidth: string;
  headerTitleFont?: string;
}

export interface CountryPageProps {
  config: CountryPageConfig;
  topFightersData: Fighter[];
  topEventsList: MainEvent[];
  mainEventFights: MainEvent[];
  theme: Theme;
}
