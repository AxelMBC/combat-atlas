import type { RefObject } from 'react';
import type { HalftoneGlobeProps } from './HalftoneGlobe.types';

export interface GlobeRendererOptions extends HalftoneGlobeProps {
  containerRef: RefObject<HTMLDivElement | null>;
  canvasRef: RefObject<HTMLCanvasElement | null>;
  ringRef: RefObject<HTMLDivElement | null>;
}
