// Data
import { topFightersData } from "./data/topFightersList";
import { topEvents } from "./data/topEventsList";
import { mainEventFights } from "./data/allEventsList";

// Config
import "@/styles/fonts/default.scss";
import { thailandConfig } from "./config/thailand.config";
import { theme } from "./config/thailandTheme";

// Components
import CountryPage from "@/components/CountryPage/CountryPage";

const Thailand = () => {
  return (
    <CountryPage
      theme={theme}
      config={thailandConfig}
      topFightersData={topFightersData}
      topEventsList={topEvents}
      mainEventFights={mainEventFights}
    />
  );
};

export default Thailand;
