import type { CountryEntry } from "./registry.types";

export const countryRegistry: CountryEntry[] = [
  {
    slug: "mexico",
    name: "México",
    mapLayerId: "Mexico",
    accentColor: "#fb1c08",
    loader: () => import("@/pages/Mexico"),
  },
  {
    slug: "thailand",
    name: "Tailandia",
    mapLayerId: "Thailand",
    accentColor: "#f59e08",
    loader: () => import("@/pages/Thailand"),
  },
  {
    slug: "united-states",
    name: "Estados Unidos",
    mapLayerId: "United States",
    accentColor: "#3a40fb",
    loader: () => import("@/pages/UnitedStates"),
  },
];
