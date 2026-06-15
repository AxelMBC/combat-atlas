import { createContext } from 'react';

import type { ThemeModeContextValue } from './themeMode.types';

export const ThemeModeContext = createContext<ThemeModeContextValue | null>(null);
