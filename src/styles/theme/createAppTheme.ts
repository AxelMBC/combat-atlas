import { createTheme, type Theme } from '@mui/material/styles';

import './muiPalette.types';
import { DARK_PALETTE } from './darkPalette';
import { LIGHT_PALETTE } from './lightPalette';
import type { ThemeMode } from './themeMode.types';

export const getSurfacePalette = (mode: ThemeMode) =>
  mode === 'dark' ? DARK_PALETTE : LIGHT_PALETTE;

export const createAppTheme = (mode: ThemeMode): Theme =>
  createTheme({
    palette: {
      mode,
      surfaces: getSurfacePalette(mode),
    },
  });
