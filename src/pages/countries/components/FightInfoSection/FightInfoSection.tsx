import type { FightInfoSectionProps } from './FightInfoSection.types';

import { memo, useMemo } from 'react';
import { motion } from 'framer-motion';

// MUI
import { Box, Button, Typography } from '@mui/material';

// Icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faForward } from '@fortawesome/free-solid-svg-icons';

// i18n
import { useTranslation } from '@/i18n';

// Utils
import { resolveLocalizedString, resolveLocalizedTags } from '@/utils/resolveLocalizedField';
import { CLEAN_SANS } from '@/styles/fonts/cleanSans';

const MotionButton = motion.create(Button);

const splitFightersFromTitle = (title: string): [string, string] | null => {
  const parts = title.split(/\s+vs\.?\s+/i);
  if (parts.length !== 2) return null;
  return [parts[0].trim(), parts[1].trim()];
};

const FightInfoSection = memo(
  ({ loading, error, video, onAnotherFight, anotherFightDisabled }: FightInfoSectionProps) => {
    const { t, language } = useTranslation();

    const tags = video ? resolveLocalizedTags(video.tags, language) : [];
    const description = video
      ? resolveLocalizedString(video.description, language, t('common.notAvailable'))
      : '';
    const divisionLabel = video?.divisionId?.text?.[language] ?? '—';

    const fighters = useMemo(() => {
      if (!video) return null;
      if (video.fighterRed && video.fighterBlue) {
        return [video.fighterRed, video.fighterBlue] as const;
      }
      return splitFightersFromTitle(video.title);
    }, [video]);

    const stats = [
      { label: t('mainEvent.division'), value: divisionLabel },
      { label: t('mainEvent.venue'), value: video?.location ?? video?.venue?.city ?? '—' },
      { label: t('mainEvent.year'), value: video?.year ?? '—' },
    ];

    return (
      <Box component="section" sx={{ mt: { xs: 4, md: 6 }, fontFamily: CLEAN_SANS }}>
        <Typography
          sx={{
            fontFamily: 'inherit',
            fontSize: '0.75rem',
            fontWeight: 600,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'rgba(255, 255, 255, 0.45)',
            mb: 1.5,
          }}
        >
          {t('fightInfo.nowPlaying')}
        </Typography>

        {loading && (
          <Typography
            sx={{
              fontFamily: 'inherit',
              textAlign: 'center',
              fontSize: '1.1rem',
              color: 'rgba(255, 255, 255, 0.7)',
              p: 4,
            }}
          >
            {t('mainEvent.searching')}
          </Typography>
        )}

        {error && (
          <Typography
            sx={{
              fontFamily: 'inherit',
              textAlign: 'center',
              fontWeight: 600,
              fontSize: '1.1rem',
              color: 'rgba(255, 255, 255, 0.7)',
              p: 4,
            }}
          >
            {error}
          </Typography>
        )}

        {!loading && !error && video && (
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              alignItems: 'stretch',
              bgcolor: '#212121',
              border: '1px solid rgba(255, 255, 255, 0.09)',
              borderRadius: '16px',
              overflow: 'hidden',
            }}
          >
            <Box
              sx={{
                flex: 1,
                minWidth: 0,
                p: { xs: 3, md: 4 },
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
              }}
            >
              {tags.length > 0 && (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {tags.map((tag, idx) => (
                    <Box
                      key={`${tag}-${idx}`}
                      sx={{
                        px: 1.5,
                        py: 0.5,
                        borderRadius: '999px',
                        fontFamily: 'inherit',
                        fontSize: '0.7rem',
                        fontWeight: 600,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        bgcolor: idx === 0 ? 'primary.main' : 'rgba(255, 255, 255, 0.08)',
                        color: idx === 0 ? '#fff' : 'rgba(255, 255, 255, 0.85)',
                      }}
                    >
                      {tag}
                    </Box>
                  ))}
                </Box>
              )}

              <Typography
                variant="h2"
                sx={{
                  fontFamily: 'inherit',
                  fontWeight: 700,
                  fontSize: { xs: '1.5rem', sm: '1.9rem', md: '2.3rem' },
                  lineHeight: 1.1,
                  color: '#f2f2f2',
                }}
              >
                {fighters ? (
                  <>
                    {fighters[0]}{' '}
                    <Box component="span" sx={{ color: 'primary.main', fontStyle: 'italic' }}>
                      {t('mainEvent.vs')}
                    </Box>{' '}
                    {fighters[1]}
                  </>
                ) : (
                  video.title
                )}
              </Typography>

              <Typography
                sx={{
                  fontFamily: 'inherit',
                  color: 'rgba(255, 255, 255, 0.6)',
                  fontSize: '0.95rem',
                  lineHeight: 1.6,
                }}
              >
                {description}
              </Typography>
            </Box>

            <Box
              sx={{
                flex: { xs: '1 1 auto', md: '0 0 auto' },
                minWidth: { md: 340 },
                borderTop: { xs: '1px solid rgba(255, 255, 255, 0.09)', md: 'none' },
                borderLeft: { xs: 'none', md: '1px solid rgba(255, 255, 255, 0.09)' },
                p: { xs: 3, md: 4 },
                display: 'flex',
                flexDirection: 'column',
                gap: 2.5,
                justifyContent: 'center',
              }}
            >
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '12px',
                  overflow: 'hidden',
                }}
              >
                {stats.map((stat, idx) => (
                  <Box
                    key={stat.label}
                    sx={{
                      p: 1.5,
                      borderRight:
                        idx < stats.length - 1 ? '1px solid rgba(255, 255, 255, 0.12)' : 'none',
                    }}
                  >
                    <Typography
                      sx={{
                        fontFamily: 'inherit',
                        fontSize: '0.65rem',
                        fontWeight: 600,
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                        color: 'rgba(255, 255, 255, 0.45)',
                      }}
                    >
                      {stat.label}
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: 'inherit',
                        fontWeight: 600,
                        fontSize: { xs: '1rem', md: '1.15rem' },
                        color: '#f2f2f2',
                        lineHeight: 1.2,
                      }}
                    >
                      {stat.value}
                    </Typography>
                  </Box>
                ))}
              </Box>

              <MotionButton
                id="fetch-another-fight"
                onClick={onAnotherFight}
                disabled={anotherFightDisabled}
                whileHover={anotherFightDisabled ? undefined : { scale: 1.02 }}
                whileTap={anotherFightDisabled ? undefined : { scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                sx={{
                  width: '100%',
                  py: 1.25,
                  borderRadius: '999px',
                  bgcolor: 'primary.main',
                  color: '#fff',
                  fontFamily: CLEAN_SANS,
                  fontWeight: 700,
                  fontSize: '1rem',
                  textTransform: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 1.25,
                  '&:hover': { bgcolor: 'primary.main' },
                  '&.Mui-disabled': {
                    bgcolor: 'primary.main',
                    color: '#fff',
                    opacity: 0.45,
                  },
                }}
              >
                {t('mainEvent.anotherFight')}
                <FontAwesomeIcon icon={faForward} />
              </MotionButton>
            </Box>
          </Box>
        )}
      </Box>
    );
  },
);

export default FightInfoSection;
