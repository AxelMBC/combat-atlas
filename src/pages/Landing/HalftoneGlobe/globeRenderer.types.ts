import type {
  GlobeColors,
  GlobeCountry,
  GlobeSpinRequest,
  HalftoneGlobeProps,
} from './HalftoneGlobe.types';
import type { GlobeInk } from './globeColors.types';

export type GlobeRendererProps = Pick<
  HalftoneGlobeProps,
  'selectedIsoCode' | 'reduceMotion' | 'onPointCountry' | 'onEnterCountry' | 'onSpinSettled'
>;

export interface GlobeRendererSetup {
  container: HTMLElement;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  ring: HTMLElement;
  countries: readonly GlobeCountry[];
  readProps: () => GlobeRendererProps;
}

export interface GlobeRenderer {
  select: (isoCode: string) => void;
  spin: (request: GlobeSpinRequest) => void;
  setColors: (colors: GlobeColors) => void;
  destroy: () => void;
}

export type GlobeMotionMode = 'rest' | 'spring' | 'spin' | 'drag' | 'inertia';

export interface GlobeMotion {
  mode: GlobeMotionMode;
  lng: number;
  lat: number;
  lngVelocity: number;
  latVelocity: number;
  targetLng: number;
  targetLat: number;
}

export interface GlobeDrag {
  pointerId: number;
  startX: number;
  startY: number;
  lastX: number;
  lastMoveAt: number;
  velocity: number;
  hasLeftTapRange: boolean;
  isDragging: boolean;
}

export interface GlobeColorTransition {
  from: GlobeInk;
  to: GlobeInk;
  startedAt: number | null;
}
