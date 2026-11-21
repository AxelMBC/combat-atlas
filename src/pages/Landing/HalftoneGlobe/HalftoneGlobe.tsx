import type { HalftoneGlobeProps } from './HalftoneGlobe.types';

import { useRef } from 'react';
import { keyframes } from '@emotion/react';

import { Box } from '@mui/material';

import { useGlobeRenderer } from './useGlobeRenderer';

const RING_SIZE_PX = 30;
const RING_HALO_PX = 2;
const RING_PULSE_DURATION_S = 1.6;

const ringPulse = keyframes`
  0% { transform: scale(1); opacity: 0.85; }
  100% { transform: scale(2.6); opacity: 0; }
`;

const ringCircleSx = {
  position: 'absolute',
  top: -RING_SIZE_PX / 2,
  left: -RING_SIZE_PX / 2,
  width: RING_SIZE_PX,
  height: RING_SIZE_PX,
  borderRadius: '50%',
  border: '2px solid',
} as const;

const HalftoneGlobe = (props: HalftoneGlobeProps) => {
  const { countries, selectedIsoCode, colors, reduceMotion } = props;
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const isCanvasAvailable = useGlobeRenderer({ ...props, containerRef, canvasRef, ringRef });

  if (!isCanvasAvailable) return null;

  const accentColor = countries.find(({ isoCode }) => isoCode === selectedIsoCode)?.accentColor;
  const ringHalo = `0 0 0 ${RING_HALO_PX}px ${colors.page}, inset 0 0 0 ${RING_HALO_PX}px ${colors.page}`;

  return (
    <Box
      ref={containerRef}
      sx={{ position: 'relative', width: '100%', height: '100%', userSelect: 'none' }}
    >
      <Box
        component="canvas"
        ref={canvasRef}
        sx={{
          position: 'absolute',
          inset: 0,
          display: 'block',
          width: '100%',
          height: '100%',
          touchAction: 'pan-y',
        }}
      />
      <Box
        ref={ringRef}
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          visibility: 'hidden',
          pointerEvents: 'none',
          willChange: 'transform',
        }}
      >
        <Box
          sx={{
            ...ringCircleSx,
            borderColor: accentColor,
            boxShadow: ringHalo,
            transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
          }}
        />
        {!reduceMotion && (
          <Box
            sx={{
              ...ringCircleSx,
              borderColor: accentColor,
              animation: `${ringPulse} ${RING_PULSE_DURATION_S}s ease-out infinite`,
            }}
          />
        )}
      </Box>
    </Box>
  );
};

export default HalftoneGlobe;
