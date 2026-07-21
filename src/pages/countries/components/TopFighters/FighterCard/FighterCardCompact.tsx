import { Box, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

import { useTranslation } from '@/i18n';
import { CLEAN_SANS } from '@/styles/fonts/cleanSans';

import FighterCardShell from './FighterCardShell';
import FighterPortrait from './FighterPortrait';
import FighterStats from './FighterStats';
import FighterProfileCta from './FighterProfileCta';
import type { FighterCardProps } from './FighterCard.types';

const FighterCardCompact = ({ boxer, rank, remaining, onSelect }: FighterCardProps) => {
  const { t } = useTranslation();
  const { surfaces } = useTheme().palette;
  const disabled = remaining <= 0;
  const na = t('common.notAvailable');
  const rankLabel = rank.toString().padStart(2, '0');

  return (
    <FighterCardShell
      disabled={disabled}
      onActivate={() => onSelect(boxer)}
      layoutSx={{ display: 'flex', flexDirection: 'column' }}
    >
      <FighterPortrait
        boxer={boxer}
        rankLabel={rankLabel}
        remaining={remaining}
        disabled={disabled}
        emphasis="compact"
        size={{ width: '100%', height: 320 }}
      />

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
          gap: 0.5,
          p: 2.5,
        }}
      >
        <Typography
          sx={{
            fontFamily: CLEAN_SANS,
            fontWeight: 700,
            fontSize: '1.35rem',
            lineHeight: 1.2,
            color: surfaces.textPrimary,
          }}
        >
          {boxer.name}
        </Typography>
        <Typography
          sx={{
            fontFamily: CLEAN_SANS,
            fontSize: '0.85rem',
            color: surfaces.textSecondary,
          }}
        >
          {boxer.cityState || na}
        </Typography>

        <Box
          sx={{
            mt: 1.5,
            pt: 1.5,
            borderTop: `1px solid ${surfaces.border}`,
          }}
        >
          <FighterStats boxer={boxer} size="sm" />
        </Box>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            mt: 'auto',
            pt: 1.5,
            borderTop: `1px solid ${surfaces.border}`,
          }}
        >
          <FighterProfileCta disabled={disabled} />
        </Box>
      </Box>
    </FighterCardShell>
  );
};

export default FighterCardCompact;
