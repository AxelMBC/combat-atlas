import { memo } from "react";
import type { TopFightersProps } from "./TopFighters.types";

// MUI
import { Box, Grid, Typography } from "@mui/material";

// Components
import FighterCard from "./FighterCard";

const TopFighters = memo(
  ({
    title,
    topFightersData,
    remainingByFighter,
    onFighterSelect,
  }: TopFightersProps) => {
    const getRemaining = (id: string) => remainingByFighter[id] ?? 0;

    return (
      <Box
        className="section-spacing"
        sx={{ paddingBottom: 8, marginTop: 4, borderBottom: "8px solid #000" }}
      >
        <Typography
          marginBottom={2}
          variant="h3"
          sx={{
            marginBottom: 2,
            variant: "h3",
            color: "primary.dark",
            textAlign: "center",
            textTransform: "uppercase",
            fontSize: { xs: "1.5rem", md: "6rem" },
          }}
        >
          {title}
        </Typography>

        <Grid container spacing={5}>
          <Grid size={{ xs: 12, md: 6, lg: 8 }}>
            {topFightersData[0] && (
              <FighterCard
                boxer={topFightersData[0]}
                rank={1}
                remaining={getRemaining(topFightersData[0]._id)}
                onSelect={onFighterSelect}
              />
            )}
          </Grid>

          <Grid size={{ xs: 12, md: 6, lg: 4 }}>
            {topFightersData[1] && (
              <FighterCard
                boxer={topFightersData[1]}
                rank={2}
                remaining={getRemaining(topFightersData[1]._id)}
                onSelect={onFighterSelect}
              />
            )}
          </Grid>

          {topFightersData.slice(2).map((b, i) => (
            <Grid key={i} size={{ xs: 12, md: 6, lg: 4 }}>
              <FighterCard
                boxer={b}
                rank={i + 3}
                remaining={getRemaining(b._id)}
                onSelect={onFighterSelect}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }
);

export default TopFighters;
