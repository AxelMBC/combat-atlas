import { memo, useMemo } from 'react';
import type { CardEventProps } from './FightCard.types';

import useScrollFocus from '@/hooks/useScrollFocus';

// MUI
import { Box, Typography } from '@mui/material';

// i18n
import { useTranslation } from '@/i18n';

// Fallback dummy data
import { resolveFallback } from './FightCard.fallbacks';

import { resolveLocalizedTags } from '@/utils/resolveLocalizedField';
import { CLEAN_SANS } from '@/styles/fonts/cleanSans';
import { useThemeMode } from '@/styles/theme';

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
  const { palette } = useThemeMode();
  const { ref, isFocused } = useScrollFocus<HTMLDivElement>();

  const activeStyles = {
    borderColor: palette.borderHover,
    '@media (prefers-reduced-motion: no-preference)': {
      transform: 'translateY(-4px)',
    },
    '& .fightCardImg': {
      filter: 'brightness(1)',
      '@media (prefers-reduced-motion: no-preference)': {
        transform: 'scale(1.05)',
      },
    },
  } as const;

  const fallback = useMemo(() => resolveFallback(), []);

  const resolvedTags = resolveLocalizedTags(video.tags, language);

  const year = video.year ?? fallback?.year;

  const discipline = video.type ?? resolvedTags[0];

  const subtitle = [discipline, video.location].filter(Boolean).join(' · ');

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
      ref={ref}
      onClick={() => onVideoSelect(video)}
      sx={{
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        bgcolor: palette.surface,
        border: `1px solid ${palette.border}`,
        borderRadius: '14px',
        overflow: 'hidden',
        fontFamily: CLEAN_SANS,
        transition: 'transform 300ms ease, border-color 300ms ease',
        '@media (hover: hover)': {
          '&:hover': activeStyles,
        },
        '@media (hover: none)': {
          transition: 'transform 150ms ease, border-color 150ms ease',
          '& .fightCardImg': {
            transition: 'all 150ms ease',
          },
          ...(isFocused && activeStyles),
        },
      }}
    >
      <Box
        sx={{
          position: 'relative',
          overflow: 'hidden',
          bgcolor: palette.surfaceSunken,
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
            color: palette.textPrimary,
          }}
        >
          {fighters ? (
            <>
              {fighters[0]}{' '}
              <Box
                component="span"
                sx={{
                  color: 'primary.light',
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
              color: palette.textSecondary,
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
            borderTop: `1px solid ${palette.border}`,
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
              color: palette.textMuted,
            }}
          ></Typography>

          <Typography
            component="span"
            sx={{
              fontFamily: 'inherit',
              fontSize: '0.8rem',
              fontWeight: 600,
              color: 'primary.light',
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
