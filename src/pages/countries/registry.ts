import type { ComponentType } from "react";

export interface CountryEntry {
  slug: string;
  loader: () => Promise<{ default: ComponentType }>;
}

export const countryRegistry: CountryEntry[] = [
  { slug: "mexico", loader: () => import("@/pages/Mexico") },
  { slug: "thailand", loader: () => import("@/pages/Thailand") },
  { slug: "united-states", loader: () => import("@/pages/UnitedStates") },
];
