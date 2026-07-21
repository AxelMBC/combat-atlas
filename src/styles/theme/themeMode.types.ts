import type { ReactNode } from 'react';

export type ThemeMode = 'dark' | 'light';

export interface ThemeModeContextValue {
  mode: ThemeMode;
  toggleMode: () => void;
}

export interface ThemeModeProviderProps {
  children: ReactNode;
}
