import type { FighterCardProps } from "./fighterCard.types";

// MUI
import { Box, Typography } from "@mui/material";

const FighterCard = ({ boxer, rank, onSelect }: FighterCardProps) => {
  return (
    <Box
      onClick={() => onSelect(boxer)}
      position="relative"
      sx={{
        cursor: "pointer",
        "&:hover .card-root": {
          boxShadow: "12px 12px 0 #ca2626",
        },
        "&:hover img": {
          filter: { lg: "grayscale(0%)" },
        },
      }}
    >
      <Box
        className="card-root"
        position="relative"
        border="4px solid #000"
        boxShadow="10px 10px 0 #000"
        bgcolor="#fff"
        sx={{
          transition: "all 0.2s ease",
        }}
      >
        <Typography
          variant="h3"
          position="absolute"
          color="text.secondary"
          top={0}
          left={0}
          px={1.5}
          zIndex={1}
          bgcolor="#000"
        >
          <Box component="span" fontSize="3rem">
            #{rank}
          </Box>
        </Typography>

        <Box overflow="hidden">
          <Box
            component="img"
            src={boxer.image}
            alt={boxer.name}
            width="100%"
            height={320}
            sx={{
              objectFit: "cover",
              filter: { lg: "grayscale(100%)" },
              transition: "all 0.3s ease",
            }}
          />
        </Box>

        <Box p={2.5} borderTop="4px solid #000">
          <Typography
            variant="h3"
            sx={{
              fontSize: "1.875rem",
              textTransform: "uppercase",
            }}
          >
            {boxer.name}
          </Typography>

          <Typography variant="body1" color="info.main" mt={0.5}>
            RÉCORD: {boxer.record}
          </Typography>

          <Typography
            mt={0.5}
            variant="body1"
            fontWeight={700}
            textTransform="uppercase"
            color="primary"
          >
            {boxer.nickName}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default FighterCard;
