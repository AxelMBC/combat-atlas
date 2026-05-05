import type { MainEventCardProps } from './MainEventCard.types';

import { motion } from 'framer-motion';

// MUI
import { Box, Button, Typography } from '@mui/material';

// i18n
import { useTranslation } from '@/i18n';

// Icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRotateRight } from '@fortawesome/free-solid-svg-icons';

const MotionButton = motion.create(Button);

const FALLBACK_TAGS = ['DESTACADO', 'SPARRING', 'SÚPER MEDIANO', 'SESIÓN COMPLETA'];

const MainEventCard = ({ video, onAnotherFight }: MainEventCardProps) => {
  const { t } = useTranslation();

  const tags = video.tags && video.tags.length > 0 ? video.tags : FALLBACK_TAGS;

  const stats = [
    { label: t('mainEvent.division'), value: 'S. Mediano' },
    { label: t('mainEvent.venue'), value: 'San Diego' },
    { label: t('mainEvent.year'), value: '2022' },
  ];

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        bgcolor: '#f5f1e8',
        border: '2px solid',
        borderColor: 'common.black',
        boxShadow: '10px 10px 0 #000',
      }}
    >
      <Box
        sx={{
          p: 1.5,
          borderBottom: '2px solid #000',
        }}
      >
        <Box
          sx={{
            width: '100%',
            position: 'relative',
            bgcolor: 'common.black',
            aspectRatio: '16 / 9',
          }}
        >
          <Box
            allowFullScreen
            component="iframe"
            id="main-event-video"
            src={`https://www.youtube.com/embed/${video.idYt}?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0&playsinline=1&disablekb=1${
              video.startTime ? `&start=${video.startTime}` : ''
            }`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media;"
            sx={{
              inset: 0,
              position: 'absolute',
              width: '100%',
              height: '100%',
              border: '0',
            }}
          />
        </Box>
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: 'stretch',
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
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {tags.map((tag, idx) => (
              <Box
                key={`${tag}-${idx}`}
                sx={{
                  px: 1.5,
                  py: 0.5,
                  fontFamily: 'Anton, sans-serif',
                  fontSize: '0.85rem',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  border: '2px solid',
                  borderColor: idx === 0 ? 'primary.dark' : 'common.black',
                  bgcolor: idx === 0 ? 'primary.dark' : 'transparent',
                  color: idx === 0 ? 'text.secondary' : 'text.primary',
                }}
              >
                {tag}
              </Box>
            ))}
          </Box>

          <Typography
            variant="h2"
            sx={{
              fontFamily: 'Anton, sans-serif',
              fontWeight: 700,
              fontSize: { xs: '1.75rem', md: '2.5rem' },
              lineHeight: 1,
              color: 'text.primary',
            }}
          >
            {video.title}
          </Typography>

          <Typography
            variant="body1"
            sx={{
              fontStyle: 'italic',
              color: 'text.primary',
              opacity: 0.8,
              fontSize: '0.95rem',
              lineHeight: 1.5,
            }}
          >
            {video.description}
          </Typography>
        </Box>

        <Box
          sx={{
            flex: { xs: '1 1 auto', md: '0 0 auto' },
            minWidth: { md: 360 },
            borderTop: { xs: '2px solid #000', md: 'none' },
            borderLeft: { xs: 'none', md: '2px solid #000' },
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
              border: '1.5px solid',
              borderColor: 'common.black',
            }}
          >
            {stats.map((stat, idx) => (
              <Box
                key={stat.label}
                sx={{
                  p: 1.5,
                  borderRight: idx < stats.length - 1 ? '1.5px solid #000' : 'none',
                }}
              >
                <Typography
                  sx={{
                    fontFamily: 'Anton, sans-serif',
                    fontSize: '0.7rem',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: 'info.main',
                  }}
                >
                  {stat.label}
                </Typography>
                <Typography
                  sx={{
                    fontFamily: 'Anton, sans-serif',
                    fontSize: '1.4rem',
                    color: 'text.primary',
                    lineHeight: 1.1,
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
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            sx={{
              cursor: 'pointer',
              width: '100%',
              py: 1.5,
              borderRadius: 0,
              bgcolor: 'primary.dark',
              color: 'text.secondary',
              fontFamily: 'Anton, sans-serif',
              fontSize: '1.1rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1,
              '&:hover': {
                bgcolor: 'primary.dark',
              },
            }}
          >
            <Box component="span" sx={{ fontSize: '0.7rem', lineHeight: 1 }}>
              ■
            </Box>
            {t('mainEvent.anotherFight')}
            <FontAwesomeIcon icon={faRotateRight} />
          </MotionButton>
        </Box>
      </Box>
    </Box>
  );
};

export default MainEventCard;
