import type { Language } from '@/i18n';
import type { MainEvent } from '@/types/fightEvent.types';
import type { FightFact, FightFactsProps } from './FightFacts.types';

import { motion, useReducedMotion } from 'framer-motion';

import { Box, Typography } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';

import { useTranslation } from '@/i18n';

import { getFightCity, getFightDivision } from '@/utils/fightBilling';
import { BODY_FONT, HEADLINE_FONT } from '@/styles/fonts/newspaperFonts';
import { titleCardEntrance } from './titleCardMotion';

const MotionBox = motion.create(Box);

const MISSING_FACT = '—';
const FACT_STAGGER_S = 0.07;

const formatFightDate = (video: MainEvent, language: Language): string | undefined => {
  const date = video.date ? new Date(video.date) : null;
  if (!date || Number.isNaN(date.getTime())) return video.year;
  return new Intl.DateTimeFormat(language === 'es' ? 'es-MX' : 'en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
};

const FightFacts = ({ video, delay }: FightFactsProps) => {
  const { t, language } = useTranslation();
  const shouldReduceMotion = useReducedMotion();
  const white = useTheme().palette.common.white;
  const rule = `1px solid ${alpha(white, 0.16)}`;
  const city = getFightCity(video);

  const facts: FightFact[] = [
    { key: 'date', label: t('titleCard.date'), value: formatFightDate(video, language) },
    {
      key: 'venue',
      label: t('mainEvent.venue'),
      value: video.venue?.name ?? city,
      detail: video.venue?.name ? city : undefined,
    },
    {
      key: 'division',
      label: t('mainEvent.division'),
      value: getFightDivision(video, language),
    },
    { key: 'rounds', label: t('titleCard.rounds'), value: video.scheduledRounds?.toString() },
  ];

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: 'repeat(2, minmax(0, 1fr))', md: 'repeat(4, minmax(0, 1fr))' },
        width: '100%',
        maxWidth: 920,
        mx: 'auto',
        borderTop: rule,
        borderBottom: rule,
      }}
    >
      {facts.map((fact, index) => (
        <MotionBox
          key={fact.key}
          {...titleCardEntrance(shouldReduceMotion, { y: 12 }, delay + index * FACT_STAGGER_S)}
          sx={{
            minWidth: 0,
            px: { xs: 1.5, md: 2.5 },
            py: { xs: 1.25, md: 1.75 },
            textAlign: 'center',
            borderLeft: { xs: index % 2 === 1 ? rule : 'none', md: index > 0 ? rule : 'none' },
            borderTop: { xs: index >= 2 ? rule : 'none', md: 'none' },
          }}
        >
          <Typography
            sx={{
              fontFamily: HEADLINE_FONT,
              fontSize: { xs: '0.65rem', md: '0.72rem' },
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: alpha(white, 0.5),
              mb: 0.5,
            }}
          >
            {fact.label}
          </Typography>
          <Typography
            sx={{
              fontFamily: HEADLINE_FONT,
              fontSize: { xs: '1rem', md: '1.25rem' },
              lineHeight: 1.15,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              overflowWrap: 'anywhere',
              color: fact.value ? 'common.white' : alpha(white, 0.35),
            }}
          >
            {fact.value || MISSING_FACT}
          </Typography>
          {fact.detail && (
            <Typography
              sx={{
                fontFamily: BODY_FONT,
                fontStyle: 'italic',
                fontSize: { xs: '0.75rem', md: '0.85rem' },
                color: alpha(white, 0.65),
                mt: 0.25,
              }}
            >
              {fact.detail}
            </Typography>
          )}
        </MotionBox>
      ))}
    </Box>
  );
};

export default FightFacts;
