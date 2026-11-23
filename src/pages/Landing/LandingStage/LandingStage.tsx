import type { LandingStageProps } from './LandingStage.types';

import { Box } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';

import { useTranslation } from '@/i18n';
import StagePortrait from '@/pages/Landing/StagePortrait';
import { formatCoordinates } from '@/pages/Landing/formatCoordinates';

const GLOW_OPACITY = { dark: 0.3, light: 0.18 } as const;
const GLOW_CROSSFADE = 'opacity 0.4s ease';

const LandingStage = ({ entries, selectedEntry, children }: LandingStageProps) => {
  const { t } = useTranslation();
  const { mode } = useTheme().palette;

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

      <StagePortrait
        entries={entries}
        selectedSlug={selectedEntry.slug}
        coordinates={coordinates}
      />

      {children}
    </Box>
  );
};

export default LandingStage;
