import { Box, Chip, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import { countryRegistry } from '@/pages/countries/registry';
import { useTranslation } from '@/i18n';
import { useThemeMode } from '@/styles/theme';
import SiteCredit from '@/components/SiteCredit';

const CountryChipBar = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { mode, palette } = useThemeMode();

  return (
    <Box
      component="nav"
      aria-label={t('worldMap.availableCountriesAria')}
      sx={{
        flex: '0 0 auto',
        width: '100%',
        px: { xs: 2, md: 4 },
        py: 1.5,
        background: palette.surface,
        borderTop: `1px solid ${palette.border}`,
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        overflowX: 'auto',
        transition: 'background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease',
      }}
    >
      <Typography
        variant="body2"
        sx={{
          color: palette.textSecondary,
          fontWeight: 500,
          whiteSpace: 'nowrap',
          flexShrink: 0,
        }}
      >
        {t('worldMap.explorePrompt')}
      </Typography>

      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'nowrap' }}>
        {countryRegistry.map(({ slug, nameKey, accentColor }) => (
          <Chip
            key={slug}
            label={t(nameKey)}
            clickable
            onClick={() => navigate(`/${slug}`)}
            icon={
              <Box
                component="span"
                sx={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  background: accentColor ?? palette.textMuted,
                  ml: '8px !important',
                }}
              />
            }
            sx={{
              color: palette.chipText,
              background: palette.chipBg,
              border: `1px solid ${palette.border}`,
              fontWeight: 500,
              '&:hover': {
                background: palette.borderStrong,
              },
            }}
          />
        ))}
      </Box>

      <Box sx={{ marginLeft: 'auto', flexShrink: 0 }}>
        <SiteCredit tone={mode === 'dark' ? 'onDark' : 'onLight'} />
      </Box>
    </Box>
  );
};

export default CountryChipBar;
