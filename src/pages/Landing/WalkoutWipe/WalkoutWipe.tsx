import type { WalkoutWipeProps } from './WalkoutWipe.types';

import { motion } from 'framer-motion';

import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';

import { HEADLINE_FONT } from '@/styles/fonts/newspaperFonts';

const MotionBox = motion.create(Box);

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;
const WIPE_SKEW_DEG = -12;
const WIPE_SWEEP_S = 0.3;
const NAME_DELAY_S = 0.08;
const NAME_GROW_S = 0.28;

const WalkoutWipe = ({ name, accentColor }: WalkoutWipeProps) => {
  const { palette, zIndex } = useTheme();

  return (
    <Box
      data-testid="walkout-wipe"
      aria-hidden
      sx={{
        position: 'fixed',
        inset: 0,
        zIndex: zIndex.modal + 1,
        overflow: 'hidden',
        pointerEvents: 'none',
      }}
    >
      <MotionBox
        initial={{ x: '-100%', skewX: WIPE_SKEW_DEG }}
        animate={{ x: '0%', skewX: WIPE_SKEW_DEG }}
        transition={{ duration: WIPE_SWEEP_S, ease: EASE_OUT_EXPO }}
        sx={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: '-25vh',
          width: 'calc(100vw + 50vh)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: accentColor,
        }}
      >
        <MotionBox
          initial={{ opacity: 0, scale: 0.7, skewX: -WIPE_SKEW_DEG }}
          animate={{ opacity: 1, scale: 1, skewX: -WIPE_SKEW_DEG }}
          transition={{ duration: NAME_GROW_S, delay: NAME_DELAY_S, ease: EASE_OUT_EXPO }}
          sx={{
            fontFamily: HEADLINE_FONT,
            fontSize: 'clamp(3rem, 13vw, 11rem)',
            lineHeight: 1,
            textTransform: 'uppercase',
            whiteSpace: 'nowrap',
            color: palette.getContrastText(accentColor),
          }}
        >
          {name}
        </MotionBox>
      </MotionBox>
    </Box>
  );
};

export default WalkoutWipe;
