import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';

import { useTranslation } from '@/i18n';
import type { Language } from '@/i18n';

const LanguageToggle = () => {
  const { language, setLanguage, t } = useTranslation();
  const { surfaces } = useTheme().palette;

  const handleChange = (_event: React.MouseEvent<HTMLElement>, next: Language | null) => {
    if (next) setLanguage(next);
  };

  return (
    <ToggleButtonGroup
      value={language}
      exclusive
      size="small"
      onChange={handleChange}
      aria-label={t('language.toggleAria')}
      sx={{
        background: surfaces.textPrimary,
        border: `2px solid ${surfaces.textPrimary}`,
        borderRadius: 0,
        boxShadow: `3px 3px 0 ${surfaces.textPrimary}`,
        transition: 'transform 120ms ease, box-shadow 120ms ease, background 120ms ease',
        '&:hover': {
          transform: 'translate(-1px, -1px)',
          boxShadow: `4px 4px 0 ${surfaces.textPrimary}`,
        },
        '& .MuiToggleButton-root + .MuiToggleButton-root': {
          borderLeft: `1px solid ${alpha(surfaces.page, 0.18)}`,
        },
        '& .MuiToggleButton-root': {
          color: alpha(surfaces.page, 0.55),
          fontFamily: '"Anton", sans-serif',
          fontSize: '0.95rem',
          letterSpacing: 2,
          border: 'none',
          borderRadius: 0,
          px: 1.75,
          py: 0.5,
          transition: 'background 120ms ease, color 120ms ease',
          '&:hover': {
            color: surfaces.page,
            background: alpha(surfaces.page, 0.08),
          },
          '&.Mui-selected': {
            color: surfaces.textPrimary,
            background: surfaces.page,
            '&:hover': { background: surfaces.page, color: surfaces.textPrimary },
          },
          '&:focus-visible': {
            outline: `2px solid ${surfaces.page}`,
            outlineOffset: 2,
          },
        },
      }}
    >
      <ToggleButton value="es" aria-label={t('language.toggle.es')}>
        ES
      </ToggleButton>
      <ToggleButton value="en" aria-label={t('language.toggle.en')}>
        EN
      </ToggleButton>
    </ToggleButtonGroup>
  );
};

export default LanguageToggle;
