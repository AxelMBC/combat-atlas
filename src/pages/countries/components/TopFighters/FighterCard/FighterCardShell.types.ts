import type { ReactNode } from 'react';
import type { SystemStyleObject, Theme } from '@mui/system';

export interface FighterCardShellProps {
  disabled: boolean;
  onActivate: () => void;
  layoutSx: SystemStyleObject<Theme>;
  children: ReactNode;
}
