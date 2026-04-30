import type { ComponentType } from "react";

export interface CountryEntry {
  slug: string;
  name: string;
  loader: () => Promise<{ default: ComponentType }>;
}
