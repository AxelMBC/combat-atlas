import type { KeyboardEvent } from 'react';

import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';

import useScrollFocus from '@/hooks/useScrollFocus';
import { CLEAN_SANS } from '@/styles/fonts/cleanSans';
import { cardActiveSx, cardSurfaceSx } from '@/pages/countries/components/shared';

import type { FighterCardShellProps } from './FighterCardShell.types';

const FighterCardShell = ({ disabled, onActivate, layoutSx, children }: FighterCardShellProps) => {
  const { surfaces } = useTheme().palette;
  const { ref, isFocused } = useScrollFocus<HTMLDivElement>();

  const activeStyles = {
    ...cardActiveSx(surfaces),
    '& .fighter-portrait img': {
      filter: 'grayscale(0%) brightness(1)',
      '@media (prefers-reduced-motion: no-preference)': {
        transform: 'scale(1.03)',
      },
    },
  } as const;

  const interactiveProps = disabled
    ? {}
    : {
        role: 'button',
        tabIndex: 0,
        onClick: onActivate,
        onKeyDown: (event: KeyboardEvent<HTMLDivElement>) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            onActivate();
          }
        },
      };

  return (
    <Box
      ref={ref}
      {...interactiveProps}
      sx={{
        ...cardSurfaceSx(surfaces),
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.55 : 1,
        height: '100%',
        fontFamily: CLEAN_SANS,
        transition: 'opacity 0.3s ease, transform 300ms ease, border-color 300ms ease',
        '&:focus-visible': disabled
          ? undefined
          : {
              outline: '2px solid',
              outlineColor: 'primary.main',
              outlineOffset: '2px',
              ...activeStyles,
            },
        '@media (hover: hover)': disabled
          ? undefined
          : {
              '&:hover': activeStyles,
            },
        '@media (hover: none)': disabled
          ? undefined
          : {
              transition: 'transform 150ms ease, border-color 150ms ease',
              '& .fighter-portrait img': {
                transition: 'filter 150ms ease, transform 150ms ease',
              },
              ...(isFocused && activeStyles),
            },
        ...layoutSx,
      }}
    >
      {children}
    </Box>
  );
};

export default FighterCardShell;
