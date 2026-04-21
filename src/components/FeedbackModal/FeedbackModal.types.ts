import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";

export type FeedbackVariant = "success" | "error";

export interface FeedbackModalProps {
  open: boolean;
  variant: FeedbackVariant;
  title: string;
  message?: string;
  confirmLabel?: string;
  onClose: () => void;
}

export interface VariantStyles {
  borderGradient: string;
  iconColor: string;
  glow: string;
  icon: IconDefinition;
  buttonBg: string;
  buttonBgHover: string;
}
