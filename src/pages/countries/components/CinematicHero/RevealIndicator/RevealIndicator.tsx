import type { RevealIndicatorProps } from './RevealIndicator.types';

import { useReducedMotion } from 'framer-motion';

import { Box } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import { keyframes } from '@emotion/react';

import { useTranslation } from '@/i18n';

import { HEADLINE_FONT } from '@/styles/fonts/newspaperFonts';
import CountdownNumber from './CountdownNumber';

const SECOND_MS = 1000;
const TRACK_HEIGHT_PX = 4;
const TRACK_MAX_WIDTH_PX = 320;
const SWEEP_SEGMENT_WIDTH = '35%';
const NUMBER_FONT_SIZE = { xs: '1.75rem', md: '2.25rem' } as const;
const LABEL_FONT_SIZE = { xs: '0.7rem', md: '0.8rem' } as const;

const sweep = keyframes`
  from { transform: translateX(-100%); }
  to { transform: translateX(100%); }
`;
const breathe = keyframes`
  0%, 100% { opacity: 0.35; }
  50% { opacity: 1; }
`;
const fill = keyframes`
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
`;

const RevealIndicator = ({ isCountingDown, countdownMs, isHidden }: RevealIndicatorProps) => {
  const { t } = useTranslation();
  const shouldReduceMotion = useReducedMotion();
  const white = useTheme().palette.common.white;

  const countdownSeconds = Math.round(countdownMs / SECOND_MS);
  const fillTiming = shouldReduceMotion ? `steps(${countdownSeconds}, end)` : 'linear';
  const waitingAnimation = shouldReduceMotion
    ? `${breathe} 1.6s ease-in-out infinite`
    : `${sweep} 1.4s ease-in-out infinite`;

  return (
    <Box sx={{ opacity: isHidden ? 0 : 1, transition: 'opacity 350ms ease' }}>
      <Box
        sx={{
          fontFamily: HEADLINE_FONT,
          fontSize: NUMBER_FONT_SIZE,
          lineHeight: 1,
          textAlign: 'center',
          whiteSpace: 'nowrap',
        }}
      >
        <Box
          component="span"
          sx={{
            fontSize: LABEL_FONT_SIZE,
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            color: alpha(white, 0.7),
          }}
        >
          {isCountingDown ? t('titleCard.startsIn') : t('titleCard.preparing')}
        </Box>
        {isCountingDown && (
          <Box
            component="span"
            sx={{ ml: 1.5, color: 'primary.main', fontVariantNumeric: 'tabular-nums' }}
          >
            <CountdownNumber seconds={countdownSeconds} />
          </Box>
        )}
      </Box>

      <Box
        sx={{
          position: 'relative',
          overflow: 'hidden',
          width: `min(${TRACK_MAX_WIDTH_PX}px, 100%)`,
          height: TRACK_HEIGHT_PX,
          mx: 'auto',
          mt: 1.25,
          bgcolor: alpha(white, 0.15),
        }}
      >
        {isCountingDown ? (
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              bgcolor: 'primary.main',
              transformOrigin: 'left',
              animation: `${fill} ${countdownMs}ms ${fillTiming} forwards`,
            }}
          />
        ) : (
          <Box sx={{ position: 'absolute', inset: 0, animation: waitingAnimation }}>
            <Box
              sx={{
                width: SWEEP_SEGMENT_WIDTH,
                height: '100%',
                mx: 'auto',
                bgcolor: 'primary.main',
              }}
            />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default RevealIndicator;
