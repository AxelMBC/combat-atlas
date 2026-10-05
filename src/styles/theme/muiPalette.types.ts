import type { SurfacePalette } from './palette.types';

declare module '@mui/material/styles' {
  interface Palette {
    surfaces: SurfacePalette;
  }

  interface PaletteOptions {
    surfaces?: SurfacePalette;
  }
}
