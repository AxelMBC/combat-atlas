import { memo, useMemo } from 'react';
import type { CardEventProps } from './FightCard.types';

import useScrollFocus from '@/hooks/useScrollFocus';

// MUI
import { Box, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

// i18n
import { useTranslation } from '@/i18n';

import { resolveLocalizedTags } from '@/utils/resolveLocalizedField';
import { BODY_FONT, HEADLINE_FONT } from '@/styles/fonts/newspaperFonts';
import { cardActiveSx, cardSurfaceSx } from '@/pages/countries/components/shared';

const FALLBACK_THUMBNAIL = '/placeholders/no-video-placeholder.png';
const YOUTUBE_MISSING_THUMBNAIL_WIDTH = 120;
const POSTER_SCRIM =
  'linear-gradient(180deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0) 30%, rgba(0,0,0,0.1) 45%, rgba(0,0,0,0.9) 100%)';
const SUBTITLE_COLOR = 'rgba(255, 255, 255, 0.72)';

const youtubeThumbnail = (idYt: string) => `https://i.ytimg.com/vi/${idYt}/hq720.jpg`;

const splitFightersFromTitle = (title: string): [string, string] | null => {
  const parts = title.split(/\s+vs\.?\s+/i);
  if (parts.length !== 2) return null;
  return [parts[0].trim(), parts[1].trim()];
};

const fighterNameSx = {
  display: '-webkit-box',
  WebkitBoxOrient: 'vertical',
  WebkitLineClamp: 2,
  overflow: 'hidden',
  overflowWrap: 'anywhere',
  textTransform: 'uppercase',
  fontFamily: HEADLINE_FONT,
  fontWeight: 400,
  fontSize: { xs: '1.35rem', sm: '1.2rem', md: '1.35rem' },
  lineHeight: 1.05,
  letterSpacing: '0.01em',
  pt: '0.16em',
  mt: '-0.16em',
} as const;

const FightCard = memo(({ video, onVideoSelect }: CardEventProps) => {
  const { t, language } = useTranslation();
  const { surfaces } = useTheme().palette;
  const { ref, isFocused } = useScrollFocus<HTMLDivElement>();

  const activeStyles = {
    ...cardActiveSx(surfaces),
    '& .fightCardImg': {
      filter: 'brightness(1)',
      '@media (prefers-reduced-motion: no-preference)': {
        transform: 'scale(1.05)',
      },
    },
  } as const;

  const resolvedTags = resolveLocalizedTags(video.tags, language);

  const year = video.year;

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
      role="button"
      tabIndex={0}
      onClick={() => onVideoSelect(video)}
      onKeyDown={(event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onVideoSelect(video);
        }
      }}
      sx={{
        ...cardSurfaceSx(surfaces),
        bgcolor: surfaces.surfaceSunken,
        cursor: 'pointer',
        position: 'relative',
        width: '100%',
        aspectRatio: '4 / 5',
        borderRadius: '14px',
        fontFamily: BODY_FONT,
        color: 'common.white',
        transition: 'transform 300ms ease, border-color 300ms ease',
        '&:focus-visible': {
          outline: '2px solid',
          outlineColor: 'primary.main',
          outlineOffset: '2px',
          ...activeStyles,
        },
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
          position: 'absolute',
          inset: 0,
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
          background: POSTER_SCRIM,
          pointerEvents: 'none',
        }}
      />

      {year && (
        <Typography
          sx={{
            position: 'absolute',
            top: 12,
            left: 16,
            fontFamily: HEADLINE_FONT,
            fontSize: '1.1rem',
            lineHeight: 1,
            textShadow: '0 1px 6px rgba(0, 0, 0, 0.6)',
          }}
        >
          {year}
        </Typography>
      )}

      <Box
        sx={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          px: 2,
          pb: 1.75,
          display: 'flex',
          flexDirection: 'column',
          gap: 0.75,
          textShadow: '0 1px 8px rgba(0, 0, 0, 0.5)',
        }}
      >
        <Typography
          variant="h3"
          sx={{
            fontFamily: 'inherit',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: 0.25,
            fontSize: 'inherit',
            fontWeight: 'inherit',
            lineHeight: 'inherit',
          }}
        >
          {fighters ? (
            <>
              <Box component="span" sx={fighterNameSx}>
                {fighters[0]}
              </Box>{' '}
              <Box
                component="span"
                sx={{
                  color: 'primary.light',
                  fontStyle: 'italic',
                  fontSize: '0.85rem',
                  lineHeight: 1,
                }}
              >
                {t('mainEvent.vs')}
              </Box>{' '}
              <Box component="span" sx={fighterNameSx}>
                {fighters[1]}
              </Box>
            </>
          ) : (
            <Box component="span" sx={fighterNameSx}>
              {video.title}
            </Box>
          )}
        </Typography>

        {subtitle && (
          <Typography
            sx={{
              fontFamily: 'inherit',
              fontSize: '0.85rem',
              color: SUBTITLE_COLOR,
            }}
          >
            {subtitle}
          </Typography>
        )}

        <Typography
          component="span"
          sx={{
            alignSelf: 'flex-end',
            fontFamily: HEADLINE_FONT,
            fontSize: '0.8rem',
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
  );
});

export default FightCard;
