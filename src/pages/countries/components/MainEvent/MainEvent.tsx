import { memo } from "react";
import type { MainEventProps } from "./MainEvent.types";

import { motion } from "framer-motion";

// MUI
import { Box, Button, Typography } from "@mui/material";

// Components
import MainEventCard from "./MainEventCard";

// i18n
import { useTranslation } from "@/i18n";

// Icon
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDiceThree } from "@fortawesome/free-solid-svg-icons";

const MotionButton = motion.create(Button);

const MainEvent = memo(
  ({ loading, error, mainVideo, fetchMainVideo }: MainEventProps) => {
    const { t } = useTranslation();
    return (
      <Box
        component="section"
        className="section-spacing"
        sx={{
          borderBottom: "8px solid #000",
          marginTop: 1,
        }}
      >
        {loading && (
          <Typography
            variant="h1"
            sx={{
              textAlign: "center",
              fontSize: "1.5rem",
            }}
          >
            {t("mainEvent.searching")}
          </Typography>
        )}

        {error && (
          <Typography
            sx={{
              textAlign: "center",
              fontWeight: "bold",
              fontSize: "1.5rem",
              p: 4,
            }}
          >
            {error}
          </Typography>
        )}

        {mainVideo && <MainEventCard video={mainVideo} />}

        {!loading && mainVideo && (
          <Box textAlign="center" mb={8} mt={6}>
            <MotionButton
              id="fetch-another-fight"
              onClick={fetchMainVideo}
              whileHover={{ scale: 1.3 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              sx={{
                cursor: "pointer",
                textTransform: "uppercase",
                fontSize: "1.5rem",
                py: 1.5,
                px: 4,
                backgroundColor: "primary.main",
                color: "text.secondary",
                transition: { type: "spring", stiffness: 400, damping: 17 },
              }}
            >
              <Box component="span" marginRight={1}>
                <FontAwesomeIcon icon={faDiceThree} />
              </Box>
              {t("mainEvent.anotherFight")}
            </MotionButton>
          </Box>
        )}
      </Box>
    );
  }
);

export default MainEvent;
