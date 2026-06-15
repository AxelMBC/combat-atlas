import { useContext } from 'react';

import { ThemeModeContext } from './ThemeModeContext';
import type { ThemeModeContextValue } from './themeMode.types';

const useThemeMode = (): ThemeModeContextValue => {
  const ctx = useContext(ThemeModeContext);
  if (!ctx) {
    throw new Error('useThemeMode must be used within a ThemeModeProvider');
  }
  return ctx;
};

export default useThemeMode;
