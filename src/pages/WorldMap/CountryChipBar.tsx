import { Box, Chip, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

import { countryRegistry } from "@/pages/countries/registry";
import { useTranslation } from "@/i18n";

const CountryChipBar = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <Box
      component="nav"
      aria-label={t("worldMap.availableCountriesAria")}
      sx={{
        flex: "0 0 auto",
        width: "100%",
        px: { xs: 2, md: 4 },
        py: 1.5,
        background: "rgba(0, 0, 0, 0.85)",
        borderTop: "1px solid rgba(255, 255, 255, 0.08)",
        display: "flex",
        alignItems: "center",
        gap: 2,
        overflowX: "auto",
      }}
    >
      <Typography
        variant="body2"
        sx={{
          color: "rgba(255, 255, 255, 0.7)",
          fontWeight: 500,
          whiteSpace: "nowrap",
          flexShrink: 0,
        }}
      >
        {t("worldMap.explorePrompt")}
      </Typography>

      <Box sx={{ display: "flex", gap: 1, flexWrap: "nowrap" }}>
        {countryRegistry.map(({ slug, nameKey, accentColor }) => (
          <Chip
            key={slug}
            label={t(nameKey)}
            clickable
            onClick={() => navigate(`/${slug}`)}
            icon={
              <Box
                component="span"
                sx={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: accentColor ?? "rgba(255,255,255,0.6)",
                  ml: "8px !important",
                }}
              />
            }
            sx={{
              color: "white",
              background: "rgba(255, 255, 255, 0.08)",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              fontWeight: 500,
              "&:hover": {
                background: "rgba(255, 255, 255, 0.16)",
              },
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

export default CountryChipBar;
