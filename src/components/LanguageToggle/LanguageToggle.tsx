import { ToggleButton, ToggleButtonGroup } from "@mui/material";

import { useTranslation } from "@/i18n";
import type { Language } from "@/i18n";

const LanguageToggle = () => {
  const { language, setLanguage, t } = useTranslation();

  const handleChange = (
    _event: React.MouseEvent<HTMLElement>,
    next: Language | null
  ) => {
    if (next) setLanguage(next);
  };

  return (
    <ToggleButtonGroup
      value={language}
      exclusive
      size="small"
      onChange={handleChange}
      aria-label={t("language.toggleAria")}
      sx={(theme) => ({
        position: "fixed",
        top: 16,
        right: 16,
        zIndex: theme.zIndex.appBar + 1,
        background: "#000",
        border: "2px solid #000",
        borderRadius: 0,
        boxShadow: "3px 3px 0 #000",
        transition: "transform 120ms ease, box-shadow 120ms ease",
        "&:hover": {
          transform: "translate(-1px, -1px)",
          boxShadow: "4px 4px 0 #000",
        },
        "& .MuiToggleButton-root + .MuiToggleButton-root": {
          borderLeft: "1px solid rgba(255, 255, 255, 0.18)",
        },
        "& .MuiToggleButton-root": {
          color: "rgba(255, 255, 255, 0.55)",
          fontFamily: '"Anton", sans-serif',
          fontSize: "0.95rem",
          letterSpacing: 2,
          border: "none",
          borderRadius: 0,
          px: 1.75,
          py: 0.5,
          transition: "background 120ms ease, color 120ms ease",
          "&:hover": {
            color: "#fff",
            background: "rgba(255, 255, 255, 0.08)",
          },
          "&.Mui-selected": {
            color: "#000",
            background: "#fff",
            "&:hover": { background: "#fff", color: "#000" },
          },
          "&:focus-visible": {
            outline: "2px solid #fff",
            outlineOffset: 2,
          },
        },
      })}
    >
      <ToggleButton value="es" aria-label={t("language.toggle.es")}>
        ES
      </ToggleButton>
      <ToggleButton value="en" aria-label={t("language.toggle.en")}>
        EN
      </ToggleButton>
    </ToggleButtonGroup>
  );
};

export default LanguageToggle;
