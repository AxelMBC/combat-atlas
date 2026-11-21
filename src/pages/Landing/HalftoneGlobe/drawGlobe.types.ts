import type { GlobeInk } from './globeColors.types';
import type { SphereTrig } from './globeMath.types';

export interface GlobeViewport {
  width: number;
  height: number;
  dpr: number;
  radius: number;
  centerX: number;
  centerY: number;
}

export interface GlobeHitTargets {
  xs: Float32Array;
  ys: Float32Array;
  groups: Uint8Array;
  count: number;
  radius: number;
}

export interface GlobeDrawInput {
  ctx: CanvasRenderingContext2D;
  viewport: GlobeViewport;
  view: SphereTrig;
  ink: GlobeInk;
  dotGroups: Uint8Array;
  accentColors: readonly string[];
  selectedGroup: number;
  hitTargets: GlobeHitTargets;
}
