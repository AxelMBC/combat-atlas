import type { CountryPageProps } from './CountryPage.types';
import type { Fighter } from '@/types/fighter.types';
import type { MainEvent as MainEventType } from '@/types/fightEvent.types';

import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// MUI
import { Box, Container, Button, Snackbar, IconButton } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { useReducedMotion } from 'framer-motion';

// Icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

// Components
import TopFighters from '@/pages/countries/components/TopFighters';
import MainEvent from '@/pages/countries/components/MainEvent';
import TopFights from '@/pages/countries/components/TopFights';
import Spinner from '@/components/Spinner';
import SiteCredit from '@/components/SiteCredit';

// Hooks
import { useMainVideoQueue } from '@/hooks/useMainVideoQueue';
import { useTranslation } from '@/i18n';

const CountryPage = ({
  config,
  topFightersData,
  topEventsList,
  mainEventFights,
  theme,
}: CountryPageProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const reduceMotion = useReducedMotion();
  const fullscreenEnabled = !reduceMotion;

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

  const [overHero, setOverHero] = useState(fullscreenEnabled);
  const [videoReady, setVideoReady] = useState(!fullscreenEnabled);
  const [showFullscreenPrompt, setShowFullscreenPrompt] = useState(false);

  const promptFullscreen = useCallback(() => {
    if (fullscreenEnabled) setShowFullscreenPrompt(true);
  }, [fullscreenEnabled]);

  const handleAnotherFight = useCallback(() => {
    fetchNextVideo();
    promptFullscreen();
  }, [fetchNextVideo, promptFullscreen]);

  const handleFighterSelect = useCallback(
    (fighter: Fighter) => {
      fetchVideoByFighter(fighter);
      promptFullscreen();
    },
    [fetchVideoByFighter, promptFullscreen],
  );

  const handleVideoSelect = useCallback(
    (video: MainEventType) => {
      onVideoSelect(video);
      promptFullscreen();
    },
    [onVideoSelect, promptFullscreen],
  );

  const goFullscreen = useCallback(() => {
    setShowFullscreenPrompt(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (videoReady) return;
    const fallback = window.setTimeout(() => setVideoReady(true), 6000);
    return () => window.clearTimeout(fallback);
  }, [videoReady]);

  useEffect(() => {
    if (!fullscreenEnabled) {
      setOverHero(false);
      return;
    }
    const onScroll = () => setOverHero(window.scrollY < window.innerHeight * 0.5);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [fullscreenEnabled]);

  return (
    <ThemeProvider theme={theme}>
      {fullscreenEnabled && !videoReady && !error && <Spinner />}

      <Box
        sx={{
          pb: 8,
          backgroundColor: 'background.default',
        }}
      >
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
          <Button
            onClick={() => navigate('/')}
            variant="text"
            sx={{
              position: 'fixed',
              top: { xs: 12, sm: 20 },
              left: { xs: 12, sm: 24 },
              zIndex: 1300,
              minWidth: 0,
              px: 0,
              py: 0,
              fontFamily: 'Anton, sans-serif',
              fontWeight: 400,
              textTransform: 'uppercase',
              letterSpacing: '0.14em',
              lineHeight: 1,
              fontSize: { xs: '0.95rem', sm: '1.15rem' },
              color: overHero ? 'common.white' : 'text.primary',
              textShadow: overHero ? '0 1px 8px rgba(0, 0, 0, 0.55)' : 'none',
              transition: 'color 0.3s ease, transform 0.25s ease, text-shadow 0.3s ease',
              '&:hover': {
                backgroundColor: 'transparent',
                transform: 'translateX(-4px)',
              },
            }}
          >
            {t('nav.backToWorldMap')}
          </Button>

          {fullscreenEnabled && <Box aria-hidden sx={{ height: '100vh' }} />}

          <MainEvent
            config={config}
            loading={loading}
            error={error}
            mainVideo={mainVideo}
            fetchMainVideo={handleAnotherFight}
            remainingCount={remainingCount}
            onVideoReady={() => setVideoReady(true)}
          />

          <TopFighters
            title={t(config.topFightersTitleKey)}
            topFightersData={topFightersData}
            remainingByFighter={remainingByFighter}
            onFighterSelect={handleFighterSelect}
          />

          <TopFights
            title={t(config.topEventsTitleKey)}
            videos={topEventsList}
            onVideoSelect={handleVideoSelect}
          />

          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <SiteCredit tone="onLight" />
          </Box>
        </Container>
      </Box>

      <Snackbar
        open={showFullscreenPrompt}
        autoHideDuration={6000}
        onClose={() => setShowFullscreenPrompt(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        message={t('mainEvent.fullscreenPromptMessage')}
        action={
          <>
            <Button
              onClick={goFullscreen}
              sx={{
                color: 'primary.main',
                fontFamily: 'Anton, sans-serif',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}
            >
              {t('mainEvent.fullscreenPromptAction')}
            </Button>
            <IconButton
              aria-label={t('mainEvent.fullscreenPromptAction')}
              onClick={() => setShowFullscreenPrompt(false)}
              sx={{ color: 'common.white' }}
            >
              <FontAwesomeIcon icon={faXmark} style={{ fontSize: '1rem' }} />
            </IconButton>
          </>
        }
      />
    </ThemeProvider>
  );
};

export default CountryPage;
