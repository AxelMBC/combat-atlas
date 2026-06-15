import type { ReactNode } from 'react';
import type { SurfacePalette } from './palette.types';

export type ThemeMode = 'dark' | 'light';

export interface ThemeModeContextValue {
  mode: ThemeMode;
  toggleMode: () => void;
  palette: SurfacePalette;
}

export interface ThemeModeProviderProps {
  children: ReactNode;
}
