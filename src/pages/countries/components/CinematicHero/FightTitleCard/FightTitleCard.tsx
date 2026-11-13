import type { FightTitleCardProps } from './FightTitleCard.types';

import { motion, useReducedMotion } from 'framer-motion';

import { Box, Typography } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';

import { useTranslation } from '@/i18n';

import { getFightBilling, getFightDiscipline } from '@/utils/fightBilling';
import { BODY_FONT, HEADLINE_FONT } from '@/styles/fonts/newspaperFonts';
import FighterName from './FighterName';
import FightFacts from './FightFacts';
import { titleCardEntrance } from './titleCardMotion';

const MotionBox = motion.create(Box);

const RIBBON_SKEW = 'skewX(-12deg)';
const RIBBON_TEXT_UNSKEW = 'skewX(12deg)';
const HALFTONE_MASK = 'radial-gradient(ellipse 55% 60% at 50% 50%, black 0%, transparent 100%)';
const WATERMARK_TRANSITION = { duration: 1.4, ease: 'easeOut' } as const;
const NAMES_DELAY_S = 0.15;
const VS_DELAY_S = 0.4;
const FACTS_DELAY_S = 0.55;

const ribbonTextSx = { display: 'inline-block', transform: RIBBON_TEXT_UNSKEW } as const;

const ribbonSx = {
  display: 'inline-flex',
  transform: RIBBON_SKEW,
  px: 1.75,
  py: 0.5,
  fontFamily: HEADLINE_FONT,
  fontSize: { xs: '0.75rem', md: '0.85rem' },
  lineHeight: 1.4,
  letterSpacing: '0.25em',
  textTransform: 'uppercase',
} as const;

const FightTitleCard = ({ video }: FightTitleCardProps) => {
  const { t, language } = useTranslation();
  const shouldReduceMotion = useReducedMotion();
  const { palette } = useTheme();
  const white = palette.common.white;
  const accent = palette.primary.main;

  const eyebrow = getFightDiscipline(video, language);
  const fighters = getFightBilling(video);
  const vsLabel = t('mainEvent.vs');

  return (
    <Box
      aria-hidden
      sx={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        bgcolor: 'common.black',
        color: 'common.white',
        pointerEvents: 'none',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(ellipse 65% 55% at 50% 50%, ${alpha(accent, 0.3)} 0%, ${alpha(accent, 0.08)} 45%, transparent 75%)`,
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `radial-gradient(${alpha(white, 0.14)} 1px, transparent 1.5px)`,
          backgroundSize: '6px 6px',
          maskImage: HALFTONE_MASK,
          WebkitMaskImage: HALFTONE_MASK,
        }}
      />

      <Box key={video.idYt} sx={{ position: 'absolute', inset: 0 }}>
        {video.year && (
          <MotionBox
            {...titleCardEntrance(shouldReduceMotion, { scale: 1.08 }, 0)}
            transition={WATERMARK_TRANSITION}
            sx={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: HEADLINE_FONT,
              fontSize: { xs: '62vw', md: '40vw' },
              lineHeight: 1,
              letterSpacing: '-0.02em',
              whiteSpace: 'nowrap',
              color: 'transparent',
              WebkitTextStroke: `1px ${alpha(white, 0.09)}`,
            }}
          >
            {video.year}
          </MotionBox>
        )}

        <Box
          sx={{
            position: 'relative',
            height: '100%',
            display: 'grid',
            gridTemplateRows: '1fr auto 1fr',
            px: { xs: 2.5, md: 6 },
          }}
        >
          <MotionBox
            {...titleCardEntrance(shouldReduceMotion, { y: -12 }, 0.05)}
            sx={{
              alignSelf: 'end',
              pb: { xs: 3, md: 4 },
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 1.5,
            }}
          >
            <Typography
              sx={{
                fontFamily: BODY_FONT,
                fontStyle: 'italic',
                fontSize: { xs: '0.8rem', md: '0.95rem' },
                color: alpha(white, 0.6),
              }}
            >
              {t('titleCard.presents')}
            </Typography>
            {(eyebrow || video.organization) && (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 1 }}>
                {eyebrow && (
                  <Box sx={{ ...ribbonSx, bgcolor: 'primary.main' }}>
                    <Box component="span" sx={ribbonTextSx}>
                      ★ {eyebrow} ★
                    </Box>
                  </Box>
                )}
                {video.organization && (
                  <Box sx={{ ...ribbonSx, border: `1px solid ${alpha(white, 0.6)}` }}>
                    <Box component="span" sx={ribbonTextSx}>
                      {t('titleCard.titleFight', { organization: video.organization })}
                    </Box>
                  </Box>
                )}
              </Box>
            )}
          </MotionBox>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: fighters ? { xs: '1fr', md: '1fr auto 1fr' } : '1fr',
              gridTemplateRows: fighters
                ? { xs: 'repeat(7, auto)', md: 'repeat(3, auto)' }
                : 'repeat(3, auto)',
              alignItems: 'center',
              columnGap: { md: 5 },
              rowGap: { xs: 0.75, md: 1 },
            }}
          >
            {fighters ? (
              <>
                <FighterName name={fighters[0]} side="left" delay={NAMES_DELAY_S} />
                <MotionBox
                  {...titleCardEntrance(shouldReduceMotion, { scale: 1.8 }, VS_DELAY_S)}
                  data-label={vsLabel}
                  sx={{
                    position: 'relative',
                    justifySelf: 'center',
                    gridRow: { xs: 4, md: 2 },
                    gridColumn: { md: 2 },
                    my: { xs: 1, md: 0 },
                    fontFamily: HEADLINE_FONT,
                    fontSize: { xs: '2.75rem', md: 'clamp(3.5rem, 5vw, 5.5rem)' },
                    lineHeight: 1,
                    letterSpacing: '0.04em',
                    color: 'primary.main',
                    '&::after': {
                      content: 'attr(data-label)',
                      position: 'absolute',
                      inset: 0,
                      transform: 'translate(0.07em, 0.07em)',
                      color: 'transparent',
                      WebkitTextStroke: `1px ${alpha(white, 0.5)}`,
                    },
                  }}
                >
                  {vsLabel}
                </MotionBox>
                <FighterName name={fighters[1]} side="right" delay={NAMES_DELAY_S} />
              </>
            ) : (
              <FighterName name={video.title} side="solo" delay={NAMES_DELAY_S} />
            )}
          </Box>

          <Box sx={{ alignSelf: 'start', pt: { xs: 3, md: 4 } }}>
            <FightFacts video={video} delay={FACTS_DELAY_S} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default FightTitleCard;
