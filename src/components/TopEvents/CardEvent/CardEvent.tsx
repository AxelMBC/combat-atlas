import type { CardEventProps } from "./CardEvent.types";

// MUI
import { Box, Typography } from "@mui/material";

const CardEvent = ({ video, onVideoSelect }: CardEventProps) => {
  return (
    <Box
      onClick={() => onVideoSelect(video)}
      bgcolor="white"
      display="flex"
      flexDirection="column"
      border="4px solid #000"
      boxShadow="8px 8px 0 #000"
      maxWidth={384}
      minHeight={300}
      sx={{
        cursor: "pointer",
        transition: "all 300ms ease",
        "&:hover": {
          boxShadow: "12px 12px 0 #ca2626",
        },
      }}
    >
      {/* Image */}
      <Box overflow="hidden" borderBottom="4px solid #000">
        <Box
          component="img"
          src={video.thumbnail}
          alt={video.title}
          width="100%"
          height={192}
          sx={{
            objectFit: "cover",
            transition: "all 300ms ease",
            filter: {
              lg: "grayscale(100%)",
            },
            "&:hover": {
              filter: "grayscale(0%)",
              transform: "scale(1.1)",
            },
          }}
        />
      </Box>

      {/* Content */}
      <Box mx={2} my={1} display="flex" flexDirection="column" flexGrow={1}>
        <Typography variant="h3" fontSize="1.2rem" mb={1}>
          {video.title}
        </Typography>

        {/* Tags */}
        <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
          {video.tags.map((tag, index) => (
            <Typography
              variant="body1"
              key={index}
              px={1}
              py={0.5}
              fontSize="0.75rem"
              fontWeight={400}
              border="2px solid #000"
              boxShadow="1px 1px 0 #000"
              color={
                index % 3 === 0
                  ? "text.secondary"
                  : index % 3 === 1
                    ? "text.primary"
                    : "text.secondary"
              }
              bgcolor={
                index % 3 === 0
                  ? "primary.main"
                  : index % 3 === 1
                    ? "#fff"
                    : "secondary.dark"
              }
            >
              {tag}
            </Typography>
          ))}
        </Box>

        {/* View More */}
        <Typography
          variant="button"
          mt="auto"
          textTransform="uppercase"
          alignSelf="flex-end"
          display="flex"
          alignItems="center"
          gap={1}
          color="primary"
          sx={{
            transition: "gap 300ms ease",
            "&:hover": {
              gap: 1.5,
            },
          }}
        >
          Ver Pelea
          <Box
            component="span"
            sx={{
              transition: "transform 300ms ease",
              "&:hover": {
                transform: "translateX(4px)",
              },
            }}
          >
            →
          </Box>
        </Typography>
      </Box>
    </Box>
  );
};

export default CardEvent;
