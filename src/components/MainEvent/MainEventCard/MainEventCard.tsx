import type { MainEventCardProps } from "./MainEventCard.types";

// MUI
import { Box, Typography } from "@mui/material";

const MainEventCard = ({ video }: MainEventCardProps) => (
  <Box
    sx={{
      backgroundColor: "#fff",
      border: "4px solid #000",
      boxShadow: "10px 10px 0 #000",
      padding: 2,
    }}
  >
    <Box border="4px solid #000">
      <Box
        sx={{
          aspectRatio: "16 / 9",
          width: "100%",
          position: "relative",
        }}
      >
        <Box
          allowFullScreen
          component="iframe"
          id="main-event-video"
          src={`https://www.youtube.com/embed/${video.idYt}?autoplay=1&mute=1${
            video.startTime ? `&start=${video.startTime}` : ""
          }`}
          title={video.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media;"
          sx={{
            inset: 0,
            position: "absolute",
            width: "100%",
            height: "100%",
            border: "0",
          }}
        />
      </Box>
    </Box>

    <Box sx={{ marginTop: 2 }}>
      <Typography
        variant="h2"
        sx={{ fontSize: { xs: "1.5rem", md: "2.25rem" } }}
      >
        {video.title} | {video.type}
      </Typography>

      <Box sx={{ marginTop: 1 }}>
        <Typography variant="body1" sx={{ fontSize: 18 }}>
          {video.description}
        </Typography>
      </Box>
    </Box>
  </Box>
);

export default MainEventCard;
