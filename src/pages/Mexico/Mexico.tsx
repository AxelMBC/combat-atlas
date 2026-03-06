import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "@/store";

import { fetchCountry } from "@/store/country/thunks";
import { selectFightersState } from "@/store/Fighters";
import { selectMainEventsState } from "@/store/MainEvents";
import { selectTopEventsState } from "@/store/TopEvents";

import "@/styles/fonts/default.scss";
import { theme } from "./config/mexicoTheme";
import { mexicoConfig } from "./config/mexico.config";
import CountryPage from "@/components/CountryPage/CountryPage";

const Mexico = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { fightersList, loading, error } = useSelector(selectFightersState);
  const { mainEventsList } = useSelector(selectMainEventsState);
  const { topEventsList } = useSelector(selectTopEventsState);

  useEffect(() => {
    dispatch(fetchCountry("mexico"));
  }, [dispatch]);

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

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
