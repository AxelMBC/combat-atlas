import { memo, useMemo } from 'react';
import type { FighterCardProps } from './FighterCard.types';

// MUI
import { Box, Typography } from '@mui/material';

// i18n
import { useTranslation } from '@/i18n';

// Mock data helper
import { getFighterCardMock } from './fighterCardMock';

const CARD_BG = '#f5f1e8';

const FighterCard = memo(({ boxer, rank, remaining, variant, onSelect }: FighterCardProps) => {
  const { t } = useTranslation();
  const disabled = remaining <= 0;
  const isFeature = variant === 'feature';

  const mock = useMemo(
    () => getFighterCardMock(boxer._id, boxer.record),
    [boxer._id, boxer.record],
  );

  const rankLabel = rank.toString().padStart(2, '0');

  const cornerBadge = (
    <Box
      sx={(theme) => ({
        position: 'absolute',
        top: 0,
        right: 0,
        zIndex: 2,
        px: 1.25,
        py: 0.5,
        bgcolor: disabled ? theme.palette.common.black : theme.palette.primary.dark,
        color: theme.palette.text.secondary,
        borderLeft: `2px solid ${theme.palette.common.black}`,
        borderBottom: `2px solid ${theme.palette.common.black}`,
        fontFamily: 'Anton, sans-serif',
        display: 'flex',
        alignItems: 'baseline',
        gap: 0.6,
      })}
    >
      {disabled ? (
        <Box
          component="span"
          sx={{ fontSize: '0.95rem', textTransform: 'uppercase', letterSpacing: 1 }}
        >
          {t('fighter.noFights')}
        </Box>
      ) : (
        <>
          <Box component="span" sx={{ fontSize: '1.5rem', lineHeight: 1 }}>
            {remaining}
          </Box>
          <Box
            component="span"
            sx={{
              fontSize: '0.7rem',
              textTransform: 'uppercase',
              letterSpacing: 0.5,
            }}
          >
            {remaining === 1 ? t('fighter.fights.one') : t('fighter.fights.other')}
          </Box>
        </>
      )}
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
        bgcolor: CARD_BG,
        border: '2px solid',
        borderColor: 'common.black',
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
          filter: 'grayscale(100%)',
          display: 'block',
          transition: 'filter 0.3s ease',
        }}
      />
      {cornerBadge}
      {disabled && (
        <Box
          sx={(theme) => ({
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%) rotate(-12deg)',
            px: 2.5,
            py: 0.75,
            bgcolor: theme.palette.primary.dark,
            color: theme.palette.text.secondary,
            border: `3px solid ${theme.palette.common.black}`,
            boxShadow: `4px 4px 0 ${theme.palette.common.black}`,
            fontFamily: 'Anton, sans-serif',
            fontSize: isFeature ? '2rem' : '1.4rem',
            textTransform: 'uppercase',
            letterSpacing: 2,
            whiteSpace: 'nowrap',
          })}
        >
          {t('fighter.exhausted')}
        </Box>
      )}
    </Box>
  );

  const stats = [
    { label: t('fighter.recordLabel').replace(':', ''), value: boxer.record },
    { label: t('fighter.koLabel'), value: String(mock.ko) },
    { label: t('fighter.activeLabel'), value: mock.yearsActive },
    { label: t('fighter.fightsTotalLabel'), value: String(mock.fightsTotal) },
  ];

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
              <Typography
                component="span"
                sx={{
                  fontFamily: 'Anton, sans-serif',
                  fontSize: '0.65rem',
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: 'info.main',
                  lineHeight: 1,
                }}
              >
                {stat.label}
              </Typography>
              <Typography
                component="span"
                sx={{
                  fontFamily: 'Anton, sans-serif',
                  fontSize: '1.15rem',
                  lineHeight: 1,
                  color: 'text.primary',
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
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
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
            <Typography
              component="span"
              sx={{
                fontFamily: 'Anton, sans-serif',
                fontSize: '0.85rem',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: 'info.main',
              }}
            >
              {stat.label}
            </Typography>
            <Typography
              component="span"
              sx={{
                fontFamily: 'Anton, sans-serif',
                fontSize: { xs: '1.25rem', md: '1.5rem' },
                lineHeight: 1,
                color: 'text.primary',
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
        fontFamily: 'Anton, sans-serif',
        fontSize: '0.9rem',
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        color: disabled ? 'info.main' : 'text.primary',
      }}
    >
      {t('fighter.profileCta')}
      <Box component="span" aria-hidden="true">
        →
      </Box>
    </Box>
  );

  if (isFeature) {
    return (
      <Box
        onClick={disabled ? undefined : () => onSelect(boxer)}
        sx={(theme) => ({
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.55 : 1,
          transition: 'opacity 0.3s ease, transform 0.2s ease',
          height: '100%',
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: 'stretch',
          gap: { xs: 4, md: 5 },
          p: { xs: 2.5, md: 4 },
          bgcolor: CARD_BG,
          border: '2px solid',
          borderColor: theme.palette.common.black,
          boxShadow: `10px 10px 0 ${theme.palette.common.black}`,
          '& .fighter-portrait img': {
            transition: 'filter 0.4s ease',
          },
          '&:hover': disabled ? undefined : { transform: 'translate(-2px, -2px)' },
          '&:hover .fighter-portrait img': disabled ? undefined : { filter: 'grayscale(0%)' },
        })}
      >
        <Box sx={{ position: 'relative', flexShrink: 0, width: { xs: '100%', md: 'auto' } }}>
          {portrait({ width: { xs: '100%', md: 440 }, height: { xs: 360, md: 480 } })}
          <Box
            sx={(theme) => ({
              position: 'absolute',
              bottom: { xs: -12, md: -16 },
              left: { xs: -12, md: -16 },
              zIndex: 3,
              px: { xs: 1.5, md: 2 },
              py: 0.25,
              bgcolor: CARD_BG,
              border: `2px solid ${theme.palette.common.black}`,
              fontFamily: 'Anton, sans-serif',
              fontSize: { xs: '3rem', md: '5rem' },
              lineHeight: 1,
              color: theme.palette.primary.dark,
            })}
          >
            {rankLabel}
          </Box>
        </Box>

        <Box
          sx={{
            flex: 1,
            minWidth: 0,
            display: 'flex',
            flexDirection: 'column',
            py: { xs: 0, md: 1 },
          }}
        >
          <Typography
            sx={{
              fontFamily: 'Anton, sans-serif',
              fontSize: { xs: '2.25rem', md: '2.7rem' },
              lineHeight: 1,
              color: 'text.primary',
              wordBreak: 'normal',
              overflowWrap: 'break-word',
              hyphens: 'none',
            }}
          >
            {boxer.name}
          </Typography>

          <Typography
            sx={{
              fontFamily: '"Merriweather", serif',
              fontStyle: 'italic',
              fontSize: '1.05rem',
              color: 'info.main',
              mt: 1.5,
            }}
          >
            {mock.city}
          </Typography>

          <Box
            sx={(theme) => ({
              mt: { xs: 3, md: 4 },
              pt: { xs: 2, md: 3 },
              borderTop: `1px solid ${theme.palette.common.black}`,
            })}
          >
            {statsBlock('lg')}
          </Box>

          <Box
            sx={(theme) => ({
              mt: 'auto',
              pt: 3,
              borderTop: `1px solid ${theme.palette.common.black}`,
              display: 'flex',
              justifyContent: 'flex-end',
            })}
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
      sx={(theme) => ({
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.55 : 1,
        transition: 'opacity 0.3s ease, transform 0.2s ease',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        p: 2.5,
        bgcolor: CARD_BG,
        border: '2px solid',
        borderColor: theme.palette.common.black,
        boxShadow: `8px 8px 0 ${theme.palette.common.black}`,
        '& .fighter-portrait img': {
          transition: 'filter 0.4s ease',
        },
        '&:hover': disabled ? undefined : { transform: 'translate(-2px, -2px)' },
        '&:hover .fighter-portrait img': disabled ? undefined : { filter: 'grayscale(0%)' },
      })}
    >
      <Box sx={{ position: 'relative' }}>
        {portrait({ width: '100%', height: 320 })}
        <Box
          sx={(theme) => ({
            position: 'absolute',
            bottom: -10,
            left: -10,
            zIndex: 3,
            px: 1.5,
            py: 0.25,
            bgcolor: CARD_BG,
            border: `2px solid ${theme.palette.common.black}`,
            fontFamily: 'Anton, sans-serif',
            fontSize: '2.75rem',
            lineHeight: 1,
            color: theme.palette.common.black,
          })}
        >
          {rankLabel}
        </Box>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mt: 1 }}>
        <Typography
          sx={{
            fontFamily: 'Anton, sans-serif',
            fontSize: '1.5rem',
            lineHeight: 1.1,
            color: 'text.primary',
          }}
        >
          {boxer.name}
        </Typography>
        <Typography
          sx={{
            fontFamily: '"Merriweather", serif',
            fontStyle: 'italic',
            fontSize: '0.85rem',
            color: 'info.main',
          }}
        >
          {mock.city}
        </Typography>
      </Box>

      <Box
        sx={(theme) => ({
          mt: 1,
          pt: 1.5,
          borderTop: `1px solid ${theme.palette.common.black}`,
        })}
      >
        {statsBlock('sm')}
      </Box>

      <Box
        sx={(theme) => ({
          display: 'flex',
          justifyContent: 'flex-end',
          mt: 'auto',
          pt: 1.5,
          borderTop: `1px solid ${theme.palette.common.black}`,
        })}
      >
        {profileCta}
      </Box>
    </Box>
  );
});

export default FighterCard;
