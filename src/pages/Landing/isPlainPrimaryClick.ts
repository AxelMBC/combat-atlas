import type { ClickModifiers } from './isPlainPrimaryClick.types';

const PRIMARY_BUTTON = 0;

export const isPlainPrimaryClick = ({
  button,
  ctrlKey,
  metaKey,
  shiftKey,
  altKey,
}: ClickModifiers): boolean =>
  button === PRIMARY_BUTTON && !ctrlKey && !metaKey && !shiftKey && !altKey;
