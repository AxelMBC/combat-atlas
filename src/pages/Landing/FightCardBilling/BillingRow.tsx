import type { PointerEvent } from 'react';
import type { TranslateFn } from '@/i18n';
import type { CountryFightCount } from '@/pages/Landing/useCountryFightCounts.types';
import type { BillingRowProps } from './BillingRow.types';

import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

import { Box } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';

import { useTranslation } from '@/i18n';
import { HEADLINE_FONT } from '@/styles/fonts/newspaperFonts';

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;
const ENTRANCE_DURATION_S = 0.7;
const ENTRANCE_BASE_DELAY_S = 0.1;
const ENTRANCE_STAGGER_S = 0.08;
const ENTRANCE_SLIDE_PX = -32;
const OUTLINE_OPACITY = 0.38;
const NAME_SIZE = 'clamp(2.3rem, min(5.6vw, 9vh), 6.2rem)';
const NAME_OFFSET_OUTLINE = 'translate(0.05em, 0.05em)';
const RIBBON_SKEW = 'skewX(-12deg)';
const RIBBON_TEXT_UNSKEW = 'skewX(12deg)';
const SELECTION_TRANSITION =
  'color 0.2s ease, background-color 0.2s ease, border-color 0.2s ease, opacity 0.2s ease, transform 0.2s ease';
const HOVER_CAPABLE = '@media (hover: hover)';
const TOUCH_ONLY = '@media (hover: none)';
const COUNT_FADE_DURATION_S = 0.4;

const formatFightCount = (count: CountryFightCount | undefined, t: TranslateFn): string | null => {
  if (!count) return null;
  if (count.unwatched === 0) return t('landing.allWatched');
  if (count.unwatched < count.total) return t('landing.toWatch', { count: count.unwatched });
  if (count.total === 1) return t('landing.fightCountOne');
  return t('landing.fightCount', { count: count.total });
};

const rowEntrance = (reduceMotion: boolean, position: number) =>
  reduceMotion
    ? { initial: false as const }
    : {
        initial: { opacity: 0, x: ENTRANCE_SLIDE_PX },
        animate: { opacity: 1, x: 0 },
        transition: {
          duration: ENTRANCE_DURATION_S,
          delay: ENTRANCE_BASE_DELAY_S + position * ENTRANCE_STAGGER_S,
          ease: EASE_OUT_EXPO,
        },
      };

