import "maplibre-gl/dist/maplibre-gl.css";
import "@/styles/WorldMap/styles.scss";
import type { MapRef } from "@vis.gl/react-maplibre";

import { useRef, useState, useEffect } from "react";
import Map from "react-map-gl/maplibre";
import { useNavigate } from "react-router-dom";

// MUI
import { Box, Button } from "@mui/material";

// Animations
import { motion } from "framer-motion";

const MotionButton = motion.create(Button);

const WorldMap = () => {
  const navigate = useNavigate();

  const goToCountry = (country: string) => {
    if (country) {
      navigate(`/${country}`);
    }
  };

  const mapRef = useRef<MapRef | null>(null);

  const [dialog, setDialog] = useState({
    show: false,
    country: "",
    lng: 0,
    lat: 0,
    x: 0,
    y: 0,
  });

  useEffect(() => {
    const updateDialogPosition = () => {
      if (!mapRef.current) return;
      const map = mapRef.current.getMap();
      const point = map.project([dialog.lng, dialog.lat]);
      setDialog((prev) => ({ ...prev, x: point.x, y: point.y }));
    };

    if (dialog.show && mapRef.current) {
      const map = mapRef.current.getMap();
      map.on("move", updateDialogPosition);
      return () => {
        map.off("move", updateDialogPosition);
      };
    }
  }, [dialog.lat, dialog.lng, dialog.show]);

  const handleClick = (
    event: maplibregl.MapMouseEvent & {
      lngLat: maplibregl.LngLat;
      point: { x: number; y: number };
    }
  ) => {
    if (!mapRef.current) return;

    const map = mapRef.current.getMap();
    const features = map.queryRenderedFeatures(event.point);

    if (
      features.length > 0 &&
      features[0].layer.id !== "Water" &&
      features[0].layer.id !== "Country labels" &&
      features[0].layer.id !== "Ocean labels"
    ) {
      const countryName = features[0].layer.id;

      setDialog({
        show: true,
        country: countryName,
        lng: event.lngLat.lng,
        lat: event.lngLat.lat,
        x: event.point.x,
        y: event.point.y,
      });

      setTimeout(() => {
        setDialog((prev) => ({ ...prev, show: false }));
      }, 3000);
    }
  };

  return (
    <Box
      sx={{
        position: "relative",
        width: "100vw",
        height: "100vh",
      }}
    >
      <Map
        mapStyle="https://api.maptiler.com/maps/0197251e-f92a-7cb9-98e8-774bde6e5d8e/style.json?key=FcmP3QUhWP2LWWud2CSk"
        ref={mapRef}
        minZoom={2}
        renderWorldCopies={false}
        initialViewState={{
          longitude: 0,
          latitude: 21.8,
          zoom: 2,
        }}
        style={{
          width: "100%",
          height: "100%",
          display: "block",
        }}
        onClick={handleClick}
      />

      {dialog.show && (
        <Box
          className="country-label animate-pop-in"
          sx={{
            position: "absolute",
            zIndex: 1000,
            left: dialog.x,
            top: dialog.y - 80,
            transform: "translateX(-50%)",
            px: 2,
            py: 1.5,
            minWidth: 180,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            background: "rgba(0,0,0,0.6)",
            borderRadius: 2,
          }}
        >
          <MotionButton
            className="fc-white"
            onClick={() => goToCountry(dialog.country)}
            variant="text"
            disableRipple
            whileHover={{ scale: 1.25 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 500 }}
            sx={{
              cursor: "pointer",
              fontWeight: 550,
              fontSize: "1.25rem",
              textTransform: "none",
              color: "white",
              padding: 0,
              minWidth: 0,
            }}
          >
            {dialog.country}
          </MotionButton>

          <Box
            sx={{
              position: "absolute",
              bottom: -10,
              left: "50%",
              transform: "translateX(-50%)",
              width: 0,
              height: 0,
              borderLeft: "10px solid transparent",
              borderRight: "10px solid transparent",
              borderTop: "10px solid #cc1c2a",
            }}
          />
        </Box>
      )}
    </Box>
  );
};

export default WorldMap;
