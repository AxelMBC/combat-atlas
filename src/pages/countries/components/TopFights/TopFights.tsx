import { memo } from "react";
import { TopEventsProps } from "./TopFights.types";

// MUI
import { Box, Grid, Typography } from "@mui/material";

// Components
import FightCard from "./FightCard";

const TopFights = memo(({ title, videos, onVideoSelect }: TopEventsProps) => {
  return (
    <Box component="section" marginTop={4}>
      <Typography
        variant="h1"
        sx={{
          color: "primary.dark",
          textAlign: "center",
          textTransform: "uppercase",
          marginBottom: 5,
          fontSize: { xs: "3rem", md: "6rem" },
        }}
      >
        {title}
      </Typography>

      <Grid container spacing={8}>
        {videos.map(
          (video) =>
            video.idYt && (
              <Grid key={video.idYt} size={{ xs: 12, sm: 6, lg: 4 }}>
                <FightCard video={video} onVideoSelect={onVideoSelect} />
              </Grid>
            )
        )}
      </Grid>
    </Box>
  );
});

export default TopFights;
