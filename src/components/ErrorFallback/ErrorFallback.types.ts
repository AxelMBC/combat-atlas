import type { Theme } from "@mui/material/styles";

export interface ErrorFallbackProps {
  theme: Theme;
  title?: string;
  message?: string;
  onRetry?: () => void;
}
