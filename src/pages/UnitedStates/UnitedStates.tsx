import type { Fighter } from "@/types/fighter.types";
import { useEffect } from "react";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchCountry } from "@/store/country/thunks";
import {
  resetCountryData,
  selectCountryState,
} from "@/store/country/countrySlice";

import "@/styles/fonts/default.scss";

import { theme } from "./config/unitedStatesTheme";
import { unitedStatesConfig } from "./config/unitedStates.config";

import CountryPage from "@/components/CountryPage";
import ErrorFallback from "@/components/ErrorFallback";
import Spinner from "@/components/Spinner";
import { getFighterImage } from "./resources";

const UnitedStates = () => {
  const dispatch = useAppDispatch();
  const { fighters, mainEvents, topEvents, loading, error } =
    useAppSelector(selectCountryState);

  const fightersList = fighters.map((fighter: Fighter) => ({
    ...fighter,
    image: getFighterImage(fighter.image),
  }));

  useEffect(() => {
    dispatch(resetCountryData());
    dispatch(fetchCountry("united-states"));
  }, [dispatch]);

  if (loading) return <Spinner label="CARGANDO" />;

  if (error)
    return (
      <ErrorFallback
        theme={theme}
        onRetry={() => dispatch(fetchCountry("united-states"))}
      />
    );

  return (
    <CountryPage
      theme={theme}
      config={unitedStatesConfig}
      mainEventFights={mainEvents}
      topFightersData={fightersList}
      topEventsList={topEvents}
    />
  );
};

export default UnitedStates;
