import type { FighterNameProps } from './FighterName.types';

import { motion, useReducedMotion } from 'framer-motion';

import { Box, Typography } from '@mui/material';

import { BODY_FONT, HEADLINE_FONT } from '@/styles/fonts/newspaperFonts';
import { splitFighterName } from './splitFighterName';
import { titleCardEntrance } from './titleCardMotion';

const MotionBox = motion.create(Box);

const ENTRANCE_SLIDE_PX = 56;
const GIVEN_NAME_TRACKING = '0.3em';
const PAIRED_SURNAME_SIZE = {
  xs: 'clamp(2.5rem, 13vw, 3.75rem)',
  md: 'clamp(3.5rem, 6.5vw, 7rem)',
};

const SIDE_LAYOUT = {
  left: {
    textAlign: { xs: 'center', md: 'right' },
    placement: { gridRow: '1 / span 3', gridColumn: { md: 1 } },
    offset: { x: -ENTRANCE_SLIDE_PX },
    surnameSize: PAIRED_SURNAME_SIZE,
  },
  right: {
    textAlign: { xs: 'center', md: 'left' },
    placement: { gridRow: { xs: '5 / span 3', md: '1 / span 3' }, gridColumn: { md: 3 } },
    offset: { x: ENTRANCE_SLIDE_PX },
    surnameSize: PAIRED_SURNAME_SIZE,
  },
  solo: {
    textAlign: 'center',
    placement: { gridRow: '1 / span 3' },
    offset: { y: 16 },
    surnameSize: { xs: 'clamp(3rem, 16vw, 4.5rem)', md: 'clamp(4.5rem, 9vw, 9rem)' },
  },
} as const;

const FighterName = ({ name, side, delay }: FighterNameProps) => {
  const shouldReduceMotion = useReducedMotion();
  const { given, nickname, surname } = splitFighterName(name);
  const { textAlign, placement, offset, surnameSize } = SIDE_LAYOUT[side];

  return (
    <MotionBox
      {...titleCardEntrance(shouldReduceMotion, offset, delay)}
      sx={{
        ...placement,
        display: 'grid',
        gridTemplateRows: 'subgrid',
        minWidth: 0,
        textAlign,
      }}
    >
      {given && (
        <Typography
          sx={{
            fontFamily: HEADLINE_FONT,
            fontSize: { xs: '0.85rem', md: '1.05rem', lg: '1.2rem' },
            letterSpacing: GIVEN_NAME_TRACKING,
            textTransform: 'uppercase',
            opacity: 0.7,
            gridRow: 1,
            alignSelf: 'end',
            mr: { md: side === 'left' ? `-${GIVEN_NAME_TRACKING}` : 0 },
          }}
        >
          {given}
        </Typography>
      )}
      <Typography
        sx={{
          fontFamily: HEADLINE_FONT,
          gridRow: 2,
          alignSelf: 'center',
          fontSize: surnameSize,
          lineHeight: 0.95,
          textTransform: 'uppercase',
          overflowWrap: 'anywhere',
        }}
      >
        {surname}
      </Typography>
      {nickname && (
        <Typography
          sx={{
            fontFamily: BODY_FONT,
            fontStyle: 'italic',
            fontSize: { xs: '1rem', md: '1.25rem' },
            color: 'primary.light',
            gridRow: 3,
            alignSelf: 'start',
          }}
        >
          “{nickname}”
        </Typography>
      )}
    </MotionBox>
  );
};

export default FighterName;
