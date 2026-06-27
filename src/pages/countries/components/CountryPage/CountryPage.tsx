import type { CountryPageProps } from './CountryPage.types';

import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// MUI
import { Box, Container, Button } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { useReducedMotion } from 'framer-motion';

// Components
import CinematicHero from '@/pages/countries/components/CinematicHero';
import FightInfoSection from '@/pages/countries/components/FightInfoSection';
import TopFighters from '@/pages/countries/components/TopFighters';
import TopFights from '@/pages/countries/components/TopFights';
import Spinner from '@/components/Spinner';
import SiteCredit from '@/components/SiteCredit';

// Hooks
import { useMainVideoQueue } from '@/hooks/useMainVideoQueue';
import { useTranslation } from '@/i18n';

// Utils
import { getCountryStats } from '@/pages/countries/components/CinematicHero/getCountryStats';
import { CLEAN_SANS } from '@/styles/fonts/cleanSans';
import { useThemeMode } from '@/styles/theme';

const LOADING_DELAY_MS = 3000;

const CountryPage = ({
  config,
  topFightersData,
  topEventsList,
  mainEventFights,
  theme,
}: CountryPageProps) => {
  const navigate = useNavigate();
  const { t, language } = useTranslation();
  const { palette } = useThemeMode();
  const reduceMotion = useReducedMotion();
  const autoplayAllowed = !reduceMotion;

  const {
    mainVideo,
    loading,
    error,
    fetchNextVideo,
    fetchVideoByFighter,
    onVideoSelect,
    remainingByFighter,
    remainingCount,
  } = useMainVideoQueue(mainEventFights);

  const [videoReady, setVideoReady] = useState(!autoplayAllowed);

  const stats = useMemo(
    () => getCountryStats(mainEventFights, language),
    [mainEventFights, language],
  );
  const countryName = config.countryNameKey ? t(config.countryNameKey) : config.countryName;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (videoReady) return;
    const fallback = window.setTimeout(() => setVideoReady(true), LOADING_DELAY_MS);
    return () => window.clearTimeout(fallback);
  }, [videoReady]);

  return (
    <ThemeProvider theme={theme}>
      {autoplayAllowed && !videoReady && !error && <Spinner />}

      <Box sx={{ pb: 8, minHeight: '100vh', backgroundColor: palette.page }}>
        <Button
          onClick={() => navigate('/')}
          variant="text"
          sx={{
            position: 'fixed',
            top: 16,
            left: { xs: 12, sm: 24 },
            zIndex: 1300,
            px: 2,
            py: 1,
            borderRadius: '999px',
            color: 'common.white',
            bgcolor: 'rgba(0, 0, 0, 0.45)',
            backdropFilter: 'blur(8px)',
            fontFamily: CLEAN_SANS,
            fontWeight: 600,
            fontSize: { xs: '0.85rem', sm: '0.95rem' },
            textTransform: 'none',
            lineHeight: 1,
            '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.7)' },
            '&.Mui-focusVisible': { outline: '2px solid', outlineColor: 'common.white' },
          }}
        >
          {t('nav.backToWorldMap')}
        </Button>

        <CinematicHero
          video={mainVideo}
          countryName={countryName}
          stats={stats}
          autoplayAllowed={autoplayAllowed}
          onReady={() => setVideoReady(true)}
        />

        <Container
          disableGutters
          sx={{
            maxWidth: config.maxWidth,
            p: {
              xs: 2,
              sm: 3,
            },
          }}
        >
          <FightInfoSection
            loading={loading}
            error={error}
            video={mainVideo}
            onAnotherFight={fetchNextVideo}
            anotherFightDisabled={remainingCount <= 1}
          />
          <TopFighters
            title={t(config.topFightersTitleKey)}
            topFightersData={topFightersData}
            remainingByFighter={remainingByFighter}
            onFighterSelect={fetchVideoByFighter}
          />

          <TopFights
            title={t(config.topEventsTitleKey)}
            videos={topEventsList}
            onVideoSelect={onVideoSelect}
          />

          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <SiteCredit tone="onDark" />
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default CountryPage;
