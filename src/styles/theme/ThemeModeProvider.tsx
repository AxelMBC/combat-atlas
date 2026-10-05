import { useCallback, useEffect, useMemo, useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';

import { ThemeModeContext } from './ThemeModeContext';
import { createAppTheme, getSurfacePalette } from './createAppTheme';
import type { ThemeMode, ThemeModeContextValue, ThemeModeProviderProps } from './themeMode.types';

const STORAGE_KEY = 'preferredTheme';

const isThemeMode = (value: unknown): value is ThemeMode => value === 'dark' || value === 'light';

const detectInitialMode = (): ThemeMode => {
  if (typeof window === 'undefined') return 'dark';
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (isThemeMode(stored)) return stored;
  } catch {
    // localStorage unavailable — fall through to default
  }
  return 'dark';
};

const ThemeModeProvider = ({ children }: ThemeModeProviderProps) => {
  const [mode, setMode] = useState<ThemeMode>(detectInitialMode);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, mode);
    } catch {
      // ignore — preference simply won't persist
    }
  }, [mode]);

  useEffect(() => {
    const { page, textPrimary } = getSurfacePalette(mode);
    const rootStyle = document.documentElement.style;
    rootStyle.setProperty('--surface-page', page);
    rootStyle.setProperty('--surface-text-primary', textPrimary);
  }, [mode]);

  const toggleMode = useCallback(() => {
    setMode((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  const value = useMemo<ThemeModeContextValue>(() => ({ mode, toggleMode }), [mode, toggleMode]);

  const theme = useMemo(() => createAppTheme(mode), [mode]);

  return (
    <ThemeModeContext.Provider value={value}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ThemeModeContext.Provider>
  );
};

export default ThemeModeProvider;
