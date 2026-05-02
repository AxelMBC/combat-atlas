import "maplibre-gl/dist/maplibre-gl.css";
import "@/styles/WorldMap/styles.scss";
import type { MapRef } from "@vis.gl/react-maplibre";

import { useRef, useState, useEffect, useCallback, useMemo } from "react";
import Map from "react-map-gl/maplibre";
import { useNavigate } from "react-router-dom";

// MUI
import { Box, Button } from "@mui/material";

// Animations
import { motion } from "framer-motion";

// Components
import MapFallback from "@/components/MapFallback";
import CountryChipBar from "./CountryChipBar";

// Data
import { countryRegistry } from "@/pages/countries/registry";

// i18n
import { useTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";

const MotionButton = motion.create(Button);

const PULSE_PERIOD_MS = 1600;
const PULSE_MIN = 0.55;
const PULSE_MAX = 1.0;

const WorldMap = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const layerIdToEntry = useMemo<
    Record<string, (typeof countryRegistry)[number]>
  >(() => {
    const lookup: Record<string, (typeof countryRegistry)[number]> = {};
    for (const c of countryRegistry) lookup[c.mapLayerId] = c;
    return lookup;
  }, []);

  const goToCountry = useCallback(
    (slug: string) => {
      if (slug) {
        navigate(`/${slug}`);
      }
    },
    [navigate]
  );

  const mapRef = useRef<MapRef | null>(null);
  const dialogTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pulseRafRef = useRef<number | null>(null);

  const [mapError, setMapError] = useState(false);
  const [mapRetryKey, setMapRetryKey] = useState(0);
  const [softRetryUsed, setSoftRetryUsed] = useState(false);

  const handleMapRetry = useCallback(() => {
    setMapError(false);
    setMapRetryKey((k) => k + 1);
    setSoftRetryUsed(true);
  }, []);

  const [dialog, setDialog] = useState<{
    show: boolean;
    nameKey: TranslationKey | null;
    slug: string;
    lng: number;
    lat: number;
    x: number;
    y: number;
  }>({
    show: false,
    nameKey: null,
    slug: "",
    lng: 0,
    lat: 0,
    x: 0,
    y: 0,
  });

  const [hover, setHover] = useState<{
    nameKey: TranslationKey;
    x: number;
    y: number;
  } | null>(null);

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

  const handleMouseMove = (
    event: maplibregl.MapMouseEvent & {
      lngLat: maplibregl.LngLat;
      point: { x: number; y: number };
    }
  ) => {
    if (!mapRef.current) return;
    const map = mapRef.current.getMap();
    const features = map.queryRenderedFeatures(event.point);

    const topId = features.length > 0 ? features[0].layer.id : null;
    const entry = topId ? layerIdToEntry[topId] : undefined;

    map.getCanvas().style.cursor = entry ? "pointer" : "";

    if (entry) {
      setHover({ nameKey: entry.nameKey, x: event.point.x, y: event.point.y });
    } else {
      setHover((prev) => (prev ? null : prev));
    }
  };

  const handleMouseLeave = () => {
    if (mapRef.current) {
      mapRef.current.getMap().getCanvas().style.cursor = "";
    }
    setHover((prev) => (prev ? null : prev));
  };

  const handleClick = (
    event: maplibregl.MapMouseEvent & {
      lngLat: maplibregl.LngLat;
      point: { x: number; y: number };
    }
  ) => {
    if (!mapRef.current) return;

    const map = mapRef.current.getMap();
    const features = map.queryRenderedFeatures(event.point);

    if (features.length > 0) {
      const topId = features[0].layer.id;
      const entry = layerIdToEntry[topId];
      if (!entry) return;

      setDialog({
        show: true,
        nameKey: entry.nameKey,
        slug: entry.slug,
        lng: event.lngLat.lng,
        lat: event.lngLat.lat,
        x: event.point.x,
        y: event.point.y,
      });

      if (dialogTimerRef.current) clearTimeout(dialogTimerRef.current);
      dialogTimerRef.current = setTimeout(() => {
        setDialog((prev) => ({ ...prev, show: false }));
        dialogTimerRef.current = null;
      }, 3000);
    }
  };

  const handleMapLoad = () => {
    if (!mapRef.current) return;
    const map = mapRef.current.getMap();

    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    const layerIds = countryRegistry
      .map((c) => c.mapLayerId)
      .filter((id) => map.getLayer(id));

    if (layerIds.length === 0) return;

    const start = performance.now();
    const tick = (now: number) => {
      const phase = ((now - start) % PULSE_PERIOD_MS) / PULSE_PERIOD_MS;
      const opacity =
        PULSE_MIN +
        (PULSE_MAX - PULSE_MIN) * (0.5 + 0.5 * Math.sin(phase * Math.PI * 2));

      for (const id of layerIds) {
        try {
          map.setPaintProperty(id, "fill-opacity", opacity);
        } catch {
          /* layer may have been removed mid-flight; ignore */
        }
      }
      pulseRafRef.current = requestAnimationFrame(tick);
    };
    pulseRafRef.current = requestAnimationFrame(tick);
  };

  useEffect(() => {
    return () => {
      if (dialogTimerRef.current) clearTimeout(dialogTimerRef.current);
      if (pulseRafRef.current !== null)
        cancelAnimationFrame(pulseRafRef.current);
    };
  }, []);

  if (mapError) {
    return (
      <MapFallback onRetry={handleMapRetry} canSoftRetry={!softRetryUsed} />
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100vw",
        height: "100vh",
      }}
    >
      <Box sx={{ position: "relative", flex: 1, minHeight: 0 }}>
        <Map
          key={mapRetryKey}
          mapStyle={`https://api.maptiler.com/maps/0197251e-f92a-7cb9-98e8-774bde6e5d8e/style.json?key=${import.meta.env.VITE_MAPTILER_KEY}`}
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
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onLoad={handleMapLoad}
          onError={(event) => {
            console.error("[WorldMap] map error", event.error);
            if (pulseRafRef.current !== null) {
              cancelAnimationFrame(pulseRafRef.current);
              pulseRafRef.current = null;
            }
            setMapError(true);
          }}
        />

        {hover && !dialog.show && (
          <Box
            sx={{
              position: "absolute",
              left: hover.x + 12,
              top: hover.y + 12,
              zIndex: 999,
              px: 1.25,
              py: 0.5,
              background: "rgba(0, 0, 0, 0.8)",
              color: "white",
              borderRadius: 1,
              fontSize: "0.875rem",
              fontWeight: 500,
              pointerEvents: "none",
              whiteSpace: "nowrap",
            }}
          >
            {t(hover.nameKey)}
          </Box>
        )}

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
              onClick={() => goToCountry(dialog.slug)}
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
              {dialog.nameKey ? t(dialog.nameKey) : ""}
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

      <CountryChipBar />
    </Box>
  );
};

export default WorldMap;
