import { memo } from 'react';
import type { MainEventProps } from './MainEvent.types';

// MUI
import { Box, Typography } from '@mui/material';

// Components
import MainEventCard from './MainEventCard';

// i18n
import { useTranslation } from '@/i18n';

const DUMMY_FIGHT_COUNT = 128;
const DUMMY_LAST_UPDATE = '01 May 2026';

const MainEvent = memo(({ config, loading, error, mainVideo, fetchMainVideo }: MainEventProps) => {
  const { t } = useTranslation();

  const countryLabel = config.countryNameKey ? t(config.countryNameKey) : config.countryName;

  return (
    <Box
      component="section"
      className="section-spacing"
      sx={{
        borderBottom: '8px solid #000',
        marginTop: 1,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 1,
          fontFamily: '"Merriweather", serif',
          fontSize: '0.85rem',
          letterSpacing: '0.05em',
          color: 'info.main',
          pb: 1,
          borderBottom: '1px solid',
          borderColor: 'info.main',
        }}
      >
        <Box sx={{ textTransform: 'uppercase', display: 'flex', gap: 0.75 }}>
          <Box component="span">ATLAS</Box>
          <Box component="span">/</Box>
          <Box component="span" sx={{ color: 'text.primary', fontWeight: 700 }}>
            {countryLabel}
          </Box>
        </Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            flexWrap: 'wrap',
          }}
        >
          <Box component="span">·</Box>
          <Box component="span">
            {DUMMY_FIGHT_COUNT} {t('mainEvent.fightsCount')}
          </Box>
          <Box component="span">·</Box>
          <Box component="span">{t('mainEvent.lastUpdate')}</Box>
          <Box component="span">·</Box>
          <Box component="span">{DUMMY_LAST_UPDATE}</Box>
        </Box>
      </Box>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          gap: 2,
          mt: 4,
          mb: 3,
        }}
      >
        <Typography
          variant="h1"
          sx={{
            fontFamily: 'Anton, sans-serif',
            fontWeight: 400,
            fontSize: { xs: '2.5rem', md: '4.5rem' },
            lineHeight: 1,
            color: 'primary.dark',
            textTransform: 'uppercase',
            letterSpacing: '0.01em',
          }}
        >
          {t(config.headerTitleKey)}.
        </Typography>
      </Box>

      {loading && (
        <Typography
          variant="h1"
          sx={{
            fontFamily: 'Anton, sans-serif',
            textAlign: 'center',
            fontSize: '1.5rem',
            color: 'text.primary',
            p: 4,
          }}
        >
          {t('mainEvent.searching')}
        </Typography>
      )}

      {error && (
        <Typography
          sx={{
            fontFamily: 'Anton, sans-serif',
            textAlign: 'center',
            fontWeight: 'bold',
            fontSize: '1.5rem',
            color: 'text.primary',
            p: 4,
          }}
        >
          {error}
        </Typography>
      )}

      {!loading && !error && mainVideo && (
        <MainEventCard video={mainVideo} onAnotherFight={fetchMainVideo} />
      )}
    </Box>
  );
});

export default MainEvent;
