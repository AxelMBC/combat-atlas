import type { ComponentType } from "react";

export interface CountryEntry {
  slug: string;
  name: string;
  mapLayerId: string;
  accentColor?: string;
  loader: () => Promise<{ default: ComponentType }>;
}
