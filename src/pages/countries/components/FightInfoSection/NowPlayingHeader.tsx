import type { NowPlayingHeaderProps } from './NowPlayingHeader.types';

import { Box, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

import { useTranslation } from '@/i18n';
import { HEADLINE_FONT } from '@/styles/fonts/newspaperFonts';

const RAIL_FILL_TRANSITION = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';

const eyebrowSx = {
  fontFamily: HEADLINE_FONT,
  fontSize: '0.75rem',
  letterSpacing: '0.2em',
  textTransform: 'uppercase',
} as const;

const NowPlayingHeader = ({ unwatchedCount, poolSize }: NowPlayingHeaderProps) => {
  const { t } = useTranslation();
  const { surfaces } = useTheme().palette;

  const hasPool = poolSize > 0;
  const watchedShare = hasPool ? (poolSize - unwatchedCount) / poolSize : 0;
  const remainingLabel =
    unwatchedCount === 0
      ? t('mainEvent.allWatched')
      : t('mainEvent.toWatch', { count: unwatchedCount });

  return (
    <Box sx={{ mb: 1.5 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          columnGap: 2,
        }}
      >
        <Typography sx={{ ...eyebrowSx, color: surfaces.textMuted }}>
          {t('fightInfo.nowPlaying')}
        </Typography>
        {hasPool && (
          <Typography sx={{ ...eyebrowSx, color: surfaces.textSecondary, whiteSpace: 'nowrap' }}>
            {remainingLabel}
          </Typography>
        )}
      </Box>
      {hasPool && (
        <Box
          aria-hidden
          sx={{
            mt: 1,
            height: 2,
            borderRadius: '999px',
            bgcolor: surfaces.border,
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              height: '100%',
              bgcolor: 'primary.main',
              transform: `scaleX(${watchedShare})`,
              transformOrigin: 'left',
              '@media (prefers-reduced-motion: no-preference)': {
                transition: RAIL_FILL_TRANSITION,
              },
            }}
          />
        </Box>
      )}
    </Box>
  );
};

export default NowPlayingHeader;
