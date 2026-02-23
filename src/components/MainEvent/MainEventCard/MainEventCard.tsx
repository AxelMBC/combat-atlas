import type { mainEvent } from "@/types/fightEvent.type";

// MUI
import { Box, Typography } from "@mui/material";

const MainEventVideo: React.FC<{ video: mainEvent }> = ({ video }) => (
  <Box
    padding={2}
    border="4px solid #000"
    boxShadow="10px 10px 0 #000"
    sx={{
      backgroundColor: "#fff",
    }}
  >
    <Box border="4px solid #000">
      <Box
        position="relative"
        width="100%"
        sx={{
          aspectRatio: "16 / 9",
        }}
      >
        <Box
          component="iframe"
          id="main-event-video"
          src={`https://www.youtube.com/embed/${video.idYt}?autoplay=1&mute=1${
            video.startTime ? `&start=${video.startTime}` : ""
          }`}
          title={video.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media;"
          allowFullScreen
          position="absolute"
          width="100%"
          height="100%"
          border="0"
          sx={{
            inset: 0,
          }}
        />
      </Box>
    </Box>

    <Box marginTop={2}>
      <Typography variant="h2" fontSize={{ xs: "1.5rem", md: "2.25rem" }}>
        {video.title}
      </Typography>

      <Box marginTop={1}>
        <Typography variant="body1" fontSize={18}>
          {video.description}
        </Typography>
      </Box>
    </Box>
  </Box>
);

export default MainEventVideo;
