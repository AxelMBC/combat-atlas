import type { CountryPageProps } from "./CountryPage.types";

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

// MUI
import { Box, Container, Button } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";

// Components
import TitleCountry from "@/components/TitleCountry";
import TopFighters from "@/components/TopFighters";
import MainEvent from "@/components/MainEvent";
import TopEvents from "@/components/TopEvents";

// Hooks
import { useMainVideoQueue } from "@/hooks/useMainVideoQueue";

const CountryPage = ({
  config,
  topFightersData,
  topEventsList,
  mainEventFights,
  theme,
}: CountryPageProps) => {
  const navigate = useNavigate();

  const {
    mainVideo,
    loading,
    error,
    fetchNextVideo,
    fetchVideoByFighter,
    onVideoSelect,
  } = useMainVideoQueue(mainEventFights);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          pb: 8,
          backgroundColor: "background.default",
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
            onClick={() => navigate("/")}
            variant="text"
            sx={{
              position: "fixed",
              top: 20,
              left: 24,
              color: "text.primary",
              opacity: 0.7,
              fontSize: "1.5rem",
              "&:hover": {
                opacity: 1,
                backgroundColor: "transparent",
              },
            }}
          >
            ← Mapa Mundial
          </Button>
          <TitleCountry title={config.headerTitle} />

          <MainEvent
            loading={loading}
            error={error}
            mainVideo={mainVideo}
            fetchMainVideo={fetchNextVideo}
          />

          <TopFighters
            title={config.topFightersTitle}
            topFightersData={topFightersData}
            onFighterSelect={fetchVideoByFighter}
          />

          <TopEvents
            title={config.topEventsTitle}
            videos={topEventsList}
            onVideoSelect={onVideoSelect}
          />
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default CountryPage;
