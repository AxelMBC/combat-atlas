import { memo } from "react";
import type { FighterCardProps } from "./FighterCard.types";

// MUI
import { Box, Typography } from "@mui/material";

const FighterCard = memo(
  ({ boxer, rank, remaining, onSelect }: FighterCardProps) => {
    const disabled = remaining <= 0;

    return (
      <Box
        onClick={disabled ? undefined : () => onSelect(boxer)}
        position="relative"
        sx={{
          cursor: disabled ? "not-allowed" : "pointer",
          opacity: disabled ? 0.55 : 1,
          transition: "opacity 0.3s ease",
          "&:hover img": {
            filter: {
              lg: disabled ? "grayscale(100%)" : "grayscale(0%)",
            },
          },
        }}
      >
        <Box
          sx={(theme) => ({
            border: `4px solid ${theme.palette.common.black}`,
            boxShadow: `10px 10px 0 ${theme.palette.common.black}`,
            bgcolor: "#fff",
            position: "relative",
          })}
        >
          <Typography
            variant="h3"
            sx={{
              position: "absolute",
              color: "text.secondary",
              top: 0,
              left: 0,
              px: 1.5,
              zIndex: 2,
              bgcolor: "#000",
            }}
          >
            <Box component="span" fontSize="3rem">
              #{rank}
            </Box>
          </Typography>

          <Box
            sx={(theme) => ({
              position: "absolute",
              top: 0,
              right: 0,
              zIndex: 2,
              px: 1.5,
              py: 0.5,
              bgcolor: disabled
                ? theme.palette.common.black
                : theme.palette.primary.main,
              color: "#fff",
              borderLeft: `4px solid ${theme.palette.common.black}`,
              borderBottom: `4px solid ${theme.palette.common.black}`,
              boxShadow: `4px 4px 0 ${theme.palette.common.black}`,
              fontFamily: "Anton, sans-serif",
              display: "flex",
              alignItems: "baseline",
              gap: 0.75,
            })}
          >
            {disabled ? (
              <Box
                component="span"
                sx={{
                  fontSize: "1.25rem",
                  textTransform: "uppercase",
                  letterSpacing: 1,
                }}
              >
                Sin peleas
              </Box>
            ) : (
              <>
                <Box
                  component="span"
                  sx={{ fontSize: "2.25rem", lineHeight: 1 }}
                >
                  {remaining}
                </Box>
                <Box
                  component="span"
                  sx={{
                    fontSize: "0.8rem",
                    textTransform: "uppercase",
                    letterSpacing: 0.5,
                  }}
                >
                  {remaining === 1 ? "pelea" : "peleas"}
                </Box>
              </>
            )}
          </Box>

          <Box overflow="hidden" position="relative">
            <Box
              component="img"
              src={boxer.image}
              alt={boxer.name}
              sx={{
                objectFit: "cover",
                filter: {
                  lg: disabled ? "grayscale(100%)" : "grayscale(100%)",
                },
                transition: "all 0.3s ease",
                height: 320,
                width: "100%",
                display: "block",
              }}
            />

            {disabled && (
              <Box
                sx={(theme) => ({
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%) rotate(-12deg)",
                  px: 4,
                  py: 1,
                  bgcolor: theme.palette.primary.main,
                  color: "#fff",
                  border: `4px solid ${theme.palette.common.black}`,
                  boxShadow: `6px 6px 0 ${theme.palette.common.black}`,
                  fontFamily: "Anton, sans-serif",
                  fontSize: "2.5rem",
                  textTransform: "uppercase",
                  letterSpacing: 2,
                  whiteSpace: "nowrap",
                })}
              >
                Agotado
              </Box>
            )}
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

            <Typography sx={{ variant: "body1", color: "info.main", mt: 0.5 }}>
              RÉCORD: {boxer.record}
            </Typography>

            <Typography
              variant="body1"
              sx={{
                color: "primary",
                mt: 0.5,
                fontWeight: 700,
                textTransform: "uppercase",
              }}
            >
              {boxer.nickName}
            </Typography>
          </Box>
        </Box>
      </Box>
    );
  }
);

export default FighterCard;
