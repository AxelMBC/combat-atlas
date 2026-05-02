import { createContext } from "react";

import type { LanguageContextValue } from "./i18n.types";

export const LanguageContext = createContext<LanguageContextValue | null>(null);
