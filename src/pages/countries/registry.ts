import type { CountryEntry } from "./registry.types";

export const countryRegistry: CountryEntry[] = [
  {
    slug: "mexico",
    nameKey: "country.mexico.name",
    mapLayerId: "Mexico",
    accentColor: "#fb1c08",
    loader: () => import("@/pages/Mexico"),
  },
  {
    slug: "thailand",
    nameKey: "country.thailand.name",
    mapLayerId: "Thailand",
    accentColor: "#f59e08",
    loader: () => import("@/pages/Thailand"),
  },
  {
    slug: "united-states",
    nameKey: "country.unitedStates.name",
    mapLayerId: "United States",
    accentColor: "#3a40fb",
    loader: () => import("@/pages/UnitedStates"),
  },
];
