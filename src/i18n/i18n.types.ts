import type { ReactNode } from "react";
import type { TranslationKey } from "./locales/es";

export type Language = "es" | "en";

export type TranslationParams = Record<string, string | number>;

export type TranslateFn = (
  key: TranslationKey,
  params?: TranslationParams
) => string;

export interface LanguageContextValue {
  language: Language;
  setLanguage: (language: Language) => void;
  t: TranslateFn;
}

export interface LanguageProviderProps {
  children: ReactNode;
}

export type { TranslationKey };
