import type { LandingStageProps } from './LandingStage.types';

import { motion } from 'framer-motion';

import { Box, Typography } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';

import { useTranslation } from '@/i18n';
import { HEADLINE_FONT } from '@/styles/fonts/newspaperFonts';
import StagePortrait from '@/pages/Landing/StagePortrait';
import { formatCoordinates } from '@/pages/Landing/formatCoordinates';

const MotionBox = motion.create(Box);

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;
const WATERMARK_ENTRANCE_S = 0.6;
const GLOW_OPACITY = { dark: 0.3, light: 0.18 } as const;
const GLOW_CROSSFADE = 'opacity 0.4s ease';
const TEXTURE_OPACITY = 0.14;
const TEXTURE_MASK = 'radial-gradient(ellipse 60% 55% at 50% 50%, black 0%, transparent 100%)';
const WATERMARK_OPACITY = 0.12;
const SURFACE_TRANSITION = 'color 0.2s ease';

const LandingStage = ({ entries, selectedEntry, reduceMotion, children }: LandingStageProps) => {
  const { t } = useTranslation();
  const { surfaces, mode } = useTheme().palette;

  const coordinates = formatCoordinates(selectedEntry.center, {
    north: t('landing.hemisphere.north'),
    south: t('landing.hemisphere.south'),
    east: t('landing.hemisphere.east'),
    west: t('landing.hemisphere.west'),
  });

  return (
    <Box
      aria-hidden
      sx={{
        gridArea: 'stage',
        position: 'relative',
        display: 'grid',
        placeItems: 'center',
        minHeight: { md: '100dvh' },
        pt: { xs: 3.5, md: 0 },
        pb: { xs: 3, md: 0 },
      }}
    >
      {entries.map(({ slug, accentColor }) => (
        <Box
          key={slug}
          sx={{
            position: 'absolute',
            inset: '-20%',
            background: `radial-gradient(closest-side, ${accentColor} 0%, ${alpha(accentColor, 0.25)} 55%, transparent 100%)`,
            opacity: slug === selectedEntry.slug ? GLOW_OPACITY[mode] : 0,
            transition: GLOW_CROSSFADE,
            pointerEvents: 'none',
          }}
        />
      ))}

      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          color: alpha(surfaces.textPrimary, TEXTURE_OPACITY),
          backgroundImage: 'radial-gradient(currentColor 1px, transparent 1.5px)',
          backgroundSize: '6px 6px',
          maskImage: TEXTURE_MASK,
          WebkitMaskImage: TEXTURE_MASK,
          transition: SURFACE_TRANSITION,
          pointerEvents: 'none',
        }}
      />

      <MotionBox
        key={selectedEntry.isoCode}
        initial={reduceMotion ? false : { opacity: 0, scale: 1.06 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: WATERMARK_ENTRANCE_S, ease: EASE_OUT_EXPO }}
        sx={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          fontFamily: HEADLINE_FONT,
          fontSize: { xs: '62vw', md: 'min(34vw, 78vh)' },
          lineHeight: 1,
          color: alpha(surfaces.textPrimary, WATERMARK_OPACITY),
          WebkitTextFillColor: 'transparent',
          WebkitTextStroke: '1px currentColor',
          transition: SURFACE_TRANSITION,
          userSelect: 'none',
          pointerEvents: 'none',
        }}
      >
        {selectedEntry.isoCode}
      </MotionBox>

      <StagePortrait entries={entries} selectedSlug={selectedEntry.slug} />

      {children}

      <Typography
        sx={{
          position: 'absolute',
          top: { xs: 4, md: '14vh' },
          insetInlineStart: { xs: 20, md: 'auto' },
          insetInlineEnd: { md: 48 },
          fontFamily: HEADLINE_FONT,
          fontSize: { xs: '0.7rem', md: '0.85rem' },
          letterSpacing: '0.25em',
          color: surfaces.textMuted,
          transition: SURFACE_TRANSITION,
          whiteSpace: 'nowrap',
        }}
      >
        {coordinates}
      </Typography>
    </Box>
  );
};

export default LandingStage;
