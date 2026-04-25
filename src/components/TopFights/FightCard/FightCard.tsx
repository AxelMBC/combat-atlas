import { memo } from "react";
import type { CardEventProps } from "./FightCard.types";

// MUI
import { Box, Typography } from "@mui/material";

const FALLBACK_THUMBNAIL = "/placeholders/no-video-placeholder.png";

const youtubeThumbnail = (idYt: string) =>
  `https://i.ytimg.com/vi/${idYt}/hq720.jpg`;

const FightCard = memo(({ video, onVideoSelect }: CardEventProps) => {
  const thumbnailSrc =
    video.thumbnail ||
    (video.idYt ? youtubeThumbnail(video.idYt) : FALLBACK_THUMBNAIL);

  return (
    <Box
      onClick={() => onVideoSelect(video)}
      sx={{
        cursor: "pointer",
        transition: "all 300ms ease",
        "&:hover": {
          boxShadow: "12px 12px 0 #ca2626",
        },
        bgcolor: "white",
        display: "flex",
        flexDirection: "column",
        border: "4px solid #000",
        boxShadow: "8px 8px 0 #000",
        maxWidth: 384,
        minHeight: 300,
      }}
    >
      <Box overflow="hidden" borderBottom="4px solid #000">
        <Box
          component="img"
          src={thumbnailSrc}
          alt={video.title}
          onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
            if (!e.currentTarget.src.endsWith(FALLBACK_THUMBNAIL)) {
              e.currentTarget.src = FALLBACK_THUMBNAIL;
            }
          }}
          onLoad={(e: React.SyntheticEvent<HTMLImageElement>) => {
            const img = e.currentTarget;
            if (
              img.src.includes("i.ytimg.com") &&
              img.naturalWidth <= 120
            ) {
              img.src = FALLBACK_THUMBNAIL;
            }
          }}
          sx={{
            width: "100%",
            height: 192,
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

      <Box
        sx={{
          mx: 2,
          my: 1,
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
        }}
      >
        <Typography
          variant="h3"
          sx={{
            fontSize: "1.2rem",
            mb: 1,
          }}
        >
          {video.title}
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 1,
            mb: 2,
          }}
        >
          {video.tags.map((tag, index) => (
            <Typography
              key={index}
              variant="body1"
              sx={{
                px: 1,
                py: 0.5,
                fontSize: "0.75rem",
                fontWeight: 400,
                border: "2px solid #000",
                boxShadow: "1px 1px 0 #000",
                color:
                  index % 3 === 0
                    ? "text.secondary"
                    : index % 3 === 1
                      ? "text.primary"
                      : "text.secondary",
                bgcolor:
                  index % 3 === 0
                    ? "primary.main"
                    : index % 3 === 1
                      ? "#fff"
                      : "secondary.dark",
              }}
            >
              {tag}
            </Typography>
          ))}
        </Box>

        <Typography
          variant="button"
          sx={{
            color: "primary",

            transition: "gap 300ms ease",
            "&:hover": {
              gap: 1.5,
            },
            mt: "auto",
            textTransform: "uppercase",
            alignSelf: "flex-end",
            display: "flex",
            alignItems: "center",
            gap: 1,
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
});

export default FightCard;
