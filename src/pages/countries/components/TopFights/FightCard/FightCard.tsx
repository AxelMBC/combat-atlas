import { memo, useMemo } from 'react';
import type { CardEventProps } from './FightCard.types';

// MUI
import { Box, Typography } from '@mui/material';

// i18n
import { useTranslation } from '@/i18n';

// Fallback dummy data
import { resolveFallback } from './FightCard.fallbacks';

import { resolveLocalizedTags } from '@/utils/resolveLocalizedField';
import { CLEAN_SANS } from '@/styles/fonts/cleanSans';

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

  const discipline = video.type ?? resolvedTags[0];
  const subtitle = [discipline, venue?.city].filter(Boolean).join(' · ');

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
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        bgcolor: '#212121',
        border: '1px solid rgba(255, 255, 255, 0.09)',
        borderRadius: '14px',
        overflow: 'hidden',
        fontFamily: CLEAN_SANS,
        transition: 'transform 300ms ease, border-color 300ms ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          borderColor: 'rgba(255, 255, 255, 0.25)',
        },
        '&:hover .fightCardImg': {
          filter: 'brightness(1)',
          transform: 'scale(1.05)',
        },
      }}
    >
      <Box
        sx={{
          position: 'relative',
          overflow: 'hidden',
          bgcolor: '#171717',
          height: 180,
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
            filter: 'brightness(0.75)',
          }}
          className="fightCardImg"
        />

        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(180deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.05) 40%, rgba(0,0,0,0.55) 100%)',
            pointerEvents: 'none',
          }}
        />

        {year && (
          <Typography
            sx={{
              position: 'absolute',
              top: 10,
              left: 14,
              color: 'common.white',
              fontFamily: 'inherit',
              fontWeight: 700,
              fontSize: '1.1rem',
              lineHeight: 1,
              textShadow: '0 1px 6px rgba(0, 0, 0, 0.6)',
            }}
          >
            {year}
          </Typography>
        )}
      </Box>

      <Box
        sx={{
          px: 2,
          py: 1.75,
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
          gap: 0.75,
        }}
      >
        <Typography
          variant="h3"
          sx={{
            fontFamily: 'inherit',
            fontWeight: 700,
            fontSize: '1.05rem',
            lineHeight: 1.3,
            color: '#f2f2f2',
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
                  px: 0.25,
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

        {subtitle && (
          <Typography
            sx={{
              fontFamily: 'inherit',
              fontSize: '0.85rem',
              color: 'rgba(255, 255, 255, 0.55)',
            }}
          >
            {subtitle}
          </Typography>
        )}

        <Box
          sx={{
            mt: 'auto',
            pt: 1.25,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 1,
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <Typography
            component="span"
            sx={{
              fontFamily: 'inherit',
              fontSize: '0.7rem',
              fontWeight: 600,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'rgba(255, 255, 255, 0.45)',
            }}
          >
            {dateLabel ?? ''}
          </Typography>

          <Typography
            component="span"
            sx={{
              fontFamily: 'inherit',
              fontSize: '0.8rem',
              fontWeight: 600,
              color: 'primary.main',
              display: 'flex',
              alignItems: 'center',
              gap: 0.75,
            }}
          >
            {t('fightCard.watchFight')}
            <Box component="span">→</Box>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
});

export default FightCard;
