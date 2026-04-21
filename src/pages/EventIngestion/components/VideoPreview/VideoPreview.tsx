import { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { YT_ID_REGEX } from "@/pages/EventIngestion/eventIngestion.config";
import type { VideoPreviewProps } from "./VideoPreview.types";

const VideoPreview = ({ idYt, startTime }: VideoPreviewProps) => {
  const [debouncedId, setDebouncedId] = useState(idYt);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedId(idYt);
    }, 800);
    return () => clearTimeout(timer);
  }, [idYt]);

  const isValid = YT_ID_REGEX.test(debouncedId);

  return (
    <Box
      sx={{
        width: "100%",
        aspectRatio: "16/9",
        bgcolor: "grey.900",
        borderRadius: 1,
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {isValid ? (
        <iframe
          width="100%"
          height="100%"
          src={`https://www.youtube.com/embed/${debouncedId}?start=${startTime}`}
          title="YouTube video preview"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{ border: "none" }}
        />
      ) : (
        <Typography color="grey.500" variant="body2">
          {debouncedId.length > 0
            ? "ID de YouTube inválido (debe tener 11 caracteres)"
            : "Ingresá el ID del video para previsualizar"}
        </Typography>
      )}
    </Box>
  );
};

export default VideoPreview;
