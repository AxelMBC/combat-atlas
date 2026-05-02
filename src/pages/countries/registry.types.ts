import type { ComponentType } from "react";
import type { TranslationKey } from "@/i18n";

export interface CountryEntry {
  slug: string;
  nameKey: TranslationKey;
  mapLayerId: string;
  accentColor?: string;
  loader: () => Promise<{ default: ComponentType }>;
}
