import type { CountryPageConfig } from "@/pages/countries/components/CountryPage/CountryPage.types";
import type { TranslationKey } from "@/i18n";

// Add matching entries to src/i18n/locales/{es,en}.ts and replace the casts.
export const countryConfig: CountryPageConfig = {
  countryName: "YourCountry",
  themeClassName: "yourcountry-theme",
  headerTitleKey: "country.yourCountry.headerTitle" as TranslationKey,
  topFightersTitleKey: "country.yourCountry.topFightersTitle" as TranslationKey,
  topEventsTitleKey: "country.yourCountry.topEventsTitle" as TranslationKey,
  colorPalette: {
    primary: "#000000",
    primaryDark: "#000000",
    secondary: "#000000",
    white: "#f2f2f2",
    textPrimary: "#031602",
    textSecondary: "#f2f2f2",
    error: "#d40000",
    info: "#818589",
    black: "#000000",
  },
  maxWidth: "1120px",
};
