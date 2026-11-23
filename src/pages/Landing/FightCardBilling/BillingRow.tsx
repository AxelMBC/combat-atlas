import type { PointerEvent } from 'react';
import type { TranslateFn } from '@/i18n';
import type { CountryFightCount } from '@/pages/Landing/useCountryFightCounts.types';
import type { BillingRowProps } from './BillingRow.types';

import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';

import { useTranslation } from '@/i18n';
import { BODY_FONT, HEADLINE_FONT } from '@/styles/fonts/newspaperFonts';

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;
const ENTRANCE_DURATION_S = 0.7;
const ENTRANCE_BASE_DELAY_S = 0.1;
const ENTRANCE_STAGGER_S = 0.08;
const ENTRANCE_SLIDE_PX = -32;
const NAME_SIZE = 'clamp(2.3rem, min(5.6vw, 9vh), 6.2rem)';
const BOUT_NUMBER_SIZE = '1.25rem';
const ANTON_CAP_TOP_EM = 0.065;
const SEPARATOR_OPACITY = 0.5;
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
  const { surfaces } = useTheme().palette;
  const { slug, nameKey, disciplineKey, accentColor } = entry;
  const name = t(nameKey);
  const discipline = t(disciplineKey);
  const fightCountLabel = formatFightCount(fightCount, t);
  const accessibleName = fightCountLabel
    ? `${name} — ${discipline}, ${fightCountLabel}`
    : `${name} — ${discipline}`;

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
            alignSelf: 'start',
            pt: `calc((${NAME_SIZE} - ${BOUT_NUMBER_SIZE}) * ${ANTON_CAP_TOP_EM})`,
            fontFamily: HEADLINE_FONT,
            fontSize: BOUT_NUMBER_SIZE,
            lineHeight: 1,
            letterSpacing: '0.05em',
            color: isSelected ? accentColor : surfaces.textMuted,
            transition: SELECTION_TRANSITION,
          }}
        >
          {String(position).padStart(2, '0')}
        </Box>

        <Box aria-hidden sx={{ minWidth: 0 }}>
          <Box
            sx={{
              fontFamily: HEADLINE_FONT,
              fontSize: NAME_SIZE,
              lineHeight: 1,
              textTransform: 'uppercase',
              textWrap: 'balance',
              color: isSelected ? surfaces.textPrimary : surfaces.textMuted,
              transition: SELECTION_TRANSITION,
            }}
          >
            {name}
          </Box>
          <Box
            sx={{
              mt: 0.5,
              fontFamily: BODY_FONT,
              fontSize: '0.95rem',
              lineHeight: 1.4,
              whiteSpace: 'nowrap',
              color: surfaces.textSecondary,
              transition: SELECTION_TRANSITION,
            }}
          >
            {discipline}
            {fightCountLabel && (
              <motion.span
                initial={reduceMotion ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: COUNT_FADE_DURATION_S }}
              >
                <Box component="span" sx={{ opacity: SEPARATOR_OPACITY }}>
                  {' · '}
                </Box>
                <Box
                  component="span"
                  sx={{
                    fontWeight: 700,
                    color: isSelected ? surfaces.textPrimary : surfaces.textSecondary,
                    transition: SELECTION_TRANSITION,
                  }}
                >
                  {fightCountLabel}
                </Box>
              </motion.span>
            )}
          </Box>
        </Box>

        <Box
          aria-hidden
          sx={{
            alignSelf: { md: 'end' },
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            fontFamily: BODY_FONT,
            fontSize: '1rem',
            lineHeight: 1.4,
            whiteSpace: 'nowrap',
            transition: SELECTION_TRANSITION,
            [HOVER_CAPABLE]: {
              color: surfaces.textPrimary,
              opacity: isSelected ? 1 : 0,
              transform: isSelected ? 'none' : 'translateX(-8px)',
            },
            [TOUCH_ONLY]: {
              flexDirection: 'column',
              gap: 0.25,
              color: isSelected ? surfaces.textPrimary : surfaces.textMuted,
            },
          }}
        >
          <Box
            component="span"
            sx={{
              [TOUCH_ONLY]: { visibility: isSelected ? 'visible' : 'hidden', fontSize: '0.8rem' },
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
