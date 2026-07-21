import { Box, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

import { useTranslation } from '@/i18n';
import { statLabelSx, statValueSx } from '@/pages/countries/components/shared';

import { formatActivePeriod } from './formatActivePeriod';
import type { FighterStatsProps } from './FighterStats.types';

const FighterStats = ({ boxer, size }: FighterStatsProps) => {
  const { t } = useTranslation();
  const { surfaces } = useTheme().palette;
  const na = t('common.notAvailable');

  const labelSx = { ...statLabelSx(surfaces), lineHeight: 1.2 } as const;

  const stats = [
    { label: t('fighter.recordLabel').replace(':', ''), value: boxer.record || na },
    { label: t('fighter.koLabel'), value: boxer.kos != null ? String(boxer.kos) : na },
    {
      label: t('fighter.activeLabel'),
      value: formatActivePeriod(boxer.activePeriod, {
        activeSince: t('fighter.activeSince'),
        notAvailable: na,
      }),
    },
    {
      label: t('fighter.fightsTotalLabel'),
      value: boxer.totalFights != null ? String(boxer.totalFights) : na,
    },
  ];

  if (size === 'sm') {
    return (
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          columnGap: 1,
          rowGap: 0.5,
          alignItems: 'baseline',
        }}
      >
        {stats.map((stat) => (
          <Box
            key={stat.label}
            sx={{ display: 'flex', flexDirection: 'column', gap: 0.4, minWidth: 0 }}
          >
            <Typography component="span" sx={labelSx}>
              {stat.label}
            </Typography>
            <Typography
              component="span"
              sx={{
                ...statValueSx(surfaces),
                fontSize: '1rem',
                whiteSpace: 'nowrap',
              }}
            >
              {stat.value}
            </Typography>
          </Box>
        ))}
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {stats.map((stat) => (
        <Box
          key={stat.label}
          sx={{
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'space-between',
            gap: 2,
          }}
        >
          <Typography component="span" sx={{ ...labelSx, fontSize: '0.75rem' }}>
            {stat.label}
          </Typography>
          <Typography
            component="span"
            sx={{
              ...statValueSx(surfaces),
              fontWeight: 700,
              fontSize: { xs: '1.15rem', md: '1.35rem' },
            }}
          >
            {stat.value}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

export default FighterStats;
