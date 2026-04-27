import type { ComponentType } from "react";

export interface CountryEntry {
  slug: string;
  name: string;
  loader: () => Promise<{ default: ComponentType }>;
}

export const countryRegistry: CountryEntry[] = [
  { slug: "mexico", name: "México", loader: () => import("@/pages/Mexico") },
  { slug: "thailand", name: "Tailandia", loader: () => import("@/pages/Thailand") },
  { slug: "united-states", name: "Estados Unidos", loader: () => import("@/pages/UnitedStates") },
];
