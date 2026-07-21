import { memo } from 'react';
import type { TopEventsProps } from './TopFights.types';

// MUI
import { Box, Grid, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

// Components
import FightCard from './FightCard';

// Utils
import { CLEAN_SANS } from '@/styles/fonts/cleanSans';

const TopFights = memo(({ title, videos, onVideoSelect }: TopEventsProps) => {
  const { surfaces } = useTheme().palette;
  const playableVideos = videos.filter((video) => video.idYt);

  if (playableVideos.length === 0) return null;

  return (
    <Box component="section" sx={{ mt: { xs: 5, md: 7 } }}>
      <Typography
        variant="h2"
        sx={{
          fontFamily: CLEAN_SANS,
          fontWeight: 700,
          fontSize: { xs: '1.5rem', md: '2rem' },
          color: surfaces.textPrimary,
          mb: 3,
        }}
      >
        {title}
      </Typography>

      <Grid container spacing={3}>
        {playableVideos.map((video) => (
          <Grid key={video.idYt} size={{ xs: 12, sm: 6, lg: 4 }} sx={{ display: 'flex' }}>
            <FightCard video={video} onVideoSelect={onVideoSelect} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
});

export default TopFights;
