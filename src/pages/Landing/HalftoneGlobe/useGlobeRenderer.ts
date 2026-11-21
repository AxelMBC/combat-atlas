import type { GlobeRenderer, GlobeRendererProps } from './globeRenderer.types';
import type { GlobeRendererOptions } from './useGlobeRenderer.types';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';

import { createGlobeRenderer } from './globeRenderer';

export const useGlobeRenderer = ({
  containerRef,
  canvasRef,
  ringRef,
  countries,
  selectedIsoCode,
  spin,
  colors,
  reduceMotion,
  onPointCountry,
  onEnterCountry,
  onSpinSettled,
}: GlobeRendererOptions): boolean => {
  const [isCanvasAvailable, setIsCanvasAvailable] = useState(true);
  const rendererRef = useRef<GlobeRenderer | null>(null);
  const propsRef = useRef<GlobeRendererProps>({
    selectedIsoCode,
    reduceMotion,
    onPointCountry,
    onEnterCountry,
    onSpinSettled,
  });

  useLayoutEffect(() => {
    propsRef.current = {
      selectedIsoCode,
      reduceMotion,
      onPointCountry,
      onEnterCountry,
      onSpinSettled,
    };
  });

  useLayoutEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    const ring = ringRef.current;
    const ctx = canvas?.getContext('2d');
    if (!container || !canvas || !ring || !ctx) {
      setIsCanvasAvailable(false);
      return;
    }

    const renderer = createGlobeRenderer({
      container,
      canvas,
      ctx,
      ring,
      countries,
      readProps: () => propsRef.current,
    });
    rendererRef.current = renderer;
    return () => {
      renderer.destroy();
      rendererRef.current = null;
    };
  }, [containerRef, canvasRef, ringRef, countries]);

  const { ink, page } = colors;

  useEffect(() => {
    rendererRef.current?.setColors({ ink, page });
  }, [ink, page, countries]);

  useEffect(() => {
    rendererRef.current?.select(selectedIsoCode);
  }, [selectedIsoCode, countries]);

  useEffect(() => {
    if (!spin) return;
    const renderer = rendererRef.current;
    if (renderer) renderer.spin(spin);
    else propsRef.current.onSpinSettled();
  }, [spin]);

  return isCanvasAvailable;
};
