import { useContext } from "react";

import { LanguageContext } from "./LanguageContext";
import type { LanguageContextValue } from "./i18n.types";

const useTranslation = (): LanguageContextValue => {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useTranslation must be used within a LanguageProvider");
  }
  return ctx;
};

export default useTranslation;
