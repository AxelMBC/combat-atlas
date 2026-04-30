// Data
import { topFightersData } from "./data/topFightersList";
import { topEvents } from "./data/topEventsList";
import { mainEventFights } from "./data/allEventsList";

// Config
import "@/styles/fonts/default.scss";
import { countryConfig } from "./config/country.config";
import { theme } from "./config/countryTheme";

// Components
import CountryPage from "@/pages/countries/components/CountryPage/CountryPage";

const CountryTemplate = () => {
  return (
    <CountryPage
      theme={theme}
      config={countryConfig}
      topFightersData={topFightersData}
      topEventsList={topEvents}
      mainEventFights={mainEventFights}
    />
  );
};

export default CountryTemplate;
