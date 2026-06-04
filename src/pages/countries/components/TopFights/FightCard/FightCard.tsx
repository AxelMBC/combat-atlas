import { memo, useMemo } from 'react';
import type { CardEventProps } from './FightCard.types';

// MUI
import { Box, Typography } from '@mui/material';

// Icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';

// i18n
import { useTranslation } from '@/i18n';

// Fallback dummy data
import { resolveFallback } from './FightCard.fallbacks';

import { resolveLocalizedTags } from '@/utils/resolveLocalizedField';

const FALLBACK_THUMBNAIL = '/placeholders/no-video-placeholder.png';
const YOUTUBE_MISSING_THUMBNAIL_WIDTH = 120;

const youtubeThumbnail = (idYt: string) => `https://i.ytimg.com/vi/${idYt}/hq720.jpg`;

const splitFightersFromTitle = (title: string): [string, string] | null => {
  const parts = title.split(/\s+vs\.?\s+/i);
  if (parts.length !== 2) return null;
  return [parts[0].trim(), parts[1].trim()];
};

const FightCard = memo(({ video, onVideoSelect }: CardEventProps) => {
  const { t, language } = useTranslation();

  const fallback = useMemo(() => resolveFallback(), []);

  const resolvedTags = resolveLocalizedTags(video.tags, language);

  const year = video.year ?? fallback?.year;
  const dateLabel = video.dateLabel ?? fallback?.dateLabel;
  const venue = video.venue ?? fallback?.venue;
  const organization = video.organization ?? fallback?.organization;
  const weightClass = video.weightClass ?? fallback?.weightClass;

  const fighters = useMemo(() => {
    if (video.fighterRed && video.fighterBlue) {
      return [video.fighterRed, video.fighterBlue] as const;
    }
    return splitFightersFromTitle(video.title);
  }, [video.fighterRed, video.fighterBlue, video.title]);

  const thumbnailSrc =
    video.thumbnail || (video.idYt ? youtubeThumbnail(video.idYt) : FALLBACK_THUMBNAIL);

  return (
    <Box
      onClick={() => onVideoSelect(video)}
      sx={{
        cursor: 'pointer',
        transition: 'all 300ms ease',
        '&:hover': {
          boxShadow: '12px 12px 0 #ca2626',
        },
        '&:hover .fightCardImg': {
          filter: 'grayscale(0%) brightness(1)',
          transform: 'scale(1.08)',
        },
        bgcolor: 'background',
        display: 'flex',
        flexDirection: 'column',
        border: '4px solid #000',
        boxShadow: '8px 8px 0 #000',
        maxWidth: 420,
        height: '100%',
      }}
    >
      <Box
        sx={{
          position: 'relative',
          overflow: 'hidden',
          borderBottom: '4px solid #000',
          bgcolor: '#171717',
          height: 210,
        }}
      >
        <Box
          component="img"
          src={thumbnailSrc}
          alt={video.title}
          onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
            if (!e.currentTarget.src.endsWith(FALLBACK_THUMBNAIL)) {
              e.currentTarget.src = FALLBACK_THUMBNAIL;
            }
          }}
          onLoad={(e: React.SyntheticEvent<HTMLImageElement>) => {
            const img = e.currentTarget;
            if (
              img.src.includes('i.ytimg.com') &&
              img.naturalWidth <= YOUTUBE_MISSING_THUMBNAIL_WIDTH
            ) {
              img.src = FALLBACK_THUMBNAIL;
            }
          }}
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'all 300ms ease',
            filter: {
              lg: 'grayscale(100%) brightness(0.55)',
            },
          }}
          className="fightCardImg"
        />

        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.15) 35%, rgba(0,0,0,0.15) 60%, rgba(0,0,0,0.85) 100%)',
            pointerEvents: 'none',
          }}
        />

        {year && (
          <Typography
            sx={{
              position: 'absolute',
              top: 8,
              left: 14,
              color: 'common.white',
              fontWeight: 800,
              fontSize: '1.75rem',
              lineHeight: 1,
              letterSpacing: 1,
              textShadow: '2px 2px 0 rgba(0,0,0,0.6)',
            }}
          >
            {year}
          </Typography>
        )}
      </Box>

      <Box
        sx={{
          px: 2,
          py: 1.5,
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
          gap: 1.25,
        }}
      >
        <Typography
          variant="h3"
          sx={{
            fontSize: '1.15rem',
            lineHeight: 1.25,
          }}
        >
          {fighters ? (
            <>
              {fighters[0]}{' '}
              <Box
                component="span"
                sx={{
                  color: 'primary.main',
                  fontStyle: 'italic',
                  px: 0.5,
                }}
              >
                {t('mainEvent.vs')}
              </Box>{' '}
              {fighters[1]}
            </>
          ) : (
            video.title
          )}
        </Typography>

        {(venue || organization || weightClass) && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 1,
              fontSize: '0.78rem',
              color: 'text.primary',
            }}
          >
            {venue ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                <FontAwesomeIcon
                  icon={faLocationDot}
                  style={{ fontSize: '0.8rem', opacity: 0.75 }}
                />
                <Typography component="span" sx={{ fontSize: '0.78rem', fontWeight: 500 }}>
                  {venue.city}, {venue.country}
                </Typography>
              </Box>
            ) : (
              <Box />
            )}
            {(organization || weightClass) && (
              <Typography
                component="span"
                sx={{
                  fontSize: '0.78rem',
                  fontWeight: 500,
                  opacity: 0.85,
                  textAlign: 'right',
                }}
              >
                {[organization, weightClass].filter(Boolean).join(' · ')}
              </Typography>
            )}
          </Box>
        )}

        {resolvedTags.length > 0 && (
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 0.75,
            }}
          >
            {resolvedTags.map((tag, index) => {
              const tagStyles = [
                { color: 'common.white', bgcolor: 'primary.main' },
                { color: 'text.primary', bgcolor: '#fff' },
                { color: 'common.white', bgcolor: 'secondary.main' },
              ] as const;
              const { color, bgcolor } = tagStyles[index % 3];

              return (
                <Typography
                  key={tag}
                  component="span"
                  sx={{
                    px: { xs: 0.75, md: 1 },
                    py: 0.25,
                    fontSize: { xs: '0.6rem', md: '0.7rem' },
                    fontWeight: 600,
                    letterSpacing: 0.5,
                    textTransform: 'uppercase',
                    border: '2px solid #000',
                    boxShadow: '1px 1px 0 #000',
                    color,
                    bgcolor,
                  }}
                >
                  {tag}
                </Typography>
              );
            })}
          </Box>
        )}

        <Box
          sx={{
            mt: 'auto',
            pt: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 1,
            borderTop: '1px solid rgba(0,0,0,0.08)',
          }}
        >
          <Typography
            component="span"
            sx={{
              fontSize: '0.72rem',
              fontWeight: 600,
              letterSpacing: 1.2,
              textTransform: 'uppercase',
              color: 'text.primary',
              opacity: 0.7,
            }}
          >
            {dateLabel ?? ''}
          </Typography>

          <Typography
            variant="button"
            sx={{
              color: 'primary.main',
              transition: 'gap 300ms ease',
              '&:hover': {
                gap: 1.5,
              },
              textTransform: 'uppercase',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            {t('fightCard.watchFight')}
            <Box
              component="span"
              sx={{
                transition: 'transform 300ms ease',
                '&:hover': {
                  transform: 'translateX(4px)',
                },
              }}
            >
              →
            </Box>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
});

export default FightCard;
