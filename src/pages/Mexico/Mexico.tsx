import { useSelector } from "react-redux";
import { selectFightersState } from "@/store/Fighters";
import { selectMainEventsState } from "@/store/MainEvents";

// Config
import { theme } from "./config/mexicoTheme";
import { mexicoConfig } from "./config/mexico.config";

// Components
import CountryPage from "@/components/CountryPage/CountryPage";
import { selectTopEventsState } from "@/store/TopEvents";

const Mexico = () => {
  const { fightersList } = useSelector(selectFightersState);
  const { mainEventsList } = useSelector(selectMainEventsState);
  const { topEventsList } = useSelector(selectTopEventsState);

  return (
    <CountryPage
      theme={theme}
      config={mexicoConfig}
      mainEventFights={mainEventsList}
      topFightersData={fightersList}
      topEventsList={topEventsList}
    />
  );
};

export default Mexico;
