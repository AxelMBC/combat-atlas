import { Box, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

import { useTranslation } from '@/i18n';
import { CLEAN_SANS } from '@/styles/fonts/cleanSans';

import FighterCardShell from './FighterCardShell';
import FighterPortrait from './FighterPortrait';
import FighterStats from './FighterStats';
import FighterProfileCta from './FighterProfileCta';
import type { FighterCardProps } from './FighterCard.types';

const FighterCardFeature = ({ boxer, rank, remaining, onSelect }: FighterCardProps) => {
  const { t } = useTranslation();
  const { surfaces } = useTheme().palette;
  const disabled = remaining <= 0;
  const na = t('common.notAvailable');
  const rankLabel = rank.toString().padStart(2, '0');

  return (
    <FighterCardShell
      disabled={disabled}
      onActivate={() => onSelect(boxer)}
      layoutSx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        alignItems: 'stretch',
      }}
    >
      <FighterPortrait
        boxer={boxer}
        rankLabel={rankLabel}
        remaining={remaining}
        disabled={disabled}
        emphasis="feature"
        size={{ width: { xs: '100%', md: 440 }, height: { xs: 360, md: 'auto' } }}
      />

      <Box
        sx={{
          flex: 1,
          minWidth: 0,
          display: 'flex',
          flexDirection: 'column',
          p: { xs: 2.5, md: 4 },
        }}
      >
        <Typography
          sx={{
            fontFamily: CLEAN_SANS,
            fontWeight: 700,
            fontSize: { xs: '1.75rem', md: '2.25rem' },
            lineHeight: 1.1,
            color: surfaces.textPrimary,
            wordBreak: 'normal',
            overflowWrap: 'break-word',
            hyphens: 'none',
          }}
        >
          {boxer.name}
        </Typography>

        <Typography
          sx={{
            fontFamily: CLEAN_SANS,
            fontSize: '0.95rem',
            color: surfaces.textSecondary,
            mt: 1,
          }}
        >
          {boxer.cityState || na}
        </Typography>

        <Box
          sx={{
            mt: { xs: 3, md: 4 },
            pt: { xs: 2, md: 3 },
            borderTop: `1px solid ${surfaces.border}`,
          }}
        >
          <FighterStats boxer={boxer} size="lg" />
        </Box>

        <Box
          sx={{
            mt: 'auto',
            pt: 3,
            borderTop: `1px solid ${surfaces.border}`,
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          <FighterProfileCta disabled={disabled} />
        </Box>
      </Box>
    </FighterCardShell>
  );
};

export default FighterCardFeature;
