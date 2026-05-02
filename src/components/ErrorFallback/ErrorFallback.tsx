import type { ErrorFallbackProps } from "./ErrorFallback.types";
import { useNavigate } from "react-router-dom";
import { Box, Button, Typography } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { useTranslation } from "@/i18n";

const ErrorFallback = ({
  theme,
  title,
  message,
  onRetry,
}: ErrorFallbackProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: "100vh",
          backgroundColor: "background.default",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 3,
          px: 3,
          textAlign: "center",
        }}
      >
        <Typography
          variant="h1"
          sx={{ fontSize: { xs: "5rem", sm: "8rem" }, color: "primary.main" }}
        >
          !
        </Typography>

        <Typography
          variant="h2"
          sx={{
            fontSize: { xs: "1.8rem", sm: "2.5rem" },
            color: "text.primary",
          }}
        >
          {title ? title : t("errorFallback.defaultTitle")}
        </Typography>

        <Typography
          variant="body1"
          sx={{
            color: "text.primary",
            opacity: 0.7,
            maxWidth: 480,
            fontSize: "1rem",
          }}
        >
          {message ?? t("errorFallback.defaultMessage")}
        </Typography>

        <Box
          sx={{
            display: "flex",
            gap: 2,
            flexWrap: "wrap",
            justifyContent: "center",
            mt: 1,
          }}
        >
          {onRetry && (
            <Button
              variant="contained"
              color="primary"
              onClick={onRetry}
              sx={{ fontFamily: "inherit", px: 4, py: 1.2, borderRadius: 0 }}
            >
              {t("common.retry")}
            </Button>
          )}
          <Button
            variant="outlined"
            color="primary"
            onClick={() => navigate("/")}
            sx={{ fontFamily: "inherit", px: 4, py: 1.2, borderRadius: 0 }}
          >
            {t("nav.backToWorldMap")}
          </Button>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default ErrorFallback;
