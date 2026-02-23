import { TopEventsProps } from "./TopEvents.types";

// MUI
import { Box, Grid, Typography } from "@mui/material";

// Components
import CardEvent from "./CardEvent";

const TopEvents = ({ title, videos, onVideoSelect }: TopEventsProps) => {
  return (
    <Box component="section" marginTop={4}>
      <Typography
        variant="h1"
        color="primary.dark"
        textAlign="center"
        textTransform="uppercase"
        marginBottom={5}
        fontSize={{
          xs: "3rem",
          md: "6rem",
        }}
      >
        {title}
      </Typography>

      <Grid container spacing={8}>
        {videos.map(
          (video) =>
            video.idYt && (
              <Grid key={video.idYt} size={{ xs: 12, sm: 6, lg: 4 }}>
                <CardEvent video={video} onVideoSelect={onVideoSelect} />
              </Grid>
            )
        )}
      </Grid>
    </Box>
  );
};

export default TopEvents;
