import { memo } from 'react';
import type { FighterCardProps } from './FighterCard.types';

// MUI
import { Box, Typography } from '@mui/material';

// i18n
import { useTranslation } from '@/i18n';

// Utils
import { CLEAN_SANS } from '@/styles/fonts/cleanSans';
import { useThemeMode } from '@/styles/theme';

const FighterCard = memo(({ boxer, rank, remaining, variant, onSelect }: FighterCardProps) => {
  const { t } = useTranslation();
  const { palette } = useThemeMode();
  const disabled = remaining <= 0;
  const isFeature = variant === 'feature';

  const na = t('common.notAvailable');

  const rankLabel = rank.toString().padStart(2, '0');

  const formatActivePeriod = (period?: string) => {
    if (!period) return na;
    const trimmed = period.trim();
    if (trimmed.endsWith('-')) {
      const start = trimmed.slice(0, -1).trim();
      return `${t('fighter.activeSince')} ${start}`;
    }
    return period;
  };

  const pillSx = {
    px: 1.5,
    py: 0.5,
    borderRadius: '999px',
    backdropFilter: 'blur(8px)',
    fontFamily: CLEAN_SANS,
    fontWeight: 600,
    fontSize: '0.7rem',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    lineHeight: 1.4,
    whiteSpace: 'nowrap',
  } as const;

  const cornerBadge = (
    <Box
      sx={{
        ...pillSx,
        position: 'absolute',
        top: 12,
        right: 12,
        zIndex: 2,
        bgcolor: disabled ? palette.pillScrim : 'primary.main',
        color: disabled ? palette.textMuted : '#fff',
      }}
    >
      {disabled
        ? t('fighter.noFights')
        : `${remaining} ${remaining === 1 ? t('fighter.fights.one') : t('fighter.fights.other')}`}
    </Box>
  );

  const rankBadge = (
    <Box
      sx={{
        ...pillSx,
        position: 'absolute',
        bottom: 12,
        left: 12,
        zIndex: 2,
        bgcolor: palette.pillScrim,
        color: '#fff',
        fontSize: isFeature ? '0.95rem' : '0.8rem',
        fontWeight: 700,
        letterSpacing: '0.12em',
      }}
    >
      {rankLabel}
    </Box>
  );

  type Dim = number | string | { xs?: number | string; md?: number | string };
  const portrait = (size: { width: Dim; height: Dim }) => (
    <Box
      className="fighter-portrait"
      sx={{
        position: 'relative',
        width: size.width,
        height: size.height,
        flexShrink: 0,
        bgcolor: palette.surfaceSunken,
        overflow: 'hidden',
      }}
    >
      <Box
        component="img"
        src={boxer.image}
        alt={boxer.name}
        onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
          e.currentTarget.src = '/placeholders/no-fighter-placeholder.png';
          e.currentTarget.style.objectFit = 'contain';
        }}
        sx={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          filter: 'grayscale(100%) brightness(0.85)',
          display: 'block',
          transition: 'filter 0.4s ease, transform 0.4s ease',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0) 35%, rgba(0,0,0,0.45) 100%)',
          pointerEvents: 'none',
        }}
      />
      {cornerBadge}
      {rankBadge}
      {disabled && (
        <Box
          sx={{
            ...pillSx,
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 2,
            px: 2.5,
            py: 0.75,
            bgcolor: 'rgba(0, 0, 0, 0.65)',
            color: '#fff',
            fontSize: isFeature ? '1rem' : '0.85rem',
            fontWeight: 700,
            letterSpacing: '0.15em',
          }}
        >
          {t('fighter.exhausted')}
        </Box>
      )}
    </Box>
  );

  const stats = [
    { label: t('fighter.recordLabel').replace(':', ''), value: boxer.record || na },
    { label: t('fighter.koLabel'), value: boxer.kos != null ? String(boxer.kos) : na },
    { label: t('fighter.activeLabel'), value: formatActivePeriod(boxer.activePeriod) },
    {
      label: t('fighter.fightsTotalLabel'),
      value: boxer.totalFights != null ? String(boxer.totalFights) : na,
    },
  ];

  const statLabelSx = {
    fontFamily: CLEAN_SANS,
    fontWeight: 600,
    fontSize: '0.65rem',
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: palette.textMuted,
    lineHeight: 1.2,
  } as const;

  const statsBlock = (size: 'sm' | 'lg') => {
    if (size === 'sm') {
      return (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            columnGap: 1,
            rowGap: 0.5,
            alignItems: 'baseline',
          }}
        >
          {stats.map((stat) => (
            <Box
              key={stat.label}
              sx={{ display: 'flex', flexDirection: 'column', gap: 0.4, minWidth: 0 }}
            >
              <Typography component="span" sx={statLabelSx}>
                {stat.label}
              </Typography>
              <Typography
                component="span"
                sx={{
                  fontFamily: CLEAN_SANS,
                  fontWeight: 600,
                  fontSize: '1rem',
                  lineHeight: 1.2,
                  color: palette.textPrimary,
                  whiteSpace: 'nowrap',
                }}
              >
                {stat.value}
              </Typography>
            </Box>
          ))}
        </Box>
      );
    }

    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {stats.map((stat) => (
          <Box
            key={stat.label}
            sx={{
              display: 'flex',
              alignItems: 'baseline',
              justifyContent: 'space-between',
              gap: 2,
            }}
          >
            <Typography component="span" sx={{ ...statLabelSx, fontSize: '0.75rem' }}>
              {stat.label}
            </Typography>
            <Typography
              component="span"
              sx={{
                fontFamily: CLEAN_SANS,
                fontWeight: 700,
                fontSize: { xs: '1.15rem', md: '1.35rem' },
                lineHeight: 1.2,
                color: palette.textPrimary,
              }}
            >
              {stat.value}
            </Typography>
          </Box>
        ))}
      </Box>
    );
  };

  const profileCta = (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 0.75,
        fontFamily: CLEAN_SANS,
        fontWeight: 600,
        fontSize: '0.85rem',
        color: disabled ? palette.textMuted : 'primary.light',
      }}
    >
      {t('fighter.profileCta')}
      <Box component="span" aria-hidden="true">
        →
      </Box>
    </Box>
  );

  const cardSx = {
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.55 : 1,
    height: '100%',
    bgcolor: palette.surface,
    border: `1px solid ${palette.border}`,
    borderRadius: '16px',
    overflow: 'hidden',
    fontFamily: CLEAN_SANS,
    transition: 'opacity 0.3s ease, transform 300ms ease, border-color 300ms ease',
    '&:hover': disabled
      ? undefined
      : {
          transform: 'translateY(-4px)',
          borderColor: palette.borderHover,
        },
    '&:hover .fighter-portrait img': disabled
      ? undefined
      : { filter: 'grayscale(0%) brightness(1)', transform: 'scale(1.03)' },
  } as const;

  if (isFeature) {
    return (
      <Box
        onClick={disabled ? undefined : () => onSelect(boxer)}
        sx={{
          ...cardSx,
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: 'stretch',
        }}
      >
        {portrait({ width: { xs: '100%', md: 440 }, height: { xs: 360, md: 'auto' } })}

        <Box
          sx={{
            flex: 1,
            minWidth: 0,
            display: 'flex',
            flexDirection: 'column',
            p: { xs: 2.5, md: 4 },
          }}
        >
          <Typography
            sx={{
              fontFamily: CLEAN_SANS,
              fontWeight: 700,
              fontSize: { xs: '1.75rem', md: '2.25rem' },
              lineHeight: 1.1,
              color: palette.textPrimary,
              wordBreak: 'normal',
              overflowWrap: 'break-word',
              hyphens: 'none',
            }}
          >
            {boxer.name}
          </Typography>

          <Typography
            sx={{
              fontFamily: CLEAN_SANS,
              fontSize: '0.95rem',
              color: palette.textSecondary,
              mt: 1,
            }}
          >
            {boxer.cityState || na}
          </Typography>

          <Box
            sx={{
              mt: { xs: 3, md: 4 },
              pt: { xs: 2, md: 3 },
              borderTop: `1px solid ${palette.border}`,
            }}
          >
            {statsBlock('lg')}
          </Box>

          <Box
            sx={{
              mt: 'auto',
              pt: 3,
              borderTop: `1px solid ${palette.border}`,
              display: 'flex',
              justifyContent: 'flex-end',
            }}
          >
            {profileCta}
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <Box
      onClick={disabled ? undefined : () => onSelect(boxer)}
      sx={{
        ...cardSx,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {portrait({ width: '100%', height: 320 })}

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
          gap: 0.5,
          p: 2.5,
        }}
      >
        <Typography
          sx={{
            fontFamily: CLEAN_SANS,
            fontWeight: 700,
            fontSize: '1.35rem',
            lineHeight: 1.2,
            color: palette.textPrimary,
          }}
        >
          {boxer.name}
        </Typography>
        <Typography
          sx={{
            fontFamily: CLEAN_SANS,
            fontSize: '0.85rem',
            color: palette.textSecondary,
          }}
        >
          {boxer.cityState || na}
        </Typography>

        <Box
          sx={{
            mt: 1.5,
            pt: 1.5,
            borderTop: `1px solid ${palette.border}`,
          }}
        >
          {statsBlock('sm')}
        </Box>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            mt: 'auto',
            pt: 1.5,
            borderTop: `1px solid ${palette.border}`,
          }}
        >
          {profileCta}
        </Box>
      </Box>
    </Box>
  );
});

export default FighterCard;
