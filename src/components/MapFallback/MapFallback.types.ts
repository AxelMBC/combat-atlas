export interface MapFallbackProps {
  // When omitted, the retry button always triggers a hard window reload —
  // the right default for render-time crashes where there's nothing to remount.
  onRetry?: () => void;
  canSoftRetry?: boolean;
}
