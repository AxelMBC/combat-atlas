export type SpinnerSize = "small" | "medium" | "large";

export interface SpinnerProps {
  size?: SpinnerSize;
  label?: string;
  fullscreen?: boolean;
}
