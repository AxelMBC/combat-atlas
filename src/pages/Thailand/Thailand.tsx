import type { Fighter } from "@/types/fighter.types";
import { useEffect } from "react";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchCountry } from "@/store/country/thunks";
import { resetCountryData } from "@/store/country/countrySlice";
import { selectCountryState } from "@/store/country/countrySlice";

import { getFighterImage } from "./resources/fighters";

import "@/styles/fonts/default.scss";

import { theme } from "./config/thailandTheme";
import { thailandConfig } from "./config/thailand.config";

import CountryPage from "@/pages/countries/components/CountryPage";
import ErrorFallback from "@/components/ErrorFallback";
import Spinner from "@/components/Spinner";

const Thailand = () => {
  const dispatch = useAppDispatch();

  const { fighters, mainEvents, topEvents, loading, error } =
    useAppSelector(selectCountryState);

  const fightersList = fighters.map((fighter: Fighter) => ({
    ...fighter,
    image: getFighterImage(fighter.image),
  }));

  useEffect(() => {
    dispatch(resetCountryData());
    dispatch(fetchCountry("thailand"));
  }, [dispatch]);

  if (loading) return <Spinner label="CARGANDO" />;

  if (error)
    return (
      <ErrorFallback
        theme={theme}
        onRetry={() => dispatch(fetchCountry("thailand"))}
      />
    );

  return (
    <CountryPage
      theme={theme}
      config={thailandConfig}
      mainEventFights={mainEvents}
      topFightersData={fightersList}
      topEventsList={topEvents}
    />
  );
};

export default Thailand;
