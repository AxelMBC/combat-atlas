import type { MainEventProps } from "./MainEvent.types";

// MUI
import { Box, Button, Typography } from "@mui/material";

// Libreria Externa
import { motion } from "framer-motion";

// Icon
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDiceThree } from "@fortawesome/free-solid-svg-icons";

// Components
import MainEventCard from "./MainEventCard";

const MotionButton = motion.create(Button);

const MainEvent = ({
  loading,
  error,
  mainVideo,
  fetchMainVideo,
}: MainEventProps) => {
  return (
    <Box
      component="section"
      className="section-spacing"
      borderBottom="8px solid #000"
      marginTop={1}
    >
      {loading && (
        <Typography variant="h1" textAlign="center" fontSize="1.5rem">
          BUSCANDO COMBATE...
        </Typography>
      )}

      {error && (
        <Typography
          textAlign="center"
          fontWeight="bold"
          fontSize="1.5rem"
          p={4}
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
            }}
          >
            <Box component="span" marginRight={1}>
              <FontAwesomeIcon icon={faDiceThree} />
            </Box>
            Otro Combate
          </MotionButton>
        </Box>
      )}
    </Box>
  );
};

export default MainEvent;
