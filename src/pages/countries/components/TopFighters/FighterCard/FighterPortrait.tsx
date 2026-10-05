import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';

import { useTranslation } from '@/i18n';
import { overlayPillSx } from '@/pages/countries/components/shared';

import type { FighterPortraitProps } from './FighterPortrait.types';

const FALLBACK_IMAGE = '/placeholders/no-fighter-placeholder.png';

const portraitImageSx = {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  filter: 'grayscale(100%) brightness(0.85)',
  display: 'block',
  transition: 'filter 0.4s ease, transform 0.4s ease',
} as const;

const portraitScrimSx = {
  position: 'absolute',
  inset: 0,
  background:
    'linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0) 35%, rgba(0,0,0,0.45) 100%)',
  pointerEvents: 'none',
} as const;

const FighterPortrait = ({
  boxer,
  rankLabel,
  remaining,
  disabled,
  size,
  emphasis,
}: FighterPortraitProps) => {
  const { t } = useTranslation();
  const { surfaces } = useTheme().palette;
  const isFeature = emphasis === 'feature';

  return (
    <Box
      className="fighter-portrait"
      sx={{
        position: 'relative',
        width: size.width,
        height: size.height,
        flexShrink: 0,
        bgcolor: surfaces.surfaceSunken,
        overflow: 'hidden',
      }}
    >
      <Box
        component="img"
        src={boxer.image}
        alt={boxer.name}
        onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
          e.currentTarget.src = FALLBACK_IMAGE;
          e.currentTarget.style.objectFit = 'contain';
        }}
        sx={portraitImageSx}
      />
      <Box sx={portraitScrimSx} />

      <Box
        sx={{
          ...overlayPillSx,
          position: 'absolute',
          top: 12,
          right: 12,
          zIndex: 2,
          bgcolor: disabled ? surfaces.pillScrim : 'primary.main',
          color: disabled ? surfaces.textMuted : 'common.white',
        }}
      >
        {disabled
          ? t('fighter.noFights')
          : `${remaining} ${remaining === 1 ? t('fighter.fights.one') : t('fighter.fights.other')}`}
      </Box>

      <Box
        sx={{
          ...overlayPillSx,
          position: 'absolute',
          bottom: 12,
          left: 12,
          zIndex: 2,
          bgcolor: surfaces.pillScrim,
          color: 'common.white',
          fontSize: isFeature ? '0.95rem' : '0.8rem',
          fontWeight: 700,
          letterSpacing: '0.12em',
        }}
      >
        {rankLabel}
      </Box>

      {disabled && (
        <Box
          sx={{
            ...overlayPillSx,
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 2,
            px: 2.5,
            py: 0.75,
            bgcolor: 'rgba(0, 0, 0, 0.65)',
            color: 'common.white',
            fontSize: isFeature ? '1rem' : '0.85rem',
            fontWeight: 700,
            letterSpacing: '0.15em',
          }}
        >
          {t('fighter.exhausted')}
        </Box>
      )}
    </Box>
  );
};

export default FighterPortrait;
