import { CLEAN_SANS } from '@/styles/fonts/cleanSans';
import type { SurfacePalette } from '@/styles/theme';

export const pillSx = {
  px: 1.5,
  py: 0.5,
  borderRadius: '999px',
  fontWeight: 600,
  fontSize: '0.7rem',
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
} as const;

export const overlayPillSx = {
  ...pillSx,
  backdropFilter: 'blur(8px)',
  fontFamily: CLEAN_SANS,
  lineHeight: 1.4,
  whiteSpace: 'nowrap',
} as const;

export const statLabelSx = (surfaces: SurfacePalette) =>
  ({
    fontFamily: CLEAN_SANS,
    fontWeight: 600,
    fontSize: '0.65rem',
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: surfaces.textMuted,
  }) as const;

export const statValueSx = (surfaces: SurfacePalette) =>
  ({
    fontFamily: CLEAN_SANS,
    fontWeight: 600,
    lineHeight: 1.2,
    color: surfaces.textPrimary,
  }) as const;

export const cardSurfaceSx = (surfaces: SurfacePalette) =>
  ({
    bgcolor: surfaces.surface,
    border: `1px solid ${surfaces.border}`,
    borderRadius: '16px',
    overflow: 'hidden',
  }) as const;

export const cardActiveSx = (surfaces: SurfacePalette) =>
  ({
    borderColor: surfaces.borderHover,
    '@media (prefers-reduced-motion: no-preference)': {
      transform: 'translateY(-4px)',
    },
  }) as const;