const BillingRow = ({
  entry,
  position,
  isSelected,
  fightCount,
  reduceMotion,
  onIntent,
  onPress,
  onActivate,
}: BillingRowProps) => {
  const { t } = useTranslation();
  const { palette } = useTheme();
  const { surfaces } = palette;
  const { slug, nameKey, disciplineKey, accentColor } = entry;
  const name = t(nameKey);
  const discipline = t(disciplineKey);
  const fightCountLabel = formatFightCount(fightCount, t);
  const accessibleName = fightCountLabel
    ? `${name} — ${discipline}, ${fightCountLabel}`
    : `${name} — ${discipline}`;
  const outline = alpha(surfaces.textPrimary, OUTLINE_OPACITY);

  const handlePointerEnter = (event: PointerEvent<HTMLAnchorElement>) => {
    if (event.pointerType === 'mouse') onIntent(entry);
  };

  return (
    <motion.li {...rowEntrance(reduceMotion, position)}>
      <Box
        component={Link}
        to={`/${slug}`}
        aria-label={accessibleName}
        onPointerEnter={handlePointerEnter}
        onPointerDown={(event) => onPress(entry, event.pointerType)}
        onFocus={() => onIntent(entry)}
        onClick={(event) => onActivate(event, entry)}
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: 'auto minmax(0, 1fr) auto',
            md: 'auto minmax(0, max-content) auto',
          },
          justifyContent: 'start',
          alignItems: 'center',
          columnGap: { xs: 1.5, md: 2.5 },
          minHeight: 44,
          py: { xs: 0.5, md: 0.75 },
          color: 'inherit',
          textDecoration: 'none',
          WebkitTapHighlightColor: 'transparent',
          '&:focus-visible': { outline: `2px solid ${accentColor}`, outlineOffset: 4 },
        }}
      >
        <Box
          aria-hidden
          sx={{
            alignSelf: 'end',
            fontFamily: HEADLINE_FONT,
            fontSize: { xs: '1.5rem', md: 'clamp(1.6rem, min(2.6vw, 4.5vh), 3rem)' },
            lineHeight: 1,
            color: isSelected ? accentColor : outline,
            WebkitTextFillColor: 'transparent',
            WebkitTextStroke: '1px currentColor',
            transition: SELECTION_TRANSITION,
          }}
        >
          {String(position).padStart(2, '0')}
        </Box>

        <Box aria-hidden sx={{ minWidth: 0 }}>
          <Box
            sx={{
              display: 'inline-flex',
              transform: RIBBON_SKEW,
              px: 1.25,
              py: 0.25,
              mb: 0.5,
              fontFamily: HEADLINE_FONT,
              fontSize: { xs: '0.62rem', md: '0.72rem' },
              lineHeight: 1.4,
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              border: '1px solid',
              borderColor: isSelected ? accentColor : outline,
              bgcolor: isSelected ? accentColor : 'transparent',
              color: isSelected ? palette.getContrastText(accentColor) : surfaces.textMuted,
              transition: SELECTION_TRANSITION,
            }}
          >
            <Box
              component="span"
              sx={{ display: 'inline-block', transform: RIBBON_TEXT_UNSKEW, whiteSpace: 'nowrap' }}
            >
              ★ {discipline}
              {fightCountLabel && (
                <motion.span
                  initial={reduceMotion ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: COUNT_FADE_DURATION_S }}
                >
                  {` · ${fightCountLabel}`}
                </motion.span>
              )}{' '}
              ★
            </Box>
          </Box>
          <Box
            data-label={name}
            sx={{
              position: 'relative',
              fontFamily: HEADLINE_FONT,
              fontSize: NAME_SIZE,
              lineHeight: 0.95,
              textTransform: 'uppercase',
              textWrap: 'balance',
              color: isSelected ? surfaces.textPrimary : outline,
              WebkitTextFillColor: isSelected ? surfaces.textPrimary : 'transparent',
              WebkitTextStroke: '1px currentColor',
              transition: SELECTION_TRANSITION,
              '&::after': {
                content: 'attr(data-label)',
                position: 'absolute',
                inset: 0,
                transform: NAME_OFFSET_OUTLINE,
                WebkitTextFillColor: 'transparent',
                WebkitTextStroke: `1px ${accentColor}`,
                opacity: isSelected ? 1 : 0,
                transition: SELECTION_TRANSITION,
                pointerEvents: 'none',
              },
            }}
          >
            {name}
          </Box>
        </Box>

        <Box
          aria-hidden
          sx={{
            alignSelf: { md: 'end' },
            pb: { md: 1.25 },
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            fontFamily: HEADLINE_FONT,
            fontSize: { xs: '1.1rem', md: '0.8rem' },
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            whiteSpace: 'nowrap',
            transition: SELECTION_TRANSITION,
            [HOVER_CAPABLE]: {
              color: accentColor,
              opacity: isSelected ? 1 : 0,
              transform: isSelected ? 'none' : 'translateX(-8px)',
            },
            [TOUCH_ONLY]: {
              flexDirection: 'column',
              gap: 0.25,
              color: isSelected ? accentColor : surfaces.textMuted,
            },
          }}
        >
          <Box
            component="span"
            sx={{
              [TOUCH_ONLY]: { visibility: isSelected ? 'visible' : 'hidden', fontSize: '0.6rem' },
            }}
          >
            {t('landing.enter')}
          </Box>
          <Box component="span">→</Box>
        </Box>
      </Box>
    </motion.li>
  );
};

export default BillingRow;
