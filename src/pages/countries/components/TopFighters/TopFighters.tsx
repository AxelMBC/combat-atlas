import { memo } from 'react';
import type { TopFightersProps } from './TopFighters.types';

// MUI
import { Box, Grid, Typography } from '@mui/material';

// Components
import FighterCard from './FighterCard';

// Utils
import { CLEAN_SANS } from '@/styles/fonts/cleanSans';
import { useThemeMode } from '@/styles/theme';

const TopFighters = memo(
  ({ title, topFightersData, remainingByFighter, onFighterSelect }: TopFightersProps) => {
    const { palette } = useThemeMode();
    const getRemaining = (id: string) => remainingByFighter[id] ?? 0;

    return (
      <Box component="section" sx={{ paddingBottom: 8, mt: { xs: 5, md: 7 } }}>
        <Typography
          variant="h2"
          sx={{
            fontFamily: CLEAN_SANS,
            fontWeight: 700,
            fontSize: { xs: '1.5rem', md: '2rem' },
            color: palette.textPrimary,
            mb: 3,
          }}
        >
          {title}
        </Typography>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6, lg: 8 }}>
            {topFightersData[0] && (
              <FighterCard
                boxer={topFightersData[0]}
                rank={1}
                variant="feature"
                remaining={getRemaining(topFightersData[0]._id)}
                onSelect={onFighterSelect}
              />
            )}
          </Grid>

          <Grid size={{ xs: 12, md: 6, lg: 4 }}>
            {topFightersData[1] && (
              <FighterCard
                boxer={topFightersData[1]}
                rank={2}
                variant="compact"
                remaining={getRemaining(topFightersData[1]._id)}
                onSelect={onFighterSelect}
              />
            )}
          </Grid>

          {topFightersData.slice(2).map((b, i) => (
            <Grid key={i} size={{ xs: 12, md: 6, lg: 4 }}>
              <FighterCard
                boxer={b}
                rank={i + 3}
                variant="compact"
                remaining={getRemaining(b._id)}
                onSelect={onFighterSelect}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  },
);

export default TopFighters;
