import type { GlobeColors } from './HalftoneGlobe.types';
import type { GlobeInk, Rgb } from './globeColors.types';

import { decomposeColor } from '@mui/material/styles';

const toRgb = (color: string): Rgb => {
  const [red, green, blue] = decomposeColor(color).values;
  return [red, green, blue];
};

const mixChannel = (from: number, to: number, progress: number) => from + (to - from) * progress;

const mixRgb = (from: Rgb, to: Rgb, progress: number): Rgb => [
  mixChannel(from[0], to[0], progress),
  mixChannel(from[1], to[1], progress),
  mixChannel(from[2], to[2], progress),
];

export const toGlobeInk = ({ ink, page }: GlobeColors): GlobeInk => ({
  ink: toRgb(ink),
  page: toRgb(page),
});

export const mixGlobeInk = (from: GlobeInk, to: GlobeInk, progress: number): GlobeInk => ({
  ink: mixRgb(from.ink, to.ink, progress),
  page: mixRgb(from.page, to.page, progress),
});

export const toRgbString = ([red, green, blue]: Rgb): string =>
  `rgb(${Math.round(red)}, ${Math.round(green)}, ${Math.round(blue)})`;
