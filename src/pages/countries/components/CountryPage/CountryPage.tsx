import type { CountryPageProps } from './CountryPage.types';

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// MUI
import { Box, Container, Button } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';

// Components
import TopFighters from '@/pages/countries/components/TopFighters';
import MainEvent from '@/pages/countries/components/MainEvent';
import TopFights from '@/pages/countries/components/TopFights';

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

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <ThemeProvider theme={theme}>
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
              position: { xs: 'static', sm: 'fixed' },
              top: { sm: 20 },
              left: { sm: 24 },
              alignSelf: { xs: 'flex-start', sm: 'auto' },
              pl: { xs: 0, sm: 1 },
              mb: { xs: 1, sm: 0 },
              color: 'text.primary',
              opacity: 0.7,
              fontSize: { xs: '1rem', sm: '1.5rem' },
              '&:hover': {
                opacity: 1,
                backgroundColor: 'transparent',
              },
            }}
          >
            {t('nav.backToWorldMap')}
          </Button>
          <MainEvent
            config={config}
            loading={loading}
            error={error}
            mainVideo={mainVideo}
            fetchMainVideo={fetchNextVideo}
            remainingCount={remainingCount}
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
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default CountryPage;
