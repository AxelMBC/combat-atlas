import { useCallback, useEffect, useMemo, useState } from 'react';

import { ThemeModeContext } from './ThemeModeContext';
import { DARK_PALETTE } from './darkPalette';
import { LIGHT_PALETTE } from './lightPalette';
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

  const toggleMode = useCallback(() => {
    setMode((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  const value = useMemo<ThemeModeContextValue>(
    () => ({
      mode,
      toggleMode,
      palette: mode === 'dark' ? DARK_PALETTE : LIGHT_PALETTE,
    }),
    [mode, toggleMode],
  );

  return <ThemeModeContext.Provider value={value}>{children}</ThemeModeContext.Provider>;
};

export default ThemeModeProvider;
